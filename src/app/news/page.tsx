import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { NewsBrowser } from "@/components/NewsBrowser";
import newsData from "@/data/news.json";

export const metadata: Metadata = {
  title: "IT 새소식 — 사무실에 영향 주는 소식만 골라서",
  description:
    "보안·윈도우·프린터·나스(NAS)·네트워크·AI — 대구 전산 올인원 관리 한별시스템이 사무실 업무와 관련 있는 IT 소식만 골라 매일 아침 전해 드립니다.",
};

type NewsItem = {
  date: string; topic: string; img: string; source: string;
  title: string; link: string; desc: string; comment: string; blogger?: string;
};

export default function NewsPage() {
  const items = (newsData as NewsItem[]).slice(0, 100);
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
      <PageHeader
        badge="NEWS"
        title="IT 새소식"
        description="사무실 업무에 영향 주는 소식만 골라, 매일 아침 한 줄 코멘트와 함께 전해 드립니다."
      />
      <NewsBrowser items={items} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
