import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { AnswerBlock } from "@/components/AnswerBlock";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/schema";
import { businessId, site } from "@/data/site";
import {
  BUY_FROM,
  INSTALL_FEE,
  RENT_FROM,
  bodyLow,
  diskPrice,
  disks,
  nasModelBySlug,
  nasModels,
  standardQuotes,
  unitPrices,
  won,
} from "@/data/synology";

export const metadata: Metadata = {
  title: "대구 NAS 판매 - 시놀로지 공식 대리점 정품 구매·견적",
  description: `대구 NAS 판매. 시놀로지 공식 대리점 한별시스템이 DS225+·DS425+·DS925+·DS1525+·DS1825+·RS2421+ 정품을 판매·납품합니다. 본체 ${won(bodyLow)}부터, 하드 구성과 출장 설치까지 ${won(BUY_FROM)}부터(VAT 별도). 통신판매업신고 제2010-대구달서-0190호. 053-588-7119.`,
  alternates: { canonical: "/nas/buy/" },
};

// 판매가 예시. 금액은 src/data/synology.ts 단일 출처에서 계산하므로 여기에 숫자를 적지 않는다.
// (/nas/price/ 의 규모별 견적표와 같은 구성·같은 금액이다)
const buyRows = standardQuotes;

const lowPrice = Math.min(...buyRows.map((r) => r.net));
const highPrice = Math.max(...buyRows.map((r) => r.net));

/** 본체 판매가(VAT 별도). 숫자는 synology.ts 한 곳에서만 가져온다. */
const body = (slug: string) => {
  const p = nasModelBySlug(slug)!.price;
  return p ? won(p) : "별도 견적";
};

const steps = [
  {
    no: "01",
    title: "전화 또는 견적 요청",
    body: `${site.phone.main}로 전화 주시거나 견적 요청을 남겨 주세요. 직원 수, 지금 쓰는 자료량, 도면·영상 같은 큰 파일이 있는지 세 가지만 알려 주시면 모델과 하드 구성을 잡아 드립니다.`,
  },
  {
    no: "02",
    title: "모델·구성 확정과 납품",
    body: "시놀로지 본체와 하드디스크를 정품으로 준비합니다. 사무실에서 조립·사전 검수를 마친 상태로 현장에 가져갑니다. 대구·경북은 직접 방문 납품합니다.",
  },
  {
    no: "03",
    title: "현장 설치와 설정교육",
    body: `설치, RAID 설정, 공유 폴더와 계정 구성, 백업 스케줄 구성, 담당자 1시간 사용 교육까지 출장 설치·설정교육 ${won(INSTALL_FEE)}(VAT 별도)에 들어갑니다.`,
  },
  {
    no: "04",
    title: "A/S와 이후 관리",
    body: "장비에 문제가 생기면 시놀로지 공식 대리점으로 정품 A/S를 진행합니다. 유지관리 계약이나 임대로 관리 중인 거래처는 출장 점검비를 받지 않습니다.",
  },
];

const whyDealer = [
  {
    icon: "📦",
    title: "정품과 정식 보증",
    body: "시놀로지 공식 대리점을 통한 정품입니다. 병행수입품이나 출처가 불분명한 물건과 달리 제조사 보증과 A/S 경로가 그대로 살아 있습니다.",
  },
  {
    icon: "🧩",
    title: "본체와 하드를 같이 맞춥니다",
    body: "NAS는 본체만 사면 쓸 수 없습니다. 하드디스크 용량과 개수, RAID 방식까지 맞춰야 실사용 용량이 나옵니다. 온라인 최저가로 본체만 사고 하드를 잘못 고르면 다시 사야 합니다.",
  },
  {
    icon: "🔧",
    title: "설치와 데이터 이전까지",
    body: "설치, RAID 설정, 공유 폴더와 권한, 백업 스케줄, 기존 자료 이전까지 현장에서 처리합니다. 상자만 받고 직접 설정하다 막히는 일이 없습니다.",
  },
  {
    icon: "🚗",
    title: "장애가 나면 사람이 옵니다",
    body: "대구·경북은 당일 출장을 원칙으로 합니다. 온라인 구매는 문제가 생겼을 때 택배로 보내고 기다려야 하지만, 지역 대리점은 사람이 현장에 갑니다.",
  },
];

const buyVsRent = [
  { item: "초기 비용", buy: `${won(lowPrice)}부터 한 번에(VAT 별도)`, rent: `월 ${won(RENT_FROM)}부터, 초기 목돈 없음` },
  { item: "장비 소유", buy: "회사 자산으로 남습니다", rent: "계약 기간 동안 빌려 쓰는 방식입니다" },
  { item: "하드 고장 시", buy: "디스크를 새로 구매해 교체합니다", rent: "월 정액에 교체가 포함됩니다" },
  { item: "관리", buy: "설치·설정교육은 견적에 포함, 이후 관리는 별도 협의", rent: "백업 관리까지 한별시스템이 맡습니다" },
];

const buyFaq = [
  {
    q: "NAS를 사면 하드디스크도 같이 오나요?",
    a: `본체와 하드디스크를 함께 판매합니다. NAS 본체에는 하드가 들어 있지 않아서 따로 넣어야 하고, 최소 두 개를 묶어야 한 개가 고장 나도 자료가 남습니다. 하드디스크 단가는 4TB ${won(diskPrice("4TB"))}, 8TB ${won(diskPrice("8TB"))}, 16TB ${won(diskPrice("16TB"))}(전부 VAT 별도)이며, 용량과 개수는 실제 자료량을 보고 정해 드립니다.`,
  },
  {
    q: "판매가에 설치비도 포함인가요?",
    a: `이 페이지의 판매가 예시는 본체와 하드디스크 값에 출장 설치·설정교육 ${won(INSTALL_FEE)}(VAT 별도)을 더한 금액입니다. 설치 없이 장비만 납품받는 것도 가능하며 그 경우 설치비는 빠집니다. 다만 랜 배선 상태나 기존 자료 이전량 같은 현장 조건에 따라 작업 범위가 달라지므로 ${site.phone.main}로 확인해 주세요.`,
  },
  {
    q: "세금계산서 발행되나요?",
    a: `됩니다. 한별시스템은 사업자등록번호 ${site.address.bizNo}, 통신판매업신고 ${site.address.mailOrder}를 가진 대구 달서구 소재 사업자입니다. 법인·기관 구매도 세금계산서로 처리하며 표기 금액은 전부 VAT 별도입니다.`,
  },
  {
    q: "보증과 A/S는 어떻게 되나요?",
    a: "시놀로지 공식 대리점을 통한 정품이라 제조사 보증이 그대로 적용됩니다. 보증 기간은 모델마다 달라 구매 전에 해당 모델 기준으로 안내드립니다. 보증 기간이 끝난 뒤에도 점검과 하드디스크 교체는 한별시스템이 계속 맡고, 유지관리 계약이나 임대로 관리 중인 거래처는 출장 점검비를 받지 않습니다.",
  },
  {
    q: "대구 밖 경북이나 다른 지역도 배송·설치가 되나요?",
    a: "됩니다. 대구·경북은 직접 방문해 납품하고 그 자리에서 설치까지 합니다. 그 밖의 지역도 방문 일정을 조율해 진행하며, 경남 창원 사무실에 시놀로지 NAS를 설치하고 이후 서버 관리까지 맡은 사례가 있습니다.",
  },
  {
    q: "중고 NAS나 다른 곳에서 산 NAS도 상담되나요?",
    a: `중고 장비는 판매하지 않습니다. 다만 다른 곳에서 구매하신 NAS도 점검과 설정, 하드디스크 교체는 봐 드립니다. 쓰던 장비를 고쳐서 더 쓸지 새로 사는 편이 나을지부터 판단해 드리니 ${site.phone.main}로 상태를 먼저 말씀해 주세요. 자세한 내용은 NAS 수리·점검 안내에 정리해 두었습니다.`,
  },
];

// 판매 상품 구조화 데이터. 판매가는 위 표와 같은 값이며 전부 VAT 별도다(금액을 고치면 양쪽 같이).
const pageUrl = `${site.url}/nas/buy/`;
const productLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": `${pageUrl}#product`,
  name: "시놀로지 NAS 판매(대구·경북 정품 납품·설치)",
  description:
    "대구 달서구 한별시스템이 시놀로지 공식 대리점으로 판매하는 기업용 NAS. DS225+·DS425+·DS925+·DS1525+·DS1825+·RS2421+ 정품 본체와 하드디스크를 함께 납품하고 RAID 설정, 백업 구성, 현장 설치와 1시간 사용 교육까지 진행한다.",
  brand: { "@type": "Brand", name: "Synology" },
  category: "NAS 스토리지",
  url: pageUrl,
  image: [`${site.url}/og.jpg`],
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "KRW",
    lowPrice,
    highPrice,
    offerCount: buyRows.length,
    availability: "https://schema.org/InStock",
    seller: { "@id": businessId },
    areaServed: [
      { "@type": "City", name: "대구광역시" },
      { "@type": "AdministrativeArea", name: "경상북도" },
    ],
    offers: buyRows.map((r) => ({
      "@type": "Offer",
      name: `${r.model.model} + ${r.cap} ${r.count}개 + 출장 설치·설정교육`,
      priceCurrency: "KRW",
      price: r.net,
      availability: "https://schema.org/InStock",
      seller: { "@id": businessId },
      url: pageUrl,
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "KRW",
        price: r.net,
        valueAddedTaxIncluded: false,
      },
    })),
  },
};

export default function NasBuyPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "NAS 솔루션", path: "/nas/" }, { name: "NAS 판매", path: "/nas/buy/" }])} />
      <JsonLd data={productLd} />
      <PageHeader
        badge="NAS 판매 · SYNOLOGY 공식 대리점"
        title="대구 NAS 판매"
        description="시놀로지 정품 NAS를 판매·납품합니다. 하드 구성부터 설치, A/S까지 한 회사에서."
        back="/nas"
        backLabel="NAS 솔루션"
      />

      <AnswerBlock
        question="대구에서 시놀로지 NAS를 판매하는 곳은 어디인가요?"
        answer={`한별시스템(대구광역시 달서구, 시놀로지 공식 대리점, 통신판매업신고 ${site.address.mailOrder})이 정품 시놀로지 NAS를 판매·납품합니다. 기업 사무실에 가장 많이 들어가는 모델은 DS225+(2베이) ${body("ds225-plus")}, DS425+(4베이) ${body("ds425-plus")}, DS925+(4베이) ${body("ds925-plus")}, DS1525+(5베이) ${body("ds1525-plus")}, DS1825+(8베이) ${body("ds1825-plus")}이고, 1베이 DS124 ${won(bodyLow)}부터 12베이 DS2422+까지 단가표에 있는 본체를 모두 납품합니다. 랙마운트 RS2421+(12베이)는 구성별 별도 견적입니다(전부 본체 기준, VAT 별도). 본체만 파는 것이 아니라 하드디스크 구성과 RAID 설계까지 같이 잡아 드리며, 하드를 포함한 판매가는 직원 5~10명 사무실 기준 DS225+에 4TB 2개를 넣고 출장 설치·설정교육 ${won(INSTALL_FEE)}까지 더해 ${won(lowPrice)}부터입니다(VAT 별도). 목돈이 부담되면 구매 대신 임대도 있습니다. 월 ${won(RENT_FROM)}부터(기본 36개월, VAT 별도)이고 임대료에 장비·설치·백업 관리·장애 출장·하드디스크 교체가 들어갑니다. 대구·경북은 당일 방문하며 문의는 ${site.phone.main}입니다.`}
        facts={[
          { label: "판매 최저 구성", value: `${won(lowPrice)}부터` },
          { label: "본체 최저가", value: `1베이 ${won(bodyLow)}` },
          { label: "출장 설치·교육", value: won(INSTALL_FEE) },
          { label: "자격", value: "시놀로지 공식 대리점" },
          { label: "임대 대안", value: `월 ${won(RENT_FROM)}부터` },
          { label: "문의", value: site.phone.main },
        ]}
      />

      {/* 판매 모델 라인업 */}
      <section className="py-14 lg:py-20 bg-[var(--panel)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">LINE-UP</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-3">판매 모델 라인업</h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-7">
            본체 가격은 시놀로지 권장소비자가 기준이며 전부 VAT 별도입니다. 하드디스크와 출장 설치·설정교육{" "}
            {won(INSTALL_FEE)}은 별도로 더해집니다. 모델명을 눌러 구성별 견적을 확인하세요.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--bg)]">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-hb-primary text-white text-left">
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap">모델</th>
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap">베이·형태</th>
                  <th className="py-3 px-4 font-extrabold text-right whitespace-nowrap">본체 판매가</th>
                  <th className="py-3 px-4 font-extrabold">이런 곳에</th>
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {nasModels.map((m) => (
                  <tr key={m.slug}>
                    <td className="py-3 px-4 font-extrabold whitespace-nowrap">
                      <Link href={`/nas/model/${m.slug}`} className="text-[var(--ink)] hover:text-hb-blue hover:underline">
                        {m.model}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-[var(--mute)] whitespace-nowrap">{m.bayLabel} {m.form}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-hb-blue tabular-nums whitespace-nowrap">
                      {m.price ? won(m.price) : "별도 견적"}
                    </td>
                    <td className="py-3 px-4 text-[var(--mute)] leading-relaxed">{m.fitFor}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Link href={`/nas/model/${m.slug}`} className="text-[12px] font-bold text-hb-blue hover:underline">
                        구성별 견적 →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 개별 단가(본체) - 단가표에 있는 본체를 전부 그대로 공개한다 */}
          <h3 className="text-lg lg:text-xl font-black text-[var(--ink)] mt-10 mb-2">개별 단가 (본체 전체)</h3>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-5">
            위 다섯 모델 외에 단가표에 올라 있는 본체도 같은 조건으로 납품합니다. 전부 VAT 별도
            권장소비자가이며 하드디스크와 출장 설치·설정교육 {won(INSTALL_FEE)}은 별도로 더해집니다.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--bg)]">
            <table className="w-full text-sm min-w-[420px]">
              <thead>
                <tr className="bg-[var(--panel)] text-left">
                  <th className="py-2.5 px-5 font-extrabold text-[var(--ink)] whitespace-nowrap">모델</th>
                  <th className="py-2.5 px-2 font-extrabold text-[var(--ink)] whitespace-nowrap">베이</th>
                  <th className="py-2.5 px-5 font-extrabold text-[var(--ink)] text-right whitespace-nowrap">본체 판매가</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {unitPrices.map((u) => (
                  <tr key={u.model}>
                    <td className="py-2.5 px-5 font-bold whitespace-nowrap">
                      {u.slug ? (
                        <Link href={`/nas/model/${u.slug}`} className="text-[var(--ink)] hover:text-hb-blue hover:underline">
                          {u.model}
                        </Link>
                      ) : (
                        <span className="text-[var(--ink)]">{u.model}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-[12px] text-[var(--mute)] whitespace-nowrap">
                      {u.bayLabel}
                      {u.note ? <span className="block">{u.note}</span> : null}
                    </td>
                    <td className="py-2.5 px-5 text-right font-extrabold text-hb-blue tabular-nums whitespace-nowrap">
                      {won(u.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 하드 포함 판매가 예시 */}
      <section className="py-14 lg:py-20 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">PRICE</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-3">
            하드디스크까지 포함한 판매가 예시
          </h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-7">
            NAS는 본체만으로는 쓸 수 없어서 하드디스크를 함께 넣어야 합니다. 아래는 실제로 가장 많이
            나가는 조합에 출장 설치·설정교육 {won(INSTALL_FEE)}을 더한 금액입니다. 시놀로지 권장소비자가
            기준이며 공급가 변동과 현장 조건에 따라 달라질 수 있습니다.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="bg-hb-primary text-white text-left">
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap">구성</th>
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap">대상</th>
                  <th className="py-3 px-4 font-extrabold text-right whitespace-nowrap">장비</th>
                  <th className="py-3 px-4 font-extrabold text-right whitespace-nowrap">설치·교육</th>
                  <th className="py-3 px-4 font-extrabold text-right whitespace-nowrap">판매가 (VAT 별도)</th>
                  <th className="py-3 px-4 font-extrabold text-right whitespace-nowrap">VAT 포함</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {buyRows.map((r) => (
                  <tr key={`${r.slug}-${r.count}`} className="align-top">
                    <td className="py-3.5 px-4">
                      <span className="font-black text-[var(--ink)]">
                        {r.model.model} + {r.cap} {r.count}개
                      </span>
                      <span className="block text-[11px] text-[var(--mute)] mt-0.5">{r.note}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--ink)]/90">{r.target}</td>
                    <td className="py-3.5 px-4 text-right text-[var(--mute)] tabular-nums whitespace-nowrap">{won(r.gear)}</td>
                    <td className="py-3.5 px-4 text-right text-[var(--mute)] tabular-nums whitespace-nowrap">{won(INSTALL_FEE)}</td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-hb-blue tabular-nums whitespace-nowrap">{won(r.net)}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-[var(--ink)] tabular-nums whitespace-nowrap">{won(r.vat)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-[13px] text-[var(--mute)] leading-relaxed">
            하드디스크 단가(개당, VAT 별도) - {disks.map((d) => `${d.cap} ${won(d.price)}`).join(", ")}.
            용량을 바꾸면 이 값만 달라집니다. 더 많은 구성은{" "}
            <Link href="/nas/price" className="font-bold text-hb-blue hover:underline">
              NAS 구축 비용 페이지
            </Link>
            에 정리해 두었습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={site.phone.mainHref}
              className="inline-flex items-center justify-center bg-hb-blue hover:bg-hb-blue-light text-white font-extrabold text-[15px] px-6 py-3 rounded-xl shadow-lg shadow-hb-blue/30 transition"
            >
              구매 문의 {site.phone.main}
            </a>
            <Link
              href="/support/quote"
              className="inline-flex items-center justify-center border border-[var(--line)] text-[var(--ink)] font-extrabold text-[15px] px-6 py-3 rounded-xl transition hover:border-hb-blue"
            >
              무료 방문 견적 요청 →
            </Link>
          </div>
        </div>
      </section>

      {/* 구매 절차 */}
      <section className="py-14 lg:py-20 bg-[var(--panel)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">PROCESS</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-7">구매 절차</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {steps.map((s) => (
              <div key={s.no} className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-5 lg:p-6">
                <div className="text-2xl font-black text-hb-blue mb-2">{s.no}</div>
                <h3 className="font-extrabold text-[var(--ink)] mb-2">{s.title}</h3>
                <p className="text-[13px] text-[var(--mute)] leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 대리점에서 사는 이유 */}
      <section className="py-14 lg:py-20 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">WHY</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-3">
            온라인 최저가 대신 대리점에서 사는 이유
          </h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-7">
            본체 값만 놓고 보면 인터넷이 쌀 수 있습니다. 다만 회사 자료를 담는 장비라 본체 값만으로
            끝나지 않습니다.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
            {whyDealer.map((w) => (
              <div key={w.title} className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6">
                <div className="text-3xl mb-2">{w.icon}</div>
                <h3 className="font-extrabold text-[var(--ink)] mb-1.5">{w.title}</h3>
                <p className="text-sm text-[var(--mute)] leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 구매 vs 임대 */}
      <section className="py-14 lg:py-20 bg-[var(--panel)]">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">BUY OR RENT</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-3">사는 게 나을까, 빌리는 게 나을까</h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-6">
            어느 쪽이 무조건 낫다고 말씀드리지 않습니다. 초기 목돈과 사내 관리 인력에 따라 답이 다릅니다.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--bg)]">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="bg-hb-primary text-white text-left">
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap">항목</th>
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap">구매</th>
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap">임대</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {buyVsRent.map((r) => (
                  <tr key={r.item}>
                    <td className="py-3 px-4 font-extrabold text-[var(--ink)] whitespace-nowrap">{r.item}</td>
                    <td className="py-3 px-4 text-[var(--ink)]/85 leading-relaxed">{r.buy}</td>
                    <td className="py-3 px-4 text-[var(--mute)] leading-relaxed">{r.rent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-sm text-[var(--mute)] leading-relaxed">
            3년 총액으로 따져 본 비교는{" "}
            <Link href="/guide/nas-buy-vs-rent" className="font-bold text-hb-blue hover:underline">
              NAS 구매와 임대, 3년 기준 비교
            </Link>
            에 표로 정리해 두었습니다.
          </p>
        </div>
      </section>

      <FaqSection title="NAS 구매, 자주 묻는 질문" items={buyFaq} />

      {/* 관련 링크 */}
      <section className="pb-14 lg:pb-20 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-lg lg:text-xl font-extrabold text-[var(--ink)] mb-4">함께 보면 좋은 페이지</h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {[
              { href: "/nas", label: "NAS 솔루션 - 구축 범위와 백업 설계" },
              { href: "/nas/price", label: "NAS 구축 비용 - 규모별 견적표" },
              { href: "/nas/repair", label: "NAS 수리·점검 - 고장 났을 때" },
              { href: "/rental/price", label: "임대료 안내 - NAS 월 10만원부터" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block bg-[var(--panel)] border border-[var(--line)] rounded-xl px-5 py-3.5 text-sm font-semibold text-[var(--ink)] hover:border-hb-blue transition"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 lg:py-20 bg-[var(--panel)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-3">
            어떤 모델을 사야 할지부터 정해 드립니다
          </h2>
          <p className="text-[var(--mute)] leading-relaxed mb-8">
            직원 수와 자료량만 알려 주시면 모델과 하드 구성, 총액을 잡아 드립니다. 대구·경북 당일 방문,
            방문 견적 무료.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={site.phone.mainHref}
              className="inline-flex items-center justify-center gap-2 bg-hb-blue hover:bg-hb-blue-light text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg shadow-hb-blue/30 transition"
            >
              전화 문의 {site.phone.main}
            </a>
            <Link
              href="/support/quote"
              className="inline-flex items-center justify-center gap-2 border border-[var(--line)] text-[var(--ink)] font-bold px-6 py-3.5 rounded-xl hover:bg-[var(--bg)] transition"
            >
              견적 요청하기 →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
