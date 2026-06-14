import { PageHeader } from "@/components/PageHeader";
import { ComingSoon } from "@/components/ComingSoon";
export const metadata = { title: "개인정보처리방침" };
export default function Page() {
  return (
    <>
      <PageHeader badge="PRIVACY" title="개인정보처리방침" description="작성 중입니다." />
      <ComingSoon title="개인정보처리방침 작성 중" note="법무 검토 후 게시 예정." />
    </>
  );
}
