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
const POSTS = [
  {
    cat: "nas",
    title: "NAS 자주 묻는 질문 총정리 — 나스가 뭔가요부터 랜섬웨어 대비까지 (대구 한별시스템)",
    intro:
      "NAS(나스) 도입을 고민하는 사무실에서 실제로 가장 많이 받는 질문들을 한 편에 정리했습니다. " +
      "대구·경북에서 19년째 기업 전산을 관리하며 NAS 50대 이상을 구축해 온 한별시스템이 그대로 답합니다.",
    labels: ["NAS", "데이터백업", "Q&A"],
  },
  {
    cat: "printer",
    title: "복사기·프린터 임대 전 꼭 확인할 것들 — 임대료·토너·수리 Q&A (대구 한별시스템)",
    intro:
      "복합기 임대 계약 전 확인 사항, 임대료 산정 기준, 토너·수리 부담까지 — " +
      "복사기 300대 이상을 설치·관리 중인 한별시스템이 실제 고객 질문에 답합니다.",
    labels: ["복사기임대", "프린터", "Q&A"],
  },
  {
    cat: "pc",
    title: "사무실 컴퓨터 관리 Q&A — 임대·업그레이드·전산 유지관리 (대구 한별시스템)",
    intro:
      "컴퓨터 임대가 되는지, 느려진 PC는 바꿔야 하는지, 전산 유지관리 계약은 뭘 해주는지 — " +
      "대구·경북 170여 고객사의 전산을 관리하는 한별시스템이 답합니다.",
    labels: ["컴퓨터", "전산관리", "Q&A"],
  },
  {
    cat: "service",
    title: "방문 견적은 무료인가요? — 한별시스템 방문 서비스 Q&A",
    intro:
      "한별시스템은 전화로 대략 요금을 부르는 대신, 직접 방문해 현장을 보고 무료로 견적을 냅니다. " +
      "방문 지역, 설치 후 사용 교육, 통합 관리에 대한 질문을 정리했습니다.",
    labels: ["방문견적", "서비스", "Q&A"],
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

async function existingTitles(token) {
  const blogId = process.env.BLOGGER_BLOG_ID;
  const res = await fetch(
    `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?maxResults=100&fields=items(title)`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const j = await res.json();
  return new Set((j.items || []).map((x) => x.title));
}

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

if (DRY) {
  for (const p of POSTS) {
    const items = qna.filter((f) => f.cat === p.cat);
    console.log(`\n=== [${p.cat}] ${p.title} (${items.length}문항) ===`);
    console.log(buildHtml(p, items).slice(0, 500) + " ...");
  }
  process.exit(0);
}

const token = await getAccessToken();
const seen = await existingTitles(token);

for (const p of POSTS) {
  if (seen.has(p.title)) {
    console.log(`건너뜀(이미 존재): ${p.title}`);
    continue;
  }
  const items = qna.filter((f) => f.cat === p.cat);
  const url = await publish(token, { title: p.title, html: buildHtml(p, items), labels: p.labels });
  console.log(`발행됨: ${url}`);
  await new Promise((r) => setTimeout(r, 2000));
}
console.log("완료");
