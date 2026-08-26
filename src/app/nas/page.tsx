import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { FaqSection } from "@/components/FaqSection";
import { AnswerBlock } from "@/components/AnswerBlock";
import { JsonLd } from "@/components/JsonLd";
import { monthlyOffer, serviceId, serviceLd } from "@/lib/schema";
import { site } from "@/data/site";
import { nasModels, won } from "@/data/synology";

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
  title: "대구 NAS 구축 - 기업용 나스·데이터 백업",
  description: "대구 나스(NAS) 구축 전문. 시놀로지 공식 대리점으로 기업용 NAS 50건 이상 구축. RAID 설계·3-2-1 백업·랜섬웨어 대응·VPN 원격접속까지. 대구·경북 당일 방문, 무료 견적.",
  alternates: { canonical: "/nas/" },
};

const offerings = [
  { icon: "🗄", title: "NAS 구축",        body: "용량 산정·모델 선정·초기 설정·운영자 인계까지 한 번에." },
  { icon: "💾", title: "데이터 백업",     body: "스케줄·증분·이중 백업·세대 관리·검증까지 자동화." },
  { icon: "🧩", title: "RAID 설계",       body: "1/5/6/10 - 가용성과 비용의 최적 조합 컨설팅." },
  { icon: "🔒", title: "VPN 구축",        body: "외부에서 안전한 사내망 접속. 모바일·재택근무 대응." },
  { icon: "🏠", title: "원격근무 환경",   body: "Drive·Office·Chat·Mail - Synology 협업 스택 셋업." },
  { icon: "☁",  title: "클라우드 연동",  body: "Hyper Backup으로 외부 클라우드 이중백업." },
  { icon: "🛡", title: "랜섬웨어 대응",   body: "스냅샷·WORM·격리 백업. 1시간 내 복구 시나리오." },
  { icon: "🔧", title: "유지관리",        body: "분기 점검·DSM 패치·디스크 SMART 모니터링." },
];

// 서비스 엔티티. @id 가 layout.tsx serviceCatalog 의 id 와 같아야 한 엔티티로 합쳐진다.
const serviceJsonLd = serviceLd({
  id: serviceId("/nas/"),
  url: `${site.url}/nas/`,
  name: "기업용 NAS 구축·데이터 백업",
  serviceType: "NAS 구축 및 데이터 백업 구축",
  description:
    "시놀로지 NAS 설치, RAID 설계, 3-2-1 백업 구성, 랜섬웨어 대응, VPN 원격접속, DSM 보안 설정과 분기 점검까지. 대구·경북 50개사 이상 구축. 임대는 월 100,000원부터(VAT 별도), 구매는 장비와 출장 설치·설정교육까지 1,713,000원부터(VAT 별도).",
  offers: [
    monthlyOffer("시놀로지 NAS 임대(기본 36개월)", 100000, "장비·설치·백업 관리·장애 출장·하드디스크 교체 포함"),
  ],
});

export default function NasPage() {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <PageHeader
        badge="NAS SOLUTION · SYNOLOGY 공식 대리점"
        title="데이터가 멈추면 업무도 멈춥니다"
        description="기업 데이터 보호를 위한 통합 NAS 솔루션. 구축부터 운영까지 한별이 끝까지 책임집니다."
      />
      <AnswerBlock
        question="대구에서 회사 NAS(나스)를 구축하려면 어디에 맡겨야 하나요?"
        answer="한별시스템은 대구광역시 달서구에 있는 시놀로지(Synology) 공식 대리점으로, 기업용 NAS를 50건 이상 구축했습니다. 하드웨어 납품에 그치지 않고 RAID 설계, 3-2-1 백업 구성, 랜섬웨어 대비 스냅샷, VPN 원격접속 설정, 직원 사용 교육까지 현장에서 진행합니다. 대구·경북은 당일 방문해 현장을 직접 보고 무료로 견적을 냅니다."
        facts={[
          { label: "구축 실적", value: "50건 이상" },
          { label: "자격", value: "시놀로지 공식 대리점" },
          { label: "방문 견적", value: "무료" },
          { label: "문의", value: "053-588-7119" },
        ]}
      />

      {/* Hero 비주얼 */}
      <section className="relative bg-[var(--panel)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 lg:py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl lg:text-4xl font-extrabold text-[var(--ink)] tracking-tight leading-tight mb-4">
              왜 한별의 <span className="text-hb-blue">Synology NAS</span> 인가
            </h2>
            <p className="text-[var(--mute)] leading-relaxed mb-5">
              단순 저장소가 아닙니다. 백업·보안·협업·재해복구까지 한 박스로 - 그리고 한별 엔지니어가 평생 옆에 있습니다.
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

            <p className="text-sm text-[var(--mute)] leading-relaxed mb-5">
              구매가 부담되면 임대로도 시작하실 수 있습니다. 월 10만원(VAT 별도)부터, 기본 36개월 계약이고
              장비와 설치, 백업 관리, 장애 출장, 하드디스크 교체까지 월 정액에 들어갑니다.{" "}
              <Link href="/nas/price" className="font-bold text-hb-blue hover:underline">
                구축 비용과 임대료 보기
              </Link>
            </p>

            <p className="text-sm text-[var(--mute)] leading-relaxed mb-5">
              이미 쓰고 계신 NAS가 고장 났다면{" "}
              <Link href="/nas/repair" className="font-bold text-hb-blue hover:underline">
                NAS 수리·점검 안내
              </Link>
              를 먼저 확인해 주세요. 만지기 전에 하지 말아야 할 것부터 정리해 두었습니다.
            </p>

            <p className="text-sm text-[var(--mute)] leading-relaxed mb-5">
              사무실 랜 배선부터 손봐야 한다면{" "}
              <Link href="/network" className="font-bold text-hb-blue hover:underline">
                네트워크 공사·데이터 백업 구축 안내
              </Link>
              를 보세요. 배선 공사부터 공유 폴더와 백업 설정까지 한 회사에서 처리합니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/support/quote"
                className="inline-flex items-center justify-center gap-2 bg-hb-blue hover:bg-hb-blue-light text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg shadow-hb-blue/30 transition"
              >
                NAS 도입 상담 →
              </Link>
              <Link
                href="/nas/price"
                className="inline-flex items-center justify-center gap-2 border border-[var(--line)] text-[var(--ink)] font-bold px-6 py-3.5 rounded-xl hover:bg-[var(--bg)] transition"
              >
                구축 비용·임대료 보기
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[var(--line)] shadow-xl">
            <Image
              src="/hero/server-rack.jpg"
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
      {/* 모델별 페이지 - "DS925+ 설치" 처럼 모델명으로 찾아오는 분들을 위한 진입점 */}
      <section className="py-16 lg:py-20 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">MODELS</div>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)] mb-3">
            시놀로지 모델별 구축 비용
          </h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-7 max-w-3xl">
            모델명을 이미 정하고 오셨다면 바로 확인하세요. 모델마다 본체가, 구성별 견적, 실제 설치 사례를
            정리해 두었습니다.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nasModels.map((m) => (
              <Link
                key={m.slug}
                href={`/nas/model/${m.slug}`}
                className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-5 hover:border-hb-blue transition group"
              >
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <span className="text-lg font-extrabold text-[var(--ink)]">{m.model}</span>
                  <span className="text-[11px] font-bold text-[var(--mute)]">{m.bayLabel}</span>
                </div>
                <div className="text-sm font-extrabold text-hb-blue mb-2">
                  {m.price ? `본체 ${won(m.price)}` : "별도 견적"}
                </div>
                <p className="text-[13px] text-[var(--mute)] leading-relaxed mb-3">{m.fitFor}</p>
                <span className="inline-flex items-center gap-1 text-[12px] font-bold text-hb-blue group-hover:gap-2 transition-all">
                  구성별 견적 보기 →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqSection title="NAS 구축, 자주 묻는 질문" items={nasFaq} />
    </>
  );
}
