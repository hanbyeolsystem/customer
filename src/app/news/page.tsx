import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
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

const TOPIC_LABEL: Record<string, string> = {
  security: "보안", windows: "윈도우·PC", printer: "프린터", nas: "나스·데이터",
  ai: "AI", network: "네트워크",
};

export default function NewsPage() {
  const items = (newsData as NewsItem[]).slice(0, 60);
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
      <section className="py-10 lg:py-14 bg-[var(--bg)]">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          {items.length === 0 && (
            <p className="text-sm text-[var(--mute)] text-center py-10">아직 등록된 소식이 없습니다.</p>
          )}
          <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
            {items.map((n) => (
              <article key={n.title} className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl overflow-hidden flex flex-col">
                {/* 이미지 원본 비율(3:2) 유지 — 크롭 없음 */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/blog-assets/${n.img}`} alt={TOPIC_LABEL[n.topic] ?? n.topic}
                  className="w-full aspect-[3/2] object-cover" />
                <div className="p-5 lg:p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-[11px] text-[var(--mute)] mb-2">
                    <span className="bg-[var(--bg)] border border-[var(--line)] rounded-full px-2.5 py-0.5 font-bold">
                      {TOPIC_LABEL[n.topic] ?? n.topic}
                    </span>
                    <span>{n.date}</span>
                    <span>· {n.source}</span>
                  </div>
                  <h2 className="font-extrabold text-[var(--ink)] leading-snug mb-2 text-[17px]">{n.title}</h2>
                  <p className="text-sm text-[var(--mute)] leading-relaxed mb-2 line-clamp-3">{n.desc}</p>
                  <p className="text-sm text-[var(--ink)]/85 leading-relaxed mb-4">
                    <b className="text-hb-blue">한별의 한 줄</b> — {n.comment}
                  </p>
                  <div className="flex gap-4 text-xs font-bold mt-auto">
                    <a href={n.link} rel="nofollow noopener" target="_blank" className="text-hb-blue">원문 보기 →</a>
                    {n.blogger && (
                      <a href={n.blogger} target="_blank" className="text-[var(--mute)]">블로그에서 보기</a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
