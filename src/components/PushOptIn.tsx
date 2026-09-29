"use client";

import { useEffect, useState } from "react";
import { pushSupported, resyncPush, subscribePush } from "@/lib/push";

// 홈 화면 알림 받기 카드. 브라우저 권한 창은 [알림 받기]를 누른 뒤에만 띄운다
// (들어오자마자 권한을 물으면 대부분 차단을 누르고, 한 번 차단하면 다시 물을 수 없다).
// [괜찮아요]는 14일 동안 다시 묻지 않는다. 아이폰은 홈 화면에 추가한 앱에서만 PushManager 가 있어 그때만 뜬다.
const HIDE_KEY = "hb_push_hide_until";

export function PushOptIn() {
  const [state, setState] = useState<"hidden" | "ask" | "busy" | "done" | "blocked">("hidden");

  useEffect(() => {
    if (!pushSupported()) return;
    if (Notification.permission === "granted") { resyncPush().catch(() => {}); return; }
    if (Notification.permission !== "default") return;
    try { if (Date.now() < Number(localStorage.getItem(HIDE_KEY) || 0)) return; } catch {}
    const t = setTimeout(() => setState("ask"), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (state !== "done") return;
    const t = setTimeout(() => setState("hidden"), 4000);
    return () => clearTimeout(t);
  }, [state]);

  if (state === "hidden") return null;

  const later = () => {
    try { localStorage.setItem(HIDE_KEY, String(Date.now() + 14 * 864e5)); } catch {}
    setState("hidden");
  };
  const allow = async () => {
    setState("busy");
    const ok = await subscribePush().catch(() => false);
    setState(ok ? "done" : "blocked");
  };

  return (
    <div
      role="dialog"
      aria-label="알림 받기"
      className="fixed z-[55] bottom-[4.75rem] lg:bottom-5 left-4 right-20 lg:right-auto lg:left-5 sm:max-w-[340px] rounded-xl border border-[var(--line)] bg-[var(--bg)] shadow-xl p-4 hb-rise"
    >
      {state === "done" ? (
        <p className="text-[14px] font-semibold text-[var(--ink)]">알림을 켰어요. 특가가 생기면 먼저 알려 드릴게요.</p>
      ) : state === "blocked" ? (
        <>
          <p className="text-[13.5px] text-[var(--ink)] leading-relaxed">
            알림이 꺼져 있어요. 주소창 왼쪽 자물쇠 아이콘에서 알림을 허용하면 받을 수 있어요.
          </p>
          <button type="button" onClick={later} className="mt-3 text-[13px] font-semibold text-[var(--mute)] hover:text-[var(--ink)]">
            닫기
          </button>
        </>
      ) : (
        <>
          <p className="font-bold text-[15px] text-[var(--ink)]">할인 소식을 알림으로 받아 보세요</p>
          <p className="mt-1 text-[13px] text-[var(--mute)] leading-relaxed">
            NAS나 복합기 특가가 나오면 이 기기로 바로 알려 드려요. 끄는 건 브라우저 설정에서 언제든 할 수 있어요.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={allow}
              disabled={state === "busy"}
              className="rounded-md bg-[var(--ink)] text-[var(--bg)] px-4 py-2 text-[13.5px] font-bold disabled:opacity-60"
            >
              {state === "busy" ? "켜는 중" : "알림 받기"}
            </button>
            <button type="button" onClick={later} className="rounded-md px-3 py-2 text-[13.5px] font-semibold text-[var(--mute)] hover:text-[var(--ink)]">
              괜찮아요
            </button>
          </div>
        </>
      )}
    </div>
  );
}
