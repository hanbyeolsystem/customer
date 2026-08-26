import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { FaqSection } from "@/components/FaqSection";
import { AnswerBlock } from "@/components/AnswerBlock";
import { caseStudies } from "@/data/cases";
import { site } from "@/data/site";
import { INSTALL_FEE as INSTALL_FEE_WON, disks as synologyDisks, nasModels, won } from "@/data/synology";
import { JsonLd } from "@/components/JsonLd";
import { monthlyOffer, serviceId, serviceLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "대구 NAS 구축 비용 - 규모별 견적 가이드",
  description:
    "대구 중소기업 NAS 구축 비용을 규모별로 공개합니다. 직원 5~10명 사무실 기준 장비와 출장 설치·설정교육까지 171만원대부터 대용량 구성까지 실제 금액. 금액은 현장 조건과 구성에 따라 달라질 수 있으니 053-588-7119로 전화 확인해 주세요. 초기 비용이 부담되면 월 10만원(VAT 별도)부터 시작하는 NAS 임대도 가능합니다.",
  alternates: { canonical: "/nas/price/" },
};

// 시놀로지 공식 공급 단가표 기준 권장소비자가 + 출장 설치·설정교육 40만원 (VAT 별도). 임의 변경 금지.
const INSTALL_FEE = won(INSTALL_FEE_WON);
const packages = [
  {
    tier: "소규모",
    target: "직원 5~10명 사무실",
    gear: "DS225+ (2베이) + 4TB HDD 2개",
    gearNet: "1,313,000원",
    net: "1,713,000원",
    vat: "1,884,300원",
    note: "가장 많이 나가는 입문 구성",
  },
  {
    tier: "중간",
    target: "직원 10~30명",
    gear: "DS925+ (4베이) + 8TB HDD 2개",
    gearNet: "2,284,000원",
    net: "2,684,000원",
    vat: "2,952,400원",
    note: "베이 2칸을 남겨 두고 나중에 증설",
  },
  {
    tier: "중간+",
    target: "자료량이 많은 10~30명",
    gear: "DS925+ (4베이) + 8TB HDD 4개",
    gearNet: "3,502,000원",
    net: "3,902,000원",
    vat: "4,292,200원",
    note: "처음부터 베이를 다 채우는 구성",
  },
  {
    tier: "대용량",
    target: "건축·설계 등 대용량 업종",
    gear: "DS1825+ (8베이) + 16TB HDD 4개",
    gearNet: "5,999,000원",
    net: "6,399,000원",
    vat: "7,038,900원",
    note: "도면·영상 등 큰 파일이 계속 쌓이는 곳",
  },
];

// 본체·디스크 단가는 src/data/synology.ts 한 곳에서만 관리한다.
const bodies = nasModels
  .filter((m) => m.price)
  .map((m) => ({ model: m.model, bay: m.bayLabel, price: won(m.price!), slug: m.slug }));

const diskRows = synologyDisks.map((d) => ({ cap: d.cap, price: won(d.price) }));

// 임대 조건 (사장님 확정). 임의 변경 금지.
const rentalIncluded = [
  { icon: "🖥", title: "장비", body: "시놀로지 본체와 하드디스크를 한별시스템이 준비해 드립니다. 장비 값을 따로 내지 않습니다." },
  { icon: "🔧", title: "설치와 초기 설정", body: "현장 설치, 공유 폴더와 계정 구성, 직원 사용 교육까지 임대료에 들어갑니다." },
  { icon: "🔁", title: "백업 스케줄 관리", body: "백업이 계속 돌고 있는지 저희가 보고 있습니다. 담당자가 따로 챙기지 않아도 됩니다." },
  { icon: "🚗", title: "장애 시 출장", body: "문제가 생기면 방문합니다. 출장비를 건건이 청구하지 않습니다." },
  { icon: "💽", title: "하드디스크 교체", body: "쓰다가 하드가 고장 나면 저희가 교체합니다. 디스크 값도 추가로 받지 않습니다." },
  { icon: "📅", title: "기본 36개월", body: "기본 계약 기간은 36개월(3년)입니다. 구성이 커지면 월 임대료가 올라갑니다." },
];

const buyVsRent = [
  {
    item: "초기 비용",
    buy: "장비와 출장 설치·설정교육까지 171만원대부터 한 번에",
    rent: "월 10만원부터(VAT 별도), 초기 목돈 없음",
  },
  {
    item: "매월 나가는 돈",
    buy: "없음 (전기료 수준)",
    rent: "월 임대료 10만원부터(VAT 별도), 기본 36개월",
  },
  {
    item: "장비 소유",
    buy: "회사 자산으로 남습니다",
    rent: "계약 기간 동안 빌려 쓰는 방식입니다",
  },
  {
    item: "관리 책임",
    buy: "출장 설치·설정교육(1시간) 40만원이 견적에 포함, 이후 관리는 별도 협의",
    rent: "백업 관리까지 한별시스템이 맡습니다",
  },
  {
    item: "하드디스크 고장 시",
    buy: "디스크를 새로 구매해 교체합니다",
    rent: "월 정액에 교체가 포함됩니다",
  },
  {
    item: "이런 곳에 맞습니다",
    buy: "한 대를 오래 쓰고 자산으로 남기고 싶은 곳",
    rent: "초기 목돈이 부담되고 관리까지 맡기고 싶은 곳",
  },
];

const factors = [
  {
    icon: "💽",
    title: "디스크 용량과 개수",
    body: "전체 비용에서 가장 크게 움직이는 항목입니다. 8TB 하드 1개가 609,000원이라 2개를 더 넣으면 그만큼 합계가 올라갑니다.",
  },
  {
    icon: "🗄",
    title: "베이(하드 꽂는 칸) 수",
    body: "2베이와 4베이는 본체 가격 차이가 있습니다. 지금 자료가 적어도 몇 년 뒤 증설을 생각하면 베이가 넉넉한 쪽이 결과적으로 저렴할 때가 많습니다.",
  },
  {
    icon: "🔁",
    title: "백업 이중화 범위",
    body: "NAS 한 대만 둘지, 외장 저장장치나 클라우드까지 사본을 둘지에 따라 추가 비용이 붙습니다. 3-2-1 원칙을 지키려면 사본이 하나 더 필요합니다.",
  },
  {
    icon: "🔌",
    title: "현장 조건",
    body: "랜 배선 상태, 설치 위치, 기존 자료 이전량 같은 현장 조건에 따라 작업 범위가 달라집니다. 방문해서 보고 정확히 알려 드립니다.",
  },
];

const nasCases = caseStudies.filter((c) =>
  ["bukgu-architect-ds1825", "daegu-office-ds925-hdd", "university-rs2421", "changwon-office-ds925"].includes(c.slug),
);

const relatedQna = [
  { slug: "nas-capacity", label: "NAS 용량은 얼마나 잡아야 하나요? 2베이·4베이 차이는 뭔가요?" },
  { slug: "nas-hdd-count", label: "하드디스크는 처음에 몇 개를 넣어야 하나요?" },
  { slug: "nas-raid", label: "RAID가 뭔가요? 하드 하나가 고장 나면 자료가 다 날아가나요?" },
  { slug: "nas-vs-cloud-cost", label: "구글드라이브·드롭박스를 쓰다가 NAS로 바꾸면 뭐가 좋아지나요?" },
  { slug: "nas-lifespan", label: "NAS는 얼마나 오래 쓰나요? 전기료는 많이 나오나요?" },
  { slug: "nas-process", label: "NAS 도입 절차는 어떻게 되나요? 기간은 얼마나 걸리나요?" },
];

const priceFaq = [
  {
    q: "NAS 구축 비용에 설치비도 포함인가요?",
    a: `포함되어 있습니다. 출장 설치와 설정교육(1시간)이 400,000원(VAT 별도)이고, 위 견적표의 합계에 이 금액이 이미 더해져 있습니다. 현장에서 설치, 초기 설정, 백업 스케줄 구성, 직원 사용 교육까지 진행합니다. 다만 랜 배선 상태, 기존 자료 이전량, 설치 위치 같은 현장 조건에 따라 금액이 달라질 수 있으니 정확한 금액은 ${site.phone.main}로 전화 주셔서 확인해 주세요.`,
  },
  {
    q: "대구 중소기업이 NAS를 구축하면 최소 얼마부터 시작하나요?",
    a: `직원 5~10명 사무실 기준으로 시놀로지 DS225+ 2베이에 4TB 하드 2개를 넣은 구성이 장비 1,313,000원에 출장 설치·설정교육 400,000원을 더해 1,713,000원(VAT 별도), VAT 포함 1,884,300원입니다. 구성과 현장 조건에 따라 달라질 수 있어 ${site.phone.main}로 전화 확인을 권해 드립니다.`,
  },
  {
    q: "표에 적힌 금액이 최종 견적인가요?",
    a: `표의 금액은 시놀로지 권장소비자가 기준 장비 합계에 출장 설치·설정교육 400,000원을 더한 금액입니다. 랜 배선 공사, UPS 추가, 기존 자료 이전 범위 같은 현장 조건이 붙으면 달라질 수 있어 방문 확인 후 최종 견적을 드립니다. 방문 견적은 무료입니다.`,
  },
  {
    q: "하드 용량을 다 쓸 수 있나요?",
    a: "아닙니다. NAS는 하드 하나가 고장 나도 자료가 살아 있도록 RAID로 묶기 때문에 실사용 용량이 디스크 총합보다 작습니다. 예를 들어 4TB 두 개를 미러로 묶으면 실사용은 약 4TB입니다. 디스크 개수와 RAID 방식에 따라 달라지므로 상담 때 구성별로 정확히 계산해 드립니다.",
  },
  {
    q: "클라우드보다 비싼가요?",
    a: "초기 비용은 NAS가 큽니다. 대신 구글드라이브 같은 클라우드는 인원수만큼 월 구독료가 계속 나가는 반면 NAS는 구축 이후 전기료 수준으로 돌아갑니다. 인원이 많고 파일이 클수록 NAS가 유리해집니다.",
  },
  {
    q: "NAS를 구매하지 않고 임대할 수 있나요?",
    a: "됩니다. 월 10만원(VAT 별도)부터 시작하고 기본 계약 기간은 36개월(3년)입니다. 월 임대료 안에 장비, 설치와 초기 설정, 백업 스케줄 관리, 장애 발생 시 출장, 하드디스크 고장 시 교체가 모두 들어갑니다. 복합기 임대에서 토너와 부품, 출장수리가 월 정액에 포함되는 것과 같은 구조입니다. 월 임대료는 구성에 따라 올라가므로 인원과 자료량을 알려 주시면 금액을 잡아 드립니다.",
  },
  {
    q: "임대 중에 하드디스크가 고장 나면 비용이 드나요?",
    a: "들지 않습니다. 임대 계약이면 하드디스크 교체가 월 정액에 포함되어 있어 디스크 값도 출장비도 따로 청구하지 않습니다. 장애가 생기면 저희가 방문해 교체하고 자료를 다시 정상화해 드립니다.",
  },
  {
    q: "대구 외 지역도 시공이 되나요?",
    a: "됩니다. 대구·경북을 중심으로 하지만 창원 사무실에 시놀로지 NAS를 설치하고 이후 서버 관리까지 맡은 사례가 있습니다. 지역이 멀면 방문 일정만 미리 조율합니다.",
  },
];

// 위 packages 표와 같은 금액을 기계가 읽는 형태로 내보낸다(전부 VAT 별도, 시작가).
// 금액을 고치면 packages 배열과 여기 둘 다 고칠 것.
const priceJsonLd = serviceLd({
  id: serviceId("/nas/"),
  url: `${site.url}/nas/`, // 같은 @id 를 쓰므로 서비스 대표 URL 로 통일(가격 페이지는 availableChannel 로)
  name: "대구 NAS 구축 비용",
  serviceType: "NAS 구축 및 데이터 백업 구축",
  description:
    "규모별 시놀로지 NAS 구축 견적. 장비 값에 출장 설치·설정교육(1시간) 400,000원이 포함된 금액이며 전부 VAT 별도다. 초기 비용이 부담되면 월 100,000원부터 임대도 가능하다.",
  channelUrl: `${site.url}/nas/price/`,
  offers: [
    {
      "@type": "Offer",
      name: "소규모 구성 - DS225+ (2베이) + 4TB HDD 2개, 직원 5~10명",
      priceCurrency: "KRW",
      price: 1713000,
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "KRW",
        price: 1713000,
        minPrice: 1713000,
        valueAddedTaxIncluded: false,
      },
    },
    {
      "@type": "Offer",
      name: "중간 구성 - DS925+ (4베이) + 8TB HDD 2개, 직원 10~30명",
      priceCurrency: "KRW",
      price: 2684000,
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "KRW",
        price: 2684000,
        minPrice: 2684000,
        valueAddedTaxIncluded: false,
      },
    },
    {
      "@type": "Offer",
      name: "대용량 구성 - DS1825+ (8베이) + 16TB HDD 4개",
      priceCurrency: "KRW",
      price: 6399000,
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "KRW",
        price: 6399000,
        minPrice: 6399000,
        valueAddedTaxIncluded: false,
      },
    },
    {
      "@type": "Offer",
      name: "출장 설치·설정교육(1시간)",
      priceCurrency: "KRW",
      price: 400000,
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "KRW",
        price: 400000,
        valueAddedTaxIncluded: false,
      },
    },
    monthlyOffer("시놀로지 NAS 임대(기본 36개월)", 100000, "장비·설치·백업 관리·장애 출장·하드디스크 교체 포함"),
  ],
});

export default function NasPricePage() {
  return (
    <>
      <JsonLd data={priceJsonLd} />
      <PageHeader
        badge="NAS PRICE GUIDE · SYNOLOGY 공식 대리점"
        title="대구 NAS 구축 비용"
        description="규모별로 실제 금액을 그대로 공개합니다. 시놀로지 권장소비자가 기준, VAT 별도와 포함을 함께 적었습니다."
        back="/nas"
        backLabel="NAS 솔루션"
      />

      <AnswerBlock
        question="대구에서 중소기업 NAS를 구축하면 비용이 얼마나 드나요?"
        answer={`장비와 설치까지 171만원대부터 시작합니다. 직원 5~10명 사무실에 많이 쓰는 시놀로지 DS225+ 2베이에 4TB 하드 2개 구성이 장비 1,313,000원 + 출장 설치·설정교육 400,000원 = 1,713,000원(VAT 별도, 포함 1,884,300원)이고, 직원 10~30명 규모라면 DS925+ 4베이에 8TB 2개를 넣어 장비 2,284,000원에 설치 400,000원을 더한 2,684,000원(VAT 별도, 포함 2,952,400원) 선입니다. 출장 설치와 설정교육 1시간이 견적에 포함되며, 랜 배선 상태와 자료 이전량 등 현장 조건에 따라 금액이 달라질 수 있으니 정확한 금액은 ${site.phone.main}로 전화 확인해 주세요. 초기 목돈이 부담되면 구매 대신 임대도 됩니다. 임대는 기본 36개월 계약에 월 10만원(VAT 별도)부터이며 임대료 안에 장비와 설치, 백업 관리, 장애 출장, 하드디스크 교체까지 들어갑니다.`}
        facts={[
          { label: "구매 최소 구성", value: "1,713,000원" },
          { label: "임대", value: "월 10만원부터(VAT 별도)" },
          { label: "출장 설치·교육", value: "40만원" },
          { label: "문의", value: site.phone.main },
        ]}
      />

      {/* 규모별 견적 표 */}
      <section className="py-14 lg:py-20 bg-[var(--panel)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">PRICE TABLE</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-3">
            규모별 NAS 구축 견적
          </h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-7">
            시놀로지 권장소비자가 기준 장비 값에 출장 설치·설정교육(1시간) 40만원을 더한 금액입니다.
            하드디스크는 시놀로지 정품(HAT) 기준이며, 금액은 공급가 변동과 현장 조건에 따라 달라질 수 있습니다.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--bg)]">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="bg-hb-primary text-white text-left">
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap">구성</th>
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap">대상</th>
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap">장비</th>
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap text-right">설치·교육</th>
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap text-right">합계 (VAT 별도)</th>
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap text-right">VAT 포함</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((p) => (
                  <tr key={p.tier} className="border-t border-[var(--line)] align-top">
                    <td className="py-3.5 px-4">
                      <span className="font-black text-[var(--ink)]">{p.tier}</span>
                      <span className="block text-[11px] text-[var(--mute)] mt-0.5">{p.note}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--ink)]/90">{p.target}</td>
                    <td className="py-3.5 px-4 text-[var(--ink)]/90">
                      {p.gear}
                      <span className="block text-[11px] text-[var(--mute)] tabular-nums mt-0.5">
                        장비 값 {p.gearNet}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[var(--ink)]/90 tabular-nums whitespace-nowrap">
                      {INSTALL_FEE}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-hb-blue tabular-nums whitespace-nowrap">
                      {p.net}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[var(--ink)] tabular-nums whitespace-nowrap">
                      {p.vat}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 설치비 정책 + 전화 확인 안내 */}
          <div className="mt-7 border-l-4 border-hb-blue bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-6 lg:p-7">
            <h3 className="text-lg lg:text-xl font-black text-[var(--ink)] mb-2">
              정확한 금액은 <span className="text-hb-blue">{site.phone.main}</span>로 전화 확인해 주세요
            </h3>
            <p className="text-[15px] text-[var(--ink)]/90 leading-relaxed font-medium mb-3">
              위 합계에는 출장 설치와 설정교육(1시간) 400,000원이 포함되어 있습니다.
              다만 랜 배선 상태, 기존 자료 이전량, 설치 위치 같은 현장 상황과 구성에 따라 금액이 달라질 수 있습니다.
              표만 보고 판단하지 마시고 전화 주시면 우리 사무실 기준으로 정확히 잡아 드립니다.
            </p>
            <a
              href={site.phone.mainHref}
              className="inline-flex items-center justify-center gap-2 bg-hb-blue hover:bg-hb-blue-light text-white font-extrabold px-5 py-3 rounded-xl shadow-lg shadow-hb-blue/30 transition"
            >
              전화 문의 {site.phone.main}
            </a>
          </div>

          {/* RAID 실사용 용량 안내 */}
          <p className="mt-5 text-[13px] text-[var(--mute)] leading-relaxed">
            참고. NAS는 하드 하나가 고장 나도 자료가 살아 있도록 RAID로 묶기 때문에 실사용 용량이
            디스크 총합보다 작습니다. 예를 들어 4TB 두 개를 미러로 묶으면 실사용은 약 4TB입니다.
            디스크 개수와 RAID 방식에 따라 달라지므로 상담 때 구성별로 정확히 안내해 드립니다.
          </p>
        </div>
      </section>

      {/* NAS 임대 */}
      <section className="py-14 lg:py-20 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">NAS RENTAL</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-3">
            구매 대신 임대로 시작하는 방법
          </h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-7">
            처음에 목돈을 들이기 어렵다면 NAS도 임대로 쓰실 수 있습니다.
            복합기 임대에서 토너와 부품, 출장수리가 월 정액에 들어가는 것과 같은 구조입니다.
            장비만 빌려 드리는 것이 아니라 관리까지 저희가 맡습니다.
          </p>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 lg:p-8 mb-7">
            <div className="flex flex-wrap items-end gap-x-3 gap-y-1 mb-2">
              <span className="text-3xl lg:text-4xl font-black text-hb-blue tabular-nums">월 10만원</span>
              <span className="text-lg font-extrabold text-[var(--ink)]">부터</span>
              <span className="text-sm font-bold text-[var(--mute)]">VAT 별도 · 기본 계약 36개월(3년)</span>
            </div>
            <p className="text-[15px] text-[var(--ink)]/90 leading-relaxed font-medium">
              월 임대료는 구성에 따라 올라갑니다. 인원과 자료량을 알려 주시면 우리 사무실 기준 월 얼마인지 잡아 드립니다.
            </p>
          </div>

          <h3 className="text-lg lg:text-xl font-black text-[var(--ink)] mb-4">
            월 정액에 들어가는 것
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mb-12">
            {rentalIncluded.map((r) => (
              <div key={r.title} className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6">
                <div className="text-3xl mb-2">{r.icon}</div>
                <h4 className="font-extrabold text-[var(--ink)] mb-1.5">{r.title}</h4>
                <p className="text-sm text-[var(--mute)] leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>

          <h3 className="text-lg lg:text-xl font-black text-[var(--ink)] mb-3">
            구매와 임대, 무엇이 다른가요
          </h3>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-5">
            어느 쪽이 무조건 낫다고 말씀드리지 않습니다. 회사 사정에 따라 답이 다릅니다.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="bg-hb-primary text-white text-left">
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap">항목</th>
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap">구매</th>
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap">임대</th>
                </tr>
              </thead>
              <tbody>
                {buyVsRent.map((r) => (
                  <tr key={r.item} className="border-t border-[var(--line)] align-top">
                    <td className="py-3.5 px-4 font-black text-[var(--ink)] whitespace-nowrap">{r.item}</td>
                    <td className="py-3.5 px-4 text-[var(--ink)]/90 leading-relaxed">{r.buy}</td>
                    <td className="py-3.5 px-4 text-[var(--ink)]/90 leading-relaxed">{r.rent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-[13px] text-[var(--mute)] leading-relaxed">
            참고. 임대는 월 10만원(VAT 별도)부터, 기본 계약 기간은 36개월입니다. 총액이 궁금하시면 월 임대료에 개월 수를 곱해 보시면 됩니다.
            구매와 임대 중 어느 쪽이 맞는지 상담 때 회사 상황에 맞춰 같이 따져 드립니다.
          </p>
        </div>
      </section>

      {/* 개별 단가 */}
      <section className="py-14 lg:py-20 bg-[var(--panel)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-3">개별 단가</h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-7">
            본체와 하드디스크를 따로 조합하고 싶을 때 참고하시라고 단가를 그대로 적었습니다.
            모두 VAT 별도 권장소비자가입니다.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] overflow-hidden">
              <div className="px-5 py-3 bg-[var(--panel)] border-b border-[var(--line)] font-extrabold text-[var(--ink)]">
                시놀로지 본체
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {bodies.map((b) => (
                    <tr key={b.model} className="border-t border-[var(--line)] first:border-t-0">
                      <td className="py-2.5 px-5 font-bold whitespace-nowrap">
                        <Link href={`/nas/model/${b.slug}`} className="text-[var(--ink)] hover:text-hb-blue hover:underline">
                          {b.model}
                        </Link>
                      </td>
                      <td className="py-2.5 px-2 text-[12px] text-[var(--mute)] whitespace-nowrap">{b.bay}</td>
                      <td className="py-2.5 px-5 text-right font-extrabold text-hb-blue tabular-nums whitespace-nowrap">
                        {b.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] overflow-hidden">
              <div className="px-5 py-3 bg-[var(--panel)] border-b border-[var(--line)] font-extrabold text-[var(--ink)]">
                하드디스크 (시놀로지 정품 HAT)
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {diskRows.map((d) => (
                    <tr key={d.cap} className="border-t border-[var(--line)] first:border-t-0">
                      <td className="py-2.5 px-5 font-bold text-[var(--ink)] whitespace-nowrap">{d.cap}</td>
                      <td className="py-2.5 px-5 text-right font-extrabold text-hb-blue tabular-nums whitespace-nowrap">
                        {d.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-5 text-[13px] text-[var(--mute)] leading-relaxed">
            위 단가는 장비 값입니다. 여기에 출장 설치·설정교육 40만원(VAT 별도)이 더해집니다.
            구성이 정해지면 {site.phone.main}로 전화 주시면 합계를 바로 알려 드립니다.
          </p>
        </div>
      </section>

      {/* 비용에 영향을 주는 요소 */}
      <section className="py-14 lg:py-20 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-8">
            비용을 좌우하는 것들
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
            {factors.map((f) => (
              <div key={f.title} className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6">
                <div className="text-3xl mb-2">{f.icon}</div>
                <h3 className="font-extrabold text-[var(--ink)] mb-1.5">{f.title}</h3>
                <p className="text-sm text-[var(--mute)] leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 실제 구축 사례 */}
      <section className="py-14 lg:py-20 bg-[var(--panel)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-3">
            이 금액대로 실제 설치한 현장
          </h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-8">
            표만 보면 감이 안 오실 수 있어 실제 시공 현장을 함께 놓았습니다.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {nasCases.map((c) => (
              <Link
                key={c.slug}
                href={`/cases/${c.slug}`}
                className="bg-[var(--bg)] border border-[var(--line)] rounded-3xl overflow-hidden hover:border-hb-blue transition"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={c.images[0]}
                    alt={c.title}
                    fill
                    sizes="(min-width:1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-hb-primary/85 text-white text-[10px] font-extrabold tracking-[.15em] px-2.5 py-1 rounded-full">
                    {c.industry}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-extrabold text-[var(--ink)] leading-tight mb-2">{c.title}</h3>
                  <p className="text-[13px] text-[var(--mute)] leading-relaxed mb-3">{c.summary}</p>
                  <div className="text-[12px] font-semibold text-hb-blue">{c.region} · {c.gear[0]}</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 border border-[var(--line)] text-[var(--ink)] font-bold px-6 py-3 rounded-xl hover:bg-[var(--panel)] transition"
            >
              구축 사례 전체 보기 →
            </Link>
          </div>
        </div>
      </section>

      <FaqSection title="NAS 구축 비용, 자주 묻는 질문" items={priceFaq} />

      {/* 관련 Q&A */}
      <section className="pb-14 lg:pb-20 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-lg lg:text-xl font-extrabold text-[var(--ink)] mb-4">관련 Q&amp;A</h2>
          <ul className="space-y-2">
            {relatedQna.map((q) => (
              <li key={q.slug}>
                <Link
                  href={`/qna/${q.slug}`}
                  className="block bg-[var(--panel)] border border-[var(--line)] rounded-xl px-5 py-3.5 text-sm font-semibold text-[var(--ink)] hover:border-hb-blue transition"
                >
                  {q.label}
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
            우리 사무실은 얼마나 나올까요
          </h2>
          <p className="text-[var(--mute)] leading-relaxed mb-8">
            직원 수와 지금 쓰는 자료량만 알려 주시면 구성과 금액을 잡아 드립니다.
            대구·경북은 방문해서 직접 보고 견적을 냅니다. 견적은 무료입니다.
          </p>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-8">
            새로 도입하는 게 아니라 쓰던 NAS가 고장 난 상황이라면{" "}
            <Link href="/nas/repair" className="font-bold text-hb-blue hover:underline">
              NAS 수리·점검 안내
            </Link>
            를 봐 주세요. 복합기·프린터 쪽 월 임대료는{" "}
            <Link href="/rental/price" className="font-bold text-hb-blue hover:underline">
              복합기·프린터 임대료
            </Link>
            에 품목별로 정리해 두었습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={site.phone.mainHref}
              className="inline-flex items-center justify-center gap-2 bg-hb-blue hover:bg-hb-blue-light text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg shadow-hb-blue/30 transition"
            >
              전화 상담 {site.phone.main}
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
