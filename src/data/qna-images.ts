// Q&A·새소식 카테고리별 현장사진 매핑 - slug 해시로 안정적으로 분배(같은 글=늘 같은 사진)

const POOL: Record<string, string[]> = {
  ai: ["nas-real-02.webp", "nas-01.webp", "security-01.webp", "nas-real-03.webp"],
  nas: ["nas-real-01.webp", "nas-real-02.webp", "nas-real-03.webp", "nas-01.webp"],
  printer: ["printer-real-01.webp", "printer-real-02.webp", "printer-real-03.webp", "printer-service-01.webp"],
  pc: ["pc-build-04.webp", "pc-done-01.webp", "pc-cpu-01.webp", "pc-done-02.webp", "pc-parts-01.webp", "pc-done-03.webp"],
  network: ["network-01.webp", "office-monitor-01.webp"],
  service: ["brand-store-01.webp", "printer-real-02.webp", "pc-build-05.webp", "printer-service-01.webp"],
};

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

// size "thumb" 는 scripts/optimize-images.mjs 가 만든 480px 소형본(/blog-assets/thumb/).
export function qnaImage(cat: string, slug: string, size: "full" | "thumb" = "full"): string {
  const pool = POOL[cat] ?? POOL.service;
  const file = pool[hash(slug) % pool.length];
  return size === "thumb" ? `/blog-assets/thumb/${file}` : `/blog-assets/${file}`;
}
