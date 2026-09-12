import Link from "next/link";
import { topicPhoto, type Photo } from "@/lib/photos";

/* 페이지 상단 머리글. 배경에 그 페이지 내용에 맞는 실사 사진이 깔린다(2026-09-12 사장님 "메뉴에 맞춰 사진").
   사진은 제목·badge 글에서 분류를 자동으로 뽑으므로 페이지마다 따로 지정할 필요가 없다.
   photo={null} 을 주면 사진 없이 예전 모습 그대로(약관·개인정보 같은 문서 페이지). */
export function PageHeader({
  badge,
  title,
  description,
  back = "/",
  backLabel = "메인으로",
  photo,
}: {
  badge?: string;
  title: string;
  description?: string;
  back?: string;
  backLabel?: string;
  photo?: Photo | null;
}) {
  const bg = photo === undefined ? topicPhoto(`${badge ?? ""} ${title}`, `hero:${title}`, true) : photo;

  return (
    <section className="relative overflow-hidden bg-hb-primary text-white py-14 lg:py-20 border-b border-white/10">
      {bg && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bg.src}
            alt={bg.alt}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="hb-photo-in h-full w-full object-cover"
          />
          {/* 흰 글씨가 밝은 사진 위에서도 읽히도록 두 겹 (회사소개 히어로와 같은 방식) */}
          <div className="absolute inset-0 bg-hb-primary/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-hb-primary via-hb-primary/70 to-hb-primary/30" />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 lg:px-6">
        <Link
          href={back}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white mb-4 transition"
        >
          ← {backLabel}
        </Link>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
          {title}
        </h1>
        {badge && (
          <div className="mt-2.5 font-mono text-[11px] font-semibold text-hb-blue-light/85 tracking-[.2em]">
            {badge}
          </div>
        )}
        {description && (
          <p className="text-base lg:text-lg text-white/85 mt-4 max-w-3xl leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
