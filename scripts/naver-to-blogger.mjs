// 네이버 블로그 → 구글 블로거(Blogger) 자동 크로스포스팅
//
// 동작: 네이버 RSS에서 새 글 감지 → m.blog.naver.com 에서 본문(글+사진) 추출
//       → 네이버 링크 없이 "본문 자체"를 Blogger API 로 발행 → 상태파일 갱신
//
// 사용:
//   node scripts/naver-to-blogger.mjs                 # 새 글만 발행
//   node scripts/naver-to-blogger.mjs --dry-run       # 발행 없이 추출 결과만 확인
//   node scripts/naver-to-blogger.mjs --backfill 5    # 최근 5건 강제 발행(중복 제외)
//   node scripts/naver-to-blogger.mjs --seed          # 현재 RSS 전부를 "발행된 것"으로 기록만
//
// 필요 환경변수 (dry-run/seed 제외):
//   GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN / BLOGGER_BLOG_ID

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const BLOG_ID_NAVER = "hanbyeolsystem";
const RSS_URL = `https://rss.blog.naver.com/${BLOG_ID_NAVER}.xml`;
const STATE_FILE = join(dirname(fileURLToPath(import.meta.url)), "blogger-state.json");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) hanbyeol-crosspost/1.0";
const MAX_PER_RUN = 5; // 한 번에 최대 발행 수 (스팸 방지)

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const SEED = args.includes("--seed");
const backfillIdx = args.indexOf("--backfill");
const BACKFILL = backfillIdx >= 0 ? parseInt(args[backfillIdx + 1] || "0", 10) : 0;

// ---------- RSS ----------
function cdata(xml, name) {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim() : "";
}

async function fetchRss() {
  const res = await fetch(RSS_URL, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`RSS HTTP ${res.status}`);
  const xml = await res.text();
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  return items
    .map((it) => {
      const guid = cdata(it, "guid") || cdata(it, "link").split("?")[0];
      const logNo = (guid.match(/(\d+)\s*$/) || [])[1];
      return {
        logNo,
        title: cdata(it, "title"),
        category: cdata(it, "category") || "소식",
        pubDate: cdata(it, "pubDate"),
      };
    })
    .filter((p) => p.logNo && p.title);
}

// ---------- 본문 추출 (SmartEditor ONE 모바일 뷰) ----------
function balancedDiv(html, startIdx) {
  // startIdx = "<div" 시작 위치. 여는/닫는 div 를 세어 컨테이너 전체를 반환
  let depth = 0;
  const re = /<\/?div\b[^>]*>/g;
  re.lastIndex = startIdx;
  let m;
  while ((m = re.exec(html))) {
    depth += m[0].startsWith("</") ? -1 : 1;
    if (depth === 0) return html.slice(startIdx, m.index + m[0].length);
  }
  return html.slice(startIdx);
}

function extractBody(pageHtml) {
  const at = pageHtml.search(/<div[^>]*class="[^"]*se-main-container/);
  if (at < 0) throw new Error("se-main-container not found");
  const container = balancedDiv(pageHtml, at);

  // 문단(<p class="se-text-paragraph">)과 이미지(<img class="se-image-resource">)를
  // 문서 순서대로 수집해 네이버 클래스 없는 깨끗한 HTML 로 재조립
  const parts = [];
  const re = /<p[^>]*class="[^"]*se-text-paragraph[^"]*"[^>]*>([\s\S]*?)<\/p>|<img\b[^>]*>/g;
  let m;
  while ((m = re.exec(container))) {
    if (m[0].startsWith("<p")) {
      const text = m[1]
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();
      if (text) {
        parts.push(
          `<p>${text.split("\n").map((l) => l.trim()).filter(Boolean).join("<br />")}</p>`
        );
      } else {
        parts.push("<p><br /></p>"); // 빈 문단 = 줄 간격 유지
      }
    } else {
      if (!/se-image-resource/.test(m[0])) continue; // 스티커/아이콘 등 제외
      const src =
        (m[0].match(/data-lazy-src="([^"]+)"/) || m[0].match(/\bsrc="([^"]+)"/) || [])[1];
      if (!src || !/pstatic\.net/.test(src)) continue;
      const full = src.replace(/\?type=[^&"]+/, "?type=w966"); // 큰 사이즈로
      parts.push(
        `<div class="separator" style="clear:both;text-align:center;margin:14px 0;">` +
          `<img src="${full}" style="max-width:100%;height:auto;" loading="lazy" /></div>`
      );
    }
  }
  // 연속 빈 문단 정리
  const html = parts.join("\n").replace(/(?:<p><br \/><\/p>\n?){3,}/g, "<p><br /></p>\n");
  const imgCount = (html.match(/<img /g) || []).length;
  const textLen = html.replace(/<[^>]+>/g, "").length;
  if (textLen < 100) throw new Error(`extracted text too short (${textLen})`);
  return { html, imgCount, textLen };
}

async function fetchPostBody(logNo) {
  const url = `https://m.blog.naver.com/PostView.naver?blogId=${BLOG_ID_NAVER}&logNo=${logNo}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`post HTTP ${res.status}`);
  return extractBody(await res.text());
}

// ---------- Blogger API ----------
async function getAccessToken() {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  const j = await res.json();
  if (!j.access_token) throw new Error(`token error: ${JSON.stringify(j)}`);
  return j.access_token;
}

async function publishToBlogger(token, { title, html, labels }) {
  const blogId = process.env.BLOGGER_BLOG_ID;
  const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "blogger#post", title, content: html, labels }),
  });
  const j = await res.json();
  if (!j.id) throw new Error(`publish error: ${JSON.stringify(j)}`);
  return j.url;
}

// ---------- main ----------
const state = existsSync(STATE_FILE)
  ? JSON.parse(readFileSync(STATE_FILE, "utf8"))
  : { posted: {} };

const rss = await fetchRss();
console.log(`RSS ${rss.length}건 확인`);

if (SEED) {
  for (const p of rss) state.posted[p.logNo] ||= { title: p.title, seededAt: new Date().toISOString() };
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n");
  console.log(`seed 완료: ${rss.length}건을 발행된 것으로 기록 (실제 발행 안 함)`);
} else {
  // 기본: 상태파일에 없는 새 글만. --backfill N: 최근 N건 중 "실제 발행 안 된 것"
  // (seed 로 기록만 된 글 포함, bloggerUrl 있는 진짜 발행글은 제외)
  let targets = BACKFILL > 0
    ? rss.slice(0, BACKFILL).filter((p) => !state.posted[p.logNo]?.bloggerUrl)
    : rss.filter((p) => !state.posted[p.logNo]);
  targets = targets.slice(0, Math.max(MAX_PER_RUN, BACKFILL)).reverse(); // 오래된 글부터

  if (targets.length === 0) {
    console.log("새 글 없음 — 종료");
  } else {
    console.log(`발행 대상 ${targets.length}건: ${targets.map((t) => t.logNo).join(", ")}`);
    const token = DRY ? null : await getAccessToken();
    let changed = false;

    for (const p of targets) {
      try {
        const body = await fetchPostBody(p.logNo);
        console.log(`- [${p.logNo}] "${p.title}" 텍스트 ${body.textLen}자, 이미지 ${body.imgCount}장`);
        if (DRY) {
          writeFileSync(join(dirname(STATE_FILE), `dryrun-${p.logNo}.html`), body.html);
          console.log(`  dry-run: scripts/dryrun-${p.logNo}.html 저장`);
          continue;
        }
        const url = await publishToBlogger(token, {
          title: p.title,
          html: body.html,
          labels: [p.category.replace(/\(.*?\)/g, "").trim()].filter(Boolean),
        });
        state.posted[p.logNo] = { title: p.title, bloggerUrl: url, postedAt: new Date().toISOString() };
        changed = true;
        console.log(`  발행 완료 → ${url}`);
        await new Promise((r) => setTimeout(r, 2000));
      } catch (e) {
        console.error(`  실패 [${p.logNo}]: ${e.message} — 다음 실행에서 재시도`);
        process.exitCode = 0; // 개별 실패는 다음 주기에 재시도 (워크플로 실패 처리 안 함)
      }
    }

    if (changed) writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n");
  }
}
