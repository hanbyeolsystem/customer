// GEO: 즉답형 FAQ 섹션 — 화면 렌더 + FAQPage JSON-LD 스키마를 함께 출력
// AI 검색엔진(챗GPT·퍼플렉시티 등)이 Q&A를 그대로 인용할 수 있는 구조.

type Faq = { q: string; a: string };

export function FaqSection({ title = "자주 묻는 질문", items }: { title?: string; items: Faq[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <section className="py-12 lg:py-16 bg-[var(--bg)]">
      <div className="max-w-3xl mx-auto px-4 lg:px-6">
        <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-6">{title}</h2>
        <div className="space-y-3">
          {items.map((f) => (
            <details
              key={f.q}
              className="group bg-[var(--panel)] border border-[var(--line)] rounded-2xl px-5 py-4"
            >
              <summary className="cursor-pointer list-none flex items-start justify-between gap-3 font-bold text-[var(--ink)]">
                <span>{f.q}</span>
                <span className="text-hb-blue mt-0.5 transition-transform group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 text-sm text-[var(--mute)] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
