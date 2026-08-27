import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { AnswerBlock } from "@/components/AnswerBlock";
import { naverPosts, naverPostByNo, naverCats } from "@/data/naver-posts";
import { caseBySlug } from "@/data/cases";
import { businessId, site } from "@/data/site";
import { breadcrumbLd } from "@/lib/schema";

// 네이버 블로그에서 가져온 글(scripts/naver-import.mjs). 본문·사진 전문을 사이트 안에 둔다.
export function generateStaticParams() {
  return naverPosts.map((p) => ({ logNo: p.logNo }));
}

export async function generateMetadata({ params }: { params: Promise<{ logNo: string }> }): Promise<Metadata> {
  const { logNo } = await params;
  const p = naverPostByNo(logNo);
  if (!p) return {};
  return {
    title: p.title,
    description: `${p.title} - ${p.excerpt}`.slice(0, 155),
    alternates: { canonical: `/blog/${logNo}/` },
    openGraph: p.thumb ? { images: [{ url: p.thumb }] } : undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ logNo: string }> }) {
  const { logNo } = await params;
  const p = naverPostByNo(logNo);
  if (!p) notFound();
  const cat = naverCats.find((c) => c.id === p.catLabel);
  const relCase = p.caseSlug ? caseBySlug(p.caseSlug) : undefined;
  // 같은 분류에서 "내 다음 4개" (앞 4개 고정 금지 - 링크가 한쪽에만 몰린다)
  const same = naverPosts.filter((x) => x.catLabel === p.catLabel);
  const i = same.findIndex((x) => x.logNo === p.logNo);
  const others = Array.from({ length: Math.min(4, same.length - 1) }, (_, k) => same[(i + 1 + k) % same.length]);
  const pageUrl = `${site.url}/blog/${p.logNo}/`;
  let imgN = 0;
  // 즉답: 본문 첫 문단들을 그대로 요약으로 쓴다(새로 지어내지 않음). 글 전체가 짧으면 즉답도 짧다.
  const lead = p.blocks.filter((b) => b.t === "p").map((b) => b.text).join(" ").slice(0, 320);
  const answer = `${lead}${lead.length >= 320 ? "…" : ""} (${p.date.replace(/-/g, ".")} 현장, 대구광역시 달서구 한별시스템 ${site.phone.main})`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${pageUrl}#post`,
    headline: p.title,
    description: p.excerpt,
    articleSection: p.catLabel,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    inLanguage: "ko-KR",
    datePublished: p.date,
    dateModified: p.date,
    image: p.blocks.filter((b) => b.t === "img").map((b) => (b.src.startsWith("http") ? b.src : `${site.url}${b.src}`)),
    author: { "@id": businessId },
    publisher: { "@id": businessId },
    isBasedOn: p.href,
    wordCount: p.chars,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd([{ name: "현장 블로그", path: "/blog/" }, { name: p.title, path: `/blog/${p.logNo}/` }])} />
      <PageHeader badge={`${cat?.label ?? p.catLabel} · ${p.date.replace(/-/g, ".")}`} title={p.title} description="" back="/blog" backLabel="현장 블로그" />
      <AnswerBlock
        question={`${p.title}, 어떤 내용인가요?`}
        answer={answer}
        facts={[{ label: "분류", value: p.catLabel }, { label: "현장 사진", value: `${p.images}장` }, { label: "작성", value: p.date.replace(/-/g, ".") }]}
      />

      <article className="py-10 lg:py-14 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          {(relCase || p.related) && (
            <div className="flex flex-wrap gap-2 mb-8">
              {relCase && (
                <Link href={`/cases/${relCase.slug}`} className="inline-flex items-center gap-2 bg-hb-blue text-white text-sm font-extrabold px-4 py-2 rounded-full">
                  이 현장의 구축 사례 보기 →
                </Link>
              )}
              <Link href={p.related.href} className="inline-flex items-center gap-2 border border-[var(--line)] bg-[var(--panel)] text-[var(--ink)] text-sm font-bold px-4 py-2 rounded-full hover:border-hb-blue">
                {p.related.label} →
              </Link>
            </div>
          )}

          <div className="space-y-5">
            {p.blocks.map((b, k) =>
              b.t === "img" ? (
                <figure key={k} className="m-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.src}
                    alt={`${p.title} 현장 사진 ${++imgN}`}
                    width={b.w}
                    height={b.h}
                    loading={imgN === 1 ? "eager" : "lazy"}
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto rounded-2xl border border-[var(--line)]"
                  />
                </figure>
              ) : (
                <p key={k} className="text-[15.5px] text-[var(--ink)]/90 leading-[1.85]">{b.text}</p>
              ),
            )}
          </div>

          <div className="mt-10 bg-[var(--panel)] border-l-4 border-hb-blue border border-[var(--line)] rounded-2xl p-6">
            <div className="text-[11px] font-extrabold text-hb-blue tracking-[.18em] mb-2">이어서 보기</div>
            <p className="text-sm text-[var(--ink)]/85 leading-relaxed mb-4">
              이 글과 관련된 비용·구성은 <Link href={p.related.href} className="text-hb-blue font-bold hover:underline">{p.related.label}</Link> 페이지에 표로 정리되어 있습니다.
              {relCase ? <> 이 현장은 <Link href={`/cases/${relCase.slug}`} className="text-hb-blue font-bold hover:underline">구축 사례</Link>로도 정리했습니다.</> : null}
              {" "}대구·경북은 당일 방문하며 방문 견적은 무료입니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/support/quote" className="inline-flex items-center justify-center bg-hb-blue hover:bg-hb-azure text-white font-extrabold text-sm px-5 py-2.5 rounded-xl transition">무료 방문 견적 요청</Link>
              <a href={site.phone.mainHref} className="inline-flex items-center justify-center border border-[var(--line)] text-[var(--ink)] font-extrabold text-sm px-5 py-2.5 rounded-xl transition hover:border-hb-blue">전화 {site.phone.main}</a>
              <a href={p.href} target="_blank" rel="noopener" className="inline-flex items-center text-sm font-bold text-[var(--mute)] hover:text-hb-blue px-2 py-2.5">네이버 블로그 원문 ↗</a>
            </div>
          </div>

          {others.length > 0 && (
            <div className="mt-10">
              <h2 className="text-base font-extrabold text-[var(--ink)] mb-3">{cat?.label ?? p.catLabel} 다른 글</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {others.map((o) => (
                  <Link key={o.logNo} href={`/blog/${o.logNo}`} className="flex gap-3 bg-[var(--panel)] border border-[var(--line)] rounded-xl p-3 hover:border-hb-blue transition">
                    {o.thumb && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={o.thumb} alt={o.title} loading="lazy" decoding="async" referrerPolicy="no-referrer" width={96} height={72} className="w-24 h-[72px] object-cover rounded-lg shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="text-[11px] text-[var(--mute)] mb-1">{o.date.replace(/-/g, ".")}</div>
                      <div className="text-sm font-bold text-[var(--ink)] leading-snug line-clamp-2">{o.title}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
