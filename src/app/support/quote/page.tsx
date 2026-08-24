import type { Metadata } from "next";
import { QuoteForm } from "./QuoteForm";

// 폼 본체는 클라이언트 컴포넌트(QuoteForm)로 분리했다.
// 페이지 자체가 "use client" 면 metadata 를 못 내보내서 홈과 title/description 이
// 똑같아지고, Search Console 이 "중복 페이지"로 색인을 거른다.
export const metadata: Metadata = {
  title: "무료 방문 견적 요청",
  description: "NAS 구축·복합기 렌탈·컴퓨터·랜공사 무료 방문 견적. 현장을 직접 보고 견적을 냅니다. 대구·경북 당일 방문, 전국 1영업일.",
  alternates: { canonical: "/support/quote/" },
};

export default function QuotePage() {
  return <QuoteForm />;
}
