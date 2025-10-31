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



// Mengambil elemen-elemen dari DOM
const video = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const canvas = canvasElement.getContext('2d');
const resultInput = document.getElementById('searchInput');
const statusMessage = document.getElementById('status');
let stream = null; // Variabel untuk menyimpan stream kamera

// Fungsi untuk memulai kamera
async function startCamera() {
    try {
        // Meminta akses ke kamera belakang (environment) perangkat
        const constraints = {
            video: {
                facingMode: 'environment' // 'user' untuk kamera depan
            }
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        video.setAttribute('playsinline', true); // Diperlukan untuk iOS
        video.play();

        // Memulai proses pemindaian setelah video siap
        requestAnimationFrame(tick);
    } catch (err) {
        console.error("Error mengakses kamera: ", err);
        statusMessage.textContent = "Gagal mengakses kamera. Pastikan Anda memberikan izin.";
    }
}

// Fungsi yang berjalan terus-menerus untuk memindai QR code
function tick() {
    // Jika video sudah cukup datanya untuk diproses
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        statusMessage.textContent = "Mencari QR code...";
        
        // Sesuaikan ukuran canvas dengan ukuran video
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;

        // Gambar frame saat ini dari video ke canvas
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        
        // Ambil data gambar dari canvas
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        
        // Coba deteksi QR code menggunakan library jsQR
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
        });

        // Jika QR code ditemukan
        if (code) {
            // Tampilkan hasilnya di input field
            resultInput.value = code.data;
            statusMessage.textContent = `QR Code terdeteksi!`;
            
            // Hentikan stream kamera untuk menghemat baterai
            stream.getTracks().forEach(track => track.stop());
            video.srcObject = null;
            
            // Hentikan proses pemindaian
            return; 
        } else {
             statusMessage.textContent = "Arahkan kamera ke QR code...";
        }
    }

    // Lanjutkan ke frame berikutnya
    requestAnimationFrame(tick);
}

// Mulai kamera saat halaman dimuat

startCamera();

