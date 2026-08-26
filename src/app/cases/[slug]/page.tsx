import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { caseBySlug, caseStudies } from "@/data/cases";
import { businessId, site } from "@/data/site";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = caseBySlug(slug);
  if (!c) return {};
  return {
    title: `${c.title} - 구축 사례`,
    description: `${c.summary} ${c.region} ${c.industry}, 투입 장비 ${c.gear.join(", ")}. 한별시스템 실제 시공 기록.`.slice(0, 300),
    alternates: { canonical: `/cases/${slug}/` },
    openGraph: { images: [{ url: c.images[0] }] },
  };
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = caseBySlug(slug);
  if (!c) notFound();

  const pageUrl = `${site.url}/cases/${c.slug}/`;
  const related = caseStudies.filter((x) => x.category === c.category && x.slug !== c.slug).slice(0, 3);

  // 사례는 회사가 수행한 작업 기록이므로 CreativeWork 로 두고, 회사는 @id 참조만 한다.
  // 빵부스러기(BreadcrumbList)를 같이 넣어 검색결과에 경로가 노출되게 한다.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${pageUrl}#case`,
        name: c.title,
        headline: c.title,
        description: c.summary,
        about: `${c.industry} · ${c.gear.join(", ")}`,
        image: c.images.map((i) => `${site.url}${i}`),
        url: pageUrl,
        inLanguage: "ko-KR",
        dateCreated: c.date,
        locationCreated: { "@type": "Place", name: c.region },
        creator: { "@id": businessId },
        keywords: c.tags.join(", "),
        isBasedOn: c.href,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "구축 사례", item: `${site.url}/cases/` },
          { "@type": "ListItem", position: 3, name: c.title, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        badge={`${c.region} · ${c.date.replace("-", ".")} · ${c.industry}`}
        title={c.title}
        description={c.summary}
        back="/cases"
        backLabel="구축 사례"
      />

      {/* 핵심 스펙 */}
      {c.spec && (
        <section className="py-8 bg-[var(--panel)] border-b border-[var(--line)]">
          <div className="max-w-4xl mx-auto px-4 lg:px-6">
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {c.spec.map((s) => (
                <div key={s.label} className="bg-[var(--bg)] border border-[var(--line)] rounded-xl px-4 py-3">
                  <dt className="text-[11px] font-bold text-[var(--mute)] mb-1">{s.label}</dt>
                  <dd className="text-sm font-extrabold text-hb-blue leading-snug">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <section className="py-10 lg:py-14 bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          {/* 대표 사진 */}
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[var(--line)] mb-8">
            <Image src={c.images[0]} alt={`${c.title} 현장 사진`} fill sizes="(min-width:1024px) 900px, 100vw" className="object-cover" priority />
          </div>

          {/* 과제 */}
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-3">어떤 문제가 있었나</h2>
          <p className="text-[15px] text-[var(--ink)]/90 leading-relaxed mb-9">{c.challenge}</p>

          {/* 시공 내용 */}
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-4">한별시스템이 한 일</h2>
          <ol className="space-y-3 mb-9">
            {c.solution.map((s, i) => (
              <li key={s} className="flex gap-3 bg-[var(--panel)] border border-[var(--line)] rounded-2xl px-5 py-4">
                <span className="shrink-0 w-6 h-6 rounded-full bg-hb-blue text-white text-[11px] font-extrabold grid place-items-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-[var(--ink)]/90 leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>

          {/* 추가 사진 */}
          {c.images.length > 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-9">
              {c.images.slice(1).map((img, i) => (
                <div key={img} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[var(--line)]">
                  <Image src={img} alt={`${c.title} 시공 사진 ${i + 2}`} fill sizes="33vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* 결과 */}
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-3">결과</h2>
          <div className="border-l-4 border-hb-blue bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 mb-9">
            <p className="text-[15px] text-[var(--ink)]/90 leading-relaxed font-medium">{c.result}</p>
          </div>

          {/* 태그 + 원문 */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {c.tags.map((t) => (
              <span key={t} className="text-[11px] font-semibold text-[var(--mute)] bg-[var(--panel)] border border-[var(--line)] px-2.5 py-1 rounded-full">
                #{t}
              </span>
            ))}
          </div>
          <a
            href={c.href}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 text-sm font-bold text-hb-blue hover:underline"
          >
            사진이 더 있는 원문 후기 보기 →
          </a>
        </div>
      </section>

      {/* 관련 사례 */}
      {related.length > 0 && (
        <section className="py-12 bg-[var(--panel)] border-t border-[var(--line)]">
          <div className="max-w-4xl mx-auto px-4 lg:px-6">
            <h2 className="text-lg font-extrabold text-[var(--ink)] mb-5">비슷한 현장</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.slug} href={`/cases/${r.slug}`} className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl overflow-hidden hover:border-hb-blue transition">
                  <div className="relative aspect-[16/10]">
                    <Image src={r.images[0]} alt={r.title} fill sizes="33vw" className="object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] font-bold text-[var(--mute)] mb-1">{r.region}</div>
                    <h3 className="text-sm font-extrabold text-[var(--ink)] leading-snug">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-5">
            비슷한 구성을 검토 중이시면 현장을 보고 견적을 내 드립니다. 대구·경북은 당일 방문합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/support/quote" className="inline-flex items-center justify-center bg-hb-blue hover:bg-hb-azure text-white font-extrabold text-[15px] px-7 py-3.5 rounded-xl transition">
              무료 방문 견적 요청
            </Link>
            <a href={site.phone.mainHref} className="inline-flex items-center justify-center border border-[var(--line)] text-[var(--ink)] font-extrabold text-[15px] px-7 py-3.5 rounded-xl transition hover:border-hb-blue">
              전화 {site.phone.main}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
