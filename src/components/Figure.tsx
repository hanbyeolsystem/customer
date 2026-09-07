import type { Photo } from "@/lib/photos";

/* 본문 중간 실사 사진 한 장 + 캡션. 스크롤로 들어오면 나타난다(data-reveal, Reveal.tsx). */
export function Figure({ photo, priority = false, className = "my-8" }: { photo: Photo; priority?: boolean; className?: string }) {
  return (
    <figure data-reveal className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        alt={photo.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="w-full max-h-[460px] object-cover rounded-2xl border border-[var(--line)] bg-[var(--panel)]"
      />
      <figcaption className="mt-2 text-[13px] text-[var(--mute)]">{photo.caption}</figcaption>
    </figure>
  );
}
