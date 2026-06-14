import Link from "next/link";
import { site } from "@/data/site";

export function ComingSoon({
  title,
  note,
}: {
  title: string;
  note?: string;
}) {
  return (
    <section className="py-20 lg:py-32 bg-[var(--bg)]">
      <div className="max-w-2xl mx-auto px-4 lg:px-6 text-center">
        <div className="text-6xl mb-5">🚧</div>
        <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-3">
          {title}
        </h2>
        <p className="text-sm lg:text-base text-[var(--mute)] mb-8 leading-relaxed">
          {note ?? "곧 만나보실 수 있습니다. 빠른 문의는 전화로 연결됩니다."}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm sm:max-w-none mx-auto">
          <a
            href={site.phone.mainHref}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-hb-blue hover:bg-hb-blue-light text-white font-extrabold text-sm px-6 py-3 rounded-xl transition"
          >
            📞 {site.phone.main}
          </a>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--panel)] font-bold text-sm px-6 py-3 rounded-xl transition"
          >
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </section>
  );
}
