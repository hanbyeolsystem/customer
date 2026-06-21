"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/* 히어로 배경 미디어 레이어.
   - SSR/기본: 포스터 이미지(server-rack.png) → LCP 안정, CLS 0
   - 모션 허용 사용자에 한해 마운트 후 배경 영상 페이드인(자동재생·무음·루프)
   - prefers-reduced-motion 사용자는 영상 없이 포스터 유지 (a11y CRITICAL) */
export function HeroBackground({
  posterSrc,
  videoSrc,
}: {
  posterSrc: string;
  videoSrc: string;
}) {
  const [showVideo, setShowVideo] = useState(false);
  const [ready, setReady] = useState(false);

  // 데스크탑/모바일 모두 영상 재생 (포스터는 로딩 전·폴백용으로 항상 SSR)
  useEffect(() => {
    setShowVideo(true);
  }, []);

  return (
    <>
      <Image
        src={posterSrc}
        alt="한별시스템 엔지니어가 기업 서버·장비를 점검하는 모습"
        fill
        priority
        sizes="100vw"
        className={`object-cover transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-60"
        }`}
      />
      {showVideo && (
        <video
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onCanPlay={() => setReady(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            ready ? "opacity-70" : "opacity-0"
          }`}
        />
      )}
    </>
  );
}
