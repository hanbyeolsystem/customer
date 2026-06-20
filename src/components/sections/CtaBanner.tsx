import Link from "next/link";
import { site } from "@/data/site";

export function CtaBanner() {
  return (
    <section className="py-16 lg:py-20 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-hb-primary text-white p-10 lg:p-16 text-center shadow-2xl">
          <div className="absolute inset-0 console-grid opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,144,216,0.25),transparent_55%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2.5 font-mono text-[11px] font-semibold tracking-[.18em] text-white/65 mb-6">
              <span className="hb-blink w-2 h-2 rounded-full bg-hb-azure" />
              FREE CONSULTATION — 1영업일 회신
            </div>
            <h2 className="text-2xl lg:text-4xl font-black tracking-tight mb-3 leading-tight">
              지금 시스템 점검, <span className="text-hb-azure">한별</span>과 시작하세요
            </h2>
            <p className="text-sm lg:text-lg text-white/75 mb-9 max-w-2xl mx-auto leading-relaxed">
              NAS·백업·임대 무엇이든 — 현재 환경을 진단하고 맞춤 견적을 무료로 드립니다.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md sm:max-w-none mx-auto">
              <a
                href={site.phone.mainHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-hb-azure-soft text-hb-primary font-extrabold text-base lg:text-lg px-8 py-4 rounded-xl transition shadow-lg"
              >
                전화 상담 {site.phone.main}
              </a>
              <Link
                href="/support/quote"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-base lg:text-lg px-8 py-4 rounded-xl transition border border-white/20"
              >
                상담 신청 <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
