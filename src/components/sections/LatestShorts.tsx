import Link from "next/link";
import { shortFallbackThumb, shorts, type Short } from "@/lib/shorts";

/* 쇼츠 카드. /shorts/ 목록과 홈 08 소식 칸이 같이 쓴다. 값은 lib/shorts.ts 가 거른 것만 온다. */
export function ShortCard({ s, chips = false }: { s: Short; chips?: boolean }) {
  return (
    <Link href={`/shorts/${s.slug}/`} className="group flex flex-col border border-[var(--line)] rounded-md overflow-hidden bg-[var(--bg)] hover:border-[var(--ink)] transition">
      <div className="aspect-[1200/630] bg-[var(--panel)] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.thumb || shortFallbackThumb} alt="" width={1200} height={630} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <time dateTime={s.date} className="text-[12px] text-[var(--mute)] tabular-nums">{s.date.replace(/-/g, ".")}</time>
        <h3 className="font-sans text-[15px] font-bold leading-snug text-[var(--ink)] group-hover:text-hb-blue transition line-clamp-2">{s.title}</h3>
        {chips && s.keywords.length > 0 && (
          <ul className="mt-auto pt-1 flex flex-wrap gap-1.5">
            {s.keywords.slice(0, 4).map((k) => (
              <li key={k} className="text-[12px] text-[var(--mute)] border border-[var(--line)] rounded-md px-2 py-0.5">{k}</li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}

/* 홈 08 소식 칸 안의 "최근 영상" 줄. 글이 없으면 아무것도 그리지 않는다. */
export function LatestShorts() {
  if (!shorts.length) return null;
  return (
    <div data-reveal className="mt-14 lg:mt-16">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="font-sans text-[13px] font-semibold tracking-[.12em] text-[var(--mute)]">최근 영상 가이드</h3>
        <Link href="/shorts/" className="text-[13px] font-semibold text-hb-blue underline underline-offset-4 decoration-hb-blue/40 hover:decoration-hb-blue">
          전체 보기
        </Link>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {shorts.slice(0, 3).map((s) => (
          <ShortCard key={s.slug} s={s} />
        ))}
      </div>
    </div>
  );
}
