import Link from "next/link";
import { quickServices } from "@/data/services";
import { embedHref } from "@/lib/embed";
import { Icon, type IconName } from "@/components/Icon";

/* 지원 바로가기: 시놀로지 푸터 위 아이콘 줄 형식(검정 원 안 흰 선 아이콘 + 라벨, 가운데 정렬). 홈 본문에도 한 번 둔다. */
const links: { icon: IconName; label: string; href: string }[] = [
  ...quickServices.map((s) => ({ icon: s.icon as IconName, label: s.label, href: s.href as string })),
  { icon: "search", label: "에러코드 검색", href: embedHref("https://hanbyeolsystem.github.io/hanbyeol-errorcode/", "에러코드 검색") },
];

export function QuickService({ title = "지원" }: { title?: string }) {
  return (
    <section id="support" className="bg-[var(--bg)] py-14 lg:py-20 border-t border-[var(--line)]">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-6">
        {title && <h2 className="text-center text-[24px] lg:text-[30px] leading-tight mb-8 lg:mb-10">{title}</h2>}
        <ul className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-y-8 gap-x-3">
          {links.map((l) => (
            <li key={l.label} className="text-center">
              <Link href={l.href} className="group inline-flex flex-col items-center gap-3">
                <span className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-hb-primary text-white flex items-center justify-center group-hover:bg-hb-blue transition">
                  <Icon name={l.icon} className="w-6 h-6 lg:w-7 lg:h-7" strokeWidth={1.6} />
                </span>
                <span className="text-[13px] lg:text-[14px] font-medium text-[var(--ink)] group-hover:text-hb-blue transition">{l.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
