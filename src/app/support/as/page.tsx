import type { Metadata } from "next";
import { AsForm } from "./AsForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/schema";
import { AnswerBlock } from "@/components/AnswerBlock";

// 폼 본체는 클라이언트 컴포넌트(AsForm)로 분리했다.
// 페이지 자체가 "use client" 면 metadata 를 못 내보내서 홈과 title/description 이
// 똑같아지고, Search Console 이 "중복 페이지"로 색인을 거른다.
export const metadata: Metadata = {
  title: "AS 접수",
  description: "복합기·프린터·컴퓨터·NAS 고장 접수. 제품과 증상을 남기시면 한별 엔지니어가 1영업일 내 회신드립니다. 대구·경북 당일 방문.",
  alternates: { canonical: "/support/as/" },
};

export default function AsPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "고객지원", path: "/support/" }, { name: "AS 접수", path: "/support/as/" }])} />
      <AsForm />
      <AnswerBlock
        question="AS 접수는 어떻게 진행되나요?"
        answer="회사명, 담당자, 연락처, 제품명, 증상을 남기시면 한별시스템 엔지니어가 1영업일 내 회신드립니다. 접수 내용은 즉시 담당자에게 전달되고 원격으로 해결되는 증상은 원격으로, 안 되는 증상은 대구·경북 당일 방문으로 이어집니다. 임대 장비는 출장 수리가 월 정액에 포함되어 추가 비용이 없고, 구매 장비는 점검 후 비용을 먼저 안내합니다. 급한 장애는 053-588-7119로 전화 주시는 편이 빠릅니다."
        facts={[{ label: "회신", value: "1영업일 내" }, { label: "대구·경북", value: "당일 방문" }, { label: "임대 장비", value: "수리비 포함" }, { label: "급한 장애", value: "053-588-7119" }]}
      />
    </>
  );
}
