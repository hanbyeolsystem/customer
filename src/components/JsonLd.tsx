// 구조화 데이터 한 덩어리를 <script type="application/ld+json"> 으로 심는다.
// data 가 null 이면 아무것도 심지 않는다(예: 갱신일을 모를 때의 webPageLd).
export function JsonLd({ data }: { data: object | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
