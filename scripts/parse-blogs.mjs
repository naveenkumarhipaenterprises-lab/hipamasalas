import fs from "node:fs";
import path from "node:path";

const scratchDir = path.resolve("scratch_blogs");
const files = [
  "01-best-masala-manufacturer-in-chennai.html",
  "02-how-to-choose-a-masala-manufacturer-in-chennai.html",
  "03-what-makes-a-good-masala-manufacturer.html",
  "04-masala-manufacturer-vs-supplier-vs-distributor.html",
  "05-how-to-evaluate-a-masala-manufacturer-in-chennai.html",
];

function cleanHtmlToMarkdown(html) {
  // Extract head metadata
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const jsonLdMatch = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
  
  let jsonLd = {};
  if (jsonLdMatch) {
    try {
      jsonLd = JSON.parse(jsonLdMatch[1].trim());
    } catch (e) {
      console.error("JSON-LD parse error:", e);
    }
  }

  // Cover image from figure
  const coverMatch = html.match(/<figure class="blog-cover"[\s\S]*?<img\s+src=["']([^"']+)["']\s+alt=["']([^"']+)["']/i);
  let coverImageUrl = coverMatch ? `/assets/${path.basename(coverMatch[1])}` : null;
  let coverImageAlt = coverMatch ? coverMatch[2] : "";

  // Extract slug from canonical or jsonld
  let slug = "";
  if (canonicalMatch) {
    const url = canonicalMatch[1];
    slug = url.split("/").filter(Boolean).pop();
  } else if (jsonLd.mainEntityOfPage) {
    const url = typeof jsonLd.mainEntityOfPage === "string" ? jsonLd.mainEntityOfPage : jsonLd.mainEntityOfPage["@id"] || "";
    slug = url.split("/").filter(Boolean).pop();
  }

  // Extract article body content (everything inside <header> + <section> + <footer> except <div class="seo-metadata">, <head>, and <figure class="blog-cover">)
  let cleanBody = html;
  // Remove stray text at the very end if present
  cleanBody = cleanBody.replace(/طassistant[\s\S]*$/i, "");
  // Remove seo metadata/head
  cleanBody = cleanBody.replace(/<(div class="seo-metadata"|div class="seo-head-wrapper"|section class="seo-metadata")[\s\S]*?<\/(div|section)>/gi, "");
  cleanBody = cleanBody.replace(/<head[\s\S]*?<\/head>/gi, "");
  cleanBody = cleanBody.replace(/<figure class="blog-cover"[\s\S]*?<\/figure>/gi, "");
  cleanBody = cleanBody.replace(/<article[^>]*>/gi, "").replace(/<\/article>/gi, "");

  // Convert H1
  const h1Match = cleanBody.match(/<h1>([\s\S]*?)<\/h1>/i);
  const articleTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, "").trim() : jsonLd.headline || titleMatch?.[1] || "";
  cleanBody = cleanBody.replace(/<header>[\s\S]*?<\/header>/gi, (header) => {
    // Keep intro paragraph if present
    const introMatch = header.match(/<p class="intro">([\s\S]*?)<\/p>/i);
    return introMatch ? `<p>${introMatch[1]}</p>` : "";
  });
  cleanBody = cleanBody.replace(/<h1>[\s\S]*?<\/h1>/gi, "");
  cleanBody = cleanBody.replace(/<p class="eyebrow">[\s\S]*?<\/p>/gi, "");

  // Convert tables to markdown tables
  cleanBody = cleanBody.replace(/<table[\s\S]*?<\/table>/gi, (tableHtml) => {
    const rows = [];
    const trMatches = tableHtml.match(/<tr[\s\S]*?<\/tr>/gi) || [];
    let isHeader = true;
    for (const tr of trMatches) {
      const cells = [];
      const cellMatches = tr.match(/<(th|td)[^>]*>([\s\S]*?)<\/(th|td)>/gi) || [];
      for (const cell of cellMatches) {
        const text = cell.replace(/<(th|td)[^>]*>([\s\S]*?)<\/(th|td)>/i, "$2")
          .replace(/<a\s+href=["']([^"']+)["']>([\s\S]*?)<\/a>/gi, "[$2]($1)")
          .replace(/<strong>([\s\S]*?)<\/strong>/gi, "**$1**")
          .replace(/<[^>]+>/g, "")
          .replace(/\s+/g, " ")
          .trim();
        cells.push(text);
      }
      if (cells.length > 0) {
        rows.push(`| ${cells.join(" | ")} |`);
        if (isHeader) {
          rows.push(`| ${cells.map(() => "---").join(" | ")} |`);
          isHeader = false;
        }
      }
    }
    return `\n\n${rows.join("\n")}\n\n`;
  });

  // Convert headings
  cleanBody = cleanBody.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n\n## $1\n\n");
  cleanBody = cleanBody.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n\n### $1\n\n");
  cleanBody = cleanBody.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "\n\n#### $1\n\n");

  // Convert lists
  cleanBody = cleanBody.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_match, listContent) => {
    const items = listContent.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    const mdItems = items.map((li) => {
      const text = li.replace(/<li[^>]*>([\s\S]*?)<\/li>/i, "$1")
        .replace(/<a\s+href=["']([^"']+)["']>([\s\S]*?)<\/a>/gi, "[$2]($1)")
        .replace(/<strong>([\s\S]*?)<\/strong>/gi, "**$1**")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
      return `- ${text}`;
    });
    return `\n\n${mdItems.join("\n")}\n\n`;
  });

  cleanBody = cleanBody.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_match, listContent) => {
    const items = listContent.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    const mdItems = items.map((li, idx) => {
      const text = li.replace(/<li[^>]*>([\s\S]*?)<\/li>/i, "$1")
        .replace(/<a\s+href=["']([^"']+)["']>([\s\S]*?)<\/a>/gi, "[$2]($1)")
        .replace(/<strong>([\s\S]*?)<\/strong>/gi, "**$1**")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
      return `${idx + 1}. ${text}`;
    });
    return `\n\n${mdItems.join("\n")}\n\n`;
  });

  // Convert blockquotes
  cleanBody = cleanBody.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_match, bqContent) => {
    const text = bqContent.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n")
      .replace(/<a\s+href=["']([^"']+)["']>([\s\S]*?)<\/a>/gi, "[$2]($1)")
      .replace(/<strong>([\s\S]*?)<\/strong>/gi, "**$1**")
      .replace(/<[^>]+>/g, "")
      .trim();
    return `\n\n> ${text.split("\n").join("\n> ")}\n\n`;
  });

  // Convert paragraphs
  cleanBody = cleanBody.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_match, pContent) => {
    const text = pContent
      .replace(/<a\s+href=["']([^"']+)["']>([\s\S]*?)<\/a>/gi, "[$2]($1)")
      .replace(/<strong>([\s\S]*?)<\/strong>/gi, "**$1**")
      .replace(/<em>([\s\S]*?)<\/em>/gi, "*$1*")
      .replace(/<small>([\s\S]*?)<\/small>/gi, "$1")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return `\n\n${text}\n\n`;
  });

  // Strip section/footer tags and any remaining HTML tags
  cleanBody = cleanBody.replace(/<\/?(section|footer|div|span|header|caption)[^>]*>/gi, "");
  // Replace internal full URLs with relative paths e.g. https://www.hipamasalas.com/products -> /products
  cleanBody = cleanBody.replace(/https?:\/\/(www\.)?hipamasalas\.com(\/[a-zA-Z0-9\-_#]*)/gi, "$2");

  // Normalize newlines
  cleanBody = cleanBody.split("\n")
    .map((l) => l.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return {
    slug,
    title: articleTitle,
    description: descMatch ? descMatch[1] : jsonLd.description || "",
    body: cleanBody,
    authorName: "HIPA Masalas",
    coverImageUrl,
    coverImageAlt,
    status: "published",
    publishedAt: "2026-09-24T09:00:00.000Z",
    createdByUserId: 1,
    createdAt: "2026-09-24T09:00:00.000Z",
    updatedAt: "2026-09-24T09:00:00.000Z",
  };
}

const posts = [];
let id = 1;
for (const file of files) {
  const filePath = path.join(scratchDir, file);
  const rawHtml = fs.readFileSync(filePath, "utf8");
  const post = cleanHtmlToMarkdown(rawHtml);
  post.id = id++;
  posts.push(post);
}

fs.writeFileSync(path.resolve("data/blog-posts.json"), JSON.stringify(posts, null, 2) + "\n");
console.log(`Successfully generated data/blog-posts.json with ${posts.length} posts.`);
for (const p of posts) {
  console.log(`- [${p.id}] ${p.slug}: "${p.title}" (cover: ${p.coverImageUrl})`);
}
