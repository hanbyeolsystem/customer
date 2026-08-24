import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { caseStudies } from "@/data/cases";

export const metadata: Metadata = {
  title: "구축 사례 - 대구·경북 NAS·복합기 설치 현장",
  description: "대구·경북 사무실에 실제로 설치한 시놀로지 NAS, 교세라 복합기, 사무실 랜공사 현장 기록. 건축사무소·대학교·공장 등 업종별 구축 사례와 고객 후기를 확인하세요.",
  alternates: { canonical: "/cases/" },
};

export default function CasesPage() {
  return (
    <>
      <PageHeader badge="CASE STUDIES" title="실제 구축 사례" description="업종을 가리지 않습니다. 한별의 손길이 닿은 현장들." />
      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {caseStudies.map((c) => (
            <article key={c.id} className="bg-[var(--bg)] border border-[var(--line)] rounded-3xl overflow-hidden hover:shadow-xl transition">
              <div className="relative aspect-[16/10]">
                <Image src={c.image} alt={c.title} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover" />
                <span className="absolute top-3 left-3 bg-hb-primary/85 text-white text-[10px] font-extrabold tracking-[.15em] px-2.5 py-1 rounded-full">{c.industry}</span>
              </div>
              <div className="p-5">
                <h3 className="font-extrabold text-[var(--ink)] text-lg leading-tight mb-2">{c.title}</h3>
                <p className="text-sm text-[var(--mute)] leading-relaxed mb-3">{c.summary}</p>
                <div className="text-[12px] font-semibold text-hb-blue">{c.scale}</div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
