const BUILD_VERSION = "2026.08.18.01";
const CACHE_NAME = "ncu-ai-workshop-" + BUILD_VERSION;

// 精簡核心預載清單：僅快取極輕量的關鍵 HTML、CSS、JS 與小圖示（排除 4MB+ 的 OG 大圖）
const PRECACHE = [
  "./",
  "./index.html",
  "./version.json",
  "./pwa-register.js?v=" + BUILD_VERSION,
  "./assets/favicon.svg",
  "./assets/favicon-32x32.png",
  "./assets/apple-touch-icon.png",
  "./assets/favicon-morning.svg",
  "./assets/favicon-morning-32x32.png",
  "./assets/favicon-afternoon.svg",
  "./assets/favicon-afternoon-32x32.png",
  "./assets/deck.css",
  "./q.html",
  "./08_HTML簡報/index.html",
  "./08_HTML簡報/morning.html",
  "./08_HTML簡報/afternoon.html",
  "./08_HTML簡報/assets/deck.css",
  "./08_HTML簡報/assets/deck.js?v=" + BUILD_VERSION
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(PRECACHE.map((url) => cache.add(url).catch(() => null)))
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
      .then(async () => {
        const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
        clients.forEach((client) => client.postMessage({ type: "SW_ACTIVATED", version: BUILD_VERSION }));
      })
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

/**
 * Stale-While-Revalidate (SWR) 策略：
 * 1. 若快取有內容 → 0 毫秒極速回傳（瞬開無白屏！）
 * 2. 同步在背景發出 fetch 請求，若有最新版本則默默更新快取
 * 3. 若無快取 → 等待網路回應並寫入快取
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  // 背景非同步更新快取
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse && networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => null);

  // 快取優先秒開，若無快取則等待網路回傳，最後 fallback 到 index.html
  return cachedResponse || (await fetchPromise) || (await cache.match("./index.html"));
}

/**
 * Cache-First 策略（適用於 CSS, JS, 圖片等靜態資產）
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return cached;
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // 1. 導覽頁面、HTML 檔案與首頁：使用 Stale-While-Revalidate 瞬開
  if (request.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname.endsWith("/")) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // 2. version.json：直接走網路不進快取，確保版本檢測即時
  if (url.pathname.endsWith("version.json")) {
    event.respondWith(fetch(request));
    return;
  }

  // 3. 其他靜態資源：Cache-First
  event.respondWith(cacheFirst(request));
});
