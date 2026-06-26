// 한별시스템 상담·AS 폼 → 슬랙 알림
// 정적 사이트라 서버가 없어 Supabase Edge Function `contact-to-slack` 으로 중계한다.
// 실제 슬랙 Webhook URL 은 함수(서버)에만 존재하며 여기엔 노출되지 않는다.

export const CONTACT_ENDPOINT =
  "https://jrzesjgyrvgvwazfajec.supabase.co/functions/v1/contact-to-slack";

export type ContactField = { label: string; value: string };

/** 폼 내용을 슬랙으로 전송. 성공 시 true. */
export async function sendContact(type: string, fields: ContactField[]): Promise<boolean> {
  try {
    const res = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, fields }),
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    return res.ok && data?.ok === true;
  } catch {
    return false;
  }
}
