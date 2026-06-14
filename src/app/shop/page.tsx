import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "임대 쇼핑몰",
  description: "A3 컬러·흑백 복합기, A4 레이저, 문서세단기, 핸드프린터, 라벨프린터 등 월 정액 임대 라인업.",
};

export default function ShopPage() {
  return (
    <>
      <PageHeader badge="RENTAL SHOP" title="임대 쇼핑몰" description="월 정액으로 부담 없이 — 유지보수·토너 모두 포함" />
      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {products.map((p) => (
              <article id={p.id} key={p.id} className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl overflow-hidden hover:shadow-xl transition">
                {p.badge && <div className="bg-amber-500 text-white text-[10px] font-extrabold tracking-[.15em] px-3 py-1.5 text-center">{p.badge}</div>}
                <div className="relative aspect-square bg-[var(--panel)] flex items-center justify-center p-4">
                  <Image src={p.image} alt={p.name} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-contain p-4" />
                </div>
                <div className="p-4 lg:p-5">
                  <div className="text-[11px] font-bold text-[var(--mute)] tracking-wider mb-1">{p.category}</div>
                  <h3 className="font-extrabold text-[var(--ink)] mb-2 leading-tight">{p.name}</h3>
                  <div className="text-lg font-black text-hb-blue mb-3">{p.monthly}</div>
                  <Link href="/support/quote" className="block bg-hb-primary hover:bg-hb-blue text-white text-center font-bold text-sm py-2.5 rounded-xl transition">
                    견적 문의
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
