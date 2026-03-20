const CACHE_NAME = "attendance-cache-v2";
const URLS_TO_CACHE = [
  "/Attendance/",
  "/Attendance/index.html",
  "/Attendance/manifest.json",
  "/Attendance/icon-192.png",
  "/Attendance/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const req = event.request;
  const url = new URL(req.url);

  // No interceptar POST
  if (req.method !== "GET") {
    return;
  }

  // No interceptar otros dominios, como Google Forms
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      return cached || fetch(req);
    })
  );
});
