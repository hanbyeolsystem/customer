import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { AnswerBlock } from "@/components/AnswerBlock";
import { QnaBrowser } from "@/components/QnaBrowser";
import { JsonLd } from "@/components/JsonLd";
import { qna, qnaCats, qnaModified, qnaPublished } from "@/data/qna";
import { site } from "@/data/site";
import { breadcrumbLd, isoDateTime } from "@/lib/schema";

// 분류별 Q&A 목록. 여기에만 FAQPage 스키마를 둔다(분류당 30~80문항).
export function generateStaticParams() {
  return qnaCats.map((c) => ({ cat: c.id }));
}

const INTRO: Record<string, { title: string; desc: string; answer: string; facts: { label: string; value: string }[] }> = {
  ai: {
    title: "사내 AI·데이터 관리 Q&A",
    desc: "회사 자료를 밖으로 내보내지 않고 AI를 쓰는 방법, 도입 비용과 단계, 한별시스템 자사 NAS 실측치까지.",
    answer: "사내 AI는 AI 모델을 외부 서버가 아니라 회사 NAS 안에서 돌려 자료가 사무실 밖으로 나가지 않게 하는 구성입니다. 한별시스템은 이 구성을 자사 NAS(Ryzen V1500B, RAM 4GB)에서 2026년 8월 3일부터 직접 운영하고 있으며 소형 모델 기준 답변 7~60초, 초당 11~12토큰, 상주 메모리 약 2.1GB를 실측했습니다. 도입은 기존 NAS 문서 검색(1단계), 사내 전용 AI 서버(2단계), GPU 장비(3단계)로 나누며, 직원 5명 이하이고 문서가 많지 않은 곳에는 권하지 않습니다.",
    facts: [{ label: "실측 답변", value: "7~60초" }, { label: "운영 시작", value: "2026.08.03" }, { label: "도입", value: "3단계" }, { label: "상담", value: "무료" }],
  },
  nas: {
    title: "나스(NAS)·데이터 백업 Q&A",
    desc: "시놀로지 모델 선택, 구축 비용, RAID, 랜섬웨어 대비, 복구와 이관, 업종별 구성까지 실제 현장 기준으로.",
    answer: "NAS는 회사 안에 두는 전용 저장 서버로 클라우드와 달리 한 번 구축하면 회사 소유가 됩니다. 한별시스템은 대구·경북에서 50건 이상 구축했고 DS925+가 가장 많이 나가는 모델입니다. DS925+ 본체 1,402,000원에 8TB 2개와 출장 설치·설정교육 400,000원을 더하면 3,250,000원(VAT 별도)이며, 임대는 월 100,000원부터입니다. RAID는 백업이 아니므로 스냅샷과 외부 사본을 반드시 얹고, 랜섬웨어 대비 4가지(스냅샷·외부 사본·2단계 인증·인터넷 노출 차단)는 설정만으로 됩니다.",
    facts: [{ label: "NAS 구축", value: "50건 이상" }, { label: "DS925+ 구성", value: "3,250,000원" }, { label: "임대", value: "월 10만원부터" }, { label: "설치비", value: "400,000원" }],
  },
  printer: {
    title: "복합기·프린터 렌탈 Q&A",
    desc: "월 임대료, 포함 내역, 기종 선택, 토너, 계약 전 확인 사항까지 실제 설치 현장 기준으로.",
    answer: "복합기 임대는 흑백 복사기 월 70,000원부터, 컬러 복사기 월 100,000원부터(VAT 별도)이며 월 정액에 토너 등 소모품, 부품 교체, 출장 수리, 분기 정기점검이 모두 들어갑니다. 한별시스템은 카운터를 원격으로 자동 수집해 토너가 떨어지기 전에 먼저 보내 드리고, 대구·경북은 당일 출동합니다. 기종은 사무실 크기가 아니라 월 인쇄량으로 정하며, 교세라 TASKalfa 3011i·3552ci·VFM251ci·VFM351ci·4012iG를 현장에 설치했습니다. 설치·운영 300대 이상.",
    facts: [{ label: "흑백 복사기", value: "월 7만원부터" }, { label: "컬러 복사기", value: "월 10만원부터" }, { label: "설치", value: "300대 이상" }, { label: "출동", value: "대구·경북 당일" }],
  },
  pc: {
    title: "컴퓨터·전산관리 Q&A",
    desc: "사무용 PC 사양, 임대, 느려짐과 고장 대응, 전산 담당자 없는 회사의 관리법까지.",
    answer: "사무용 PC는 하는 일에 맞는 사양이면 충분하고 무조건 고사양은 돈만 더 듭니다. 데스크탑과 모니터 세트는 월 40,000원부터(데스크탑 35,000원 + 모니터 5,000원, VAT 별도) 임대할 수 있고 AS가 포함됩니다. PC가 느린 원인이 PC가 아니라 네트워크인 경우가 많아 한별시스템은 원격으로 먼저 원인을 좁힌 뒤 방문합니다. 컴퓨터·복합기·NAS·네트워크를 한 회사가 관리해 관리 고객사 170곳 이상을 운영하고 있습니다.",
    facts: [{ label: "PC+모니터", value: "월 4만원부터" }, { label: "관리 고객사", value: "170곳 이상" }, { label: "대응", value: "원격 우선" }, { label: "대구·경북", value: "당일 방문" }],
  },
  network: {
    title: "네트워크·인터넷 Q&A",
    desc: "사무실 랜공사, 와이파이, 인터넷 느림, VPN, NAS 연결까지 배선부터 장비까지.",
    answer: "사무실 네트워크는 배선이 곧 속도입니다. NAS나 PC를 좋은 것으로 바꿔도 랜이 낡으면 체감이 그대로라, 한별시스템은 인터넷이 느릴 때 회선·공유기·스위치·배선·PC 순서로 원인을 좁힙니다. 새로 시공하면 CAT6 이상을 쓰고, 선정리는 제2의 작업으로 봅니다. 랜 배선, 서버·NAS 설치, 컴퓨터 렌탈을 같은 팀이 하기 때문에 장애 시 책임 소재를 고객이 가릴 필요가 없으며, 대구·경북 중심 50개사 이상 현장에서 시공했습니다.",
    facts: [{ label: "배선 기준", value: "CAT6 이상" }, { label: "시공", value: "50개사 이상" }, { label: "원인 추적", value: "회선→배선→PC" }, { label: "견적", value: "방문 무료" }],
  },
  service: {
    title: "방문 서비스·견적 Q&A",
    desc: "방문 지역, 견적 방식, 설치 후 관리, 한별시스템이 다른 점까지.",
    answer: "한별시스템은 견적을 전화가 아니라 현장 방문으로 내고 방문 견적은 무료입니다. 대구·경북은 당일 방문하며 예천·안동·포항·군위·칠곡·경산과 경남 창원 사무실까지 시공했습니다. 설치가 끝이 아니라 설치한 현장을 주기적으로 방문해 디스크 상태와 백업 동작을 확인하고, 필요 없는 곳에는 필요 없다고 말씀드립니다. 2008년 대구 성서공단에서 시작해 19년째이며 사업자등록번호 514-22-73057, 대표번호 053-588-7119입니다.",
    facts: [{ label: "방문 견적", value: "무료" }, { label: "대구·경북", value: "당일" }, { label: "업력", value: "2008년부터" }, { label: "전화", value: "053-588-7119" }],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ cat: string }> }): Promise<Metadata> {
  const { cat } = await params;
  const c = qnaCats.find((x) => x.id === cat);
  const intro = INTRO[cat];
  if (!c || !intro) return {};
  const n = qna.filter((q) => q.cat === cat).length;
  return {
    title: `${intro.title} ${n}문항`,
    description: intro.desc.slice(0, 155),
    alternates: { canonical: `/qna/cat/${cat}/` },
  };
}

export default async function QnaCatPage({ params }: { params: Promise<{ cat: string }> }) {
  const { cat } = await params;
  const c = qnaCats.find((x) => x.id === cat);
  const intro = INTRO[cat];
  if (!c || !intro) notFound();
  const items = qna.filter((q) => q.cat === cat);
  const pageUrl = `${site.url}/qna/cat/${cat}/`;

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": pageUrl,
    url: pageUrl,
    inLanguage: "ko-KR",
    datePublished: isoDateTime(qnaPublished),
    dateModified: isoDateTime(qnaModified),
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a, url: `${site.url}/qna/${f.slug}/` },
    })),
  };

  return (
    <>
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumbLd([{ name: "Q&A", path: "/qna/" }, { name: c.label, path: `/qna/cat/${cat}/` }])} />
      <PageHeader badge={`Q&A · ${items.length}문항`} title={intro.title} description={intro.desc} back="/qna" backLabel="Q&A 홈" />
      <AnswerBlock question={`${c.label}, 먼저 알아야 할 것은 무엇인가요?`} answer={intro.answer} facts={intro.facts} />
      <QnaBrowser items={items.map(({ slug, cat: k, q, a }) => ({ slug, cat: k, q, a }))} cats={[]} />
      <section className="py-8 bg-[var(--panel)] border-t border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 flex flex-wrap gap-2">
          {qnaCats.filter((x) => x.id !== cat).map((x) => (
            <Link key={x.id} href={`/qna/cat/${x.id}`} className="text-sm font-bold bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] px-4 py-2 rounded-full hover:border-hb-blue transition">
              {x.icon} {x.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
