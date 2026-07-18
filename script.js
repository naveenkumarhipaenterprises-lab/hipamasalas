document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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
