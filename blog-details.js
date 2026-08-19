/* =========================================================
   HIPA MASALA — BLOG ARTICLE PAGE
   ---------------------------------------------------------
   Page-specific behaviour for blog-details.html:
     1. Reads clean slug from path /blog/{slug} or ?slug=
     2. Fetches post content from /api/blog?slug=...
     3. Updates SEO title, meta description, canonical, OG tags
     4. Renders related articles with clean /blog/{slug} URLs
   ========================================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const cfg        = window.SITE_CONFIG || {};
  const SHEETS_API = cfg.SHEETS_API_URL || '/api';

  const getCleanSlug = (str) => {
    if (!str) return '';
    let s = String(str).trim().toLowerCase();
    try { s = decodeURIComponent(s); } catch (e) {}
    return s.replace(/^\/+|\/+$/g, '');
  };

  const getSlugFromUrl = () => {
    const path = window.location.pathname;
    const match = path.match(/\/blog\/(.+)/i);
    if (match && match[1]) {
      return getCleanSlug(match[1]);
    }
    const params = new URLSearchParams(window.location.search);
    const qSlug = params.get('slug');
    if (qSlug) {
      return getCleanSlug(qSlug);
    }
    return '';
  };

  const slug = getSlugFromUrl();

  // If accessed via legacy query string, normalize browser URL silently
  if (slug && (window.location.search.includes('slug=') || window.location.pathname.includes('blog-details'))) {
    try {
      window.history.replaceState(null, '', `/blog/${slug}`);
    } catch (e) {}
  }

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

  const attachDriveImageFallback = (img, originalUrl, wrapSelector) => {
    const id = extractDriveFileId(originalUrl);
    if (!id) return;
    let stage = 0;
    img.addEventListener('error', function onError() {
      stage += 1;
      if (stage === 1) {
        img.src = `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
      } else {
        img.removeEventListener('error', onError);
        const wrap = wrapSelector ? img.closest(wrapSelector) : null;
        if (wrap) wrap.classList.add('blog-img-fallback');
        img.remove();
      }
    });
  };

  const fixDriveImagesInHtml = (html) => {
    if (!html) return html;
    return html.replace(/<img([^>]*?)src=(["'])(.*?)\2([^>]*)>/gi, (match, pre, quote, src, post) => {
      const fixedSrc = toDriveImageUrl(src);
      return `<img${pre}src=${quote}${fixedSrc}${quote}${post}>`;
    });
  };

  const normaliseArticleContent = (html) => {
    const trimmed = String(html || '').trim();
    const bareDocMatch = trimmed.match(/^https?:\/\/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/i);
    if (bareDocMatch) {
      return `<div class="blog-doc-embed" style="width:100%;margin:20px 0;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);background:#fff;">
        <iframe src="https://docs.google.com/document/d/${bareDocMatch[1]}/preview" style="width:100%;height:850px;border:none;display:block;" loading="lazy" title="Article content"></iframe>
      </div>`;
    }
    return fixDriveImagesInHtml(trimmed);
  };

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

  const showArticleLoading = () => {
    if (contentEl) contentEl.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;padding:48px 24px;color:var(--ink-soft);">
        <div class="blog-loading-spinner" aria-hidden="true"></div>
        <p>Loading article…</p>
      </div>
    `;
  };

  const setMeta = (selector, attr, value) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };

  const updateSEO = (post) => {
    const title       = post.meta_title       || post.title   || '';
    const description = (post.meta_description || post.excerpt || '').slice(0, 160);
    const cleanSlug   = getCleanSlug(post.slug);
    const canonicalUrl = `https://www.hipamasalas.com/blog/${cleanSlug}`;
    const image       = toDriveImageUrl(post.featured_image) || 'https://www.hipamasalas.com/og-image.png';

    document.title = `${title} | HIPA Traditional Masala Blog`;
    setMeta('meta[name="description"]',        'content', description);
    setMeta('link[rel="canonical"]',           'href',    canonicalUrl);
    setMeta('meta[name="robots"]',             'content', 'index, follow');

    setMeta('meta[property="og:type"]',        'content', 'article');
    setMeta('meta[property="og:title"]',       'content', `${title} | HIPA Traditional Masala Blog`);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]',         'content', canonicalUrl);
    setMeta('meta[property="og:image"]',       'content', image);

    setMeta('meta[name="twitter:title"]',       'content', `${title} | HIPA Traditional Masala Blog`);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]',       'content', image);

    if (post.keywords) {
      let kwMeta = document.querySelector('meta[name="keywords"]');
      if (!kwMeta) { kwMeta = document.createElement('meta'); kwMeta.name = 'keywords'; document.head.appendChild(kwMeta); }
      kwMeta.content = post.keywords;
    }

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

  const renderShareLinks = (post) => {
    const pageUrl   = `https://www.hipamasalas.com/blog/${getCleanSlug(post.slug)}`;
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
          copyBtn.setAttribute('aria-label', 'Link copied ?');
          setTimeout(() => copyBtn.setAttribute('aria-label', orig), 2000);
        } catch (_) {}
      });
    }
  };

  const renderRelated = (relatedPosts) => {
    if (!relatedGrid || !relatedPosts || !relatedPosts.length) return;

    relatedGrid.innerHTML = '';
    relatedPosts.forEach(p => {
      const excerpt   = (p.excerpt || '').slice(0, 110);
      const pTitle    = p.title   || '';
      const rawImage  = p.featured_image || '';
      const pImage    = toDriveImageUrl(rawImage);
      const cleanSlug = getCleanSlug(p.slug);
      const blogHref  = `/blog/${cleanSlug}`;

      const card = document.createElement('article');
      card.className = 'blog-card reveal in-view';
      card.innerHTML = `
        <a class="blog-card-media" href="${blogHref}">
          ${pImage ? `<img src="${escapeAttr(pImage)}" alt="${escapeAttr(pTitle)}" loading="lazy">` : ''}
          ${p.category ? `<span class="blog-card-category">${escapeHtml(p.category)}</span>` : ''}
        </a>
        <div class="blog-card-body">
          <div class="blog-card-meta"><time>${formatDate(p.publish_date)}</time></div>
          <h3 class="blog-card-title"><a href="${blogHref}">${escapeHtml(pTitle)}</a></h3>
          <p class="blog-card-excerpt">${escapeHtml(excerpt)}${excerpt.length >= 110 ? '…' : ''}</p>
        </div>
      `;

      if (pImage) {
        const imgEl = card.querySelector('.blog-card-media img');
        if (imgEl) attachDriveImageFallback(imgEl, rawImage, '.blog-card-media');
      }

      relatedGrid.appendChild(card);
    });
  };

  const renderArticle = (post, related) => {
    const title      = post.title          || '';
    const category   = post.category       || '';
    const rawImage   = post.featured_image || '';
    const image      = toDriveImageUrl(rawImage);

    if (titleEl)    titleEl.textContent    = title;
    if (categoryEl) categoryEl.textContent = category || 'Uncategorised';
    if (authorEl)   authorEl.textContent   = post.author || 'HIPA Masala Team';

    if (dateEl) {
      dateEl.textContent = formatDate(post.publish_date);
      if (post.publish_date) dateEl.setAttribute('datetime', post.publish_date);
    }

    if (readTimeEl) readTimeEl.textContent = estimateReadTime(post.content || '');

    if (contentEl) contentEl.innerHTML = normaliseArticleContent(post.content || '');

    if (heroMedia && image) {
      heroMedia.innerHTML = `<img src="${escapeAttr(image)}" alt="${escapeAttr(title)}" loading="lazy">`;
      const heroImg = heroMedia.querySelector('img');
      if (heroImg) attachDriveImageFallback(heroImg, rawImage, '.blog-details-hero-media');
    }

    updateSEO(post);
    renderShareLinks(post);
    renderRelated(related);
  };

  const renderNotFound = () => {
    if (titleEl)    titleEl.textContent = 'Article not found';
    if (categoryEl) categoryEl.textContent = '';
    if (contentEl) {
      contentEl.innerHTML = `
        <div class="blog-content-placeholder">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h9A1.5 1.5 0 0 1 16 5.5v13A1.5 1.5 0 0 1 14.5 20h-9A1.5 1.5 0 0 1 4 18.5v-13Z" stroke="currentColor" stroke-width="1.4"/><path d="M8 4v16M16 8h4v10.5A1.5 1.5 0 0 1 18.5 20H16" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M7 8h2M7 11h2M7 14h2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          <p>We couldn't find that article. It may have been moved or unpublished. <a href="/blog.html">Browse all articles ?</a></p>
        </div>
      `;
    }
    document.title = 'Article Not Found | HIPA Traditional Masala Blog';
    setMeta('meta[name="robots"]', 'content', 'noindex, follow');
  };

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
      if (data.post) {
        renderArticle(data.post, data.related || []);
      } else {
        renderNotFound();
      }
    })
    .catch(err => {
      console.error('Failed loading post details:', err);
      renderNotFound();
    });
});
