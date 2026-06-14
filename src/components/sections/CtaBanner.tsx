import Link from "next/link";
import { site } from "@/data/site";

export function CtaBanner() {
  return (
    <section className="py-16 lg:py-20 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-hb-primary via-hb-blue to-hb-blue-light text-white p-10 lg:p-16 text-center shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_55%)]" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[.15em] mb-5">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              FREE CONSULTATION
            </div>
            <h2 className="text-2xl lg:text-4xl font-black tracking-tight mb-3 leading-tight">
              지금 바로 전문가와 상담하세요
            </h2>
            <p className="text-sm lg:text-lg text-white/85 mb-9 max-w-2xl mx-auto leading-relaxed">
              맞춤 솔루션 견적을 <strong className="text-white">무료</strong>로 받아보세요.<br className="sm:hidden" />
              한별 컨설턴트가 1영업일 내 회신드립니다.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md sm:max-w-none mx-auto">
              <a
                href={site.phone.mainHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-hb-primary hover:bg-hb-blue-soft font-extrabold text-base lg:text-lg px-8 py-4 rounded-xl transition shadow-lg"
              >
                📞 전화 상담 {site.phone.main}
              </a>
              <Link
                href="/support/quote"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-hb-primary hover:bg-slate-900 text-white font-bold text-base lg:text-lg px-8 py-4 rounded-xl transition border border-white/15"
              >
                📋 상담 신청 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
