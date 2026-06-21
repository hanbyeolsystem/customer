// 한별고객센터 챗봇 설정
// anon 키는 공개 키(클라이언트 노출 정상) — RLS/verify_jwt 용 식별자일 뿐 비밀이 아니다.
// 실제 비밀(ANTHROPIC_API_KEY)은 Edge Function 서버에만 존재한다.

export const CHAT_ENDPOINT =
  "https://jrzesjgyrvgvwazfajec.supabase.co/functions/v1/customer-chat";

export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyemVzamd5cnZndndhemZhamVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MjgwMTksImV4cCI6MjA5MzMwNDAxOX0.6FAb0CUMuYVqsvWmUR8Bbvmph4MJjlQqSDi_Mkza1c0";

export type ChatMessage = { role: "user" | "assistant"; content: string };
