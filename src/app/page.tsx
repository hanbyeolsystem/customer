import { Hero } from "@/components/sections/Hero";
import { QuickService } from "@/components/sections/QuickService";
import { CoreServices } from "@/components/sections/CoreServices";
import { InfraConsole } from "@/components/sections/InfraConsole";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { RentalShop } from "@/components/sections/RentalShop";
import { BlogFeed } from "@/components/sections/BlogFeed";
import { OfficialChannels } from "@/components/sections/OfficialChannels";
import { CtaBanner } from "@/components/sections/CtaBanner";
import type { Metadata } from "next";

// 홈 타이틀에 지역을 넣는다. "한별시스템" 단독 검색은 동명의 서울 에어커튼 업체가 상위를
// 차지하고 있어, 지역+서비스 조합("대구 나스", "대구 복합기 렌탈")이 실제 유입 경로다.
export const metadata: Metadata = {
  title: { absolute: "한별시스템 - 대구 기업 데이터 관리·NAS 구축·사내 AI 도입" },
  description:
    "대구광역시 달서구 한별시스템. 2008년부터 19년간 대구·경북 기업의 데이터를 맡아 왔습니다. 시놀로지 NAS 구축과 3-2-1 백업 컨설팅, 자료를 밖으로 내보내지 않는 사내 AI 도입, 복합기 렌탈과 전산 유지관리까지 한 회사에서. 관리 고객사 170곳, 무료 방문 견적 053-588-7119.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <QuickService />
      <CoreServices />
      <InfraConsole />
      <CaseStudies />
      <RentalShop />
      <BlogFeed />
      <OfficialChannels />
      <CtaBanner />
    </>
  );
}
