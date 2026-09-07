import Image from "next/image";
import Link from "next/link";
import { SlideHead } from "./SlideHead";

/* 03 사내 AI. 포지셔닝의 핵심 슬라이드.
   숫자는 전부 /ai/ 페이지와 같은 실측값(2026-08-03 부터 자사 NAS 에서 운영 중). 추측으로 바꾸지 말 것. */
const facts = [
  ["운영 시작", "2026년 8월 3일"],
  ["장비", "Ryzen V1500B · RAM 4GB NAS 한 대"],
  ["답변 시간", "질문당 7~60초"],
  ["생성 속도", "초당 11~12 토큰"],
  ["상주 메모리", "약 2.1GB"],
] as const;

export function AiSlide() {
  return (
    <section id="ai" className="hb-slide bg-hb-primary text-white py-16 lg:py-20">
      <div className="max-w-6xl w-full mx-auto px-5 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className="lg:col-span-7">
          <SlideHead
            no="03"
            kicker="사내 AI"
            dark
            title={<>파는 물건을<br />저희가 먼저 씁니다</>}
            lead="자사 NAS 한 대에 로컬 LLM 컨테이너를 올려 사내 관리 데이터를 묻고 답하는 AI 도우미를 돌리고 있습니다. 잘 되는 것과 아직 안 되는 것을 그대로 적어 두었습니다."
            className="mb-8"
          />

          <dl className="border-t border-white/20">
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[7.5rem_1fr] lg:grid-cols-[9rem_1fr] gap-4 py-3.5 border-b border-white/12 text-[15px]">
                <dt className="text-white/55">{k}</dt>
                <dd className="text-white/90">{v}</dd>
              </div>
            ))}
          </dl>

          <Link
            href="/ai"
            className="mt-8 inline-flex items-center justify-center h-12 px-6 rounded-md bg-white text-hb-primary font-bold text-[15px] hover:bg-white/90 transition"
          >
            사내 AI 도입 실측 보기
          </Link>
        </div>

        <figure className="lg:col-span-5">
          <div className="relative aspect-[4/3] lg:aspect-[4/5] overflow-hidden rounded-md">
            <Image
              src="/hero/server-rack.webp"
              alt="한별시스템이 구축한 서버랙과 랙마운트 NAS"
              fill
              sizes="(min-width:1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 text-[12px] lg:text-[13px] text-white/50">
            한별시스템이 구축한 랙마운트 NAS
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
