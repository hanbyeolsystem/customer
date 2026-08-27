"use client";

// 새소식 탐색기 - 검색 + 주제 필터 + 카드 그리드
import { useMemo, useState } from "react";

type NewsItem = {
  date: string; topic: string; img: string; source: string;
  title: string; link: string; desc: string; comment: string; blogger?: string;
};

const TOPIC_LABEL: Record<string, string> = {
  security: "보안", windows: "윈도우·PC", printer: "프린터", nas: "나스·데이터",
  ai: "AI", network: "네트워크",
};

export function NewsBrowser({ items }: { items: NewsItem[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const topics = Array.from(new Set(items.map((n) => n.topic)));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((n) => {
      if (topic !== "all" && n.topic !== topic) return false;
      if (!q) return true;
      return (n.title + " " + n.desc).toLowerCase().includes(q);
    });
  }, [items, query, topic]);

  return (
    <section className="py-8 lg:py-12 bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="mb-6 space-y-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 소식 검색 - 예: 랜섬웨어, 윈도우, 엔비디아"
            className="w-full bg-[var(--panel)] border border-[var(--line)] rounded-2xl px-5 py-3.5 text-[15px] text-[var(--ink)] placeholder:text-[var(--mute)] focus:outline-none focus:border-hb-blue"
          />
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setTopic("all")}
              className={`px-4 py-2 rounded-full text-[13px] font-bold border transition ${topic === "all" ? "bg-hb-blue text-white border-hb-blue" : "bg-[var(--panel)] text-[var(--ink)] border-[var(--line)]"}`}>
              전체 {items.length}
            </button>
            {topics.map((t) => (
              <button key={t} onClick={() => setTopic(t)}
                className={`px-4 py-2 rounded-full text-[13px] font-bold border transition ${topic === t ? "bg-hb-blue text-white border-hb-blue" : "bg-[var(--panel)] text-[var(--ink)] border-[var(--line)]"}`}>
                {TOPIC_LABEL[t] ?? t} {items.filter((n) => n.topic === t).length}
              </button>
            ))}
          </div>
          {query && (
            <p className="text-sm text-[var(--mute)]">
              &lsquo;{query}&rsquo; 검색 결과 <b className="text-[var(--ink)]">{filtered.length}</b>건
            </p>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-[var(--mute)] text-center py-10">검색 결과가 없습니다.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
            {filtered.map((n) => (
              <article key={n.title} className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl overflow-hidden flex flex-col">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/blog-assets/${n.img.replace(/.jpe?g$/i, ".webp")}`} alt={TOPIC_LABEL[n.topic] ?? n.topic} loading="lazy"
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
                    <b className="text-hb-blue">한별의 한 줄</b> - {n.comment}
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
        )}
      </div>
    </section>
  );
}
