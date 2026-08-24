import { posts as fallbackPosts, type Post } from "@/data/posts";
import { dedash } from "@/lib/utils";

// 구글 블로거(Blogger) RSS - 정적 export 라서 "빌드 시점"에 읽는다.
// 자동 갱신은 .github/workflows/deploy.yml 의 schedule(cron) 재빌드가 담당.
// (2026-08-23 네이버 RSS → Blogger RSS 전환. 크로스포스팅은 scripts/naver-to-blogger.mjs)
const RSS_URL = "https://hanbyeolsystem.blogspot.com/feeds/posts/default?alt=rss&max-results=24";

// 매일 자동 발행되는 "IT소식" 카드 글 라벨 - 소식 섹션(getBlogPosts)에서는 제외하고
// 커뮤니티 상단 카드(getInfoCards)에서만 노출한다.
const INFO_LABEL = "IT소식";
const INFO_RSS_URL = `https://hanbyeolsystem.blogspot.com/feeds/posts/default/-/${encodeURIComponent(INFO_LABEL)}?alt=rss&max-results=24`;

function tag(xml: string, name: string): string {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  if (!m) return "";
  return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

// Blogger RSS 의 description 은 CDATA 가 아니라 엔티티 이스케이프된 HTML
function unescapeHtml(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function tagAll(xml: string, name: string): string[] {
  const out: string[] = [];
  const re = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "g");
  let m;
  while ((m = re.exec(xml))) out.push(m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim());
  return out;
}

function toDate(rfc822: string): string {
  const d = new Date(rfc822);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
}

function toThumb(desc: string): string | undefined {
  const m = desc.match(/<img[^>]+src="([^"]+)"/);
  if (!m) return undefined;
  const src = m[1];
  // 크로스포스팅 글의 네이버 이미지는 카드용 크기(w580)로 요청
  if (src.includes("pstatic.net")) {
    return src
      .replace("//blogthumb.pstatic.net/", "//mblogthumb-phinf.pstatic.net/")
      .replace(/\?type=[^&"]+/, "?type=w580");
  }
  return src;
}

function toExcerpt(desc: string): string {
  let text = desc
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*]+/g, " ")
    .replace(/\s-{3,}\s/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\.{4,}/g, "…")
    .trim();
  // GEO 용 영문 헤딩 등은 건너뛰고 첫 한글부터 발췌
  const ko = text.search(/[가-힣]/);
  if (ko > 0) text = text.slice(ko);
  return text.length > 110 ? text.slice(0, 110).trimEnd() + "…" : text;
}

function parseItem(item: string): Post & { labels: string[] } {
  const desc = unescapeHtml(tag(item, "description"));
  const labels = tagAll(item, "category");
  return {
    title: dedash(tag(item, "title").replace(/\s*\|\s*한별시스템\s*$/, "")),
    excerpt: dedash(toExcerpt(desc)),
    date: toDate(tag(item, "pubDate")),
    // Blogger 의 guid 는 URL 이 아니므로(tag:blogger…) link 를 쓴다
    href: tag(item, "link"),
    category: labels.find((l) => l !== INFO_LABEL) || labels[0] || "소식",
    thumb: toThumb(desc),
    labels,
  };
}

async function fetchFeed(url: string): Promise<(Post & { labels: string[] })[]> {
  // 정적 export 는 빌드 시점에만 fetch 됨. 로컬 재빌드 시 이전 응답이 보이면 .next/cache 삭제 후 빌드
  const res = await fetch(url);
  if (!res.ok) throw new Error(`RSS HTTP ${res.status}`);
  const xml = await res.text();
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  return items.map(parseItem).filter((p) => p.title && p.href.startsWith("http"));
}

export async function getBlogPosts(limit = 12): Promise<Post[]> {
  try {
    // 일일 IT소식 카드 글은 소식 섹션에서 제외(커뮤니티 카드 전용)
    const posts = (await fetchFeed(RSS_URL)).filter((p) => !p.labels.includes(INFO_LABEL)).slice(0, limit);
    if (posts.length === 0) throw new Error("RSS empty");
    return posts;
  } catch (e) {
    // 피드 장애 시 빌드가 죽지 않도록 마지막 수동 스냅샷으로 대체
    console.warn("[blogger-rss] fallback to static posts:", e);
    return fallbackPosts.slice(0, limit);
  }
}

// 커뮤니티 상단 "오늘의 IT 소식" 카드 - IT소식 라벨 피드만 읽는다.
// 아직 글이 없거나 피드 장애면 빈 배열(섹션 자체를 숨김).
export async function getInfoCards(limit = 8): Promise<Post[]> {
  try {
    return (await fetchFeed(INFO_RSS_URL)).slice(0, limit);
  } catch (e) {
    console.warn("[blogger-rss] info cards unavailable:", e);
    return [];
  }
}
