import { describe, expect, it } from "vitest";
import { getLocalBlogBySlug, listLocalBlogs } from "./localStore";

describe("bundled local blog store", () => {
  it("exposes all seven published HIPA articles without a database", () => {
    const posts = listLocalBlogs();

    expect(posts).toHaveLength(7);
    expect(posts.every((post) => post.status === "published")).toBe(true);
    expect(posts.every((post) => post.coverImageUrl?.startsWith("/assets/"))).toBe(true);
  });

  it("can retrieve a bundled article by its public slug", () => {
    const post = getLocalBlogBySlug("how-to-choose-sambar-powder");

    expect(post?.title).toBe("How to Choose Sambar Powder for Everyday Cooking");
    expect(post?.coverImageUrl).toMatch(/^\/assets\//);
  });
});
