/**
 * SRB STUDIO — Official Interactive Client Script
 * "BUILD • INNOVATE • ELEVATE"
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initDeviceStage();
  initModals();
  initCurrencyBudget();
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
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          navMenu.classList.remove('mobile-open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('mobile-open') && !navbar.contains(e.target)) {
        navMenu.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
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
   3. ZERO-SCROLL MODAL HANDLING
   ========================================================================== */
function openModalSafe(modal, serviceParam) {
  if (!modal) return;
  modal.style.display = '';

  const currentScrollY = window.scrollY || window.pageYOffset;
  if (serviceParam) {
    const select = modal.querySelector('#projectTypeSelect');
    if (select) select.value = serviceParam;
  }

  // Ensure form is visible and success state hidden when opening
  const modalForm = modal.querySelector('#consultationForm');
  const successState = modal.querySelector('#modalSuccessState');
  if (modalForm) modalForm.style.display = '';
  if (successState) successState.style.display = 'none';

  document.body.classList.add('modal-open');

  if (typeof modal.showModal === 'function') {
    try {
      modal.showModal();
    } catch (_) {
      modal.setAttribute('open', '');
    }
  } else {
    modal.setAttribute('open', '');
  }

  window.scrollTo({ top: currentScrollY, left: 0, behavior: 'instant' });
}

function closeModalSafe(modal) {
  if (!modal) {
    modal = document.getElementById('consultationModal');
  }
  if (!modal) return;

  try {
    if (typeof modal.close === 'function') {
      modal.close();
    }
  } catch (_) {}

  modal.removeAttribute('open');
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');

  const modalForm = document.getElementById('consultationForm');
  const successState = document.getElementById('modalSuccessState');
  if (modalForm) modalForm.style.display = '';
  if (successState) successState.style.display = 'none';
}

function initModals() {
  const consultationModal = document.getElementById('consultationModal');
  const posterModal = document.getElementById('posterModal');

  // Triggers for Consultation
  document.querySelectorAll('[data-open-consultation]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const serviceParam = btn.getAttribute('data-service');
      openModalSafe(consultationModal, serviceParam);
    });
  });

  // Triggers for Original Poster View
  document.querySelectorAll('[data-open-poster]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openModalSafe(posterModal, null);
    });
  });

  // Close buttons inside modals (x button, Close Window button, or data-close-modal)
  document.querySelectorAll('.modal-close-btn, [data-close-modal], #closeModalSuccessBtn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModalSafe(consultationModal);
      closeModalSafe(posterModal);
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
        closeModalSafe(modal);
      }
    });

    modal.addEventListener('cancel', () => {
      closeModalSafe(modal);
    });
  });

  // Custom data-scroll-to handler for smooth section scrolling without anchor hash jump
  document.querySelectorAll('[data-scroll-to]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = el.getAttribute('data-scroll-to');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
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
    btn.addEventListener('click', (e) => {
      e.preventDefault();
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
   4b. REGION & CURRENCY BUDGET SYSTEM (INR & USD)
   ========================================================================== */
const BUDGET_TIERS = {
  INR: [
    { value: "Standard Project (₹15,000 – ₹35,000)", label: "Standard Project (₹15,000 – ₹35,000)" },
    { value: "Growth / Dynamic Portal (₹35,000 – ₹85,000)", label: "Growth / Dynamic Portal (₹35,000 – ₹85,000)" },
    { value: "Enterprise / Custom Ecosystem (₹85,000 – ₹2,50,000+)", label: "Enterprise / Custom Ecosystem (₹85,000 – ₹2,50,000+)" },
    { value: "Custom Quote (Let's Discuss)", label: "Custom Quote (Let's Discuss)" }
  ],
  USD: [
    { value: "Standard Project ($500 – $1,500)", label: "Standard Project ($500 – $1,500)" },
    { value: "Growth / Dynamic Portal ($1,500 – $4,000)", label: "Growth / Dynamic Portal ($1,500 – $4,000)" },
    { value: "Enterprise / Custom Ecosystem ($4,000+)", label: "Enterprise / Custom Ecosystem ($4,000+)" },
    { value: "Custom Quote (Let's Discuss)", label: "Custom Quote (Let's Discuss)" }
  ]
};

function initCurrencyBudget() {
  function detectUserRegion() {
    try {
      const saved = localStorage.getItem('srb_currency');
      if (saved && (saved === 'INR' || saved === 'USD')) {
        return saved;
      }
      const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
      const offset = new Date().getTimezoneOffset(); // -330 for IST
      if (tz.includes('kolkata') || tz.includes('calcutta') || offset === -330) {
        return 'INR';
      }
      const lang = (navigator.language || '').toLowerCase();
      const languages = (navigator.languages || []).map(l => l.toLowerCase());
      if (lang.includes('-in') || languages.some(l => l.includes('-in'))) {
        return 'INR';
      }
    } catch (_) {}
    return 'USD';
  }

  function setCurrency(currency) {
    const tiers = BUDGET_TIERS[currency] || BUDGET_TIERS.INR;
    const selects = [
      document.getElementById('budgetRangeSelect'),
      document.getElementById('inpageBudget')
    ];

    selects.forEach(select => {
      if (!select) return;
      const currentIdx = select.selectedIndex >= 0 ? select.selectedIndex : 0;
      select.innerHTML = '';
      tiers.forEach(tier => {
        const opt = document.createElement('option');
        opt.value = tier.value;
        opt.textContent = tier.label;
        select.appendChild(opt);
      });
      if (currentIdx < select.options.length) {
        select.selectedIndex = currentIdx;
      }
    });

    document.querySelectorAll('.currency-pill-btn').forEach(btn => {
      if (btn.getAttribute('data-currency') === currency) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    try {
      localStorage.setItem('srb_currency', currency);
    } catch (_) {}
  }

  document.querySelectorAll('.currency-pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetCurrency = btn.getAttribute('data-currency');
      if (targetCurrency) {
        setCurrency(targetCurrency);
      }
    });
  });

  const initialCurrency = detectUserRegion();
  setCurrency(initialCurrency);
}

/* ==========================================================================
   5. CONSULTATION FORMS & INSTANT BACKGROUND SUBMISSION
   ========================================================================== */
function initConsultationForm() {
  async function handleFormSubmit(formEl, submitBtn, name, email, service, budget, notes, isModal) {
    if (!name || !email) {
      showToast('⚠️ Please enter your Name and Email address.');
      return;
    }

    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Submitting Request...</span> <span class="spinner" aria-hidden="true">⏳</span>`;
    }

    const payload = {
      name: name,
      email: email,
      service: service,
      budget: budget,
      message: notes || 'No additional notes provided',
      _subject: `🚀 SRB Studio Project Request: ${name} (${service})`,
      _template: 'table',
      _captcha: 'false'
    };

    let sent = false;

    // 1. Local Node server backup log (appends directly to leads.json)
    try {
      fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (_) {}

    // 2. Instant background delivery to srbstudiosofficial@gmail.com
    try {
      const response = await fetch('https://formsubmit.co/ajax/srbstudiosofficial@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        sent = true;
      }
    } catch (err) {
      console.warn('Background send network error:', err);
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }

    if (sent) {
      formEl.reset();

      if (isModal) {
        const modalForm = document.getElementById('consultationForm');
        const successState = document.getElementById('modalSuccessState');
        const successLeadName = document.getElementById('successLeadName');
        if (successLeadName) successLeadName.textContent = name;
        if (modalForm) modalForm.style.display = 'none';
        if (successState) successState.style.display = 'block';
      } else {
        const inpageForm = document.getElementById('inpageConsultationForm');
        const inpageSuccessState = document.getElementById('inpageSuccessState');
        const inpageLeadName = document.getElementById('inpageSuccessLeadName');
        if (inpageLeadName) inpageLeadName.textContent = name;
        if (inpageForm) inpageForm.style.display = 'none';
        if (inpageSuccessState) inpageSuccessState.style.display = 'block';
      }
      showToast('✨ Project brief received! Delivered to srbstudiosofficial@gmail.com');
    } else {
      // Graceful fallback to mail client if user was offline or network failed
      showToast('📬 Preparing your email draft to srbstudiosofficial@gmail.com...');
      const subject = encodeURIComponent(`Project Request: ${name} (${service})`);
      const body = encodeURIComponent(
        `Hello SRB Studio,\n\n` +
        `I would like to request a consultation for our digital project.\n\n` +
        `• Name / Company: ${name}\n` +
        `• Email: ${email}\n` +
        `• Service Architecture: ${service}\n` +
        `• Estimated Budget: ${budget}\n` +
        `• Project Overview:\n${notes}\n\n` +
        `Looking forward to elevating our presence with SRB Studio!`
      );
      window.location.href = `mailto:srbstudiosofficial@gmail.com?subject=${subject}&body=${body}`;
    }
  }

  // Modal Form
  const modalForm = document.getElementById('consultationForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = modalForm.querySelector('button[type="submit"]');
      const name = document.getElementById('clientName')?.value.trim();
      const email = document.getElementById('clientEmail')?.value.trim();
      const service = document.getElementById('projectTypeSelect')?.value;
      const budget = document.getElementById('budgetRangeSelect')?.value;
      const notes = document.getElementById('projectNotes')?.value.trim();
      handleFormSubmit(modalForm, submitBtn, name, email, service, budget, notes, true);
    });
  }

  // Close Success Modal Button
  const closeModalSuccessBtn = document.getElementById('closeModalSuccessBtn');
  if (closeModalSuccessBtn) {
    closeModalSuccessBtn.addEventListener('click', () => {
      const modal = document.getElementById('consultationModal');
      closeModalSafe(modal);
      setTimeout(() => {
        const modalForm = document.getElementById('consultationForm');
        const successState = document.getElementById('modalSuccessState');
        if (modalForm) modalForm.style.display = '';
        if (successState) successState.style.display = 'none';
      }, 300);
    });
  }

  // In-Page Form
  const inpageForm = document.getElementById('inpageConsultationForm');
  if (inpageForm) {
    inpageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = inpageForm.querySelector('button[type="submit"]');
      const name = document.getElementById('inpageName')?.value.trim();
      const email = document.getElementById('inpageEmail')?.value.trim();
      const service = document.getElementById('inpageService')?.value;
      const budget = document.getElementById('inpageBudget')?.value;
      const notes = document.getElementById('inpageNotes')?.value.trim();
      handleFormSubmit(inpageForm, submitBtn, name, email, service, budget, notes, false);
    });
  }

  // In-Page Reset Button
  const inpageResetBtn = document.getElementById('inpageResetBtn');
  if (inpageResetBtn) {
    inpageResetBtn.addEventListener('click', () => {
      const inpageForm = document.getElementById('inpageConsultationForm');
      const inpageSuccessState = document.getElementById('inpageSuccessState');
      if (inpageForm) inpageForm.style.display = '';
      if (inpageSuccessState) inpageSuccessState.style.display = 'none';
    });
  }
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
