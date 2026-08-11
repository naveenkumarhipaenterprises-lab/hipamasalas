/* =========================================================
   HIPA MASALA — /api/blogs  (Vercel Serverless Function)
   ---------------------------------------------------------
   Fetches ALL rows from the "Blogs" sheet in Google Sheets,
   filters to Published === true/published, sorts newest-first,
   paginates, and returns clean JSON to the frontend.

   ENVIRONMENT VARIABLES required in Vercel:
     GOOGLE_SHEETS_API_KEY  — your Google Cloud API key
     GOOGLE_SHEET_ID        — the ID from your Sheet URL

   Supports columns:
     Published | Title | Slug | Category | Author | Banner Image | Alt Text | Google Doc Link / Content | Meta Description | Focus Keywords | Keywords
   ========================================================= */

'use strict';

const SHEET_NAME  = 'Blogs';
const DEFAULT_PER = 9;
const MAX_PER     = 50;

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

  /* Row 0 = headers; rows 1+ = data. */
  const headers = rows[0].map(h => (h || '').trim().toLowerCase());
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i] !== undefined ? String(row[i]).trim() : ''; });
    return obj;
  });
}

/* ---------- Format excerpt (ensures raw Google Doc link is never displayed as text) ---------- */
function cleanExcerpt(metaDesc, excerptVal, titleVal) {
  let val = excerptVal || metaDesc || titleVal || '';
  if (val.includes('docs.google.com') || val.includes('drive.google.com')) {
    val = metaDesc || titleVal || '';
  }
  return val;
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
  const rawImage    = row['banner image'] || row['banner_image'] || row['featured_image'] || row['cover image'] || row['cover_image'] || row['image'] || '';
  const bannerImage = convertGoogleDriveUrl(rawImage);
  const altText     = row['alt text'] || row['alt_text'] || title;
  const metaDesc    = row['meta description'] || row['meta_description'] || row['description'] || '';
  const excerptVal  = row['excerpt'] || '';
  const excerpt     = cleanExcerpt(metaDesc, excerptVal, title);
  const keywords    = row['focus keywords'] || row['focus_keywords'] || row['keywords'] || '';
  const metaTitle   = row['meta title'] || row['meta_title'] || title;
  const publishDate = row['publish_date'] || row['publish date'] || row['date'] || new Date().toISOString().split('T')[0];

  return {
    id:               row['id'] || String(index + 1),
    title:            title,
    slug:             slug,
    excerpt:          excerpt,
    featured_image:   bannerImage,
    alt_text:         altText,
    category:         category,
    author:           author,
    publish_date:     publishDate,
    meta_title:       metaTitle,
    meta_description: metaDesc || excerpt,
    keywords:         keywords
  };
}

/* ---------- Handler ---------- */
module.exports = async function handler(req, res) {

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const page    = Math.max(1, parseInt(req.query.page    || '1',              10));
    const perPage = Math.min(MAX_PER, Math.max(1, parseInt(req.query.per_page  || String(DEFAULT_PER), 10)));

    const allRows = await fetchSheetRows();

    /* Filter: published only, must have title + slug */
    const published = allRows
      .map((r, i) => ({ row: r, idx: i }))
      .filter(({ row }) =>
        isPublishedRow(row) &&
        row.title && row.title.trim() !== '' &&
        row.slug  && row.slug.trim()  !== ''
      )
      /* Sort newest-first */
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
      .map(({ row, idx }) => transform(row, idx));

    const total      = published.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const start      = (page - 1) * perPage;
    const posts      = published.slice(start, start + perPage);

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.status(200).json({ posts, total, page, per_page: perPage, total_pages: totalPages });

  } catch (err) {
    console.error('[/api/blogs]', err.message);
    return res.status(500).json({ error: 'Failed to load blog posts. Please try again shortly.' });
  }
};
