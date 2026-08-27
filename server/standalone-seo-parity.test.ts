import { describe, expect, it } from "vitest";
import { buildRobotsTxt } from "./seoRoutes";
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

  it("emits Product and FAQPage schema for a product and keeps privacy out of the index", () => {
    const product = getProduct("sambar-powder");
    expect(product).not.toBeNull();
    const schemas = getStructuredData("/products/sambar-powder", "https://www.hipamasalas.com");
    expect(schemas.map((schema) => schema["@type"])).toEqual(expect.arrayContaining(["Product", "FAQPage"]));
    expect(getPageHead("/privacy")).toMatchObject({ canonicalPath: "/privacy", noindex: true });
  });

  it("permits public crawling while excluding the private admin section", () => {
    expect(buildRobotsTxt("https://www.hipamasalas.com")).toContain("User-agent: *\nAllow: /\nDisallow: /admin");
  });
});
