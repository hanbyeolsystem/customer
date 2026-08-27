import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { getBlogPosts } from "@/lib/blog";
import { embedHref } from "@/lib/embed";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/schema";
import { AnswerBlock } from "@/components/AnswerBlock";

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
      <JsonLd data={breadcrumbLd([{ name: "소식", path: "/blog/" }])} />
      <PageHeader badge="BLOG" title="한별시스템 소식" description="Synology·랜섬웨어·운영 노하우. 한별 블로그 전체 글은 외부 링크로 열립니다." />
      <AnswerBlock
        question="한별시스템 소식에는 무엇이 올라오나요?"
        answer="대구·경북 현장에서 실제로 시공한 시놀로지 NAS, 교세라 복합기, 랜공사 설치 후기와 사무실 업무에 영향을 주는 IT 소식을 올립니다. 후기는 네이버 블로그 원문과 구글 블로거에 함께 발행되며, 시공 현장 20건은 구축 사례 페이지에 과제·시공 내용·결과와 현장 사진으로 정리되어 있습니다. 매일 아침 IT 새소식을 골라 한별의 한 줄 코멘트와 함께 요약합니다."
        facts={[{ label: "구축 사례", value: "20건 공개" }, { label: "발행", value: "네이버·블로거" }, { label: "IT 소식", value: "매일 갱신" }, { label: "문의", value: "053-588-7119" }]}
      />
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
