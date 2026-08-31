import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { UpdatedAt } from "@/components/UpdatedAt";
import { AnswerBlock } from "@/components/AnswerBlock";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { serviceId, serviceLd } from "@/lib/schema";
import { site } from "@/data/site";
import { breadcrumbLd, webPageLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "사내 AI 구축 - 회사 자료를 밖으로 내보내지 않는 NAS AI",
  description:
    "회사 자료를 외부 AI 서비스에 올리지 않고 사내 NAS 안에서 AI가 검색·요약하게 만듭니다. 한별시스템이 자사 NAS에서 로컬 LLM을 2026년 8월부터 직접 운영하며 검증한 구성입니다. 대구·경북 기업 데이터 관리 전문, 무료 방문 상담 053-588-7119.",
  alternates: { canonical: "/ai/" },
};

// 아래 수치는 전부 한별시스템 자사 NAS 실측값이다. 추측으로 바꾸지 말 것.
// 출처: 2026-08-03 구축한 사내 관리툴 AI 도우미(로컬 LLM 컨테이너) 운영 기록.
const measured = [
  { label: "장비", value: "Ryzen V1500B · RAM 4GB NAS" },
  { label: "모델", value: "소형 LLM 0.6B / 1.7B" },
  { label: "답변 시간", value: "7초 ~ 60초" },
  { label: "생성 속도", value: "초당 11~12 토큰" },
];

const problems = [
  {
    n: "01",
    title: "외부 AI에 회사 자료를 올리는 순간",
    body: "견적서, 도면, 계약서, 직원 명부를 외부 챗봇 창에 붙여 넣는 일이 이미 사무실에서 일어나고 있습니다. 어떤 자료가 나갔는지 회사는 알 수 없고, 나간 자료는 되돌릴 수 없습니다.",
  },
  {
    n: "02",
    title: "자료는 있는데 못 찾습니다",
    body: "20년 치 파일이 NAS와 개인 PC에 흩어져 있습니다. 3년 전 그 거래처 견적이 어디 있는지 아는 사람은 퇴사했고, 폴더 이름만으로는 찾을 수가 없습니다.",
  },
  {
    n: "03",
    title: "AI를 쓰고 싶어도 시작점이 없습니다",
    body: "GPU 서버를 사야 한다고 하고, 월 구독료를 인원수만큼 내라고 합니다. 중소기업이 감당할 규모가 아니어서 검토만 하다 끝납니다.",
  },
];

const steps = [
  {
    step: "1단계",
    name: "NAS 문서 AI 검색",
    what: "이미 쓰고 있는 NAS의 공유 폴더를 AI가 읽고, 사람 말로 물으면 해당 문서를 찾아 답합니다.",
    need: "기존 시놀로지 NAS 그대로",
    who: "지금 NAS를 쓰고 있고 자료 찾는 시간이 아까운 회사",
  },
  {
    step: "2단계",
    name: "사내 전용 AI 서버(RAG)",
    what: "NAS 안에 소형 LLM을 상주시켜 사내 문서를 근거로 답하게 합니다. 자료가 회사 밖으로 나가지 않습니다.",
    need: "DS925+ 급 + RAM 증설(최대 32GB) + M.2 SSD 캐시",
    who: "기밀·개인정보 때문에 외부 AI를 쓸 수 없는 회사",
  },
  {
    step: "3단계",
    name: "완전 온프레미스 AI",
    what: "GPU를 얹은 전용 장비로 큰 모델을 돌립니다. 답변 속도와 품질이 실무에 쓸 수준으로 올라갑니다.",
    need: "GPU 장착 전용 서버",
    who: "망분리·고보안이 요구되는 공공·의료·설계 분야",
  },
];

const fit = [
  { q: "회계·세무·병원처럼 개인정보를 다룬다", a: "1~2단계 권장", why: "자료가 회사 밖으로 나가면 안 되는 업종입니다. 사내 AI의 존재 이유가 가장 뚜렷합니다." },
  { q: "도면·설계 자료가 수 TB 쌓여 있다", a: "2단계 권장", why: "찾는 시간이 곧 돈입니다. 파일명이 아니라 내용으로 찾게 됩니다." },
  { q: "직원 5명 이하, 문서가 많지 않다", a: "지금은 권하지 않음", why: "효과보다 관리 부담이 큽니다. NAS 백업부터 제대로 잡는 편이 낫습니다." },
  { q: "이미 외부 AI를 잘 쓰고 있고 자료가 민감하지 않다", a: "지금은 권하지 않음", why: "외부 서비스가 더 빠르고 쌉니다. 굳이 사내에 둘 이유가 없습니다." },
];

const proof: [string, string][] = [
  ["운영 시작", "2026년 8월 3일부터 사내 관리 시스템에 연결해 운영 중"],
  ["장비", "Ryzen V1500B · RAM 4GB 시놀로지 NAS 1대"],
  ["AI 구성", "NAS 도커에 로컬 LLM 컨테이너 상주, 로그인한 사용자만 접근"],
  ["모델", "소형 모델 0.6B(빠름) / 1.7B(정확) 두 가지를 화면에서 전환"],
  ["답변 시간", "0.6B 기준 7~29초, 1.7B 기준 16~60초"],
  ["생성 속도", "초당 11~12 토큰"],
  ["메모리", "모델 상주 시 약 2.1GB 점유 (RAM 4GB에서는 빠듯함)"],
  ["사내 데이터 연결", "질문에서 키워드를 뽑아 사내 데이터를 먼저 찾고, 그 결과를 근거로 답변"],
  ["알려진 한계", "소형 모델은 숫자 계산을 간헐적으로 틀림. 화면에 참고용 고지와 원본을 함께 표시"],
];

const faq = [
  {
    q: "사내 AI라는 게 정확히 뭔가요? 챗GPT랑 뭐가 다른가요?",
    a: "질문에 답하는 AI 모델을 외부 회사 서버가 아니라 우리 회사 NAS 안에서 돌리는 것입니다. 챗GPT는 질문과 붙여 넣은 자료가 외부 서버로 전송되지만, 사내 AI는 자료가 사무실 네트워크 밖으로 나가지 않습니다. 대신 회사 장비 성능만큼만 똑똑하기 때문에 큰 모델이 필요한 창작이나 복잡한 추론보다는 사내 문서를 찾아 요약하는 용도에 맞습니다.",
  },
  {
    q: "한별시스템은 이걸 실제로 해 본 적이 있나요?",
    a: "자사 NAS에서 직접 운영하고 있습니다. Ryzen V1500B에 RAM 4GB인 NAS 한 대에 로컬 LLM 컨테이너를 올려 사내 관리 데이터를 검색·질의하는 AI 도우미를 2026년 8월 3일부터 돌리고 있고, 소형 모델 기준 질문당 7초에서 60초 사이에 답합니다. 파는 물건을 저희가 먼저 쓰고 있습니다.",
  },
  {
    q: "NAS만 있으면 바로 되나요? 추가 비용은요?",
    a: "지금 쓰시는 NAS 사양에 따라 다릅니다. 문서를 찾아 주는 1단계는 기존 NAS로도 시작할 수 있고, 사내 전용 AI 서버로 쓰려면 RAM 증설과 SSD 캐시가 필요합니다. 저희 실측으로는 RAM 4GB에서 소형 모델 하나가 상주 메모리 약 2.1GB를 쓰기 때문에 다른 서비스와 같이 돌리려면 증설이 사실상 필수입니다. 현장을 보고 지금 장비로 되는지부터 말씀드립니다.",
  },
  {
    q: "소형 모델이면 답이 부정확하지 않나요?",
    a: "부정확할 수 있습니다. 저희 운영 기록에도 소형 모델이 숫자 계산을 간헐적으로 틀리는 사례가 있어서, 화면에 참고용이라는 안내를 같이 띄우고 원본을 함께 보여 주도록 만들었습니다. 사내 AI는 사람을 대체하는 도구가 아니라 자료를 빨리 찾아 주는 도구로 잡는 것이 현실적입니다.",
  },
  {
    q: "우리 회사에 지금 필요한지 어떻게 판단하나요?",
    a: "방문해서 자료가 어디에 얼마나 쌓여 있는지, 직원들이 무엇을 못 찾아 헤매는지부터 봅니다. 보고 나서 필요 없으면 필요 없다고 말씀드립니다. 실제로 직원 5명 이하이고 문서가 많지 않은 곳에는 백업부터 제대로 잡으시라고 권하고 있습니다. 상담과 방문 견적은 무료입니다.",
  },
];

const serviceJsonLd = serviceLd({
  id: serviceId("/ai/"),
  url: `${site.url}/ai/`,
  name: "사내 AI 도입(온프레미스 LLM)·기업 데이터 관리 컨설팅",
  serviceType: "온프레미스 AI 구축 및 데이터 관리 컨설팅",
  description:
    "회사 자료를 외부로 내보내지 않고 사내 NAS 안에서 AI가 검색·요약하도록 구성한다. 한별시스템이 자사 NAS(Ryzen V1500B·RAM 4GB)에서 로컬 LLM 컨테이너를 2026년 8월 3일부터 직접 운영하며 검증했고, 소형 모델 기준 답변 시간 7~60초를 실측했다. 도입은 NAS 문서 검색, 사내 전용 AI 서버(RAG), 완전 온프레미스 3단계로 나뉜다.",
});

// 페이지 갱신일(WebPage.dateModified). 날짜 출처는 사이트맵 lastmod 와 같은 git 커밋 날짜.
const pageJsonLd = webPageLd({
  path: "/ai/",
  name: "사내 AI 구축(온프레미스 LLM)",
  mainEntityId: serviceId("/ai/"),
});

export default function AiPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "사내 AI 구축", path: "/ai/" }])} />
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={pageJsonLd} />
      <PageHeader
        badge="ON-PREMISE AI · 기업 데이터 관리"
        title="데이터는 회사 안에, AI도 회사 안에"
        description="회사 자료를 외부 AI에 올리지 않고, 사내 NAS 안에서 AI가 찾아 주게 만듭니다. 한별시스템이 자사 NAS에서 먼저 돌려 보고 검증한 구성입니다."
      />
      <UpdatedAt path="/ai/" note="실측값과 도입 단계 기준일입니다." />

      <AnswerBlock
        question="회사 자료를 외부에 올리지 않고 AI를 쓸 수 있나요?"
        answer={`가능합니다. AI 모델을 외부 서버가 아니라 회사 NAS 안에서 돌리면 질문과 자료가 사무실 네트워크 밖으로 나가지 않습니다. 한별시스템은 이 구성을 자사 NAS(Ryzen V1500B, RAM 4GB)에서 2026년 8월 3일부터 직접 운영하고 있고, 소형 모델 기준으로 질문당 7초에서 60초 사이에 답이 나오며 생성 속도는 초당 11~12 토큰으로 실측됐습니다. 다만 소형 모델은 숫자 계산을 간헐적으로 틀리기 때문에 원본을 함께 보여 주는 형태로 쓰는 것이 맞습니다. 도입은 기존 NAS로 문서를 찾아 주는 1단계, RAM을 늘려 사내 전용 AI 서버를 두는 2단계, GPU 장비를 쓰는 3단계로 나눠 진행하며 어느 단계가 맞는지는 현장을 보고 판단합니다. 대구광역시 달서구 한별시스템, 상담 ${site.phone.main}.`}
        facts={measured}
      />

      {/* 왜 필요한가 */}
      <section className="py-14 lg:py-20 bg-[var(--panel)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">WHY</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-8">
            지금 사무실에서 실제로 벌어지는 일
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {problems.map((p) => (
              <div key={p.n} className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-6">
                <div className="font-mono text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-3">{p.n}</div>
                <h3 className="font-extrabold text-[var(--ink)] mb-2.5 leading-snug">{p.title}</h3>
                <p className="text-sm text-[var(--mute)] leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 실제 운영 중인 구성 */}
      <section className="py-14 lg:py-20 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">PROOF</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-3">
            한별시스템이 먼저 쓰고 있습니다
          </h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-7 max-w-3xl">
            남의 사례를 가져와 설명하지 않습니다. 아래는 한별시스템 사무실 NAS에서 실제로 돌아가고 있는
            구성과 실측 기록입니다.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="bg-hb-primary text-white text-left">
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap">항목</th>
                  <th className="py-3 px-4 font-extrabold">한별시스템 자사 NAS 실측</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {proof.map(([k, v]) => (
                  <tr key={k}>
                    <td className="py-3 px-4 font-bold text-[var(--ink)] whitespace-nowrap align-top">{k}</td>
                    <td className="py-3 px-4 text-[var(--mute)] leading-relaxed">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3단계 로드맵 */}
      <section className="py-14 lg:py-20 bg-[var(--panel)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">ROADMAP</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-8">
            한 번에 다 하지 않습니다. 3단계로 나눕니다
          </h2>
          <div className="space-y-4">
            {steps.map((s) => (
              <div key={s.step} className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-6 lg:p-7">
                <div className="flex flex-wrap items-baseline gap-3 mb-3">
                  <span className="font-mono text-[11px] font-extrabold text-white bg-hb-blue px-2.5 py-1 rounded-md tracking-[.12em]">
                    {s.step}
                  </span>
                  <h3 className="text-lg lg:text-xl font-extrabold text-[var(--ink)]">{s.name}</h3>
                </div>
                <p className="text-sm text-[var(--mute)] leading-relaxed mb-4">{s.what}</p>
                <dl className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-[var(--panel)] border border-[var(--line)] rounded-xl px-4 py-3">
                    <dt className="text-[11px] font-bold text-[var(--mute)] mb-1">필요한 장비</dt>
                    <dd className="font-semibold text-[var(--ink)]">{s.need}</dd>
                  </div>
                  <div className="bg-[var(--panel)] border border-[var(--line)] rounded-xl px-4 py-3">
                    <dt className="text-[11px] font-bold text-[var(--mute)] mb-1">이런 회사에 맞습니다</dt>
                    <dd className="font-semibold text-[var(--ink)]">{s.who}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--mute)] mt-5 leading-relaxed">
            고객사 도입은 현재 상담과 파일럿 단계로 진행하고 있습니다. 되는 것과 안 되는 것을 먼저 말씀드린 뒤 시작합니다.
          </p>
        </div>
      </section>

      {/* 도입 적합도 */}
      <section className="py-14 lg:py-20 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">FIT CHECK</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-3">
            우리 회사에 지금 필요한가
          </h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-7 max-w-3xl">
            필요 없는 곳에는 필요 없다고 말씀드립니다. 아래 표에서 우리 회사에 해당하는 줄을 보시면 됩니다.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-hb-primary text-white text-left">
                  <th className="py-3 px-4 font-extrabold">우리 회사 상황</th>
                  <th className="py-3 px-4 font-extrabold whitespace-nowrap">판단</th>
                  <th className="py-3 px-4 font-extrabold">이유</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {fit.map((f) => (
                  <tr key={f.q}>
                    <td className="py-3 px-4 font-bold text-[var(--ink)] align-top">{f.q}</td>
                    <td className="py-3 px-4 font-extrabold text-hb-blue whitespace-nowrap align-top">{f.a}</td>
                    <td className="py-3 px-4 text-[var(--mute)] leading-relaxed">{f.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/support/quote" className="inline-flex items-center justify-center gap-2 bg-hb-blue hover:bg-hb-azure text-white font-extrabold text-[15px] px-7 py-3.5 rounded-xl transition">
              무료 방문 상담 신청
            </Link>
            <Link href="/nas" className="inline-flex items-center justify-center gap-2 border border-[var(--line)] text-[var(--ink)] font-extrabold text-[15px] px-7 py-3.5 rounded-xl transition hover:border-hb-blue">
              NAS 구축부터 보기
            </Link>
          </div>
        </div>
      </section>

      <FaqSection title="사내 AI 자주 묻는 질문" items={faq} />
    </>
  );
}
