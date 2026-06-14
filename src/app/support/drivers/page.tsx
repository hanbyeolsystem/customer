import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "드라이버 다운로드",
  description: "한별드라이브 (882.kr) 와 제조사 공식 지원 페이지에서 프린터 드라이버를 받을 수 있습니다.",
};

const HANBYEOL_DRIVE = "https://882.kr/";

const brands = [
  { name: "교세라",  en: "Kyocera",  url: "https://www.kyoceradocumentsolutions.com/kr/ko/support-and-download/" },
  { name: "브라더",  en: "Brother",  url: "https://www.brother-korea.com/ko-kr/support" },
  { name: "엡손",    en: "EPSON",    url: "https://www.epson.co.kr/support/" },
  { name: "HP",      en: "HP",       url: "https://support.hp.com/kr-ko/drivers" },
  { name: "삼성",    en: "Samsung",  url: "https://www.samsung.com/sec/support/" },
];

export default function DriversPage() {
  return (
    <>
      <PageHeader
        badge="DRIVERS"
        title="드라이버 다운로드"
        description="한별드라이브가 가장 빠른 방법입니다. 제조사 공식 페이지에서도 받으실 수 있습니다."
      />
      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          {/* 1) 한별드라이브 — 메인 다운로드 채널 */}
          <a
            href={HANBYEOL_DRIVE}
            target="_blank"
            rel="noopener"
            className="group relative overflow-hidden block bg-gradient-to-br from-hb-primary via-hb-blue to-hb-blue-light text-white rounded-3xl p-8 lg:p-12 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(37,99,235,0.6)] hover:-translate-y-1 transition mb-10"
          >
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full text-[11px] font-extrabold tracking-[.18em] mb-4">
                <span className="w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse" />
                한별 추천 · 가장 빠른 방법
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="text-5xl lg:text-6xl">⬇</div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-black leading-tight">
                    한별드라이브
                  </h2>
                  <p className="text-sm lg:text-base text-white/85 mt-1">
                    한별시스템 통합 드라이버 다운로드 센터
                  </p>
                </div>
              </div>
              <p className="text-sm lg:text-base text-white/80 leading-relaxed mb-6 max-w-xl">
                한별이 직접 큐레이션한 드라이버 모음입니다. 모델별 정리된 파일을 바로 받으실 수 있습니다.
              </p>
              <div className="inline-flex items-center gap-2 bg-white text-hb-primary font-extrabold text-base lg:text-lg px-6 py-3.5 rounded-xl shadow-lg group-hover:bg-amber-50 transition">
                882.kr 바로가기 ↗
              </div>
            </div>
          </a>

          {/* 2) 제조사 공식 사이트 */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-4 mb-5 text-sm text-[var(--mute)] leading-relaxed">
            💡 한별드라이브에서 못 찾으셨다면 아래 제조사 공식 페이지에서 모델명으로 검색하세요. 모델명을 모르시면 한별로 연락 주시면 함께 찾아드립니다.
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
            {brands.map((b) => (
              <a
                key={b.en}
                href={b.url}
                target="_blank"
                rel="noopener"
                className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-5 lg:p-6 text-center hover:border-hb-blue hover:shadow-lg hover:-translate-y-0.5 transition"
              >
                <div className="text-3xl mb-2.5">🖨</div>
                <div className="font-extrabold text-[var(--ink)] text-base lg:text-lg leading-tight">
                  {b.name}
                </div>
                <div className="text-[11px] font-bold text-[var(--mute)] tracking-[.15em] mt-0.5">
                  {b.en}
                </div>
                <div className="text-[11px] font-bold text-hb-blue mt-3">
                  공식 사이트 ↗
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
