import { describe, expect, it } from "vitest";
import { buildLlmsTxt, buildRobotsTxt, buildSitemapXml } from "./seoRoutes";
import fs from "node:fs";
import { getIndexablePaths, getPageHead, getProduct, getProductFaqs, getStructuredData, products, siteIdentity } from "../shared/hipaContent";

describe("standalone SEO parity", () => {
  it("keeps the validated city-level HIPA entity without unsupported public-local details", () => {
    expect(siteIdentity.name).toBe("HIPA Masalas");
    expect(siteIdentity.locationLabel).toBe("Chennai, Tamil Nadu, India");
    expect("businessHours" in siteIdentity).toBe(false);
  });

  it("exposes all eight product routes and a three-question visible FAQ model for each product", () => {
    expect(products).toHaveLength(8);
    expect(getIndexablePaths().filter((path) => path.startsWith("/products/"))).toHaveLength(8);
    for (const product of products) {
      expect(getProductFaqs(product)).toHaveLength(3);
      expect(getPageHead(`/products/${product.slug}`).notFound).toBeUndefined();
    }
  });

  it("emits Product and FAQPage schema for a product and keeps legal pages out of the index", () => {
    const product = getProduct("sambar-powder");
    expect(product).not.toBeNull();
    const schemas = getStructuredData("/products/sambar-powder", "https://www.hipamasalas.com");
    expect(schemas.map((schema) => schema["@type"])).toEqual(expect.arrayContaining(["Product", "FAQPage"]));
    expect(getPageHead("/privacy")).toMatchObject({ canonicalPath: "/privacy", noindex: true });
    expect(getPageHead("/about")).toMatchObject({ title: "About HIPA Masalas | Chennai Spice Brand", canonicalPath: "/about" });
    expect(getPageHead("/terms-of-service")).toMatchObject({ canonicalPath: "/terms-of-service", noindex: true });
    expect(getStructuredData("/about", "https://www.hipamasalas.com").map((schema) => schema["@type"])).toContain("BreadcrumbList");
  });

  it("permits public crawling while excluding the private admin section", () => {
    expect(buildRobotsTxt("https://www.hipamasalas.com")).toContain("User-agent: *\nAllow: /\nDisallow: /admin");
  });

  it("keeps the singular B2B enquiry URL as a compatibility redirect", () => {
    const source = fs.readFileSync(new URL("./seoRoutes.ts", import.meta.url), "utf8");
    expect(source).toContain('"/b2b-enquiry": "/b2b-enquiries"');
  });

  it("builds crawler-readable sitemap and AI context without a database", () => {
    const sitemap = buildSitemapXml("https://www.hipamasalas.com");
    expect(sitemap).toContain("/products/sambar-powder");
    expect(sitemap).toContain("/about");
    expect(sitemap).not.toContain("/terms-of-service");
    expect(sitemap).toContain("/b2b-enquiries");
    expect(buildLlmsTxt("https://www.hipamasalas.com")).toContain("distributor, wholesaler, retailer");
  });
});
