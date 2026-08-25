import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { AnswerBlock } from "@/components/AnswerBlock";
import { FaqSection } from "@/components/FaqSection";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "대구 사무실 네트워크 공사·데이터 백업 구축",
  description:
    "대구 사무실 랜 배선 공사부터 서버·NAS 설치, 공유 폴더 설정, 데이터 백업 구축까지 한별시스템이 한 회사에서 처리합니다. 50개사 이상 시공, 대구·경북 당일 출장, 053-588-7119.",
  alternates: { canonical: "/network/" },
};

// 확정된 사실만 기재. 확인되지 않은 수치·자격은 넣지 말 것.
// "50개사 이상"은 NAS 구축 실적과 같은 현장이므로 다른 숫자와 합산해 표기하지 않는다.
const steps = [
  {
    no: "01",
    title: "랜 배선 공사",
    body: "사무실 구조와 자리 배치를 보고 랜선 경로를 잡아 시공합니다. 책상 아래에 뭉쳐 있던 선을 정리하고 포트마다 어느 자리로 가는지 표시해 둡니다.",
  },
  {
    no: "02",
    title: "공유기·스위치 구성",
    body: "인터넷 회선을 받아 공유기와 스위치를 구성하고, 유선 자리와 와이파이 신호가 사무실 전체에 닿는지 현장에서 확인합니다.",
  },
  {
    no: "03",
    title: "서버·NAS 설치",
    body: "자료를 모아 둘 서버나 NAS를 설치합니다. 사용 인원과 자료 용량에 맞춰 기기와 디스크 구성을 정하고, 초기 설정까지 끝낸 상태로 넘겨 드립니다.",
  },
  {
    no: "04",
    title: "공유 폴더와 권한 설정",
    body: "부서별, 업무별로 공유 폴더를 나누고 직원마다 볼 수 있는 폴더를 지정합니다. USB로 파일을 주고받던 방식을 없애는 단계입니다.",
  },
  {
    no: "05",
    title: "백업 스케줄 구성",
    body: "자료가 자동으로 백업되도록 일정을 잡습니다. 데이터 사본 3개, 저장매체 2종, 외부 보관 1개의 3-2-1 원칙에 맞춰 구성합니다.",
  },
  {
    no: "06",
    title: "외부 원격접속(VPN)",
    body: "필요하면 VPN을 구성해 출장이나 재택 중에도 사무실 자료에 접근할 수 있게 합니다. 아무나 접속하지 못하도록 계정과 권한을 함께 정리합니다.",
  },
  {
    no: "07",
    title: "이후 유지관리",
    body: "구축이 끝이 아닙니다. 인터넷 장애, 공유 폴더 오류, 디스크 상태 점검까지 전화 한 통으로 이어서 봐 드립니다.",
  },
];

const needs = [
  "자료가 직원 PC마다 흩어져 있어 담당자가 자리를 비우면 파일을 못 찾는 회사",
  "공유 폴더가 없어 USB나 메신저로 파일을 주고받는 회사",
  "백업을 한 번도 해 본 적이 없거나, 하고 있는지 아무도 모르는 회사",
  "랜선이 정리되지 않아 어느 선이 어디로 가는지 알 수 없는 사무실",
  "사무실을 새로 얻거나 이전해서 인터넷과 자리 배선을 처음부터 잡아야 하는 회사",
];

const networkFaq = [
  {
    q: "네트워크 공사만 따로 맡길 수 있나요?",
    a: "가능합니다. 랜 배선 공사만, 또는 공유기·스위치 구성만 따로 맡기셔도 됩니다. 백업이나 서버 구축은 나중에 필요해질 때 이어서 진행하시면 되고, 처음부터 전부 함께 맡기셔도 됩니다.",
  },
  {
    q: "데이터 백업 구축도 하나요?",
    a: "합니다. 한별시스템은 랜 배선 공사만 하는 곳이 아니라 서버·NAS 설치, 공유 폴더와 권한 설정, 백업 스케줄 구성까지 직접 시공합니다. 데이터 사본 3개, 저장매체 2종, 외부 보관 1개의 3-2-1 원칙을 기준으로 구성하며, 지금까지 50개사 이상 현장에서 이 작업을 해 왔습니다.",
  },
  {
    q: "이미 쓰고 있는 기존 사무실도 가능한가요?",
    a: "가능합니다. 새 사무실보다 오히려 기존 사무실 작업이 더 많습니다. 이미 깔려 있는 선과 장비를 그대로 살릴 수 있는지 현장에서 먼저 보고, 바꿔야 할 부분만 골라 시공합니다.",
  },
  {
    q: "대구 외 지역도 가나요?",
    a: "대구·경북은 당일 출장을 원칙으로 하고, 그 밖의 지역은 일정을 협의해 방문합니다. 창원 사무실 시공 사례도 있습니다.",
  },
  {
    q: "공사 후 관리도 해 주나요?",
    a: "네. 구축한 뒤에도 인터넷 장애, 공유 폴더 오류, 백업 상태 점검을 이어서 맡습니다. 컴퓨터·복합기·NAS·네트워크를 한 회사가 함께 보기 때문에 어느 쪽이 문제인지 고객이 구분하실 필요가 없습니다.",
  },
  {
    q: "견적은 어떻게 받나요?",
    a: "053-588-7119로 전화 주시면 사무실 규모와 인원을 여쭙고 방문 일정을 잡습니다. 전화로 대충 부르지 않고 현장을 직접 본 뒤 견적을 내며, 방문 견적은 무료입니다.",
  },
];

export default function NetworkPage() {
  return (
    <>
      <PageHeader
        badge="NETWORK · BACKUP"
        title="랜 공사부터 데이터 백업까지, 한 회사에서"
        description="사무실 배선 시공, 서버·NAS 설치, 공유 폴더 설정, 백업 구축을 나눠 맡길 필요가 없습니다."
      />

      <AnswerBlock
        question="대구에서 사무실 네트워크 공사와 데이터 백업 구축을 한 곳에 맡길 수 있나요?"
        answer="한별시스템은 대구광역시 달서구에 있는 IT 인프라 업체로, 사무실 랜 배선 공사부터 서버·NAS 설치, 공유 폴더와 권한 설정, 데이터 백업 구축까지 한 회사에서 직접 진행하며 대구·경북을 중심으로 50개사 이상 현장에서 이 작업을 해 왔습니다. 배선 업체와 백업 업체를 따로 부를 필요가 없어 공사 뒤 문제가 생겨도 책임이 갈리지 않습니다. 대구·경북은 당일 출장을 원칙으로 하며, 053-588-7119로 전화 주시면 현장을 보고 무료로 견적을 냅니다."
        facts={[
          { label: "시공 실적", value: "50개사 이상" },
          { label: "지역", value: "대구·경북 당일" },
          { label: "자격", value: "시놀로지 공식 대리점" },
          { label: "문의", value: "053-588-7119" },
        ]}
      />

      {/* 작업 범위 단계 */}
      <section className="py-14 lg:py-20 bg-[var(--panel)]">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">
            WORK SCOPE
          </div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] tracking-tight mb-3">
            현장에서 실제로 하는 일
          </h2>
          <p className="text-[var(--mute)] leading-relaxed mb-9">
            선을 까는 것으로 끝나지 않습니다. 자료가 한곳에 모이고 자동으로 백업되는 상태까지
            만들어 놓고 나옵니다.
          </p>

          <ol className="space-y-3">
            {steps.map((s) => (
              <li
                key={s.no}
                className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-5 lg:p-6 flex gap-4 hover:border-hb-blue transition"
              >
                <span className="font-mono text-sm font-black text-hb-blue shrink-0 mt-0.5">
                  {s.no}
                </span>
                <div>
                  <h3 className="font-extrabold text-[var(--ink)] mb-1.5">{s.title}</h3>
                  <p className="text-[13px] lg:text-sm text-[var(--mute)] leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 이런 회사에 필요합니다 */}
      <section className="py-14 lg:py-20 bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] tracking-tight mb-8">
            이런 회사에 필요합니다
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {needs.map((n) => (
              <li
                key={n}
                className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl px-5 py-4 text-sm text-[var(--ink)]/85 leading-relaxed flex items-start gap-2.5"
              >
                <span className="text-hb-blue font-black mt-0.5">✓</span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-[var(--mute)] leading-relaxed mt-6">
            자료를 모아 둘 서버와 백업 장비를 어떻게 고를지 궁금하시면{" "}
            <Link href="/nas" className="font-bold text-hb-blue hover:underline">
              NAS 솔루션 안내
            </Link>
            를 함께 보세요.
          </p>
        </div>
      </section>

      {/* 실적 */}
      <section className="py-14 lg:py-20 bg-hb-primary text-white">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center">
          <div className="text-[11px] font-extrabold text-hb-blue-light tracking-[.2em] mb-3">
            TRACK RECORD
          </div>
          <p className="text-4xl lg:text-6xl font-black tracking-tight mb-3">50개사 이상</p>
          <p className="text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto">
            대구·경북을 중심으로 사무실 네트워크 공사와 데이터 백업 구축을 진행한 현장 수입니다.
            건축사무소 DS1825+ 서버, 대학교·기업 랙마운트 RS2421+, 사무실 DS925+, 창원 사무실
            시공까지 실제 후기를 공개하고 있습니다.
          </p>
          <Link
            href="/cases"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-xl transition"
          >
            구축사례 보기 →
          </Link>
        </div>
      </section>

      <FaqSection title="네트워크 공사·백업 구축, 자주 묻는 질문" items={networkFaq} />

      {/* CTA */}
      <section className="py-14 lg:py-20 bg-[var(--panel)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] tracking-tight mb-3">
            현장을 보고 견적을 냅니다
          </h2>
          <p className="text-[var(--mute)] leading-relaxed mb-8">
            사무실 규모와 인원만 알려 주시면 방문 일정을 잡아 드립니다. 방문 견적은 무료입니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={site.phone.mainHref}
              className="inline-flex items-center justify-center gap-2 bg-hb-blue hover:bg-hb-blue-light text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg shadow-hb-blue/30 transition"
            >
              전화 상담 {site.phone.main}
            </a>
            <Link
              href="/support/quote"
              className="inline-flex items-center justify-center gap-2 border border-[var(--line)] text-[var(--ink)] font-bold px-6 py-3.5 rounded-xl hover:bg-[var(--bg)] transition"
            >
              무료 방문 견적 요청 →
            </Link>
          </div>
          <p className="text-[13px] text-[var(--mute)] mt-4">{site.phone.hours}</p>
        </div>
      </section>
    </>
  );
}
