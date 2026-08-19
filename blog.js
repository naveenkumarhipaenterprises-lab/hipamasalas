/* =========================================================
   HIPA MASALA — BLOG LISTING PAGE
   ---------------------------------------------------------
   Fetches published posts from /api/blogs and renders cards
   with clean URLs (/blog/{slug}).
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

  let allPosts       = [];
  let currentPage    = 1;
  let totalPages     = 1;
  let activeCategory = 'all';
  let activeQuery    = '';

  const getCleanSlug = (str) => {
    if (!str) return '';
    let s = String(str).trim().toLowerCase();
    try { s = decodeURIComponent(s); } catch (e) {}
    return s.replace(/^\/+|\/+$/g, '');
  };

  const pushEvent = (eventName, params) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: eventName }, params));
  };

  const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = String(str || '');
    return div.innerHTML;
  };

  const escapeAttr = (str) =>
    String(str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  const extractDriveFileId = (url) => {
    const str = String(url || '').trim();
    if (!str) return null;
    const patterns = [
      /\/d\/([a-zA-Z0-9_-]{15,})/,
      /[?&]id=([a-zA-Z0-9_-]{15,})/
    ];
    for (const re of patterns) {
      const m = str.match(re);
      if (m && m[1]) return m[1];
    }
    return null;
  };

  const isGoogleDocLink = (url) => /docs\.google\.com\/document\//i.test(String(url || ''));

  const toDriveImageUrl = (url) => {
    const str = String(url || '').trim();
    if (!str) return '';
    if (!/drive\.google\.com|docs\.google\.com/i.test(str)) return str;
    if (str.includes('lh3.googleusercontent.com')) return str;
    if (isGoogleDocLink(str)) return str;
    const id = extractDriveFileId(str);
    return id ? `https://lh3.googleusercontent.com/d/${id}` : str;
  };

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

  const slugify = (str) =>
    (str || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

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

  const buildCard = (post) => {
    const category  = post.category  || '';
    const rawImage  = post.featured_image || '';
    const image     = toDriveImageUrl(rawImage);
    const excerpt   = (post.excerpt  || '').slice(0, 130);
    const title     = post.title     || '';
    const cleanSlug = getCleanSlug(post.slug);
    const blogHref  = `/blog/${cleanSlug}`;

    const card = document.createElement('article');
    card.className = 'blog-card reveal in-view';
    card.setAttribute('data-category', category ? slugify(category) : 'uncategorised');
    card.setAttribute('data-title',    title);
    card.setAttribute('data-slug',     cleanSlug);

    card.innerHTML = `
      <a class="blog-card-media" href="${blogHref}">
        ${image
          ? `<img src="${escapeAttr(image)}" alt="${escapeAttr(title)}" loading="lazy">`
          : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--ink-soft);">HIPA Masala</div>`}
        ${category ? `<span class="blog-card-category">${escapeHtml(category)}</span>` : ''}
      </a>
      <div class="blog-card-body">
        <div class="blog-card-meta"><time>${formatDate(post.publish_date)}</time></div>
        <h3 class="blog-card-title"><a href="${blogHref}">${escapeHtml(title)}</a></h3>
        <p class="blog-card-excerpt">${escapeHtml(excerpt)}${excerpt.length >= 130 ? '…' : ''}</p>
        <a class="blog-card-link" href="${blogHref}">
          Read More
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </div>
    `;

    card.querySelectorAll('a[href^="/blog/"]').forEach(link => {
      link.addEventListener('click', () => {
        pushEvent('blog_article_click', { article_title: title, article_slug: cleanSlug });
      });
    });

    if (image) {
      const imgEl = card.querySelector('.blog-card-media img');
      if (imgEl) attachDriveImageFallback(imgEl, rawImage);
    }

    return card;
  };

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
      btn.setAttribute('data-filter',   slug);
      btn.setAttribute('role',          'tab');
      btn.setAttribute('aria-selected', slug === activeCategory ? 'true' : 'false');
      btn.textContent = catName;
      btn.addEventListener('click', () => setActiveCategory(slug, btn));
      categoryTabs.appendChild(btn);
    });
  };

  const setActiveCategory = (categorySlug, tabBtn) => {
    activeCategory = categorySlug;
    if (categoryTabs) {
      categoryTabs.querySelectorAll('.category-tab').forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
    }
    if (tabBtn) {
      tabBtn.classList.add('is-active');
      tabBtn.setAttribute('aria-selected', 'true');
    }
    renderFilteredPosts();
  };

  const getFilteredPosts = () => {
    return allPosts.filter(post => {
      const matchCat = activeCategory === 'all' || slugify(post.category || '') === activeCategory;
      const q = activeQuery.toLowerCase().trim();
      const matchSearch = !q ||
        (post.title || '').toLowerCase().includes(q) ||
        (post.excerpt || '').toLowerCase().includes(q) ||
        (post.category || '').toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  };

  const renderFilteredPosts = () => {
    const filtered = getFilteredPosts();
    if (filtered.length === 0) {
      if (activeQuery) {
        showEmpty('No matching articles found', `We couldn't find any articles matching "${activeQuery}". Try a different keyword or view all categories.`);
      } else {
        showEmpty('No articles in this category', 'There are no published articles in this category yet. Check back soon!');
      }
      return;
    }

    grid.innerHTML = '';
    const slice = filtered.slice(0, currentPage * PER_PAGE);
    slice.forEach(post => grid.appendChild(buildCard(post)));

    if (loadMoreWrap) {
      loadMoreWrap.style.display = slice.length < filtered.length ? 'block' : 'none';
    }
  };

  const loadPosts = (page = 1, isInitial = false) => {
    if (isInitial) showLoading();

    fetch(`${SHEETS_API}/blogs?page=1&per_page=50`)
      .then(res => {
        if (!res.ok) throw new Error('API network error: ' + res.status);
        return res.json();
      })
      .then(data => {
        if (!data || !Array.isArray(data.posts)) {
          showEmpty('No articles available', 'No blog articles have been published yet. Please check back later!');
          return;
        }

        allPosts = data.posts;
        buildCategoryTabs(allPosts);
        renderFilteredPosts();
      })
      .catch(err => {
        console.error('Failed loading blogs:', err);
        showError();
      });
  };

  if (searchInput) {
    let timer;
    searchInput.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        activeQuery = searchInput.value;
        currentPage = 1;
        renderFilteredPosts();
      }, 250);
    });
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentPage += 1;
      renderFilteredPosts();
    });
  }

  loadPosts(1, true);
});
