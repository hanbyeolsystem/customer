# 한별시스템 홈페이지 (v0.3 — Next.js 16)

기업 데이터·업무환경 IT 파트너 한별시스템의 공식 사이트.
이전 v0.2 정적 HTML 버전은 `v0.2-static-archive` 브랜치에 보존되어 있다.

## 스택
- Next.js 16 (App Router, Turbopack)
- React 19, TypeScript 5
- Tailwind CSS 4 (`@theme` 토큰)
- next-themes (다크모드 class 전환)
- Swiper 11 (구축사례 슬라이더)

## 개발
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
```

## 디자인 토큰 (브랜드 컬러)
`src/app/globals.css` 의 `@theme` 블록에서 일괄 수정:
- `--color-hb-primary` `#0F172A`
- `--color-hb-blue` `#2563EB`
- `--color-hb-blue-light` `#60A5FA`
- `--color-hb-bg` `#F8FAFC`

## 콘텐츠 수정 (관리자 페이지 없이)
- `src/data/site.ts` — 회사명·연락처·주소·SNS·통계 수치
- `src/data/services.ts` — 퀵서비스 6개·핵심서비스 4개
- `src/data/cases.ts` — 구축사례 카드 (실제 사례로 교체)
- `src/data/products.ts` — 임대 쇼핑몰 상품 6개
- `src/data/posts.ts` — 블로그 글 4개 (수동 등록 → 차후 RSS 자동화)

## 페이지 (16개 정적 prerender)
- `/` 메인
- `/nas` `/rental` `/shop` `/cases` `/blog` `/about`
- `/support` 허브 + `/support/remote` `/support/drivers` `/support/as` `/support/quote` `/support/supplies`
- `/privacy` `/terms` (준비 중)

## 배포

### Vercel (권장)
1. [vercel.com/new](https://vercel.com/new) → GitHub 로 로그인
2. `hanbyeolsystem/customer` 임포트
3. 자동 빌드/배포 (`main` 푸시 시마다 갱신)
4. 도메인: 한국어 도메인 `한별고객센터.kr`(`xn--bm3bm1i1e348cgwe.kr`) 연결

### GitHub Pages (대안, 정적 export 필요)
`next.config.ts` 에 `output: "export"` 추가 → `npm run build` → `out/` 폴더 push.

## TODO
- AS접수·상담 폼: Formspree 또는 Supabase Edge Function 으로 자동 전송 (현재 mailto)
- 블로그 RSS 자동 fetch (네이버 블로그)
- 실제 구축사례·인증서·파트너 로고 교체
- sitemap.xml, robots.txt
