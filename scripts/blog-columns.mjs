// 블로그 칼럼(Q&A 카테고리) 발행 — 사이트와 다른 자료 + 전 글 사진 첨부
// 사용: node scripts/blog-columns.mjs [--dry-run]
import { COLUMNS, SITE_BASE } from "./blog-columns-data.mjs";
import { getAccessToken, listAllPosts, publishPost, updatePost, deletePost, withBackoff, sleep } from "./blogger-lib.mjs";

const DRY = process.argv.includes("--dry-run");

function buildHtml(c) {
  const img = (src, alt) =>
    `<div class="separator" style="clear:both;text-align:center;"><img src="${src}" alt="${alt}" style="max-width:100%;height:auto;border-radius:8px;" /></div>`;
  // 본문 중간에 추가 사진 삽입 (문단 사이)
  const paras = c.body.trim().split(/\n(?=<p)/);
  let out = img(c.img, c.title) + "\n";
  paras.forEach((p, i) => {
    out += p + "\n";
    if (i === 0 && c.img2) out += img(c.img2, c.title + " 사진") + "\n";
    if (i === 1 && c.img3) out += img(c.img3, c.title + " 사진") + "\n";
  });
  out += `<hr>
<p><b>한별시스템</b> — 컴퓨터·복합기 렌탈·나스(NAS)·네트워크·홈페이지, 전산 올인원 관리<br>
📞 053-588-7119 (평일 09:00~18:00) · 대구·경북 당일 방문 · <i>전산은 전화 한 통</i><br>
🔗 <a href="${SITE_BASE}/qna/">궁금증 155문답 보기</a> · <a href="${SITE_BASE}/community/">커뮤니티에 질문하기</a></p>`;
  return out;
}

if (DRY) {
  for (const c of COLUMNS) console.log(`[${c.key}] ${c.title} (사진 ${[c.img, c.img2, c.img3].filter(Boolean).length}장)`);
  process.exit(0);
}

const token = await getAccessToken();
const all = await withBackoff("목록 조회", () => listAllPosts(token));
if (!all) throw new Error("목록 조회 실패 — 중단");
console.log(`기존 글 ${all.length}건`);

// 구 Q&A 시리즈(사이트 미러) 삭제 — 제목에 "| 대구 한별시스템" 이 들어간 글
const oldSeries = all.filter((x) => x.title.includes("| 대구 한별시스템"));
for (const x of oldSeries) {
  const ok = await withBackoff(`삭제: ${x.title}`, async () => { await deletePost(token, x.id); return true; });
  console.log(ok ? `삭제됨: ${x.title}` : `삭제 포기: ${x.title}`);
  await sleep(8000);
}

// 칼럼: 동일 제목 있으면 갱신, 없으면 발행
const byTitle = new Map(all.filter((x) => !oldSeries.includes(x)).map((x) => [x.title, x.id]));
for (const c of COLUMNS) {
  const html = buildHtml(c);
  const id = byTitle.get(c.title);
  const url = await withBackoff(c.title, () =>
    id ? updatePost(token, id, { title: c.title, html, labels: c.labels })
       : publishPost(token, { title: c.title, html, labels: c.labels })
  );
  if (url) console.log(`${id ? "갱신됨" : "발행됨"}: ${url}`);
  else { console.log(`포기: ${c.title}`); break; }
  await sleep(15000);
}
console.log("완료");
