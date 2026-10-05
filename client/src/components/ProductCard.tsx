import { Link } from "wouter";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { resolveImage } from "@/lib/imageManifest";
import { trpc } from "@/lib/trpc";
import type { products } from "@shared/hipaContent";

export function ProductAvailabilityLabel({ slug }: { slug: string }) {
  const availability = trpc.productAvailability.publicList.useQuery(undefined, { staleTime: 30_000, refetchOnWindowFocus: false });
  if (availability.isError) return <p className="product-availability checking">Available for Enquiry</p>;
  if (availability.isLoading && !availability.data) return <p className="product-availability checking">In Production</p>;
  const status = availability.data?.find((record) => record.productSlug === slug)?.status || "available";
  return <p className={`product-availability ${status}`}>{status === "available" ? "Active Product" : "Available on Request"}</p>;
}

/**
 * `sizes` for a pack shot that is height-constrained with object-fit: contain:
 * the rendered width is (slot height × aspect ratio), not the slot width.
 * `slots` = [[mediaQuery | null, slotHeightPx], …] in the same order as the CSS.
 */
export function packSizes(src: string, slots: Array<[string | null, number]>) {
  const meta = resolveImage(src);
  const ratio = meta ? meta.width / meta.height : 2 / 3;
  return slots.map(([media, height]) => `${media ? `${media} ` : ""}${Math.ceil(height * ratio)}px`).join(", ");
}

export function ProductCard({ product, compact = false }: { product: (typeof products)[number]; compact?: boolean }) {
  const src = product.image;
  return (
    <article className={`product-card ${compact ? "product-card-compact" : ""}`}>
      <Link href={`/products/${product.slug}`} className="product-media">
        {/* .product-media: 150px tall (8px padding) ≤560px, otherwise 220px (14px padding) */}
        <ResponsiveImage src={src} alt={product.imageAlt} sizes={packSizes(src, [["(max-width: 560px)", 134], [null, 192]])} />
      </Link>
      <h3 className="product-name">{product.name}</h3>
      {!compact && (
        <>
          <p className="product-card-short-desc">{product.shortDescription}</p>
          <ProductAvailabilityLabel slug={product.slug} />
          <Link href={`/products/${product.slug}`} className="btn btn-outline btn-sm">
            View Details <span className="arrow">→</span>
          </Link>
        </>
      )}
    </article>
  );
}
