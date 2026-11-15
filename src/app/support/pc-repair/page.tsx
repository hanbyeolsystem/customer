import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { AnswerBlock } from "@/components/AnswerBlock";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { caseBySlug } from "@/data/cases";
import { naverPostByNo } from "@/data/naver-posts";
import { rentalPrice } from "@/data/rental-prices";
import { site } from "@/data/site";
import { breadcrumbLd, daeguGyeongbukServed, serviceId, serviceLd, webPageLd } from "@/lib/schema";

// 대구 컴퓨터 수리(2026-11-15 신설). 챗GPT·제미나이·구글 AI 모드에 "대구 달서구 컴퓨터 수리 업체"를 90번 물었을 때
// 세 곳 모두 한 번도 한별시스템을 꼽지 않았다(전용 페이지가 없었음).
// 사실 출처: 처리 방식·출장비 = qna pc-as·/support/ FAQ, 증상 = qna pc-*, 사례 = 블로그 222205471118 외. 수리 단가는 근거가 없어 쓰지 않는다.
const PATH = "/support/pc-repair/";
const SET = rentalPrice("데스크탑 + 모니터 세트");
const CASES = ["daegu-office-allinone", "daegu-lan-wiring"];
const POSTS = ["222205471118", "224467762190"];

export const metadata: Metadata = {
  title: "대구 컴퓨터 수리 - 달서구·성서공단 사무실 출장 수리",
  description: `달서구·성서공단 사무실 컴퓨터 출장 수리, 부팅 불량·느려짐·블루스크린. 대구·경북 당일 가능하고 관리 거래처는 출장비가 없습니다.`,
  alternates: { canonical: PATH },
};

// 증상별로 전화 전에 확인할 것. 문구는 같은 주제 Q&A 답과 어긋나지 않게 유지한다.
const symptoms = [
  {
    title: "전원을 눌러도 켜지지 않아요",
    body: "전원 케이블과 멀티탭, 모니터 케이블부터 보세요. 본체는 켜졌는데 화면만 안 나오는 경우가 꽤 많습니다. 1분 뒤 다시 켜도 그대로면 전원부나 메인보드, 하드 문제예요. 여러 번 껐다 켜지 말고 전화 주세요.",
    slug: "pc-no-boot",
  },
  {
    title: "어느 날부터 많이 느려졌어요",
    body: "시작 프로그램이 쌓였거나 하드가 낡았거나 악성코드에 걸린 경우가 흔합니다. 절반 이상은 새로 사지 않고 잡혀요. 하드를 SSD로 바꾸고 메모리를 늘리면 부팅이 몇 분에서 수십 초로 줄어듭니다.",
    slug: "pc-slow",
  },
  {
    title: "블루스크린이 자꾸 떠요",
    body: "메모리·하드·전원 같은 부품이나 드라이버 충돌이 대부분입니다. 한 번은 넘어가도 됩니다. 같은 오류코드가 반복되면 부품이 고장 나기 전 신호예요. 화면을 휴대폰으로 찍어 두시면 진단이 빨라집니다.",
    slug: "pc-bluescreen",
  },
  {
    title: "딸깍, 긁는 소리가 나요",
    body: "하드디스크가 고장 나기 전에 나는 소리입니다. 지금 바로 중요한 파일부터 다른 곳에 복사해 두세요. '웅' 하는 팬 소리는 먼지 문제라 청소로 해결됩니다.",
    slug: "pc-noise",
  },
  {
    title: "파일 이름이 바뀌고 열리지 않아요",
    body: "랜섬웨어(파일을 잠그고 돈을 요구하는 악성코드)일 가능성이 큽니다. 랜선부터 뽑아 다른 PC와 공유 폴더로 번지지 않게 막으세요. 안내문에 적힌 연락처로 연락하지 마시고 저희에게 먼저 전화 주세요.",
    slug: "pc-virus",
  },
];

const faq = [
  {
    q: "출장비는 얼마인가요?",
    a: `유지관리 계약이나 렌탈로 저희가 관리하는 거래처는 출장비가 없습니다. 그 밖의 경우는 증상과 필요한 부품을 듣고 수리비와 함께 먼저 알려 드려요. 원격으로 끝나는 증상이면 출장 자체가 필요 없습니다.`,
  },
  {
    q: "당일에 와 주시나요?",
    a: `대구 전역과 경북은 당일 출장이 가능합니다. 달서구와 성서공단은 사무실과 가까워 가장 빨리 움직여요. 그날 일정에 따라 시간이 달라지니 ${site.phone.main}(${site.phone.hours})로 먼저 확인해 주세요.`,
  },
  {
    q: "수리는 며칠 걸리나요?",
    a: "부품 교체나 프로그램 문제처럼 간단한 수리는 현장에서 그날 끝내는 것이 원칙입니다. 본체를 가져와야 하는 고장은 부품이 들어오는 데 따라 며칠 걸립니다.",
  },
  {
    q: "하드가 망가지면 자료도 살려 주시나요?",
    a: "하드에서 이상한 소리가 나면 전원을 끄고 연락 주세요. 아직 읽히는 하드는 새 SSD로 그대로 옮길 수 있습니다. 하드가 물리적으로 망가져 전문 장비가 필요한 복구는 저희가 직접 하지 않고 데이터 복구 업체를 연결해 드립니다.",
  },
  {
    q: "프린터나 인터넷이 같이 문제여도 되나요?",
    a: `됩니다. 컴퓨터, 복합기, NAS, 사무실 인터넷을 한 회사가 봅니다. 어디가 고장인지 몰라도 ${site.phone.main} 한 번호로 연락 주시면 원격으로 먼저 가려 드려요.`,
  },
  {
    q: "고장이 너무 잦은데 방법이 있을까요?",
    a: `오래된 PC가 계속 말썽이면 고치는 돈보다 바꾸는 돈이 싸질 때가 옵니다. 사무용 컴퓨터 렌탈은 데스크탑과 모니터 세트가 ${SET.price}(VAT 별도)이고 고장 수리가 들어 있어요. 여러 대를 관리할 사람이 없다면 월 유지관리 계약도 있습니다.`,
  },
];

const service = serviceLd({
  id: serviceId(PATH),
  url: `${site.url}${PATH}`,
  name: "컴퓨터 출장 수리",
  serviceType: "사무실 컴퓨터 출장 수리",
  description: `대구 달서구·성서공단 사무실 컴퓨터 출장 수리. 부팅 불량, 속도 저하, 블루스크린, 하드 교체와 SSD 이전, 랜섬웨어 초기 대응. 원격 진단 후 대구·경북 당일 출장 가능, 유지관리·렌탈 거래처 출장비 없음. ${site.phone.main}.`,
  areaServed: daeguGyeongbukServed,
});

export default function PcRepairPage() {
  const cases = CASES.map(caseBySlug).filter((c): c is NonNullable<typeof c> => !!c);
  const posts = POSTS.map(naverPostByNo).filter((p): p is NonNullable<typeof p> => !!p);
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "고객지원", path: "/support/" }, { name: "컴퓨터 수리", path: PATH }])} />
      <JsonLd data={service} />
      <JsonLd data={webPageLd({ path: PATH, name: String(metadata.title), description: metadata.description ?? undefined, mainEntityId: serviceId(PATH) })} />
      <PageHeader
        badge="컴퓨터 수리 · 달서구·성서공단 출장"
        title="사무실 컴퓨터가 멈췄을 때"
        description="부팅 불량, 느려짐, 블루스크린. 원격으로 먼저 보고, 안 되면 대구·경북은 당일 갑니다."
        back="/support"
        backLabel="고객지원"
      />

      <AnswerBlock
        question="대구 달서구·성서공단에서 사무실 컴퓨터가 고장 나면 어디에 맡기나요?"
        answer={`한별시스템(${site.phone.main})에 전화 주시면 됩니다. 2008년 성서공단에서 컴퓨터 대리점으로 시작했고, 지금은 달서구 문화회관11안길에 있어요. 원격으로 되는 증상은 방문 없이 그 자리에서 처리합니다. 안 되면 출장을 가고, 대구 전역과 경북은 당일 출장이 가능합니다. 부품 교체나 프로그램 문제는 현장에서 그날 끝내는 것이 원칙이에요. 유지관리나 렌탈로 관리 중인 거래처는 출장비가 없고, 그 밖의 수리비는 증상을 듣고 먼저 알려 드립니다.`}
        facts={[
          { label: "전화", value: site.phone.main },
          { label: "출장", value: "대구·경북 당일 가능" },
          { label: "간단한 수리", value: "현장 당일 처리" },
          { label: "관리 거래처", value: "출장비 없음" },
          { label: "시작", value: "2008년 성서공단" },
        ]}
      />

      <section className="py-10 lg:py-14 bg-[var(--panel)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-2">전화 주시기 전에 확인할 것</h2>
          <p className="text-[15px] text-[var(--mute)] leading-relaxed mb-6">증상을 정확히 알려 주시면 원격으로 끝날지, 가서 봐야 할지 바로 갈립니다.</p>
          <div className="space-y-3">
            {symptoms.map((s) => (
              <div key={s.slug} className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl p-5">
                <h3 className="font-extrabold text-[var(--ink)] mb-2">{s.title}</h3>
                <p className="text-[15px] text-[var(--ink)]/85 leading-relaxed">{s.body}</p>
                <Link href={`/qna/${s.slug}`} className="inline-block mt-2 text-[13px] font-bold text-hb-blue hover:underline">
                  자세한 답 보기
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-4">고칠까, 바꿀까</h2>
          <p className="hb-p">
            느려진 PC를 보고 새로 사야 하나 묻는 분이 많습니다. 실제로는 절반 이상이 부품 몇 개로 돌아와요. 하드를 SSD로 바꾸는 게 가장 효과가 큽니다.
          </p>
          <p className="hb-p">
            거래처에서 오래된 산업용 장비 PC를 가져온 적이 있습니다. 하드 문제로 블루스크린이 뜨는데, 그 안의 장비 프로그램이 날아가면 안 되는 상황이었어요. 기존 하드를 통째로 SSD에 옮기고 256MB짜리 메모리 두 개 옆에 1GB를 더 꽂았습니다. 윈도우와 프로그램은 그대로 살렸고요.
          </p>
          <p className="text-[15px] text-[var(--ink)]/85 leading-relaxed">
            반대로 부품이 전부 낡았으면 수리를 권하지 않습니다. 고치는 값과 바꾸는 값을 같이 말씀드리고 고르시게 해요. 바꾸기로 하면{" "}
            <Link href="/rental/pc" className="font-bold text-hb-blue hover:underline">사무용 컴퓨터 렌탈({SET.price})</Link>
            도 함께 비교해 드립니다.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[var(--ink)] mb-5">현장 기록</h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            {cases.map((c) => (
              <Link key={c.slug} href={`/cases/${c.slug}`} className="block bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-4 hover:border-hb-blue transition">
                <div className="text-[11px] font-extrabold text-hb-blue tracking-[.14em] mb-1">구축 사례 · {c.region} · {c.date}</div>
                <div className="font-bold text-[var(--ink)] leading-snug">{c.title}</div>
                <div className="text-[13px] text-[var(--mute)] mt-1 leading-relaxed">{c.summary}</div>
              </Link>
            ))}
          </div>
          <ul className="space-y-2">
            {posts.map((p) => (
              <li key={p.logNo}>
                <Link href={`/blog/${p.logNo}`} className="flex items-start gap-2 text-[15px] text-[var(--ink)] hover:text-hb-blue">
                  <span className="text-hb-blue font-black">›</span>
                  <span><span className="text-[var(--mute)] text-[13px] mr-2">{p.date}</span>{p.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FaqSection title="컴퓨터 수리, 자주 묻는 질문" items={faq} />

      <section className="py-10 lg:py-14">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <div className="rounded-2xl bg-hb-primary text-white p-6 lg:p-8">
            <div className="text-[11px] font-extrabold tracking-[.18em] text-white/70 mb-2">컴퓨터 수리 문의</div>
            <div className="text-2xl lg:text-3xl font-black mb-2">
              <a href={site.phone.mainHref} className="hover:underline">{site.phone.main}</a>
            </div>
            <p className="text-white/85 text-[15px] leading-relaxed mb-4">
              {site.phone.hours}. 증상과 사무실 위치를 말씀해 주세요. 원격으로 먼저 보려면 아래 원격지원 프로그램을 받아 두시면 됩니다.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/support/remote" className="inline-block px-4 py-2 rounded-full bg-white text-hb-primary text-sm font-extrabold hover:bg-hb-blue-soft transition">원격지원 받기</Link>
              <Link href="/support/as" className="inline-block px-4 py-2 rounded-full border border-white/40 text-white text-sm font-bold hover:bg-white/10 transition">A/S 접수</Link>
            </div>
          </div>
          <p className="text-[13px] text-[var(--mute)] mt-4">
            프린터·복합기 고장은 <Link href="/support/printer-repair" className="text-hb-blue hover:underline">프린터 수리</Link>, NAS 고장은 <Link href="/nas/repair" className="text-hb-blue hover:underline">NAS 수리</Link>에 따로 정리했습니다.
          </p>
        </div>
      </section>
    </>
  );
}
