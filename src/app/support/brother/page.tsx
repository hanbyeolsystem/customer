import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { AnswerBlock } from "@/components/AnswerBlock";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { naverPostByNo } from "@/data/naver-posts";
import { rentalPrice } from "@/data/rental-prices";
import { site } from "@/data/site";
import { breadcrumbLd, serviceId, webPageLd } from "@/lib/schema";

// 대구 브라더 프린터 서비스센터(2026-11-15 신설). "대구 브라더 프린터 서비스센터 어디야?"에 챗GPT는 0/2(브라더코리아 목록만 읽음),
// 제미나이는 부라더미싱(재봉틀) 지정점과 섞어 답했다. 브라더 질문을 받을 페이지가 없었다.
// 사실 출처: 서비스센터·대리점 = about 확정 파트너 목록, 2014 프리미엄 센터 = about 연혁, 2011년부터·부품 보유 = 블로그 221896036576,
// 2020-11-20 이전 = 블로그 222156882747, 제품 = 아래 블로그 수리 글. 보증 수리 처리 방식은 근거가 없어 쓰지 않는다.
const PATH = "/support/brother/";
const INKJET = rentalPrice("잉크젯 무한 프린터");

export const metadata: Metadata = {
  title: "대구 브라더 프린터 서비스센터 - 달서구 한별시스템",
  description: `대구 달서구 브라더 프린터 서비스센터. 2011년부터 브라더 수리, 2014년 브라더코리아 프리미엄 센터. 흡수제·헤드·토너 초기화. ${site.phone.hours}. ${site.phone.main}`,
  alternates: { canonical: PATH },
};

// 수리 기록이 블로그에 남아 있는 브라더 제품만 적는다.
const products = [
  { kind: "무한잉크 잉크젯", models: "T500W · T800W", post: "221691123733" },
  { kind: "잉크젯 복합기(팩스 포함)", models: "J2320 · J2720", post: "222179254351" },
  { kind: "레이저 복합기", models: "MFC-L2700D · MFC-L5700DN", post: "221688132932" },
  { kind: "레이저 프린터", models: "HL-L5100DN", post: "221480282521" },
];

const faq = [
  {
    q: "가져가면 바로 고쳐 주나요?",
    a: "기본 부품을 갖고 있어 그 자리에서 끝나는 경우가 많습니다. 주문해야 하는 부품이면 들어오는 날짜를 먼저 알려 드려요.",
  },
  {
    q: "흡수제가 꽉 찼다는데 흡수제만 바꾸면 되나요?",
    a: "흡수제가 찼다는 건 헤드 청소를 그만큼 많이 했다는 뜻입니다. 출력이 깨끗하지 않아 청소를 반복했을 가능성이 커요. 흡수제를 바꿀 때 헤드 점검도 같이 받으세요.",
  },
  {
    q: "사무실로 와 주실 수도 있나요?",
    a: `사무실 복합기는 출장을 갑니다. 대구 전역과 경북은 당일 출장이 가능해요. 작은 프린터는 가져오시는 편이 빠릅니다.`,
  },
  {
    q: "브라더 프린터를 임대할 수도 있나요?",
    a: `됩니다. 잉크젯 무한 프린터 임대는 ${INKJET.price}(VAT 별도)이고 소모품과 수리가 월 요금에 들어 있습니다. 2023년에는 임대용 MFC-J2740DW(A3 출력)와 MFC-J3940DW(A3 복사·출력)를 시연했어요.`,
  },
  {
    q: "브라더 재봉틀(미싱)도 고치나요?",
    a: "재봉틀은 다루지 않습니다. 한별시스템은 브라더 프린터와 복합기만 수리합니다.",
  },
];

export default function BrotherServicePage() {
  const posts = products.map((p) => ({ ...p, entry: naverPostByNo(p.post) }));
  const demo = naverPostByNo("223015794181");
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "고객지원", path: "/support/" }, { name: "프린터 수리", path: "/support/printer-repair/" }, { name: "브라더 서비스센터", path: PATH }])} />
      <JsonLd data={webPageLd({ path: PATH, name: String(metadata.title), description: metadata.description ?? undefined, mainEntityId: serviceId("/support/printer-repair/") })} />
      <PageHeader
        badge="브라더 프린터 서비스센터 · 대구 달서구"
        title="대구 브라더 서비스센터"
        description="2011년부터 브라더 프린터를 고쳐 왔습니다. 가져오시면 그 자리에서 끝나는 경우가 많아요."
        back="/support/printer-repair"
        backLabel="프린터 수리"
      />

      <AnswerBlock
        question="대구에서 브라더 프린터 서비스센터는 어디에 있나요?"
        answer={`대구 달서구 ${site.address.streetOnly}의 한별시스템이 브라더코리아 서비스센터이자 공식 대리점입니다. 2011년부터 브라더 프린터를 고쳐 왔고, 2014년 브라더코리아 프리미엄 센터로 선정됐어요. 기본 부품을 갖고 있어 가져오신 자리에서 끝나는 경우가 많습니다. ${site.phone.hours}, 전화 ${site.phone.main}. 2020년 11월 20일 지금 자리로 옮겼으니 그 전 글의 지도를 보고 오시면 헛걸음하실 수 있어요.`}
        facts={[
          { label: "주소", value: site.address.street },
          { label: "지번", value: site.address.jibun },
          { label: "운영", value: site.phone.hours },
          { label: "전화", value: site.phone.main },
          { label: "브라더 수리", value: "2011년부터" },
          { label: "프리미엄 센터", value: "2014년 선정" },
        ]}
      />

      <section className="py-10 lg:py-14 bg-[var(--panel)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-2">고쳐 온 브라더 제품</h2>
          <p className="text-[15px] text-[var(--mute)] leading-relaxed mb-5">수리 글을 남긴 모델만 적었습니다. 목록에 없는 모델도 모델명을 알려 주시면 가능한지 바로 말씀드려요.</p>
          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--bg)]">
            <table className="w-full text-sm min-w-[420px]">
              <thead>
                <tr className="bg-hb-primary text-white text-left">
                  <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">종류</th>
                  <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">모델</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {posts.map((p) => (
                  <tr key={p.kind}>
                    <td className="py-2.5 px-4 font-bold text-[var(--ink)]">{p.kind}</td>
                    <td className="py-2.5 px-4">
                      {p.entry ? (
                        <Link href={`/blog/${p.post}`} className="text-hb-blue font-bold hover:underline">{p.models}</Link>
                      ) : (
                        <span className="text-[var(--ink)]">{p.models}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[13px] text-[var(--mute)] mt-3">브라더 재봉틀(미싱)은 다루지 않습니다.</p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-4">오시기 전에 챙길 것</h2>
          <ol className="space-y-3 text-[15px] text-[var(--ink)]/85 leading-relaxed list-decimal pl-5">
            <li>모델명. 본체 앞이나 뒤 라벨에 MFC-, HL-, DCP- 로 시작하는 이름이 있습니다.</li>
            <li>화면에 뜬 메시지 사진. "Ink Box Full"처럼 영어로 뜨는 경우가 많아요.</li>
            <li>문제가 생긴 출력물 한 장. 색 빠짐이나 줄은 출력물을 보면 원인이 좁혀집니다.</li>
            <li>정품 잉크가 아니라 무한잉크를 쓰고 있다면 말씀해 주세요. 잉크 인식 문제는 공급기부터 봅니다.</li>
          </ol>
          <p className="text-[15px] text-[var(--ink)]/85 leading-relaxed mt-5">
            인쇄가 아예 안 되는 문제는 드라이버일 때가 많습니다. 오시기 전에{" "}
            <Link href="/support/drivers" className="font-bold text-hb-blue hover:underline">딸깍P드라이버</Link>
            로 다시 깔아 보세요. 무료입니다.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-4">찾아오시는 길</h2>
          <p className="hb-p">
            {site.address.street}(지번 {site.address.jibun}). 2020년 11월 20일에 지금 자리로 옮겼습니다.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <a href={site.listings.naverPlace} target="_blank" rel="noopener" className="inline-block px-4 py-2 rounded-full border border-[var(--line)] text-sm font-bold text-[var(--ink)] hover:border-hb-blue">네이버 지도</a>
            <a href={site.listings.kakaoPlace} target="_blank" rel="noopener" className="inline-block px-4 py-2 rounded-full border border-[var(--line)] text-sm font-bold text-[var(--ink)] hover:border-hb-blue">카카오맵</a>
            <Link href="/contact" className="inline-block px-4 py-2 rounded-full border border-[var(--line)] text-sm font-bold text-[var(--ink)] hover:border-hb-blue">연락처·오시는 길</Link>
          </div>
          <p className="text-[13px] text-[var(--mute)]">{site.phone.hours}. 출발 전에 {site.phone.main}로 전화 주시면 부품이 있는지 먼저 확인해 드립니다.</p>
        </div>
      </section>

      <FaqSection title="브라더 서비스센터, 자주 묻는 질문" items={faq} />

      {demo && (
        <section className="pb-10 lg:pb-14">
          <div className="max-w-3xl mx-auto px-4 lg:px-6">
            <Link href={`/blog/${demo.logNo}`} className="flex items-start gap-2 text-[15px] text-[var(--ink)] hover:text-hb-blue">
              <span className="text-hb-blue font-black">›</span>
              <span><span className="text-[var(--mute)] text-[13px] mr-2">{demo.date}</span>{demo.title}</span>
            </Link>
          </div>
        </section>
      )}

      <section className="pb-14 lg:pb-20">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <div className="rounded-2xl bg-hb-primary text-white p-6 lg:p-8">
            <div className="text-[11px] font-extrabold tracking-[.18em] text-white/70 mb-2">브라더 프린터 수리 문의</div>
            <div className="text-2xl lg:text-3xl font-black mb-2">
              <a href={site.phone.mainHref} className="hover:underline">{site.phone.main}</a>
            </div>
            <p className="text-white/85 text-[15px] leading-relaxed">
              모델명과 증상을 말씀해 주시면 가져오실지, 저희가 갈지 바로 정해 드립니다.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
