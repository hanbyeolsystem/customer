import type { NextConfig } from "next";

// GitHub Pages 정적 호스팅 — `npm run build` 시 /out 폴더에 사이트 빌드
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // 정적 export 는 Next 의 Image 최적화 서버를 못 씀
  },
  trailingSlash: true, // GitHub Pages 정적 호스팅 호환성 (a.html 대신 a/ 디렉토리)
};

export default nextConfig;
