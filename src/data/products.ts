export type Product = {
  id: string;
  category: string;
  name: string;
  monthly: string;
  image: string;
  href: string;       // hbsys.kr 상품 상세 URL
  badge?: string;
};

// 한별 임대 쇼핑몰(hbsys.kr) 실제 상품을 카테고리별 대표 1개씩 노출
// 카드 클릭 시 hbsys.kr 상품 상세 페이지로 새 탭 이동
export const products: Product[] = [
  {
    id: "p-a3-color-laser",
    category: "A3 컬러 레이저복합기",
    name: "리코 IM C3010 A3 컬러복합기",
    monthly: "월 100,000원~",
    image: "https://hbsys.kr/data/item/1765869366/thumb-IMC3010_600x600.png",
    href: "https://hbsys.kr/shop/item.php?it_id=1765869366",
    badge: "BEST",
  },
  {
    id: "p-a3-mono-laser",
    category: "A3 흑백 레이저복합기",
    name: "리코 IM 2500 A3 흑백복합기",
    monthly: "월 60,000원~",
    image: "https://hbsys.kr/data/item/1765870213/thumb-IM2500_600x600.png",
    href: "https://hbsys.kr/shop/item.php?it_id=1765870213",
  },
  {
    id: "p-a4-color-laser",
    category: "A4 컬러 레이저복합기",
    name: "브라더 MFC-L8900CDW A4 컬러복합기",
    monthly: "월 40,000원~",
    image: "https://hbsys.kr/data/item/1765330745/thumb-67iM6528642UMFCL8900CDW_600x600.png",
    href: "https://hbsys.kr/shop/item.php?it_id=1765330745",
  },
  {
    id: "p-a3-inkjet",
    category: "A3 잉크젯복합기",
    name: "HP 9730 A3 컬러잉크젯복합기",
    monthly: "월 40,000원~",
    image: "https://hbsys.kr/data/item/1764744464/thumb-hp9730_600x600.png",
    href: "https://hbsys.kr/shop/item.php?it_id=1764744464",
    badge: "HOT",
  },
  {
    id: "p-pc-notebook",
    category: "컴퓨터·노트북",
    name: "전문가용 인텔 i7 11세대 / 삼성·LG그램",
    monthly: "월 70,000원~",
    image: "https://hbsys.kr/data/item/1766033623/thumb-7KCE66y46rCA7Jqp64W47Yq467aB_600x600.png",
    href: "https://hbsys.kr/shop/item.php?it_id=1766033623",
  },
  {
    id: "p-monitor-tv",
    category: "대형 디스플레이",
    name: "프리즘코리아 SMART QLED TV 85형 4K",
    monthly: "월 750,000원~",
    image: "https://hbsys.kr/data/item/1765945099/thumb-85TV_600x600.png",
    href: "https://hbsys.kr/shop/item.php?it_id=1765945099",
  },
];

// 임대 쇼핑몰 메인 (전체보기 버튼)
export const RENTAL_SHOP_URL = "https://hbsys.kr/shop/";
