import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { embedHref } from "@/lib/embed";

export const metadata: Metadata = {
  title: "프린터 드라이버 다운로드",
  description: "복합기·프린터 드라이버를 기종만 고르면 자동으로 설치해 주는 딸깍P드라이버를 한별 드라이버 센터(882.kr)에서 무료로 받을 수 있습니다. 제조사 공식 지원 페이지 링크도 함께 정리했습니다.",
  alternates: { canonical: "/support/drivers/" },
};

const HANBYEOL_DRIVE = "https://882.kr/?embed=1"; // 새 882 (2026-08-17 재구축): embed=1 → 882 자체 상단바 숨김(홈페이지 헤더 안 이중 표시 방지)
// 딸깍P드라이버 설치기 직접 다운로드 (882 파일배포, 한글 파일명 percent-encoding 고정값)
const DDALKKAK_P_DRIVER = "https://882.kr/?code=%EB%94%B8%EA%B9%8DP%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B2%84.exe";

const brands = [
  { name: "교세라",  en: "Kyocera",  url: "https://www.kyoceradocumentsolutions.com/kr/download/index_ko.html" },
  { name: "브라더",  en: "Brother",  url: "https://www.brother-korea.com/ko-kr/support" },
  { name: "엡손",    en: "EPSON",    url: "https://www.epson.co.kr/%EA%B3%A0%EA%B0%9D%EC%A7%80%EC%9B%90/%ED%94%84%EB%A6%B0%ED%84%B0/sh/s01" },
  { name: "HP",      en: "HP",       url: "https://support.hp.com/kr-ko/drivers/printers" },
  { name: "삼성",    en: "Samsung",  url: "https://www.samsung.com/sec/support/user-manuals-and-guide/" },
];

export default function DriversPage() {
  return (
    <>
      <PageHeader
        badge="DRIVERS"
        title="드라이버 다운로드"
        description="한별 드라이버 센터이 가장 빠른 방법입니다. 제조사 공식 페이지에서도 받으실 수 있습니다."
      />
      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          {/* 1) 한별 드라이버 센터 - 메인 다운로드 채널 */}
          <Link
            href={embedHref(HANBYEOL_DRIVE, "한별 드라이버 센터")}
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
                  한별 드라이버 센터
                </h2>
                <p className="text-[12px] lg:text-sm text-white/80 mt-0.5">
                  882.kr - 딸깍P드라이버·브랜드별 드라이버·딸깍설치
                </p>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1 bg-white text-hb-primary font-extrabold text-sm px-4 py-2 rounded-lg shadow group-hover:bg-amber-50 transition flex-shrink-0">
                한별 드라이버 센터 바로가기 →
              </div>
              <div className="sm:hidden text-2xl flex-shrink-0 group-hover:translate-x-1 transition">→</div>
            </div>
          </Link>

          {/* 1-1) 딸깍P드라이버 - 설치기 직접 다운로드 */}
          <a
            href={DDALKKAK_P_DRIVER}
            className="group flex items-center gap-4 bg-[var(--panel)] border-2 border-hb-blue/40 rounded-2xl p-4 lg:p-5 mb-6 hover:border-hb-blue hover:shadow-lg hover:-translate-y-0.5 transition"
          >
            <div className="text-3xl flex-shrink-0">🖱</div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-extrabold tracking-[.18em] text-hb-blue mb-0.5">
                추천 · 클릭 한 번 자동 설치
              </div>
              <h3 className="text-base lg:text-lg font-black text-[var(--ink)] leading-tight">
                딸깍P드라이버
              </h3>
              <p className="text-[12px] lg:text-sm text-[var(--mute)] mt-0.5">
                프린터를 자동으로 찾아 드라이버 설치부터 스캔 설정까지 한 번에
              </p>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1 bg-hb-blue text-white font-extrabold text-sm px-4 py-2 rounded-lg shadow group-hover:bg-hb-primary transition flex-shrink-0">
              ⬇ 바로 다운로드
            </div>
            <div className="sm:hidden text-2xl flex-shrink-0 group-hover:translate-x-1 transition">⬇</div>
          </a>

          {/* 2) 제조사 공식 사이트 */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-4 mb-5 text-sm text-[var(--mute)] leading-relaxed">
            💡 한별 드라이버 센터에서 못 찾으셨다면 아래 제조사 공식 페이지에서 모델명으로 검색하세요. 모델명을 모르시면 한별로 연락 주시면 함께 찾아드립니다.
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
