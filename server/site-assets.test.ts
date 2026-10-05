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

describe("home page background video", () => {
  const publicDir = path.join(projectRoot, "client", "public");
  const home = fs.readFileSync(path.join(projectRoot, "client", "src", "pages", "HomePage.tsx"), "utf8");

  it("ships light, streamable, silent video files", () => {
    const { desktop, mobile, desktopWebm, mobileWebm } = siteIdentity.heroVideo;
    for (const src of [desktop, mobile, desktopWebm, mobileWebm]) {
      const file = path.join(publicDir, src);
      expect(fs.existsSync(file), src).toBe(true);
      // Budget: the owner's 33 MB original must never be committed as is.
      expect(fs.statSync(file).size, src).toBeLessThan(3 * 1024 * 1024);
      // WebM (EBML) header for the fallback copies.
      if (src.endsWith(".webm")) expect(fs.readFileSync(file).subarray(0, 4).toString("hex"), src).toBe("1a45dfa3");
    }
    for (const src of [desktop, mobile]) {
      const bytes = fs.readFileSync(path.join(publicDir, src));
      expect(bytes.subarray(4, 8).toString("latin1"), src).toBe("ftyp");
      // "faststart": the index (moov) comes before the media (mdat) so playback starts while downloading.
      expect(bytes.indexOf("moov"), src).toBeLessThan(bytes.indexOf("mdat"));
      // No sound track: the video is decorative and plays muted.
      expect(bytes.includes("soun"), src).toBe(false);
    }
  });

  it("uses the video's first frame as the hero image and drops the old photo", () => {
    expect(siteIdentity.heroImage).toMatch(/^\/assets\/hero-video-poster_[0-9a-f]{8}\.webp$/);
    const row = imageManifest[siteIdentity.heroImage];
    expect(row, "poster missing from the image manifest").toBeDefined();
    expect(row[3], "poster AVIF set").toBe(1);
    expect(row[4], "poster mobile crop").toBeGreaterThan(0);
    expect(fs.existsSync(path.join(publicDir, "assets", "hero-spices_8241cadf.webp"))).toBe(false);
    expect(Object.keys(imageManifest).some((key) => key.includes("hero-spices"))).toBe(false);
  });

  it("plays muted and inline, loads after the page, and can be paused", () => {
    expect(home).toMatch(/<video[\s\S]*?muted[\s\S]*?loop[\s\S]*?playsInline[\s\S]*?preload="none"/);
    expect(home).toContain("video.muted = true");
    expect(home).toContain('window.addEventListener("load", start, { once: true })');
    expect(home).toContain("prefers-reduced-motion: reduce");
    expect(home).toContain('"Pause background video"');
    expect(home).not.toMatch(/<video[^>]*\bautoPlay\b/);
  });

  it("caches the video files for a year", () => {
    const vercel = JSON.parse(fs.readFileSync(path.join(projectRoot, "vercel.json"), "utf8"));
    const rule = vercel.headers.find((entry: { source: string }) => entry.source === "/assets/video/(.*)");
    expect(rule?.headers?.[0]?.value).toContain("immutable");
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
