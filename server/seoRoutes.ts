import type { Express } from "express";
import { getIndexablePaths } from "../shared/hipaContent";
import { listPublishedBlogPaths } from "./db";

const canonicalOrigin = (process.env.CANONICAL_ORIGIN || "https://www.hipamasalas.com").replace(/\/$/, "");

const legacyRoutes: Record<string, string> = {
  "/index.html": "/",
  "/products.html": "/products",
  "/contact.html": "/contact",
  "/faq.html": "/faq",
  "/blog.html": "/blog",
  "/sambar-powder.html": "/products/sambar-powder",
  "/rasam-powder.html": "/products/rasam-powder",
  "/turmeric-powder.html": "/products/turmeric-powder",
  "/red-chilli-powder.html": "/products/red-chilli-powder",
  "/coriander-powder.html": "/products/coriander-powder",
  "/cumin-powder.html": "/products/cumin-powder",
  "/pepper-powder.html": "/products/pepper-powder",
  "/garam-masala.html": "/products/garam-masala",
  "/blog-details.html": "/blog",
};

function xmlEscape(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function buildSitemapXml(origin = canonicalOrigin, publishedBlogPaths: string[] = []) {
  const urls = Array.from(new Set([...getIndexablePaths(), ...publishedBlogPaths]))
    .map((path) => `<url><loc>${xmlEscape(`${origin}${path}`)}</loc></url>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

export function buildRobotsTxt(origin = canonicalOrigin) {
  return `User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${origin}/sitemap.xml\n`;
}

export function buildLlmsTxt(origin = canonicalOrigin) {
  return `# HIPA Masalas\n\n> HIPA Masalas is a Chennai, Tamil Nadu, India spice and masala brand.\n\n## Business\n- Website: ${origin}/\n- Location: Chennai, Tamil Nadu, India\n- Phone: +91 70580 53055\n- Email: info@hipamasalas.com\n- WhatsApp: ${origin}/contact\n\n## Products\nHIPA Masalas currently lists Sambar Powder, Rasam Powder, Turmeric Powder, Red Chilli Powder, Coriander Powder, Cumin Powder, Pepper Powder and Garam Masala. Product pages: ${origin}/products\n\n## Enquiries\nFor consumer product questions, distributor, wholesaler, retailer, supermarket, restaurant or exporter enquiries, use ${origin}/b2b-enquiries or ${origin}/contact. Commercial availability, pricing, delivery, manufacturing and export terms must be confirmed directly by HIPA Masalas.\n\n## Public pages\n- Products: ${origin}/products\n- FAQ: ${origin}/faq\n- Contact: ${origin}/contact\n- Business enquiries: ${origin}/b2b-enquiries\n- Blog: ${origin}/blog\n`;
}

export function registerSeoRoutes(app: Express) {
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(buildRobotsTxt());
  });

  app.get("/llms.txt", (_req, res) => {
    res.type("text/plain").send(buildLlmsTxt());
  });

  app.get("/sitemap.xml", async (_req, res) => {
    let publishedBlogPaths: string[] = [];
    try {
      publishedBlogPaths = await listPublishedBlogPaths();
    } catch (error) {
      console.warn("[SEO] Could not load blog paths for sitemap; serving static sitemap:", error);
    }
    res.type("application/xml").send(buildSitemapXml(canonicalOrigin, publishedBlogPaths));
  });

  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    const directTarget = legacyRoutes[req.path];
    if (directTarget) return res.redirect(301, `${directTarget}${req.originalUrl.slice(req.path.length)}`);
    if (req.path !== "/" && /\/+$/.test(req.path)) {
      const query = req.originalUrl.slice(req.path.length);
      return res.redirect(301, `${req.path.replace(/\/+$/, "")}${query}`);
    }
    next();
  });
}
