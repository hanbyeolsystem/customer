"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/data/site";

export default function QuotePage() {
  const [submitted, setSubmitted] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const company = String(fd.get("company") ?? "").trim();
    const name    = String(fd.get("name") ?? "").trim();
    const phone   = String(fd.get("phone") ?? "").trim();
    if (!company || !name || !phone) {
      setAlert("회사명·담당자·연락처는 필수입니다.");
      return;
    }
    const interest = fd.getAll("interest").join(", ") || "(미선택)";
    const message  = String(fd.get("message") ?? "").trim() || "(없음)";
    const subject  = `[견적/상담 요청] ${company} / ${name} (${phone})`;
    const body =
      `[한별시스템 견적·상담 요청]\n` +
      `────────────────────────────\n\n` +
      `• 회사명: ${company}\n` +
      `• 담당자: ${name}\n` +
      `• 연락처: ${phone}\n` +
      `• 관심분야: ${interest}\n\n` +
      `─ 내용 ─\n${message}\n\n` +
      `────────────────────────────\n` +
      `※ ${site.url} 견적 요청 페이지에서 제출됨`;
    window.location.href =
      `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  }

  return (
    <>
      <PageHeader
        badge="REQUEST QUOTE"
        title="상담 · 견적 신청"
        description="짧게 남겨주시면 한별 컨설턴트가 1영업일 내 회신드립니다."
      />
      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-2xl mx-auto px-4 lg:px-6">
          <form onSubmit={onSubmit} className="bg-[var(--panel)] border border-[var(--line)] rounded-3xl p-6 lg:p-9 space-y-4">
            <Field label="회사명" name="company" required placeholder="(주)한별시스템" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="담당자 성함" name="name" required placeholder="홍길동" />
              <Field label="연락처" name="phone" type="tel" required placeholder="010-1234-5678" />
            </div>
            <div>
              <Label>관심 분야 (중복 가능)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["NAS 구축", "백업", "복합기 임대", "유지보수"].map((v) => (
                  <label key={v} className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl border border-[var(--line)] hover:border-hb-blue cursor-pointer has-[:checked]:bg-hb-blue-soft has-[:checked]:border-hb-blue has-[:checked]:text-hb-primary transition text-[13px] font-semibold text-[var(--mute)]">
                    <input type="checkbox" name="interest" value={v} className="accent-hb-blue" />
                    <span>{v}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label>내용</Label>
              <textarea
                name="message"
                rows={4}
                placeholder="현재 사용 장비, 직원 수, 고민 등을 알려주시면 더 정확한 답변 가능"
                className="w-full px-4 py-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] focus:border-hb-blue focus:ring-2 focus:ring-hb-blue/20 outline-none transition resize-none text-[15px] text-[var(--ink)]"
              />
            </div>
            {alert && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300 rounded-xl px-4 py-3 text-sm font-semibold">
                {alert}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-hb-primary to-hb-blue hover:opacity-95 text-white font-extrabold text-base py-4 rounded-xl shadow-lg transition"
            >
              📨 상담 신청하기
            </button>
            <p className="text-[11px] text-[var(--mute)] text-center leading-relaxed">
              버튼을 누르면 메일 앱이 열립니다. 그대로 보내주시면 됩니다.<br />
              급하신 경우 <a href={site.phone.mainHref} className="text-hb-blue font-bold">{site.phone.main}</a> 으로 직접 연락 주세요.
            </p>
            {submitted && (
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-xl px-4 py-3 text-sm font-semibold text-center">
                ✓ 메일 앱이 열렸습니다. 발송해 주시면 1영업일 내 회신드립니다.
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="block text-sm font-bold text-[var(--ink)] mb-2">{children}</div>;
}

function Field({
  label, name, type = "text", required, placeholder,
}: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] focus:border-hb-blue focus:ring-2 focus:ring-hb-blue/20 outline-none transition text-[15px] text-[var(--ink)]"
      />
    </div>
  );
}
