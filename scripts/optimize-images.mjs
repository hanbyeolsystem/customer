// 사진 무게 줄이기. images.unoptimized=true 라 public/ 의 파일이 그대로 나가므로
// 여기서 한 번 눌러 두고 결과를 커밋한다(빌드마다 돌리지 않음 - 원본이 이미 눌린 상태라 재실행해도 무해).
//
//   node scripts/optimize-images.mjs            # public/ 아래 JPEG 전부: 최대 1400px, mozjpeg q78
//   node scripts/optimize-images.mjs --dry      # 얼마나 줄어드는지만 본다
//
// 추가로 Q&A 카드용 480px 소형본을 public/blog-assets/thumb/ 에 만든다(qnaImage(..., "thumb")).
import sharp from "sharp";
import { readdirSync, statSync, mkdirSync, writeFileSync, renameSync } from "node:fs";
import { join } from "node:path";

const DRY = process.argv.includes("--dry");
const MAX_W = 1400;
const SKIP = new Set(["og.jpg"]); // 카드 이미지는 규격 고정이라 건드리지 않음

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== "thumb") walk(p, out); }
    else if (/\.jpe?g$/i.test(e.name) && !SKIP.has(e.name)) out.push(p);
  }
  return out;
}

let before = 0, after = 0, touched = 0;
for (const p of walk("public")) {
  const src = statSync(p).size;
  const img = sharp(p);
  const meta = await img.metadata();
  const buf = await img
    .resize({ width: MAX_W, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true, progressive: true })
    .toBuffer();
  before += src;
  if (buf.length < src * 0.95) {
    after += buf.length; touched++;
    if (!DRY) { writeFileSync(p + ".tmp", buf); renameSync(p + ".tmp", p); }
    console.log(`${(src / 1024).toFixed(0).padStart(5)}KB -> ${(buf.length / 1024).toFixed(0).padStart(4)}KB  ${p}${meta.width > MAX_W ? ` (${meta.width}px->${MAX_W}px)` : ""}`);
  } else {
    after += src;
  }
}
console.log(`\n${touched}장 압축: ${(before / 1024 / 1024).toFixed(1)}MB -> ${(after / 1024 / 1024).toFixed(1)}MB${DRY ? " (dry)" : ""}`);

// Q&A 카드 썸네일 480px
const TH = "public/blog-assets/thumb";
mkdirSync(TH, { recursive: true });
let th = 0;
for (const f of readdirSync("public/blog-assets")) {
  if (!/\.jpe?g$/i.test(f)) continue;
  const out = join(TH, f);
  if (DRY) { th++; continue; }
  await sharp(join("public/blog-assets", f)).resize({ width: 480, height: 300, fit: "cover" }).jpeg({ quality: 72, mozjpeg: true }).toFile(out);
  th++;
}
console.log(`썸네일 ${th}장 -> ${TH}`);
