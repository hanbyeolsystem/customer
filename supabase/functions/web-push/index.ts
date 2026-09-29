import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import webpush from "npm:web-push@3.6.7";

// 한별시스템.kr 웹 푸시 (Supabase Edge Function, 외부 유료 서비스 없음)
//
// 배포: project jrzesjgyrvgvwazfajec, --no-verify-jwt (구독은 공개 사이트에서 들어온다)
//   npx -y supabase@latest functions deploy web-push --project-ref jrzesjgyrvgvwazfajec --use-api --no-verify-jwt
// 키:   supabase/functions/web-push/.env (git 제외) → npx -y supabase@latest secrets set --env-file ... --project-ref ...
// 표:   webpush_subscriptions(endpoint UNIQUE) · webpush_sends(발송 기록). RLS 켜고 정책 없음 = service_role 만.
//
//   GET  /web-push/key        공개키 (사이트가 구독할 때 받아 간다)
//   POST /web-push/subscribe  { subscription }            공개, endpoint 가 같으면 덮어써서 중복 없음
//   GET  /web-push/stats      관리자: 수신 기기 수 + 최근 발송 10건
//   POST /web-push/send       관리자: { title, body, url } 전체 발송, 404·410 구독은 삭제
// 관리자 = 종합관리툴 로그인 토큰(Bearer)의 rental_user_profiles.role 이 admin.
// 관리 화면: 한별시스템\임대관리\web-push\index.html

const SB_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY") ?? "";
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY") ?? "";
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") ?? "https://xn--bm3bm1i1e348cgwe.kr/";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

// 브라우저 푸시 서비스만 받는다. 아무 주소나 받으면 발송 때 이 함수가 남의 서버로 요청을 쏘게 된다.
// 크롬·엣지(구)·삼성·웨일=FCM, 파이어폭스=mozilla, 엣지=WNS, 사파리/아이폰=apple.
const PUSH_HOSTS = ["fcm.googleapis.com", "push.services.mozilla.com", "notify.windows.com", "push.apple.com"];

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

async function rest(method: string, path: string, body?: unknown, extra: Record<string, string> = {}) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
    method,
    headers: { apikey: SERVICE_KEY, authorization: `Bearer ${SERVICE_KEY}`, "content-type": "application/json", ...extra },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`DB ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}

/** 종합관리툴 관리자면 이름, 아니면 null */
async function adminName(req: Request): Promise<string | null> {
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const u = await fetch(`${SB_URL}/auth/v1/user`, { headers: { apikey: SERVICE_KEY, authorization: `Bearer ${token}` } });
  if (!u.ok) return null;
  const user = await u.json();
  if (!user?.id) return null;
  const rows = await rest("GET", `rental_user_profiles?user_id=eq.${user.id}&select=role,active,full_name,display_id`);
  const p = rows?.[0];
  if (!p || p.role !== "admin" || p.active === false) return null;
  return p.full_name || p.display_id || "관리자";
}

function validSubscription(s: unknown): { endpoint: string; p256dh: string; auth: string } | null {
  const sub = s as { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } } | null;
  const endpoint = String(sub?.endpoint ?? "");
  const p256dh = String(sub?.keys?.p256dh ?? "");
  const auth = String(sub?.keys?.auth ?? "");
  if (endpoint.length > 1000 || !/^[A-Za-z0-9_=-]{80,100}$/.test(p256dh) || !/^[A-Za-z0-9_=-]{16,32}$/.test(auth)) return null;
  let url: URL;
  try { url = new URL(endpoint); } catch { return null; }
  if (url.protocol !== "https:") return null;
  if (!PUSH_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith("." + h))) return null;
  return { endpoint, p256dh, auth };
}

async function subscribe(req: Request) {
  const payload = await req.json().catch(() => null);
  const sub = validSubscription(payload?.subscription);
  if (!sub) return json({ ok: false, error: "bad_subscription" }, 400);
  await rest("POST", "webpush_subscriptions?on_conflict=endpoint", {
    ...sub,
    user_agent: (req.headers.get("user-agent") ?? "").slice(0, 300),
    last_seen_at: new Date().toISOString(),
  }, { Prefer: "resolution=merge-duplicates,return=minimal" });
  return json({ ok: true });
}

async function stats() {
  const r = await fetch(`${SB_URL}/rest/v1/webpush_subscriptions?select=id&limit=1`, {
    headers: { apikey: SERVICE_KEY, authorization: `Bearer ${SERVICE_KEY}`, Prefer: "count=exact" },
  });
  const count = Number((r.headers.get("content-range") ?? "").split("/")[1] ?? 0) || 0;
  const sends = await rest("GET", "webpush_sends?select=*&order=created_at.desc&limit=10");
  return json({ ok: true, count, sends });
}

async function send(req: Request, by: string) {
  const p = await req.json().catch(() => null);
  const title = String(p?.title ?? "").trim().slice(0, 60);
  const body = String(p?.body ?? "").trim().slice(0, 300);
  const url = String(p?.url ?? "").trim().slice(0, 500) || "https://xn--bm3bm1i1e348cgwe.kr/";
  if (!title) return json({ ok: false, error: "제목을 입력하세요." }, 400);
  if (!/^https:\/\//i.test(url)) return json({ ok: false, error: "링크는 https:// 로 시작해야 합니다." }, 400);

  const subs: { id: number; endpoint: string; p256dh: string; auth: string }[] =
    await rest("GET", "webpush_subscriptions?select=id,endpoint,p256dh,auth&limit=10000");
  const message = JSON.stringify({ title, body, url });
  let sent = 0, failed = 0;
  const gone: number[] = [];
  const errors: string[] = [];

  // ponytail: 50개씩 차례로 보낸다. 구독이 수만 단위가 되면 큐(pg_cron 분할)로 옮길 것.
  for (let i = 0; i < subs.length; i += 50) {
    await Promise.all(subs.slice(i, i + 50).map(async (s) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, message, { TTL: 86400 });
        sent++;
      } catch (e) {
        const code = (e as { statusCode?: number }).statusCode;
        if (code === 404 || code === 410) gone.push(s.id); // 구독 해지·만료
        else { failed++; if (errors.length < 5) errors.push(`${code ?? ""} ${String((e as Error).message ?? e).slice(0, 120)}`); }
      }
    }));
  }
  if (gone.length) await rest("DELETE", `webpush_subscriptions?id=in.(${gone.join(",")})`);
  const result = { title, body, url, total: subs.length, sent, failed, removed: gone.length, sent_by: by };
  await rest("POST", "webpush_sends", result, { Prefer: "return=minimal" });
  return json({ ok: true, ...result, errors });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const route = new URL(req.url).pathname.replace(/^.*\/web-push/, "") || "/";
  try {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return json({ ok: false, error: "vapid_not_configured" }, 500);
    if (req.method === "GET" && route === "/key") return json({ ok: true, publicKey: VAPID_PUBLIC_KEY });
    if (req.method === "POST" && route === "/subscribe") return await subscribe(req);
    if (route === "/stats" || route === "/send") {
      const by = await adminName(req);
      if (!by) return json({ ok: false, error: "관리자 로그인이 필요합니다." }, 401);
      return req.method === "POST" && route === "/send" ? await send(req, by) : await stats();
    }
    return json({ ok: false, error: "not_found" }, 404);
  } catch (e) {
    return json({ ok: false, error: String((e as Error).message ?? e).slice(0, 300) }, 500);
  }
});
