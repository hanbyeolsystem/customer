// 시놀로지 장비 단가와 모델별 정보 - 사이트 전체가 공유하는 단일 출처.
//
// ⚠️ 금액은 시놀로지 공식 공급 단가표 기준 권장소비자가이며 전부 VAT 별도다.
//    사장님 확정가이므로 임의로 바꾸지 말 것. 여기만 고치면 /nas/price/ 와
//    /nas/model/* 가 같이 바뀐다(같은 금액을 두 곳에 적지 않기 위해 만든 파일).
// ⚠️ 2026-08-28 사장님 단가표로 갱신(본체 12종·디스크 6종).
//
// ⚠️ 하드웨어 상세 사양(CPU·RAM·확장 유닛 등)은 여기에 적지 않는다.
//    확인되지 않은 사양을 적으면 신뢰가 깨진다. 사양은 시놀로지 공식 사양표로 링크한다.

export const INSTALL_FEE = 400_000; // 출장 설치 + 설정교육 1시간
export const RENT_FROM = 100_000; // NAS 임대 월 최저가(기본 36개월)

export const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
export const vatIncl = (n: number) => Math.round(n * 1.1);

export type NasModel = {
  slug: string;
  model: string;
  bays: number;
  bayLabel: string;
  price: number | null; // null = 단가표 미등재(별도 견적)
  form: "데스크형" | "랙마운트";
  headline: string;
  fitFor: string;
  people: string;
  detail: string;
  /** 기본 추천 구성: 디스크 용량과 개수 */
  recommend: { cap: DiskCap; count: number; why: string };
  caseSlugs: string[]; // 한별시스템 실제 설치 사례
};

export type DiskCap = "4TB" | "6TB" | "8TB" | "12TB" | "16TB" | "20TB";

/** 하드디스크(3.5인치 SATA, 시놀로지 정품 NAS용) */
export const disks: { cap: DiskCap; model: string; price: number }[] = [
  { cap: "4TB", model: "HAT3300-4T", price: 372_000 },
  { cap: "6TB", model: "HAT3300-6T", price: 528_000 },
  { cap: "8TB", model: "HAT3320-8T", price: 724_000 },
  { cap: "12TB", model: "HAT3310-12T", price: 921_000 },
  { cap: "16TB", model: "HAT3310-16T", price: 1_099_000 },
  { cap: "20TB", model: "HAT3320-20T", price: 1_313_000 },
];

export const diskPrice = (cap: DiskCap) => disks.find((d) => d.cap === cap)!.price;

export const nasModels: NasModel[] = [
  {
    slug: "ds225-plus",
    model: "DS225+",
    bays: 2,
    bayLabel: "2베이",
    price: 561_000,
    form: "데스크형",
    headline: "가장 작게 시작하는 구성",
    fitFor: "직원 5~10명 사무실, 문서와 사진 위주",
    people: "5~10명",
    detail:
      "하드를 두 개 꽂는 가장 작은 플러스 라인입니다. 두 개를 같은 내용으로 묶으면(RAID 1) 한 개가 고장 나도 자료가 남습니다. 나중에 용량이 부족해지면 더 큰 하드로 갈아 끼우는 방식으로 늘려야 해서, 자료가 빠르게 늘어나는 곳이라면 처음부터 4베이를 보는 편이 낫습니다.",
    recommend: { cap: "4TB", count: 2, why: "문서·사진 위주 사무실에서 가장 많이 나가는 조합" },
    caseSlugs: [],
  },
  {
    slug: "ds425-plus",
    model: "DS425+",
    bays: 4,
    bayLabel: "4베이",
    price: 935_000,
    form: "데스크형",
    headline: "4베이를 가장 싸게 가는 길",
    fitFor: "베이 수는 필요하지만 예산을 조이는 사무실",
    people: "5~15명",
    detail:
      "베이가 네 개라 처음에 두 개만 꽂아 두고 나중에 두 개를 더 넣는 식으로 늘릴 수 있습니다. 같은 4베이인 DS925+보다 본체 값이 낮아, 확장 여지는 두되 초기 비용을 낮추고 싶을 때 선택합니다.",
    recommend: { cap: "8TB", count: 2, why: "베이 2칸을 비워 두고 나중에 증설하는 구성" },
    caseSlugs: [],
  },
  {
    slug: "ds925-plus",
    model: "DS925+",
    bays: 4,
    bayLabel: "4베이",
    price: 1_402_000,
    form: "데스크형",
    headline: "한별시스템이 가장 많이 설치한 모델",
    fitFor: "직원 10~30명 사무실, 공공기관, 설계·제조",
    people: "10~30명",
    detail:
      "대구·경북 현장에서 가장 자주 나가는 구성입니다. 행복북구문화재단, 경북 예천 사무실, 창원 사무실, NAS 복구 후 재구축 현장 모두 이 모델로 잡았습니다. 사내 AI(로컬 LLM)를 얹는 2단계 구성을 검토할 때도 RAM을 늘려 쓸 수 있어 기준 모델로 봅니다.",
    recommend: { cap: "8TB", count: 2, why: "직원 10~30명 사무실에서 가장 무난한 시작 구성" },
    caseSlugs: [
      "bukgu-culture-foundation-ds925",
      "yecheon-office-ds925",
      "changwon-office-ds925",
      "daegu-office-ds925-hdd",
      "nas-recovery-ds925",
      "two-site-ds925-ds1515",
    ],
  },
  {
    slug: "ds1525-plus",
    model: "DS1525+",
    bays: 5,
    bayLabel: "5베이",
    price: 2_058_000,
    form: "데스크형",
    headline: "4베이로는 모자라고 8베이는 과할 때",
    fitFor: "자료 증가 속도가 빠른 중간 규모",
    people: "20~40명",
    detail:
      "베이가 다섯 개라 RAID 5나 SHR로 묶었을 때 쓸 수 있는 실제 용량이 4베이보다 여유 있습니다. 지금은 4베이로 충분하지만 2~3년 뒤가 걱정되는 경우에 검토합니다.",
    recommend: { cap: "8TB", count: 3, why: "RAID 5로 묶어 여유 용량을 확보하는 구성" },
    caseSlugs: [],
  },
  {
    slug: "ds1825-plus",
    model: "DS1825+",
    bays: 8,
    bayLabel: "8베이",
    price: 2_460_000,
    form: "데스크형",
    headline: "도면·영상이 계속 쌓이는 곳",
    fitFor: "건축·설계사무소, 영상·디자인, 대용량 업종",
    people: "30명 이상",
    detail:
      "랙마운트까지 가지 않고 데스크형에서 확보할 수 있는 최대 베이 수입니다. 대구 북구 건축사무소 현장에서 도면 자료를 담기 위해 이 모델로 잡았습니다. 단순 자료 보관이 목적이라면 굳이 랙마운트를 쓰지 않아도 되는 경우가 많습니다.",
    recommend: { cap: "16TB", count: 4, why: "도면·영상처럼 큰 파일이 계속 쌓이는 현장 기준" },
    caseSlugs: ["bukgu-architect-ds1825"],
  },
  {
    slug: "rs2421-plus",
    model: "RS2421+",
    bays: 12,
    bayLabel: "12베이 랙마운트",
    price: null,
    form: "랙마운트",
    headline: "서버랙에 넣는 기업용 구성",
    fitFor: "대학·병원·기관처럼 자료 종류와 양이 모두 많은 곳",
    people: "기관 단위",
    detail:
      "데스크형(DS)과 달리 서버랙에 장착하는 기업 전용 제품군입니다. 보관할 데이터가 많고 본격적인 관리가 필요할 때 선택합니다. 성운대학교 서버 구축을 이 모델로 진행했습니다. 단가표에 올라 있지 않아 구성에 따라 별도 견적으로 안내합니다.",
    recommend: { cap: "8TB", count: 4, why: "랙마운트는 슬롯이 많아 용량을 단계적으로 늘리는 편" },
    caseSlugs: ["university-rs2421"],
  },
];

export const nasModelBySlug = (slug: string) => nasModels.find((m) => m.slug === slug);

/** 본체 + 디스크 n개 + 출장 설치비 합계(VAT 별도) */
export function quote(model: NasModel, cap: DiskCap, count: number) {
  const gear = (model.price ?? 0) + diskPrice(cap) * count;
  const net = gear + INSTALL_FEE;
  return { gear, net, vat: vatIncl(net) };
}

// 단가표에는 있지만 설명을 확인하지 못해 /nas/model/ 착지 페이지를 만들지 않은 본체.
// 여기에 headline·fitFor 같은 소개 문구를 지어내 붙이지 말 것(얇은 페이지 금지).
export const extraBodies = [
  { model: "DS124", bays: 1, price: 242_000 },
  { model: "DS223j", bays: 2, price: 316_000 },
  { model: "DS223", bays: 2, price: 466_000 },
  { model: "DS725+", bays: 2, price: 1_309_000 },
  { model: "DS423", bays: 4, price: 654_000 },
  { model: "DS620slim", bays: 6, price: 840_000, note: "2.5인치 드라이브 전용" },
  { model: "DS2422+", bays: 12, price: 3_367_000 },
];

/** 본체 단가표 전체(모델 페이지가 있는 것은 slug 로 연결). 별도 견적 모델은 빠진다. */
export const unitPrices: {
  model: string;
  bays: number;
  bayLabel: string;
  price: number;
  slug?: string;
  note?: string;
}[] = [
  ...nasModels
    .filter((m) => m.price)
    .map((m) => ({ model: m.model, bays: m.bays, bayLabel: m.bayLabel, price: m.price!, slug: m.slug })),
  ...extraBodies.map((b) => ({ ...b, bayLabel: `${b.bays}베이` })),
].sort((a, b) => a.bays - b.bays || a.price - b.price);

/** 본체 최저가(1베이 보급형 기준) */
export const bodyLow = Math.min(...unitPrices.map((u) => u.price));

// /nas/price/ 규모별 견적표와 /nas/buy/ 판매가 예시가 공유하는 표준 구성.
export const standardConfigs: {
  slug: string;
  cap: DiskCap;
  count: number;
  tier: string;
  target: string;
  note: string;
}[] = [
  { slug: "ds225-plus", cap: "4TB", count: 2, tier: "소규모", target: "직원 5~10명 사무실", note: "가장 많이 나가는 입문 구성" },
  { slug: "ds925-plus", cap: "8TB", count: 2, tier: "중간", target: "직원 10~30명", note: "베이 2칸을 남겨 두고 나중에 증설" },
  { slug: "ds925-plus", cap: "8TB", count: 4, tier: "중간+", target: "자료량이 많은 10~30명", note: "처음부터 베이를 다 채우는 구성" },
  { slug: "ds1825-plus", cap: "16TB", count: 4, tier: "대용량", target: "건축·설계 등 대용량 업종", note: "도면·영상 등 큰 파일이 계속 쌓이는 곳" },
];

/** 표준 구성별 장비값·합계·VAT 포함 금액 */
export const standardQuotes = standardConfigs.map((c) => {
  const model = nasModelBySlug(c.slug)!;
  return { ...c, model, ...quote(model, c.cap, c.count) };
});

/** 장비 + 출장 설치까지 포함한 최저 판매가(VAT 별도) */
export const BUY_FROM = Math.min(...standardQuotes.map((q) => q.net));
