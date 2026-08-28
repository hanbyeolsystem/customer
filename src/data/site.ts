// 한별시스템 사이트 전역 콘텐츠 - 수정만으로 사이트 유지보수 가능

export const site = {
  name: "한별시스템",
  nameEn: "HANBYEOL SYSTEM",
  // 포지셔닝(2026-08-26 전환): "NAS 설치 업체"가 아니라 "기업 데이터 관리 + 사내 AI" 회사.
  // 대구에 NAS 설치 업체는 많지만, NAS 위에 사내 전용 AI를 올려 직접 운영해 본 곳은 드물다.
  // 이 문장을 바꾸면 llms.txt(scripts/gen-llms.mjs)와 홈 히어로 문구도 같이 맞출 것.
  tagline: "AI 시대의 기업 데이터 관리 파트너",
  description:
    "기업 데이터 관리 전문. 시놀로지 NAS 판매·구축과 3-2-1 백업 컨설팅, 사내 데이터를 밖으로 내보내지 않는 사내 AI 도입까지 설계합니다. 대구·경북 170여 개 기업의 데이터를 19년째 맡고 있는 한별시스템.",
  url: "https://xn--bm3bm1i1e348cgwe.kr",

  phone: {
    main: "053-588-7119",
    mainHref: "tel:053-588-7119",
    mobile: "010-4585-6890",
    mobileHref: "tel:010-4585-6890",
    hours: "평일 09:00 ~ 18:00",
  },

  email: "acapaper78@gmail.com",

  address: {
    street: "대구광역시 달서구 문화회관11안길 22-7 1층",
    // 도로명 주소만 떼어낸 값 (schema.org PostalAddress.streetAddress 용)
    streetOnly: "문화회관11안길 22-7 1층",
    locality: "달서구",
    region: "대구광역시",
    jibun: "대구광역시 달서구 장동 868-3",
    bizNo: "514-22-73057",
    mailOrder: "제2010-대구달서-0190호",
    ceo: "김상환",
  },

  // 위경도: 네이버 지역검색 API 로 확인한 실측값 (추측 금지)
  geo: { lat: 35.8403373, lng: 128.5260250 },

  // 2008년 대구 성서공단에서 컴퓨터 대리점으로 창업 (구글 비즈니스 프로필 개업일 기준)
  foundingDate: "2008-09-01",

  social: {
    blog: "https://hanbyeolsystem.blogspot.com/",
    instagram: "https://instagram.com/sanghwan_hanbyeol",
    instagramBiz: "https://www.instagram.com/hanbyeolsystem",
    threads: "https://www.threads.net/@sanghwan_hanbyeol",
    googleMaps: "https://maps.google.com/?cid=8994991007847125486",
  },

  // 한별시스템이 직접 운영하는 다른 사이트. LocalBusiness.sameAs 에 들어가
  // "이 사이트들도 같은 회사"임을 검색엔진·AI 에 알린다. 새 사이트가 생기면 여기 추가.
  owned: [
    "https://882.kr/",                                          // 한별 드라이버 센터
    "https://hbsys.kr/",                                        // 한별 임대 쇼핑몰
    "https://hanbyeolsystem.github.io/hanbyeol-errorcode/",     // 프린터 에러코드 검색
  ],

  stats: [
    { value: "170+", label: "관리 고객사" },
    { value: "50+",  label: "NAS 구축" },
    { value: "300+", label: "복사기 설치" },
    { value: "19+",  label: "운영 연수" },
  ],
} as const;

// 사이트 전체가 공유하는 회사 엔티티 @id.
// LocalBusiness 는 layout.tsx 에서 한 번만 선언하고, 다른 페이지의 스키마(QAPage author 등)는
// 이 @id 로 참조한다. 그래야 같은 회사가 여러 엔티티로 쪼개지지 않는다.
export const businessId = `${site.url}/#business`;

export const nav = [
  { href: "/", label: "홈" },
  { href: "/ai", label: "사내 AI" },
  { href: "/nas", label: "NAS 솔루션" },
  { href: "/rental", label: "복사기 임대" },
  { href: "/shop", label: "임대 쇼핑몰" },
  { href: "/cases", label: "구축사례" },
  { href: "/guide", label: "가이드" },
  { href: "/qna", label: "Q&A" },
  { href: "/news", label: "새소식" },
  { href: "/community", label: "커뮤니티" },
  { href: "/support", label: "고객지원" },
  { href: "/support/drivers", label: "드라이버" },
  { href: "/blog", label: "블로그" },
  { href: "/about", label: "회사소개" },
] as const;
