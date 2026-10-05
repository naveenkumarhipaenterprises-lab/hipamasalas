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
    // "podi" is simply Tamil for powder, so the prompt may explain it; only the catalogue lines and the
    // fallback answers must stay free of it, and the two retired rice podis must not reappear anywhere.
    const fallbacks = [getIntelligentFallback("product list"), getIntelligentFallback("what do you have")];
    const explanationLine = HIPA_SYSTEM_PROMPT.split("\n").find((line) => line.startsWith("These eight are the only products"));
    expect(explanationLine).toContain("not in the range");
    const promptWithoutExplanation = HIPA_SYSTEM_PROMPT.split("\n").filter((line) => line !== explanationLine).join("\n");
    for (const text of [promptWithoutExplanation, ...fallbacks]) {
      expect(text).not.toMatch(/podi/i);
    }
    for (const text of [HIPA_SYSTEM_PROMPT, ...fallbacks]) {
      expect(text).not.toMatch(/stone[- ]ground/i);
      expect(text).not.toMatch(/farm[- ]to[- ]factory/i);
    }
  });

  it("quotes pack sizes that match the product pages", () => {
    const sambar = products.find((p) => p.slug === "sambar-powder");
    const rasam = products.find((p) => p.slug === "rasam-powder");
    expect(sambar?.packSizes).not.toContain("50g");
    expect(rasam?.packSizes).not.toContain("50g");
    expect(getIntelligentFallback("recipe")).not.toMatch(/\b50g\b/);
    expect(getIntelligentFallback("recipe")).toContain("100g to 1kg");
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
