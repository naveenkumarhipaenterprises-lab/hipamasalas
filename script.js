document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Apply shared config (top bar, floating buttons, footer) ----------
     Reads window.SITE_CONFIG (see config.js) so phone/WhatsApp/email/social
     links only ever need to be updated in one place across every page. */
  const cfg = window.SITE_CONFIG;
  if (cfg) {
    // Top info bar
    document.querySelectorAll('[data-config="phone-link"]').forEach(el => {
      el.href = `tel:${cfg.PHONE_TEL}`;
    });
    document.querySelectorAll('[data-config="phone-text"]').forEach(el => {
      el.textContent = cfg.PHONE_DISPLAY;
    });
    document.querySelectorAll('[data-config="email-link"]').forEach(el => {
      el.href = `mailto:${cfg.EMAIL_ADDRESS}`;
    });
    document.querySelectorAll('[data-config="email-text"]').forEach(el => {
      el.textContent = cfg.EMAIL_ADDRESS;
    });
    document.querySelectorAll('[data-config="facebook"]').forEach(el => {
      el.href = cfg.SOCIAL_LINKS.facebook;
    });
    document.querySelectorAll('[data-config="instagram"]').forEach(el => {
      el.href = cfg.SOCIAL_LINKS.instagram;
    });
    document.querySelectorAll('[data-config="linkedin"]').forEach(el => {
      el.href = cfg.SOCIAL_LINKS.linkedin;
    });
    document.querySelectorAll('[data-config="youtube"]').forEach(el => {
      el.href = cfg.SOCIAL_LINKS.youtube;
    });

    // Floating WhatsApp button + any other WhatsApp CTA links on the page
    const waMsg = encodeURIComponent(cfg.WHATSAPP_DEFAULT_MESSAGE || '');
    const waHref = `https://wa.me/${cfg.WHATSAPP_NUMBER}?text=${waMsg}`;
    const waBtn = document.getElementById('floatingWhatsapp');
    if (waBtn) waBtn.href = waHref;
    document.querySelectorAll('#whatsappCtaBtn, [data-config="whatsapp-link"]').forEach(el => {
      el.href = waHref;
    });

    // Floating Call button
    const callBtn = document.getElementById('floatingCall');
    if (callBtn) {
      callBtn.href = `tel:${cfg.PHONE_TEL}`;
    }

    // Address / hours placeholders (contact page + footer, if present)
    document.querySelectorAll('[data-config="address-line-1"]').forEach(el => {
      el.textContent = cfg.ADDRESS_LINE_1;
    });
    document.querySelectorAll('[data-config="address-line-2"]').forEach(el => {
      el.textContent = cfg.ADDRESS_LINE_2;
    });
    document.querySelectorAll('[data-config="hours-weekday"]').forEach(el => {
      el.textContent = cfg.BUSINESS_HOURS_WEEKDAY;
    });
    document.querySelectorAll('[data-config="hours-weekend"]').forEach(el => {
      el.textContent = cfg.BUSINESS_HOURS_WEEKEND;
    });
    document.querySelectorAll('[data-config="maps-embed"]').forEach(el => {
      el.src = cfg.MAPS_EMBED_URL;
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');
  const onScroll = () => {
    const scrolled = window.scrollY > 12;
    header.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Mobile nav toggle ---------- */
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  const navOverlay = document.getElementById('navOverlay');

  const closeNav = () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('open');
    navOverlay.classList.remove('show');
    document.body.style.overflow = '';
  };

  const openNav = () => {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mainNav.classList.add('open');
    navOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  hamburger.addEventListener('click', () => {
    mainNav.classList.contains('open') ? closeNav() : openNav();
  });
  navOverlay.addEventListener('click', closeNav);

  /* Close mobile nav after clicking a link (not the dropdown parent toggle) */
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) closeNav();
    });
  });

  /* ---------- Mobile dropdown (tap to expand "Products") ---------- */
  const dropdownParent = document.querySelector('.has-dropdown > a');
  const dropdownLi = document.querySelector('.has-dropdown');
  if (dropdownParent) {
    dropdownParent.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        dropdownLi.classList.toggle('open');
      }
    });
  }

  /* Close mobile nav on resize back to desktop */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeNav();
  });

  /* ---------- Active link highlight on scroll ---------- */
  const sections = document.querySelectorAll('main section[id], .hero[id]');
  const navLinks = document.querySelectorAll('.main-nav > ul > li > a');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(sec => spy.observe(sec));

  /* ---------- Scroll reveal animation ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Cart counter ---------- */
  const cartCount = document.getElementById('cartCount');
  let count = 0;
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      count++;
      cartCount.textContent = count;
      btn.textContent = 'Added ✓';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Shop Now';
        btn.disabled = false;
      }, 1400);
    });
  });

  /* ---------- Hero 3-Product Horizontal Carousel (7 Products Only) ---------- */
  const heroCarouselTrack = document.getElementById('heroCarouselTrack');
  if (heroCarouselTrack) {
    // 7 products only (Red Chilli Powder is EXCLUDED from hero carousel)
    const heroProducts = [
      { id: 'sambar-powder',    name: 'Sambar Powder',    image: 'images/products/Sambar-masala-powder.png',  alt: 'HIPA Sambar Powder' },
      { id: 'rasam-powder',     name: 'Rasam Powder',     image: 'images/products/Rasam-masala-h.png',        alt: 'HIPA Rasam Powder' },
      { id: 'turmeric-powder',  name: 'Turmeric Powder',  image: 'images/products/Turmeric-Powder-h.png',     alt: 'HIPA Turmeric Powder' },
      { id: 'coriander-powder', name: 'Coriander Powder', image: 'images/products/Corainder-powder-h.png',    alt: 'HIPA Coriander Powder' },
      { id: 'cumin-powder',     name: 'Cumin Powder',     image: 'images/products/Cumin-powder-h.png',        alt: 'HIPA Cumin Powder' },
      { id: 'pepper-powder',    name: 'Pepper Powder',    image: 'images/products/pepper-powderr-h.png',      alt: 'HIPA Pepper Powder' },
      { id: 'garam-masala',     name: 'Garam Masala',     image: 'images/products/Garam-Masala-h.png',        alt: 'HIPA Garam Masala' }
    ];

    const totalItems = heroProducts.length; // 7
    const dotsWrap = document.getElementById('heroDots');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Render list with clones at the end for continuous infinite loop
    const renderList = [
      ...heroProducts,
      heroProducts[0],
      heroProducts[1],
      heroProducts[2]
    ];

    heroCarouselTrack.innerHTML = renderList.map((item, idx) => `
      <div class="hero-carousel-item" data-index="${idx % totalItems}">
        <a href="products.html#${item.id}" class="hero-carousel-card">
          <img class="hero-carousel-img" src="${item.image}" alt="${item.alt}">
          <span class="hero-carousel-title">${item.name}</span>
        </a>
      </div>
    `).join('');

    let currentIndex = 0;
    let isTransitioning = false;

    // Build 7 dot indicators
    const dots = heroProducts.map((product, i) => {
      if (!dotsWrap) return null;
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'hero-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Show ${product.name}`);
      dot.addEventListener('click', () => {
        if (isTransitioning) return;
        goToSlide(i);
        restartAuto();
      });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function getItemsPerPage() {
      if (window.innerWidth <= 560) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }

    function updateTrackPosition(animate = true) {
      const itemsPerPage = getItemsPerPage();
      const stepPercent = 100 / itemsPerPage;
      if (animate) {
        heroCarouselTrack.style.transition = 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
      } else {
        heroCarouselTrack.style.transition = 'none';
      }
      heroCarouselTrack.style.transform = `translateX(-${currentIndex * stepPercent}%)`;
    }

    function updateDots() {
      const activeDotIndex = currentIndex % totalItems;
      dots.forEach((dot, i) => {
        if (dot) dot.classList.toggle('is-active', i === activeDotIndex);
      });
    }

    function goToNext() {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      updateTrackPosition(true);
      updateDots();

      if (currentIndex >= totalItems) {
        setTimeout(() => {
          currentIndex = 0;
          updateTrackPosition(false);
          updateDots();
          isTransitioning = false;
        }, 700);
      } else {
        setTimeout(() => {
          isTransitioning = false;
        }, 700);
      }
    }

    function goToPrev() {
      if (isTransitioning) return;
      isTransitioning = true;
      if (currentIndex === 0) {
        currentIndex = totalItems;
        updateTrackPosition(false);
        heroCarouselTrack.offsetHeight; // Force reflow
        currentIndex = totalItems - 1;
        updateTrackPosition(true);
      } else {
        currentIndex--;
        updateTrackPosition(true);
      }
      updateDots();
      setTimeout(() => {
        isTransitioning = false;
      }, 700);
    }

    function goToSlide(index) {
      currentIndex = index % totalItems;
      updateTrackPosition(true);
      updateDots();
    }

    let autoTimer = null;
    function startAuto() {
      if (prefersReducedMotion) return;
      autoTimer = setInterval(goToNext, 3500);
    }
    function stopAuto() {
      if (autoTimer) clearInterval(autoTimer);
    }
    function restartAuto() {
      stopAuto();
      startAuto();
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { goToNext(); restartAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { goToPrev(); restartAuto(); });

    const heroArtContainer = document.getElementById('heroCarouselContainer');
    if (heroArtContainer) {
      heroArtContainer.addEventListener('mouseenter', stopAuto);
      heroArtContainer.addEventListener('mouseleave', startAuto);
    }

    window.addEventListener('resize', () => {
      updateTrackPosition(false);
    });

    updateTrackPosition(false);
    startAuto();
  }

  /* ---------- Newsletter form (front-end only demo) ---------- */
  const form = document.getElementById('newsletterForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const btn = form.querySelector('button');
      const original = btn.textContent;
      btn.textContent = 'Subscribed ✓';
      setTimeout(() => {
        btn.textContent = original;
        input.value = '';
      }, 1800);
    });
  }

});
