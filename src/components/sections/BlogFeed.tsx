import Link from "next/link";
import { posts } from "@/data/posts";
import { embedHref } from "@/lib/embed";

export function BlogFeed() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--panel)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-9 lg:mb-12">
          <div>
            <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">
              LATEST NEWS
            </div>
            <h2 className="text-2xl lg:text-4xl font-extrabold text-[var(--ink)] tracking-tight">
              한별시스템 소식
            </h2>
            <p className="text-sm lg:text-base text-[var(--mute)] mt-3">
              Synology 신제품·랜섬웨어 대응·운영 노하우 — 한별 블로그 최신 글
            </p>
          </div>
          <Link
            href={embedHref("https://blog.naver.com/hanbyeolsystem", "한별 블로그")}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-hb-blue hover:gap-2.5 transition"
          >
            블로그 전체 보기 →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {posts.map((p) => (
            <Link
              key={p.title}
              href={embedHref(p.href, p.title)}
              className="group bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-5 lg:p-6 hover:shadow-xl hover:border-hb-blue hover:-translate-y-1 transition flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold text-hb-blue bg-hb-blue-soft px-2 py-1 rounded-full tracking-wider">
                  {p.category}
                </span>
                <time className="text-[11px] text-[var(--mute)]">{p.date}</time>
              </div>
              <h3 className="font-extrabold text-[var(--ink)] text-base lg:text-[17px] leading-tight mb-2 line-clamp-2 min-h-[2.5em] group-hover:text-hb-blue transition">
                {p.title}
              </h3>
              <p className="text-[13px] text-[var(--mute)] leading-relaxed line-clamp-3 flex-1">
                {p.excerpt}
              </p>
              <div className="text-[12px] font-bold text-hb-blue mt-4 inline-flex items-center gap-1">
                자세히 보기 →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
