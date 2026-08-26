import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { guideCats, guides } from "@/data/guides";
import { businessId, site } from "@/data/site";

export const metadata: Metadata = {
  title: "가이드 - 비교표로 정리한 사무실 IT 판단 기준",
  description:
    "사내 AI 도입 비용, NAS 구매와 임대 비교, 복합기 렌탈과 구매 3년 총비용, 랜섬웨어 대응 체크리스트까지. 대구 한별시스템이 19년 현장에서 쌓은 판단 기준을 표와 숫자로 정리했습니다.",
  alternates: { canonical: "/guide/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${site.url}/guide/#list`,
  name: "한별시스템 가이드",
  numberOfItems: guides.length,
  itemListElement: guides.map((g, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${site.url}/guide/${g.slug}/`,
    item: {
      "@type": "Article",
      "@id": `${site.url}/guide/${g.slug}/#article`,
      headline: g.title,
      description: g.lead,
      url: `${site.url}/guide/${g.slug}/`,
      datePublished: g.updated,
      author: { "@id": businessId },
    },
  })),
};

export default function GuideIndexPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        badge="GUIDE · 표로 보는 판단 기준"
        title="가이드"
        description="장비 자랑이 아니라 판단 기준입니다. 19년 현장에서 실제로 부딪힌 문제를 표와 숫자로 정리했습니다."
      />

      <section className="py-8 bg-[var(--panel)] border-b border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 flex flex-wrap gap-2.5">
          {guideCats.map((c) => {
            const n = guides.filter((g) => g.cat === c.id).length;
            if (!n) return null;
            return (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="inline-flex items-center gap-2 bg-[var(--bg)] border border-[var(--line)] hover:border-hb-blue text-[var(--ink)] text-sm font-bold px-4 py-2 rounded-full transition"
              >
                <span aria-hidden>{c.icon}</span>
                {c.label}
                <span className="text-[11px] font-extrabold text-hb-blue">{n}</span>
              </a>
            );
          })}
        </div>
      </section>

      {guideCats.map((cat) => {
        const items = guides.filter((g) => g.cat === cat.id);
        if (!items.length) return null;
        return (
          <section key={cat.id} id={cat.id} className="py-12 lg:py-16 bg-[var(--bg)] scroll-mt-20">
            <div className="max-w-6xl mx-auto px-4 lg:px-6">
              <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-6">
                <span aria-hidden className="mr-2">{cat.icon}</span>
                {cat.label}
                <span className="ml-2 text-sm font-bold text-hb-blue">{items.length}편</span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guide/${g.slug}`}
                    className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 hover:border-hb-blue hover:shadow-lg transition group flex flex-col"
                  >
                    <div className="text-[11px] font-bold text-[var(--mute)] mb-2">
                      {g.updated.replace(/-/g, ".")} 기준
                    </div>
                    <h3 className="font-extrabold text-[var(--ink)] text-[17px] leading-snug mb-2.5">{g.title}</h3>
                    <p className="text-sm text-[var(--mute)] leading-relaxed mb-4 flex-1">{g.lead}</p>
                    <span className="inline-flex items-center gap-1 text-[12px] font-bold text-hb-blue group-hover:gap-2 transition-all">
                      표로 확인하기 →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
