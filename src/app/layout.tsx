import type { Metadata } from "next";
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
    "대구 NAS", "대구 NAS 구축", "시놀로지 NAS", "대구 데이터 백업",
    "NAS 유지보수", "대구 복사기 임대", "대구 프린터 임대",
    "기업 IT 유지관리", "대구 서버 구축", "랜섬웨어 백업", "NAS VPN 구축",
    "Synology", "한별시스템",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning className="h-full">
      <body className="min-h-full flex flex-col antialiased">
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
