// 네이버 블로그에서 가져온 글. 원본 JSON 은 scripts/naver-import.mjs 가 만든다(손으로 고치지 말 것).
import raw from "./naver-posts.json";

export type NaverBlock = { t: "p"; text: string } | { t: "img"; src: string; w?: number; h?: number; remote?: boolean };
export type NaverPost = {
  logNo: string;
  title: string;
  cat: string; // 사이트 분류(nas/printer/pc/case/service/etc) - related·사이트맵용
  catLabel: string; // 네이버 분류 이름 그대로 - 화면 묶음용
  date: string; // YYYY-MM-DD
  href: string; // 네이버 원문
  thumb?: string;
  excerpt: string;
  chars: number;
  images: number;
  related: { href: string; label: string };
  caseSlug?: string;
  blocks: NaverBlock[];
};

export const naverPosts = raw as NaverPost[];
export const naverPostByNo = (logNo: string) => naverPosts.find((p) => p.logNo === logNo);

// /blog/<logNo>/ 는 네이버 원문 사본이라 기본은 검색 제외(noindex,follow)·사이트맵 제외다(2026-11-14).
// 구글이 사본 161쪽을 "크롤링됨-색인 안 됨"으로 두고, 네이버는 홈까지 미색인이었다.
// 예외 = 2026-08~11 서치콘솔에서 클릭을 1회라도 받은 글 25편(전부 복합기·NAS 글). 이 글들로 들어오던
// 유입(3개월 약 35클릭)은 지키고 나머지 사본만 뺀다. 새로 가져오는 글은 자동으로 제외된다.
export const indexedBlogPosts = new Set([
  "221185808007", // 교세라 스캔설정 방법
  "221204514392", // 교세라 복합기 메일설정방법
  "221296835084", // 교세라 복합기 메일설정방법 - 구버젼
  "221490085461", // 교세라 M5526cdn 출력 속도 느림
  "221514480544", // 2552ci 소음
  "221707795667", // 교세라 M5526 펌웨어
  "221742447214", // 교세라 M5521 파랑색 색깔
  "222179254351", // 브라더 j2720 잉크흡수제
  "222180964586", // M5521 M5526 출력물 줄
  "222242615017", // M5521 M5526 전사벨트 수리
  "223309376476", // 교세라 3212i 설치
  "223803467635", // 대구복합기임대 프린트 대여 수리
  "223912387550", // 대구 프린터 수리 교세라 M5526cdn
  "223962535701", // 초보자용 쉬운 NAS 사용법
  "223971880698", // 시놀로지 NAS 초기 구축 DSM 설정
  "224029829378", // 시놀로지 나스 설정 DSM 초기 세팅
  "224036775083", // 가정용 NAS 서버 구축
  "224074824367", // 대구복합기임대 사무실 환경 개선
  "224147645882", // 대구복사기임대 가성비 복합기
  "224165450249", // 벤트사이 핸드헬드 잉크젯 수리
  "224214030524", // NAS 서버 구축 장단점
  "224246751118", // IPTIME NAS 와 시놀로지 비교
  "224306875156", // 안동 병원 NAS
  "224416042808", // 경남 진주 NAS 구축
  "224435029884", // 창원 NAS 장비 교체 전 확인
]);

// 네이버 분류 이름을 그대로 묶음으로 쓴다(글 수 많은 순). 아이콘은 분류 성격으로 고른다.
function iconFor(label: string) {
  if (/NAS|나스/.test(label)) return "";
  if (/설치사례/.test(label)) return "";
  if (/복합기|프린터|토너|교세라|브라더|라벨|핸드/.test(label)) return "";
  if (/컴퓨터|PC|위더스/.test(label)) return "";
  if (/서비스|안내|공지/.test(label)) return "";
  return "";
}
export const naverCats: { id: string; label: string; icon: string; n: number }[] = (() => {
  const count = new Map<string, number>();
  for (const p of naverPosts) count.set(p.catLabel, (count.get(p.catLabel) || 0) + 1);
  return [...count.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, n]) => ({ id: label, label, icon: iconFor(label), n }));
})();
