// 구축 사례 - 전부 한별시스템이 실제로 시공하고 네이버 블로그에 후기로 남긴 현장이다.
//
// ⚠️ 규칙 (지키지 않으면 사이트 신뢰도가 무너진다)
//  1. 없는 사례를 만들어 넣지 말 것. 반드시 href 의 원문 후기 글에 근거가 있어야 한다.
//  2. 장비명·용량·RAID 설정 같은 수치는 원문에 적힌 것만 쓴다. 추정 금지.
//  3. 고객사 실명은 원문에서 회사가 이미 공개한 경우에만 쓴다(예: 행복북구문화재단, 성운대학교).
//     나머지는 "대구 북구 사무실"처럼 지역+업종까지만 적는다.
//  4. 새 사례 추가는 `node scripts/gen-case-draft.mjs` 로 블로그 새 후기 초안을 뽑아서 손질한다.

export type CaseStudy = {
  slug: string;
  industry: string; // 업종 배지
  region: string; // 지역
  date: string; // 시공 시점(YYYY-MM)
  category: "nas" | "printer" | "pc" | "network" | "etc";
  title: string;
  summary: string; // 카드용 1~2문장
  gear: string[]; // 투입 장비
  tags: string[];
  images: string[]; // 첫 장이 대표 이미지
  href: string; // 원문 후기(네이버 블로그)
  challenge: string; // 고객이 안고 있던 문제
  solution: string[]; // 실제로 한 일
  result: string; // 결과
  spec?: { label: string; value: string }[];
};

export const caseCats = [
  { id: "nas", label: "NAS·서버 구축" },
  { id: "printer", label: "복합기·프린터" },
  { id: "pc", label: "컴퓨터·사무기기" },
  { id: "network", label: "네트워크·랜공사" },
  { id: "etc", label: "기타" },
] as const;

export const caseStudies: CaseStudy[] = [
  // ───────────────────────── NAS · 서버 구축 ─────────────────────────
  {
    slug: "daegu-junggu-nas-to-nas",
    industry: "대형 사무실",
    region: "대구 중구",
    date: "2026-08",
    category: "nas",
    title: "대구 중구 대형 사무실 - 나스에서 나스로 데이터 통째 이관",
    summary:
      "인원이 많고 자료가 쌓일 대로 쌓인 사무실에서 기존 NAS의 데이터를 새 NAS로 옮겨 서버를 다시 세운 현장.",
    gear: ["Synology NAS", "NAS to NAS 데이터 이관"],
    tags: ["NAS 이관", "데이터 이전", "서버 재구축"],
    images: [
      "/cases/daegu-junggu-nas-to-nas-1.webp",
      "/cases/daegu-junggu-nas-to-nas-2.webp",
      "/cases/daegu-junggu-nas-to-nas-3.webp",
      "/cases/daegu-junggu-nas-to-nas-4.webp",
    ],
    href: "https://blog.naver.com/hanbyeolsystem/224385618782",
    challenge:
      "회사 규모가 크고 인원이 많아 데이터 양 자체가 많았습니다. 자료를 분류하고 백업한 뒤 서버를 새로 세워야 하는데, 옮기는 도중 자료가 유실되면 업무가 멈추는 상황이라 사내에서 직접 손대기 어렵다고 문의를 주셨습니다.",
    solution: [
      "기존 NAS의 데이터를 종류별로 분류하고 이관 전 백업을 먼저 확보",
      "새 NAS로 데이터를 옮기고 공유 폴더와 권한 구조를 다시 설계",
      "초기 설정 단계에서 보안과 백업 항목을 함께 잡아 이후 문제를 차단",
      "담당자 대상 1시간 사용 교육 진행",
    ],
    result:
      "이관과 구축을 마친 뒤 1시간 교육까지 진행했고, 앞으로도 편하게 쓰겠다는 후기를 받았습니다. 이후 주기적으로 방문해 하드디스크 상태와 서버를 점검하고 있습니다.",
    spec: [
      { label: "규모", value: "대형 사무실" },
      { label: "작업", value: "NAS to NAS 이관" },
      { label: "교육", value: "1시간 현장 교육" },
    ],
  },
  {
    slug: "yecheon-office-ds925",
    industry: "소규모 사무실",
    region: "경북 예천",
    date: "2026-08",
    category: "nas",
    title: "경북 예천 사무실 - DS925+ 8TB 서버 구축과 유지관리",
    summary:
      "나스가 처음이라 무엇부터 해야 할지 모르겠다는 예천 소규모 사무실에 DS925+로 서버를 세우고 관리까지 이어받은 현장.",
    gear: ["Synology DS925+", "8TB HDD"],
    tags: ["NAS 구축", "DS925+", "유지관리"],
    images: [
      "/cases/yecheon-office-ds925-1.webp",
      "/cases/yecheon-office-ds925-2.webp",
      "/cases/yecheon-office-ds925-3.webp",
      "/cases/yecheon-office-ds925-4.webp",
    ],
    href: "https://blog.naver.com/hanbyeolsystem/224377621676",
    challenge:
      "나스가 좋다는 말은 들었지만 어떤 모델을 골라야 하는지, 설치 후 관리는 누가 하는지 아는 사람이 사무실에 없었습니다. 설치만 해 놓고 방치되면 하드디스크가 노후해 데이터가 날아갈 수 있어 관리까지 맡길 곳을 찾고 계셨습니다.",
    solution: [
      "사무실 규모와 자료량을 확인해 DS925+ 4베이 구성으로 제안",
      "8TB HDD를 넣어 조립하고 RAID 설정 후 현장 설치",
      "공유 폴더와 계정을 구성하고 사용 교육 진행",
      "설치로 끝내지 않고 주기적 점검이 들어가는 유지관리 계약으로 연결",
    ],
    result:
      "설치와 초기 설정, 교육까지 한 번의 방문으로 마쳤고, 이후 하드디스크 상태와 백업이 정상인지 정기적으로 점검하고 있습니다.",
    spec: [
      { label: "본체", value: "DS925+ (4베이)" },
      { label: "디스크", value: "8TB" },
      { label: "지역", value: "경북 예천" },
    ],
  },
  {
    slug: "bukgu-culture-foundation-ds925",
    industry: "공공·문화재단",
    region: "대구 북구",
    date: "2026-08",
    category: "nas",
    title: "행복북구문화재단 - DS925+ 서버 설치",
    summary:
      "어울아트센터 옆 행복북구문화재단에 자료를 모아 두고 내부에서 공유할 수 있도록 DS925+ 서버를 설치한 현장.",
    gear: ["Synology DS925+"],
    tags: ["NAS 구축", "공공기관", "DS925+"],
    images: [
      "/cases/bukgu-culture-foundation-ds925-1.webp",
      "/cases/bukgu-culture-foundation-ds925-2.webp",
      "/cases/bukgu-culture-foundation-ds925-3.webp",
      "/cases/bukgu-culture-foundation-ds925-4.webp",
    ],
    href: "https://blog.naver.com/hanbyeolsystem/224370108980",
    challenge:
      "내부 인원 이동이 많고 다루는 자료의 종류도 다양해, 자료를 한곳에 저장하고 필요한 사람끼리 공유할 수 있는 구조가 필요했습니다. 저장 용량도 넉넉하게 잡아 둬야 하는 조건이었습니다.",
    solution: [
      "인원 이동과 자료량을 고려해 플래그십 라인인 DS925+ 제안",
      "현장에 맞는 위치를 잡아 설치하고 네트워크에 연결",
      "부서별 공유 폴더와 접근 권한 구성",
    ],
    result:
      "재단 내부에서 자료를 한곳에 저장하고 필요한 인원끼리 공유하는 환경이 갖춰졌습니다. 대구·경북 공공·문화 기관에도 NAS 도입 문의가 늘고 있습니다.",
    spec: [
      { label: "기관", value: "행복북구문화재단" },
      { label: "본체", value: "DS925+" },
      { label: "위치", value: "대구 북구 어울아트센터 인근" },
    ],
  },
  {
    slug: "bukgu-architect-ds1825",
    industry: "건축사무소",
    region: "대구 북구",
    date: "2026-04",
    category: "nas",
    title: "대구 북구 건축사무소 - DS1825+ 8베이 서버 설치",
    summary:
      "도면과 설계 자료가 계속 쌓이는 건축사무소에 베이 수를 넉넉히 확보한 DS1825+로 대용량 서버를 구축한 현장.",
    gear: ["Synology DS1825+", "Seagate IronWolf 8TB"],
    tags: ["NAS 구축", "DS1825+", "도면 관리", "대용량"],
    images: [
      "/cases/bukgu-architect-ds1825-1.webp",
      "/cases/bukgu-architect-ds1825-2.webp",
      "/cases/bukgu-architect-ds1825-3.webp",
      "/cases/bukgu-architect-ds1825-4.webp",
    ],
    href: "https://blog.naver.com/hanbyeolsystem/224269459051",
    challenge:
      "사무실 규모가 어느 정도 있고 도면 자료가 계속 늘어나는 구조라, 충분한 용량의 서버를 구축해 자료를 한곳에 보관하고 싶다는 문의였습니다. 랙마운트까지 갈 필요는 없지만 베이 수는 확보해야 하는 조건이었습니다.",
    solution: [
      "RS 랙마운트 대신 베이 수가 넉넉한 DS1825+ 8베이로 제안",
      "NAS 전용 하드인 씨게이트 아이언울프 8TB로 구성",
      "조립 후 테스트 장비에 물려 디스크 이상 여부를 먼저 확인",
      "현장에서 실제 RAID 설정을 마치고 인계",
    ],
    result:
      "도면과 설계 자료를 한곳에 모으고, 용량이 부족해지면 남은 베이에 디스크를 추가해 확장할 수 있는 구조로 마무리했습니다.",
    spec: [
      { label: "본체", value: "DS1825+ (8베이)" },
      { label: "디스크", value: "IronWolf 8TB" },
      { label: "업종", value: "건축사무소" },
    ],
  },
  {
    slug: "university-rs2421",
    industry: "대학교",
    region: "대구·경북",
    date: "2026-04",
    category: "nas",
    title: "성운대학교 - RS2421+ 랙마운트 서버 구축",
    summary:
      "사무실을 새로 꾸리며 PC와 함께 서버가 필요했던 성운대학교에 랙마운트 RS2421+로 기업급 서버를 구축한 현장.",
    gear: ["Synology RS2421+", "Seagate IronWolf 8TB", "PC 세팅"],
    tags: ["랙마운트", "RS2421+", "대학교", "서버 구축"],
    images: [
      "/cases/university-rs2421-1.webp",
      "/cases/university-rs2421-2.webp",
      "/cases/university-rs2421-3.webp",
      "/cases/university-rs2421-4.webp",
    ],
    href: "https://blog.naver.com/hanbyeolsystem/224266056667",
    challenge:
      "새 사무실을 꾸리면서 PC와 NAS를 함께 설치해야 했습니다. 보관할 자료의 종류가 다양하고 양도 많아 일반 데스크형 DS 제품으로는 성능과 용량이 부족할 수 있는 조건이었습니다.",
    solution: [
      "DS 라인 대신 기업용 랙마운트인 RS2421+ 제안",
      "씨게이트 아이언울프 8TB로 디스크 구성",
      "PC 설치와 서버 구축을 같은 방문에서 함께 진행",
    ],
    result:
      "대량 자료를 저장·공유할 수 있는 서버 환경이 갖춰졌습니다. 대학·병원·건축사무소처럼 자료가 많은 조직에서 랙마운트를 선택하는 사례가 늘고 있습니다.",
    spec: [
      { label: "기관", value: "성운대학교" },
      { label: "본체", value: "RS2421+ (랙마운트)" },
      { label: "디스크", value: "IronWolf 8TB" },
    ],
  },
  {
    slug: "changwon-office-ds925",
    industry: "사무실",
    region: "경남 창원",
    date: "2026-05",
    category: "nas",
    title: "창원 사무실 - DS925+ RAID 5 구축과 서버 관리",
    summary:
      "대구를 넘어 창원까지. 자료량이 적지 않은 사무실에 DS925+를 RAID 5로 구성하고 이후 서버 관리까지 맡은 현장.",
    gear: ["Synology DS925+", "Seagate IronWolf 8TB", "RAID 5"],
    tags: ["NAS 구축", "RAID 5", "원거리 시공", "서버 관리"],
    images: [
      "/cases/changwon-office-ds925-1.webp",
      "/cases/changwon-office-ds925-2.webp",
      "/cases/changwon-office-ds925-3.webp",
      "/cases/changwon-office-ds925-4.webp",
    ],
    href: "https://blog.naver.com/hanbyeolsystem/224292586801",
    challenge:
      "다루는 자료의 양이 적지 않아 원활한 공유를 위해서는 RAM과 기능이 충분한 모델이 필요했습니다. 처음 쓰는 담당자가 운영해야 한다는 점도 고려해야 했습니다.",
    solution: [
      "충분한 사양과 베이 수를 갖춘 DS925+ 제안",
      "씨게이트 아이언울프 8TB로 구성하고 RAID 5로 설정",
      "동선을 확인해 장비 위치를 잡고 설치",
      "처음 사용하는 담당자에게 사용 방법을 상세히 교육",
    ],
    result:
      "디스크 한 개가 고장 나도 데이터가 유지되는 RAID 5 구성으로 마무리했고, 이후 서버 관리까지 이어서 맡고 있습니다.",
    spec: [
      { label: "본체", value: "DS925+" },
      { label: "RAID", value: "RAID 5" },
      { label: "지역", value: "경남 창원" },
    ],
  },
  {
    slug: "two-site-ds925-ds1515",
    industry: "사무실 2개소",
    region: "대구",
    date: "2026-04",
    category: "nas",
    title: "서버 2개소 - DS925+와 DS1515+ 환경별 분리 구축",
    summary:
      "서버를 관리하는 장소가 두 곳이라 각 환경에 맞춰 서로 다른 모델을 넣고 세팅을 나눠 진행한 현장.",
    gear: ["Synology DS925+", "Synology DS1515+", "Seagate IronWolf 8TB"],
    tags: ["NAS 구축", "다중 사이트", "업그레이드"],
    images: [
      "/cases/two-site-ds925-ds1515-1.webp",
      "/cases/two-site-ds925-ds1515-2.webp",
      "/cases/two-site-ds925-ds1515-3.webp",
      "/cases/two-site-ds925-ds1515-4.webp",
    ],
    href: "https://blog.naver.com/hanbyeolsystem/224270612865",
    challenge:
      "서버를 두는 장소가 두 곳이었고 각각 쓰임이 달랐습니다. 자료가 많고 복잡한 활용이 필요하면 랙마운트가 맞지만, 단순 백업 용도라면 데스크형이 비용 대비 낫기 때문에 한 모델로 통일할 수 없는 조건이었습니다.",
    solution: [
      "장소별 용도를 나눠 DS925+와 DS1515+ 두 모델로 구성",
      "씨게이트 아이언울프 8TB로 통일해 관리 부담을 줄임",
      "사전 검수 후 현장에서 조립과 RAID 설정 진행",
      "기존 사용법은 알고 계셔서 업그레이드로 달라진 기능 위주로 교육",
    ],
    result:
      "용도에 맞지 않는 비싼 장비를 넣지 않고도 두 곳 모두 필요한 성능을 확보했습니다. 업그레이드로 추가된 기능 설명에도 만족하셨습니다.",
    spec: [
      { label: "본체", value: "DS925+ / DS1515+" },
      { label: "디스크", value: "IronWolf 8TB" },
      { label: "구성", value: "2개소 분리" },
    ],
  },
  {
    slug: "daegu-office-ds925-hdd",
    industry: "사무실",
    region: "대구",
    date: "2026-04",
    category: "nas",
    title: "대구 사무실 - DS925+ 4TB 초기 세팅과 사용 교육",
    summary:
      "초기 세팅이 어려워 손을 못 대고 있던 사무실에 DS925+를 세팅하고 1시간 교육까지 마친 현장.",
    gear: ["Synology DS925+", "Seagate IronWolf 4TB"],
    tags: ["NAS 구축", "초기 세팅", "사용 교육"],
    images: [
      "/cases/daegu-office-ds925-hdd-1.webp",
      "/cases/daegu-office-ds925-hdd-2.webp",
      "/cases/daegu-office-ds925-hdd-3.webp",
      "/cases/daegu-office-ds925-hdd-4.webp",
    ],
    href: "https://blog.naver.com/hanbyeolsystem/224263900340",
    challenge:
      "용량을 얼마나 잡아야 하는지부터 감이 오지 않는 상태였습니다. 대충 세팅하면 RAID 기능을 제대로 쓰지 못하고 나중에 다시 손봐야 하기 때문에, 처음부터 제대로 잡아 줄 곳이 필요했습니다.",
    solution: [
      "자료량을 확인해 씨게이트 아이언울프 4TB로 구성",
      "HDD 조립 후 전원을 올려 동작을 확인하고 RAID 설정 완료",
      "기존 네트워크에 연결해 공유 환경 구성",
      "출장 시 제공하는 1시간 교육 서비스로 사용법 인계",
    ],
    result:
      "질문을 적극적으로 하시며 교육을 마쳤고, 사용 방법을 알게 되어 편해졌다는 후기를 남겨 주셨습니다.",
    spec: [
      { label: "본체", value: "DS925+" },
      { label: "디스크", value: "IronWolf 4TB" },
      { label: "교육", value: "1시간 현장 교육" },
    ],
  },
  {
    slug: "nas-recovery-ds925",
    industry: "사무실",
    region: "대구·경북",
    date: "2026-03",
    category: "nas",
    title: "NAS 서버 복구 - 손상 디스크에서 자료 살리고 DS925+로 재구축",
    summary:
      "오래 써서 내부 디스크가 손상된 NAS에서 데이터를 복구하고, 새 DS925+로 옮겨 다시 세운 현장.",
    gear: ["데이터 복구", "Synology DS925+"],
    tags: ["NAS 복구", "데이터 복원", "서버 재구축"],
    images: [
      "/cases/nas-recovery-ds925-1.webp",
      "/cases/nas-recovery-ds925-2.webp",
      "/cases/nas-recovery-ds925-3.webp",
      "/cases/nas-recovery-ds925-4.webp",
    ],
    href: "https://blog.naver.com/hanbyeolsystem/224223721226",
    challenge:
      "외형 파손이 아니라 내부 디스크가 손상된 상태였고, 오래 사용해 생긴 문제로 보였습니다. 데이터를 되살리는 것과 새 장비로 옮기는 것을 같이 해야 해서 직접 하기는 어렵다고 판단해 문의를 주셨습니다.",
    solution: [
      "어느 디스크에서 문제가 생겼는지 내부를 열어 진단",
      "살릴 수 있는 데이터를 복구하고 디스크 정보를 이전",
      "사용 용량에 맞춰 DS925+로 새 서버를 구축",
      "이전 완료 후 정상 동작 확인",
    ],
    result:
      "데이터를 되찾고 설치 환경도 정리된 상태로 마무리했습니다. 다만 물리 파손이 심한 경우에는 복구가 불가능한 경우도 있어, 백업 체계를 미리 갖춰 두는 것이 최선입니다.",
    spec: [
      { label: "작업", value: "복구 + 재구축" },
      { label: "신규 본체", value: "DS925+" },
      { label: "주의", value: "물리 파손 시 복구 불가할 수 있음" },
    ],
  },
  {
    slug: "andong-hospital-nas",
    industry: "병원",
    region: "경북 안동",
    date: "2026-06",
    category: "nas",
    title: "안동 병원 - RAID를 잘못 잡아 디스크가 고장 난 사례",
    summary:
      "레이드 설정이 잘못돼 하드디스크가 고장 난 병원 사례. 처음 한 번의 설정이 왜 중요한지 보여 주는 현장.",
    gear: ["Synology NAS", "RAID 재구성"],
    tags: ["병원 NAS", "RAID", "개인정보", "장애 대응"],
    images: [
      "/cases/andong-hospital-nas-1.webp",
      "/cases/andong-hospital-nas-2.webp",
      "/cases/andong-hospital-nas-3.webp",
    ],
    href: "https://blog.naver.com/hanbyeolsystem/224306875156",
    challenge:
      "하드디스크가 고장 났다며 문의를 주신 병원 사무실이었습니다. 확인해 보니 레이드 설정이 잘못 잡혀 있었고, 그 상태로 계속 운영되면서 디스크에 무리가 간 경우였습니다.",
    solution: [
      "네트워크 환경, 저장 용량, RAID 구성, 보안 정책, 백업 체계를 처음부터 다시 점검",
      "병원 특성상 영상 자료 용량과 개인정보 보호를 함께 고려해 재설계",
      "설정을 바로잡고 이후 점검이 들어가도록 정리",
    ],
    result:
      "한 번 설치할 때 제대로 잡는 것이 왜 중요한지 확인된 사례입니다. 병원은 환자 정보와 영상 자료를 다루기 때문에 권한 설정과 백업 체계를 같이 설계해야 합니다.",
    spec: [
      { label: "업종", value: "병원" },
      { label: "원인", value: "RAID 설정 오류" },
      { label: "핵심", value: "초기 설계가 전부" },
    ],
  },

  // ───────────────────────── 복합기 · 프린터 ─────────────────────────
  {
    slug: "daegu-suseong-kyocera-2set",
    industry: "사무실",
    region: "대구 수성구",
    date: "2026-08",
    category: "printer",
    title: "대구 수성구 사무실 - 교세라 흑백·컬러 복합기 2대 동시 설치",
    summary:
      "인쇄 속도를 중요하게 보신 사무실에 TASKalfa 3011i(흑백)와 3552ci(컬러) 두 대를 동선에 맞춰 설치한 현장.",
    gear: ["Kyocera TASKalfa 3011i", "Kyocera TASKalfa 3552ci"],
    tags: ["복합기 렌탈", "교세라", "A3", "동선 설계"],
    images: [
      "/cases/daegu-suseong-kyocera-2set-1.webp",
      "/cases/daegu-suseong-kyocera-2set-2.webp",
      "/cases/daegu-suseong-kyocera-2set-3.webp",
      "/cases/daegu-suseong-kyocera-2set-4.webp",
    ],
    href: "https://blog.naver.com/hanbyeolsystem/224378549930",
    challenge:
      "쓰던 복합기가 오래돼 인쇄가 잘 되지 않고 고장이 잦았습니다. 저렴한 기종만 보고 고르면 사무 환경에 맞지 않아 오히려 업무가 느려지기 때문에, 인쇄 속도와 사용량에 맞는 선택이 필요했습니다.",
    solution: [
      "인쇄량과 사용 인원을 먼저 확인해 흑백·컬러를 나눠 구성",
      "흑백은 TASKalfa 3011i, 컬러는 TASKalfa 3552ci로 제안",
      "대형 복합기라 자리를 많이 차지하는 만큼 동선을 고려해 위치 확보",
      "선정리와 테스트 프린트까지 마치고 인계",
    ],
    result:
      "이제 편하게 쓸 수 있겠다는 후기를 받았습니다. 설치 후에는 주기적으로 방문해 상태를 점검하고 있습니다.",
    spec: [
      { label: "흑백", value: "TASKalfa 3011i" },
      { label: "컬러", value: "TASKalfa 3552ci" },
      { label: "대수", value: "2대" },
    ],
  },
  {
    slug: "bukgu-office-vfm251ci",
    industry: "사무실",
    region: "대구 북구",
    date: "2026-07",
    category: "printer",
    title: "대구 북구 사무실 - 교세라 TASKalfa VFM251ci 설치",
    summary:
      "인쇄량을 기준으로 기종을 고르고, 터치 패널이 달린 대형 복합기를 동선에 맞춰 설치한 현장.",
    gear: ["Kyocera TASKalfa VFM251ci"],
    tags: ["복합기 렌탈", "교세라", "터치 패널"],
    images: [
      "/cases/bukgu-office-vfm251ci-1.webp",
      "/cases/bukgu-office-vfm251ci-2.webp",
      "/cases/bukgu-office-vfm251ci-3.webp",
    ],
    href: "https://blog.naver.com/hanbyeolsystem/224362822407",
    challenge:
      "복합기를 고를 때 사무실 크기만 보고 정하는 경우가 많지만, 실제로 중요한 것은 한 번에 얼마나 인쇄하는지입니다. 인쇄량이 적은데 빠른 기종을 넣으면 돈만 더 드는 구조라 사용량 파악이 먼저였습니다.",
    solution: [
      "사무실 내부 환경과 사용 인원, 인쇄량을 먼저 확인",
      "가성비와 내구성을 함께 보고 TASKalfa VFM251ci 제안",
      "앞면 테이블형 터치 패널이 있어 조작이 쉬운 점을 고려",
      "현장 동선에 맞춰 설치하고 테스트 프린트로 마감",
    ],
    result:
      "인쇄가 잘 되는 것을 확인하고 선정리까지 마쳤습니다. 월 정액 안에 소모품과 출장 수리가 포함되어 이후 추가 비용 없이 사용하십니다.",
    spec: [
      { label: "기종", value: "TASKalfa VFM251ci" },
      { label: "특징", value: "테이블형 터치 패널" },
      { label: "선택 기준", value: "월 인쇄량" },
    ],
  },
  {
    slug: "donggu-office-vfm251ci",
    industry: "소규모 사무실",
    region: "대구 동구",
    date: "2026-07",
    category: "printer",
    title: "대구 동구 소규모 사무실 - 인쇄량이 많아 대형 복합기 선택",
    summary:
      "사무실은 작지만 인쇄량이 많은 곳. 크기가 아니라 사용량 기준으로 대형 복합기를 넣은 현장.",
    gear: ["Kyocera TASKalfa VFM251ci"],
    tags: ["복합기 렌탈", "교세라", "소규모 사무실"],
    images: [
      "/cases/donggu-office-vfm251ci-1.webp",
      "/cases/donggu-office-vfm251ci-2.webp",
      "/cases/donggu-office-vfm251ci-3.webp",
    ],
    href: "https://blog.naver.com/hanbyeolsystem/224348251468",
    challenge:
      "작은 사무실이면 프린터 정도로 충분하지 않냐는 질문을 많이 받지만, 이곳은 처음부터 인쇄를 많이 하는 편이라고 말씀해 주셨습니다. 인쇄량이 많으면 속도와 토너 용량을 받쳐 주는 기종이 필요합니다.",
    solution: [
      "사무실 크기가 아니라 월 인쇄량을 기준으로 기종 선정",
      "터치스크린 패널이 있는 TASKalfa VFM251ci 제안",
      "좁은 공간이라 동선을 특히 세밀하게 계산해 위치 결정",
      "설치 후 테스트 인쇄와 선정리로 마감",
    ],
    result:
      "좁은 사무실에서도 이동에 불편이 없도록 위치를 잡았고, 인쇄량이 많아도 버티는 구성으로 정리했습니다.",
    spec: [
      { label: "기종", value: "TASKalfa VFM251ci" },
      { label: "핵심", value: "공간보다 인쇄량 기준" },
      { label: "지역", value: "대구 동구" },
    ],
  },
  {
    slug: "kyocera-vfm251ci-install",
    industry: "사무실",
    region: "대구·경북",
    date: "2026-04",
    category: "printer",
    title: "복합기 임대 - 교세라 TASKalfa VFM251ci 설치",
    summary: "사무 환경에 맞춰 기종을 고르고 설치와 세팅, 테스트 인쇄까지 마친 복합기 임대 현장.",
    gear: ["Kyocera TASKalfa VFM251ci"],
    tags: ["복합기 임대", "교세라", "설치"],
    images: [
      "/cases/kyocera-vfm251ci-install-1.webp",
      "/cases/kyocera-vfm251ci-install-2.webp",
      "/cases/kyocera-vfm251ci-install-3.webp",
    ],
    href: "https://blog.naver.com/hanbyeolsystem/224255706197",
    challenge:
      "복합기는 기종이 많아 무엇이 맞는지 고르기 어렵습니다. 동선과 인쇄량을 보지 않고 넣으면 매일 불편을 겪게 됩니다.",
    solution: [
      "사무 환경과 인쇄량을 확인해 기종 선정",
      "동선을 고려한 위치에 설치",
      "네트워크 연결과 스캔 설정까지 세팅",
      "테스트 인쇄로 이상 여부 확인",
    ],
    result: "설치와 세팅을 한 번에 마쳤고, 이후 정기 점검으로 관리하고 있습니다.",
    spec: [
      { label: "기종", value: "TASKalfa VFM251ci" },
      { label: "포함", value: "설치·세팅·테스트" },
    ],
  },
  {
    slug: "kyocera-gov-supply-2site",
    industry: "사무실 2개소",
    region: "대구",
    date: "2026-04",
    category: "printer",
    title: "사무실 2곳 - 부품 교체와 정부조달 제품 설치를 함께",
    summary:
      "한 곳은 마모된 부품을 현장에서 바로 교체하고, 다른 곳은 정부조달 제품인 TASKalfa 4012iG를 넣은 현장.",
    gear: ["Kyocera TASKalfa VFM251ci", "Kyocera TASKalfa 4012iG"],
    tags: ["복합기 렌탈", "정부조달", "부품 교체"],
    images: [
      "/cases/kyocera-gov-supply-2site-1.webp",
      "/cases/kyocera-gov-supply-2site-2.webp",
      "/cases/kyocera-gov-supply-2site-3.webp",
      "/cases/kyocera-gov-supply-2site-4.webp",
    ],
    href: "https://blog.naver.com/hanbyeolsystem/224247824845",
    challenge:
      "설치 전 점검에서 내부 부품에 마모 흔적이 보였습니다. 롤러나 토너 쪽은 평소 사용에서도 잔고장이 잦은 부위라, 인쇄량이 많은 곳에서는 고장 한 번에 업무 전체가 멈춥니다.",
    solution: [
      "교체 부품을 미리 챙겨 가 현장에서 바로 교체",
      "조립 후 테스트 프린트로 추가 이상 여부 확인",
      "다른 사무실에는 사용 환경이 달라 정부조달 제품인 TASKalfa 4012iG로 별도 구성",
      "두 곳 모두 주변 정돈과 테스트 인쇄까지 마감",
    ],
    result:
      "설치 전에 마모 부품을 미리 잡아 이후 잔고장을 줄였습니다. 사무실마다 환경이 달라 같은 회사라도 기종을 다르게 넣는 편이 낫습니다.",
    spec: [
      { label: "A 사무실", value: "VFM251ci + 부품 교체" },
      { label: "B 사무실", value: "TASKalfa 4012iG (정부조달)" },
    ],
  },

  // ───────────────────────── 컴퓨터 · 사무기기 ─────────────────────────
  {
    slug: "site-office-pc-vfm351ci",
    industry: "건설 현장 사무실",
    region: "대구·경북",
    date: "2026-04",
    category: "pc",
    title: "공사 현장 임시 사무실 - 듀얼 모니터 PC와 복합기 동시 구축",
    summary:
      "도면을 여러 장 동시에 봐야 하는 현장 사무실에 듀얼 모니터 PC를 자리마다 놓고 복합기까지 함께 넣은 현장.",
    gear: ["사무용 PC", "듀얼 모니터", "Kyocera TASKalfa VFM351ci"],
    tags: ["PC 임대", "듀얼 모니터", "복합기 렌탈", "현장 사무실"],
    images: [
      "/cases/site-office-pc-vfm351ci-1.webp",
      "/cases/site-office-pc-vfm351ci-2.webp",
      "/cases/site-office-pc-vfm351ci-3.webp",
      "/cases/site-office-pc-vfm351ci-4.webp",
    ],
    href: "https://blog.naver.com/hanbyeolsystem/224239744647",
    challenge:
      "공사 현장 사무실은 도면, 설계도, 계약 서류를 동시에 봐야 하는 일이 많습니다. 먼지도 많은 환경이라 일반 사무실과 같은 구성으로 넣으면 오래 못 버팁니다.",
    solution: [
      "자리마다 듀얼 모니터를 설치하고 모니터는 큰 인치 기준으로 구성",
      "현장 환경을 고려해 먼지가 잘 들어가지 않는 케이스로 본체 선정",
      "설치 후 선정리로 이동 동선 확보",
      "빠른 인쇄가 필요해 테이블 모니터가 달린 TASKalfa VFM351ci 설치",
    ],
    result:
      "모니터가 커서 시원시원하다는 반응을 받았고, PC와 복합기를 한 번의 방문으로 함께 정리했습니다.",
    spec: [
      { label: "PC", value: "자리별 듀얼 모니터" },
      { label: "복합기", value: "TASKalfa VFM351ci" },
      { label: "환경", value: "먼지 많은 현장" },
    ],
  },
  {
    slug: "office-pc-rental",
    industry: "사무실",
    region: "대구·경북",
    date: "2026-07",
    category: "pc",
    title: "사무용 컴퓨터 렌탈 - 업무에 맞춘 사양으로 설치",
    summary:
      "무조건 고사양이 아니라 실제로 하는 일에 맞춘 사양으로 사무용 PC를 구성해 설치한 현장.",
    gear: ["사무용 PC 렌탈"],
    tags: ["PC 임대", "컴퓨터 렌탈", "AS 포함"],
    images: [
      "/cases/office-pc-rental-1.webp",
      "/cases/office-pc-rental-2.webp",
      "/cases/office-pc-rental-3.webp",
    ],
    href: "https://blog.naver.com/hanbyeolsystem/224354453494",
    challenge:
      "사무용 PC는 성능이 좋아야 한다고 생각해 부담을 느끼는 경우가 많습니다. 좋은 사양을 싸게 사려고 발품을 팔다 시간만 쓰는 일도 흔합니다.",
    solution: [
      "하는 업무를 먼저 확인해 필요한 사양만 잡음",
      "초기 목돈이 나가지 않는 렌탈 구성으로 제안",
      "설치와 초기 세팅까지 방문 진행",
      "이후 고장 시 AS가 렌탈에 포함되도록 구성",
    ],
    result:
      "필요 이상으로 비싼 사양을 넣지 않고 업무에 맞는 구성으로 마무리했습니다. 고장 시 별도로 수리 기사를 찾을 필요가 없습니다.",
    spec: [
      { label: "구성", value: "업무 기준 사양" },
      { label: "비용", value: "초기 목돈 없음" },
      { label: "AS", value: "렌탈에 포함" },
    ],
  },
  {
    slug: "daegu-office-allinone",
    industry: "사업체",
    region: "대구",
    date: "2026-07",
    category: "pc",
    title: "대구 사업체 - 컴퓨터·프린터·나스를 한 번의 방문으로",
    summary:
      "세 가지를 각각 다른 업체에서 알아봐야 하나 고민하던 대표님께 한 번의 방문으로 전부 정리해 드린 현장.",
    gear: ["사무용 PC", "복합기 렌탈", "Synology NAS"],
    tags: ["올인원", "통합 구축", "시놀로지 공식 대리점"],
    images: ["/cases/daegu-office-allinone-1.webp", "/cases/daegu-office-allinone-2.webp"],
    href: "https://blog.naver.com/hanbyeolsystem/224337412783",
    challenge:
      "컴퓨터는 여기서, 프린터는 저기서, 나스는 또 다른 데서 알아봐야 하느냐는 질문이 출발점이었습니다. 따로 상담을 받으면 정보가 뒤섞이고 견적도 각각 받아야 해서 시간과 에너지가 몇 배로 듭니다.",
    solution: [
      "1단계 현황 파악 - 전화로 현재 PC 사양, 프린터 기종, 자료 보관 방식 확인",
      "2단계 방문 상담 - 사무실 규모와 인원, 네트워크 환경을 직접 확인",
      "3단계 구성 제안 - PC는 예산 안에서, 프린터는 월 출력량 기준 렌탈로, NAS는 인원·용량에 맞는 라인업으로",
      "4단계 설치 - PC 설치, 프린터 네트워크 연결, NAS 초기 설정과 백업 스케줄까지 한 번의 방문으로",
    ],
    result:
      "장비를 따로따로 놓는 것이 아니라 이 PC로 이 프린터를 어떻게 쓸지, 이 NAS에 어떤 자료를 백업할지를 하나의 흐름으로 맞췄습니다. 반복 백업이나 파일 정리를 자동화하는 방향도 함께 안내했지만, 필요 여부부터 같이 확인하는 편입니다.",
    spec: [
      { label: "범위", value: "PC + 복합기 + NAS" },
      { label: "방문", value: "1회 통합 설치" },
      { label: "자격", value: "시놀로지 공식 대리점" },
    ],
  },
  {
    slug: "daegu-junggu-projector",
    industry: "사무실",
    region: "대구 중구",
    date: "2026-06",
    category: "etc",
    title: "대구 중구 사무실 - 뷰소닉 LS740HD 빔프로젝터 임대 설치",
    summary:
      "보고와 발표가 잦지만 구매하기는 아까운 장비. 빔프로젝터를 임대로 넣고 선정리까지 마친 현장.",
    gear: ["ViewSonic LS740HD"],
    tags: ["빔프로젝터 임대", "사무기기 렌탈", "선정리"],
    images: [
      "/cases/daegu-junggu-projector-1.webp",
      "/cases/daegu-junggu-projector-2.webp",
      "/cases/daegu-junggu-projector-3.webp",
    ],
    href: "https://blog.naver.com/hanbyeolsystem/224312964916",
    challenge:
      "현장 일과 프로젝트를 함께 수행해 보고와 발표가 잦은 곳이었습니다. 정부 사업처럼 규모가 큰 일은 지속적인 보고가 필요한데, 빔프로젝터는 잠깐 쓰고 마는 장비라 구매까지는 망설여진다고 하셨습니다.",
    solution: [
      "사용 빈도를 고려해 구매 대신 임대로 제안",
      "뷰소닉 LS740HD 설치",
      "이동 동선과 인원을 고려해 선을 정리",
    ],
    result:
      "깔끔하게 설치되어 쓰기 편해졌다는 후기를 남겨 주셨습니다. 자주 쓰지 않는 장비는 임대가 합리적인 선택이 될 수 있습니다.",
    spec: [
      { label: "기종", value: "ViewSonic LS740HD" },
      { label: "방식", value: "임대(렌탈)" },
    ],
  },

  // ───────────────────────── 네트워크 · 랜공사 ─────────────────────────
  {
    slug: "daegu-lan-wiring",
    industry: "사무실",
    region: "대구",
    date: "2026-02",
    category: "network",
    title: "대구 사무실 랜공사 - 인터넷 선정리와 컴퓨터 연결 시공",
    summary:
      "발에 걸리던 배선을 정리하고 컴퓨터 연결까지 마친 랜공사 현장. 선정리를 제2의 작업으로 보는 이유.",
    gear: ["랜 배선", "멀티탭·콘센트 정리", "PC 연결"],
    tags: ["랜공사", "선정리", "네트워크 시공"],
    images: [
      "/cases/daegu-lan-wiring-1.webp",
      "/cases/daegu-lan-wiring-2.webp",
      "/cases/daegu-lan-wiring-3.webp",
      "/cases/daegu-lan-wiring-4.webp",
    ],
    href: "https://blog.naver.com/hanbyeolsystem/224182683885",
    challenge:
      "배선이 정리되지 않으면 걸어 다닐 때마다 발에 전선이 걸리고, 의자나 물건을 옮기기도 힘듭니다. 전원 연결과 배선 작업은 감전 위험도 있어 직접 하기 어려운 작업입니다.",
    solution: [
      "설치 후 멀티탭과 콘센트를 활용해 선을 한데 모아 정리",
      "전체 연결과 선 상태에 이상이 없는지 점검",
      "이동 범위를 계산해 전선이 엉키지 않도록 배선 정리",
    ],
    result:
      "선정리까지 마쳐 이동 동선을 확보했습니다. 작업 숙련도는 선정리가 얼마나 깔끔한지에서 드러납니다.",
    spec: [
      { label: "작업", value: "랜공사 + 선정리" },
      { label: "점검", value: "전원·연결 전수 확인" },
    ],
  },
];

export const caseBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);
