// 설치후기 라벨 일괄 부여 — 새소식/Q&A가 아닌 모든 글(네이버 크로스포스트)에 '설치후기' 라벨 추가
import { getAccessToken, listAllPosts, withBackoff, sleep } from "./blogger-lib.mjs";

const token = await getAccessToken();
const all = await withBackoff("목록", () => listAllPosts(token));
if (!all) throw new Error("목록 조회 실패");
const blogId = process.env.BLOGGER_BLOG_ID;

let done = 0, skip = 0;
for (const p of all) {
  const labels = p.labels || [];
  if (labels.includes("새소식") || labels.includes("Q&A") || labels.includes("설치후기")) { skip++; continue; }
  const ok = await withBackoff(p.title, async () => {
    const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${p.id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ labels: [...labels, "설치후기"] }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`);
    return true;
  });
  if (ok) { done++; console.log(`라벨 추가: ${p.title.slice(0, 40)}`); }
  await sleep(4000);
}
console.log(`완료: ${done}건 추가, ${skip}건 스킵`);
