// 네이버 블로그 글을 사이트로 가져온다 (본문 + 사진 → /blog/<logNo>/ 페이지).
//
// 왜: 네이버 블로그 292편(2017~)에 지역·장비 키워드가 다 들어 있는데 사이트에는 없었다.
//     글을 사이트 안에 두면 그 검색어가 한별시스템.kr 로 들어온다. (네이버 글쓰기 API 는 없어서
//     네이버 글 자체에 링크를 넣는 일은 사람이 해야 한다.)
//
//   node scripts/naver-import.mjs              # 아직 없는 글만 (목록 API 로 전체 열거)
//   node scripts/naver-import.mjs --all        # 이미 있는 글도 다시 받는다
//   node scripts/naver-import.mjs --limit 5    # 시험용
//   node scripts/naver-import.mjs --rss        # RSS 최신 50편만 훑는다(빠름, 워크플로용)
//
// 사진 정책: 글당 앞 2장은 900px WebP 로 내려받아 저장(public/blog-posts/<logNo>/), 나머지는
//            네이버 CDN 주소(?type=w966)를 그대로 쓴다(외부 referer 허용 실측 확인). 292편 전부
//            내려받으면 저장소가 100MB 넘게 커지기 때문.
// 결과: src/data/naver-posts.json (최신순). .github/workflows/naver-import.yml 이 하루 3번 새 글을 커밋한다.
import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync, existsSync, renameSync } from "node:fs";
import { listAllPostsThorough, BLOG_ID } from "./naver-list.mjs";

const RSS = "https://rss.blog.naver.com/hanbyeolsystem.xml";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36";
const STATE = "src/data/naver-posts.json";
const IMG_DIR = "public/blog-posts";
const LOCAL_IMG = 2;   // 글당 내려받아 저장할 사진 수
const MAX_IMG = 12;    // 글당 보여 줄 사진 최대
const CONC = 3;
const args = process.argv.slice(2);
const ALL = args.includes("--all");
const RSS_ONLY = args.includes("--rss");
const LIMIT = Number(args[args.indexOf("--limit") + 1]) || 0;
const ONLY = args.includes("--only") ? args[args.indexOf("--only") + 1].split(",") : null; // 특정 글만 다시 (디버그)
const REDO_NOIMG = args.includes("--redo-noimg"); // 사진 0장으로 끝난 글을 다시 받는다 (일시 오류 복구)

// 네이버 분류 → 사이트 분류(related 배정·사이트맵용). 화면의 묶음은 catLabel(원래 이름) 그대로 쓴다.
function siteCat(category) {
  const c = category || "";
  if (/NAS|나스/.test(c)) return "nas";
  if (/복합기|프린터|토너|교세라|브라더|라벨|핸드|제균기/.test(c)) return "printer";
  if (/컴퓨터|PC|위더스/.test(c)) return "pc";
  if (/설치사례/.test(c)) return "case";
  if (/서비스|안내/.test(c)) return "service";
  return "etc";
}
const decode = (s) => s.replace(/<[^>]+>/g, "").replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/[—–]/g, "-").replace(/​/g, "").replace(/\s+/g, " ").trim();
const tag = (x, n) => { const m = x.match(new RegExp(`<${n}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${n}>`)); return m ? m[1].trim() : ""; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 글 성격 → 사이트에서 이어 볼 페이지 (제목·분류 키워드. 새 유형이 나오면 여기에 추가)
function relatedFor(title, category) {
  const t = `${title} ${category}`;
  const R = (href, label) => ({ href, label });
  if (/DS925/.test(t)) return R("/nas/model/ds925-plus/", "DS925+ 설치 비용·구성");
  if (/DS1825/.test(t)) return R("/nas/model/ds1825-plus/", "DS1825+ 설치 비용·구성");
  if (/DS1525/.test(t)) return R("/nas/model/ds1525-plus/", "DS1525+ 설치 비용·구성");
  if (/DS425/.test(t)) return R("/nas/model/ds425-plus/", "DS425+ 설치 비용·구성");
  if (/DS225/.test(t)) return R("/nas/model/ds225-plus/", "DS225+ 설치 비용·구성");
  if (/RS2421|RS\d{3,4}/.test(t)) return R("/nas/model/rs2421-plus/", "RS2421+ 랙마운트 구축");
  if (/랜섬웨어/.test(t)) return R("/guide/ransomware-nas-checklist/", "랜섬웨어 대응 체크리스트");
  if (/복구|복원|수리|하드 교체|AS/.test(t) && /NAS|나스|서버/.test(t)) return R("/nas/repair/", "NAS 수리·복구 점검 안내");
  if (/속도|접속/.test(t) && /NAS|나스/.test(t)) return R("/guide/nas-failure-reasons/", "NAS 느려짐·접속 문제 원인");
  if (/백업/.test(t)) return R("/guide/321-backup-howto/", "3-2-1 백업 구성법");
  if (/iptime/i.test(t)) return R("/qna/nas-iptime-compare/", "iptime과 시놀로지 비교");
  if (/병원|학원|건축|공장|관공서|대학/.test(t)) return R("/guide/industry-data-checklist/", "업종별 데이터 관리 체크리스트");
  if (/NAS|나스/.test(t)) return R("/nas/", "기업용 NAS 구축 안내");
  if (/재생토너|토너|잉크/.test(t)) return R("/guide/toner-cost-saving/", "토너 비용 줄이는 방법");
  if (/복합기|복사기|교세라|프린터|라벨|핸드프린터|각인기/.test(t)) return R("/rental/price/", "복합기·프린터 월 임대료");
  if (/제균기|웰리스/.test(t)) return R("/rental/", "사무기기 렌탈 안내");
  if (/컴퓨터|PC|노트북|위더스/.test(t)) return R("/guide/office-pc-spec-guide/", "사무용 PC 사양 가이드");
  if (/랜공사|네트워크|인터넷|와이파이/.test(t)) return R("/network/", "사무실 네트워크·랜공사");
  if (/빔프로젝터|사무기기|총정리/.test(t)) return R("/rental/", "사무기기 렌탈 안내");
  if (/서비스|출장|방문|견적/.test(t)) return R("/support/", "고객지원·방문 견적");
  return R("/", "한별시스템 홈페이지");
}

const caseSrc = existsSync("src/data/cases.ts") ? readFileSync("src/data/cases.ts", "utf8") : "";
function caseFor(logNo) {
  const m = caseSrc.match(new RegExp(`slug: "([^"]+)"[\\s\\S]{0,4000}?href: "https://blog\\.naver\\.com/${BLOG_ID}/${logNo}"`));
  return m ? m[1] : undefined;
}

async function get(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA, Referer: "https://blog.naver.com/" }, signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
  return r;
}

function isBandRow(d, W, C, y) {
  const b = new Map(); let n = 0;
  for (let x = 0; x < W; x += 3) { const i = (y * W + x) * C; const k = `${d[i] >> 4},${d[i + 1] >> 4},${d[i + 2] >> 4}`; b.set(k, (b.get(k) || 0) + 1); n++; }
  return Math.max(...b.values()) / n >= 0.55;
}
async function cropBands(buf) {
  // 주의: sharp 객체에 .raw() 를 한 번 부르면 그 객체의 출력이 raw 로 고정된다. 그래서 판독용과 잘라내기용 객체를 따로 만든다
  // (같은 객체로 extract 하면 헤더 없는 raw 버퍼가 나와 다음 단계에서 "unsupported image format" 이 난다).
  let cur = buf;
  for (const side of ["bottom", "top"]) {
    const { data, info } = await sharp(cur).raw().toBuffer({ resolveWithObject: true });
    const { width: W, height: H, channels: C } = info;
    let box = null;
    if (side === "bottom") {
      for (let s = Math.floor(H * 0.4); s < H; s++) {
        const rows = []; for (let y = s; y < H; y++) rows.push(isBandRow(data, W, C, y));
        if (rows.length < H * 0.12) break;
        if (rows.filter(Boolean).length / rows.length >= 0.8) { box = { left: 0, top: 0, width: W, height: Math.max(1, s - 3) }; break; }
      }
    } else {
      for (let e = Math.floor(H * 0.18); e >= 8; e--) {
        let hit = 0; for (let y = 0; y <= e; y++) if (isBandRow(data, W, C, y)) hit++;
        if (hit / (e + 1) >= 0.8) { box = { left: 0, top: e + 3, width: W, height: H - e - 3 }; break; }
      }
    }
    if (box) cur = await sharp(cur).extract(box).png().toBuffer();
  }
  return sharp(cur);
}

// 본문 추출: SmartEditor ONE(se-main-container) → SmartEditor 2(se_component_wrap) → 구형(post_ct) 순으로 시도
function extractBlocks(html, title) {
  let body = "";
  for (const re of [/<div[^>]*class="[^"]*se-main-container/, /<div[^>]*class="[^"]*se_component_wrap/, /<div[^>]*id="post_ct"|<div[^>]*class="[^"]*post_ct/]) {
    const at = html.search(re);
    if (at >= 0) { body = html.slice(at, at + 400000); break; }
  }
  if (!body) body = html;
  const re = /<p[^>]*class="[^"]*(?:se-text-paragraph|se_textarea|se_paragraph)[^"]*"[^>]*>([\s\S]*?)<\/p>|<img\b[^>]*?(?:data-lazy-src|data-src|src)="(https?:\/\/[^"]*pstatic\.net[^"]*)"/g;
  const blocks = []; let para = []; const seen = new Set();
  const flush = () => { if (para.length) { blocks.push({ t: "p", text: para.join(" ") }); para = []; } };
  let m;
  while ((m = re.exec(body))) {
    if (m[2]) {
      const src = m[2].split("?")[0];
      if (/\.gif$/i.test(src) || /storep-phinf|dthumb|profile|ssl\.pstatic\.net\/static/.test(src) || seen.has(src)) continue;
      seen.add(src); flush(); blocks.push({ t: "img", src });
    } else {
      const text = decode(m[1]);
      if (!text) flush(); else para.push(text);
    }
  }
  flush();
  // 구형 글에서 문단 태그가 없으면 본문 컨테이너의 텍스트를 통째로 한 문단으로
  if (!blocks.some((b) => b.t === "p")) {
    const text = decode(body.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "")).slice(0, 6000);
    if (text.length > 40) blocks.unshift({ t: "p", text });
  }
  if (blocks[0]?.t === "p" && blocks[0].text.replace(/\s/g, "").startsWith(title.replace(/\s/g, "").slice(0, 12))) blocks.shift();
  return blocks;
}

async function fetchPost(item) {
  const html = await (await get(`https://m.blog.naver.com/PostView.naver?blogId=${BLOG_ID}&logNo=${item.logNo}`)).text();
  const blocks = extractBlocks(html, item.title);
  const dir = `${IMG_DIR}/${item.logNo}`;
  let n = 0, local = 0;
  for (const b of blocks) {
    if (b.t !== "img") continue;
    if (n >= MAX_IMG) { b.drop = true; continue; }
    if (local < LOCAL_IMG) {
      try {
        const buf = Buffer.from(await (await get(`${b.src}?type=w966`)).arrayBuffer());
        const meta = await sharp(buf).metadata();
        if (!meta.width || meta.width < 500 || meta.width / meta.height > 3) { b.drop = true; continue; }
        mkdirSync(dir, { recursive: true });
        const img = await cropBands(buf);
        const out = await img.resize({ width: 900, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toBuffer();
        const om = await sharp(out).metadata();
        n++; local++;
        const file = `${dir}/${n}.webp`;
        writeFileSync(file + ".tmp", out); renameSync(file + ".tmp", file);
        b.src = `/blog-posts/${item.logNo}/${n}.webp`; b.w = om.width; b.h = om.height;
      } catch (e) { b.drop = true; if (process.env.DEBUG) console.log(`    사진 실패 ${b.src.slice(0, 60)}: ${e.message}`); }
    } else {
      n++; b.src = `${b.src}?type=w966`; b.remote = true; // 네이버 CDN 그대로
    }
  }
  const kept = blocks.filter((b) => !b.drop);
  const text = kept.filter((b) => b.t === "p").map((b) => b.text).join(" ");
  const firstImg = kept.find((b) => b.t === "img");
  return {
    logNo: item.logNo, title: decode(item.title), cat: siteCat(item.category), catLabel: decode(item.category || "") || "기타", date: item.date, href: item.link,
    thumb: firstImg?.src, excerpt: text.slice(0, 160), chars: text.length, images: n,
    related: relatedFor(item.title, item.category), caseSlug: caseFor(item.logNo), blocks: kept,
  };
}

/* ---------- 실행 ---------- */
let items;
if (RSS_ONLY) {
  const xml = await (await get(RSS)).text();
  items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => {
    const link = tag(m[1], "link").split("?")[0];
    return { logNo: link.split("/").pop(), title: decode(tag(m[1], "title")), category: tag(m[1], "category"), link, date: new Date(tag(m[1], "pubDate")).toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }) };
  }).filter((i) => /^\d+$/.test(i.logNo));
} else {
  items = await listAllPostsThorough();
}
const prev = existsSync(STATE) ? JSON.parse(readFileSync(STATE, "utf8")) : [];
const have = new Set(prev.map((p) => p.logNo));
const noImg = new Set(prev.filter((p) => p.images === 0).map((p) => p.logNo));
let todo = items.filter((i) => ONLY ? ONLY.includes(i.logNo) : ALL || !have.has(i.logNo) || (REDO_NOIMG && noImg.has(i.logNo)));
if (LIMIT) todo = todo.slice(0, LIMIT);
console.log(`목록 ${items.length}건, 보관 ${prev.length}건, 가져올 글 ${todo.length}건`);

const fresh = [];
let idx = 0;
await Promise.all(Array.from({ length: CONC }, async () => {
  while (idx < todo.length) {
    const it = todo[idx++];
    try {
      const p = await fetchPost(it);
      fresh.push(p);
      console.log(`  + [${p.logNo}] ${p.date} ${p.title.slice(0, 36)} · ${p.chars}자 · 사진 ${p.images}장${p.caseSlug ? " · 사례 " + p.caseSlug : ""}`);
    } catch (e) {
      console.log(`  ! [${it.logNo}] 실패: ${e.message}`);
    }
    await sleep(200);
  }
}));
const byNo = new Map(prev.map((p) => [p.logNo, p]));
for (const p of fresh) byNo.set(p.logNo, p);
const all = [...byNo.values()].filter((p) => p.chars >= 40 || p.images > 0).sort((a, b) => (b.date + b.logNo).localeCompare(a.date + a.logNo));
writeFileSync(STATE, JSON.stringify(all, null, 1) + "\n", "utf8");
console.log(`✓ ${STATE} ${all.length}건 (새 글 ${fresh.length})`);
