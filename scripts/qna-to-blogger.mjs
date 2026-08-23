// 사이트 Q&A(src/data/qna.ts) → 구글 블로거 발행 (카테고리별 1편, 총 4편)
//
// 사용:
//   node scripts/qna-to-blogger.mjs --dry-run   # 발행 없이 생성될 글 미리보기
//   node scripts/qna-to-blogger.mjs             # 발행 (이미 같은 제목이 있으면 건너뜀)
//
// 필요 환경변수: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN / BLOGGER_BLOG_ID
// GEO 목적: 각 질문에 한별시스템.kr Q&A 상세 페이지 링크를 걸어 색인·신뢰 신호를 만든다.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://xn--bm3bm1i1e348cgwe.kr";
const DRY = process.argv.includes("--dry-run");

// ---------- qna.ts 에서 데이터 추출 (단일 소스 유지) ----------
function loadQna() {
  const src = readFileSync(join(ROOT, "src/data/qna.ts"), "utf8");
  const grab = (name) => {
    const i = src.search(new RegExp(`export const ${name}\\s*[:=]`));
    if (i < 0) throw new Error(`${name} not found`);
    const start = src.indexOf("[", src.indexOf("=", i));
    let depth = 0;
    for (let j = start; j < src.length; j++) {
      if (src[j] === "[") depth++;
      else if (src[j] === "]") {
        depth--;
        if (depth === 0) return src.slice(start, j + 1);
      }
    }
    throw new Error(`${name} array not closed`);
  };
  const qna = new Function(`return ${grab("qna")}`)();
  return qna;
}

// ---------- 글 구성 ----------
// 네이버 데이터랩 검색량 기반 키워드를 제목에 반영 (렌탈·토너 교체·컴퓨터 수리·랜공사·나스)
// 문항이 많은 카테고리는 CHUNK 개수씩 나눠 (1부)(2부)... 로 발행
const CHUNK = 12;
const POSTS = [
  {
    cat: "nas",
    title: "나스(NAS) 자주 묻는 질문 — 도입·백업·랜섬웨어 대비 | 대구 한별시스템",
    intro:
      "나스(NAS) 도입을 고민하는 사무실에서 실제로 가장 많이 받는 질문들을 정리했습니다. " +
      "대구·경북에서 19년째 기업 전산을 관리하며 시놀로지 나스 50대 이상을 구축해 온 한별시스템이 그대로 답합니다.",
    labels: ["NAS", "나스", "데이터백업", "시놀로지", "Q&A"],
  },
  {
    cat: "printer",
    title: "복합기 렌탈·토너 교체·프린터 고장 Q&A | 대구 한별시스템",
    intro:
      "복합기 렌탈 계약 전 확인 사항부터 토너 교체, 인쇄 안 됨·스캔 오류 같은 고장 대처까지 — " +
      "복사기·프린터 300대 이상을 설치·관리 중인 한별시스템이 실제 고객 질문에 답합니다.",
    labels: ["복합기렌탈", "프린터렌탈", "토너교체", "Q&A"],
  },
  {
    cat: "pc",
    title: "컴퓨터 수리·렌탈 자주 묻는 질문 — 느려짐·고장·데이터 복구 | 대구 한별시스템",
    intro:
      "컴퓨터가 느려졌을 때, 부팅이 안 될 때, 데이터 복구가 필요할 때 — " +
      "대구 컴퓨터 수리·렌탈 19년, 170여 고객사의 전산을 관리하는 한별시스템이 답합니다.",
    labels: ["컴퓨터수리", "컴퓨터렌탈", "데이터복구", "Q&A"],
  },
  {
    cat: "network",
    title: "사무실 인터넷·와이파이·랜공사 Q&A — 느림·끊김 해결 | 대구 한별시스템",
    intro:
      "사무실 인터넷이 느리거나 끊길 때, 와이파이 설계, 랜공사(네트워크 공사) 준비까지 — " +
      "대구·경북 기업 네트워크를 시공·관리하는 한별시스템이 실무 기준으로 답합니다.",
    labels: ["사무실인터넷", "랜공사", "와이파이", "네트워크", "Q&A"],
  },
  {
    cat: "service",
    title: "전산 올인원 관리 Q&A — 전화 한 통으로 컴퓨터·복합기·나스·홈페이지까지 | 대구 한별시스템",
    intro:
      "컴퓨터·복합기 렌탈·나스(NAS)·네트워크·홈페이지 제작까지 한 업체가 책임지는 올인원 관리와, " +
      "자체 개발 도구(딸깍P드라이버·카운터 자동 수집)에 대한 질문을 정리했습니다. 전산은 전화 한 통 — 대구 한별시스템(053-588-7119)이 답합니다.",
    labels: ["전산관리", "올인원", "딸깍P드라이버", "방문견적", "Q&A"],
  },
];

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildHtml(post, items) {
  const qaHtml = items
    .map(
      (f) => `
<h3 style="margin-top:1.6em">Q. ${esc(f.q)}</h3>
<p><b>A.</b> ${esc(f.a)}</p>
${f.more ? `<p style="color:#555">${esc(f.more)}</p>` : ""}
<p style="font-size:0.9em"><a href="${SITE}/qna/${f.slug}/">→ 이 질문 자세히 보기 (한별시스템.kr)</a></p>`
    )
    .join("\n");

  return `<p>${esc(post.intro)}</p>
${qaHtml}
<hr>
<p><b>한별시스템</b> — 대구·경북 기업 IT 파트너 (NAS 구축 · 복사기 임대 · 전산 유지관리)<br>
📞 053-588-7119 (평일 09:00~18:00) · 대구·경북 당일 방문<br>
🔗 전체 Q&A 보기: <a href="${SITE}/qna/">한별시스템.kr/qna</a> ·
궁금한 점은 <a href="${SITE}/community/">커뮤니티</a>에 질문을 남겨 주세요.</p>`;
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

async function listAllPosts(token) {
  const blogId = process.env.BLOGGER_BLOG_ID;
  const items = [];
  let pageToken = "";
  do {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?maxResults=100&fetchBodies=false${pageToken ? `&pageToken=${pageToken}` : ""}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`list error: HTTP ${res.status} ${await res.text()}`);
    const j = await res.json();
    items.push(...(j.items || []));
    pageToken = j.nextPageToken || "";
  } while (pageToken);
  return items; // {id,title,published,...}
}

async function updatePost(token, postId, { title, html, labels }) {
  const blogId = process.env.BLOGGER_BLOG_ID;
  const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${postId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "blogger#post", id: postId, title, content: html, labels }),
  });
  const j = await res.json();
  if (!j.id) throw new Error(`update error: ${JSON.stringify(j)}`);
  return j.url;
}

async function deletePost(token, postId) {
  const blogId = process.env.BLOGGER_BLOG_ID;
  const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${postId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok && res.status !== 204) throw new Error(`delete error: HTTP ${res.status}`);
}

// 초기(1차) 발행분 — 현행 시리즈와 내용이 중복되어 정리 대상
const OBSOLETE_TITLES = [
  "NAS 자주 묻는 질문 총정리 — 나스가 뭔가요부터 랜섬웨어 대비까지 (대구 한별시스템)",
  "복사기·프린터 임대 전 꼭 확인할 것들 — 임대료·토너·수리 Q&A (대구 한별시스템)",
  "사무실 컴퓨터 관리 Q&A — 임대·업그레이드·전산 유지관리 (대구 한별시스템)",
  "방문 견적은 무료인가요? — 한별시스템 방문 서비스 Q&A",
];

async function publish(token, { title, html, labels }) {
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
const qna = loadQna();
console.log(`qna.ts 에서 ${qna.length}문항 로드`);

function chunkedPosts() {
  const out = [];
  for (const p of POSTS) {
    const items = qna.filter((f) => f.cat === p.cat);
    const parts = [];
    for (let i = 0; i < items.length; i += CHUNK) parts.push(items.slice(i, i + CHUNK));
    parts.forEach((chunk, idx) => {
      const suffix = parts.length > 1 ? ` (${idx + 1}부)` : "";
      out.push({ ...p, title: p.title.replace(" |", `${suffix} |`), items: chunk });
    });
  }
  return out;
}

const allPosts = chunkedPosts();

if (DRY) {
  for (const p of allPosts) {
    console.log(`=== [${p.cat}] ${p.title} (${p.items.length}문항) ===`);
  }
  process.exit(0);
}

async function withBackoff(label, fn) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      return await fn();
    } catch (e) {
      if (String(e).includes("429") || String(e).includes("RESOURCE_EXHAUSTED")) {
        const wait = 90 * attempt;
        console.log(`429 속도제한 — ${wait}초 대기 후 재시도 (${attempt}/4): ${label}`);
        await new Promise((r) => setTimeout(r, wait * 1000));
      } else throw e;
    }
  }
  return null;
}

const token = await getAccessToken();
const all = await withBackoff("글 목록 조회", () => listAllPosts(token));
if (!all) throw new Error("글 목록 조회 실패 — 중단 (중복 발행 방지)");
console.log(`기존 글 ${all.length}건 확인`);

// 제목별 그룹: 최신본만 남긴다
const byTitle = new Map();
for (const x of all) {
  const arr = byTitle.get(x.title) || [];
  arr.push(x);
  byTitle.set(x.title, arr);
}

const currentTitles = new Set(allPosts.map((p) => p.title));
const toDelete = [];
for (const [title, arr] of byTitle) {
  if (OBSOLETE_TITLES.includes(title)) { toDelete.push(...arr); continue; }
  if (arr.length > 1) {
    arr.sort((a, b) => (b.published || "").localeCompare(a.published || ""));
    toDelete.push(...arr.slice(1)); // 최신 1건 제외 전부 정리
  }
}
for (const x of toDelete) {
  const ok = await withBackoff(`삭제: ${x.title}`, async () => { await deletePost(token, x.id); return true; });
  console.log(ok ? `삭제됨: ${x.title}` : `삭제 포기: ${x.title}`);
  await new Promise((r) => setTimeout(r, 8_000));
}

// 현행 시리즈: 있으면 내용 갱신, 없으면 신규 발행
for (const p of allPosts) {
  const html = buildHtml(p, p.items);
  const arr = (byTitle.get(p.title) || []).filter((x) => !toDelete.includes(x));
  const id = arr[0]?.id;
  const url = await withBackoff(p.title, () =>
    id ? updatePost(token, id, { title: p.title, html, labels: p.labels })
       : publish(token, { title: p.title, html, labels: p.labels })
  );
  if (url) console.log(`${id ? "갱신됨" : "발행됨"}: ${url}`);
  else { console.log(`포기(다음 실행 때 재시도): ${p.title}`); break; }
  await new Promise((r) => setTimeout(r, 15_000));
}
console.log("완료");
