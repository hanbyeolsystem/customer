"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* 히어로 배경 미디어 레이어.
   - SSR/기본: 포스터 이미지 → LCP 안정, CLS 0
   - 마운트 후 배경 영상 페이드인(자동재생·무음·루프)
   - prefers-reduced-motion 은 의도적으로 보지 않는다. 윈도우 "애니메이션 효과" 를
     성능 때문에 꺼둔 사용자가 많아 배경영상까지 사라지는 오탐이 컸다(2026-08-26 사이트 운영자 결정).
     영상은 aria-hidden 장식 레이어라 정보 손실은 없다. */
export function HeroBackground({
  posterSrc,
  videoSrc,
  posterAlt = "한별시스템이 구축한 서버랙과 랙마운트 NAS",
  minWidth = 0,
}: {
  posterSrc: string;
  videoSrc: string;
  /** 포스터 이미지 대체 텍스트 */
  posterAlt?: string;
  /** 이 픽셀 폭 미만에서는 영상을 아예 불러오지 않고 포스터만 쓴다(모바일 데이터 절약). 0 = 항상 재생 */
  minWidth?: number;
}) {
  const [showVideo, setShowVideo] = useState(false);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 포스터는 로딩 전·폴백용으로 항상 SSR.
  // 영상은 화면 폭이 minWidth 이상일 때만 마운트한다(모바일 데이터 절약). 0 이면 항상.
  useEffect(() => {
    if (window.innerWidth >= minWidth) setShowVideo(true);
  }, [minWidth]);

  // src 를 마운트 후에 붙이므로 브라우저가 스스로 로드를 시작하지 않는다.
  // load() 로 새 src 를 인식시키고 play() 를 직접 호출한다.
  // muted 를 코드로 다시 세팅하는 것은 React 가 muted 를 property 로만 다뤄
  // 자동재생 정책에 걸리는 경우가 있어서다.
  useEffect(() => {
    if (!showVideo) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.load();
    v.play().catch(() => {
      /* 자동재생이 막히면 포스터가 그대로 보인다. 배경 장식이라 조용히 넘어간다. */
    });
  }, [showVideo]);

  return (
    <>
      <Image
        src={posterSrc}
        alt={posterAlt}
        fill
        priority
        sizes="100vw"
        className={`object-cover transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-60"
        }`}
      />
      {/* src 는 위 조건을 통과했을 때만 붙는다. src 없는 video 는 아무것도 내려받지 않는다. */}
      <video
        ref={videoRef}
        src={showVideo ? videoSrc : undefined}
        poster={posterSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        onCanPlay={() => setReady(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          ready ? "opacity-70" : "opacity-0"
        }`}
      />
    </>
  );
}
