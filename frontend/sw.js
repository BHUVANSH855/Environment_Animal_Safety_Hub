const CACHE_NAME = 'ecolife-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/global/variables.css',
  '/css/components/navbar.css',
  '/css/components/card.css',
  '/css/components/footer.css',
  '/css/components/reportForm.css',
  '/css/components/quiz.css',
  '/css/components/hero.css',
  '/css/components/sections.css',
  '/css/components/scrollBar.css',
  '/css/components/modal.css',
  '/css/global/accessibility.css',
  '/css/pages/home.css',
  '/js/main.js',
  '/js/global/main.js',
  '/js/pages/home.js',
  '/js/components/component-loader.js',
  '/js/components/navbar-loader.js',
  '/js/components/footer-loader.js',
  '/js/components/card.js',
  '/js/components/modal.js',
  '/js/components/loadComponents.js',
  '/assets/images/others/Logo.png',
  '/assets/images/others/envirnoment-logo.png',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});