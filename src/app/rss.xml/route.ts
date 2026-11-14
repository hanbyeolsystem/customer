import { caseStudies } from "@/data/cases";
import { guides } from "@/data/guides";
import { site } from "@/data/site";
import { shorts } from "@/lib/shorts";
import { getCommunityPosts } from "@/lib/community";
import { dedash } from "@/lib/utils";

export const dynamic = "force-static";

// 네이버 서치어드바이저 "RSS 제출"용 피드. 사이트가 직접 쓴 글만 넣는다.
// /blog/<logNo>/ 는 네이버 블로그 사본이라 넣지 않는다(네이버가 원문과 중복으로 본다).
// 날짜는 각 글의 실제 날짜만 쓴다(new Date() 금지 - 사이트맵 lastmod 규칙과 같음).
type Item = { title: string; link: string; description: string; date: string };

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const snippet = (s: string) => dedash(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()).slice(0, 160);

export async function GET() {
  const posts = await getCommunityPosts();
  const items: Item[] = [
    ...guides.map((g) => ({ title: g.title, link: `/guide/${g.slug}/`, description: g.lead, date: `${g.updated}T00:00:00+09:00` })),
    ...caseStudies.map((c) => ({ title: c.title, link: `/cases/${c.slug}/`, description: c.summary, date: `${c.date}-01T00:00:00+09:00` })),
    ...shorts.map((s) => ({ title: s.title, link: `/shorts/${s.slug}/`, description: s.summary, date: `${s.date}T00:00:00+09:00` })),
    ...posts
      .filter((p) => p.parent_id === null)
      .map((p) => ({
        title: dedash(p.title || snippet(p.content).slice(0, 40)),
        link: `/community/${p.id}/`,
        description: snippet(p.content),
        date: p.created_at,
      })),
  ]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 50);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>${esc(site.name)}</title>
<link>${site.url}/</link>
<description>${esc(`${site.name} 가이드·구축 사례·커뮤니티 새 글`)}</description>
<language>ko</language>
${items[0] ? `<lastBuildDate>${new Date(items[0].date).toUTCString()}</lastBuildDate>` : ""}
${items
  .map(
    (i) => `<item>
<title>${esc(i.title)}</title>
<link>${site.url}${i.link}</link>
<guid isPermaLink="true">${site.url}${i.link}</guid>
<description>${esc(i.description)}</description>
<pubDate>${new Date(i.date).toUTCString()}</pubDate>
</item>`,
  )
  .join("\n")}
</channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
