import Link from "next/link";
import { RaidCalculator } from "@/components/RaidCalculator";
import { SlideHead } from "./SlideHead";

/* 04 RAID 계산기 슬라이드(2026-09-08 사장님 "RAID 부분은 남겨줘"). 전체 버전과 참고·FAQ 는 /nas/raid-calculator/ 에. */
export function RaidSlide() {
  return (
    <section id="raid" className="hb-slide bg-[var(--panel)] py-16 lg:py-24">
      <div className="max-w-6xl w-full mx-auto px-5 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 lg:mb-10">
          <SlideHead
            no="04"
            kicker="RAID 계산기"
            title={<>디스크를 넣으면<br className="hidden sm:block" /> 쓸 수 있는 용량이 나옵니다</>}
            lead="용량 칩을 누르면 베이에 들어갑니다. SHR·RAID 5·RAID 6 별로 쓸 수 있는 용량이 막대로 보여요. 용량이 다른 디스크를 섞을 때는 SHR 이 가장 적게 버립니다."
            className="mb-0"
          />
          <Link href="/nas/raid-calculator" className="shrink-0 mb-1 text-[14px] font-semibold text-hb-blue underline underline-offset-4 decoration-hb-blue/40 hover:decoration-hb-blue">
            전체 RAID 종류와 참고 사항
          </Link>
        </div>
        <div data-reveal className="rounded-md bg-[var(--bg)] border border-[var(--line)] p-4 lg:p-8">
          <RaidCalculator compact />
        </div>
      </div>
    </section>
  );
}
