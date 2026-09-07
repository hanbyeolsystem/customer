// 구글 블로거(hanbyeolsystem.blogspot.com) 점검·정리
//
// 블로거에 올라간 글 전체(공개·임시·예약)를 받아
//   1) 중복 글  : 같은 네이버 원본(logNo) · 같은 뉴스 원문 링크 · 같은 제목 → 1편만 남기고 삭제
//   2) 깨진 글  : 본문 없음 · 깨진 HTML · 사진 링크 죽음(HTTP 오류) · 사진 0장 · 사이트 링크 누락 · 라벨 없음
//   3) 상태파일(blogger-state.json) 과 실제 블로거의 불일치(기록 없는 발행글, 사라진 글)
// 를 찾아 보고서로 만들고, --fix 이면 실제로 고친다.
//
// 사용:
//   node scripts/blogger-audit.mjs            # 점검만. scripts/blogger-audit-report.json + 요약 출력
//   node scripts/blogger-audit.mjs --fix      # 중복 삭제 · 깨진 설치후기 글은 네이버에서 다시 받아 갱신 · 상태파일 정리
//   node scripts/blogger-audit.mjs --no-img   # 사진 링크 확인 생략(빠른 점검)
//
// 필요 환경변수: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN / BLOGGER_BLOG_ID
// GitHub Actions: .github/workflows/blogger-audit.yml (mode = report | fix)

import { readFileSync, writeFileSync, existsSync, appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { getAccessToken, updatePost, deletePost, withBackoff, sleep } from "./blogger-lib.mjs";
import { fetchPostBody, siteFooter, footerLogNo, fixPstaticUrl } from "./naver-body.mjs";
import { COLUMNS } from "./blog-columns-data.mjs";

const DIR = dirname(fileURLToPath(import.meta.url));
const STATE_FILE = join(DIR, "blogger-state.json");
const REPORT_FILE = join(DIR, "blogger-audit-report.json");
const NEWS_JSON = join(DIR, "..", "src", "data", "news.json");
const NAVER_JSON = join(DIR, "..", "src", "data", "naver-posts.json");

const FIX = process.argv.includes("--fix");
const CHECK_IMG = !process.argv.includes("--no-img");
const BLOG_ID = process.env.BLOGGER_BLOG_ID;
const BLOG_ORIGIN = "https://hanbyeolsystem.blogspot.com";
const NEWS_PREFIX = "[IT 새소식] ";
const WRITE_GAP_MS = 4000; // 블로거 API 쓰기 간격(속도제한 회피)

// ---------- 목록 (본문 포함, 공개·임시·예약 전부) ----------
async function listPostsWithBodies(token) {
  const items = [];
  for (const status of ["live", "draft", "scheduled"]) {
    let pageToken = "";
    do {
      const qs = new URLSearchParams({ maxResults: "100", fetchBodies: "true", fetchImages: "true", view: "ADMIN", status });
      if (pageToken) qs.set("pageToken", pageToken);
      const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts?${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`list(${status}) HTTP ${res.status} ${await res.text()}`);
      const j = await res.json();
      for (const p of j.items || []) items.push({ ...p, _status: status });
      pageToken = j.nextPageToken || "";
    } while (pageToken);
  }
  return items;
}

// ---------- 도우미 ----------
const stripTags = (html) =>
  String(html || "")
    .replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normTitle = (t) =>
  String(t || "")
    .normalize("NFC")
    .replace(/[—–]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/[\s.!?…·,\-]+$/g, "")
    .trim()
    .toLowerCase();

const imgSrcs = (html) => [...String(html || "").matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)].map((m) => m[1].replace(/&amp;/g, "&"));

function classify(p) {
  const title = p.title || "";
  const labels = p.labels || [];
  // 원본 logNo: 푸터 링크 > 네이버 글 제목과 정확히 같은 경우(푸터가 붙기 전에 올라간 옛 크로스포스트)
  const logNo = footerLogNo(p.content) || naverByTitle.get(normTitle(title)) || null;
  if (title.startsWith(NEWS_PREFIX) || labels.includes("새소식")) return { kind: "news", key: null };
  if (logNo) return { kind: "review", key: `naver:${logNo}`, logNo, footer: !!footerLogNo(p.content) };
  if (labels.includes("설치후기")) return { kind: "review", key: null };
  if (COLUMN_TITLES.has(normTitle(title)) || labels.includes("Q&A")) return { kind: "column", key: null };
  return { kind: "other", key: null };
}
const COLUMN_TITLES = new Set(COLUMNS.map((c) => normTitle(c.title)));

// 사진 링크 생존 확인 (Range 로 1바이트만). 블로거 화면과 같은 referer 로 요청
const imgCache = new Map();
async function checkImage(src) {
  if (imgCache.has(src)) return imgCache.get(src);
  let result;
  try {
    const res = await fetch(src, {
      headers: { Range: "bytes=0-0", Referer: `${BLOG_ORIGIN}/`, "User-Agent": "Mozilla/5.0 hanbyeol-audit/1.0" },
      signal: AbortSignal.timeout(20000),
      redirect: "follow",
    });
    const ct = res.headers.get("content-type") || "";
    result = res.ok || res.status === 206
      ? /^image\//i.test(ct) ? null : `content-type ${ct || "없음"}`
      : `HTTP ${res.status}`;
  } catch (e) {
    result = `요청 실패 ${String(e.message || e).slice(0, 60)}`;
  }
  imgCache.set(src, result);
  return result;
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx], idx);
      }
    })
  );
  return out;
}

// ---------- 시작 ----------
const state = existsSync(STATE_FILE) ? JSON.parse(readFileSync(STATE_FILE, "utf8")) : { posted: {} };
state.posted ||= {};
const stateByUrl = new Map(Object.entries(state.posted).filter(([, v]) => v.bloggerUrl).map(([logNo, v]) => [v.bloggerUrl, logNo]));
const newsJson = existsSync(NEWS_JSON) ? JSON.parse(readFileSync(NEWS_JSON, "utf8")) : [];
const newsUrls = new Set(newsJson.map((n) => n.blogger).filter(Boolean));
const naverPosts = existsSync(NAVER_JSON) ? JSON.parse(readFileSync(NAVER_JSON, "utf8")) : [];
const naverImgCount = new Map(naverPosts.map((p) => [String(p.logNo), Number(p.images) || 0]));
// 제목 → logNo (같은 제목이 둘이면 신뢰하지 않음)
const naverByTitle = new Map();
for (const p of naverPosts) {
  const k = normTitle(p.title);
  naverByTitle.set(k, naverByTitle.has(k) ? null : String(p.logNo));
}

const token = await getAccessToken();
const posts = await listPostsWithBodies(token);
console.log(`블로거 글 ${posts.length}건 (공개 ${posts.filter((p) => p._status === "live").length} · 임시 ${posts.filter((p) => p._status === "draft").length} · 예약 ${posts.filter((p) => p._status === "scheduled").length})`);

for (const p of posts) {
  Object.assign(p, classify(p));
  p._text = stripTags(p.content);
  p._imgs = imgSrcs(p.content);
  p._recorded = stateByUrl.has(p.url) || newsUrls.has(p.url);
}

// ---------- 1) 중복 ----------
// 같은 원본 키(naver logNo / 뉴스 원문 링크) 또는 같은 제목이면 한 묶음. 묶음마다 1편만 남긴다.
const parent = new Map();
const find = (x) => (parent.get(x) === x ? x : (parent.set(x, find(parent.get(x))), parent.get(x)));
const union = (a, b) => parent.set(find(a), find(b));
for (const p of posts) parent.set(p.id, p.id);
const byKey = new Map();
const link = (k, p) => {
  if (!k) return;
  if (byKey.has(k)) union(p.id, byKey.get(k));
  else byKey.set(k, p.id);
};
for (const p of posts) {
  link(p.key, p);
  link(`title:${normTitle(p.title)}`, p);
  if (p.kind === "news") {
    const src = (p.content.match(/원문 보기: <a href="([^"]+)"/) || [])[1];
    link(src ? `news:${src}` : null, p);
  }
}
const groups = new Map();
for (const p of posts) {
  const r = find(p.id);
  if (!groups.has(r)) groups.set(r, []);
  groups.get(r).push(p);
}
// 남길 글: 상태파일·news.json 에 기록된 것 > 공개 상태 > 본문이 긴 것 > 먼저 발행된 것
const keeperRank = (p) => [p._recorded ? 1 : 0, p._status === "live" ? 1 : 0, p._text.length, -new Date(p.published).getTime()];
const cmp = (a, b) => {
  const ra = keeperRank(a), rb = keeperRank(b);
  for (let i = 0; i < ra.length; i++) if (ra[i] !== rb[i]) return rb[i] - ra[i];
  return 0;
};
const duplicates = [];
for (const g of groups.values()) {
  if (g.length < 2) continue;
  g.sort(cmp);
  const [keep, ...drop] = g;
  duplicates.push({ keep: { id: keep.id, url: keep.url, title: keep.title, published: keep.published }, drop: drop.map((d) => ({ id: d.id, url: d.url, title: d.title, published: d.published, status: d._status })) });
}
const dropIds = new Set(duplicates.flatMap((d) => d.drop.map((x) => x.id)));

// ---------- 2) 깨진 글 ----------
const broken = [];
const imgChecks = CHECK_IMG ? [...new Set(posts.filter((p) => !dropIds.has(p.id)).flatMap((p) => p._imgs))] : [];
if (imgChecks.length) {
  console.log(`사진 링크 ${imgChecks.length}개 확인 중...`);
  await mapLimit(imgChecks, 6, (src) => checkImage(src));
}
for (const p of posts) {
  if (dropIds.has(p.id)) continue; // 지울 글은 안 본다
  const problems = [];
  if (p._text.length < 100) problems.push({ code: "empty", msg: `본문 ${p._text.length}자` });
  if (/\bundefined\b|\[object Object\]|&lt;(p|div|img)\b/.test(p.content)) problems.push({ code: "html", msg: "깨진 HTML(undefined · 이스케이프된 태그)" });
  const badImgs = CHECK_IMG ? p._imgs.map((s) => [s, imgCache.get(s)]).filter(([, r]) => r) : [];
  if (badImgs.length) problems.push({ code: "img", msg: `사진 ${badImgs.length}/${p._imgs.length}장 깨짐`, imgs: badImgs.map(([s, r]) => `${r} ${s.slice(0, 90)}`), raw: badImgs });
  if (p._imgs.some((s) => /^http:\/\//i.test(s))) problems.push({ code: "mixed", msg: "http:// 사진(혼합 콘텐츠)" });
  if (p.kind === "review") {
    if (p.logNo && !p.footer) problems.push({ code: "footer", msg: `한별시스템.kr 원문 링크(푸터) 없음 (네이버 ${p.logNo})` });
    if (!p.logNo) problems.push({ code: "nosrc", msg: "네이버 원본을 못 찾음(다른 도구로 올린 글로 보임) - 손대지 않음" });
    const expect = p.logNo ? naverImgCount.get(p.logNo) : undefined;
    if (p.logNo && p._imgs.length === 0 && (expect === undefined || expect > 0)) problems.push({ code: "noimg", msg: `사진 0장(네이버 원본 ${expect ?? "?"}장)` });
  }
  if (p.kind === "news" && !/원문 보기: <a href="https?:\/\//.test(p.content)) problems.push({ code: "newslink", msg: "뉴스 원문 링크 없음" });
  if (!(p.labels || []).length) problems.push({ code: "label", msg: "라벨 없음" });
  if (p._status !== "live") problems.push({ code: "status", msg: `공개 안 됨(${p._status})` });
  if (problems.length) broken.push({ id: p.id, url: p.url, title: p.title, kind: p.kind, logNo: p.logNo || null, status: p._status, published: p.published, labels: p.labels || [], problems, _content: p.content });
}

// 깨진 네이버 사진은 postfiles 호스트로 바꾸면 열리는지 확인해 둔다(보고서에도 "복구 가능" 으로 표시)
const repairable = new Map(); // 깨진 src → 살아있는 대체 src
if (CHECK_IMG) {
  const cands = [...new Set(broken.flatMap((b) => (b.problems.find((p) => p.code === "img")?.raw || []).map(([s]) => s)))]
    .filter((s) => /pstatic\.net/.test(s) && fixPstaticUrl(s) !== s);
  await mapLimit(cands, 6, async (s) => { if (!(await checkImage(fixPstaticUrl(s)))) repairable.set(s, fixPstaticUrl(s)); });
  for (const b of broken) {
    const pr = b.problems.find((p) => p.code === "img");
    if (!pr) continue;
    const n = pr.raw.filter(([s]) => repairable.has(s)).length;
    if (n) pr.msg += ` - 그중 ${n}장은 주소 교체로 복구 가능`;
  }
}

// ---------- 3) 상태파일 불일치 ----------
const liveUrls = new Set(posts.filter((p) => !dropIds.has(p.id)).map((p) => p.url));
const unrecorded = posts.filter((p) => p.kind === "review" && p.logNo && !dropIds.has(p.id) && state.posted[p.logNo]?.bloggerUrl !== p.url)
  .map((p) => ({ logNo: p.logNo, url: p.url, title: p.title, stateUrl: state.posted[p.logNo]?.bloggerUrl || null }));
const missing = Object.entries(state.posted)
  .filter(([, v]) => v.bloggerUrl && !liveUrls.has(v.bloggerUrl) && !posts.some((p) => p.url === v.bloggerUrl))
  .map(([logNo, v]) => ({ logNo, title: v.title, url: v.bloggerUrl }));

// ---------- 보고서 ----------
const report = {
  checkedAt: new Date().toISOString(),
  mode: FIX ? "fix" : "report",
  total: posts.length,
  byKind: Object.fromEntries(["review", "news", "column", "other"].map((k) => [k, posts.filter((p) => p.kind === k).length])),
  duplicates,
  broken,
  unrecorded,
  missing,
  fixes: [],
};

const lines = [];
lines.push(`## 블로거 점검 결과 (${report.mode})`);
lines.push(`- 글 ${posts.length}건: 설치후기 ${report.byKind.review} · 새소식 ${report.byKind.news} · 칼럼 ${report.byKind.column} · 기타 ${report.byKind.other}`);
lines.push(`- 중복 묶음 ${duplicates.length}개 (삭제 대상 ${dropIds.size}건)`);
for (const d of duplicates) {
  lines.push(`  - 남김: ${d.keep.title.slice(0, 50)} (${d.keep.url})`);
  for (const x of d.drop) lines.push(`    - 삭제: ${x.url} [${x.status}] ${x.published?.slice(0, 10) || ""}`);
}
lines.push(`- 깨진 글 ${broken.length}건`);
for (const b of broken) {
  lines.push(`  - [${b.kind}] ${b.title.slice(0, 50)} (${b.url})`);
  for (const pr of b.problems) {
    lines.push(`    - ${pr.msg}`);
    for (const i of pr.imgs || []) lines.push(`      - ${i}`);
  }
}
lines.push(`- 상태파일에 기록 안 된 설치후기 발행글 ${unrecorded.length}건 (다음 크로스포스트 때 또 올라갈 수 있는 글)`);
for (const u of unrecorded.slice(0, 30)) lines.push(`  - ${u.logNo} ${u.title.slice(0, 40)} → ${u.url}${u.stateUrl ? ` (상태파일: ${u.stateUrl})` : ""}`);
lines.push(`- 상태파일에는 있는데 블로거에 없는 글 ${missing.length}건`);
for (const m of missing.slice(0, 30)) lines.push(`  - ${m.logNo} ${m.title.slice(0, 40)} (${m.url})`);

// ---------- 고치기 ----------
if (FIX) {
  let stateChanged = false;
  // (a) 중복 삭제
  for (const d of duplicates) {
    for (const x of d.drop) {
      const ok = await withBackoff(`삭제 ${x.url}`, async () => { await deletePost(token, x.id); return true; });
      report.fixes.push({ action: "delete", url: x.url, ok: !!ok, keep: d.keep.url });
      lines.push(`- ${ok ? "삭제됨" : "삭제 실패"}: ${x.url} (남김 ${d.keep.url})`);
      await sleep(WRITE_GAP_MS);
    }
  }
  // (b) 설치후기 깨진 글: 네이버 원본에서 다시 받아 본문 교체 (제목·라벨·발행일 유지)
  const REFRESH = new Set(["empty", "html", "img", "mixed", "noimg", "footer"]);
  for (const b of broken) {
    if (b.kind !== "review" || !b.logNo || !b.problems.some((p) => REFRESH.has(p.code))) continue;
    try {
      const body = await fetchPostBody(b.logNo);
      const labels = b.labels.length ? b.labels : ["설치후기"];
      const ok = await withBackoff(`갱신 ${b.url}`, () => updatePost(token, b.id, { title: b.title, html: body.html + "\n" + siteFooter(b.logNo), labels, published: b.published }));
      report.fixes.push({ action: "refresh", url: b.url, ok: !!ok, textLen: body.textLen, imgCount: body.imgCount });
      lines.push(`- ${ok ? "본문 갱신" : "갱신 실패"}: ${b.title.slice(0, 40)} (텍스트 ${body.textLen}자 · 사진 ${body.imgCount}장)`);
    } catch (e) {
      report.fixes.push({ action: "refresh", url: b.url, ok: false, error: String(e.message || e) });
      lines.push(`- 갱신 실패(네이버 원본 못 받음): ${b.title.slice(0, 40)} - ${String(e.message || e).slice(0, 80)}`);
    }
    await sleep(WRITE_GAP_MS);
  }
  // (b2) 네이버 원본이 없는 글(다른 도구로 올린 글·새소식 등)의 깨진 네이버 사진은 주소만 교체
  const refreshed = new Set(report.fixes.filter((f) => f.action === "refresh" && f.ok).map((f) => f.url));
  for (const b of broken) {
    if (refreshed.has(b.url)) continue;
    const pr = b.problems.find((p) => p.code === "img");
    if (!pr) continue;
    const swaps = pr.raw.filter(([s]) => repairable.has(s));
    if (!swaps.length) continue;
    let html = b._content;
    for (const [s] of swaps) html = html.split(s).join(repairable.get(s)).split(s.replace(/&/g, "&amp;")).join(repairable.get(s));
    const ok = await withBackoff(`사진 주소 교체 ${b.url}`, () => updatePost(token, b.id, { title: b.title, html, labels: b.labels, published: b.published }));
    report.fixes.push({ action: "img-swap", url: b.url, ok: !!ok, count: swaps.length });
    lines.push(`- ${ok ? "사진 주소 교체" : "교체 실패"}: ${b.title.slice(0, 40)} (${swaps.length}장)`);
    await sleep(WRITE_GAP_MS);
  }
  // (c) 라벨 없는 설치후기 글에 라벨만 추가 (본문 갱신 대상은 위에서 이미 처리)
  for (const b of broken) {
    if (b.kind !== "review" || b.labels.length || b.problems.some((p) => REFRESH.has(p.code))) continue;
    const ok = await withBackoff(`라벨 ${b.url}`, async () => {
      const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${BLOG_ID}/posts/${b.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ labels: ["설치후기"] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`);
      return true;
    });
    report.fixes.push({ action: "label", url: b.url, ok: !!ok });
    lines.push(`- ${ok ? "라벨 추가" : "라벨 실패"}: ${b.title.slice(0, 40)}`);
    await sleep(WRITE_GAP_MS);
  }
  // (d) 상태파일 정리: 실제 블로거 주소를 기록해 같은 글이 다시 올라가지 않게 한다
  for (const u of unrecorded) {
    const prev = state.posted[u.logNo] || { title: u.title };
    state.posted[u.logNo] = { ...prev, title: prev.title || u.title, bloggerUrl: u.url, postedAt: prev.postedAt || new Date().toISOString(), reconciledAt: new Date().toISOString() };
    delete state.posted[u.logNo].seededAt;
    stateChanged = true;
  }
  // 삭제된 중복이 상태파일에 적혀 있으면 남긴 글 주소로 바꾼다
  for (const d of duplicates) {
    for (const x of d.drop) {
      const logNo = stateByUrl.get(x.url);
      if (logNo && state.posted[logNo]) { state.posted[logNo].bloggerUrl = d.keep.url; stateChanged = true; }
    }
  }
  if (stateChanged) {
    writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n");
    lines.push(`- 상태파일 갱신: 기록 ${unrecorded.length}건 보정`);
  }
}

for (const b of broken) { delete b._content; for (const pr of b.problems) delete pr.raw; }
writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2) + "\n");
const summary = lines.join("\n");
console.log("\n" + summary);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + "\n");
console.log(`\n보고서: ${REPORT_FILE}`);
