/* =========================================================
   HIPA MASALA — /api/blog  (Vercel Serverless Function)
   ---------------------------------------------------------
   Returns a single published blog post by ?slug= plus up
   to 3 related posts from the same category.

   ENVIRONMENT VARIABLES required in Vercel:
     GOOGLE_SHEETS_API_KEY  — your Google Cloud API key
     GOOGLE_SHEET_ID        — the ID from your Sheet URL

   Supports columns:
     Published | Title | Slug | Category | Author | Banner Image | Alt Text | Google Doc Link / Content | Meta Description | Focus Keywords | Keywords
   ========================================================= */

'use strict';

const SHEET_NAME = 'Blogs';

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

/* ---------- Format content (HTML or plain text fallback) ---------- */
function formatContent(raw) {
  if (!raw) return '';
  let text = String(raw).trim();
  if (!text) return '';

  // If user pasted a Google Doc URL directly
  if (/^https?:\/\/docs\.google\.com\/document\/d\//i.test(text)) {
    return `<p>Read full document on Google Docs: <a href="${text}" target="_blank" rel="noopener noreferrer">${text}</a></p>`;
  }

  // Strip dangerous tags/scripts
  text = text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*\/?>/gi, '')
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
    .replace(/href\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, 'href="#"')
    .replace(/src\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, '');

  // If plain text (no HTML tags present), wrap double-newlines in <p> tags
  if (!/<[a-z][\s\S]*>/i.test(text)) {
    const paragraphs = text.split(/\r?\n\r?\n/).map(p => p.trim()).filter(Boolean);
    return paragraphs.map(p => `<p>${p.replace(/\r?\n/g, '<br>')}</p>`).join('');
  }

  return text;
}

/* ---------- Check published status ---------- */
function isPublishedRow(r) {
  const pub = (r.published || r.status || '').trim().toLowerCase();
  return pub === 'true' || pub === 'published' || pub === '1' || pub === 'yes';
}

/* ---------- Transform a raw sheet row → clean post object ---------- */
function transform(row, index) {
  const title       = row['title'] || '';
  const slug        = row['slug'] || '';
  const category    = row['category'] || '';
  const author      = row['author'] || 'HIPA Masala Team';
  const rawImage    = row['banner image'] || row['banner_image'] || row['featured_image'] || row['image'] || '';
  const bannerImage = convertGoogleDriveUrl(rawImage);
  const altText     = row['alt text'] || row['alt_text'] || title;
  const metaDesc    = row['meta description'] || row['meta_description'] || row['excerpt'] || '';
  const excerpt     = row['excerpt'] || metaDesc;
  const rawContent  = row['content'] || row['google doc link'] || row['google_doc_link'] || row['google doc id'] || row['sample text id'] || metaDesc;
  const content     = formatContent(rawContent);
  const keywords    = row['focus keywords'] || row['focus_keywords'] || row['keywords'] || '';
  const metaTitle   = row['meta title'] || row['meta_title'] || title;
  const publishDate = row['publish_date'] || row['publish date'] || row['date'] || new Date().toISOString().split('T')[0];

  return {
    id:               row['id'] || String(index + 1),
    title:            title,
    slug:             slug,
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

/* ---------- Handler ---------- */
module.exports = async function handler(req, res) {

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const slug = (req.query.slug || '').trim().toLowerCase();
  if (!slug) {
    return res.status(400).json({ error: 'slug query parameter is required.' });
  }

  try {
    const allRows = await fetchSheetRows();

    /* Only published rows, must have title + slug */
    const published = allRows
      .map((r, i) => ({ row: r, idx: i }))
      .filter(({ row }) =>
        isPublishedRow(row) &&
        row.title && row.title.trim() !== '' &&
        row.slug  && row.slug.trim()  !== ''
      );

    const matchItem = published.find(({ row }) => row.slug.trim().toLowerCase() === slug);
    if (!matchItem) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const post = transform(matchItem.row, matchItem.idx);

    /* Related posts: same category, not current slug, max 3 */
    const related = published
      .filter(({ row }) =>
        row.slug.trim().toLowerCase() !== slug &&
        row.category &&
        row.category.trim().toLowerCase() === (matchItem.row.category || '').trim().toLowerCase()
      )
      .sort((a, b) => {
        const dateA = a.row.publish_date || a.row['publish date'] || a.row.date;
        const dateB = b.row.publish_date || b.row['publish date'] || b.row.date;
        const da = dateA && !isNaN(new Date(dateA)) ? new Date(dateA) : null;
        const db = dateB && !isNaN(new Date(dateB)) ? new Date(dateB) : null;
        if (da && db) return db - da;
        if (da) return -1;
        if (db) return 1;
        return b.idx - a.idx;
      })
      .slice(0, 3)
      .map(({ row, idx }) => transform(row, idx));

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.status(200).json({ post, related });

  } catch (err) {
    console.error('[/api/blog]', err.message);
    return res.status(500).json({ error: 'Failed to load blog post. Please try again shortly.' });
  }
};
