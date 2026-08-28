import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { caseBySlug, caseStudies } from "@/data/cases";
import { businessId, site } from "@/data/site";
import { FaqSection } from "@/components/FaqSection";
import { AnswerBlock } from "@/components/AnswerBlock";
import { INSTALL_FEE, RENT_FROM, nasModels, quote, standardQuotes, won } from "@/data/synology";
import type { CaseStudy } from "@/data/cases";

// 사례마다 붙는 FAQ. 템플릿이지만 장비·지역·금액이 현장별로 달라 내용이 겹치지 않는다.
// 금액은 synology.ts 와 /rental/price 의 확정가만 쓴다.
function caseFaq(c: CaseStudy) {
  const faq: { q: string; a: string }[] = [];
  const model = nasModels.find((m) => c.gear.some((g) => g.includes(m.model)));
  if (c.category === "nas") {
    if (model && model.price) {
      const q = quote(model, model.recommend.cap, model.recommend.count);
      faq.push({
        q: `${model.model}로 이 현장처럼 구성하면 비용이 얼마나 드나요?`,
        a: `본체 ${won(model.price)}에 ${model.recommend.cap} 디스크 ${model.recommend.count}개와 출장 설치·설정교육 ${won(INSTALL_FEE)}을 더하면 ${won(q.net)}(VAT 별도, 포함 ${won(q.vat)})입니다. 시놀로지 권장소비자가 기준이며 디스크 용량과 개수, 현장 조건에 따라 달라집니다. 초기 목돈이 부담이면 월 ${won(RENT_FROM)}부터(기본 36개월) 임대도 가능하고 임대료에 장비·설치·백업 관리·장애 출장·하드디스크 교체가 포함됩니다.`,
      });
    } else {
      faq.push({
        q: "이 현장처럼 구성하면 비용이 얼마나 드나요?",
        a: `장비 구성과 디스크 용량에 따라 달라 현장을 보고 견적을 냅니다. 참고로 DS925+에 8TB 2개와 출장 설치·설정교육 ${won(INSTALL_FEE)}까지 하면 ${won(standardQuotes[1].net)}(VAT 별도)이고, 임대는 월 ${won(RENT_FROM)}부터입니다. 방문 견적은 무료입니다.`,
      });
    }
    faq.push({
      q: "설치 후 관리는 어떻게 되나요?",
      a: "설치로 끝내지 않습니다. 하드디스크는 소모품이고 백업은 멈춰도 티가 나지 않기 때문에 한별시스템이 주기적으로 방문해 디스크 상태와 백업 동작을 확인합니다. 임대 계약이면 이 점검과 하드디스크 교체가 월 정액에 포함되고, 구매 고객은 유지관리 계약으로 상태를 대신 지켜봐 드립니다.",
    });
  } else if (c.category === "printer") {
    faq.push({
      q: `${c.gear[0]} 같은 기종을 임대하면 월 얼마인가요?`,
      a: "흑백 복사기(흑백 디지털복합기)는 월 70,000원부터, 컬러 복사기(컬러 디지털복합기)는 월 100,000원부터입니다(VAT 별도, 시작가). 이 월 정액 하나에 토너 등 소모품, 부품 교체, 출장 수리, 분기 정기점검이 모두 들어가 고장이 나도 추가 비용이 붙지 않습니다. 기종과 월 인쇄량에 따라 달라지므로 053-588-7119로 확인해 주세요.",
    });
    faq.push({
      q: "기종은 어떤 기준으로 정하나요?",
      a: "사무실 크기가 아니라 월 인쇄량으로 정합니다. 인쇄량이 적으면 빠른 기종을 넣어도 돈만 더 들고, 인쇄량이 많으면 작은 사무실이라도 대형 복합기가 맞습니다. 컬러 비중, 복사·스캔·팩스 사용 여부, A3 필요 여부, 설치 자리와 동선을 방문해서 확인하고 제안합니다.",
    });
  } else if (c.category === "pc") {
    faq.push({
      q: "PC와 모니터를 임대하면 월 얼마인가요?",
      a: "데스크탑과 모니터 세트가 월 40,000원부터(데스크탑 35,000원 + 모니터 5,000원, VAT 별도)입니다. 초기 목돈 없이 자리를 만들 수 있고 고장 시 AS가 임대에 포함되어 수리 기사를 따로 찾을 필요가 없습니다. 사양은 업무를 여쭤보고 그에 맞게 구성합니다.",
    });
    faq.push({
      q: "복합기나 NAS도 같이 맡길 수 있나요?",
      a: "됩니다. 컴퓨터, 복합기, NAS, 네트워크를 한별시스템 한 팀이 관리하므로 장애가 났을 때 원인을 고객이 구분할 필요 없이 연락 한 번이면 됩니다. 실제로 PC와 복합기, NAS를 한 번의 방문으로 함께 설치한 현장이 있습니다.",
    });
  } else if (c.category === "network") {
    faq.push({
      q: "랜공사 견적은 어떤 항목으로 구성되나요?",
      a: "배선 자재(CAT6 이상 케이블·커넥터·포트), 배선 시공(매립 또는 노출), 네트워크 장비(공유기·스위치), 전원 정리, 선정리, 최종 점검으로 나뉩니다. 자리 수와 배선 거리, 벽을 타는지에 따라 금액이 달라져 현장을 봐야 정확한 금액이 나옵니다. 견적에 선정리와 점검이 포함되는지 꼭 확인하세요.",
    });
    faq.push({
      q: "서버나 NAS 설치도 같이 되나요?",
      a: "됩니다. 한별시스템은 랜 배선, 서버·NAS 설치, 컴퓨터 렌탈을 같은 팀이 합니다. 배선 업체와 서버 업체가 다르면 느린 원인이 선인지 장비인지를 고객이 중재해야 하는데, 한 회사가 보면 그럴 일이 없습니다.",
    });
  } else {
    faq.push({
      q: "가끔 쓰는 장비도 임대가 되나요?",
      a: "됩니다. 빔프로젝터처럼 보고와 발표가 잦지만 구매까지는 아까운 장비가 임대에 잘 맞습니다. 설치와 선정리까지 해 드리고, 컴퓨터·프린터·NAS와 함께 한 창구로 관리합니다.",
    });
  }
  faq.push({
    q: `${c.region}도 방문하시나요?`,
    a: c.region.includes("대구")
      ? `대구는 당일 방문합니다. ${c.region} 현장도 그렇게 진행했습니다. 방문 견적은 무료이고, 필요 없으면 필요 없다고 말씀드립니다. 문의 ${site.phone.main}.`
      : `방문합니다. ${c.region} 현장이 그 사례입니다. 대구·경북은 당일, 그 외 지역은 일정을 미리 조율하며 먼 지역은 방문 횟수를 줄이도록 사전 준비와 원격 지원을 함께 설계합니다. 방문 견적은 무료입니다. 문의 ${site.phone.main}.`,
  });
  return faq;
}

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = caseBySlug(slug);
  if (!c) return {};
  return {
    title: `${c.title} - 구축 사례`,
    description: `${c.summary} ${c.region} ${c.industry}, 투입 장비 ${c.gear.join(", ")}. 한별시스템 실제 시공 기록.`.slice(0, 300),
    alternates: { canonical: `/cases/${slug}/` },
    openGraph: { images: [{ url: c.images[0] }] },
  };
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = caseBySlug(slug);
  if (!c) notFound();

  const pageUrl = `${site.url}/cases/${c.slug}/`;
  const related = caseStudies.filter((x) => x.category === c.category && x.slug !== c.slug).slice(0, 3);

  // 사례는 회사가 수행한 작업 기록이므로 CreativeWork 로 두고, 회사는 @id 참조만 한다.
  // 빵부스러기(BreadcrumbList)를 같이 넣어 검색결과에 경로가 노출되게 한다.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${pageUrl}#case`,
        name: c.title,
        headline: c.title,
        description: c.summary,
        about: `${c.industry} · ${c.gear.join(", ")}`,
        image: c.images.map((i) => `${site.url}${i}`),
        url: pageUrl,
        inLanguage: "ko-KR",
        dateCreated: c.date,
        locationCreated: { "@type": "Place", name: c.region },
        creator: { "@id": businessId },
        keywords: c.tags.join(", "),
        isBasedOn: c.href,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "구축 사례", item: `${site.url}/cases/` },
          { "@type": "ListItem", position: 3, name: c.title, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        badge={`${c.region} · ${c.date.replace("-", ".")} · ${c.industry}`}
        title={c.title}
        description={c.summary}
        back="/cases"
        backLabel="구축 사례"
      />
      <AnswerBlock
        question={`${c.title}, 어떤 현장이었나요?`}
        answer={[c.summary, c.challenge, c.result].filter(Boolean).join(" ")}
        facts={[
          { label: "지역", value: c.region },
          { label: "업종", value: c.industry },
          { label: "투입 장비", value: `${c.gear.length}종` },
          { label: "시공", value: c.date.replace("-", ".") },
        ]}
      />

      {/* 핵심 스펙 */}
      {c.spec && (
        <section className="py-8 bg-[var(--panel)] border-b border-[var(--line)]">
          <div className="max-w-4xl mx-auto px-4 lg:px-6">
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {c.spec.map((s) => (
                <div key={s.label} className="bg-[var(--bg)] border border-[var(--line)] rounded-xl px-4 py-3">
                  <dt className="text-[11px] font-bold text-[var(--mute)] mb-1">{s.label}</dt>
                  <dd className="text-sm font-extrabold text-hb-blue leading-snug">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <section className="py-10 lg:py-14 bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          {/* 대표 사진 */}
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[var(--line)] mb-8">
            <Image src={c.images[0]} alt={`${c.title} 현장 사진`} fill sizes="(min-width:1024px) 900px, 100vw" className="object-cover" priority />
          </div>

          {/* 과제 */}
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-3">어떤 문제가 있었나</h2>
          <p className="text-[15px] text-[var(--ink)]/90 leading-relaxed mb-9">{c.challenge}</p>

          {/* 시공 내용 */}
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-4">한별시스템이 한 일</h2>
          <ol className="space-y-3 mb-9">
            {c.solution.map((s, i) => (
              <li key={s} className="flex gap-3 bg-[var(--panel)] border border-[var(--line)] rounded-2xl px-5 py-4">
                <span className="shrink-0 w-6 h-6 rounded-full bg-hb-blue text-white text-[11px] font-extrabold grid place-items-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-[var(--ink)]/90 leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>

          {/* 추가 사진 */}
          {c.images.length > 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-9">
              {c.images.slice(1).map((img, i) => (
                <figure key={img} className="m-0">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[var(--line)]">
                    <Image src={img} alt={`${c.region} ${c.industry} ${c.gear[0]} 시공 사진 ${i + 2}`} fill sizes="33vw" className="object-cover" />
                  </div>
                  <figcaption className="text-[11px] text-[var(--mute)] mt-1.5">{c.region} · {c.gear[0]} · 현장 사진 {i + 2}</figcaption>
                </figure>
              ))}
            </div>
          )}

          {/* 이 현장의 장비 */}
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-3">이 현장에 들어간 것</h2>
          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--panel)] mb-9">
            <table className="w-full text-sm min-w-[480px]">
              <tbody className="divide-y divide-[var(--line)]">
                {[
                  ["투입 장비", c.gear.join(" · ")],
                  ...(c.spec ?? []).map((s) => [s.label, s.value]),
                  ["업종", c.industry],
                  ["지역", c.region],
                  ["시공 시점", c.date.replace("-", "년 ") + "월"],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td className="py-2.5 px-4 font-bold text-[var(--ink)] whitespace-nowrap w-32">{k}</td>
                    <td className="py-2.5 px-4 text-[var(--mute)] leading-relaxed">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 결과 */}
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-3">결과</h2>
          <div className="border-l-4 border-hb-blue bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 mb-9">
            <p className="text-[15px] text-[var(--ink)]/90 leading-relaxed font-medium">{c.result}</p>
          </div>

          {/* 태그 + 원문 */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {c.tags.map((t) => (
              <span key={t} className="text-[11px] font-semibold text-[var(--mute)] bg-[var(--panel)] border border-[var(--line)] px-2.5 py-1 rounded-full">
                #{t}
              </span>
            ))}
          </div>
          <a
            href={c.href}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 text-sm font-bold text-hb-blue hover:underline"
          >
            사진이 더 있는 원문 후기 보기 →
          </a>
        </div>
      </section>

      <FaqSection title="이 현장과 관련해 자주 묻는 질문" items={caseFaq(c)} />

      {/* 관련 사례 */}
      {related.length > 0 && (
        <section className="py-12 bg-[var(--panel)] border-t border-[var(--line)]">
          <div className="max-w-4xl mx-auto px-4 lg:px-6">
            <h2 className="text-lg font-extrabold text-[var(--ink)] mb-5">비슷한 현장</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.slug} href={`/cases/${r.slug}`} className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl overflow-hidden hover:border-hb-blue transition">
                  <div className="relative aspect-[16/10]">
                    <Image src={r.images[0]} alt={r.title} fill sizes="33vw" className="object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] font-bold text-[var(--mute)] mb-1">{r.region}</div>
                    <h3 className="text-sm font-extrabold text-[var(--ink)] leading-snug">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-5">
            비슷한 구성을 검토 중이시면 현장을 보고 견적을 내 드립니다. 대구·경북은 당일 방문합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/support/quote" className="inline-flex items-center justify-center bg-hb-blue hover:bg-hb-azure text-white font-extrabold text-[15px] px-7 py-3.5 rounded-xl transition">
              무료 방문 견적 요청
            </Link>
            <a href={site.phone.mainHref} className="inline-flex items-center justify-center border border-[var(--line)] text-[var(--ink)] font-extrabold text-[15px] px-7 py-3.5 rounded-xl transition hover:border-hb-blue">
              전화 {site.phone.main}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
