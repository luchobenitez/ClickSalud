// @ts-check
// MIME: application/javascript
// Click-Salud Service Worker - Versión optimizada para GitHub Pages

const CACHE_NAME = 'click-salud-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/styles.css',
  './assets/js/app.js',
  './assets/js/medicos.js',
  './assets/js/tailwind.js',
  './assets/js/theme.js',
  './assets/img/clicksaludLogo.png',
  'https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  './assets/data/beneficios.json',
  './assets/data/centros.json',
  './assets/data/faqs.json',
  './assets/data/medicos.json',
  './assets/data/recordatorios.json',
  './assets/data/resultados.json'
];

/* ==========================================================================
   INSTALACIÓN
   ========================================================================== */
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Instalando y cacheando recursos...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
      .catch(err => console.error('[ServiceWorker] Error al cachear:', err))
  );
});

/* ==========================================================================
   ACTIVACIÓN
   ========================================================================== */
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activando y limpiando versiones antiguas...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log(`[ServiceWorker] Eliminando caché antigua: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

/* ==========================================================================
   INTERCEPTAR PETICIONES (FETCH)
   ========================================================================== */
self.addEventListener('fetch', event => {
  // Evitar cachear llamadas al propio SW o peticiones externas que fallen CORS
  if (event.request.url.includes('service-worker.js')) return;

  event.respondWith(
    caches.match(event.request).then(response => {
      // Retorna desde caché si existe
      if (response) return response;

      // Si no está cacheado, intenta buscarlo en la red
      return fetch(event.request)
        .then(networkResponse => {
          // Cachear dinámicamente solo si es una respuesta válida (status 200)
          if (!networkResponse || networkResponse.status !== 200) return networkResponse;

          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          return networkResponse;
        })
        .catch(err => {
          console.warn('[ServiceWorker] Falló la red:', err);
          // Aquí podrías devolver una página offline personalizada si quisieras
        });
    })
  );
});
