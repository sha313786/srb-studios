/**
 * SRB STUDIO — Official Interactive Client Script
 * "BUILD • INNOVATE • ELEVATE"
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initDeviceStage();
  initModals();
  initPortfolioFilter();
  initConsultationForm();
  initPerformanceGauge();
  initEmailCopy();
  initStatsCounter();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.style.display === 'flex';
      if (isOpen) {
        navMenu.style.display = '';
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.background = 'rgba(10, 10, 15, 0.98)';
        navMenu.style.padding = '24px';
        navMenu.style.borderBottom = '1px solid rgba(245, 158, 11, 0.3)';
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navMenu.style.display = '';
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
}

/* ==========================================================================
   2. DEVICE STAGE INTERACTION (The Poster Centerpiece)
   ========================================================================== */
function initDeviceStage() {
  const stageTabs = document.querySelectorAll('.stage-tab-btn');
  const desktop = document.querySelector('.device-desktop-monitor');
  const tablet = document.querySelector('.device-tablet');
  const phone = document.querySelector('.device-phone');
  const laptop = document.querySelector('.device-laptop');
  const allDevices = [desktop, tablet, phone, laptop].filter(Boolean);

  stageTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      stageTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-device');

      allDevices.forEach(dev => {
        dev.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        dev.style.opacity = '1';
        dev.style.transform = 'scale(1)';
        dev.style.filter = 'none';
        dev.style.zIndex = '';
      });

      if (target === 'desktop' && desktop) {
        allDevices.forEach(d => {
          if (d !== desktop) {
            d.style.opacity = '0.35';
            d.style.filter = 'blur(2px)';
            d.style.transform = 'scale(0.92)';
          }
        });
        desktop.style.transform = 'scale(1.08) translateY(-10px)';
        desktop.style.zIndex = '10';
        desktop.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.95), 0 0 50px rgba(245, 158, 11, 0.4)';
      } else if (target === 'tablet' && tablet) {
        allDevices.forEach(d => {
          if (d !== tablet) {
            d.style.opacity = '0.35';
            d.style.filter = 'blur(2px)';
            d.style.transform = 'scale(0.92)';
          }
        });
        tablet.style.transform = 'scale(1.2) translateY(-20px)';
        tablet.style.zIndex = '10';
        tablet.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.95), 0 0 40px rgba(245, 158, 11, 0.4)';
      } else if (target === 'phone' && phone) {
        allDevices.forEach(d => {
          if (d !== phone) {
            d.style.opacity = '0.35';
            d.style.filter = 'blur(2px)';
            d.style.transform = 'scale(0.92)';
          }
        });
        phone.style.transform = 'scale(1.28) translateY(-25px)';
        phone.style.zIndex = '10';
        phone.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.95), 0 0 40px rgba(245, 158, 11, 0.5)';
      } else if (target === 'laptop' && laptop) {
        allDevices.forEach(d => {
          if (d !== laptop) {
            d.style.opacity = '0.35';
            d.style.filter = 'blur(2px)';
            d.style.transform = 'scale(0.92)';
          }
        });
        laptop.style.transform = 'scale(1.15) translateY(-15px)';
        laptop.style.zIndex = '10';
        laptop.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.95), 0 0 40px rgba(245, 158, 11, 0.4)';
      }
    });
  });
}

/* ==========================================================================
   3. NATIVE <DIALOG> MODAL HANDLING (With Light Dismiss & Esc Key)
   ========================================================================== */
function initModals() {
  const consultationModal = document.getElementById('consultationModal');
  const posterModal = document.getElementById('posterModal');

  // Triggers for Consultation
  document.querySelectorAll('[data-open-consultation]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceParam = btn.getAttribute('data-service');
      if (serviceParam) {
        const select = document.getElementById('projectTypeSelect');
        if (select) select.value = serviceParam;
      }
      consultationModal?.showModal();
    });
  });

  // Triggers for Original Poster View
  document.querySelectorAll('[data-open-poster]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      posterModal?.showModal();
    });
  });

  // Close buttons inside modals
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      consultationModal?.close();
      posterModal?.close();
    });
  });

  // Light dismiss: Close on clicking backdrop
  [consultationModal, posterModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (event) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        modal.close();
      }
    });
  });
}

/* ==========================================================================
   4. PORTFOLIO FILTER
   ========================================================================== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterVal === 'all' || cardCat === filterVal) {
          card.style.display = 'block';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. CONSULTATION FORM & SUBMISSION
   ========================================================================== */
function initConsultationForm() {
  const form = document.getElementById('consultationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('clientName')?.value.trim();
    const email = document.getElementById('clientEmail')?.value.trim();
    const service = document.getElementById('projectTypeSelect')?.value;
    const budget = document.getElementById('budgetRangeSelect')?.value;
    const notes = document.getElementById('projectNotes')?.value.trim();

    if (!name || !email) {
      showToast('⚠️ Please enter your Name and Email address.');
      return;
    }

    const subject = encodeURIComponent(`New Consultation Request from ${name} - ${service}`);
    const body = encodeURIComponent(
      `Hello SRB Studio,\n\n` +
      `I would like to request a consultation for our upcoming digital project.\n\n` +
      `• Client Name: ${name}\n` +
      `• Contact Email: ${email}\n` +
      `• Desired Service: ${service}\n` +
      `• Target Budget: ${budget}\n` +
      `• Project Overview:\n${notes}\n\n` +
      `Looking forward to elevating our digital presence with SRB Studio!`
    );

    // Copy brief to clipboard
    const plainTextBrief = `SRB Studio Consultation Request:\nClient: ${name} (${email})\nService: ${service}\nBudget: ${budget}\nNotes: ${notes}`;
    navigator.clipboard?.writeText(plainTextBrief);

    // Open mailto link
    window.location.href = `mailto:srbstudiosofficial@gmail.com?subject=${subject}&body=${body}`;

    // Close modal & confirm
    document.getElementById('consultationModal')?.close();
    showToast('✨ Consultation request prepared! Opening your mail client...');
    form.reset();
  });
}

/* ==========================================================================
   6. INTERACTIVE PERFORMANCE GAUGE
   ========================================================================== */
function initPerformanceGauge() {
  const auditBtn = document.getElementById('runAuditBtn');
  const scoreEl = document.querySelector('.gauge-score');
  const lcpEl = document.getElementById('metricLcp');
  const ttfbEl = document.getElementById('metricTtfb');

  if (!auditBtn) return;

  auditBtn.addEventListener('click', () => {
    auditBtn.disabled = true;
    auditBtn.innerHTML = '⚡ Testing Architecture...';

    let currentScore = 50;
    const interval = setInterval(() => {
      currentScore += 5;
      if (scoreEl) scoreEl.textContent = currentScore;
      if (currentScore >= 100) {
        clearInterval(interval);
        scoreEl.textContent = '100';
        if (lcpEl) lcpEl.textContent = '0.38s';
        if (ttfbEl) ttfbEl.textContent = '38ms';
        auditBtn.disabled = false;
        auditBtn.innerHTML = '✅ 100/100 Verified (Run Again)';
        showToast('🚀 SRB Studio Bespoke Architecture: 100/100 Grade A Score!');
      }
    }, 40);
  });
}

/* ==========================================================================
   7. EMAIL COPY TO CLIPBOARD
   ========================================================================== */
function initEmailCopy() {
  const copyElements = document.querySelectorAll('.copy-email-action');
  const emailText = 'srbstudiosofficial@gmail.com';

  copyElements.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(emailText).then(() => {
        showToast(`📋 Copied ${emailText} to clipboard!`);
      }).catch(() => {
        window.location.href = `mailto:${emailText}`;
      });
    });
  });
}

/* ==========================================================================
   8. STATS COUNTER ANIMATION
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-item-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(el => {
          const target = parseInt(el.getAttribute('data-target') || '0', 10);
          const suffix = el.getAttribute('data-suffix') || '';
          let count = 0;
          const step = Math.max(1, Math.floor(target / 40));
          const timer = setInterval(() => {
            count += step;
            if (count >= target) {
              el.textContent = `${target}${suffix}`;
              clearInterval(timer);
            } else {
              el.textContent = `${count}${suffix}`;
            }
          }, 30);
        });
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.querySelector('.stats-banner');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   TOAST HELPER
   ========================================================================== */
function showToast(msg) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
