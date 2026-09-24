// blogger-audit.mjs 로컬 검증: 블로거·네이버 API 를 흉내내서 판정·정리 로직만 돌려본다 (실제 발행 없음)
// 사용: node scripts/blogger-audit.test.mjs            (점검 모드)
//       TEST_ARGS=--fix node scripts/blogger-audit.test.mjs   (정리 모드, 상태파일은 실행 후 원복)
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync, copyFileSync, existsSync, unlinkSync } from "node:fs";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
process.env.GOOGLE_CLIENT_ID = "x"; process.env.GOOGLE_CLIENT_SECRET = "x"; process.env.GOOGLE_REFRESH_TOKEN = "x"; process.env.BLOGGER_BLOG_ID = "123";

const state = JSON.parse(readFileSync(join(ROOT, "scripts/blogger-state.json"), "utf8")).posted;
const entries = Object.entries(state).filter(([, v]) => v.bloggerUrl);
const footer = (n) => `<p>이 글은 한별시스템 홈페이지에도 있습니다: <a href="https://xn--bm3bm1i1e348cgwe.kr/blog/${n}/">x</a></p>`;
const img = (s) => `<div class="separator"><img src="${s}" /></div>`;
const body = "<p>" + "가나다라 ".repeat(40) + "</p>";
let id = 1000;
const posts = [];
// 정상 설치후기(상태파일 기록됨)
for (const [logNo, v] of entries.slice(0, 5)) posts.push({ id: String(id++), url: v.bloggerUrl, title: v.title, labels: ["설치후기"], published: "2026-07-01T00:00:00Z", content: body + img("https://ok.example/a.jpg") + footer(logNo) });
// 중복: 같은 logNo 로 두 번 올라간 글 (하나는 기록 안 됨)
const [dLog, dV] = entries[0];
posts.push({ id: String(id++), url: "https://hanbyeolsystem.blogspot.com/2026/07/dup.html", title: dV.title, labels: ["설치후기"], published: "2026-08-01T00:00:00Z", content: body + footer(dLog) });
// 중복: 제목만 같은 글 (푸터 없음)
posts.push({ id: String(id++), url: "https://hanbyeolsystem.blogspot.com/2026/07/dup2.html", title: entries[1][1].title + " ", labels: [], published: "2026-06-01T00:00:00Z", content: body });
// 기록 안 된 설치후기 (중복 아님)
posts.push({ id: String(id++), url: "https://hanbyeolsystem.blogspot.com/2026/07/unrec.html", title: "기록 안 된 글", labels: ["설치후기"], published: "2026-06-01T00:00:00Z", content: body + img("https://bad.example/x.jpg") + footer("224000000001") });
// 깨진 글: 본문 없음 + 사진 0장 + 라벨 없음
posts.push({ id: String(id++), url: "https://hanbyeolsystem.blogspot.com/2026/07/empty.html", title: "빈 글", labels: [], published: "2026-06-01T00:00:00Z", content: "<p><br /></p>" + footer("224000000002") });
// 뉴스 2편 같은 원문
posts.push({ id: String(id++), url: "https://hanbyeolsystem.blogspot.com/2026/09/n1.html", title: "[IT 새소식] 기사 A", labels: ["새소식", "nas"], published: "2026-09-01T00:00:00Z", content: img("https://ok.example/n.jpg") + body + `<p>👉 원문 보기: <a href="https://news.example/1" rel="nofollow">ZDNet — 기사 A</a></p>` });
posts.push({ id: String(id++), url: "https://hanbyeolsystem.blogspot.com/2026/09/n2.html", title: "[IT 새소식] 기사 A(재)", labels: ["새소식"], published: "2026-09-02T00:00:00Z", content: img("https://ok.example/n.jpg") + body + `<p>👉 원문 보기: <a href="https://news.example/1" rel="nofollow">ZDNet — 기사 A</a></p>` });
// 다른 도구로 올린 글(원본 없음) + blogfiles 사진 깨짐
posts.push({ id: String(id++), url: "https://hanbyeolsystem.blogspot.com/2026/08/other.html", title: "대구 복사기렌탈 — 함께 해결한 이야기 | 한별시스템", labels: ["설치후기"], published: "2026-08-10T00:00:00Z", content: body + img("https://blogfiles.pstatic.net/MjAy/abc.jpg") });
// 임시글
posts.push({ id: String(id++), url: "https://hanbyeolsystem.blogspot.com/2026/09/draft.html", title: "임시 글", labels: ["설치후기"], published: "2026-09-02T00:00:00Z", content: body + footer("224000000003"), _draft: true });

const calls = [];
globalThis.fetch = async (url, opts = {}) => {
  const u = String(url);
  const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json" } });
  if (u.includes("oauth2")) return json({ access_token: "t" });
  if (u.includes("/posts?")) {
    const st = new URL(u).searchParams.get("status");
    const items = posts.filter((p) => (st === "draft") === !!p._draft && st !== "scheduled");
    return json({ items });
  }
  if (/\/posts\/\d+$/.test(u)) { calls.push([opts.method, u.split("/").pop(), opts.body && JSON.parse(opts.body).labels]); return opts.method === "DELETE" ? new Response(null, { status: 204 }) : json({ id: "1", url: "u" }); }
  if (u.includes("m.blog.naver.com")) return new Response(`<div class="se-main-container"><p class="se-text-paragraph">${"다시 받은 본문 ".repeat(30)}</p><img class="se-image-resource" src="https://postfiles.pstatic.net/a.jpg?type=w80" /></div>`);
  if (u.startsWith("https://ok.example")) return new Response("x", { status: 206, headers: { "content-type": "image/jpeg" } });
  if (u.startsWith("https://blogfiles.pstatic.net")) return new Response("x", { status: 403 });
  if (u.startsWith("https://postfiles.pstatic.net")) return new Response("x", { status: 206, headers: { "content-type": "image/jpeg" } });
  if (u.startsWith("https://bad.example")) return new Response("nope", { status: 404 });
  throw new Error("unexpected fetch " + u);
};
const bak = join(ROOT, "scripts/blogger-state.json.bak");
copyFileSync(join(ROOT, "scripts/blogger-state.json"), bak);
process.argv.push(...(process.env.TEST_ARGS || "").split(" ").filter(Boolean));
try {
  await import(join(ROOT, "scripts/blogger-audit.mjs"));
} finally {
  console.log("\nAPI 쓰기 호출:", JSON.stringify(calls));
  if ((process.env.TEST_ARGS || "").includes("--fix")) {
    const after = JSON.parse(readFileSync(join(ROOT, "scripts/blogger-state.json"), "utf8")).posted;
    console.log("state 224000000001:", after["224000000001"], "| dup entry url:", after[dLog].bloggerUrl);
    copyFileSync(bak, join(ROOT, "scripts/blogger-state.json"));
  }
  unlinkSync(bak);
}
