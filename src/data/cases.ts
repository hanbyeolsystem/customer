export type CaseStudy = {
  id: string;
  industry: string;
  title: string;
  summary: string;
  scale: string;
  tags: string[];
  image: string;
};

// 더미 데이터 — 실제 사례로 교체 가능 (사용자가 콘텐츠 보내주면 갱신)
export const caseStudies: CaseStudy[] = [
  {
    id: "case-001",
    industry: "제조업",
    title: "OO정밀 — 24TB NAS 통합 백업",
    summary: "도면·생산데이터 3개 부서 통합 + 랜섬웨어 사고 복구 1시간 내 완료",
    scale: "직원 80명 · NAS DS1823xs+",
    tags: ["NAS 구축", "백업", "RAID 6"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=70&auto=format",
  },
  {
    id: "case-002",
    industry: "병원",
    title: "OO이비인후과 — 영상 PACS 백업",
    summary: "DICOM 영상 자동 백업 + VPN 원격 진료 환경 구축",
    scale: "직원 25명 · 이중 백업 8TB",
    tags: ["백업", "VPN", "의료"],
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=70&auto=format",
  },
  {
    id: "case-003",
    industry: "회계사무소",
    title: "OO회계법인 — 파일서버 컨설팅",
    summary: "감사 자료 직원별 권한 분리 + 자동 버전 관리",
    scale: "직원 40명 · DS923+",
    tags: ["파일서버", "권한관리"],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=70&auto=format",
  },
  {
    id: "case-004",
    industry: "법무법인",
    title: "OO법무법인 — 사건파일 NAS",
    summary: "사건별 폴더 권한 + 모바일 외부 안전 접속 환경",
    scale: "직원 30명 · DS1522+",
    tags: ["NAS 구축", "보안", "모바일"],
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=70&auto=format",
  },
  {
    id: "case-005",
    industry: "교육",
    title: "OO학원 그룹 — 복합기 12대 통합 관리",
    summary: "5개 지점 출력 카운터 자동 수집 + 토너 사전 배송",
    scale: "5개 지점 · 컬러 A3 12대",
    tags: ["복사기 임대", "원격 모니터링"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=70&auto=format",
  },
  {
    id: "case-006",
    industry: "건설",
    title: "OO종합건설 — 현장 도면 동기화",
    summary: "본사·현장 NAS 양방향 동기 + 협력사 외부 접속",
    scale: "본사 + 3개 현장",
    tags: ["NAS 구축", "동기화", "외부공유"],
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=70&auto=format",
  },
];
