/* =========================================================
   HIPA MASALA — GLOBAL PRODUCT SEARCH (header, all pages)
   ---------------------------------------------------------
   This is a PRODUCT search only. It is intentionally separate
   from the blog search that lives inside blog.html (different
   ids, different classes, different JS file) so the two never
   conflict — see blog.js for the blog search.

   Data source: window.SITE_PRODUCTS (product-data.js), which
   mirrors the real product cards in products.html.

   100% client-side. Never calls WordPress or any network API.
   ========================================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const products = window.SITE_PRODUCTS || [];

  const wrap = document.getElementById('productSearch');
  const toggleBtn = document.getElementById('productSearchToggle');
  const box = document.getElementById('productSearchBox');
  const input = document.getElementById('productSearchInput');
  const clearBtn = document.getElementById('productSearchClear');
  const resultsBox = document.getElementById('productSearchResults');

  if (!wrap || !toggleBtn || !box || !input || !resultsBox) return;

  const onProductsPage = /products\.html$/.test(window.location.pathname) ||
                          window.location.pathname === '/products.html';

  let activeIndex = -1;
  let currentResults = [];

  /* ---------- GA4 / GTM event helper ---------- */
  const pushEvent = (eventName, params) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: eventName }, params));
  };

  /* ---------- Open / close ---------- */
  const openBox = () => {
    wrap.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    setTimeout(() => input.focus(), 60);
  };

  const closeBox = () => {
    wrap.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    resultsBox.classList.remove('show');
    activeIndex = -1;
  };

  toggleBtn.addEventListener('click', () => {
    wrap.classList.contains('open') ? closeBox() : openBox();
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      resultsBox.innerHTML = '';
      resultsBox.classList.remove('show');
      closeBox();
    });
  }

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) closeBox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && wrap.classList.contains('open')) closeBox();
  });

  /* ---------- Search + render ---------- */
  const matchProduct = (product, query) => {
    const q = query.toLowerCase();
    if (product.name.toLowerCase().includes(q)) return true;
    return product.keywords.some(k => k.toLowerCase().includes(q));
  };

  const renderResults = (query) => {
    resultsBox.innerHTML = '';
    resultsBox.setAttribute('role', 'listbox');
    activeIndex = -1;

    if (!query) {
      resultsBox.classList.remove('show');
      currentResults = [];
      return;
    }

    currentResults = products.filter(p => matchProduct(p, query));

    if (currentResults.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'product-search-empty';
      empty.innerHTML = `
        <p>No products found</p>
        <a href="products.html" class="product-search-view-all">View All Products</a>
      `;
      resultsBox.appendChild(empty);
    } else {
      currentResults.forEach((product, i) => {
        const item = document.createElement(onProductsPage ? 'button' : 'a');
        item.className = 'product-search-result';
        item.id = `productSearchResult-${i}`;
        item.setAttribute('role', 'option');
        item.type = onProductsPage ? 'button' : undefined;
        if (!onProductsPage) item.href = `products.html#${product.id}`;
        item.innerHTML = `
          <span class="product-search-result-name">${product.name}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        `;
        item.addEventListener('click', (e) => {
          if (onProductsPage) e.preventDefault();
          selectProduct(product);
        });
        resultsBox.appendChild(item);
      });
    }

    resultsBox.classList.add('show');
  };

  const selectProduct = (product) => {
    pushEvent('product_search_click', { product_name: product.name });

    if (onProductsPage) {
      const target = document.getElementById(product.id);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${product.id}`);
    } else {
      window.location.href = `products.html#${product.id}`;
    }

    closeBox();
    input.value = '';
  };

  /* ---------- Track search input (debounced GA4 event) ---------- */
  let searchDebounce;
  input.addEventListener('input', () => {
    const query = input.value.trim();
    renderResults(query);

    clearTimeout(searchDebounce);
    if (!query) return;
    searchDebounce = setTimeout(() => {
      pushEvent('product_search', {
        search_term: query,
        result_count: currentResults.length
      });
    }, 500);
  });

  /* ---------- Keyboard navigation ---------- */
  input.addEventListener('keydown', (e) => {
    const items = resultsBox.querySelectorAll('.product-search-result');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      updateActiveItem(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      updateActiveItem(items);
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && currentResults[activeIndex]) {
        e.preventDefault();
        selectProduct(currentResults[activeIndex]);
      }
    }
  });

  const updateActiveItem = (items) => {
    items.forEach((el, i) => el.classList.toggle('is-active', i === activeIndex));
    input.setAttribute('aria-activedescendant', activeIndex >= 0 ? `productSearchResult-${activeIndex}` : '');
    if (items[activeIndex]) items[activeIndex].scrollIntoView({ block: 'nearest' });
  };

  input.addEventListener('focus', () => {
    if (input.value.trim()) resultsBox.classList.add('show');
  });

});
