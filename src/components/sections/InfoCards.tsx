import Link from "next/link";
import { getInfoCards } from "@/lib/blog";
import { embedHref } from "@/lib/embed";

// 커뮤니티 상단 "오늘의 IT 소식" — 매일 아침 자동 발행되는 블로거 IT소식 카드.
// 글이 하나도 없으면 섹션을 통째로 숨긴다.
export async function InfoCards() {
  const cards = await getInfoCards(8);
  if (cards.length === 0) return null;
  return (
    <section className="pt-10 lg:pt-14 bg-[var(--bg)]">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <div className="flex items-end justify-between gap-3 mb-5">
          <div>
            <div className="eyebrow mb-2">DAILY IT BRIEFING</div>
            <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] tracking-tight">
              오늘의 IT 소식
            </h2>
            <p className="text-[13px] text-[var(--mute)] mt-1.5">
              NAS·컴퓨터·복사기·네트워크·AI — 매일 아침 한별이 골라 정리해 드립니다.
            </p>
          </div>
        </div>

        <div className="flex gap-3.5 overflow-x-auto pb-3 snap-x lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={embedHref(c.href, c.title)}
              className="group shrink-0 w-[240px] lg:w-auto snap-start bg-[var(--panel)] border border-[var(--line)] rounded-2xl overflow-hidden hover:border-hb-blue hover:shadow-lg hover:-translate-y-0.5 transition flex flex-col"
            >
              {c.thumb && (
                <div className="aspect-[16/9] overflow-hidden bg-hb-blue-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.thumb}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
              )}
              <div className="p-4 lg:p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-extrabold text-hb-blue bg-hb-blue-soft px-2 py-1 rounded-full tracking-wider">
                    {c.category}
                  </span>
                  <time className="text-[11px] text-[var(--mute)]">{c.date}</time>
                </div>
                <h3 className="font-extrabold text-[var(--ink)] text-[14px] leading-snug mb-1.5 line-clamp-2 group-hover:text-hb-blue transition">
                  {c.title}
                </h3>
                <p className="text-[12px] text-[var(--mute)] leading-relaxed line-clamp-3 flex-1">
                  {c.excerpt}
                </p>
                <div className="text-[11px] font-bold text-hb-blue mt-3">자세히 보기 →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
