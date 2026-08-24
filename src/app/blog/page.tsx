import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { getBlogPosts } from "@/lib/blog";
import { embedHref } from "@/lib/embed";

export const metadata: Metadata = {
  title: "한별시스템 소식 - 설치 후기와 현장 이야기",
  description:
    "대구·경북 사무실에 시놀로지 NAS와 복합기를 설치하며 겪은 현장 이야기, 랜섬웨어 대응과 백업 운영 노하우를 한별시스템 블로그에서 전합니다.",
  alternates: { canonical: "/blog/" },
};

export default async function BlogPage() {
  const posts = await getBlogPosts(12);
  return (
    <>
      <PageHeader badge="BLOG" title="한별시스템 소식" description="Synology·랜섬웨어·운영 노하우. 한별 블로그 전체 글은 외부 링크로 열립니다." />
      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {posts.map((p) => (
            <Link key={p.title} href={embedHref(p.href, p.title)} className="group bg-[var(--panel)] border border-[var(--line)] rounded-2xl overflow-hidden hover:border-hb-blue hover:shadow-lg transition flex flex-col">
              {p.thumb && (
                <div className="aspect-[16/9] overflow-hidden bg-hb-blue-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.thumb}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
              )}
              <div className="p-5 lg:p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-extrabold text-hb-blue bg-hb-blue-soft px-2 py-1 rounded-full tracking-wider">{p.category}</span>
                  <time className="text-xs text-[var(--mute)]">{p.date}</time>
                </div>
                <h3 className="font-extrabold text-[var(--ink)] text-base lg:text-[17px] leading-tight mb-2 line-clamp-2">{p.title}</h3>
                <p className="text-[13px] text-[var(--mute)] leading-relaxed line-clamp-3 flex-1">{p.excerpt}</p>
                <div className="text-[12px] font-bold text-hb-blue mt-4">자세히 보기 →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
