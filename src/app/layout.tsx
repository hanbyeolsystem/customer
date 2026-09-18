import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { MobileBar } from "@/components/MobileBar";
import { Reveal } from "@/components/Reveal";
import { Analytics } from "@/components/Analytics";
import { site } from "@/data/site";
import { siteGraph } from "@/lib/business-ld";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} - ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "기업 데이터 관리", "사내 AI", "온프레미스 AI", "사내 AI 구축", "NAS AI",
    "시놀로지 NAS AI", "로컬 LLM 구축", "사내 문서 AI 검색", "데이터 백업 컨설팅",
    "대구 나스", "대구 NAS 구축", "경북 NAS 구축", "시놀로지 나스", "대구 데이터 백업",
    "대구 NAS 판매", "나스 판매", "시놀로지 나스 판매", "NAS 구입", "NAS 견적", "시놀로지 공식 대리점",
    "DS925+ 설치", "DS1825+ 구축", "DS225+ 설치", "DS425+ 설치", "RS2421+ 구축",
    "랜섬웨어 NAS", "NAS 복구", "NAS 하드 교체", "나스 이관", "NAS to NAS",
    "대구 복합기렌탈", "복합기 렌탈", "성서공단 복합기렌탈", "달서구 복합기렌탈",
    "대구 복사기렌탈", "프린터 렌탈", "전국 프린터 렌탈", "토너 교체",
    "대구 컴퓨터수리", "달서구 컴퓨터수리", "성서공단 컴퓨터수리", "컴퓨터 렌탈", "데이터 복구",
    "사무실 인터넷", "랜공사", "대구 랜공사", "네트워크 공사", "사무실 와이파이",
    "경북 전산 유지관리", "영남 사무기기", "기업 IT 유지관리", "랜섬웨어 백업", "Synology", "한별시스템",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: site.name,
    title: `${site.name} - ${site.tagline}`,
    description: site.description,
    url: site.url,
    // 카카오톡·페이스북·구글/AI 카드 미리보기 이미지. public/og.jpg 는
    // scripts/gen-og.mjs 로 만들어 커밋해 둔 실물 사진 카드(1200x630).
    images: [{
      url: "/og.jpg",
      width: 1200,
      height: 630,
      alt: "한별시스템 - 대구 NAS 구축·복합기 렌탈·기업 전산 유지관리 053-588-7119",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} - ${site.tagline}`,
    description: site.description,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
  verification: {
    other: { "naver-site-verification": "94d5e00b095d47f09478d4710ec3949381a590fd" },
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "한별시스템",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#06354F",
};

// 첫 화면이 쓰는 글꼴을 미리 받는다. 2026-09-19 부터는 사이트가 실제 쓰는 글자만 담은
// 핵심 조각 두 개(본문 Noto 145KB · 제목 잘난체 83KB, scripts/build-core-subset.py)와
// 라틴 조각 하나면 전 페이지가 덮인다. 예전에는 구글 조각 7개를 미리 받았다.
// JSX <link rel="preload"> 로 쓰면 Next 와 React 가 각각 한 번씩 넣어 head 에 두 벌이 생긴다.
// ReactDOM.preload() 는 한 번만 넣는다.
const HERO_FONTS = [
  "/fonts/core/notosanskr-core.woff2",
  "/fonts/core/jalnan-core.woff2",
  "/fonts/core/inter-core.woff2",
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  for (const href of HERO_FONTS) {
    preload(href, {
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    });
  }
  return (
    <html lang="ko" suppressHydrationWarning className="h-full">
      <body className="min-h-full flex flex-col antialiased pb-14 lg:pb-0">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraph) }}
        />
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileBar />
          <ChatWidget />
          <Reveal />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
