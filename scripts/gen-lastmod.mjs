// 사이트맵 lastmod 를 git 커밋 날짜에서 뽑아 src/data/lastmod.json 으로 저장한다.
//
// 왜: 예전에는 sitemap.ts 가 new Date() 를 썼다. 하루 3번 도는 재빌드 크론 때문에
// "모든 페이지가 오늘 수정됨"이 매일 반복돼 구글이 lastmod 를 신뢰하지 않게 된다.
// 실제로 안 고친 페이지는 옛 날짜가 그대로 나가야 한다.
//
// git 이력이 없거나 얕은 클론(shallow)이면 날짜를 알 수 없으므로 빈 객체를 쓴다.
// 이때 sitemap 은 lastmod 를 아예 빼는데, 틀린 날짜를 넣는 것보다 낫다.
// (CI 에서 날짜가 나오게 하려면 actions/checkout 의 fetch-depth: 0 이 필요하다)
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const OUT = "src/data/lastmod.json";

// 라우트별로 날짜를 좌우하는 추가 파일 (페이지 본문이 데이터 파일에 있는 경우)
const extraDeps = {
  "/": ["src/data/site.ts", "src/data/services.ts", "src/data/cases.ts", "src/data/cases-extra.json"],
  "/blog/": ["src/data/posts.ts", "src/data/naver-posts.json"],
  "/news/": ["src/data/news.json"],
  "/cases/": ["src/data/cases.ts", "src/data/cases-extra.json"],
  "/shop/": ["src/data/products.ts"],
  "/qna/": ["src/data/qna.ts"],
  "/rental/price/": ["src/data/rental-prices.ts"],
  "/rental/pc/": ["src/data/rental-prices.ts", "src/data/cases.ts"],
  "/rental/area/": ["src/app/rental/area/[slug]/page.tsx", "src/data/rental-areas.ts", "src/data/rental-prices.ts"],
};

// sitemap 의 pages 배열에는 없지만 lastmod 가 필요한 동적 라우트.
// 키는 sitemap.ts 가 lm[...] 으로 찾는 이름이고, 값은 그 페이지 내용을 좌우하는 파일들이다.
// (모델별 페이지는 본문이 전부 synology.ts 에서 나온다)
const dynamicRoutes = {
  "/nas/model/": ["src/app/nas/model/[slug]/page.tsx", "src/data/synology.ts"],
  "/nas/area/": ["src/app/nas/area/[slug]/page.tsx", "src/app/nas/area/page.tsx", "src/data/areas.ts"],
};

function git(args) {
  // blame·log -p 출력이 기본 한도(1MB)를 넘는다(qna-deep-2.ts 1만5천 줄)
  return execFileSync("git", args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 }).trim();
}

function routeToPage(route) {
  return route === "/" ? "src/app/page.tsx" : `src/app${route}page.tsx`;
}

let routes = [];
try {
  // sitemap.ts 의 pages 배열을 그대로 읽어 라우트 목록을 얻는다 (두 곳에 적지 않기 위해)
  const src = await import("node:fs").then((fs) => fs.readFileSync("src/app/sitemap.ts", "utf8"));
  const block = src.match(/const pages = \[([\s\S]*?)\];/);
  routes = [...block[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
} catch (e) {
  console.warn("! sitemap.ts 라우트 목록을 못 읽음:", e.message);
}

let shallow = true;
try {
  shallow = git(["rev-parse", "--is-shallow-repository"]) === "true";
} catch {
  shallow = true;
}

function newestCommit(files) {
  const dates = files
    .map((f) => {
      try {
        return git(["log", "-1", "--format=%cI", "--", f]) || null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  return dates.length ? dates.sort().at(-1) : null;
}

const map = {};
if (!shallow && routes.length) {
  for (const [route, files] of Object.entries(dynamicRoutes)) {
    const d = newestCommit(files);
    if (d) map[route] = d;
  }
  for (const route of routes) {
    const files = [routeToPage(route), ...(extraDeps[route] ?? [])];
    const dates = files
      .map((f) => {
        try {
          return git(["log", "-1", "--format=%cI", "--", f]) || null;
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    if (dates.length) map[route] = dates.sort().at(-1);
  }
} else {
  console.warn("! git 이력 없음/얕은 클론 - lastmod 를 비워 둔다 (사이트맵에서 생략됨)");
}

writeFileSync(OUT, JSON.stringify(map, null, 2) + "\n", "utf8");
console.log("✓", OUT, `${Object.keys(map).length} routes`);

// Q&A 문항별 날짜(2026-11-14). 예전엔 모든 문항이 같은 게시일·수정일(qna.ts 의 qnaPublished/qnaModified)을 썼다.
// 게시일 = 그 slug 가 qna.ts 에 처음 들어간 커밋. 수정일 = 그 문항 줄(qna.ts)과 심화 본문(qna-deep*.ts) 중
// 가장 최근에 바뀐 줄의 커밋(git blame). 얕은 클론이면 빈 객체 -> 페이지가 qnaPublished/qnaModified 로 돌아간다.
// 분류 화면은 문항이 빠지거나 옮겨져도 바뀐 것이므로, 분류별로 문항 추가·삭제·이동이 있었던 마지막 커밋도 cats 에 둔다.
// 얕은 클론이거나 git 이 실패하면 이미 있는 qna-dates.json 을 그대로 둔다(덮어쓰면 날짜가 공통값으로 되돌아간다).
const QNA_OUT = "src/data/qna-dates.json";
const qnaDates = {};
const qnaCatChanged = {};
let qnaOk = false;
if (!shallow) {
  try {
    const lineTimes = (f) => {
      const t = [];
      let cur = 0;
      for (const l of git(["blame", "--line-porcelain", "--", f]).split("\n")) {
        if (l.startsWith("committer-time ")) cur = Number(l.slice(15));
        else if (l.startsWith("\t")) t.push(cur);
      }
      return t;
    };
    // slug 별 줄 번호. 다음 키·구분 주석·배열 끝에서 끊는다.
    const ranges = (f, keyRe) => {
      const r = {};
      let cur = null;
      readFileSync(f, "utf8").split(/\r?\n/).forEach((l, i) => {
        const m = l.match(keyRe);
        if (m) (r[(cur = m[1])] ??= []).push(i);
        else if (/^\s*\/\/ ──|^(\];|\};)/.test(l)) cur = null;
        else if (cur) r[cur].push(i);
      });
      return r;
    };
    const sources = [
      ["src/data/qna.ts", /\{ slug: "([^"]+)",/],
      ["src/data/qna-deep.ts", /^ {2}"?([a-z0-9-]+)"?: \[\s*$/],
      ["src/data/qna-deep-2.ts", /^ {2}"?([a-z0-9-]+)"?: \[\s*$/],
    ];
    const newest = {};
    for (const [f, re] of sources) {
      const times = lineTimes(f);
      for (const [slug, lines] of Object.entries(ranges(f, re))) {
        const t = Math.max(...lines.map((i) => times[i] ?? 0));
        newest[slug] = Math.max(newest[slug] ?? 0, t);
      }
    }
    // 게시일: qna.ts 이력을 오래된 순으로 훑어 slug 줄이 처음 추가된 커밋.
    // 첫 커밋(d5f9244)은 "{" 와 "slug:" 가 다른 줄이라 "{ slug:" 로만 찾으면 초기 문항을 놓친다.
    const first = {};
    let d = null;
    for (const l of git(["log", "--reverse", "--format=@@C %cI", "-p", "--unified=0", "--", "src/data/qna.ts"]).split("\n")) {
      if (l.startsWith("@@C ")) d = l.slice(4);
      else if (/^[+-]/.test(l) && !/^(\+\+\+|---) /.test(l)) {
        const m = l.match(/\bslug: "([^"]+)"/);
        if (!m) continue;
        if (l[0] === "+" && !first[m[1]]) first[m[1]] = d;
        const c = l.match(/\bcat: "([a-z]+)"/); // 같은 줄에 분류가 있을 때만(현재 형식)
        if (c) qnaCatChanged[c[1]] = new Date(d).toISOString();
      }
    }
    for (const slug of Object.keys(ranges(...sources[0]))) {
      const m = newest[slug] ? new Date(newest[slug] * 1000).toISOString() : null;
      const p = first[slug] ? new Date(first[slug]).toISOString() : m; // 둘 다 UTC ISO 로 맞춰야 크기 비교가 된다
      if (p && m) qnaDates[slug] = { p, m: m < p ? p : m };
    }
    qnaOk = Object.keys(qnaDates).length > 0;
  } catch (e) {
    console.warn("! Q&A 날짜를 못 뽑음:", e.message);
  }
}
if (qnaOk) {
  writeFileSync(QNA_OUT, JSON.stringify({ items: qnaDates, cats: qnaCatChanged }, null, 2) + "\n", "utf8");
  console.log("✓", QNA_OUT, `${Object.keys(qnaDates).length} 문항`);
} else {
  console.warn("! Q&A 날짜 갱신 안 함 - 기존", QNA_OUT, "유지");
}
