import { describe, expect, it } from "vitest";
import { getLocalBlogBySlug, listLocalBlogs, parseLocalState } from "./localStore";

describe("bundled local blog store", () => {
  it("exposes all published HIPA articles without a database", () => {
    const posts = listLocalBlogs();

    expect(posts).toHaveLength(13);
    expect(posts.every((post) => post.status === "published")).toBe(true);
    expect(posts.every((post) => post.coverImageUrl?.startsWith("/assets/"))).toBe(true);
  });

  it("preserves saved product availability in object-shaped local state", () => {
    const parsed = parseLocalState(JSON.stringify({ blogs: [], availability: [{ id: 1, productSlug: "sambar-powder", status: "unavailable", updatedByUserId: 0, updatedAt: new Date().toISOString() }] }));

    expect(parsed.availability).toHaveLength(1);
    expect(parsed.availability[0]?.productSlug).toBe("sambar-powder");
    expect(parsed.availability[0]?.status).toBe("unavailable");
  });

  it("can retrieve a bundled article by its public slug", () => {
    const newPost = getLocalBlogBySlug("best-masala-manufacturer-in-chennai");
    expect(newPost?.title).toBe("Best Masala Manufacturer in Chennai? What Buyers Should Actually Check");
    expect(newPost?.coverImageUrl).toMatch(/^\/assets\//);

    const oldPost = getLocalBlogBySlug("how-to-choose-sambar-powder");
    expect(oldPost?.title).toBe("How to Choose Sambar Powder for Everyday Cooking");
    expect(oldPost?.coverImageUrl).toMatch(/^\/assets\//);
  });
});
