import { ArrowUp, Facebook, Instagram, MessageCircle, Phone, Search, ShoppingBag, Youtube } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { products, siteIdentity } from "@shared/hipaContent";
import { trackEvent } from "@/lib/analytics";
import { HipaChatWidget } from "./HipaChatWidget";
import { ResponsiveImage } from "./ResponsiveImage";
import { ComingSoonModal, openComingSoonModal } from "./ComingSoonModal";

const navigation = [
  ["Home", "/"],
  ["Products", "/products"],
  ["B2B", "/masala-manufacturer-in-chennai"],
  ["About", "/about"],
  ["FAQ", "/faq"],
  ["Blog", "/blog"],
  ["Contact", "/contact"],
] as const;

const footerProductOrder = [
  "sambar-powder",
  "rasam-powder",
  "turmeric-powder",
  "red-chilli-powder",
  "coriander-powder",
  "cumin-powder",
  "pepper-powder",
  "garam-masala",
] as const;

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [backToTopVisible, setBackToTopVisible] = useState(false);
  const [location] = useLocation();

  const closeMenu = () => {
    setMenuOpen(false);
    setProductsOpen(false);
  };

  const handleProductsNavigation = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth <= 900) {
      event.preventDefault();
      setProductsOpen((open) => !open);
      return;
    }
    closeMenu();
  };

  const matchedProducts = useMemo(
    () =>
      products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      ),
    [searchQuery]
  );

  const scrolledSentinel = useRef<HTMLDivElement>(null);
  const backToTopSentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        if (entry.target === scrolledSentinel.current) setHeaderScrolled(scrolledPast);
        else setBackToTopVisible(scrolledPast);
      }
    });
    if (scrolledSentinel.current) observer.observe(scrolledSentinel.current);
    if (backToTopSentinel.current) observer.observe(backToTopSentinel.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      document.querySelectorAll(".reveal, .reveal-stagger").forEach((element) => element.classList.add("in-view"));
      return;
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    const watch = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>(".reveal:not(.in-view), .reveal-stagger:not(.in-view)").forEach((element) => {
        const rect = element.getBoundingClientRect();
        const onScreen = rect.top < window.innerHeight && rect.bottom > 0;
        if (reduceMotion || onScreen) element.classList.add("in-view");
        else io.observe(element);
      });
    };
    watch(document);
    document.documentElement.classList.add("reveal-ready");
    document.documentElement.classList.remove("reveal-late");
    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.classList.contains("reveal") || node.classList.contains("reveal-stagger")) watch(node.parentNode ?? document);
          else watch(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  const isFirstLocation = useRef(true);
  useEffect(() => {
    if (isFirstLocation.current) {
      isFirstLocation.current = false;
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      const hash = window.location.hash.slice(1);
      const target = hash ? document.getElementById(decodeURIComponent(hash)) : null;
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location]);

  return (
    <div>
      <div className="scroll-progress" aria-hidden="true" />
      <div ref={scrolledSentinel} className="scroll-sentinel" style={{ top: 12 }} aria-hidden="true" />
      <div ref={backToTopSentinel} className="scroll-sentinel" style={{ top: 500 }} aria-hidden="true" />
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-bar-left">
            <a
              className="top-bar-link"
              href={siteIdentity.phoneHref}
              aria-label={`Call ${siteIdentity.phone}`}
              onClick={() => trackEvent("phone_click", { location: "topbar" })}
            >
              <Phone size={14} aria-hidden="true" />
              <span>{siteIdentity.phone}</span>
            </a>
            <a className="top-bar-link top-bar-link-email" href={`mailto:${siteIdentity.email}`}>
              <span>{siteIdentity.email}</span>
            </a>
          </div>
          <div className="top-bar-right">
            <button
              type="button"
              className="top-bar-shop-link"
              onClick={openComingSoonModal}
            >
              <ShoppingBag size={13} />
              <span>Shop Online</span>
              <span className="badge-coming-soon">Coming Soon</span>
            </button>
            <a href={siteIdentity.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook size={14} />
            </a>
            <a href={siteIdentity.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={14} />
            </a>
            <a href={siteIdentity.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
              <Youtube size={14} />
            </a>
          </div>
        </div>
      </div>

      <header className={`site-header ${headerScrolled ? "scrolled" : ""}`}>
        <div className="container header-inner">
          <Link href="/" className="brand" onClick={closeMenu}>
            <ResponsiveImage className="brand-logo-img" src={siteIdentity.logo} alt="" sizes="40px" loading="eager" />
            <span className="brand-text">
              <span className="brand-name">HIPA</span>
              <span className="brand-sub">Masala · Taste of Tradition</span>
            </span>
          </Link>

          <nav id="primary-navigation" className={`main-nav ${menuOpen ? "open" : ""}`} aria-label="Primary navigation">
            <ul>
              {navigation.map(([label, href]) => (
                <li
                  key={href}
                  className={label === "Products" ? `has-dropdown ${productsOpen ? "open" : ""}` : ""}
                >
                  <Link
                    href={href}
                    className={`${location === href ? "active" : ""}${
                      label === "Contact" ? " normal-contact-link" : ""
                    }`}
                    onClick={label === "Products" ? handleProductsNavigation : closeMenu}
                    aria-expanded={label === "Products" ? productsOpen : undefined}
                  >
                    {label}
                    {label === "Products" && (
                      <svg
                        className="product-nav-chevron"
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M1 1L5 5L9 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </Link>
                  {label === "Products" && (
                    <ul className="dropdown">
                      {products.map((product) => (
                        <li key={product.slug}>
                          <Link href={`/products/${product.slug}`} onClick={closeMenu}>
                            {product.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li className="nav-shop-now mobile-nav-shop-item">
                <button
                  type="button"
                  className="mobile-nav-shop-btn btn btn-gold"
                  onClick={() => {
                    closeMenu();
                    trackEvent("shop_now_click", { location: "menu" });
                    openComingSoonModal();
                  }}
                >
                  <ShoppingBag size={16} />
                  <span>Shop Now</span>
                </button>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <div className="product-search">
              <button
                className="icon-btn product-search-toggle"
                type="button"
                aria-label="Search products"
                aria-expanded={searchOpen}
                onClick={() => {
                  setSearchOpen((open) => !open);
                  setSearchQuery("");
                }}
              >
                <Search className="search-icon" />
              </button>
              {searchOpen && (
                <div className="header-search-results">
                  <label className="sr-only" htmlFor="header-product-search">
                    Search HIPA Masala products
                  </label>
                  <input
                    id="header-product-search"
                    autoFocus
                    value={searchQuery}
                    placeholder="Search products..."
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                  {matchedProducts.length ? (
                    matchedProducts.map((product) => (
                      <Link
                        key={product.slug}
                        href={`/products/${product.slug}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        {product.name}
                      </Link>
                    ))
                  ) : (
                    <p>No matching products</p>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              className="btn btn-gold btn-sm shop-now-btn btn-shop-header"
              aria-label="Shop Now"
              onClick={() => {
                trackEvent("shop_now_click", { location: "header" });
                openComingSoonModal();
              }}
            >
              <ShoppingBag aria-hidden="true" size={15} />
              <span>Shop Now</span>
            </button>

            <Link
              href="/contact#enquire"
              className="btn btn-primary btn-sm"
              data-analytics-event="enquiry_cta_click"
              onClick={() => trackEvent("enquiry_cta_click", { location: "header" })}
            >
              Enquire now
            </Link>

            <button
              className={`hamburger ${menuOpen ? "open" : ""}`}
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="primary-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <button className={`nav-overlay ${menuOpen ? "show" : ""}`} aria-label="Close menu" onClick={closeMenu} />

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand">
              <ResponsiveImage className="brand-logo-img" src={siteIdentity.logo} alt="" sizes="40px" />
              <span className="brand-text">
                <span className="brand-name">HIPA</span>
                <span className="brand-sub">Masala · Taste of Tradition</span>
              </span>
            </Link>
            <p>Current product information, B2B wholesale details and practical spice guides from HIPA Masala in Chennai.</p>
            <div className="social-row">
              <a href={siteIdentity.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href={siteIdentity.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href={siteIdentity.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
                <Youtube size={16} />
              </a>
              <a href={siteIdentity.whatsappHref} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h2 className="footer-heading">Explore</h2>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/products">Products</Link>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={openComingSoonModal}
                >
                  Online Store (Coming Soon)
                </button>
              </li>
              <li>
                <a href="/assets/hipa-masalas-brochure.pdf" download="HIPA-Masala-Brochure.pdf">
                  Download Brochure
                </a>
              </li>
              <li>
                <Link href="/masala-manufacturer-in-chennai">Masala Manufacturer in Chennai</Link>
              </li>
              <li>
                <Link href="/b2b-enquiries">B2B Enquiries</Link>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h2 className="footer-heading">Products</h2>
            <ul>
              {footerProductOrder
                .map((slug) => products.find((product) => product.slug === slug))
                .filter((product): product is (typeof products)[number] => Boolean(product))
                .map((product) => (
                  <li key={product.slug}>
                    <Link href={`/products/${product.slug}`}>{product.name}</Link>
                  </li>
                ))}
            </ul>
          </div>

          <div className="footer-col">
            <h2 className="footer-heading">Contact</h2>
            <ul className="footer-contact">
              <li>
                <a href={`mailto:${siteIdentity.email}`}>{siteIdentity.email}</a>
              </li>
              <li>
                <a href={siteIdentity.phoneHref} onClick={() => trackEvent("phone_click", { location: "footer" })}>
                  {siteIdentity.phone}
                </a>
              </li>
              <li>{siteIdentity.locationLabel}</li>
              <li>{siteIdentity.openingHours.label}</li>
              <li>FSSAI Lic. No. {siteIdentity.fssaiLicence}</li>
            </ul>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} HIPA Masala · HIPA Enterprises. All rights reserved.</span>
          <span>
            <a
              href="/assets/hipa-masalas-brochure.pdf"
              download="HIPA-Masala-Brochure.pdf"
              className="footer-admin-link"
            >
              Brochure
            </a>
            <span aria-hidden="true"> · </span>
            <Link className="footer-admin-link" href="/b2b-enquiries">
              B2B Orders
            </Link>
            <span aria-hidden="true"> · </span>
            <Link className="footer-admin-link" href="/about">
              About
            </Link>
            <span aria-hidden="true"> · </span>
            <Link className="footer-admin-link" href="/privacy">
              Privacy
            </Link>
            <span aria-hidden="true"> · </span>
            <Link className="footer-admin-link" href="/terms-of-service">
              Terms of Service
            </Link>
          </span>
        </div>
      </footer>

      <div className="floating-actions" aria-label="Quick contact">
        <a
          className="fab fab-call"
          href={siteIdentity.phoneHref}
          aria-label="Call HIPA Masala"
          onClick={() => trackEvent("phone_click", { location: "floating" })}
        >
          <Phone size={21} />
        </a>
        <a
          className="fab fab-whatsapp"
          href={siteIdentity.whatsappHref}
          aria-label="Chat with HIPA Masala on WhatsApp"
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent("whatsapp_click", { location: "floating" })}
        >
          <span className="fab-pulse" />
          <MessageCircle size={22} />
        </a>
        <HipaChatWidget />
      </div>

      <button
        className={`back-to-top ${backToTopVisible ? "show" : ""}`}
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp size={18} />
      </button>

      <ComingSoonModal />
    </div>
  );
}
