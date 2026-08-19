/* =========================================================
   HIPA MASALA — PRODUCTS & AVAILABILITY LOGIC
   ========================================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const cfg = window.SITE_CONFIG || {};

  /* ---------- WhatsApp link builder ---------- */
  const buildWaHref = (message) => {
    const number = cfg.WHATSAPP_NUMBER || '917058053055';
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  document.querySelectorAll('.whatsapp-product-btn').forEach(btn => {
    const product = btn.getAttribute('data-product') || '';
    btn.href = buildWaHref(`Hi HIPA Masala, I'd like to enquire about ${product}. Please share pricing and availability.`);
  });

  /* ---------- Category filter tabs ---------- */
  const tabs = document.querySelectorAll('.category-tab');
  const cards = document.querySelectorAll('.pdp-card');
  const emptyState = document.getElementById('pdpEmptyState');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-filter');

      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      let visibleCount = 0;
      cards.forEach(card => {
        const match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });

      if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    });
  });

  /* ---------- Apply Unavailable Badges & Alerts ---------- */
  function applyProductStatuses(statusMap) {
    if (!statusMap) return;

    Object.keys(statusMap).forEach(slug => {
      const status = statusMap[slug];

      // 1. Grid product card on products.html
      const card = document.getElementById(slug);
      if (card) {
        if (status === 'unavailable') {
          card.classList.add('is-unavailable');
          if (!card.querySelector('.unavailable-badge')) {
            const badge = document.createElement('span');
            badge.className = 'unavailable-badge';
            badge.textContent = 'CURRENTLY UNAVAILABLE';
            const media = card.querySelector('.pdp-media');
            if (media) media.appendChild(badge);
          }
        } else {
          card.classList.remove('is-unavailable');
          const badge = card.querySelector('.unavailable-badge');
          if (badge) badge.remove();
        }
      }

      // 2. Individual product landing page
      const currentPath = window.location.pathname;
      if (currentPath.includes(slug) && status === 'unavailable') {
        const actionsBox = document.querySelector('.product-lp-actions');
        if (actionsBox && !document.querySelector('.unavailable-alert')) {
          const alert = document.createElement('div');
          alert.className = 'unavailable-alert';
          alert.innerHTML = '?? <strong>CURRENTLY UNAVAILABLE:</strong> This product is temporarily out of stock. You can still submit an enquiry for future batch reservations.';
          actionsBox.parentNode.insertBefore(alert, actionsBox);
        }
      }
    });
  }

  // Load from localStorage immediately
  try {
    const localStatuses = JSON.parse(localStorage.getItem('hipa_product_statuses') || '{}');
    applyProductStatuses(localStatuses);
  } catch (e) {}

  // Fetch from API for dynamic sync
  fetch('/api/products')
    .then(r => r.json())
    .then(res => {
      if (res.success && Array.isArray(res.data)) {
        const statusMap = {};
        res.data.forEach(p => statusMap[p.slug] = p.status);
        applyProductStatuses(statusMap);
      }
    })
    .catch(() => {});
});
