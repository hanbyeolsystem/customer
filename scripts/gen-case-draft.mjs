// 구축 사례 추가용 초안 생성기.
//
// 하는 일: 네이버 블로그 RSS 를 읽어 아직 src/data/cases.ts 에 없는 글을 찾고,
//          그 글의 현장 사진을 public/cases/ 로 내려받은 뒤(색띠 자동 크롭),
//          cases.ts 에 붙여 넣을 CaseStudy 초안을 출력한다.
//
// 쓰는 법:
//   node scripts/gen-case-draft.mjs            # 미등록 후기 글 목록만 본다
//   node scripts/gen-case-draft.mjs <logNo> <slug>   # 사진 내려받고 초안 출력
//
// ⚠️ 출력된 초안의 challenge/solution/result 는 비어 있다.
//    반드시 원문 후기를 읽고 실제 내용으로 채울 것. 지어내면 사이트 신뢰도가 무너진다.

import sharp from "sharp";
import { readFileSync, writeFileSync, renameSync } from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36";
const RSS = "https://rss.blog.naver.com/hanbyeolsystem.xml";
const OUT = "public/cases";

const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`));
  return m ? m[1].trim() : "";
};

async function rssItems() {
  const xml = await (await fetch(RSS, { headers: { "User-Agent": UA } })).text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => ({
    title: tag(m[1], "title"),
    cat: tag(m[1], "category"),
    link: tag(m[1], "link").split("?")[0],
    date: tag(m[1], "pubDate"),
    logNo: tag(m[1], "link").split("?")[0].split("/").pop(),
  }));
}

async function postImages(logNo) {
  const url = `https://m.blog.naver.com/PostView.naver?blogId=hanbyeolsystem&logNo=${logNo}`;
  const html = await (await fetch(url, { headers: { "User-Agent": UA } })).text();
  const at = html.search(/<div[^>]*class="[^"]*se-main-container/);
  const body = at < 0 ? html : html.slice(at, at + 200000);
  const imgs = [...body.matchAll(/<img\b[^>]*\bdata-lazy-src="([^"]+)"/g)].map((m) => m[1].split("?")[0]);
  const texts = [...body.matchAll(/<p[^>]*class="[^"]*se-text-paragraph[^"]*"[^>]*>([\s\S]*?)<\/p>/g)]
    .map((m) => m[1].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim())
    .filter(Boolean);
  return { imgs: [...new Set(imgs)], text: texts.join("\n") };
}

// 사진 아래(또는 위)에 깔린 색띠를 잘라낸다. 행의 70% 이상이 같은 색이면 띠로 본다.
function isBandRow(data, W, C, y) {
  const b = new Map();
  let n = 0;
  for (let x = 0; x < W; x += 3) {
    const i = (y * W + x) * C;
    const k = `${data[i] >> 4},${data[i + 1] >> 4},${data[i + 2] >> 4}`;
    b.set(k, (b.get(k) || 0) + 1);
    n++;
  }
  return Math.max(...b.values()) / n >= 0.55;
}

async function cropBands(p) {
  for (const side of ["bottom", "top"]) {
    const { data, info } = await sharp(p).raw().toBuffer({ resolveWithObject: true });
    const { width: W, height: H, channels: C } = info;
    let box = null;
    if (side === "bottom") {
      const from = Math.floor(H * 0.4);
      for (let s = from; s < H; s++) {
        const rows = [];
        for (let y = s; y < H; y++) rows.push(isBandRow(data, W, C, y));
        if (rows.length < H * 0.12) break;
        if (rows.filter(Boolean).length / rows.length >= 0.8) {
          box = { left: 0, top: 0, width: W, height: Math.max(1, s - 3) };
          break;
        }
      }
    } else {
      const limit = Math.floor(H * 0.18);
      for (let e = limit; e >= 8; e--) {
        let hit = 0;
        for (let y = 0; y <= e; y++) if (isBandRow(data, W, C, y)) hit++;
        if (hit / (e + 1) >= 0.8) {
          box = { left: 0, top: e + 3, width: W, height: H - e - 3 };
          break;
        }
      }
    }
    if (!box) continue;
    const buf = await sharp(p).extract(box).jpeg({ quality: 84 }).toBuffer();
    writeFileSync(`${p}.tmp`, buf);
    renameSync(`${p}.tmp`, p);
  }
}

const [logNo, slug] = process.argv.slice(2);
const items = await rssItems();
const cases = readFileSync("src/data/cases.ts", "utf8");

if (!logNo) {
  const missing = items.filter((i) => !cases.includes(i.logNo));
  console.log(`RSS ${items.length}건 중 cases.ts 에 없는 글 ${missing.length}건\n`);
  for (const m of missing) console.log(`${m.logNo}  [${m.cat}] ${m.title}`);
  console.log(`\n후기 성격의 글만 골라서: node scripts/gen-case-draft.mjs <logNo> <slug>`);
  process.exit(0);
}
if (!slug) {
  console.error("slug 를 같이 주세요. 예: node scripts/gen-case-draft.mjs 224385618782 daegu-junggu-nas-to-nas");
  process.exit(1);
}

const item = items.find((i) => i.logNo === logNo);
const { imgs, text } = await postImages(logNo);
const saved = [];
for (const u of imgs.slice(1)) {
  if (saved.length >= 4) break;
  try {
    const buf = Buffer.from(
      await (await fetch(`${u}?type=w966`, { headers: { "User-Agent": UA, Referer: "https://blog.naver.com/" } })).arrayBuffer(),
    );
    const meta = await sharp(buf).metadata();
    if (!meta.width || meta.width < 600) continue;
    if (meta.width / meta.height > 3) continue;
    const name = `${slug}-${saved.length + 1}.jpg`;
    await sharp(buf).resize({ width: 1400, withoutEnlargement: true }).jpeg({ quality: 82 }).toFile(`${OUT}/${name}`);
    await cropBands(`${OUT}/${name}`);
    saved.push(`/cases/${name}`);
  } catch { /* 한 장 실패는 넘어간다 */ }
}

const ym = item ? new Date(item.date).toISOString().slice(0, 7) : "YYYY-MM";
console.log(`\n사진 ${saved.length}장 저장 완료. 아래 초안을 src/data/cases.ts 에 붙여 넣고 빈칸을 채우세요.\n`);
console.log(`  {
    slug: "${slug}",
    industry: "TODO",
    region: "TODO",
    date: "${ym}",
    category: "nas",  // nas | printer | pc | network | etc
    title: "TODO",
    summary: "TODO",
    gear: ["TODO"],
    tags: ["TODO"],
    images: [${saved.map((s) => `\n      "${s}",`).join("")}
    ],
    href: "https://blog.naver.com/hanbyeolsystem/${logNo}",
    challenge: "TODO - 원문에서 고객이 안고 있던 문제",
    solution: [
      "TODO - 실제로 한 작업",
    ],
    result: "TODO - 원문에 적힌 결과",
    spec: [
      { label: "TODO", value: "TODO" },
    ],
  },`);
console.log(`\n──── 원문 본문 앞부분(참고용) ────\n${text.replace(/[​\s]+/g, " ").slice(0, 1800)}\n`);
