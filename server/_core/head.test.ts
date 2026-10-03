import { describe, expect, it } from "vitest";
import { cleanText, fitTitle } from "./vite";

describe("search-result title fitting", () => {
  it("keeps short titles, brand suffix included", () => {
    expect(fitTitle("Contact HIPA Masala | Chennai | Phone, Email & WhatsApp", 65)).toBe("Contact HIPA Masala | Chennai | Phone, Email & WhatsApp");
  });

  it("drops the brand suffix before cutting a long title", () => {
    expect(fitTitle("Masala Manufacturer vs Supplier vs Distributor: Which to Buy From | HIPA Masala", 65)).toBe(
      "Masala Manufacturer vs Supplier vs Distributor: Which to Buy From",
    );
  });

  it("cuts an over-long title at a word boundary, never mid-word", () => {
    const fitted = fitTitle("How to Store Indian Spice Powders to Preserve Freshness, Aroma and Essential Oils | HIPA Masala", 65);
    expect(fitted).toBe("How to Store Indian Spice Powders to Preserve Freshness, Aroma…");
    expect(fitted.length).toBeLessThanOrEqual(65);
  });

  it("falls back to a hard cut when there is no late word boundary", () => {
    expect(cleanText("a".repeat(80), 20)).toBe(`${"a".repeat(19)}…`);
  });

  it("never splits an emoji or other astral character at the cut", () => {
    const cut = cleanText(`Sambar ${"\u{1F336}".repeat(8)}`, 19);
    expect(cut.isWellFormed()).toBe(true);
    expect(cut.endsWith("…")).toBe(true);
    expect(cut.length).toBeLessThanOrEqual(19);
  });

  it("drops a dangling comma before the ellipsis", () => {
    expect(cleanText("Pure spice powders, masala blends, bulk packs, for restaurants and retailers in Chennai", 50)).toBe(
      "Pure spice powders, masala blends, bulk packs…",
    );
  });
});
