// 폰용 작은 사본(2026-11-15, 모바일 라이트하우스 "이미지가 표시 크기보다 큼").
// public/cases·public/blog-assets 의 .webp 마다 폭 768px 사본 <이름>-768.webp 를 만들고,
// 화면은 photoSrcSet()(src/lib/photos.ts)으로 srcset 에 넣는다. 머리글·바닥글 로고는 brand/logo-96.webp·logo-160.webp(높이 px).
// 없는 것만 만들므로 prebuild 에서 매번 돌려도 된다(새 사진을 넣고 잊어도 깨진 사본 주소가 생기지 않는다).
//   node scripts/make-small-photos.mjs          # 없는 것만
//   node scripts/make-small-photos.mjs --force  # 전부 다시
import sharp from "sharp";
import { readdirSync, existsSync, statSync, writeFileSync, renameSync } from "node:fs";
import { join } from "node:path";

const FORCE = process.argv.includes("--force");
const W = 768;
let made = 0;

async function write(dst, buf) {
  writeFileSync(dst + ".tmp", buf);
  renameSync(dst + ".tmp", dst);
  made++;
}

for (const dir of ["public/cases", "public/blog-assets"]) {
  if (!existsSync(dir)) continue;
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".webp") || name.endsWith(`-${W}.webp`)) continue;
    const src = join(dir, name);
    const dst = src.replace(/\.webp$/, `-${W}.webp`);
    if (!FORCE && existsSync(dst) && statSync(dst).mtimeMs >= statSync(src).mtimeMs) continue;
    // 768px 보다 좁은 사진은 키우지 않고 같은 크기로 둔다(srcset 주소가 항상 있게)
    await write(dst, await sharp(src).resize({ width: W, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toBuffer());
  }
}

const logo = "public/brand/logo.png";
for (const h of [96, 160]) {
  const dst = `public/brand/logo-${h}.webp`;
  if (existsSync(logo) && (FORCE || !existsSync(dst) || statSync(dst).mtimeMs < statSync(logo).mtimeMs)) {
    await write(dst, await sharp(logo).resize({ height: h }).webp({ quality: 85, effort: 6 }).toBuffer());
  }
}
console.log(`✓ 작은 사본 ${made}장 생성`);
