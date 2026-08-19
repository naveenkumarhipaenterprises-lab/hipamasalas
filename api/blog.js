/* =========================================================
   HIPA MASALA — /api/blog (Vercel Serverless Function)
   ---------------------------------------------------------
   Returns a single published blog post by ?slug= plus up
   to 3 related posts from the same category.
   ========================================================= */

'use strict';

const SHEET_NAME = 'Blogs';

function slugify(str) {
  if (!str) return '';
  let s = String(str).trim().toLowerCase();
  try { s = decodeURIComponent(s); } catch (e) {}
  return s.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/* ---------- Convert Google Drive view links to direct image URLs ---------- */
function convertGoogleDriveUrl(url) {
  if (!url) return '';
  const str = String(url).trim();
  if (!str) return '';
  if (str.includes('lh3.googleusercontent.com')) return str;

  const match = str.match(/\/d\/([a-zA-Z0-9_-]+)/) || str.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match && match[1] && (str.includes('drive.google.com') || str.includes('docs.google.com'))) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return str;
}

/* ---------- Fetch raw rows from Google Sheets ---------- */
async function fetchSheetRows() {
  const apiKey  = process.env.GOOGLE_SHEETS_API_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!apiKey || !sheetId) {
    throw new Error('Missing GOOGLE_SHEETS_API_KEY or GOOGLE_SHEET_ID env vars.');
  }

  const range = encodeURIComponent(`${SHEET_NAME}!A:Z`);
  const url   = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets API ${res.status}: ${text}`);
  }

  const data = await res.json();
  const rows = data.values;
  if (!rows || rows.length < 2) return [];

  const headers = rows[0].map(h => (h || '').trim().toLowerCase());
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i] !== undefined ? String(row[i]).trim() : ''; });
    return obj;
  });
}

/* ---------- Sanitise HTML ---------- */
function sanitiseHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*\/?>/gi, '')
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
    .replace(/href\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, 'href="#"')
    .replace(/src\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, '');
}

/* ---------- Format / Fetch Full Document Content ---------- */
async function resolveBlogContent(rawContent, metaDesc) {
  let text = String(rawContent || '').trim();
  if (!text) text = String(metaDesc || '').trim();

  const docMatch = text.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/i);
  if (docMatch && docMatch[1]) {
    const docId = docMatch[1];
    try {
      let htmlRes = await fetch(`https://docs.google.com/document/d/${docId}/pub`);
      if (!htmlRes.ok) htmlRes = await fetch(`https://docs.google.com/document/d/${docId}/export?format=html`);
      
      if (htmlRes.ok) {
        const rawHtml = await htmlRes.text();
        const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch && bodyMatch[1]) {
          let bodyHtml = bodyMatch[1]
            .replace(/style="[^"]*"/gi, '')
            .replace(/class="[^"]*"/gi, '')
            .replace(/id="[^"]*"/gi, '')
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

          bodyHtml = bodyHtml.replace(/<img\s+([^>]+)>/gi, (m, attrs) => {
            if (!attrs.includes('style=')) {
              return `<img ${attrs} style="max-width:100%; height:auto; border-radius:8px; margin:16px 0;" />`;
            }
            return m;
          });

          const sanitised = sanitiseHtml(bodyHtml).trim();
          if (sanitised.length > 30 && !sanitised.includes('accounts.google.com') && !sanitised.includes('Sign in')) {
            return sanitised;
          }
        }
      }
    } catch (e) {
      console.warn('Google Doc HTML extraction fallback:', e.message);
    }

    return `
      <div class="blog-doc-container" style="width:100%; margin:20px 0; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.06); background:#fff;">
        <iframe src="https://docs.google.com/document/d/${docId}/preview" style="width:100%; height:850px; border:none; display:block;" title="Full Blog Document" loading="lazy"></iframe>
      </div>
    `;
  }

  if (/<[a-z][\s\S]*>/i.test(text)) return sanitiseHtml(text);

  const paragraphs = text.split(/\r?\n\r?\n/).map(p => p.trim()).filter(Boolean);
  if (paragraphs.length > 0) {
    return paragraphs.map(p => `<p>${sanitiseHtml(p).replace(/\r?\n/g, '<br>')}</p>`).join('');
  }

  return '<p>No content available for this article.</p>';
}

function isPublishedRow(r) {
  const pub = (r.published || r.status || '').trim().toLowerCase();
  return pub === 'true' || pub === 'published' || pub === '1' || pub === 'yes';
}

async function transform(row, index, fetchFullContent = true) {
  const title       = row['title'] || '';
  const rawSlug     = row['slug'] || row['url'] || row['link'] || row['permalink'] || title;
  const cleanSlug   = slugify(rawSlug);
  const category    = row['category'] || '';
  const author      = row['author'] || 'HIPA Masala Team';
  const rawImage    = row['banner image'] || row['banner_image'] || row['featured_image'] || row['cover image'] || row['cover_image'] || row['image'] || '';
  const bannerImage = convertGoogleDriveUrl(rawImage);
  const altText     = row['alt text'] || row['alt_text'] || title;
  const metaDesc    = row['meta description'] || row['meta_description'] || row['description'] || row['excerpt'] || '';
  const excerpt     = row['excerpt'] || metaDesc;
  const rawContent  = row['content'] || row['google doc link'] || row['google_doc_link'] || row['google doc id'] || row['sample text id'] || metaDesc;

  const content = fetchFullContent
    ? await resolveBlogContent(rawContent, metaDesc)
    : (typeof rawContent === 'string' && rawContent.includes('docs.google.com') ? metaDesc : sanitiseHtml(rawContent));

  const keywords    = row['focus keywords'] || row['focus_keywords'] || row['keywords'] || '';
  const metaTitle   = row['meta title'] || row['meta_title'] || title;
  const publishDate = row['publish_date'] || row['publish date'] || row['date'] || new Date().toISOString().split('T')[0];

  return {
    id:               row['id'] || String(index + 1),
    title:            title,
    slug:             cleanSlug,
    excerpt:          excerpt,
    content:          content,
    featured_image:   bannerImage,
    alt_text:         altText,
    category:         category,
    author:           author,
    publish_date:     publishDate,
    meta_title:       metaTitle,
    meta_description: metaDesc,
    keywords:         keywords
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const reqSlug = slugify(req.query.slug);
  if (!reqSlug) {
    return res.status(400).json({ error: 'slug query parameter is required.' });
  }

  try {
    const allRows = await fetchSheetRows();

    const published = allRows
      .map((r, i) => ({ row: r, idx: i }))
      .filter(({ row }) =>
        isPublishedRow(row) &&
        row.title && row.title.trim() !== ''
      );

    const matchItem = published.find(({ row }) => {
      const rowSlug = row['slug'] || row['url'] || row['link'] || row['permalink'] || row['title'] || '';
      return slugify(rowSlug) === reqSlug;
    });

    if (!matchItem) {
      console.warn(`[API /api/blog] No match found for requested slug "${reqSlug}". Available published slugs:`, published.map(p => slugify(p.row['slug'] || p.row['title'])));
      return res.status(404).json({ error: 'Post not found.', requested_slug: reqSlug });
    }

    const post = await transform(matchItem.row, matchItem.idx, true);

    const categoryName = (matchItem.row['category'] || '').trim().toLowerCase();
    const relatedRows = published
      .filter(({ row }) => {
        const rowSlug = row['slug'] || row['url'] || row['link'] || row['permalink'] || row['title'] || '';
        return slugify(rowSlug) !== reqSlug && (row.category || '').trim().toLowerCase() === categoryName;
      })
      .slice(0, 3);

    const related = await Promise.all(
      relatedRows.map(({ row, idx }) => transform(row, idx, false))
    );

    return res.status(200).json({ success: true, post, related });
  } catch (err) {
    console.error('API /api/blog error:', err);
    return res.status(500).json({ error: 'Failed to fetch article details.', details: err.message });
  }
};
