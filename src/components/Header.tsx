"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { site, nav } from "@/data/site";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 backdrop-blur transition-shadow",
        "bg-[color-mix(in_oklab,var(--bg)_92%,transparent)]",
        scrolled ? "shadow-sm border-b border-[var(--line)]" : "border-b border-transparent",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 lg:h-[68px] flex items-center justify-between gap-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="한별시스템 홈">
          <Image
            src="/brand/logo.png"
            alt="한별시스템"
            width={240}
            height={280}
            priority
            className="h-11 lg:h-12 w-auto object-contain"
          />
          <span className="text-[10px] font-semibold text-[var(--mute)] tracking-[.15em] hidden xl:block">
            HANBYEOL SYSTEM
          </span>
        </Link>

        {/* 중앙 메뉴 */}
        <nav className="hidden xl:flex items-center gap-1 text-[14px] font-semibold text-[var(--ink)]/85">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3 py-2 rounded-md hover:bg-[var(--panel)] hover:text-hb-blue transition"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* 우측 */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={site.phone.mainHref}
            className="hidden lg:flex flex-col items-end text-right leading-tight pr-2"
          >
            <span className="text-[15px] font-extrabold text-[var(--ink)]">
              📞 {site.phone.main}
            </span>
            <span className="text-[10px] font-semibold text-[var(--mute)]">
              {site.phone.hours}
            </span>
          </a>
          <ThemeToggle />
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setOpen((v) => !v)}
            className="xl:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--line)] text-[var(--ink)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {open && (
        <div className="xl:hidden border-t border-[var(--line)] bg-[var(--bg)]">
          <div className="px-4 py-3 grid grid-cols-2 gap-1">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-lg text-sm font-semibold text-[var(--ink)]/85 hover:bg-[var(--panel)] hover:text-hb-blue transition"
              >
                {n.label}
              </Link>
            ))}
          </div>
          <div className="px-4 pb-4">
            <a
              href={site.phone.mainHref}
              className="flex items-center justify-between bg-hb-primary text-white rounded-xl px-4 py-3 font-extrabold"
            >
              <span>📞 {site.phone.main}</span>
              <span className="text-xs font-semibold text-white/70">{site.phone.hours}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
