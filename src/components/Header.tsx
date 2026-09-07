"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { site, navGroups } from "@/data/site";
import { ThemeToggle } from "./ThemeToggle";
import { Icon } from "./Icon";

// 크롬/엣지/안드로이드가 설치 가능 시 발생시키는 이벤트
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function Header() {
  const [open, setOpen] = useState(false);        // 모바일 서랍
  const [menu, setMenu] = useState<number | null>(null); // 데스크탑 드롭다운(터치용 click 토글)
  const [acc, setAcc] = useState<number | null>(0);   // 모바일 서랍 아코디언
  const [bmHint, setBmHint] = useState<string | null>(null);
  const installRef = useRef<BeforeInstallPromptEvent | null>(null);

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
      showHint("설치 완료! 바탕화면·홈 화면에서 한별시스템 아이콘을 확인하세요 ✅");
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
      showHint("이미 앱으로 설치되어 있어요. 바탕화면·홈 화면 아이콘을 사용하세요 👍");
      return;
    }
    // 크롬·엣지·안드로이드: 실제 설치 프롬프트
    if (installRef.current) {
      installRef.current.prompt();
      const { outcome } = await installRef.current.userChoice;
      installRef.current = null;
      showHint(
        outcome === "accepted"
          ? "설치 중이에요. 잠시 후 아이콘이 생깁니다 ✅"
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
    /* 시놀로지식 검정 헤더(2026-09-08). 흰 로고·흰 메뉴·드롭다운·흰 테두리 알약 버튼 */
    <header className="sticky top-0 z-50 bg-hb-primary text-white" onMouseLeave={() => setMenu(null)}>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 h-16 lg:h-[72px] flex items-center gap-6 lg:gap-10">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="한별시스템 홈">
          <span className="bg-white rounded-md px-1.5 py-1 inline-flex">
            <Image src="/brand/logo.webp" alt="" width={307} height={336} priority className="h-8 lg:h-9 w-auto object-contain" />
          </span>
          <span className="text-[19px] lg:text-[21px] font-bold tracking-tight">한별시스템</span>
        </Link>

        {/* 데스크탑 메뉴(드롭다운) */}
        <nav className="hidden lg:flex items-center gap-1 h-full" aria-label="주 메뉴">
          {navGroups.map((g, i) => (
            <div key={g.label} className="relative h-full flex items-center" onMouseEnter={() => setMenu(i)}>
              <button
                type="button"
                aria-expanded={menu === i}
                onClick={() => setMenu(menu === i ? null : i)}
                className={`h-10 px-4 rounded-full text-[15px] font-medium transition ${menu === i ? "bg-white/12" : "hover:bg-white/10"}`}
              >
                {g.label}
              </button>
              {menu === i && (
                <div className="absolute left-0 top-[calc(100%-6px)] w-[340px] rounded-xl bg-white text-[var(--ink)] shadow-[0_18px_50px_rgba(0,0,0,.22)] border border-[var(--line)] p-2 dark:bg-[#1B1F24] dark:text-[#E6E9ED]">
                  {g.items.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href}
                      onClick={() => setMenu(null)}
                      className="block px-4 py-2.5 rounded-lg hover:bg-[var(--panel)] transition"
                    >
                      <span className="block text-[15px] font-medium">{it.label}</span>
                      <span className="block text-[13px] text-[var(--mute)]">{it.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* 우측 */}
        <div className="ml-auto flex items-center gap-1.5 lg:gap-2 shrink-0">
          <a href={site.phone.mainHref} className="hidden xl:flex flex-col items-end leading-tight pr-2">
            <span className="inline-flex items-center gap-1.5 text-[15px] font-semibold">
              <Icon name="phone" className="w-4 h-4" strokeWidth={2} />{site.phone.main}
            </span>
            <span className="text-[11px] text-white/60">{site.phone.hours}</span>
          </a>
          <div className="relative">
            <button
              type="button"
              onClick={addBookmark}
              aria-label="즐겨찾기 추가"
              title="바탕화면·홈 화면에 추가"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition"
            >
              <Icon name="star" className="w-5 h-5" strokeWidth={1.8} />
            </button>
            {bmHint && (
              <div role="status" className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] shadow-xl px-4 py-3 text-[13px] font-medium leading-relaxed">
                {bmHint}
              </div>
            )}
          </div>
          <ThemeToggle />
          <Link href="/support/remote" className="hidden sm:inline-flex syn-btn-outline !h-10 !px-5 !text-[14px] border-white/80">
            원격지원
          </Link>
          <button
            type="button"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 서랍 - 그룹 아코디언 */}
      {open && (
        <div className="lg:hidden absolute inset-x-0 top-full max-h-[calc(100svh-4rem)] overflow-y-auto bg-hb-primary border-t border-white/10 pb-6">
          {navGroups.map((g, i) => (
            <div key={g.label} className="border-b border-white/10">
              <button
                type="button"
                aria-expanded={acc === i}
                onClick={() => setAcc(acc === i ? null : i)}
                className="w-full flex items-center justify-between px-5 h-14 text-[16px] font-medium"
              >
                {g.label}
                <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`text-white/60 transition-transform ${acc === i ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6" /></svg>
              </button>
              {acc === i && (
                <div className="pb-2">
                  {g.items.map((it) => (
                    <Link key={it.href} href={it.href} onClick={() => setOpen(false)} className="block px-7 py-2.5 text-[15px] text-white/85 hover:text-white">
                      {it.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="px-5 pt-5 flex flex-col gap-3">
            <a href={site.phone.mainHref} className="syn-btn w-full">전화 {site.phone.main}</a>
            <Link href="/support/remote" onClick={() => setOpen(false)} className="syn-btn-outline w-full border-white/80">원격지원 시작</Link>
            <p className="text-[12px] text-white/50 text-center">{site.phone.hours}</p>
          </div>
        </div>
      )}
    </header>
  );
}
