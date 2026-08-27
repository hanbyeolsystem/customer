import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/schema";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "한별시스템이 상담·견적·AS 접수 과정에서 수집하는 개인정보의 항목, 이용 목적, 보유 기간, 파기 절차와 정보주체의 권리를 안내합니다.",
  alternates: { canonical: "/privacy/" },
};

// 사이트에서 실제로 개인정보를 받는 곳: /support/quote(상담·견적), /support/as(AS 접수),
// /community(닉네임), 상담 챗봇. 항목이 늘면 아래 표와 시행일을 함께 고칠 것.
const EFFECTIVE = "2026-08-27";

const collect = [
  { where: "무료 방문 견적 요청", items: "회사명, 담당자 성함, 연락처, 관심 서비스, 문의 내용", why: "견적 상담 및 방문 일정 안내" },
  { where: "AS 접수", items: "회사명, 담당자 성함, 연락처, 제품명, 증상 및 상세 내용", why: "장애 확인 및 수리 일정 안내" },
  { where: "커뮤니티 질문", items: "닉네임, 질문 내용(자유 입력)", why: "질문 게시 및 답변" },
  { where: "AI 상담 창(별이)", items: "대화 내용(자유 입력)", why: "자동 응답 제공" },
  { where: "전화·이메일 문의", items: "연락처, 문의 내용", why: "문의 응대" },
];

const sections: { h: string; p: string[] }[] = [
  {
    h: "1. 개인정보의 처리 목적",
    p: [
      "한별시스템(이하 \"회사\")은 다음 목적을 위해 개인정보를 처리합니다. 처리한 개인정보는 아래 목적 이외의 용도로는 이용하지 않으며, 이용 목적이 바뀌면 개인정보 보호법 제18조에 따라 별도 동의를 받는 등 필요한 조치를 이행합니다.",
      "- 상담·견적 문의에 대한 응대, 방문 일정 안내\n- AS 접수에 따른 장애 확인, 수리 및 출장 일정 안내\n- 커뮤니티 게시판 운영\n- 계약 체결 후 서비스 제공, 청구 및 정산",
    ],
  },
  {
    h: "2. 처리하는 개인정보의 항목",
    p: ["아래 표의 항목을 해당 화면에서 이용자가 직접 입력하는 방식으로 수집합니다. 웹사이트 이용 과정에서 접속 IP, 브라우저 정보, 방문 기록이 자동으로 생성되어 수집될 수 있습니다."],
  },
  {
    h: "3. 개인정보의 처리 및 보유 기간",
    p: [
      "회사는 수집 시 동의받은 보유 기간 또는 법령에 따른 보유 기간 안에서 개인정보를 처리·보유합니다.",
      "- 상담·견적·AS 문의: 문의 처리 완료 후 1년 (계약으로 이어진 경우 계약 종료 후 5년)\n- 커뮤니티 게시글: 게시자가 삭제를 요청하거나 게시판 운영이 종료될 때까지\n- 전자상거래 관련 기록: 계약·청약철회 기록 5년, 대금결제 기록 5년, 소비자 불만·분쟁 처리 기록 3년 (전자상거래 등에서의 소비자보호에 관한 법률)\n- 접속 기록: 3개월 (통신비밀보호법)",
    ],
  },
  {
    h: "4. 개인정보의 제3자 제공",
    p: [
      "회사는 정보주체의 개인정보를 제1조에서 명시한 범위 안에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 제3자에게 제공합니다.",
      "현재 회사는 개인정보를 제3자에게 제공하지 않습니다.",
    ],
  },
  {
    h: "5. 개인정보 처리의 위탁",
    p: [
      "원활한 서비스 제공을 위해 아래와 같이 개인정보 처리 업무를 위탁하고 있습니다. 위탁 계약 시 개인정보 보호법 제26조에 따라 위탁 업무 수행 목적 외 처리 금지, 기술적·관리적 보호조치, 재위탁 제한, 손해배상 등을 계약서에 명시하고 수탁자가 안전하게 처리하는지 감독합니다.",
      "- Supabase Inc. (문의 내용 및 커뮤니티 게시글의 저장·전달)\n- Slack Technologies (문의 접수 알림 전달)\n- Anthropic PBC (AI 상담 창의 자동 응답 생성. 대화 내용이 응답 생성 목적으로 전송되며 별도 저장하지 않음)\n- GitHub Inc. (웹사이트 호스팅)",
    ],
  },
  {
    h: "6. 정보주체의 권리·의무 및 행사 방법",
    p: [
      "정보주체는 회사에 대해 언제든지 개인정보 열람, 정정·삭제, 처리정지 요구 등의 권리를 행사할 수 있습니다. 권리 행사는 전화, 이메일 등으로 하실 수 있으며 회사는 지체 없이 조치합니다.",
      "정정·삭제 요구가 있는 경우, 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있으면 삭제를 요구할 수 없습니다. 권리 행사는 법정대리인이나 위임을 받은 자를 통해서도 할 수 있으며 이 경우 위임장을 제출해야 합니다.",
    ],
  },
  {
    h: "7. 개인정보의 파기",
    p: [
      "개인정보 보유 기간이 지나거나 처리 목적이 달성되는 등 개인정보가 불필요하게 되었을 때에는 지체 없이 파기합니다. 다른 법령에 따라 보존해야 하는 경우에는 별도의 데이터베이스로 옮기거나 보관 장소를 달리하여 보존합니다.",
      "전자적 파일 형태는 기록을 재생할 수 없는 방법으로 삭제하고, 종이 문서는 분쇄하거나 소각합니다.",
    ],
  },
  {
    h: "8. 개인정보의 안전성 확보 조치",
    p: [
      "- 관리적 조치: 내부 관리 계획 수립, 개인정보 취급 직원 최소화 및 교육\n- 기술적 조치: 개인정보 처리 시스템의 접근 권한 관리, 접근 통제, 전송 구간 암호화(HTTPS), 보안 프로그램 설치\n- 물리적 조치: 사무실 및 자료 보관 장소의 접근 통제",
    ],
  },
  {
    h: "9. 개인정보 자동 수집 장치의 설치·운영 및 거부",
    p: [
      "회사 웹사이트는 로그인 없이 이용할 수 있으며 이용자를 식별하는 쿠키를 사용하지 않습니다. 브라우저의 로컬 저장소에 다크모드 설정, AI 상담 창의 대화 기록 등 편의 정보가 이용자의 기기에만 저장될 수 있으며 이는 회사로 전송되지 않습니다. 이용자는 브라우저 설정에서 저장된 데이터를 언제든지 삭제할 수 있습니다.",
    ],
  },
  {
    h: "10. 개인정보 보호책임자",
    p: [
      `회사는 개인정보 처리에 관한 업무를 총괄하고 관련 불만 처리 및 피해 구제를 위해 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.\n- 성명: ${site.address.ceo} (대표)\n- 전화: ${site.phone.main}\n- 이메일: ${site.email}`,
      "정보주체는 개인정보 열람 청구 및 문의를 위 연락처로 하실 수 있으며, 회사는 신속하게 답변합니다.",
    ],
  },
  {
    h: "11. 권익침해 구제 방법",
    p: [
      "정보주체는 개인정보 침해에 대한 신고나 상담이 필요한 경우 아래 기관에 문의할 수 있습니다.\n- 개인정보침해신고센터: (국번 없이) 118, privacy.kisa.or.kr\n- 개인정보 분쟁조정위원회: 1833-6972, www.kopico.go.kr\n- 대검찰청 사이버수사과: (국번 없이) 1301\n- 경찰청 사이버수사국: (국번 없이) 182",
    ],
  },
  {
    h: "12. 개인정보처리방침의 변경",
    p: [`이 개인정보처리방침은 ${EFFECTIVE.replace(/-/g, ".")}부터 적용됩니다. 내용이 추가·삭제·수정되는 경우 시행 7일 전부터 이 페이지를 통해 고지합니다.`],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "개인정보처리방침", path: "/privacy/" }])} />
      <PageHeader badge={`시행일 ${EFFECTIVE.replace(/-/g, ".")}`} title="개인정보처리방침" description="한별시스템이 상담·견적·AS 접수 과정에서 받는 개인정보를 어떻게 다루는지 안내합니다." />
      <section className="py-10 lg:py-14 bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <p className="text-[15px] text-[var(--ink)]/90 leading-relaxed mb-8">
            한별시스템(대표 {site.address.ceo}, 사업자등록번호 {site.address.bizNo})은 개인정보 보호법 제30조에 따라
            정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하게 처리하기 위해 다음과 같이 개인정보처리방침을 수립·공개합니다.
          </p>

          {sections.map((s, i) => (
            <div key={s.h} className="mb-8">
              <h2 className="text-lg font-extrabold text-[var(--ink)] mb-3">{s.h}</h2>
              {s.p.map((para) => (
                <p key={para.slice(0, 30)} className="text-sm text-[var(--ink)]/85 leading-relaxed mb-3 whitespace-pre-line">
                  {para}
                </p>
              ))}
              {i === 1 && (
                <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--panel)] mt-4">
                  <table className="w-full text-sm min-w-[560px]">
                    <thead>
                      <tr className="bg-hb-primary text-white text-left">
                        <th className="py-2.5 px-4 font-extrabold whitespace-nowrap">수집 경로</th>
                        <th className="py-2.5 px-4 font-extrabold">항목</th>
                        <th className="py-2.5 px-4 font-extrabold">목적</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                      {collect.map((c) => (
                        <tr key={c.where}>
                          <td className="py-2.5 px-4 font-bold text-[var(--ink)] whitespace-nowrap align-top">{c.where}</td>
                          <td className="py-2.5 px-4 text-[var(--mute)] align-top">{c.items}</td>
                          <td className="py-2.5 px-4 text-[var(--mute)] align-top">{c.why}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-2xl p-5 text-sm text-[var(--mute)] leading-relaxed">
            개인정보 관련 문의: {site.phone.main} · {site.email} · {site.address.street}
          </div>
        </div>
      </section>
    </>
  );
}
