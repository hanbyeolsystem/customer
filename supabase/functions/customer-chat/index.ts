// 한별고객센터 AI 상담 챗봇 — Supabase Edge Function (asms-pacai 프로젝트)
// 정적 사이트(Next export)는 서버가 없으므로, 이 함수가 ANTHROPIC_API_KEY 를 숨긴 채
// Claude API 를 중계한다. 한별광고 hanbyul-autopost-ai 와 같은 프로젝트의 같은 시크릿을 재사용.
//
// 라우팅: POST /functions/v1/customer-chat
//   body: { messages: [{ role: "user"|"assistant", content: string }], context?: object }
//   resp: { reply: string }  |  { error: string }

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MODEL = "claude-haiku-4-5-20251001"; // 저비용. 품질 더 원하면 claude-sonnet-4-6 로 교체
const MAX_TOKENS = 800;
const MAX_HISTORY = 12;     // 최근 메시지 N개만 모델에 전달
const MAX_CHARS = 2000;     // 메시지 1건 길이 상한

const SYSTEM_PROMPT = `당신은 "별이", 한별시스템 고객센터의 친절한 AI 상담원입니다. 항상 한국어 존댓말로, 따뜻하고 간결하게(보통 2~4문장) 답합니다.

[회사 소개]
- 한별시스템 (HANBYEOL SYSTEM) — 대구·경북 기업의 IT 파트너, 운영 19년+
- 주력: NAS 구축(Synology 공식 대리점) · 데이터 백업/랜섬웨어 대응 · 복사기/프린터 임대 · 기업 IT 유지관리
- 위치: 대구광역시 달서구 문화회관11안길 22-7 1층 / 대표 김상환
- 전화: 053-588-7119 (대표) · 010-4585-6890 (휴대폰) · 평일 09:00~18:00
- 이메일: acapaper78@gmail.com

[사이트 길안내 — 아래 경로를 링크로 안내하세요]
- 드라이버 다운로드 → /support/drivers
- 원격지원 → /support/remote
- A/S 접수 → /support/as
- 견적 요청 → /support/quote
- 소모품(토너 등) 신청 → /support/supplies
- NAS 솔루션/기술지원 → /nas
- 복사기·프린터 임대 → /rental, 임대 쇼핑몰 → /shop
- 구축 사례 → /cases, 회사 소개 → /about
- 프린터 에러코드 의미 검색 → https://hanbyeolsystem.github.io/hanbyeol-errorcode/
- 한별 블로그(최신 소식) → https://blog.naver.com/hanbyeolsystem

[링크 작성 규칙 — 매우 중요]
- 페이지를 안내할 때는 절대 경로(예: /support/supplies)를 글자로 노출하지 마세요.
- 반드시 마크다운 링크 형식 [클릭 라벨](경로) 으로만 작성하세요. 라벨은 행동을 담은 자연스러운 한국어로.
  예) [토너·소모품 신청하러 가기](/support/supplies)
  예) [에러코드 검색하기](https://hanbyeolsystem.github.io/hanbyeol-errorcode/)
- 전화번호는 [053-588-7119로 전화하기](tel:053-588-7119) 형식으로 링크화해도 좋습니다.
- 한 답변에 링크는 1~2개로 핵심만. 안내 문장 끝에 자연스럽게 붙이세요.

[행동 규칙]
1. 모르는 것은 지어내지 마세요. 특히 구체적인 임대 가격, 드라이버 버전/파일, 특정 에러코드의 정확한 의미는 확정해 말하지 말고 위의 해당 페이지 링크나 전화 상담으로 안내하세요.
2. 견적·계약·방문 일정처럼 사람이 처리할 일은 전화 또는 [견적 요청하기](/support/quote) 링크로 연결하세요.
3. 한별시스템·IT 인프라와 무관한 질문에는 정중히 본업(IT/임대/NAS 상담)으로 돌아오도록 안내하세요.
4. 답변은 짧고 실용적으로. 불필요한 인사 반복은 줄이세요.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  if (req.method !== "POST") {
    return json({ error: "POST 만 허용됩니다." }, 405);
  }

  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return json({ error: "서버 설정 오류(API 키 없음)." }, 500);

  let body: { messages?: unknown; context?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "잘못된 요청 형식입니다." }, 400);
  }

  const raw = Array.isArray(body.messages) ? body.messages : [];
  const messages = raw
    .filter(
      (m): m is { role: string; content: string } =>
        !!m && typeof m === "object" &&
        (("role" in m && (m.role === "user" || m.role === "assistant"))) &&
        "content" in m && typeof (m as { content: unknown }).content === "string"
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_HISTORY);

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return json({ error: "보낼 메시지가 없습니다." }, 400);
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("anthropic error", res.status, detail);
      return json({ error: "상담원 연결에 실패했습니다. 잠시 후 다시 시도하거나 053-588-7119 로 연락주세요." }, 502);
    }

    const data = await res.json();
    const reply = (data?.content ?? [])
      .filter((b: { type?: string }) => b?.type === "text")
      .map((b: { text?: string }) => b.text ?? "")
      .join("")
      .trim();

    return json({ reply: reply || "죄송합니다, 답변을 생성하지 못했어요. 053-588-7119 로 문의해 주세요." });
  } catch (e) {
    console.error("handler error", e);
    return json({ error: "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." }, 500);
  }
});

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}
