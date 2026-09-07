// 시놀로지 사이트와 같은 글꼴(Noto Sans KR + Inter)을 self-host 한다. `node scripts/fetch-webfonts.mjs`
//
// - 두 글꼴 다 SIL OFL 무료. 시놀로지(synostatic.synology.com)도 같은 조각 방식으로 직접 올린다.
// - Google Fonts CSS API 가 주는 unicode-range 조각(Noto Sans KR 웨이트당 약 120조각, Inter 7조각)을 그대로 받아
//   public/fonts/ 에 두고, src/app/webfonts.css 의 url 만 우리 경로로 바꾼다. 브라우저는 화면에 그리는 글자가 든
//   조각만 받는다(Pretendard 와 같은 원리).
// - 시놀로지가 쓰는 웨이트(Noto Sans KR 300·400·500·700, Inter 400~700)를 가변 폰트 한 벌이 다 덮는다.
// - 조각 131개(4MB)를 전부 리포에 둔다. 블로그 자동 수집이 매일 새 글을 넣기 때문에 "지금 있는 글자"로만 서브셋하면 깨진다.
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";

// 가변 폰트(wght 축) 조각으로 받는다. 정적 4웨이트는 16MB, 가변은 그 1/4 이다.
const FAMILIES = "family=Noto+Sans+KR:wght@300..700&family=Inter:wght@400..700";
const CSS_URL = `https://fonts.googleapis.com/css2?${FAMILIES}&display=swap`;
// woff2 + unicode-range 를 받으려면 최신 크롬 UA 가 필요하다
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const OUT_DIR = "public/fonts/webfonts";
const OUT_CSS = "src/app/webfonts.css";
const HREF_BASE = "/fonts/webfonts";

const css = await (await fetch(CSS_URL, { headers: { "User-Agent": UA } })).text();
const blocks = css.match(/@font-face\s*\{[^}]+\}/g) ?? [];
if (blocks.length < 100) throw new Error(`@font-face 가 ${blocks.length}개뿐이다. UA 나 API 응답을 확인할 것`);

if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true });
mkdirSync(OUT_DIR, { recursive: true });

const out = [
  "/* 이 파일은 scripts/fetch-webfonts.mjs 가 만든다. 손으로 고치지 말 것.",
  " * Noto Sans KR 가변(300~700) + Inter 가변(400~700), SIL Open Font License 1.1 (Google Fonts 조각)",
  " * 시놀로지 사이트(synology.com/ko-kr)와 같은 글꼴 구성이다. */",
];
let n = 0;
const counts = {};
for (const b of blocks) {
  const family = /font-family:\s*'([^']+)'/.exec(b)?.[1];
  const weight = /font-weight:\s*([\d ]+)/.exec(b)?.[1]?.trim().replace(/\s+/g, "-");
  const url = /url\((https:[^)]+)\)/.exec(b)?.[1];
  if (!family || !weight || !url) continue;
  const slug = family.replace(/\s+/g, "").toLowerCase();
  counts[`${slug}-${weight}`] = (counts[`${slug}-${weight}`] ?? 0) + 1;
  const name = `${slug}-w${weight}-${counts[`${slug}-${weight}`]}.woff2`;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(`${OUT_DIR}/${name}`, buf);
  n++;
  out.push(b.replace(url, `${HREF_BASE}/${name}`).replace(/\s+/g, " ").replace(/\{ /, "{\n  ").replace(/; /g, ";\n  ").replace(/;\n  \}/, ";\n}"));
}
writeFileSync(OUT_CSS, out.join("\n") + "\n");
console.log(`조각 ${n}개 -> ${OUT_DIR}, ${OUT_CSS}`, counts);
