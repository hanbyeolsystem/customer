import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { qna, qnaCats, qnaByCat } from "@/data/qna";

export const metadata: Metadata = {
  title: "Q&A — NAS·복사기·컴퓨터 궁금증 해결",
  description:
    "NAS가 뭔가요? 복합기 임대료는 뭐가 포함되나요? 대구 IT 전문기업 한별시스템이 실제 고객 질문에 답합니다. NAS·시놀로지·백업·랜섬웨어·복사기 임대·전산관리 Q&A.",
};

export default function QnaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qna.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <PageHeader
        badge="Q&A"
        title="궁금한 것부터 해결하세요"
        description="NAS·백업·복사기 임대·전산관리 — 19년간 고객에게 실제로 받은 질문에 그대로 답합니다."
      />
      {qnaCats.map((c) => (
        <section key={c.id} className="py-8 lg:py-10 bg-[var(--bg)]">
          <div className="max-w-3xl mx-auto px-4 lg:px-6">
            <h2 className="text-lg lg:text-xl font-extrabold text-[var(--ink)] mb-4">
              {c.icon} {c.label}
            </h2>
            <div className="space-y-2.5">
              {qnaByCat(c.id).map((f) => (
                <Link
                  key={f.slug}
                  href={`/qna/${f.slug}`}
                  className="block bg-[var(--panel)] border border-[var(--line)] rounded-2xl px-5 py-4 hover:border-hb-blue transition"
                >
                  <div className="font-bold text-[var(--ink)]">{f.q}</div>
                  <p className="mt-1.5 text-sm text-[var(--mute)] leading-relaxed line-clamp-2">{f.a}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
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
