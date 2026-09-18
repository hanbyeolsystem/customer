import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { UpdatedAt } from "@/components/UpdatedAt";
import { AnswerBlock } from "@/components/AnswerBlock";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { rentalPrice } from "@/data/rental-prices";
import { caseBySlug } from "@/data/cases";
import { naverPostByNo } from "@/data/naver-posts";
import { site } from "@/data/site";
import { breadcrumbLd, daeguGyeongbukServed, monthlyOffer, serviceId, serviceLd, webPageLd } from "@/lib/schema";

// 사무용 컴퓨터 렌탈 (2026-09-17 신설 - 대구 컴퓨터 렌탈 검색이 25년 9월 대비 26년 8월 약 4.6배, 전에는 가격표 한 줄뿐이었다).
// 사실 출처: 금액 = rental-prices.ts, 설치 방식 = cases.ts 3건 + 아래 블로그 글 3편. 계약 기간·교체 주기는 근거가 없어 쓰지 않는다.
const SET = rentalPrice("데스크탑 + 모니터 세트");
const CASES = ["office-pc-rental", "site-office-pc-vfm351ci", "daegu-office-allinone"];
const POSTS = ["224022745105", "223866251624", "223810375737"];

export const metadata: Metadata = {
  title: "대구 컴퓨터 렌탈 - 사무용 PC·모니터 월 4만원부터",
  description: `대구 사무용 컴퓨터 렌탈. 데스크탑+모니터 세트 ${SET.price}(VAT 별도). 업무에 맞춘 조립형 PC, 설치·초기 세팅 방문, 고장 수리 포함. 사무실만 렌탈. ${site.phone.main}.`,
  alternates: { canonical: "/rental/pc/" },
};

const faq = [
  { q: "집에서 쓸 컴퓨터도 렌탈되나요?", a: "사무실 컴퓨터만 렌탈합니다. 가정용 컴퓨터 렌탈은 하지 않습니다." },
  { q: "사무용 컴퓨터 렌탈은 월 얼마인가요?", a: `데스크탑과 모니터 세트가 ${SET.price}, VAT 별도입니다. 데스크탑 35,000원에 모니터 5,000원을 더한 값이에요. 하는 일에 맞춰 사양을 정하기 때문에 구성에 따라 금액이 달라질 수 있습니다.` },
  { q: "고장 나면 어떻게 하나요?", a: "고장 수리는 렌탈에 들어 있어 수리 기사를 따로 찾을 필요가 없습니다. 본체에 수리 연락처 스티커를 붙여 두니 그 번호로 전화 주세요. 원격으로 먼저 보고 안 되면 방문합니다." },
  { q: "사양은 어떻게 정하나요?", a: "하는 일을 먼저 듣습니다. 문서 작업 위주면 높은 사양이 필요 없습니다. 포토샵·일러스트를 쓰는 사무실은 그 프로그램이 도는 사양으로 맞춥니다. 듀얼 모니터와 모니터 거치대도 같이 설치합니다." },
  { q: "복합기나 NAS와 같이 할 수 있나요?", a: "됩니다. 공사 현장 사무실에는 PC와 복합기를 같이 넣었어요. 대구 사업체 한 곳은 컴퓨터·프린터·NAS를 한 번 방문으로 설치했습니다." },
];

const service = serviceLd({
  id: serviceId("/rental/pc/"),
  url: `${site.url}/rental/pc/`,
  name: "사무용 컴퓨터 렌탈(임대)",
  serviceType: "사무용 PC·모니터 렌탈",
  description: `사무실 전용 컴퓨터 렌탈. 데스크탑+모니터 세트 ${SET.price}(VAT 별도). 업무에 맞춘 조립형 PC 사양, 설치·초기 세팅 방문, 고장 수리 포함. 대구·경북 당일 출장 가능.`,
  channelUrl: `${site.url}/rental/price/`,
  areaServed: daeguGyeongbukServed,
  offers: [monthlyOffer("데스크탑 + 모니터 세트 렌탈", SET.monthly, SET.note)],
});

export default function RentalPcPage() {
  const cases = CASES.map(caseBySlug).filter((c): c is NonNullable<typeof c> => !!c);
  const posts = POSTS.map(naverPostByNo).filter((p): p is NonNullable<typeof p> => !!p);
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "복합기 렌탈", path: "/rental/" }, { name: "컴퓨터 렌탈", path: "/rental/pc/" }])} />
      <JsonLd data={service} />
      <JsonLd data={webPageLd({ path: "/rental/pc/", name: "사무용 컴퓨터 렌탈", mainEntityId: serviceId("/rental/pc/") })} />
      <PageHeader
        badge="컴퓨터 렌탈"
        title="사무실 컴퓨터, 사지 말고 렌탈로"
        description={`데스크탑+모니터 세트 ${SET.price}(VAT 별도). 하는 일에 맞춘 사양으로 설치하고, 고장 나면 고쳐 드립니다.`}
        back="/rental"
        backLabel="복합기 렌탈"
      />
      <UpdatedAt path="/rental/pc/" note="월 임대료 기준일입니다. VAT 별도." />

      <AnswerBlock
        question="대구에서 사무용 컴퓨터 렌탈은 월 얼마인가요?"
        answer={`데스크탑과 모니터 세트가 ${SET.price}, VAT 별도입니다. 데스크탑 35,000원에 모니터 5,000원을 더한 값이에요. 대구 달서구의 한별시스템(${site.phone.main})은 사무실 컴퓨터만 렌탈합니다. 하는 일에 맞춰 조립형 PC 사양을 정하고, 설치와 초기 세팅까지 방문해서 하죠. 고장 수리는 렌탈에 들어 있고 대구 전역과 경북은 당일 출장이 가능합니다.`}
        facts={[
          { label: "세트", value: SET.price },
          { label: "구성", value: "데스크탑 35,000원 + 모니터 5,000원" },
          { label: "포함", value: "설치·세팅·고장 수리" },
          { label: "대상", value: "사무실만" },
          { label: "전화", value: site.phone.main },
        ]}
      />

      <section className="py-10 lg:py-14">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-4">비싼 사양이 아니라 하는 일에 맞춥니다</h2>
          <p className="hb-p">
            사무용 PC는 무조건 성능이 좋아야 한다고 생각해 사는 데 부담을 느끼는 분이 많습니다. 좋은 사양을 싸게 사려고 발품을 팔다 시간만 쓰기도 하고요. 문서 작업이 대부분인 자리에 비싼 사양은 필요 없습니다.
          </p>
          <p className="hb-p">
            그래서 어떤 프로그램을 쓰는지부터 묻죠. 2025년 대구 중구 사무실은 포토샵과 일러스트레이터가 도는 사양으로 조립했습니다. 인원이 늘어 오래 쓰기로 하면서 윈도우까지 설치했고요. 수성구의 한 운동 센터는 본체·모니터·키보드·마우스 기본 구성에 듀얼 모니터와 거치대를 달았습니다.
          </p>
          <p className="text-[15px] text-[var(--ink)]/85 leading-relaxed">
            조립이 끝나면 본체에 수리 연락처 스티커를 붙이고, 사무실에서 선정리까지 마친 뒤 넘깁니다. 먼지가 많은 공사 현장 사무실은 먼지가 덜 들어가는 케이스를 골랐습니다.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-2">월 임대료</h2>
          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
            <table className="w-full text-sm min-w-[420px]">
              <thead>
                <tr className="bg-hb-primary text-white text-left">
                  <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">구성</th>
                  <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">월 임대료(VAT 별도)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                <tr><td className="py-2.5 px-4 font-bold text-[var(--ink)]">데스크탑 + 모니터 세트</td><td className="py-2.5 px-4 text-[var(--ink)]">{SET.price}</td></tr>
                <tr><td className="py-2.5 px-4 text-[var(--ink)]">데스크탑</td><td className="py-2.5 px-4 text-[var(--ink)]">월 35,000원부터</td></tr>
                <tr><td className="py-2.5 px-4 text-[var(--ink)]">모니터</td><td className="py-2.5 px-4 text-[var(--ink)]">월 5,000원부터</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[13px] text-[var(--mute)] mt-2">
            복합기·프린터·NAS 임대료는 <Link href="/rental/price" className="text-hb-blue hover:underline">임대료 페이지</Link>에 같이 있습니다. 렌탈과 구매 비교는 <Link href="/qna/pc-rental-vs-buy" className="text-hb-blue hover:underline">이 질문</Link>에 정리했습니다.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-5">설치 기록</h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            {cases.map((c) => (
              <Link key={c.slug} href={`/cases/${c.slug}`} className="block bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-4 hover:border-hb-blue transition">
                <div className="text-[11px] font-extrabold text-hb-blue tracking-[.14em] mb-1">구축 사례 · {c.region} · {c.date}</div>
                <div className="font-bold text-[var(--ink)] leading-snug">{c.title}</div>
                <div className="text-[13px] text-[var(--mute)] mt-1 leading-relaxed">{c.summary}</div>
              </Link>
            ))}
          </div>
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

      <FaqSection title="컴퓨터 렌탈, 자주 묻는 질문" items={faq} />

      <section className="py-10 lg:py-14">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <div className="rounded-2xl bg-hb-primary text-white p-6 lg:p-8">
            <div className="text-[11px] font-extrabold tracking-[.18em] text-white/70 mb-2">컴퓨터 렌탈 문의</div>
            <div className="text-2xl lg:text-3xl font-black mb-2">
              <a href={site.phone.mainHref} className="hover:underline">{site.phone.main}</a>
            </div>
            <p className="text-white/85 text-[15px] leading-relaxed mb-4">
              몇 자리에 어떤 프로그램을 쓰는지 말씀해 주시면 사양과 금액을 안내합니다. 고장 난 컴퓨터 수리만 필요하면 <Link href="/support" className="underline">전산 유지관리</Link>로 문의해 주세요.
            </p>
            <Link href="/support/quote" className="inline-block px-4 py-2 rounded-full bg-white text-hb-primary text-sm font-extrabold hover:bg-hb-blue-soft transition">무료 견적 요청</Link>
          </div>
        </div>
      </section>
    </>
  );
}
