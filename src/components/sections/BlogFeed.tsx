import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";
import { embedHref } from "@/lib/embed";
import { naverPosts } from "@/data/naver-posts";

/* "Synology 최신 소식" 형식: 검정 바탕, 가운데 제목, 사진 카드 4장(제목 흰색·설명 회색, 가운데 정렬).
   글은 사이트 안으로 가져온 글(/blog/<번호>/)을 먼저 쓰고, 없을 때만 블로거 RSS 로 대체한다. */
export async function BlogFeed() {
  const imported = naverPosts.slice(0, 4).map((p) => ({
    title: p.title, href: `/blog/${p.logNo}`, internal: true, thumb: p.thumb, category: p.catLabel, date: p.date.replace(/-/g, "."), excerpt: p.excerpt,
  }));
  const posts = imported.length ? imported : (await getBlogPosts(4)).map((p) => ({ ...p, internal: false }));

  return (
    <section id="news" className="bg-hb-primary text-white py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-6">
        <h2 className="text-center text-[28px] lg:text-[36px] leading-tight">한별시스템 최신 소식</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 mt-10 lg:mt-14">
          {posts.map((p) => (
            <Link key={p.title} href={p.internal ? p.href : embedHref(p.href, p.title)} className="group block text-center">
              <div className="aspect-[3/2] rounded-lg overflow-hidden bg-white/10">
                {p.thumb && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.thumb} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500" />
                )}
              </div>
              <h3 className="mt-4 text-[16px] lg:text-[17px] font-bold leading-snug line-clamp-2 group-hover:text-hb-blue-light transition">{p.title}</h3>
              <p className="mt-2 text-[13px] lg:text-[14px] text-white/65 leading-relaxed line-clamp-2">{p.excerpt}</p>
              <p className="mt-2 text-[12px] text-white/45">{p.category} · {p.date}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10 lg:mt-12">
          <Link href={imported.length ? "/blog" : embedHref("https://hanbyeolsystem.blogspot.com/", "한별 블로그")} className="syn-btn-outline text-white border-white/80">
            블로그 전체 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
