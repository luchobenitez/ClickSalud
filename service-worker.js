// @ts-check
// MIME: application/javascript
// Click-Salud Service Worker - Versión estable y segura para GitHub Pages

const CACHE_NAME = 'click-salud-cache-v3';
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
      .then(cache => {
        console.log('[ServiceWorker] Cache abierto correctamente.');
        return cache.addAll(urlsToCache);
      })
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
    caches.keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log(`[ServiceWorker] Eliminando caché antigua: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

/* ==========================================================================
   INTERCEPTAR PETICIONES (FETCH)
   ========================================================================== */
self.addEventListener('fetch', event => {
  const request = event.request;

  // ⚠️ Ignorar esquemas no válidos (chrome-extension:, data:, file:, etc.)
  if (!request.url.startsWith('http')) {
    return;
  }

  // ⚠️ Evitar cachear el propio service worker
  if (request.url.includes('service-worker.js')) return;

  event.respondWith(
    caches.match(request)
      .then(response => {
        // ✅ Devuelve desde caché si existe
        if (response) return response;

        // 🚀 Si no está cacheado, intenta obtener de la red
        return fetch(request)
          .then(networkResponse => {
            // ⚠️ Cachear solo respuestas válidas y del mismo origen
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Guardar copia en caché
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(request, responseToCache))
              .catch(err => console.warn('[ServiceWorker] Error al guardar en caché:', err));

            return networkResponse;
          })
          .catch(err => {
            console.warn(`[ServiceWorker] Falló la red para ${request.url}:`, err);
            // TODO: Podrías devolver aquí una página "offline.html" si la tienes cacheada
          });
      })
      .catch(err => console.error('[ServiceWorker] Error general en fetch:', err))
  );
});
