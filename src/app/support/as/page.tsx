"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/data/site";
import { sendContact } from "@/lib/contact";

export default function AsPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [alert, setAlert] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const company = String(fd.get("company") ?? "").trim();
    const name    = String(fd.get("name") ?? "").trim();
    const phone   = String(fd.get("phone") ?? "").trim();
    const product = String(fd.get("product") ?? "").trim();
    const symptom = String(fd.get("symptom") ?? "").trim();
    const detail  = String(fd.get("detail") ?? "").trim();
    if (!company || !name || !phone) {
      setAlert("회사명·담당자·연락처는 필수입니다.");
      return;
    }

    setAlert(null);
    setStatus("sending");
    const ok = await sendContact("AS접수", [
      { label: "회사명", value: company },
      { label: "담당자", value: name },
      { label: "연락처", value: phone },
      { label: "제품명", value: product || "(미입력)" },
      { label: "증상", value: symptom || "(미입력)" },
      { label: "상세 내용", value: detail || "(없음)" },
    ]);
    setStatus(ok ? "done" : "error");
  }

  if (status === "done") {
    return (
      <>
        <PageHeader badge="AS REQUEST" title="AS 접수" description="제품과 증상을 알려주시면 한별 엔지니어가 1영업일 내 회신드립니다." />
        <section className="py-16 lg:py-24 bg-[var(--bg)]">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-3xl mb-5">✓</div>
            <h2 className="text-xl font-black text-[var(--ink)] mb-2">AS 접수가 완료되었습니다</h2>
            <p className="text-sm text-[var(--mute)] leading-relaxed mb-6">
              엔지니어가 확인 후 1영업일 내 연락드립니다.<br />급하신 경우 아래로 바로 연락 주세요.
            </p>
            <a href={site.phone.mainHref} className="inline-flex items-center gap-2 bg-gradient-to-r from-hb-primary to-hb-blue text-white font-extrabold px-7 py-3.5 rounded-xl shadow-lg">
              전화 접수 {site.phone.main}
            </a>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader badge="AS REQUEST" title="AS 접수" description="제품과 증상을 알려주시면 한별 엔지니어가 1영업일 내 회신드립니다." />
      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-2xl mx-auto px-4 lg:px-6">
          <form onSubmit={onSubmit} className="bg-[var(--panel)] border border-[var(--line)] rounded-3xl p-6 lg:p-9 space-y-4">
            {[
              ["company", "회사명", "(주)한별시스템", true],
              ["name", "담당자 성함", "홍길동", true],
              ["phone", "연락처", "010-1234-5678", true, "tel"],
              ["product", "제품명", "예) TASKalfa 1801"],
              ["symptom", "증상 (한 줄)", "예) 출력 시 검은 줄"],
            ].map(([n, l, p, r, t]) => (
              <div key={String(n)}>
                <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">
                  {l as string} {r ? <span className="text-red-600">*</span> : null}
                </label>
                <input
                  name={String(n)} type={String(t ?? "text")} required={Boolean(r)} placeholder={String(p)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] focus:border-hb-blue focus:ring-2 focus:ring-hb-blue/20 outline-none transition text-[15px] text-[var(--ink)]"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-bold text-[var(--ink)] mb-1.5">상세 내용</label>
              <textarea name="detail" rows={4} className="w-full px-4 py-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] focus:border-hb-blue focus:ring-2 focus:ring-hb-blue/20 outline-none transition resize-none text-[15px] text-[var(--ink)]" />
            </div>
            {alert && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300 rounded-xl px-4 py-3 text-sm font-semibold">
                {alert}
              </div>
            )}
            {status === "error" && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300 rounded-xl px-4 py-3 text-sm font-semibold">
                전송에 실패했습니다. 잠시 후 다시 시도하시거나{" "}
                <a href={site.phone.mainHref} className="underline font-bold">{site.phone.main}</a> 으로 연락 주세요.
              </div>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-gradient-to-r from-hb-primary to-hb-blue hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold text-base py-4 rounded-xl shadow-lg transition"
            >
              {status === "sending" ? "전송 중…" : "🛠 AS 접수하기"}
            </button>
            <p className="text-[11px] text-[var(--mute)] text-center">
              버튼을 누르면 담당자에게 즉시 접수됩니다. 급하면{" "}
              <a href={site.phone.mainHref} className="text-hb-blue font-bold">{site.phone.main}</a>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
