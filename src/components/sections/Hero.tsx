import Link from "next/link";
import { site } from "@/data/site";
import { HeroBackground } from "./HeroBackground";
import { Icon } from "@/components/Icon";
import { embedHref } from "@/lib/embed";

/* 통계를 "모니터링 지표"로 재해석 — 회사 자체를 무중단 가동 중인 시스템으로 */
const monitors = site.stats.map((s, i) => ({
  ...s,
  status: i === site.stats.length - 1 ? "LIVE" : "정상",
}));

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hb-primary text-white">
      {/* 배경: 작업 영상 + 심야 네이비 + 항성골드 글로우(한별=별) */}
      <div className="absolute inset-0">
        <HeroBackground
          posterSrc="/hero/server-rack.png"
          videoSrc="/hero/hero-loop.mp4?v=2"
        />
        {/* 왼쪽 텍스트는 보호, 오른쪽은 영상이 드러나게 */}
        <div className="absolute inset-0 bg-gradient-to-r from-hb-primary via-hb-primary/65 to-hb-primary/25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(0,144,216,0.28),transparent_45%)]" />
        <div className="absolute inset-0 console-grid opacity-[0.25]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-hb-primary to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* ── 텍스트(논제) ── */}
          <div className="lg:col-span-7">
            <div className="hb-rise inline-flex items-center gap-2.5 font-mono text-[11px] font-semibold tracking-[.18em] text-white/70 mb-7">
              <span className="hb-blink w-2 h-2 rounded-full bg-hb-azure shadow-[0_0_0_4px_rgba(0,144,216,0.25)]" />
              SYS.ONLINE — 19Y UPTIME
            </div>

            <h1 className="text-[34px] sm:text-5xl lg:text-[62px] font-black leading-[1.1] tracking-tight mb-7">
              19년 동안<br />
              <span className="text-hb-azure">한 번도 멈추지 않은</span><br />
              IT 파트너
            </h1>

            <p className="text-base lg:text-lg text-white/85 leading-relaxed mb-2 font-medium">
              NAS 구축 · 데이터 백업 · 복사기 임대 · IT 유지관리
            </p>
            <p className="text-sm lg:text-base text-white/60 mb-9">
              대구·경북 170여 개 기업의 시스템을 <strong className="text-white font-bold">{site.name}</strong>이 지킵니다.
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <Link
                href="/support/remote"
                className="inline-flex items-center justify-center gap-2 bg-hb-blue hover:bg-hb-azure text-white font-extrabold text-[15px] px-7 py-3.5 rounded-xl transition shadow-lg shadow-hb-azure/30"
              >
                <span aria-hidden>▸</span> 원격지원 시작
              </Link>
              <Link
                href={embedHref("https://hanbyeolsystem.github.io/hanbyeol-errorcode/", "에러코드 검색")}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold text-[15px] px-6 py-3.5 rounded-xl transition border border-white/20"
              >
                <Icon name="search" className="w-[18px] h-[18px]" strokeWidth={2} /> 에러코드 검색
              </Link>
              <Link
                href="/support/drivers"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold text-[15px] px-6 py-3.5 rounded-xl transition border border-white/20"
              >
                <Icon name="download" className="w-[18px] h-[18px]" strokeWidth={2} /> 드라이버 검색
              </Link>
              <Link
                href="/support/quote"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold text-[15px] px-6 py-3.5 rounded-xl transition border border-white/20"
              >
                상담 문의
              </Link>
            </div>
          </div>

          {/* ── 시그니처: 라이브 운영 콘솔 ── */}
          <div className="lg:col-span-5">
            <div className="hb-rise rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-md overflow-hidden shadow-2xl shadow-black/30" style={{ animationDelay: "120ms" }}>
              {/* 콘솔 헤더 */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.04]">
                <div className="flex items-center gap-2 font-mono text-[12px] font-semibold tracking-wide text-white/80">
                  <span className="hb-blink w-2 h-2 rounded-full bg-hb-azure" />
                  hanbyeol.ops
                </div>
                <span className="font-mono text-[11px] font-semibold tracking-wider text-hb-blue-light">
                  UPTIME 19Y
                </span>
              </div>

              {/* 모니터링 지표 */}
              <ul className="divide-y divide-white/10">
                {monitors.map((m, i) => (
                  <li
                    key={m.label}
                    className="hb-rise flex items-center justify-between px-5 py-4"
                    style={{ animationDelay: `${260 + i * 90}ms` }}
                  >
                    <span className="text-[13px] lg:text-sm text-white/75 font-medium">
                      {m.label}
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-2xl lg:text-[28px] font-bold text-hb-azure leading-none tabular-nums">
                        {m.value}
                      </span>
                      <span
                        className={[
                          "inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-wider px-2 py-1 rounded-md",
                          m.status === "LIVE"
                            ? "text-hb-azure bg-hb-azure/12 border border-hb-azure/25"
                            : "text-hb-blue-light bg-hb-blue-light/10 border border-hb-blue-light/20",
                        ].join(" ")}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${m.status === "LIVE" ? "bg-hb-azure hb-blink" : "bg-hb-blue-light"}`} />
                        {m.status}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              {/* 콘솔 푸터 */}
              <div className="px-5 py-3 border-t border-white/10 bg-white/[0.04] font-mono text-[10.5px] tracking-wide text-white/45">
                ● 실시간 모니터링 · 대구·경북 전역 출동
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
