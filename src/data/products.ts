export type Product = {
  id: string;
  category: string;
  name: string;
  monthly: string;
  image: string;
  href: string;       // hbsys.kr 상품 상세 URL
  badge?: string;
};

// 한별시스템 주력 — 교세라(레이저) · 엡손(잉크젯) 6개 라인업
// 카드 클릭 시 hbsys.kr 상품 상세 페이지로 새 탭 이동
export const products: Product[] = [
  {
    id: "p-kyocera-m8130",
    category: "교세라 · A3 컬러 레이저",
    name: "Kyocera M8130cidn A3 컬러복합기",
    monthly: "월 50,000원~",
    image: "https://hbsys.kr/data/item/1765864642/thumb-6rWQ7IS46528M8130cidn_1_600x600.png",
    href: "https://hbsys.kr/shop/item.php?it_id=1765864642",
    badge: "BEST",
  },
  {
    id: "p-epson-l15160",
    category: "엡손 · A3 컬러 잉크젯",
    name: "EPSON L15160 A3 컬러잉크젯복합기",
    monthly: "월 50,000원~",
    image: "https://hbsys.kr/data/item/1764744449/thumb-7Jeh7IaQL15160_600x600.png",
    href: "https://hbsys.kr/shop/item.php?it_id=1764744449",
    badge: "BEST",
  },
  {
    id: "p-kyocera-ma3500",
    category: "교세라 · A4 컬러 레이저",
    name: "Kyocera ECOSYS MA3500cifx A4 컬러복합기",
    monthly: "월 40,000원~",
    image: "https://hbsys.kr/data/item/1765328630/thumb-6rWQ7IS46528MA3500cifx_1_600x600.png",
    href: "https://hbsys.kr/shop/item.php?it_id=1765328630",
  },
  {
    id: "p-epson-emc800",
    category: "엡손 · A4 컬러 잉크젯",
    name: "EPSON EM-C800 A4 컬러잉크젯복합기",
    monthly: "월 40,000원~",
    image: "https://hbsys.kr/data/item/1764744452/thumb-7Jeh7IaQEMC800_1_600x600.png",
    href: "https://hbsys.kr/shop/item.php?it_id=1764744452",
  },
  {
    id: "p-kyocera-ma2100",
    category: "교세라 · A4 컬러 (가성비)",
    name: "Kyocera ECOSYS MA2100cfx A4 컬러복합기",
    monthly: "월 29,000원~",
    image: "https://hbsys.kr/data/item/1765265866/thumb-6rWQ7IS46528MA2100cfx_1_600x600.png",
    href: "https://hbsys.kr/shop/item.php?it_id=1765265866",
    badge: "HOT",
  },
  {
    id: "p-epson-l6290",
    category: "엡손 · A4 컬러 (가성비)",
    name: "EPSON L6290 A4 컬러잉크젯복합기",
    monthly: "월 27,000원~",
    image: "https://hbsys.kr/data/item/1764744467/thumb-7Jeh7IaQL6290_600x600.png",
    href: "https://hbsys.kr/shop/item.php?it_id=1764744467",
    badge: "HOT",
  },
];

export const RENTAL_SHOP_URL = "https://hbsys.kr/shop/";
