import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "원격 지원",
  description: "TeamViewer / AnyDesk / RustDesk 다운로드 후 전화 한 통이면 한별 엔지니어가 즉시 원격 접속합니다.",
};

const tools = [
  {
    name: "TeamViewer QuickSupport",
    desc: "Windows 표준 · 가장 안정적 · 설치 불필요",
    href: "https://download.teamviewer.com/download/TeamViewerQS.exe",
    color: "from-blue-600 to-blue-700",
    badge: "추천",
  },
  {
    name: "AnyDesk",
    desc: "가벼움 · 빠른 응답속도 · 저사양 PC 적합",
    href: "https://anydesk.com/ko/downloads/windows",
    color: "from-red-500 to-red-600",
  },
  {
    name: "RustDesk",
    desc: "오픈소스 · 보안 강화 환경 권장",
    href: "https://github.com/rustdesk/rustdesk/releases",
    color: "from-emerald-600 to-emerald-700",
  },
];

const steps = [
  {
    n: 1,
    title: "원격지원 도구 다운로드",
    body: "위 3개 중 하나를 선택해 다운로드하세요. 추천은 TeamViewer QuickSupport.",
  },
  {
    n: 2,
    title: "다운로드 파일 실행",
    body: "실행 시 화면에 ID와 비밀번호가 표시됩니다.",
  },
  {
    n: 3,
    title: "한별시스템에 전화",
    body: `${site.phone.main} 으로 전화 → ID/비밀번호 알려주시면 즉시 원격 접속합니다.`,
  },
];

export default function RemoteSupportPage() {
  return (
    <>
      <PageHeader
        badge="REMOTE SUPPORT"
        title="원격 지원 즉시 연결"
        description="아래 도구를 다운로드한 후, 전화 한 통이면 한별 엔지니어가 직접 화면을 보며 도와드립니다."
      />

      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          {/* 1) 도구 선택 */}
          <h2 className="text-lg lg:text-xl font-extrabold text-[var(--ink)] mb-5 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-hb-blue text-white flex items-center justify-center text-sm font-black">1</span>
            지원 도구 선택 · 다운로드
          </h2>
          <div className="grid md:grid-cols-3 gap-4 lg:gap-5 mb-12">
            {tools.map((t) => (
              <a
                key={t.name}
                href={t.href}
                target="_blank"
                rel="noopener"
                className={`group relative overflow-hidden bg-gradient-to-br ${t.color} text-white rounded-3xl p-6 lg:p-7 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition`}
              >
                {t.badge && (
                  <span className="absolute top-3 right-3 bg-white text-hb-primary text-[10px] font-extrabold tracking-wider px-2 py-1 rounded-full">
                    {t.badge}
                  </span>
                )}
                <div className="text-4xl mb-3">⬇</div>
                <h3 className="text-lg font-extrabold leading-tight mb-1">{t.name}</h3>
                <p className="text-[13px] text-white/80 mb-5 leading-relaxed">{t.desc}</p>
                <div className="text-sm font-bold inline-flex items-center gap-1 group-hover:gap-2 transition">
                  다운로드 →
                </div>
              </a>
            ))}
          </div>

          {/* 2) 진행 순서 */}
          <h2 className="text-lg lg:text-xl font-extrabold text-[var(--ink)] mb-5 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-hb-blue text-white flex items-center justify-center text-sm font-black">2</span>
            진행 순서
          </h2>
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-3xl p-6 lg:p-8 mb-10">
            <ol className="space-y-5">
              {steps.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-hb-blue text-white font-black flex items-center justify-center shadow-md">
                    {s.n}
                  </span>
                  <div className="pt-1">
                    <div className="font-extrabold text-[var(--ink)] mb-1">{s.title}</div>
                    <div className="text-sm text-[var(--mute)] leading-relaxed">{s.body}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* 3) 전화 CTA */}
          <div className="bg-gradient-to-br from-hb-primary to-hb-blue text-white rounded-3xl p-7 lg:p-9 text-center shadow-xl">
            <div className="text-4xl mb-3">📞</div>
            <h3 className="text-xl lg:text-2xl font-extrabold mb-2">한별 엔지니어 직통 연결</h3>
            <p className="text-sm text-white/80 mb-5">{site.phone.hours}</p>
            <a
              href={site.phone.mainHref}
              className="inline-flex items-center justify-center gap-2 bg-white text-hb-primary hover:bg-hb-blue-soft font-extrabold text-base lg:text-lg px-8 py-4 rounded-xl transition shadow-lg"
            >
              {site.phone.main}
            </a>
            <div className="text-xs text-white/60 mt-3">
              모바일은 <a href={site.phone.mobileHref} className="underline">{site.phone.mobile}</a>
            </div>
          </div>

          {/* 안전 안내 */}
          <div className="mt-8 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-5 lg:p-6">
            <h4 className="font-extrabold text-amber-800 dark:text-amber-200 text-sm mb-3 flex items-center gap-2">
              ⚠️ 보이스피싱 주의
            </h4>
            <ul className="space-y-1.5 text-[13px] text-amber-900 dark:text-amber-100 leading-relaxed">
              <li>• 한별 엔지니어는 <strong>전화 통화 중에만</strong> 원격 접속합니다.</li>
              <li>• 모르는 번호의 원격 접속 요청은 <strong>절대 응하지 마세요</strong>.</li>
              <li>• 작업 종료 후 프로그램 창을 닫으면 즉시 접속이 끊깁니다.</li>
            </ul>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-[var(--mute)] hover:text-hb-blue transition">
              ← 메인으로 돌아가기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
