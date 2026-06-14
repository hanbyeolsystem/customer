import { PageHeader } from "@/components/PageHeader";
import { ComingSoon } from "@/components/ComingSoon";
export const metadata = { title: "소모품 주문" };
export default function Page() {
  return (
    <>
      <PageHeader badge="SUPPLIES" title="소모품 주문" description="토너·드럼·잉크 주문 페이지 준비 중입니다." />
      <ComingSoon title="소모품 주문 페이지 준비 중" note="현재는 전화 주문으로 받고 있습니다." />
    </>
  );
}
