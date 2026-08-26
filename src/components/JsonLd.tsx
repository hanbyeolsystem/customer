// 구조화 데이터 한 덩어리를 <script type="application/ld+json"> 으로 심는다.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
