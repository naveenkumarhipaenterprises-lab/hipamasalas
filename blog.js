/* =========================================================
   HIPA MASALA — BLOG LISTING PAGE
   ---------------------------------------------------------
   Page-specific behaviour for blog.html only:
     1. Fetch published posts from the Google Sheets API
        via the secure Vercel serverless function at /api/blogs
        (window.SITE_CONFIG.SHEETS_API_URL, see config.js)
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

  const cfg         = window.SITE_CONFIG || {};
  const SHEETS_API  = cfg.SHEETS_API_URL || '/api';
  const PER_PAGE    = 9;

  const grid          = document.getElementById('blogGrid');
  const categoryTabs  = document.getElementById('categoryTabs');
  const searchInput   = document.getElementById('blogSearchInput');
  const loadMoreWrap  = document.getElementById('blogLoadMoreWrap');
  const loadMoreBtn   = document.getElementById('blogLoadMoreBtn');

  if (!grid) return;

  let allPosts      = [];
  let currentPage   = 1;
  let totalPages    = 1;
  let activeCategory = 'all';
  let activeQuery    = '';

  /* ---------- GTM / GA4 dataLayer push ---------- */
  const pushEvent = (eventName, params) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: eventName }, params));
  };

  /* ---------- Helpers ---------- */
  const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = String(str || '');
    return div.innerHTML;
  };

  const escapeAttr = (str) =>
    String(str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  /* ---------- Google Drive / Docs link helpers ---------- *
   * The /api/blogs endpoint already converts Banner Image links to direct
   * lh3.googleusercontent.com URLs server-side. These client-side helpers are
   * a safety net so cover images still work even if a raw Drive/Docs share
   * link ever reaches the browser untouched (manual data overrides, a future
   * direct-Sheets integration, etc.), and so a broken share permission
   * doesn't leave a dead <img> on the card. */
  const extractDriveFileId = (url) => {
    const str = String(url || '').trim();
    if (!str) return null;
    const patterns = [
      /\/d\/([a-zA-Z0-9_-]{15,})/,     // drive.google.com/file/d/FILE_ID/view, docs.google.com/document/d/FILE_ID/...
      /[?&]id=([a-zA-Z0-9_-]{15,})/    // drive.google.com/open?id=FILE_ID, uc?id=FILE_ID
    ];
    for (const re of patterns) {
      const m = str.match(re);
      if (m && m[1]) return m[1];
    }
    return null;
  };

  const isGoogleDocLink = (url) => /docs\.google\.com\/document\//i.test(String(url || ''));

  /* Converts a standard Google Drive "share" link into a directly-loadable
     image URL (https://lh3.googleusercontent.com/d/FILE_ID), instead of the
     Drive preview page the raw share link would otherwise load. Leaves
     non-Drive URLs (e.g. already-hosted images) untouched. */
  const toDriveImageUrl = (url) => {
    const str = String(url || '').trim();
    if (!str) return '';
    if (!/drive\.google\.com|docs\.google\.com/i.test(str)) return str;
    if (str.includes('lh3.googleusercontent.com')) return str;
    if (isGoogleDocLink(str)) return str; // a Doc link, not an image — leave as-is
    const id = extractDriveFileId(str);
    return id ? `https://lh3.googleusercontent.com/d/${id}` : str;
  };

  /* If the lh3 URL 404s (e.g. sharing permission not set to "Anyone with the
     link"), fall back once to Drive's thumbnail endpoint before giving up
     and hiding the broken image rather than showing a broken-image icon. */
  const attachDriveImageFallback = (img, originalUrl) => {
    const id = extractDriveFileId(originalUrl);
    if (!id) return;
    let stage = 0;
    img.addEventListener('error', function onError() {
      stage += 1;
      if (stage === 1) {
        img.src = `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
      } else {
        img.removeEventListener('error', onError);
        const wrap = img.closest('.blog-card-media');
        if (wrap) wrap.classList.add('blog-img-fallback');
        img.remove();
      }
    });
  };

  const formatDate = (dateStr) => {
    try {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) { return ''; }
  };

  /* Produces a lowercase hyphen-slug from a string — used to key category tabs. */
  const slugify = (str) =>
    (str || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

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
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(message)}</p>
    `;
    grid.appendChild(wrap);
    if (loadMoreWrap) loadMoreWrap.style.display = 'none';
  };

  /* ---------- Build a single blog card ---------- */
  const buildCard = (post) => {
    const category  = post.category  || '';
    const rawImage  = post.featured_image || '';
    const image     = toDriveImageUrl(rawImage);
    const excerpt   = (post.excerpt  || '').slice(0, 130);
    const title     = post.title     || '';
    const slug      = post.slug      || '';

    const card = document.createElement('article');
    card.className = 'blog-card reveal in-view';
    card.setAttribute('data-category', category ? slugify(category) : 'uncategorised');
    card.setAttribute('data-title',    title);
    card.setAttribute('data-slug',     slug);

    card.innerHTML = `
      <a class="blog-card-media" href="blog-details.html?slug=${encodeURIComponent(slug)}">
        ${image
          ? `<img src="${escapeAttr(image)}" alt="${escapeAttr(title)}" loading="lazy">`
          : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--ink-soft);">HIPA Masala</div>`}
        ${category ? `<span class="blog-card-category">${escapeHtml(category)}</span>` : ''}
      </a>
      <div class="blog-card-body">
        <div class="blog-card-meta"><time>${formatDate(post.publish_date)}</time></div>
        <h3 class="blog-card-title"><a href="blog-details.html?slug=${encodeURIComponent(slug)}">${escapeHtml(title)}</a></h3>
        <p class="blog-card-excerpt">${escapeHtml(excerpt)}${excerpt.length >= 130 ? '…' : ''}</p>
        <a class="blog-card-link" href="blog-details.html?slug=${encodeURIComponent(slug)}">
          Read More
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </div>
    `;

    /* GTM / GA4 event — unchanged from original */
    card.querySelectorAll('a[href^="blog-details.html"]').forEach(link => {
      link.addEventListener('click', () => {
        pushEvent('blog_article_click', { article_title: title, article_slug: slug });
      });
    });

    if (image) {
      const imgEl = card.querySelector('.blog-card-media img');
      if (imgEl) attachDriveImageFallback(imgEl, rawImage);
    }

    return card;
  };

  /* ---------- Category tabs — built from fetched category strings ---------- */
  const knownCategorySlugs = new Set(['all']);

  const buildCategoryTabs = (posts) => {
    if (!categoryTabs) return;
    posts.forEach(post => {
      const catName = post.category || '';
      if (!catName) return;
      const slug = slugify(catName);
      if (knownCategorySlugs.has(slug)) return;
      knownCategorySlugs.add(slug);

      const btn = document.createElement('button');
      btn.className = 'category-tab' + (slug === activeCategory ? ' is-active' : '');
      btn.setAttribute('data-filter',    slug);
      btn.setAttribute('role',           'tab');
      btn.setAttribute('aria-selected',  slug === activeCategory ? 'true' : 'false');
      btn.textContent = catName;
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

  /* ---------- Render the grid from allPosts, applying active filters ---------- */
  const renderGrid = () => {
    const filtered = allPosts.filter(post => {
      const catSlug       = post.category ? slugify(post.category) : 'uncategorised';
      const matchCat      = activeCategory === 'all' || catSlug === activeCategory;
      const matchQuery    = activeQuery === '' || (post.title || '').toLowerCase().includes(activeQuery.toLowerCase());
      return matchCat && matchQuery;
    });

    grid.innerHTML = '';

    if (filtered.length === 0) {
      if (allPosts.length === 0) {
        showEmpty('Coming Soon', 'Our latest blogs will appear here.');
      } else if (activeQuery) {
        showEmpty('No articles found', `We couldn't find any posts matching "${activeQuery}".`);
      } else {
        showEmpty('No articles in this category yet', 'Check back soon or browse another category.');
      }
      return;
    }

    filtered.forEach(post => grid.appendChild(buildCard(post)));

    if (loadMoreWrap) {
      loadMoreWrap.style.display =
        (currentPage < totalPages && activeCategory === 'all' && !activeQuery) ? 'flex' : 'none';
    }
  };

  /* ---------- Fetch from the Google Sheets API via /api/blogs ---------- */
  const loadPosts = (page, replace) => {
    showLoading();

    const url = `${SHEETS_API}/blogs?per_page=${PER_PAGE}&page=${page}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('API error: ' + res.status);
        return res.json();
      })
      .then(data => {
        totalPages  = data.total_pages || 1;
        const posts = data.posts || [];
        allPosts    = replace ? posts : allPosts.concat(posts);
        currentPage = page;
        buildCategoryTabs(posts);
        renderGrid();
      })
      .catch(() => showError());
  };

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => loadPosts(currentPage + 1, false));
  }

  /* ---------- Blog search (separate from the global product search) ---------- */
  const params = new URLSearchParams(window.location.search);
  const initialQuery    = params.get('q') || '';
  const initialCategory = params.get('category') || '';

  if (initialQuery)    { activeQuery    = initialQuery;    if (searchInput) searchInput.value = initialQuery; }
  if (initialCategory) { activeCategory = initialCategory; }

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

  /* ---------- Newsletter form (front-end only) ---------- */
  const form = document.getElementById('blogNewsletterForm');
  if (form) {
    const emailInput = document.getElementById('blogNewsletterEmail');
    const emailError = document.getElementById('blogNewsletterEmailError');
    const note       = document.getElementById('blogNewsletterNote');
    const submitBtn  = form.querySelector('.btn-primary');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((emailInput.value || '').trim());
      if (emailError) emailError.classList.toggle('show', !emailValid);
      if (!emailValid) { emailInput.focus(); return; }

      const originalText = submitBtn.textContent;
      submitBtn.disabled  = true;
      submitBtn.textContent = 'Subscribing...';

      setTimeout(() => {
        submitBtn.disabled   = false;
        submitBtn.textContent = originalText;
        if (note) note.classList.add('show');
        form.reset();
        setTimeout(() => { if (note) note.classList.remove('show'); }, 4000);
      }, 900);
    });
  }

});
