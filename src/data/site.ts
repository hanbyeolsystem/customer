// 한별시스템 사이트 전역 콘텐츠 — 수정만으로 사이트 유지보수 가능

export const site = {
  name: "한별시스템",
  nameEn: "HANBYEOL SYSTEM",
  tagline: "기업 데이터와 업무환경을 책임지는 IT 파트너",
  description:
    "NAS 구축 · 데이터 백업 · 복사기 임대 · IT 유지관리. 대구·경북 기업의 든든한 IT 파트너 한별시스템.",
  url: "https://xn--bm3bm1i1e348cgwe.kr",

  phone: {
    main: "053-951-1177",
    mainHref: "tel:053-951-1177",
    mobile: "010-4585-6890",
    mobileHref: "tel:010-4585-6890",
    hours: "평일 09:00 ~ 18:00",
  },

  email: "acapaper78@gmail.com",

  address: {
    street: "대구광역시 달서구 문화회관11안길 22-7 1층",
    bizNo: "514-22-73057",
    mailOrder: "제2010-대구달서-0190호",
    ceo: "김상환",
  },

  social: {
    blog: "https://blog.naver.com/hanbyeolsystem",
    instagram: "https://instagram.com/hanbyeolsystem",
    threads: "https://www.threads.net/@hanbyeolsystem",
  },

  stats: [
    { value: "500+", label: "관리 고객사" },
    { value: "300+", label: "NAS 구축" },
    { value: "1000+", label: "복사기 설치" },
    { value: "15+", label: "운영 연수" },
  ],
} as const;

export const nav = [
  { href: "/", label: "홈" },
  { href: "/nas", label: "NAS 솔루션" },
  { href: "/rental", label: "복사기 임대" },
  { href: "/shop", label: "임대 쇼핑몰" },
  { href: "/cases", label: "구축사례" },
  { href: "/support", label: "고객지원" },
  { href: "/support/drivers", label: "드라이버" },
  { href: "/blog", label: "블로그" },
  { href: "/about", label: "회사소개" },
] as const;
