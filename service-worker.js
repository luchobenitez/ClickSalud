// @ts-check
// MIME: application/javascript

const CACHE_NAME = 'click-salud-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/styles.css',
  '/assets/js/app.js',
  '/assets/img/clicksaludLogo.png',
  'https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  '/assets/data/medicos.json',
  '/assets/data/faqs.json'
];

// Evento de instalación: se abre el caché y se añaden los archivos base.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento fetch: intercepta las peticiones y responde desde el caché si es posible.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el recurso está en el caché, lo devuelve.
        if (response) {
          return response;
        }
        // Si no, lo busca en la red.
        return fetch(event.request);
      }
    )
  );
});

// Evento de activación: limpia cachés antiguos.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log('Service Worker registrado correctamente'))
    .catch(err => console.error('Error al registrar el Service Worker:', err));
}
