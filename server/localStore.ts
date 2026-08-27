import fs from "node:fs";
import path from "node:path";
import type { BlogPost, ProductAvailability } from "../drizzle/schema";
import bundledSeedBlogs from "../data/blog-posts.json";

type StoredBlogPost = Omit<BlogPost, "createdAt" | "updatedAt" | "publishedAt"> & { createdAt: string; updatedAt: string; publishedAt: string | null };
type LocalState = { blogs: StoredBlogPost[]; availability: ProductAvailability[] };

const isVercel = Boolean(process.env.VERCEL);
const dataDir = isVercel ? path.resolve(process.cwd(), "data") : path.resolve(import.meta.dirname, "..", "data");
const seedPath = path.join(dataDir, "blog-posts.json");
const statePath = path.join(dataDir, "local-state.json");
const bundledBlogs = bundledSeedBlogs as StoredBlogPost[];

function fromStored(post: StoredBlogPost): BlogPost {
  return { ...post, createdAt: new Date(post.createdAt), updatedAt: new Date(post.updatedAt), publishedAt: post.publishedAt ? new Date(post.publishedAt) : null };
}

function toStored(post: BlogPost): StoredBlogPost {
  return { ...post, createdAt: post.createdAt.toISOString(), updatedAt: post.updatedAt.toISOString(), publishedAt: post.publishedAt?.toISOString() ?? null };
}

export function parseLocalState(raw: string): LocalState {
  const parsed = JSON.parse(raw) as StoredBlogPost[] | Partial<LocalState>;
  if (Array.isArray(parsed)) return { blogs: parsed, availability: [] };
  return {
    blogs: Array.isArray(parsed.blogs) ? parsed.blogs : bundledBlogs,
    availability: Array.isArray(parsed.availability) ? parsed.availability : [],
  };
}

function readState(): LocalState {
  const file = fs.existsSync(statePath) ? statePath : seedPath;
  if (!fs.existsSync(file)) return { blogs: bundledBlogs, availability: [] };
  return parseLocalState(fs.readFileSync(file, "utf8"));
}

function writeState(state: LocalState) {
  if (isVercel) throw new Error("Persistent blog and availability writes require a configured database");
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
}

export function listLocalBlogs() {
  return readState().blogs.map(fromStored).sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt));
}

export function getLocalBlogById(id: number) {
  return listLocalBlogs().find((post) => post.id === id);
}

export function getLocalBlogBySlug(slug: string) {
  return listLocalBlogs().find((post) => post.slug === slug);
}

export function createLocalBlog(post: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "publishedAt"> & { publishedAt?: Date | null }) {
  const state = readState();
  const now = new Date();
  const nextId = Math.max(0, ...state.blogs.map((item) => item.id)) + 1;
  const created = { ...post, id: nextId, createdAt: now, updatedAt: now, publishedAt: post.status === "published" ? (post.publishedAt ?? now) : null } as BlogPost;
  state.blogs.push(toStored(created));
  writeState(state);
  return created;
}

export function updateLocalBlog(id: number, patch: Partial<BlogPost>) {
  const state = readState();
  const index = state.blogs.findIndex((post) => post.id === id);
  if (index < 0) return undefined;
  const existing = fromStored(state.blogs[index]);
  const updated = { ...existing, ...patch, id, updatedAt: new Date(), publishedAt: patch.status === "published" && !existing.publishedAt ? new Date() : patch.status === "draft" ? null : existing.publishedAt } as BlogPost;
  state.blogs[index] = toStored(updated);
  writeState(state);
  return updated;
}

export function deleteLocalBlog(id: number) {
  const state = readState();
  state.blogs = state.blogs.filter((post) => post.id !== id);
  writeState(state);
}

export function listLocalAvailability() {
  const state = readState();
  return state.availability;
}

export function setLocalAvailability(productSlug: string, status: ProductAvailability["status"], updatedByUserId: number) {
  const state = readState();
  const existing = state.availability.find((item) => item.productSlug === productSlug);
  const value: ProductAvailability = existing ? { ...existing, status, updatedByUserId, updatedAt: new Date() } : { id: state.availability.length + 1, productSlug, status, updatedByUserId, updatedAt: new Date() };
  state.availability = [...state.availability.filter((item) => item.productSlug !== productSlug), value];
  writeState(state);
  return value;
}
