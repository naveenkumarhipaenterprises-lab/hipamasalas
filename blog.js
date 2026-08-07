/* =========================================================
   HIPA MASALA — BLOG LISTING PAGE
   ---------------------------------------------------------
   Page-specific behaviour for blog.html only:
     1. Fetch published posts from the WordPress REST API
        (window.SITE_CONFIG.WORDPRESS_API_URL, see config.js)
     2. Render them as .blog-card cards, with loading / error /
        empty states
     3. Category tabs — built from the categories actually
        present on the fetched posts (no hardcoded list)
     4. "Load More" pagination
     5. Inline blog search (#blogSearchInput) — filters the
        posts already loaded in the browser. This is a BLOG
        search only; it is completely separate from the global
        header PRODUCT search in product-search.js.
     6. blog_article_click GTM/GA4 event on card click
     7. Newsletter form validation (front-end only, no backend)

   Shared behaviour (header, mobile nav, scroll reveal,
   back-to-top, footer year, top-bar/floating-button config,
   the global product search) already lives in script.js /
   product-search.js and is reused as-is.
   ========================================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const cfg = window.SITE_CONFIG || {};
  const WP_API = cfg.WORDPRESS_API_URL;
  const PER_PAGE = 9;

  const grid = document.getElementById('blogGrid');
  const emptyState = document.getElementById('blogEmptyState');
  const emptyTitle = document.getElementById('blogEmptyTitle');
  const emptyMessage = document.getElementById('blogEmptyMessage');
  const categoryTabs = document.getElementById('categoryTabs');
  const searchInput = document.getElementById('blogSearchInput');
  const loadMoreWrap = document.getElementById('blogLoadMoreWrap');
  const loadMoreBtn = document.getElementById('blogLoadMoreBtn');

  if (!grid) return;

  let allPosts = [];      // every post fetched so far this session
  let currentPage = 1;
  let totalPages = 1;
  let activeCategory = 'all';
  let activeQuery = '';

  const pushEvent = (eventName, params) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: eventName }, params));
  };

  const isWordPressConfigured = () => !!WP_API && WP_API.indexOf('REPLACE_WITH') === -1;

  /* ---------- Helpers ---------- */
  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return (tmp.textContent || tmp.innerText || '').trim();
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return '';
    }
  };

  const getFeaturedImage = (post) => {
    const media = post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0];
    return media && media.source_url ? media.source_url : null;
  };

  const getCategory = (post) => {
    const terms = post._embedded && post._embedded['wp:term'] ? post._embedded['wp:term'] : [];
    const categories = terms.flat ? terms.flat().filter(t => t.taxonomy === 'category') : [];
    return categories.length ? categories[0] : null;
  };

  const slugify = (str) => (str || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  /* ---------- Render states ---------- */
  const showLoading = () => {
    grid.innerHTML = `
      <div class="blog-loading-state">
        <div class="blog-loading-spinner" aria-hidden="true"></div>
        <p>Loading the latest articles…</p>
      </div>
    `;
    if (loadMoreWrap) loadMoreWrap.style.display = 'none';
  };

  const showError = () => {
    grid.innerHTML = `
      <div class="blog-error-state">
        <h3>We couldn't load the blog right now</h3>
        <p>Please check your connection and try again in a moment.</p>
        <button type="button" class="btn btn-outline" id="blogRetryBtn">Retry</button>
      </div>
    `;
    if (loadMoreWrap) loadMoreWrap.style.display = 'none';
    const retryBtn = document.getElementById('blogRetryBtn');
    if (retryBtn) retryBtn.addEventListener('click', () => loadPosts(1, true));
  };

  const showEmpty = (title, message) => {
    grid.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'blog-empty-state';
    wrap.id = 'blogEmptyState';
    wrap.innerHTML = `
      <span class="blog-empty-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h9A1.5 1.5 0 0 1 16 5.5v13A1.5 1.5 0 0 1 14.5 20h-9A1.5 1.5 0 0 1 4 18.5v-13Z" stroke="currentColor" stroke-width="1.4"/><path d="M8 4v16M16 8h4v10.5A1.5 1.5 0 0 1 18.5 20H16" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M7 8h2M7 11h2M7 14h2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
      </span>
      <h3>${title}</h3>
      <p>${message}</p>
    `;
    grid.appendChild(wrap);
    if (loadMoreWrap) loadMoreWrap.style.display = 'none';
  };

  const buildCard = (post) => {
    const category = getCategory(post);
    const image = getFeaturedImage(post);
    const excerpt = stripHtml(post.excerpt && post.excerpt.rendered).slice(0, 130);
    const title = stripHtml(post.title && post.title.rendered);

    const card = document.createElement('article');
    card.className = 'blog-card reveal in-view';
    card.setAttribute('data-category', category ? slugify(category.name) : 'uncategorised');
    card.setAttribute('data-title', title);
    card.setAttribute('data-slug', post.slug);

    card.innerHTML = `
      <a class="blog-card-media" href="blog-details.html?slug=${encodeURIComponent(post.slug)}">
        ${image
          ? `<img src="${image}" alt="${title}" loading="lazy">`
          : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--ink-soft);">HIPA Masala</div>`}
        ${category ? `<span class="blog-card-category">${category.name}</span>` : ''}
      </a>
      <div class="blog-card-body">
        <div class="blog-card-meta"><time>${formatDate(post.date)}</time></div>
        <h3 class="blog-card-title"><a href="blog-details.html?slug=${encodeURIComponent(post.slug)}">${title}</a></h3>
        <p class="blog-card-excerpt">${excerpt}${excerpt.length >= 130 ? '…' : ''}</p>
        <a class="blog-card-link" href="blog-details.html?slug=${encodeURIComponent(post.slug)}">
          Read More
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </div>
    `;

    card.querySelectorAll('a[href^="blog-details.html"]').forEach(link => {
      link.addEventListener('click', () => {
        pushEvent('blog_article_click', { article_title: title, article_slug: post.slug });
      });
    });

    return card;
  };

  /* ---------- Category tabs — built from real fetched categories ---------- */
  const knownCategorySlugs = new Set(['all']);
  const buildCategoryTabs = (posts) => {
    if (!categoryTabs) return;
    posts.forEach(post => {
      const cat = getCategory(post);
      if (!cat) return;
      const slug = slugify(cat.name);
      if (knownCategorySlugs.has(slug)) return;
      knownCategorySlugs.add(slug);

      const btn = document.createElement('button');
      btn.className = 'category-tab' + (slug === activeCategory ? ' is-active' : '');
      btn.setAttribute('data-filter', slug);
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', slug === activeCategory ? 'true' : 'false');
      btn.textContent = cat.name;
      btn.addEventListener('click', () => setActiveCategory(slug, btn));
      categoryTabs.appendChild(btn);

      if (slug === activeCategory) {
        const allTab = categoryTabs.querySelector('[data-filter="all"]');
        if (allTab) { allTab.classList.remove('is-active'); allTab.setAttribute('aria-selected', 'false'); }
      }
    });
  };

  const setActiveCategory = (filter, clickedBtn) => {
    activeCategory = filter;
    categoryTabs.querySelectorAll('.category-tab').forEach(t => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
    });
    if (clickedBtn) {
      clickedBtn.classList.add('is-active');
      clickedBtn.setAttribute('aria-selected', 'true');
    }
    renderGrid();
  };

  if (categoryTabs) {
    const allTab = categoryTabs.querySelector('[data-filter="all"]');
    if (allTab) allTab.addEventListener('click', () => setActiveCategory('all', allTab));
  }

  /* ---------- Render the grid from allPosts, applying filters ---------- */
  const renderGrid = () => {
    const filtered = allPosts.filter(post => {
      const category = getCategory(post);
      const catSlug = category ? slugify(category.name) : 'uncategorised';
      const matchesCategory = activeCategory === 'all' || catSlug === activeCategory;
      const title = stripHtml(post.title && post.title.rendered).toLowerCase();
      const matchesQuery = activeQuery === '' || title.includes(activeQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });

    grid.innerHTML = '';

    if (filtered.length === 0) {
      if (allPosts.length === 0) {
        showEmpty('Coming Soon', 'Our latest blogs will appear here.');
      } else if (activeQuery) {
        showEmpty('No articles found', `We couldn't find any blog posts matching "${activeQuery}".`);
      } else {
        showEmpty('No articles in this category yet', 'Check back soon or browse another category.');
      }
      return;
    }

    filtered.forEach(post => grid.appendChild(buildCard(post)));

    if (loadMoreWrap) {
      loadMoreWrap.style.display = (currentPage < totalPages && activeCategory === 'all' && !activeQuery) ? 'flex' : 'none';
    }
  };

  /* ---------- Fetch from WordPress ---------- */
  const loadPosts = (page, replace) => {
    if (!isWordPressConfigured()) {
      showEmpty('Blog coming soon', 'Our WordPress blog is being set up — check back soon for recipes, cooking tips and spice guides.');
      return;
    }

    showLoading();

    const url = `${WP_API}/posts?per_page=${PER_PAGE}&page=${page}&_embed`;

    fetch(url)
      .then(res => {
        totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10) || 1;
        if (!res.ok) throw new Error('WordPress API error: ' + res.status);
        return res.json();
      })
      .then(posts => {
        allPosts = replace ? posts : allPosts.concat(posts);
        currentPage = page;
        buildCategoryTabs(posts);
        renderGrid();
      })
      .catch(() => {
        showError();
      });
  };

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => loadPosts(currentPage + 1, false));
  }

  /* ---------- Blog search (separate from the global product search) ---------- */
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';
  if (initialQuery) {
    activeQuery = initialQuery;
    if (searchInput) searchInput.value = initialQuery;
  }
  const initialCategory = params.get('category');
  if (initialCategory) activeCategory = initialCategory;

  if (searchInput) {
    let debounceId;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceId);
      debounceId = setTimeout(() => {
        activeQuery = searchInput.value.trim();
        renderGrid();
      }, 200);
    });
  }

  /* ---------- Kick off ---------- */
  loadPosts(1, true);

  /* ---------- Newsletter form (front-end only demo) ---------- */
  const form = document.getElementById('blogNewsletterForm');
  if (form) {
    const nameInput = document.getElementById('blogNewsletterName');
    const emailInput = document.getElementById('blogNewsletterEmail');
    const emailError = document.getElementById('blogNewsletterEmailError');
    const note = document.getElementById('blogNewsletterNote');
    const submitBtn = form.querySelector('.btn-primary');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
      if (emailError) emailError.classList.toggle('show', !emailValid);
      if (!emailValid) {
        emailInput.focus();
        return;
      }

      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Subscribing...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        if (note) note.classList.add('show');
        form.reset();
        setTimeout(() => { if (note) note.classList.remove('show'); }, 4000);
      }, 900);
    });
  }

});
