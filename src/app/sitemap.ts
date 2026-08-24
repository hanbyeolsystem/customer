import type { MetadataRoute } from "next";
import { qna } from "@/data/qna";
import { site } from "@/data/site";

export const dynamic = "force-static";

// next.config.ts 의 trailingSlash:true 때문에 GitHub Pages 는 /nas -> /nas/ 로 301 한다.
// 사이트맵에 슬래시 없는 주소를 넣으면 Search Console 이 전부 "리디렉션이 포함된 페이지"로
// 색인 제외하므로, 실제로 200 을 주는 슬래시 주소만 넣는다.
// noindex 페이지(/go/, /404/, /_not-found/)는 절대 넣지 않는다.
const pages = [
  "/", "/nas/", "/rental/", "/shop/", "/cases/", "/qna/", "/news/", "/community/",
  "/support/", "/support/as/", "/support/quote/", "/support/remote/",
  "/support/drivers/", "/support/supplies/", "/blog/", "/about/",
  "/terms/", "/privacy/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...pages.map((p) => ({
      url: `${site.url}${p}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority:
        p === "/" ? 1
          : p === "/qna/" || p === "/nas/" || p === "/rental/" ? 0.9
            : p === "/terms/" || p === "/privacy/" ? 0.2
              : 0.6,
    })),
    ...qna.map((f) => ({
      url: `${site.url}/qna/${f.slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
