import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Optional external identity identifier. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const enquiries = mysqlTable("enquiries", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 160 }).notNull(),
  mobileNumber: varchar("mobileNumber", { length: 32 }).notNull(),
  emailAddress: varchar("emailAddress", { length: 320 }),
  cityRegion: varchar("cityRegion", { length: 160 }),
  businessType: varchar("businessType", { length: 64 }).notNull(),
  expectedMonthlyVolume: varchar("expectedMonthlyVolume", { length: 64 }),
  productInterest: varchar("productInterest", { length: 128 }).notNull(),
  message: text("message"),
  consent: boolean("consent").default(false).notNull(),
  source: varchar("source", { length: 64 }).default("website").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const newsletterSubscriptions = mysqlTable("newsletterSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  emailAddress: varchar("emailAddress", { length: 320 }).notNull().unique(),
  consent: boolean("consent").default(false).notNull(),
  source: varchar("source", { length: 64 }).default("website").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const blogPosts = mysqlTable("blogPosts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  title: varchar("title", { length: 220 }).notNull(),
  description: varchar("description", { length: 320 }).notNull(),
  body: text("body").notNull(),
  authorName: varchar("authorName", { length: 160 }).notNull(),
  coverImageUrl: varchar("coverImageUrl", { length: 2048 }),
  coverImageAlt: varchar("coverImageAlt", { length: 255 }),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  publishedAt: timestamp("publishedAt"),
  createdByUserId: int("createdByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const productAvailability = mysqlTable("productAvailability", {
  id: int("id").autoincrement().primaryKey(),
  productSlug: varchar("productSlug", { length: 128 }).notNull().unique(),
  status: mysqlEnum("status", ["available", "unavailable"]).default("available").notNull(),
  updatedByUserId: int("updatedByUserId").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Enquiry = typeof enquiries.$inferSelect;
export type InsertEnquiry = typeof enquiries.$inferInsert;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = typeof newsletterSubscriptions.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;
export type ProductAvailability = typeof productAvailability.$inferSelect;
export type InsertProductAvailability = typeof productAvailability.$inferInsert;

// TODO: Add your tables here
