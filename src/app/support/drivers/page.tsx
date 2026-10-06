import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { embedHref } from "@/lib/embed";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, webPageLd } from "@/lib/schema";
import { AnswerBlock } from "@/components/AnswerBlock";

export const metadata: Metadata = {
  title: "프린터 드라이버 다운로드",
  description: "복합기·프린터 드라이버를 기종만 고르면 자동으로 설치해 주는 딸깍P드라이버를 이 페이지에서 무료로 받을 수 있습니다. 딸깍설치 기술은 특허 출원중이며, 제조사 공식 지원 페이지 링크도 함께 정리했습니다.",
  alternates: { canonical: "/support/drivers/" },
};

// 2026-10-06 사장님 지시로 882.kr 연결 복구(10-05 에 지웠던 것). 설치기는 882 가 항상 최신판을 내려준다.
const HANBYEOL_DRIVE = "https://882.kr/?embed=1"; // 새 882 (2026-08-17 재구축): embed=1 → 882 자체 상단바 숨김(홈페이지 헤더 안 이중 표시 방지)
// 딸깍P드라이버 설치기 직접 다운로드 (882 파일배포, 한글 파일명 percent-encoding 고정값)
const DDALKKAK_P_DRIVER = "https://882.kr/?code=%EB%94%B8%EA%B9%8DP%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B2%84.exe";
const DDALKKAK_P_MANUAL = "/download/ddalkkakp-driver-manual.pdf";

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
      <JsonLd data={breadcrumbLd([{ name: "고객지원", path: "/support/" }, { name: "드라이버 다운로드", path: "/support/drivers/" }])} />
      <JsonLd data={webPageLd({ path: "/support/drivers/", name: String(metadata.title), description: metadata.description ?? undefined })} />
      <PageHeader
        badge="DRIVERS"
        title="드라이버 다운로드"
        description="딸깍P드라이버를 여기서 바로 받으세요. 제조사 공식 페이지 링크도 모아 두었습니다."
      />
      <AnswerBlock
        question="프린터 드라이버는 어디서 받나요?"
        answer="이 페이지에서 딸깍P드라이버를 무료로 받을 수 있습니다. 기종만 고르면 드라이버를 자동으로 설치해 주는 프로그램입니다. 설치나 인쇄가 안 되면 053-588-7119로 전화 주세요. 원격으로 접속해 확인해 드립니다. 제조사 공식 드라이버 페이지와 프린터 에러코드 검색도 무료로 쓰실 수 있어요."
        facts={[{ label: "다운로드", value: "무료" }, { label: "자동 설치", value: "딸깍P드라이버" }, { label: "딸깍설치", value: "특허 출원중" }, { label: "문제 시", value: "전화·원격 지원" }]}
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
            className="group flex items-center gap-4 bg-[var(--panel)] border-2 border-hb-blue/40 rounded-2xl p-4 lg:p-5 mb-3 hover:border-hb-blue hover:shadow-lg hover:-translate-y-0.5 transition"
          >
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
              <span className="inline-flex items-center gap-1 mt-1.5 rounded-full bg-hb-blue/10 text-hb-blue text-[10px] lg:text-[11px] font-bold px-2 py-0.5">
                특허 출원중 · 제10-2026-0162666호
              </span>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1 bg-hb-blue text-white font-extrabold text-sm px-4 py-2 rounded-lg shadow group-hover:bg-hb-primary transition flex-shrink-0">
              ⬇ 바로 다운로드
            </div>
            <div className="sm:hidden text-2xl flex-shrink-0 group-hover:translate-x-1 transition">⬇</div>
          </a>
          <p className="text-sm text-[var(--mute)] mb-6 px-1">
            처음이시면{" "}
            <a href={DDALKKAK_P_MANUAL} download="딸깍P드라이버_사용설명서.pdf" className="font-bold text-hb-blue underline underline-offset-2">
              그림 사용설명서 (PDF, 12쪽)
            </a>
            를 같이 받아 보세요.
          </p>

          {/* 1-2) 딸깍설치(거래처 프로필) - 특허 출원 기술 안내 */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-4 lg:p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="min-w-0">
                <h3 className="font-extrabold text-[var(--ink)] text-[15px] lg:text-base leading-tight">
                  딸깍설치 (거래처 프로필)
                </h3>
                <p className="text-[13px] lg:text-sm text-[var(--mute)] leading-relaxed mt-1">
                  한 번 설치한 프린터 구성을 거래처 단위로 저장해 두고, 다른 PC에서 그대로 불러와 재설치합니다.
                  프린터 IP가 바뀌어도 자동으로 찾아 보정하므로 새 PC가 와도 클릭 한 번이면 끝납니다.
                </p>
                <p className="text-[12px] font-bold text-hb-blue mt-2">
                  거래처 프로필 저장·IP 자동보정 기술 특허 출원중 (제10-2026-0162666호, 2026-08-28 출원)
                </p>
              </div>
            </div>
          </div>

          {/* 2) 제조사 공식 사이트 */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-4 mb-5 text-sm text-[var(--mute)] leading-relaxed">
            딸깍P드라이버로 잡히지 않는 기종은 아래 제조사 공식 페이지에서 모델명으로 검색하세요. 모델명을 모르시면 053-588-7119로 전화 주세요. 함께 찾아 드립니다.
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
