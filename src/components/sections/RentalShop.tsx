import Image from "next/image";
import Link from "next/link";
import { products, RENTAL_SHOP_URL } from "@/data/products";
import { embedHref } from "@/lib/embed";
import { SlideHead } from "./SlideHead";

/* 06 임대. 흰 바탕 제품 사진 + 이름 + 월 요금. 배지·그림자·확대 없음. */
export function RentalShop() {
  return (
    <section id="rental" className="hb-slide bg-[var(--bg)] py-16 lg:py-20">
      <div className="max-w-6xl w-full mx-auto px-5 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 lg:mb-12">
          <SlideHead
            no="06"
            kicker="임대"
            title={<>복합기·프린터,<br className="hidden sm:block" /> 월 정액으로</>}
            lead="유지보수와 토너가 포함된 월 요금입니다. 고장 나면 부르시면 됩니다."
            className="mb-0"
          />
          <Link
            href={embedHref(RENTAL_SHOP_URL, "한별 임대 쇼핑몰")}
            className="shrink-0 mb-1 text-[14px] font-semibold text-hb-blue underline underline-offset-4 decoration-hb-blue/40 hover:decoration-hb-blue"
          >
            임대 쇼핑몰 전체 보기
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 hb-grid-lines border border-[var(--line)]">
          {products.map((p) => (
            <Link
              key={p.id}
              href={embedHref(p.href, p.name)}
              className="group p-4 lg:p-4 hover:bg-[var(--panel)] transition"
            >
              <div className="relative aspect-square bg-white rounded-sm overflow-hidden mb-4">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(min-width:1024px) 16vw, (min-width:640px) 30vw, 45vw"
                  className="object-contain p-4"
                />
              </div>
              <p className="text-[11px] lg:text-[12px] font-semibold tracking-[.08em] text-[var(--mute)] mb-1">{p.category}</p>
              <h3 className="font-display text-[14px] lg:text-[15px] leading-snug text-[var(--ink)] line-clamp-2 min-h-[2.6em] mb-2">
                {p.name}
              </h3>
              <p className="text-[15px] lg:text-[16px] font-semibold text-[var(--ink)]">
                {p.monthly}
              </p>
            </Link>
          ))}
        </div>

        <p className="mt-5 text-[13px] text-[var(--mute)]">
          요금표는 <Link href="/rental/price" className="font-semibold text-hb-blue underline underline-offset-4 decoration-hb-blue/40">복합기 임대료</Link> 페이지에 전부 공개되어 있습니다.
        </p>
      </div>
    </section>
  );
}
