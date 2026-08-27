// JPEG/PNG → WebP. 화면은 .webp 를 쓰고(브라우저 전부 지원), 원본 JPEG 는 그대로 두어 옛 링크가 깨지지 않게 한다.
// 블로그 사진(public/blog-posts/)만은 원본을 지운다 - 490장 31MB 를 두 벌 두면 저장소만 커진다.
//
//   node scripts/to-webp.mjs          # 없는 것만 만든다(재실행 무해)
//   node scripts/to-webp.mjs --force  # 전부 다시
//
// 새 사진을 넣었으면 optimize-images.mjs 다음에 이걸 한 번 돌리고 결과를 커밋한다(빌드 때 안 돌림).
// 제외: og.jpg(SNS 카드는 JPEG 가 안전), brand/logo.png·icons/(구글 로고·PWA 아이콘은 PNG 권장).
import sharp from "sharp";
import { readdirSync, statSync, existsSync, unlinkSync, writeFileSync, renameSync } from "node:fs";
import { join } from "node:path";

const FORCE = process.argv.includes("--force");
const DIRS = ["public/cases", "public/blog-assets", "public/hero", "public/video", "public/blog-posts"];
const DELETE_ORIGINAL = new Set(["public/blog-posts"]);

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(jpe?g|png)$/i.test(e.name)) out.push(p);
  }
  return out;
}

let made = 0, skipped = 0, before = 0, after = 0;
for (const dir of DIRS) {
  const del = DELETE_ORIGINAL.has(dir);
  for (const src of walk(dir)) {
    const dst = src.replace(/\.(jpe?g|png)$/i, ".webp");
    if (!FORCE && existsSync(dst) && statSync(dst).mtimeMs >= statSync(src).mtimeMs) { skipped++; continue; }
    const buf = await sharp(src).webp({ quality: 80, effort: 5 }).toBuffer();
    writeFileSync(dst + ".tmp", buf); renameSync(dst + ".tmp", dst);
    before += statSync(src).size; after += buf.length; made++;
    if (del) unlinkSync(src);
  }
}
console.log(`✓ webp ${made}장 생성(건너뜀 ${skipped}) · ${(before / 1048576).toFixed(1)}MB → ${(after / 1048576).toFixed(1)}MB`);
