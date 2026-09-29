// 웹 푸시 구독. 서버가 없는 정적 사이트라 Supabase Edge Function `web-push` 가 구독을 저장하고 보낸다.
// 공개키는 함수에서 받는다(키를 한 곳에만 둔다). 발송 화면은 종합관리툴 > 웹푸시 알림.

export const PUSH_ENDPOINT = "https://jrzesjgyrvgvwazfajec.supabase.co/functions/v1/web-push";

export function pushSupported(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

function keyBytes(b64url: string): Uint8Array<ArrayBuffer> {
  const b64 = (b64url + "=".repeat((4 - (b64url.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

async function save(sub: PushSubscription): Promise<boolean> {
  const res = await fetch(`${PUSH_ENDPOINT}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscription: sub.toJSON() }),
  });
  return res.ok;
}

/** 이 기기를 구독시키고 서버에 저장. 권한 창은 호출한 쪽의 클릭에서 뜬다. */
export async function subscribePush(): Promise<boolean> {
  if ((await Notification.requestPermission()) !== "granted") return false;
  const reg = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    const { publicKey } = await (await fetch(`${PUSH_ENDPOINT}/key`)).json();
    sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(publicKey) });
  }
  return save(sub);
}

/** 이미 허용한 기기는 들를 때마다 구독을 다시 알린다(저장이 한 번 실패했거나 브라우저가 구독을 바꾼 경우). */
export async function resyncPush(): Promise<void> {
  const reg = await navigator.serviceWorker.getRegistration("/");
  const sub = await reg?.pushManager.getSubscription();
  if (sub) await save(sub);
}
