import { describe, expect, it } from "vitest";
import { getPublishedBlogPostBySlug, listPublishedBlogPosts } from "./db";

describe("database-free published blog fallback", () => {
  it("returns all bundled published posts without reading a missing Vercel file", async () => {
    const posts = await listPublishedBlogPosts();
    expect(posts).toHaveLength(13);
    expect(posts.every((post) => post.status === "published")).toBe(true);
  });

  it("returns a bundled published post by slug", async () => {
    const newPost = await getPublishedBlogPostBySlug("best-masala-manufacturer-in-chennai");
    expect(newPost?.title).toContain("Best Masala Manufacturer in Chennai");
    expect(newPost?.status).toBe("published");

    const oldPost = await getPublishedBlogPostBySlug("how-to-choose-sambar-powder");
    expect(oldPost?.title).toContain("Sambar Powder");
    expect(oldPost?.status).toBe("published");
  });
});
