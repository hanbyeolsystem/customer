// GEO/AEO: 서비스·가격 구조화 데이터 헬퍼.
//
// 원칙
//  - 회사는 layout.tsx 의 LocalBusiness 한 곳에서만 선언하고, 여기서는 businessId 로 참조만 한다.
//  - 서비스 @id 는 layout.tsx 의 serviceCatalog 와 반드시 같은 값이어야 한 엔티티로 합쳐진다.
//  - 금액은 사장님 확정가만 쓴다. 전부 "부터" 가격이고 VAT 별도라서 minPrice + 부가세 미포함으로 표기한다.

import { businessId, site } from "@/data/site";

/** 서비스 페이지 경로("/nas/")를 서비스 엔티티 @id 로 바꾼다. layout.tsx 와 공용. */
export function serviceId(path: string) {
  return `${site.url}${path}#service`;
}

const bizRef = { "@id": businessId };

const koreaServed = [
  { "@type": "City", name: "대구광역시" },
  { "@type": "AdministrativeArea", name: "경상북도" },
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
    areaServed: koreaServed,
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: opts.channelUrl ?? opts.url,
      servicePhone: { "@type": "ContactPoint", telephone: site.phone.main, contactType: "customer service" },
    },
    ...(opts.offers?.length ? { offers: opts.offers } : {}),
  };
}
