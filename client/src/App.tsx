import { HeadManager } from "@/components/HeadManager";
import { SiteShell } from "@/components/SiteShell";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ArticlePage, B2BEnquiriesPage, BlogPage, ContactPage, FaqPage, HomePage, NotFoundPage, PrivacyPage, ProductDetailPage, ProductsPage } from "@/pages/HipaPages";
import { AdminBlogPage } from "@/pages/AdminBlogPage";
import { AdminProductAvailabilityPage } from "@/pages/AdminProductAvailabilityPage";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/products/:slug" component={ProductDetailPage} />
      <Route path="/faq" component={FaqPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/b2b-enquiries" component={B2BEnquiriesPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={ArticlePage} />
      <Route path="/admin" component={AdminBlogPage} />
      <Route path="/admin/products" component={AdminProductAvailabilityPage} />
      <Route path="/404" component={NotFoundPage} />
      <Route component={NotFoundPage} />
    </Switch>
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
        <TooltipProvider>
          <HeadManager />
          {isAdminRoute ? <Router /> : <SiteShell><Router /></SiteShell>}
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
