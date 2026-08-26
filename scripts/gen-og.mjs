// OG 이미지(1200x630) 생성. 카카오톡·페이스북·구글/AI 카드 미리보기에 쓰인다.
// 결과물 public/og.jpg 는 커밋해 둔다 (빌드 때 다시 만들지 않음 - 폰트가 있는 로컬에서만 실행).
// 재생성: node scripts/gen-og.mjs
import sharp from "sharp";

const W = 1200, H = 630;
const PHOTO = "public/cases/rs2421.jpg";  // 실제 시공 현장 사진
const LOGO = "public/brand/logo.png";
const OUT = "public/og.jpg";

// 사진을 1200x630 으로 채우고 네이비로 어둡게 깔아 글자가 읽히게 한다
const bg = await sharp(PHOTO)
  .resize(W, H, { fit: "cover", position: "center" })
  .composite([{
    input: { create: { width: W, height: H, channels: 4, background: { r: 6, g: 27, b: 45, alpha: 0.74 } } },
    blend: "over",
  }])
  .toBuffer();

const logo = await sharp(LOGO)
  .resize({ height: 190, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toBuffer();
const logoW = (await sharp(logo).metadata()).width;

const text = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .t { font-family: 'Malgun Gothic','맑은 고딕','Noto Sans KR',sans-serif; fill:#ffffff; }
    .head { font-size: 58px; font-weight: 800; }
    .sub  { font-size: 30px; fill:#9fd4f5; font-weight: 600; }
    .tel  { font-size: 34px; fill:#ffffff; font-weight: 800; }
  </style>
  <text class="t head" x="90" y="360">대구 NAS 구축 · 복합기 렌탈</text>
  <text class="t sub"  x="92" y="418">데이터 백업 · 사무실 네트워크 · 기업 전산 유지관리</text>
  <text class="t tel"  x="92" y="510">053-588-7119</text>
  <rect x="90" y="452" width="120" height="4" fill="#0090D8"/>
</svg>`);

await sharp(bg)
  .composite([
    { input: logo, top: 60, left: Math.round((W - logoW) / 2) - 380 },
    { input: text, top: 0, left: 0 },
  ])
  .jpeg({ quality: 86 })
  .toFile(OUT);
console.log("✓", OUT, `${W}x${H}`);
