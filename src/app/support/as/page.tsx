"use client";

import { PageHeader } from "@/components/PageHeader";
import { site } from "@/data/site";

export default function AsPage() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const company = String(fd.get("company") ?? "").trim();
    const name    = String(fd.get("name") ?? "").trim();
    const phone   = String(fd.get("phone") ?? "").trim();
    const product = String(fd.get("product") ?? "").trim();
    const symptom = String(fd.get("symptom") ?? "").trim();
    const detail  = String(fd.get("detail") ?? "").trim();
    if (!company || !name || !phone) {
      alert("회사명·담당자·연락처는 필수입니다.");
      return;
    }
    const subject = `[AS 접수] ${company} / ${name} (${phone})`;
    const body =
      `[한별시스템 AS 접수]\n────────────────\n\n` +
      `• 회사명: ${company}\n• 담당자: ${name}\n• 연락처: ${phone}\n` +
      `• 제품명: ${product || "(미입력)"}\n• 증상: ${symptom || "(미입력)"}\n\n` +
      `─ 상세 내용 ─\n${detail || "(없음)"}\n`;
    window.location.href =
      `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
            <button type="submit" className="w-full bg-gradient-to-r from-hb-primary to-hb-blue text-white font-extrabold text-base py-4 rounded-xl shadow-lg">
              🛠 AS 접수하기
            </button>
            <p className="text-[11px] text-[var(--mute)] text-center">
              메일 앱이 열립니다. 급하면 <a href={site.phone.mainHref} className="text-hb-blue font-bold">{site.phone.main}</a>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
