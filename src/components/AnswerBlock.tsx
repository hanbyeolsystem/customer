// GEO/AEO: AI 검색(챗GPT·퍼플렉시티·제미나이·구글 AI 개요)이 그대로 인용할 수 있는 즉답 블록.
//
// 형식 규칙 (인용률을 좌우하므로 지킬 것):
//   - 소제목은 사람이 실제로 검색창에 치는 "질문형" 한 문장
//   - 답변은 결론부터 2~3문장. 첫 문장 안에 결론이 끝나야 한다
//   - 구체 수치·지역명을 반드시 포함하고, 확인되지 않은 수치는 쓰지 않는다
//   - 마크업상 h2 + 바로 이어지는 p 라서 패시지 단위로 잘라 가기 쉽다

export function AnswerBlock({
  question,
  answer,
  facts,
}: {
  question: string;
  answer: string;
  facts?: { label: string; value: string }[];
}) {
  return (
    <section className="py-10 lg:py-14 bg-[var(--bg)]">
      <div className="max-w-3xl mx-auto px-4 lg:px-6">
        <div className="border-l-4 border-hb-blue bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 lg:p-8">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.18em] mb-3">
            한 문단 요약
          </div>
          <h2 className="text-lg lg:text-2xl font-extrabold text-[var(--ink)] leading-snug mb-3">
            {question}
          </h2>
          <p className="text-[15px] lg:text-base text-[var(--ink)]/90 leading-relaxed font-medium">
            {answer}
          </p>
          {facts && facts.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {facts.map((f) => (
                <div
                  key={f.label}
                  className="bg-[var(--bg)] border border-[var(--line)] rounded-xl px-3 py-2.5"
                >
                  <dt className="text-[11px] font-bold text-[var(--mute)] mb-0.5">{f.label}</dt>
                  <dd className="text-sm font-extrabold text-hb-blue">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
