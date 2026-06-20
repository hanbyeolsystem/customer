import Link from "next/link";
import { quickServices } from "@/data/services";
import { Icon, type IconName } from "@/components/Icon";

// 로고 블루로 통일 — 아이콘은 글리프로 구분, 색은 브랜드 일관성 유지
const iconChip =
  "bg-hb-blue-soft text-hb-blue dark:bg-hb-azure/15 dark:text-hb-blue-light";
const accentMap: Record<string, string> = {
  red: iconChip, blue: iconChip, amber: iconChip,
  indigo: iconChip, emerald: iconChip, violet: iconChip,
};

export function QuickService() {
  return (
    <section className="py-10 lg:py-14 bg-[var(--panel)] border-y border-[var(--line)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-lg lg:text-xl font-extrabold text-[var(--ink)] tracking-tight">
            빠른 서비스 바로가기
          </h2>
          <span className="eyebrow hidden sm:inline-flex">QUICK SERVICE</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
          {quickServices.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="group bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-4 lg:p-5 hover:border-hb-blue hover:shadow-lg hover:-translate-y-0.5 transition text-center"
            >
              <div className={`w-12 h-12 lg:w-14 lg:h-14 mx-auto rounded-xl flex items-center justify-center mb-2.5 group-hover:scale-110 transition ${accentMap[s.accent] ?? accentMap.blue}`}>
                <Icon name={s.icon as IconName} className="w-6 h-6 lg:w-7 lg:h-7" />
              </div>
              <div className="text-[13px] lg:text-sm font-bold text-[var(--ink)]">
                {s.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
