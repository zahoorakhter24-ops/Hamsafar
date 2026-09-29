// Service worker for Hamsafar PWA Installability
const CACHE_NAME = 'hamsafar-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Let network handle requests
  return;
});
