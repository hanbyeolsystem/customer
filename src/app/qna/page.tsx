import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { QnaBrowser } from "@/components/QnaBrowser";
import { qna, qnaCats, qnaModified, qnaPublished } from "@/data/qna";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Q&A - 사내 AI·나스·복합기 렌탈·컴퓨터 수리 ${qna.length}문답`,
  description: `사내 AI를 회사 안에서 돌릴 수 있나요? DS925+ 설치하면 얼마인가요? 랜섬웨어에 걸리면 NAS 자료도 암호화되나요? 복합기 렌탈료엔 뭐가 포함되나요? 대구 한별시스템이 실제 고객 질문 ${qna.length}가지에 즉답합니다. 전산은 전화 한 통.`,
  alternates: { canonical: "/qna/" },
};

export default function QnaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${site.url}/qna/`,
    url: `${site.url}/qna/`,
    inLanguage: "ko-KR",
    datePublished: qnaPublished,
    dateModified: qnaModified,
    mainEntity: qna.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
        url: `${site.url}/qna/${f.slug}/`,
      },
    })),
  };

  return (
    <>
      <PageHeader
        badge="Q&A"
        title="궁금한 것부터 해결하세요"
        description="나스·백업·복합기 렌탈·컴퓨터·네트워크 - 19년간 고객에게 실제로 받은 질문 155가지에 그대로 답합니다."
      />
      <QnaBrowser
        items={qna.map(({ slug, cat, q, a }) => ({ slug, cat, q, a }))}
        cats={qnaCats.map((c) => ({ ...c }))}
      />
      <section className="py-10 bg-[var(--panel)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-lg font-extrabold text-[var(--ink)] mb-2">찾는 질문이 없나요?</h2>
          <p className="text-sm text-[var(--mute)] mb-5">
            커뮤니티에 질문을 남기면 한별시스템과 다른 사용자들이 답해 드립니다.
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
