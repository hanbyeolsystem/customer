import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { AnswerBlock } from "@/components/AnswerBlock";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/schema";
import { naverCats, naverPosts } from "@/data/naver-posts";
import { businessId, site } from "@/data/site";

export const metadata: Metadata = {
  title: `현장 블로그 - 대구·경북 NAS·복합기 설치 이야기 ${naverPosts.length}편`,
  description:
    "포항·군위·칠곡·경산·안동·창원 NAS 설치, DS925+·DS1825+·RS2421+ 구축, 교세라 복합기 설치까지 한별시스템이 실제로 다녀온 현장 이야기를 사진과 함께 전문 수록했습니다.",
  alternates: { canonical: "/blog/" },
};

// 네이버 블로그 글을 본문·사진째 가져와(scripts/naver-import.mjs) 사이트 안에 둔다.
const counts = naverCats;
const regions = ["포항", "군위", "칠곡", "경산", "안동", "마산", "창원", "예천", "상주", "수성구", "북구", "동구", "중구"]
  .filter((r) => naverPosts.some((p) => p.title.includes(r)));

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${site.url}/blog/#blog`,
  name: "한별시스템 현장 블로그",
  url: `${site.url}/blog/`,
  publisher: { "@id": businessId },
  blogPost: naverPosts.slice(0, 50).map((p) => ({
    "@type": "BlogPosting",
    "@id": `${site.url}/blog/${p.logNo}/#post`,
    headline: p.title,
    datePublished: p.date,
    url: `${site.url}/blog/${p.logNo}/`,
    ...(p.thumb ? { image: p.thumb.startsWith("http") ? p.thumb : `${site.url}${p.thumb}` } : {}),
  })),
};

export default function BlogPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd([{ name: "현장 블로그", path: "/blog/" }])} />
      <PageHeader badge={`BLOG · ${naverPosts.length}편`} title="현장 블로그" description="대구·경북 사무실에 시놀로지 NAS와 복합기를 설치하며 겪은 현장 이야기. 사진과 본문을 그대로 실었습니다." />
      <AnswerBlock
        question="한별시스템 현장 블로그에는 어떤 글이 있나요?"
        answer={`대구·경북 현장에서 실제로 시공한 시놀로지 NAS와 교세라 복합기, 랜공사 설치 이야기 ${naverPosts.length}편을 본문과 사진 그대로 실었습니다. ${regions.length ? `${regions.join("·")} 등 지역별 설치 후기와 ` : ""}DS925+·DS1825+·RS2421+ 구축, 나스 복구·하드 교체, 교세라 TASKalfa 설치, 사무용 PC 임대, 랜공사 선정리까지 ${counts.slice(0, 6).map((c) => `${c.label} ${c.n}편`).join(", ")}입니다. 글마다 관련 비용 페이지와 구축 사례로 이어지며, 네이버 블로그 원문 링크도 함께 있습니다. 대구광역시 달서구 한별시스템, ${site.phone.main}.`}
        facts={[
          { label: "글", value: `${naverPosts.length}편` },
          ...counts.slice(0, 3).map((c) => ({ label: c.label, value: `${c.n}편` })),
        ]}
      />

      {counts.map((cat) => {
        const items = naverPosts.filter((p) => p.catLabel === cat.id);
        return (
          <section key={cat.id} id={encodeURIComponent(cat.id)} className="py-10 lg:py-14 bg-[var(--bg)] scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4 lg:px-6">
              <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-5">
                <span aria-hidden className="mr-2">{cat.icon}</span>{cat.label}
                <span className="ml-2 text-sm font-bold text-hb-blue">{items.length}편</span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {items.map((p) => (
                  <Link key={p.logNo} href={`/blog/${p.logNo}`} className="group bg-[var(--panel)] border border-[var(--line)] rounded-2xl overflow-hidden hover:border-hb-blue hover:shadow-lg transition flex flex-col">
                    {p.thumb && (
                      <div className="aspect-[16/10] overflow-hidden bg-hb-blue-soft">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.thumb} alt={p.title} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[10px] font-extrabold text-hb-blue bg-hb-blue-soft px-2 py-1 rounded-full tracking-wider">{p.catLabel}</span>
                        <time className="text-xs text-[var(--mute)]">{p.date.replace(/-/g, ".")}</time>
                      </div>
                      <h3 className="font-extrabold text-[var(--ink)] text-base leading-tight mb-2 line-clamp-2 group-hover:text-hb-blue transition">{p.title}</h3>
                      <p className="text-[13px] text-[var(--mute)] leading-relaxed line-clamp-3 flex-1">{p.excerpt}</p>
                      <div className="text-[12px] font-bold text-hb-blue mt-4">전문 보기 →</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="py-10 bg-[var(--panel)] border-t border-[var(--line)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center text-sm text-[var(--mute)]">
          원문은 <a href="https://blog.naver.com/hanbyeolsystem" target="_blank" rel="noopener" className="text-hb-blue font-bold hover:underline">네이버 블로그</a>와
          <a href="https://hanbyeolsystem.blogspot.com/" target="_blank" rel="noopener" className="text-hb-blue font-bold hover:underline ml-1">구글 블로거</a>에도 있습니다.
          현장 20건은 <Link href="/cases" className="text-hb-blue font-bold hover:underline">구축 사례</Link>로 따로 정리했습니다.
        </div>
      </section>
    </>
  );
}
