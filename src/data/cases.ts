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

// 네이버 블로그(blog.naver.com/hanbyeolsystem) 실제 구축·설치 후기 기반
export const caseStudies: CaseStudy[] = [
  {
    id: "case-ds1825",
    industry: "건축사무소",
    title: "대구·경북 건축사무소 — 시놀로지 DS1825+ 구축",
    summary:
      "대용량 도면·설계 자료를 안전하게 보관·공유. DS1825+ 서버 설치로 자료 관리를 일원화한 현장 후기.",
    scale: "대구·경북 · Synology DS1825+",
    tags: ["NAS 구축", "시놀로지", "도면관리"],
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=70&auto=format",
    href: "https://blog.naver.com/hanbyeolsystem/224269459051",
  },
  {
    id: "case-rs2421",
    industry: "대학교·기업",
    title: "회사 사무실·대학교 — 시놀로지 RS2421+ 서버 구축",
    summary:
      "랙마운트 RS2421+로 대량 자료 저장·공유 환경 구축. 안전한 백업과 권한 관리까지 한 번에.",
    scale: "랙마운트 · Synology RS2421+",
    tags: ["서버 구축", "랙마운트", "백업"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=70&auto=format",
    href: "https://blog.naver.com/hanbyeolsystem/224266056667",
  },
  {
    id: "case-ds925",
    industry: "사무실",
    title: "대구·경북 사무실 — 시놀로지 DS925+ 설치·세팅",
    summary:
      "회사 데이터를 안전하게 — DS925+ HDD 세팅부터 설치·운영자 인계까지 진행한 설치 후기.",
    scale: "대구·경북 · Synology DS925+",
    tags: ["NAS 구축", "HDD 세팅", "데이터 백업"],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=70&auto=format",
    href: "https://blog.naver.com/hanbyeolsystem/224263900340",
  },
  {
    id: "case-hospital",
    industry: "병원",
    title: "안동 병원 — 시놀로지 NAS 설치·서버 구축",
    summary:
      "의료 데이터의 안전한 보관과 공유. 전문 업체 시공으로 안정적인 서버 환경을 구축했습니다.",
    scale: "안동·경북 · 의료 데이터",
    tags: ["NAS 구축", "의료", "백업"],
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=70&auto=format",
    href: "https://blog.naver.com/hanbyeolsystem/224306875156",
  },
  {
    id: "case-academy",
    industry: "학원",
    title: "마산 학원·경북 사무실 — NAS 설치 구축",
    summary:
      "대구를 넘어 창원·마산까지. 학원 자료를 통합 보관·공유하는 NAS 환경을 구축했습니다.",
    scale: "창원·마산 · 시놀로지 NAS",
    tags: ["NAS 구축", "교육", "파일공유"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=70&auto=format",
    href: "https://blog.naver.com/hanbyeolsystem/224300263135",
  },
  {
    id: "case-kyocera",
    industry: "사무실",
    title: "대구·경북 복합기 임대 — 교세라 TASKalfa 설치",
    summary:
      "정부조달 제품까지 꼼꼼하게. 동선과 인쇄량에 맞춰 복합기를 설치·세팅한 임대 후기.",
    scale: "교세라 TASKalfa · 임대",
    tags: ["복사기 임대", "교세라", "설치"],
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=70&auto=format",
    href: "https://blog.naver.com/hanbyeolsystem/224255706197",
  },
];
