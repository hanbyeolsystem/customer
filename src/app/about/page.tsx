import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "회사 소개" };

const partners = ["Synology", "EPSON", "FujiFilm BI", "Kyocera", "HP", "Canon"];

export default function AboutPage() {
  return (
    <>
      <PageHeader badge="ABOUT US" title={`${site.name} 소개`} description="대구·경북 기업의 IT 인프라를 15년 이상 함께해온 한별시스템." />
      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          {/* 대표 인사말 */}
          <article className="bg-[var(--panel)] border border-[var(--line)] rounded-3xl p-8 lg:p-12 mb-8">
            <div className="text-[11px] font-extrabold text-hb-blue tracking-[.2em] mb-2">CEO MESSAGE</div>
            <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-5">기업의 든든한 IT 파트너</h2>
            <div className="space-y-4 text-[var(--mute)] leading-relaxed text-[15px]">
              <p>안녕하세요, 한별시스템 대표 <strong className="text-[var(--ink)]">{site.address.ceo}</strong> 입니다.</p>
              <p>저희는 단순한 장비 임대 회사가 아닙니다. 기업의 데이터와 업무환경을 통합 관리하는 IT 파트너로서, 한 번 인연을 맺은 고객사와는 길게 함께합니다.</p>
              <p>Synology NAS 공식 대리점으로서의 전문성, 15년 운영 노하우, 그리고 무엇보다 발 빠른 현장 대응 — 그것이 한별이 자랑하는 가치입니다.</p>
            </div>
          </article>

          {/* 회사 정보 */}
          <article className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-6 lg:p-8 mb-8">
            <h3 className="font-extrabold text-[var(--ink)] mb-4 text-lg">회사 정보</h3>
            <dl className="space-y-3 text-sm">
              {[
                ["상호", site.name],
                ["대표", site.address.ceo],
                ["주소", site.address.street],
                ["사업자등록번호", site.address.bizNo],
                ["통신판매업신고", site.address.mailOrder],
                ["대표전화", site.phone.main],
                ["이메일", site.email],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 gap-3 py-2 border-b border-[var(--line)] last:border-0">
                  <dt className="font-bold text-[var(--mute)]">{k}</dt>
                  <dd className="col-span-2 text-[var(--ink)]">{v}</dd>
                </div>
              ))}
            </dl>
          </article>

          {/* 파트너 */}
          <article className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 lg:p-8">
            <h3 className="font-extrabold text-[var(--ink)] mb-1 text-lg">공식 파트너</h3>
            <p className="text-sm text-[var(--mute)] mb-5">한별은 다음 글로벌 브랜드의 공식 파트너입니다.</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {partners.map((p) => (
                <div key={p} className="aspect-square bg-[var(--bg)] border border-[var(--line)] rounded-xl flex items-center justify-center text-[12px] font-extrabold text-[var(--ink)] text-center px-2 leading-tight">
                  {p}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[var(--mute)] text-center mt-4">※ 공식 로고는 추후 교체 예정입니다.</p>
          </article>
        </div>
      </section>
    </>
  );
}
