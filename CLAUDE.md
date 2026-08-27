# Customer (한별시스템 홈페이지 v0.3 — Next.js) — Claude 작업 컨텍스트

이 폴더는 한별시스템 공식 사이트(IT 인프라 전문기업 브랜딩) Next.js 소스.

## 별칭
사용자가 "고객사이트" / "고객센터" / "한별 홈페이지" / "customer" 라고 하면 이 폴더.
이전 정적 HTML 버전은 `v0.2-static-archive` 브랜치에 보존되어 있다.

## 정체
- GitHub: https://github.com/hanbyeolsystem/customer
- 호스팅: **GitHub Pages** — `.github/workflows/deploy.yml`이 main push 시 Next 정적 빌드 후 자동 배포 (약 1분 소요, CDN 캐시 max-age=600 이라 반영 확인은 최대 10분 후). ※ 과거 문서의 "Vercel" 표기는 오기(2026-08-22 정정). 응답 헤더 Server: GitHub.com 으로 확인됨.
- 도메인: `한별시스템.kr` (퓨니코드 `xn--bm3bm1i1e348cgwe.kr`) — `public/CNAME`
  ※ 과거 문서에 "한별고객센터.kr"로 잘못 적혀 있었음(2026-08-22 정정). 한별고객센터.kr의 퓨니코드는 `xn--i49alou70b2kep5x7wf.kr`로 전혀 다른 도메인.

## 스택 (Next.js 16, 학습데이터와 다를 수 있으니 `node_modules/next/dist/docs/` 참조)
- Next.js 16 App Router · React 19 · TypeScript 5
- Tailwind v4 (`@theme` 블록 — `tailwind.config` 없음)
- next-themes (class 기반 다크모드, ThemeProvider 가 attribute="class")
- Swiper 11

## 콘텐츠 데이터 (관리자 페이지 없이 코드로 수정)
- `src/data/site.ts` — 회사정보·전화·SNS·통계·자사 운영 사이트(owned)
- `src/data/services.ts` — 퀵서비스/핵심서비스
- `src/data/cases.ts` — 구축사례 20건. **전부 네이버 블로그 실제 후기에 근거**. 파일 상단 규칙 준수
- `src/data/synology.ts` — ⭐시놀로지 본체·디스크 단가와 모델 정보. **금액의 단일 출처**
- `src/data/guides.ts` — 가이드(비교표 칼럼) 30편
- `src/data/qna.ts` — Q&A 256문답 (ai/nas/printer/pc/network/service)
- `src/data/qna-deep.ts` — Q&A 심화 본문(slug별 섹션·비교표). 본문이 얇은 문항부터 여기에 채운다
- `src/data/products.ts` — 임대 상품 (hbsys.kr SVG 재사용)
- `src/data/posts.ts` — 네이버 RSS 폴백 스냅샷

## 포지셔닝 (2026-08-26 전환 — 되돌리지 말 것)
"대구 NAS 설치 업체"는 경쟁자가 많아 차별화가 안 된다. **"기업 데이터 관리 + 사내 AI"** 로 옮겼다.
근거는 실재한다: 한별시스템이 자사 NAS(Ryzen V1500B·RAM 4GB)에서 로컬 LLM 컨테이너를
2026-08-03 부터 직접 운영 중이고 답변 7~60초·초당 11~12토큰·상주 메모리 2.1GB를 실측했다.
- `/ai/` 가 이 포지션의 핵심 페이지. **수치는 전부 실측값이며 추측으로 바꾸지 말 것.**
- 소형 모델의 계산 오류 같은 한계도 페이지에 그대로 공개한다(숨기면 신뢰가 깨짐).
- 태그라인·홈 히어로·llms.txt 요약문이 한 세트다. 하나 바꾸면 나머지도 맞출 것.

## 정보 독점 구조 (모델명·문제 단위로 색인 페이지를 만든다)
"시놀로지 DS925+ 설치" 를 검색하면 한별 페이지가 나오게 하는 것이 목표. 색인 페이지 342개.
- `/nas/model/[slug]/` 6종 — 모델명 검색을 받는 착지 페이지. 구성별 견적을 `synology.ts` 에서 자동 계산
- `/cases/[slug]/` 20건 — "지역+장비+업종" 롱테일. 새 사례는 `node scripts/gen-case-draft.mjs` 로 초안 생성
- `/guide/[slug]/` 30편 — 비교표 중심. AI 검색이 표와 숫자를 그대로 인용한다
- `/qna/[slug]/` 256건 — 질문 단위 색인
- `/qna/cat/[cat]/` 6종 — 분류별 목록. **FAQPage 스키마는 여기에만**(/qna/ 는 CollectionPage). 예전엔 /qna/ 한 장이 587KB 였다
- 새 콘텐츠를 넣으면 `src/app/sitemap.ts` 에도 추가할 것(자동 아님)

## 노출 지수 100점 작업 (2026-08-27) — 규칙으로 굳은 것
- **관련글은 순환 배정**(Q&A `sameCat[(idx+1+i) % n]`, 가이드도 동일). `.slice(0, N)` 으로 앞 N개만 고르면 그 N개만 링크를 받고
  나머지 250개가 고립된다(실측: 내부 링크 1개뿐인 페이지 166개 → 해결).
- **준비중 페이지를 사이트맵에 두지 말 것.** ComingSoon 컴포넌트를 쓰는 페이지가 생기면 내용을 채우거나 sitemap 에서 뺀다.
- **빵부스러기는 `breadcrumbLd()`**(`src/lib/schema.ts`), 즉답은 `AnswerBlock`. 새 페이지는 둘 다 넣는 것이 기본.
- 커뮤니티 글은 `community/page.tsx` 가 빌드 시점에 Supabase 에서 받아 `CommunityBoard initialPosts` 로 넘긴다(크롤러용).
  하루 3번 재빌드 크론이 새 글을 반영한다.
- 이미지는 `node scripts/optimize-images.mjs` 로 한 번 눌러서 커밋(mozjpeg q78, 최대 1400px). Q&A 카드는 `qnaImage(cat, slug, "thumb")` 480px.
- **화면은 WebP 를 쓴다**(2026-08-27). `node scripts/to-webp.mjs` 가 cases·blog-assets·hero·video·blog-posts 의 JPEG/PNG 를 .webp 로 만든다(원본 JPEG 는 옛 링크용으로 두고, blog-posts 만 원본 삭제).
  새 사진을 넣으면 optimize → to-webp 순서로 돌리고 `.webp` 경로로 참조할 것. og.jpg·brand/logo.png·icons/ 는 JPEG/PNG 유지(SNS 카드·구글 로고·PWA 규격).
- 점수·할 일 관리는 종합관리툴 **🔍 사이트 노출 지수**(`한별시스템\임대관리\seo-board`). 재측정은 `node tools/seo-audit/audit.mjs hanbyeol`.
  2026-08-27 측정: 종합 79 (기술 93 · 콘텐츠 76 · GEO 87 · 오프사이트 54). 오프사이트가 병목 = 네이버 블로그 50편에 사이트 링크 0편.

## 디자인 토큰 (변경 시 `globals.css @theme`)
- `--color-hb-primary` `#0F172A`
- `--color-hb-blue` `#2563EB` / `--color-hb-blue-light` `#60A5FA` / `--color-hb-blue-soft` `#DBEAFE`
- `--color-hb-bg` `#F8FAFC`
- 다크모드 색은 `:root` / `.dark` CSS 변수

## 자주 막힐 점
- Tailwind v4 다크모드는 `@custom-variant dark (&:where(.dark, .dark *));` 로 정의됨 — `dark:` 접두사 사용 가능
- Next.js 16 Image: 외부 이미지는 `next.config.ts`의 `remotePatterns` 에 등록 필수 (현재 images.unsplash.com, hbsys.kr 등록됨)
- 폼은 모두 `mailto:` 방식 — 다음 단계로 Formspree/Edge Function 권장
- 한글 폴더 `고객용사이트/` 안에 있지만 git push 는 `customer/` 리포로 됨

## 색인(SEO) 규칙 — 2026-08-24 Search Console 경고 대응으로 확립
- `trailingSlash: true` 라서 GitHub Pages 는 `/nas` → `/nas/` 로 **301** 한다.
  `src/app/sitemap.ts` 의 URL 은 **반드시 끝에 슬래시**를 붙일 것. 안 붙이면 Search Console 이
  전 페이지를 "리디렉션이 포함된 페이지"로 색인 제외한다.
- 색인 대상 페이지는 **전부 self-canonical** 필수: 각 page 의 metadata 에
  `alternates: { canonical: "/경로/" }` (metadataBase 기준 상대경로, 슬래시 포함).
- 폼 페이지를 `"use client"` 로 만들면 metadata 를 못 내보내 title/description 이 홈과 같아지고
  "중복 페이지"로 색인 제외된다. → 폼은 별도 클라이언트 컴포넌트로 빼고 page.tsx 는 서버로 유지
  (`support/as/AsForm.tsx`, `support/quote/QuoteForm.tsx` 가 그 형태).
- noindex 페이지(`/go/`)와 Next 부산물(`/404/`, `/_not-found/`)은 **사이트맵에 넣지 말 것**.
  robots.txt 로 막으면 안 된다(막으면 구글이 noindex 자체를 못 읽는다).
- Q&A 구조화 데이터(QAPage/FAQPage)는 `datePublished`·`dateModified`·`author`·`upvoteCount`·`url`
  누락 시 경고가 뜬다. 날짜는 `src/data/qna.ts` 의 `qnaPublished`/`qnaModified` 상수를 쓰며,
  **Q&A 본문을 고치면 `qnaModified` 도 함께 갱신**할 것.

## GEO/AEO (AI 검색 인용 최적화) — 2026-08-24 적용
- `public/robots.txt` 는 AI 크롤러 30종을 명시 허용. **차단 추가 금지**(GEO 목적이 인용 유도).
- `public/llms.txt` / `public/llms-full.txt` 는 **손으로 고치지 말 것**. `scripts/gen-llms.mjs` 가
  `src/data/qna.ts` + 회사 사실 블록에서 생성하며, `package.json` 의 `prebuild` 로 매 빌드마다 재생성된다.
  문구를 바꾸려면 gen-llms.mjs 안의 `FACTS` / `SERVICES` / `DIFF` 상수를 고칠 것.
- 회사 엔티티는 `layout.tsx` 의 `@graph`(LocalBusiness + WebSite) **한 곳에서만** 선언한다.
  다른 페이지 스키마에서 회사를 가리킬 땐 `businessId`(`src/data/site.ts`)를 `@id` 로 참조.
  Organization 스키마를 따로 만들면 엔티티가 쪼개지므로 만들지 말 것.
- 위경도(`site.geo`)는 네이버 지역검색 API 실측값이다. **추측으로 바꾸지 말 것.**
- 즉답 블록은 `src/components/AnswerBlock.tsx` 사용(질문형 h2 + 결론부터 2~3문장 + 수치 칩).
  현재 `/nas` `/rental` `/support` 상단에 배치. 확인 안 된 수치는 절대 넣지 말 것.
- **OG/트위터 카드 이미지**는 `public/og.jpg`(1200x630). `scripts/gen-og.mjs` 로 만들어 **커밋해 둔 결과물**이며
  빌드 때 다시 만들지 않는다(한글 폰트가 있는 로컬에서만 실행). 문구·사진을 바꾸려면 그 스크립트를 고치고
  `node scripts/gen-og.mjs` 실행 후 결과 이미지를 함께 커밋할 것.
- **서비스·가격 구조화 데이터**는 `src/lib/schema.ts` 의 `serviceLd()` / `monthlyOffer()` 를 쓴다.
  서비스 `@id` 는 `serviceId("/nas/")` 형태이고 **`layout.tsx` 의 `serviceCatalog` 항목 id 와 반드시 같아야**
  하나의 엔티티로 합쳐진다. 같은 @id 를 여러 페이지에서 쓸 때 `url` 은 서비스 대표 페이지로 통일하고
  가격 페이지 같은 부속 화면은 `channelUrl` 로 넘긴다.
  금액을 고치면 **화면 배열과 스키마 양쪽**(`prices`/`packages` + `offers`)을 같이 고칠 것.
- **사이트맵 lastmod 는 git 커밋 날짜**다. `scripts/gen-lastmod.mjs` 가 prebuild 로 `src/data/lastmod.json` 을
  만든다. `new Date()` 로 되돌리지 말 것 - 하루 3번 도는 재빌드 크론 때문에 "전 페이지가 매일 수정됨"이 되어
  구글이 lastmod 를 통째로 무시한다. CI 는 `fetch-depth: 0` 이 필요하고, 얕은 클론이면 날짜를 비워
  사이트맵에서 lastmod 를 생략한다(틀린 날짜보다 없는 편이 낫다).
- 회사 `@id`(businessId)를 참조할 땐 **`{ "@id": businessId }` 만** 쓴다. `"@type": "Organization"` 을
  같이 붙이면 LocalBusiness 노드와 타입이 겹쳐 엔티티가 흐려진다.
- 자사 운영 사이트(882.kr·hbsys.kr·에러코드)는 `site.owned` 에 모아 두고 `sameAs` 로 내보낸다. 새 사이트가 생기면 여기 추가.
- 가격 페이지(`/rental/price/`·`/nas/price/`)는 "얼마"로 검색해 들어오는 핵심 페이지라 **푸터에서 전 페이지 링크**를 준다.
- **금액은 `src/data/synology.ts` 한 곳에만 적는다.** /nas/price/ 와 /nas/model/* 가 같이 읽는다.
  복합기 임대료는 `/rental/price/` 의 `prices` 배열과 그 페이지 스키마 `offers` 두 곳을 같이 고칠 것.
- **없는 사례·없는 수치를 만들어 넣지 말 것.** 구축사례는 원문 후기 링크가 있어야 하고,
  실적 수치(170곳/50건/300대/19년)는 `site.ts` 기준이며 임의로 부풀리지 않는다. 이게 무너지면
  E-E-A-T 와 AI 인용 신뢰도가 같이 무너진다.
- 지역 키워드는 "대구/달서구/성서공단/경북" + 서비스 조합으로 title·description·본문에 자연스럽게만.
  네이버 데이터랩 실측: **렌탈 > 임대**(4~14배), 나스(한글) > 시놀로지, 토너교체·랜공사·대구컴퓨터수리 강세.
  홈 타이틀에 "대구"를 넣은 이유는 동명의 서울 에어커튼 업체가 브랜드 단독 검색을 점유하기 때문.

## 표기 규칙
- 사용자에게 보이는 텍스트에 **em-dash(—)·en-dash(–) 금지**, 일반 하이픈(-)만 사용.
  외부에서 들어오는 문자열(블로거 RSS, news.json)은 `dedash()` (`src/lib/utils.ts`) 로 정리한다.

## 작업 자동 배포
`main` 브랜치 push 시 **GitHub Pages** 워크플로(`.github/workflows/deploy.yml`)가 자동 빌드·배포.
사용자에게 별도 배포 요청 불필요. (Vercel 아님)

관련: [[project_customer_center]] — 메모리에는 v0.1 정적 사이트 기록. 본 v0.3 Next.js로 완전 교체됨.

## 유튜브 (2026-08-26)
10편 기획안·대본이 `고객용사이트/유튜브-10편-기획안.md` 에 있다. 영상은 사장님이 직접 촬영.
영상 URL 이 생기면 각 서비스 페이지에 임베드 + `VideoObject` 스키마를 붙인다.
**영상이 없는 상태로 /video/ 같은 빈 페이지를 미리 만들지 말 것**(빈 페이지는 색인에 해가 된다).

## 네이버 블로그 이관 (2026-08-27) — /blog/<logNo>/ 286편
네이버 블로그 글 전체(2017~)를 본문·사진째 사이트에 둔다. 링크만 두면 검색어가 네이버로 가고, 사이트에 두면 한별시스템.kr 로 들어온다.
- `scripts/naver-list.mjs` 가 모바일 목록 API(`/api/blogs/hanbyeolsystem/post-list`)로 전체 글을 열거한다(RSS 는 최신 50편뿐).
- `scripts/naver-import.mjs` 가 글을 받아 `src/data/naver-posts.json` 을 만든다. **손으로 고치지 말 것.** 워크플로 `naver-import.yml` 이 하루 3번 새 글만 추가.
  - `--all` 전부 다시, `--only <logNo,...>` 특정 글만, `--redo-noimg` 사진 0장 글만 다시, `DEBUG=1` 로 사진 실패 사유 출력.
  - 사진 정책: 글당 앞 2장만 900px 로 저장(`public/blog-posts/<logNo>/`), 나머지는 네이버 CDN `?type=w966` 그대로(외부 referer 허용 실측). 전부 저장하면 저장소가 100MB 를 넘는다.
  - 본문 추출은 SmartEditor ONE → SmartEditor 2(`se_component_wrap`, 2017~18) → 구형 `post_ct` 순으로 시도. 2017년 글 대부분은 원래 사진이 없다.
  - **sharp 함정**: 같은 sharp 객체에 `.raw()` 를 부른 뒤 `.extract()` 하면 헤더 없는 raw 버퍼가 나와 "unsupported image format" 이 난다. `cropBands()` 는 판독용/자르기용 객체를 분리해 두었다. 되돌리지 말 것.
- 화면: `/blog/` 는 네이버 분류명(catLabel) 그대로 묶고, `/blog/[logNo]/` 는 BlogPosting + 빵부스러기 + 관련 비용 페이지·구축사례 링크 + 같은 분류 순환 4편.
- **구글 블로거 발행은 하루 4편**(`blogger-crosspost.yml`, 09:40/21:40 × 2편, `--all` 모드). 새 글 우선, 옛 글은 `published` 에 원래 날짜. 한꺼번에 수백 편 올리면 블로거 스팸 판정 위험. dispatch 입력 `backfill=all` 은 비상용 일괄 발행.

## 영문 거울 도메인 hanbyeolsystem.kr (2026-08-27)
- claude.ai 등 한글 도메인을 못 읽는 AI 도구용. 리포 `hanbyeolsystem/hanbyeolsystem-kr` 의 워크플로가 **이 리포를 그대로 빌드**해 Pages 로 올린다(하루 3번 + 수동). 소스는 여기 하나뿐.
- 거울은 전 페이지 `noindex, follow` + 사이트맵 없음 + canonical 은 한별시스템.kr 그대로 → 검색 점수는 원본에만. **대표 주소를 바꾸는 게 아니다.** 사이트맵·스키마·서치콘솔은 계속 한별시스템.kr.
- 빌드가 깨지면 거울도 같이 깨진다. `npm run build` 통과가 곧 거울 배포 조건.
