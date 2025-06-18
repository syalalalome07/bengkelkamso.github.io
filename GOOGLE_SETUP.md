# Setup Google Sheets & Apps Script

## Langkah 1: Buat Google Sheet

1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru dengan nama "Bengkel Pro - Data"
3. Catat ID spreadsheet dari URL (bagian setelah `/d/` dan sebelum `/edit`)
   - Contoh URL: `https://docs.google.com/spreadsheets/d/1ABC123xyz/edit`
   - ID: `1ABC123xyz`

## Langkah 2: Setup Google Apps Script

1. Buka [Google Apps Script](https://script.google.com)
2. Klik "New Project"
3. Ganti nama project menjadi "Bengkel Pro API"
4. Hapus kode default dan copy-paste kode dari file `google-apps-script.js`
5. Ganti `YOUR_SHEET_ID_HERE` dengan ID spreadsheet Anda
6. Ganti email di fungsi `sendEmergencyNotification` dengan email bengkel Anda

## Langkah 3: Deploy sebagai Web App

1. Klik "Deploy" > "New deployment"
2. Pilih type: "Web app"
3. Description: "Bengkel Pro Form Handler"
4. Execute as: "Me"
5. Who has access: "Anyone"
6. Klik "Deploy"
7. Copy URL web app yang diberikan
8. Paste URL tersebut ke file `js/script.js` pada variabel `APPS_SCRIPT_URL`

## Langkah 4: Set Permissions

1. Saat pertama kali deploy, akan diminta permission
2. Klik "Review permissions"
3. Pilih akun Google Anda
4. Klik "Advanced" > "Go to [project name] (unsafe)"
5. Klik "Allow"

## Langkah 5: Test

1. Buka website bengkel
2. Isi form emergency atau booking
3. Submit form
4. Cek Google Sheet apakah data masuk
5. Cek email apakah notifikasi terkirim

## Struktur Sheet yang Akan Dibuat

### Sheet "Emergency Calls"
| Timestamp | Nama | Telepon | Lokasi | Masalah | Deskripsi | Status |

### Sheet "Bookings"
| Timestamp | Nama | Telepon | Email | Tanggal Servis | Waktu | Layanan | Info Mobil | Catatan |

## Troubleshooting

### Error "Script function not found"
- Pastikan nama fungsi `doPost` benar
- Pastikan kode sudah di-save sebelum deploy

### Error "Permission denied"
- Pastikan permission sudah diberikan
- Coba deploy ulang dengan permission "Anyone"

### Data tidak masuk ke Sheet
- Cek ID spreadsheet sudah benar
- Pastikan sheet bisa diakses oleh script
- Cek console log di Apps Script untuk error

### Email tidak terkirim
- Pastikan email address benar
- Cek quota email Apps Script (100 email/hari)
- Cek spam folder

## Tips

1. **Backup Data**: Export sheet secara berkala
2. **Monitor Usage**: Cek execution transcript di Apps Script
3. **Security**: Jangan share URL web app secara publik
4. **Testing**: Gunakan mode test sebelum production

