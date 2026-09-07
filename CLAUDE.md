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
  새 사진을 넣으면 optimize → to-webp 순서로 돌리고 `.webp` 경로로 참조할 것. og.jpg·icons/ 는 JPEG/PNG 유지(SNS 카드·PWA 규격).
  `brand/logo.png` 는 **원본 소스로 남겨 둔다**(gen-og.mjs·generate-icons.mjs 가 읽는다). 화면·스키마 image 는 `brand/logo.webp`(307x336, 17KB).
- **외부 이미지는 리포 안에 복제한다.** 임대 쇼핑몰 카드 사진은 `public/products/*.webp` 다.
  예전엔 hbsys.kr PNG(장당 350~380KB, 6장 2.2MB)를 직접 불러 모바일에서 빈 흰 박스로 남았다.
  상품이 바뀌면 원본을 받아 600px WebP(q82)로 눌러 넣고 `src/data/products.ts` 경로만 고친다.
- 점수·할 일 관리는 종합관리툴 **🔍 사이트 노출 지수**(`한별시스템\임대관리\seo-board`). 재측정은 `node tools/seo-audit/audit.mjs hanbyeol`.
  2026-08-27 측정: 종합 79 (기술 93 · 콘텐츠 76 · GEO 87 · 오프사이트 54). 오프사이트가 병목 = 네이버 블로그 50편에 사이트 링크 0편.

## 폰트·홈 무게 (2026-09-01)
- **Pretendard 는 self-host**(`public/fonts/pretendard` 92조각 + `src/app/pretendard.css`).
  `scripts/fetch-pretendard.mjs` 가 만들며 **pretendard.css 를 손으로 고치지 말 것**. 버전은 스크립트의 `PRETENDARD_VERSION`.
- 가변 폰트(`font-weight: 45 920`) dynamic subset 이라 파일 하나가 실제 쓰는 6개 웨이트(400·500·600·700·800·900)를 전부 덮고,
  브라우저는 화면에 그리는 글자가 든 조각만 받는다. 실측 홈 437KB(예전 jsDelivr 풀 로드는 6.7MB).
  **jsDelivr `@import` 로 되돌리지 말 것.** `font-display: swap` 유지, 첫 화면용 조각 90·91 은 layout.tsx 에서 preload.
- `--font-sans` 폴백에 시스템 한글 폰트(Malgun Gothic 등)를 반드시 남길 것. 폰트가 못 와도 한글이 깨지면 안 된다.
- **사이트 글꼴(2026-09-08 사장님 확정) = 본문 Inter + Noto Sans KR, 제목·상품명·강조 여기어때 잘난체 고딕**.
  본문 글꼴은 시놀로지 KR 사이트와 같은 구성(`scripts/fetch-webfonts.mjs` 가 Google Fonts 가변 조각 131개 4MB 를 `public/fonts/webfonts/` + `src/app/webfonts.css` 로),
  제목은 `python scripts/build-jalnan.py` 가 만든 92조각(`public/fonts/jalnan/` + `src/app/jalnan.css`, `font-weight: 100 900`). Pretendard 는 폴백만. 세 css 는 손으로 고치지 말 것.
  이력: 9/6 산돌 지정(유료라 불가) → 잘난체 전체 → 9/7 본문 Pretendard → 9/8 시놀로지 글꼴(Inter+Noto) 시도 → 같은 날 "본문은 지금 글꼴, 제목은 잘난체"로 확정.
  토큰: `--font-sans`(본문·mono) / `--font-display`(h1~h3 base, `font-display` 유틸, 상품명)=잘난체 / `--font-effect`(히어로 강조)=display.
  layout.tsx preload 는 잘난체 91·90·89 + Inter 7 + Noto 120·119·118.
- 히어로 배경 영상(2MB)은 **모바일에서 받지 않고**(`minWidth={1024}`) 데스크탑도 첫 페인트 뒤 `requestIdleCallback` 때 받는다.
  포스터(`hero-poster.webp` 57KB)는 항상 즉시. 영상은 장식이라 늦게 떠도 된다.

## 디자인 (2026-09-08 리디자인 - "AI 느낌 빼고 슬라이드형 고급 홈, 폰 최적화" 사장님 지시)
- **버린 것**: 유리 패널·글로우·격자(console-grid)·깜빡이는 점(hb-blink)·모노 대문자 eyebrow·아이콘 타일·배지 칩·카드 그림자·hover 확대·"→" 남발.
  다시 넣지 말 것. 장식은 얇은 선(`--line`)과 여백으로만 한다. 버튼은 `rounded-md`, 잉크(검정)/흰색 채움, 파랑은 링크·강조 한 단어에만.
- **팔레트**: 흰 바탕 `--bg #FFFFFF`(2026-09-08 사장님 "기본 바탕화면은 흰색") / `--panel #F3F3F0` / 잉크 `#15191D` / 회색 `#5E656C` / 선 `#DEDED8`, 밤 `hb-primary #0C1820`, 브랜드 블루 `hb-blue #0F5F8E`(온다크 `hb-blue-light`). 다크모드는 `.dark` 변수.
- **홈 = 슬라이드 8장**(`page.tsx` 순서 = `SlideHead no`): 01 표지(Hero) · 02 하는 일(CoreServices) · 03 사내 AI(AiSlide, 실측값) · 04 RAID 계산기(RaidSlide) · 05 현장(CaseStudies) · 06 임대(RentalShop) · 07 지원(QuickService) · 08 소식·연락(BlogFeed).
  각 섹션은 `.hb-slide`(min-height 100svh-헤더, 스냅 proximity, id 있음). 데스크탑 `SlideNav` 가 오른쪽에 장 번호. 슬라이드를 넣고 빼면 번호를 같이 고칠 것.
  데스크탑 1440×900 에서 한 장이 한 화면에 들어가야 한다(임대는 6열, 소식은 4건인 이유). RAID 계산기는 디스크를 넣으면 결과가 아래로 늘어난다(예외).
- **RAID 계산기**(2026-09-08, 시놀로지 RAID Calculator 참고 자체 구현): 계산은 `src/lib/raid.ts`(SHR 층 계산·RAID 0/1/5/6/10·JBOD), 화면 `components/RaidCalculator.tsx`(홈 슬라이드는 `compact`, 전체는 `/nas/raid-calculator/` 페이지: 참고 5항+FAQ). 규칙을 바꾸면 `node scripts/raid-check.mjs` 로 손계산 값과 대조할 것.
  2026-09-08 시놀로지 형식 홈(검정 헤더·배너 캐러셀·드롭다운 메뉴)을 한 번 만들었다가 사장님 지시로 슬라이드 홈으로 되돌렸다(커밋 5112e86 참고). RAID 계산기만 남겼다.
- **모바일**: 하단 고정 바 `MobileBar`(전화·원격지원·견적, lg 미만) + body `pb-14`. ChatWidget 버튼은 바 위로 올려 둠. 표지는 폰에서 하단 바만큼 아래 여백. 폰에서는 Swiper 화살표 숨김.
  본문 `word-break: keep-all`(어절 단위 줄바꿈). 헤더는 홈 맨 위에서만 투명(`overHero`)이고 로고 뒤에 흰 판.
- **글꼴 슬롯**은 위 "폰트·홈 무게" 참고(제목 잘난체, 본문 Pretendard). 슬라이드 제목은 폰 30px / 데스크탑 52px, 표지 h1 은 38/76px.
- 화면 확인은 Edge 헤드리스가 폰 폭(390)을 못 만들므로 `agent-browser set viewport 390 800` 으로 찍는다. Edge 는 창 높이 = 100svh 라 전체 페이지 캡처가 슬라이드마다 늘어나니 슬라이드별로 찍을 것.

## 디자인 토큰 (변경 시 `globals.css @theme`)## 디자인 토큰 (변경 시 `globals.css @theme`)
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
- 스키마의 날짜(datePublished/dateModified/dateCreated)는 **반드시 `isoDateTime()`(`src/lib/schema.ts`)** 으로 감싼다.
  날짜만("2026-08-22") 넣으면 Search Console 이 "datetime 시간대 누락/값 오류"(Q&A 8건, 2026-08-29) 를 보낸다. 데이터 파일의 값은 날짜만 두고 페이지에서 변환.
- Product(/nas/model/*, /nas/buy/) 의 `review`·`aggregateRating` 누락 경고는 **실제 후기가 생기기 전엔 채우지 말 것**(지어낸 평점은 정책 위반). 권장 항목이라 노출엔 영향 없음.
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
- **지도·플레이스 등재는 `site.listings`**(`src/data/site.ts`). 네이버 플레이스 1866521598 · 카카오맵 1828766417 은
  2026-09-01 실측으로 확인한 ID 다. `sameAs`(layout.tsx) 와 화면(푸터 "지도에서 보기", /contact/ 길찾기 버튼)이
  같은 값을 쓴다. **ID 를 추측해서 넣지 말 것** - 실제로 열어 업체명이 한별시스템인지 확인한 주소만 넣는다.
  당근 비즈프로필은 공개 웹 주소를 확인하지 못해 빠져 있다(내부 ID 2310438 로는 안 열린다).
- **페이지 갱신일은 `webPageLd()` + `<UpdatedAt />`**(`src/lib/schema.ts`, `src/components/UpdatedAt.tsx`).
  서비스·가격 페이지(/nas/ /nas/buy/ /nas/price/ /rental/ /rental/price/ /ai/ /network/)에 붙어 있다.
  `dateModified` 는 schema.org 상 CreativeWork 속성이라 Service·Product 에 직접 붙이지 않는다.
  대신 WebPage 노드에 싣고 `mainEntity` 로 그 페이지의 Service·Product `@id` 를 가리킨다.
  날짜는 **`lastmod.json`(git 커밋 날짜) 한 출처**에서만 읽는다. 하드코딩·`new Date()` 금지.
  사이트맵에만 필요한 동적 라우트(예 `/nas/model/`)는 `gen-lastmod.mjs` 의 `dynamicRoutes` 에 추가한다.
- 서비스 지역을 구·군 단위로 화면에 적은 페이지는 스키마 `areaServed` 도 같이 맞춘다.
  목록은 `schema.ts` 의 `daeguDistricts`(대구 7구 2군) / `gyeongbukCities` / `daeguGyeongbukServed` 한 곳에서 온다.
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
