// Q&A·새소식 카테고리별 현장사진 매핑 - slug 해시로 안정적으로 분배(같은 글=늘 같은 사진)

const POOL: Record<string, string[]> = {
  ai: ["nas-real-02.jpg", "nas-01.jpg", "security-01.jpg", "nas-real-03.jpg"],
  nas: ["nas-real-01.jpg", "nas-real-02.jpg", "nas-real-03.jpg", "nas-01.jpg"],
  printer: ["printer-real-01.jpg", "printer-real-02.jpg", "printer-real-03.jpg", "printer-service-01.jpg"],
  pc: ["pc-build-04.jpg", "pc-done-01.jpg", "pc-cpu-01.jpg", "pc-done-02.jpg", "pc-parts-01.jpg", "pc-done-03.jpg"],
  network: ["network-01.jpg", "office-monitor-01.jpg"],
  service: ["brand-store-01.jpg", "printer-real-02.jpg", "pc-build-05.jpg", "printer-service-01.jpg"],
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
