import Image from "next/image";
import Link from "next/link";
import { coreServices } from "@/data/services";

/* "데이터 관리 강화" 형식(시놀로지 홈): 가운데 제목·설명 + 사진 카드 4장, 사진 아래 가운데 라벨.
   문구는 services.ts 그대로, 사진은 실제 현장 사진. */
const photo: Record<string, string> = {
  "NAS 판매·구축 및 관리": "/cases/andong-hospital-nas-1.webp",
  "데이터 백업 솔루션": "/hero/server-rack.webp",
  "기업 IT 유지관리": "/cases/daegu-lan-wiring-1.webp",
  "복사기 · 프린터 임대": "/cases/bukgu-office-vfm251ci-1.webp",
};

export function CoreServices() {
  return (
    <section id="services" className="bg-[var(--bg)] py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-14">
          <h2 className="text-[28px] lg:text-[36px] leading-tight">기업 데이터 관리, 한 회사에서</h2>
          <p className="mt-4 text-[16px] lg:text-[18px] font-light leading-relaxed text-[var(--mute)]">
            NAS 구축과 백업, 사내 AI 도입, 복합기 임대, 전산 유지관리까지. 장비마다 업체를 따로 부르지 않아도 됩니다.
            대구·경북 170여 개 기업이 19년째 한별시스템에 맡기고 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {coreServices.map((s) => (
            <Link key={s.title} href={s.href} className="group block text-center">
              <div className="relative aspect-[3/2] rounded-lg overflow-hidden bg-[var(--panel)]">
                <Image
                  src={photo[s.title] ?? "/hero/server-rack.webp"}
                  alt={s.title}
                  fill
                  sizes="(min-width:1024px) 25vw, 50vw"
                  className="object-cover group-hover:scale-[1.03] transition duration-500"
                />
              </div>
              <h3 className="mt-4 text-[17px] lg:text-[19px] font-bold text-[var(--ink)] group-hover:text-hb-blue transition">{s.title}</h3>
              <p className="mt-1 text-[13px] lg:text-[14px] text-[var(--mute)] hidden sm:block">{s.summary}</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10 lg:mt-12">
          <Link href="/network" className="text-[15px] font-medium text-hb-blue hover:underline underline-offset-4">
            네트워크 공사·데이터 백업 구축도 함께 합니다 &rsaquo;
          </Link>
        </div>
      </div>
    </section>
  );
}
