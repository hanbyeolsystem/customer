import { PageHeader } from "@/components/PageHeader";
import { ComingSoon } from "@/components/ComingSoon";
export const metadata = { title: "이용약관" };
export default function Page() {
  return (
    <>
      <PageHeader badge="TERMS" title="이용약관" description="작성 중입니다." />
      <ComingSoon title="이용약관 작성 중" note="법무 검토 후 게시 예정." />
    </>
  );
}
