const video = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const canvas = canvasElement.getContext('2d');
const outputMessage = document.getElementById('output-message');
const outputResult = document.getElementById('qr-result');

// Fungsi untuk memulai kamera
function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
            video.srcObject = stream;
            video.setAttribute('playsinline', true); // Diperlukan untuk iOS
            video.play();
            requestAnimationFrame(tick);
        })
        .catch((err) => {
            outputMessage.innerText = `Gagal mengakses kamera: ${err.name}`;
            console.error("Kesalahan akses kamera: ", err);
        });
}

// Fungsi utama untuk memproses setiap frame video
function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        outputMessage.innerText = "Memindai QR Code...";
        outputResult.value = "";
        
        // Atur ukuran canvas sesuai dengan video
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;

        // Gambar frame video ke canvas
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        
        // Ambil data gambar dari canvas
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        
        // Gunakan jsQR untuk mendeteksi QR code
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            // Options bisa ditambahkan di sini
        });

        if (code) {
            // QR Code ditemukan
            outputResult.value = code.data;
            outputMessage.innerText = "QR Code Ditemukan!";

            // Hentikan pemindaian setelah berhasil
            stopCamera(); 
            return; // Penting agar tidak lanjut memanggil requestAnimationFrame
        }
    }
    
    // Ulangi pemindaian pada frame berikutnya
    requestAnimationFrame(tick);
}

// Fungsi untuk menghentikan stream kamera
function stopCamera() {
    if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
        outputMessage.innerText = "Pemindaian Selesai.";
    }
}

// Mulai kamera saat halaman dimuat
window.addEventListener('load', startCamera);
