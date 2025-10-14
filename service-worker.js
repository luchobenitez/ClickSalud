// @ts-check
// MIME: application/javascript
// Click-Salud Service Worker - Versión estable y segura para GitHub Pages

const CACHE_NAME = 'click-salud-cache-v3';
const urlsToCache = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './assets/css/styles.css',
  './assets/js/app.js',
  './assets/js/centros.js',
  './assets/js/configuracion.js',
  './assets/js/directorio.js',
  './assets/js/farmacia.js',
  './assets/js/header.js',
  './assets/js/historia-clinica.js',
  './assets/js/medicos.js',
  './assets/js/perfil.js',
  './assets/js/recordatorios.js',
  './assets/js/resultados.js',
  './assets/js/theme.js',
  './assets/img/clicksaludLogo.png',
  'https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  './assets/data/beneficios.json',
  './assets/data/centros.json',
  './assets/data/faqs.json',
  './assets/data/farmacia.json',
  './assets/data/historia-clinica.json',
  './assets/data/medicos.json',
  './assets/data/recordatorios.json',
  './assets/data/resultados.json'
];

/* ==========================================================================
   INSTALACIÓN (segura)
   ========================================================================== */
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Instalando y cacheando recursos...');

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('[ServiceWorker] Cache abierto correctamente.');

      // Intentar agregar cada recurso de forma individual
      for (const url of urlsToCache) {
        try {
          const response = await fetch(url, { mode: 'no-cors' });
          if (response.ok || response.type === 'opaque') {
            await cache.put(url, response);
            console.log(`✅ Cacheado: ${url}`);
          } else {
            console.warn(`⚠️ No se pudo cachear (status ${response.status}): ${url}`);
          }
        } catch (err) {
          console.warn(`⚠️ Error al cachear ${url}:`, err);
        }
      }

      self.skipWaiting();
    })()
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
   INTERCEPTAR PETICIONES (FETCH) CON FALLBACK OFFLINE
   ========================================================================== */
self.addEventListener('fetch', event => {
  const request = event.request;

  // Ignorar esquemas no válidos (chrome-extension:, data:, file:, etc.)
  if (!request.url.startsWith('http')) return;

  // Evitar interceptar el propio SW
  if (request.url.includes('service-worker.js')) return;
  if (request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(request).then(response => {
      if (response) return response; // Devuelve desde caché si existe

      return fetch(request)
        .then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, responseToCache))
            .catch(err => console.warn('[ServiceWorker] Error al guardar en caché:', err));

          return networkResponse;
        })
        .catch(async err => {
          console.warn(`[ServiceWorker] Falló la red para ${request.url}:`, err);
          // Mostrar página offline si la red falla y no hay caché
          const cache = await caches.open(CACHE_NAME);
          const offlinePage = await cache.match('./offline.html');
          return offlinePage || new Response('<h1>Offline</h1>', { headers: { 'Content-Type': 'text/html' } });
        });
    })
  );
});
