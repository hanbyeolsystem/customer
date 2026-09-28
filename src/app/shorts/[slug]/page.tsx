import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { shortBySlug, shortEmbedUrl, shortFallbackThumb, shorts, type ShortImage } from "@/lib/shorts";
import { breadcrumbLd, isoDateTime } from "@/lib/schema";
import { embedHref } from "@/lib/embed";
import { metaDescription } from "@/lib/utils";
import { businessId, site } from "@/data/site";

/** 단계 카드(1080x1350 세로). 크기를 박아 두어 늦게 떠도 글이 밀리지 않는다. */
function StepImage({ img }: { img: ShortImage }) {
  return (
    <figure data-reveal className="my-6 mx-auto max-w-[480px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img.src} alt={img.alt} width={1080} height={1350} loading="lazy" decoding="async" className="w-full h-auto rounded-md border border-[var(--line)] bg-[var(--panel)]" />
      <figcaption className="mt-2 text-center text-[13px] text-[var(--mute)]">{img.alt}</figcaption>
    </figure>
  );
}

// output: "export" 는 generateStaticParams 가 빈 배열이면 빌드를 멈춘다(Next 오류 E87).
// 글이 없을 때는 자리표시 slug 하나를 내보내고 그 페이지는 notFound() 로 404 가 된다(링크·사이트맵 없음).
export function generateStaticParams() {
  return shorts.length ? shorts.map((s) => ({ slug: s.slug })) : [{ slug: "empty" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = shortBySlug(slug);
  if (!s) return { robots: { index: false, follow: false } };
  const description = metaDescription(s.summary || s.title, "한별시스템 영상 가이드, 대구·경북 당일 출장 053-588-7119.");
  const image = { url: s.thumb || shortFallbackThumb, width: 1200, height: 630, alt: s.title };
  return {
    title: s.title,
    description,
    alternates: { canonical: `/shorts/${s.slug}/` },
    openGraph: {
      type: "article",
      locale: "ko_KR",
      siteName: site.name,
      title: s.title,
      description,
      url: `/shorts/${s.slug}/`,
      publishedTime: isoDateTime(s.date),
      images: [image],
    },
    twitter: { card: "summary_large_image", title: s.title, description, images: [image.url] },
  };
}

export default async function ShortPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = shortBySlug(slug);
  if (!s) notFound();

  const pageUrl = `${site.url}/shorts/${s.slug}/`;
  const thumbUrl = `${site.url}${s.thumb || shortFallbackThumb}`;
  const graph: object[] = [breadcrumbLd([{ name: "영상 가이드", path: "/shorts/" }, { name: s.title, path: `/shorts/${s.slug}/` }])];
  if (s.youtubeId) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "@id": `${pageUrl}#video`,
      name: s.title,
      description: s.summary || s.title,
      thumbnailUrl: [thumbUrl],
      uploadDate: isoDateTime(s.date),
      ...(s.seconds ? { duration: `PT${Math.round(s.seconds)}S` } : {}),
      contentUrl: s.youtubeUrl,
      embedUrl: shortEmbedUrl(s.youtubeId),
      inLanguage: "ko-KR",
      publisher: { "@id": businessId },
      ...(s.keywords.length ? { keywords: s.keywords.join(", ") } : {}),
    });
  }
  if (s.steps.length) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "@id": `${pageUrl}#howto`,
      name: s.title,
      ...(s.summary ? { description: s.summary } : {}),
      image: s.images.length ? s.images.map((m) => `${site.url}${m.src}`) : thumbUrl,
      inLanguage: "ko-KR",
      ...(s.youtubeId ? { video: { "@id": `${pageUrl}#video` } } : {}),
      step: s.steps.map((st, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: st.title || `${i + 1}단계`,
        text: st.body || st.title,
        url: `${pageUrl}#step-${i + 1}`,
      })),
    });
  }

  // 사진 배치: 첫 장은 요약 바로 뒤, 나머지는 단계 사이 빈칸(단계 수 - 1)에 한 장씩 고르게,
  // 빈칸보다 많으면 남은 것은 단계 목록 뒤(주의할 점 앞)에 둔다. 키는 "몇 번 단계 뒤"(1부터).
  const [leadImage, ...restImages] = s.images;
  const gaps = Math.min(restImages.length, Math.max(s.steps.length - 1, 0));
  const afterStep = new Map<number, ShortImage>();
  for (let k = 0; k < gaps; k++) afterStep.set(Math.round(((k + 1) * s.steps.length) / (gaps + 1)), restImages[k]);
  const tailImages = restImages.slice(gaps);

  const links = [
    s.guideUrl && { label: "자료 페이지", href: embedHref(s.guideUrl, s.title) },
    s.blogUrl && { label: "구글 블로그 글", href: embedHref(s.blogUrl, s.title) },
  ].filter((l): l is { label: string; href: string } => !!l);

  return (
    <>
      {graph.map((g, i) => (
        <JsonLd key={i} data={g} />
      ))}
      <PageHeader badge={`영상 가이드 · ${s.date.replace(/-/g, ".")}`} title={s.title} description={s.memoryHook || undefined} back="/shorts/" backLabel="영상 가이드" />

      <article className="py-10 lg:py-14 bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-[minmax(0,360px)_1fr] gap-8 lg:gap-12 items-start">
            <div className="w-full max-w-[360px] mx-auto md:mx-0">
              {s.youtubeId ? (
                <div className="aspect-[9/16] rounded-md overflow-hidden bg-black">
                  <iframe
                    src={shortEmbedUrl(s.youtubeId)}
                    title={s.title}
                    loading="lazy"
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="h-full w-full border-0"
                  />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.thumb || shortFallbackThumb} alt={s.title} width={1200} height={630} loading="lazy" decoding="async" className="w-full rounded-md border border-[var(--line)]" />
              )}
              {s.youtubeUrl && (
                <a href={s.youtubeUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[14px] font-semibold text-hb-blue underline underline-offset-4 decoration-hb-blue/40 hover:decoration-hb-blue">
                  유튜브에서 보기
                </a>
              )}
            </div>

            <div className="min-w-0">
              <time dateTime={s.date} className="text-[13px] text-[var(--mute)] tabular-nums">{s.date.replace(/-/g, ".")} 올림</time>
              {s.summary && <p className="mt-3 text-[16px] text-[var(--ink)]/90 leading-relaxed">{s.summary}</p>}
              {leadImage && <StepImage img={leadImage} />}

              {s.steps.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-xl lg:text-2xl text-[var(--ink)] mb-4">순서대로 하기</h2>
                  <ol className="border-t border-[var(--line)]">
                    {s.steps.map((st, i) => (
                      <li key={i} id={`step-${i + 1}`} className="flex gap-4 py-4 border-b border-[var(--line)]">
                        <span className="shrink-0 font-display text-[20px] leading-none text-hb-blue w-6 pt-0.5">{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          {st.title && <h3 className="font-sans text-[16px] font-bold text-[var(--ink)] leading-snug">{st.title}</h3>}
                          {st.body && <p className="mt-1 text-[15px] text-[var(--mute)] leading-relaxed">{st.body}</p>}
                          {afterStep.has(i + 1) && <StepImage img={afterStep.get(i + 1)!} />}
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {tailImages.map((m, i) => (
                <StepImage key={i} img={m} />
              ))}

              {s.cautions.length > 0 && (
                <section className="mt-8 bg-[var(--panel)] border border-[var(--line)] rounded-md p-5">
                  <h2 className="font-sans text-[15px] font-bold text-[var(--ink)] mb-2">주의할 점</h2>
                  <ul className="space-y-1.5 list-disc pl-5 text-[15px] text-[var(--ink)]/90 leading-relaxed">
                    {s.cautions.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </section>
              )}

              {s.keywords.length > 0 && (
                <ul className="mt-8 flex flex-wrap gap-1.5" aria-label="키워드">
                  {s.keywords.map((k) => (
                    <li key={k} className="text-[13px] text-[var(--mute)] border border-[var(--line)] rounded-md px-2.5 py-1">{k}</li>
                  ))}
                </ul>
              )}

              <p className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
                {links.map((l) => (
                  <Link key={l.label} href={l.href} className="font-semibold text-[var(--ink)] underline underline-offset-4 decoration-[var(--line)] hover:text-hb-blue hover:decoration-hb-blue">
                    {l.label}
                  </Link>
                ))}
                <Link href="/shorts/" className="font-semibold text-[var(--ink)] underline underline-offset-4 decoration-[var(--line)] hover:text-hb-blue hover:decoration-hb-blue">
                  다른 영상 보기
                </Link>
              </p>
            </div>
          </div>
        </div>
      </article>

      <CtaBanner
        title={<>영상대로 했는데도 <span className="text-hb-blue-light">안 되면</span></>}
        lead="원격으로 먼저 보고, 안 되면 찾아갑니다. 대구·경북은 당일 출장이 됩니다."
      />
    </>
  );
}
