import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { ShortCard } from "@/components/sections/LatestShorts";
import { shorts } from "@/lib/shorts";
import { breadcrumbLd } from "@/lib/schema";
import { site } from "@/data/site";

// 글이 하나도 없을 때는 빈 목록이 색인되지 않게 noindex(사이트맵에도 없다). 첫 글이 들어오면 자동으로 풀린다.
export const metadata: Metadata = {
  title: "영상 가이드 - 프린터·NAS·PC 문제를 짧은 영상으로",
  description:
    "프린터 드라이버, NAS 접속, 복사기 오류처럼 사무실에서 자주 막히는 일을 짧은 영상과 단계별 글로 정리했습니다. 대구 한별시스템 18년 현장 기준. 문의 053-588-7119.",
  alternates: { canonical: "/shorts/" },
  ...(shorts.length ? {} : { robots: { index: false, follow: true } }),
};

export default function ShortsIndexPage() {
  const list = shorts.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": `${site.url}/shorts/#list`,
        name: "한별시스템 영상 가이드",
        numberOfItems: shorts.length,
        itemListElement: shorts.map((s, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}/shorts/${s.slug}/`, name: s.title })),
      }
    : null;

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "영상 가이드", path: "/shorts/" }])} />
      <JsonLd data={list} />
      <PageHeader
        badge="짧은 영상 · 단계별 정리"
        title="영상 가이드"
        description="드라이버가 안 잡히거나 NAS에 접속이 안 될 때 보는 짧은 영상입니다. 영상마다 순서와 주의할 점을 글로 같이 적었습니다."
      />

      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          {shorts.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {shorts.map((s) => (
                <ShortCard key={s.slug} s={s} chips />
              ))}
            </div>
          ) : (
            <div className="border border-[var(--line)] rounded-md p-8 lg:p-12 text-center">
              <p className="text-[15px] text-[var(--ink)]">아직 올라온 영상이 없어요.</p>
              <p className="mt-2 text-sm text-[var(--mute)] leading-relaxed">
                그동안은 <Link href="/qna/" className="text-hb-blue underline underline-offset-4">Q&amp;A 문답</Link>과{" "}
                <Link href="/guide/" className="text-hb-blue underline underline-offset-4">가이드</Link>를 보시거나 {site.phone.main} 로 전화 주세요.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
