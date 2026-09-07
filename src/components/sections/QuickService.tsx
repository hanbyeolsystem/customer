import Link from "next/link";
import { quickServices } from "@/data/services";
import { site } from "@/data/site";
import { embedHref } from "@/lib/embed";
import { Icon, type IconName } from "@/components/Icon";
import { SlideHead } from "./SlideHead";

/* 06 지원. 기존 고객이 홈에서 가장 많이 누르는 것들. 모바일은 손가락 크기의 줄, 데스크탑은 선 격자. */
const links: { icon: IconName; label: string; href: string }[] = [
  ...quickServices.map((s) => ({ icon: s.icon as IconName, label: s.label, href: s.href as string })),
  { icon: "search", label: "에러코드 검색", href: embedHref("https://hanbyeolsystem.github.io/hanbyeol-errorcode/", "에러코드 검색") },
];
const notes: Record<string, string> = {
  "원격지원": "엔지니어가 화면을 보며 바로 해결",
  "드라이버 다운로드": "복합기·프린터 드라이버, 딸깍 설치",
  "AS 접수": "출장·점검 접수",
  "NAS 기술지원": "시놀로지 NAS 장애·설정",
  "임대쇼핑몰": "복합기·프린터 월 요금",
  "견적 요청": "무료 방문 견적",
  "에러코드 검색": "프린터 에러코드 원인과 조치",
};

export function QuickService() {
  return (
    <section id="support" className="hb-slide bg-[var(--panel)] py-16 lg:py-20">
      <div className="max-w-6xl w-full mx-auto px-5 lg:px-8">
        <SlideHead
          no="06"
          kicker="지원"
          title="지금 바로 필요한 것"
          lead="이미 쓰고 계신 분들을 위한 창구입니다. 평일 09:00~18:00, 급하면 전화가 가장 빠릅니다."
        />
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 hb-grid-lines border border-[var(--line)]">
          {links.map((l) => (
            <li key={l.label} className="!bg-[var(--bg)]">
              <Link
                href={l.href}
                className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-5 p-4 lg:p-6 min-h-14 hover:bg-[var(--bg)]/60 transition group"
              >
                <Icon name={l.icon} className="w-6 h-6 lg:w-7 lg:h-7 shrink-0 text-[var(--ink)]" strokeWidth={1.5} />
                <span className="flex-1 min-w-0">
                  <span className="block text-[16px] lg:text-[17px] font-semibold text-[var(--ink)] group-hover:text-hb-blue transition">{l.label}</span>
                  <span className="block text-[13px] text-[var(--mute)] mt-0.5">{notes[l.label]}</span>
                </span>
                <span aria-hidden className="lg:hidden text-[var(--mute)]">›</span>
              </Link>
            </li>
          ))}
          <li className="!bg-[var(--bg)]">
            <a href={site.phone.mainHref} className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-5 p-4 lg:p-6 min-h-14 hover:bg-[var(--bg)]/60 transition group">
              <Icon name="phone" className="w-6 h-6 lg:w-7 lg:h-7 shrink-0 text-[var(--ink)]" strokeWidth={1.5} />
              <span className="flex-1 min-w-0">
                <span className="block text-[16px] lg:text-[17px] font-semibold text-[var(--ink)] group-hover:text-hb-blue transition">전화 {site.phone.main}</span>
                <span className="block text-[13px] text-[var(--mute)] mt-0.5">{site.phone.hours}</span>
              </span>
              <span aria-hidden className="lg:hidden text-[var(--mute)]">›</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
