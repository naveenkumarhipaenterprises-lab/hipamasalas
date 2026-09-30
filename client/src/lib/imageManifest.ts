import { imageManifest } from "./imageManifest.generated";

export type ResolvedImage = {
  width: number;
  height: number;
  /** WebP candidates, e.g. "/assets/img/x-160w.webp 160w, …" */
  srcSet: string;
  /** Smallest-sufficient default src (used by browsers without srcset support). */
  src: string;
  avifSrcSet?: string;
  mobile?: { width: number; height: number; src: string; avifSrc?: string };
};

const fileBase = (src: string) => src.replace(/^\/assets\//, "").replace(/\.(png|jpe?g|webp)$/i, "");

/**
 * Looks up the pre-generated responsive variants for an original /assets image.
 * Returns undefined for images that have no variants (external URLs, new uploads),
 * in which case callers should fall back to the original src.
 */
export function resolveImage(src: string | undefined | null): ResolvedImage | undefined {
  if (!src) return undefined;
  const path = src.replace(/^https?:\/\/(www\.)?hipamasalas\.com/, "");
  const row = imageManifest[path];
  if (!row) return undefined;
  const [width, height, widths, hasAvif, mobileWidth] = row;
  const base = fileBase(path);
  const url = (w: number, ext: string) => `/assets/img/${base}-${w}w.${ext}`;
  const set = (ext: string) => widths.map((w) => `${url(w, ext)} ${w}w`).join(", ");
  return {
    width,
    height,
    srcSet: set("webp"),
    src: url(widths[Math.min(1, widths.length - 1)], "webp"),
    avifSrcSet: hasAvif ? set("avif") : undefined,
    mobile: mobileWidth
      ? {
          width: mobileWidth,
          height,
          src: `/assets/img/${base}-mobile-${mobileWidth}w.webp`,
          avifSrc: hasAvif ? `/assets/img/${base}-mobile-${mobileWidth}w.avif` : undefined,
        }
      : undefined,
  };
}
