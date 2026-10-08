#!/usr/bin/env node
/**
 * Responsive image generator for the HIPA Masala site.
 *
 * Generates right-sized WebP variants of every content image under
 * client/public/assets/img/ and writes client/src/lib/imageManifest.ts, which
 * <ResponsiveImage> uses to emit srcset/sizes/width/height.
 *
 * Variant widths are derived from the measured rendered sizes of each image
 * slot (card, catalogue, product hero, carousel, blog cover…) at 1x–3x DPR, so
 * browsers never download a 1500px file for a 130px slot.
 *
 * The generated files are committed, so the production build does NOT need
 * sharp. Re-run only when source images change:
 *
 *   npx --yes -p sharp@0.34 node scripts/optimize-images.mjs
 *
 * Originals in client/public/assets/ are left untouched (they remain the
 * og:image / structured-data URLs and a safe fallback).
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require("sharp");
} catch {
  try {
    sharp = require(process.env.SHARP_PATH || "sharp");
  } catch {
    console.error("sharp is required: npx --yes -p sharp@0.34 node scripts/optimize-images.mjs");
    process.exit(1);
  }
}

import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = path.join(root, "client/public/assets");
const outDir = path.join(assetsDir, "img");
const manifestPath = path.join(root, "client/src/lib/imageManifest.generated.ts");

// Width sets per image role (CSS px × DPR, capped at the source width).
const ROLE_WIDTHS = {
  // product packs: cards (~130px wide), catalogue (~150px), product hero (~190px), home carousel (~235px)
  // (finer steps so 1.75x/2.625x DPR phones get a close fit, not the next size up)
  pack: [160, 200, 256, 280, 320, 420, 480, 600, 720],
  // full-bleed hero photograph
  heroPhoto: [960, 1440],
  // editorial photo: 320–720px wide
  editorial: [480, 720, 960],
  // blog covers: 305–391px cards, up to 776px article header
  blogCover: [400, 600, 700, 800, 1280],
  logo: [48, 96, 144],
};

const PRODUCT_IMAGES = [
  // One transparent pack shot per product (uniform 2:3 canvas) feeds every slot: cards, catalogue,
  // product hero and the home carousel. Sources are the owner's October 2026 pack photos.
  "pack-sambar-powder.webp",
  "pack-rasam-powder.webp",
  "pack-turmeric-powder.webp",
  "pack-red-chilli-powder.webp",
  "pack-coriander-powder.webp",
  "pack-cumin-powder.webp",
  "pack-pepper-powder.webp",
  "pack-garam-masala.webp",
];
const BLOG_COVERS = [
  "best-masala-manufacturer-in-chennai.webp",
  "masala-manufacturer-vs-supplier-vs-distributor.webp",
  "masala-supplier-supermarkets-chennai-cover.jpg",
  "how-to-store-indian-spice-powders.jpg",
  "hipa-original-good-spice-cover-web_caaa742d.webp",
  "hipa-original-supplier-cost-cover-web_493aea4d.webp",
  "hipa-original-lunch-box-cover-web_d0df26a5.webp",
  "hipa-original-spice-quality-cover-web_966bae04.webp",
  "hipa-original-garam-masala-cover-web_977e210e.webp",
  "hipa-original-spice-label-cover-web_458a4d2d.webp",
  "hipa-original-sambar-blog-cover-web_727590c6.webp",
  // un-hashed duplicates may still be referenced by Google Sheets blog rows
  "hipa-original-good-spice-cover-web.webp",
  "hipa-original-supplier-cost-cover-web.webp",
  "hipa-original-lunch-box-cover-web.webp",
  "hipa-original-spice-quality-cover-web.webp",
  "hipa-original-garam-masala-cover-web.webp",
  "hipa-original-spice-label-cover-web.webp",
  "hipa-original-sambar-blog-cover-web.webp",
];

const JOBS = [
  ...PRODUCT_IMAGES.map((file) => ({ file, role: "pack", quality: 84 })),
  // The hero poster (first frame of the background video) is the LCP element, so it also gets an AVIF set.
  { file: "hero-video-poster_e92afce6.webp", role: "heroPhoto", quality: 76, mobileCrop: true, avifQuality: 50 },
  { file: "story-spice-mortar_d4ded661.jpg", role: "editorial", quality: 78 },
  ...BLOG_COVERS.map((file) => ({ file, role: "blogCover", quality: 78 })),
  { file: "logo_a24808ac.png", role: "logo", quality: 90 },
];

// Mobile art-direction crop of the hero photo. Below 900px the hero is a tall
// single column and `object-fit: cover; object-position: center` only ever shows
// the central strip of the 16:9 photo, so we ship just that strip at native
// resolution — pixel-identical on screen, ~40% of the bytes.
const HERO_MOBILE_CROP_WIDTH = 720;

fs.mkdirSync(outDir, { recursive: true });

const manifest = {};
let before = 0;
let after = 0;

for (const job of JOBS) {
  const input = path.join(assetsDir, job.file);
  if (!fs.existsSync(input)) {
    console.warn("missing", job.file);
    continue;
  }
  const meta = await sharp(input).metadata();
  const base = job.file.replace(/\.(png|jpe?g|webp)$/i, "");
  const widths = [...new Set(ROLE_WIDTHS[job.role].map((w) => Math.min(w, meta.width)))].sort((a, b) => a - b);
  const variants = [];
  for (const w of widths) {
    const name = `${base}-${w}w.webp`;
    await sharp(input)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: job.quality, alphaQuality: 90, effort: 6, smartSubsample: true })
      .toFile(path.join(outDir, name));
    variants.push([w, `/assets/img/${name}`]);
    after += fs.statSync(path.join(outDir, name)).size;
  }
  before += fs.statSync(input).size;
  const entry = { width: meta.width, height: meta.height, srcset: variants };
  if (job.avifQuality) {
    entry.avifSrcset = [];
    for (const w of widths) {
      const name = `${base}-${w}w.avif`;
      await sharp(input).resize({ width: w, withoutEnlargement: true }).avif({ quality: job.avifQuality, effort: 6 }).toFile(path.join(outDir, name));
      entry.avifSrcset.push([w, `/assets/img/${name}`]);
    }
  }
  if (job.mobileCrop) {
    const cropW = Math.min(HERO_MOBILE_CROP_WIDTH, meta.width);
    const left = Math.round((meta.width - cropW) / 2);
    const name = `${base}-mobile-${cropW}w.webp`;
    await sharp(input)
      .extract({ left, top: 0, width: cropW, height: meta.height })
      .webp({ quality: job.quality, effort: 6, smartSubsample: true })
      .toFile(path.join(outDir, name));
    entry.mobile = { width: cropW, height: meta.height, src: `/assets/img/${name}` };
    if (job.avifQuality) {
      const avifName = name.replace(/\.webp$/, ".avif");
      await sharp(input)
        .extract({ left, top: 0, width: cropW, height: meta.height })
        .avif({ quality: job.avifQuality, effort: 6 })
        .toFile(path.join(outDir, avifName));
      entry.mobile.avifSrc = `/assets/img/${avifName}`;
    }
  }
  manifest[`/assets/${job.file}`] = entry;
  console.log(job.file.padEnd(58), `${meta.width}x${meta.height}`, "→", widths.join(","));
}

// Compact manifest (it ships in the client bundle): widths only; URLs are derived
// by client/src/lib/imageManifest.ts helpers as /assets/img/<base>-<w>w.<ext>.
const compact = Object.fromEntries(
  Object.entries(manifest).map(([src, e]) => [
    src,
    [e.width, e.height, e.srcset.map(([w]) => w), e.avifSrcset ? 1 : 0, e.mobile ? e.mobile.width : 0],
  ]),
);
const header = `// AUTO-GENERATED by scripts/optimize-images.mjs — do not edit by hand.
// Original /assets URL → [intrinsicWidth, intrinsicHeight, webpVariantWidths, hasAvif, mobileCropWidth]
`;
const body = `export type ImageManifestRow = readonly [number, number, readonly number[], 0 | 1, number];

export const imageManifest: Record<string, ImageManifestRow> = {
${Object.entries(compact).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join("\n")}
};
`;
fs.writeFileSync(manifestPath, header + "\n" + body);
console.log(`\n${Object.keys(manifest).length} images; originals ${(before / 1024).toFixed(0)} KiB → all variants ${(after / 1024).toFixed(0)} KiB`);
