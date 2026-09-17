import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { AnswerBlock } from "@/components/AnswerBlock";
import { JsonLd } from "@/components/JsonLd";
import { rentalAreas } from "@/data/rental-areas";
import { rentalPrice } from "@/data/rental-prices";
import { site } from "@/data/site";
import { breadcrumbLd, daeguDistricts, gyeongbukCities, webPageLd } from "@/lib/schema";

const MONO = rentalPrice("흑백 복사기 (흑백 디지털복합기)");
const COLOR = rentalPrice("컬러 복사기 (컬러 디지털복합기)");

export const metadata: Metadata = {
  title: "대구 복사기 임대 지역 안내 - 달서구·수성구·북구·동구 설치 기록",
  description: `대구 복사기 임대·복합기 렌탈 지역 안내. 달서구·수성구·북구·동구 실제 설치 기록. 흑백 ${MONO.price}, 컬러 ${COLOR.price}(VAT 별도). 대구 전역·경북 당일 출장 가능. ${site.phone.main}.`,
  alternates: { canonical: "/rental/area/" },
};

export default function RentalAreaIndexPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "복합기 렌탈", path: "/rental/" }, { name: "지역 안내", path: "/rental/area/" }])} />
      <JsonLd data={webPageLd({ path: "/rental/area/", name: String(metadata.title), description: metadata.description ?? undefined })} />
      <PageHeader
        badge="복합기 임대 · 지역"
        title="대구 복사기 임대, 동네별 설치 기록"
        description="실제로 설치하고 고친 기록이 있는 지역만 따로 정리했습니다."
        back="/rental"
        backLabel="복합기 렌탈"
      />

      <AnswerBlock
        question="한별시스템은 대구 어디까지 복사기 임대를 하나요?"
        answer={`한별시스템(대구광역시 달서구, ${site.phone.main})은 대구 전역과 경상북도에 복사기·복합기를 임대하고 직접 관리합니다. 대구 전역과 경북은 당일 출장이 가능하고, 경남은 날짜를 잡아 방문하며 전국은 1영업일 안에 대응합니다. 흑백 복사기 ${MONO.price}, 컬러 복사기 ${COLOR.price}이며 VAT 별도입니다. 월 임대료는 지역에 따라 달라지지 않습니다.`}
        facts={[
          { label: "대구·경북", value: "당일 출장 가능" },
          { label: "흑백 복사기", value: MONO.price },
          { label: "컬러 복사기", value: COLOR.price },
          { label: "전화", value: site.phone.main },
        ]}
      />

      <section className="py-10 lg:py-14">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-2">설치 기록이 있는 지역</h2>
          <p className="text-[14px] text-[var(--mute)] mb-5">사례와 블로그 설치 글로 확인되는 곳입니다. 기록이 없는 동네를 지어서 페이지로 만들지 않았습니다.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {rentalAreas.map((a) => (
              <Link key={a.slug} href={`/rental/area/${a.slug}`} className="block bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-5 hover:border-hb-blue transition">
                <div className="font-extrabold text-[var(--ink)] text-lg">{a.full} 복사기 임대</div>
                <div className="text-[13.5px] text-[var(--mute)] mt-1 leading-relaxed">{a.history}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-14 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-3">그 밖의 출장 지역</h2>
          <p className="text-[15px] text-[var(--ink)]/85 leading-relaxed mb-4">
            따로 페이지를 두지 않은 곳도 같은 조건으로 갑니다. 대구 {daeguDistricts.filter((d) => !rentalAreas.some((a) => a.name === d)).join("·")}과 경북 {gyeongbukCities.join("·")}은 당일 출장이 가능합니다.
          </p>
          <p className="text-[14px] text-[var(--mute)] leading-relaxed">
            월 임대료 전체는 <Link href="/rental/price" className="text-hb-blue hover:underline">복합기·프린터 임대료</Link>, 사무실 PC는 <Link href="/rental/pc" className="text-hb-blue hover:underline">사무용 컴퓨터 렌탈</Link>에 있습니다. 방문 일정은 <a href={site.phone.mainHref} className="text-hb-blue hover:underline">{site.phone.main}</a>로 문의해 주세요.
          </p>
        </div>
      </section>
    </>
  );
}
