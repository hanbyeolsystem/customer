import Link from "next/link";
import { coreServices } from "@/data/services";
import { Icon, type IconName } from "@/components/Icon";

// 로고 블루 패밀리로 통일 (slate는 중립 톤으로 변화감만 유지)
const colorMap: Record<string, { icon: string; badge: string; cta: string }> = {
  blue:   { icon: "bg-hb-blue-soft text-hb-blue dark:bg-hb-azure/15 dark:text-hb-blue-light",
            badge: "bg-hb-blue/10 text-hb-blue dark:bg-hb-blue/20 dark:text-hb-blue-light",
            cta: "bg-hb-primary hover:bg-hb-blue text-white" },
  indigo: { icon: "bg-hb-azure-soft text-hb-blue dark:bg-hb-azure/15 dark:text-hb-blue-light",
            badge: "bg-hb-azure/12 text-hb-blue dark:bg-hb-azure/20 dark:text-hb-azure-2",
            cta: "bg-hb-blue hover:bg-hb-azure text-white" },
  slate:  { icon: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-200",
            badge: "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-200",
            cta: "bg-hb-primary hover:bg-hb-primary-2 text-white" },
  amber:  { icon: "bg-hb-azure-soft text-hb-blue dark:bg-hb-azure/15 dark:text-hb-blue-light",
            badge: "bg-hb-azure/12 text-hb-blue dark:bg-hb-azure/20 dark:text-hb-azure-2",
            cta: "bg-hb-blue hover:bg-hb-azure text-white" },
};

export function CoreServices() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="text-center mb-12 lg:mb-16">
          <div className="eyebrow justify-center mb-3">CORE SERVICES</div>
          <h2 className="text-2xl lg:text-4xl font-extrabold text-[var(--ink)] tracking-tight">
            한별시스템 핵심 서비스
          </h2>
          <p className="text-sm lg:text-base text-[var(--mute)] mt-3 max-w-2xl mx-auto">
            기업의 생산성과 효율성을 높이는 통합 IT 솔루션
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {coreServices.map((s) => {
            const c = colorMap[s.color] ?? colorMap.blue;
            return (
              <article
                key={s.title}
                className="bg-[var(--bg)] border border-[var(--line)] rounded-3xl p-6 lg:p-7 hover:shadow-xl hover:-translate-y-1 hover:border-hb-blue transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${c.icon}`}>
                    <Icon name={s.icon as IconName} className="w-7 h-7" />
                  </div>
                  <span className={`text-[10px] font-extrabold tracking-[.18em] px-2 py-1 rounded-full ${c.badge}`}>
                    {s.badge}
                  </span>
                </div>
                <h3 className="text-lg lg:text-xl font-extrabold text-[var(--ink)] tracking-tight mb-1.5">
                  {s.title}
                </h3>
                <p className="text-sm text-[var(--mute)] mb-4 leading-relaxed">
                  {s.summary}
                </p>
                <ul className="space-y-1.5 mb-6 flex-1">
                  {s.items.map((it) => (
                    <li key={it} className="text-[13px] text-[var(--ink)]/80 flex items-start gap-2">
                      <span className="text-hb-blue flex-shrink-0 mt-0.5">✓</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={s.href}
                  className={`inline-flex items-center justify-center gap-1.5 font-bold text-sm px-4 py-2.5 rounded-xl transition ${c.cta}`}
                >
                  {s.cta} →
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
