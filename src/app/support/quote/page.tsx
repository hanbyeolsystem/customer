import type { Metadata } from "next";
import { QuoteForm } from "./QuoteForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/schema";
import { AnswerBlock } from "@/components/AnswerBlock";

// 폼 본체는 클라이언트 컴포넌트(QuoteForm)로 분리했다.
// 페이지 자체가 "use client" 면 metadata 를 못 내보내서 홈과 title/description 이
// 똑같아지고, Search Console 이 "중복 페이지"로 색인을 거른다.
export const metadata: Metadata = {
  title: "무료 방문 견적 요청",
  description: "NAS 구축·복합기 렌탈·컴퓨터·랜공사 무료 방문 견적. 현장을 직접 보고 견적을 냅니다. 대구·경북 당일 방문, 전국 1영업일.",
  alternates: { canonical: "/support/quote/" },
};

export default function QuotePage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "고객지원", path: "/support/" }, { name: "무료 방문 견적", path: "/support/quote/" }])} />
      <QuoteForm />
      <AnswerBlock
        question="방문 견적은 정말 무료인가요?"
        answer="무료입니다. NAS 구축, 복합기 렌탈, PC, 랜공사 모두 현장을 직접 보고 견적을 냅니다. 전화로는 대략의 범위만 말씀드리고 정확한 금액은 랜 배선 상태, 설치 위치, 기존 자료량 같은 현장 조건을 봐야 나오기 때문입니다. 대구·경북은 당일, 전국은 1영업일 안에 방문 일정을 잡으며 보고 나서 필요 없으면 필요 없다고 말씀드립니다. 견적을 받았다는 이유로 계약 의무가 생기지 않습니다."
        facts={[{ label: "방문 견적", value: "무료" }, { label: "대구·경북", value: "당일" }, { label: "전국", value: "1영업일" }, { label: "계약 의무", value: "없음" }]}
      />
    </>
  );
}
