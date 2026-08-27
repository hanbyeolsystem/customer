import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CommunityBoard } from "@/components/CommunityBoard";
import { InfoCards } from "@/components/sections/InfoCards";
import { AnswerBlock } from "@/components/AnswerBlock";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/schema";
import { site } from "@/data/site";
import type { Post } from "@/components/CommunityBoard";

// 빌드 시점에 공개 글을 받아 둔다(실패해도 빈 배열로 빌드는 계속). 배포 크론이 하루 3번 돌아 새 글이 반영된다.
async function fetchPosts(): Promise<Post[]> {
  const SB_URL = "https://jrzesjgyrvgvwazfajec.supabase.co";
  const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyemVzamd5cnZndndhemZhamVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MjgwMTksImV4cCI6MjA5MzMwNDAxOX0.6FAb0CUMuYVqsvWmUR8Bbvmph4MJjlQqSDi_Mkza1c0";
  try {
    const r = await fetch(`${SB_URL}/rest/v1/community_posts?select=id,parent_id,nick,title,content,category,created_at&order=created_at.desc&limit=300`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
      cache: "no-store",
    });
    return r.ok ? await r.json() : [];
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: "커뮤니티 - 무엇이든 물어보세요",
  description:
    "NAS·시놀로지·복사기·컴퓨터에 대해 궁금한 것을 자유롭게 질문하는 공간. 한별시스템과 사용자들이 함께 답합니다.",
  alternates: { canonical: "/community/" },
};

export default async function CommunityPage() {
  const posts = await fetchPosts();
  const questions = posts.filter((p) => p.parent_id === null);
  const answered = questions.filter((q) => posts.some((r) => r.parent_id === q.id)).length;
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "커뮤니티", path: "/community/" }])} />
      <PageHeader
        badge="COMMUNITY"
        title="무엇이든 물어보세요"
        description="NAS·백업·복사기·컴퓨터 - 회원가입 없이 닉네임만으로 질문할 수 있습니다. 한별시스템 엔지니어가 직접 답변합니다."
      />
      <AnswerBlock
        question="한별시스템 커뮤니티는 어떤 곳인가요?"
        answer={`회원가입 없이 닉네임만으로 NAS·백업·복사기·컴퓨터·네트워크 질문을 남기면 한별시스템 엔지니어가 직접 답하는 게시판입니다. 현재 질문 ${questions.length}개 중 ${answered}개에 답변이 달려 있고, 답변은 일반적인 안내이며 실제 조치는 현장 확인 후 이루어집니다. 급한 장애는 ${site.phone.main}로 전화 주시면 대구·경북은 당일 방문합니다. 자주 나오는 질문 ${"256"}가지는 Q&A 페이지에 개별 답변으로 정리되어 있습니다.`}
        facts={[
          { label: "가입", value: "필요 없음" },
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
