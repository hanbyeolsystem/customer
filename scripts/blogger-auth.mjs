// 구글 블로거 API 최초 1회 인증 도우미 — Refresh Token 발급기
//
// 준비물: Google Cloud Console 에서 만든 OAuth 클라이언트(데스크톱 앱)의
//         클라이언트 ID / 클라이언트 보안 비밀번호
//
// 사용:  node scripts/blogger-auth.mjs <CLIENT_ID> <CLIENT_SECRET>
//   → 브라우저가 열리면 구글 로그인 + 허용 클릭
//   → 터미널에 GOOGLE_REFRESH_TOKEN 과 블로그 ID 목록이 출력됨

import { createServer } from "node:http";
import { exec } from "node:child_process";

const [clientId, clientSecret] = process.argv.slice(2);
if (!clientId || !clientSecret) {
  console.error("사용법: node scripts/blogger-auth.mjs <CLIENT_ID> <CLIENT_SECRET>");
  process.exit(1);
}

const PORT = 53682;
const REDIRECT = `http://localhost:${PORT}/`;
const SCOPE = "https://www.googleapis.com/auth/blogger";

const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
  });

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT);
  const code = url.searchParams.get("code");
  if (!code) {
    res.end("no code");
    return;
  }
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end("<h2>인증 완료! 이 창을 닫고 터미널을 확인하세요.</h2>");
  server.close();

  const tok = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT,
      grant_type: "authorization_code",
    }),
  }).then((r) => r.json());

  if (!tok.refresh_token) {
    console.error("refresh_token 발급 실패:", JSON.stringify(tok, null, 2));
    process.exit(1);
  }

  console.log("\n================ GitHub Secrets 에 등록할 값 ================");
  console.log(`GOOGLE_CLIENT_ID     = ${clientId}`);
  console.log(`GOOGLE_CLIENT_SECRET = ${clientSecret}`);
  console.log(`GOOGLE_REFRESH_TOKEN = ${tok.refresh_token}`);

  const blogs = await fetch(
    "https://www.googleapis.com/blogger/v3/users/self/blogs",
    { headers: { Authorization: `Bearer ${tok.access_token}` } }
  ).then((r) => r.json());
  for (const b of blogs.items ?? []) {
    console.log(`BLOGGER_BLOG_ID      = ${b.id}   (${b.name} — ${b.url})`);
  }
  console.log("=============================================================\n");
  process.exit(0);
});

server.listen(PORT, () => {
  console.log("브라우저에서 구글 로그인 창이 열립니다...");
  console.log("안 열리면 이 주소를 직접 여세요:\n" + authUrl + "\n");
  // cmd 의 start: URL 을 따옴표로 감싸면 & 이스케이프 불필요 (^& 로 바꾸면 오히려 주소가 깨짐)
  exec(`start "" "${authUrl}"`); // Windows
});
