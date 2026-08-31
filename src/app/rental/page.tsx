import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { UpdatedAt } from "@/components/UpdatedAt";
import { FaqSection } from "@/components/FaqSection";
import { AnswerBlock } from "@/components/AnswerBlock";
import { JsonLd } from "@/components/JsonLd";
import Image from "next/image";
import { monthlyOffer, serviceId, serviceLd } from "@/lib/schema";
import { site } from "@/data/site";
import {
  breadcrumbLd,
  webPageLd,
  daeguDistricts,
  daeguGyeongbukServed,
  gyeongbukCities,
} from "@/lib/schema";

// 실제 시공 현장 사진. 구축사례(src/data/cases.ts)의 원문 후기에 근거가 있는 현장만 쓴다.
// 사진만 붙이지 않고 그 현장에서 무엇을 판단했는지 설명과 함께 둔다.
const rentalShots = [
  {
    src: "/cases/daegu-suseong-kyocera-2set-1.webp",
    w: 966,
    h: 493,
    alt: "대구 수성구 사무실에 설치한 교세라 TASKalfa 흑백·컬러 복합기 2대",
    slug: "daegu-suseong-kyocera-2set",
    caption:
      "대구 수성구 사무실입니다. 흑백과 컬러를 한 대로 몰면 대기 줄이 생기기 때문에 TASKalfa 3011i(흑백)와 3552ci(컬러)로 나눠 넣었습니다. 대형 복합기는 자리를 많이 차지해서 설치 위치는 인쇄하러 오가는 동선을 먼저 그려 보고 정합니다.",
  },
  {
    src: "/cases/bukgu-office-vfm251ci-1.webp",
    w: 966,
    h: 524,
    alt: "대구 북구 사무실에 설치한 교세라 TASKalfa VFM251ci 복합기와 터치 패널",
    slug: "bukgu-office-vfm251ci",
    caption:
      "대구 북구 사무실의 TASKalfa VFM251ci입니다. 복합기는 사무실 크기가 아니라 월 인쇄량으로 고릅니다. 인쇄량이 적은데 빠른 기종을 넣으면 임대료만 더 나가기 때문에, 방문해서 사용 인원과 출력량을 먼저 확인한 뒤 기종을 제안합니다.",
  },
];

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

// 서비스 엔티티 + 대표 월 임대료. 금액은 /rental/price/ 와 반드시 일치시킬 것.
const serviceJsonLd = serviceLd({
  id: serviceId("/rental/"),
  url: `${site.url}/rental/`,
  name: "복합기·프린터 렌탈(임대)",
  serviceType: "복합기·프린터 렌탈",
  description:
    "흑백 복사기 월 70,000원부터, 컬러 복사기 월 100,000원부터(VAT 별도). 월 정액 하나로 토너 등 소모품, 부품 교체, 출장 수리, 분기 정기점검이 모두 포함된다. 설치·운영 300대 이상, 대구·경북 당일 출동.",
  channelUrl: `${site.url}/rental/price/`,
  // 아래 "서비스 지역" 섹션에 적은 구·군 목록과 같은 출처를 쓴다(schema.ts).
  areaServed: daeguGyeongbukServed,
  offers: [
    monthlyOffer("흑백 복사기(흑백 디지털복합기) 렌탈", 70000, "복사·스캔·팩스를 같이 쓰는 일반 사무실"),
    monthlyOffer("컬러 복사기(컬러 디지털복합기) 렌탈", 100000, "컬러 자료와 제안서를 자주 뽑는 곳"),
    monthlyOffer("흑백 레이저 프린터 렌탈", 30000, "인쇄만 하는 소량 사무실"),
  ],
});

// 페이지 갱신일(WebPage.dateModified). 날짜 출처는 사이트맵 lastmod 와 같은 git 커밋 날짜.
const pageJsonLd = webPageLd({
  path: "/rental/",
  name: "복합기·복사기 렌탈(임대)",
  mainEntityId: serviceId("/rental/"),
});

export default function RentalPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "복합기 렌탈", path: "/rental/" }])} />
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={pageJsonLd} />
      <PageHeader
        badge="RENTAL CARE"
        title="복사기 · 프린터 임대 케어"
        description="유지보수·토너·정기점검 모두 포함. 비포서비스(BEFORE SERVICE) - 문제가 생기기 전에 한별이 먼저 갑니다."
      />
      <UpdatedAt path="/rental/" note="월 임대료와 포함 범위 기준일입니다. VAT 별도." />
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
      {/* 실제 설치 현장 - 사진과 그때의 판단을 같이 둔다 */}
      <section className="py-12 lg:py-16 bg-[var(--panel)] border-y border-[var(--line)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">INSTALL</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] tracking-tight mb-3">
            실제로 이렇게 설치합니다
          </h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-8 max-w-3xl">
            기종만 정해서 놓고 가는 것이 아니라, 인쇄량을 먼저 확인하고 자리를 잡고 선정리와 테스트
            인쇄까지 마친 뒤 넘겨 드립니다. 아래는 실제 현장 사진이며 각 현장의 전체 기록은 구축 사례에
            정리해 두었습니다.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
            {rentalShots.map((s) => (
              <figure key={s.src} className="m-0">
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={s.w}
                  height={s.h}
                  sizes="(min-width:640px) 50vw, 100vw"
                  className="w-full h-auto rounded-2xl border border-[var(--line)]"
                />
                <figcaption className="text-[13.5px] text-[var(--ink)]/85 leading-relaxed mt-3">
                  {s.caption}{" "}
                  <Link href={`/cases/${s.slug}`} className="font-bold text-hb-blue hover:underline">
                    이 현장 자세히 보기 →
                  </Link>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 서비스 지역 - 스키마 areaServed 와 같은 목록 */}
      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">SERVICE AREA</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] tracking-tight mb-3">
            복합기 임대 서비스 지역
          </h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-7 max-w-3xl">
            본사가 대구광역시 달서구에 있어 대구 전 지역은 당일 출동을 원칙으로 합니다. 경상북도 주요
            도시는 당일 또는 1영업일, 그 밖의 전국은 1영업일 안에 방문합니다. 토너 배송과 정기점검도
            같은 기준으로 돕니다.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
            <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6">
              <h3 className="font-extrabold text-[var(--ink)] mb-1">대구광역시 전 지역</h3>
              <p className="text-[12px] text-[var(--mute)] mb-3">7구 2군 · 당일 출동</p>
              <ul className="flex flex-wrap gap-1.5">
                {daeguDistricts.map((d) => (
                  <li
                    key={d}
                    className="text-[12.5px] font-semibold text-[var(--ink)]/85 bg-[var(--bg)] border border-[var(--line)] rounded-lg px-2.5 py-1"
                  >
                    {d}
                  </li>
                ))}
              </ul>
              <p className="text-[13px] text-[var(--mute)] leading-relaxed mt-4">
                달서구·성서공단은 본사에서 가장 가까워 가장 빠르게 움직입니다.
              </p>
            </div>
            <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6">
              <h3 className="font-extrabold text-[var(--ink)] mb-1">경상북도 주요 도시</h3>
              <p className="text-[12px] text-[var(--mute)] mb-3">당일 ~ 1영업일</p>
              <ul className="flex flex-wrap gap-1.5">
                {gyeongbukCities.map((c) => (
                  <li
                    key={c}
                    className="text-[12.5px] font-semibold text-[var(--ink)]/85 bg-[var(--bg)] border border-[var(--line)] rounded-lg px-2.5 py-1"
                  >
                    {c}
                  </li>
                ))}
              </ul>
              <p className="text-[13px] text-[var(--mute)] leading-relaxed mt-4">
                경북 예천·안동, 경남 창원까지 실제로 다녀온 현장 기록이{" "}
                <Link href="/cases" className="font-bold text-hb-blue hover:underline">
                  구축 사례
                </Link>
                에 있습니다. 목록에 없는 지역도 전화 주시면 일정을 잡아 드립니다.
              </p>
            </div>
          </div>
          <p className="text-sm text-[var(--mute)] leading-relaxed mt-6">
            지역과 관계없이 카운터는 원격으로 자동 수집하기 때문에, 토너가 떨어지기 전에 먼저 챙기는
            것은 어느 지역이든 같습니다. 지역별 방문 일정은{" "}
            <a href={site.phone.mainHref} className="font-bold text-hb-blue hover:underline">
              {site.phone.main}
            </a>
            로 문의해 주세요.
          </p>
        </div>
      </section>

      <FaqSection title="복사기 임대, 자주 묻는 질문" items={rentalFaq} />
    </>
  );
}
