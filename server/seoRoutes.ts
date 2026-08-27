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

export function registerSeoRoutes(app: Express) {
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(buildRobotsTxt());
  });

  app.get("/sitemap.xml", async (_req, res, next) => {
    try {
      res.type("application/xml").send(buildSitemapXml(canonicalOrigin, await listPublishedBlogPaths()));
    } catch (error) {
      next(error);
    }
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
