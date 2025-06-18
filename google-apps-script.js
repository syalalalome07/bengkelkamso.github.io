// Google Apps Script untuk menerima data dari form website bengkel
// File ini harus di-deploy sebagai web app di Google Apps Script

// Fungsi untuk menangani POST request dari website
function doPost(e) {
  try {
    // Parse data yang dikirim dari form
    const data = JSON.parse(e.postData.contents);
    
    // Buka Google Sheet berdasarkan ID
    const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID_HERE');
    
    // Tentukan worksheet berdasarkan jenis form
    let worksheet;
    if (data.formType === 'emergency') {
      worksheet = sheet.getSheetByName('Emergency Calls') || sheet.insertSheet('Emergency Calls');
      
      // Header untuk emergency calls jika belum ada
      if (worksheet.getLastRow() === 0) {
        worksheet.getRange(1, 1, 1, 7).setValues([
          ['Timestamp', 'Nama', 'Telepon', 'Lokasi', 'Masalah', 'Deskripsi', 'Status']
        ]);
      }
      
      // Tambah data emergency call
      worksheet.appendRow([
        new Date(),
        data.name,
        data.phone,
        data.location,
        data.problem,
        data.description,
        'Pending'
      ]);
      
    } else if (data.formType === 'booking') {
      worksheet = sheet.getSheetByName('Bookings') || sheet.insertSheet('Bookings');
      
      // Header untuk bookings jika belum ada
      if (worksheet.getLastRow() === 0) {
        worksheet.getRange(1, 1, 1, 9).setValues([
          ['Timestamp', 'Nama', 'Telepon', 'Email', 'Tanggal Servis', 'Waktu', 'Layanan', 'Info Mobil', 'Catatan']
        ]);
      }
      
      // Tambah data booking
      worksheet.appendRow([
        new Date(),
        data.name,
        data.phone,
        data.email,
        data.date,
        data.time,
        data.service,
        data.carInfo,
        data.notes
      ]);
    }
    
    // Response sukses
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data berhasil disimpan'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Response error
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Terjadi kesalahan: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Fungsi untuk menangani GET request (opsional, untuk testing)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Google Apps Script berjalan dengan baik'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Fungsi untuk mengirim notifikasi email ketika ada emergency call
function sendEmergencyNotification(data) {
  const subject = '🚨 EMERGENCY CALL - ' + data.problem;
  const body = `
    PANGGILAN DARURAT BARU!
    
    Nama: ${data.name}
    Telepon: ${data.phone}
    Lokasi: ${data.location}
    Masalah: ${data.problem}
    Deskripsi: ${data.description}
    
    Waktu: ${new Date().toLocaleString('id-ID')}
    
    Segera hubungi pelanggan dan kirim montir ke lokasi.
  `;
  
  // Ganti dengan email bengkel Anda
  const emailBengkel = 'bengkel@example.com';
  
  try {
    MailApp.sendEmail(emailBengkel, subject, body);
  } catch (error) {
    console.log('Error sending email: ' + error.toString());
  }
}

// Fungsi untuk mengirim konfirmasi booking via email
function sendBookingConfirmation(data) {
  const subject = '✅ Konfirmasi Booking - Bengkel Pro';
  const body = `
    Halo ${data.name},
    
    Terima kasih telah melakukan booking di Bengkel Pro!
    
    Detail booking Anda:
    - Tanggal: ${data.date}
    - Waktu: ${data.time}
    - Layanan: ${data.service}
    - Kendaraan: ${data.carInfo}
    
    Kami akan menghubungi Anda 1 hari sebelum jadwal servis untuk konfirmasi.
    
    Jika ada pertanyaan, hubungi kami di 0812-3456-7890.
    
    Salam,
    Tim Bengkel Pro
  `;
  
  try {
    if (data.email) {
      MailApp.sendEmail(data.email, subject, body);
    }
  } catch (error) {
    console.log('Error sending confirmation email: ' + error.toString());
  }
}

