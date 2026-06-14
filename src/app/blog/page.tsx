import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { posts } from "@/data/posts";

export const metadata: Metadata = { title: "한별시스템 소식" };

export default function BlogPage() {
  return (
    <>
      <PageHeader badge="BLOG" title="한별시스템 소식" description="Synology·랜섬웨어·운영 노하우. 네이버 블로그 전체 글은 외부 링크로 열립니다." />
      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 grid sm:grid-cols-2 gap-5">
          {posts.map((p) => (
            <a key={p.title} href={p.href} target="_blank" rel="noopener" className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 hover:border-hb-blue hover:shadow-lg transition flex flex-col">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-extrabold text-hb-blue bg-hb-blue-soft px-2 py-1 rounded-full tracking-wider">{p.category}</span>
                <time className="text-xs text-[var(--mute)]">{p.date}</time>
              </div>
              <h3 className="font-extrabold text-[var(--ink)] text-lg leading-tight mb-2">{p.title}</h3>
              <p className="text-sm text-[var(--mute)] leading-relaxed flex-1">{p.excerpt}</p>
              <div className="text-[12px] font-bold text-hb-blue mt-4">자세히 보기 →</div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
