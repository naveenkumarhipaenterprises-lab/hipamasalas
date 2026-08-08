/* =========================================================
   HIPA MASALA — BLOG ARTICLE PAGE
   ---------------------------------------------------------
   Page-specific behaviour for blog-details.html only:
     1. Read ?slug= from the URL and fetch that post from the
        Google Sheets API via the secure Vercel function at
        /api/blog?slug=... (window.SITE_CONFIG.SHEETS_API_URL)
     2. Render title / featured image / category / author / date
        / content into the existing template
     3. Update SEO: <title>, meta description, canonical, Open
        Graph, Twitter card, and a BlogPosting JSON-LD block
     4. Render up to 3 related articles returned by the API
     5. Social share links (Facebook, X/Twitter, WhatsApp,
        LinkedIn) + copy-link button
     6. Loading / error / not-found states

   Shared behaviour (header, mobile nav, scroll reveal,
   back-to-top, footer year, top-bar/floating-button config,
   the global product search) already lives in script.js /
   product-search.js and is reused as-is.
   ========================================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const cfg        = window.SITE_CONFIG || {};
  const SHEETS_API = cfg.SHEETS_API_URL || '/api';

  const params = new URLSearchParams(window.location.search);
  const slug   = (params.get('slug') || '').trim();

  /* ---------- DOM refs ---------- */
  const heroMedia          = document.querySelector('.blog-details-hero-media');
  const categoryEl         = document.getElementById('blogCategory');
  const authorEl           = document.getElementById('blogAuthor');
  const dateEl             = document.getElementById('blogDate');
  const readTimeEl         = document.getElementById('blogReadTime');
  const titleEl            = document.getElementById('blogTitle');
  const contentEl          = document.getElementById('blogContent');
  const relatedGrid        = document.getElementById('relatedGrid');
  const breadcrumbCurrent  = document.querySelector('.breadcrumb-list .current');

  /* ---------- Helpers ---------- */
  const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = String(str || '');
    return div.innerHTML;
  };

  const escapeAttr = (str) =>
    String(str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    return (tmp.textContent || tmp.innerText || '').trim();
  };

  const formatDate = (dateStr) => {
    try {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) { return ''; }
  };

  const estimateReadTime = (html) => {
    const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200)) + ' min read';
  };

  /* ---------- Loading state ---------- */
  const showArticleLoading = () => {
    if (contentEl) contentEl.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;padding:48px 24px;color:var(--ink-soft);">
        <div class="blog-loading-spinner" aria-hidden="true"></div>
        <p>Loading article…</p>
      </div>
    `;
  };

  /* ---------- SEO updater ---------- */
  const setMeta = (selector, attr, value) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };

  const updateSEO = (post) => {
    const title       = post.meta_title       || post.title   || '';
    const description = (post.meta_description || post.excerpt || '').slice(0, 160);
    const canonicalUrl = 'https://www.hipamasalas.com/blog-details.html?slug=' + encodeURIComponent(post.slug);
    const image       = post.featured_image   || 'https://www.hipamasalas.com/og-image.png';

    document.title = `${title} | HIPA Traditional Masala Blog`;
    setMeta('meta[name="description"]',        'content', description);
    setMeta('link[rel="canonical"]',           'href',    canonicalUrl);
    setMeta('meta[name="robots"]',             'content', 'index, follow');

    /* Open Graph */
    setMeta('meta[property="og:type"]',        'content', 'article');
    setMeta('meta[property="og:title"]',       'content', `${title} | HIPA Traditional Masala Blog`);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]',         'content', canonicalUrl);
    setMeta('meta[property="og:image"]',       'content', image);

    /* Twitter */
    setMeta('meta[name="twitter:title"]',       'content', `${title} | HIPA Traditional Masala Blog`);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]',       'content', image);

    /* Keywords (if provided) */
    if (post.keywords) {
      let kwMeta = document.querySelector('meta[name="keywords"]');
      if (!kwMeta) { kwMeta = document.createElement('meta'); kwMeta.name = 'keywords'; document.head.appendChild(kwMeta); }
      kwMeta.content = post.keywords;
    }

    /* BlogPosting JSON-LD structured data */
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context':          'https://schema.org',
      '@type':             'BlogPosting',
      headline:            title,
      description:         description,
      image:               image,
      datePublished:       post.publish_date,
      dateModified:        post.publish_date,
      author:              { '@type': 'Person', name: post.author || 'HIPA Masala Team' },
      publisher: {
        '@type': 'Organization',
        name:    'Hipa Masala',
        logo:    { '@type': 'ImageObject', url: 'https://www.hipamasalas.com/images/logo.png' }
      },
      mainEntityOfPage:    { '@type': 'WebPage', '@id': canonicalUrl },
      articleSection:      post.category  || undefined,
      keywords:            post.keywords  || undefined
    });
    document.head.appendChild(ld);

    if (breadcrumbCurrent) breadcrumbCurrent.textContent = title;
  };

  /* ---------- Social share links ---------- */
  const renderShareLinks = (post) => {
    const pageUrl   = window.location.href;
    const pageTitle = post.title || '';

    const links = {
      shareFacebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
      shareTwitter:  `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`,
      shareWhatsapp: `https://wa.me/?text=${encodeURIComponent(pageTitle + ' ' + pageUrl)}`,
      shareLinkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`
    };

    Object.keys(links).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.href = links[id];
    });

    const copyBtn = document.getElementById('shareCopyLink');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(pageUrl);
          const orig = copyBtn.getAttribute('aria-label');
          copyBtn.setAttribute('aria-label', 'Link copied ✓');
          setTimeout(() => copyBtn.setAttribute('aria-label', orig), 2000);
        } catch (_) { /* Clipboard unavailable — other share buttons still work. */ }
      });
    }
  };

  /* ---------- Render up to 3 related posts ---------- */
  const renderRelated = (relatedPosts) => {
    if (!relatedGrid || !relatedPosts || !relatedPosts.length) return;

    relatedGrid.innerHTML = '';
    relatedPosts.forEach(p => {
      const excerpt = (p.excerpt || '').slice(0, 110);
      const pTitle  = p.title   || '';
      const pImage  = p.featured_image || '';

      const card = document.createElement('article');
      card.className = 'blog-card reveal in-view';
      card.innerHTML = `
        <a class="blog-card-media" href="blog-details.html?slug=${encodeURIComponent(p.slug)}">
          ${pImage ? `<img src="${escapeAttr(pImage)}" alt="${escapeAttr(pTitle)}" loading="lazy">` : ''}
          ${p.category ? `<span class="blog-card-category">${escapeHtml(p.category)}</span>` : ''}
        </a>
        <div class="blog-card-body">
          <div class="blog-card-meta"><time>${formatDate(p.publish_date)}</time></div>
          <h3 class="blog-card-title"><a href="blog-details.html?slug=${encodeURIComponent(p.slug)}">${escapeHtml(pTitle)}</a></h3>
          <p class="blog-card-excerpt">${escapeHtml(excerpt)}${excerpt.length >= 110 ? '…' : ''}</p>
        </div>
      `;
      relatedGrid.appendChild(card);
    });
  };

  /* ---------- Render the article ---------- */
  const renderArticle = (post, related) => {
    const title    = post.title          || '';
    const category = post.category       || '';
    const image    = post.featured_image || '';

    if (titleEl)    titleEl.textContent    = title;
    if (categoryEl) categoryEl.textContent = category || 'Uncategorised';
    if (authorEl)   authorEl.textContent   = post.author || 'HIPA Masala Team';

    if (dateEl) {
      dateEl.textContent = formatDate(post.publish_date);
      if (post.publish_date) dateEl.setAttribute('datetime', post.publish_date);
    }

    if (readTimeEl) readTimeEl.textContent = estimateReadTime(post.content || '');

    /* Content is HTML that has already been sanitised by the server.
       This is intentional — blog articles contain formatted HTML. */
    if (contentEl) contentEl.innerHTML = post.content || '';

    if (heroMedia && image) {
      heroMedia.innerHTML = `<img src="${escapeAttr(image)}" alt="${escapeAttr(title)}" loading="lazy">`;
    } else if (heroMedia && !image) {
      /* Keep the existing placeholder SVG intact by doing nothing here */
    }

    updateSEO(post);
    renderShareLinks(post);
    renderRelated(related);
  };

  /* ---------- Not-found / error states ---------- */
  const renderNotFound = () => {
    if (titleEl)    titleEl.textContent = 'Article not found';
    if (categoryEl) categoryEl.textContent = '';
    if (contentEl) {
      contentEl.innerHTML = `
        <div class="blog-content-placeholder">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h9A1.5 1.5 0 0 1 16 5.5v13A1.5 1.5 0 0 1 14.5 20h-9A1.5 1.5 0 0 1 4 18.5v-13Z" stroke="currentColor" stroke-width="1.4"/><path d="M8 4v16M16 8h4v10.5A1.5 1.5 0 0 1 18.5 20H16" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M7 8h2M7 11h2M7 14h2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          <p>We couldn't find that article. It may have been moved or unpublished. <a href="blog.html">Browse all articles →</a></p>
        </div>
      `;
    }
    document.title = 'Article Not Found | HIPA Traditional Masala Blog';
    setMeta('meta[name="robots"]', 'content', 'noindex, follow');
  };

  const renderApiError = () => {
    if (contentEl) {
      contentEl.innerHTML = `
        <div class="blog-content-placeholder">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h9A1.5 1.5 0 0 1 16 5.5v13A1.5 1.5 0 0 1 14.5 20h-9A1.5 1.5 0 0 1 4 18.5v-13Z" stroke="currentColor" stroke-width="1.4"/></svg>
          <p>We couldn't load this article right now. Please check your connection and <button type="button" onclick="window.location.reload()" style="all:unset;cursor:pointer;text-decoration:underline;color:var(--green-700);">try again</button>.</p>
        </div>
      `;
    }
  };

  /* ---------- Kick off ---------- */
  if (!slug) {
    renderNotFound();
    return;
  }

  showArticleLoading();

  fetch(`${SHEETS_API}/blog?slug=${encodeURIComponent(slug)}`)
    .then(res => {
      if (res.status === 404) { renderNotFound(); return null; }
      if (!res.ok) throw new Error('API error: ' + res.status);
      return res.json();
    })
    .then(data => {
      if (!data) return;
      renderArticle(data.post, data.related || []);
    })
    .catch(() => renderApiError());

});
