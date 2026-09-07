import Link from "next/link";
import { site } from "@/data/site";
import { Icon } from "./Icon";

/* 모바일 하단 고정 바(전화·원격지원·견적). 손님 대부분이 폰으로 들어오고, 원하는 것은 이 셋이다.
   lg 이상에서는 숨긴다. 높이 3.5rem + 홈 인디케이터 여백(safe-area). ChatWidget 버튼은 이 바 위로 올려 둔다. */
export function MobileBar() {
  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-3 h-14 text-[13px] font-semibold text-[var(--ink)]">
        <a href={site.phone.mainHref} className="flex items-center justify-center gap-1.5 active:bg-[var(--panel)]">
          <Icon name="phone" className="w-[18px] h-[18px]" strokeWidth={1.8} /> 전화
        </a>
        <Link href="/support/remote" className="flex items-center justify-center gap-1.5 border-x border-[var(--line)] active:bg-[var(--panel)]">
          <Icon name="monitor" className="w-[18px] h-[18px]" strokeWidth={1.8} /> 원격지원
        </Link>
        <Link href="/support/quote" className="flex items-center justify-center gap-1.5 active:bg-[var(--panel)]">
          <Icon name="clipboard" className="w-[18px] h-[18px]" strokeWidth={1.8} /> 견적
        </Link>
      </div>
    </div>
  );
}
