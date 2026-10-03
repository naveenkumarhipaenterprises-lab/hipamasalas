import type { ImgHTMLAttributes } from "react";
import { resolveImage } from "@/lib/imageManifest";

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "sizes" | "width" | "height"> & {
  src: string;
  alt: string;
  /** The image's rendered CSS width per breakpoint, e.g. "(max-width: 560px) 90px, 128px". */
  sizes: string;
  /** Above-the-fold images should pass priority; everything else lazy-loads. */
  priority?: boolean;
};

/**
 * <img> with right-sized WebP variants (srcset/sizes) and intrinsic width/height
 * so the browser reserves space before the file arrives (no layout shift).
 * CSS still controls the displayed size; width/height only provide the aspect ratio.
 * Falls back to the plain original src for images without generated variants.
 */
export function ResponsiveImage({ src, alt, sizes, priority = false, loading, decoding, fetchPriority, ...rest }: ResponsiveImageProps) {
  const resolved = resolveImage(src);
  return (
    <img
      {...rest}
      src={resolved?.src ?? src}
      srcSet={resolved?.srcSet}
      sizes={resolved ? sizes : undefined}
      width={resolved?.width}
      height={resolved?.height}
      alt={alt}
      loading={loading ?? (priority ? "eager" : "lazy")}
      decoding={decoding ?? "async"}
      fetchPriority={fetchPriority ?? (priority ? "high" : undefined)}
    />
  );
}
