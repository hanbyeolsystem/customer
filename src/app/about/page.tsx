import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Icon, type IconName } from "@/components/Icon";
import { site } from "@/data/site";
import { coreServices } from "@/data/services";

export const metadata: Metadata = { title: "회사 소개" };

const values: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "server",
    title: "Synology 공식 파트너",
    desc: "NAS·백업 전문 대리점으로서 구축 설계부터 사후관리까지 한 손에서 책임집니다.",
  },
  {
    icon: "clipboard",
    title: "19년 현장 노하우",
    desc: "대구·경북 170여 고객사와 쌓아온 운영 경험이 그대로 한별의 실력이 됩니다.",
  },
  {
    icon: "wrench",
    title: "발 빠른 현장 대응",
    desc: "문제가 생기면 미루지 않습니다. 신속한 출동과 원격지원으로 업무 공백을 최소화합니다.",
  },
  {
    icon: "settings",
    title: "통합 IT 관리",
    desc: "PC·서버·네트워크·NAS·복사기까지 — 흩어진 IT를 한 곳에서 관리합니다.",
  },
];

const partners = ["Synology", "EPSON", "FujiFilm BI", "Kyocera", "HP", "Canon"];

// 회사 연혁 (최신순). highlight = 강조 마일스톤
// 시대(era)별 연혁 — 성장 스텝 차트 + 표 로 시각화
type Milestone = { date: string; text: string; highlight?: boolean };
const eras: {
  name: string;
  range: string;
  headline: string;
  bar: number; // 성장 그래프 막대 높이(%)
  highlight?: boolean;
  items: Milestone[];
}[] = [
  {
    name: "태동기",
    range: "2008 – 2011",
    headline: "PC 유지보수로 출발, 대구 서부 기반 구축",
    bar: 40,
    items: [
      { date: "2008.09", text: "늑대와여우컴퓨터(성서공단특판점) 대리점 시작" },
      { date: "2009.09", text: "에버콜 그린센터 협력업체 선정 (PC서비스)" },
      { date: "2010.02", text: "늑대와여우(성서공단특판점) 대구서부센터 등록" },
      { date: "2011.01", text: "늑대와여우 2010년 판매 우수대리점 선정" },
      { date: "2011.01", text: "LH공사(대구경북지역본부) PC 유지보수 계약" },
      { date: "2011.01", text: "브라더코리아 서비스센터 등록" },
    ],
  },
  {
    name: "성장기",
    range: "2012 – 2016",
    headline: "복사기·토너 사업 확장, 자체 토너공장 이전",
    bar: 64,
    items: [
      { date: "2012.02", text: "브라더 2011년 하반기 판매 우수대리점 선정" },
      { date: "2012.07", text: "에버콜 PC 서비스 부문 우수센터 선정" },
      { date: "2013.07", text: "교세라도큐먼트솔루션코리아 대리점 등록" },
      { date: "2013.09", text: "토너공장 및 사무실 확장이전 (월암동 1074)" },
      { date: "2014.05", text: "브라더코리아 프리미엄 센터 선정" },
      { date: "2015.06", text: "늑대와여우 2015년 판매 우수대리점 선정" },
      { date: "2016.01", text: "위더스컴퓨터 대리점 및 대구달서센터 계약" },
      { date: "2016.04", text: "교세라도큐먼트 2015년 최우수 성장점 입상" },
    ],
  },
  {
    name: "안정기",
    range: "2017 – 2023",
    headline: "최우수 대리점 연속 입상으로 입지 확립",
    bar: 82,
    items: [
      { date: "2017.01", text: "고덱스(GoDEX) 라벨프린터 대리점 계약" },
      { date: "2017.02", text: "위더스컴퓨터 2016년 우수 대리점 입상" },
      { date: "2017.04", text: "교세라도큐먼트 2016년 최우수 성장점 입상" },
      { date: "2019.01", text: "위더스컴퓨터 2018년도 우수 대리점 입상" },
      { date: "2019.10", text: "교세라도큐먼트 서비스센터 선정" },
      { date: "2023.01", text: "위더스컴퓨터 2022년도 최우수 대리점 입상" },
    ],
  },
  {
    name: "도약기",
    range: "2024 – 2026",
    headline: "NAS·데이터 인프라 전문기업으로 도약",
    bar: 100,
    highlight: true,
    items: [{ date: "2026.03", text: "Synology(시놀로지) NAS 공식 대리점 체결", highlight: true }],
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader badge="ABOUT US" title={`${site.name} 소개`} description={site.tagline} />

      {/* 1. 개요 + 통계 */}
      <section className="py-14 lg:py-20 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="hb-rise">
              <div className="eyebrow mb-4">WHO WE ARE</div>
              <h2 className="text-2xl lg:text-3xl font-black text-[var(--ink)] leading-tight mb-5">
                기업의 데이터와 업무환경을
                <br />
                <span className="text-hb-blue">통합 관리</span>하는 IT 파트너
              </h2>
              <div className="space-y-4 text-[var(--mute)] leading-relaxed text-[15px]">
                <p>
                  한별시스템은 대구·경북 지역 기업의 IT 인프라를 19년간 함께해온 전문 기업입니다. NAS 구축과 데이터
                  백업, 복사기 임대, 그리고 상시 IT 유지관리까지 — 기업 운영에 필요한 IT를 한 손에서 책임집니다.
                </p>
                <p>
                  저희는 한 번 맺은 인연을 길게 봅니다. 장비를 파는 데서 끝나지 않고, 고객사의 업무가 멈추지 않도록
                  곁에서 관리하는 것 — 그것이 한별이 일하는 방식입니다.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {site.stats.map((s) => (
                <div
                  key={s.label}
                  className="relative overflow-hidden bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 lg:p-7"
                >
                  <div className="text-4xl lg:text-5xl font-black text-hb-blue tabular-nums leading-none">
                    {s.value}
                  </div>
                  <div className="text-sm font-bold text-[var(--mute)] mt-2.5">{s.label}</div>
                  <div className="mt-4 h-1.5 rounded-full bg-[var(--line)] overflow-hidden">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-hb-blue to-hb-azure" />
                  </div>
                  <div className="pointer-events-none absolute -right-3 -top-4 text-7xl font-black text-hb-blue/5 select-none">
                    {s.value.replace(/[^0-9]/g, "")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. 핵심 가치 */}
      <section className="py-14 lg:py-20 bg-[var(--panel)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-10 lg:mb-14">
            <div className="eyebrow mb-3">WHY HANBYEOL</div>
            <h2 className="text-2xl lg:text-3xl font-black text-[var(--ink)]">한별을 선택하는 이유</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-6 hover:border-hb-blue/40 transition"
              >
                <div className="w-12 h-12 rounded-xl bg-hb-azure-soft text-hb-blue flex items-center justify-center mb-4">
                  <Icon name={v.icon} className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-[var(--ink)] mb-2">{v.title}</h3>
                <p className="text-sm text-[var(--mute)] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 대표 인사말 (다크 콘솔) */}
      <section className="py-14 lg:py-20 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-hb-primary text-white p-8 lg:p-14 shadow-2xl">
            <div className="absolute inset-0 console-grid opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(0,144,216,0.22),transparent_55%)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2.5 font-mono text-[11px] font-semibold tracking-[.18em] text-white/65 mb-6">
                <span className="hb-blink w-2 h-2 rounded-full bg-hb-azure" />
                CEO MESSAGE
              </div>
              <h2 className="text-xl lg:text-3xl font-black tracking-tight mb-6 leading-snug">
                &ldquo;기술보다 먼저, <span className="text-hb-azure">신뢰</span>를 드립니다&rdquo;
              </h2>
              <div className="space-y-4 text-white/80 leading-relaxed text-[15px] lg:text-base max-w-3xl">
                <p>
                  안녕하세요, 한별시스템 대표 <strong className="text-white">{site.address.ceo}</strong>입니다.
                </p>
                <p>
                  저희는 단순한 장비 임대 회사가 아닙니다. 기업의 데이터와 업무환경을 통합 관리하는 IT 파트너로서,
                  한 번 인연을 맺은 고객사와는 길게 함께합니다.
                </p>
                <p>
                  Synology NAS 공식 대리점으로서의 전문성, 19년의 운영 노하우, 그리고 무엇보다 발 빠른 현장 대응 —
                  그것이 한별이 자랑하는 가치입니다. 앞으로도 고객의 업무가 멈추지 않도록, 보이지 않는 곳에서
                  든든하게 받치겠습니다.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="text-sm text-white/55">한별시스템 대표이사</div>
                <div className="text-lg font-black mt-0.5">{site.address.ceo}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 사업 영역 */}
      <section className="py-14 lg:py-20 bg-[var(--panel)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-10 lg:mb-14">
            <div className="eyebrow mb-3">WHAT WE DO</div>
            <h2 className="text-2xl lg:text-3xl font-black text-[var(--ink)]">사업 영역</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {coreServices.map((s) => (
              <div key={s.title} className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-6">
                <div className="w-11 h-11 rounded-xl bg-hb-primary text-white flex items-center justify-center mb-4">
                  <Icon name={s.icon as IconName} className="w-5 h-5" />
                </div>
                <div className="font-mono text-[10px] font-bold text-hb-blue tracking-[.15em] mb-1">{s.badge}</div>
                <h3 className="font-extrabold text-[var(--ink)] mb-1.5">{s.title}</h3>
                <p className="text-[13px] text-[var(--mute)] leading-relaxed">{s.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4.5 회사 연혁 — 성장 그래프 + 시대별 표 */}
      <section className="py-14 lg:py-20 bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-10 lg:mb-12">
            <div className="eyebrow mb-3">HISTORY</div>
            <h2 className="text-2xl lg:text-3xl font-black text-[var(--ink)] mb-2">한별이 걸어온 길</h2>
            <p className="text-sm text-[var(--mute)]">
              2008년 컴퓨터 대리점에서 출발 — 2026년 Synology NAS 공식 대리점까지
            </p>
          </div>

          {/* 성장 스텝 차트 */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-3xl p-6 lg:p-10 mb-8">
            <div className="flex items-end gap-3 sm:gap-6 h-44 lg:h-56">
              {eras.map((e) => (
                <div key={e.name} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="text-[11px] lg:text-xs font-extrabold text-[var(--mute)] mb-1.5 tabular-nums">
                    {e.items.length}건
                  </div>
                  <div
                    className={
                      "w-full rounded-t-xl relative transition-all " +
                      (e.highlight
                        ? "bg-gradient-to-t from-hb-blue to-hb-azure shadow-[0_0_22px_rgba(0,144,216,0.45)]"
                        : "bg-gradient-to-t from-hb-primary to-hb-blue")
                    }
                    style={{ height: `${e.bar}%` }}
                  >
                    {e.highlight && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-hb-azure text-base">★</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 sm:gap-6 mt-3 border-t border-[var(--line)] pt-3">
              {eras.map((e) => (
                <div key={e.name} className="flex-1 text-center">
                  <div className={"font-extrabold text-[13px] lg:text-sm " + (e.highlight ? "text-hb-azure" : "text-[var(--ink)]")}>
                    {e.name}
                  </div>
                  <div className="font-mono text-[10px] lg:text-[11px] text-[var(--mute)] mt-0.5">{e.range}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 시대별 이정표 표 */}
          <div className="space-y-4 lg:space-y-5">
            {eras.map((e) => (
              <div key={e.name} className="rounded-2xl border border-[var(--line)] overflow-hidden">
                <div
                  className={
                    "flex flex-wrap items-center gap-x-2.5 gap-y-0.5 px-5 py-3.5 " +
                    (e.highlight ? "bg-hb-primary" : "bg-[var(--panel)]")
                  }
                >
                  <span className={"font-black " + (e.highlight ? "text-white" : "text-[var(--ink)]")}>{e.name}</span>
                  <span className={"font-mono text-xs " + (e.highlight ? "text-hb-azure" : "text-hb-blue")}>{e.range}</span>
                  <span className={"text-[12px] " + (e.highlight ? "text-white/70" : "text-[var(--mute)]")}>
                    · {e.headline}
                  </span>
                </div>
                <table className="w-full text-sm bg-[var(--bg)]">
                  <tbody>
                    {e.items.map((m, i) => (
                      <tr key={`${m.date}-${i}`} className="border-t border-[var(--line)] first:border-t-0">
                        <td className="py-2.5 pl-5 pr-3 align-top w-[70px] font-mono text-[12px] font-bold text-hb-blue tabular-nums whitespace-nowrap">
                          {m.date}
                        </td>
                        <td className={"py-2.5 pr-5 leading-snug " + (m.highlight ? "font-extrabold text-[var(--ink)]" : "text-[var(--ink)]/90")}>
                          {m.text}
                          {m.highlight && (
                            <span className="ml-2 inline-block text-[10px] font-bold text-white bg-hb-azure rounded-full px-2 py-0.5 align-middle">
                              공식 대리점
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 회사 정보 */}
      <section className="py-14 lg:py-20 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <div className="eyebrow mb-3">COMPANY INFO</div>
          <h2 className="text-2xl lg:text-3xl font-black text-[var(--ink)] mb-8">회사 정보</h2>
          <dl className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl overflow-hidden">
            {[
              ["상호", site.name],
              ["대표이사", site.address.ceo],
              ["주소", site.address.street],
              ["사업자등록번호", site.address.bizNo],
              ["통신판매업신고", site.address.mailOrder],
              ["대표전화", site.phone.main],
              ["이메일", site.email],
            ].map(([k, v]) => (
              <div
                key={k}
                className="grid grid-cols-3 gap-3 px-5 lg:px-7 py-4 border-b border-[var(--line)] last:border-0"
              >
                <dt className="font-bold text-[var(--mute)] text-sm">{k}</dt>
                <dd className="col-span-2 text-[var(--ink)] text-sm font-medium break-keep">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 6. 공식 파트너 */}
      <section className="pb-14 lg:pb-20 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-8">
            <div className="eyebrow mb-3">PARTNERS</div>
            <h2 className="text-2xl lg:text-3xl font-black text-[var(--ink)] mb-2">공식 파트너</h2>
            <p className="text-sm text-[var(--mute)]">한별은 다음 글로벌 브랜드의 공식 파트너입니다.</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {partners.map((p) => (
              <div
                key={p}
                className="aspect-[3/2] bg-[var(--panel)] border border-[var(--line)] rounded-xl flex items-center justify-center text-[12px] font-extrabold text-[var(--ink)] text-center px-2 leading-tight hover:border-hb-blue/40 transition"
              >
                {p}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[var(--mute)] text-center mt-4">※ 공식 로고는 추후 교체 예정입니다.</p>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
