import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// 한별시스템 홈페이지 상담/AS 폼 → 슬랙 알림 중계 (Supabase Edge Function)
//
// 배포: project jrzesjgyrvgvwazfajec, verify_jwt:false (공개 폼 엔드포인트)
// 슬랙 Webhook URL 은 서버에만 존재해야 한다(공개 repo 노출 금지).
//   - 권장: Supabase 함수 시크릿  SLACK_WEBHOOK_URL  설정
//   - 현재 배포본은 함수 코드 내부(서버)에 URL 을 직접 내장(인라인)해 둠 — 이 기록본에는 넣지 않는다.
// 호출: src/lib/contact.ts → POST { type, fields:[{label,value}] }

const SLACK_WEBHOOK_URL = Deno.env.get("SLACK_WEBHOOK_URL") ?? "";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

function clip(v: unknown, n: number) {
  return String(v ?? "").slice(0, n);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);
  if (!SLACK_WEBHOOK_URL) return json({ ok: false, error: "webhook_not_configured" }, 500);

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "bad_json" }, 400);
  }

  const type = clip(payload?.type, 40) || "문의";
  const fieldsIn = Array.isArray(payload?.fields) ? (payload.fields as unknown[]) : [];
  const fields = fieldsIn
    .map((f) => f as { label?: unknown; value?: unknown })
    .filter((f) => f && String(f.value ?? "").trim() !== "")
    .map((f) => ({ label: clip(f.label, 30), value: clip(f.value, 1500) }));

  if (fields.length === 0) return json({ ok: false, error: "no_fields" }, 400);

  const lines = fields.map((f) => `*${f.label}*\n${f.value}`).join("\n\n");
  const now = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  const text = `:bell: 새 ${type} 신청 — 한별시스템 홈페이지`;

  const blocks = [
    { type: "header", text: { type: "plain_text", text: `🔔 새 ${type} 신청`, emoji: true } },
    { type: "section", text: { type: "mrkdwn", text: lines } },
    { type: "context", elements: [{ type: "mrkdwn", text: `한별시스템 홈페이지 · ${now}` }] },
  ];

  let res: Response;
  try {
    res = await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, blocks }),
    });
  } catch (e) {
    return json({ ok: false, error: "slack_unreachable", detail: String(e) }, 502);
  }

  if (!res.ok) return json({ ok: false, error: "slack_error", status: res.status }, 502);
  return json({ ok: true });
});
