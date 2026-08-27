import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { AnswerBlock } from "@/components/AnswerBlock";
import { FaqSection } from "@/components/FaqSection";
import { site } from "@/data/site";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "대구 NAS 수리 - 시놀로지 점검·하드 교체 문의",
  description:
    "대구 NAS 수리·점검. 전원 불량, 접속 불가, 디스크 경고, 랜섬웨어 의심 등 증상별 대응. 유지관리·임대 고객 출장 점검 무료, 신규 고객 30만원부터(VAT 별도). 053-588-7119.",
  alternates: { canonical: "/nas/repair/" },
};

// 증상별 대응 - 실제로 현장에서 확인하는 순서대로만 적는다. 추측 진단은 넣지 말 것.
const symptoms = [
  {
    title: "전원이 아예 안 켜집니다",
    check: "콘센트와 어댑터 연결, 멀티탭 스위치, 어댑터 표시등이 들어오는지, 다른 콘센트에서도 같은지 확인해 주세요.",
    avoid: "전원 버튼을 여러 번 반복해서 누르거나 껐다 켜지 마세요. 전원부 문제라면 반복 시도가 디스크에 더 부담을 줍니다.",
  },
  {
    title: "공유 폴더에 접속이 안 됩니다",
    check: "NAS 본체 표시등이 켜져 있는지, 같은 사무실의 다른 PC에서도 안 되는지, 공유기나 스위치를 최근에 바꾸지 않았는지 확인해 주세요. 한 대만 안 되면 그 PC의 네트워크 문제일 때가 많습니다.",
    avoid: "NAS 관리자 화면에서 계정이나 공유 폴더 권한을 임의로 다시 만들지 마세요. 원인이 네트워크였을 경우 설정만 어긋납니다.",
  },
  {
    title: "하드디스크를 못 읽고 경고음이 납니다",
    check: "몇 번 베이에서 빨간 표시등이 켜졌는지, 경고음이 언제부터 났는지 메모해 주세요. 관리자 화면에 들어갈 수 있다면 저장소 상태 화면을 사진으로 남겨 주시면 판단이 빨라집니다.",
    avoid: "디스크를 뽑아 보거나 다른 베이에 바꿔 꽂지 마세요. RAID는 디스크 순서와 상태를 기억하고 있어서, 순서가 바뀌면 정상 디스크까지 인식이 틀어질 수 있습니다.",
  },
  {
    title: "파일 이름이 이상하게 바뀌고 안 열립니다 (랜섬웨어 의심)",
    check: "NAS 랜선을 뽑아 네트워크에서 먼저 분리하고, 어느 PC에서 자료를 열었을 때부터 이상했는지 확인해 주세요. 감염된 PC가 계속 연결돼 있으면 피해가 계속 번집니다.",
    avoid: "몸값 안내문에 적힌 연락처로 연락하거나, 남은 자료를 급하게 다른 곳으로 옮기지 마세요. 스냅샷이 남아 있으면 되돌릴 수 있는 상황을 스스로 덮어쓸 수 있습니다.",
  },
  {
    title: "갑자기 파일 열고 저장하는 속도가 느려졌습니다",
    check: "특정 PC만 느린지 전부 느린지, 특정 폴더만 그런지 확인해 주세요. 디스크가 하나 이상 상태 경고에 들어갔거나, 백업 작업이 업무 시간에 돌고 있는 경우가 흔합니다.",
    avoid: "속도 때문에 NAS를 강제로 껐다 켜지 마세요. 디스크 검사 중이었다면 검사가 처음부터 다시 돌아 더 느려집니다.",
  },
];

const doList = [
  "장비 점검과 원인 진단 (전원부, 네트워크, 디스크 상태)",
  "하드디스크 교체와 볼륨 복구 작업",
  "RAID 구성 상담과 재구성 방향 안내",
  "NAS 초기 설정과 재설정, 계정·공유 폴더 재구성",
  "백업 구조 재구축 (스냅샷, 외장, 클라우드 이중 백업)",
  "랜섬웨어 감염 상황 대응 상담과 확산 차단",
];

const dontList = [
  "물리적으로 손상된 디스크의 데이터 복구 (헤드 손상, 기판 손상, 침수 등)",
  "포맷·삭제된 자료의 전문 복구 작업",
];

const relatedQna = [
  { slug: "nas-hdd", label: "NAS에 아무 하드디스크나 껴도 되나요?" },
  { slug: "nas-ransomware-response", label: "랜섬웨어에 걸린 것 같은데 지금 당장 뭘 해야 하나요?" },
  { slug: "nas-ransomware", label: "랜섬웨어에 걸리면 NAS 자료도 날아가나요?" },
  { slug: "nas-file-restore", label: "직원이 실수로 파일을 지웠는데 복구할 수 있나요?" },
  { slug: "nas-backup-needed", label: "NAS만 있으면 백업은 끝난 건가요?" },
  { slug: "net-nas-notfound", label: "나스(NAS)가 갑자기 네트워크에서 안 보여요." },
];

const repairFaq = [
  {
    q: "NAS가 고장 났는데 출장 점검비가 얼마인가요?",
    a: `유지관리 계약이나 임대로 저희가 관리하고 있는 거래처는 출장 점검비를 받지 않습니다. 그 외 신규 고객은 기본 출장 점검비가 300,000원부터(VAT 별도)이고, 증상과 현장 조건, 교체 부품에 따라 최종 금액이 달라집니다. 접수하자마자 바로 출발하는 방식이 아니라, 먼저 ${site.phone.main}로 전화 주시면 증상을 들어보고 방문 일정을 안내해 드립니다. 전화 단계에서 예상 금액과 챙겨 갈 부품을 미리 맞춰 두기 때문에 헛걸음이 줄어듭니다.`,
  },
  {
    q: "데이터 복구도 해주시나요?",
    a: "본격적인 데이터 복구는 한별시스템이 직접 하지 않습니다. 하드디스크 교체, 볼륨 복구, 재설정, 장비 점검 같은 수리는 저희가 직접 하고, 디스크가 물리적으로 손상돼 전문 장비가 필요한 상황이면 데이터 복구 전문업체를 연결해 드립니다. 점검해 보면 복구까지 갈 필요 없이 해결되는 경우도 많으니 먼저 상태부터 확인하시는 편이 좋습니다.",
  },
  {
    q: "다른 곳에서 산 NAS도 봐주시나요?",
    a: "봐 드립니다. 한별시스템에서 구매하지 않은 장비도 점검합니다. 시놀로지(Synology) 제품은 공식 대리점으로 다뤄 온 경험이 있어 특히 익숙하고, NAS 구축 50건 이상과 별개로 연간 NAS 수리 20건 이상을 대구·경북 현장에서 처리하고 있습니다. 모델명과 증상을 알려 주시면 방문 전에 준비할 부품을 미리 챙겨 갑니다.",
  },
  {
    q: "대구 밖 지역도 가시나요?",
    a: "대구·경북이 주 활동 지역이지만 그 밖도 갑니다. 창원 사무실에 시놀로지 NAS를 설치하고 이후 서버 관리까지 맡은 사례가 있습니다. 지역이 멀면 방문 일정만 미리 조율합니다.",
  },
  {
    q: "당일 방문이 되나요?",
    a: `대구·경북은 당일 출장을 원칙으로 합니다. 다만 접수 시간과 그날 일정에 따라 달라질 수 있으니 ${site.phone.main}(${site.phone.hours})로 전화 주시면 가능한 시간을 바로 확인해 드립니다. 업무가 완전히 멈춘 상황이라면 먼저 말씀해 주세요.`,
  },
  {
    q: "전화하기 전에 제가 뭘 해야 하나요?",
    a: "증상이 의심되면 더 만지지 말고 전원을 끄시는 편이 안전합니다. 랜섬웨어가 의심되면 전원을 끄기 전에 랜선부터 뽑아 네트워크에서 분리해 주세요. 그리고 NAS 모델명, 몇 번 베이에 빨간 불이 들어왔는지, 언제부터 그랬는지 이 세 가지만 메모해 두시면 상담이 훨씬 빨라집니다.",
  },
];

export default function NasRepairPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "NAS 솔루션", path: "/nas/" }, { name: "NAS 수리·점검", path: "/nas/repair/" }])} />
      <PageHeader
        badge="NAS REPAIR · 대구·경북 현장 출장"
        title="NAS가 고장 났습니다"
        description="시놀로지 NAS 점검, 하드디스크 교체, 재설정. 대구·경북 현장에서 직접 처리합니다."
        back="/nas"
        backLabel="NAS 솔루션"
      />

      <AnswerBlock
        question="대구에서 NAS가 고장 났을 때 어디에 연락해야 하나요?"
        answer={`대구·경북에서 NAS가 멈췄다면 한별시스템 ${site.phone.main}로 전화 주시면 됩니다. 대구 달서구에 있는 시놀로지(Synology) 공식 대리점으로, NAS 장비 점검과 하드디스크 교체, 재설정을 현장에 나가서 직접 처리하며 연간 NAS 수리 20건 이상을 다룹니다. 접수 즉시 출발하는 방식이 아니라 전화로 증상을 먼저 듣고 방문 일정을 잡아 드리며, 대구·경북은 당일 출장을 원칙으로 합니다. 유지관리 계약이나 임대로 관리 중인 거래처는 출장 점검비를 받지 않고, 그 외 신규 고객은 기본 출장 점검비가 300,000원부터(VAT 별도)이며 증상과 현장 조건에 따라 최종 금액이 달라집니다. 다만 디스크가 물리적으로 손상돼 본격적인 데이터 복구가 필요한 상황이면 저희가 직접 복구하지 않고 전문 복구업체를 연결해 드립니다.`}
        facts={[
          { label: "전화 문의", value: site.phone.main },
          { label: "신규 점검비", value: "30만원부터(VAT 별도)" },
          { label: "관리 거래처", value: "점검 무료" },
          { label: "연간 수리", value: "20건 이상" },
          { label: "출장 지역", value: "대구·경북 당일" },
          { label: "자격", value: "시놀로지 공식 대리점" },
        ]}
      />

      {/* 이것만은 하지 마세요 */}
      <section className="py-10 lg:py-14 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <div className="border-l-4 border-red-500 bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 lg:p-8">
            <div className="text-[11px] font-extrabold text-red-500 tracking-[.18em] mb-3">
              이것만은 하지 마세요
            </div>
            <h2 className="text-lg lg:text-2xl font-extrabold text-[var(--ink)] leading-snug mb-4">
              고치려다 되살릴 수 있던 자료까지 날아갑니다
            </h2>
            <ul className="space-y-3 text-[15px] text-[var(--ink)]/90 leading-relaxed">
              {[
                ["하드디스크를 무리하게 빼지 마세요.", "고장 난 디스크를 빼는 순간 RAID가 재구성에 들어가면서 남은 정상 디스크에 큰 부담이 걸립니다. 그 과정에서 두 번째 디스크까지 나가는 경우를 현장에서 봅니다."],
                ["디스크 순서를 임의로 바꾸지 마세요.", "NAS는 어느 베이에 어떤 디스크가 있었는지를 기억합니다. 순서를 섞으면 정상 디스크까지 인식이 틀어져 원래대로 되돌리기 어려워집니다."],
                ["초기화나 포맷 버튼을 먼저 누르지 마세요.", "관리자 화면이 초기화를 권하는 것처럼 보여도, 그 시점에는 아직 자료가 남아 있는 경우가 많습니다. 한 번 누르면 되돌릴 수 없습니다."],
                ["전원을 반복해서 껐다 켜지 마세요.", "디스크가 이미 불안정한 상태라면 껐다 켤 때마다 상태가 나빠집니다. 검사 중이었다면 그 검사도 처음부터 다시 돌아갑니다."],
              ].map(([b, t]) => (
                <li key={b} className="flex items-start gap-2.5">
                  <span className="text-red-500 font-black mt-0.5">✕</span>
                  <span>
                    <strong className="text-[var(--ink)]">{b}</strong> {t}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm font-bold text-[var(--ink)] bg-[var(--bg)] border border-[var(--line)] rounded-xl px-4 py-3.5 leading-relaxed">
              증상이 의심되면 더 만지지 마시고 전원을 끈 다음{" "}
              <a href={site.phone.mainHref} className="text-hb-blue hover:underline">
                {site.phone.main}
              </a>
              로 먼저 전화 주세요. 랜섬웨어가 의심되면 전원을 끄기 전에 랜선부터 뽑아 주세요.
            </p>
          </div>
        </div>
      </section>

      {/* 증상별 대응 */}
      <section className="py-14 lg:py-20 bg-[var(--panel)]">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] tracking-tight mb-3">
            증상별로 먼저 확인할 것
          </h2>
          <p className="text-[var(--mute)] leading-relaxed mb-8">
            전화 주시기 전에 아래 항목만 확인해 주셔도 원인을 좁히는 데 큰 도움이 됩니다.
          </p>
          <div className="space-y-4">
            {symptoms.map((s) => (
              <div
                key={s.title}
                className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-5 lg:p-6"
              >
                <h3 className="font-extrabold text-[var(--ink)] text-base lg:text-lg mb-3">
                  {s.title}
                </h3>
                <dl className="space-y-2.5 text-sm leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <dt className="shrink-0 font-extrabold text-hb-blue text-[12px] mt-0.5 w-[74px]">
                      먼저 확인
                    </dt>
                    <dd className="text-[var(--ink)]/85">{s.check}</dd>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <dt className="shrink-0 font-extrabold text-red-500 text-[12px] mt-0.5 w-[74px]">
                      하지 말 것
                    </dt>
                    <dd className="text-[var(--mute)]">{s.avoid}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 점검 비용 */}
      <section className="py-14 lg:py-20 bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] tracking-tight mb-8">
            출장 점검 비용은 어떻게 되나요
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-[var(--panel)] border-2 border-hb-blue rounded-2xl p-6">
              <div className="text-[11px] font-extrabold text-hb-blue tracking-[.18em] mb-2">
                관리 거래처
              </div>
              <p className="text-xl font-black text-[var(--ink)] mb-2">출장 점검 무료</p>
              <p className="text-sm text-[var(--mute)] leading-relaxed">
                유지관리 계약이나 임대로 한별시스템이 관리하고 있는 거래처는 출장 점검비를 따로 받지
                않습니다. 부품 교체가 필요한 경우에만 별도로 안내드립니다.
              </p>
            </div>
            <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6">
              <div className="text-[11px] font-extrabold text-[var(--mute)] tracking-[.18em] mb-2">
                신규 고객
              </div>
              <p className="text-xl font-black text-[var(--ink)] mb-1">
                기본 출장 점검비 300,000원부터
              </p>
              <p className="text-[12px] font-bold text-[var(--mute)] mb-2">VAT 별도</p>
              <p className="text-sm text-[var(--mute)] leading-relaxed">
                기본 출장 점검비가 300,000원부터이고, 증상과 현장 조건, 교체 부품에 따라 최종 금액이
                달라집니다. 전화로 증상을 먼저 들어보고 예상 금액과 방문 일정을 안내드린 다음
                출발합니다.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-[var(--ink)]/85 leading-relaxed">
            먼저{" "}
            <a href={site.phone.mainHref} className="font-bold text-hb-blue hover:underline">
              {site.phone.main}
            </a>
            ({site.phone.hours})로 전화 주시면 증상을 들어보고 방문 일정을 안내해 드립니다. 바로
            출발하지 않고 전화 단계에서 챙겨 갈 부품까지 정해 두기 때문에 헛걸음이 줄어듭니다.
          </p>
        </div>
      </section>

      {/* 하는 것 / 하지 않는 것 */}
      <section className="py-14 lg:py-20 bg-[var(--panel)]">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] tracking-tight mb-3">
            저희가 하는 것과 하지 않는 것
          </h2>
          <p className="text-[var(--mute)] leading-relaxed mb-8">
            처음부터 정확히 알고 오시는 편이 서로 시간을 아낍니다.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-6">
              <h3 className="font-extrabold text-hb-blue mb-4">한별시스템이 직접 합니다</h3>
              <ul className="space-y-2.5 text-sm text-[var(--ink)]/85 leading-relaxed">
                {doList.map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="text-hb-blue font-bold mt-0.5">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-6">
              <h3 className="font-extrabold text-[var(--mute)] mb-4">직접 하지 않습니다</h3>
              <ul className="space-y-2.5 text-sm text-[var(--mute)] leading-relaxed">
                {dontList.map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="font-bold mt-0.5">✕</span>
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-4 pt-4 border-t border-[var(--line)] text-sm text-[var(--ink)]/85 leading-relaxed">
                복구가 필요한 상황이면 데이터 복구 전문업체를 연결해 드립니다. 저희가 먼저 상태를 보고
                복구까지 갈 일인지, 교체와 재구성으로 끝날 일인지 판단해 드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FaqSection title="NAS 수리 문의, 자주 묻는 질문" items={repairFaq} />

      {/* 관련 Q&A */}
      <section className="pb-14 lg:pb-20 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-lg lg:text-xl font-extrabold text-[var(--ink)] mb-4">관련 Q&amp;A</h2>
          <ul className="space-y-2">
            {relatedQna.map((q) => (
              <li key={q.slug}>
                <Link
                  href={`/qna/${q.slug}`}
                  className="block bg-[var(--panel)] border border-[var(--line)] rounded-xl px-5 py-3.5 text-sm font-semibold text-[var(--ink)] hover:border-hb-blue transition"
                >
                  {q.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 lg:py-20 bg-[var(--panel)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-3">
            지금 업무가 멈춰 있다면 전화가 가장 빠릅니다
          </h2>
          <p className="text-[var(--mute)] leading-relaxed mb-8">
            증상만 들어도 현장에 나가기 전에 챙겨 갈 부품이 정해집니다. 대구·경북은 당일 출장을
            원칙으로 합니다.
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
              점검 요청하기 →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
