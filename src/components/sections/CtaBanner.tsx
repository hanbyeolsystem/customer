import Link from "next/link";
import { site } from "@/data/site";

export function CtaBanner() {
  return (
    <section className="py-16 lg:py-20 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="relative overflow-hidden rounded-md bg-hb-primary text-white p-10 lg:p-16 text-center">
          <div className="relative">
            <div className="text-[12px] font-semibold tracking-[.12em] text-white/60 mb-6">
              무료 상담 · 1영업일 안에 회신
            </div>
            <h2 className="text-[28px] lg:text-[44px] tracking-[-0.01em] mb-3 leading-tight">
              우리 사무실 백업, <span className="text-hb-blue-light">진짜</span> 돌고 있나요?
            </h2>
            <p className="text-sm lg:text-lg text-white/75 mb-9 max-w-2xl mx-auto leading-relaxed">
              방문해서 보고 견적을 냅니다. 대구·경북은 당일, 비용은 없습니다.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md sm:max-w-none mx-auto">
              <a
                href={site.phone.mainHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-hb-primary font-bold text-base lg:text-lg px-8 py-4 rounded-md transition"
              >
                전화 상담 {site.phone.main}
              </a>
              <Link
                href="/support/quote"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 hover:bg-white/10 text-white font-semibold text-base lg:text-lg px-8 py-4 rounded-md transition border border-white/40"
              >
                방문 견적 신청
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
