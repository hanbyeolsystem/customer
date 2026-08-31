// Pretendard 를 self-host 한다. `node scripts/fetch-pretendard.mjs` 로 다시 받는다.
//
// 왜 이 방식인가 (2026-09-01 실측)
//  - 예전에는 globals.css 가 jsDelivr 의 static/pretendard.css 를 @import 했다.
//    9개 웨이트 풀 woff2 = 약 6.7MB 를 통째로 끌어왔다.
//  - 코드가 실제로 쓰는 웨이트는 400·500·600·700·800·900 여섯 개다(font-medium ~ font-black).
//    static 을 웨이트별로 받으면 여섯 벌이 되어 오히려 커진다.
//  - 가변 폰트(Pretendard Variable)는 파일 하나가 45~920 축을 전부 담아 여섯 웨이트를 한 번에 덮는다.
//    다만 통짜 PretendardVariable.woff2 는 2.0MB 라 그대로 쓰면 안 된다.
//  - 그래서 공식 dynamic-subset(unicode-range 92조각)을 쓴다. 브라우저가 화면에 실제로 그리는
//    글자가 든 조각만 받는다. 실측: 홈 17조각 437KB, /rental/ 14조각 358KB, 블로그 글 12조각 301KB.
//  - 92조각 전부를 리포에 둔다(2.9MB). 블로그 자동 수집이 매일 새 글을 넣기 때문에
//    "사이트에 지금 있는 글자"로 직접 서브셋하면 새 글의 글자가 깨진다. 범위를 다 덮어야 안전하다.
//
// 버전을 올릴 때는 PRETENDARD_VERSION 만 바꾸고 이 스크립트를 다시 돌린 뒤 결과를 커밋한다.

import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";

const PRETENDARD_VERSION = "v1.3.9";
const CHUNKS = 92; // dynamic-subset 조각 수. 버전이 바뀌면 CSS 의 @font-face 수를 확인할 것.

const CDN = `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@${PRETENDARD_VERSION}`;
const CSS_URL = `${CDN}/dist/web/variable/pretendardvariable-dynamic-subset.css`;
const WOFF2_BASE = `${CDN}/packages/pretendard/dist/web/variable/woff2-dynamic-subset`;

const OUT_DIR = "public/fonts/pretendard";
const OUT_CSS = "src/app/pretendard.css";
/** 브라우저가 참조할 절대경로. Next 번들러가 건드리지 않도록 /public 기준 절대경로를 쓴다. */
const HREF_BASE = "/fonts/pretendard";

async function get(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res;
}

if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true });
mkdirSync(OUT_DIR, { recursive: true });

// 1) 원본 CSS 에서 조각별 unicode-range 를 뽑는다
const css = await (await get(CSS_URL)).text();
const blocks = [...css.matchAll(/\/\* \[(\d+)\] \*\/[\s\S]*?unicode-range: ([^;]+);/g)].map((m) => ({
  i: Number(m[1]),
  range: m[2].replace(/\s+/g, " ").trim(),
}));
if (blocks.length !== CHUNKS) {
  throw new Error(`조각 수가 ${blocks.length} 로 바뀌었다. CHUNKS 상수를 맞출 것.`);
}

// 2) woff2 조각을 전부 받는다
let bytes = 0;
for (const b of blocks) {
  const buf = Buffer.from(await (await get(`${WOFF2_BASE}/PretendardVariable.subset.${b.i}.woff2`)).arrayBuffer());
  writeFileSync(`${OUT_DIR}/PretendardVariable.subset.${b.i}.woff2`, buf);
  bytes += buf.length;
}

// 3) self-host 경로로 @font-face 를 다시 쓴다.
//    font-display: swap - 폰트가 늦어도 글이 먼저 보여야 한다(빈 화면 금지).
const out = [
  "/* 이 파일은 scripts/fetch-pretendard.mjs 가 만든다. 손으로 고치지 말 것.",
  ` * Pretendard ${PRETENDARD_VERSION} 가변 폰트 dynamic subset(${CHUNKS}조각), SIL Open Font License 1.1`,
  " * https://github.com/orioncactus/pretendard",
  " */",
  ...blocks.map((b) =>
    [
      `/* [${b.i}] */`,
      "@font-face {",
      `  font-family: 'Pretendard Variable';`,
      "  font-style: normal;",
      "  font-display: swap;",
      "  font-weight: 45 920;",
      `  src: url('${HREF_BASE}/PretendardVariable.subset.${b.i}.woff2') format('woff2-variations');`,
      `  unicode-range: ${b.range};`,
      "}",
    ].join("\n"),
  ),
  "",
].join("\n");
writeFileSync(OUT_CSS, out, "utf8");

console.log(`✓ ${OUT_DIR} ${blocks.length}조각 ${(bytes / 1024 / 1024).toFixed(1)}MB`);
console.log(`✓ ${OUT_CSS} ${(readFileSync(OUT_CSS).length / 1024) | 0}KB`);
