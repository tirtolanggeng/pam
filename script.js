// Tentukan nama cache Anda
const CACHE_NAME = 'pwa-v1';

// Daftar file yang ingin Anda cache saat instalasi
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/iconpam.png',
  '/iconpam.png'
];

// 1. Event 'install' - Menyimpan aset ke cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache dibuka');
        // Menambahkan semua file di urlsToCache ke cache
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Event 'fetch' - Menyajikan aset dari cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika file ada di cache, kembalikan dari cache
        if (response) {
          return response;
        }

        // Jika tidak, ambil dari jaringan (network)
        return fetch(event.request);
      }
    )
  );
});



