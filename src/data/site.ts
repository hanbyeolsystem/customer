// 한별시스템 사이트 전역 콘텐츠 - 수정만으로 사이트 유지보수 가능

export const site = {
  name: "한별시스템",
  nameEn: "HANBYEOL SYSTEM",
  // 포지셔닝(2026-08-26 전환): "NAS 설치 업체"가 아니라 "기업 데이터 관리 + 사내 AI" 회사.
  // 대구에 NAS 설치 업체는 많지만, NAS 위에 사내 전용 AI를 올려 직접 운영해 본 곳은 드물다.
  // 이 문장을 바꾸면 llms.txt(scripts/gen-llms.mjs)와 홈 히어로 문구도 같이 맞출 것.
  tagline: "대구·경북 기업 NAS·백업·복합기 임대, 18년째 당일 출장 가능",
  description:
    "대구·경북 500곳의 회사 자료를 18년째 맡고 있습니다. 시놀로지 NAS 판매·설치와 3-2-1 백업, 회사 자료를 밖으로 내보내지 않는 사내 AI, 복합기 임대까지. 고장은 대구·경북 당일 출장, 053-588-7119.",
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
    // 구글 비즈니스 프로필. cid 는 2026-09-19 에 바로잡았다(옛 값 8994991007847125486 은
    // 빈 장소로 열려 푸터·연락처의 "구글 지도" 링크와 스키마 hasMap 이 업체로 가지 않았다).
    // 확인법: 이 주소를 열면 제목이 "한별시스템" 이어야 한다.
    googleMaps: "https://maps.google.com/?cid=3373258657163471743",
    // 후기 남기기(구글 리뷰 작성 화면). 업체가 손님에게 후기를 요청하는 것은 구글이 허용한다.
    googleReview: "https://search.google.com/local/writereview?placeid=ChIJwwJH6FvlZTURf2u9W-A40C4",
  },

  // 지도·플레이스 등재. LocalBusiness.sameAs 로 내보내 "같은 회사"임을 알린다.
  // 아이디는 2026-09-01 실측으로 확인한 값이다(추측으로 바꾸지 말 것).
  //  - 네이버 플레이스 1866521598 : 카테고리 IT서비스, 대구 달서구 장동 868-3
  //  - 카카오맵 1828766417        : 053-588-7119, 대구 달서구 장동 868-3 1층
  //  - 당근 비즈프로필 2310438(관리용 ID) : 공개 주소는 아래 local-profile 해시(2026-09-07 장동 검색으로 실측).
  //    같은 이름의 다른 프로필(…-gxeidaign72h, 전화번호 없음)은 우리 것이 아니니 바꾸지 말 것.
  listings: {
    naverPlace: "https://map.naver.com/p/entry/place/1866521598",
    kakaoPlace: "https://place.map.kakao.com/1828766417",
    daangnProfile: "https://www.daangn.com/kr/local-profile/%ED%95%9C%EB%B3%84%EC%8B%9C%EC%8A%A4%ED%85%9C-8mzu5s16he1z/",
  },

  // 한별시스템이 직접 운영하는 다른 사이트. LocalBusiness.sameAs 에 들어가
  // "이 사이트들도 같은 회사"임을 검색엔진·AI 에 알린다. 새 사이트가 생기면 여기 추가.
  owned: [
    "https://882.kr/",                                          // 한별 드라이버 센터
    "https://hbsys.kr/",                                        // 한별 임대 쇼핑몰
    "https://hanbyeolsystem.github.io/hanbyeol-errorcode/",     // 프린터 에러코드 검색
  ],

  stats: [
    { value: "500+", label: "거래처" },
    { value: "100+",  label: "NAS 구축" },
    { value: "300+", label: "복사기 설치" },
    { value: "18+",  label: "운영 연수" },
  ],
} as const;

// 사이트 전체가 공유하는 회사 엔티티 @id.
// LocalBusiness 는 layout.tsx 에서 한 번만 선언하고, 다른 페이지의 스키마(QAPage author 등)는
// 이 @id 로 참조한다. 그래야 같은 회사가 여러 엔티티로 쪼개지지 않는다.
export const businessId = `${site.url}/#business`;

// 헤더 메뉴 4묶음 (2026-09-15 첫 화면 점검: 메뉴 14개에서 4개로). 주소는 그대로이고 묶음만 바꿨다.
// 여기서 빠진 페이지(회사소개·새소식·블로그·커뮤니티)는 푸터 아래 줄에 링크가 있다.
export type NavLink = { href: string; label: string; desc?: string };
export type NavItem = NavLink | { label: string; items: NavLink[] };
export const nav: NavItem[] = [
  {
    label: "서비스",
    items: [
      { href: "/nas", label: "NAS 구축·백업", desc: "시놀로지 판매·설치, 3-2-1 백업" },
      { href: "/ai", label: "사내 AI", desc: "회사 자료로 답하는 AI 도우미" },
      { href: "/rental", label: "복사기·프린터 임대", desc: "월 정액, 토너·수리 포함" },
      { href: "/network", label: "전산·네트워크 관리", desc: "PC·공유기·랜 공사·유지관리" },
      { href: "/shop", label: "임대 쇼핑몰", desc: "임대 장비 둘러보기" },
    ],
  },
  { href: "/cases", label: "구축사례" },
  {
    label: "Q&A·가이드",
    items: [
      { href: "/qna", label: "Q&A 전체 문답" },
      { href: "/guide", label: "가이드·비교표" },
      { href: "/news", label: "새소식" },
      { href: "/community", label: "커뮤니티" },
    ],
  },
  {
    label: "고객지원",
    items: [
      { href: "/support/remote", label: "원격지원" },
      { href: "/support/drivers", label: "드라이버 다운로드" },
      { href: "/support/as", label: "A/S 접수" },
      { href: "/support", label: "고객지원 전체" },
    ],
  },
];
