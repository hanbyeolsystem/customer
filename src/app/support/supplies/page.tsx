import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { AnswerBlock } from "@/components/AnswerBlock";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/schema";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "토너·소모품 주문 - 기종만 알려 주시면 맞는 제품으로",
  description:
    "복합기·프린터 토너, 드럼, 잉크 주문 안내. 임대 고객은 카운터 자동 수집으로 토너가 떨어지기 전에 미리 배송되어 주문할 일이 없고, 구매 장비는 기종만 알려 주시면 맞는 제품을 찾아 드립니다. 대구·경북 당일 배송, 053-588-7119.",
  alternates: { canonical: "/support/supplies/" },
};

const steps = [
  { n: "1", t: "기종 확인", d: "복합기 앞면이나 상단에 적힌 모델명(예: TASKalfa 3011i, ECOSYS M8130cidn)을 확인합니다. 모르시면 사진을 찍어 보내 주셔도 됩니다." },
  { n: "2", t: "전화 또는 문자", d: `${site.phone.main}로 전화 주시거나 ${site.phone.mobile}로 모델명과 필요한 색상(검정·파랑·빨강·노랑)을 문자로 보내 주세요.` },
  { n: "3", t: "재고 확인 후 배송", d: "재고가 있으면 당일, 없으면 입고 일정을 바로 알려 드립니다. 대구·경북은 직접 배송하거나 방문 시 함께 가져갑니다." },
  { n: "4", t: "교체", d: "교체 방법을 모르시면 전화로 안내해 드리고, 방문 일정이 있으면 그때 함께 교체해 드립니다." },
];

const kinds = [
  { k: "토너 (레이저 복합기·프린터)", d: "검정 1개 또는 컬러 4색 세트. 인쇄가 흐려지거나 장비에 토너 부족 표시가 뜨면 교체 시점입니다." },
  { k: "드럼 유닛", d: "토너를 갈아도 세로줄이나 얼룩이 남으면 드럼 수명이 다한 경우가 많습니다. 기종에 따라 토너와 일체형인 것도 있습니다." },
  { k: "잉크 (잉크젯·무한잉크)", d: "무한잉크 프린터는 병 단위로 보충합니다. 오래 안 쓰면 헤드가 막히므로 주 1회는 한 장이라도 뽑는 것이 좋습니다." },
  { k: "폐토너통·정착기 등 부품", d: "임대 계약이면 부품 교체가 월 정액에 포함됩니다. 구매 장비는 점검 후 부품 값과 작업 여부를 먼저 안내합니다." },
];

const faq = [
  {
    q: "임대 중인데 토너를 따로 주문해야 하나요?",
    a: "아닙니다. 한별시스템 임대 장비는 카운터를 원격으로 자동 수집하고 있어 토너가 떨어지기 전에 저희가 먼저 보내 드립니다. 급하게 떨어졌다면 전화 주시면 당일 처리합니다. 토너 값은 월 정액에 포함되어 따로 청구되지 않습니다.",
  },
  {
    q: "직접 산 프린터인데 토너만 사도 되나요?",
    a: "됩니다. 기종만 알려 주시면 맞는 제품을 찾아 드립니다. 정품과 호환품 중 어느 쪽이 나은지도 기종과 인쇄량을 보고 말씀드립니다. 호환품은 단가가 낮지만 품질 편차와 장비 부담을 함께 봐야 해서 무조건 권하지는 않습니다.",
  },
  {
    q: "토너를 갈았는데도 인쇄가 흐리거나 줄이 갑니다.",
    a: "토너가 아니라 드럼이나 정착기 문제일 가능성이 높습니다. 증상을 전화로 말씀해 주시면 원격이나 방문으로 확인합니다. 임대 장비는 출장 수리가 월 정액에 포함되고, 구매 장비는 점검 후 비용을 먼저 안내합니다.",
  },
  {
    q: "여분 토너는 어떻게 보관하나요?",
    a: "직사광선과 습기를 피해 상온에 보관하고 밀봉을 뜯지 않은 상태로 두세요. 기종이 여러 대인 사무실은 호환되지 않는 토너를 섞어 쓰지 않도록 기종명을 표시해 두시는 것이 좋습니다.",
  },
];

export default function SuppliesPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "고객지원", path: "/support/" }, { name: "토너·소모품 주문", path: "/support/supplies/" }])} />
      <PageHeader badge="SUPPLIES" title="토너·소모품 주문" description="기종만 알려 주시면 맞는 제품을 찾아 드립니다. 임대 고객은 주문하실 일이 없습니다." back="/support" backLabel="고객지원" />

      <AnswerBlock
        question="복합기 토너는 어떻게 주문하나요?"
        answer={`복합기 앞면의 모델명을 확인하고 ${site.phone.main}로 전화 주시거나 ${site.phone.mobile}로 모델명과 필요한 색상을 문자로 보내 주시면 됩니다. 재고가 있으면 대구·경북은 당일 배송합니다. 한별시스템 임대 장비를 쓰고 계시면 주문하실 필요가 없습니다. 카운터를 원격으로 자동 수집해 토너가 떨어지기 전에 먼저 보내 드리고, 토너 값은 월 정액에 포함되어 따로 청구되지 않습니다. 직접 구매하신 장비도 기종만 알려 주시면 정품과 호환품 중 어느 쪽이 나은지 함께 안내해 드립니다.`}
        facts={[
          { label: "주문", value: site.phone.main },
          { label: "문자", value: site.phone.mobile },
          { label: "대구·경북", value: "당일 배송" },
          { label: "임대 고객", value: "자동 발송" },
        ]}
      />

      <section className="py-12 lg:py-16 bg-[var(--panel)]">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">HOW TO ORDER</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-6">주문 순서</h2>
          <ol className="grid sm:grid-cols-2 gap-4">
            {steps.map((s) => (
              <li key={s.n} className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-5 flex gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-hb-blue text-white font-extrabold grid place-items-center">{s.n}</span>
                <div>
                  <h3 className="font-extrabold text-[var(--ink)] mb-1">{s.t}</h3>
                  <p className="text-sm text-[var(--mute)] leading-relaxed">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={site.phone.mainHref} className="inline-flex items-center justify-center bg-hb-blue hover:bg-hb-azure text-white font-extrabold text-[15px] px-6 py-3 rounded-xl transition">
              전화 주문 {site.phone.main}
            </a>
            <a href={`sms:${site.phone.mobile}`} className="inline-flex items-center justify-center border border-[var(--line)] text-[var(--ink)] font-extrabold text-[15px] px-6 py-3 rounded-xl transition hover:border-hb-blue">
              문자로 모델명 보내기
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">KINDS</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-6">취급 소모품</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {kinds.map((k) => (
              <div key={k.k} className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-5">
                <h3 className="font-extrabold text-[var(--ink)] mb-1.5">{k.k}</h3>
                <p className="text-sm text-[var(--mute)] leading-relaxed">{k.d}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-[var(--mute)] leading-relaxed mt-6">
            토너 비용을 줄이는 방법은 <Link href="/guide/toner-cost-saving" className="text-hb-blue font-bold hover:underline">토너 비용을 줄이는 실제 방법</Link>에,
            임대 시 포함 내역은 <Link href="/rental/price" className="text-hb-blue font-bold hover:underline">복합기 임대료</Link> 페이지에 정리해 두었습니다.
          </p>
        </div>
      </section>

      <FaqSection title="소모품 자주 묻는 질문" items={faq} />
    </>
  );
}
