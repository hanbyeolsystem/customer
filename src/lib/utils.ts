import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 사이트에 노출되는 텍스트는 em-dash(-)/en-dash(-) 대신 일반 하이픈만 쓴다.
// 소스 콘텐츠는 이미 치환했고, 이 함수는 블로거 RSS·news.json 처럼
// 외부에서 들어오는 문자열을 렌더 직전에 정리하는 용도다.
export function dedash(s: string): string {
  return s.replace(/[—–]/g, "-");
}

// meta description 을 검색엔진 권장 길이(50~155자)에 맞춘다.
// 따옴표·앰퍼샌드는 HTML 에서 &quot; &amp; 로 늘어나 길이 검사에 걸리므로 미리 치환하고,
// 너무 짧으면 pad 를 붙이고, 길면 마지막 띄어쓰기에서 자른다.
export function metaDescription(text: string, pad = ""): string {
  let s = dedash(text).replace(/["'<>]/g, "").replace(/&/g, "·").replace(/\s+/g, " ").trim();
  if (s.length < 60 && pad) s = `${s} ${pad}`.trim();
  if (s.length > 150) {
    const cut = s.slice(0, 150);
    const at = cut.lastIndexOf(" ");
    s = (at >= 110 ? cut.slice(0, at) : cut).trim();
  }
  return s;
}
