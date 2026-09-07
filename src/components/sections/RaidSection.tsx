import Link from "next/link";
import { RaidCalculator } from "@/components/RaidCalculator";

/* 홈의 RAID 계산기 블록(옅은 회청색 바탕). 전체 버전과 참고 문구는 /nas/raid-calculator/ 에. */
export function RaidSection() {
  return (
    <section id="raid" className="bg-[var(--panel)] py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <h2 className="text-[28px] lg:text-[36px] leading-tight">RAID 계산기</h2>
          <p className="mt-4 text-[16px] lg:text-[18px] font-light leading-relaxed text-[var(--mute)]">
            디스크 몇 개를 어떤 용량으로 넣으면 실제로 얼마를 쓸 수 있는지 미리 계산해 보세요.
            용량이 다른 디스크를 섞을 때는 SHR 이 가장 적게 버립니다.
          </p>
        </div>
        <div className="rounded-2xl bg-[var(--bg)] border border-[var(--line)] p-5 lg:p-8">
          <RaidCalculator compact />
        </div>
        <div className="text-center mt-8">
          <Link href="/nas/raid-calculator" className="text-[15px] font-medium text-hb-blue hover:underline underline-offset-4">
            전체 RAID 종류와 참고 사항 보기 &rsaquo;
          </Link>
          <span className="mx-3 text-[var(--line)]">|</span>
          <Link href="/nas/price" className="text-[15px] font-medium text-hb-blue hover:underline underline-offset-4">
            NAS 구성별 견적 &rsaquo;
          </Link>
        </div>
      </div>
    </section>
  );
}
