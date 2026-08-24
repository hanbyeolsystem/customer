import type { Metadata } from "next";
import { AsForm } from "./AsForm";

// 폼 본체는 클라이언트 컴포넌트(AsForm)로 분리했다.
// 페이지 자체가 "use client" 면 metadata 를 못 내보내서 홈과 title/description 이
// 똑같아지고, Search Console 이 "중복 페이지"로 색인을 거른다.
export const metadata: Metadata = {
  title: "AS 접수",
  description: "복합기·프린터·컴퓨터·NAS 고장 접수. 제품과 증상을 남기시면 한별 엔지니어가 1영업일 내 회신드립니다. 대구·경북 당일 방문.",
  alternates: { canonical: "/support/as/" },
};

export default function AsPage() {
  return <AsForm />;
}
