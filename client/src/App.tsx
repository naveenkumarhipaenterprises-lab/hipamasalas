import { HeadManager } from "@/components/HeadManager";
import { SiteShell } from "@/components/SiteShell";
import { HomePage } from "@/pages/HomePage";
import { readSecondaryPages } from "@/routes";
import { lazy, Suspense, useEffect, useState, type ComponentType } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Admin screens are private (noindex, password-gated) and never needed by visitors,
// so they are split out of the public bundle and rendered client-side only.
const AdminBlogPage = lazy(() => import("@/pages/AdminBlogPage").then((m) => ({ default: m.AdminBlogPage })));
const AdminProductAvailabilityPage = lazy(() => import("@/pages/AdminProductAvailabilityPage").then((m) => ({ default: m.AdminProductAvailabilityPage })));

function clientOnly(Page: ComponentType) {
  return function ClientOnlyPage() {
    // Same (empty) output on the server and the first client render → no hydration mismatch.
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted ? (
      <Suspense fallback={null}>
        <Page />
      </Suspense>
    ) : null;
  };
}

/** A page from the lazily loaded HipaPages chunk (see routes.ts). */
function secondary(name: "ProductsPage" | "AboutPage" | "ProductDetailPage" | "FaqPage" | "ContactPage" | "B2BEnquiriesPage" | "PrivacyPage" | "TermsOfServicePage" | "BlogPage" | "ArticlePage" | "NotFoundPage") {
  return function SecondaryPage() {
    const Page = readSecondaryPages()[name];
    return <Page />;
  };
}

const ProductsPage = secondary("ProductsPage");
const AboutPage = secondary("AboutPage");
const ProductDetailPage = secondary("ProductDetailPage");
const FaqPage = secondary("FaqPage");
const ContactPage = secondary("ContactPage");
const B2BEnquiriesPage = secondary("B2BEnquiriesPage");
const PrivacyPage = secondary("PrivacyPage");
const TermsOfServicePage = secondary("TermsOfServicePage");
const BlogPage = secondary("BlogPage");
const ArticlePage = secondary("ArticlePage");
const NotFoundPage = secondary("NotFoundPage");

const AdminBlogRoute = clientOnly(AdminBlogPage);
const AdminProductsRoute = clientOnly(AdminProductAvailabilityPage);

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    // Only suspends on a client-side navigation to a page whose chunk is not loaded yet.
    <Suspense fallback={null}>
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/products/:slug" component={ProductDetailPage} />
      <Route path="/faq" component={FaqPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/b2b-enquiries" component={B2BEnquiriesPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms-of-service" component={TermsOfServicePage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={ArticlePage} />
      <Route path="/admin" component={AdminBlogRoute} />
      <Route path="/admin/products" component={AdminProductsRoute} />
      <Route path="/404" component={NotFoundPage} />
      <Route component={NotFoundPage} />
    </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <HeadManager />
        {isAdminRoute ? <Router /> : <SiteShell><Router /></SiteShell>}
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
