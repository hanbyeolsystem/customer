"use client";

import { useState } from "react";

/* 시놀로지 "AI Advisor" 섹션 형식: 파스텔 그라데이션 바탕, 왼쪽 제목·입력창, 오른쪽 질문 예시 칩.
   질문을 누르거나 입력하면 기존 채팅 상담 위젯(ChatWidget, 상담원 별이)이 열리며 그 질문을 보낸다. */
const examples = [
  "시놀로지 NAS 구축 비용은 얼마나 하나요?",
  "랜섬웨어에 걸리면 NAS 백업도 같이 암호화되나요?",
  "복합기 임대 월 요금에 토너가 포함되나요?",
  "사내 AI를 지금 쓰는 NAS로 시작할 수 있나요?",
  "프린터 드라이버는 어디서 받나요?",
  "원격지원은 어떻게 받나요?",
];

export function AskSection() {
  const [q, setQ] = useState("");
  const ask = (text: string) => {
    const t = text.trim();
    if (!t) return;
    window.dispatchEvent(new CustomEvent("hb:ask", { detail: t }));
    setQ("");
  };
  return (
    <section className="bg-[linear-gradient(110deg,#FFF1E9_0%,#F3F0FF_55%,#E6F4FF_100%)] dark:bg-[linear-gradient(110deg,#2A2320_0%,#1F1E2C_55%,#1A2430_100%)] py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <span className="inline-flex w-12 h-12 rounded-full bg-gradient-to-br from-hb-blue to-[#8A5CF6] text-white items-center justify-center mb-5" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></svg>
          </span>
          <h2 className="text-[28px] lg:text-[36px] leading-tight text-[var(--ink)]">무엇을 도와드릴까요?</h2>
          <p className="mt-4 text-[16px] lg:text-[17px] font-light leading-relaxed text-[var(--mute)] max-w-lg">
            NAS·백업·복합기 임대·드라이버·A/S. 궁금한 것을 적으면 한별시스템 상담원이 바로 답합니다. 사람이 필요한 문의는 전화로 이어 드립니다.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); ask(q); }}
            className="mt-6 flex items-center h-14 rounded-full bg-[var(--bg)] border border-[var(--line)] shadow-sm pl-5 pr-2"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="무엇을 도와드릴까요?"
              aria-label="질문 입력"
              className="flex-1 bg-transparent text-[15px] text-[var(--ink)] placeholder:text-[var(--mute)] focus:outline-none"
            />
            <button type="submit" aria-label="질문 보내기" className="w-10 h-10 rounded-full bg-hb-primary text-white flex items-center justify-center hover:bg-hb-blue transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
            </button>
          </form>
          <p className="mt-3 text-[12px] text-[var(--mute)]">답변은 참고용이며, 정확한 견적과 일정은 상담원이 확인해 드립니다.</p>
        </div>

        <ul className="flex flex-col gap-3 items-start lg:items-end">
          {examples.map((ex) => (
            <li key={ex}>
              <button
                type="button"
                onClick={() => ask(ex)}
                className="text-left px-5 py-3 rounded-2xl bg-[var(--bg)]/80 border border-[var(--line)] text-[14px] lg:text-[15px] text-[var(--ink)] hover:bg-[var(--bg)] hover:border-hb-blue transition shadow-sm"
              >
                {ex}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
