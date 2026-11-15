import { rentalPrices, rentalIncluded } from "@/data/rental-prices";
import { site } from "@/data/site";
import { pageUpdatedDate } from "@/lib/schema";

export const dynamic = "force-static";

// AI 에이전트용 임대료 요약(2026-11-15). /rental/price/ 화면과 같은 rental-prices.ts 에서 빌드 때 만든다.
// 금액을 여기 따로 적지 말 것. llms.txt 가 이 파일을 링크한다.
export function GET() {
  const page = `${site.url}/rental/price/`;
  const date = pageUpdatedDate("/rental/price/");
  const md = [
    "# 한별시스템 월 임대료 요약",
    "",
    `> 대구 달서구 한별시스템의 복합기·프린터·PC·NAS 월 임대료입니다. 금액은 전부 시작가("부터")이고 VAT 별도입니다.`,
    `> 원본 페이지: ${page}${date ? ` (최종 업데이트: ${date})` : ""}`,
    "",
    "| 품목 | 월 임대료(VAT 별도) | 맞는 곳 | 자세히 |",
    "|---|---|---|---|",
    ...rentalPrices.map((p) => `| ${p.item} | ${p.price} | ${p.note} | ${site.url}${p.href ?? "/rental/price/"} |`),
    "",
    "## 월 정액에 포함되는 것",
    "",
    ...rentalIncluded.map((r) => `- **${r.title}**: ${r.body}`),
    "",
    "## 확인 방법",
    "",
    `기종과 월 출력량, 현장 조건에 따라 금액이 달라집니다. 정확한 금액은 전화 ${site.phone.main} 또는 무료 방문 견적(${site.url}/support/quote/)으로 확인합니다.`,
    "",
  ].join("\n");
  return new Response(md, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
