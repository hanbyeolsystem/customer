"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { site, nav, type NavItem, type NavLink } from "@/data/site";
import { Icon } from "./Icon";

// 헤더 = 로고 · 메뉴 4묶음 · 전화 · 견적 문의 (2026-09-15 첫 화면 점검에서 누를 것 18개를 8개로 줄였다)
// 즐겨찾기·다크모드는 푸터로 옮겼다. 메뉴 데이터는 site.ts 의 nav 한 곳.
const isGroup = (n: NavItem): n is { label: string; items: NavLink[] } => "items" in n;

function Chevron({ up }: { up: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" className={up ? "rotate-180 transition" : "transition"}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false); // 모바일 메뉴
  const [drop, setDrop] = useState<string | null>(null); // PC 드롭다운
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  // 홈 표지는 사진이 헤더 뒤까지 올라오므로, 맨 위에서는 헤더를 투명하게 두고 글씨를 희게 쓴다
  const overHero = usePathname() === "/" && !scrolled && !open && !drop;
  const close = () => {
    setOpen(false);
    setDrop(null);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 드롭다운은 바깥을 누르거나 Esc 로 닫는다
  useEffect(() => {
    if (!drop) return;
    const onDown = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setDrop(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrop(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [drop]);

  return (
    <header
      className={[
        "sticky top-0 z-50 transition-[background-color,box-shadow,color] duration-300",
        overHero
          ? "bg-transparent text-white border-b border-transparent"
          : "backdrop-blur bg-[color-mix(in_oklab,var(--bg)_92%,transparent)] text-[var(--ink)] border-b " + (scrolled || drop ? "border-[var(--line)]" : "border-transparent"),
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 lg:h-[68px] flex items-center justify-between gap-4">
        {/* 로고 */}
        <Link href="/" onClick={close} className={`flex items-center gap-2 shrink-0 rounded-md ${overHero ? "bg-white/95 px-1.5 py-1" : ""}`} aria-label="한별시스템 홈">
          <Image
            src="/brand/logo.webp"
            alt="한별시스템"
            width={307}
            height={336}
            // 로고는 44px 짜리라 LCP 가 되지 않는다. priority 를 주면 히어로 사진과 미리받기를
            // 다투고, 지연로딩 비율(노출 지수 기술 항목)만 깎인다. 첫 화면 안이라 어차피 바로 받는다.
            className={`${overHero ? "h-9 lg:h-10" : "h-11 lg:h-12"} w-auto object-contain transition-all`}
          />
        </Link>

        {/* PC 메뉴 4묶음 */}
        <nav ref={navRef} aria-label="주 메뉴" className="hidden lg:flex items-center gap-1 text-[15px] font-semibold whitespace-nowrap">
          {nav.map((n) =>
            isGroup(n) ? (
              <div key={n.label} className="relative" onMouseEnter={() => setDrop(n.label)} onMouseLeave={() => setDrop(null)}>
                <button
                  type="button"
                  aria-expanded={drop === n.label}
                  onClick={() => setDrop(n.label)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md hover:opacity-70 transition"
                >
                  {n.label}
                  <Chevron up={drop === n.label} />
                </button>
                {drop === n.label && (
                  <div className="absolute left-0 top-full pt-2">
                    <div className="min-w-[260px] rounded-md border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] p-1.5">
                      {n.items.map((it) => (
                        <Link key={it.href} href={it.href} onClick={close} className="block rounded-md px-3 py-2.5 hover:bg-[var(--panel)] transition">
                          <span className="block text-[14px] font-semibold">{it.label}</span>
                          {it.desc && <span className="block text-[12px] font-normal text-[var(--mute)] mt-0.5">{it.desc}</span>}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link key={n.href} href={n.href} onClick={close} className="px-3 py-2 rounded-md hover:opacity-70 transition">
                {n.label}
              </Link>
            ),
          )}
        </nav>

        {/* 우측: 전화 · 견적 문의 (폰·태블릿은 하단 고정 바가 같은 일을 하므로 메뉴 버튼만) */}
        <div className="flex items-center gap-3 shrink-0">
          <a href={site.phone.mainHref} className="hidden lg:flex flex-col items-end text-right leading-tight">
            <span className="inline-flex items-center gap-1.5 text-[15px] font-bold text-current">
              <Icon name="phone" className="w-4 h-4" strokeWidth={2} />
              {site.phone.main}
            </span>
            <span className="text-[10px] font-semibold opacity-60">{site.phone.hours}</span>
          </a>
          <Link
            href="/support/quote"
            onClick={close}
            className={`hidden lg:inline-flex items-center h-10 px-4 rounded-md text-[14px] font-bold transition ${overHero ? "bg-white text-hb-primary hover:bg-white/90" : "bg-[var(--ink)] text-[var(--bg)] hover:opacity-90"}`}
          >
            견적 문의
          </Link>
          <button
            type="button"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-current/25 text-current"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴: 맨 위 전화·견적, 아래는 묶음별 */}
      {open && (
        <div className="lg:hidden border-t border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] max-h-[calc(100svh-4rem)] overflow-y-auto">
          <div className="px-4 pt-4 grid grid-cols-2 gap-2">
            <a href={site.phone.mainHref} className="flex items-center justify-center gap-2 h-12 rounded-md bg-[var(--ink)] text-[var(--bg)] font-bold">
              <Icon name="phone" className="w-4 h-4" strokeWidth={2} />
              전화
            </a>
            <Link href="/support/quote" onClick={close} className="flex items-center justify-center h-12 rounded-md border border-[var(--line)] font-bold">
              견적 문의
            </Link>
          </div>
          <div className="px-2 pt-2 pb-4">
            {nav.map((n) =>
              isGroup(n) ? (
                <div key={n.label} className="px-2 pt-3">
                  <div className="px-1 mb-1 text-[12px] font-semibold text-[var(--mute)]">{n.label}</div>
                  <div className="grid grid-cols-2 gap-0.5">
                    {n.items.map((it) => (
                      <Link key={it.href} href={it.href} onClick={close} className="px-2 py-2.5 rounded-md text-[15px] font-semibold hover:bg-[var(--panel)] transition">
                        {it.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div key={n.href} className="px-2 pt-3">
                  <Link href={n.href} onClick={close} className="block px-2 py-2.5 rounded-md text-[15px] font-semibold hover:bg-[var(--panel)] transition">
                    {n.label}
                  </Link>
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </header>
  );
}
