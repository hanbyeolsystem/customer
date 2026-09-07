import Link from "next/link";
import { coreServices } from "@/data/services";
import { SlideHead } from "./SlideHead";

/* 02 하는 일. 아이콘 타일·배지·카드 그림자 없이 선과 글자만으로 네 가지를 나열한다. */
export function CoreServices() {
  return (
    <section id="services" className="hb-slide bg-[var(--bg)] py-16 lg:py-20">
      <div className="max-w-6xl w-full mx-auto px-5 lg:px-8">
        <SlideHead
          no="02"
          kicker="하는 일"
          title={<>NAS부터 복사기까지,<br className="hidden sm:block" /> 한 회사가 봅니다</>}
          lead="장비마다 업체를 따로 부르지 않아도 됩니다. 데이터·백업·전산·출력을 한별시스템 한 곳에서 맡습니다."
        />

        <div className="grid sm:grid-cols-2 border-t border-[var(--line)]">
          {coreServices.map((s) => (
            <article
              key={s.title}
              className="py-6 lg:py-8 border-b border-[var(--line)] sm:odd:pr-10 sm:even:pl-10 sm:even:border-l sm:even:border-[var(--line)]"
            >
              <h3 className="text-[20px] lg:text-[24px] leading-tight text-[var(--ink)] mb-2">
                <Link href={s.href} className="hover:text-hb-blue transition">{s.title}</Link>
              </h3>
              <p className="text-[15px] text-[var(--ink)]/85 leading-relaxed mb-3">{s.summary}</p>
              <p className="text-[13px] lg:text-[14px] text-[var(--mute)] leading-relaxed mb-4">
                {s.items.join(" · ")}
              </p>
              <Link href={s.href} className="text-[14px] font-semibold text-hb-blue underline underline-offset-4 decoration-hb-blue/40 hover:decoration-hb-blue transition">
                {s.cta}
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-6 lg:mt-8 text-[14px] text-[var(--mute)] leading-relaxed">
          사무실 랜 배선 공사부터 공유 폴더 설정까지 같이 합니다.{" "}
          <Link href="/network" className="font-semibold text-hb-blue underline underline-offset-4 decoration-hb-blue/40 hover:decoration-hb-blue">
            네트워크 공사·데이터 백업 구축 보기
          </Link>
        </p>
      </div>
    </section>
  );
}
