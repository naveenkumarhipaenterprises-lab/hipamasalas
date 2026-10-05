import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { imageManifest } from "../client/src/lib/imageManifest.generated";
import { getShopHref, isExternalShop, products, siteIdentity } from "../shared/hipaContent";

const projectRoot = path.resolve(import.meta.dirname, "..");
const assets = path.join(projectRoot, "client", "public", "assets");

describe("product pack photos", () => {
  it("exist on disk with responsive variants for every product", () => {
    for (const product of products) {
      const file = path.join(projectRoot, "client", "public", product.image);
      expect(fs.existsSync(file), product.image).toBe(true);
      const row = imageManifest[product.image];
      expect(row, `${product.image} missing from the image manifest`).toBeDefined();
      const [width, height, widths] = row;
      // Uniform 2:3 canvas so cards, carousel and product pages line up.
      expect(Math.abs(width / height - 2 / 3), product.image).toBeLessThan(0.01);
      for (const w of widths) {
        const variant = path.join(assets, "img", `${path.basename(product.image, path.extname(product.image))}-${w}w.webp`);
        expect(fs.existsSync(variant), variant).toBe(true);
      }
    }
  });

  it("no longer references the retired cropped pack images anywhere", () => {
    const retired = ["sambar_96379996", "rasam_b3831405", "turmeric_1bd08fa7", "cumin_cd53cea5", "pepper_36d6b66d", "coriander_6db70131", "garam-masala_6b465bcd", "-collection_", "-hero_"];
    const sources = ["shared/hipaContent.ts", "client/src/components/ProductCard.tsx", "client/src/pages/HomePage.tsx", "client/src/pages/HipaPages.tsx"].map((file) => fs.readFileSync(path.join(projectRoot, file), "utf8")).join("\n");
    for (const token of retired) expect(sources, token).not.toContain(token);
  });
});

describe("shop link and navigation", () => {
  it("keeps the shop URL empty or an https address and falls back to the catalogue", () => {
    expect(siteIdentity.shopUrl === "" || /^https:\/\//.test(siteIdentity.shopUrl)).toBe(true);
    expect(getShopHref()).toBe(siteIdentity.shopUrl || "/products");
    expect(isExternalShop()).toBe(siteIdentity.shopUrl.startsWith("http"));
  });

  it("shows Blog in the footer but not in the top menu", () => {
    const shell = fs.readFileSync(path.join(projectRoot, "client", "src", "components", "SiteShell.tsx"), "utf8");
    const navigationLine = shell.split("\n").find((line) => line.startsWith("const navigation = ")) ?? "";
    expect(navigationLine).not.toContain('"/blog"');
    expect(shell).toContain('<Link href="/blog">Blog</Link>');
  });

  it("marks JavaScript availability so reveal animations never hide content from crawlers", () => {
    const html = fs.readFileSync(path.join(projectRoot, "client", "index.html"), "utf8");
    expect(html).toContain('document.documentElement.classList.add("js")');
    expect(html).toContain('classList.add("reveal-late")');
    const effects = fs.readFileSync(path.join(projectRoot, "client", "src", "styles", "effects.css"), "utf8");
    expect(effects).toContain("html.reveal-late .reveal");
    expect(effects).toContain("html.js .reveal {");
    expect(effects).toContain("prefers-reduced-motion");
  });
});
