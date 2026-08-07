/* =========================================================
   HIPA MASALA — BLOG ARTICLE PAGE
   ---------------------------------------------------------
   Page-specific behaviour for blog-details.html only:
     1. Read ?slug= from the URL and fetch that post from the
        WordPress REST API (window.SITE_CONFIG.WORDPRESS_API_URL)
     2. Render title / featured image / category / author / date
        / content into the existing template
     3. Update SEO: <title>, meta description, canonical, Open
        Graph, Twitter card, and a BlogPosting JSON-LD block
     4. Fetch 3 related articles (same category)
     5. Social share links (built after the real title/URL are
        known) + copy-link button
     6. Loading / error states

   Shared behaviour (header, mobile nav, scroll reveal,
   back-to-top, footer year, top-bar/floating-button config,
   the global product search) already lives in script.js /
   product-search.js and is reused as-is.
   ========================================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const cfg = window.SITE_CONFIG || {};
  const WP_API = cfg.WORDPRESS_API_URL;
  const isWordPressConfigured = () => !!WP_API && WP_API.indexOf('REPLACE_WITH') === -1;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  const heroMedia = document.querySelector('.blog-details-hero-media');
  const categoryEl = document.getElementById('blogCategory');
  const authorEl = document.getElementById('blogAuthor');
  const dateEl = document.getElementById('blogDate');
  const readTimeEl = document.getElementById('blogReadTime');
  const titleEl = document.getElementById('blogTitle');
  const contentEl = document.getElementById('blogContent');
  const relatedGrid = document.getElementById('relatedGrid');
  const breadcrumbCurrent = document.querySelector('.breadcrumb-list .current');

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

  const estimateReadTime = (html) => {
    const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200)) + ' min read';
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

  const getAuthorName = (post) => {
    const author = post._embedded && post._embedded.author && post._embedded.author[0];
    return author && author.name ? author.name : 'HIPA Masala Team';
  };

  const setMeta = (selector, attr, value) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };

  const updateSEO = (post) => {
    const title = stripHtml(post.title && post.title.rendered);
    const description = stripHtml(post.excerpt && post.excerpt.rendered).slice(0, 160);
    const url = window.location.href.split('?')[0] + '?slug=' + encodeURIComponent(post.slug);
    const image = getFeaturedImage(post) || 'https://www.hipamasalas.com/images/og-image.png';

    document.title = `${title} | HIPA Traditional Masala Blog`;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[name="robots"]', 'content', 'index, follow');

    setMeta('meta[property="og:type"]', 'content', 'article');
    setMeta('meta[property="og:title"]', 'content', `${title} | HIPA Traditional Masala Blog`);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:image"]', 'content', image);

    setMeta('meta[name="twitter:title"]', 'content', `${title} | HIPA Traditional Masala Blog`);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', image);

    const category = getCategory(post);
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: description,
      image: image,
      datePublished: post.date,
      dateModified: post.modified || post.date,
      author: { '@type': 'Person', name: getAuthorName(post) },
      publisher: {
        '@type': 'Organization',
        name: 'Hipa Masala',
        logo: { '@type': 'ImageObject', url: 'https://www.hipamasalas.com/images/logo.png' }
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      articleSection: category ? category.name : undefined
    });
    document.head.appendChild(ld);

    if (breadcrumbCurrent) breadcrumbCurrent.textContent = title;
  };

  const renderShareLinks = (post) => {
    const pageUrl = window.location.href;
    const pageTitle = stripHtml(post.title && post.title.rendered);

    const shareLinks = {
      shareFacebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
      shareTwitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`,
      shareWhatsapp: `https://wa.me/?text=${encodeURIComponent(pageTitle + ' ' + pageUrl)}`,
      shareLinkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`
    };

    Object.keys(shareLinks).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.href = shareLinks[id];
    });

    const copyBtn = document.getElementById('shareCopyLink');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(pageUrl);
          const original = copyBtn.getAttribute('aria-label');
          copyBtn.setAttribute('aria-label', 'Link copied');
          setTimeout(() => copyBtn.setAttribute('aria-label', original), 2000);
        } catch (err) {
          /* Clipboard API unavailable — fail silently, link is still shareable via other buttons. */
        }
      });
    }
  };

  const renderArticle = (post) => {
    const title = stripHtml(post.title && post.title.rendered);
    const category = getCategory(post);
    const image = getFeaturedImage(post);

    if (titleEl) titleEl.textContent = title;
    if (categoryEl) categoryEl.textContent = category ? category.name : 'Uncategorised';
    if (authorEl) authorEl.textContent = getAuthorName(post);
    if (dateEl) {
      dateEl.textContent = formatDate(post.date);
      dateEl.setAttribute('datetime', post.date);
    }
    if (readTimeEl) readTimeEl.textContent = estimateReadTime(post.content && post.content.rendered);
    if (contentEl) contentEl.innerHTML = (post.content && post.content.rendered) || '';

    if (heroMedia && image) {
      heroMedia.innerHTML = `<img src="${image}" alt="${title}" loading="lazy">`;
    }

    updateSEO(post);
    renderShareLinks(post);
    loadRelated(post);
  };

  const renderNotFound = () => {
    if (titleEl) titleEl.textContent = 'Article not found';
    if (contentEl) {
      contentEl.innerHTML = `
        <div class="blog-content-placeholder">
          <p>We couldn't find that article. It may have been moved or unpublished.</p>
        </div>
      `;
    }
    const backLink = document.querySelector('.blog-back-link');
    if (backLink) backLink.scrollIntoView({ block: 'nearest' });
  };

  const loadRelated = (post) => {
    if (!relatedGrid || !isWordPressConfigured()) return;
    const category = getCategory(post);
    if (!category) return;

    const url = `${WP_API}/posts?categories=${category.id}&exclude=${post.id}&per_page=3&_embed`;
    fetch(url)
      .then(res => res.json())
      .then(posts => {
        if (!posts.length) return;
        relatedGrid.innerHTML = '';
        posts.forEach(p => {
          const excerpt = stripHtml(p.excerpt && p.excerpt.rendered).slice(0, 110);
          const pTitle = stripHtml(p.title && p.title.rendered);
          const pImage = getFeaturedImage(p);
          const card = document.createElement('article');
          card.className = 'blog-card reveal in-view';
          card.innerHTML = `
            <a class="blog-card-media" href="blog-details.html?slug=${encodeURIComponent(p.slug)}">
              ${pImage ? `<img src="${pImage}" alt="${pTitle}" loading="lazy">` : ''}
            </a>
            <div class="blog-card-body">
              <div class="blog-card-meta"><time>${formatDate(p.date)}</time></div>
              <h3 class="blog-card-title"><a href="blog-details.html?slug=${encodeURIComponent(p.slug)}">${pTitle}</a></h3>
              <p class="blog-card-excerpt">${excerpt}${excerpt.length >= 110 ? '…' : ''}</p>
            </div>
          `;
          relatedGrid.appendChild(card);
        });
      })
      .catch(() => { /* leave the existing "coming soon" placeholder in place */ });
  };

  /* ---------- Kick off ---------- */
  if (!slug || !isWordPressConfigured()) {
    renderNotFound();
    return;
  }

  fetch(`${WP_API}/posts?slug=${encodeURIComponent(slug)}&_embed`)
    .then(res => res.json())
    .then(posts => {
      if (!posts.length) {
        renderNotFound();
        return;
      }
      renderArticle(posts[0]);
    })
    .catch(() => {
      renderNotFound();
    });

});
