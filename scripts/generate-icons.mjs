// 로고(public/brand/logo.png)에서 PWA 설치 아이콘 생성.
// 재생성: `node scripts/generate-icons.mjs`
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const LOGO = "public/brand/logo.png";
const OUT = "public/icons";
mkdirSync(OUT, { recursive: true });

// size 정사각 흰 배경 위에, 로고를 size*inner 박스에 contain 으로 중앙 배치
async function make(size, inner, out) {
  const box = Math.round(size * inner);
  const logo = await sharp(LOGO)
    .resize({ width: box, height: box, fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(`${OUT}/${out}`);
  console.log("✓", out, `${size}x${size}`);
}

await make(192, 0.74, "icon-192.png");
await make(512, 0.74, "icon-512.png");
await make(512, 0.6, "icon-maskable-512.png"); // 마스커블: 안전영역(중앙 60%) 안에 로고
await make(180, 0.78, "apple-touch-icon.png"); // iOS 홈화면
console.log("done");
