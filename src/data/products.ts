export type Product = {
  id: string;
  category: string;
  name: string;
  monthly: string;
  image: string;
  href: string;       // hbsys.kr 상품 상세 URL
  badge?: string;
};

// 한별시스템 주력 - 교세라(레이저) · 엡손(잉크젯) 6개 라인업
// 카드 클릭 시 hbsys.kr 상품 상세 페이지로 새 탭 이동
//
// 사진은 hbsys.kr 원본을 사이트 안에 복제해 둔다(public/products/*.webp).
// 예전에는 hbsys.kr PNG(장당 350~380KB, 6장 2.2MB)를 lazy 로 직접 불러서
// 모바일에서 카드가 빈 흰 박스로 남는 일이 있었다. 지금은 장당 13~17KB WebP.
// 상품이 바뀌면 원본을 받아 600px WebP(q82)로 눌러 이 폴더에 넣을 것.
export const products: Product[] = [
  {
    id: "p-kyocera-m8130",
    category: "교세라 · A3 컬러 레이저",
    name: "Kyocera M8130cidn A3 컬러복합기",
    monthly: "월 50,000원~",
    image: "/products/kyocera-m8130cidn.webp",
    href: "https://hbsys.kr/shop/item.php?it_id=1765864642",
    badge: "BEST",
  },
  {
    id: "p-epson-l15160",
    category: "엡손 · A3 컬러 잉크젯",
    name: "EPSON L15160 A3 컬러잉크젯복합기",
    monthly: "월 50,000원~",
    image: "/products/epson-l15160.webp",
    href: "https://hbsys.kr/shop/item.php?it_id=1764744449",
    badge: "BEST",
  },
  {
    id: "p-kyocera-ma3500",
    category: "교세라 · A4 컬러 레이저",
    name: "Kyocera ECOSYS MA3500cifx A4 컬러복합기",
    monthly: "월 40,000원~",
    image: "/products/kyocera-ma3500cifx.webp",
    href: "https://hbsys.kr/shop/item.php?it_id=1765328630",
  },
  {
    id: "p-epson-emc800",
    category: "엡손 · A4 컬러 잉크젯",
    name: "EPSON EM-C800 A4 컬러잉크젯복합기",
    monthly: "월 40,000원~",
    image: "/products/epson-em-c800.webp",
    href: "https://hbsys.kr/shop/item.php?it_id=1764744452",
  },
  {
    id: "p-kyocera-ma2100",
    category: "교세라 · A4 컬러 (가성비)",
    name: "Kyocera ECOSYS MA2100cfx A4 컬러복합기",
    monthly: "월 29,000원~",
    image: "/products/kyocera-ma2100cfx.webp",
    href: "https://hbsys.kr/shop/item.php?it_id=1765265866",
    badge: "HOT",
  },
  {
    id: "p-epson-l6290",
    category: "엡손 · A4 컬러 (가성비)",
    name: "EPSON L6290 A4 컬러잉크젯복합기",
    monthly: "월 27,000원~",
    image: "/products/epson-l6290.webp",
    href: "https://hbsys.kr/shop/item.php?it_id=1764744467",
    badge: "HOT",
  },
];

export const RENTAL_SHOP_URL = "https://hbsys.kr/shop/";
