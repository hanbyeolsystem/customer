// 카드 폭은 max-w-5xl, 왼쪽 굵은 선 없음(2026-09-08 사장님 "카드가 작다, 앞 라인은 투명으로").
// GEO/AEO: AI 검색(챗GPT·퍼플렉시티·제미나이·구글 AI 개요)이 그대로 인용할 수 있는 즉답 블록.
//
// 형식 규칙 (인용률을 좌우하므로 지킬 것):
//   - 소제목은 사람이 실제로 검색창에 치는 "질문형" 한 문장
//   - 답변은 결론부터 2~3문장. 첫 문장 안에 결론이 끝나야 한다
//   - 구체 수치·지역명을 반드시 포함하고, 확인되지 않은 수치는 쓰지 않는다
//   - 마크업상 h2 + 바로 이어지는 p 라서 패시지 단위로 잘라 가기 쉽다
//     → 2026-09-12 에 붙인 사진은 p 뒤(오른쪽 칸)에 두어 h2·p 붙어 있는 구조를 깨지 않는다
//
// 사진은 질문·답변 글에서 분류를 자동으로 골라 붙고(photos.ts topicPhoto), 스크롤로 들어오면 나타난다.

import { topicPhoto } from "@/lib/photos";

export function AnswerBlock({
  question,
  answer,
  facts,
}: {
  question: string;
  answer: string;
  facts?: { label: string; value: string }[];
}) {
  const photo = topicPhoto(`${question} ${answer}`, `answer:${question}`);

  return (
    <section className="py-10 lg:py-14 bg-[var(--bg)]">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 lg:p-10">
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-9 items-start">
            <div className="lg:col-span-3">
              <div className="text-[11px] font-extrabold text-hb-blue tracking-[.18em] mb-3">
                한 문단 요약
              </div>
              <h2 className="text-lg lg:text-2xl font-extrabold text-[var(--ink)] leading-snug mb-3">
                {question}
              </h2>
              <p className="text-[15px] lg:text-base text-[var(--ink)]/90 leading-relaxed font-medium">
                {answer}
              </p>
            </div>
            {photo && (
              <figure data-reveal className="lg:col-span-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-[16/10] object-cover rounded-xl border border-[var(--line)] bg-[var(--bg)]"
                />
                <figcaption className="mt-2 text-[13px] text-[var(--mute)] leading-snug">
                  {photo.caption}
                </figcaption>
              </figure>
            )}
          </div>
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
