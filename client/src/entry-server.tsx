import { QueryClient, QueryClientProvider, dehydrate } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { getQueryKey } from "@trpc/react-query";
import React from "react";
import { renderToString } from "react-dom/server";
import superjson from "superjson";
import { Router } from "wouter";
import App from "./App";
import { trpc } from "./lib/trpc";
import { getPageHead, type Article, type PageHead } from "@shared/hipaContent";
import type { BlogPost, ProductAvailability } from "../../drizzle/schema";
import { getPublishedBlogPostBySlug, listProductAvailability, listPublishedBlogPosts } from "../../server/db";

export type RenderResult = {
  html: string;
  dehydratedState: unknown;
  head: PageHead;
};

export type BlogRenderSource = {
  listPublished: () => Promise<BlogPost[]>;
  getPublishedBySlug: (slug: string) => Promise<BlogPost | undefined>;
};

export type ProductAvailabilityRenderSource = {
  list: () => Promise<ProductAvailability[]>;
};

const databaseBlogRenderSource: BlogRenderSource = {
  listPublished: listPublishedBlogPosts,
  getPublishedBySlug: getPublishedBlogPostBySlug,
};

const databaseProductAvailabilityRenderSource: ProductAvailabilityRenderSource = {
  list: listProductAvailability,
};

function asArticle(post: BlogPost): Article {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    body: post.body.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean),
    authorName: post.authorName,
    publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    modifiedAt: post.updatedAt.toISOString(),
    image: post.coverImageUrl || undefined,
    imageAlt: post.coverImageAlt || undefined,
    complete: post.status === "published" && post.body.trim().length >= 120,
  };
}

export async function render(url: string, blogSource: BlogRenderSource = databaseBlogRenderSource, availabilitySource: ProductAvailabilityRenderSource = databaseProductAvailabilityRenderSource): Promise<RenderResult> {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } } });
  const divider = url.indexOf("?");
  const ssrPath = divider === -1 ? url : url.slice(0, divider);
  const ssrSearch = divider === -1 ? "" : url.slice(divider + 1);
  let head = getPageHead(ssrPath);
  const availability = await availabilitySource.list();
  queryClient.setQueryData(getQueryKey(trpc.productAvailability.publicList, undefined, "query"), availability);
  if (ssrPath === "/blog") {
    const posts = await blogSource.listPublished();
    queryClient.setQueryData(getQueryKey(trpc.blog.publishedList, undefined, "query"), posts);
  }
  const articleMatch = ssrPath.match(/^\/blog\/([^/]+)$/);
  if (articleMatch) {
    const post = await blogSource.getPublishedBySlug(articleMatch[1]);
    queryClient.setQueryData(getQueryKey(trpc.blog.publishedBySlug, { slug: articleMatch[1] }, "query"), post ?? null);
    if (post) {
      const article = asArticle(post);
      head = {
        title: `${article.title} | HIPA Masalas`,
        description: article.description,
        canonicalPath: ssrPath,
        ogType: "article",
        ogImage: article.image,
        ogImageAlt: article.imageAlt,
        publishedTime: article.publishedAt,
        modifiedTime: article.modifiedAt,
        article,
      };
    }
  }
  const trpcClient = trpc.createClient({ links: [httpBatchLink({ url: "/api/trpc", transformer: superjson })] });
  const html = renderToString(
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router ssrPath={ssrPath} ssrSearch={ssrSearch}>
          <App />
        </Router>
      </QueryClientProvider>
    </trpc.Provider>
  );
  return { html, dehydratedState: dehydrate(queryClient), head };
}
