import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { products, RENTAL_SHOP_URL } from "@/data/products";
import { embedHref } from "@/lib/embed";

export const metadata: Metadata = {
  title: "임대 쇼핑몰",
  description: "A3 컬러·흑백 복합기, A4 레이저, 잉크젯, PC·노트북, 대형 디스플레이 등 한별시스템 월 정액 임대 라인업.",
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        badge="RENTAL SHOP"
        title="임대 쇼핑몰"
        description="월 정액으로 부담 없이 — 유지보수·토너 모두 포함. 카드를 클릭하면 한별 임대 쇼핑몰(hbsys.kr) 의 상세 페이지로 이동합니다."
      />
      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {products.map((p) => (
              <Link
                id={p.id}
                key={p.id}
                href={embedHref(p.href, p.name)}
                className="group bg-[var(--bg)] border border-[var(--line)] rounded-2xl overflow-hidden hover:shadow-xl hover:border-amber-400 hover:-translate-y-0.5 transition"
              >
                {p.badge && (
                  <div className="bg-amber-500 text-white text-[10px] font-extrabold tracking-[.15em] px-3 py-1.5 text-center">
                    {p.badge}
                  </div>
                )}
                <div className="relative aspect-square bg-white flex items-center justify-center p-4">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(min-width:1024px) 33vw, 50vw"
                    className="object-contain p-4 group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-4 lg:p-5">
                  <div className="text-[11px] font-bold text-[var(--mute)] tracking-wider mb-1">
                    {p.category}
                  </div>
                  <h3 className="font-extrabold text-[var(--ink)] mb-2 leading-tight line-clamp-2 min-h-[2.5em]">
                    {p.name}
                  </h3>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-black text-hb-blue">{p.monthly}</span>
                    <span className="text-[12px] font-bold text-amber-600">상세 →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href={embedHref(RENTAL_SHOP_URL, "한별 임대 쇼핑몰")}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-base px-7 py-3.5 rounded-xl transition shadow-lg"
            >
              한별 임대 쇼핑몰 전체보기 →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
