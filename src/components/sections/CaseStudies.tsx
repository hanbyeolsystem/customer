"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { caseStudies } from "@/data/cases";
import { embedHref } from "@/lib/embed";

export function CaseStudies() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--panel)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-9 lg:mb-12">
          <div>
            <div className="eyebrow mb-3">CASE STUDIES</div>
            <h2 className="text-2xl lg:text-4xl font-extrabold text-[var(--ink)] tracking-tight">
              실제 구축 사례
            </h2>
            <p className="text-sm lg:text-base text-[var(--mute)] mt-3">
              건축·의료·교육·기업 — 대구·경북 곳곳의 실제 NAS·복합기 구축 후기입니다.
            </p>
          </div>
          <Link
            href="/cases"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-hb-blue hover:gap-2.5 transition"
          >
            전체 구축사례 보기 →
          </Link>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1.1}
          spaceBetween={16}
          centeredSlides={false}
          loop
          pagination={{ clickable: true }}
          navigation
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640:  { slidesPerView: 2.1, spaceBetween: 20 },
            1024: { slidesPerView: 3,   spaceBetween: 24 },
          }}
          className="!pb-12"
        >
          {caseStudies.map((c) => (
            <SwiperSlide key={c.id}>
              <Link
                href={embedHref(c.href, c.title)}
                className="bg-[var(--bg)] border border-[var(--line)] rounded-3xl overflow-hidden hover:shadow-xl hover:border-hb-blue transition group h-full flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 90vw"
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-hb-primary/85 text-white text-[10px] font-extrabold tracking-[.15em] px-2.5 py-1 rounded-full backdrop-blur">
                    {c.industry}
                  </span>
                </div>
                <div className="p-5 lg:p-6 flex-1 flex flex-col">
                  <h3 className="font-extrabold text-[var(--ink)] text-base lg:text-lg leading-tight mb-2">
                    {c.title}
                  </h3>
                  <p className="text-sm text-[var(--mute)] leading-relaxed mb-3 flex-1">
                    {c.summary}
                  </p>
                  <div className="text-[12px] font-semibold text-hb-blue mb-3">
                    {c.scale}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-semibold text-[var(--mute)] bg-[var(--panel)] border border-[var(--line)] px-2 py-1 rounded-full"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1 text-[12px] font-bold text-hb-blue group-hover:gap-2 transition-all">
                    블로그 후기 보기 →
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
