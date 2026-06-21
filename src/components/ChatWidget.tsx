"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { CHAT_ENDPOINT, SUPABASE_ANON_KEY, type ChatMessage } from "@/lib/chat";

const STORAGE_KEY = "hb_chat_v1";
const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "안녕하세요, 한별시스템 고객센터 상담원 별이예요. 😊\nNAS·복사기 임대, 드라이버, A/S, 견적 등 무엇이든 물어보세요.",
};
const QUICK = [
  "드라이버 받고 싶어요",
  "복사기 임대 문의",
  "A/S 접수하려면?",
  "프린터 에러코드 떴어요",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 같은 기기 재방문 기억 — 직전 대화 복원
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch {
      /* 손상된 저장값 무시 */
    }
  }, []);

  // 대화 변경 시 저장(최근 20개) + 스크롤 하단
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
    } catch {
      /* 용량 초과 등 무시 */
    }
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    setError(null);
    setInput("");

    const next = [...messages, { role: "user", content } as ChatMessage];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        // 인사말은 빼고 실제 대화만 전송
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "연결 실패");
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setError(
        e instanceof Error && e.message
          ? e.message
          : "잠시 연결이 어려워요. 053-588-7119 로 문의해 주세요."
      );
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMessages([GREETING]);
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }

  const showQuick = messages.filter((m) => m.role === "user").length === 0;

  return (
    <>
      {/* 플로팅 토글 버튼 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "상담창 닫기" : "상담창 열기"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-full bg-hb-blue text-white shadow-xl shadow-hb-blue/30 flex items-center justify-center hover:bg-hb-azure transition active:scale-95"
      >
        {open ? <IconClose /> : <IconChat />}
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-hb-azure-2 ring-2 ring-[var(--bg)] hb-blink" />
        )}
      </button>

      {/* 대화 패널 */}
      {open && (
        <div
          role="dialog"
          aria-label="한별시스템 고객센터 상담"
          className="fixed z-[60] bottom-24 right-4 left-4 sm:left-auto sm:right-5 sm:w-[380px] max-h-[72vh] h-[560px] flex flex-col rounded-2xl border border-[var(--line)] bg-[var(--bg)] shadow-2xl overflow-hidden hb-rise"
        >
          {/* 헤더 */}
          <div className="flex items-center gap-3 px-4 py-3 bg-hb-primary text-white shrink-0">
            <span className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-lg">
              ⭐
            </span>
            <div className="leading-tight flex-1">
              <p className="font-extrabold text-[15px]">한별시스템 상담원 별이</p>
              <p className="text-[11px] text-white/70 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 hb-blink" />
                보통 즉시 응답 · 평일 09–18시 전화 053-588-7119
              </p>
            </div>
            <button
              type="button"
              onClick={reset}
              aria-label="대화 초기화"
              className="text-white/70 hover:text-white text-[11px] font-semibold px-2 py-1 rounded-md hover:bg-white/10 transition"
            >
              새 대화
            </button>
          </div>

          {/* 메시지 영역 */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3">
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} />
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-[var(--panel)] px-3.5 py-2.5 text-[var(--mute)]">
                  <span className="inline-flex gap-1">
                    <Dot /> <Dot d="150ms" /> <Dot d="300ms" />
                  </span>
                </div>
              </div>
            )}

            {error && (
              <p className="text-center text-[12px] text-red-500 font-semibold px-4">{error}</p>
            )}

            {showQuick && !loading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="text-[12.5px] font-semibold px-3 py-1.5 rounded-full border border-hb-blue/40 text-hb-blue hover:bg-hb-blue hover:text-white transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 입력 */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-[var(--line)] p-2.5 flex items-end gap-2 shrink-0 bg-[var(--bg)]"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="메시지를 입력하세요…"
              className="flex-1 resize-none max-h-28 px-3 py-2.5 rounded-xl bg-[var(--panel)] text-[var(--ink)] text-[14px] placeholder:text-[var(--mute)] focus:outline-none focus-visible:ring-2 ring-hb-blue"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="보내기"
              className="w-10 h-10 shrink-0 rounded-xl bg-hb-blue text-white flex items-center justify-center hover:bg-hb-azure disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <IconSend />
            </button>
          </form>
          <p className="text-center text-[10px] text-[var(--mute)] pb-2 -mt-1">
            AI 상담원입니다. 정확한 견적·계약은 전화 상담을 권장합니다.
          </p>
        </div>
      )}
    </>
  );
}

function Bubble({ role, content }: ChatMessage) {
  const isUser = role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={[
          "max-w-[82%] px-3.5 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap break-words rounded-2xl",
          isUser
            ? "bg-hb-blue text-white rounded-br-sm"
            : "bg-[var(--panel)] text-[var(--ink)] rounded-bl-sm",
        ].join(" ")}
      >
        {isUser ? content : renderRich(content)}
      </div>
    </div>
  );
}

// 답변 속 마크다운 링크 [라벨](경로) 를 클릭 가능한 링크로 변환.
// 내부 경로(/...)는 SPA 이동(next/link), 외부(http)·전화(tel)는 새로/기본 동작.
const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;

function renderRich(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const [, label, href] = m;
    const cls =
      "inline font-bold underline underline-offset-2 text-hb-blue dark:text-hb-azure-2 hover:opacity-80";
    if (href.startsWith("/")) {
      nodes.push(
        <Link key={m.index} href={href} className={cls}>
          {label}
        </Link>
      );
    } else {
      const external = href.startsWith("http");
      nodes.push(
        <a
          key={m.index}
          href={href}
          className={cls}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {label}
        </a>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function Dot({ d = "0ms" }: { d?: string }) {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"
      style={{ animationDelay: d }}
    />
  );
}

function IconChat() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 9.5 9.5 0 0 1-4-.9L3 21l1.9-5.5a8.5 8.5 0 0 1-.9-4 8.38 8.38 0 0 1 8.5-8.5 8.38 8.38 0 0 1 8.5 8.5z" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
function IconSend() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}
