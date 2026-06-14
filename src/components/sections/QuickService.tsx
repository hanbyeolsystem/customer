import Link from "next/link";
import { quickServices } from "@/data/services";

const accentMap: Record<string, string> = {
  red:     "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300",
  blue:    "bg-blue-50 text-hb-blue dark:bg-blue-500/10 dark:text-hb-blue-light",
  amber:   "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
  indigo:  "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  violet:  "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
};

export function QuickService() {
  return (
    <section className="py-10 lg:py-14 bg-[var(--panel)] border-y border-[var(--line)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-lg lg:text-xl font-extrabold text-[var(--ink)] tracking-tight">
            빠른 서비스 바로가기
          </h2>
          <span className="text-[11px] font-bold text-[var(--mute)] tracking-[.15em] hidden sm:inline">
            QUICK SERVICE
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
          {quickServices.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="group bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-4 lg:p-5 hover:border-hb-blue hover:shadow-lg hover:-translate-y-0.5 transition text-center"
            >
              <div className={`w-12 h-12 lg:w-14 lg:h-14 mx-auto rounded-xl flex items-center justify-center text-2xl lg:text-3xl mb-2.5 group-hover:scale-110 transition ${accentMap[s.accent] ?? accentMap.blue}`}>
                {s.icon}
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
