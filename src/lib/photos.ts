import { caseStudies } from "@/data/cases";

/* 본문 중간에 넣는 실사 사진 풀 (2026-09-08 사장님 "글씨만 있으니 직관적이지 않다, 중간중간 실사 사진").
   - 현장 사진: cases.ts 의 사진 78장을 장비·업종 키워드로 분류하고, 캡션은 그 사례의 지역·업종·장비에서 자동으로 만든다(전부 실제 시공 현장).
   - 블로그 사진: /blog-assets 의 현장 사진(네이버 블로그 원본). 캡션은 사진 내용만 적는다.
   같은 글은 늘 같은 사진이 나오도록 slug 해시로 고르고, 한 글 안에서는 겹치지 않게 뽑는다. */

export type Photo = { src: string; alt: string; caption: string };
export type PhotoCat = "ai" | "nas" | "printer" | "pc" | "network" | "service" | "office";

const BLOG: Record<string, Photo[]> = {
  // 그래픽 배너(nas-01·security-01·network-01·news-*)는 실사가 아니라 뺐다
  nas: [
    { src: "/blog-assets/nas-real-01.webp", alt: "사무실 랙에 설치한 시놀로지 NAS", caption: "사무실 랙에 설치한 시놀로지 NAS" },
    { src: "/blog-assets/nas-real-02.webp", alt: "NAS to NAS 대형 서버 구축 준비", caption: "NAS to NAS 대형 서버 구축 준비" },
    { src: "/blog-assets/nas-real-03.webp", alt: "시놀로지 DS925+ 설치 준비", caption: "시놀로지 DS925+ 설치 준비" },
  ],
  printer: [
    { src: "/blog-assets/printer-real-01.webp", alt: "대구 사무실 복합기 임대 설치", caption: "대구 사무실 복합기 임대 설치" },
    { src: "/blog-assets/printer-real-02.webp", alt: "대구 수성구 사무실 복합기 설치", caption: "대구 수성구 사무실 복합기 설치" },
    { src: "/blog-assets/printer-real-03.webp", alt: "교세라 TASKalfa 3552ci 컬러 복합기 설치", caption: "교세라 TASKalfa 3552ci 컬러 복합기 설치" },
    { src: "/blog-assets/printer-service-01.webp", alt: "복합기 출장 점검", caption: "복합기 출장 점검" },
  ],
  pc: [
    { src: "/blog-assets/pc-build-04.webp", alt: "사무용 PC 조립 중 내부", caption: "사무용 PC 조립 중 내부" },
    { src: "/blog-assets/pc-done-01.webp", alt: "조립을 마친 PC 와 모니터", caption: "조립을 마친 PC 와 모니터" },
    { src: "/blog-assets/pc-cpu-01.webp", alt: "CPU 장착", caption: "CPU 장착" },
    { src: "/blog-assets/pc-done-02.webp", alt: "조립 완료한 PC", caption: "조립 완료한 PC" },
    { src: "/blog-assets/pc-parts-01.webp", alt: "조립 PC 부품", caption: "조립 PC 부품" },
    { src: "/blog-assets/pc-done-03.webp", alt: "조립 완료한 PC", caption: "조립 완료한 PC" },
  ],
  network: [
    { src: "/blog-assets/office-monitor-01.webp", alt: "사무실 PC·모니터 설치", caption: "사무실 PC·모니터 설치" },
  ],
  service: [
    { src: "/blog-assets/brand-store-01.webp", alt: "한별시스템 매장(대구 달서구)", caption: "한별시스템 매장(대구 달서구)" },
    { src: "/blog-assets/printer-service-01.webp", alt: "복합기 출장 점검", caption: "복합기 출장 점검" },
    { src: "/blog-assets/pc-build-05.webp", alt: "PC 조립·점검", caption: "PC 조립·점검" },
  ],
};

/** 사례 한 건을 사진 분류로 */
function caseCat(c: (typeof caseStudies)[number]): PhotoCat[] {
  const t = `${c.title} ${c.gear.join(" ")} ${c.industry}`;
  const cats: PhotoCat[] = [];
  if (/Synology|NAS|나스|데이터|복구/i.test(t)) cats.push("nas", "ai");
  if (/Kyocera|복합기|복사기|프린터|VFM|TASKalfa/i.test(t)) cats.push("printer");
  if (/PC|컴퓨터|올인원|모니터/i.test(t)) cats.push("pc", "office");
  if (/랜|네트워크|배선|LAN/i.test(t)) cats.push("network", "office");
  if (/프로젝터|ViewSonic/i.test(t)) cats.push("service", "office");
  return cats.length ? cats : ["service"];
}

let cache: Record<string, Photo[]> | null = null;
function pool(cat: string): Photo[] {
  if (!cache) {
    cache = {};
    for (const c of caseStudies) {
      const cats = caseCat(c);
      c.images.forEach((src, i) => {
        const p: Photo = {
          src,
          alt: `${c.region} ${c.industry} ${c.gear[0]} 설치 현장${i ? ` ${i + 1}` : ""}`,
          caption: `${c.region} ${c.industry} · ${c.gear[0]} (실제 시공 현장)`,
        };
        for (const k of cats) (cache![k] ??= []).push(p);
      });
    }
    for (const [k, list] of Object.entries(BLOG)) (cache[k] ??= []).push(...list);
    cache.office ??= [];
    cache.office.push(...(cache.pc ?? []).filter((p) => !cache!.office!.includes(p)), ...(cache.network ?? []));
    cache.ai = [...(cache.ai ?? []), ...(cache.nas ?? []).filter((p) => !cache!.ai!.includes(p))];
  }
  return cache[cat] ?? cache.service ?? [];
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** 글(seed) 하나에 넣을 사진 n장. 같은 글은 늘 같은 사진, 한 글 안에서는 겹치지 않는다. except 에 있는 파일은 뺀다(상단 대표 사진과 중복 방지). */
export function articlePhotos(cat: string, seed: string, n: number, except: string[] = []): Photo[] {
  const list = pool(cat).filter((p) => !except.includes(p.src));
  if (!list.length) return [];
  const start = hash(seed) % list.length;
  const step = 1 + (hash(seed + "#") % Math.max(1, Math.floor(list.length / Math.max(1, n))));
  const out: Photo[] = [];
  for (let i = 0; out.length < Math.min(n, list.length) && i < list.length; i++) {
    const p = list[(start + i * step) % list.length];
    if (!out.includes(p)) out.push(p);
  }
  return out;
}
