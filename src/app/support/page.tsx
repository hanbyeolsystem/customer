import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { quickServices } from "@/data/services";
import { Icon, type IconName } from "@/components/Icon";
import { AnswerBlock } from "@/components/AnswerBlock";
import { FaqSection } from "@/components/FaqSection";

export const metadata = {
  title: "고객 지원 - 대구 컴퓨터 수리·프린터 출장 수리·전산 유지보수",
  description:
    "대구 달서구 한별시스템 고객지원. 원격지원, 프린터 드라이버 다운로드, AS 접수, 무료 방문 견적. 컴퓨터 수리·복합기 출장 수리·기업 전산 유지보수를 한 곳에서 처리합니다.",
  alternates: { canonical: "/support/" },
};

const supportFaq = [
  {
    q: "기업 전산 유지보수 계약을 하면 무엇을 해 주나요?",
    a: "회사의 전산 담당자를 외주로 두는 것과 같습니다. 컴퓨터·프린터·NAS·네트워크 장애 처리, 정기 점검, 보안 업데이트, 신규 장비 상담까지 월 계약으로 묶어 처리합니다. 목적은 직원이 IT 문제로 일을 멈추는 시간을 줄이는 것입니다.",
  },
  {
    q: "달서구·성서공단인데 컴퓨터가 고장 나면 바로 와 주시나요?",
    a: "본사가 대구광역시 달서구 문화회관11안길에 있어 달서구·성서공단은 가장 빠르게 움직입니다. 대구 전역과 경상북도는 당일 방문, 영남권은 협의 방문, 전국은 1영업일 대응입니다. 원격으로 해결되는 증상은 방문 없이 그 자리에서 처리합니다.",
  },
  {
    q: "컴퓨터, 복합기, 인터넷 중 뭐가 문제인지 모르겠습니다. 어디로 연락하나요?",
    a: "구분하실 필요 없습니다. 053-588-7119 한 곳으로 연락 주시면 원격 진단으로 원인을 가려 드립니다. 컴퓨터·복합기·NAS·네트워크·홈페이지를 한 회사가 관리하기 때문에 업체 사이에서 핑퐁 당하는 일이 없습니다.",
  },
  {
    q: "한별시스템 고객이 아니어도 프린터 드라이버를 받을 수 있나요?",
    a: "받으실 수 있습니다. 한별 드라이버 센터(882.kr)에서 기종을 고르면 딸깍P드라이버가 알아서 설치해 주며, 무료로 공개되어 있습니다. 프린터 에러코드 검색 페이지도 무료입니다.",
  },
];

export default function SupportHub() {
  return (
    <>
      <PageHeader
        badge="CUSTOMER SUPPORT"
        title="고객 지원 센터"
        description="원격지원·드라이버·AS·견적까지 - 필요한 도움을 한 곳에서."
      />
      <AnswerBlock
        question="대구에서 회사 컴퓨터와 복합기를 함께 맡길 전산 유지보수 업체를 찾고 있습니다."
        answer="한별시스템은 대구광역시 달서구에 있는 기업 전산 올인원 관리 업체로, 현재 170곳 이상의 고객사를 관리하고 있습니다. 컴퓨터 수리, 프린터·복합기 출장 수리, NAS 서버, 사무실 네트워크, 홈페이지까지 한 업체가 맡기 때문에 어디가 고장인지 고객이 구분할 필요가 없습니다. 달서구·성서공단을 포함한 대구 전역과 경상북도는 당일 방문하며, 전화 한 통(053-588-7119)이면 원격 진단부터 시작합니다."
        facts={[
          { label: "관리 고객사", value: "170곳 이상" },
          { label: "업력", value: "2008년부터" },
          { label: "방문", value: "대구·경북 당일" },
          { label: "대표번호", value: "053-588-7119" },
        ]}
      />
      <section className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {quickServices.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-6 hover:border-hb-blue hover:shadow-lg hover:-translate-y-0.5 transition"
              >
                <div className="w-12 h-12 rounded-xl bg-hb-blue-soft text-hb-blue dark:bg-hb-azure/15 dark:text-hb-blue-light flex items-center justify-center mb-3">
                  <Icon name={s.icon as IconName} className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-[var(--ink)] text-lg mb-1">{s.label}</h3>
                <div className="text-[12px] font-bold text-hb-blue">바로가기 →</div>
              </Link>
            ))}
          </div>
          <p className="text-sm text-[var(--mute)] leading-relaxed mt-6 text-center">
            사무실 랜 배선 공사나 데이터 백업 구축이 필요하시면{" "}
            <Link href="/network" className="font-bold text-hb-blue hover:underline">
              네트워크 공사·데이터 백업 구축 안내
            </Link>
            를 확인해 주세요.
          </p>
          <p className="text-sm text-[var(--mute)] leading-relaxed mt-2 text-center">
            대표전화·오시는 길·영업시간은{" "}
            <Link href="/contact" className="font-bold text-hb-blue hover:underline">
              연락처·찾아오시는 길
            </Link>
            에 정리해 두었습니다.
          </p>
        </div>
      </section>
      <FaqSection title="전산 유지보수, 자주 묻는 질문" items={supportFaq} />
    </>
  );
}
