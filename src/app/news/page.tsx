import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { NewsBrowser } from "@/components/NewsBrowser";
import newsData from "@/data/news.json";
import { dedash } from "@/lib/utils";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/schema";
import { AnswerBlock } from "@/components/AnswerBlock";

export const metadata: Metadata = {
  title: "IT 새소식 - 사무실에 영향 주는 소식만 골라서",
  description:
    "보안·윈도우·프린터·나스(NAS)·네트워크·AI - 대구 전산 올인원 관리 한별시스템이 사무실 업무와 관련 있는 IT 소식만 골라 매일 아침 전해 드립니다.",
  alternates: { canonical: "/news/" },
};

type NewsItem = {
  date: string; topic: string; img: string; source: string;
  title: string; link: string; desc: string; comment: string; blogger?: string;
};

export default function NewsPage() {
  // news.json 은 자동 생성이라 em-dash 가 섞여 들어올 수 있어 렌더 직전에 정리한다.
  const items = (newsData as NewsItem[]).slice(0, 100).map((n) => ({
    ...n,
    title: dedash(n.title),
    desc: dedash(n.desc),
    comment: dedash(n.comment),
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "한별시스템 IT 새소식",
    itemListElement: items.slice(0, 20).map((n, i) => ({
      "@type": "ListItem", position: i + 1, name: n.title, url: n.link,
    })),
  };
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "IT 새소식", path: "/news/" }])} />
      <PageHeader
        badge="NEWS"
        title="IT 새소식"
        description="사무실 업무에 영향 주는 소식만 골라, 매일 아침 한 줄 코멘트와 함께 전해 드립니다."
      />
      <AnswerBlock
        question="IT 새소식은 어떤 기준으로 고르나요?"
        answer="사무실 업무에 실제로 영향을 주는 소식만 고릅니다. 윈도우 업데이트, 보안 취약점, 랜섬웨어 동향, 프린터·복합기 제조사 소식, AI 도구 변화처럼 중소기업 전산 담당자가 알아야 할 것을 매일 아침 요약하고 한별시스템의 한 줄 코멘트를 붙입니다. 자세한 내용은 원문 링크로 연결되며, 소식과 관련된 실무 판단 기준은 가이드와 Q&A 페이지에 정리되어 있습니다."
        facts={[{ label: "갱신", value: "매일 아침" }, { label: "기준", value: "사무실 영향도" }, { label: "코멘트", value: "한별 한 줄" }, { label: "관련", value: "가이드 30편" }]}
      />
      <NewsBrowser items={items} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
