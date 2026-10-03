import { describe, expect, it } from "vitest";
import { articles } from "../shared/hipaContent";
import { getLocalBlogBySlug, listLocalBlogs, parseLocalState } from "./localStore";

describe("bundled local blog store", () => {
  it("exposes all published HIPA articles without a database", () => {
    const posts = listLocalBlogs();

    expect(posts).toHaveLength(11);
    expect(posts.every((post) => post.status === "published")).toBe(true);
    expect(posts.every((post) => post.coverImageUrl?.startsWith("/assets/"))).toBe(true);
  });

  it("preserves saved product availability in object-shaped local state", () => {
    const parsed = parseLocalState(JSON.stringify({ blogs: [], availability: [{ id: 1, productSlug: "sambar-powder", status: "unavailable", updatedByUserId: 0, updatedAt: new Date().toISOString() }] }));

    expect(parsed.availability).toHaveLength(1);
    expect(parsed.availability[0]?.productSlug).toBe("sambar-powder");
    expect(parsed.availability[0]?.status).toBe("unavailable");
  });

  it("keeps the bundled article metadata (client titles, sitemap paths) in step with the published posts", () => {
    // HeadManager and getIndexablePaths read shared/hipaContent.ts `articles`, while pages render
    // from data/blog-posts.json, so a post that exists in only one list gets a stale title or a
    // sitemap entry that redirects.
    const published = new Map(listLocalBlogs().map((post) => [post.slug, post]));
    const bundled = articles.filter((article) => article.complete);

    expect(bundled.map((article) => article.slug).sort()).toEqual([...published.keys()].sort());
    for (const article of bundled) {
      const post = published.get(article.slug);
      expect(article.title, article.slug).toBe(post?.title);
      expect(article.description, article.slug).toBe(post?.description);
    }
  });

  it("can retrieve a bundled article by its public slug", () => {
    const newPost = getLocalBlogBySlug("best-masala-manufacturer-in-chennai");
    expect(newPost?.title).toBe("Best Masala Manufacturer in Chennai? What Buyers Should Check");
    expect(newPost?.coverImageUrl).toMatch(/^\/assets\//);

    const storagePost = getLocalBlogBySlug("how-to-store-indian-spice-powders");
    expect(storagePost?.title).toBe("How to Store Indian Spice Powders to Preserve Freshness, Aroma and Essential Oils");
    expect(storagePost?.coverImageUrl).toMatch(/^\/assets\//);

    const oldPost = getLocalBlogBySlug("how-to-choose-sambar-powder");
    expect(oldPost?.title).toBe("How to Choose Sambar Powder for Everyday Cooking");
    expect(oldPost?.coverImageUrl).toMatch(/^\/assets\//);
  });
});
