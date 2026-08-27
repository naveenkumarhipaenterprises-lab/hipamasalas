import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { BlogPost, InsertBlogPost, InsertEnquiry, InsertNewsletterSubscription, InsertUser, ProductAvailability, blogPosts, enquiries, newsletterSubscriptions, productAvailability, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import { createLocalBlog, deleteLocalBlog, getLocalBlogById, getLocalBlogBySlug, listLocalAvailability, listLocalBlogs, setLocalAvailability, updateLocalBlog } from "./localStore";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!_db && databaseUrl && !databaseUrl.includes("USER:PASSWORD@HOST")) {
    try {
      _db = drizzle(databaseUrl);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createEnquiry(enquiry: InsertEnquiry): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database is not available for enquiry submission");
  }

  await db.insert(enquiries).values(enquiry);
}

export async function createNewsletterSubscription(subscription: InsertNewsletterSubscription): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database is not available for newsletter subscription");
  }

  await db.insert(newsletterSubscriptions).values(subscription).onDuplicateKeyUpdate({
    set: { consent: subscription.consent, source: subscription.source },
  });
}

export type BlogPostWrite = Omit<InsertBlogPost, "id" | "createdAt" | "updatedAt">;

function requireDatabase<T>(db: T | null): T {
  if (!db) throw new Error("Database is not available for blog publishing");
  return db;
}

export async function listPublishedBlogPosts(): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return listLocalBlogs().filter((post) => post.status === "published");
  return db.select().from(blogPosts).where(eq(blogPosts.status, "published")).orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt));
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) {
    const post = getLocalBlogBySlug(slug);
    return post?.status === "published" ? post : undefined;
  }
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result[0]?.status === "published" ? result[0] : undefined;
}

export async function listAdminBlogPosts(): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return listLocalBlogs();
  return db.select().from(blogPosts).orderBy(desc(blogPosts.updatedAt), desc(blogPosts.createdAt));
}

export async function getAdminBlogPostById(id: number): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return getLocalBlogById(id);
  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result[0];
}

export async function getAdminBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return getLocalBlogBySlug(slug);
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result[0];
}

export async function createBlogPost(post: BlogPostWrite): Promise<BlogPost> {
  const db = await getDb();
  if (!db) return createLocalBlog({
    ...post,
    status: post.status ?? "draft",
    createdByUserId: post.createdByUserId ?? 0,
    coverImageUrl: post.coverImageUrl ?? null,
    coverImageAlt: post.coverImageAlt ?? null,
  });
  const result = await db.insert(blogPosts).values(post);
  const created = await getAdminBlogPostById(Number(result[0].insertId));
  if (!created) throw new Error("Blog post could not be created");
  return created;
}

export async function updateBlogPost(id: number, post: Partial<BlogPostWrite>): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return updateLocalBlog(id, post);
  await db.update(blogPosts).set(post).where(eq(blogPosts.id, id));
  return getAdminBlogPostById(id);
}

export async function deleteBlogPost(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return deleteLocalBlog(id);
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

export async function listPublishedBlogPaths(): Promise<string[]> {
  const posts = await listPublishedBlogPosts();
  return posts.map((post) => `/blog/${post.slug}`);
}

export async function listProductAvailability(): Promise<ProductAvailability[]> {
  const db = await getDb();
  if (!db) return listLocalAvailability();
  return db.select().from(productAvailability).orderBy(productAvailability.productSlug);
}

export async function setProductAvailability(productSlug: string, status: ProductAvailability["status"], updatedByUserId: number): Promise<ProductAvailability> {
  const db = await getDb();
  if (!db) return setLocalAvailability(productSlug, status, updatedByUserId);
  await db.insert(productAvailability).values({ productSlug, status, updatedByUserId }).onDuplicateKeyUpdate({
    set: { status, updatedByUserId },
  });
  const result = await db.select().from(productAvailability).where(eq(productAvailability.productSlug, productSlug)).limit(1);
  if (!result[0]) throw new Error("Product availability could not be saved");
  return result[0];
}

// TODO: add feature queries here as your schema grows.
