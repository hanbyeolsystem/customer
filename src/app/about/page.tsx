import type { Metadata } from "next";
import Link from "next/link";
import { HeroBackground } from "@/components/sections/HeroBackground";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Icon, type IconName } from "@/components/Icon";
import { site } from "@/data/site";
import { coreServices } from "@/data/services";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, webPageLd } from "@/lib/schema";
import { AnswerBlock } from "@/components/AnswerBlock";

export const metadata: Metadata = {
  title: "회사 소개 - 대구 달서구 전산 관리 업체",
  description:
    "한별시스템은 2008년 대구 성서공단에서 출발해 19년째 대구·경북 기업의 전산을 맡아 온 IT 업체입니다. 대구광역시 달서구 문화회관11안길 소재, 관리 고객사 200곳, Synology NAS 공식 대리점.",
  alternates: { canonical: "/about/" },
};

const values: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "server",
    title: "시놀로지 공식 대리점",
    desc: "정품 판매, 설치, 분기 점검, 고장 수리까지 한 회사가 합니다. NAS 100건 넘게 놓았습니다.",
  },
  {
    icon: "clipboard",
    title: "2008년부터 19년",
    desc: "대구·경북 200곳의 컴퓨터·복사기·NAS를 봐 왔습니다. 처음 겪는 고장이 거의 없습니다.",
  },
  {
    icon: "wrench",
    title: "대구·경북 당일 방문",
    desc: "전화를 받으면 원격으로 먼저 봅니다. 원격으로 안 되면 그날 갑니다. 전국은 1영업일.",
  },
  {
    icon: "settings",
    title: "전화는 한 곳",
    desc: "컴퓨터·복합기·NAS·인터넷 중 어디가 문제인지 몰라도 됩니다. 053-588-7119 한 곳에서 가립니다.",
  },
];

// 공식 파트너 - 사장님 확정 목록(2026-09-08). 임의 추가 금지
const partners: { name: string; role: string }[] = [
  { name: "브라더코리아", role: "서비스센터 · 공식대리점" },
  { name: "교세라", role: "서비스센터 · 공식대리점" },
  { name: "시놀로지 NAS", role: "공식대리점" },
  { name: "고덱스", role: "라벨프린터" },
  { name: "벤트사이", role: "핸드프린터" },
  { name: "웰리스", role: "제균기" },
  { name: "빔프로젝터", role: "판매 · 임대" },
];

// 회사 연혁 (최신순). highlight = 강조 마일스톤
// 시대(era)별 연혁 - 성장 스텝 차트 + 표 로 시각화
type Milestone = { date: string; text: string; highlight?: boolean; badge?: string };
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
    range: "2008 - 2011",
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
    range: "2012 - 2016",
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
    range: "2017 - 2023",
    headline: "우수 대리점 입상이 이어진 시기",
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
    range: "2024 - 2026",
    headline: "NAS·데이터 관리로 영역을 넓힌 시기",
    bar: 100,
    highlight: true,
    items: [
      { date: "2026.03", text: "Synology(시놀로지) NAS 공식 대리점 체결", highlight: true },
      {
        date: "2026.08",
        text: "자체 개발 기술 특허 출원 - 거래처 단위 설치 프로필을 이용한 네트워크 프린터 자동 설치 방법 및 시스템 (제10-2026-0162666호)",
        highlight: true,
        badge: "특허 출원중",
      },
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "회사 소개", path: "/about/" }])} />
      <JsonLd data={webPageLd({ path: "/about/", name: String(metadata.title), description: metadata.description ?? undefined })} />
      {/* 히어로: 홍보영상 배경 + 스크림 위 텍스트.
          높이는 콘텐츠(패딩)로 고정하고 영상은 absolute 라서 로드 전후 레이아웃이 튀지 않는다(CLS 0).
          모바일(<768px)과 prefers-reduced-motion 사용자는 영상을 아예 받지 않고 포스터만 본다. */}
      <section className="relative overflow-hidden bg-hb-primary text-white border-b border-white/10">
        <div className="absolute inset-0">
          <HeroBackground
            posterSrc="/video/company-bg-poster.webp"
            videoSrc="/video/company-bg.mp4"
            posterAlt="한별시스템 사무실과 현장 작업 모습"
            minWidth={768}
          />
          {/* 가독성 스크림: 영상이 밝은 장면으로 바뀌어도 흰 글씨가 읽히도록 2겹 */}
          <div className="absolute inset-0 bg-hb-primary/72" />
          <div className="absolute inset-0 bg-gradient-to-r from-hb-primary via-hb-primary/70 to-hb-primary/45" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-hb-primary to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-16 lg:py-28">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white mb-4 transition"
          >
            ← 메인으로
          </Link>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
            {site.name} 소개
          </h1>
          <div className="mt-2.5 font-mono text-[11px] font-semibold text-hb-blue-light/85 tracking-[.2em]">
            ABOUT US
          </div>
          <p className="text-base lg:text-lg text-white/85 mt-4 max-w-3xl leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
            {site.tagline}
          </p>
        </div>
      </section>

      {/* 1. 개요 + 통계 */}
      <section className="py-14 lg:py-20 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="hb-rise">
              <div className="eyebrow mb-4">WHO WE ARE</div>
              <h2 className="text-2xl lg:text-3xl font-black text-[var(--ink)] leading-tight mb-5">
                회사 자료와 사무기기를
                <br />
                <span className="text-hb-blue">한 회사</span>가 봅니다
              </h2>
              <div className="space-y-4 text-[var(--mute)] leading-relaxed text-[15px]">
                <p>
                  한별시스템은 2008년 대구 성서공단에서 컴퓨터 대리점으로 시작했습니다. 지금은 대구·경북 200곳의
                  NAS, 백업, 복사기, 전산을 맡고 있습니다. 19년째입니다.
                </p>
                <p>
                  장비를 팔고 끝내지 않습니다. 고장 나면 당일 가고, 분기마다 점검하고, 토너가 떨어지기 전에 갖다
                  놓습니다. 한 번 맡긴 회사가 계속 맡깁니다.
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
            <h2 className="text-2xl lg:text-3xl font-black text-[var(--ink)]">한별이 일하는 방식</h2>
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
                &ldquo;고장 나면 <span className="text-hb-azure">그날</span> 갑니다. 19년째 그렇게 했습니다.&rdquo;
              </h2>
              <div className="space-y-4 text-white/80 leading-relaxed text-[15px] lg:text-base max-w-3xl">
                <p>
                  안녕하세요, 한별시스템 대표 <strong className="text-white">{site.address.ceo}</strong>입니다.
                </p>
                <p>
                  저희는 장비를 파는 회사가 아니라 고장 났을 때 오는 회사입니다. 2008년 컴퓨터 대리점으로 시작해
                  복사기, NAS, 사내 AI까지 왔지만 하는 일은 같습니다. 고객 회사의 일이 멈추지 않게 하는 것.
                </p>
                <p>
                  브라더·교세라 서비스센터이고 시놀로지 공식 대리점입니다. 부품이 빨리 옵니다. 그래서 대구·경북은
                  당일에 고칩니다. 앞으로도 그렇게 하겠습니다.
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

      {/* 4.5 회사 연혁 - 성장 그래프 + 시대별 표 */}
      <section className="py-14 lg:py-20 bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-10 lg:mb-12">
            <div className="eyebrow mb-3">HISTORY</div>
            <h2 className="text-2xl lg:text-3xl font-black text-[var(--ink)] mb-2">한별이 걸어온 길</h2>
            <p className="text-sm text-[var(--mute)]">
              2008년 컴퓨터 대리점에서 출발 - 2026년 Synology NAS 공식 대리점까지
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
                      <span aria-hidden className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-hb-azure" />
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
                              {m.badge ?? "공식 대리점"}
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
          <p className="text-sm text-[var(--mute)] leading-relaxed mt-5">
            전화·이메일·영업시간과 오시는 길은{" "}
            <Link href="/contact" className="font-bold text-hb-blue hover:underline">
              연락처·찾아오시는 길
            </Link>
            에서 확인하실 수 있습니다.
          </p>
        </div>
      </section>

      {/* 6. 공식 파트너 */}
      <section className="pb-14 lg:pb-20 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-8">
            <div className="eyebrow mb-3">PARTNERS</div>
            <h2 className="text-2xl lg:text-3xl font-black text-[var(--ink)] mb-2">공식 파트너</h2>
            <p className="text-sm text-[var(--mute)]">한별은 다음 브랜드의 서비스센터·공식대리점·공식 취급점입니다.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {partners.map((p) => (
              <div
                key={p.name}
                className="aspect-[3/2] bg-[var(--panel)] border border-[var(--line)] rounded-xl flex flex-col items-center justify-center text-center px-2 leading-tight hover:border-hb-blue/40 transition"
              >
                <div className="text-[14px] font-extrabold text-[var(--ink)]">{p.name}</div>
                <div className="text-[11px] text-[var(--mute)] mt-1">{p.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
      <AnswerBlock
        question="한별시스템은 어떤 회사인가요?"
        answer="2008년 대구 성서공단에서 컴퓨터 대리점으로 시작해 19년째 대구·경북 기업의 전산을 맡고 있는 기업 데이터 관리 회사입니다. 시놀로지 NAS 구축 100건 이상, 복사기·복합기 설치 300대 이상, 관리 고객사 200곳 이상이며 2026년 3월 시놀로지 공식 대리점 계약을 체결했습니다. 컴퓨터, 복합기, NAS, 사무실 네트워크를 한 회사가 관리해 장애가 났을 때 고객이 원인을 구분할 필요가 없고, 자사 NAS에서 로컬 LLM을 직접 운영하며 사내 AI 도입을 상담합니다. 대구광역시 달서구 문화회관11안길 22-7 1층, 대표 김상환, 사업자등록번호 514-22-73057, 대표번호 053-588-7119."
        facts={[{ label: "창업", value: "2008년" }, { label: "관리 고객사", value: "200곳 이상" }, { label: "NAS 구축", value: "100건 이상" }, { label: "복사기 설치", value: "300대 이상" }]}
      />
    </>
  );
}
