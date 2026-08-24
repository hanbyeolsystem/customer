import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { qna, qnaBySlug, qnaCats, qnaModified, qnaPublished } from "@/data/qna";
import { qnaImage } from "@/data/qna-images";
import { site } from "@/data/site";

export function generateStaticParams() {
  return qna.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const f = qnaBySlug(slug);
  if (!f) return {};
  return {
    title: f.q,
    description: f.a.slice(0, 155),
    alternates: { canonical: `/qna/${slug}/` },
  };
}

export default async function QnaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = qnaBySlug(slug);
  if (!f) notFound();
  const cat = qnaCats.find((c) => c.id === f.cat);
  const related = qna.filter((x) => x.cat === f.cat && x.slug !== f.slug).slice(0, 4);

  // QAPage 구조화 데이터.
  // Search Console 이 지적한 누락 필드(datePublished / upvoteCount / author / url / text)를
  // Question·Answer 양쪽에 모두 채운다. upvoteCount 는 추천 기능이 없으므로 0 이 정답.
  const pageUrl = `${site.url}/qna/${f.slug}/`;
  const org = { "@type": "Organization", name: site.name, url: site.url };
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
        text: f.more ? `${f.a} ${f.more}` : f.a,
        upvoteCount: 0,
        datePublished: qnaPublished,
        dateModified: qnaModified,
        url: pageUrl,
        author: org,
      },
    },
  };

  return (
    <>
      <PageHeader badge={`Q&A · ${cat?.label ?? ""}`} title={f.q} description="" />
      <section className="py-10 lg:py-14 bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          {/* 현장 사진 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qnaImage(f.cat, f.slug)} alt={f.q}
            className="w-full max-h-[420px] object-cover rounded-2xl border border-[var(--line)] mb-6" />
          {/* 즉답 */}
          <div className="bg-[var(--panel)] border-l-4 border-hb-blue border border-[var(--line)] rounded-2xl p-6 mb-6">
            <div className="text-[11px] font-extrabold text-hb-blue tracking-[.18em] mb-2">답변</div>
            <p className="text-[var(--ink)] leading-relaxed font-medium">{f.a}</p>
          </div>
          {f.more && (
            <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 mb-6">
              <div className="text-[11px] font-extrabold text-[var(--mute)] tracking-[.18em] mb-2">더 자세히</div>
              <p className="text-sm text-[var(--ink)]/85 leading-relaxed">{f.more}</p>
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
              <div className="mt-4">
                <Link href="/qna" className="text-sm font-bold text-hb-blue">← Q&A 전체 보기</Link>
              </div>
            </>
          )}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
