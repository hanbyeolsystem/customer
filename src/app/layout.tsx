import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { businessId, site } from "@/data/site";
import { serviceId } from "@/lib/schema";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} - ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "대구 나스", "대구 NAS 구축", "경북 NAS 구축", "시놀로지 나스", "대구 데이터 백업",
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

// GEO/AEO: AI·검색엔진이 회사 정보를 "확인된 사실"로 읽게 하는 구조화 데이터.
// @graph 로 LocalBusiness 와 WebSite 를 각각 @id 를 가진 하나의 엔티티로 묶는다.
// Organization 을 따로 두면 같은 회사가 두 엔티티로 쪼개지므로 만들지 않는다.
// 다른 페이지(QAPage 등)에서 author 를 쓸 때는 BUSINESS_ID 를 참조할 것.
const BUSINESS_ID = businessId;
const WEBSITE_ID = `${site.url}/#website`;

// 한별시스템이 실제로 제공하는 서비스 (구글 비즈니스 프로필 서비스 목록과 동일 범위)
// id 는 해당 서비스 페이지에서도 같은 @id 로 선언해 하나의 엔티티로 합쳐진다.
// (서비스 페이지 쪽 선언은 src/lib/schema.ts 의 serviceLd() 참조 - id 를 반드시 일치시킬 것)
const serviceCatalog = [
  { id: serviceId("/nas/"), url: `${site.url}/nas/`, name: "기업용 NAS 구축·데이터 백업", desc: "시놀로지 NAS 설치, RAID 설계, 3-2-1 백업 구성, 랜섬웨어 대비, VPN 원격접속. 구축 실적 50개사 이상(네트워크 공사·백업 구축과 같은 현장 기준)." },
  { id: serviceId("/rental/"), url: `${site.url}/rental/`, name: "복합기·프린터 렌탈(임대)", desc: "흑백 복사기 월 7만원부터, 컬러 복사기 월 10만원부터(VAT 별도). 월 정액에 토너 등 소모품, 부품 교체, 출장 수리, 분기 정기점검 포함. 설치·운영 300대 이상." },
  { id: serviceId("/support/"), url: `${site.url}/support/`, name: "기업 전산 유지관리", desc: "컴퓨터·복합기·NAS·네트워크를 한 회사가 통합 관리하는 올인원 전산 유지보수. 관리 고객사 170곳 이상." },
  { id: `${site.url}/support/#repair-service`, url: `${site.url}/support/`, name: "컴퓨터 수리·PC 임대", desc: "대구 지역 출장 컴퓨터 수리, 사무실 PC 표준화, 데이터 복구." },
  { id: serviceId("/network/"), url: `${site.url}/network/`, name: "사무실 네트워크·랜공사·데이터 백업 구축", desc: "CAT6 이상 랜 배선 시공, 공유기·스위치 구성, 서버·NAS 설치, 공유 폴더와 권한 설정, 3-2-1 데이터 백업 구축, VPN 원격접속, 인터넷 장애 진단까지 한 회사에서 시공. 대구·경북 중심 50개사 이상 실적." },
  { id: `${site.url}/#web-service`, url: site.url, name: "홈페이지 제작·관리", desc: "검색과 AI 검색 노출을 고려한 기업 홈페이지 설계·제작·유지관리." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": BUSINESS_ID,
      name: site.name,
      alternateName: [site.nameEn, "대구 한별시스템"],
      description: site.description,
      url: site.url,
      telephone: site.phone.main,
      email: site.email,
      founder: { "@type": "Person", name: site.address.ceo },
      // 동명 업체와 구분되는 법적 식별자 (사업자등록번호)
      identifier: {
        "@type": "PropertyValue",
        name: "사업자등록번호",
        value: site.address.bizNo,
      },
      taxID: site.address.bizNo,
      foundingDate: site.foundingDate,
      foundingLocation: { "@type": "Place", name: "대구광역시 달서구 성서공단" },
      slogan: "전산은 전화 한 통",
      logo: `${site.url}/icons/icon-512.png`,
      image: [`${site.url}/icons/icon-512.png`, `${site.url}/brand/logo.png`],
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.streetOnly,
        addressLocality: site.address.locality,
        addressRegion: site.address.region,
        addressCountry: "KR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: site.geo.lat,
        longitude: site.geo.lng,
      },
      hasMap: site.social.googleMaps,
      openingHours: "Mo-Fr 09:00-18:00",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      ],
      sameAs: [
        site.social.blog,
        site.social.instagramBiz,
        site.social.instagram,
        site.social.threads,
        site.social.googleMaps,
        // 한별시스템이 직접 운영하는 다른 사이트들. 같은 회사임을 검색·AI 가 알게 한다.
        ...site.owned,
      ],
      areaServed: [
        { "@type": "City", name: "대구광역시" },
        { "@type": "AdministrativeArea", name: "달서구" },
        { "@type": "Place", name: "성서공단" },
        { "@type": "AdministrativeArea", name: "경상북도" },
        { "@type": "Country", name: "대한민국" },
      ],
      knowsAbout: [
        "NAS 구축", "시놀로지 NAS", "데이터 백업", "랜섬웨어 대응", "복합기 렌탈",
        "프린터 임대", "토너 교체", "컴퓨터 수리", "데이터 복구", "사무실 네트워크",
        "랜공사", "데이터 백업 구축", "공유 폴더 설정", "파일 서버 구축", "VPN 원격접속",
        "기업 IT 유지관리", "홈페이지 제작",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "한별시스템 서비스",
        itemListElement: serviceCatalog.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": s.id,
            url: s.url,
            name: s.name,
            description: s.desc,
            provider: { "@id": BUSINESS_ID },
            areaServed: [
              { "@type": "City", name: "대구광역시" },
              { "@type": "AdministrativeArea", name: "경상북도" },
            ],
          },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "ko-KR",
      publisher: { "@id": BUSINESS_ID },
    },
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
