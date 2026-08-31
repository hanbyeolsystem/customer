// GEO/AEO: 서비스·가격 구조화 데이터 헬퍼.
//
// 원칙
//  - 회사는 layout.tsx 의 LocalBusiness 한 곳에서만 선언하고, 여기서는 businessId 로 참조만 한다.
//  - 서비스 @id 는 layout.tsx 의 serviceCatalog 와 반드시 같은 값이어야 한 엔티티로 합쳐진다.
//  - 금액은 사장님 확정가만 쓴다. 전부 "부터" 가격이고 VAT 별도라서 minPrice + 부가세 미포함으로 표기한다.

import { businessId, site } from "@/data/site";
import lastmod from "@/data/lastmod.json";

/** 서비스 페이지 경로("/nas/")를 서비스 엔티티 @id 로 바꾼다. layout.tsx 와 공용. */
export function serviceId(path: string) {
  return `${site.url}${path}#service`;
}

// ── 페이지 갱신일 ────────────────────────────────────────────────────────────
// 출처는 사이트맵 lastmod 와 같다: git 커밋 날짜(scripts/gen-lastmod.mjs → lastmod.json).
// 하드코딩하거나 new Date() 로 바꾸지 말 것 - 하루 3번 도는 재빌드 크론 때문에
// "전 페이지가 매일 수정됨"이 되어 구글이 갱신일 자체를 무시한다.
// 얕은 클론이면 lastmod.json 이 비어 있고, 그때는 갱신일을 아예 내보내지 않는다.

const lastmodMap: Record<string, string> = lastmod;

/** 갱신일 ISO 문자열("2026-08-28T20:52:46+09:00"). 모르면 undefined. */
export function pageUpdatedAt(path: string) {
  return lastmodMap[path];
}

/** 화면에 쓸 갱신일 "2026-08-28". 모르면 undefined. */
export function pageUpdatedDate(path: string) {
  return lastmodMap[path]?.slice(0, 10);
}

/**
 * 페이지 갱신일을 담는 WebPage 노드.
 *
 * dateModified 는 schema.org 어휘상 CreativeWork 계열 속성이라 Service/Product 에 직접
 * 붙이면 타입에 없는 속성이 된다. 그래서 페이지 자체를 WebPage 로 선언하고 거기에 날짜를 싣되,
 * mainEntity 로 그 페이지의 Service·Product @id 를 가리켜 "이 서비스 정보가 이 날짜 기준"임을
 * 한 그래프로 묶는다. 블로그 글이 BlogPosting 에 날짜를 싣는 것과 같은 구조.
 */
export function webPageLd(opts: { path: string; name: string; description?: string; mainEntityId?: string }) {
  const updated = pageUpdatedAt(opts.path);
  if (!updated) return null;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${site.url}${opts.path}#webpage`,
    url: `${site.url}${opts.path}`,
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    inLanguage: "ko-KR",
    dateModified: isoDateTime(updated),
    isPartOf: { "@id": `${site.url}/#website` },
    about: { "@id": businessId },
    publisher: { "@id": businessId },
    ...(opts.mainEntityId ? { mainEntity: { "@id": opts.mainEntityId } } : {}),
  };
}

const bizRef = { "@id": businessId };

const koreaServed = [
  { "@type": "City", name: "대구광역시" },
  { "@type": "AdministrativeArea", name: "경상북도" },
];

// 화면에 "서비스 지역"을 구·군 단위로 적은 페이지는 스키마 areaServed 도 같은 목록이어야 한다.
// 대구는 7구 2군(2023년 군위군 편입), 경북은 실제로 출장 다니는 주요 시.
export const daeguDistricts = [
  "중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군", "군위군",
] as const;
export const gyeongbukCities = [
  "구미시", "경산시", "칠곡군", "경주시", "포항시", "안동시", "영천시", "김천시", "상주시", "예천군",
] as const;

/** 대구 7구 2군 + 경북 주요 시를 areaServed 배열로. 화면 목록과 같은 출처를 쓴다. */
export const daeguGyeongbukServed = [
  { "@type": "City", name: "대구광역시" },
  ...daeguDistricts.map((d) => ({ "@type": "AdministrativeArea", name: `대구광역시 ${d}` })),
  { "@type": "AdministrativeArea", name: "경상북도" },
  ...gyeongbukCities.map((c) => ({ "@type": "AdministrativeArea", name: `경상북도 ${c}` })),
];

/** 월 정액 "부터" 가격 하나를 Offer 로 만든다. price 는 원 단위 숫자, VAT 별도. */
export function monthlyOffer(name: string, wonPerMonth: number, description?: string) {
  return {
    "@type": "Offer",
    name,
    ...(description ? { description } : {}),
    availability: "https://schema.org/InStock",
    seller: bizRef,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      priceCurrency: "KRW",
      price: wonPerMonth,
      minPrice: wonPerMonth, // 시작가("~원부터")
      unitCode: "MON",
      unitText: "월",
      valueAddedTaxIncluded: false,
    },
  };
}

/**
 * 서비스 페이지용 Service 노드.
 * id 를 layout.tsx serviceCatalog 의 id 와 맞추면 두 선언이 하나로 합쳐진다.
 */
export function serviceLd(opts: {
  id: string;
  url: string;
  name: string;
  serviceType: string;
  description: string;
  offers?: object[];
  channelUrl?: string;
  /** 화면에 서비스 지역을 구·군 단위로 적은 페이지는 daeguGyeongbukServed 를 넘겨 목록을 맞춘다. */
  areaServed?: object[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": opts.id,
    url: opts.url,
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    provider: bizRef,
    areaServed: opts.areaServed ?? koreaServed,
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: opts.channelUrl ?? opts.url,
      servicePhone: { "@type": "ContactPoint", telephone: site.phone.main, contactType: "customer service" },
    },
    ...(opts.offers?.length ? { offers: opts.offers } : {}),
  };
}

/**
 * 빵부스러기(BreadcrumbList). 홈은 자동으로 앞에 붙는다.
 * path 는 "/nas/price/" 처럼 슬래시로 끝나는 사이트 상대경로.
 */
export function breadcrumbLd(items: { name: string; path: string }[]) {
  const list = [{ name: "홈", path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${site.url}${items[items.length - 1]?.path ?? "/"}#breadcrumb`,
    itemListElement: list.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path}`,
    })),
  };
}


// 구글 구조화 데이터의 datePublished/dateModified 는 시간대가 있는 ISO 8601 을 요구한다(Search Console 경고 2026-08-29:
// "datetime 속성에 시간대가 누락됨"). 날짜만 있는 값("2026-08-22")을 KST 09:00 으로 고정 변환한다.
export function isoDateTime(d: string) {
  if (!d) return d;
  if (/T\d\d:\d\d/.test(d)) return d; // 이미 시각이 있음
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return d; // "2026-08" 같은 월 단위 값은 그대로(시각을 붙이면 잘못된 값이 됨)
  return `${d}T09:00:00+09:00`;
}
