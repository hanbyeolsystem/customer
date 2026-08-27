import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { guideCats, guides } from "@/data/guides";
import { businessId, site } from "@/data/site";
import { breadcrumbLd } from "@/lib/schema";
import { AnswerBlock } from "@/components/AnswerBlock";

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
      <JsonLd data={breadcrumbLd([{ name: "가이드", path: "/guide/" }])} />
      <JsonLd data={jsonLd} />
      <PageHeader
        badge="GUIDE · 표로 보는 판단 기준"
        title="가이드"
        description="장비 자랑이 아니라 판단 기준입니다. 19년 현장에서 실제로 부딪힌 문제를 표와 숫자로 정리했습니다."
      />
      <AnswerBlock
        question="가이드는 무엇을 다루나요?"
        answer="사내 AI 도입 비용과 단계, 시놀로지 모델 총정리, NAS와 클라우드 3년 총비용, RAID 방식 비교, 랜섬웨어 대응 체크리스트, 복합기 렌탈과 구매 비교, 사무실 IT 초기 구축비처럼 사무실에서 실제로 부딪히는 판단을 표와 숫자로 정리한 30편입니다. 금액은 DS925+ 8TB 2개 구성 2,684,000원, 흑백 복사기 월 70,000원처럼 확정 단가만 쓰고 실적과 사례는 실제 시공 현장만 인용합니다. 대구광역시 달서구 한별시스템이 19년 현장 경험을 기준으로 작성했습니다."
        facts={[{ label: "가이드", value: "30편" }, { label: "형식", value: "비교표·수치" }, { label: "근거", value: "확정 단가·실제 현장" }, { label: "문의", value: "053-588-7119" }]}
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
