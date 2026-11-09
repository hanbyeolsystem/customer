import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/schema";
import { metaDescription } from "@/lib/utils";
import { CATS, OFFICIAL_NICK, RELATED, getCommunityPosts, kstDate, type Post } from "@/lib/community";
import { naverPostByNo } from "@/data/naver-posts";
import { businessId, site } from "@/data/site";

// 커뮤니티 글 한 편 = 주소 한 개. 게시판 한 장에 모든 글이 몰려 있으면 검색·AI 가 글 단위로 인용하지 못한다.
// 빌드 시점 글로만 만든다(정적 배포). 새 글은 하루 3번 도는 재빌드에서 페이지가 생긴다.
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getCommunityPosts();
  return posts.filter((p) => p.parent_id === null).map((p) => ({ id: String(p.id) }));
}

async function load(id: string) {
  const posts = await getCommunityPosts();
  const q = posts.find((p) => p.parent_id === null && String(p.id) === id);
  if (!q) return null;
  const replies = posts.filter((p) => p.parent_id === q.id).sort((a, b) => a.created_at.localeCompare(b.created_at));
  return { q, replies };
}

const titleOf = (q: Post) => q.title?.trim() || q.content.slice(0, 40);
// 블로그 글을 다시 쓴 글이면 원래 글(사진·날짜)을 찾는다
const sourceOf = (q: Post) => (q.source?.startsWith("naver:") ? naverPostByNo(q.source.slice(6)) : undefined);
const abs = (s: string) => (s.startsWith("http") ? s : `${site.url}${s}`);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const d = await load(id);
  if (!d) return {};
  const src = sourceOf(d.q);
  return {
    title: titleOf(d.q),
    description: metaDescription(d.q.content, "한별시스템 커뮤니티. 대구·경북 NAS·복합기·컴퓨터 질문과 현장 글."),
    alternates: { canonical: `/community/${id}/` },
    openGraph: src?.thumb ? { images: [{ url: src.thumb }] } : undefined,
  };
}

export default async function CommunityPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = await load(id);
  if (!d) notFound();
  const { q, replies } = d;
  const title = titleOf(q);
  const url = `${site.url}/community/${q.id}/`;
  const src = sourceOf(q);
  const official = (nick: string) => nick === OFFICIAL_NICK;
  const author = (nick: string) =>
    official(nick)
      ? { "@type": "Organization", "@id": businessId, name: site.name, url: site.url }
      : { "@type": "Person", name: nick };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    "@id": `${url}#post`,
    headline: title,
    text: q.content,
    url,
    mainEntityOfPage: url,
    inLanguage: "ko-KR",
    datePublished: q.created_at,
    author: author(q.nick),
    ...(src?.thumb ? { image: abs(src.thumb) } : {}),
    ...(src ? { isBasedOn: src.href } : {}),
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/CommentAction",
      userInteractionCount: replies.length,
    },
    comment: replies.map((r) => ({ "@type": "Comment", text: r.content, datePublished: r.created_at, author: author(r.nick) })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd([{ name: "커뮤니티", path: "/community/" }, { name: title, path: `/community/${q.id}/` }])} />
      <PageHeader badge={`${CATS[q.category] ?? "기타"} · ${kstDate(q.created_at)}`} title={title} back="/community" backLabel="커뮤니티" />

      <article className="py-10 lg:py-14 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <div className="text-[12px] text-[var(--mute)] mb-4">
            <b className={official(q.nick) ? "text-hb-blue" : "text-[var(--ink)]/80"}>{q.nick}</b> · {kstDate(q.created_at)}
          </div>
          <p className="text-[15px] text-[var(--ink)]/90 leading-relaxed whitespace-pre-wrap">{q.content}</p>

          {src?.thumb && (
            <div className="mt-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src.thumb} alt={`${src.title} 현장 사진`} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="hb-fig" />
              <p className="text-xs text-[var(--mute)] mt-2">
                현장 사진. 나머지 사진 {Math.max(src.images - 1, 0)}장은{" "}
                <Link href={`/blog/${src.logNo}/`} className="text-hb-blue font-bold hover:underline">현장 블로그 글</Link>에 있습니다.
              </p>
            </div>
          )}

          {replies.length > 0 && (
            <section className="mt-10 space-y-2.5 border-t border-dashed border-[var(--line)] pt-5">
              <h2 className="text-sm font-extrabold text-[var(--ink)] mb-2">답글 {replies.length}개</h2>
              {replies.map((r) => (
                <div key={r.id} className="bg-[var(--panel)] rounded-xl px-4 py-3">
                  <div className="text-[11px] text-[var(--mute)] mb-1">
                    <b className={official(r.nick) ? "text-hb-blue" : "text-[var(--ink)]/80"}>{r.nick}</b> {kstDate(r.created_at)}
                  </div>
                  <p className="text-sm text-[var(--ink)]/85 leading-relaxed whitespace-pre-wrap">{r.content}</p>
                </div>
              ))}
            </section>
          )}

          <div className="mt-10 bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6">
            <div className="text-[11px] font-extrabold text-hb-blue tracking-[.18em] mb-3">이어서 보기</div>
            <div className="flex flex-wrap gap-2 mb-5">
              {(RELATED[q.category] ?? RELATED.etc).map((l) => (
                <Link key={l.href} href={l.href} className="inline-flex border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] text-sm font-bold px-4 py-2 rounded-full hover:border-hb-blue">
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={site.phone.mainHref} className="inline-flex items-center justify-center bg-hb-blue text-white font-extrabold text-sm px-5 py-2.5 rounded-xl">전화 {site.phone.main}</a>
              <Link href="/community/" className="inline-flex items-center justify-center border border-[var(--line)] text-[var(--ink)] font-extrabold text-sm px-5 py-2.5 rounded-xl hover:border-hb-blue">
                게시판에서 질문·답글 남기기
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
