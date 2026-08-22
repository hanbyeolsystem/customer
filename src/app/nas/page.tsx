import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { FaqSection } from "@/components/FaqSection";

const nasFaq = [
  {
    q: "우리 회사에 NAS가 왜 필요한가요?",
    a: "회사 데이터가 직원 PC에 흩어져 있으면 디스크 고장·랜섬웨어·실수 삭제 한 번에 업무가 멈춥니다. NAS는 자료를 중앙에 모아 자동 백업하는 회사 전용 저장 서버로, 사고가 나도 데이터를 되살릴 수 있는 최소한의 안전장치입니다.",
  },
  {
    q: "NAS 구축 비용은 어떻게 정해지나요?",
    a: "사용 인원, 데이터 용량, 백업 범위(외장·클라우드 이중백업 여부)에 따라 기기 모델과 디스크 구성이 정해집니다. 한별시스템은 시놀로지(Synology) 공식 대리점으로 정품 공급과 A/S를 보장하며, 용량 산정과 견적은 무료입니다.",
  },
  {
    q: "랜섬웨어에 걸리면 정말 복구가 되나요?",
    a: "스냅샷과 격리 백업을 구성해 두면 감염 이전 시점으로 되돌릴 수 있습니다. 한별시스템은 랜섬웨어·디스크 장애 실전 복구 경험을 바탕으로 1시간 내 복구 시나리오를 표준으로 설계하고, 데이터 사본 3개·저장매체 2종·오프사이트 1개의 3-2-1 백업 원칙을 적용합니다.",
  },
  {
    q: "외부나 집에서도 회사 자료에 접속할 수 있나요?",
    a: "가능합니다. VPN을 구축하면 외부에서도 안전하게 사내망에 접속해 재택근무·모바일 업무를 할 수 있고, Synology Drive·Office 같은 협업 도구로 파일 공유와 문서 동시 편집도 지원합니다.",
  },
  {
    q: "구축한 뒤 관리는 누가 하나요?",
    a: "한별시스템이 분기 점검, 시스템(DSM) 보안 패치, 디스크 상태(SMART) 모니터링까지 운영을 맡습니다. 대구·경북 기업 중심으로 50건 이상의 NAS를 구축했고 19년째 기업 IT를 관리하고 있습니다.",
  },
];

export const metadata: Metadata = {
  title: "NAS 솔루션",
  description: "Synology NAS 구축 · 데이터 백업 · RAID · VPN · 원격근무 · 랜섬웨어 대응 · 유지관리. 대구·경북 기업의 데이터 인프라.",
};

const offerings = [
  { icon: "🗄", title: "NAS 구축",        body: "용량 산정·모델 선정·초기 설정·운영자 인계까지 한 번에." },
  { icon: "💾", title: "데이터 백업",     body: "스케줄·증분·이중 백업·세대 관리·검증까지 자동화." },
  { icon: "🧩", title: "RAID 설계",       body: "1/5/6/10 — 가용성과 비용의 최적 조합 컨설팅." },
  { icon: "🔒", title: "VPN 구축",        body: "외부에서 안전한 사내망 접속. 모바일·재택근무 대응." },
  { icon: "🏠", title: "원격근무 환경",   body: "Drive·Office·Chat·Mail — Synology 협업 스택 셋업." },
  { icon: "☁",  title: "클라우드 연동",  body: "Hyper Backup으로 외부 클라우드 이중백업." },
  { icon: "🛡", title: "랜섬웨어 대응",   body: "스냅샷·WORM·격리 백업. 1시간 내 복구 시나리오." },
  { icon: "🔧", title: "유지관리",        body: "분기 점검·DSM 패치·디스크 SMART 모니터링." },
];

export default function NasPage() {
  return (
    <>
      <PageHeader
        badge="NAS SOLUTION · SYNOLOGY 공식 대리점"
        title="데이터가 멈추면 업무도 멈춥니다"
        description="기업 데이터 보호를 위한 통합 NAS 솔루션. 구축부터 운영까지 한별이 끝까지 책임집니다."
      />

      {/* Hero 비주얼 */}
      <section className="relative bg-[var(--panel)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 lg:py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl lg:text-4xl font-extrabold text-[var(--ink)] tracking-tight leading-tight mb-4">
              왜 한별의 <span className="text-hb-blue">Synology NAS</span> 인가
            </h2>
            <p className="text-[var(--mute)] leading-relaxed mb-5">
              단순 저장소가 아닙니다. 백업·보안·협업·재해복구까지 한 박스로 — 그리고 한별 엔지니어가 평생 옆에 있습니다.
            </p>
            <ul className="space-y-2.5 mb-7">
              <li className="flex items-start gap-2.5 text-lg lg:text-2xl font-extrabold text-hb-primary dark:text-white leading-tight">
                <span className="text-hb-blue font-black mt-0.5 text-xl lg:text-2xl">✓</span>
                <span>
                  Synology <span className="text-hb-blue">공식 대리점 정품</span> + A/S 보장
                </span>
              </li>
              {[
                "초기 구축부터 운영 유지관리까지 한 회사에서",
                "랜섬웨어·디스크 장애 실전 복구 경험",
                "현장 점검 + 원격 모니터링 병행",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-[var(--ink)]/85">
                  <span className="text-hb-blue font-bold mt-0.5">✓</span>{t}
                </li>
              ))}
            </ul>

            <div>
              <Link
                href="/support/quote"
                className="inline-flex items-center gap-2 bg-hb-blue hover:bg-hb-blue-light text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg shadow-hb-blue/30 transition"
              >
                NAS 도입 상담 →
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[var(--line)] shadow-xl">
            <Image
              src="/hero/server-rack.png"
              alt="기업 NAS 서버실"
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 8 항목 */}
      <section id="support" className="py-16 lg:py-20 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] tracking-tight text-center mb-10">
            한별의 NAS 풀스택 서비스
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {offerings.map((o) => (
              <div key={o.title} className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-5 lg:p-6 hover:border-hb-blue transition">
                <div className="text-3xl mb-2">{o.icon}</div>
                <h3 className="font-extrabold text-[var(--ink)] mb-1.5">{o.title}</h3>
                <p className="text-[13px] text-[var(--mute)] leading-relaxed">{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 백업 강조 */}
      <section id="backup" className="py-16 lg:py-20 bg-[var(--panel)]">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">BACKUP STRATEGY</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-4">3-2-1 백업 원칙</h2>
          <p className="text-[var(--mute)] leading-relaxed mb-8">
            데이터 사본 <strong className="text-[var(--ink)]">3개</strong>,
            저장매체 <strong className="text-[var(--ink)]">2종</strong>,
            오프사이트 <strong className="text-[var(--ink)]">1개</strong>.
            한별은 NAS + 외장 + 클라우드 3중 백업을 표준으로 구축합니다.
          </p>
          <Link href="/support/quote" className="inline-flex items-center gap-2 bg-hb-primary hover:bg-hb-blue text-white font-bold px-6 py-3 rounded-xl transition">
            백업 컨설팅 받기 →
          </Link>
        </div>
      </section>
      <FaqSection title="NAS 구축, 자주 묻는 질문" items={nasFaq} />
    </>
  );
}
