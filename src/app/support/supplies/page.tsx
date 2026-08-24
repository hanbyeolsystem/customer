import { PageHeader } from "@/components/PageHeader";
import { ComingSoon } from "@/components/ComingSoon";
export const metadata = {
  title: "토너·소모품 주문",
  description:
    "복합기·프린터 토너와 드럼 등 소모품 주문. 한별시스템 임대 고객은 카운터 자동 수집으로 토너가 소진되기 전에 미리 배송되므로 따로 주문할 필요가 없습니다. 대구·경북 당일 배송.",
  alternates: { canonical: "/support/supplies/" },
};
export default function Page() {
  return (
    <>
      <PageHeader badge="SUPPLIES" title="소모품 주문" description="토너·드럼·잉크 주문 페이지 준비 중입니다." />
      <ComingSoon title="소모품 주문 페이지 준비 중" note="현재는 전화 주문으로 받고 있습니다." />
    </>
  );
}
