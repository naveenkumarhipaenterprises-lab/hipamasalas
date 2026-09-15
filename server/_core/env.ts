export const ENV = {
  cookieSecret: process.env.JWT_SECRET ?? "",
  adminLoginUsername: process.env.ADMIN_LOGIN_USERNAME ?? "",
  adminLoginPassword: process.env.ADMIN_LOGIN_PASSWORD ?? "",
  googleSheetsEnquiriesUrl: process.env.GOOGLE_SHEETS_ENQUIRIES_URL ?? process.env.GOOGLE_SHEETS_WEBHOOK_URL ?? "",
  googleSheetsNewsletterUrl: process.env.GOOGLE_SHEETS_NEWSLETTER_URL ?? "",
  canonicalOrigin: process.env.CANONICAL_ORIGIN ?? "https://www.hipamasalas.com",
};
