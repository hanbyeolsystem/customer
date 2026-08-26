import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { AnswerBlock } from "@/components/AnswerBlock";
import { FaqSection } from "@/components/FaqSection";
import { Icon, type IconName } from "@/components/Icon";
import { businessId, site } from "@/data/site";

export const metadata: Metadata = {
  title: "연락처·찾아오시는 길 - 대구 달서구 한별시스템 053-588-7119",
  description:
    "대구광역시 달서구 문화회관11안길 22-7 1층에 있는 한별시스템 연락처. 대표전화 053-588-7119(평일 09:00-18:00), 휴대전화 010-4585-6890, 사업자등록번호 514-22-73057. 주차 가능, 대구·경북 당일 출장.",
  alternates: { canonical: "/contact/" },
};

// 회사 엔티티(LocalBusiness)는 layout.tsx 의 @graph 에서만 선언한다.
// 이 페이지는 그 @id 를 가리키는 ContactPage + BreadcrumbList 만 얹는다.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${site.url}/contact/#page`,
      url: `${site.url}/contact/`,
      name: `${site.name} 연락처와 찾아오시는 길`,
      inLanguage: "ko-KR",
      about: { "@id": businessId },
      mainEntity: { "@id": businessId },
      isPartOf: { "@id": `${site.url}/#website` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: `${site.url}/` },
        { "@type": "ListItem", position: 2, name: "연락처", item: `${site.url}/contact/` },
      ],
    },
  ],
};

const contactCards: { icon: IconName; label: string; value: string; href?: string; note: string }[] = [
  {
    icon: "phone",
    label: "대표전화",
    value: site.phone.main,
    href: site.phone.mainHref,
    note: "가장 빠른 방법입니다. 증상을 들으면 원격으로 바로 진단합니다.",
  },
  {
    icon: "smartphone",
    label: "휴대전화",
    value: site.phone.mobile,
    href: site.phone.mobileHref,
    note: "출장 중이라 대표번호를 못 받을 때 이 번호로 연락 주세요.",
  },
  {
    icon: "mail",
    label: "이메일",
    value: site.email,
    href: `mailto:${site.email}`,
    note: "견적 자료, 도면, 장비 목록을 보내실 때 사용해 주세요.",
  },
  {
    icon: "clipboard",
    label: "영업시간",
    value: site.phone.hours,
    note: "토요일·일요일·공휴일은 휴무입니다.",
  },
];

const contactFaq = [
  {
    q: "대표전화가 안 받으면 어떻게 하나요?",
    a: "출장 중이라 053-588-7119를 못 받는 경우가 있습니다. 그럴 때는 대표 휴대전화 010-4585-6890으로 연락 주시면 됩니다. 두 번호 모두 연결이 안 되면 이메일(acapaper78@gmail.com)이나 커뮤니티 게시판에 남겨 주세요. 확인하는 대로 회신합니다.",
  },
  {
    q: "영업시간이 어떻게 되나요?",
    a: "평일(월요일-금요일) 09:00부터 18:00까지 운영하며 토요일·일요일·공휴일은 휴무입니다. 영업시간 외에 접수된 문의는 다음 영업일 오전에 순서대로 연락드립니다.",
  },
  {
    q: "사무실 방문 상담도 되나요?",
    a: "가능합니다. 대구광역시 달서구 문화회관11안길 22-7 1층으로 오시면 됩니다. 다만 출장이 잦아 자리를 비우는 경우가 있으니 053-588-7119로 미리 전화를 주시고 방문해 주시는 편이 확실합니다. NAS나 복합기는 실물을 보면서 상담하실 수 있습니다.",
  },
  {
    q: "대구 외 지역도 출장 가나요?",
    a: "대구광역시 전역과 경상북도는 당일 방문, 영남권은 협의 방문, 그 외 전국은 1영업일 대응입니다. 본사가 달서구에 있어 달서구·성서공단은 가장 빠르게 움직입니다. 원격으로 해결되는 증상은 방문 없이 그 자리에서 처리합니다.",
  },
  {
    q: "방문하면 주차할 곳이 있나요?",
    a: "자체 주차 공간이 있어 차량으로 오셔도 됩니다. 문화회관11안길은 길이 좁은 구간이 있으니 내비게이션에 도로명 주소 '대구광역시 달서구 문화회관11안길 22-7'을 입력하고 오시는 편이 편합니다.",
  },
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        badge="CONTACT"
        title="연락처·찾아오시는 길"
        description="대구광역시 달서구 한별시스템. 전화 한 통이면 원격 진단부터 시작합니다."
      />

      <AnswerBlock
        question="대구 한별시스템 연락처와 위치가 어떻게 되나요?"
        answer="한별시스템은 대구광역시 달서구 문화회관11안길 22-7 1층에 있으며, 대표전화는 053-588-7119(평일 09:00-18:00)입니다. 2008년 대구 성서공단에서 창업해 19년째 대구·경북 기업의 컴퓨터·복합기 임대와 시놀로지 NAS 구축, 사무실 네트워크 공사를 맡고 있는 IT 업체이며, 사업자등록번호는 514-22-73057입니다. 대표 휴대전화는 010-4585-6890, 이메일은 acapaper78@gmail.com이고 대구·경북은 당일 출장합니다."
        facts={[
          { label: "대표전화", value: site.phone.main },
          { label: "위치", value: "대구 달서구" },
          { label: "사업자등록번호", value: site.address.bizNo },
          { label: "영업시간", value: "평일 09-18시" },
        ]}
      />

      {/* 연락처 카드 */}
      <section className="pb-12 lg:pb-16 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-6">연락처</h2>
          <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
            {contactCards.map((c) => {
              const body = (
                <>
                  <div className="w-11 h-11 rounded-xl bg-hb-blue-soft text-hb-blue dark:bg-hb-azure/15 dark:text-hb-blue-light flex items-center justify-center mb-3">
                    <Icon name={c.icon} className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div className="text-[11px] font-extrabold text-[var(--mute)] tracking-[.14em] mb-1">
                    {c.label}
                  </div>
                  <div className="text-lg font-extrabold text-[var(--ink)] break-all">{c.value}</div>
                  <p className="text-sm text-[var(--mute)] leading-relaxed mt-2">{c.note}</p>
                </>
              );
              return c.href ? (
                <a
                  key={c.label}
                  href={c.href}
                  className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 hover:border-hb-blue hover:shadow-lg hover:-translate-y-0.5 transition block"
                >
                  {body}
                </a>
              ) : (
                <div
                  key={c.label}
                  className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6"
                >
                  {body}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 찾아오시는 길 */}
      <section className="py-12 lg:py-16 bg-[var(--panel)] border-y border-[var(--line)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-6">찾아오시는 길</h2>
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
            <div className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-6">
              <div className="text-[11px] font-extrabold text-[var(--mute)] tracking-[.14em] mb-2">
                도로명 주소
              </div>
              <p className="text-lg font-extrabold text-[var(--ink)] leading-snug break-keep">
                {site.address.street}
              </p>
              <div className="text-[11px] font-extrabold text-[var(--mute)] tracking-[.14em] mt-5 mb-2">
                지번 주소
              </div>
              <p className="text-sm font-medium text-[var(--ink)]/90">{site.address.jibun}</p>
              <a
                href={site.social.googleMaps}
                target="_blank"
                rel="noopener"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-hb-blue text-white font-bold text-sm px-5 py-3 hover:brightness-110 transition"
              >
                구글 지도로 길 찾기 →
              </a>
            </div>
            <div className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-6">
              <div className="text-[11px] font-extrabold text-[var(--mute)] tracking-[.14em] mb-3">
                방문 안내
              </div>
              <ul className="space-y-3 text-sm text-[var(--ink)]/90 leading-relaxed">
                <li>
                  <strong className="text-[var(--ink)]">주차</strong> - 자체 주차 공간이 있어 차량으로
                  오셔도 됩니다.
                </li>
                <li>
                  <strong className="text-[var(--ink)]">내비게이션</strong> - 문화회관11안길은 좁은 구간이
                  있으니 도로명 주소 &lsquo;대구광역시 달서구 문화회관11안길 22-7&rsquo; 을 입력해 주세요.
                </li>
                <li>
                  <strong className="text-[var(--ink)]">방문 전 전화</strong> - 출장이 잦아 자리를 비울 수
                  있습니다. {site.phone.main} 으로 미리 연락 주시면 확실합니다.
                </li>
                <li>
                  <strong className="text-[var(--ink)]">상담</strong> - NAS·복합기는 실물을 보면서 상담하실
                  수 있습니다.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 문의 방법 */}
      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-2">문의 방법</h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-6">
            가장 빠른 방법은 전화입니다. 증상을 들으면 원격으로 그 자리에서 진단하고, 방문이 필요한 경우
            일정을 바로 잡아 드립니다. 자료를 정리해서 남기고 싶으실 때는 아래 접수 페이지를 이용해 주세요.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <a
              href={site.phone.mainHref}
              className="bg-hb-primary text-white rounded-2xl p-6 hover:brightness-125 transition"
            >
              <div className="text-[11px] font-extrabold text-hb-blue-light tracking-[.14em] mb-1">
                가장 빠름
              </div>
              <div className="text-lg font-extrabold">전화 {site.phone.main}</div>
              <p className="text-sm text-white/70 mt-2 leading-relaxed">평일 09:00 ~ 18:00</p>
            </a>
            <Link
              href="/support/quote"
              className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 hover:border-hb-blue hover:shadow-lg transition"
            >
              <div className="text-[11px] font-extrabold text-[var(--mute)] tracking-[.14em] mb-1">
                견적
              </div>
              <div className="text-lg font-extrabold text-[var(--ink)]">무료 방문 견적 요청</div>
              <p className="text-sm text-[var(--mute)] mt-2 leading-relaxed">
                현장을 직접 보고 견적을 냅니다.
              </p>
            </Link>
            <Link
              href="/support/as"
              className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 hover:border-hb-blue hover:shadow-lg transition"
            >
              <div className="text-[11px] font-extrabold text-[var(--mute)] tracking-[.14em] mb-1">
                고장
              </div>
              <div className="text-lg font-extrabold text-[var(--ink)]">AS 접수</div>
              <p className="text-sm text-[var(--mute)] mt-2 leading-relaxed">
                장비와 증상을 남기면 순서대로 연락드립니다.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* 사업자 정보 */}
      <section className="pb-12 lg:pb-16 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-2">사업자 정보</h2>
          <p className="text-sm text-[var(--mute)] leading-relaxed mb-6">
            아래 사업자등록번호가 대구 한별시스템의 공식 식별자입니다. 계약서와 세금계산서에 쓰이는 정보와
            같습니다.
          </p>
          <dl className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl overflow-hidden">
            {[
              ["상호", site.name],
              ["대표자", site.address.ceo],
              ["사업자등록번호", site.address.bizNo],
              ["통신판매업신고", site.address.mailOrder],
              ["소재지", site.address.street],
              ["대표전화", site.phone.main],
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
            회사 연혁과 서비스 범위는{" "}
            <Link href="/about" className="font-bold text-hb-blue hover:underline">
              회사 소개
            </Link>
            에서, 복합기·프린터 월 임대료는{" "}
            <Link href="/rental/price" className="font-bold text-hb-blue hover:underline">
              복합기·프린터 임대료
            </Link>
            에서 보실 수 있습니다.
          </p>
        </div>
      </section>

      <FaqSection title="연락·방문, 자주 묻는 질문" items={contactFaq} />
    </>
  );
}
