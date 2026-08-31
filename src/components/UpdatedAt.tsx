import { pageUpdatedDate } from "@/lib/schema";

/**
 * 서비스·가격 페이지 상단에 붙이는 "최종 업데이트" 한 줄.
 *
 * 금액과 구성이 언제 기준인지 사람도 AI 도 바로 보게 하려는 것이다.
 * 날짜는 git 커밋 날짜(lastmod.json)에서 오며, WebPage 스키마의 dateModified 와 같은 값이다.
 * 날짜를 모르면(얕은 클론) 아무것도 그리지 않는다 - 틀린 날짜보다 없는 편이 낫다.
 */
export function UpdatedAt({ path, note }: { path: string; note?: string }) {
  const date = pageUpdatedDate(path);
  if (!date) return null;
  return (
    <div className="bg-[var(--bg)] pt-5">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <p className="text-[12px] text-[var(--mute)]">
          최종 업데이트: <time dateTime={date} className="font-bold text-[var(--ink)]/80">{date}</time>
          {note ? <span> · {note}</span> : null}
        </p>
      </div>
    </div>
  );
}
