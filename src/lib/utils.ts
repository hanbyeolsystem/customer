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

// 설명문 낱말: 조사를 뗀 2글자 이상, 숫자가 든 것(모델명·금액·전화)은 뺀다.
const JOSA = /(으로|에서|까지|부터|이나|이며|이고|하는|합니다|입니다|은|는|이|가|을|를|의|에|와|과|도|로|만|등)$/;
const descWords = (s: string) =>
  (s.match(/[가-힣A-Za-z0-9]+/g) ?? []).map((w) => w.replace(JOSA, "")).filter((w) => w.length >= 2 && !/\d/.test(w));
export const descRepeats = (s: string) => descWords(s).filter((w, i, a) => a.indexOf(w) !== i);

// meta description(2026-11-15 개정): 네이버 서치어드바이저 안내 "1~2문장의 짧은 단락",
// "2회 이상 반복 키워드는 노출 불이익" + 업계 권장 80자. 앞 문장부터 최대 2개를 차례로 담고,
// 80자를 넘거나 같은 낱말이 두 번 나오는 문장에서 멈춘다(건너뛰면 앞뒤가 안 맞는다).
// text 를 배열로 주면 앞 후보의 첫 문장부터 안 맞을 때 다음 후보를 쓴다. 전부 안 맞으면 첫 후보를
// 낱말 경계에서 자르고 그때만 말줄임표를 붙인다. 짧으면 pad 를 같은 조건(2문장 이하)으로 붙인다.
// 따옴표·앰퍼샌드는 HTML 에서 &quot; &amp; 로 늘어나므로 미리 치환한다.
export const DESC_MAX = 80;
export const descFits = (t: string) => t.length <= DESC_MAX && descRepeats(t).length === 0;
const splitSentences = (t: string) => t.split(/(?<=[.?!])\s+/);
export function metaDescription(text: string | string[], pad = ""): string {
  const tries = (Array.isArray(text) ? text : [text])
    .map((t) => dedash(t).replace(/["'<>]/g, "").replace(/&/g, "·").replace(/\s+/g, " ").trim())
    .filter(Boolean);
  let out = "";
  for (const s of tries) {
    for (const sen of splitSentences(s).slice(0, 2)) {
      const next = out ? `${out} ${sen}` : sen;
      if (!descFits(next)) break;
      out = next;
    }
    if (out) break;
  }
  if (!out && tries[0]) {
    // shortcut: 후보 문장이 전부 길거나 반복이면 낱말 단위로 자른다. 자주 걸리는 쪽은 설명을 손으로 쓴다.
    for (const w of splitSentences(tries[0])[0].split(" ")) {
      const next = out ? `${out} ${w}` : w;
      if (!descFits(`${next}…`)) break;
      out = next;
    }
    out = `${out.replace(/[,·:\-(]+$/, "")}…`;
  }
  if (pad && out.length < 45) {
    const next = `${out} ${metaDescription(pad)}`;
    if (descFits(next) && splitSentences(next).length <= 2) out = next;
  }
  return out;
}
