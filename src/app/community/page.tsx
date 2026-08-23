import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CommunityBoard } from "@/components/CommunityBoard";
import { InfoCards } from "@/components/sections/InfoCards";

export const metadata: Metadata = {
  title: "커뮤니티 — 무엇이든 물어보세요",
  description:
    "NAS·시놀로지·복사기·컴퓨터에 대해 궁금한 것을 자유롭게 질문하는 공간. 한별시스템과 사용자들이 함께 답합니다.",
};

export default function CommunityPage() {
  return (
    <>
      <PageHeader
        badge="COMMUNITY"
        title="무엇이든 물어보세요"
        description="NAS·백업·복사기·컴퓨터 — 회원가입 없이 닉네임만으로 질문할 수 있습니다. 한별시스템 엔지니어가 직접 답변합니다."
      />
      <InfoCards />
      <CommunityBoard />
    </>
  );
}
