import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CommunityBoard } from "@/components/CommunityBoard";
import { InfoCards } from "@/components/sections/InfoCards";
import { AnswerBlock } from "@/components/AnswerBlock";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, webPageLd } from "@/lib/schema";
import { site } from "@/data/site";
import { OFFICIAL_NICK, getCommunityPosts } from "@/lib/community";

export const metadata: Metadata = {
  title: "커뮤니티 - 무엇이든 물어보세요",
  description:
    "NAS·시놀로지·복사기·컴퓨터에 대해 궁금한 것을 자유롭게 질문하는 공간. 한별시스템이 현장에서 겪은 문제와 해결 방법도 글로 올립니다.",
  alternates: { canonical: "/community/" },
};

export default async function CommunityPage() {
  const posts = await getCommunityPosts();
  const tops = posts.filter((p) => p.parent_id === null);
  // 한별시스템이 올린 현장 글은 "질문"이 아니므로 질문·답변 수에서 뺀다
  const notes = tops.filter((p) => p.nick === OFFICIAL_NICK).length;
  const questions = tops.filter((p) => p.nick !== OFFICIAL_NICK);
  const answered = questions.filter((q) => posts.some((r) => r.parent_id === q.id)).length;
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "커뮤니티", path: "/community/" }])} />
      <JsonLd data={webPageLd({ path: "/community/", name: String(metadata.title), description: metadata.description ?? undefined })} />
      <PageHeader
        badge="COMMUNITY"
        title="무엇이든 물어보세요"
        description="NAS·백업·복사기·컴퓨터 - 회원가입 없이 닉네임만으로 질문할 수 있습니다. 한별시스템 엔지니어가 직접 답변합니다."
      />
      <AnswerBlock
        question="한별시스템 커뮤니티는 어떤 곳인가요?"
        answer={`회원가입 없이 닉네임만으로 NAS·백업·복사기·컴퓨터·네트워크 질문을 남기면 한별시스템 엔지니어가 직접 답하는 게시판입니다. 한별시스템이 현장에서 겪은 문제와 해결 방법을 정리한 글이 ${notes}편${questions.length ? `, 방문자 질문이 ${questions.length}개(답변 ${answered}개)` : ""} 있습니다. 답변은 일반적인 안내이며 실제 조치는 현장 확인 후 이루어집니다. 급한 장애는 ${site.phone.main}로 전화 주시면 대구·경북은 당일 출장 갑니다. 자주 나오는 질문 ${"256"}가지는 Q&A 페이지에 개별 답변으로 정리되어 있습니다.`}
        facts={[
          { label: "가입", value: "필요 없음" },
          { label: "현장 글", value: `${notes}편` },
          { label: "질문", value: `${questions.length}개` },
          { label: "답변 완료", value: `${answered}개` },
          { label: "급한 문의", value: site.phone.main },
        ]}
      />
      <InfoCards />
      <CommunityBoard initialPosts={posts} />
    </>
  );
}
