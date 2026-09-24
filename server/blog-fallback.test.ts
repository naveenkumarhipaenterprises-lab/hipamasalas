import { describe, expect, it } from "vitest";
import { getPublishedBlogPostBySlug, listPublishedBlogPosts } from "./db";

describe("database-free published blog fallback", () => {
  it("returns all bundled published posts without reading a missing Vercel file", async () => {
    const posts = await listPublishedBlogPosts();
    expect(posts).toHaveLength(5);
    expect(posts.every((post) => post.status === "published")).toBe(true);
  });

  it("returns a bundled published post by slug", async () => {
    const post = await getPublishedBlogPostBySlug("best-masala-manufacturer-in-chennai");
    expect(post?.title).toContain("Best Masala Manufacturer in Chennai");
    expect(post?.status).toBe("published");
  });
});
