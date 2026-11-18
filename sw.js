const CACHE_NAME = 'simulador-onibus-v2';

// Lista de arquivos essenciais para o app rodar sem internet
const assetsToCache = [
  './',
  './index.html',
  './script.js',
  './dados_rotas.js',
  'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css',
  'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js'
];

// Instala o Service Worker e guarda no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(assetsToCache);
      })
  );
  self.skipWaiting();
});

// Ativa e limpa versões antigas do cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.claim();
});

// Intercepta as requisições: serve do cache se estiver offline, senão busca na rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
