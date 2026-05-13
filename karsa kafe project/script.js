// ===== DARK MODE =====
function initDarkMode() {
  const btn = document.getElementById('darkModeBtn');
  const icon = document.getElementById('darkModeIcon');
  
  // Auto-theme based on time: 08:00 - 18:00 is Light, >18:00 or <08:00 is Deep Night
  const currentHour = new Date().getHours();
  const isDeepNight = currentHour >= 18 || currentHour < 8;
  
  // Apply saved preference or auto-theme
  if (localStorage.getItem('darkMode') === 'true' || (localStorage.getItem('darkMode') === null && isDeepNight)) {
    document.documentElement.classList.add('dark');
    if(icon) icon.textContent = '🌙';
    localStorage.setItem('darkMode', 'true');
  } else if (localStorage.getItem('darkMode') === 'false' || (localStorage.getItem('darkMode') === null && !isDeepNight)) {
    document.documentElement.classList.remove('dark');
    if(icon) icon.textContent = '☀️';
    localStorage.setItem('darkMode', 'false');
  }

  if(btn) btn.onclick = () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
    if(icon) icon.textContent = isDark ? '🌙' : '☀️';
  };
}

// ===== NAVBAR SCROLL =====
function initNavbar() {
  window.addEventListener('scroll', () => {
    const n = document.getElementById('navbar');
    if (n) {
      const scrolled = window.scrollY >= 80;
      n.classList.toggle('bg-transparent', !scrolled);
      n.classList.toggle('navbar-scrolled', scrolled);
    }
  });
  
  const mobileBtn = document.getElementById('mobileBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (mobileBtn && mobileMenu) {
    mobileBtn.onclick = () => mobileMenu.classList.toggle('hidden');
    document.querySelectorAll('#mobileMenu a').forEach(a =>
      a.onclick = () => mobileMenu.classList.add('hidden')
    );
  }
}

// ===== MENU FILTER =====
function initMenuFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.menu-item');
  btns.forEach(btn => {
    btn.onclick = () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      cards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = '';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    };
  });
}

// ===== MOOD SELECTOR =====
function setMood(mood) {
  const cards = document.querySelectorAll('.menu-item');
  let targetKeywords = [];
  if (mood === 'Ngantuk') targetKeywords = ['Americano', 'Kopi Susu'];
  else if (mood === 'Senang') targetKeywords = ['Matcha', 'Red Velvet'];
  else if (mood === 'Sedih') targetKeywords = ['Red Velvet', 'Kopi Susu'];
  else if (mood === 'Fokus') targetKeywords = ['Americano'];

  cards.forEach(card => {
    const nameEl = card.querySelector('h3');
    if (!nameEl) return;
    const name = nameEl.textContent;
    const isMatch = targetKeywords.length === 0 || targetKeywords.some(kw => name.includes(kw));

    card.style.opacity = '0';
    card.style.transform = 'scale(0.8)';
    setTimeout(() => {
      if (isMatch) {
        card.style.display = '';
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
      } else {
        card.style.display = 'none';
      }
    }, 300);
  });
}

// ===== TESTIMONIAL SLIDER =====
function initTestimonialSlider() {
  const testimonials = [
    { name: 'Rina Putri', major: 'Mahasiswa Sastra Inggris UNP', rating: 5, text: 'Tempatnya cozy banget! WiFi kencang, colokan banyak, dan kopinya enak. Cocok banget buat nugas sampai malam.', avatar: '👩‍🎓' },
    { name: 'Fadli Rahman', major: 'Mahasiswa Teknik Informatika UNP', rating: 5, text: 'Karsa Cafe jadi basecamp kedua saya. Suasananya bikin fokus, dan harga mahasiswa banget!', avatar: '👨‍💻' },
    { name: 'Dinda Maharani', major: 'Mahasiswa Manajemen UNP', rating: 4, text: 'Suka banget sama Matcha Latte-nya! Tempatnya Instagramable dan staffnya ramah-ramah.', avatar: '👩‍💼' },
    { name: 'Arif Budiman', major: 'Mahasiswa Pendidikan Fisika UNP', rating: 5, text: 'Nasi goreng katsu-nya juara! Porsi besar, harga bersahabat. Langganan setiap minggu.', avatar: '👨‍🔬' },
    { name: 'Sari Wulandari', major: 'Mahasiswa Psikologi UNP', rating: 5, text: 'Area outdoor-nya asik buat diskusi kelompok. Recommended banget buat anak UNP!', avatar: '👩‍🏫' }
  ];
  let current = 0;
  const container = document.getElementById('testimonialContainer');
  if (!container) return;

  function render() {
    const t = testimonials[current];
    const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
    container.style.opacity = '0';
    container.style.transform = 'translateX(30px)';
    setTimeout(() => {
      container.innerHTML = `
        <div class="testimonial-card">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-2xl">${t.avatar}</div>
            <div>
              <h4 class="font-display font-semibold text-wood-800 dark:text-cream-100">${t.name}</h4>
              <p class="text-xs text-stone-500 dark:text-stone-400">${t.major}</p>
            </div>
          </div>
          <div class="text-amber-500 text-lg mb-3 tracking-wide">${stars}</div>
          <p class="text-stone-600 dark:text-stone-300 leading-relaxed italic">"${t.text}"</p>
        </div>`;
      container.style.opacity = '1';
      container.style.transform = 'translateX(0)';
    }, 300);
  }

  render();
  const prevTest = document.getElementById('prevTest');
  const nextTest = document.getElementById('nextTest');
  
  if (prevTest && nextTest) {
    prevTest.onclick = () => { current = (current - 1 + testimonials.length) % testimonials.length; render(); };
    nextTest.onclick = () => { current = (current + 1) % testimonials.length; render(); };
  }
  setInterval(() => { current = (current + 1) % testimonials.length; render(); }, 5000);
}

// ===== FADE IN =====
function initFadeIn() {
  const obs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  }), { threshold: 0.15 });
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
}

// ===== DATE PICKER =====
function initDatePicker() {
    function setupFlatpickr() {
        const dateInput = document.getElementById('resTanggal');
        if (!dateInput) return;

        if (typeof flatpickr === 'undefined') {
            // Retry after 300ms if flatpickr hasn't loaded yet
            setTimeout(setupFlatpickr, 300);
            return;
        }

        flatpickr(dateInput, {
            minDate: 'today',
            dateFormat: 'd-m-Y',
            disableMobile: true,
            locale: {
                firstDayOfWeek: 1,
                weekdays: {
                    shorthand: ['Min','Sen','Sel','Rab','Kam','Jum','Sab'],
                    longhand: ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']
                },
                months: {
                    shorthand: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'],
                    longhand: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
                }
            },
            onReady: function(selectedDates, dateStr, instance) {
                // Style the flatpickr calendar to match dark theme
                const cal = instance.calendarContainer;
                if (cal) {
                    cal.style.borderRadius = '16px';
                    cal.style.border = '1px solid rgba(245,158,11,0.3)';
                    cal.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
                }
            }
        });
    }

    setupFlatpickr();
}

// ===== FORM & CONFETTI =====
function initForm() {
    const form = document.getElementById('reservasiForm');
    const btn = form ? form.querySelector('button[type="submit"]') : null;
    
    if (form) {
        form.onsubmit = e => {
            e.preventDefault();
            
            
            // Check Area selection first, ONLY if Waitlist is NOT active
            const isWaitlist = document.getElementById('submitResBtn') && document.getElementById('submitResBtn').textContent.includes('Tunggu');
            const selectedArea = form.querySelector('input[name="resArea"]:checked');
            if (!isWaitlist && !selectedArea) {
                alert('Pilih area dudukmu dulu, Ngab!');
                return;
            }

            // ===== ANTI-DOUBLE BOOKING CHECK (Feature 1) =====
            if (window._checkDoubleBooking && !window._checkDoubleBooking()) return;

            const inputs = form.querySelectorAll('input[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('shake', 'error-border');
                    setTimeout(() => input.classList.remove('shake', 'error-border'), 400);
                }
            });
            
            if (!isValid) return;
            
            // Confetti Explosion
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#b45309', '#d97706', '#fcd34d', '#ffffff']
                });
            }
            
            const originalText = btn.textContent;
            btn.textContent = 'Memproses...';
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
            
            const area = selectedArea.value;
            const nama = document.getElementById('resNama').value;
            const jumlah = document.getElementById('resJumlah').value;
            const tanggal = document.getElementById('resTanggal').value;
            const jam = document.getElementById('resJam').value;
            const catatan = document.getElementById('resCatatan').value;
            const wa = document.getElementById('resWA') ? document.getElementById('resWA').value : '';
            
            if (isWaitlist) {
                const waitlistData = {
                    id: Date.now(),
                    nama: nama,
                    jumlah: jumlah,
                    wa: wa,
                    waktuMasuk: new Date().toLocaleString('id-ID'),
                    status: 'menunggu'
                };
                let wl = [];
                try { wl = JSON.parse(localStorage.getItem('karsa_waitlist')) || []; } catch(e) {}
                wl.push(waitlistData);
                localStorage.setItem('karsa_waitlist', JSON.stringify(wl));
                alert('Kamu berhasil masuk Daftar Tunggu. Kami akan hubungi via WA jika ada meja kosong!');
                
                form.reset();
                btn.textContent = 'Masuk Daftar Tunggu';
                return;
            }

            // ===== SIMPAN KE localStorage untuk KASIR DASHBOARD =====
            const pesananBaru = {
                id: Date.now(),
                nama: nama,
                jumlah: jumlah,
                tanggal: tanggal,
                jam: jam,
                catatan: catatan || '-',
                area: area,
                status: 'menunggu', // menunggu | dikonfirmasi | selesai
                waktuMasuk: new Date().toLocaleString('id-ID')
            };

            let pesananMasuk = [];
            try {
                pesananMasuk = JSON.parse(localStorage.getItem('karsa_pesanan_masuk')) || [];
            } catch(err) { pesananMasuk = []; }
            
            pesananMasuk.push(pesananBaru);
            localStorage.setItem('karsa_pesanan_masuk', JSON.stringify(pesananMasuk));

            // ===== SAVE RESERVATION ID FOR STATUS TRACKER (Feature 5) =====
            localStorage.setItem('karsa_my_reservation_id', String(pesananBaru.id));
            
            // ===== FEEDBACK KE PELANGGAN =====
            if (typeof showReservationFeedback === 'function') {
                showReservationFeedback(area);
            }
            
            setTimeout(() => {
                form.reset();
                window._selectedArea = null;

                // Reset area toggle visuals
                const statusPill = document.getElementById('areaStatusPill');
                if(statusPill) statusPill.style.display = 'none';
                
                const labelIn = document.getElementById('labelIndoor');
                const labelOut = document.getElementById('labelOutdoor');
                if (labelIn) { labelIn.style.background='transparent'; labelIn.style.border='1px solid transparent'; labelIn.style.boxShadow='none'; }
                if (labelOut) { labelOut.style.background='transparent'; labelOut.style.border='1px solid transparent'; labelOut.style.boxShadow='none'; }
                if (typeof initAreaToggles === 'function') initAreaToggles();

                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.opacity = '';
                btn.style.cursor = '';
            }, 1500);
        };
        
        // Remove error states on input
        form.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('error-border', 'shake');
            });
        });
    }
}

// initAreaSelection is now handled by inline script in index.html
function initAreaSelection() { /* noop - handled inline */ }

// ===== BEFORE-AFTER SLIDER =====
function initBeforeAfterSlider() {
    const slider = document.getElementById('beforeAfterSlider');
    const handle = document.getElementById('beforeAfterHandle');
    const img = document.getElementById('beforeAfterImg');

    if (!slider || !handle || !img) return;

    slider.addEventListener('input', (e) => {
        const val = e.target.value;
        handle.style.left = `${val}%`;
        img.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
    });
}

// ===== AOS INITIALIZATION =====
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            offset: 50,
            duration: 800,
            easing: 'ease-out-cubic'
        });
    }
}


// ===== LOGIN REDIRECT & PAGE TRANSITIONS =====
function initLoginRedirect() {
  const loginForm = document.getElementById('loginForm');
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  const loginStepContainer = document.getElementById('loginStepContainer');
  const tableModal = document.getElementById('tableModal');
  const tableModalContent = document.getElementById('tableModalContent');
  const modalTableNumber = document.getElementById('modalTableNumber');
  const goToMenuBtn = document.getElementById('goToMenuBtn');
  const userAvatar = document.getElementById('userAvatar');
  const welcomeName = document.getElementById('welcomeName');
  const tableWarning = document.getElementById('tableWarning');
  
  // Firebase initialization placeholder
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  if (typeof firebase !== 'undefined' && !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
  }

  // Handle Table Selection Modal Logic
  if (modalTableNumber && goToMenuBtn) {
      modalTableNumber.addEventListener('change', (e) => {
          if (e.target.value) {
              goToMenuBtn.disabled = false;
              if (tableWarning) {
                  tableWarning.classList.add('opacity-0');
                  setTimeout(() => tableWarning.classList.add('hidden'), 300);
              }
          } else {
              goToMenuBtn.disabled = true;
              if (tableWarning) {
                  tableWarning.classList.remove('hidden');
                  setTimeout(() => tableWarning.classList.remove('opacity-0'), 10);
              }
          }
      });
      
      goToMenuBtn.addEventListener('click', () => {
          if (!modalTableNumber.value) {
              if (tableWarning) {
                  tableWarning.classList.remove('hidden');
                  setTimeout(() => tableWarning.classList.remove('opacity-0'), 10);
              }
              return;
          }
          
          goToMenuBtn.textContent = 'Memproses...';
          goToMenuBtn.disabled = true;
          
          const selectedAreaElement = document.querySelector('input[name="modalArea"]:checked');
          const selectedArea = selectedAreaElement ? selectedAreaElement.value : 'Indoor';
          
          localStorage.setItem('karsa_table_number', modalTableNumber.value);
          localStorage.setItem('karsa_area', selectedArea);
          
          setTimeout(() => {
              triggerPageTransition('index.html');
          }, 800);
      });
  }

  function showTableModal(name, photoUrl) {
      // Hide login, show modal
      if(loginStepContainer) loginStepContainer.classList.add('hidden');
      if(tableModal) {
          tableModal.classList.remove('hidden');
          setTimeout(() => {
              if (tableModalContent) {
                  tableModalContent.classList.remove('scale-95', 'opacity-0');
                  tableModalContent.classList.add('scale-100', 'opacity-100');
              }
          }, 50);
      }
      
      if (welcomeName) welcomeName.textContent = name;
      if (photoUrl && userAvatar) {
          userAvatar.src = photoUrl;
          userAvatar.classList.remove('hidden');
      }
      localStorage.setItem('karsa_user_name', name);
      if(photoUrl) localStorage.setItem('karsa_user_avatar', photoUrl);
  }

  // 1. Manual Login
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('userName').value.trim();
      const btn = document.getElementById('loginBtn');
      
      if (!name) return;
      
      if(btn) {
        const ogText = btn.textContent;
        btn.textContent = 'Memproses...';
        btn.disabled = true;
        setTimeout(() => {
            showTableModal(name, null);
            btn.textContent = ogText;
            btn.disabled = false;
        }, 500);
      }
    });
  }
  
  // 2. Google Login
  if (googleLoginBtn) {
      googleLoginBtn.addEventListener('click', () => {
          if (typeof firebase === 'undefined') {
              alert('Firebase SDK belum di-load. Pastikan script Firebase ada di HTML.');
              return;
          }
          
          if (firebaseConfig.apiKey === "YOUR_API_KEY") {
              alert('Peringatan: API Key Firebase masih default/placeholder. Menggunakan dummy data untuk demo.');
              const dummyName = "Sultan " + Math.floor(Math.random() * 1000);
              const photoUrl = "https://ui-avatars.com/api/?name=" + dummyName.replace(' ', '+') + "&background=f59e0b&color=fff";
              showTableModal(dummyName, photoUrl);
              return;
          }

          const provider = new firebase.auth.GoogleAuthProvider();
          const ogContent = googleLoginBtn.innerHTML;
          googleLoginBtn.innerHTML = 'Connecting to Google...';
          googleLoginBtn.disabled = true;
          
          firebase.auth().signInWithPopup(provider)
              .then((result) => {
                  const user = result.user;
                  showTableModal(user.displayName, user.photoURL);
              })
              .catch((error) => {
                  console.error(error);
                  alert('Login Gagal: ' + error.message);
                  googleLoginBtn.innerHTML = ogContent;
                  googleLoginBtn.disabled = false;
              });
      });
  }
}


// ===== ORDER MEMORY (REMEMBER ME) =====
// ===== ORDER MEMORY (REMEMBER ME) =====
function initOrderMemory() {
  const savedName = localStorage.getItem('karsa_user_name');
  const tableNum = localStorage.getItem('karsa_table_number');
  const userNameInput = document.getElementById('userName');
  const tableNumberSelect = document.getElementById('tableNumber');
  const personalGreeting = document.getElementById('personalGreeting');
  const defaultSubtitle = document.getElementById('defaultSubtitle');
  const savedNameDisplay = document.getElementById('savedNameDisplay');

  if (savedName && userNameInput) {
    // Auto-fill name
    userNameInput.value = savedName;
    
    // Update header greeting if elements exist
    if (personalGreeting && defaultSubtitle && savedNameDisplay) {
      defaultSubtitle.classList.add('hidden');
      personalGreeting.classList.remove('hidden');
      savedNameDisplay.textContent = savedName;
    }
  }

  // Feature 2: Auto-Sync Data for Menu Page Header
  const header = document.getElementById('orderMemoryHeader');
  if (header && savedName && tableNum) {
      header.classList.remove('hidden');
      const omName = document.getElementById('omName');
      const omTable = document.getElementById('omTable');
      if (omName) omName.textContent = savedName;
      if (omTable) omTable.textContent = tableNum;
  }

  // Always reset table number for new session on the login page
  if (tableNumberSelect) {
    tableNumberSelect.value = "";
  }
}


function initPageTransition() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('hide');
                document.body.classList.remove('overflow-hidden');
                setTimeout(() => loadingScreen.remove(), 700);
            }, 500); // slight delay to ensure all smooth
        });
    }

    const overlay = document.getElementById('pageTransition');
    if (overlay) {
        // Fade in on load
        window.addEventListener('load', () => {
            overlay.classList.add('loaded');
        });
        
        // Intercept links
        document.querySelectorAll('a[href="login.html"], a[href="index.html"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                triggerPageTransition(target);
            });
        });
    }
}

function triggerPageTransition(url) {
    const overlay = document.getElementById('pageTransition');
    if (overlay) {
        overlay.classList.remove('loaded');
        overlay.classList.add('exit');
        setTimeout(() => {
            if (window.top !== window.self) {
               window.top.location.href = url;
            } else {
               window.location.href = url;
            }
        }, 500);
    } else {
        window.location.href = url;
    }
}

// ===== CAPACITY LOGIC (Feature 3 - real-time from reservation data) =====
function initCapacityLogic() {
  const statusMeja = document.getElementById('statusMeja');
  if (!statusMeja) return; // Only run if on page with status meja

  function getReservationCapacity() {
    let pesanan = [];
    try { pesanan = JSON.parse(localStorage.getItem('karsa_pesanan_masuk')) || []; } catch(e) {}
    const activeIndoor = pesanan.filter(p => p.area === 'Indoor' && (p.status === 'menunggu' || p.status === 'dikonfirmasi')).length;
    const activeOutdoor = pesanan.filter(p => p.area === 'Outdoor' && (p.status === 'menunggu' || p.status === 'dikonfirmasi')).length;
    return { indoor: activeIndoor, outdoor: activeOutdoor };
  }

  function updateStatusMeja() {
    const counts = getReservationCapacity();
    const indoorMax = 10, outdoorMax = 5;
    const indoorPct = Math.round((counts.indoor / indoorMax) * 100);
    const outdoorPct = Math.round((counts.outdoor / outdoorMax) * 100);

    // Sync capacity to localStorage so form toggles can read it
    localStorage.setItem('karsa_area_capacity', JSON.stringify({
      indoor: { total: indoorMax, used: counts.indoor },
      outdoor: { total: outdoorMax, used: counts.outdoor }
    }));

    const indoorStatusEl = document.getElementById('indoorStatus');
    const indoorBarEl = document.getElementById('indoorBar');
    const indoorTextEl = document.getElementById('indoorText');
    const indoorDot = document.getElementById('indoorDot');

    if (indoorStatusEl && indoorBarEl && indoorTextEl && indoorDot) {
      indoorStatusEl.textContent = `${counts.indoor}/${indoorMax} Meja Terpakai`;
      indoorBarEl.style.width = `${Math.min(indoorPct, 100)}%`;

      if (counts.indoor >= indoorMax) {
        indoorTextEl.innerHTML = `Area Indoor <strong>FULL BOOKED</strong> — Semua meja terisi`;
        indoorBarEl.className = 'bg-red-500 h-3 rounded-full transition-all duration-1000';
        indoorDot.className = 'indicator-dot bg-red-500';
        indoorStatusEl.className = 'text-red-600 font-bold text-lg';
      } else if (indoorPct > 50) {
        indoorTextEl.innerHTML = `Saat ini area Indoor sedang <strong>Lumayan Rame</strong>`;
        indoorBarEl.className = 'bg-amber-500 h-3 rounded-full transition-all duration-1000';
        indoorDot.className = 'indicator-dot bg-amber-500';
        indoorStatusEl.className = 'text-amber-600 font-bold text-lg';
      } else {
        indoorTextEl.innerHTML = `Saat ini area Indoor sedang <strong>Santai</strong>`;
        indoorBarEl.className = 'bg-green-500 h-3 rounded-full transition-all duration-1000';
        indoorDot.className = 'indicator-dot bg-green-500';
        indoorStatusEl.className = 'text-green-600 font-bold text-lg';
      }
    }

    const outdoorStatusEl = document.getElementById('outdoorStatus');
    const outdoorBarEl = document.getElementById('outdoorBar');
    const outdoorTextEl = document.getElementById('outdoorText');
    const outdoorDot = document.getElementById('outdoorDot');

    if (outdoorStatusEl && outdoorBarEl && outdoorTextEl && outdoorDot) {
      outdoorStatusEl.textContent = `${counts.outdoor}/${outdoorMax} Meja Terpakai`;
      outdoorBarEl.style.width = `${Math.min(outdoorPct, 100)}%`;

      if (counts.outdoor >= outdoorMax) {
        outdoorTextEl.innerHTML = `Area Outdoor <strong>FULL BOOKED</strong> — Semua meja terisi`;
        outdoorBarEl.className = 'bg-red-500 h-3 rounded-full transition-all duration-1000';
        outdoorDot.className = 'indicator-dot bg-red-500';
        outdoorStatusEl.className = 'text-red-600 font-bold text-lg';
      } else if (outdoorPct > 50) {
        outdoorTextEl.innerHTML = `Saat ini area Outdoor sedang <strong>Lumayan Rame</strong>`;
        outdoorBarEl.className = 'bg-amber-500 h-3 rounded-full transition-all duration-1000';
        outdoorDot.className = 'indicator-dot bg-amber-500';
        outdoorStatusEl.className = 'text-amber-600 font-bold text-lg';
      } else {
        outdoorTextEl.innerHTML = `Saat ini area Outdoor sedang <strong>Santai</strong>`;
        outdoorBarEl.className = 'bg-green-500 h-3 rounded-full transition-all duration-1000';
        outdoorDot.className = 'indicator-dot bg-green-500';
        outdoorStatusEl.className = 'text-green-600 font-bold text-lg';
      }
    }

    const waitlistIndicator = document.getElementById('waitlistIndicator');
    const waitlistText = document.getElementById('waitlistText');
    if (waitlistIndicator && waitlistText) {
      if (counts.indoor >= indoorMax || counts.outdoor >= outdoorMax) {
        waitlistText.textContent = 'Salah satu area penuh — pesan via reservasi!';
        waitlistIndicator.className = 'mt-8 mx-auto max-w-md bg-red-100 border-l-4 border-red-500 p-4 rounded-xl text-red-800 text-center shadow-md transition-all duration-300';
      } else {
        waitlistText.textContent = 'Meja tersedia, langsung gas ke lokasi!';
        waitlistIndicator.className = 'mt-8 mx-auto max-w-md bg-green-100 border-l-4 border-green-500 p-4 rounded-xl text-green-800 text-center shadow-md transition-all duration-300';
      }
    }

    // Refresh area toggle state in case capacity changed
    if (typeof initAreaToggles === 'function') initAreaToggles();
  }

  updateStatusMeja();
  // Poll every 5s for real-time updates from kasir actions
  setInterval(updateStatusMeja, 5000);
}

// ===== AMBIENT SOUNDSCAPE & SOCIAL HIDING =====
function initAmbientSound() {
  const playBtn = document.getElementById('playAmbientBtn');
  const playIcon = document.getElementById('playIcon');
  const audio = document.getElementById('ambientAudio');
  const visualizer = document.getElementById('visualizer');
  const socialSidebar = document.getElementById('floatingSocials');
  
  if (playBtn && audio && visualizer) {
    playBtn.onclick = () => {
      if (audio.paused) {
        audio.play().catch(e => console.log("Audio play failed:", e));
        playIcon.textContent = '⏸';
        visualizer.classList.add('visualizer-active');
        if(socialSidebar) socialSidebar.classList.add('translate-x-[-150%]', 'opacity-0');
      } else {
        audio.pause();
        playIcon.textContent = '▶';
        visualizer.classList.remove('visualizer-active');
        if(socialSidebar) socialSidebar.classList.remove('translate-x-[-150%]', 'opacity-0');
      }
    };
  }
}

// ===== CART SIMULATION =====
// ===== CART SIMULATION (Feature 1) =====
function initCartSimulation() {
  const openCartBtn = document.getElementById('openCartBtn');
  const navCartBtn = document.getElementById('navCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartModal = document.getElementById('cartModal');
  
  if (!cartModal) return;
  
  const openModal = () => {
    cartModal.classList.remove('hidden');
    setTimeout(() => cartModal.classList.add('show'), 10);
  };
  
  if (openCartBtn) openCartBtn.onclick = openModal;
  if (navCartBtn) navCartBtn.onclick = openModal;
  
  const closeModal = () => {
    cartModal.classList.remove('show');
    setTimeout(() => cartModal.classList.add('hidden'), 300);
  };
  
  if(closeCartBtn) closeCartBtn.onclick = closeModal;
  cartModal.onclick = (e) => {
    if (e.target === cartModal) closeModal();
  };
  
  let cart = [];
  try {
      cart = JSON.parse(localStorage.getItem('karsa_cart')) || [];
  } catch(e) { cart = []; }

  const cartItemsList = document.getElementById('cartItemsList');
  const cartTotalPrice = document.getElementById('cartTotalPrice');
  const cartBadge = document.getElementById('cartBadge');
  const navCartBadge = document.getElementById('navCartBadge');
  const budgetToast = document.getElementById('budgetToast');
  const budgetTotal = document.getElementById('budgetTotal');
  
  // Make sure updateCartUI is attached to window so other functions can call it
  window.updateCartUI = function() {
    localStorage.setItem('karsa_cart', JSON.stringify(cart));
    
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    if (cart.length === 0) {
      if(cartItemsList) cartItemsList.innerHTML = '<p class="text-stone-500 dark:text-stone-400 text-sm italic">Keranjang masih kosong.</p>';
      if(cartBadge) cartBadge.classList.add('hidden');
      if(navCartBadge) navCartBadge.classList.add('hidden');
      if(cartTotalPrice) cartTotalPrice.textContent = 'Rp 0';
      if(budgetTotal) budgetTotal.textContent = 'Rp 0';
      if(budgetToast) {
          budgetToast.classList.add('opacity-0', 'translate-y-32');
          budgetToast.classList.remove('opacity-100', 'translate-y-0');
      }
      return;
    }
    
    if(cartItemsList) cartItemsList.innerHTML = '';
    
    cart.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'flex justify-between items-center bg-cream-100 dark:bg-stone-800 p-3 rounded-xl';
      itemEl.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
            </div>
            <div>
                <span class="text-sm font-bold text-wood-800 dark:text-cream-100 block">${item.name}</span>
                <span class="text-xs text-amber-700 font-semibold">Rp ${item.price.toLocaleString('id-ID')}</span>
            </div>
        </div>
        <div class="flex items-center gap-2 bg-white dark:bg-wood-700 rounded-lg px-2 py-1 shadow-sm">
            <button class="cart-min-btn text-amber-700 dark:text-amber-500 font-bold w-5 h-5 flex items-center justify-center rounded hover:bg-amber-100 dark:hover:bg-wood-600" data-index="${index}">-</button>
            <span class="text-xs font-bold w-4 text-center dark:text-white">${item.qty}</span>
            <button class="cart-plus-btn text-amber-700 dark:text-amber-500 font-bold w-5 h-5 flex items-center justify-center rounded hover:bg-amber-100 dark:hover:bg-wood-600" data-index="${index}">+</button>
        </div>
      `;
      if(cartItemsList) cartItemsList.appendChild(itemEl);
    });
    
    if(cartTotalPrice) cartTotalPrice.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    if(budgetTotal) budgetTotal.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    
    if(cartBadge) { cartBadge.textContent = totalItems; cartBadge.classList.remove('hidden'); }
    if(navCartBadge) { navCartBadge.textContent = totalItems; navCartBadge.classList.remove('hidden'); }
    
    if(budgetToast && totalItems > 0) {
        budgetToast.classList.remove('opacity-0', 'translate-y-32');
        budgetToast.classList.add('opacity-100', 'translate-y-0');
    }
    
    // Attach +/- listeners
    document.querySelectorAll('.cart-min-btn').forEach(btn => {
      btn.onclick = (e) => {
        const idx = parseInt(e.currentTarget.dataset.index);
        if(cart[idx].qty > 1) cart[idx].qty--;
        else cart.splice(idx, 1);
        window.updateCartUI();
      };
    });
    document.querySelectorAll('.cart-plus-btn').forEach(btn => {
      btn.onclick = (e) => {
        const idx = parseInt(e.currentTarget.dataset.index);
        cart[idx].qty++;
        window.updateCartUI();
      };
    });
  };
  
  // Initial load
  window.updateCartUI();
  
  // Add to cart buttons on menu cards
  document.querySelectorAll('.tambah-keranjang-btn').forEach(btn => {
    btn.onclick = () => {
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      const image = btn.dataset.image;
      
      const existing = cart.find(i => i.name === name);
      if (existing) {
          existing.qty++;
      } else {
          cart.push({ name, price, image, qty: 1 });
      }
      window.updateCartUI();
      
      // Feedback animation
      const originalText = btn.textContent;
      btn.textContent = 'Ditambahkan!';
      btn.classList.replace('bg-amber-700', 'bg-green-600');
      btn.classList.replace('hover:bg-amber-800', 'hover:bg-green-700');
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.replace('bg-green-600', 'bg-amber-700');
        btn.classList.replace('hover:bg-green-700', 'hover:bg-amber-800');
      }, 1000);
    };
  });

  // Add-to-cart buttons inside the SIDEBAR (different class: add-to-cart-btn)
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.onclick = () => {
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      const image = btn.dataset.image || '';
      const existing = cart.find(i => i.name === name);
      if (existing) existing.qty++;
      else cart.push({ name, price, image, qty: 1 });
      window.updateCartUI();
      const orig = btn.textContent;
      btn.textContent = 'Ditambahkan!';
      btn.classList.replace('bg-amber-100', 'bg-green-100');
      btn.classList.replace('text-amber-700', 'text-green-700');
      setTimeout(() => {
        btn.textContent = orig;
        btn.classList.replace('bg-green-100', 'bg-amber-100');
        btn.classList.replace('text-green-700', 'text-amber-700');
      }, 1000);
    };
  });
}

// ===== SMART GREETING =====
function initSmartGreeting() {
  const greetingEl = document.getElementById('smartGreeting');
  if (!greetingEl) return;
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 15) {
      greetingEl.textContent = 'Selamat Pagi, Kak! Udah siap nugas?';
  } else if (hour >= 15 && hour < 19) {
      greetingEl.textContent = 'Senja di Karsa paling asik bareng Mocktail';
  } else {
      greetingEl.textContent = 'Lembur tugas? Kopi Susu Karsa siap nemenin';
  }
}

// ===== LIVE CHAT WIDGET =====
function initLiveChat() {
    const toggleBtn = document.getElementById('chatToggleBtn');
    const chatPopup = document.getElementById('chatPopup');
    const options = document.querySelectorAll('.chat-option');
    
    if (toggleBtn && chatPopup) {
        toggleBtn.addEventListener('click', () => {
            chatPopup.classList.toggle('hidden');
            setTimeout(() => {
                chatPopup.classList.toggle('scale-0');
                chatPopup.classList.toggle('scale-100');
            }, 10);
        });
        
        document.addEventListener('click', (e) => {
            if (!toggleBtn.contains(e.target) && !chatPopup.contains(e.target)) {
                chatPopup.classList.remove('scale-100');
                chatPopup.classList.add('scale-0');
                setTimeout(() => chatPopup.classList.add('hidden'), 300);
            }
        });
    }
    
    options.forEach(opt => {
        opt.addEventListener('click', () => {
            const type = opt.dataset.type;
            let msg = '';
            if (type === 'menu') msg = 'Halo Karsa Cafe, saya ingin bertanya tentang stok menu hari ini.';
            if (type === 'lokasi') msg = 'Halo Karsa Cafe, boleh minta petunjuk arah/lokasi kafe?';
            const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`;
            window.open(waUrl, '_blank');
        });
    });
}

// ===== MENU CALCULATOR & CHECKOUT =====
// ===== MENU CALCULATOR & CHECKOUT & ETA (Feature 4) =====
function initMenuCalculator() {
    const checkoutBtn = document.getElementById('checkoutMenuBtn');
    const finalCheckoutBtn = document.getElementById('finalCheckoutBtn');
    
    const handleCheckout = () => {
        if (!checkAuth()) return;
        // ===== ANTI-DOUBLE BOOKING (Feature 1) =====
        if (window._checkDoubleBooking && !window._checkDoubleBooking()) return;
        
        let cart = [];
        try { cart = JSON.parse(localStorage.getItem('karsa_cart')) || []; } catch(e) {}
        if (cart.length === 0) {
            alert('Keranjang masih kosong, Ngab!');
            return;
        }
        // Disable checkout buttons immediately
        document.querySelectorAll('#checkoutMenuBtn, #finalCheckoutBtn').forEach(b => {
            b.disabled = true; b.textContent = 'Memproses...'; b.style.opacity='0.5';
        });

        const userName = localStorage.getItem('karsa_user_name');
        const tableNum = localStorage.getItem('karsa_table_number');
        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const qtyTotal = cart.reduce((sum, item) => sum + item.qty, 0);
        
        // Simpan pesanan ke Kasir Dashboard
        const pesananBaru = {
            id: Date.now(),
            nama: userName,
            jumlah: qtyTotal,
            tanggal: new Date().toLocaleDateString('id-ID'),
            jam: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            catatan: 'Order dari Menu (Meja ' + tableNum + ')',
            area: 'Meja ' + tableNum, // Treat Meja as Area for simplicity or define properly
            status: 'menunggu',
            waktuMasuk: new Date().toLocaleString('id-ID'),
            totalHarga: total
        };

        let pesananMasuk = [];
        try { pesananMasuk = JSON.parse(localStorage.getItem('karsa_pesanan_masuk')) || []; } catch(err) {}
        pesananMasuk.push(pesananBaru);
        localStorage.setItem('karsa_pesanan_masuk', JSON.stringify(pesananMasuk));

        // Start ETA
        localStorage.setItem('karsa_order_time', Date.now());
        localStorage.setItem('karsa_order_status', 'processing');
        localStorage.setItem('karsa_last_order_id', String(pesananBaru.id));
        localStorage.setItem('karsa_order_stage', '0');
        
        // ===== REDUCE STOCK (Feature 2) =====
        cart.forEach(item => { if (window.reduceStock) window.reduceStock(item.name, item.qty); });
        // ===== LOG PEAK HOUR (Feature 4) =====
        if (typeof logPeakHour === 'function') logPeakHour();
        // Clear Cart
        localStorage.setItem('karsa_cart', JSON.stringify([]));
        if (window.updateCartUI) window.updateCartUI();
        
        // Close modal
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.classList.remove('show');
            setTimeout(() => cartModal.classList.add('hidden'), 300);
        }
        
        // Show Receipt Modal
        const receiptModal = document.getElementById('receiptModal');
        if (receiptModal) {
            const receiptTable = document.getElementById('receiptTable');
            const receiptTime = document.getElementById('receiptTime');
            const receiptItems = document.getElementById('receiptItems');
            const receiptTotal = document.getElementById('receiptTotal');
            if (receiptTable) receiptTable.textContent = 'Meja ' + tableNum;
            if (receiptTime) receiptTime.textContent = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            if (receiptItems) {
                receiptItems.innerHTML = cart.map(item =>
                    `<div class="flex justify-between items-center text-sm">
                        <span class="text-stone-300">${item.qty}x ${item.name}</span>
                        <span class="text-amber-400 font-bold">Rp ${(item.price * item.qty).toLocaleString('id-ID')}</span>
                    </div>`
                ).join('');
            }
            if (receiptTotal) receiptTotal.textContent = 'Rp ' + total.toLocaleString('id-ID');
            receiptModal.classList.remove('hidden');
            receiptModal.classList.add('flex');
        } else {
            alert('Pesananmu senilai Rp ' + total.toLocaleString('id-ID') + ' sedang diproses!');
        }
        checkETA();
    };

    if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);
    if (finalCheckoutBtn) finalCheckoutBtn.addEventListener('click', handleCheckout);
    
    // Check ETA on load
    checkETA();
    setInterval(checkETA, 1000);
}

// ===== LIVE CLOCK & CAFE STATUS (Feature 3) =====
function initLiveClock() {
    const clockEl = document.getElementById('liveClockDisplay');
    const dotEl = document.getElementById('cafeStatusDot');
    const labelEl = document.getElementById('cafeStatusLabel');
    if (!clockEl) return;

    function updateClock() {
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes();
        const s = now.getSeconds();
        clockEl.textContent = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');

        const isOpen = h >= 8 && (h < 24); // Open 08:00 - 00:00 (midnight)
        if (isOpen) {
            dotEl.className = 'w-2 h-2 rounded-full bg-green-400 animate-pulse';
            labelEl.textContent = 'Open Now';
            labelEl.className = 'text-green-400 text-[10px] font-black uppercase tracking-widest';
            // Re-enable checkout buttons only
            document.querySelectorAll('#checkoutMenuBtn, #finalCheckoutBtn').forEach(btn => {
                btn.disabled = false;
                btn.style.opacity = '';
                btn.style.cursor = '';
                btn.title = '';
            });
        } else {
            dotEl.className = 'w-2 h-2 rounded-full bg-red-400 animate-pulse';
            labelEl.textContent = 'Closed';
            labelEl.className = 'text-red-400 text-[10px] font-black uppercase tracking-widest';
            // Disable only CHECKOUT buttons (not Tambah — let customers browse)
            document.querySelectorAll('#checkoutMenuBtn, #finalCheckoutBtn').forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.45';
                btn.style.cursor = 'not-allowed';
                btn.title = 'Kafe tutup. Buka pukul 08:00 WIB';
            });
        }
    }

    updateClock();
    setInterval(updateClock, 1000);
}

// ===== SEARCH BAR GLOBAL (Feature 4) =====
function initSearchBar() {
    const searchInput = document.getElementById('menuSearchBar');
    const noResult = document.getElementById('searchNoResult');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        const cards = document.querySelectorAll('.menu-item');
        let found = 0;

        cards.forEach(card => {
            const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
            const match = !q || name.includes(q) || desc.includes(q);
            if (match) {
                card.style.display = '';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
                found++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.85)';
                // Use closure-safe snapshot of query
                const capturedQ = q;
                setTimeout(() => {
                    // Only hide if the card still doesn't match current query
                    const currentQ = searchInput.value.trim().toLowerCase();
                    const currentName = card.querySelector('h3')?.textContent.toLowerCase() || '';
                    const currentDesc = card.querySelector('p')?.textContent.toLowerCase() || '';
                    if (!currentName.includes(currentQ) && !currentDesc.includes(currentQ)) {
                        card.style.display = 'none';
                    }
                }, 280);
            }
        });

        if (noResult) noResult.classList.toggle('hidden', found > 0 || !q);
    });
}

// ===== RATING MODAL (Feature 2) =====
function initRatingModal() {
    let selectedRating = 0;
    const modal = document.getElementById('ratingModal');
    const stars = document.querySelectorAll('.rating-star');
    const feedbackBox = document.getElementById('ratingFeedbackBox');
    const thankMsg = document.getElementById('ratingThankMsg');
    const submitBtn = document.getElementById('submitRatingBtn');
    const closeReceiptBtn = document.getElementById('closeReceiptBtn');

    if (!modal) return;

    // Clicking "Selesai" on receipt opens rating modal
    if (closeReceiptBtn) {
        closeReceiptBtn.addEventListener('click', () => {
            // Close receipt
            const receiptModal = document.getElementById('receiptModal');
            if (receiptModal) {
                receiptModal.classList.add('hidden');
                receiptModal.classList.remove('flex');
            }
            // Reset rating UI
            selectedRating = 0;
            stars.forEach(s => s.textContent = '\u2606');
            if (feedbackBox) feedbackBox.classList.add('hidden');
            if (thankMsg) thankMsg.classList.add('hidden');
            if (document.getElementById('ratingFeedbackText')) document.getElementById('ratingFeedbackText').value = '';
            // Show rating modal
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        });
    }

    // Star hover & click
    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const val = parseInt(star.dataset.val);
            stars.forEach((s, i) => { s.textContent = i < val ? '\u2605' : '\u2606'; });
        });
        star.addEventListener('mouseleave', () => {
            stars.forEach((s, i) => { s.textContent = i < selectedRating ? '\u2605' : '\u2606'; });
        });
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.val);
            stars.forEach((s, i) => { s.textContent = i < selectedRating ? '\u2605' : '\u2606'; });
            // Conditional display
            if (selectedRating <= 3) {
                if (feedbackBox) feedbackBox.classList.remove('hidden');
                if (thankMsg) thankMsg.classList.add('hidden');
            } else {
                if (feedbackBox) feedbackBox.classList.add('hidden');
                if (thankMsg) thankMsg.classList.remove('hidden');
            }
        });
    });

    // Submit rating
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            if (!selectedRating) { alert('Tap bintang dulu ya!'); return; }
            const feedback = document.getElementById('ratingFeedbackText')?.value || '';
            // Save to localStorage
            let ratings = [];
            try { ratings = JSON.parse(localStorage.getItem('karsa_ratings')) || []; } catch(e) {}
            ratings.push({ rating: selectedRating, feedback, waktu: new Date().toLocaleString('id-ID') });
            localStorage.setItem('karsa_ratings', JSON.stringify(ratings));
            // Close modal
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            // Show thank you toast
            const toastEl = document.createElement('div');
            toastEl.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);z-index:9999;background:#16a34a;color:#fff;padding:14px 28px;border-radius:14px;font-weight:800;font-size:13px;box-shadow:0 8px 30px rgba(0,0,0,0.3);animation:slideIn 0.4s ease;';
            toastEl.textContent = selectedRating >= 4 ? '\u2B50 Terima kasih atas bintang ' + selectedRating + '-mu!' : '\uD83D\uDC4D Masukan kamu dicatat! Terima kasih.';
            document.body.appendChild(toastEl);
            setTimeout(() => toastEl.remove(), 3500);
        });
    }
}

// ===== ORDER PROGRESS BAR (Feature 5) =====
function initOrderProgress() {
    function renderProgress() {
        const widget = document.getElementById('orderProgressWidget');
        if (!widget) return;
        const stage = parseInt(localStorage.getItem('karsa_order_stage') || '0');
        const orderId = localStorage.getItem('karsa_last_order_id');
        if (!orderId) return;

        widget.classList.remove('hidden');

        const dots = [document.querySelector('#pstep0 .prog-dot'), document.querySelector('#pstep1 .prog-dot'), document.querySelector('#pstep2 .prog-dot')];
        const labels = [document.querySelector('#pstep0 .prog-label'), document.querySelector('#pstep1 .prog-label'), document.querySelector('#pstep2 .prog-label')];
        const line1 = document.getElementById('progLine1');
        const line2 = document.getElementById('progLine2');
        const statusText = document.getElementById('progressStatusText');
        const messages = ['Pesanan Diterima \u2705', 'Sedang Diracik \u2615', 'Siap Diantar! \uD83C\uDF89'];

        dots.forEach((dot, i) => {
            if (!dot) return;
            dot.className = 'prog-dot';
            if (i < stage) dot.classList.add('done');
            else if (i === stage) dot.classList.add('active');
        });
        labels.forEach((lbl, i) => {
            if (!lbl) return;
            lbl.className = 'prog-label';
            if (i < stage) lbl.classList.add('done');
            else if (i === stage) lbl.classList.add('active');
        });
        if (line1) line1.className = 'prog-line' + (stage >= 1 ? ' active' : '');
        if (line2) line2.className = 'prog-line' + (stage >= 2 ? ' active' : '');
        if (statusText) statusText.textContent = messages[Math.min(stage, 2)];
    }

    renderProgress();
    setInterval(renderProgress, 2000);
}


function checkETA() {
    const orderTime = localStorage.getItem('karsa_order_time');
    const status = localStorage.getItem('karsa_order_status');
    const etaWidget = document.getElementById('etaWidget');
    const etaTitle = document.getElementById('etaTitle');
    const etaCountdown = document.getElementById('etaCountdown');
    const etaIcon = document.getElementById('etaIcon');
    
    if (!etaWidget || !orderTime || status !== 'processing') return;
    
    const waitTime = 10 * 60 * 1000; // 10 minutes
    const elapsed = Date.now() - parseInt(orderTime);
    const remaining = waitTime - elapsed;
    
    etaWidget.classList.remove('hidden');
    // Allow display:flex to apply before transition
    setTimeout(() => {
        etaWidget.classList.remove('opacity-0', 'translate-y-32');
        etaWidget.classList.add('opacity-100', 'translate-y-0');
    }, 10);
    
    if (remaining > 0) {
        const min = Math.floor(remaining / 60000);
        const sec = Math.floor((remaining % 60000) / 1000);
        if (etaCountdown) etaCountdown.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
        if (etaTitle) {
            etaTitle.textContent = 'Pesananmu sedang diracik';
            etaTitle.classList.remove('animate-pulse-fast', 'text-amber-500');
        }
        if (etaIcon) {
            etaIcon.textContent = '⏳';
            etaIcon.classList.add('animate-spin-slow');
            etaIcon.classList.remove('bg-green-100', 'text-green-600');
        }
    } else {
        if (etaCountdown) etaCountdown.textContent = 'SIAP!';
        if (etaTitle) {
            etaTitle.textContent = 'Pesanan Siap Diambil/Diantar!';
            etaTitle.classList.add('animate-pulse-fast', 'text-amber-500');
        }
        if (etaIcon) {
            etaIcon.textContent = '✅';
            etaIcon.classList.remove('animate-spin-slow');
            etaIcon.classList.add('bg-green-100', 'text-green-600');
        }
        // Change status to done after 10s so it hides later? 
        // Let's just keep it showing until they dismiss it or we just leave it.
    }
}

function checkAuth() {
    const name = localStorage.getItem('karsa_user_name');
    const table = localStorage.getItem('karsa_table_number');
    if (!name || !table) {
        triggerPageTransition('login.html');
        return false;
    }
    return true;
}


// ===== GALLERY LIGHTBOX =====
function initGalleryLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeLightbox = document.getElementById('closeLightbox');
  const galleryImages = document.querySelectorAll('.gallery-img');
  
  if (!lightbox || !lightboxImg || !closeLightbox) return;
  
  galleryImages.forEach(img => {
      img.addEventListener('click', () => {
          lightboxImg.src = img.src;
          lightbox.classList.remove('hidden');
          lightbox.classList.add('flex');
          setTimeout(() => {
              lightbox.classList.add('opacity-100');
              lightboxImg.classList.remove('scale-95');
              lightboxImg.classList.add('scale-100');
          }, 10);
      });
  });
  
  const hideLightbox = () => {
      lightbox.classList.remove('opacity-100');
      lightboxImg.classList.remove('scale-100');
      lightboxImg.classList.add('scale-95');
      setTimeout(() => {
          lightbox.classList.add('hidden');
          lightbox.classList.remove('flex');
      }, 300);
  };
  
  closeLightbox.addEventListener('click', hideLightbox);
  lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) hideLightbox();
  });
}

// ===== PWA OFFLINE DETECTION =====
function initOfflineDetection() {
  const offlineToast = document.getElementById('offlineToast');
  if (!offlineToast) return;
  
  const showToast = () => {
      offlineToast.classList.remove('opacity-0', '-translate-y-32');
      offlineToast.classList.add('opacity-100', 'translate-y-0');
  };
  
  const hideToast = () => {
      offlineToast.classList.add('opacity-0', '-translate-y-32');
      offlineToast.classList.remove('opacity-100', 'translate-y-0');
  };
  
  window.addEventListener('offline', showToast);
  window.addEventListener('online', hideToast);
  
  if (!navigator.onLine) showToast();
}

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  if (!cursor) return;
  
  // Hide custom cursor on touch devices
  if (window.matchMedia("(pointer: coarse)").matches) {
    cursor.style.display = 'none';
    return;
  }
  
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  
  const interactables = document.querySelectorAll('a, button, input, select, textarea, .menu-card, .gallery-img, label');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
  });
  
  document.addEventListener('mousedown', () => cursor.classList.add('cursor-click'));
  document.addEventListener('mouseup', () => cursor.classList.remove('cursor-click'));
}

// ===== DYNAMIC TAB TITLE =====
function initDynamicTitle() {
  let originalTitle = document.title;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      document.title = "Kopi Susu Karsa Menunggumu! ☕";
    } else {
      document.title = originalTitle;
    }
  });
}

// ===== PWA SERVICE WORKER =====
function initPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initNavbar();
  initMenuFilter();
  initTestimonialSlider();
  initFadeIn();
  initForm();
  initAreaSelection();
  initLoginRedirect();
  initOrderMemory();
  initCapacityLogic();
  initAmbientSound();
  initCartSimulation();
  initSmartGreeting();
  initMenuCalculator();
  initLiveChat();
  initGalleryLightbox();
  initOfflineDetection();
  initCustomCursor();
  initDynamicTitle();
  initPageTransition();
  initPWA();
  initDatePicker();
  initBeforeAfterSlider();
  initAOS();
  // ===== PREVIOUS FEATURES =====
  initLiveClock();
  initSearchBar();
  initRatingModal();
  initOrderProgress();
  // ===== 8 NEW FEATURES =====
  initInventory();
  initAntiDoubleBooking();
  initDownloadPDF();
  initWaiterCall();
  initPaymentPicker();
  initDailySpecials();
});

// ===== SHARE ORDER =====
function shareOrder() {
    const cart = JSON.parse(localStorage.getItem('karsa_cart')) || [];
    const table = localStorage.getItem('karsa_login_table') || '-';
    if (cart.length === 0) return alert('Keranjang masih kosong!');
    
    const itemsText = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
    const waText = `Baru aja pesen kopi di Kafe Karsa! Gue pesen ${itemsText} di Meja ${table}. Yuk nyusul! Cek di karsa-cafe.vercel.app`;
    window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`, '_blank');
}

// ===== FEATURE 1: INVENTORY / SMART STOCK SYSTEM =====
function initInventory() {
    // Default stock per menu item
    const defaultStock = {
        'Kopi Susu Karsa': 20, 'Iced Americano': 15, 'Matcha Latte': 12,
        'Red Velvet Latte': 10, 'Nasi Goreng Katsu': 8, 'Indomie Spesial': 15,
        'Mix Platter': 6
    };
    if (!localStorage.getItem('karsa_inventory')) {
        localStorage.setItem('karsa_inventory', JSON.stringify(defaultStock));
    }
    window.updateStockUI = function() {
        let inv = {};
        try { inv = JSON.parse(localStorage.getItem('karsa_inventory')) || {}; } catch(e) {}
        document.querySelectorAll('.menu-item').forEach(card => {
            const nameEl = card.querySelector('h3');
            if (!nameEl) return;
            const name = nameEl.textContent.trim();
            const stock = inv[name];
            if (stock === undefined) return;
            const imgEl = card.querySelector('img');
            const btn = card.querySelector('.tambah-keranjang-btn');
            // Remove old badges
            card.querySelectorAll('.stock-badge').forEach(b => b.remove());
            if (stock <= 0) {
                // SOLD OUT
                if (imgEl) imgEl.style.filter = 'grayscale(100%)';
                if (btn) { btn.disabled = true; btn.textContent = 'Sold Out'; btn.style.opacity = '0.4'; btn.style.cursor = 'not-allowed'; }
                const badge = document.createElement('div');
                badge.className = 'stock-badge';
                badge.style.cssText = 'position:absolute;top:10px;left:10px;background:#ef4444;color:#fff;font-size:10px;font-weight:900;padding:4px 12px;border-radius:8px;z-index:5;text-transform:uppercase;letter-spacing:0.1em;';
                badge.textContent = 'Sold Out';
                card.style.position = 'relative';
                card.appendChild(badge);
            } else if (stock <= 3) {
                // LOW STOCK
                if (imgEl) imgEl.style.filter = '';
                if (btn) { btn.disabled = false; btn.style.opacity = ''; btn.style.cursor = ''; }
                const badge = document.createElement('div');
                badge.className = 'stock-badge';
                badge.style.cssText = 'position:absolute;top:10px;left:10px;background:#f59e0b;color:#fff;font-size:10px;font-weight:900;padding:4px 12px;border-radius:8px;z-index:5;text-transform:uppercase;letter-spacing:0.1em;animation:pulse 1.5s infinite;';
                badge.textContent = 'Stok Terbatas! (' + stock + ')';
                card.style.position = 'relative';
                card.appendChild(badge);
            } else {
                if (imgEl) imgEl.style.filter = '';
                if (btn) { btn.disabled = false; btn.style.opacity = ''; btn.style.cursor = ''; }
            }
        });
        // Also update sidebar cart items
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            const name = btn.dataset.name;
            if (name && inv[name] !== undefined && inv[name] <= 0) {
                btn.disabled = true; btn.textContent = 'Sold Out'; btn.style.opacity = '0.4';
            }
        });
    };
    window.reduceStock = function(name, qty) {
        let inv = {};
        try { inv = JSON.parse(localStorage.getItem('karsa_inventory')) || {}; } catch(e) {}
        if (inv[name] !== undefined) {
            inv[name] = Math.max(0, inv[name] - qty);
            localStorage.setItem('karsa_inventory', JSON.stringify(inv));
        }
        if (window.updateStockUI) window.updateStockUI();
    };
    window.updateStockUI();
    setInterval(window.updateStockUI, 5000);
}

// ===== FEATURE 2: ANTI-DOUBLE BOOKING =====
function initAntiDoubleBooking() {
    // Wrap existing checkout to add double-booking protection
    const origHandleCheckout = function() {
        if (!checkAuth()) return;
        const userName = localStorage.getItem('karsa_user_name');
        // Check for active order
        let pesanan = [];
        try { pesanan = JSON.parse(localStorage.getItem('karsa_pesanan_masuk')) || []; } catch(e) {}
        const activeOrder = pesanan.find(p => p.nama === userName && (p.status === 'menunggu' || p.status === 'dikonfirmasi'));
        if (activeOrder) {
            showToast('⚠️ Kamu masih punya pesanan aktif yang belum selesai!', '#ef4444');
            return false;
        }
        return true; // allow
    };
    window._checkDoubleBooking = origHandleCheckout;
}

// ===== FEATURE 3: DOWNLOAD PDF RECEIPT =====
function initDownloadPDF() {
    const dlBtn = document.getElementById('downloadReceiptBtn');
    if (!dlBtn) return;
    dlBtn.addEventListener('click', function() {
        if (typeof window.jspdf === 'undefined' && typeof jspdf === 'undefined') {
            showToast('⏳ Memuat PDF generator...', '#f59e0b');
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            s.onload = () => generatePDF();
            document.head.appendChild(s);
        } else {
            generatePDF();
        }
    });
}
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: [80, 200] }); // receipt width
    const userName = localStorage.getItem('karsa_user_name') || 'Pelanggan';
    const tableNum = localStorage.getItem('karsa_table_number') || '-';
    const receiptTotal = document.getElementById('receiptTotal')?.textContent || 'Rp 0';
    const timeStr = document.getElementById('receiptTime')?.textContent || '--:--';
    // Header
    doc.setFillColor(44, 26, 18);
    doc.rect(0, 0, 80, 30, 'F');
    doc.setTextColor(245, 158, 11);
    doc.setFontSize(16);
    doc.text('KARSA CAFE', 40, 12, { align: 'center' });
    doc.setFontSize(7);
    doc.setTextColor(180, 160, 140);
    doc.text('Jl. Belibis, Air Tawar Barat, Padang', 40, 18, { align: 'center' });
    doc.text('Digital Receipt', 40, 23, { align: 'center' });
    // Info
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    let y = 36;
    doc.text('Nama: ' + userName, 5, y); y += 6;
    doc.text('Meja: ' + tableNum, 5, y);
    doc.text('Waktu: ' + timeStr, 45, y); y += 8;
    // Separator
    doc.setDrawColor(200); doc.line(5, y, 75, y); y += 6;
    // Items
    doc.setFontSize(8);
    const itemEls = document.querySelectorAll('#receiptItems > div');
    itemEls.forEach(el => {
        const spans = el.querySelectorAll('span');
        if (spans.length >= 2) {
            doc.text(spans[0].textContent, 5, y);
            doc.text(spans[1].textContent, 75, y, { align: 'right' });
            y += 5;
        }
    });
    // Total
    y += 3;
    doc.setDrawColor(200); doc.line(5, y, 75, y); y += 6;
    doc.setFontSize(11);
    doc.setTextColor(180, 83, 9);
    doc.text('TOTAL: ' + receiptTotal, 40, y, { align: 'center' }); y += 8;
    // Footer
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text('Terima kasih sudah mampir di Karsa Cafe!', 40, y, { align: 'center' }); y += 4;
    doc.text(new Date().toLocaleDateString('id-ID'), 40, y, { align: 'center' });
    doc.save('Nota-Karsa-Cafe-' + Date.now() + '.pdf');
    showToast('📄 Nota berhasil diunduh!', '#22c55e');
}

// ===== FEATURE 4: PEAK HOUR ANALYTICS (data logging) =====
function logPeakHour() {
    const hour = new Date().getHours();
    let peakData = {};
    try { peakData = JSON.parse(localStorage.getItem('karsa_peak_hours')) || {}; } catch(e) {}
    peakData[hour] = (peakData[hour] || 0) + 1;
    localStorage.setItem('karsa_peak_hours', JSON.stringify(peakData));
}

// ===== FEATURE 5: DIGITAL WAITER CALL =====
function initWaiterCall() {
    const bellBtn = document.getElementById('waiterCallBtn');
    const popup = document.getElementById('waiterCallPopup');
    if (!bellBtn || !popup) return;
    bellBtn.addEventListener('click', () => {
        popup.classList.toggle('hidden');
        setTimeout(() => popup.classList.toggle('scale-0'), 10);
    });
    document.addEventListener('click', e => {
        if (!bellBtn.contains(e.target) && !popup.contains(e.target)) {
            popup.classList.add('scale-0');
            setTimeout(() => popup.classList.add('hidden'), 300);
        }
    });
    document.querySelectorAll('.waiter-call-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const type = opt.dataset.service;
            const tableNum = localStorage.getItem('karsa_table_number') || '?';
            const userName = localStorage.getItem('karsa_user_name') || 'Pelanggan';
            // Save call to localStorage for kasir
            let calls = [];
            try { calls = JSON.parse(localStorage.getItem('karsa_waiter_calls')) || []; } catch(e) {}
            calls.push({ id: Date.now(), meja: tableNum, nama: userName, layanan: type, waktu: new Date().toLocaleString('id-ID'), status: 'aktif' });
            localStorage.setItem('karsa_waiter_calls', JSON.stringify(calls));
            popup.classList.add('scale-0');
            setTimeout(() => popup.classList.add('hidden'), 300);
            showToast('🔔 Permintaan "' + type + '" telah dikirim ke kasir!', '#22c55e');
        });
    });
}

// ===== FEATURE 6: MULTI-PAYMENT PICKER =====
function initPaymentPicker() {
    const picker = document.getElementById('paymentMethodPicker');
    if (!picker) return;
    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('payment-active'));
            opt.classList.add('payment-active');
            const method = opt.dataset.method;
            localStorage.setItem('karsa_payment_method', method);
            const qrisPanel = document.getElementById('qrisPanel');
            const tunaiPanel = document.getElementById('tunaiPanel');
            const transferPanel = document.getElementById('transferPanel');
            if (qrisPanel) qrisPanel.classList.toggle('hidden', method !== 'qris');
            if (tunaiPanel) tunaiPanel.classList.toggle('hidden', method !== 'tunai');
            if (transferPanel) transferPanel.classList.toggle('hidden', method !== 'transfer');
        });
    });
}

// ===== FEATURE 7: DAILY SPECIALS FLIP CARD =====
function initDailySpecials() {
    const container = document.getElementById('dailySpecialsContainer');
    if (!container) return;
    const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    const specials = [
        { name: 'Sunday Brunch Latte', desc: 'Espresso + susu oat + karamel', promo: 'Beli 1 Gratis 1!', price: 'Rp 22.000', img: 'images/kopi-susu-karsa.png', ingredients: 'Espresso shot, Oat Milk, Caramel Drizzle, Vanilla Foam' },
        { name: 'Monday Blues Mocha', desc: 'Dark choco + espresso kuat', promo: 'Diskon 20%', price: 'Rp 20.000', img: 'images/kopi-susu-karsa.png', ingredients: 'Double Espresso, Dark Chocolate, Whipped Cream, Cocoa' },
        { name: 'Tropical Tuesday', desc: 'Matcha + coconut milk', promo: 'Free Topping!', price: 'Rp 24.000', img: 'images/matcha-latte.png', ingredients: 'Premium Matcha, Coconut Milk, Palm Sugar, Nata de Coco' },
        { name: 'Rabu Rasa Nusantara', desc: 'Kopi gula aren spesial', promo: 'Bonus Pisang Goreng', price: 'Rp 18.000', img: 'images/kopi-susu-karsa.png', ingredients: 'Single Origin Coffee, Gula Aren, Fresh Milk, Ice' },
        { name: 'Kamis Cozy Chai', desc: 'Chai tea latte rempah', promo: 'Paket + Roti Bakar', price: 'Rp 25.000', img: 'images/matcha-latte.png', ingredients: 'Chai Tea, Cinnamon, Cardamom, Steamed Milk, Honey' },
        { name: 'Jumat Berkah Combo', desc: 'Nasi Katsu + Es Kopi', promo: 'Hemat Rp 10.000!', price: 'Rp 35.000', img: 'images/nasi-goreng-katsu.png', ingredients: 'Chicken Katsu, Nasi Hangat, Salad, Es Kopi Susu' },
        { name: 'Sabtu Seru Platter', desc: 'Mix platter sharing', promo: 'Free 2 Minuman!', price: 'Rp 50.000', img: 'images/mix-platter.png', ingredients: 'Chicken Wings, Fries, Sausage, Nachos, 2 Drinks' }
    ];
    const todayIdx = new Date().getDay();
    const todaySpecial = specials[todayIdx];
    container.innerHTML = `
        <div class="flip-card mx-auto" style="max-width:320px; height:380px; perspective:1000px; cursor:pointer;">
            <div class="flip-card-inner" style="position:relative; width:100%; height:100%; transition:transform 0.7s cubic-bezier(0.4,0,0.2,1); transform-style:preserve-3d;">
                <div class="flip-card-front" style="position:absolute; width:100%; height:100%; backface-visibility:hidden; border-radius:20px; overflow:hidden; box-shadow:0 0 0 2px rgba(245,158,11,0.5),0 20px 50px rgba(0,0,0,0.3);">
                    <div style="height:55%; overflow:hidden; position:relative;">
                        <img src="${todaySpecial.img}" style="width:100%; height:100%; object-fit:cover;">
                        <div style="position:absolute;top:12px;right:12px;background:linear-gradient(135deg,#d97706,#b45309);color:#fff;font-size:9px;font-weight:900;padding:5px 14px;border-radius:8px;text-transform:uppercase;letter-spacing:0.08em;">${todaySpecial.promo}</div>
                        <div style="position:absolute;top:12px;left:12px;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);color:#f59e0b;font-size:9px;font-weight:900;padding:5px 12px;border-radius:8px;text-transform:uppercase;letter-spacing:0.12em;">🔥 ${days[todayIdx]}</div>
                    </div>
                    <div style="padding:20px; background:#fff;">
                        <p style="color:#b45309;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 6px;">✨ Menu Spesial Hari Ini</p>
                        <h4 style="font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:#3e2723;margin:0 0 4px;">${todaySpecial.name}</h4>
                        <p style="color:#78716c;font-size:12px;margin:0 0 12px;">${todaySpecial.desc}</p>
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="color:#b45309;font-weight:900;font-size:16px;">${todaySpecial.price}</span>
                            <span style="color:#a8a29e;font-size:10px;font-weight:600;">Tap untuk detail →</span>
                        </div>
                    </div>
                </div>
                <div class="flip-card-back" style="position:absolute; width:100%; height:100%; backface-visibility:hidden; transform:rotateY(180deg); border-radius:20px; overflow:hidden; background:linear-gradient(135deg,#2c1a12,#1a100a); border:1px solid rgba(245,158,11,0.3); display:flex; flex-direction:column; justify-content:center; padding:32px;">
                    <p style="color:rgba(245,158,11,0.5);font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.2em;margin:0 0 8px;">📋 Detail Bahan</p>
                    <h4 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#fff;margin:0 0 16px;">${todaySpecial.name}</h4>
                    <div style="space-y:8px;">
                        ${todaySpecial.ingredients.split(', ').map(i => '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);"><span style="color:#f59e0b;font-size:14px;">•</span><span style="color:rgba(255,255,255,0.7);font-size:13px;">' + i + '</span></div>').join('')}
                    </div>
                    <div style="margin-top:20px;padding:12px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.25);border-radius:12px;text-align:center;">
                        <p style="color:#f59e0b;font-size:11px;font-weight:800;margin:0;">${todaySpecial.promo}</p>
                        <p style="color:rgba(255,255,255,0.4);font-size:9px;margin:4px 0 0;">Berlaku hari ini saja</p>
                    </div>
                </div>
            </div>
        </div>`;
    const flipCard = container.querySelector('.flip-card');
    let flipped = false;
    flipCard.addEventListener('click', () => {
        flipped = !flipped;
        flipCard.querySelector('.flip-card-inner').style.transform = flipped ? 'rotateY(180deg)' : '';
    });
}

// ===== GLOBAL TOAST =====
function showToast(msg, color) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);z-index:99999;background:' + (color || '#22c55e') + ';color:#fff;padding:14px 28px;border-radius:14px;font-weight:800;font-size:13px;box-shadow:0 8px 30px rgba(0,0,0,0.3);animation:slideIn 0.4s ease;white-space:nowrap;';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3500);
}
