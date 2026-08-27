// 네이버 블로그의 "모든" 글 목록을 가져온다 (RSS 는 최신 50편만 주기 때문).
// m.blog.naver.com 의 목록 API 는 로그인 없이 공개 글 전부를 30개씩 넘겨 준다.
//   import { listAllPosts } from "./naver-list.mjs";
//   const posts = await listAllPosts();   // [{logNo, title, category, date:'YYYY-MM-DD', link}] 최신순
export const BLOG_ID = "hanbyeolsystem";
const UA = "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/124 Mobile Safari/537.36";
const HDR = { "User-Agent": UA, Referer: `https://m.blog.naver.com/${BLOG_ID}` };

const dash = (s) => String(s || "").replace(/[—–]/g, "-").replace(/\s+/g, " ").trim();

export async function listAllPosts({ maxPages = 40 } = {}) {
  const out = new Map();
  for (let page = 1; page <= maxPages; page++) {
    const r = await fetch(`https://m.blog.naver.com/api/blogs/${BLOG_ID}/post-list?categoryNo=0&itemCount=30&page=${page}`, { headers: HDR, signal: AbortSignal.timeout(30000) });
    if (!r.ok) throw new Error(`post-list HTTP ${r.status}`);
    const j = await r.json();
    const items = j?.result?.items || [];
    if (!items.length) break;
    for (const it of items) {
      const logNo = String(it.logNo);
      if (out.has(logNo)) continue;
      out.set(logNo, {
        logNo,
        title: dash(it.titleWithInspectMessage || it.title),
        category: dash(it.categoryName || ""),
        date: new Date(Number(it.addDate)).toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }),
        link: `https://blog.naver.com/${BLOG_ID}/${logNo}`,
      });
    }
    await new Promise((res) => setTimeout(res, 150));
  }
  return [...out.values()].sort((a, b) => (b.date + b.logNo).localeCompare(a.date + a.logNo));
}

// 카테고리별로도 훑는다(전체 목록 API 가 일부를 빠뜨리는 경우 대비). 합집합을 돌려준다.
export async function listAllPostsThorough() {
  const all = new Map((await listAllPosts()).map((p) => [p.logNo, p]));
  const cr = await fetch(`https://m.blog.naver.com/rego/CategoryList.naver?blogId=${BLOG_ID}`, { headers: HDR, signal: AbortSignal.timeout(30000) });
  const ct = await cr.text();
  const cats = JSON.parse(ct.slice(ct.indexOf("{")))?.result?.mylogCategoryList || [];
  for (const c of cats) {
    if (!c.postCnt || c.categoryType === "L") continue; // 구분선 등 제외
    for (let page = 1; page <= 20; page++) {
      const r = await fetch(`https://m.blog.naver.com/api/blogs/${BLOG_ID}/post-list?categoryNo=${c.categoryNo}&itemCount=30&page=${page}`, { headers: HDR, signal: AbortSignal.timeout(30000) });
      if (!r.ok) break;
      const items = (await r.json())?.result?.items || [];
      if (!items.length) break;
      for (const it of items) {
        const logNo = String(it.logNo);
        if (all.has(logNo)) continue;
        all.set(logNo, { logNo, title: dash(it.titleWithInspectMessage || it.title), category: dash(c.categoryName), date: new Date(Number(it.addDate)).toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }), link: `https://blog.naver.com/${BLOG_ID}/${logNo}` });
      }
      await new Promise((res) => setTimeout(res, 150));
    }
  }
  return [...all.values()].sort((a, b) => (b.date + b.logNo).localeCompare(a.date + a.logNo));
}
