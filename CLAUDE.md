# Customer (한별시스템 홈페이지 v0.3 — Next.js) — Claude 작업 컨텍스트

이 폴더는 한별시스템 공식 사이트(IT 인프라 전문기업 브랜딩) Next.js 소스.

## 별칭
사용자가 "고객사이트" / "고객센터" / "한별 홈페이지" / "customer" 라고 하면 이 폴더.
이전 정적 HTML 버전은 `v0.2-static-archive` 브랜치에 보존되어 있다.

## 정체
- GitHub: https://github.com/hanbyeolsystem/customer
- 호스팅: **Vercel** (사용자가 vercel.com/new 에서 임포트 후 자동 배포)
- 도메인: `한별고객센터.kr` (퓨니코드 `xn--bm3bm1i1e348cgwe.kr`) — `public/CNAME`

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

## 작업 자동 배포
`main` 브랜치 push 시 Vercel 이 자동 빌드. 사용자에게 별도 배포 요청 불필요.

관련: [[project_customer_center]] — 메모리에는 v0.1 정적 사이트 기록. 본 v0.3 Next.js로 완전 교체됨.
