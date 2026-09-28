// 쇼츠 영상 글(/shorts/). 데이터는 src/data/shorts.json 하나이고, 억만장자군단 앱이 사장님 승인 뒤
// GitHub API 로 맨 앞에 한 건씩 넣는다. 사람이 검수하지 않은 값이 들어오므로 여기서 전부 거른다.
//  - slug 는 빌드 출력 폴더 이름이 된다. 소문자·숫자·하이픈만 통과(../ 같은 경로 탈출 차단).
//  - date 가 YYYY-MM-DD 가 아니면 사이트맵 lastmod 가 깨지므로 그 글은 뺀다. 제목이 없어도 뺀다.
//  - 링크는 http(s) 만, 썸네일은 /shorts/<소문자>.jpg 만, 유튜브 ID 는 6~20자 영숫자·_- 만.
//  - images(단계 카드 1080x1350)도 같은 경로 규칙, 최대 10장. alt 는 80자에서 자르고 없으면 제목+번호.
// 화면은 React 텍스트 노드로만 그린다(dangerouslySetInnerHTML 금지).

import raw from "@/data/shorts.json";
import { dedash } from "@/lib/utils";

export const shortTopics = ["nas", "network", "pc", "copier", "printer", "general"] as const;
export type ShortTopic = (typeof shortTopics)[number];

export type ShortImage = { src: string; alt: string };

export type Short = {
  slug: string;
  date: string;
  title: string;
  memoryHook: string;
  summary: string;
  youtubeId: string;
  youtubeUrl: string;
  thumb: string;
  images: ShortImage[];
  steps: { title: string; body: string }[];
  cautions: string[];
  keywords: string[];
  topic: ShortTopic;
  guideUrl: string;
  blogUrl: string;
  seconds: number;
};

/** 썸네일이 없거나 형식이 틀리면 쓰는 대표 카드 이미지(1200x630). */
export const shortFallbackThumb = "/og.jpg";

const text = (v: unknown) => (typeof v === "string" ? dedash(v).trim() : "");
const texts = (v: unknown) => (Array.isArray(v) ? v.map(text).filter(Boolean) : []);
const match = (v: unknown, re: RegExp) => (typeof v === "string" && re.test(v) ? v : "");

function httpUrl(v: unknown) {
  const s = text(v);
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:" ? u.href : "";
  } catch {
    return "";
  }
}

function clean(e: unknown): Short | null {
  if (!e || typeof e !== "object") return null;
  const r = e as Record<string, unknown>;
  const slug = match(r.slug, /^[a-z0-9][a-z0-9-]{0,79}$/);
  const date = match(r.date, /^\d{4}-\d{2}-\d{2}$/);
  const title = text(r.title);
  if (!slug || !date || Number.isNaN(Date.parse(date)) || !title) return null;
  const youtubeId = match(r.youtubeId, /^[A-Za-z0-9_-]{6,20}$/);
  const seconds = typeof r.seconds === "number" && Number.isFinite(r.seconds) && r.seconds > 0 ? r.seconds : 0;
  return {
    slug,
    date,
    title,
    memoryHook: text(r.memoryHook),
    summary: text(r.summary),
    youtubeId,
    youtubeUrl: httpUrl(r.youtubeUrl) || (youtubeId ? `https://www.youtube.com/shorts/${youtubeId}` : ""),
    thumb: match(r.thumb, /^\/shorts\/[a-z0-9-]+\.jpg$/),
    images: (Array.isArray(r.images) ? r.images : [])
      .map((m) => ({ src: match((m as Record<string, unknown>)?.src, /^\/shorts\/[a-z0-9-]+\.jpg$/), alt: [...text((m as Record<string, unknown>)?.alt)].slice(0, 80).join("").trim() }))
      .filter((m) => m.src)
      .slice(0, 10)
      .map((m, i) => ({ src: m.src, alt: m.alt || `${title} ${i + 1}` })),
    steps: (Array.isArray(r.steps) ? r.steps : [])
      .map((s) => ({ title: text((s as Record<string, unknown>)?.title), body: text((s as Record<string, unknown>)?.body) }))
      .filter((s) => s.title || s.body),
    cautions: texts(r.cautions),
    keywords: texts(r.keywords),
    topic: (shortTopics as readonly string[]).includes(r.topic as string) ? (r.topic as ShortTopic) : "general",
    guideUrl: httpUrl(r.guideUrl),
    blogUrl: httpUrl(r.blogUrl),
    seconds,
  };
}

const seen = new Set<string>();
/** 검증을 통과한 글, 최신순. 같은 slug 가 두 번이면 앞(최신) 것만 쓴다. */
export const shorts: Short[] = (Array.isArray(raw) ? (raw as unknown[]) : [])
  .map(clean)
  .filter((s): s is Short => !!s && !seen.has(s.slug) && !!seen.add(s.slug))
  .sort((a, b) => b.date.localeCompare(a.date));

export const shortBySlug = (slug: string) => shorts.find((s) => s.slug === slug);

export const shortEmbedUrl = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
