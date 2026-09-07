"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { caseStudies } from "@/data/cases";
import { SlideHead } from "./SlideHead";

/* 05 현장. 사진은 전부 실제 시공 현장(네이버 블로그 후기 근거). 배지·태그·확대 효과 없이 사진과 한 줄 설명만. */
export function CaseStudies() {
  return (
    <section id="cases" className="hb-slide bg-[var(--panel)] py-16 lg:py-24">
      <div className="max-w-6xl w-full mx-auto px-5 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <SlideHead
            no="05"
            kicker="현장"
            title={<>대구·경북 곳곳의<br className="hidden sm:block" /> 실제 구축 현장</>}
            lead="건축사무소·병원·문화재단·사무실. 설치 당일 찍은 사진 그대로입니다."
            className="mb-0"
          />
          <Link href="/cases" className="shrink-0 mb-1 text-[14px] font-semibold text-hb-blue underline underline-offset-4 decoration-hb-blue/40 hover:decoration-hb-blue">
            구축사례 {caseStudies.length}건 전체 보기
          </Link>
        </div>
      </div>

      <div data-reveal className="max-w-6xl w-full mx-auto pl-5 lg:px-8 mt-8 lg:mt-12">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1.15}
          spaceBetween={14}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            640:  { slidesPerView: 2.15, spaceBetween: 18 },
            1024: { slidesPerView: 3,    spaceBetween: 24 },
          }}
          className="!pb-10 !overflow-visible lg:!overflow-hidden"
        >
          {caseStudies.slice(0, 9).map((c) => (
            <SwiperSlide key={c.slug}>
              <Link href={`/cases/${c.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[var(--line)]">
                  <Image
                    src={c.images[0]}
                    alt={c.title}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 48vw, 88vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-3 text-[12px] font-semibold tracking-[.06em] text-[var(--mute)]">
                  {c.region} · {c.industry}
                </p>
                <h3 className="mt-1 font-sans font-semibold text-[15px] lg:text-[16px] leading-snug text-[var(--ink)] line-clamp-2 group-hover:text-hb-blue transition">
                  {c.title}
                </h3>
                <p className="mt-1 text-[13px] text-[var(--mute)]">{c.gear[0]}</p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
