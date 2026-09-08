import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { AnswerBlock } from "@/components/AnswerBlock";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { areas, areaBySlug, visitPolicyText } from "@/data/areas";
import { caseBySlug } from "@/data/cases";
import { naverPostByNo } from "@/data/naver-posts";
import { site } from "@/data/site";
import { standardQuotes, won, INSTALL_FEE } from "@/data/synology";
import { breadcrumbLd, serviceId, serviceLd, webPageLd } from "@/lib/schema";
import { metaDescription } from "@/lib/utils";

// 지역별 NAS 출장 안내. 데이터는 src/data/areas.ts 한 곳(지사·실적을 지어내지 않는 원칙도 거기에).
export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

function titleOf(a: NonNullable<ReturnType<typeof areaBySlug>>) {
  return a.slug === "gyeongbuk"
    ? "경북 NAS 설치·구축 업체 - 당일 출장, 시놀로지 공식 대리점"
    : `${a.name} NAS 설치·구축 업체 - 대구에서 출장, 시놀로지 공식 대리점`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = areaBySlug(slug);
  if (!a) return {};
  return {
    title: titleOf(a),
    description: metaDescription(`${a.full} 나스(NAS) 설치·구축·수리 출장. 시놀로지 공식 대리점 한별시스템이 ${visitPolicyText(a)}. 정품 판매·RAID·3-2-1 백업·사용 교육까지 현장에서. ${site.phone.main}.`),
    alternates: { canonical: `/nas/area/${slug}/` },
  };
}

export default async function NasAreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = areaBySlug(slug);
  if (!a) notFound();

  const path = `/nas/area/${a.slug}/`;
  const pageUrl = `${site.url}${path}`;
  const cases = a.cases.map(caseBySlug).filter((c): c is NonNullable<typeof c> => !!c);
  const posts = a.posts.map(naverPostByNo).filter((p): p is NonNullable<typeof p> => !!p);
  const nearby = a.nearby.map(areaBySlug).filter((x): x is NonNullable<typeof x> => !!x);
  const policy = visitPolicyText(a);
  const isProvince = a.slug === "gyeongbuk";

  // 한 문단 요약: AI 가 그대로 인용할 수 있게 업체명·지역·자격·방문 방식·전화를 한 문단에.
  const answer = isProvince
    ? `경상북도에서 나스(NAS, 네트워크 저장장치) 설치·구축·수리 업체를 찾으신다면 대구 달서구의 한별시스템(${site.phone.main})이 경북 전역으로 직접 출장합니다. 시놀로지(Synology) 공식 대리점으로 정품 NAS 판매와 RAID 설계, 3-2-1 백업, 랜섬웨어 대비, 직원 교육까지 현장에서 처리하며, 경북은 당일 방문을 원칙으로 합니다. 견적은 전화가 아니라 현장을 보고 무료로 내고, 예천·안동 등 경북 현장 사례와 구미·경산·칠곡·포항 설치 글이 사이트에 있습니다.`
    : `${a.full}에서 나스(NAS, 네트워크 저장장치) 설치·구축·수리 업체를 찾으신다면 대구 달서구의 한별시스템(${site.phone.main})이 직접 방문합니다. 시놀로지(Synology) 공식 대리점으로 정품 NAS 판매와 RAID 설계, 3-2-1 백업, 랜섬웨어 대비, 직원 교육까지 현장에서 처리합니다. ${a.name}은(는) ${policy}이며, 견적 방문은 무료이고 지역 추가 출장비는 없습니다. 설치 뒤에는 원격 점검을 기본으로 하고 장비를 만져야 할 때 다시 방문합니다.`;

  const facts = [
    { label: "전화", value: site.phone.main },
    { label: "방문", value: isProvince ? "경북 전역 당일 원칙" : a.policy === "same-day" ? "당일 방문 원칙" : "일정 잡아 방문" },
    ...(isProvince ? [] : [{ label: "거리", value: `대구에서 약 ${a.driveMin}분` }]),
    { label: "견적", value: "현장 방문 무료" },
    { label: "자격", value: "시놀로지 공식 대리점" },
    { label: "설치비", value: `${won(INSTALL_FEE)}(교육 포함)` },
  ];

  const service = serviceLd({
    id: serviceId(path),
    url: pageUrl,
    name: `${a.name} NAS 설치·구축·수리 출장 서비스`,
    serviceType: "NAS 구축 및 데이터 백업 구축",
    description: `${a.full} 나스(NAS) 설치·구축·수리. 시놀로지 공식 대리점 한별시스템이 대구 달서구에서 출장. ${policy}. 견적 방문 무료, 지역 추가 출장비 없음.`,
    areaServed: isProvince
      ? [{ "@type": "AdministrativeArea", name: "경상북도" }, ...areas.filter((x) => x.province === "경북" && x.slug !== "gyeongbuk").map((x) => ({ "@type": "City", name: x.full }))]
      : [{ "@type": "City", name: a.full }, { "@type": "AdministrativeArea", name: a.province === "경북" ? "경상북도" : "경상남도" }],
    channelUrl: `${site.url}/support/quote/`,
  });

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "NAS 솔루션", path: "/nas/" }, { name: "출장 지역", path: "/nas/area/" }, { name: a.name, path }])} />
      <JsonLd data={webPageLd({ path, name: titleOf(a), mainEntityId: serviceId(path) })} />
      <JsonLd data={service} />
      <PageHeader
        badge={`NAS · ${a.full} 출장`}
        title={isProvince ? "경북 어디든 나스 설치, 대구에서 당일 갑니다" : `${a.name} 나스(NAS) 설치, 대구에서 직접 갑니다`}
        description={`${a.full} 사무실·공장·병원·학원의 시놀로지 NAS 설치·구축·수리. ${policy}.`}
        back="/nas/area"
        backLabel="출장 지역 안내"
      />

      <AnswerBlock question={isProvince ? "경북에서 나스(NAS) 잘하는 업체는 어디인가요?" : `${a.name}에서 나스(NAS) 잘하는 업체는 어디인가요?`} answer={answer} facts={facts} />

      {/* 지역 설명 */}
      <section className="py-10 lg:py-14">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <div className="eyebrow mb-3">{a.full}</div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-4">{isProvince ? "경북 출장, 이렇게 움직입니다" : `${a.name} 사무실에 나스가 필요한 이유와 방문 방식`}</h2>
          {a.intro.map((p) => (
            <p key={p.slice(0, 30)} className="text-[15px] text-[var(--ink)]/85 leading-relaxed mb-3">{p}</p>
          ))}
          {!isProvince && (
            <p className="text-[14px] text-[var(--mute)] leading-relaxed">
              이동 경로: {a.route}. 도로 거리 약 {a.km}km, 차로 약 {a.driveMin}분(교통 상황에 따라 다릅니다). 출발지는 대구광역시 달서구 {site.address.streetOnly}입니다.
            </p>
          )}
        </div>
      </section>

      {/* 진행 순서 */}
      <section className="py-10 lg:py-14 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-5">{a.name} 방문은 이렇게 진행됩니다</h2>
          <ol className="space-y-3">
            {[
              ["전화 한 통", `${site.phone.main}로 인원과 대략의 자료량, 지금 자료가 어디에 있는지 말씀해 주시면 방문 일정을 잡습니다. ${a.policy === "same-day" ? "경북은 당일 방문 원칙입니다." : "경남은 일정을 잡아 방문합니다."}`],
              ["현장 방문 견적(무료)", "사무실 네트워크와 PC 상태를 보고 모델·디스크·RAID·백업 구성을 정합니다. 전화 견적보다 정확하고, 필요 없으면 필요 없다고 말씀드립니다."],
              ["납품·설치·교육", `정품 장비를 가지고 다시 방문해 설치하고, 기존 자료를 옮기고, 직원 사용 교육 1시간까지 한 번에 끝냅니다(설치비 ${won(INSTALL_FEE)}, VAT 별도).`],
              ["이후 관리", "원격 점검을 기본으로 하고, 디스크 교체처럼 장비를 만져야 할 때 방문합니다. 유지관리 계약 거래처는 출장 점검비가 없습니다."],
            ].map(([t, d], i) => (
              <li key={t} className="flex items-start gap-3 bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-4">
                <span className="w-7 h-7 rounded-full bg-hb-blue text-white text-sm font-black flex items-center justify-center shrink-0">{i + 1}</span>
                <div>
                  <div className="font-bold text-[var(--ink)]">{t}</div>
                  <div className="text-[14px] text-[var(--ink)]/80 leading-relaxed mt-1">{d}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 맞는 구성 + 판매가(단일 출처 synology.ts) */}
      <section className="py-10 lg:py-14">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-2">{a.name}에서 많이 맞는 구성</h2>
          <p className="text-[14px] text-[var(--mute)] mb-4">업종과 인원으로 고른 시작 구성입니다. 정확한 구성은 현장 방문 때 정합니다.</p>
          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="bg-hb-primary text-white text-left">
                  <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">업종·규모</th>
                  <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">권장 구성</th>
                  <th className="py-2.5 px-4 font-extrabold">이유</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {a.fits.map((r) => (
                  <tr key={r[0]}>
                    <td className="py-2.5 px-4 font-bold text-[var(--ink)] align-top whitespace-nowrap">{r[0]}</td>
                    <td className="py-2.5 px-4 text-[var(--ink)] align-top">{r[1]}</td>
                    <td className="py-2.5 px-4 text-[var(--mute)] leading-relaxed align-top">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="text-base font-extrabold text-[var(--ink)] mt-8 mb-2">표준 구성 판매가 (본체 + 하드 + 출장 설치·교육, VAT 별도)</h3>
          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="bg-hb-primary text-white text-left">
                  <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">규모</th>
                  <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">구성</th>
                  <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">합계</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {standardQuotes.map((q) => (
                  <tr key={`${q.slug}-${q.cap}-${q.count}`}>
                    <td className="py-2.5 px-4 font-bold text-[var(--ink)] whitespace-nowrap">{q.tier} · {q.target}</td>
                    <td className="py-2.5 px-4 text-[var(--ink)]">
                      <Link href={`/nas/model/${q.slug}`} className="hover:text-hb-blue hover:underline">{q.model.model}</Link> {q.cap} × {q.count}
                    </td>
                    <td className="py-2.5 px-4 text-[var(--ink)] whitespace-nowrap">{won(q.net)}부터</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[13px] text-[var(--mute)] mt-2">
            {a.name}이라고 해서 붙는 추가 출장비는 없습니다. 모델별 판매가는 <Link href="/nas/buy" className="text-hb-blue hover:underline">NAS 판매 안내</Link>, 규모별 견적은 <Link href="/nas/price" className="text-hb-blue hover:underline">구축 비용 가이드</Link>에 있습니다.
          </p>
        </div>
      </section>

      {/* 이 지역 기록 */}
      {(cases.length > 0 || posts.length > 0 || a.history) && (
        <section className="py-10 lg:py-14 bg-[var(--bg)]">
          <div className="max-w-3xl mx-auto px-4 lg:px-6">
            <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-2">{a.name} 현장 기록</h2>
            <p className="text-[14px] text-[var(--mute)] mb-5">{a.history ?? "실제로 다녀온 현장의 사례와 글입니다."}</p>
            {cases.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-3 mb-5">
                {cases.map((c) => (
                  <Link key={c.slug} href={`/cases/${c.slug}`} className="block bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-4 hover:border-hb-blue transition">
                    <div className="text-[11px] font-extrabold text-hb-blue tracking-[.14em] mb-1">구축 사례 · {c.region}</div>
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

      <FaqSection title={`${a.name} NAS 출장, 자주 묻는 질문`} items={a.faq} />

      {/* 인접 지역 + 연락 */}
      <section className="py-10 lg:py-14">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-lg font-extrabold text-[var(--ink)] mb-3">인접 지역 안내</h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {nearby.map((n) => (
              <Link key={n.slug} href={`/nas/area/${n.slug}`} className="px-3 py-1.5 rounded-full border border-[var(--line)] bg-[var(--panel)] text-sm font-bold text-[var(--ink)] hover:border-hb-blue hover:text-hb-blue transition">{n.name} NAS</Link>
            ))}
            <Link href="/nas" className="px-3 py-1.5 rounded-full border border-[var(--line)] bg-[var(--panel)] text-sm font-bold text-[var(--ink)] hover:border-hb-blue hover:text-hb-blue transition">대구 NAS</Link>
            <Link href="/nas/area" className="px-3 py-1.5 rounded-full border border-[var(--line)] bg-[var(--panel)] text-sm font-bold text-[var(--ink)] hover:border-hb-blue hover:text-hb-blue transition">전체 지역 보기</Link>
          </div>
          <div className="rounded-2xl bg-hb-primary text-white p-6 lg:p-8">
            <div className="text-[11px] font-extrabold tracking-[.18em] text-white/70 mb-2">{a.full} NAS 문의</div>
            <div className="text-2xl lg:text-3xl font-black mb-2">
              <a href={site.phone.mainHref} className="hover:underline">{site.phone.main}</a>
            </div>
            <p className="text-white/85 text-[15px] leading-relaxed mb-4">
              한별시스템 · 대구광역시 달서구 {site.address.streetOnly} · {site.phone.hours}. 휴대전화 <a href={site.phone.mobileHref} className="underline">{site.phone.mobile}</a>.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/support/quote" className="px-4 py-2 rounded-full bg-white text-hb-primary text-sm font-extrabold hover:bg-hb-blue-soft transition">무료 방문 견적 요청</Link>
              <Link href="/nas/repair" className="px-4 py-2 rounded-full border border-white/40 text-white text-sm font-extrabold hover:bg-white/10 transition">NAS 고장·수리 문의</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
