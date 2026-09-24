import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { AnswerBlock } from "@/components/AnswerBlock";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { areas, visitPolicyText } from "@/data/areas";
import { naverPostByNo } from "@/data/naver-posts";
import { site } from "@/data/site";
import { breadcrumbLd, webPageLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "NAS 출장 지역 안내 - 대구·경북·경남 나스 설치 업체",
  description:
    "대구 달서구 한별시스템의 나스(NAS) 출장 지역. 대구·경북(구미·김천·고령·성주·문경·예천·안동 등) 당일 출장, 경남(창녕·창원·마산) 일정 방문. 시놀로지 공식 대리점, 견적 방문 무료. 053-588-7119.",
  alternates: { canonical: "/nas/area/" },
};

// 지역 페이지는 없지만 블로그 글로 방문 기록이 확인되는 경북·경남·부산 지역
const extraRegions: { name: string; logNo: string }[] = [
  { name: "경산", logNo: "224334439476" },
  { name: "칠곡", logNo: "224335331835" },
  { name: "포항", logNo: "224370910051" },
  { name: "경주", logNo: "223904570933" },
  { name: "부산", logNo: "224400696243" },
];

const faq = [
  { q: "대구가 아닌 지역도 같은 비용인가요?", a: "네. 견적 방문은 무료이고 설치비는 출장 설치와 설정 교육이 포함된 표준 금액 하나입니다. 지역별 추가 출장비는 받지 않습니다." },
  { q: "경북과 경남은 무엇이 다른가요?", a: "경북은 당일 출장을 원칙으로 하고, 경남(창녕·창원·마산)은 일정을 잡아 방문합니다. 창원은 실제 구축 사례가 사이트에 있습니다." },
  { q: "목록에 없는 지역은 안 되나요?", a: "됩니다. 영남권은 협의해서 방문하고 전국은 1영업일 안에 대응합니다. 전화로 지역과 규모를 말씀해 주시면 일정을 안내합니다." },
  { q: "설치 뒤에는 어떻게 관리되나요?", a: "원격 점검을 기본으로 하고 디스크 교체처럼 장비를 만져야 할 때 방문합니다. 유지관리 계약 거래처는 출장 점검비가 없습니다." },
  { q: "어떤 자격으로 설치하나요?", a: "시놀로지(Synology) 공식 대리점으로 정품을 판매·납품하고, 통신판매업 신고 사업자로 세금계산서를 발행합니다. NAS 구축 실적 100건 이상입니다." },
];

export default function NasAreaIndexPage() {
  const list = areas.filter((a) => a.slug !== "gyeongbuk");
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "NAS 구축", path: "/nas/" }, { name: "출장 지역", path: "/nas/area/" }])} />
      <JsonLd data={webPageLd({ path: "/nas/area/", name: String(metadata.title), description: metadata.description ?? undefined })} />
      <PageHeader
        badge="NAS · 출장 지역"
        title="대구에서 출발해 경북·경남까지 갑니다"
        description="나스(NAS) 설치·구축·수리 출장 지역과 방문 방식. 시놀로지 공식 대리점 한별시스템."
        back="/nas"
        backLabel="NAS 구축"
      />

      <AnswerBlock
        question="한별시스템은 어느 지역까지 NAS 설치를 나가나요?"
        answer={`한별시스템(대구광역시 달서구, ${site.phone.main})은 대구 전역과 경상북도는 당일 출장을 원칙으로 나스(NAS) 설치·구축·수리 출장을 다니고, 경남 창녕·창원·마산은 일정을 잡아 방문합니다. 그 밖의 영남권은 협의 방문, 전국은 1영업일 안에 대응합니다. 시놀로지(Synology) 공식 대리점으로 정품 NAS 판매와 RAID 설계, 3-2-1 백업, 직원 교육까지 현장에서 처리하며, 견적은 현장을 보고 무료로 냅니다. 지역별 추가 출장비는 없습니다. 예천·안동·창원 현장 사례와 구미·경산·칠곡·포항·부산 설치 글이 사이트에 있습니다.`}
        facts={[
          { label: "전화", value: site.phone.main },
          { label: "대구·경북", value: "당일 출장 원칙" },
          { label: "경남", value: "일정 잡아 방문" },
          { label: "전국", value: "1영업일 대응" },
          { label: "견적", value: "현장 방문 무료" },
          { label: "자격", value: "시놀로지 공식 대리점" },
        ]}
      />

      <section className="py-10 lg:py-14">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-2">지역별 안내</h2>
          <p className="text-[14px] text-[var(--mute)] mb-4">출발지는 대구광역시 달서구 {site.address.streetOnly}. 이동 시간은 고속도로 기준 대략값입니다.</p>
          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="bg-hb-primary text-white text-left">
                  <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">지역</th>
                  <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">거리·시간</th>
                  <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">방문 방식</th>
                  <th className="py-2.5 px-4 font-extrabold">기록</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                <tr>
                  <td className="py-2.5 px-4 font-bold whitespace-nowrap"><Link href="/nas" className="text-hb-blue hover:underline">대구 전역</Link></td>
                  <td className="py-2.5 px-4 whitespace-nowrap">본사 소재</td>
                  <td className="py-2.5 px-4 whitespace-nowrap">당일 출장 원칙</td>
                  <td className="py-2.5 px-4 text-[var(--mute)]">구축 사례 다수 (<Link href="/cases" className="text-hb-blue hover:underline">사례 보기</Link>)</td>
                </tr>
                {list.map((a) => (
                  <tr key={a.slug}>
                    <td className="py-2.5 px-4 font-bold whitespace-nowrap"><Link href={`/nas/area/${a.slug}`} className="text-hb-blue hover:underline">{a.full}</Link></td>
                    <td className="py-2.5 px-4 whitespace-nowrap">약 {a.km}km · {a.driveMin}분</td>
                    <td className="py-2.5 px-4 whitespace-nowrap">{a.policy === "same-day" ? "당일 출장 원칙" : "일정 잡아 방문"}</td>
                    <td className="py-2.5 px-4 text-[var(--mute)]">
                      {a.cases.length > 0 ? `구축 사례 ${a.cases.length}건` : a.posts.length > 0 ? `방문 기록 ${a.posts.length}건` : "방문 정책 안내"}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-2.5 px-4 font-bold whitespace-nowrap"><Link href="/nas/area/gyeongbuk" className="text-hb-blue hover:underline">경북 전역</Link></td>
                  <td className="py-2.5 px-4 whitespace-nowrap">시·군별 상이</td>
                  <td className="py-2.5 px-4 whitespace-nowrap">당일 출장 원칙</td>
                  <td className="py-2.5 px-4 text-[var(--mute)]">{visitPolicyText(areas.find((a) => a.slug === "gyeongbuk")!)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-extrabold text-[var(--ink)] mt-8 mb-2">그 밖에 다녀온 지역의 글</h3>
          <ul className="space-y-2">
            {extraRegions.map((r) => {
              const p = naverPostByNo(r.logNo);
              return p ? (
                <li key={r.logNo}>
                  <Link href={`/blog/${p.logNo}`} className="flex items-start gap-2 text-[15px] text-[var(--ink)] hover:text-hb-blue">
                    <span className="text-hb-blue font-black">›</span>
                    <span><span className="font-bold mr-2">{r.name}</span>{p.title}</span>
                  </Link>
                </li>
              ) : null;
            })}
          </ul>
        </div>
      </section>

      <FaqSection title="출장 지역, 자주 묻는 질문" items={faq} />

      <section className="py-10 lg:py-14">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <div className="rounded-2xl bg-hb-primary text-white p-6 lg:p-8">
            <div className="text-[11px] font-extrabold tracking-[.18em] text-white/70 mb-2">지역 문의</div>
            <div className="text-2xl lg:text-3xl font-black mb-2"><a href={site.phone.mainHref} className="hover:underline">{site.phone.main}</a></div>
            <p className="text-white/85 text-[15px] leading-relaxed mb-4">지역과 인원, 자료가 어디에 있는지만 말씀해 주시면 방문 일정을 잡아 드립니다. {site.phone.hours}.</p>
            <Link href="/support/quote" className="inline-block px-4 py-2 rounded-full bg-white text-hb-primary text-sm font-extrabold hover:bg-hb-blue-soft transition">무료 방문 견적 요청</Link>
          </div>
        </div>
      </section>
    </>
  );
}
