import Link from "next/link";
import { site } from "@/data/site";
import { HeroBackground } from "./HeroBackground";

/* 표지 슬라이드. 사진 한 장, 문장 하나, 숫자 넉 줄.
   유리 패널·콘솔·글로우는 2026-09-08 리디자인에서 뺐다. 숫자는 site.stats 실측값. */
export function Hero() {
  return (
    <section id="top" className="hb-slide hb-slide-hero relative overflow-hidden bg-hb-primary text-white">
      <div className="absolute inset-0">
        <HeroBackground
          posterSrc="/hero/hero-poster.webp"
          videoSrc="/hero/hero-loop.mp4?v=5"
          posterAlt="한별시스템 엔지니어가 서버랙 장비를 점검하는 모습"
          // 배경 영상 2MB. 모바일에서는 받지 않고 포스터(57KB)만 쓴다.
          minWidth={1024}
        />
        <div className="absolute inset-0 hb-photo-veil" />
      </div>

      <div className="relative flex-1 flex flex-col justify-end max-w-6xl w-full mx-auto px-5 lg:px-8 pt-28 pb-[5.5rem] lg:pb-12">
        <p className="hb-rise text-[12px] lg:text-[13px] font-semibold tracking-[.12em] text-white/70 mb-5 lg:mb-7">
          기업 데이터 관리 · 사내 AI · 복합기 임대 · 대구
        </p>

        <h1 className="hb-rise text-[38px] sm:text-[52px] lg:text-[76px] leading-[1.12] tracking-[-0.01em] mb-6 lg:mb-8 max-w-4xl" style={{ animationDelay: "80ms" }}>
          데이터는 회사 안에,<br />
          <span className="text-hb-blue-light">AI도 회사 안에</span>
        </h1>

        <p className="hb-rise text-[16px] lg:text-[19px] text-white/85 leading-relaxed max-w-xl mb-8 lg:mb-10" style={{ animationDelay: "160ms" }}>
          대구·경북 170여 개 기업의 데이터를 19년째 {site.name}이 맡고 있습니다.
          NAS 구축과 백업, 사내 AI 도입, 복합기 임대, 전산 유지관리를 한 회사에서 합니다.
        </p>

        <div className="hb-rise flex flex-col sm:flex-row gap-3 mb-12 lg:mb-16" style={{ animationDelay: "240ms" }}>
          <a
            href={site.phone.mainHref}
            className="inline-flex items-center justify-center h-13 sm:h-12 px-7 rounded-md bg-white text-hb-primary font-bold text-[16px] hover:bg-white/90 transition"
          >
            전화 {site.phone.main}
          </a>
          <Link
            href="/support/remote"
            className="inline-flex items-center justify-center h-13 sm:h-12 px-7 rounded-md border border-white/45 text-white font-semibold text-[16px] hover:bg-white/10 transition"
          >
            원격지원 시작
          </Link>
        </div>

        {/* 숫자 넉 줄 - 장식 없는 실측값 */}
        <dl className="hb-rise grid grid-cols-2 lg:grid-cols-4 border-t border-white/25" style={{ animationDelay: "320ms" }}>
          {site.stats.map((s) => (
            <div key={s.label} className="py-4 lg:py-5 pr-4 border-b border-white/15 lg:border-b-0 lg:border-r lg:border-white/15 lg:pl-5 first:lg:pl-0 last:lg:border-r-0">
              <dd className="font-display text-[28px] lg:text-[36px] leading-none mb-1.5">{s.value}</dd>
              <dt className="text-[12px] lg:text-[13px] text-white/65 font-medium">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
