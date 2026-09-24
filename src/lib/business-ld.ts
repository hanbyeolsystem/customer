// 회사 엔티티(LocalBusiness) 구조화 데이터. 원래는 통째로 layout.tsx 에 있어 703개 페이지마다
// 23KB(HTML 10KB + RSC 11KB)씩 실렸다. 블로그 글 하나를 읽는 사람에게 서비스 9종 설명과
// 지역 28곳 목록까지 내려보낼 이유가 없어 2026-09-18 에 둘로 나눴다.
//
//  - businessCore : 모든 페이지. 이름·전화·주소·좌표·영업시간(NAP). 약 1KB.
//  - businessDetail : 대표 화면(홈·회사소개·연락처)에만. sameAs·areaServed·knowsAbout·서비스 목록.
//    @id 가 businessCore 와 같으므로 검색엔진은 두 조각을 한 회사로 합쳐 읽는다.
//
// 서비스 @id 는 각 서비스 페이지의 serviceLd() 선언과 반드시 일치시킬 것(하나의 엔티티로 합쳐진다).
import { businessId, site } from "@/data/site";
import { daeguGyeongbukServed, serviceId } from "@/lib/schema";
import { BUY_FROM, bodyLow, won } from "@/data/synology";

export const BUSINESS_ID = businessId;
const WEBSITE_ID = `${site.url}/#website`;

// 한별시스템이 실제로 제공하는 서비스 (구글 비즈니스 프로필 서비스 목록과 동일 범위)
const serviceCatalog = [
  // alt: 검색·AI 가 쓰는 한글 표기("나스")와 지역어. "대구 나스"는 화장품·상호와 겹치는 다의어라 서비스명에 명시한다.
  { id: serviceId("/nas/"), url: `${site.url}/nas/`, name: "기업용 NAS 구축·데이터 백업", alt: ["대구 나스 구축", "대구 NAS 설치", "대구 나스 업체"], desc: "시놀로지 NAS 설치, RAID 설계, 3-2-1 백업 구성, 랜섬웨어 대비, VPN 원격접속. 구축 실적 100건 이상." },
  { id: serviceId("/nas/buy/"), url: `${site.url}/nas/buy/`, name: "시놀로지 NAS 판매·납품", alt: ["대구 나스 판매", "대구 시놀로지 나스 구매"], desc: `시놀로지 공식 대리점 정품 NAS 판매. 1베이 DS124부터 12베이 DS2422+까지 본체 ${won(bodyLow)}부터, 사무실 표준 구성은 하드디스크와 출장 설치·설정교육까지 ${won(BUY_FROM)}부터(VAT 별도). 대구·경북 직접 납품·설치.` },
  { id: serviceId("/rental/"), url: `${site.url}/rental/`, name: "복합기·프린터 렌탈(임대)", desc: "흑백 복사기 월 7만원부터, 컬러 복사기 월 10만원부터(VAT 별도). 월 정액에 토너 등 소모품, 부품 교체, 출장 수리, 분기 정기점검 포함. 설치·운영 300대 이상." },
  { id: serviceId("/support/"), url: `${site.url}/support/`, name: "기업 전산 유지관리", desc: "컴퓨터·복합기·NAS·네트워크를 한 회사가 통합 관리하는 올인원 전산 유지보수. 관리 고객사 500곳 이상." },
  { id: `${site.url}/support/#repair-service`, url: `${site.url}/support/`, name: "컴퓨터 수리", desc: "대구 지역 출장 컴퓨터 수리, 사무실 PC 표준화, 데이터 복구." },
  { id: serviceId("/rental/pc/"), url: `${site.url}/rental/pc/`, name: "사무용 컴퓨터 렌탈(임대)", alt: ["대구 컴퓨터 렌탈", "대구 PC 임대"], desc: "사무실 전용 컴퓨터 렌탈. 데스크탑+모니터 세트 월 40,000원부터(VAT 별도). 업무에 맞춘 조립형 PC 사양, 설치·초기 세팅 방문, 고장 수리 포함." },
  { id: serviceId("/network/"), url: `${site.url}/network/`, name: "사무실 네트워크·랜공사·데이터 백업 구축", desc: "CAT6 이상 랜 배선 시공, 공유기·스위치 구성, 서버·NAS 설치, 공유 폴더와 권한 설정, 3-2-1 데이터 백업 구축, VPN 원격접속, 인터넷 장애 진단까지 한 회사에서 시공. 대구·경북 중심 50개사 이상 실적." },
  { id: serviceId("/ai/"), url: `${site.url}/ai/`, name: "사내 AI 도입(온프레미스 LLM)·데이터 관리 컨설팅", desc: "회사 자료를 외부로 내보내지 않고 사내 NAS 안에서 AI가 검색·요약하도록 구성한다. 한별시스템이 자사 NAS(Ryzen V1500B·4GB)에서 로컬 LLM 컨테이너를 2026년 8월부터 직접 운영하며 검증한 방식이며, 고객사는 상담·파일럿 단계로 진행한다." },
  { id: `${site.url}/#web-service`, url: site.url, name: "홈페이지 제작·관리", desc: "검색과 AI 검색 노출을 고려한 기업 홈페이지 설계·제작·유지관리." },
];

// 모든 페이지에 들어가는 최소 신원(NAP). 지역 검색은 페이지마다 이 정보를 본다.
const businessCore = {
  "@type": "LocalBusiness",
  "@id": BUSINESS_ID,
  name: site.name,
  url: site.url,
  // 대표전화와 대표 휴대전화 둘 다. 출장이 잦아 대표번호를 못 받을 때 휴대전화로 연락이 가야 한다.
  telephone: [site.phone.main, site.phone.mobile],
  email: site.email,
  // 리치 검색결과 테스트(2026-08-29) 권장 항목. 월 임대 3만원부터 NAS 구축 300만원대까지(사이트 게시가 기준).
  priceRange: "₩30,000 - ₩3,000,000",
  // logo 는 icon-512.png(PNG) 그대로 둔다 - 구글 로고 슬롯은 PNG 가 가장 안전하다.
  logo: `${site.url}/icons/icon-512.png`,
  image: [`${site.url}/icons/icon-512.png`, `${site.url}/brand/logo.webp`],
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.streetOnly,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: "42699", // 문화회관11안길 22-7 (장동 868-3) 우편번호
    addressCountry: "KR",
  },
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  openingHours: "Mo-Fr 09:00-18:00",
};

// GEO/AEO: AI·검색엔진이 회사 정보를 "확인된 사실"로 읽게 하는 구조화 데이터.
// Organization 을 따로 두면 같은 회사가 두 엔티티로 쪼개지므로 만들지 않는다.
// 다른 페이지(QAPage 등)에서 author 를 쓸 때는 BUSINESS_ID 를 참조할 것.
export const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [
    businessCore,
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "ko-KR",
      publisher: { "@id": BUSINESS_ID },
    },
  ],
};

// 대표 화면에서만 덧붙이는 상세 정보. @id 가 같아 businessCore 와 한 회사로 합쳐진다.
export const businessDetailLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": BUSINESS_ID,
  alternateName: [site.nameEn, "대구 한별시스템"],
  description: site.description,
  founder: { "@type": "Person", name: site.address.ceo },
  // 동명 업체와 구분되는 법적 식별자 (사업자등록번호)
  identifier: { "@type": "PropertyValue", name: "사업자등록번호", value: site.address.bizNo },
  taxID: site.address.bizNo,
  foundingDate: site.foundingDate,
  foundingLocation: { "@type": "Place", name: "대구광역시 달서구 성서공단" },
  slogan: "전산은 전화 한 통",
  hasMap: site.social.googleMaps,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  sameAs: [
    site.social.blog,
    site.social.instagramBiz,
    site.social.instagram,
    site.social.threads,
    site.social.googleMaps,
    // 지도·플레이스 등재(네이버·카카오). 구글 지도와 함께 세 지도에서 같은 회사로 묶인다.
    site.listings.naverPlace,
    site.listings.kakaoPlace,
    site.listings.daangnProfile,
    // 한별시스템이 직접 운영하는 다른 사이트들. 같은 회사임을 검색·AI 가 알게 한다.
    ...site.owned,
  ],
  // 서비스 지역: 대구 7구 2군 + 경북 시군 + 경남(창원·마산·창녕) 을 시군 단위로(schema.ts 한 곳). 전국은 1영업일 대응.
  areaServed: [
    { "@type": "AdministrativeArea", name: "대구광역시 달서구" },
    { "@type": "Place", name: "성서공단" },
    ...daeguGyeongbukServed,
    { "@type": "Country", name: "대한민국" },
  ],
  knowsAbout: [
    "기업 데이터 관리", "사내 AI 구축", "온프레미스 LLM", "RAG 문서검색", "Ollama",
    "NAS 구축", "시놀로지 NAS", "데이터 백업", "랜섬웨어 대응", "복합기 렌탈",
    "프린터 임대", "토너 교체", "컴퓨터 수리", "데이터 복구", "사무실 네트워크",
    "랜공사", "데이터 백업 구축", "공유 폴더 설정", "파일 서버 구축", "VPN 원격접속",
    "기업 IT 유지관리", "홈페이지 제작",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "한별시스템 서비스",
    itemListElement: serviceCatalog.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        "@id": s.id,
        url: s.url,
        name: s.name,
        ...(s.alt ? { alternateName: s.alt } : {}),
        description: s.desc,
        provider: { "@id": BUSINESS_ID },
        areaServed: [
          { "@type": "City", name: "대구광역시" },
          { "@type": "AdministrativeArea", name: "경상북도" },
          { "@type": "AdministrativeArea", name: "경상남도" },
        ],
      },
    })),
  },
};
