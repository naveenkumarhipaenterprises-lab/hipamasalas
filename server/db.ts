import type { BlogPost, ProductAvailability } from "../drizzle/schema";
import {
  createLocalBlog,
  deleteLocalBlog,
  getLocalBlogById,
  getLocalBlogBySlug,
  listLocalAvailability,
  listLocalBlogs,
  setLocalAvailability,
  updateLocalBlog,
} from "./localStore";

export type BlogPostWrite = Omit<BlogPost, "id" | "createdAt" | "updatedAt">;

// Zero-Database Content Store: Powered by Git-backed files & local store.
// No MySQL connection or external database server required.

export async function listPublishedBlogPosts(): Promise<BlogPost[]> {
  return listLocalBlogs().filter((post) => post.status === "published");
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const post = getLocalBlogBySlug(slug);
  return post?.status === "published" ? post : undefined;
}

export async function listAdminBlogPosts(): Promise<BlogPost[]> {
  return listLocalBlogs();
}

export async function getAdminBlogPostById(id: number): Promise<BlogPost | undefined> {
  return getLocalBlogById(id);
}

export async function getAdminBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  return getLocalBlogBySlug(slug);
}

export async function createBlogPost(post: BlogPostWrite): Promise<BlogPost> {
  return createLocalBlog({
    ...post,
    status: post.status ?? "draft",
    createdByUserId: post.createdByUserId ?? 0,
    coverImageUrl: post.coverImageUrl ?? null,
    coverImageAlt: post.coverImageAlt ?? null,
  });
}

export async function updateBlogPost(id: number, post: Partial<BlogPostWrite>): Promise<BlogPost | undefined> {
  return updateLocalBlog(id, post);
}

export async function deleteBlogPost(id: number): Promise<void> {
  deleteLocalBlog(id);
}

export async function listPublishedBlogPaths(): Promise<string[]> {
  const posts = await listPublishedBlogPosts();
  return posts.map((post) => `/blog/${post.slug}`);
}

export async function listProductAvailability(): Promise<ProductAvailability[]> {
  return listLocalAvailability();
}

export async function setProductAvailability(
  productSlug: string,
  status: ProductAvailability["status"],
  updatedByUserId: number
): Promise<ProductAvailability> {
  return setLocalAvailability(productSlug, status, updatedByUserId);
}
