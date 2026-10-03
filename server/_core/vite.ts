import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import superjson from "superjson";
import { getStructuredData, type PageHead } from "../../shared/hipaContent";

const canonicalOrigin = (process.env.CANONICAL_ORIGIN || "https://www.hipamasalas.com").replace(/\/$/, "");
const siteName = process.env.SITE_NAME ?? "HIPA Masala";

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// Cuts at a word boundary (when one exists in the last third) so a cut title never
// ends in a half word like "Aroma a…"; a dangling comma or colon is dropped too.
export function cleanText(value: string, max: number) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  // slice() counts UTF-16 units, so never end the hard cut on the first half of a surrogate pair (emoji etc.).
  const hard = text.slice(0, max - 1).replace(/[\uD800-\uDBFF]$/, "");
  const lastSpace = hard.lastIndexOf(" ");
  const cut = lastSpace >= Math.floor((max - 1) * 0.66) ? hard.slice(0, lastSpace) : hard;
  return `${cut.replace(/[\s,;:–-]+$/, "")}…`;
}

// Long titles drop the "| Brand" suffix before being cut, so search results never show "… | HI…".
export function fitTitle(value: string, max: number) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const withoutBrand = text.replace(/\s*\|[^|]*$/, "").trim();
  if (withoutBrand && withoutBrand.length <= max) return withoutBrand;
  return cleanText(withoutBrand || text, max);
}

function toAbsoluteUrl(value?: string) {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return canonicalOrigin ? `${canonicalOrigin}${value.startsWith("/") ? value : `/${value}`}` : undefined;
}

function buildHead(head: PageHead) {
  const title = escapeHtml(fitTitle(head.title || siteName, 65));
  const description = escapeHtml(cleanText(head.description, 200));
  const canonical = head.canonicalPath && canonicalOrigin ? `${canonicalOrigin}${head.canonicalPath}` : undefined;
  const image = toAbsoluteUrl(head.ogImage);
  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta property="og:type" content="${head.ogType ?? "website"}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:site_name" content="${escapeHtml(siteName)}" />`,
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
  ];
  if (canonical) tags.push(`<link rel="canonical" href="${escapeHtml(canonical)}" />`, `<meta property="og:url" content="${escapeHtml(canonical)}" />`);
  if (image) tags.push(`<meta property="og:image" content="${escapeHtml(image)}" />`, `<meta name="twitter:image" content="${escapeHtml(image)}" />`);
  if (head.ogImageAlt) tags.push(`<meta property="og:image:alt" content="${escapeHtml(head.ogImageAlt)}" />`);
  if (head.ogType === "article" && head.publishedTime) tags.push(`<meta property="article:published_time" content="${escapeHtml(head.publishedTime)}" />`);
  if (head.ogType === "article" && head.modifiedTime) tags.push(`<meta property="article:modified_time" content="${escapeHtml(head.modifiedTime)}" />`);
  if (head.noindex || head.notFound) tags.push(`<meta name="robots" content="noindex, follow" />`);
  if (canonicalOrigin && head.canonicalPath) {
    for (const schema of getStructuredData(head.canonicalPath, canonicalOrigin, head.article)) {
      tags.push(`<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`);
    }
  }
  return tags.join("\n");
}

/**
 * Inlines the bundled stylesheet(s) into the HTML template.
 * The site's single CSS bundle (~17 KB gzipped) was the only render-blocking request; the app
 * navigates client-side after the first load, so the CSS is fetched once per visit either way.
 * Inlining removes a network round-trip before first paint. Runs once per server instance.
 */
export function inlineStylesheets(template: string, assetRoot: string) {
  return template.replace(/<link\b[^>]*\brel="stylesheet"[^>]*>/g, (tag) => {
    const href = tag.match(/\bhref="(\/assets\/[^"]+\.css)"/)?.[1];
    if (!href) return tag;
    const file = path.join(assetRoot, href);
    if (!fs.existsSync(file)) return tag;
    const css = fs
      .readFileSync(file, "utf-8")
      .replace(/\/\*# sourceMappingURL=[^*]*\*\//g, "")
      .replace(/<\/style/gi, "<\\/style");
    return `<style data-href="${href}">${css}</style>`;
  });
}

/**
 * Server-rendered HTML is complete without JavaScript (JS only hydrates it), so the app bundle
 * should not compete with the LCP hero image and web fonts for bandwidth on slow connections.
 * Marks the entry module script and its modulepreloads as low fetch priority.
 */
export function deprioritizeAppScripts(template: string) {
  return template.replace(/<(script|link)\b([^>]*)>/g, (tag, name: string, attrs: string) => {
    const isEntry = name === "script" && /\btype="module"/.test(attrs) && /\bsrc="\/assets\//.test(attrs);
    const isPreload = name === "link" && /\brel="modulepreload"/.test(attrs) && /\bhref="\/assets\//.test(attrs);
    if ((!isEntry && !isPreload) || /\bfetchpriority=/.test(attrs)) return tag;
    return `<${name}${attrs.replace(/\s*\/$/, "")} fetchpriority="low"${attrs.trimEnd().endsWith("/") ? " /" : ""}>`;
  });
}

const templateCache = new Map<string, string>();
async function loadTemplate(templatePath: string) {
  const cached = templateCache.get(templatePath);
  if (cached) return cached;
  const raw = await fs.promises.readFile(templatePath, "utf-8");
  const template = deprioritizeAppScripts(inlineStylesheets(raw, path.dirname(templatePath)));
  templateCache.set(templatePath, template);
  return template;
}

function composeHtml(template: string, appHtml: string, head: PageHead, dehydratedState: unknown) {
  const state = JSON.stringify(superjson.serialize(dehydratedState)).replace(/</g, "\\u003c");
  return template
    .replace("</body>", () => `<script>window.__RQ_STATE__=${state}</script></body>`)
    .replace("<!--app-head-->", () => buildHead(head))
    .replace("<!--app-html-->", () => appHtml);
}

export function serveStatic(app: Express) {
  const isVercel = Boolean(process.env.VERCEL);
  const distPath = isVercel
    ? path.resolve(process.cwd(), "public")
    : path.resolve(process.cwd(), "dist", "public");
  const templatePath = isVercel
    ? path.resolve(process.cwd(), "dist", "public", "index.html")
    : path.resolve(distPath, "index.html");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath, { index: false, redirect: false }));

  app.use("*", async (req, res) => {
    if (req.path.startsWith("/assets/")) {
      return res.status(404).type("text/plain").send("Not found");
    }
    try {
      const template = await loadTemplate(templatePath);
      const serverEntryPath = path.resolve(process.cwd(), "dist", "server-ssr", "entry-server.js");
      const { render } = await import(serverEntryPath);
      const { html, dehydratedState, head } = await render(req.originalUrl);
      res.status(head.notFound ? 404 : 200).set({ "Content-Type": "text/html", "Cache-Control": "no-cache" }).end(composeHtml(template, html, head, dehydratedState));
    } catch (error) {
      console.error("[SSR] render failed, serving shell:", error);
      const template = await loadTemplate(templatePath);
      res.status(200).set({ "Content-Type": "text/html", "Cache-Control": "no-cache" }).end(template.replace("<!--app-head-->", () => buildHead({ title: siteName, description: "HIPA Masala product and enquiry information." })));
    }
  });
}
