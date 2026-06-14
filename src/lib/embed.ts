// 외부 URL 을 한별 사이트 안 iframe (/go) 으로 라우팅
// 차단되는 사이트는 fallback 안내 화면이 뜸
export function embedHref(url: string, title?: string): string {
  const u = encodeURIComponent(url);
  const t = title ? `&t=${encodeURIComponent(title)}` : "";
  return `/go?u=${u}${t}`;
}
