import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hb-primary text-white">
      {/* 배경: 서버실 사진 + 다크 네이비 오버레이 */}
      <div className="absolute inset-0">
        <Image
          src="/hero/server-rack.png"
          alt="기업용 서버실"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-hb-primary/85 via-hb-primary/70 to-hb-primary/35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.30),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-hb-primary to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* 텍스트 */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[.15em] mb-6">
              <span className="w-1.5 h-1.5 bg-hb-blue-light rounded-full animate-pulse" />
              ENTERPRISE IT INFRASTRUCTURE
            </div>
            <h1 className="text-[32px] sm:text-5xl lg:text-[60px] font-black leading-[1.12] tracking-tight mb-6">
              기업의 데이터와<br />
              업무환경을 책임지는<br />
              <span className="text-hb-blue-light">IT 파트너</span>
            </h1>
            <p className="text-base lg:text-lg text-white/85 leading-relaxed mb-2 font-medium">
              NAS 구축 · 데이터 백업 · 복사기 임대 · IT 유지관리
            </p>
            <p className="text-sm lg:text-base text-white/65 mb-9">
              대구·경북 기업의 든든한 IT 파트너 <strong className="text-white">{site.name}</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <Link
                href="/support/remote"
                className="inline-flex items-center justify-center gap-2 bg-hb-blue hover:bg-hb-blue-light text-white font-extrabold text-[15px] px-6 py-3.5 rounded-xl transition shadow-lg shadow-hb-blue/30"
              >
                🚨 원격지원 시작
              </Link>
              <Link
                href="/support/drivers"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-bold text-[15px] px-6 py-3.5 rounded-xl transition border border-white/20"
              >
                ⬇ 드라이버 다운로드
              </Link>
              <Link
                href="/support/quote"
                className="inline-flex items-center justify-center gap-2 bg-white text-hb-primary hover:bg-hb-blue-soft font-extrabold text-[15px] px-6 py-3.5 rounded-xl transition"
              >
                📞 상담 문의
              </Link>
            </div>
          </div>

          {/* 통계 카드 — 2x2 흰색 미니카드 */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              {site.stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-white/[0.07] backdrop-blur border border-white/15 rounded-2xl px-5 py-5 lg:px-6 lg:py-7 hover:bg-white/[0.12] transition"
                >
                  <div className="text-3xl lg:text-5xl font-black text-hb-blue-light leading-none mb-2">
                    {s.value}
                  </div>
                  <div className="text-[12px] lg:text-sm text-white/75 font-semibold">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
