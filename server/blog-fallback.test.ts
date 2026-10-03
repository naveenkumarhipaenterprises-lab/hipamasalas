import { describe, expect, it } from "vitest";
import { getPublishedBlogPostBySlug, listPublishedBlogPosts } from "./db";

describe("database-free published blog fallback", () => {
  it("returns all bundled published posts without reading a missing Vercel file", async () => {
    const posts = await listPublishedBlogPosts();
    expect(posts).toHaveLength(14);
    expect(posts.every((post) => post.status === "published")).toBe(true);
  });

  it("returns a bundled published post by slug", async () => {
    const storagePost = await getPublishedBlogPostBySlug("how-to-store-indian-spice-powders");
    expect(storagePost?.title).toContain("How to Store Indian Spice Powders");
    expect(storagePost?.status).toBe("published");

    const oldPost = await getPublishedBlogPostBySlug("how-to-choose-sambar-powder");
    expect(oldPost?.title).toContain("Sambar Powder");
    expect(oldPost?.status).toBe("published");
  });
});
