# Bengkel Mobil Pro - Website Responsif

Website bengkel mobil yang responsif dengan fitur booking layanan reguler, panggilan montir darurat, dan integrasi WhatsApp & Google Sheets.

## 🚗 Fitur Utama

### ✅ **Layanan Montir Panggilan Darurat**
- Form panggilan darurat dengan validasi
- Integrasi langsung ke WhatsApp
- Data tersimpan otomatis di Google Sheets
- Respon cepat 24/7

### ✅ **Booking Layanan Reguler**
- 6 jenis layanan lengkap dengan harga
- Form booking dengan validasi tanggal
- Konfirmasi via WhatsApp
- Manajemen data di Google Sheets

### ✅ **Informasi Layanan & Harga**
- Ganti Oli Mesin - Rp 150.000
- Servis Rutin - Rp 200.000
- Tune Up - Rp 350.000
- Service AC Mobil - Rp 250.000
- Ban & Velg - Rp 100.000
- Service Rem - Rp 180.000

### ✅ **Integrasi Terintegrasi**
- **WhatsApp**: Pesan otomatis dengan data lengkap
- **Google Sheets**: Database sederhana untuk semua form
- **Responsive Design**: Desktop, tablet, dan mobile

## 📁 Struktur File

```
car-workshop-website/
├── index.html                 # Halaman utama
├── css/
│   └── style.css             # Styling lengkap dengan responsive design
├── js/
│   └── script.js             # JavaScript untuk form handling & integrasi
├── images/
│   ├── background.jpeg       # Background hero section
│   ├── service_icon.png      # Icon layanan
│   └── emergency_icon.png    # Icon emergency
├── google-apps-script.js     # Kode untuk Google Apps Script
├── GOOGLE_SETUP.md          # Panduan setup Google Sheets & Apps Script
└── README.md                # Dokumentasi lengkap
```

## 🚀 Cara Setup

### 1. Setup Google Sheets & Apps Script

Ikuti panduan lengkap di file `GOOGLE_SETUP.md` untuk:
- Membuat Google Sheet
- Deploy Google Apps Script
- Konfigurasi integrasi

### 2. Konfigurasi Website

Edit file `js/script.js` dan update:

```javascript
const CONFIG = {
    // Ganti dengan URL Google Apps Script Anda
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    
    // Ganti dengan nomor WhatsApp bengkel (format: 62812xxxxxxx)
    WHATSAPP_NUMBER: '6281234567890'
};
```

### 3. Jalankan Website

1. Extract semua file ke folder web server
2. Buka `index.html` di browser
3. Test semua fitur (emergency call, booking, WhatsApp)

## 📱 Fitur Responsive

Website ini telah dioptimalkan untuk:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🔧 Teknologi yang Digunakan

- **HTML5**: Struktur semantik
- **CSS3**: Flexbox, Grid, Animations
- **JavaScript ES6**: Form handling, API calls
- **Google Apps Script**: Backend serverless
- **Google Sheets**: Database sederhana
- **WhatsApp API**: Integrasi pesan

## 📋 Validasi Form

### Emergency Call Form:
- Nama lengkap (required)
- Nomor telepon (required)
- Lokasi saat ini (required)
- Masalah kendaraan (required)
- Deskripsi detail (optional)

### Booking Form:
- Nama lengkap (required)
- Nomor telepon (required)
- Email (optional)
- Tanggal servis (required, minimal H+1)
- Waktu servis (required)
- Jenis layanan (required)
- Informasi kendaraan (required)
- Catatan tambahan (optional)

## 🎨 Tema & Desain

- **Warna Utama**: Orange (#ff6b35)
- **Warna Sekunder**: Navy (#1a1a2e)
- **Font**: Orbitron (headings) + Roboto (body)
- **Style**: Modern, clean, professional
- **Animasi**: Smooth transitions, hover effects

## 📞 Contoh Pesan WhatsApp

### Emergency Call:
```
🚨 PANGGILAN DARURAT 🚨

Halo Bengkel Pro, saya butuh bantuan montir segera!

👤 Nama: John Doe
📞 Telepon: 0812-3456-7890
📍 Lokasi: Jl. Sudirman No. 123
⚠️ Masalah: Mobil tidak bisa hidup
📝 Detail: Aki sepertinya soak

Mohon segera kirim montir ke lokasi saya. Terima kasih!
```

### Booking Confirmation:
```
📅 KONFIRMASI BOOKING

Halo Bengkel Pro, saya ingin konfirmasi booking:

👤 Nama: John Doe
📞 Telepon: 0812-3456-7890
📧 Email: john@example.com
📅 Tanggal: Senin, 19 Juni 2025
⏰ Waktu: 08:00 - 10:00
🔧 Layanan: Ganti Oli Mesin
🚗 Kendaraan: Toyota Avanza 2018
📝 Catatan: Tidak ada catatan khusus

Mohon konfirmasi ketersediaan jadwal. Terima kasih!
```

## 🔒 Keamanan & Privacy

- Data form dienkripsi saat dikirim ke Google Sheets
- Tidak ada data sensitif disimpan di browser
- WhatsApp integration menggunakan URL scheme (aman)
- Google Apps Script berjalan di environment Google yang secure

## 🐛 Troubleshooting

### Form tidak submit:
1. Cek koneksi internet
2. Pastikan Google Apps Script URL benar
3. Cek console browser untuk error

### WhatsApp tidak terbuka:
1. Pastikan WhatsApp terinstall
2. Cek nomor WhatsApp format benar
3. Test di browser mobile

### Data tidak masuk Google Sheets:
1. Cek permission Google Apps Script
2. Pastikan Sheet ID benar
3. Cek execution log di Apps Script

## 📈 Pengembangan Selanjutnya

Fitur yang bisa ditambahkan:
- Payment gateway integration
- Real-time chat support
- Tracking status servis
- Rating & review system
- Push notifications
- Admin dashboard

## 📄 Lisensi

Project ini dibuat untuk keperluan edukasi dan komersial. Silakan dimodifikasi sesuai kebutuhan.

## 👨‍💻 Support

Untuk pertanyaan atau bantuan setup, hubungi:
- Email: support@bengkelpro.com
- WhatsApp: +62 812-3456-7890

---

**© 2024 Bengkel Pro. Semua hak dilindungi.**

