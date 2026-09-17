// 복합기·프린터·PC·NAS 월 임대료 - 단일 출처(2026-09-17 가격 페이지에서 옮김).
// /rental/price/ 표, /rental/pc/, /rental/area/* 가 모두 여기서 읽는다.
// price(화면 문구)와 monthly(숫자)는 같은 값이어야 한다. 바꾸면 /rental/price/ 스키마 offers 도 같이 확인.
// 사장님 확정 월 임대료. 전부 "부터" 가격이며 VAT 별도. 임의 변경 금지.
// NAS 월 10만원은 /nas/price/ 게시 금액과 반드시 일치시킬 것.
export const rentalPrices: { item: string; price: string; note: string; monthly: number; href?: string; hrefLabel?: string }[] = [
  {
    item: "흑백 레이저 프린터",
    monthly: 30000,
    price: "월 30,000원부터",
    note: "인쇄만 하는 소량 사무실",
  },
  {
    item: "잉크젯 무한 프린터",
    monthly: 40000,
    price: "월 40,000원부터",
    note: "컬러 출력이 필요하고 장수가 많지 않은 곳",
  },
  {
    item: "컬러 레이저 프린터",
    monthly: 50000,
    price: "월 50,000원부터",
    note: "컬러 인쇄가 잦고 속도가 필요한 곳",
  },
  {
    item: "흑백 복사기 (흑백 디지털복합기)",
    monthly: 70000,
    price: "월 70,000원부터",
    note: "복사·스캔·팩스를 같이 쓰는 일반 사무실",
  },
  {
    item: "컬러 복사기 (컬러 디지털복합기)",
    monthly: 100000,
    price: "월 100,000원부터",
    note: "컬러 자료와 제안서를 자주 뽑는 곳",
  },
  {
    item: "데스크탑 + 모니터 세트",
    monthly: 40000,
    price: "월 40,000원부터",
    note: "데스크탑 35,000원 + 모니터 5,000원",
    href: "/rental/pc/",
    hrefLabel: "컴퓨터 렌탈 상세 보기",
  },
  {
    item: "시놀로지 NAS",
    monthly: 100000,
    price: "월 100,000원부터",
    note: "기본 계약 36개월, 백업 관리까지 포함",
    href: "/nas/price/",
    hrefLabel: "NAS 임대 상세 보기",
  },
];

export const rentalPrice = (item: string) => rentalPrices.find((p) => p.item === item)!;

// 화면 문구와 숫자가 어긋나면 빌드에서 바로 멈춘다(두 값을 따로 고치는 실수 방지).
for (const p of rentalPrices) {
  const want = `월 ${p.monthly.toLocaleString("ko-KR")}원부터`;
  if (p.price !== want) throw new Error(`rental-prices: ${p.item} price "${p.price}" != "${want}"`);
}
