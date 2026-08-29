import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { AnswerBlock } from "@/components/AnswerBlock";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { guideBySlug, guideCats, guides } from "@/data/guides";
import { caseBySlug } from "@/data/cases";
import { qnaBySlug } from "@/data/qna";
import { nasModelBySlug } from "@/data/synology";
import { businessId, site } from "@/data/site";
import { isoDateTime } from "@/lib/schema";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) return {};
  return {
    title: g.title,
    // 검색결과에서 잘리지 않게 155자 안으로. lead 가 짧으면 answer 첫 문장으로 채운다.
    description: (g.lead.length >= 110 ? g.lead : `${g.lead} ${g.answer.split(". ")[0]}.`).slice(0, 155),
    alternates: { canonical: `/guide/${slug}/` },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) notFound();

  const pageUrl = `${site.url}/guide/${g.slug}/`;
  const cat = guideCats.find((c) => c.id === g.cat);
  // 같은 분류에서 "내 다음 3개"를 고른다. 항상 앞의 3개만 고르면 그 3개만 링크를 받는다.
  const sameCat = guides.filter((x) => x.cat === g.cat);
  const gi = sameCat.findIndex((x) => x.slug === g.slug);
  const related = Array.from({ length: Math.min(3, sameCat.length - 1) }, (_, i) => sameCat[(gi + 1 + i) % sameCat.length]);

  const cases = (g.related?.cases ?? []).map(caseBySlug).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const qnas = (g.related?.qna ?? []).map(qnaBySlug).filter((q): q is NonNullable<typeof q> => Boolean(q));
  const models = (g.related?.models ?? []).map(nasModelBySlug).filter((m): m is NonNullable<typeof m> => Boolean(m));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: g.title,
        description: g.lead,
        articleSection: cat?.label,
        url: pageUrl,
        inLanguage: "ko-KR",
        datePublished: isoDateTime(g.updated),
        dateModified: isoDateTime(g.updated),
        author: { "@id": businessId },
        publisher: { "@id": businessId },
        mainEntityOfPage: pageUrl,
        image: `${site.url}/og.jpg`,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "가이드", item: `${site.url}/guide/` },
          { "@type": "ListItem", position: 3, name: g.title, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        badge={`${cat?.label ?? "가이드"} · ${g.updated.replace(/-/g, ".")} 기준`}
        title={g.title}
        description={g.lead}
        back="/guide"
        backLabel="가이드"
      />

      <AnswerBlock question={g.title} answer={g.answer} facts={g.facts} />

      <article className="py-10 lg:py-14 bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 space-y-12">
          {g.sections.map((sec) => (
            <section key={sec.h}>
              <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-4">{sec.h}</h2>

              {sec.type === "text" &&
                sec.body.map((p) => (
                  <p key={p} className="text-[15px] text-[var(--ink)]/90 leading-relaxed mb-4">
                    {p}
                  </p>
                ))}

              {sec.type === "table" && (
                <>
                  {sec.note && <p className="text-sm text-[var(--mute)] leading-relaxed mb-4">{sec.note}</p>}
                  <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
                    <table className="w-full text-sm min-w-[640px]">
                      <thead>
                        <tr className="bg-hb-primary text-white text-left">
                          {sec.head.map((h) => (
                            <th key={h} className="py-3 px-4 font-extrabold whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--line)]">
                        {sec.rows.map((row) => (
                          <tr key={row[0]}>
                            {row.map((cell, i) => (
                              <td
                                key={`${row[0]}-${i}`}
                                className={
                                  i === 0
                                    ? "py-3 px-4 font-bold text-[var(--ink)] align-top whitespace-nowrap"
                                    : "py-3 px-4 text-[var(--mute)] leading-relaxed align-top"
                                }
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {sec.type === "list" && (
                <>
                  {sec.intro && <p className="text-sm text-[var(--mute)] leading-relaxed mb-4">{sec.intro}</p>}
                  <ul className="space-y-2.5">
                    {sec.items.map((it) => (
                      <li key={it} className="flex gap-3 bg-[var(--panel)] border border-[var(--line)] rounded-xl px-5 py-3.5">
                        <span className="shrink-0 text-hb-blue font-extrabold">·</span>
                        <span className="text-sm text-[var(--ink)]/90 leading-relaxed">{it}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {sec.type === "steps" && (
                <>
                  {sec.intro && <p className="text-sm text-[var(--mute)] leading-relaxed mb-4">{sec.intro}</p>}
                  <ol className="space-y-3">
                    {sec.items.map((it, i) => (
                      <li key={it} className="flex gap-3 bg-[var(--panel)] border border-[var(--line)] rounded-2xl px-5 py-4">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-hb-blue text-white text-[11px] font-extrabold grid place-items-center mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-sm text-[var(--ink)]/90 leading-relaxed">{it}</span>
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </section>
          ))}
        </div>
      </article>

      <FaqSection title="이 글과 관련해 자주 묻는 질문" items={g.faq} />

      {/* 더 보기 */}
      {(cases.length > 0 || qnas.length > 0 || models.length > 0 || g.related?.pages?.length) && (
        <section className="py-12 bg-[var(--bg)] border-t border-[var(--line)]">
          <div className="max-w-4xl mx-auto px-4 lg:px-6">
            <h2 className="text-lg font-extrabold text-[var(--ink)] mb-5">함께 보면 좋은 것</h2>
            <div className="flex flex-wrap gap-2.5">
              {g.related?.pages?.map((p) => (
                <Link key={p.href} href={p.href} className="text-sm font-bold bg-hb-blue text-white px-4 py-2 rounded-full hover:bg-hb-azure transition">
                  {p.label}
                </Link>
              ))}
              {models.map((m) => (
                <Link key={m.slug} href={`/nas/model/${m.slug}`} className="text-sm font-bold bg-[var(--panel)] border border-[var(--line)] text-[var(--ink)] px-4 py-2 rounded-full hover:border-hb-blue transition">
                  {m.model} 구축 비용
                </Link>
              ))}
              {cases.map((c) => (
                <Link key={c.slug} href={`/cases/${c.slug}`} className="text-sm font-bold bg-[var(--panel)] border border-[var(--line)] text-[var(--ink)] px-4 py-2 rounded-full hover:border-hb-blue transition">
                  사례 · {c.region} {c.industry}
                </Link>
              ))}
            </div>
            {qnas.length > 0 && (
              <ul className="mt-5 space-y-2">
                {qnas.map((q) => (
                  <li key={q.slug}>
                    <Link href={`/qna/${q.slug}`} className="text-sm text-hb-blue hover:underline font-semibold">
                      Q. {q.q}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="py-12 bg-[var(--panel)] border-t border-[var(--line)]">
          <div className="max-w-4xl mx-auto px-4 lg:px-6">
            <h2 className="text-lg font-extrabold text-[var(--ink)] mb-5">같은 주제의 다른 글</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.slug} href={`/guide/${r.slug}`} className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-5 hover:border-hb-blue transition">
                  <h3 className="text-sm font-extrabold text-[var(--ink)] leading-snug mb-2">{r.title}</h3>
                  <p className="text-[12px] text-[var(--mute)] leading-relaxed line-clamp-3">{r.lead}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-5">
            글로는 판단이 어려우면 현장을 보고 말씀드립니다. 대구·경북 당일 방문, 방문 견적 무료.
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
