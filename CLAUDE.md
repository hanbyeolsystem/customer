# Customer Center — Claude 작업 컨텍스트

이 폴더는 한별고객센터 (Hanbyeol Customer Center) 의 정적 사이트 소스.

## 별칭
사용자가 다음 표현을 쓸 때 이 폴더로 진입:
- "고객센터", "고객용 사이트", "한별고객센터", "customer center"

## 핵심 정체
- GitHub: https://github.com/hanbyeolsystem/customer (2026-06-13 생성, PUBLIC)
- 라이브: https://hanbyeolsystem.github.io/customer/
- 정적 HTML + CSS. JS 빌드 없음.
- 로컬 `.git` 동기 — 수정 후 `git add -A && git commit && git push` 으로 즉시 배포 반영 (1~2분).

## 디자인 톤
- **영업PPT v2 와 통일**: `#1d4ed8` 한별 블루, `#f59e0b` 앰버
- 폰트: Pretendard CDN
- **모바일 퍼스트**: 360~414px 기준 설계, 720px 이상에서 데스크탑 확장

## 관련 자산
- 기획서: `../planning/00_기획서.md`
- 882 옛 시안: `../882-redesign-*.html` (참고만 — 컬러는 폐기)
- 영업PPT 디자인 ref: `../../영업자료/v2_2026-06/01_영업PPT.html`

## 외부 연결 (URL 주의)
| 연결처 | URL | 임베드 위치 |
|---|---|---|
| 드라이버 | https://882.kr/ | `/drivers/` iframe |
| 에러코드 | https://hanbyeolsystem.github.io/hanbyeol-errorcode/ | `/error/` iframe |
| 임대·판매 | https://hbsys.kr/ | `/rental/` iframe |

세 URL 모두 X-Frame-Options/CSP 없어 iframe 임베드 OK (2026-06-13 검증).
사용자 요구: **새 탭으로 안 열림**. 모든 외부 사이트는 한별 헤더 안 iframe.
변경 시 grep 으로 일괄 교체.

## 자주 막혔던 점 (반복 안 하기)
- 882 시안의 네이비+오렌지 컬러는 **폐기**. 한별 블루로 통일.
- 메인 카드는 4+3 그리드 — 4(주요) + 3(보조). 변경 시 메인 균형 점검.
- 모바일 카드는 2열, PC 는 4열. 720px breakpoint.

## v0.1 (이번 세션) 산출물
- index.html (메인)
- drivers/ rental/ shop/ error/ faq/ about/ contact/ 7개 placeholder
- 404.html
- css/tokens.css + css/components.css

## v0.5 (다음 세션) 진입 시 할 일
1. 임대관리 사이트(`../../../임대관리/`)의 rental_items 에서 보유 수 TOP 모델 추출
2. `data/drivers.json` 스키마 작성 (기획서 4-5 참조)
3. `drivers/index.html` 검색·필터 UI 구현
4. 모델 상세 페이지 `drivers/m/{slug}/` 5건 시범 작성
5. 드라이버 파일 하이브리드 호스팅 결정 (한별 git-lfs vs 제조사 링크 분류)

## 함정
- GitHub Pages 100MB 파일 제한 — 큰 드라이버는 git-lfs 또는 제조사 링크
- 한글 폴더명 (`고객용사이트/`) — 리포로 푸시 시 영문(`customer/`) 폴더만 푸시
- 검색 폼 action 은 `drivers/` 로 GET — `q` 쿼리스트링 처리는 v0.5
