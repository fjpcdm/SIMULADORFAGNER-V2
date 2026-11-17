const CACHE_NAME = 'simulador-onibus-v1';

// Todos os arquivos essenciais que o app precisa para funcionar offline
const assetsToCache = [
  './',
  './index.html',
  './script.js',
  './dados_rotas.js',
  'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css',
  'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js'
];

// Instalação do Service Worker e salvamento no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Arquivos em cache salvos com sucesso');
        return cache.addAll(assetsToCache);
      })
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches antigos se houver atualização
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

// Intercepta as requisições para carregar do cache quando estiver offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna do cache se encontrar, senão busca na rede
        return response || fetch(event.request);
      }).catch(() => {
        // Caso queira retornar uma página de fallback offline futuramente, pode tratar aqui
      })
  );
});
