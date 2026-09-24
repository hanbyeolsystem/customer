"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

// 크롬/엣지/안드로이드가 설치 가능 시 발생시키는 이벤트
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// 바탕화면/홈 화면 바로가기 추가. 헤더에서 푸터로 옮겼다(2026-09-15 첫 화면 점검).
export function BookmarkButton({ className = "" }: { className?: string }) {
  const [hint, setHint] = useState<string | null>(null);
  const installRef = useRef<BeforeInstallPromptEvent | null>(null);

  const showHint = (msg: string, ms = 5500) => {
    setHint(msg);
    window.setTimeout(() => setHint(null), ms);
  };

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

  const addBookmark = async () => {
    const nav2 = navigator as Navigator & { standalone?: boolean };
    const standalone = window.matchMedia("(display-mode: standalone)").matches || nav2.standalone === true;
    if (standalone) {
      showHint("이미 앱으로 설치되어 있어요. 바탕화면·홈 화면 아이콘을 사용하세요");
      return;
    }
    if (installRef.current) {
      installRef.current.prompt();
      const { outcome } = await installRef.current.userChoice;
      installRef.current = null;
      showHint(outcome === "accepted" ? "설치 중이에요. 잠시 후 아이콘이 생깁니다" : "설치를 취소했어요. 언제든 다시 눌러주세요.");
      return;
    }
    const ua = navigator.userAgent || "";
    if (/iPhone|iPad|iPod/i.test(ua)) {
      showHint("사파리 하단 '공유' → '홈 화면에 추가' 를 누르면 아이콘이 생겨요.");
      return;
    }
    const isMac = /Mac/i.test(navigator.platform || ua);
    showHint(
      `${isMac ? "⌘ Cmd" : "Ctrl"} + D 로 즐겨찾기에 추가할 수 있어요. 크롬·엣지는 주소창의 '설치' 아이콘으로 바탕화면 바로가기를 만들 수 있습니다.`,
    );
  };

  return (
    <span className="relative inline-block">
      <button type="button" onClick={addBookmark} aria-label="즐겨찾기 추가" className={className}>
        <Icon name="star" className="w-4 h-4" strokeWidth={1.8} />
        <span>즐겨찾기</span>
      </button>
      {hint && (
        <span
          role="status"
          className="absolute left-0 bottom-9 z-50 w-72 rounded-xl border border-[var(--line)] bg-[var(--bg)] shadow-xl px-4 py-3 text-[13px] font-semibold leading-relaxed text-[var(--ink)]"
        >
          {hint}
        </span>
      )}
    </span>
  );
}
