export type Post = {
  title: string;
  excerpt: string;
  date: string;
  href: string;
  category: string;
};

// 더미 — 실제로는 네이버 블로그 RSS fetch로 교체 가능
export const posts: Post[] = [
  {
    title: "Synology DSM 7.3 신규 기능 정리",
    excerpt: "AI 사진 인식·향상된 백업 정책·보안 패치까지. 도입 기업이 가장 먼저 확인해야 할 6가지.",
    date: "2026-06-10",
    href: "https://blog.naver.com/hanbyeolsystem",
    category: "Synology",
  },
  {
    title: "랜섬웨어 대응 5단계 — 백업이 무력화되기 전에",
    excerpt: "스냅샷, 이중백업, WORM, 격리 환경. 실제 사고 사례로 보는 단계별 방어 전략.",
    date: "2026-06-03",
    href: "https://blog.naver.com/hanbyeolsystem",
    category: "보안",
  },
  {
    title: "NAS 유지관리 체크리스트 — 분기별 점검 항목",
    excerpt: "디스크 SMART, 백업 무결성, OS 패치, 권한 점검. 1년 무사고 NAS의 비결.",
    date: "2026-05-21",
    href: "https://blog.naver.com/hanbyeolsystem",
    category: "운영",
  },
  {
    title: "복합기 토너 절감 노하우 — 사용량 30% 줄이기",
    excerpt: "기본 출력 설정, 토너 절약 모드, 양면 자동 설정까지. 1년에 토너 4통 절약.",
    date: "2026-05-09",
    href: "https://blog.naver.com/hanbyeolsystem",
    category: "복합기",
  },
];
