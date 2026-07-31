import { posts as fallbackPosts, type Post } from "@/data/posts";

// 네이버 블로그 RSS — 정적 export 라서 "빌드 시점"에 읽는다.
// 자동 갱신은 .github/workflows/deploy.yml 의 schedule(cron) 재빌드가 담당.
const RSS_URL = "https://rss.blog.naver.com/hanbyeolsystem.xml";

function tag(xml: string, name: string): string {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  if (!m) return "";
  return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

function toDate(rfc822: string): string {
  const d = new Date(rfc822);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
}

function toExcerpt(desc: string): string {
  const text = desc
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\.{4,}/g, "…")
    .trim();
  return text.length > 110 ? text.slice(0, 110).trimEnd() + "…" : text;
}

export async function getNaverPosts(limit = 12): Promise<Post[]> {
  try {
    const res = await fetch(RSS_URL);
    if (!res.ok) throw new Error(`RSS HTTP ${res.status}`);
    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
    const posts = items
      .map((item): Post => ({
        title: tag(item, "title"),
        excerpt: toExcerpt(tag(item, "description")),
        date: toDate(tag(item, "pubDate")),
        href: tag(item, "guid") || tag(item, "link").split("?")[0],
        category: tag(item, "category") || "소식",
      }))
      .filter((p) => p.title && p.href.startsWith("http"))
      .slice(0, limit);
    if (posts.length === 0) throw new Error("RSS empty");
    return posts;
  } catch (e) {
    // 네이버 장애/차단 시 빌드가 죽지 않도록 마지막 수동 스냅샷으로 대체
    console.warn("[naver-rss] fallback to static posts:", e);
    return fallbackPosts.slice(0, limit);
  }
}
