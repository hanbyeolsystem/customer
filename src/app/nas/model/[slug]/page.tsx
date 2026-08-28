import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { AnswerBlock } from "@/components/AnswerBlock";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { caseBySlug } from "@/data/cases";
import { businessId, site } from "@/data/site";
import {
  INSTALL_FEE,
  RENT_FROM,
  disks,
  diskPrice,
  nasModelBySlug,
  nasModels,
  quote,
  won,
} from "@/data/synology";

export function generateStaticParams() {
  return nasModels.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = nasModelBySlug(slug);
  if (!m) return {};
  const q = quote(m, m.recommend.cap, m.recommend.count);
  const priceLine = m.price
    ? `본체 ${won(m.price)}, ${m.recommend.cap} ${m.recommend.count}개 구성 ${won(q.net)}(VAT 별도).`
    : "구성별 별도 견적.";
  return {
    title: `시놀로지 ${m.model} 설치 - 대구 NAS 구축 비용과 구성`,
    description: `시놀로지 ${m.model}(${m.bayLabel}) 설치. ${priceLine} 대구·경북 시놀로지 공식 대리점 한별시스템이 설치·RAID·1시간 교육까지. 임대 월 ${won(RENT_FROM)}부터. ${site.phone.main}`,
    alternates: { canonical: `/nas/model/${slug}/` },
  };
}

export default async function NasModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = nasModelBySlug(slug);
  if (!m) notFound();

  const pageUrl = `${site.url}/nas/model/${m.slug}/`;
  const cases = m.caseSlugs.map(caseBySlug).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const others = nasModels.filter((x) => x.slug !== m.slug);

  // 이 모델로 만들 수 있는 대표 구성 3가지 (디스크 개수만 다르게)
  const counts = [
    Math.min(2, m.bays),
    Math.min(m.recommend.count, m.bays),
    m.bays,
  ].filter((v, i, a) => a.indexOf(v) === i);
  const configs = counts.map((count) => {
    const cap = m.recommend.cap;
    return { cap, count, ...quote(m, cap, count) };
  });

  const faq = [
    {
      q: `시놀로지 ${m.model} 설치하면 비용이 얼마나 드나요?`,
      a: m.price
        ? `본체가 ${won(m.price)}이고 여기에 하드디스크 값과 출장 설치·설정교육 ${won(INSTALL_FEE)}이 더해집니다. 가장 많이 나가는 ${m.recommend.cap} ${m.recommend.count}개 구성이면 장비 ${won(configs.find((c) => c.count === Math.min(m.recommend.count, m.bays))!.gear)}에 설치비를 더해 ${won(configs.find((c) => c.count === Math.min(m.recommend.count, m.bays))!.net)}(VAT 별도, 포함 ${won(configs.find((c) => c.count === Math.min(m.recommend.count, m.bays))!.vat)})입니다. 전부 시놀로지 권장소비자가 기준이고 현장 조건에 따라 달라질 수 있어 ${site.phone.main}로 확인해 주세요.`
        : `${m.model}은 랙마운트 제품이라 단가표에 고정 금액이 올라 있지 않습니다. 디스크 구성과 랙 환경에 따라 금액이 크게 달라지므로 ${site.phone.main}로 문의 주시면 현장을 보고 견적을 내 드립니다. 출장 설치와 설정교육 ${won(INSTALL_FEE)}은 동일하게 포함됩니다.`,
    },
    {
      q: `${m.model}은 직원 몇 명 규모에 맞나요?`,
      a: `${m.fitFor} 규모에 주로 들어갑니다(대략 ${m.people}). 다만 인원수보다 중요한 것은 다루는 파일의 크기입니다. 문서 위주라면 인원이 많아도 작은 모델로 충분하고, 도면이나 영상처럼 큰 파일을 다루면 인원이 적어도 베이 수가 많은 쪽이 맞습니다. 방문해서 실제 자료량을 보고 정합니다.`,
    },
    {
      q: `하드디스크는 몇 개부터 넣어야 하나요?`,
      a: `최소 두 개입니다. 한 개만 넣으면 그 디스크가 고장 나는 순간 자료가 사라집니다. 두 개를 묶어 두면 한 개가 죽어도 자료가 남습니다. ${m.bays}베이 제품이니 처음에 두 개만 넣고 나중에 늘리는 방식도 가능하지만, RAID 방식에 따라 나중에 늘릴 때 제약이 생길 수 있어 설계 단계에서 같이 잡아 드립니다.`,
    },
    {
      q: "구매 말고 임대도 되나요?",
      a: `됩니다. 시놀로지 NAS 임대는 월 ${won(RENT_FROM)}부터(VAT 별도)이고 기본 계약은 36개월입니다. 임대료 안에 장비와 설치, 백업 관리, 장애 시 출장, 하드디스크 교체까지 들어가서 초기 목돈이 나가지 않고 쓰다가 하드가 고장 나도 추가 비용이 붙지 않습니다.`,
    },
    {
      q: "설치는 어디까지 해 주나요?",
      a: `장비 선정, 디스크 조립, 사전 검수, 현장 설치, RAID 설정, 공유 폴더와 계정 구성, 백업 스케줄 구성, 그리고 담당자 1시간 사용 교육까지가 출장 설치·설정교육 ${won(INSTALL_FEE)}에 들어갑니다. 랜 배선 상태나 기존 자료 이전량 같은 현장 조건에 따라 작업 범위가 늘어날 수 있습니다.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${pageUrl}#product`,
        name: `시놀로지 ${m.model} NAS 구축(대구·경북)`,
        description: `${m.model} ${m.bayLabel} ${m.form} NAS. ${m.headline}. ${m.fitFor}. 한별시스템이 장비 선정부터 RAID 설정, 현장 설치, 1시간 사용 교육까지 진행한다.`,
        brand: { "@type": "Brand", name: "Synology" },
        model: m.model,
        category: "NAS 스토리지",
        url: pageUrl,
        // 상품 리치결과 필수 항목. 실제 설치 현장 사진이 있으면 그것을, 없으면 대표 카드 이미지를 쓴다.
        image: cases.length ? cases.map((c) => `${site.url}${c.images[0]}`) : [`${site.url}/og.jpg`],
        ...(m.price
          ? {
              offers: configs.map((c) => ({
                "@type": "Offer",
                name: `${m.model} + ${c.cap} ${c.count}개 + 출장 설치·설정교육`,
                priceCurrency: "KRW",
                price: c.net,
                availability: "https://schema.org/InStock",
                seller: { "@id": businessId },
                priceSpecification: {
                  "@type": "PriceSpecification",
                  priceCurrency: "KRW",
                  price: c.net,
                  valueAddedTaxIncluded: false,
                },
              })),
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "NAS 솔루션", item: `${site.url}/nas/` },
          { "@type": "ListItem", position: 3, name: `${m.model} 설치`, item: pageUrl },
        ],
      },
    ],
  };

  const mainConfig = configs.find((c) => c.count === Math.min(m.recommend.count, m.bays))!;

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        badge={`SYNOLOGY ${m.model} · ${m.bayLabel} ${m.form}`}
        title={`시놀로지 ${m.model} 설치`}
        description={`${m.headline}. ${m.fitFor}에 들어갑니다.`}
        back="/nas"
        backLabel="NAS 솔루션"
      />

      <AnswerBlock
        question={`시놀로지 ${m.model}를 설치하면 비용이 얼마나 드나요?`}
        answer={
          m.price
            ? `본체가 ${won(m.price)}(VAT 별도)이고, 여기에 하드디스크 값과 출장 설치·설정교육 ${won(INSTALL_FEE)}이 더해집니다. 가장 많이 나가는 ${m.recommend.cap} ${mainConfig.count}개 구성이면 장비 ${won(mainConfig.gear)}에 설치비를 더해 합계 ${won(mainConfig.net)}(VAT 포함 ${won(mainConfig.vat)})입니다. ${m.model}는 ${m.bayLabel} ${m.form} 제품으로 ${m.fitFor}에 주로 들어갑니다. 초기 목돈이 부담되면 월 ${won(RENT_FROM)}부터(기본 36개월, VAT 별도) 임대도 가능하며 임대료에 장비·설치·백업 관리·장애 출장·하드디스크 교체가 포함됩니다. 대구광역시 달서구 한별시스템은 시놀로지 공식 대리점이며 대구·경북 당일 방문합니다. 문의 ${site.phone.main}.`
            : `${m.model}는 ${m.bayLabel} ${m.form} 제품이라 단가표에 고정 금액이 올라 있지 않고 디스크 구성과 랙 환경에 따라 금액이 달라집니다. 출장 설치·설정교육 ${won(INSTALL_FEE)}은 동일하게 적용되며, 정확한 금액은 현장을 보고 산출합니다. ${m.fitFor}에 주로 들어가고, 한별시스템은 성운대학교 서버 구축을 이 모델로 진행했습니다. 대구광역시 달서구 한별시스템, 시놀로지 공식 대리점, 문의 ${site.phone.main}.`
        }
        facts={[
          { label: "베이", value: m.bayLabel },
          { label: "본체", value: m.price ? won(m.price) : "별도 견적" },
          { label: "권장 구성", value: `${m.recommend.cap} × ${mainConfig.count}` },
          { label: "임대", value: `월 ${won(RENT_FROM)}부터` },
        ]}
      />

      {/* 이 모델은 어떤 곳에 */}
      <section className="py-12 lg:py-16 bg-[var(--panel)]">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">WHO</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-4">
            {m.model}는 이런 곳에 넣습니다
          </h2>
          <p className="text-[15px] text-[var(--ink)]/90 leading-relaxed mb-6">{m.detail}</p>
          <p className="text-sm text-[var(--mute)] leading-relaxed">
            하드웨어 상세 사양은 제조사가 수시로 갱신하므로 시놀로지 공식 사양표를 확인하시는 편이 정확합니다.
            한별시스템은 사양 나열보다 실제 자료량과 증가 속도를 보고 모델을 정합니다.
          </p>
        </div>
      </section>

      {/* 구성별 견적 */}
      {m.price && (
        <section className="py-12 lg:py-16 bg-[var(--bg)]">
          <div className="max-w-4xl mx-auto px-4 lg:px-6">
            <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">PRICE</div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-3">
              {m.model} 구성별 견적
            </h2>
            <p className="text-sm text-[var(--mute)] leading-relaxed mb-6">
              본체 {won(m.price)} + {m.recommend.cap} 디스크({won(diskPrice(m.recommend.cap))}/개) + 출장
              설치·설정교육 {won(INSTALL_FEE)} 기준입니다. 시놀로지 권장소비자가이며 공급가 변동과 현장 조건에
              따라 달라질 수 있습니다.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="bg-hb-primary text-white text-left">
                    <th className="py-3 px-4 font-extrabold whitespace-nowrap">구성</th>
                    <th className="py-3 px-4 font-extrabold text-right whitespace-nowrap">장비</th>
                    <th className="py-3 px-4 font-extrabold text-right whitespace-nowrap">설치·교육</th>
                    <th className="py-3 px-4 font-extrabold text-right whitespace-nowrap">합계 (VAT 별도)</th>
                    <th className="py-3 px-4 font-extrabold text-right whitespace-nowrap">VAT 포함</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {configs.map((c) => (
                    <tr key={c.count} className={c.count === mainConfig.count ? "bg-hb-blue-soft/40 dark:bg-hb-blue/10" : ""}>
                      <td className="py-3 px-4 font-bold text-[var(--ink)] whitespace-nowrap">
                        {m.model} + {c.cap} {c.count}개
                        {c.count === mainConfig.count && (
                          <span className="ml-2 text-[10px] font-extrabold text-white bg-hb-blue px-1.5 py-0.5 rounded">추천</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-[var(--mute)] whitespace-nowrap">{won(c.gear)}</td>
                      <td className="py-3 px-4 text-right text-[var(--mute)] whitespace-nowrap">{won(INSTALL_FEE)}</td>
                      <td className="py-3 px-4 text-right font-extrabold text-hb-blue whitespace-nowrap">{won(c.net)}</td>
                      <td className="py-3 px-4 text-right text-[var(--mute)] whitespace-nowrap">{won(c.vat)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[var(--mute)] mt-4 leading-relaxed">
              {m.recommend.why}. 다른 용량으로 바꾸면 디스크 값만 달라집니다 -{" "}
              {disks.map((d) => `${d.cap} ${won(d.price)}`).join(", ")}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/support/quote" className="inline-flex items-center justify-center bg-hb-blue hover:bg-hb-azure text-white font-extrabold text-[15px] px-6 py-3 rounded-xl transition">
                이 구성으로 견적 받기
              </Link>
              <Link href="/nas/price" className="inline-flex items-center justify-center border border-[var(--line)] text-[var(--ink)] font-extrabold text-[15px] px-6 py-3 rounded-xl transition hover:border-hb-blue">
                전체 구축 비용 보기
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 실제 설치 사례 */}
      {cases.length > 0 && (
        <section className="py-12 lg:py-16 bg-[var(--panel)]">
          <div className="max-w-5xl mx-auto px-4 lg:px-6">
            <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">CASES</div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-6">
              {m.model} 실제 설치 현장 {cases.length}건
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cases.map((c) => (
                <Link key={c.slug} href={`/cases/${c.slug}`} className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl overflow-hidden hover:border-hb-blue transition">
                  <div className="relative aspect-[16/10]">
                    <Image src={c.images[0]} alt={c.title} fill sizes="33vw" className="object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] font-bold text-[var(--mute)] mb-1">{c.region} · {c.industry}</div>
                    <h3 className="text-sm font-extrabold text-[var(--ink)] leading-snug">{c.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 다른 모델과 비교 */}
      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">COMPARE</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-6">
            {m.model}가 아니라면 어떤 모델인가
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-hb-primary text-white text-left">
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap">모델</th>
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap">베이</th>
                  <th className="py-3 px-4 font-extrabold text-right whitespace-nowrap">본체가</th>
                  <th className="py-3 px-4 font-extrabold">이런 곳에</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {[m, ...others].map((x) => (
                  <tr key={x.slug} className={x.slug === m.slug ? "bg-hb-blue-soft/40 dark:bg-hb-blue/10" : ""}>
                    <td className="py-3 px-4 font-extrabold whitespace-nowrap">
                      {x.slug === m.slug ? (
                        <span className="text-hb-blue">{x.model} (현재 보는 모델)</span>
                      ) : (
                        <Link href={`/nas/model/${x.slug}`} className="text-[var(--ink)] hover:text-hb-blue hover:underline">
                          {x.model}
                        </Link>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[var(--mute)] whitespace-nowrap">{x.bayLabel}</td>
                    <td className="py-3 px-4 text-right text-[var(--mute)] whitespace-nowrap">
                      {x.price ? won(x.price) : "별도 견적"}
                    </td>
                    <td className="py-3 px-4 text-[var(--mute)] leading-relaxed">{x.fitFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--mute)] mt-4">
            전부 VAT 별도 시놀로지 권장소비자가입니다. 하드디스크와 출장 설치·설정교육 {won(INSTALL_FEE)}은 별도로 더해집니다.
          </p>
        </div>
      </section>

      <FaqSection title={`시놀로지 ${m.model} 자주 묻는 질문`} items={faq} />

      <section className="py-12 bg-[var(--panel)] border-t border-[var(--line)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-5">
            {m.model}가 우리 회사에 맞는지 현장을 보고 판단해 드립니다. 맞지 않으면 다른 모델을 권합니다.
            대구·경북 당일 방문, 방문 견적 무료.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
            {/* 모델명으로 들어와 "이거 얼마에 파나요"를 묻는 분들의 착지점 (전 모델 공통) */}
            <Link href="/nas/buy" className="inline-flex items-center justify-center bg-hb-primary hover:bg-hb-blue text-white font-extrabold text-[15px] px-7 py-3.5 rounded-xl transition">
              이 모델 구매 문의(판매가 보기)
            </Link>
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
