// 빌드 결과(out/)의 사이트맵 전 쪽 meta description 점검(2026-11-15).
// 기준 = src/lib/utils.ts metaDescription: 80자 이하, 1~2문장, 같은 낱말(조사 뗀 2글자+, 숫자 든 것 제외) 반복 없음,
// 쪽마다 고유, og:description·twitter:description 이 같은 값. 하나라도 어기면 목록을 찍고 1 로 끝난다.
//   npm run build && node scripts/desc-check.mjs
import { readFileSync } from "node:fs";

const JOSA = /(으로|에서|까지|부터|이나|이며|이고|하는|합니다|입니다|은|는|이|가|을|를|의|에|와|과|도|로|만|등)$/;
const repeats = (s) => {
  const w = (s.match(/[가-힣A-Za-z0-9]+/g) ?? []).map((x) => x.replace(JOSA, "")).filter((x) => x.length >= 2 && !/\d/.test(x));
  return w.filter((x, i) => w.indexOf(x) !== i);
};
const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const meta = (h, attr, name) => {
  const m = h.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`));
  return m ? unesc(m[1]) : null;
};

const urls = [...readFileSync("out/sitemap.xml", "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const seen = new Map();
const bad = [];
for (const path of urls) {
  const h = readFileSync(`out${path}index.html`, "utf8");
  const d = meta(h, "name", "description") ?? "";
  const why = [];
  if (!d) why.push("없음");
  if (d.length > 80) why.push(`${d.length}자`);
  if ((d.match(/[.?!](\s|$)/g) ?? []).length > 2) why.push("3문장+");
  const r = repeats(d);
  if (r.length) why.push(`반복 ${[...new Set(r)].join(",")}`);
  if (/[—–]/.test(d)) why.push("대시");
  if (seen.has(d)) why.push(`중복(${seen.get(d)})`);
  if (meta(h, "property", "og:description") !== d) why.push("og 다름");
  if (meta(h, "name", "twitter:description") !== d) why.push("twitter 다름");
  if (!meta(h, "property", "og:image")) why.push("og:image 없음");
  seen.set(d, path);
  if (why.length) bad.push(`${path} [${why.join(" / ")}] ${d}`);
}
console.log(`설명문 점검 ${urls.length}쪽, 문제 ${bad.length}쪽`);
for (const b of bad) console.log("  " + b);
process.exit(bad.length ? 1 : 0);
