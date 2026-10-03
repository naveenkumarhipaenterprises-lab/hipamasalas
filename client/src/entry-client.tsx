import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from "@shared/const";
import { HydrationBoundary, QueryClient, QueryClientProvider, type DehydratedState } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { hydrateRoot } from "react-dom/client";
import superjson from "superjson";
import { Router } from "wouter";
import App from "./App";
import { isHomePath, loadSecondaryPages } from "./routes";
import { startLogin } from "./const";
// One bundled stylesheet: fonts → base site styles → page styles (same cascade order as before).
import "./styles/fonts.css";
import "./styles/site-base.css";
import "./index.css";
import "./contact-navigation.css";

declare global {
  interface Window {
    __RQ_STATE__?: unknown;
    umami?: { track?: (eventName: string, data?: Record<string, unknown>) => void };
  }
}

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } });

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError) || typeof window === "undefined") return;
  if (error.message === UNAUTHED_ERR_MSG) startLogin();
};

queryClient.getQueryCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") redirectToLoginIfUnauthorized(event.query.state.error);
});

queryClient.getMutationCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") redirectToLoginIfUnauthorized(event.mutation.state.error);
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, { ...(init ?? {}), credentials: "include" });
      },
    }),
  ],
});

const dehydratedState = (window.__RQ_STATE__ ? superjson.deserialize(window.__RQ_STATE__ as any) : undefined) as DehydratedState | undefined;

function hydrate() {
  hydrateRoot(
    document.getElementById("root")!,
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          <Router>
            <App />
          </Router>
        </HydrationBoundary>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

if (isHomePath(window.location.pathname)) {
  hydrate();
  // Warm the other pages' chunk once the homepage is idle so client-side navigation is instant.
  const prefetch = () => void loadSecondaryPages();
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(prefetch, { timeout: 4000 });
  else setTimeout(prefetch, 2000);
} else {
  // The server rendered a page from the lazy chunk: load it first so hydration matches exactly.
  loadSecondaryPages().then(hydrate, hydrate);
}
