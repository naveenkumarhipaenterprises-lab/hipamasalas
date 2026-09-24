# Vercel Deployment Guide (Zero-Database Architecture)

The HIPA Masala website uses a fast, reliable, zero-database architecture:
- **Hosting**: Vercel Serverless & Static CDN
- **Blog Content**: Git-backed (`data/blog-posts.json`)
- **Customer & B2B Enquiries**: Direct integration with Google Sheets
- **Newsletter Subscriptions**: Direct integration with Google Sheets
- **Chatbot**: Google Gemini 2.5 Flash Lite

## Production Environment Variables in Vercel

Set these environment variables in **Vercel → Project Settings → Environment Variables**:

```text
NODE_ENV=production
CANONICAL_ORIGIN=https://www.hipamasalas.com
JWT_SECRET=<long-random-secret>
ADMIN_LOGIN_USERNAME=<private-admin-username>
ADMIN_LOGIN_PASSWORD=<private-admin-password>
GOOGLE_SHEETS_ENQUIRIES_URL=https://script.google.com/macros/s/<YOUR_SCRIPT_ID>/exec
GOOGLE_SHEETS_NEWSLETTER_URL=https://script.google.com/macros/s/<YOUR_SCRIPT_ID>/exec
GEMINI_API_KEY=<your-google-gemini-api-key>
GEMINI_MODEL=gemini-2.5-flash-lite
```

## How to Publish Blogs Daily

1. Open `data/blog-posts.json` in your local project or on GitHub.
2. Add your new article JSON entry (or use `/admin` on the website to format and copy the JSON).
3. Commit and push to GitHub.
4. Vercel automatically deploys the new blog in ~30 seconds.

## How to Set Up Google Sheets for Enquiries

1. Open `scripts/google-sheets-script.js` in this repository.
2. Follow the 5-step instructions at the top of the file to deploy the Google Apps Script Web App.
3. Paste the generated Web App URL into your `.env` (locally) and in Vercel Settings as `GOOGLE_SHEETS_ENQUIRIES_URL`.
