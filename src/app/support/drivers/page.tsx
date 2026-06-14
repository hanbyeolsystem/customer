import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { embedHref } from "@/lib/embed";

export const metadata: Metadata = {
  title: "드라이버 다운로드",
  description: "한별드라이브 (882.kr) 와 제조사 공식 지원 페이지에서 프린터 드라이버를 받을 수 있습니다.",
};

const HANBYEOL_DRIVE = "https://882.kr/";

const brands = [
  { name: "교세라",  en: "Kyocera",  url: "https://www.kyoceradocumentsolutions.com/kr/download/index_ko.html" },
  { name: "브라더",  en: "Brother",  url: "https://www.brother-korea.com/ko-kr/support" },
  { name: "엡손",    en: "EPSON",    url: "https://www.epson.co.kr/%EA%B3%A0%EA%B0%9D%EC%A7%80%EC%9B%90/%ED%94%84%EB%A6%B0%ED%84%B0/sh/s01" },
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
          <Link
            href={embedHref(HANBYEOL_DRIVE, "한별드라이브")}
            className="group relative overflow-hidden block bg-gradient-to-br from-hb-primary via-hb-blue to-hb-blue-light text-white rounded-2xl p-5 lg:p-6 shadow-xl hover:shadow-[0_16px_40px_-12px_rgba(37,99,235,0.55)] hover:-translate-y-0.5 transition mb-6"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="relative flex items-center gap-4">
              <div className="text-3xl lg:text-4xl flex-shrink-0">⬇</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-extrabold tracking-[.18em] text-white/80 mb-0.5">
                  한별 추천
                </div>
                <h2 className="text-lg lg:text-xl font-black leading-tight">
                  한별드라이브
                </h2>
                <p className="text-[12px] lg:text-sm text-white/80 mt-0.5">
                  한별 통합 드라이버 다운로드 센터
                </p>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1 bg-white text-hb-primary font-extrabold text-sm px-4 py-2 rounded-lg shadow group-hover:bg-amber-50 transition flex-shrink-0">
                한별드라이브 바로가기 →
              </div>
              <div className="sm:hidden text-2xl flex-shrink-0 group-hover:translate-x-1 transition">→</div>
            </div>
          </Link>

          {/* 2) 제조사 공식 사이트 */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-4 mb-5 text-sm text-[var(--mute)] leading-relaxed">
            💡 한별드라이브에서 못 찾으셨다면 아래 제조사 공식 페이지에서 모델명으로 검색하세요. 모델명을 모르시면 한별로 연락 주시면 함께 찾아드립니다.
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
            {brands.map((b) => (
              <Link
                key={b.en}
                href={embedHref(b.url, `${b.name} ${b.en}`)}
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
                  공식 사이트 →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
