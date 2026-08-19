/* =========================================================
   HIPA MASALA — /api/blogs (Vercel Serverless Function)
   ---------------------------------------------------------
   Fetches ALL published posts from the "Blogs" Google Sheet.
   ========================================================= */

'use strict';

const SHEET_NAME  = 'Blogs';
const DEFAULT_PER = 9;
const MAX_PER     = 50;

function normSlug(str) {
  if (!str) return '';
  let s = String(str).trim().toLowerCase();
  try { s = decodeURIComponent(s); } catch (e) {}
  return s.replace(/^\/+|\/+$/g, '');
}

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

function cleanExcerpt(metaDesc, excerptVal, titleVal) {
  let val = (excerptVal || '').trim();
  if (!val) {
    val = (metaDesc || '').trim();
  }
  if (!val || val.toLowerCase() === (titleVal || '').trim().toLowerCase()) {
    val = metaDesc || titleVal || '';
  }
  return val;
}

function isPublishedRow(r) {
  const pub = (r.published || r.status || '').trim().toLowerCase();
  return pub === 'true' || pub === 'published' || pub === '1' || pub === 'yes';
}

function transform(row, index) {
  const title       = row['title'] || '';
  const rawSlug     = row['slug'] || '';
  const cleanSlug   = normSlug(rawSlug);
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
    slug:             cleanSlug,
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

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const page  = Math.max(1, parseInt(req.query.page, 10)  || 1);
    let perPage = Math.max(1, parseInt(req.query.per_page, 10) || DEFAULT_PER);
    if (perPage > MAX_PER) perPage = MAX_PER;

    const allRows = await fetchSheetRows();

    const published = allRows
      .map((r, i) => transform(r, i))
      .filter(p => p.title && p.slug);

    published.reverse();

    const total      = published.length;
    const totalPages = Math.ceil(total / perPage) || 1;
    const startIndex = (page - 1) * perPage;
    const posts      = published.slice(startIndex, startIndex + perPage);

    return res.status(200).json({
      success: true,
      page,
      per_page: perPage,
      total,
      total_pages: totalPages,
      posts
    });
  } catch (err) {
    console.error('API /api/blogs error:', err);
    return res.status(500).json({ error: 'Failed to fetch blogs.', details: err.message });
  }
};
