import { describe, expect, it } from "vitest";
import { buildLlmsTxt } from "./seoRoutes";
import { getIndexablePaths, products } from "../shared/hipaContent";
import fs from "node:fs";

const origin = "https://www.hipamasalas.com";
const blogPosts: unknown = JSON.parse(fs.readFileSync(new URL("../data/blog-posts.json", import.meta.url), "utf8"));
const published = (blogPosts as Array<{ slug: string; title: string; description: string; status: string }>)
  .filter((post) => post.status === "published")
  .map(({ slug, title, description }) => ({ slug, title, description }));

describe("llms.txt", () => {
  const text = buildLlmsTxt(origin, published);
  const lines = text.split("\n");
  const links = [...text.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)].map((m) => ({ label: m[1], url: m[2] }));

  it("follows the llmstxt.org structure: H1, blockquote summary, H2 sections of link lists", () => {
    expect(lines[0]).toBe("# HIPA Masala");
    expect(lines.filter((line) => line.startsWith("# "))).toHaveLength(1);
    expect(lines.find((line) => line.startsWith(">"))).toBeTruthy();
    const sections = lines.filter((line) => line.startsWith("## ")).map((line) => line.slice(3));
    expect(sections).toEqual(["About", "Products", "Quality / Manufacturing", "Business / B2B", "Chennai / Pallavaram", "Blog", "Contact"]);
    for (const line of lines.filter((l) => l.startsWith("- "))) expect(line).toMatch(/^- \[[^\]]+\]\(https:\/\/www\.hipamasalas\.com\/[^)]*\)(: .+)?$/);
  });

  it("links only to canonical, indexable pages that exist on the site", () => {
    const allowed = new Set([...getIndexablePaths(), ...published.map((post) => `/blog/${post.slug}`)]);
    expect(links.length).toBeGreaterThan(20);
    for (const { url } of links) {
      expect(url.startsWith(`${origin}/`)).toBe(true);
      expect(allowed.has(url.slice(origin.length))).toBe(true);
    }
    expect(text).not.toContain("/admin");
    expect(text).not.toContain("/privacy");
  });

  it("lists every product and every published article", () => {
    for (const product of products) expect(text).toContain(`(${origin}/products/${product.slug})`);
    for (const post of published) expect(text).toContain(`(${origin}/blog/${post.slug})`);
  });

  it("still produces a valid file when the blog store is unavailable", () => {
    const fallback = buildLlmsTxt(origin);
    expect(fallback.startsWith("# HIPA Masala\n")).toBe(true);
    expect(fallback).toContain(`[HIPA Masala blog](${origin}/blog)`);
  });
});
