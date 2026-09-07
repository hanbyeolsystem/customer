"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { site } from "@/data/site";

/* 표지 배너 캐러셀(시놀로지 홈 형식, 2026-09-08). 사진 위에 흰 큰 제목 + 한 줄 부제 + 파란 알약 버튼.
   하단 가운데 반투명 알약 안에 점 페이지네이션과 일시정지 버튼. 문구·숫자는 기존 데이터 그대로. */
const banners = [
  {
    img: "/hero/hero-poster.webp", alt: "한별시스템 엔지니어가 서버랙 장비를 점검하는 모습",
    title: <>데이터는 회사 안에,<br />AI도 회사 안에</>,
    sub: `대구·경북 170여 개 기업의 데이터를 19년째 ${site.name}이 맡고 있습니다.`,
    href: "/ai", cta: "자세한 정보",
  },
  {
    img: "/hero/server-rack.webp", alt: "한별시스템이 구축한 서버랙과 랙마운트 NAS",
    title: <>시놀로지 NAS 구축</>,
    sub: "공식 대리점 정품 판매부터 RAID 구성, 3-2-1 백업, 사후 유지관리까지 한 회사에서.",
    href: "/nas", cta: "NAS 솔루션 보기",
  },
  {
    img: "/cases/bukgu-office-vfm251ci-1.webp", alt: "대구 북구 사무실에 설치한 복합기",
    title: <>복합기·프린터 임대</>,
    sub: "유지보수와 토너가 포함된 월 정액. 고장 나면 부르시면 됩니다.",
    href: "/rental", cta: "임대 요금 보기",
  },
  {
    img: "/cases/daegu-junggu-nas-to-nas-1.webp", alt: "대구 중구 사무실 NAS 구축 현장",
    title: <>대구·경북 구축 사례</>,
    sub: "건축사무소·병원·문화재단·사무실. 설치 당일 찍은 사진 그대로 올렸습니다.",
    href: "/cases", cta: "구축 사례 보기",
  },
] as const;

export function Hero() {
  const ref = useRef<SwiperType | null>(null);
  const [paused, setPaused] = useState(false);
  const toggle = () => {
    const s = ref.current; if (!s) return;
    if (paused) s.autoplay.start(); else s.autoplay.stop();
    setPaused(!paused);
  };
  return (
    <section className="relative bg-hb-primary text-white">
      <Swiper
        modules={[Autoplay, Pagination]}
        onSwiper={(s) => { ref.current = s; }}
        loop
        speed={700}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ el: ".hb-hero-dots", clickable: true }}
        className="h-[520px] sm:h-[560px] lg:h-[600px]"
      >
        {banners.map((b, i) => (
          <SwiperSlide key={b.href}>
            <div className="relative h-full">
              <Image src={b.img} alt={b.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 hb-photo-veil" />
              <div className="relative h-full max-w-[1280px] mx-auto px-5 lg:px-6 flex flex-col justify-center pb-16">
                <h1 className="text-[36px] sm:text-[48px] lg:text-[60px] leading-[1.15] font-bold max-w-3xl">{b.title}</h1>
                <p className="mt-4 lg:mt-5 text-[17px] lg:text-[22px] font-light text-white/90 max-w-2xl leading-relaxed">{b.sub}</p>
                <div className="mt-7 lg:mt-9 flex flex-wrap gap-3">
                  <Link href={b.href} className="syn-btn">{b.cta}</Link>
                  {i === 0 && <a href={site.phone.mainHref} className="syn-btn-outline text-white border-white/80">전화 {site.phone.main}</a>}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 점 페이지네이션 + 일시정지 (시놀로지식 알약) */}
      <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center">
        <div className="inline-flex items-center gap-2 h-9 pl-4 pr-1.5 rounded-full bg-white/15 backdrop-blur">
          <div className="hb-hero-dots !static !w-auto flex items-center gap-2 [&_.swiper-pagination-bullet]:!m-0 [&_.swiper-pagination-bullet]:!bg-white" />
          <button type="button" onClick={toggle} aria-label={paused ? "자동 넘김 재생" : "자동 넘김 일시정지"} className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center">
            {paused ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1l9 5-9 5z" /></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1h3v10H2zM7 1h3v10H7z" /></svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
