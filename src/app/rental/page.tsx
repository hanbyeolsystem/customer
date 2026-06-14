import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "복사기·프린터 임대",
  description: "유지보수·토너 포함 월 정액 임대. 카운터 자동 수집·사전 정비·전국 출동.",
};

export default function RentalPage() {
  return (
    <>
      <PageHeader
        badge="RENTAL CARE"
        title="복사기 · 프린터 임대 케어"
        description="유지보수·토너·정기점검 모두 포함. 비포서비스(BEFORE SERVICE) — 문제가 생기기 전에 한별이 먼저 갑니다."
      />
      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 grid sm:grid-cols-2 gap-4 lg:gap-5">
          {[
            { icon: "📊", title: "카운터 자동 수집", body: "원격에서 출력량을 실시간 파악, 토너·드럼 사전 교체." },
            { icon: "🛠", title: "유지보수 풀패키지", body: "월 정액에 출장·부품·소모품 모두 포함." },
            { icon: "🚚", title: "전국 당일 출동",   body: "대구·경북은 당일, 전국은 1영업일 내 대응." },
            { icon: "📋", title: "분기별 정기점검",  body: "예방정비로 평균 다운타임 90% 감소." },
          ].map((c) => (
            <div key={c.title} className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6">
              <div className="text-3xl mb-2">{c.icon}</div>
              <h3 className="font-extrabold text-[var(--ink)] mb-1.5">{c.title}</h3>
              <p className="text-sm text-[var(--mute)] leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
        <div className="max-w-5xl mx-auto px-4 lg:px-6 mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop" className="inline-flex items-center justify-center gap-2 bg-hb-blue text-white font-extrabold px-6 py-3.5 rounded-xl">임대 쇼핑몰 보기 →</Link>
          <Link href="/support/quote" className="inline-flex items-center justify-center gap-2 border border-[var(--line)] text-[var(--ink)] font-bold px-6 py-3.5 rounded-xl hover:bg-[var(--panel)]">견적 요청</Link>
        </div>
      </section>
    </>
  );
}
