import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { quickServices } from "@/data/services";

export const metadata = { title: "고객 지원" };

export default function SupportHub() {
  return (
    <>
      <PageHeader
        badge="CUSTOMER SUPPORT"
        title="고객 지원 센터"
        description="원격지원·드라이버·AS·견적까지 — 필요한 도움을 한 곳에서."
      />
      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {quickServices.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 hover:border-hb-blue hover:shadow-lg hover:-translate-y-0.5 transition"
              >
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-extrabold text-[var(--ink)] text-lg mb-1">{s.label}</h3>
                <div className="text-[12px] font-bold text-hb-blue">바로가기 →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
