import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { AnswerBlock } from "@/components/AnswerBlock";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { caseBySlug } from "@/data/cases";
import { naverPostByNo } from "@/data/naver-posts";
import { rentalPrice } from "@/data/rental-prices";
import { site } from "@/data/site";
import { breadcrumbLd, daeguGyeongbukServed, serviceId, serviceLd, webPageLd } from "@/lib/schema";

// 대구 프린터·복합기 수리(2026-11-15 신설). AI 검색 시험에서 "대구 프린터 수리"는 챗GPT 2/6, 제미나이 1/6 이었다.
// 사실 출처: 브라더·교세라 서비스센터·대리점 = about 확정 파트너 목록, 브라더 2011년부터·부품 보유 = 블로그 221896036576,
// 증상별 기록 = 아래 블로그 글(모델명 그대로). 수리 단가는 근거가 없어 쓰지 않는다. 다른 제조사 지원 여부도 단정하지 않는다.
const PATH = "/support/printer-repair/";
const MONO_COPIER = rentalPrice("흑백 복사기 (흑백 디지털복합기)");
const MONO_PRINTER = rentalPrice("흑백 레이저 프린터");
const ERRORCODE = site.owned.find((u) => u.includes("errorcode"));

export const metadata: Metadata = {
  title: "대구 프린터 수리 - 브라더·교세라 서비스센터, 복합기 출장 수리",
  description: `대구 달서구 프린터·복합기 수리. 브라더·교세라 서비스센터. 잉크흡수제, 헤드 막힘, 토너 인식, 출력물 줄. 매장 방문 또는 대구·경북 당일 출장. ${site.phone.main}`,
  alternates: { canonical: PATH },
};

// 증상 → 실제 수리 기록(블로그 글 번호). 원인은 기록에 적힌 것만 쓴다.
const records = [
  { symptom: "잉크흡수제가 꽉 찼다는 메시지와 함께 멈춤", what: "헤드 청소를 자주 하면 버린 잉크가 흡수제에 쌓입니다. 흡수제를 갈고, 청소를 하게 만든 헤드도 같이 점검합니다.", model: "브라더 J2720", post: "222179254351" },
  { symptom: "청소를 여러 번 해도 한 가지 색이 안 나옴", what: "헤드가 막혀 헤드를 교체하고, 같이 가득 찬 흡수제도 바꿨습니다.", model: "브라더 T800W", post: "221691123733" },
  { symptom: "무한잉크를 쓰는데 잉크 인식이 안 됨", what: "잉크 공급기를 교체하고 칩을 초기화한 뒤 헤드 청소까지 했습니다.", model: "브라더 J2320", post: "221674538830" },
  { symptom: "새 토너를 넣었는데 토너가 없다고 나옴", what: "토너 카운터 초기화로 해결했습니다.", model: "브라더 MFC-L2700D", post: "221688132932" },
  { symptom: "토너·드럼을 바꿨는데 인식이 안 됨", what: "토너와 드럼 카운터를 각각 초기화했습니다.", model: "브라더 MFC-L5700DN", post: "221679322473" },
  { symptom: "출력물에 파란 줄이 생김", what: "분해해 보니 드럼을 잡아 주는 양쪽 부분이 깨져 있어 드럼을 교체했습니다.", model: "교세라 M5521", post: "222180964586" },
  { symptom: "출력물에 줄이 가끔 생김", what: "전사벨트 쪽 폐토너가 굳어 막힌 상태. 벨트를 빼고 블레이드를 청소했습니다.", model: "교세라 M5526", post: "222242615017" },
  { symptom: "출력 속도가 절반으로 느려짐", what: "용지 설정이 두꺼운 용지로 돼 있으면 느리게 나옵니다. 설정을 되돌리면 원래 속도로 돌아와요.", model: "교세라 M5526cdn", post: "221490085461" },
];

const faq = [
  {
    q: "수리비와 출장비는 얼마인가요?",
    a: "렌탈로 쓰는 기기는 수리비와 출장비가 월 정액에 들어 있습니다. 그 밖의 기기는 모델명과 증상을 듣고 예상 금액을 먼저 말씀드려요. 작은 프린터를 매장으로 가져오시면 출장비는 들지 않습니다.",
  },
  {
    q: "그 자리에서 바로 고쳐지나요?",
    a: "브라더 프린터는 기본 부품을 갖고 있어 가져오신 자리에서 끝나는 경우가 많습니다. 부품을 주문해야 하면 들어오는 날짜를 알려 드려요.",
  },
  {
    q: "브라더·교세라 말고 다른 회사 프린터도 되나요?",
    a: `모델명을 알려 주시면 가능한지 바로 말씀드립니다. ${site.phone.main}로 전화 주시거나 본체 라벨 사진을 보내 주세요.`,
  },
  {
    q: "무한잉크 프린터도 고치나요?",
    a: "고칩니다. 브라더 T800W의 헤드·흡수제 교체, J2320의 잉크 공급기 교체 기록이 있습니다. 오래 쓰지 않고 두면 헤드가 막혀 교체 비용이 커져요. 가끔이라도 출력하고 헤드 청소를 해 주세요.",
  },
  {
    q: "고치는 것보다 바꾸는 게 나을 때는요?",
    a: `수리비가 반복해서 나가면 바꾸는 쪽이 쌉니다. 오래된 기종은 부품 구하기도 어려워 한 번 멈추면 오래 기다리게 돼요. 흑백 레이저 프린터 임대는 ${MONO_PRINTER.price}, 흑백 복사기는 ${MONO_COPIER.price}(VAT 별도)이고 수리가 들어 있습니다.`,
  },
];

const service = serviceLd({
  id: serviceId(PATH),
  url: `${site.url}${PATH}`,
  name: "프린터·복합기 수리",
  serviceType: "프린터·복합기 수리(브라더·교세라 서비스센터)",
  description: `대구 달서구 한별시스템은 브라더코리아·교세라 서비스센터이자 공식 대리점이다. 브라더 프린터는 2011년부터 수리했고 기본 부품을 보유한다. 잉크흡수제 교체, 헤드 교체, 토너·드럼 초기화, 복합기 출장 수리. 매장 방문 또는 대구·경북 당일 출장 가능. ${site.phone.main}.`,
  areaServed: daeguGyeongbukServed,
});

export default function PrinterRepairPage() {
  const repairCase = caseBySlug("kyocera-gov-supply-2site");
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "고객지원", path: "/support/" }, { name: "프린터 수리", path: PATH }])} />
      <JsonLd data={service} />
      <JsonLd data={webPageLd({ path: PATH, name: String(metadata.title), description: metadata.description ?? undefined, mainEntityId: serviceId(PATH) })} />
      <PageHeader
        badge="프린터·복합기 수리 · 브라더·교세라 서비스센터"
        title="프린터가 멈췄을 때"
        description="작은 프린터는 매장으로 가져오시면 되고, 사무실 복합기는 출장 갑니다. 대구·경북은 당일 출장 가능."
        back="/support"
        backLabel="고객지원"
      />

      <AnswerBlock
        question="대구에서 프린터나 복합기 수리는 어디에 맡기나요?"
        answer={`대구 달서구 한별시스템(${site.phone.main})은 브라더코리아와 교세라의 서비스센터이자 공식 대리점입니다. 브라더 프린터는 2011년부터 고쳐 왔어요. 기본 부품을 갖고 있어 가져오신 자리에서 끝나는 경우가 많습니다. 작은 프린터는 매장(${site.address.street})으로 가져오시면 되고, 사무실 복합기는 출장을 갑니다. 대구 전역과 경북은 당일 출장이 가능해요. 렌탈로 쓰는 기기는 수리비와 출장비가 월 정액에 들어 있습니다.`}
        facts={[
          { label: "서비스센터", value: "브라더·교세라" },
          { label: "브라더 수리", value: "2011년부터" },
          { label: "출장", value: "대구·경북 당일 가능" },
          { label: "렌탈 기기", value: "수리·출장 포함" },
          { label: "운영", value: site.phone.hours },
        ]}
      />

      <section className="py-10 lg:py-14 bg-[var(--panel)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-2">자주 들어오는 고장과 실제 수리 기록</h2>
          <p className="text-[15px] text-[var(--mute)] leading-relaxed mb-5">모델명을 누르면 그때 남긴 수리 글로 갑니다.</p>
          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--bg)]">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="bg-hb-primary text-white text-left">
                  <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">증상</th>
                  <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">한 일</th>
                  <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">기록</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {records.map((r) => (
                  <tr key={r.post}>
                    <td className="py-2.5 px-4 font-bold text-[var(--ink)] align-top">{r.symptom}</td>
                    <td className="py-2.5 px-4 text-[var(--ink)]/85 align-top">{r.what}</td>
                    <td className="py-2.5 px-4 align-top whitespace-nowrap">
                      {naverPostByNo(r.post) ? (
                        <Link href={`/blog/${r.post}`} className="text-hb-blue font-bold hover:underline">{r.model}</Link>
                      ) : (
                        <span className="text-[var(--ink)]">{r.model}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {repairCase && (
            <p className="text-[13px] text-[var(--mute)] mt-3">
              사무실 복합기 부품 교체 사례는{" "}
              <Link href={`/cases/${repairCase.slug}`} className="text-hb-blue hover:underline">{repairCase.title}</Link>
              에 있습니다.
            </p>
          )}
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-4">전화 주시기 전에 해 볼 것</h2>
          <ol className="space-y-3 text-[15px] text-[var(--ink)]/85 leading-relaxed list-decimal pl-5">
            <li>
              화면에 에러코드가 떴다면 사진부터 찍어 두세요.
              {ERRORCODE && (
                <>
                  {" "}
                  <a href={ERRORCODE} target="_blank" rel="noopener" className="text-hb-blue font-bold hover:underline">프린터 에러코드 검색</a>에서 뜻을 먼저 찾아볼 수 있습니다.
                </>
              )}
            </li>
            <li>
              인쇄 명령이 아예 안 들어가면 드라이버 문제일 때가 많아요.{" "}
              <Link href="/support/drivers" className="text-hb-blue font-bold hover:underline">딸깍P드라이버</Link>로 다시 깔면 무료로 해결됩니다.
            </li>
            <li>본체 앞이나 뒤 라벨의 모델명을 확인해 주세요. 부품을 챙겨 가는 데 꼭 필요합니다.</li>
            <li>줄이 생기거나 색이 빠지면 그 출력물 한 장을 버리지 말고 두세요. 원인을 찾는 가장 빠른 단서예요.</li>
          </ol>
          <p className="text-[15px] text-[var(--ink)]/85 leading-relaxed mt-5">
            브라더 프린터를 들고 오실 분은{" "}
            <Link href="/support/brother" className="font-bold text-hb-blue hover:underline">브라더 서비스센터 안내</Link>
            에서 위치와 준비물을 확인해 주세요.
          </p>
        </div>
      </section>

      <FaqSection title="프린터 수리, 자주 묻는 질문" items={faq} />

      <section className="py-10 lg:py-14">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <div className="rounded-2xl bg-hb-primary text-white p-6 lg:p-8">
            <div className="text-[11px] font-extrabold tracking-[.18em] text-white/70 mb-2">프린터 수리 문의</div>
            <div className="text-2xl lg:text-3xl font-black mb-2">
              <a href={site.phone.mainHref} className="hover:underline">{site.phone.main}</a>
            </div>
            <p className="text-white/85 text-[15px] leading-relaxed mb-4">
              {site.phone.hours}. 모델명과 증상을 말씀해 주시면 가져오실지, 저희가 갈지 바로 정해 드립니다.
            </p>
            <Link href="/support/as" className="inline-block px-4 py-2 rounded-full bg-white text-hb-primary text-sm font-extrabold hover:bg-hb-blue-soft transition">A/S 접수</Link>
          </div>
          <p className="text-[13px] text-[var(--mute)] mt-4">
            자주 고장 나는 복합기는 <Link href="/rental" className="text-hb-blue hover:underline">복합기 임대</Link>, 프린터는 <Link href="/rental/printer" className="text-hb-blue hover:underline">프린터 임대</Link>로 바꾸면 수리비가 월 정액에 들어갑니다.
          </p>
        </div>
      </section>
    </>
  );
}
