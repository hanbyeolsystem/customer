// 한별시스템 고객센터 - 서비스워커
// 1) PWA 설치 가능 조건용 fetch 핸들러(오프라인 캐시는 하지 않는다)
// 2) 웹 푸시: 알림 표시 + 누르면 링크로 이동 (발송은 종합관리툴 > 웹푸시 알림, 함수 web-push)
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {
  // pass-through: 기본 네트워크 동작에 맡긴다.
});

self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { body: e.data && e.data.text() }; }
  e.waitUntil(
    self.registration.showNotification(d.title || "한별시스템", {
      body: d.body || "",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: d.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "/", self.location.origin).href;
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      const same = list.find((c) => c.url === url);
      return same ? same.focus() : self.clients.openWindow(url);
    })
  );
});
