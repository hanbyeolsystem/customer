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
- `src/data/site.ts` — 회사정보·전화·SNS·통계
- `src/data/services.ts` — 퀵서비스/핵심서비스
- `src/data/cases.ts` — 구축사례 (현재 모두 더미)
- `src/data/products.ts` — 임대 상품 (hbsys.kr SVG 재사용)
- `src/data/posts.ts` — 블로그 글 (현재 더미)

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
