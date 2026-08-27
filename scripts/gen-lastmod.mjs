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
import { writeFileSync } from "node:fs";

const OUT = "src/data/lastmod.json";

// 라우트별로 날짜를 좌우하는 추가 파일 (페이지 본문이 데이터 파일에 있는 경우)
const extraDeps = {
  "/": ["src/data/site.ts", "src/data/services.ts", "src/data/cases.ts"],
  "/blog/": ["src/data/posts.ts", "src/data/naver-posts.json"],
  "/news/": ["src/data/news.json"],
  "/cases/": ["src/data/cases.ts"],
  "/shop/": ["src/data/products.ts"],
  "/qna/": ["src/data/qna.ts"],
};

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
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

const map = {};
if (!shallow && routes.length) {
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
