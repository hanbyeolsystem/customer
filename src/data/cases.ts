export type CaseStudy = {
  id: string;
  industry: string;
  title: string;
  summary: string;
  scale: string;
  tags: string[];
  image: string;
  href: string; // 네이버 블로그 실제 후기 글
};

// 네이버 블로그(blog.naver.com/hanbyeolsystem) 실제 시공 "후기" 글 + 현장 사진 기반
export const caseStudies: CaseStudy[] = [
  {
    id: "case-ds1825",
    industry: "건축사무소",
    title: "건축사무소 — 시놀로지 DS1825+ 서버 설치",
    summary:
      "대용량 도면·설계 자료를 안전하게 보관·공유. DS1825+ 설치로 자료 관리를 일원화한 실제 현장.",
    scale: "대구·경북 · Synology DS1825+",
    tags: ["NAS 구축", "시놀로지", "도면관리"],
    image: "/cases/ds1825.png",
    href: "https://blog.naver.com/hanbyeolsystem/224269459051",
  },
  {
    id: "case-rs2421",
    industry: "대학교·기업",
    title: "회사 사무실·대학교 — 시놀로지 RS2421+ 서버 구축",
    summary:
      "랙마운트 RS2421+로 대량 자료 저장·공유 환경을 구축. 안전한 백업과 권한 관리까지 시공.",
    scale: "랙마운트 · Synology RS2421+",
    tags: ["서버 구축", "랙마운트", "백업"],
    image: "/cases/rs2421.png",
    href: "https://blog.naver.com/hanbyeolsystem/224266056667",
  },
  {
    id: "case-ds925",
    industry: "사무실",
    title: "사무실 — 시놀로지 DS925+ HDD 세팅·설치",
    summary:
      "회사 데이터를 안전하게 — DS925+ HDD 세팅부터 설치·운영자 인계까지 진행한 현장 후기.",
    scale: "대구·경북 · Synology DS925+",
    tags: ["NAS 구축", "HDD 세팅", "데이터 백업"],
    image: "/cases/ds925.png",
    href: "https://blog.naver.com/hanbyeolsystem/224263900340",
  },
  {
    id: "case-changwon",
    industry: "사무실",
    title: "창원 사무실 — 시놀로지 NAS 설치·서버 관리",
    summary:
      "대구를 넘어 창원까지. 사무실 NAS 설치와 이후 서버 관리까지 맡아 진행한 시공 후기.",
    scale: "창원 · 시놀로지 NAS",
    tags: ["NAS 구축", "서버 관리", "원격지원"],
    image: "/cases/changwon.png",
    href: "https://blog.naver.com/hanbyeolsystem/224292586801",
  },
  {
    id: "case-kyocera",
    industry: "복합기 임대",
    title: "복합기 임대 — 교세라 TASKalfa VFM251ci 설치",
    summary:
      "정부조달 제품까지 꼼꼼하게. 동선과 인쇄량에 맞춰 복합기를 설치·세팅한 임대 현장.",
    scale: "대구·경북 · 교세라 TASKalfa",
    tags: ["복사기 임대", "교세라", "설치"],
    image: "/cases/kyocera.png",
    href: "https://blog.naver.com/hanbyeolsystem/224255706197",
  },
  {
    id: "case-lan",
    industry: "네트워크 공사",
    title: "사무실 랜공사 — 인터넷 선정리·컴퓨터 연결 시공",
    summary:
      "어지러운 배선을 깔끔하게. 사무실 랜공사와 선정리, 컴퓨터 연결까지 마무리한 시공 후기.",
    scale: "대구 사무실 · 랜공사·선정리",
    tags: ["랜공사", "선정리", "네트워크"],
    image: "/cases/lan.png",
    href: "https://blog.naver.com/hanbyeolsystem/224182683885",
  },
];
