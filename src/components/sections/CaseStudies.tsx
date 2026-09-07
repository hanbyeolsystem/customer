"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { caseStudies } from "@/data/cases";
import { site } from "@/data/site";

/* "글로벌 선도 기업들이 신뢰하는" 섹션 형식: 가운데 제목·설명, 숫자 넉 줄, 흐르는 현장 사진 캐러셀, 파란 알약 버튼.
   숫자는 site.stats 실측값, 사진은 실제 시공 현장. */
export function CaseStudies() {
  return (
    <section id="cases" className="bg-[var(--bg)] py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-[28px] lg:text-[36px] leading-tight">대구·경북 기업이 맡기는 한별시스템</h2>
          <p className="mt-4 text-[16px] lg:text-[18px] font-light leading-relaxed text-[var(--mute)]">
            건축, 의료, 교육, 문화, 제조, 사무실. 업종이 달라도 데이터를 회사 안에 두고 싶은 마음은 같습니다.
            설치 당일 찍은 사진 그대로 올린 실제 구축 사례입니다.
          </p>
        </div>

        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 max-w-4xl mx-auto mt-10 lg:mt-14 text-center">
          {site.stats.map((s) => (
            <div key={s.label}>
              <dd className="text-[36px] lg:text-[48px] font-bold leading-none text-hb-blue tabular-nums">{s.value}</dd>
              <dt className="mt-2 text-[14px] lg:text-[15px] text-[var(--mute)]">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      <div className="max-w-[1280px] mx-auto pl-5 lg:px-6 mt-10 lg:mt-14">
        <Swiper
          modules={[Autoplay, Navigation]}
          slidesPerView={1.2}
          spaceBetween={16}
          loop
          navigation
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{ 640: { slidesPerView: 2.2, spaceBetween: 20 }, 1024: { slidesPerView: 4, spaceBetween: 24 } }}
        >
          {caseStudies.slice(0, 12).map((c) => (
            <SwiperSlide key={c.slug}>
              <Link href={`/cases/${c.slug}`} className="group block">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[var(--panel)]">
                  <Image src={c.images[0]} alt={c.title} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 45vw, 85vw" className="object-cover group-hover:scale-[1.03] transition duration-500" />
                </div>
                <p className="mt-3 text-[12px] font-medium text-hb-blue">{c.region} · {c.industry}</p>
                <h3 className="mt-1 text-[15px] lg:text-[16px] font-medium leading-snug text-[var(--ink)] line-clamp-2 group-hover:text-hb-blue transition">{c.title}</h3>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="text-center mt-10 lg:mt-12">
        <Link href="/cases" className="syn-btn">모든 구축 사례 보기</Link>
      </div>
    </section>
  );
}
