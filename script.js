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



const video = document.getElementById("videoPreview");
        const canvas = document.getElementById("canvasHidden");
        const canvasContext = canvas.getContext("2d");
        const searchInput = document.getElementById("searchInput");

        // Mengakses kamera belakang (environment)
        navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" } 
        }).then(function(stream) {
            video.srcObject = stream;
            video.setAttribute("playsinline", true); // Penting untuk iOS Safari
            video.play();
            requestAnimationFrame(tick);
        }).catch(function(err) {
            console.error("Gagal akses kamera: ", err);
            alert("Tidak dapat mengakses kamera. Pastikan izin diberikan dan menggunakan HTTPS.");
        });

        function tick() {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                // Menyamakan ukuran canvas dengan ukuran asli video source
                canvas.height = video.videoHeight;
                canvas.width = video.videoWidth;
                
                // Menggambar frame video ke canvas tersembunyi
                canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Mengambil data gambar dari canvas
                const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
                
                // Scan menggunakan jsQR
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });

                if (code) {
                    // Jika QR Code ditemukan
                    console.log("Found QR code", code.data);
                    
                    // Masukkan ke input text
                    searchInput.value = code.data;

                    // Opsional: Beri efek visual pada kotak (border hijau)
                    document.querySelector('.scanner-container').style.borderColor = "#4CAF50";
                    
                    // Hentikan scan sejenak agar tidak spamming (opsional)
                    // return; 
                } else {
                    // Kembalikan warna border jika tidak ada QR
                    document.querySelector('.scanner-container').style.borderColor = "#333";
                }
            }
            // Ulangi loop
            requestAnimationFrame(tick);
            }