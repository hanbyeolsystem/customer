"use client";

// Q&A 탐색기 - 검색 + 카테고리 필터 + 현장사진 카드 그리드
import { useMemo, useState } from "react";
import Link from "next/link";
import { qnaImage } from "@/data/qna-images";

type Item = { slug: string; cat: string; q: string; a: string };
type Cat = { id: string; label: string; icon: string };

export function QnaBrowser({ items, cats, compact = false }: { items: Item[]; cats: Cat[]; compact?: boolean }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (cat !== "all" && it.cat !== cat) return false;
      if (!q) return true;
      return (it.q + " " + it.a).toLowerCase().includes(q);
    });
  }, [items, query, cat]);

  return (
    <section className="py-8 lg:py-12 bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        {/* 검색 + 필터 */}
        <div className="mb-6 space-y-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 궁금한 것을 검색해 보세요 - 예: 토너, 랜섬웨어, 와이파이 느림"
            className="w-full bg-[var(--panel)] border border-[var(--line)] rounded-2xl px-5 py-3.5 text-[15px] text-[var(--ink)] placeholder:text-[var(--mute)] focus:outline-none focus:border-hb-blue"
          />
          {cats.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setCat("all")}
              className={`px-4 py-2 rounded-full text-[13px] font-bold border transition ${cat === "all" ? "bg-hb-blue text-white border-hb-blue" : "bg-[var(--panel)] text-[var(--ink)] border-[var(--line)]"}`}>
              전체 {items.length}
            </button>
            {cats.map((c) => (
              <button key={c.id} onClick={() => setCat(c.id)}
                className={`px-4 py-2 rounded-full text-[13px] font-bold border transition ${cat === c.id ? "bg-hb-blue text-white border-hb-blue" : "bg-[var(--panel)] text-[var(--ink)] border-[var(--line)]"}`}>
                {c.icon} {c.label} {items.filter((i) => i.cat === c.id).length}
              </button>
            ))}
          </div>
          )}
          {query && (
            <p className="text-sm text-[var(--mute)]">
              &lsquo;{query}&rsquo; 검색 결과 <b className="text-[var(--ink)]">{filtered.length}</b>건
            </p>
          )}
        </div>

        {/* 카드 그리드 */}
        {filtered.length === 0 ? (
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-10 text-center">
            <p className="text-sm text-[var(--mute)] mb-3">검색 결과가 없습니다. 다른 단어로 찾아보시거나, 커뮤니티에 직접 질문해 주세요.</p>
            <Link href="/community" className="inline-block bg-hb-blue text-white text-sm font-extrabold px-5 py-2.5 rounded-xl">커뮤니티에 질문하기 →</Link>
          </div>
        ) : compact ? (
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {filtered.map((it) => (
              <li key={it.slug}>
                <Link href={`/qna/${it.slug}`} className="block text-[14px] font-semibold text-[var(--ink)] hover:text-hb-blue py-1.5 border-b border-[var(--line)] leading-snug">
                  {it.q}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
            {filtered.map((it) => (
              <Link key={it.slug} href={`/qna/${it.slug}`}
                className="group bg-[var(--panel)] border border-[var(--line)] rounded-2xl overflow-hidden hover:border-hb-blue transition flex flex-col">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qnaImage(it.cat, it.slug, "thumb")} alt={it.q} loading="lazy" decoding="async" width={480} height={300}
                  className="w-full h-36 object-cover" />
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-extrabold text-[var(--ink)] leading-snug mb-1.5 group-hover:text-hb-blue transition">{it.q}</h3>
                  <p className="text-[13px] text-[var(--mute)] leading-relaxed line-clamp-2">{it.a}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
