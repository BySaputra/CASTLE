/* ============================================================
   KPM EXPO UNJ — script.js
   Handles: language toggle, navbar, mobile menu, AOS, smooth scroll, hero slider
   ============================================================ */

(function () {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  /* ── 0. LANGUAGE TOGGLE (ID <-> EN) ─────────────────────── */
  function setupLanguageToggle() {
    const langToggle = $('#lang-toggle');
    if (!langToggle) return;

    const translatableElements = $$('[data-id][data-en]');

    function applyLanguage(lang) {
      const safeLang = lang === 'en' ? 'en' : 'id';

      translatableElements.forEach((element) => {
        const translatedText = element.dataset[safeLang];
        if (typeof translatedText !== 'string') return;

        if (element.tagName === 'META') {
          element.setAttribute('content', translatedText);
          return;
        }

        element.textContent = translatedText;
      });

      document.documentElement.lang = safeLang;
      langToggle.textContent = safeLang === 'id' ? 'EN' : 'ID';
      langToggle.setAttribute(
        'aria-label',
        safeLang === 'id' ? 'Switch language to English' : 'Ganti bahasa ke Indonesia'
      );

      try {
        localStorage.setItem('lang', safeLang);
      } catch (_) {
        // Ignore localStorage write failures (private mode/restricted environments).
      }
    }

    let currentLang = 'id';
    try {
      const savedLang = localStorage.getItem('lang');
      if (savedLang === 'id' || savedLang === 'en') {
        currentLang = savedLang;
      }
    } catch (_) {
      currentLang = 'id';
    }

    applyLanguage(currentLang);

    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'id' ? 'en' : 'id';
      applyLanguage(currentLang);
    });
  }

  setupLanguageToggle();

  /* ── 1. NAVBAR SCROLL EFFECT ─────────────────────────────── */
  const navbar = $('.navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 36);
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* ── 2. ACTIVE NAV LINK ON SCROLL ───────────────────────── */
  const sections = $$('section[id]');
  const navLinks = $$('.nav-link');

  function updateActiveLink() {
    if (!sections.length || !navLinks.length) return;

    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ── 3. MOBILE HAMBURGER MENU ───────────────────────────── */
  const hamburger = $('#hamburger');
  const navLinksEl = $('#navLinks');

  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinksEl.classList.toggle('open');
      document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : '';
    });

    $$('.nav-link', navLinksEl).forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinksEl.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinksEl?.classList.contains('open')) {
      hamburger?.classList.remove('active');
      navLinksEl.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ── 4. AOS (LIGHTWEIGHT) ───────────────────────────────── */
  function setupAOS() {
    const items = $$('[data-aos]');
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('aos-animate');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    items.forEach((item) => observer.observe(item));
  }

  setupAOS();

  /* ── 5. SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────── */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = $(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ── 6. HERO SLIDER ─────────────────────────────── */
  function setupHeroSlider() {
    const slider = $('.hero-slider');
    if (!slider) return;

    const slides = $$('.hero-slide', slider);
    const dots = $$('.hero-gallery-dots button', slider);
    const prevBtn = $('.hero-slider-btn--prev', slider);
    const nextBtn = $('.hero-slider-btn--next', slider);
    if (!slides.length) return;

    let current = 0;
    let timer = null;
    const interval = 5000;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === current);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    function stopAutoPlay() {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    }

    function startAutoPlay() {
      stopAutoPlay();
      timer = window.setInterval(() => showSlide(current + 1), interval);
    }

    prevBtn?.addEventListener('click', () => {
      showSlide(current - 1);
      startAutoPlay();
    });

    nextBtn?.addEventListener('click', () => {
      showSlide(current + 1);
      startAutoPlay();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showSlide(i);
        startAutoPlay();
      });
    });

    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    slider.addEventListener('focusin', stopAutoPlay);
    slider.addEventListener('focusout', startAutoPlay);

    showSlide(0);
    startAutoPlay();
  }

  setupHeroSlider();

})();
