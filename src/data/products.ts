export type Product = {
  id: string;
  category: string;
  name: string;
  monthly: string;
  image: string;
  badge?: string;
};

// hbsys.kr 일러스트 재사용 + Unsplash placeholder
export const products: Product[] = [
  {
    id: "p-a3-color",
    category: "A3 컬러 복합기",
    name: "A3 컬러 복합기 (TASKalfa 2554ci)",
    monthly: "월 39,000원~",
    image: "https://hbsys.kr/theme/template/img/main/rental_imgtxt1.svg",
    badge: "BEST",
  },
  {
    id: "p-a3-mono",
    category: "A3 흑백 복합기",
    name: "A3 흑백 복합기 (TASKalfa 3554i)",
    monthly: "월 29,000원~",
    image: "https://hbsys.kr/theme/template/img/main/rental_imgtxt2.svg",
  },
  {
    id: "p-a4-laser",
    category: "A4 레이저 복합기",
    name: "A4 레이저 복합기 (ECOSYS M2735dw)",
    monthly: "월 19,000원~",
    image: "https://hbsys.kr/theme/template/img/main/rental_imgtxt3.svg",
    badge: "HOT",
  },
  {
    id: "p-shredder",
    category: "문서세단기",
    name: "사무용 문서세단기 (S-1200)",
    monthly: "월 9,900원~",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=70&auto=format",
  },
  {
    id: "p-handprint",
    category: "핸드프린터",
    name: "핸디 잉크젯 프린터 (HJ-12)",
    monthly: "월 14,000원~",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&q=70&auto=format",
  },
  {
    id: "p-label",
    category: "라벨프린터",
    name: "산업용 라벨프린터 (TLP-300)",
    monthly: "월 11,000원~",
    image: "https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=600&q=70&auto=format",
  },
];
