import Image from "next/image";
import { products, RENTAL_SHOP_URL } from "@/data/products";

export function RentalShop() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-9 lg:mb-12">
          <div>
            <div className="text-[11px] font-extrabold text-amber-600 tracking-[.2em] mb-2">
              RENTAL SHOP
            </div>
            <h2 className="text-2xl lg:text-4xl font-extrabold text-[var(--ink)] tracking-tight">
              임대 쇼핑몰
            </h2>
            <p className="text-sm lg:text-base text-[var(--mute)] mt-3">
              월 정액으로 부담 없이 — 유지보수·토너 모두 포함
            </p>
          </div>
          <a
            href={RENTAL_SHOP_URL}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition self-start sm:self-auto"
          >
            임대 쇼핑몰 전체보기 →
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5">
          {products.map((p) => (
            <a
              key={p.id}
              href={p.href}
              target="_blank"
              rel="noopener"
              className="group relative bg-[var(--bg)] border border-[var(--line)] rounded-2xl overflow-hidden hover:shadow-xl hover:border-amber-400 hover:-translate-y-0.5 transition"
            >
              {p.badge && (
                <span className="absolute top-2.5 left-2.5 z-10 bg-amber-500 text-white text-[10px] font-extrabold tracking-[.15em] px-2 py-1 rounded-full">
                  {p.badge}
                </span>
              )}
              <div className="relative aspect-square bg-white flex items-center justify-center p-4 overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(min-width:1024px) 25vw, 50vw"
                  className="object-contain p-3 group-hover:scale-105 transition"
                />
              </div>
              <div className="p-3 lg:p-4">
                <div className="text-[11px] font-bold text-[var(--mute)] tracking-wider mb-1">
                  {p.category}
                </div>
                <div className="text-[13px] lg:text-sm font-extrabold text-[var(--ink)] leading-tight mb-2 line-clamp-2 min-h-[2.5em]">
                  {p.name}
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm lg:text-base font-black text-hb-blue">
                    {p.monthly}
                  </span>
                  <span className="text-[11px] font-bold text-[var(--mute)] group-hover:text-amber-600 transition">
                    상세 ↗
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
