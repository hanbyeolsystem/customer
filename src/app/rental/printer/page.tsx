import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { UpdatedAt } from "@/components/UpdatedAt";
import { AnswerBlock } from "@/components/AnswerBlock";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { caseBySlug } from "@/data/cases";
import { naverPostByNo } from "@/data/naver-posts";
import { rentalPrice } from "@/data/rental-prices";
import { site } from "@/data/site";
import { breadcrumbLd, serviceId, webPageLd } from "@/lib/schema";

// 대구 프린터 임대(2026-11-15 신설). AI 검색 시험에서 "대구 프린터 임대 업체"는 챗GPT·구글 AI 모드·제미나이 모두 0/2.
// 프린터 임대료는 /rental/price/ 표 한 줄뿐이었고 복합기 페이지(/rental/)에 묻혀 있었다.
// 사실 출처: 금액·용도 = rental-prices.ts, 포함 내역·출동 = /rental/ 와 /rental/price/ 문구, 사례 = 아래 블로그·cases.
// 기본 매수·초과 요금·계약 기간은 프린터 기준 근거가 없어 쓰지 않는다. Service 노드는 /rental/ 의 것을 가리키기만 한다.
const PATH = "/rental/printer/";
const MONO = rentalPrice("흑백 레이저 프린터");
const INKJET = rentalPrice("잉크젯 무한 프린터");
const COLOR = rentalPrice("컬러 레이저 프린터");
const COPIER = rentalPrice("흑백 복사기 (흑백 디지털복합기)");
const POSTS = ["223015794181", "224337412783"];

export const metadata: Metadata = {
  title: "대구 프린터 임대 - 흑백 레이저 월 3만원부터",
  description: `대구 프린터 임대·렌탈. 흑백 레이저 월 3만원, 잉크젯 무한 월 4만원, 컬러 레이저 월 5만원부터(VAT 별도). 소모품·부품·출장 수리 포함. ${site.phone.main}`,
  alternates: { canonical: PATH },
};

const rows = [MONO, INKJET, COLOR];

const faq = [
  {
    q: "프린터 임대료에 무엇이 들어 있나요?",
    a: "토너·잉크 같은 소모품, 부품 교체, 출장 수리, 분기 정기점검이 월 요금에 들어 있습니다. 고장이 나도 따로 내는 돈이 없어요.",
  },
  {
    q: "프린터와 복합기 중 무엇을 빌려야 하나요?",
    a: `인쇄만 하면 프린터로 충분합니다. 복사, 스캔, 팩스까지 쓰면 복합기가 맞아요. 흑백 복사기(흑백 디지털복합기)는 ${COPIER.price}(VAT 별도)입니다.`,
  },
  {
    q: "고장 나면 얼마나 빨리 오나요?",
    a: "대구 전역과 경북은 당일, 그 밖의 지역은 1영업일 안에 출동합니다. 원격으로 되는 문제는 전화로 먼저 해결해요.",
  },
  {
    q: "사는 것보다 정말 싼가요?",
    a: "출력이 적고 고장이 거의 없으면 사는 쪽이 쌀 수 있습니다. 사면 토너와 수리비가 그때그때 따로 나갑니다. 고장 났을 때 기다리는 시간이 아깝거나, 토너 주문을 챙길 사람이 없으면 임대가 편해요.",
  },
  {
    q: "브라더 무한잉크 프린터도 임대되나요?",
    a: `됩니다. 잉크젯 무한 프린터가 ${INKJET.price}(VAT 별도)입니다. 한별시스템은 브라더코리아 서비스센터라 고장 수리도 직접 합니다.`,
  },
];

export default function RentalPrinterPage() {
  const posts = POSTS.map(naverPostByNo).filter((p): p is NonNullable<typeof p> => !!p);
  const allinone = caseBySlug("daegu-office-allinone");
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "복합기 렌탈", path: "/rental/" }, { name: "프린터 임대", path: PATH }])} />
      <JsonLd data={webPageLd({ path: PATH, name: String(metadata.title), description: metadata.description ?? undefined, mainEntityId: serviceId("/rental/") })} />
      <PageHeader
        badge="프린터 임대"
        title="사무실 프린터, 월 3만원부터 빌려 쓰기"
        description="토너가 떨어지거나 고장 나도 따로 내는 돈이 없습니다. 대구·경북은 당일 출동."
        back="/rental"
        backLabel="복합기 렌탈"
      />
      <UpdatedAt path={PATH} note="월 임대료 기준일입니다. VAT 별도." />

      <AnswerBlock
        question="대구에서 프린터 임대는 월 얼마인가요?"
        answer={`흑백 레이저 프린터는 ${MONO.price}, 잉크젯 무한 프린터는 ${INKJET.price}, 컬러 레이저 프린터는 ${COLOR.price}입니다(VAT 별도). 소모품, 부품 교체, 출장 수리, 분기 정기점검이 월 요금에 들어 있어요. 복사·스캔·팩스까지 필요하면 복합기가 맞고, 흑백 복사기는 ${COPIER.price}입니다. 대구 달서구 한별시스템(${site.phone.main})이 대구 전역과 경북에 당일 출동합니다.`}
        facts={[
          { label: "흑백 레이저", value: MONO.price },
          { label: "잉크젯 무한", value: INKJET.price },
          { label: "컬러 레이저", value: COLOR.price },
          { label: "포함", value: "소모품·부품·출장 수리" },
          { label: "출동", value: "대구·경북 당일" },
        ]}
      />

      <section className="py-10 lg:py-14 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-2">어떤 프린터가 맞을까</h2>
          <p className="text-[15px] text-[var(--mute)] leading-relaxed mb-5">출력하는 양과 색으로 고릅니다. 사무실 크기와는 상관이 없어요.</p>
          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
            <table className="w-full text-sm min-w-[460px]">
              <thead>
                <tr className="bg-hb-primary text-white text-left">
                  <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">품목</th>
                  <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">월 임대료(VAT 별도)</th>
                  <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">맞는 곳</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {rows.map((r) => (
                  <tr key={r.item}>
                    <td className="py-2.5 px-4 font-bold text-[var(--ink)]">{r.item}</td>
                    <td className="py-2.5 px-4 text-[var(--ink)] whitespace-nowrap">{r.price}</td>
                    <td className="py-2.5 px-4 text-[var(--ink)]/85">{r.note}</td>
                  </tr>
                ))}
                <tr>
                  <td className="py-2.5 px-4 font-bold text-[var(--ink)]">{COPIER.item}</td>
                  <td className="py-2.5 px-4 text-[var(--ink)] whitespace-nowrap">{COPIER.price}</td>
                  <td className="py-2.5 px-4 text-[var(--ink)]/85">{COPIER.note}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[13px] text-[var(--mute)] mt-2">
            컬러 복사기와 NAS·컴퓨터 임대료까지 한 표로 보려면 <Link href="/rental/price" className="text-hb-blue hover:underline">임대료 페이지</Link>를 보세요.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-4">고장 수리를 직접 하는 곳에서 빌리세요</h2>
          <p className="hb-p">
            프린터 임대에서 차이가 나는 건 고장 났을 때입니다. 계약 전에 "고장 나면 누가 와서 고치나요?"를 꼭 물어보세요.
          </p>
          <p className="text-[15px] text-[var(--ink)]/85 leading-relaxed">
            한별시스템은 브라더코리아와 교세라의 서비스센터입니다. 2011년부터 브라더 프린터를 직접 고쳐 왔고, 부품도 갖고 있어요. 고장 사례는{" "}
            <Link href="/support/printer-repair" className="font-bold text-hb-blue hover:underline">프린터 수리 기록</Link>
            에 모델별로 남겨 두었습니다.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-5">설치 기록</h2>
          {allinone && (
            <Link href={`/cases/${allinone.slug}`} className="block bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-4 hover:border-hb-blue transition mb-5">
              <div className="text-[11px] font-extrabold text-hb-blue tracking-[.14em] mb-1">구축 사례 · {allinone.region} · {allinone.date}</div>
              <div className="font-bold text-[var(--ink)] leading-snug">{allinone.title}</div>
              <div className="text-[13px] text-[var(--mute)] mt-1 leading-relaxed">{allinone.summary}</div>
            </Link>
          )}
          <ul className="space-y-2">
            {posts.map((p) => (
              <li key={p.logNo}>
                <Link href={`/blog/${p.logNo}`} className="flex items-start gap-2 text-[15px] text-[var(--ink)] hover:text-hb-blue">
                  <span className="text-hb-blue font-black">›</span>
                  <span><span className="text-[var(--mute)] text-[13px] mr-2">{p.date}</span>{p.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FaqSection title="프린터 임대, 자주 묻는 질문" items={faq} />

      <section className="py-10 lg:py-14">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <div className="rounded-2xl bg-hb-primary text-white p-6 lg:p-8">
            <div className="text-[11px] font-extrabold tracking-[.18em] text-white/70 mb-2">프린터 임대 문의</div>
            <div className="text-2xl lg:text-3xl font-black mb-2">
              <a href={site.phone.mainHref} className="hover:underline">{site.phone.main}</a>
            </div>
            <p className="text-white/85 text-[15px] leading-relaxed mb-4">
              한 달에 몇 장쯤 뽑는지, 컬러가 필요한지만 알려 주시면 맞는 기종과 금액을 말씀드립니다.
            </p>
            <Link href="/support/quote" className="inline-block px-4 py-2 rounded-full bg-white text-hb-primary text-sm font-extrabold hover:bg-hb-blue-soft transition">무료 견적 요청</Link>
          </div>
        </div>
      </section>
    </>
  );
}
