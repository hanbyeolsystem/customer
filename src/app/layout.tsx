import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { site } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "대구 나스", "대구 NAS 구축", "시놀로지 나스", "대구 데이터 백업",
    "대구 복합기렌탈", "복합기 렌탈", "대구 복사기렌탈", "프린터 렌탈", "토너 교체",
    "대구 컴퓨터수리", "컴퓨터 렌탈", "데이터 복구",
    "사무실 인터넷", "랜공사", "네트워크 공사", "사무실 와이파이",
    "기업 IT 유지관리", "랜섬웨어 백업", "Synology", "한별시스템",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
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

// GEO: AI·검색엔진이 회사 정보를 "확인"으로 읽게 하는 구조화 데이터
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  alternateName: site.nameEn,
  description: site.description,
  url: site.url,
  telephone: site.phone.main,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: "대구광역시 달서구",
    addressCountry: "KR",
  },
  openingHours: "Mo-Fr 09:00-18:00",
  sameAs: [site.social.blog, site.social.instagram, site.social.threads],
  areaServed: "대구·경북",
  knowsAbout: [
    "NAS 구축", "데이터 백업", "복사기 임대", "프린터 임대", "기업 IT 유지관리",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
