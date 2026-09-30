import type { Express } from "express";
import { getIndexablePaths, products, siteIdentity } from "../shared/hipaContent";
import { MANUFACTURER_PAGE_PATH } from "../shared/manufacturerPage";
import { listPublishedBlogEntries, listPublishedBlogPosts } from "./db";

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
  "/b2b-enquiry": "/b2b-enquiries",
  // Six guides on "masala manufacturer in Chennai" were consolidated into three plus the pillar page (30 Sep 2026).
  "/blog/how-to-choose-a-masala-manufacturer-in-chennai-for-your-business": "/blog/best-masala-manufacturer-in-chennai",
  "/blog/what-makes-a-good-masala-manufacturer-8-things-buyers-should-check": "/blog/best-masala-manufacturer-in-chennai",
  "/blog/masala-manufacturer-for-restaurants-retailers-chennai": MANUFACTURER_PAGE_PATH,
};

function xmlEscape(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export type SitemapEntry = { path: string; lastmod?: string };

export function buildSitemapXml(origin = canonicalOrigin, publishedBlogPaths: Array<string | SitemapEntry> = []) {
  // Blog entries carry their real update date; static pages have none rather than a fake one.
  const lastmodByPath = new Map<string, string | undefined>();
  for (const path of getIndexablePaths()) lastmodByPath.set(path, undefined);
  for (const entry of publishedBlogPaths) {
    const { path, lastmod } = typeof entry === "string" ? { path: entry, lastmod: undefined } : entry;
    lastmodByPath.set(path, lastmod ? lastmod.slice(0, 10) : lastmodByPath.get(path));
  }
  const urls = Array.from(lastmodByPath.entries())
    .map(([path, lastmod]) => `<url><loc>${xmlEscape(`${origin}${path}`)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

export function buildRobotsTxt(origin = canonicalOrigin) {
  return `User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${origin}/sitemap.xml\n`;
}

export type LlmsBlogPost = { slug: string; title: string; description: string };

// Published guides that belong under a topical llms.txt section (only listed if actually published).
const QUALITY_GUIDES = ["how-spice-quality-affects-food-taste", "what-makes-a-good-spice-powder", "how-to-read-a-spice-powder-label"];
const BUSINESS_GUIDES = [
  "masala-manufacturer-vs-supplier-vs-distributor",
  "masala-supplier-for-supermarkets-in-chennai",
  "true-cost-of-your-spice-supplier",
];
const CHENNAI_GUIDES = ["best-masala-manufacturer-in-chennai"];

function oneLine(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * llms.txt (https://llmstxt.org): an H1, a blockquote summary, then H2 sections of
 * Markdown link lists. Every URL is a canonical, indexable page of this site
 * (see getIndexablePaths) or a published blog post.
 */
export function buildLlmsTxt(origin = canonicalOrigin, posts: LlmsBlogPost[] = []) {
  const link = (path: string, label: string, detail?: string) => `- [${label}](${origin}${path})${detail ? `: ${oneLine(detail)}` : ""}`;
  const bySlug = new Map(posts.map((post) => [post.slug, post]));
  const listed = new Set<string>();
  const guides = (slugs: string[]) =>
    slugs
      .map((slug) => bySlug.get(slug))
      .filter((post): post is LlmsBlogPost => Boolean(post))
      .map((post) => {
        listed.add(post.slug);
        return link(`/blog/${post.slug}`, post.title, post.description);
      });

  const sections: Array<[string, string[]]> = [
    ["About", [
      link("/", "HIPA Masala home", "Overview of the brand, product range, pack sizes and who we serve."),
      link("/about", "About HIPA Masala", "Brand story, approach to spice blending, core values and business details of HIPA Enterprises."),
      link("/faq", "Frequently asked questions", "Sourcing, product range, culinary usage, B2B orders and contact."),
    ]],
    ["Products", [
      link("/products", "Product catalogue", "All spice powders and masala blends with pack sizes."),
      ...products.map((product) => link(`/products/${product.slug}`, product.name, product.shortDescription)),
    ]],
    ["Quality / Manufacturing", [
      link("/about", "Our approach to spice blending", "How whole spices are selected, cleaned, low-temperature milled and slow-roasted for blends."),
      ...guides(QUALITY_GUIDES),
    ]],
    ["Business / B2B", [
      link(MANUFACTURER_PAGE_PATH, "Masala manufacturer in Chennai", "What HIPA manufactures, how it is made, FSSAI and GST details, bulk formats and who it supplies."),
      link("/b2b-enquiries", "B2B enquiries", "Wholesale, distribution, retail, hotel, restaurant and catering supply enquiries."),
      ...guides(BUSINESS_GUIDES),
    ]],
    ["Chennai / Pallavaram", [
      link("/contact", "Contact and location", `Office in Pallavaram, Chennai: ${siteIdentity.locationLabel}.`),
      link(MANUFACTURER_PAGE_PATH, "Masala manufacturer in Zamin Pallavaram, Chennai", "Manufacturing base, delivery area across Chennai and Tamil Nadu, and how to enquire."),
      ...guides(CHENNAI_GUIDES),
    ]],
    ["Blog", [
      link("/blog", "HIPA Masala blog", "Spice guides, South Indian cooking ideas and product information."),
      ...posts.filter((post) => !listed.has(post.slug)).map((post) => link(`/blog/${post.slug}`, post.title, post.description)),
    ]],
    ["Contact", [
      link("/contact", "Contact HIPA Masala", `Phone ${siteIdentity.phone}, email ${siteIdentity.email}, open ${siteIdentity.openingHours.label}, FSSAI licence ${siteIdentity.fssaiLicence}, GSTIN ${siteIdentity.gstin}, enquiry form and map.`),
      link("/b2b-enquiries", "Business enquiry form", "For bulk, distributor and food-service requirements."),
    ]],
  ];

  return [
    "# HIPA Masala",
    "",
    "> HIPA Masala is an Indian spice brand by HIPA Enterprises, an FSSAI-licensed, GST-registered masala manufacturer in Pallavaram, Chennai, Tamil Nadu. It makes single-spice powders and traditional South Indian masala blends for home kitchens, retailers and food businesses.",
    "",
    "This is an informational and enquiry website, not an online shop: pricing, availability, minimum order quantities and commercial terms are confirmed directly by HIPA Masala through the contact or B2B enquiry pages.",
    "",
    ...sections.flatMap(([title, items]) => [`## ${title}`, "", ...items, ""]),
  ].join("\n");
}

export function registerSeoRoutes(app: Express) {
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(buildRobotsTxt());
  });

  app.get("/llms.txt", async (_req, res) => {
    let posts: LlmsBlogPost[] = [];
    try {
      posts = (await listPublishedBlogPosts()).map(({ slug, title, description }) => ({ slug, title, description }));
    } catch (error) {
      console.warn("[SEO] Could not load blog posts for llms.txt; serving static sections:", error);
    }
    res.type("text/plain; charset=utf-8").set("Cache-Control", "public, max-age=3600").send(buildLlmsTxt(canonicalOrigin, posts));
  });

  app.get("/sitemap.xml", async (_req, res) => {
    let publishedBlogPaths: SitemapEntry[] = [];
    try {
      publishedBlogPaths = await listPublishedBlogEntries();
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
