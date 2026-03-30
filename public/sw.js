const VERSION = '1.0.2';

// Install Event: Force the service worker to activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate Event: Clear ANY existing caches from previous versions to prevent being stuck on an old UI
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: We must listen to 'fetch' to satisfy Chrome's PWA install criteria.
// By doing nothing, we allow the request to bypass the service worker and use the Native Browser Network.
// This prevents Next.js API POST requests (like our /api/proxy downloader) from failing or dropping streams!
self.addEventListener('fetch', (event) => {
  return; 
});
