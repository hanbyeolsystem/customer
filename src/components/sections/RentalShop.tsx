import Image from "next/image";
import Link from "next/link";
import { products, RENTAL_SHOP_URL } from "@/data/products";
import { embedHref } from "@/lib/embed";

/* 임대 쇼핑몰: 시놀로지 제품 목록 형식(흰 카드, 제품 사진, 이름, 가격, 파란 링크). 데이터는 products.ts 그대로. */
export function RentalShop() {
  return (
    <section id="rental" className="bg-[var(--bg)] py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <h2 className="text-[28px] lg:text-[36px] leading-tight">복합기·프린터 임대</h2>
          <p className="mt-4 text-[16px] lg:text-[18px] font-light leading-relaxed text-[var(--mute)]">
            유지보수와 토너가 포함된 월 정액입니다. 고장 나면 부르시면 됩니다.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
          {products.map((p) => (
            <Link key={p.id} href={embedHref(p.href, p.name)} className="group block rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3 lg:p-4 hover:shadow-[0_10px_30px_rgba(46,55,66,.10)] hover:border-hb-blue/40 transition">
              <div className="relative aspect-square rounded-lg bg-white overflow-hidden">
                <Image src={p.image} alt={p.name} fill sizes="(min-width:1024px) 16vw, (min-width:640px) 30vw, 45vw" className="object-contain p-3 group-hover:scale-[1.04] transition duration-500" />
              </div>
              <p className="mt-3 text-[11px] lg:text-[12px] text-[var(--mute)]">{p.category}</p>
              <h3 className="mt-0.5 text-[14px] lg:text-[15px] font-medium leading-snug text-[var(--ink)] line-clamp-2 min-h-[2.6em] group-hover:text-hb-blue transition">{p.name}</h3>
              <p className="mt-1.5 text-[15px] lg:text-[16px] font-bold text-[var(--ink)]">{p.monthly}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10 flex flex-wrap justify-center gap-3">
          <Link href={embedHref(RENTAL_SHOP_URL, "한별 임대 쇼핑몰")} className="syn-btn">임대 쇼핑몰 전체 보기</Link>
          <Link href="/rental/price" className="syn-btn-outline text-hb-blue">복합기 임대료 표</Link>
        </div>
      </div>
    </section>
  );
}
