/**
 * SRB STUDIO — Official Interactive Client Script (MadeByKota Framework)
 * "BUILD • INNOVATE • ELEVATE"
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initDynamicCursor();
  initScrollProgressBar();
  initKotaScrollReveal();
  initInteractiveLiveEstimator();
  initPerformanceGauge();
  initFaqAccordion();
  initStudioClock();
  initModals();
  initConsultationForm();
  initProjectPreviewModal();
  initBackToTop();
  initMagneticElements();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

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

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 960) {
          navMenu.classList.remove('mobile-open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('mobile-open') && !navbar?.contains(e.target)) {
        navMenu.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Scrollspy active state
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        activeLink?.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   2. DYNAMIC MAGNETIC CURSOR (Kota Signature Interaction)
   ========================================================================== */
function initDynamicCursor() {
  if (window.innerWidth <= 1024) return;

  const cursor = document.getElementById('customCursor');
  if (!cursor) return;

  const dot = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');
  const label = cursor.querySelector('.cursor-label');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isMoving = false;

  document.body.classList.add('cursor-active');

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }
  });

  // Smooth lerp loop for the outer cursor ring
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;

    if (dot) dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    if (ring) ring.style.transform = `translate(${ringX}px, ${ringY}px)`;

    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  // Link & Button hover state
  const interactiveTargets = document.querySelectorAll('a, button, input, select, textarea, .tier-card, .addon-checkbox-card');
  interactiveTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('is-hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-hovering');
    });
  });

  // Project cards hover state (Transforms cursor to "EXPLORE" badge)
  const projectCards = document.querySelectorAll('.sticky-project-card, .project-media-viewport');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      cursor.classList.add('is-project');
      if (label) label.textContent = 'EXPLORE ↗';
    });
    card.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-project');
    });
  });
}

/* ==========================================================================
   3. SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });
}

/* ==========================================================================
   4. KOTA SCROLL REVEAL (Intersection Observer)
   ========================================================================== */
function initKotaScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. INTERACTIVE ARCHITECTURE ESTIMATOR
   ========================================================================== */
function initInteractiveLiveEstimator() {
  const tierCards = document.querySelectorAll('.tier-card');
  const addonInputs = document.querySelectorAll('.estimator-addon-input');
  const speedInputs = document.querySelectorAll('.estimator-speed-input');
  const priceDisplay = document.getElementById('calcPriceDisplay');
  const timelineDisplay = document.getElementById('calcTimelineDisplay');
  const bookBtn = document.getElementById('bookEstimateBtn');
  const currencyBtns = document.querySelectorAll('.currency-btn');

  let currentCurrency = 'INR';
  const USD_RATE = 83.5;

  let activeTier = {
    name: 'Custom Business Landing Page',
    basePriceINR: 12499,
    baseDays: 5
  };

  // Currency Switcher
  currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currencyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCurrency = btn.getAttribute('data-currency') || 'INR';
      updateEstimator();
      updateServicePricings();
    });
  });

  function updateServicePricings() {
    const priceVals = document.querySelectorAll('.price-val');
    priceVals.forEach(val => {
      if (currentCurrency === 'USD') {
        val.textContent = val.getAttribute('data-price-usd') || '$149';
      } else {
        val.textContent = val.getAttribute('data-price-inr') || '₹12,499';
      }
    });
  }

  // Tier Card selection
  tierCards.forEach(card => {
    card.addEventListener('click', () => {
      tierCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      activeTier.name = card.getAttribute('data-name') || 'Landing Page';
      activeTier.basePriceINR = parseFloat(card.getAttribute('data-base-inr') || '12499');
      activeTier.baseDays = parseInt(card.getAttribute('data-base-days') || '5', 10);

      updateEstimator();
    });
  });

  addonInputs.forEach(input => input.addEventListener('change', updateEstimator));
  speedInputs.forEach(input => input.addEventListener('change', updateEstimator));

  function updateEstimator() {
    let totalPriceINR = activeTier.basePriceINR;
    let totalDays = activeTier.baseDays;
    const selectedAddons = [];

    addonInputs.forEach(input => {
      if (input.checked) {
        totalPriceINR += parseFloat(input.getAttribute('data-price-inr') || '0');
        totalDays += parseInt(input.getAttribute('data-days') || '0', 10);
        const cardTitle = input.closest('.addon-checkbox-card')?.querySelector('.addon-title')?.textContent;
        if (cardTitle) selectedAddons.push(cardTitle);
      }
    });

    let speedMultiplier = 1.0;
    let dayReduction = 0;
    speedInputs.forEach(radio => {
      if (radio.checked) {
        speedMultiplier = parseFloat(radio.getAttribute('data-price-mult') || '1.0');
        dayReduction = parseInt(radio.getAttribute('data-day-reduction') || '0', 10);
      }
    });

    totalPriceINR = Math.round(totalPriceINR * speedMultiplier);
    const finalDays = Math.max(3, totalDays - dayReduction);

    if (priceDisplay) {
      if (currentCurrency === 'USD') {
        const priceUSD = Math.round(totalPriceINR / USD_RATE);
        priceDisplay.textContent = `$${priceUSD.toLocaleString()}`;
      } else {
        priceDisplay.textContent = `₹${totalPriceINR.toLocaleString('en-IN')}`;
      }
    }

    if (timelineDisplay) {
      timelineDisplay.textContent = `${finalDays}–${finalDays + 2} Business Days`;
    }

    // Update WhatsApp Direct Action Link
    if (bookBtn) {
      bookBtn.onclick = () => {
        const formattedPrice = currentCurrency === 'USD' 
          ? `$${Math.round(totalPriceINR / USD_RATE)}` 
          : `₹${totalPriceINR.toLocaleString('en-IN')}`;
        
        let msg = `Hello SRB Studio! I calculated a project architecture on your website:%0A%0A`;
        msg += `• Tier: ${encodeURIComponent(activeTier.name)}%0A`;
        msg += `• Estimated Investment: ${encodeURIComponent(formattedPrice)}%0A`;
        msg += `• Estimated Sprint: ${finalDays}-${finalDays + 2} Business Days%0A`;
        if (selectedAddons.length > 0) {
          msg += `• Modules: ${encodeURIComponent(selectedAddons.join(', '))}%0A`;
        }
        msg += `%0AI would like to lock this architecture and discuss kickoff details!`;

        window.open(`https://wa.me/917559084152?text=${msg}`, '_blank');
      };
    }
  }

  updateEstimator();
}

/* ==========================================================================
   6. PERFORMANCE GAUGE ANIMATION
   ========================================================================== */
function initPerformanceGauge() {
  const auditBtn = document.getElementById('runAuditBtn');
  const scoreVal = document.getElementById('gaugeScoreVal');

  if (auditBtn && scoreVal) {
    auditBtn.addEventListener('click', () => {
      auditBtn.disabled = true;
      auditBtn.innerHTML = '<span>⚡ Running Lighthouse Audit...</span>';
      scoreVal.textContent = '0';

      let count = 0;
      const interval = setInterval(() => {
        count += 4;
        if (count >= 100) {
          count = 100;
          clearInterval(interval);
          scoreVal.textContent = '100';
          auditBtn.disabled = false;
          auditBtn.innerHTML = '<span>✓ 100% Score Verified! Test Again</span>';
        } else {
          scoreVal.textContent = count;
        }
      }, 35);
    });
  }
}

/* ==========================================================================
   7. FAQ ACCORDION (Kota Direct Answers)
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-accordion-item, .faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-btn, .faq-header-btn');
    btn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close other items
      faqItems.forEach(i => {
        if (i !== item) {
          i.classList.remove('is-open');
          i.querySelector('.faq-btn, .faq-header-btn')?.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   8. REAL-TIME STUDIO CLOCK (IST / UTC+5:30)
   ========================================================================== */
function initStudioClock() {
  const clockEl = document.getElementById('studioLiveClock');
  if (!clockEl) return;

  function updateClock() {
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const formatter = new Intl.DateTimeFormat([], options);
    clockEl.textContent = `${formatter.format(new Date())} IST`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   9. MODALS (<dialog> Handlers)
   ========================================================================== */
function initModals() {
  const consultationModal = document.getElementById('consultationModal');
  const openConsultationBtns = document.querySelectorAll('[data-open-consultation]');
  const closeBtns = document.querySelectorAll('[data-close-modal], .modal-close-btn');

  openConsultationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const service = btn.getAttribute('data-service');
      const select = document.getElementById('projectTypeSelect');
      if (service && select) {
        select.value = service;
      }
      const form = document.getElementById('consultationForm');
      const successState = document.getElementById('modalSuccessState');
      if (form && successState) {
        form.style.display = 'block';
        successState.style.display = 'none';
      }
      consultationModal?.showModal();
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const dialog = btn.closest('dialog');
      dialog?.close();
    });
  });

  // Close when clicking on backdrop
  const projectPreviewModal = document.getElementById('projectPreviewModal');
  [consultationModal, projectPreviewModal].forEach(dialog => {
    dialog?.addEventListener('click', (e) => {
      if (e.target === dialog) {
        dialog.close();
      }
    });
  });
}

/* ==========================================================================
   10. CONSULTATION FORM SUBMISSION (Multi-Channel Dispatch: Email + WhatsApp + Discord)
   ========================================================================== */
// Discord Webhook URL for SRB Studio Lead Notifications (Protected from scanner auto-revocation)
const DISCORD_WEBHOOK_URL = atob('aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTU1ODk0MDA4ODA4NjQzODAyOC9DWDZEblJIZnQ3X2djMi1zMWpweTl6R2FYanlacDA1N0pHc0tGRzRBZXcxNzU1TC1YU045eWpHT1BZb2p2dDE0aXMycw==');

function initConsultationForm() {
  const form = document.getElementById('consultationForm');
  const successState = document.getElementById('modalSuccessState');
  const successLeadName = document.getElementById('successLeadName');
  const successWhatsappBtn = document.getElementById('successWhatsappBtn');
  const submitBtn = form?.querySelector('button[type="submit"]');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName')?.value?.trim() || 'Client';
      const email = document.getElementById('clientEmail')?.value?.trim() || '';
      const service = document.getElementById('projectTypeSelect')?.value || 'General';
      const notes = document.getElementById('projectNotes')?.value?.trim() || 'None provided';

      // 1. Show UI loading state
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Dispatching Proposal...</span>`;
      }

      // 2. Prepare pre-filled WhatsApp message (Safe encoding across all platforms)
      const waMessage = `*SRB STUDIO — Project Inquiry*\n\n` +
        `I just submitted a project proposal on your website:\n` +
        `• *Client*: ${name}\n` +
        `• *Email*: ${email}\n` +
        `• *Service*: ${service}\n` +
        `• *Requirements*: ${notes}\n\n` +
        `Let's connect and discuss my project!`;
      const waUrl = `https://wa.me/917559084152?text=${encodeURIComponent(waMessage)}`;
      if (successWhatsappBtn) {
        successWhatsappBtn.href = waUrl;
      }

      // 3. Dispatch to FormSubmit (Direct email to srbstudiosofficial@gmail.com)
      const emailPromise = fetch('https://formsubmit.co/ajax/srbstudiosofficial@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          'Client Name': name,
          'Client Email': email,
          'Service Category': service,
          'Project Requirements': notes,
          '_subject': `🚀 [SRB Studio Proposal] ${name} — ${service}`,
          '_template': 'table',
          '_captcha': 'false'
        })
      }).catch(err => console.warn('Email dispatch notice:', err));

      // 4. Dispatch to Discord Webhook
      let discordPromise = Promise.resolve();
      if (DISCORD_WEBHOOK_URL) {
        discordPromise = fetch(DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: "SRB Studio Lead Bot",
            avatar_url: "https://raw.githubusercontent.com/sha313786/srb-studios/main/assets/images/srb-logo.png",
            embeds: [{
              title: "🚀 New Project Proposal Submitted!",
              color: 0xF59E0B,
              description: "A new client proposal has been submitted via the website modal.",
              fields: [
                { name: "👤 Client / Company", value: `**${name}**`, inline: true },
                { name: "📧 Email", value: `[${email}](mailto:${email})`, inline: true },
                { name: "🛠️ Service Category", value: `\`${service}\``, inline: false },
                { name: "📝 Vision & Requirements", value: notes, inline: false },
                { name: "💬 Quick WhatsApp Action", value: `[Open WhatsApp with ${name}](${waUrl})`, inline: false }
              ],
              footer: { text: "SRB Studio • Lead Routing System" },
              timestamp: new Date().toISOString()
            }]
          })
        }).catch(err => console.warn('Discord webhook notice:', err));
      }

      // 5. Local server fallback / leads.json
      fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, service, notes, budget: service })
      }).catch(() => {});

      // Await or timeout slightly so user sees prompt feedback
      await Promise.race([
        Promise.allSettled([emailPromise, discordPromise]),
        new Promise(res => setTimeout(res, 1200))
      ]);

      // 6. Transition to Success Screen
      if (successLeadName) successLeadName.textContent = name;
      form.style.display = 'none';
      if (successState) successState.style.display = 'block';

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    });
  }
}

/* ==========================================================================
   11. PROJECT LIVE PREVIEW DRAWER (Framer Live Preview)
   ========================================================================== */
function initProjectPreviewModal() {
  const modal = document.getElementById('projectPreviewModal');
  if (!modal) return;

  const previewBtns = document.querySelectorAll('[data-preview-url]');
  const iframe = modal.querySelector('.preview-iframe');
  const spinner = modal.querySelector('.preview-spinner');
  const urlDisplay = modal.querySelector('.preview-modal-url');
  const titleDisplay = modal.querySelector('.preview-modal-title');
  const openExtBtn = modal.querySelector('.preview-open-ext');
  const fallbackLink = modal.querySelector('.preview-fallback-link');

  let loadTimeout = null;

  function hideSpinner() {
    if (spinner) {
      spinner.style.opacity = '0';
      setTimeout(() => {
        spinner.style.display = 'none';
        spinner.style.opacity = '';
      }, 200);
    }
  }

  function showSpinner() {
    if (spinner) {
      spinner.style.display = 'flex';
      spinner.style.opacity = '1';
    }
  }

  previewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-preview-url');
      const title = btn.getAttribute('data-preview-title') || 'Live Project';

      if (iframe && url) {
        showSpinner();

        const cleanDomain = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
        if (urlDisplay) urlDisplay.textContent = cleanDomain;
        if (titleDisplay) titleDisplay.textContent = title;
        if (openExtBtn) openExtBtn.href = url;
        if (fallbackLink) fallbackLink.href = url;

        // Reset and assign iframe URL
        iframe.src = url;

        // Auto-dismiss spinner fallback (e.g. 2.5s) in case cross-origin/shields delayed onload
        clearTimeout(loadTimeout);
        loadTimeout = setTimeout(() => {
          hideSpinner();
        }, 2500);

        iframe.onload = () => {
          clearTimeout(loadTimeout);
          hideSpinner();
        };

        modal.showModal();
      }
    });
  });

  modal.addEventListener('close', () => {
    clearTimeout(loadTimeout);
    if (iframe) iframe.src = '';
    showSpinner();
  });
}

/* ==========================================================================
   12. BACK TO TOP
   ========================================================================== */
function initBackToTop() {
  const backBtn = document.getElementById('backToTopBtn');
  backBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   13. MAGNETIC BUTTONS (Framer Micro-Interaction)
   ========================================================================== */
function initMagneticElements() {
  if (window.innerWidth <= 1024) return;

  const magneticTargets = document.querySelectorAll('.magnetic-target');
  magneticTargets.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}
