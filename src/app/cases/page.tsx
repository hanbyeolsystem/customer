import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { AnswerBlock } from "@/components/AnswerBlock";
import { JsonLd } from "@/components/JsonLd";
import { caseCats, caseStudies } from "@/data/cases";
import { businessId, site } from "@/data/site";

export const metadata: Metadata = {
  title: "구축 사례 - 대구·경북 NAS·복합기·랜공사 실제 시공 기록",
  description:
    "한별시스템이 실제로 시공한 현장 기록. 시놀로지 DS925+·DS1825+·RS2421+ 서버 구축, 교세라 복합기 설치, 사무실 랜공사까지 업종·지역·장비별로 정리했습니다. 모든 사례에 원문 후기 링크가 붙어 있습니다.",
  alternates: { canonical: "/cases/" },
};

// 구축 사례 목록을 기계가 읽을 수 있게. AI 가 "대구 NAS 구축 실적"을 물었을 때
// 업종·장비까지 인용할 수 있도록 이미지와 업종을 함께 넣는다.
const casesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${site.url}/cases/#list`,
  name: "한별시스템 구축 사례",
  numberOfItems: caseStudies.length,
  itemListElement: caseStudies.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${site.url}/cases/${c.slug}/`,
    item: {
      "@type": "CreativeWork",
      "@id": `${site.url}/cases/${c.slug}/#case`,
      name: c.title,
      description: c.summary,
      about: `${c.industry} · ${c.gear.join(", ")}`,
      image: `${site.url}${c.images[0]}`,
      url: `${site.url}/cases/${c.slug}/`,
      dateCreated: c.date,
      locationCreated: { "@type": "Place", name: c.region },
      creator: { "@id": businessId },
    },
  })),
};

// 카테고리별 실제 건수 (표시는 데이터에서 자동 계산 - 손으로 숫자 적지 말 것)
const counts = caseCats.map((cat) => ({
  ...cat,
  n: caseStudies.filter((c) => c.category === cat.id).length,
}));

export default function CasesPage() {
  return (
    <>
      <JsonLd data={casesJsonLd} />
      <PageHeader
        badge="CASE STUDIES · 현장 기록"
        title="실제 구축 사례"
        description="꾸며 낸 사례가 아니라 실제로 다녀온 현장입니다. 사례마다 원문 후기 링크가 붙어 있어 사진과 함께 확인하실 수 있습니다."
      />

      <AnswerBlock
        question="한별시스템은 대구·경북에서 어떤 곳에 NAS와 복합기를 설치했나요?"
        answer={`대구 북구 행복북구문화재단 DS925+ 서버, 성운대학교 RS2421+ 랙마운트 서버, 대구 북구 건축사무소 DS1825+ 8베이 서버, 경북 예천 사무실 DS925+ 8TB 구축, 경남 창원 사무실 DS925+ RAID 5 구성처럼 공공기관·대학·건축사무소·제조 사무실까지 업종을 가리지 않고 시공했습니다. 복합기는 교세라 TASKalfa 3011i·3552ci·VFM251ci·VFM351ci·4012iG(정부조달)를 사무실 인쇄량에 맞춰 설치했고, 사무실 랜공사와 선정리, NAS 데이터 복구와 나스에서 나스로의 데이터 이관도 직접 합니다. 현재 이 페이지에 공개된 사례는 ${caseStudies.length}건이며 모두 시공 후기 원문이 함께 있습니다. 한별시스템 누적 실적은 관리 고객사 170곳 이상, NAS 구축 50건 이상, 복사기 설치 300대 이상입니다. 대구광역시 달서구, 상담 ${site.phone.main}.`}
        facts={[
          { label: "공개 사례", value: `${caseStudies.length}건` },
          { label: "NAS 구축", value: "50건 이상" },
          { label: "복사기 설치", value: "300대 이상" },
          { label: "관리 고객사", value: "170곳 이상" },
        ]}
      />

      {/* 분류 요약 */}
      <section className="py-8 bg-[var(--panel)] border-y border-[var(--line)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 flex flex-wrap gap-2.5">
          {counts.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="inline-flex items-center gap-2 bg-[var(--bg)] border border-[var(--line)] hover:border-hb-blue text-[var(--ink)] text-sm font-bold px-4 py-2 rounded-full transition"
            >
              {c.label}
              <span className="text-[11px] font-extrabold text-hb-blue">{c.n}</span>
            </a>
          ))}
        </div>
      </section>

      {caseCats.map((cat) => {
        const items = caseStudies.filter((c) => c.category === cat.id);
        if (!items.length) return null;
        return (
          <section key={cat.id} id={cat.id} className="py-12 lg:py-16 bg-[var(--bg)] scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4 lg:px-6">
              <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-6">
                {cat.label}
                <span className="ml-2 text-sm font-bold text-hb-blue">{items.length}건</span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {items.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/cases/${c.slug}`}
                    className="bg-[var(--bg)] border border-[var(--line)] rounded-3xl overflow-hidden hover:shadow-xl hover:border-hb-blue transition group flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={c.images[0]}
                        alt={c.title}
                        fill
                        sizes="(min-width:1024px) 33vw, 50vw"
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-hb-primary/85 text-white text-[10px] font-extrabold tracking-[.15em] px-2.5 py-1 rounded-full backdrop-blur">
                        {c.industry}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="text-[11px] font-bold text-[var(--mute)] mb-1.5">
                        {c.region} · {c.date.replace("-", ".")}
                      </div>
                      <h3 className="font-extrabold text-[var(--ink)] text-lg leading-tight mb-2">{c.title}</h3>
                      <p className="text-sm text-[var(--mute)] leading-relaxed mb-3 flex-1">{c.summary}</p>
                      <div className="text-[12px] font-semibold text-hb-blue mb-3">{c.gear.join(" · ")}</div>
                      <div className="inline-flex items-center gap-1 text-[12px] font-bold text-hb-blue group-hover:gap-2 transition-all">
                        시공 내용 보기 →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="py-12 bg-[var(--panel)] border-t border-[var(--line)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-3">
            우리 사무실은 어떤 구성이 맞을까요
          </h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-6">
            현장을 직접 보고 견적을 냅니다. 필요 없으면 필요 없다고 말씀드립니다. 방문 견적은 무료입니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/support/quote" className="inline-flex items-center justify-center bg-hb-blue hover:bg-hb-azure text-white font-extrabold text-[15px] px-7 py-3.5 rounded-xl transition">
              무료 방문 견적 요청
            </Link>
            <a href={site.phone.mainHref} className="inline-flex items-center justify-center border border-[var(--line)] text-[var(--ink)] font-extrabold text-[15px] px-7 py-3.5 rounded-xl transition hover:border-hb-blue">
              전화 {site.phone.main}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
