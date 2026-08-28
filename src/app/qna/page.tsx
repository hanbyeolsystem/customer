import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { AnswerBlock } from "@/components/AnswerBlock";
import { QnaBrowser } from "@/components/QnaBrowser";
import { JsonLd } from "@/components/JsonLd";
import { qna, qnaCats, qnaModified } from "@/data/qna";
import { site } from "@/data/site";
import { breadcrumbLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: `Q&A - 사내 AI·나스·복합기 렌탈·컴퓨터 수리 ${qna.length}문답`,
  description: `사내 AI를 회사 안에서 돌릴 수 있나요? DS925+ 설치하면 얼마인가요? 랜섬웨어에 걸리면 NAS 자료도 암호화되나요? 대구 한별시스템이 실제 고객 질문 ${qna.length}가지에 즉답합니다.`,
  alternates: { canonical: "/qna/" },
};

// /qna/ 는 목록 허브. 예전엔 256개 FAQPage + 사진 257장을 한 페이지에 실어 587KB 였다.
// 분류별 페이지(/qna/cat/*)로 나누고 여기는 글자 목록만 둔다.
const counts = qnaCats.map((c) => ({ ...c, n: qna.filter((q) => q.cat === c.id).length }));

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${site.url}/qna/`,
  url: `${site.url}/qna/`,
  name: `한별시스템 Q&A ${qna.length}문답`,
  inLanguage: "ko-KR",
  dateModified: qnaModified,
  hasPart: counts.map((c) => ({
    "@type": "CollectionPage",
    name: c.label,
    url: `${site.url}/qna/cat/${c.id}/`,
    numberOfItems: c.n,
  })),
};

export default function QnaPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd([{ name: "Q&A", path: "/qna/" }])} />
      <PageHeader
        badge="Q&A"
        title="궁금한 것부터 해결하세요"
        description={`사내 AI·나스·백업·복합기 렌탈·컴퓨터·네트워크 - 19년간 고객에게 실제로 받은 질문 ${qna.length}가지에 그대로 답합니다.`}
      />

      <AnswerBlock
        question="한별시스템 Q&A에는 어떤 질문이 있나요?"
        answer={`${counts.map((c) => `${c.label} ${c.n}문항`).join(", ")}으로 모두 ${qna.length}문항입니다. 사내 AI를 회사 안에서 돌릴 수 있는지, 시놀로지 DS925+ 설치 비용이 얼마인지, 랜섬웨어에 걸리면 NAS 자료도 암호화되는지, 복합기 임대료에 무엇이 포함되는지처럼 대구·경북 사무실에서 실제로 받은 질문에 결론부터 답합니다. 금액은 흑백 복사기 월 70,000원부터, DS925+ 8TB 2개 구성 3,250,000원처럼 확정 단가만 적고, 확인되지 않은 수치는 쓰지 않습니다. 질문마다 개별 페이지가 있어 검색으로 바로 찾을 수 있고, 없는 질문은 커뮤니티에 남기시면 한별시스템 엔지니어가 답합니다. 대구광역시 달서구 한별시스템, ${site.phone.main}.`}
        facts={counts.slice(0, 4).map((c) => ({ label: c.label.split(" · ")[0], value: `${c.n}문항` }))}
      />

      {/* 분류 카드 */}
      <section className="py-10 bg-[var(--panel)] border-y border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {counts.map((c) => (
              <Link key={c.id} href={`/qna/cat/${c.id}`} className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-5 hover:border-hb-blue transition group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl" aria-hidden>{c.icon}</span>
                  <span className="text-[11px] font-extrabold text-hb-blue">{c.n}문항</span>
                </div>
                <h2 className="font-extrabold text-[var(--ink)] leading-snug mb-2">{c.label}</h2>
                <ul className="text-[13px] text-[var(--mute)] leading-relaxed space-y-1">
                  {qna.filter((q) => q.cat === c.id).slice(0, 3).map((q) => (
                    <li key={q.slug} className="truncate">· {q.q}</li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-1 mt-3 text-[12px] font-bold text-hb-blue group-hover:gap-2 transition-all">전체 보기 →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 검색 + 전체 글자 목록(사진 없음) */}
      <QnaBrowser
        items={qna.map(({ slug, cat, q, a }) => ({ slug, cat, q, a }))}
        cats={qnaCats.map((c) => ({ ...c }))}
        compact
      />

      <section className="py-10 bg-[var(--panel)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-lg font-extrabold text-[var(--ink)] mb-2">찾는 질문이 없나요?</h2>
          <p className="text-sm text-[var(--mute)] mb-5">
            커뮤니티에 질문을 남기면 한별시스템 엔지니어가 답해 드립니다.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/community" className="inline-flex items-center gap-2 bg-hb-blue text-white font-extrabold px-6 py-3 rounded-xl">
              커뮤니티에 질문하기 →
            </Link>
            <Link href="/support/quote" className="inline-flex items-center gap-2 border border-[var(--line)] text-[var(--ink)] font-bold px-6 py-3 rounded-xl hover:bg-[var(--bg)]">
              방문 견적 요청 (무료)
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
