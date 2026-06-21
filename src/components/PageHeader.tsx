import Link from "next/link";

export function PageHeader({
  badge,
  title,
  description,
  back = "/",
  backLabel = "메인으로",
}: {
  badge?: string;
  title: string;
  description?: string;
  back?: string;
  backLabel?: string;
}) {
  return (
    <section className="bg-hb-primary text-white py-12 lg:py-16 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <Link
          href={back}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white mb-4 transition"
        >
          ← {backLabel}
        </Link>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
          {title}
        </h1>
        {badge && (
          <div className="mt-2.5 font-mono text-[11px] font-semibold text-hb-blue-light/75 tracking-[.2em]">
            {badge}
          </div>
        )}
        {description && (
          <p className="text-base lg:text-lg text-white/80 mt-4 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
