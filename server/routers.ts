import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { createBlogPost, createEnquiry, createNewsletterSubscription, deleteBlogPost, getAdminBlogPostById, getAdminBlogPostBySlug, getPublishedBlogPostBySlug, listAdminBlogPosts, listProductAvailability, listPublishedBlogPosts, setProductAvailability, updateBlogPost } from "./db";
import { products } from "../shared/hipaContent";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE_MS, createAdminSessionToken, verifyAdminCredentials } from "./adminPasswordAuth";
import { storagePut } from "./storage";

const enquiryInput = z.object({
  fullName: z.string().trim().min(2).max(160),
  mobileNumber: z.string().trim().min(7).max(32),
  emailAddress: z.string().trim().email().max(320).optional(),
  cityRegion: z.string().trim().min(2).max(160).optional(),
  businessType: z.enum(["Retail Customer", "Distributor", "Wholesaler", "Retailer", "Supermarket", "Restaurant", "Restaurant / Hotel", "Exporter", "Other"]),
  expectedMonthlyVolume: z.enum(["Under 50kg", "50kg – 200kg", "200kg – 500kg", "500kg+", "Not sure yet"]).optional(),
  productInterest: z.string().trim().min(2).max(128),
  message: z.string().trim().max(2000).optional(),
  consent: z.literal(true),
});

const newsletterInput = z.object({
  emailAddress: z.string().trim().email().max(320),
  consent: z.literal(true),
});

const blogPostInput = z.object({
  title: z.string().trim().min(8).max(220),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens").max(180),
  description: z.string().trim().min(40).max(320),
  body: z.string().trim().min(120).max(60_000),
  authorName: z.string().trim().min(2).max(160),
  coverImageUrl: z.string().trim().max(2048).optional(),
  coverImageAlt: z.string().trim().max(255).optional(),
  status: z.enum(["draft", "published"]),
});

const coverImageUploadInput = z.object({
  fileName: z.string().trim().min(1).max(255),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  base64: z.string().min(1).max(7_000_000),
});

const coverImageExtensions = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
} as const;

function hasExpectedImageSignature(buffer: Buffer, contentType: keyof typeof coverImageExtensions) {
  if (contentType === "image/png") return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (contentType === "image/jpeg") return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (contentType === "image/gif") return buffer.length >= 6 && (buffer.subarray(0, 6).toString("ascii") === "GIF87a" || buffer.subarray(0, 6).toString("ascii") === "GIF89a");
  return buffer.length >= 12 && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
}

const productAvailabilityInput = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(128),
  status: z.enum(["available", "unavailable"]),
});

const adminLoginInput = z.object({
  username: z.string().trim().min(1).max(128),
  password: z.string().min(1).max(256),
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  adminAccess: router({
    status: publicProcedure.query(({ ctx }) => ({ authenticated: ctx.adminSession === true })),
    login: publicProcedure.input(adminLoginInput).mutation(async ({ input, ctx }) => {
      if (!verifyAdminCredentials(input.username, input.password)) throw new Error("Username or password is incorrect");
      const token = await createAdminSessionToken();
      ctx.res.cookie(ADMIN_SESSION_COOKIE, token, { ...getSessionCookieOptions(ctx.req), maxAge: ADMIN_SESSION_MAX_AGE_MS });
      return { success: true } as const;
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(ADMIN_SESSION_COOKIE, { ...getSessionCookieOptions(ctx.req), maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  enquiries: router({
    create: publicProcedure.input(enquiryInput).mutation(async ({ input }) => {
      await createEnquiry({
        fullName: input.fullName,
        mobileNumber: input.mobileNumber,
        emailAddress: input.emailAddress || null,
        cityRegion: input.cityRegion || null,
        businessType: input.businessType,
        expectedMonthlyVolume: input.expectedMonthlyVolume || null,
        productInterest: input.productInterest,
        message: input.message || null,
        consent: input.consent,
        source: "website",
      });

      const notified = await notifyOwner({
        title: `New HIPA ${input.businessType} enquiry`,
        content: [
          `Name: ${input.fullName}`,
          `Mobile: ${input.mobileNumber}`,
          `Email: ${input.emailAddress || "Not provided"}`,
          `City / Region: ${input.cityRegion || "Not provided"}`,
          `Expected Monthly Volume: ${input.expectedMonthlyVolume || "Not provided"}`,
          `Product: ${input.productInterest}`,
          `Message: ${input.message || "Not provided"}`,
        ].join("\n"),
      });

      return { success: true, notified } as const;
    }),
  }),
  newsletter: router({
    subscribe: publicProcedure.input(newsletterInput).mutation(async ({ input }) => {
      await createNewsletterSubscription({
        emailAddress: input.emailAddress,
        consent: true,
        source: "website",
      });
      return { success: true } as const;
    }),
  }),
  productAvailability: router({
    publicList: publicProcedure.query(async () => listProductAvailability()),
    adminList: adminProcedure.query(async () => listProductAvailability()),
    set: adminProcedure.input(productAvailabilityInput).mutation(async ({ input, ctx }) => {
      if (!products.some((product) => product.slug === input.slug)) throw new Error("Product not found");
      return setProductAvailability(input.slug, input.status, ctx.user?.id ?? 0);
    }),
  }),
  blog: router({
    uploadCoverImage: adminProcedure.input(coverImageUploadInput).mutation(async ({ input }) => {
      if (!/^[A-Za-z0-9+/]+={0,2}$/.test(input.base64)) throw new Error("The selected image could not be read safely");
      const bytes = Buffer.from(input.base64, "base64");
      if (!bytes.length || bytes.length > 5 * 1024 * 1024) throw new Error("Choose an image smaller than 5 MB");
      if (!hasExpectedImageSignature(bytes, input.contentType)) throw new Error("The selected file does not match its image format");
      const extension = coverImageExtensions[input.contentType];
      const upload = await storagePut(`blog-covers/cover-${Date.now()}.${extension}`, bytes, input.contentType);
      return { url: upload.url, key: upload.key, fileName: input.fileName };
    }),
    publishedList: publicProcedure.query(async () => listPublishedBlogPosts()),
    publishedBySlug: publicProcedure.input(z.object({ slug: z.string().trim().min(1).max(180) })).query(async ({ input }) => getPublishedBlogPostBySlug(input.slug)),
    adminList: adminProcedure.query(async () => listAdminBlogPosts()),
    create: adminProcedure.input(blogPostInput).mutation(async ({ input, ctx }) => {
      const existing = await getAdminBlogPostBySlug(input.slug);
      if (existing) throw new Error("A blog post already uses this slug");
      return createBlogPost({
        ...input,
        coverImageUrl: input.coverImageUrl || null,
        coverImageAlt: input.coverImageAlt || null,
        publishedAt: input.status === "published" ? new Date() : null,
        createdByUserId: ctx.user?.id ?? 0,
      });
    }),
    update: adminProcedure.input(z.object({ id: z.number().int().positive(), post: blogPostInput })).mutation(async ({ input }) => {
      const existing = await getAdminBlogPostById(input.id);
      if (!existing) throw new Error("Blog post not found");
      const duplicate = await getAdminBlogPostBySlug(input.post.slug);
      if (duplicate && duplicate.id !== input.id) throw new Error("A blog post already uses this slug");
      return updateBlogPost(input.id, {
        ...input.post,
        coverImageUrl: input.post.coverImageUrl || null,
        coverImageAlt: input.post.coverImageAlt || null,
        publishedAt: input.post.status === "published" ? existing.publishedAt || new Date() : null,
      });
    }),
    delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      await deleteBlogPost(input.id);
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
