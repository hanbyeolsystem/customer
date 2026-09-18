import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { AnswerBlock } from "@/components/AnswerBlock";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { rentalAreas, rentalAreaBySlug, type RentalArea } from "@/data/rental-areas";
import { rentalPrice } from "@/data/rental-prices";
import { caseBySlug } from "@/data/cases";
import { naverPostByNo } from "@/data/naver-posts";
import { site } from "@/data/site";
import { breadcrumbLd, monthlyOffer, serviceId, serviceLd, webPageLd } from "@/lib/schema";
import { metaDescription } from "@/lib/utils";

// 대구 구별 복사기·복합기 임대 안내. 데이터와 원칙(근거 있는 지역만, 실적 지어내지 않기)은 src/data/rental-areas.ts.
export function generateStaticParams() {
  return rentalAreas.map((a) => ({ slug: a.slug }));
}

const MONO = rentalPrice("흑백 복사기 (흑백 디지털복합기)");
const COLOR = rentalPrice("컬러 복사기 (컬러 디지털복합기)");
const PRINTER = rentalPrice("흑백 레이저 프린터");
const fill = (s: string) => s.replace(/\{mono\}/g, MONO.price).replace(/\{color\}/g, COLOR.price);

const titleOf = (a: RentalArea) => `${a.full} 복사기 임대·복합기 렌탈 - 설치 기록과 월 임대료`;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = rentalAreaBySlug(slug);
  if (!a) return {};
  return {
    title: titleOf(a),
    description: metaDescription(`${a.full} 복사기 임대·복합기 렌탈. 흑백 ${MONO.price}, 컬러 ${COLOR.price}(VAT 별도), 토너·부품·출장 수리 포함. ${a.history} 대구 전역 당일 출장 가능. ${site.phone.main}.`),
    alternates: { canonical: `/rental/area/${slug}/` },
  };
}

export default async function RentalAreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = rentalAreaBySlug(slug);
  if (!a) notFound();

  const path = `/rental/area/${a.slug}/`;
  const cases = a.cases.map(caseBySlug).filter((c): c is NonNullable<typeof c> => !!c);
  const posts = a.posts.map(naverPostByNo).filter((p): p is NonNullable<typeof p> => !!p);
  const nearby = a.nearby.map(rentalAreaBySlug).filter((x): x is RentalArea => !!x);

  const answer = `${a.full}에서 복사기 임대나 복합기 렌탈 업체를 찾으신다면 대구 달서구의 한별시스템(${site.phone.main})이 직접 설치하고 관리합니다. 흑백 복사기는 ${MONO.price}, 컬러 복사기는 ${COLOR.price}이며 VAT 별도입니다. 토너 등 소모품, 부품 교체, 출장 수리, 분기 정기점검이 월 요금에 들어 있습니다. 대구 전역은 당일 출장이 가능합니다. ${a.name} 현장 기록은 ${a.history}`;

  const service = serviceLd({
    id: serviceId(path),
    url: `${site.url}${path}`,
    name: `${a.full} 복사기 임대·복합기 렌탈`,
    serviceType: "복합기·프린터 렌탈",
    description: `${a.full} 복사기 임대·복합기 렌탈. 흑백 ${MONO.price}, 컬러 ${COLOR.price}(VAT 별도). 토너·부품·출장 수리·분기 점검 포함. 대구 달서구 한별시스템이 직접 설치·관리.`,
    areaServed: [{ "@type": "City", name: a.full }, { "@type": "City", name: "대구광역시" }],
    channelUrl: `${site.url}/rental/price/`,
    offers: [
      monthlyOffer("흑백 복사기(흑백 디지털복합기) 렌탈", MONO.monthly, MONO.note),
      monthlyOffer("컬러 복사기(컬러 디지털복합기) 렌탈", COLOR.monthly, COLOR.note),
    ],
  });

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "복합기 렌탈", path: "/rental/" }, { name: "지역 안내", path: "/rental/area/" }, { name: a.name, path }])} />
      <JsonLd data={webPageLd({ path, name: titleOf(a), mainEntityId: serviceId(path) })} />
      <JsonLd data={service} />
      <PageHeader
        badge={`복합기 임대 · ${a.full}`}
        title={`${a.full} 복사기 임대, 직접 설치하고 관리합니다`}
        description={`흑백 ${MONO.price}, 컬러 ${COLOR.price}(VAT 별도). 토너·부품·출장 수리 포함.`}
        back="/rental/area"
        backLabel="지역 안내"
      />

      <AnswerBlock
        question={`${a.full} 복사기 임대는 월 얼마이고 어디에 맡기면 되나요?`}
        answer={answer}
        facts={[
          { label: "흑백 복사기", value: MONO.price },
          { label: "컬러 복사기", value: COLOR.price },
          { label: "포함", value: "토너·부품·출장" },
          { label: "방문", value: "대구 전역 당일 가능" },
          { label: "전화", value: site.phone.main },
        ]}
      />

      <section className="py-10 lg:py-14">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <div className="eyebrow mb-3">{a.full}</div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-4">{a.name} 사무실 복합기, 이렇게 골랐습니다</h2>
          {a.intro.map((p) => (
            <p key={p.slice(0, 30)} className="hb-p">{fill(p)}</p>
          ))}
        </div>
      </section>

      {/* 월 임대료 - rental-prices.ts 단일 출처 */}
      <section className="py-10 lg:py-14 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-2">월 임대료</h2>
          <p className="text-[14px] text-[var(--mute)] mb-4">지역에 따라 달라지지 않습니다. 기종과 월 출력량에 따라 금액이 정해집니다(VAT 별도).</p>
          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="bg-hb-primary text-white text-left">
                  <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">품목</th>
                  <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">월 임대료</th>
                  <th className="py-2.5 px-4 font-extrabold">맞는 곳</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {[PRINTER, MONO, COLOR].map((r) => (
                  <tr key={r.item}>
                    <td className="py-2.5 px-4 font-bold text-[var(--ink)] whitespace-nowrap">{r.item}</td>
                    <td className="py-2.5 px-4 text-[var(--ink)] whitespace-nowrap">{r.price}</td>
                    <td className="py-2.5 px-4 text-[var(--mute)]">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[13px] text-[var(--mute)] mt-2">
            전체 품목은 <Link href="/rental/price" className="text-hb-blue hover:underline">복합기·프린터 임대료</Link>에 있습니다.
          </p>
        </div>
      </section>

      {(cases.length > 0 || posts.length > 0) && (
        <section className="py-10 lg:py-14">
          <div className="max-w-3xl mx-auto px-4 lg:px-6">
            <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-2">{a.name} 현장 기록</h2>
            <p className="text-[14px] text-[var(--mute)] mb-5">{a.history}</p>
            {cases.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-3 mb-5">
                {cases.map((c) => (
                  <Link key={c.slug} href={`/cases/${c.slug}`} className="block bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-4 hover:border-hb-blue transition">
                    <div className="text-[11px] font-extrabold text-hb-blue tracking-[.14em] mb-1">구축 사례 · {c.region} · {c.date}</div>
                    <div className="font-bold text-[var(--ink)] leading-snug">{c.title}</div>
                    <div className="text-[13px] text-[var(--mute)] mt-1 leading-relaxed">{c.summary}</div>
                  </Link>
                ))}
              </div>
            )}
            {posts.length > 0 && (
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
            )}
          </div>
        </section>
      )}

      <FaqSection title={`${a.full} 복사기 임대, 자주 묻는 질문`} items={a.faq.map((f) => ({ q: f.q, a: fill(f.a) }))} />

      <section className="py-10 lg:py-14">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-lg font-extrabold text-[var(--ink)] mb-3">다른 지역</h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {nearby.map((n) => (
              <Link key={n.slug} href={`/rental/area/${n.slug}`} className="px-3 py-1.5 rounded-full border border-[var(--line)] bg-[var(--panel)] text-sm font-bold text-[var(--ink)] hover:border-hb-blue hover:text-hb-blue transition">{n.name} 복사기 임대</Link>
            ))}
            <Link href="/rental" className="px-3 py-1.5 rounded-full border border-[var(--line)] bg-[var(--panel)] text-sm font-bold text-[var(--ink)] hover:border-hb-blue hover:text-hb-blue transition">대구 복합기 렌탈</Link>
            <Link href="/rental/area" className="px-3 py-1.5 rounded-full border border-[var(--line)] bg-[var(--panel)] text-sm font-bold text-[var(--ink)] hover:border-hb-blue hover:text-hb-blue transition">지역 안내 전체</Link>
          </div>
          <div className="rounded-2xl bg-hb-primary text-white p-6 lg:p-8">
            <div className="text-[11px] font-extrabold tracking-[.18em] text-white/70 mb-2">{a.full} 복사기 임대 문의</div>
            <div className="text-2xl lg:text-3xl font-black mb-2">
              <a href={site.phone.mainHref} className="hover:underline">{site.phone.main}</a>
            </div>
            <p className="text-white/85 text-[15px] leading-relaxed mb-4">
              한별시스템 · 대구광역시 달서구 {site.address.streetOnly} · {site.phone.hours}. 휴대전화 <a href={site.phone.mobileHref} className="underline">{site.phone.mobile}</a>.
            </p>
            <Link href="/support/quote" className="inline-block px-4 py-2 rounded-full bg-white text-hb-primary text-sm font-extrabold hover:bg-hb-blue-soft transition">무료 방문 견적 요청</Link>
          </div>
        </div>
      </section>
    </>
  );
}
