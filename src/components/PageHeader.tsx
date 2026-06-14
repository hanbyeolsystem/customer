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
        {badge && (
          <div className="text-[11px] font-extrabold text-hb-blue-light tracking-[.2em] mb-2">
            {badge}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm lg:text-base text-white/75 mt-3 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
