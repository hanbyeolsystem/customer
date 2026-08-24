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
