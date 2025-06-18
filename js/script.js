// Car Workshop Website - JavaScript Integration
// Handles form submissions, WhatsApp integration, and Google Sheets

// Configuration
const CONFIG = {
    // Ganti dengan URL Google Apps Script Anda setelah deploy
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbysrsuhKZhHRp5WF3026h9Dg0x8pcCdC6ZULgCBVgGo4vP-5_8LXBEir2RYUgI48HgI/exec',
    
    // Nomor WhatsApp bengkel (format: 62812xxxxxxx)
    WHATSAPP_NUMBER: '62895386294546',
    
    // Pesan WhatsApp template
    WHATSAPP_BASE_URL: 'https://wa.me/'
};

// Services data
const SERVICES = [
    {
        id: 'ganti-oli',
        title: 'Ganti Oli Mesin',
        description: 'Ganti oli mesin dengan oli berkualitas tinggi. Termasuk filter oli dan pengecekan level cairan lainnya.',
        price: 'Rp 150.000',
        icon: '🛢️',
        duration: '30 menit'
    },
    {
        id: 'servis-rutin',
        title: 'Servis Rutin',
        description: 'Pemeriksaan menyeluruh kondisi kendaraan meliputi mesin, rem, suspensi, dan sistem kelistrikan.',
        price: 'Rp 200.000',
        icon: '🔧',
        duration: '2 jam'
    },
    {
        id: 'tune-up',
        title: 'Tune Up',
        description: 'Penyetelan ulang mesin untuk performa optimal. Termasuk ganti busi, filter udara, dan pembersihan injector.',
        price: 'Rp 350.000',
        icon: '⚙️',
        duration: '3 jam'
    },
    {
        id: 'ac-mobil',
        title: 'Service AC Mobil',
        description: 'Pembersihan evaporator, isi freon, dan pengecekan sistem AC secara menyeluruh.',
        price: 'Rp 250.000',
        icon: '❄️',
        duration: '1.5 jam'
    },
    {
        id: 'ban-velg',
        title: 'Ban & Velg',
        description: 'Spooring, balancing, dan pengecekan kondisi ban. Tersedia berbagai merk ban berkualitas.',
        price: 'Rp 100.000',
        icon: '🛞',
        duration: '1 jam'
    },
    {
        id: 'rem',
        title: 'Service Rem',
        description: 'Pengecekan dan penggantian kampas rem, minyak rem, dan penyetelan sistem rem.',
        price: 'Rp 180.000',
        icon: '🛑',
        duration: '1.5 jam'
    }
];

// DOM Elements
let emergencyForm, bookingForm, servicesGrid, loadingOverlay, successModal;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    populateServices();
    setupEventListeners();
    setupSmoothScrolling();
});

// Initialize DOM elements
function initializeElements() {
    emergencyForm = document.getElementById('emergencyForm');
    bookingForm = document.getElementById('bookingForm');
    servicesGrid = document.getElementById('servicesGrid');
    loadingOverlay = document.getElementById('loadingOverlay');
    successModal = document.getElementById('successModal');
}

// Populate services grid
function populateServices() {
    if (!servicesGrid) return;
    
    servicesGrid.innerHTML = SERVICES.map(service => `
        <div class="service-card" data-service-id="${service.id}">
            <div class="service-icon">${service.icon}</div>
            <h3 class="service-title">${service.title}</h3>
            <p class="service-description">${service.description}</p>
            <div class="service-price">${service.price}</div>
            <div class="service-duration">⏱️ ${service.duration}</div>
            <button class="btn btn-primary" onclick="bookService('${service.id}')">
                Booking Sekarang
            </button>
        </div>
    `).join('');
    
    // Populate booking service options
    const bookingServiceSelect = document.getElementById('bookingService');
    if (bookingServiceSelect) {
        bookingServiceSelect.innerHTML = '<option value="">Pilih layanan...</option>' +
            SERVICES.map(service => 
                `<option value="${service.id}">${service.title} - ${service.price}</option>`
            ).join('');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Emergency form submission
    if (emergencyForm) {
        emergencyForm.addEventListener('submit', handleEmergencySubmit);
    }
    
    // Booking form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
    
    // Close modal
    const closeModal = document.querySelector('.close');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            successModal.style.display = 'none';
        });
    }
    
    // Set minimum date for booking
    const bookingDate = document.getElementById('bookingDate');
    if (bookingDate) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        bookingDate.min = tomorrow.toISOString().split('T')[0];
    }
}

// Handle emergency form submission
async function handleEmergencySubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(emergencyForm);
    const data = {
        formType: 'emergency',
        name: formData.get('name'),
        phone: formData.get('phone'),
        location: formData.get('location'),
        problem: formData.get('problem'),
        description: formData.get('description')
    };
    
    // Validate required fields
    if (!data.name || !data.phone || !data.location || !data.problem) {
        showAlert('Mohon lengkapi semua field yang wajib diisi!', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        // Send to Google Sheets
        await sendToGoogleSheets(data);
        
        // Generate WhatsApp message
        const whatsappMessage = generateEmergencyWhatsAppMessage(data);
        
        // Show success message
        showSuccessModal(
            'Panggilan darurat berhasil dikirim!',
            'Data Anda telah tersimpan. Klik OK untuk melanjutkan ke WhatsApp dan menghubungi montir kami.',
            () => openWhatsApp(whatsappMessage)
        );
        
        // Reset form
        emergencyForm.reset();
        
    } catch (error) {
        console.error('Error:', error);
        showAlert('Terjadi kesalahan. Silakan coba lagi atau hubungi kami langsung.', 'error');
    } finally {
        showLoading(false);
    }
}

// Handle booking form submission
async function handleBookingSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(bookingForm);
    const data = {
        formType: 'booking',
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        date: formData.get('date'),
        time: formData.get('time'),
        service: formData.get('service'),
        carInfo: formData.get('carInfo'),
        notes: formData.get('notes')
    };
    
    // Validate required fields
    if (!data.name || !data.phone || !data.date || !data.time || !data.service || !data.carInfo) {
        showAlert('Mohon lengkapi semua field yang wajib diisi!', 'error');
        return;
    }
    
    // Validate date (must be at least tomorrow)
    const selectedDate = new Date(data.date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    if (selectedDate < tomorrow) {
        showAlert('Tanggal booking minimal H+1 dari hari ini!', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        // Send to Google Sheets
        await sendToGoogleSheets(data);
        
        // Generate WhatsApp message
        const whatsappMessage = generateBookingWhatsAppMessage(data);
        
        // Show success message
        showSuccessModal(
            'Booking berhasil!',
            'Data booking Anda telah tersimpan. Klik OK untuk konfirmasi via WhatsApp.',
            () => openWhatsApp(whatsappMessage)
        );
        
        // Reset form
        bookingForm.reset();
        
    } catch (error) {
        console.error('Error:', error);
        showAlert('Terjadi kesalahan. Silakan coba lagi atau hubungi kami langsung.', 'error');
    } finally {
        showLoading(false);
    }
}

// Send data to Google Sheets
async function sendToGoogleSheets(data) {
    const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    
    const result = await response.json();
    
    if (result.status !== 'success') {
        throw new Error(result.message || 'Unknown error');
    }
    
    return result;
}

// Generate WhatsApp message for emergency
function generateEmergencyWhatsAppMessage(data) {
    const message = `🚨 *PANGGILAN DARURAT* 🚨

Halo Bengkel Pro, saya butuh bantuan montir segera!

👤 *Nama:* ${data.name}
📞 *Telepon:* ${data.phone}
📍 *Lokasi:* ${data.location}
⚠️ *Masalah:* ${data.problem}
📝 *Detail:* ${data.description || 'Tidak ada detail tambahan'}

Mohon segera kirim montir ke lokasi saya. Terima kasih!`;

    return encodeURIComponent(message);
}

// Generate WhatsApp message for booking
function generateBookingWhatsAppMessage(data) {
    const service = SERVICES.find(s => s.id === data.service);
    const serviceName = service ? service.title : data.service;
    
    const message = `📅 *KONFIRMASI BOOKING*

Halo Bengkel Pro, saya ingin konfirmasi booking:

👤 *Nama:* ${data.name}
📞 *Telepon:* ${data.phone}
📧 *Email:* ${data.email || 'Tidak ada'}
📅 *Tanggal:* ${formatDate(data.date)}
⏰ *Waktu:* ${data.time}
🔧 *Layanan:* ${serviceName}
🚗 *Kendaraan:* ${data.carInfo}
📝 *Catatan:* ${data.notes || 'Tidak ada catatan khusus'}

Mohon konfirmasi ketersediaan jadwal. Terima kasih!`;

    return encodeURIComponent(message);
}

// Open WhatsApp with message
function openWhatsApp(message) {
    const url = `${CONFIG.WHATSAPP_BASE_URL}${CONFIG.WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, '_blank');
}

// Book specific service
function bookService(serviceId) {
    const bookingServiceSelect = document.getElementById('bookingService');
    if (bookingServiceSelect) {
        bookingServiceSelect.value = serviceId;
    }
    
    // Scroll to booking section
    document.getElementById('booking').scrollIntoView({
        behavior: 'smooth'
    });
}

// Show loading overlay
function showLoading(show) {
    if (loadingOverlay) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }
}

// Show success modal
function showSuccessModal(title, message, callback) {
    if (successModal) {
        const titleElement = successModal.querySelector('h3');
        const messageElement = successModal.querySelector('#successMessage');
        
        if (titleElement) titleElement.textContent = title;
        if (messageElement) messageElement.textContent = message;
        
        successModal.style.display = 'block';
        
        // Store callback for OK button
        window.successCallback = callback;
    }
}

// Close modal
function closeModal() {
    if (successModal) {
        successModal.style.display = 'none';
    }
    
    // Execute callback if exists
    if (window.successCallback) {
        window.successCallback();
        window.successCallback = null;
    }
}

// Show alert
function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease;
        background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#007bff'};
    `;
    
    alert.querySelector('button').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: 10px;
        padding: 0;
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#ffffff';
            header.style.backdropFilter = 'none';
        }
    }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .nav.active {
        display: flex !important;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: 1rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .nav.active .nav-list {
        flex-direction: column;
        gap: 1rem;
    }
    
    @media (max-width: 768px) {
        .nav {
            display: none;
        }
    }
`;
document.head.appendChild(style);

