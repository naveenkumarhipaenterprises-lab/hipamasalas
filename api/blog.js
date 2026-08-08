/* =========================================================
   HIPA MASALA — /api/blog  (Vercel Serverless Function)
   ---------------------------------------------------------
   Returns a single published blog post by ?slug=  plus up
   to 3 related posts from the same category.

   ENVIRONMENT VARIABLES required in Vercel:
     GOOGLE_SHEETS_API_KEY  — your Google Cloud API key
     GOOGLE_SHEET_ID        — the ID from your Sheet URL

   The API key NEVER reaches client-side code.
   ========================================================= */

'use strict';

const SHEET_NAME = 'Blogs';

/* ---------- Shared helpers (same as blogs.js) ---------- */
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

  const headers = rows[0].map(h => (h || '').trim().toLowerCase());
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i] !== undefined ? String(row[i]).trim() : ''; });
    return obj;
  });
}

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

  const slug = (req.query.slug || '').trim().toLowerCase();
  if (!slug) {
    return res.status(400).json({ error: 'slug query parameter is required.' });
  }

  try {
    const allRows = await fetchSheetRows();

    /* Only published rows, must have title + slug */
    const published = allRows.filter(r =>
      r.status && r.status.trim().toLowerCase() === 'published' &&
      r.title  && r.title.trim()  !== '' &&
      r.slug   && r.slug.trim()   !== ''
    );

    const postRow = published.find(r => r.slug.trim().toLowerCase() === slug);
    if (!postRow) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const post = transform(postRow);

    /* Related posts: same category, not the current slug, newest-first, max 3 */
    const related = published
      .filter(r =>
        r.slug.trim().toLowerCase() !== slug &&
        r.category &&
        r.category.trim().toLowerCase() === (postRow.category || '').trim().toLowerCase()
      )
      .sort((a, b) => {
        const da = a.publish_date ? new Date(a.publish_date) : null;
        const db = b.publish_date ? new Date(b.publish_date) : null;
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return db - da;
      })
      .slice(0, 3)
      .map(transform);

    /* Cache for 10 minutes at the CDN edge, serve stale for 20 while revalidating */
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.status(200).json({ post, related });

  } catch (err) {
    console.error('[/api/blog]', err.message);
    return res.status(500).json({ error: 'Failed to load blog post. Please try again shortly.' });
  }
};
