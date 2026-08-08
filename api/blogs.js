/* =========================================================
   HIPA MASALA — /api/blogs  (Vercel Serverless Function)
   ---------------------------------------------------------
   Fetches ALL rows from the "Blogs" sheet in Google Sheets,
   filters to status === "published", sorts newest-first,
   paginates, and returns clean JSON to the frontend.

   ENVIRONMENT VARIABLES required in Vercel:
     GOOGLE_SHEETS_API_KEY  — your Google Cloud API key
     GOOGLE_SHEET_ID        — the ID from your Sheet URL

   The API key NEVER reaches client-side code.
   ========================================================= */

'use strict';

const SHEET_NAME  = 'Blogs';
const DEFAULT_PER = 9;
const MAX_PER     = 50;

/* ---------- Fetch raw rows from Google Sheets ---------- */
async function fetchSheetRows() {
  const apiKey  = process.env.GOOGLE_SHEETS_API_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!apiKey || !sheetId) {
    throw new Error('Missing GOOGLE_SHEETS_API_KEY or GOOGLE_SHEET_ID env vars.');
  }

  const range = encodeURIComponent(`${SHEET_NAME}!A:M`);
  const url   = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets API ${res.status}: ${text}`);
  }

  const data = await res.json();
  const rows = data.values;
  if (!rows || rows.length < 2) return [];

  /* Row 0 = headers; rows 1+ = data.
     Trailing empty cells are omitted by the Sheets API, so we
     default missing indices to ''. */
  const headers = rows[0].map(h => (h || '').trim().toLowerCase());
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i] !== undefined ? String(row[i]).trim() : ''; });
    return obj;
  });
}

/* ---------- Strip dangerous tags / attributes from HTML ----------
   We only allow a safe subset. Protects against script injection
   from rogue Google Sheet content. */
function sanitiseHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*\/?>/gi, '')
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
    .replace(/href\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, 'href="#"')
    .replace(/src\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, '');
}

/* ---------- Transform a raw sheet row → clean post object ---------- */
function transform(row) {
  return {
    id:               row.id               || '',
    title:            row.title            || '',
    slug:             row.slug             || '',
    excerpt:          row.excerpt          || '',
    content:          sanitiseHtml(row.content || ''),
    featured_image:   row.featured_image   || '',
    category:         row.category         || '',
    author:           row.author           || 'HIPA Masala Team',
    publish_date:     row.publish_date     || '',
    meta_title:       row.meta_title       || row.title || '',
    meta_description: row.meta_description || row.excerpt || '',
    keywords:         row.keywords         || ''
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
      .filter(r =>
        r.status  && r.status.trim().toLowerCase()  === 'published' &&
        r.title   && r.title.trim()  !== '' &&
        r.slug    && r.slug.trim()   !== ''
      )
      /* Sort newest-first */
      .sort((a, b) => {
        const da = a.publish_date ? new Date(a.publish_date) : null;
        const db = b.publish_date ? new Date(b.publish_date) : null;
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return db - da;
      })
      .map(transform);

    const total      = published.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const start      = (page - 1) * perPage;
    const posts      = published.slice(start, start + perPage);

    /* Cache for 5 minutes at the CDN edge; serve stale for 10 minutes
       while revalidating — keeps the site fast and reduces Sheets API quota. */
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.status(200).json({ posts, total, page, per_page: perPage, total_pages: totalPages });

  } catch (err) {
    console.error('[/api/blogs]', err.message);
    return res.status(500).json({ error: 'Failed to load blog posts. Please try again shortly.' });
  }
};
