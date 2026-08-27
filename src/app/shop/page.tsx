import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { products, RENTAL_SHOP_URL } from "@/data/products";
import { embedHref } from "@/lib/embed";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/schema";
import { AnswerBlock } from "@/components/AnswerBlock";

export const metadata: Metadata = {
  title: "임대 쇼핑몰 - 대구 복합기·PC 렌탈 라인업",
  description: "A3 컬러·흑백 복합기, A4 레이저, 잉크젯, PC·노트북, 대형 디스플레이 월 정액 임대 라인업. 대구·경북 설치와 유지보수까지 한별시스템이 직접 맡습니다.",
  alternates: { canonical: "/shop/" },
};

export default function ShopPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "임대 쇼핑몰", path: "/shop/" }])} />
      <PageHeader
        badge="RENTAL SHOP"
        title="임대 쇼핑몰"
        description="월 정액으로 부담 없이 - 유지보수·토너 모두 포함. 카드를 클릭하면 한별 임대 쇼핑몰(hbsys.kr) 의 상세 페이지로 이동합니다."
      />
      <AnswerBlock
        question="임대 쇼핑몰에는 어떤 장비가 있나요?"
        answer="A3 컬러·흑백 복합기, A4 레이저 프린터, 잉크젯 무한 프린터, PC와 노트북, 대형 디스플레이를 월 정액으로 임대합니다. 흑백 복사기 월 70,000원부터, 컬러 복사기 월 100,000원부터, 흑백 레이저 프린터 월 30,000원부터, 데스크탑과 모니터 세트 월 40,000원부터(전부 VAT 별도 시작가)이며 토너 등 소모품, 부품 교체, 출장 수리, 분기 정기점검이 월 정액에 포함됩니다. 대구·경북은 한별시스템이 직접 설치하고 당일 출동합니다. 기종은 월 인쇄량과 사용 환경을 보고 제안하며 방문 견적은 무료입니다."
        facts={[{ label: "흑백 복사기", value: "월 7만원부터" }, { label: "컬러 복사기", value: "월 10만원부터" }, { label: "PC+모니터", value: "월 4만원부터" }, { label: "포함", value: "소모품·수리·점검" }]}
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
