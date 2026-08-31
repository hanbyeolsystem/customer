import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { UpdatedAt } from "@/components/UpdatedAt";
import { FaqSection } from "@/components/FaqSection";
import { AnswerBlock } from "@/components/AnswerBlock";
import { site } from "@/data/site";
import { JsonLd } from "@/components/JsonLd";
import { monthlyOffer, serviceId, serviceLd } from "@/lib/schema";
import { breadcrumbLd, webPageLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "대구 복합기 임대료 - 월 얼마인지 가격 공개",
  description:
    "대구 복합기·프린터 월 임대료 공개. 흑백 복사기 7만원, 컬러 복사기 10만원, 흑백 레이저 프린터 3만원부터(VAT 별도). 토너·부품·출장 수리·분기 점검 포함. 053-588-7119.",
  alternates: { canonical: "/rental/price/" },
};

// 사장님 확정 월 임대료. 전부 "부터" 가격이며 VAT 별도. 임의 변경 금지.
// NAS 월 10만원은 /nas/price/ 게시 금액과 반드시 일치시킬 것.
const prices = [
  {
    item: "흑백 레이저 프린터",
    price: "월 30,000원부터",
    note: "인쇄만 하는 소량 사무실",
  },
  {
    item: "잉크젯 무한 프린터",
    price: "월 40,000원부터",
    note: "컬러 출력이 필요하고 장수가 많지 않은 곳",
  },
  {
    item: "컬러 레이저 프린터",
    price: "월 50,000원부터",
    note: "컬러 인쇄가 잦고 속도가 필요한 곳",
  },
  {
    item: "흑백 복사기 (흑백 디지털복합기)",
    price: "월 70,000원부터",
    note: "복사·스캔·팩스를 같이 쓰는 일반 사무실",
  },
  {
    item: "컬러 복사기 (컬러 디지털복합기)",
    price: "월 100,000원부터",
    note: "컬러 자료와 제안서를 자주 뽑는 곳",
  },
  {
    item: "데스크탑 + 모니터 세트",
    price: "월 40,000원부터",
    note: "데스크탑 35,000원 + 모니터 5,000원",
  },
  {
    item: "시놀로지 NAS",
    price: "월 100,000원부터",
    note: "기본 계약 36개월, 백업 관리까지 포함",
    href: "/nas/price/",
    hrefLabel: "NAS 임대 상세 보기",
  },
];

const included = [
  {
    icon: "🖨",
    title: "토너 등 소모품",
    body: "토너와 드럼 같은 소모품 값을 따로 받지 않습니다. 카운터를 원격으로 보고 있어 떨어지기 전에 미리 보내 드립니다.",
  },
  {
    icon: "🔧",
    title: "부품 교체",
    body: "쓰다가 닳는 부품은 저희가 교체합니다. 부품값을 건건이 청구하지 않습니다.",
  },
  {
    icon: "🚗",
    title: "출장 수리",
    body: "고장이 나면 방문해서 고칩니다. 출장비를 따로 받지 않습니다. 대구·경북은 당일, 전국은 1영업일 안에 갑니다.",
  },
  {
    icon: "📋",
    title: "분기 정기점검",
    body: "분기마다 정기점검을 돌면서 문제가 생기기 전에 먼저 정비합니다.",
  },
];

const guide = [
  {
    title: "인쇄만 하고 장수가 적다면",
    pick: "흑백 레이저 프린터 (월 30,000원부터)",
    body: "문서 출력만 하고 복사·스캔·팩스를 거의 쓰지 않는다면 복합기까지 갈 필요가 없습니다. 가장 부담이 적은 구성입니다.",
  },
  {
    title: "컬러가 필요한데 장수는 많지 않다면",
    pick: "잉크젯 무한 프린터 (월 40,000원부터)",
    body: "컬러 출력이 가끔 필요한 정도라면 잉크젯 무한 방식이 무난합니다. 다만 출력량이 많아지면 속도에서 답답할 수 있습니다.",
  },
  {
    title: "컬러 인쇄가 잦고 빨라야 한다면",
    pick: "컬러 레이저 프린터 (월 50,000원부터)",
    body: "제안서나 사진이 섞인 자료를 자주 뽑는다면 레이저 쪽이 속도와 유지비에서 유리합니다.",
  },
  {
    title: "복사·스캔·팩스를 같이 쓴다면",
    pick: "디지털복합기 (흑백 월 70,000원부터, 컬러 월 100,000원부터)",
    body: "한 대로 인쇄·복사·스캔·팩스를 다 해결하는 사무실 표준 장비입니다. 컬러 자료가 별로 없으면 흑백으로 충분하고, 컬러 출력이 업무에 들어가면 컬러 복합기를 권합니다.",
  },
  {
    title: "직원 PC까지 같이 준비해야 한다면",
    pick: "데스크탑 + 모니터 세트 (월 40,000원부터)",
    body: "신규 입사자 자리나 사무실을 새로 여는 경우 PC도 임대로 맞출 수 있습니다. 데스크탑 35,000원에 모니터 5,000원을 더한 구성입니다.",
  },
  {
    title: "회사 자료를 한곳에 모아야 한다면",
    pick: "시놀로지 NAS (월 100,000원부터)",
    body: "공유 폴더와 백업을 제대로 잡으려면 NAS 쪽입니다. 기본 계약 36개월이고 장비, 설치, 백업 관리, 장애 출장, 하드 교체가 임대료에 들어갑니다.",
  },
];

const priceFaq = [
  {
    q: "대구 복합기 임대 월 얼마인가요?",
    a: `흑백 복사기(흑백 디지털복합기)가 월 70,000원부터, 컬러 복사기(컬러 디지털복합기)가 월 100,000원부터입니다(VAT 별도). 프린터만 필요하시면 흑백 레이저 월 30,000원부터, 잉크젯 무한 월 40,000원부터, 컬러 레이저 월 50,000원부터입니다. 기종과 월 출력량, 현장 조건에 따라 금액이 달라지므로 정확한 금액은 ${site.phone.main}로 전화 확인해 주세요.`,
  },
  {
    q: "토너값은 따로 내나요?",
    a: "따로 내지 않습니다. 토너 등 소모품, 부품 교체, 출장 수리, 분기 정기점검이 월 정액에 모두 들어갑니다. 카운터를 원격으로 자동 수집하고 있어 토너가 떨어지기 전에 저희가 먼저 보내 드리므로 따로 주문하실 일도 없습니다.",
  },
  {
    q: "계약 기간이 어떻게 되나요?",
    a: `기종과 구성에 따라 계약 조건이 달라져서 이 자리에서 일률적으로 몇 개월이라고 말씀드리기는 어렵습니다. ${site.phone.main}로 전화 주시면 쓰실 장비와 출력량에 맞춰 계약 조건을 안내해 드립니다. 참고로 시놀로지 NAS 임대는 기본 36개월입니다.`,
  },
  {
    q: "고장 나면 출장비를 따로 받나요?",
    a: "받지 않습니다. 출장 수리가 월 정액에 포함되어 있어 고장이 나도 추가 비용이 붙지 않습니다. 대구·경북은 당일, 전국은 1영업일 안에 출동하며, 분기 정기점검으로 문제가 생기기 전에 먼저 정비하는 비포서비스를 함께 운영합니다.",
  },
  {
    q: "대구 외 지역도 되나요?",
    a: "됩니다. 대구·경북을 중심으로 하되 전국 대응이 가능합니다. 대구·경북은 당일, 그 외 지역은 1영업일 안에 출동합니다. 현재 복사기·프린터 300대 이상을 설치·운영 중입니다.",
  },
  {
    q: "컴퓨터도 같이 임대되나요?",
    a: "됩니다. 데스크탑과 모니터를 묶어 월 40,000원부터(데스크탑 35,000원 + 모니터 5,000원, VAT 별도) 임대하실 수 있습니다. 복합기와 PC를 한 회사에서 관리하면 장애가 났을 때 어느 쪽 문제인지 고객이 가릴 필요 없이 전화 한 통으로 끝납니다.",
  },
];

// 위 prices 배열과 같은 금액을 기계가 읽는 형태로도 내보낸다.
// AI 검색·구글이 "대구 복합기 임대료 얼마" 질문에 이 값을 그대로 인용할 수 있게 하는 것이 목적.
// @id 가 /rental/ 서비스와 같으므로 두 페이지 선언이 하나의 서비스 엔티티로 합쳐진다.
const priceJsonLd = serviceLd({
  id: serviceId("/rental/"),
  url: `${site.url}/rental/`, // 같은 @id 를 쓰므로 서비스 대표 URL 로 통일(가격 페이지는 availableChannel 로)
  name: "복합기·프린터 렌탈(임대) 월 임대료",
  serviceType: "복합기·프린터 렌탈",
  description:
    "품목별 월 임대료(전부 시작가, VAT 별도). 월 정액에 토너 등 소모품, 부품 교체, 출장 수리, 분기 정기점검이 모두 포함된다.",
  channelUrl: `${site.url}/rental/price/`,
  offers: [
    monthlyOffer("흑백 레이저 프린터 렌탈", 30000, "인쇄만 하는 소량 사무실"),
    monthlyOffer("잉크젯 무한 프린터 렌탈", 40000, "컬러 출력이 필요하고 장수가 많지 않은 곳"),
    monthlyOffer("컬러 레이저 프린터 렌탈", 50000, "컬러 인쇄가 잦고 속도가 필요한 곳"),
    monthlyOffer("흑백 복사기(흑백 디지털복합기) 렌탈", 70000, "복사·스캔·팩스를 같이 쓰는 일반 사무실"),
    monthlyOffer("컬러 복사기(컬러 디지털복합기) 렌탈", 100000, "컬러 자료와 제안서를 자주 뽑는 곳"),
    monthlyOffer("데스크탑 + 모니터 세트 렌탈", 40000, "데스크탑 35,000원 + 모니터 5,000원"),
    monthlyOffer("시놀로지 NAS 임대", 100000, "기본 계약 36개월, 백업 관리 포함"),
  ],
});

// 페이지 갱신일(WebPage.dateModified). 날짜 출처는 사이트맵 lastmod 와 같은 git 커밋 날짜.
const pageJsonLd = webPageLd({
  path: "/rental/price/",
  name: "복합기·프린터 월 임대료",
  // 이 페이지의 Service 선언은 /rental/ 과 같은 @id 를 쓴다(위 priceJsonLd 참고).
  mainEntityId: serviceId("/rental/"),
});

export default function RentalPricePage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "복합기 렌탈", path: "/rental/" }, { name: "월 임대료", path: "/rental/price/" }])} />
      <JsonLd data={priceJsonLd} />
      <JsonLd data={pageJsonLd} />
      <PageHeader
        badge="RENTAL PRICE GUIDE"
        title="대구 복합기·프린터 임대료"
        description="월 임대료를 품목별로 그대로 공개합니다. 모두 VAT 별도이며 구성과 출력량에 따라 달라집니다."
        back="/rental"
        backLabel="임대 케어"
      />
      <UpdatedAt path="/rental/price/" note="품목별 월 임대료 기준일입니다. VAT 별도." />

      <AnswerBlock
        question="대구에서 복합기 임대하면 월 얼마인가요?"
        answer={`흑백 복사기(흑백 디지털복합기)는 월 70,000원부터, 컬러 복사기(컬러 디지털복합기)는 월 100,000원부터입니다(VAT 별도). 프린터만 쓰신다면 흑백 레이저 월 30,000원부터, 잉크젯 무한 월 40,000원부터, 컬러 레이저 월 50,000원부터이고, 데스크탑과 모니터 세트는 월 40,000원부터, 시놀로지 NAS는 월 100,000원부터입니다. 이 월 정액 하나에 토너 등 소모품, 부품 교체, 출장 수리, 분기 정기점검이 전부 들어가서 고장이 나도 추가 비용이 붙지 않습니다. 대구광역시 달서구에 있는 한별시스템이 2008년부터 복합기·프린터 300대 이상을 설치·운영해 왔고 대구·경북은 당일 출동합니다. 기종과 월 출력량, 현장 조건에 따라 금액이 달라지므로 정확한 금액은 ${site.phone.main}로 전화 확인해 주세요.`}
        facts={[
          { label: "흑백 복사기", value: "월 7만원부터" },
          { label: "컬러 복사기", value: "월 10만원부터" },
          { label: "포함", value: "토너·부품·출장" },
          { label: "문의", value: site.phone.main },
        ]}
      />

      {/* 월 임대료 표 */}
      <section className="py-14 lg:py-20 bg-[var(--panel)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">PRICE TABLE</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-3">
            품목별 월 임대료
          </h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-7">
            아래 금액은 모두 시작가입니다. 기종과 월 출력량, 현장 조건에 따라 올라갈 수 있습니다.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--bg)]">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="bg-hb-primary text-white text-left">
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap">품목</th>
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap text-right">
                    월 임대료 (VAT 별도)
                  </th>
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap">이런 곳에 맞습니다</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((p) => (
                  <tr key={p.item} className="border-t border-[var(--line)] align-top">
                    <td className="py-3.5 px-4 font-black text-[var(--ink)]">{p.item}</td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-hb-blue tabular-nums whitespace-nowrap">
                      {p.price}
                    </td>
                    <td className="py-3.5 px-4 text-[var(--ink)]/90 leading-relaxed">
                      {p.note}
                      {p.href && (
                        <Link
                          href={p.href}
                          className="block mt-1 text-[12px] font-bold text-hb-blue hover:underline"
                        >
                          {p.hrefLabel} →
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-[13px] text-[var(--mute)] leading-relaxed">
            모두 VAT 별도이며 시작가입니다. 기종, 월 출력량, 설치 대수, 현장 조건에 따라 실제 월
            임대료는 달라집니다. 표만 보고 판단하지 마시고 전화 주시면 우리 사무실 기준으로 잡아
            드립니다.
          </p>

          {/* 전화 확인 안내 */}
          <div className="mt-7 border-l-4 border-hb-blue bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-6 lg:p-7">
            <h3 className="text-lg lg:text-xl font-black text-[var(--ink)] mb-2">
              정확한 금액은 <span className="text-hb-blue">{site.phone.main}</span>로 전화 확인해 주세요
            </h3>
            <p className="text-[15px] text-[var(--ink)]/90 leading-relaxed font-medium mb-3">
              같은 컬러 복사기라도 기종과 월 출력량, 설치 환경에 따라 월 임대료가 달라집니다. 한 달에
              몇 장 정도 뽑으시는지와 컬러 비중만 알려 주시면 우리 사무실에 맞는 기종과 금액을 바로 잡아
              드립니다. 대구·경북은 방문해서 직접 보고 견적을 냅니다. 견적은 무료입니다.
            </p>
            <a
              href={site.phone.mainHref}
              className="inline-flex items-center justify-center gap-2 bg-hb-blue hover:bg-hb-blue-light text-white font-extrabold px-5 py-3 rounded-xl shadow-lg shadow-hb-blue/30 transition"
            >
              전화 문의 {site.phone.main}
            </a>
          </div>
        </div>
      </section>

      {/* 월 정액 포함 내역 */}
      <section className="py-14 lg:py-20 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">ALL INCLUDED</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-3">
            월 정액에 이게 다 들어갑니다
          </h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-7">
            임대료 외에 토너값, 부품값, 출장비를 따로 청구하지 않습니다. 매달 나가는 돈이 월 임대료
            하나로 끝납니다.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
            {included.map((r) => (
              <div key={r.title} className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6">
                <div className="text-3xl mb-2">{r.icon}</div>
                <h3 className="font-extrabold text-[var(--ink)] mb-1.5">{r.title}</h3>
                <p className="text-sm text-[var(--mute)] leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 선택 가이드 */}
      <section className="py-14 lg:py-20 bg-[var(--panel)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-3">
            어떤 걸 골라야 하나요
          </h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-7">
            비싼 기종이 무조건 낫지는 않습니다. 한 달 출력량과 용도에 맞춰 고르는 것이 결국 제일
            저렴합니다.
          </p>
          <div className="space-y-4">
            {guide.map((g) => (
              <div key={g.title} className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-6">
                <h3 className="font-extrabold text-[var(--ink)] mb-1">{g.title}</h3>
                <div className="text-sm font-extrabold text-hb-blue mb-2">{g.pick}</div>
                <p className="text-sm text-[var(--mute)] leading-relaxed">{g.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection title="복합기 임대료, 자주 묻는 질문" items={priceFaq} />

      {/* CTA */}
      <section className="py-14 lg:py-20 bg-[var(--panel)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-3">
            우리 사무실은 월 얼마일까요
          </h2>
          <p className="text-[var(--mute)] leading-relaxed mb-8">
            한 달 출력량과 컬러 비중, 필요한 대수만 알려 주시면 기종과 월 임대료를 잡아 드립니다.
            대구·경북은 방문해서 직접 보고 견적을 냅니다. 견적은 무료입니다.
          </p>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-8">
            임대 포함 내역과 출동 기준은{" "}
            <Link href="/rental" className="font-bold text-hb-blue hover:underline">
              임대 케어 안내
            </Link>
            에서, 기종 라인업은{" "}
            <Link href="/shop" className="font-bold text-hb-blue hover:underline">
              임대 쇼핑몰
            </Link>
            에서 보실 수 있습니다.
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
