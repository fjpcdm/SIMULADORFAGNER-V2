const CACHE_NAME = 'simulador-onibus-v3';

// Lista de arquivos essenciais para o app rodar sem internet
const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  './script.js',
  './dados_rotas.js',
  'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css',
  'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js'
];

// Instala o Service Worker e guarda no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(assetsToCache))
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
  self.clients.claim();
});

function isAppShellRequest(url) {
  return (
    url.origin === self.location.origin &&
    (url.pathname.endsWith('/') ||
      url.pathname.endsWith('/index.html') ||
      url.pathname.endsWith('/script.js') ||
      url.pathname.endsWith('/dados_rotas.js') ||
      url.pathname.endsWith('/manifest.json'))
  );
}

// Intercepta as requisições: prioriza rede nos arquivos do app e usa cache offline ou fallback
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);

  if (isAppShellRequest(requestUrl)) {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request, { ignoreSearch: true }))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
      .then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then(networkResponse => {
          if (
            networkResponse &&
            networkResponse.ok &&
            (requestUrl.origin === self.location.origin || requestUrl.hostname.includes('unpkg.com'))
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          }
          return networkResponse;
        });
      })
  );
});
