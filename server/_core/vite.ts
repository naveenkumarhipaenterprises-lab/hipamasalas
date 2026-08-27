import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import superjson from "superjson";
import { getStructuredData, type PageHead } from "../../shared/hipaContent";

const canonicalOrigin = (process.env.CANONICAL_ORIGIN || "https://www.hipamasalas.com").replace(/\/$/, "");
const siteName = process.env.SITE_NAME ?? "HIPA Masalas";

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function cleanText(value: string, max: number) {
  const text = value.replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

function toAbsoluteUrl(value?: string) {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return canonicalOrigin ? `${canonicalOrigin}${value.startsWith("/") ? value : `/${value}`}` : undefined;
}

function buildHead(head: PageHead) {
  const title = escapeHtml(cleanText(head.title || siteName, 70));
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
    : process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  const templatePath = isVercel
    ? path.resolve(process.cwd(), "dist", "public", "index.html")
    : path.resolve(distPath, "index.html");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  if (!isVercel) app.use(express.static(distPath, { index: false, redirect: false }));

  app.use("*", async (req, res) => {
    try {
      const template = await fs.promises.readFile(templatePath, "utf-8");
      const serverEntryPath = isVercel
        ? path.resolve(process.cwd(), "dist", "server-ssr", "entry-server.js")
        : path.resolve(import.meta.dirname, "server-ssr", "entry-server.js");
      const { render } = await import(serverEntryPath);
      const { html, dehydratedState, head } = await render(req.originalUrl);
      res.status(head.notFound ? 404 : 200).set({ "Content-Type": "text/html", "Cache-Control": "no-cache" }).end(composeHtml(template, html, head, dehydratedState));
    } catch (error) {
      console.error("[SSR] render failed, serving shell:", error);
      const template = await fs.promises.readFile(templatePath, "utf-8");
      res.status(200).set({ "Content-Type": "text/html", "Cache-Control": "no-cache" }).end(template.replace("<!--app-head-->", () => buildHead({ title: siteName, description: "HIPA Masalas product and enquiry information." })));
    }
  });
}
