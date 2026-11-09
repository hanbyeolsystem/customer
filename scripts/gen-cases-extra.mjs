// 구축사례 중 DB(Supabase site_cases)에 있는 것을 빌드 전에 받아 src/data/cases-extra.json 으로 쓴다(prebuild).
// 매일 "블로그→사이트" 루틴이 블로그 설치 후기를 site_cases 에 넣는다. cases.ts 가 이 파일을 목록 맨 앞에 붙인다.
// 사진·원문 주소는 naver-posts.json 에서 log_no 로 붙인다(사이트에 저장된 사진만. 외부 사진은 스키마 image 주소가 깨진다).
// 받기에 실패하면 빌드를 멈춘다(빈 채로 배포되면 사례 주소가 404).

import { readFileSync, writeFileSync } from "node:fs";

const SB_URL = "https://jrzesjgyrvgvwazfajec.supabase.co";
const SB_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyemVzamd5cnZndndhemZhamVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MjgwMTksImV4cCI6MjA5MzMwNDAxOX0.6FAb0CUMuYVqsvWmUR8Bbvmph4MJjlQqSDi_Mkza1c0";
const OUT = "src/data/cases-extra.json";

async function rows() {
  for (let i = 1; ; i++) {
    try {
      const r = await fetch(`${SB_URL}/rest/v1/site_cases?select=*&order=created_at.desc`, {
        headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
        signal: AbortSignal.timeout(20000),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      if (i >= 3) throw new Error(`site_cases 를 받지 못했습니다: ${e}`);
      await new Promise((ok) => setTimeout(ok, 3000));
    }
  }
}

const posts = JSON.parse(readFileSync("src/data/naver-posts.json", "utf8"));
const manualSlugs = new Set([...readFileSync("src/data/cases.ts", "utf8").matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]));

const out = [];
for (const r of await rows()) {
  if (manualSlugs.has(r.slug)) throw new Error(`site_cases slug 가 cases.ts 와 겹칩니다: ${r.slug}`);
  const p = posts.find((x) => x.logNo === r.log_no);
  const images = p ? p.blocks.filter((b) => b.t === "img" && b.src.startsWith("/")).map((b) => b.src) : [];
  if (!images.length) {
    console.warn(`  - ${r.log_no} ${r.slug}: 블로그 글·사진이 아직 naver-posts.json 에 없어 이번 빌드에서 뺌`);
    continue;
  }
  out.push({
    slug: r.slug, industry: r.industry, region: r.region, date: r.date, category: r.category,
    title: r.title, summary: r.summary, gear: r.gear, tags: r.tags, images, href: p.href,
    challenge: r.challenge, solution: r.solution, result: r.result,
    ...(r.spec ? { spec: r.spec } : {}),
  });
}
writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`cases-extra: ${out.length}건 -> ${OUT}`);
