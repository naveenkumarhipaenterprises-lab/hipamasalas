import { describe, expect, it } from "vitest";
import { HIPA_SYSTEM_PROMPT, getIntelligentFallback } from "./hipaChatRoute";
import { HIPA_KNOWLEDGE_BASE } from "./hipaKnowledge";
import { products } from "../shared/hipaContent";
import blogPosts from "../data/blog-posts.json";

const catalogueSection = HIPA_SYSTEM_PROMPT.split("PRODUCT CATALOGUE:")[1]?.split("HOW TO ANSWER")[0] ?? "";
const numberedItems = catalogueSection.split("\n").filter((line) => /^\d+\.\s/.test(line.trim()));

describe("chat assistant stays in step with the product catalogue", () => {
  it("lists exactly the products the site sells", () => {
    expect(numberedItems).toHaveLength(products.length);
    for (const product of products) {
      expect(catalogueSection).toContain(product.name);
    }
  });

  it("does not offer products or processes the site does not have", () => {
    for (const text of [HIPA_SYSTEM_PROMPT, getIntelligentFallback("product list"), getIntelligentFallback("what do you have")]) {
      expect(text).not.toMatch(/podi\b/i);
      expect(text).not.toMatch(/stone[- ]ground/i);
    }
  });

  it("keeps the knowledge base to the same eight products", () => {
    expect(HIPA_KNOWLEDGE_BASE.products).toHaveLength(products.length);
    expect(HIPA_KNOWLEDGE_BASE.products.map((p) => p.id)).not.toContain("garlic-podi");
    expect(HIPA_KNOWLEDGE_BASE.products.map((p) => p.id)).not.toContain("paruppu-podi");
  });

  it("names every product in the fallback product answer", () => {
    const answer = getIntelligentFallback("product list");
    for (const word of ["Sambar", "Rasam", "Garam Masala", "Turmeric", "Red Chilli", "Coriander", "Cumin", "Pepper"]) {
      expect(answer).toContain(word);
    }
  });
});

describe("blog meta descriptions fit a search result", () => {
  it("keeps every description between 70 and 160 characters", () => {
    for (const post of blogPosts as Array<{ slug: string; description: string }>) {
      expect(post.description.length, post.slug).toBeGreaterThanOrEqual(70);
      expect(post.description.length, post.slug).toBeLessThanOrEqual(160);
    }
  });
});
