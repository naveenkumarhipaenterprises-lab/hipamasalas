/**
 * Route-based code splitting that is safe for SSR + hydration.
 *
 * The homepage is bundled eagerly. All other public pages live in one lazily loaded chunk
 * (`pages/HipaPages`). Hydration must reproduce the server HTML synchronously, so:
 *   - the server awaits `loadSecondaryPages()` before rendering (entry-server.tsx);
 *   - the browser awaits it *before* `hydrateRoot` when the URL is not the homepage
 *     (entry-client.tsx);
 *   - client-side navigations from the homepage suspend briefly while the chunk loads, and the
 *     chunk is prefetched when the browser is idle so that is normally instant.
 */
type SecondaryPages = typeof import("./pages/HipaPages");

let secondaryPages: SecondaryPages | undefined;
let pending: Promise<SecondaryPages> | undefined;

export function loadSecondaryPages(): Promise<SecondaryPages> {
  if (secondaryPages) return Promise.resolve(secondaryPages);
  pending ??= import("./pages/HipaPages").then(
    (module) => (secondaryPages = module),
    (error) => {
      pending = undefined; // allow a retry on the next render/navigation
      throw error;
    },
  );
  return pending;
}

/** Returns the loaded module, or throws the pending load so the nearest <Suspense> waits for it. */
export function readSecondaryPages(): SecondaryPages {
  if (secondaryPages) return secondaryPages;
  throw loadSecondaryPages();
}

export const isHomePath = (pathname: string) => pathname === "/" || pathname === "";
