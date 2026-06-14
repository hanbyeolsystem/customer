import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";

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
            <ul className="space-y-2 mb-7">
              {[
                "Synology 공식 대리점 정품 + A/S 보장",
                "초기 구축부터 운영 유지관리까지 한 회사에서",
                "랜섬웨어·디스크 장애 실전 복구 경험",
                "현장 점검 + 원격 모니터링 병행",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-[var(--ink)]/85">
                  <span className="text-hb-blue font-bold mt-0.5">✓</span>{t}
                </li>
              ))}
            </ul>

            {/* 시놀로지 공식 파트너 배지 */}
            <div className="inline-flex items-center gap-3 bg-white dark:bg-white/95 border border-[var(--line)] rounded-2xl px-5 py-3 mb-7 shadow-sm">
              <Image
                src="/brand/synology-partner.png"
                alt="Synology 시놀로지 공식파트너"
                width={180}
                height={72}
                className="h-12 w-auto object-contain"
              />
            </div>

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
              src="https://images.unsplash.com/photo-1601132359864-c974e79890ac?w=1200&q=70&auto=format"
              alt="기업 NAS 환경"
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
    </>
  );
}
