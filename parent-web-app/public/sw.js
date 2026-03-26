/// <reference lib="webworker" />

const CACHE_NAME = 'parent-alerts-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first, then cache fallback
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // Try network first
        const response = await fetch(event.request);
        
        // Cache successful responses
        if (response && response.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, response.clone());
        }
        
        return response;
      } catch (error) {
        // Network failed, try cache
        const cached = await caches.match(event.request);
        
        if (cached) {
          return cached;
        }

        // Cache miss and no network - return offline page
        return new Response(
          'Offline - Application is not available without internet connection',
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain',
            }),
          }
        );
      }
    })()
  );
});

// Handle message events for cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
