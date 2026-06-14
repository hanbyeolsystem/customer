"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function GoViewer() {
  const sp = useSearchParams();
  const url = sp.get("u") ?? "";
  const title = sp.get("t") ?? "외부 사이트";

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const loadedRef = useRef(false);
  const [blocked, setBlocked] = useState(false);

  // 일정 시간 안에 onLoad 가 안 오면 X-Frame-Options/CSP 차단으로 간주
  useEffect(() => {
    if (!url) return;
    const t = setTimeout(() => {
      if (!loadedRef.current) setBlocked(true);
    }, 10000);
    return () => clearTimeout(t);
  }, [url]);

  if (!url) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-3">⚠️</div>
        <h1 className="text-xl font-extrabold text-[var(--ink)] mb-2">잘못된 접근입니다</h1>
        <p className="text-sm text-[var(--mute)] mb-6">표시할 외부 주소가 지정되지 않았습니다.</p>
        <Link href="/" className="inline-flex items-center gap-1.5 bg-hb-blue text-white font-bold text-sm px-5 py-2.5 rounded-xl">
          ← 메인으로
        </Link>
      </div>
    );
  }

  const host = (() => {
    try { return new URL(url).host; } catch { return url; }
  })();

  return (
    <div className="flex flex-col" style={{ height: "calc(100dvh - 64px)" }}>
      {/* 상단 정보 바 */}
      <div className="flex items-center gap-3 px-3 lg:px-5 py-2 bg-[var(--panel)] border-b border-[var(--line)] text-[12px] lg:text-[13px]">
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-bold text-hb-blue hover:underline whitespace-nowrap"
        >
          ← 메인
        </Link>
        <span className="text-[var(--mute)] hidden sm:inline">|</span>
        <span className="font-extrabold text-[var(--ink)] truncate flex-shrink-0 max-w-[40%]">
          {title}
        </span>
        <span className="font-mono text-[var(--mute)] truncate flex-1 hidden sm:inline">
          🔗 {host}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener"
          className="ml-auto inline-flex items-center gap-1 text-[var(--mute)] hover:text-hb-blue font-semibold text-[11px] lg:text-xs border border-[var(--line)] hover:border-hb-blue rounded-md px-2 py-1 whitespace-nowrap"
        >
          새 창 ↗
        </a>
      </div>

      {/* iframe 또는 차단 fallback */}
      <div className="relative flex-1 bg-[var(--bg)]">
        {blocked ? (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="max-w-md text-center">
              <div className="text-5xl mb-4">🚫</div>
              <h2 className="text-lg lg:text-xl font-extrabold text-[var(--ink)] mb-2">
                이 사이트는 임베드 표시가 차단됩니다
              </h2>
              <p className="text-sm text-[var(--mute)] leading-relaxed mb-6">
                {host} 의 보안 정책으로 한별 사이트 안에서 직접 표시할 수 없습니다.<br />
                새 창에서 열어주세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center justify-center gap-2 bg-hb-blue hover:bg-hb-blue-light text-white font-extrabold text-sm px-6 py-3 rounded-xl"
                >
                  {host} 새 창에서 열기 ↗
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--panel)] font-bold text-sm px-6 py-3 rounded-xl"
                >
                  메인으로
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={url}
            title={title}
            className="absolute inset-0 w-full h-full border-0 bg-white"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => { loadedRef.current = true; }}
          />
        )}
      </div>
    </div>
  );
}
