import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { qna, qnaBySlug, qnaCats, qnaModified, qnaPublished } from "@/data/qna";
import { qnaDeep } from "@/data/qna-deep";
import { qnaImage } from "@/data/qna-images";
import { guides } from "@/data/guides";
import { caseStudies } from "@/data/cases";
import { businessId, site } from "@/data/site";
import { breadcrumbLd } from "@/lib/schema";

export function generateStaticParams() {
  return qna.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const f = qnaBySlug(slug);
  if (!f) return {};
  return {
    title: f.q,
    description: f.a.slice(0, 150),
    alternates: { canonical: `/qna/${slug}/` },
  };
}

// Q&A 분류 -> 가이드 분류 / 사례 분류 대응표
const GUIDE_CAT: Record<string, string> = { ai: "ai", nas: "nas", printer: "printer", pc: "office", network: "office", service: "office" };
const CASE_CAT: Record<string, string> = { ai: "nas", nas: "nas", printer: "printer", pc: "pc", network: "network", service: "pc" };

export default async function QnaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = qnaBySlug(slug);
  if (!f) notFound();
  const cat = qnaCats.find((c) => c.id === f.cat);

  // 같은 분류 안에서 "내 다음 4개"를 고른다(끝이면 처음으로 돌아감).
  // 예전처럼 항상 앞의 4개만 고르면 그 4개만 링크를 받고 나머지는 고립된다.
  const sameCat = qna.filter((x) => x.cat === f.cat);
  const idx = sameCat.findIndex((x) => x.slug === f.slug);
  const related = Array.from({ length: Math.min(4, sameCat.length - 1) }, (_, i) => sameCat[(idx + 1 + i) % sameCat.length]);

  // 이 질문을 직접 가리키는 가이드가 있으면 우선, 없으면 같은 분류 가이드를 순환 배정
  const direct = guides.filter((g) => g.related?.qna?.includes(f.slug));
  const catGuides = guides.filter((g) => g.cat === GUIDE_CAT[f.cat] && !direct.includes(g));
  const relGuides = [...direct, ...Array.from({ length: Math.max(0, 3 - direct.length) }, (_, i) => catGuides[(idx + i) % Math.max(1, catGuides.length)])]
    .filter((g, i, a) => g && a.indexOf(g) === i)
    .slice(0, 3);
  const catCases = caseStudies.filter((c) => c.category === CASE_CAT[f.cat]);
  const relCases = catCases.length ? Array.from({ length: Math.min(2, catCases.length) }, (_, i) => catCases[(idx + i) % catCases.length]) : [];

  const deep = qnaDeep[f.slug];
  const fullAnswer = [f.a, f.more, ...(deep?.map((d) => d.body.join(" ")) ?? [])].filter(Boolean).join(" ");

  const pageUrl = `${site.url}/qna/${f.slug}/`;
  const org = { "@id": businessId };
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "@id": pageUrl,
    url: pageUrl,
    inLanguage: "ko-KR",
    mainEntity: {
      "@type": "Question",
      "@id": `${pageUrl}#question`,
      name: f.q,
      text: f.q,
      answerCount: 1,
      upvoteCount: 0,
      datePublished: qnaPublished,
      dateModified: qnaModified,
      author: org,
      url: pageUrl,
      acceptedAnswer: {
        "@type": "Answer",
        "@id": `${pageUrl}#answer`,
        text: fullAnswer,
        upvoteCount: 0,
        datePublished: qnaPublished,
        dateModified: qnaModified,
        url: pageUrl,
        author: org,
      },
    },
  };
  const crumbs = breadcrumbLd([
    { name: "Q&A", path: "/qna/" },
    { name: cat?.label ?? "Q&A", path: `/qna/cat/${f.cat}/` },
    { name: f.q, path: `/qna/${f.slug}/` },
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={crumbs} />
      <PageHeader badge={`Q&A · ${cat?.label ?? ""}`} title={f.q} description="" back={`/qna/cat/${f.cat}`} backLabel={cat?.label ?? "Q&A"} />
      <section className="py-10 lg:py-14 bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qnaImage(f.cat, f.slug)} alt={f.q}
            className="w-full max-h-[420px] object-cover rounded-2xl border border-[var(--line)] mb-6" loading="eager" decoding="async" />

          {/* 즉답 */}
          <div className="bg-[var(--panel)] border-l-4 border-hb-blue border border-[var(--line)] rounded-2xl p-6 mb-6">
            <div className="text-[11px] font-extrabold text-hb-blue tracking-[.18em] mb-2">답변</div>
            <h2 className="text-base font-extrabold text-[var(--ink)] mb-2">{/\?$/.test(f.q) ? f.q : `${f.q}?`}</h2>
            <p className="text-[var(--ink)] leading-relaxed font-medium">{f.a}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                { label: "방문", value: "대구·경북 당일" },
                { label: "관리 고객사", value: "170곳+" },
                { label: "NAS 구축", value: "50건+" },
                { label: "복사기 설치", value: "300대+" },
              ].map((x) => (
                <span key={x.label} className="inline-flex items-baseline gap-1 text-[12px] bg-hb-blue-soft text-hb-blue rounded-full px-3 py-1"><span className="opacity-70">{x.label}</span><b>{x.value}</b></span>
              ))}
            </div>
          </div>
          {f.more && (
            <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 mb-6">
              <div className="text-[11px] font-extrabold text-[var(--mute)] tracking-[.18em] mb-2">더 자세히</div>
              <p className="text-sm text-[var(--ink)]/85 leading-relaxed">{f.more}</p>
            </div>
          )}

          {/* 심화 설명 */}
          {deep && deep.length > 0 && (
            <div className="space-y-6 mb-8">
              {deep.map((d) => (
                <section key={d.h}>
                  <h2 className="text-lg lg:text-xl font-extrabold text-[var(--ink)] mb-3">{d.h}</h2>
                  {d.body.map((para) => (
                    <p key={para.slice(0, 40)} className="text-[15px] text-[var(--ink)]/85 leading-relaxed mb-3">{para}</p>
                  ))}
                  {d.table && (
                    <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--panel)] mt-3">
                      <table className="w-full text-sm min-w-[520px]">
                        <thead>
                          <tr className="bg-hb-primary text-white text-left">
                            {d.table.head.map((h) => (
                              <th key={h} className="py-2.5 px-4 font-extrabold whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--line)]">
                          {d.table.rows.map((row) => (
                            <tr key={row[0]}>
                              {row.map((cell, i) => (
                                <td key={`${row[0]}-${i}`} className={i === 0 ? "py-2.5 px-4 font-bold text-[var(--ink)] align-top whitespace-nowrap" : "py-2.5 px-4 text-[var(--mute)] leading-relaxed align-top"}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}

          <div className="flex gap-3 flex-wrap mb-10">
            <Link href="/support/quote" className="inline-flex items-center gap-2 bg-hb-blue text-white font-extrabold px-5 py-3 rounded-xl">
              방문 견적 요청 (무료) →
            </Link>
            <a href={site.phone.mainHref} className="inline-flex items-center gap-2 border border-[var(--line)] text-[var(--ink)] font-bold px-5 py-3 rounded-xl hover:bg-[var(--panel)]">
              📞 {site.phone.main}
            </a>
            <Link href="/community" className="inline-flex items-center gap-2 border border-[var(--line)] text-[var(--ink)] font-bold px-5 py-3 rounded-xl hover:bg-[var(--panel)]">
              커뮤니티에 추가 질문
            </Link>
          </div>

          {/* 관련 가이드·사례 */}
          {(relGuides.length > 0 || relCases.length > 0) && (
            <div className="mb-10">
              <h2 className="text-base font-extrabold text-[var(--ink)] mb-3">표와 현장으로 더 보기</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {relGuides.map((g) => (
                  <Link key={g.slug} href={`/guide/${g.slug}`} className="bg-[var(--panel)] border border-[var(--line)] rounded-xl px-4 py-3 hover:border-hb-blue transition">
                    <div className="text-[10px] font-extrabold text-hb-blue tracking-[.15em] mb-1">가이드</div>
                    <div className="text-sm font-bold text-[var(--ink)] leading-snug">{g.title}</div>
                  </Link>
                ))}
                {relCases.map((c) => (
                  <Link key={c.slug} href={`/cases/${c.slug}`} className="bg-[var(--panel)] border border-[var(--line)] rounded-xl px-4 py-3 hover:border-hb-blue transition">
                    <div className="text-[10px] font-extrabold text-hb-blue tracking-[.15em] mb-1">구축 사례 · {c.region}</div>
                    <div className="text-sm font-bold text-[var(--ink)] leading-snug">{c.title}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {related.length > 0 && (
            <>
              <h2 className="text-base font-extrabold text-[var(--ink)] mb-3">함께 보는 질문</h2>
              <div className="space-y-2">
                {related.map((r) => (
                  <Link key={r.slug} href={`/qna/${r.slug}`} className="block bg-[var(--panel)] border border-[var(--line)] rounded-xl px-4 py-3 text-sm font-bold text-[var(--ink)] hover:border-hb-blue transition">
                    {r.q}
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex gap-4 flex-wrap">
                <Link href={`/qna/cat/${f.cat}`} className="text-sm font-bold text-hb-blue">← {cat?.label} 전체 보기</Link>
                <Link href="/qna" className="text-sm font-bold text-[var(--mute)]">Q&A 홈</Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
