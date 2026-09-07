import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";
import { embedHref } from "@/lib/embed";
import { naverPosts } from "@/data/naver-posts";
import { site } from "@/data/site";
import { SlideHead } from "./SlideHead";

/* 07 소식·연락. 왼쪽은 최근 글 다섯 줄, 오른쪽은 전화·주소·지도. 모바일은 연락처를 먼저 보여 준다.
   글은 사이트 안으로 가져온 글(/blog/<번호>/)을 먼저 쓰고, 없을 때만 블로거 RSS 로 대체한다. */
export async function BlogFeed() {
  const imported = naverPosts.slice(0, 4).map((p) => ({
    title: p.title, href: `/blog/${p.logNo}`, internal: true, category: p.catLabel, date: p.date.replace(/-/g, "."),
  }));
  const posts = imported.length ? imported : (await getBlogPosts(4)).map((p) => ({ ...p, internal: false }));
  const mapLinks = [
    ["네이버 지도", site.listings.naverPlace],
    ["카카오맵", site.listings.kakaoPlace],
    ["구글 지도", site.social.googleMaps],
  ] as const;

  return (
    <section id="news" className="hb-slide bg-[var(--bg)] py-16 lg:py-20">
      <div className="max-w-6xl w-full mx-auto px-5 lg:px-8">
        <SlideHead no="07" kicker="소식 · 연락" title="읽을거리와 연락처" className="mb-8 lg:mb-10" />

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* 연락 - 모바일에서 먼저 */}
          <div className="order-1 lg:order-2 lg:col-span-5">
            <a href={site.phone.mainHref} className="block font-display text-[34px] sm:text-[40px] lg:text-[44px] leading-none text-[var(--ink)] hover:text-hb-blue transition">
              {site.phone.main}
            </a>
            <p className="mt-2 text-[14px] text-[var(--mute)]">{site.phone.hours} · 휴대폰 <a href={site.phone.mobileHref} className="text-[var(--ink)] underline underline-offset-4 decoration-[var(--line)]">{site.phone.mobile}</a></p>

            <dl className="mt-7 border-t border-[var(--line)] text-[15px]">
              <div className="grid grid-cols-[4.5rem_1fr] gap-4 py-3.5 border-b border-[var(--line)]">
                <dt className="text-[var(--mute)]">주소</dt>
                <dd className="text-[var(--ink)]">{site.address.street}</dd>
              </div>
              <div className="grid grid-cols-[4.5rem_1fr] gap-4 py-3.5 border-b border-[var(--line)]">
                <dt className="text-[var(--mute)]">이메일</dt>
                <dd className="text-[var(--ink)] break-all"><a href={`mailto:${site.email}`} className="hover:text-hb-blue">{site.email}</a></dd>
              </div>
              <div className="grid grid-cols-[4.5rem_1fr] gap-4 py-3.5 border-b border-[var(--line)]">
                <dt className="text-[var(--mute)]">지도</dt>
                <dd className="flex flex-wrap gap-x-4 gap-y-1">
                  {mapLinks.map(([label, href]) => (
                    <a key={label} href={href} target="_blank" rel="noopener" className="text-[var(--ink)] underline underline-offset-4 decoration-[var(--line)] hover:decoration-hb-blue hover:text-hb-blue">{label}</a>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link href="/support/quote" className="inline-flex items-center justify-center h-12 px-6 rounded-md bg-[var(--ink)] text-[var(--bg)] font-bold text-[15px] hover:bg-hb-blue transition">
                무료 방문 견적 신청
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center h-12 px-6 rounded-md border border-[var(--line)] text-[var(--ink)] font-semibold text-[15px] hover:border-[var(--ink)] transition">
                찾아오시는 길
              </Link>
            </div>
          </div>

          {/* 최근 글 */}
          <div className="order-2 lg:order-1 lg:col-span-7">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="font-sans text-[13px] font-semibold tracking-[.12em] text-[var(--mute)]">최근 글</h3>
              <Link
                href={imported.length ? "/blog" : embedHref("https://hanbyeolsystem.blogspot.com/", "한별 블로그")}
                className="text-[13px] font-semibold text-hb-blue underline underline-offset-4 decoration-hb-blue/40 hover:decoration-hb-blue"
              >
                블로그 전체 보기
              </Link>
            </div>
            <ul className="border-t border-[var(--line)]">
              {posts.map((p) => (
                <li key={p.title} className="border-b border-[var(--line)]">
                  <Link
                    href={p.internal ? p.href : embedHref(p.href, p.title)}
                    className="flex items-baseline gap-4 py-3.5 group"
                  >
                    <time className="shrink-0 w-[5.5rem] text-[13px] text-[var(--mute)] tabular-nums">{p.date}</time>
                    <span className="flex-1 text-[15px] lg:text-[16px] leading-snug text-[var(--ink)] group-hover:text-hb-blue transition line-clamp-2">{p.title}</span>
                    <span className="hidden sm:block shrink-0 text-[12px] text-[var(--mute)]">{p.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13px] text-[var(--mute)]">
              궁금한 것은 <Link href="/qna" className="text-[var(--ink)] underline underline-offset-4 decoration-[var(--line)] hover:text-hb-blue">Q&amp;A 문답</Link>과{" "}
              <Link href="/guide" className="text-[var(--ink)] underline underline-offset-4 decoration-[var(--line)] hover:text-hb-blue">가이드·비교표</Link>에 정리해 두었습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
