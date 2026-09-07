import { Hero } from "@/components/sections/Hero";
import { CoreServices } from "@/components/sections/CoreServices";
import { RaidSection } from "@/components/sections/RaidSection";
import { AskSection } from "@/components/sections/AskSection";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { RentalShop } from "@/components/sections/RentalShop";
import { BlogFeed } from "@/components/sections/BlogFeed";
import { QuickService } from "@/components/sections/QuickService";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { webPageLd } from "@/lib/schema";
import { businessId } from "@/data/site";

// 홈 타이틀에 지역을 넣는다. "한별시스템" 단독 검색은 동명의 서울 에어커튼 업체가 상위를
// 차지하고 있어, 지역+서비스 조합("대구 나스", "대구 복합기 렌탈")이 실제 유입 경로다.
export const metadata: Metadata = {
  title: { absolute: "한별시스템 - 대구 기업 데이터 관리·NAS 구축·사내 AI 도입" },
  description:
    "대구 한별시스템. 19년째 대구·경북 기업의 데이터를 맡습니다. 시놀로지 NAS 구축, 3-2-1 백업, 사내 AI 도입, 복합기 렌탈, 전산 유지관리를 한 회사에서. 관리 고객사 170곳, 무료 방문 견적 053-588-7119.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <JsonLd data={webPageLd({ path: "/", name: "한별시스템 - 대구 기업 데이터 관리·NAS 구축·사내 AI 도입", mainEntityId: businessId })} />
      {/* 홈 구성(2026-09-08 시놀로지 홈 참고): 배너 캐러셀 -> 사진 카드 4 -> RAID 계산기 -> 물어보기 -> 신뢰·사례 -> 임대 -> 검정 소식 -> 지원 아이콘 줄 */}
      <Hero />
      <CoreServices />
      <RaidSection />
      <AskSection />
      <CaseStudies />
      <RentalShop />
      <BlogFeed />
      <QuickService />
    </>
  );
}
