// 한별시스템 고객센터 — 최소 서비스워커 (PWA 설치 가능 조건 충족용)
// 오프라인 캐시는 하지 않고, 설치 가능성 판정에 필요한 fetch 핸들러만 둔다.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {
  // pass-through: 기본 네트워크 동작에 맡긴다.
});
