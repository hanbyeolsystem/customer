export type Post = {
  title: string;
  excerpt: string;
  date: string;
  href: string;
  category: string;
  thumb?: string; // 대표 사진 (RSS 첫 이미지)
};

// ⚠️ 이 목록은 이제 "폴백"용. 실제 표시는 빌드 시 구글 블로거 RSS(src/lib/blog.ts)에서 가져온다.
// 피드 장애 시에만 아래 스냅샷(2026-08-23 기준)이 노출됨.
export const posts: Post[] = [
  {
    title: "대구 나스 계정 관리 — 직원마다 따로 관리하고 싶으신 분께, 시놀로지 DS925+로 개인 계정 세팅해드린 이야기",
    excerpt:
      "직원마다 따로 아이디를 만들어주고 싶어요\" 대구의 한 사무실 대표님께서 연락을 주셨습니다. \"나스를 하나 들이려고 하는데요, 그냥 공용 폴더 하나 만들어서 다 같이 쓰는 방식 말고, 직원 한 명 한…",
    date: "2026-08-23",
    href: "https://hanbyeolsystem.blogspot.com/2026/08/ds925.html",
    category: "소식",
    thumb: "https://jrzesjgyrvgvwazfajec.supabase.co/storage/v1/object/public/autopost-media/posts/7f21a3bb-a506-46b3-a16c-e90ca20cb320.jpg",
  },
  {
    title: "대구 경북 시놀로지 NAS 서버 구축 대형 나스 to 나스 회사 사무실 데이터 설치 후기",
    excerpt:
      "대구 경북 시놀로지 NAS 서버 구축 대형 나스 to 나스 회사 사무실 데이터 설치 후기 대구 경북 시놀로지 NAS 서버 구축 전문 업체, 한별시스템입니다. 많은 분들이 나스를 통한…",
    date: "2026-08-21",
    href: "https://hanbyeolsystem.blogspot.com/2026/08/nas-to.html",
    category: "NAS",
    thumb: "https://mblogthumb-phinf.pstatic.net/MjAyNjA4MjFfMjc0/MDAxNzg3Mjg2ODIxNzI4.CQtaAXu0I7YW501WniRlHVChHXSL5pOl6AiJa1QoI0gg.Nb9HkBu46Vl6J7ipGvu6pQax1FnauM1ZqmYrNX5Xl7Ig.PNG/1.png?type=w580",
  },
  {
    title: "대구 경북 시놀로지 나스 유지보수 관리를 전문업체에서 시작해야 하는 이유",
    excerpt:
      "대구 경북 시놀로지 나스 유지보수 관리를 전문업체에서 시작해야 하는 이유 안녕하세요, 대구 경북 시놀로지 나스 유지보수 관리 전문, 한별시스템입니다. 요즘 회사에서 시놀로지 NAS로…",
    date: "2026-08-20",
    href: "https://hanbyeolsystem.blogspot.com/2026/08/blog-post_20.html",
    category: "NAS",
    thumb: "https://mblogthumb-phinf.pstatic.net/MjAyNjA4MjBfMTc4/MDAxNzg3MjEyOTg5Mjk2.XI9kriLWJ0vRdUwXZqyGwBe_g2o4bI4w1hutzej74LAg.0InB2CHqBDAcpnRXWtbrxfiaJjCQGc3wBZxRaT-byt4g.JPEG/KakaoTalk_20260807_152857287_22.jpg?type=w580",
  },
  {
    title: "대구 복사기렌탈 — 사무기기 설치, 함께 정리한 이야기 | 한별시스템 Kyocera TASKalfa",
    excerpt:
      "새 복합기는 들여놨는데, 그다음이 문제네요\" 대구에서 사무실을 운영하시는 대표님께 연락을 받았습니다. 복합기 렌탈 계약은 이미 끝냈는데, 정작 설치 당일이 되니 막막하다는 말씀이었습니다. \"기기는…",
    date: "2026-08-20",
    href: "https://hanbyeolsystem.blogspot.com/2026/08/kyocera-taskalfa.html",
    category: "소식",
    thumb: "https://jrzesjgyrvgvwazfajec.supabase.co/storage/v1/object/public/autopost-media/posts/eaed1e26-3bf1-4693-9368-4cbf52dc3364.jpg",
  },
  {
    title: "대구 복사기렌탈 — 공장 현장에 인터넷 연결요청, 함께 해결한 이야기",
    excerpt:
      "안녕하세요, 한별시스템입니다. 공장 현장에 인터넷 연결요청 이런 고민, 생각보다 많은 분들이 하십니다. 혼자 결정하기엔 막막하고, 잘못 고르면 비용만 나가니까요. 그래서 가장 부담이 적은 방법을 먼…",
    date: "2026-08-17",
    href: "https://hanbyeolsystem.blogspot.com/2026/08/blog-post_17.html",
    category: "소식",
    thumb: "https://jrzesjgyrvgvwazfajec.supabase.co/storage/v1/object/public/autopost-media/posts/b232dbe8-b458-4ccd-bcba-27bb910e0888.jpg",
  },
  {
    title: "대구 데이터 백업 — 여러 대에 흩어진 도면 파일, 함께 정리한 이야기 | 한별시스템 Synology DS925+",
    excerpt:
      "도면이 이 컴퓨터, 저 컴퓨터에 다 흩어져 있어요\" 대구에서 건축 설계사무실을 운영하시는 소장님께서 사무실을 방문해 달라고 연락을 주셨습니다. 통화 중에 이런 말씀을 하셨습니다. \"직원마다 컴퓨터에…",
    date: "2026-08-17",
    href: "https://hanbyeolsystem.blogspot.com/2026/08/synology-ds925_01849173883.html",
    category: "소식",
    thumb: "https://jrzesjgyrvgvwazfajec.supabase.co/storage/v1/object/public/autopost-media/posts/c7d1f5e2-1c38-44e5-b682-5e5fe0be27d4.jpg",
  },
  {
    title: "대구 복합기 임대 교세라 A3 A4 컬러 흑백 복사기 경북 렌탈 전문 업체 설치 후기",
    excerpt:
      "대구 복합기 임대 교세라 A3 A4 컬러 흑백 복사기 경북 렌탈 전문 업체 설치 후기 대구 복합기 임대 및 렌탈 전문 업체, 한별시스템입니다. 업무를 하면서 많은 사무기기들이 필요하지…",
    date: "2026-08-14",
    href: "https://hanbyeolsystem.blogspot.com/2026/08/a3-a4.html",
    category: "디지털복합기",
    thumb: "https://mblogthumb-phinf.pstatic.net/MjAyNjA4MTRfMTcw/MDAxNzg2NjgyMDQwNTA1.BmYOZZxQ5OtqV_g0RDYxY5JX4YJ-M7JvrHLPgbhCzNEg.CsjxJTdjTY-HKPwgHG4NYC5xL-QNtz2gyQnWdp_LBEQg.PNG/1.png?type=w580",
  },
  {
    title: "대구 경북 예천 NAS 사무실 시놀로지 나스 서버 구축 유지 관리 DS925+ 8TB HDD 설치 후기",
    excerpt:
      "대구 경북 예천 NAS 사무실 시놀로지 나스 서버 구축 유지 관리 DS925+ 8TB HDD 설치 후기 예천 NAS를 비롯한 대구 경북권의 나스 설치 및 관리 전문 업체, 한별시스템입니다.…",
    date: "2026-08-13",
    href: "https://hanbyeolsystem.blogspot.com/2026/08/nas-ds925-8tb-hdd.html",
    category: "NAS",
    thumb: "https://mblogthumb-phinf.pstatic.net/MjAyNjA4MTNfMjE0/MDAxNzg2NjA2MTY5MDY4.tA-vyUo2fjxiCkO7NVFDxJCsJoBU3DEJbVueCWRCMHog.sAXMJ4ymsyT5NQETl7pSpc_j9bjEMemBun-4-bAQmxQg.PNG/1.png?type=w580",
  },
];
