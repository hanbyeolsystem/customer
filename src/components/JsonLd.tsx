// 구조화 데이터 한 덩어리를 <script type="application/ld+json"> 으로 심는다.
// data 가 null 이면 아무것도 심지 않는다(예: 갱신일을 모를 때의 webPageLd).
// "<" 는 유니코드 이스케이프로 바꾼다. 외부에서 온 글(쇼츠 JSON 등)에 "</script>" 가 있어도 태그를 못 닫는다(JSON 값은 같다).
export function JsonLd({ data }: { data: object | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
