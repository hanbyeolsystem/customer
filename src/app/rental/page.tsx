import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { FaqSection } from "@/components/FaqSection";
import { AnswerBlock } from "@/components/AnswerBlock";

const rentalFaq = [
  {
    q: "복사기는 임대와 구매 중 뭐가 유리한가요?",
    a: "출력량이 있는 사무실은 대부분 임대가 유리합니다. 임대는 초기 구입비 없이 월 정액으로 시작하고, 토너·부품·출장 수리·정기점검이 모두 요금에 포함되어 고장이 나도 추가 비용이 없습니다. 구매는 기기값 외에 소모품과 수리비를 매번 따로 부담해야 합니다.",
  },
  {
    q: "복사기 임대료는 월 얼마이고 무엇이 포함되나요?",
    a: "흑백 복사기(흑백 디지털복합기)가 월 70,000원부터, 컬러 복사기(컬러 디지털복합기)가 월 100,000원부터입니다(VAT 별도). 토너 등 소모품, 부품 교체, 출장 수리, 분기별 정기점검이 월 정액에 모두 포함됩니다. 출력량은 카운터 자동 수집으로 원격 파악되며, 기기 등급과 월 출력량에 따라 요금이 달라집니다. 품목별 임대료는 복합기·프린터 임대료 페이지에 정리해 두었고, 견적은 무료입니다.",
  },
  {
    q: "복사기가 고장 나면 얼마나 빨리 오나요?",
    a: "대구·경북은 당일, 전국은 1영업일 이내에 출동합니다. 카운터 자동 수집과 분기 정기점검으로 문제가 생기기 전에 먼저 정비하는 비포서비스를 운영해, 평균 다운타임을 90% 줄였습니다.",
  },
  {
    q: "토너가 떨어지면 직접 주문해야 하나요?",
    a: "아닙니다. 카운터 자동 수집으로 토너 잔량과 출력량을 원격에서 파악해, 소진되기 전에 미리 배송·교체합니다. 임대 고객은 토너를 따로 주문하거나 구매할 필요가 없습니다.",
  },
  {
    q: "어느 지역까지 임대가 가능한가요?",
    a: "대구·경북을 중심으로 전국 대응이 가능합니다. 현재 300대 이상의 복사기·프린터를 설치·운영 중이며, 19년째 기업 사무기기를 관리해 온 한별시스템이 직접 유지보수합니다.",
  },
];

export const metadata: Metadata = {
  title: "복합기·복사기 렌탈(임대) - 대구 프린터 렌탈",
  description: "대구 복합기 렌탈·프린터 렌탈. 흑백 복사기 월 7만원부터, 컬러 복사기 월 10만원부터(VAT 별도). 토너 교체·부품·출장수리 포함 월 정액. 카운터 자동 수집·사전 정비·대구 당일 출동.",
  alternates: { canonical: "/rental/" },
};

export default function RentalPage() {
  return (
    <>
      <PageHeader
        badge="RENTAL CARE"
        title="복사기 · 프린터 임대 케어"
        description="유지보수·토너·정기점검 모두 포함. 비포서비스(BEFORE SERVICE) - 문제가 생기기 전에 한별이 먼저 갑니다."
      />
      <AnswerBlock
        question="대구에서 복합기 임대(렌탈)를 맡기면 월 얼마이고 무엇이 포함되나요?"
        answer="흑백 복사기(흑백 디지털복합기)는 월 7만원부터, 컬러 복사기(컬러 디지털복합기)는 월 10만원부터입니다(VAT 별도). 이 월 정액 하나에 토너 등 소모품, 부품 교체, 출장 수리, 분기별 정기점검이 전부 포함되어 초기 구입비가 없고 고장이 나도 추가 비용이 붙지 않습니다. 대구광역시 달서구에 본사를 둔 한별시스템은 2008년부터 복합기·프린터 300대 이상을 설치·운영해 왔고, 대구·경북은 당일, 전국은 1영업일 안에 출동합니다. 기종과 출력량에 따라 금액이 달라지므로 정확한 금액은 053-588-7119로 전화 확인해 주세요."
        facts={[
          { label: "흑백 복사기", value: "월 7만원부터" },
          { label: "컬러 복사기", value: "월 10만원부터" },
          { label: "포함", value: "토너·부품·출장" },
          { label: "문의", value: "053-588-7119" },
        ]}
      />

      {/* 임대료 페이지로 유도 */}
      <section className="pt-2 pb-4 lg:pb-6 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <Link
            href="/rental/price"
            className="block border-l-4 border-hb-blue bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 lg:p-7 hover:border-hb-blue transition"
          >
            <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">
              PRICE
            </div>
            <h2 className="text-xl lg:text-2xl font-black text-[var(--ink)] mb-2">
              월 임대료를 품목별로 공개했습니다
            </h2>
            <p className="text-[15px] text-[var(--ink)]/90 leading-relaxed font-medium">
              흑백 레이저 프린터 월 3만원부터, 흑백 복사기 월 7만원부터, 컬러 복사기 월 10만원부터
              (VAT 별도). 데스크탑·모니터 세트와 시놀로지 NAS 임대료까지 표로 정리했습니다.
            </p>
            <span className="inline-block mt-3 font-extrabold text-hb-blue">
              복합기·프린터 임대료 보기 →
            </span>
          </Link>
        </div>
      </section>
      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 grid sm:grid-cols-2 gap-4 lg:gap-5">
          {[
            { icon: "📊", title: "카운터 자동 수집", body: "원격에서 출력량을 실시간 파악, 토너·드럼 사전 교체." },
            { icon: "🛠", title: "유지보수 풀패키지", body: "월 정액에 출장·부품·소모품 모두 포함." },
            { icon: "🚚", title: "전국 당일 출동",   body: "대구·경북은 당일, 전국은 1영업일 내 대응." },
            { icon: "📋", title: "분기별 정기점검",  body: "예방정비로 평균 다운타임 90% 감소." },
          ].map((c) => (
            <div key={c.title} className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6">
              <div className="text-3xl mb-2">{c.icon}</div>
              <h3 className="font-extrabold text-[var(--ink)] mb-1.5">{c.title}</h3>
              <p className="text-sm text-[var(--mute)] leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
        <div className="max-w-5xl mx-auto px-4 lg:px-6 mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/rental/price" className="inline-flex items-center justify-center gap-2 bg-hb-blue text-white font-extrabold px-6 py-3.5 rounded-xl">월 임대료 보기 →</Link>
          <Link href="/shop" className="inline-flex items-center justify-center gap-2 border border-[var(--line)] text-[var(--ink)] font-bold px-6 py-3.5 rounded-xl hover:bg-[var(--panel)]">임대 쇼핑몰 보기 →</Link>
          <Link href="/support/quote" className="inline-flex items-center justify-center gap-2 border border-[var(--line)] text-[var(--ink)] font-bold px-6 py-3.5 rounded-xl hover:bg-[var(--panel)]">견적 요청</Link>
        </div>
      </section>
      <FaqSection title="복사기 임대, 자주 묻는 질문" items={rentalFaq} />
    </>
  );
}
