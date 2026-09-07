"use client";

import { useEffect } from "react";

/* 스크롤 나타나기 효과 (2026-09-08 사장님 "아래로 내리면 글과 사진이 나타나는 현상").
   [data-reveal] 요소가 화면에 들어오면 .is-in 을 붙인다. 숨김 상태는 <html class="hb-js"> 가 있을 때만 CSS 로 걸리므로
   JS 가 없거나 크롤러가 볼 때는 전부 그대로 보인다(globals.css 참고). 한 번 나타나면 다시 숨기지 않는다.
   같은 화면에 함께 들어온 요소는 순서대로 80ms 씩 늦게 나타난다.
   prefers-reduced-motion 은 의도적으로 보지 않는다. 윈도우 "애니메이션 효과"를 성능 때문에 꺼 둔 PC 가 많아
   (사장님 PC 포함) 효과가 아예 안 보이는 오탐이 컸다(HeroBackground 와 같은 결정, 2026-08-26). 0.7초 페이드라 정보 손실은 없다. */
export function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("hb-js");
    const io = new IntersectionObserver(
      (entries) => {
        let k = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.style.transitionDelay = `${Math.min(k++, 5) * 80}ms`;
          el.classList.add("is-in");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const watch = () => document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    watch();
    // 페이지 이동(App Router)·동적 렌더 뒤에도 새 요소를 잡는다
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
  return null;
}
