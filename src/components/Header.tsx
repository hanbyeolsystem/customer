"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { site, nav } from "@/data/site";
import { ThemeToggle } from "./ThemeToggle";
import { Icon } from "./Icon";

// 크롬/엣지/안드로이드가 설치 가능 시 발생시키는 이벤트
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // 홈 표지는 사진이 헤더 뒤까지 올라오므로, 맨 위에서는 헤더를 투명하게 두고 글씨를 희게 쓴다
  const overHero = usePathname() === "/" && !scrolled && !open;
  const [bmHint, setBmHint] = useState<string | null>(null);
  const installRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // PWA: 서비스워커 등록 + 설치 프롬프트 캡처
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      installRef.current = e as BeforeInstallPromptEvent;
    };
    const onInstalled = () => {
      installRef.current = null;
      showHint("설치했습니다. 바탕화면·홈 화면에서 한별시스템 아이콘을 확인하세요.");
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const showHint = (msg: string, ms = 5500) => {
    setBmHint(msg);
    window.setTimeout(() => setBmHint(null), ms);
  };

  // 바탕화면/홈 화면 바로가기 추가 - 플랫폼별 분기
  const addBookmark = async () => {
    const nav2 = navigator as Navigator & { standalone?: boolean };
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches || nav2.standalone === true;
    if (standalone) {
      showHint("이미 앱으로 설치되어 있어요. 바탕화면·홈 화면 아이콘을 사용하세요");
      return;
    }
    // 크롬·엣지·안드로이드: 실제 설치 프롬프트
    if (installRef.current) {
      installRef.current.prompt();
      const { outcome } = await installRef.current.userChoice;
      installRef.current = null;
      showHint(
        outcome === "accepted"
          ? "설치 중이에요. 잠시 후 아이콘이 생깁니다"
          : "설치를 취소했어요. 언제든 다시 눌러주세요.",
      );
      return;
    }
    const ua = navigator.userAgent || "";
    // iOS 사파리: 자동 설치 불가 - 수동 안내
    if (/iPhone|iPad|iPod/i.test(ua)) {
      showHint("사파리 하단 '공유' → '홈 화면에 추가' 를 누르면 아이콘이 생겨요.");
      return;
    }
    // 그 외(설치 조건 대기·파이어폭스 등): 단축키/주소창 안내
    const isMac = /Mac/i.test(navigator.platform || ua);
    showHint(
      `${isMac ? "⌘ Cmd" : "Ctrl"} + D 로 즐겨찾기에 추가할 수 있어요. 크롬·엣지는 주소창의 '설치' 아이콘으로 바탕화면 바로가기를 만들 수 있습니다.`,
    );
  };

  return (
    <header
      className={[
        "sticky top-0 z-50 transition-[background-color,box-shadow,color] duration-300",
        overHero
          ? "bg-transparent text-white border-b border-transparent"
          : "backdrop-blur bg-[color-mix(in_oklab,var(--bg)_92%,transparent)] text-[var(--ink)] border-b " + (scrolled ? "border-[var(--line)]" : "border-transparent"),
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 lg:h-[68px] flex items-center justify-between gap-4">
        {/* 로고 */}
        <Link href="/" className={`flex items-center gap-2 shrink-0 rounded-md ${overHero ? "bg-white/95 px-1.5 py-1" : ""}`} aria-label="한별시스템 홈">
          <Image
            src="/brand/logo.webp"
            alt="한별시스템"
            width={307}
            height={336}
            priority
            className={`${overHero ? "h-9 lg:h-10" : "h-11 lg:h-12"} w-auto object-contain transition-all`}
          />
          <span className="text-[10px] font-semibold text-[var(--mute)] tracking-[.15em] hidden 2xl:block">
            HANBYEOL SYSTEM
          </span>
        </Link>

        {/* 중앙 메뉴 */}
        <nav className="hidden xl:flex items-center gap-0 text-[13px] font-semibold opacity-90 whitespace-nowrap">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-1.5 py-2 rounded-md hover:opacity-70 transition"
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
            <span className="inline-flex items-center gap-1.5 text-[15px] font-bold text-current">
              <Icon name="phone" className="w-4 h-4" strokeWidth={2} />
              {site.phone.main}
            </span>
            <span className="text-[10px] font-semibold opacity-60">
              {site.phone.hours}
            </span>
          </a>
          <div className="relative">
            <button
              type="button"
              onClick={addBookmark}
              aria-label="즐겨찾기 추가"
              className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-md border border-current/25 text-current hover:border-current transition text-[13px] font-semibold"
            >
              <Icon name="star" className="w-4 h-4" strokeWidth={1.8} />
              <span className="hidden sm:inline">즐겨찾기</span>
            </button>
            {bmHint && (
              <div
                role="status"
                className="absolute right-0 top-11 z-50 w-72 rounded-xl border border-[var(--line)] bg-[var(--bg)] shadow-xl px-4 py-3 text-[13px] font-semibold leading-relaxed text-[var(--ink)]"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="star" className="w-4 h-4 text-hb-azure shrink-0" strokeWidth={1.8} />
                  {bmHint}
                </span>
              </div>
            )}
          </div>
          <ThemeToggle />
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setOpen((v) => !v)}
            className="xl:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-current/25 text-current"
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
          <div className="px-2 py-2 grid grid-cols-2 gap-0.5">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-md text-[15px] font-semibold text-[var(--ink)] hover:bg-[var(--panel)] transition"
              >
                {n.label}
              </Link>
            ))}
          </div>
          <div className="px-4 pb-4">
            <a
              href={site.phone.mainHref}
              className="flex items-center justify-between bg-[var(--ink)] text-[var(--bg)] rounded-md px-4 py-3.5 font-bold"
            >
              <span className="inline-flex items-center gap-2">
                <Icon name="phone" className="w-4 h-4" strokeWidth={2} />
                {site.phone.main}
              </span>
              <span className="text-xs font-semibold text-white/70">{site.phone.hours}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
