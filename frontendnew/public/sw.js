/// <reference lib="webworker" />

const CACHE_NAME = 'edguard-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // If some assets fail, continue anyway
        console.warn('Some assets failed to cache');
      });
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

// Fetch event - Network first for API, Cache first for assets
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const { pathname } = new URL(event.request.url);

  // API calls - network first
  if (pathname.includes('/api/') || pathname.match(/localhost:500\d/)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(event.request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Return cached API response if available
          return caches.match(event.request);
        })
    );
  } else {
    // Static assets - cache first
    event.respondWith(
      caches
        .match(event.request)
        .then((cached) => {
          if (cached) {
            return cached;
          }

          return fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              const cache = caches.open(CACHE_NAME);
              cache.then((c) => c.put(event.request, response.clone()));
            }
            return response;
          });
        })
        .catch(() => {
          // Offline fallback
          return new Response(
            'Offline - Some content may not be available. Please check your internet connection.',
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain',
              }),
            }
          );
        })
    );
  }
});

// Handle message events for cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
