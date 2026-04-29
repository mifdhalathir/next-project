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
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
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
    const dateInput = document.getElementById('resTanggal');
    if (dateInput && typeof flatpickr !== 'undefined') {
        flatpickr(dateInput, {
            minDate: "today",
            dateFormat: "Y-m-d",
            disableMobile: "true"
        });
    }
}

// ===== FORM & CONFETTI =====
function initForm() {
    const form = document.getElementById('reservasiForm');
    const btn = form ? form.querySelector('button[type="submit"]') : null;
    const successToast = document.getElementById('successToast');
    
    if (form) {
        form.onsubmit = e => {
            e.preventDefault();
            
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
            
            const nama = document.getElementById('resNama').value;
            const jumlah = document.getElementById('resJumlah').value;
            const tanggal = document.getElementById('resTanggal').value;
            const jam = document.getElementById('resJam').value;
            const catatan = document.getElementById('resCatatan').value;
            
            if(successToast) {
                successToast.classList.remove('opacity-0', '-translate-y-32');
                successToast.classList.add('opacity-100', 'translate-y-0');
            }
            
            setTimeout(() => {
                const message = `Halo Karsa Cafe, saya ${nama} ingin reservasi untuk ${jumlah} orang pada tanggal ${tanggal} jam ${jam}. Catatan: ${catatan || '-'}`;
                const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
                window.open(waUrl, '_blank');
                
                form.reset();
                btn.textContent = originalText;
                if(successToast) {
                    successToast.classList.add('opacity-0', '-translate-y-32');
                    successToast.classList.remove('opacity-100', 'translate-y-0');
                }
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
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('userName').value.trim();
      const table = document.getElementById('tableNumber').value;
      
      if (!name || !table) {
        alert('Eits! Isi namamu dan pilih nomor meja dulu ya!');
        return;
      }
      
      const btn = document.getElementById('loginBtn');
      if(btn) {
        btn.textContent = 'Memproses...';
        btn.disabled = true;
      }
      
      // Save to localStorage
      localStorage.setItem('karsa_user_name', name);
      localStorage.setItem('karsa_table_number', table);
      
      setTimeout(function() {
         triggerPageTransition('index.html');
      }, 1000);
    });
  }
}


// ===== ORDER MEMORY (REMEMBER ME) =====
function initOrderMemory() {
  const savedName = localStorage.getItem('karsa_user_name');
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

// ===== CAPACITY LOGIC =====
function initCapacityLogic() {
  const statusMeja = document.getElementById('statusMeja');
  if (!statusMeja) return; // Only run if on page with status meja

  const indoorPercentage = Math.floor(Math.random() * 61) + 40; // 40% to 100%
  const outdoorPercentage = Math.floor(Math.random() * 61) + 20; // 20% to 80%
  
  const indoorStatusEl = document.getElementById('indoorStatus');
  const indoorBarEl = document.getElementById('indoorBar');
  const indoorTextEl = document.getElementById('indoorText');
  const indoorDot = document.getElementById('indoorDot');
  
  if (indoorStatusEl && indoorBarEl && indoorTextEl && indoorDot) {
      indoorStatusEl.textContent = `${indoorPercentage}% Terisi`;
      indoorBarEl.style.width = `${indoorPercentage}%`;
      
      if (indoorPercentage > 80) {
          indoorTextEl.innerHTML = `Saat ini area Indoor sedang <strong>Sangat Rame</strong>`;
          indoorBarEl.className = 'bg-red-500 h-3 rounded-full transition-all duration-1000';
          indoorDot.className = 'indicator-dot bg-red-500';
          indoorStatusEl.className = 'text-red-600 font-bold text-lg';
      } else if (indoorPercentage > 50) {
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
      outdoorStatusEl.textContent = `${outdoorPercentage}% Terisi`;
      outdoorBarEl.style.width = `${outdoorPercentage}%`;
      
      if (outdoorPercentage > 80) {
          outdoorTextEl.innerHTML = `Saat ini area Outdoor sedang <strong>Sangat Rame</strong>`;
          outdoorBarEl.className = 'bg-red-500 h-3 rounded-full transition-all duration-1000';
          outdoorDot.className = 'indicator-dot bg-red-500';
          outdoorStatusEl.className = 'text-red-600 font-bold text-lg';
      } else if (outdoorPercentage > 50) {
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

  // Waitlist Logic
  const waitlistIndicator = document.getElementById('waitlistIndicator');
  const waitlistText = document.getElementById('waitlistText');
  if (waitlistIndicator && waitlistText) {
      if (indoorPercentage > 80 || outdoorPercentage > 80) {
          waitlistText.textContent = 'Antrean saat ini sekitar 15 menit';
          waitlistIndicator.className = 'mt-8 mx-auto max-w-md bg-red-100 border-l-4 border-red-500 p-4 rounded-xl text-red-800 text-center shadow-md transition-all duration-300';
      } else {
          waitlistText.textContent = 'Meja tersedia, langsung gas ke lokasi!';
          waitlistIndicator.className = 'mt-8 mx-auto max-w-md bg-green-100 border-l-4 border-green-500 p-4 rounded-xl text-green-800 text-center shadow-md transition-all duration-300';
      }
  }
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
function initCartSimulation() {
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartModal = document.getElementById('cartModal');
  const cartSidebar = document.getElementById('cartSidebar');
  
  if (!openCartBtn || !cartModal) return;
  
  // Open modal
  openCartBtn.onclick = () => {
    cartModal.classList.remove('hidden');
    // small delay to allow display:block to apply before opacity transition
    setTimeout(() => {
      cartModal.classList.add('show');
    }, 10);
  };
  
  // Close modal
  const closeModal = () => {
    cartModal.classList.remove('show');
    setTimeout(() => {
      cartModal.classList.add('hidden');
    }, 300); // match transition duration
  };
  
  if(closeCartBtn) closeCartBtn.onclick = closeModal;
  cartModal.onclick = (e) => {
    if (e.target === cartModal) closeModal();
  };
  
  // Cart Logic
  let cart = [];
  const cartItemsList = document.getElementById('cartItemsList');
  const cartTotalPrice = document.getElementById('cartTotalPrice');
  const cartBadge = document.getElementById('cartBadge');
  
  function updateCartUI() {
    if (cart.length === 0) {
      cartItemsList.innerHTML = '<p class="text-stone-500 dark:text-stone-400 text-sm italic">Keranjang masih kosong.</p>';
      cartBadge.classList.add('hidden');
      cartTotalPrice.textContent = 'Rp 0';
      return;
    }
    
    let total = 0;
    cartItemsList.innerHTML = '';
    
    cart.forEach((item, index) => {
      total += item.price;
      const itemEl = document.createElement('div');
      itemEl.className = 'flex justify-between items-center bg-cream-100 dark:bg-stone-800 p-3 rounded-lg';
      itemEl.innerHTML = `
        <span class="text-sm font-bold text-wood-800 dark:text-cream-100">${item.name}</span>
        <div class="flex items-center gap-3">
            <span class="text-sm text-amber-700 font-semibold">Rp ${item.price.toLocaleString('id-ID')}</span>
            <button class="remove-btn text-red-500 hover:text-red-700 font-bold" data-index="${index}">&times;</button>
        </div>
      `;
      cartItemsList.appendChild(itemEl);
    });
    
    cartTotalPrice.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    cartBadge.textContent = cart.length;
    cartBadge.classList.remove('hidden');
    
    // Add remove listeners
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.onclick = (e) => {
        const idx = parseInt(e.target.dataset.index);
        cart.splice(idx, 1);
        updateCartUI();
      };
    });
  }
  
  // Add to cart buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.onclick = () => {
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      cart.push({ name, price });
      updateCartUI();
      
      // Feedback animation
      const originalText = btn.textContent;
      btn.textContent = 'Ditambahkan!';
      btn.classList.replace('bg-amber-100', 'bg-green-100');
      btn.classList.replace('text-amber-700', 'text-green-700');
      setTimeout(() => {
        btn.textContent = originalText;
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
function initMenuCalculator() {
    const minusBtns = document.querySelectorAll('.menu-min-btn');
    const plusBtns = document.querySelectorAll('.menu-plus-btn');
    const budgetToast = document.getElementById('budgetToast');
    const budgetTotal = document.getElementById('budgetTotal');
    const checkoutBtn = document.getElementById('checkoutMenuBtn');
    
    if (!budgetToast || !budgetTotal || !checkoutBtn) return;

    let cartItems = {};
    let total = 0;

    const updateCart = () => {
        budgetTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
        if (total > 0) {
            budgetToast.classList.remove('opacity-0', 'translate-y-32');
            budgetToast.classList.add('opacity-100', 'translate-y-0');
        } else {
            budgetToast.classList.add('opacity-0', 'translate-y-32');
            budgetToast.classList.remove('opacity-100', 'translate-y-0');
        }
    };

    plusBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const price = parseInt(btn.dataset.price);
            const qtySpan = btn.previousElementSibling;
            let qty = parseInt(qtySpan.textContent);
            
            qty++;
            qtySpan.textContent = qty;
            total += price;
            
            cartItems[name] = { price, qty };
            updateCart();
        });
    });

    minusBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const price = parseInt(btn.dataset.price);
            const qtySpan = btn.nextElementSibling;
            let qty = parseInt(qtySpan.textContent);
            
            if (qty > 0) {
                qty--;
                qtySpan.textContent = qty;
                total -= price;
                
                if (qty === 0) {
                    delete cartItems[name];
                } else {
                    cartItems[name] = { price, qty };
                }
                updateCart();
            }
        });
    });
    
    checkoutBtn.addEventListener('click', () => {
        if (!checkAuth()) return;
        if (total === 0) return;
        
        const userName = localStorage.getItem('karsa_user_name');
        const tableNum = localStorage.getItem('karsa_table_number');
        
        let msg = `Halo Karsa Cafe, saya ${userName} dari Meja ${tableNum} ingin memesan menu berikut:\n\n`;
        for (const [name, item] of Object.entries(cartItems)) {
            msg += `- ${name} (${item.qty}x) = Rp ${(item.price * item.qty).toLocaleString('id-ID')}\n`;
        }
        msg += `\n*Total: Rp ${total.toLocaleString('id-ID')}*`;
        
        const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, '_blank');
    });

    // Handle final checkout button in modal
    const finalCheckoutBtn = document.getElementById('finalCheckoutBtn');
    if (finalCheckoutBtn) {
        finalCheckoutBtn.addEventListener('click', () => {
            if (!checkAuth()) return;
            // Similar logic for cart modal could be added here if needed, 
            // but usually this would be handled by the cart simulation logic.
            alert('Pesananmu sedang diproses, ' + localStorage.getItem('karsa_user_name') + '!');
        });
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
});
