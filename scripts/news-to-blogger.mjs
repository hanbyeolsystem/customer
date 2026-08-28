// IT 새소식 자동 발행 — 국내 IT/보안 RSS에서 관련 기사를 골라 요약+코멘트+사진과 함께 블로그에 올린다
// 사용: node scripts/news-to-blogger.mjs [--dry-run]
// 매일 아침 GitHub Actions(cron)로 실행. 원문 전문 복사 없이 짧은 요약+자체 코멘트+출처 링크만 사용.
import { getAccessToken, listAllPosts, publishPost, updatePost, withBackoff, sleep } from "./blogger-lib.mjs";

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DRY = process.argv.includes("--dry-run");
const IMG = "https://xn--bm3bm1i1e348cgwe.kr/blog-assets";
const SITE = "https://xn--bm3bm1i1e348cgwe.kr";

// 원문 기사의 대표 사진(og:image / twitter:image). 없으면 "" → 주제 기본 사진으로 폴백
async function ogImage(link) {
  try {
    const res = await fetch(link, { headers: { "User-Agent": "Mozilla/5.0 hanbyeol-news/1.0" }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return "";
    const html = (await res.text()).slice(0, 200000);
    const m = html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i)
           || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["']/i);
    const u = m ? m[1].replace(/&amp;/g, "&").trim() : "";
    return /^https?:\/\//.test(u) ? u : "";
  } catch { return ""; }
}

// --max N (기본 1: 매일 1건), --per-topic N (기본 1) — 백필 시 크게 지정
function argNum(name, def) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? parseInt(process.argv[i + 1] || `${def}`, 10) : def;
}
const MAX_POSTS_PER_RUN = argNum("--max", 1);
const PER_TOPIC = argNum("--per-topic", 1);
const NEWS_JSON = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "data", "news.json");

const FEEDS = [
  { name: "ZDNet Korea", url: "https://feeds.feedburner.com/zdkorea" },
  { name: "전자신문", url: "https://rss.etnews.com/Section901.xml" },
];

// 우리 고객과 관련 있는 주제만
const TOPICS = [
  { key: "security", words: ["랜섬웨어", "해킹", "보안", "피싱", "유출", "취약점", "백업"], img: "news-security-01.jpg",
    comment: "보안 사고는 늘 '우리는 아니겠지' 하는 사무실에서 납니다. 백업과 기본 설정 점검, 미루지 마세요." },
  { key: "windows", words: ["윈도우", "Windows", "마이크로소프트", "MS", "PC", "인텔", "CPU"], img: "news-windows-01.jpg",
    comment: "업무 PC에 영향을 주는 변화는 미리 알아두면 대응이 쉽습니다. 우리 사무실에 해당하는지 궁금하면 전화 주세요." },
  { key: "printer", words: ["프린터", "복합기", "사무기기", "토너"], img: "printer-real-01.jpg",
    comment: "복합기·프린터 소식입니다. 렌탈 고객은 해당 사항이 있으면 저희가 먼저 챙겨 드립니다." },
  { key: "nas", words: ["NAS", "나스", "스토리지", "시놀로지", "클라우드", "데이터"], img: "nas-real-01.jpg",
    comment: "회사 데이터 보관에 관한 소식입니다. 우리 회사 백업 상태가 궁금해지셨다면 무료 점검부터 받아 보세요." },
  { key: "ai", words: ["AI", "인공지능", "챗GPT", "생성형"], img: "news-ai-01.jpg",
    comment: "AI 소식은 많지만 실무에 쓸 수 있는 것은 일부입니다. 사무실에 적용할 만한 것만 골라 소개해 드립니다." },
  { key: "network", words: ["네트워크", "인터넷", "와이파이", "5G", "통신"], img: "network-01.jpg",
    comment: "사무실 네트워크와 닿아 있는 소식입니다. 인터넷이 느리다면 회선 탓만은 아닐 수 있습니다." },
];

function pick(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim() : "";
}
function stripTags(s) {
  return s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
}

async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, { headers: { "User-Agent": "Mozilla/5.0 hanbyeol-news/1.0" }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const items = (xml.match(/<item>[\s\S]*?<\/item>/g) || []).slice(0, 20).map((it) => ({
      source: feed.name,
      title: stripTags(pick(it, "title")),
      link: stripTags(pick(it, "link")),
      desc: stripTags(pick(it, "description")).slice(0, 400),
      pubDate: pick(it, "pubDate"),
    })).filter((x) => x.title && x.link);
    console.log(`${feed.name}: ${items.length}건`);
    return items;
  } catch (e) {
    console.log(`${feed.name} 실패: ${String(e).slice(0, 80)}`);
    return [];
  }
}

function hasWord(text, w) {
  // 영문 약어는 단어 경계로(오탐 방지: KAIST의 AI 등), 한글은 포함으로
  if (/^[A-Za-z0-9]+$/.test(w)) return new RegExp(`(^|[^A-Za-z0-9])${w}([^A-Za-z0-9]|$)`, "i").test(text);
  return text.includes(w);
}
function matchTopic(item) {
  // 제목 일치를 우선, 없으면 본문 요약 일치
  for (const t of TOPICS) if (t.words.some((w) => hasWord(item.title, w))) return t;
  for (const t of TOPICS) if (t.words.some((w) => hasWord(item.desc, w))) return t;
  return null;
}

function buildHtml(item, topic, img = "") {
  const kst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
  return `<div class="separator" style="clear:both;text-align:center;"><img src="${img || `${IMG}/${topic.img}`}" alt="${item.title}" style="max-width:100%;height:auto;border-radius:8px;" /></div>
<p><b>오늘의 소식 (${kst})</b></p>
<p>${item.desc ? item.desc.slice(0, 250) + (item.desc.length > 250 ? "…" : "") : item.title}</p>
<p>👉 원문 보기: <a href="${item.link}" rel="nofollow">${item.source} — ${item.title}</a></p>
<p><b>한별의 한 줄</b> — ${topic.comment}</p>
<hr>
<p><b>한별시스템</b> — 전산 올인원 관리 · 📞 053-588-7119 · <i>전산은 전화 한 통</i><br>
🔗 <a href="${SITE}/qna/">전산 궁금증 모음</a> · <a href="${SITE}/community/">커뮤니티에 질문하기</a></p>`;
}

// ---------- sync 모드: 블로거의 새소식 글에서 news.json 재구성 ----------
if (process.argv.includes("--sync")) {
  const token = await getAccessToken();
  const blogId = process.env.BLOGGER_BLOG_ID;
  const items = [];
  let pageToken = "";
  do {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?maxResults=50${pageToken ? `&pageToken=${pageToken}` : ""}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`list HTTP ${res.status}`);
    const j = await res.json();
    items.push(...(j.items || []));
    pageToken = j.nextPageToken || "";
  } while (pageToken);
  const news = [];
  for (const p of items) {
    if (!p.title.startsWith("[IT 새소식] ")) continue;
    const c = p.content || "";
    const first = (c.match(/<img[^>]+src="([^"]+)"/) || [])[1] || "";
    const img = first.includes("/blog-assets/") ? first.split("/blog-assets/")[1] : (first || "news-tech-01.jpg");
    const link = (c.match(/원문 보기: <a href="([^"]+)"/) || [])[1] || "";
    const srcTitle = (c.match(/rel="nofollow">([^<]+)<\/a>/) || [])[1] || "";
    const source = srcTitle.split(" — ")[0] || "";
    const desc = (c.match(/<p>([^<]{30,400})<\/p>/) || [])[1] || "";
    const comment = (c.match(/한별의 한 줄<\/b> — ([^<]+)</) || [])[1] || "";
    const topic = (p.labels || []).find((l) => l !== "새소식") || "tech";
    news.push({
      date: (p.published || "").slice(0, 10), topic, img, source,
      title: p.title.replace("[IT 새소식] ", ""), link, desc: desc.trim(), comment: comment.trim(), blogger: p.url,
    });
  }
  news.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  writeFileSync(NEWS_JSON, JSON.stringify(news, null, 2), "utf8");
  console.log(`sync 완료: news.json ${news.length}건`);
  process.exit(0);
}

// ---------- fix-images 모드: 기존 새소식 글의 주제 기본 사진을 원문 og:image 로 교체 ----------
if (process.argv.includes("--fix-images")) {
  const token = await getAccessToken();
  const blogId = process.env.BLOGGER_BLOG_ID;
  let pageToken = "", fixed = 0;
  do {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?maxResults=50${pageToken ? `&pageToken=${pageToken}` : ""}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`list HTTP ${res.status}`);
    const j = await res.json();
    for (const p of j.items || []) {
      if (!p.title.startsWith("[IT 새소식] ")) continue;
      const c = p.content || "";
      if (!/<img[^>]+src="[^"]*\/blog-assets\/[^"]*"/.test(c)) continue; // 이미 원문 사진
      const link = (c.match(/원문 보기: <a href="([^"]+)"/) || [])[1] || "";
      const og = link ? await ogImage(link) : "";
      if (!og) { console.log(`원문 사진 없음: ${p.title}`); continue; }
      const html = c.replace(/(<img[^>]+src=")[^"]*\/blog-assets\/[^"]*(")/, `$1${og}$2`);
      await withBackoff(p.title, () => updatePost(token, p.id, { title: p.title, html, labels: p.labels || [] }));
      fixed++; console.log(`교체: ${p.title}`);
      await sleep(3000);
    }
    pageToken = j.nextPageToken || "";
  } while (pageToken);
  console.log(`fix-images 완료: ${fixed}건`);
  process.exit(0);
}

// ---------- main ----------
const feedItems = (await Promise.all(FEEDS.map(fetchFeed))).flat();
const candidates = feedItems.map((x) => ({ ...x, topic: matchTopic(x) })).filter((x) => x.topic);
console.log(`주제 일치 기사 ${candidates.length}건`);

if (DRY) {
  for (const c of candidates.slice(0, 6)) console.log(`- [${c.topic.key}] (${c.source}) ${c.title}`);
  process.exit(0);
}

const token = await getAccessToken();
const all = await withBackoff("목록 조회", () => listAllPosts(token));
if (!all) throw new Error("목록 조회 실패 — 중단");
const existing = new Set(all.map((x) => x.title));

const newsJson = existsSync(NEWS_JSON) ? JSON.parse(readFileSync(NEWS_JSON, "utf8")) : [];
const jsonTitles = new Set(newsJson.map((x) => x.title));

let posted = 0;
const topicCount = new Map();
const kstToday = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
for (const c of candidates) {
  if (posted >= MAX_POSTS_PER_RUN) break;
  if ((topicCount.get(c.topic.key) || 0) >= PER_TOPIC) continue;
  const title = `[IT 새소식] ${c.title}`;
  if (existing.has(title) || jsonTitles.has(c.title)) continue; // 이미 올린 기사
  const og = await ogImage(c.link); // 원문 대표 사진을 메인 사진으로
  const url = await withBackoff(title, () =>
    publishPost(token, { title, html: buildHtml(c, c.topic, og), labels: ["새소식", c.topic.key] })
  );
  if (!url) break;
  console.log(`발행됨: ${url}`);
  // 홈페이지(/news) 데이터에도 기록 — 커밋되면 사이트가 자동 재빌드됨
  newsJson.unshift({
    date: kstToday, topic: c.topic.key, img: og || c.topic.img, source: c.source,
    title: c.title, link: c.link, desc: c.desc.slice(0, 250), comment: c.topic.comment, blogger: url,
  });
  posted++;
  topicCount.set(c.topic.key, (topicCount.get(c.topic.key) || 0) + 1);
  await sleep(15000);
}
if (posted > 0) {
  writeFileSync(NEWS_JSON, JSON.stringify(newsJson.slice(0, 200), null, 2), "utf8");
  console.log(`news.json 갱신 (${newsJson.length}건)`);
}
console.log(posted === 0 ? "오늘 올릴 새 기사 없음" : `완료: ${posted}건`);
