"use client";

import { useEffect, useState } from "react";

/* 홈 슬라이드 위치 표시(데스크탑만). 화면 오른쪽에 얇은 선 7개와 현재 장 번호.
   .hb-slide 를 세어서 만들므로 슬라이드를 넣고 빼도 손댈 것이 없다. */
export function SlideNav() {
  const [n, setN] = useState(0);
  const [cur, setCur] = useState(0);

  useEffect(() => {
    const slides = Array.from(document.querySelectorAll<HTMLElement>(".hb-slide"));
    setN(slides.length);
    if (!slides.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        // 화면 가운데를 지나는 슬라이드를 현재 장으로 본다
        for (const e of entries) if (e.isIntersecting) setCur(slides.indexOf(e.target as HTMLElement));
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  if (n < 2) return null;
  const go = (i: number) => document.querySelectorAll<HTMLElement>(".hb-slide")[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  const onDark = cur === 0 || cur === 2; // 표지·사내 AI 는 어두운 슬라이드

  return (
    <nav aria-label="슬라이드" className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3">
      <span className={`font-display text-[13px] tabular-nums ${onDark ? "text-white/80" : "text-[var(--ink)]"}`}>
        {String(cur + 1).padStart(2, "0")}<span className={onDark ? "text-white/40" : "text-[var(--mute)]"}> / {String(n).padStart(2, "0")}</span>
      </span>
      {Array.from({ length: n }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`${i + 1}번째 슬라이드로`}
          aria-current={i === cur ? "true" : undefined}
          onClick={() => go(i)}
          className="group h-3 flex items-center"
        >
          <span
            className={[
              "block h-px transition-all",
              i === cur ? "w-7" : "w-4 group-hover:w-6",
              onDark ? (i === cur ? "bg-white" : "bg-white/40") : (i === cur ? "bg-[var(--ink)]" : "bg-[var(--mute)]/50"),
            ].join(" ")}
          />
        </button>
      ))}
    </nav>
  );
}
