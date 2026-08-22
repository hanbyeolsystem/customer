import type { MetadataRoute } from "next";
import { qna } from "@/data/qna";
import { site } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "", "/nas", "/rental", "/shop", "/cases", "/qna", "/community",
    "/support", "/support/as", "/support/quote", "/support/remote",
    "/support/drivers", "/support/supplies", "/blog", "/about",
  ];
  const now = new Date();
  return [
    ...pages.map((p) => ({
      url: `${site.url}${p}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : p === "/qna" || p === "/nas" || p === "/rental" ? 0.9 : 0.6,
    })),
    ...qna.map((f) => ({
      url: `${site.url}/qna/${f.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
