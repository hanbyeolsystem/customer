// Blogger API 공용 헬퍼 (토큰·목록·발행·갱신·삭제·백오프)
export async function getAccessToken() {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  const j = await res.json();
  if (!j.access_token) throw new Error(`token error: ${JSON.stringify(j)}`);
  return j.access_token;
}

export async function listAllPosts(token) {
  const blogId = process.env.BLOGGER_BLOG_ID;
  const items = [];
  let pageToken = "";
  do {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?maxResults=100&fetchBodies=false${pageToken ? `&pageToken=${pageToken}` : ""}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`list error: HTTP ${res.status} ${await res.text()}`);
    const j = await res.json();
    items.push(...(j.items || []));
    pageToken = j.nextPageToken || "";
  } while (pageToken);
  return items;
}

export async function publishPost(token, { title, html, labels }) {
  const blogId = process.env.BLOGGER_BLOG_ID;
  const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "blogger#post", title, content: html, labels }),
  });
  const j = await res.json();
  if (!j.id) throw new Error(`publish error: ${JSON.stringify(j)}`);
  return j.url;
}

export async function updatePost(token, postId, { title, html, labels }) {
  const blogId = process.env.BLOGGER_BLOG_ID;
  const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${postId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "blogger#post", id: postId, title, content: html, labels }),
  });
  const j = await res.json();
  if (!j.id) throw new Error(`update error: ${JSON.stringify(j)}`);
  return j.url;
}

export async function deletePost(token, postId) {
  const blogId = process.env.BLOGGER_BLOG_ID;
  const res = await fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${postId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok && res.status !== 204) throw new Error(`delete error: HTTP ${res.status}`);
}

export async function withBackoff(label, fn) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      return await fn();
    } catch (e) {
      if (String(e).includes("429") || String(e).includes("RESOURCE_EXHAUSTED")) {
        const wait = 90 * attempt;
        console.log(`429 속도제한 — ${wait}초 대기 후 재시도 (${attempt}/4): ${label}`);
        await new Promise((r) => setTimeout(r, wait * 1000));
      } else throw e;
    }
  }
  return null;
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
