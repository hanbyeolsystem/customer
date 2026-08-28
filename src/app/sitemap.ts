import type { MetadataRoute } from "next";
import lastmod from "@/data/lastmod.json";
import { caseStudies } from "@/data/cases";
import { guides } from "@/data/guides";
import { naverPosts } from "@/data/naver-posts";
import { nasModels } from "@/data/synology";
import { qna, qnaCats, qnaModified } from "@/data/qna";
import { site } from "@/data/site";

export const dynamic = "force-static";

// next.config.ts 의 trailingSlash:true 때문에 GitHub Pages 는 /nas -> /nas/ 로 301 한다.
// 사이트맵에 슬래시 없는 주소를 넣으면 Search Console 이 전부 "리디렉션이 포함된 페이지"로
// 색인 제외하므로, 실제로 200 을 주는 슬래시 주소만 넣는다.
// noindex 페이지(/go/, /404/, /_not-found/)는 절대 넣지 않는다.
const pages = [
  "/", "/ai/", "/guide/", "/nas/", "/nas/buy/", "/nas/price/", "/nas/repair/", "/rental/", "/rental/price/", "/network/", "/shop/", "/cases/", "/qna/", "/news/", "/community/",
  "/support/", "/support/as/", "/support/quote/", "/support/remote/",
  "/support/drivers/", "/support/supplies/", "/blog/", "/about/", "/contact/",
  "/terms/", "/privacy/",
];

// lastmod 는 git 커밋 날짜(scripts/gen-lastmod.mjs 가 prebuild 로 생성).
// new Date() 를 쓰면 하루 3번 도는 재빌드 크론 때문에 "전 페이지가 매일 수정됨"이 되어
// 구글이 lastmod 자체를 무시한다. 날짜를 모르면 넣지 않는 편이 낫다.
const lm: Record<string, string> = lastmod;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((p) => ({
      url: `${site.url}${p}`,
      ...(lm[p] ? { lastModified: new Date(lm[p]) } : {}),
      changeFrequency: "weekly" as const,
      priority:
        p === "/" ? 1
          : p === "/qna/" || p === "/nas/" || p === "/rental/" || p === "/ai/" ? 0.9
            : p === "/terms/" || p === "/privacy/" ? 0.2
              : 0.6,
    })),
    // 네이버 블로그에서 가져온 글 - 글 날짜를 lastmod 로
    ...naverPosts.map((b) => ({
      url: `${site.url}/blog/${b.logNo}/`,
      lastModified: new Date(`${b.date}T00:00:00+09:00`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // Q&A 분류별 목록(FAQPage 스키마는 여기에)
    ...qnaCats.map((c) => ({
      url: `${site.url}/qna/cat/${c.id}/`,
      lastModified: new Date(qnaModified),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // 가이드 칼럼 - 비교표 중심 콘텐츠
    ...guides.map((g) => ({
      url: `${site.url}/guide/${g.slug}/`,
      lastModified: new Date(`${g.updated}T00:00:00+09:00`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // 시놀로지 모델별 페이지 - "DS925+ 설치" 같은 모델명 검색을 받는 페이지
    ...nasModels.map((m) => ({
      url: `${site.url}/nas/model/${m.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // 구축 사례 상세 - 사례별 시공 시점을 lastmod 로 쓴다
    ...caseStudies.map((c) => ({
      url: `${site.url}/cases/${c.slug}/`,
      lastModified: new Date(`${c.date}-01T00:00:00+09:00`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...qna.map((f) => ({
      url: `${site.url}/qna/${f.slug}/`,
      lastModified: new Date(qnaModified),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
