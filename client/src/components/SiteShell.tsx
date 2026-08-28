import { ArrowUp, Facebook, Instagram, MessageCircle, Phone, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { products, siteIdentity } from "@shared/hipaContent";
import { trackEvent } from "@/lib/analytics";
import { SiteChatWidget } from "./SiteChatWidget";

const navigation = [["Home", "/"], ["Products", "/products"], ["About", "/about"], ["Blog", "/blog"], ["FAQ", "/faq"], ["Contact", "/contact"]] as const;
const footerProductOrder = ["sambar-powder", "rasam-powder", "turmeric-powder", "red-chilli-powder", "coriander-powder", "cumin-powder", "pepper-powder", "garam-masala"] as const;

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [backToTopVisible, setBackToTopVisible] = useState(false);
  const [location] = useLocation();
  const closeMenu = () => { setMenuOpen(false); setProductsOpen(false); };
  const handleProductsNavigation = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth <= 900) { event.preventDefault(); setProductsOpen((open) => !open); return; }
    closeMenu();
  };
  const matchedProducts = useMemo(() => products.filter((product) => product.name.toLowerCase().includes(searchQuery.trim().toLowerCase())), [searchQuery]);

  useEffect(() => {
    const onScroll = () => { setHeaderScrolled(window.scrollY > 12); setBackToTopVisible(window.scrollY > 500); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
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

  return <div>
    <div className="top-bar"><div className="container top-bar-inner"><div className="top-bar-left"><a className="top-bar-link" href={siteIdentity.phoneHref} onClick={() => trackEvent("phone_click", { location: "topbar" })}><Phone size={14} /><span>{siteIdentity.phone}</span></a><a className="top-bar-link" href={`mailto:${siteIdentity.email}`}><span>{siteIdentity.email}</span></a></div><div className="top-bar-right"><a href={siteIdentity.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={14} /></a><a href={siteIdentity.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={14} /></a></div></div></div>
    <header className={`site-header ${headerScrolled ? "scrolled" : ""}`}><div className="container header-inner">
      <Link href="/" className="brand" onClick={closeMenu} aria-label="HIPA Masalas home"><img className="brand-logo-img" src={siteIdentity.logo} alt="HIPA Masalas official logo" /><span className="brand-text"><span className="brand-name">HIPA</span><span className="brand-sub">Masalas · Taste of Tradition</span></span></Link>
      <nav className={`main-nav ${menuOpen ? "open" : ""}`} aria-label="Primary navigation"><ul>{navigation.map(([label, href]) => <li key={href} className={label === "Products" ? `has-dropdown ${productsOpen ? "open" : ""}` : ""}><Link href={href} className={`${location === href ? "active" : ""}${label === "Contact" ? " normal-contact-link" : ""}`} onClick={label === "Products" ? handleProductsNavigation : closeMenu} aria-expanded={label === "Products" ? productsOpen : undefined}>{label}{label === "Products" && <svg className="product-nav-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}</Link>{label === "Products" && <ul className="dropdown">{products.map((product) => <li key={product.slug}><Link href={`/products/${product.slug}`} onClick={closeMenu}>{product.name}</Link></li>)}</ul>}</li>)}</ul></nav>
      <div className="header-actions"><div className="product-search"><button className="icon-btn product-search-toggle" type="button" aria-label="Search products" aria-expanded={searchOpen} onClick={() => { setSearchOpen((open) => !open); setSearchQuery(""); }}><Search className="search-icon" /></button>{searchOpen && <div className="header-search-results"><label className="sr-only" htmlFor="header-product-search">Search HIPA Masalas products</label><input id="header-product-search" autoFocus value={searchQuery} placeholder="Search products..." onChange={(event) => setSearchQuery(event.target.value)} />{matchedProducts.length ? matchedProducts.map((product) => <Link key={product.slug} href={`/products/${product.slug}`} onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>{product.name}</Link>) : <p>No matching products</p>}</div>}</div><Link href="/contact#enquire" className="btn btn-primary btn-sm" data-analytics-event="enquiry_cta_click" onClick={() => trackEvent("enquiry_cta_click", { location: "header" })}>Enquire now</Link><button className={`hamburger ${menuOpen ? "open" : ""}`} type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen((open) => !open)}><span /><span /><span /></button></div>
    </div></header>
    <button className={`nav-overlay ${menuOpen ? "show" : ""}`} aria-label="Close menu" onClick={closeMenu} />
    <main>{children}</main>
    <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><Link href="/" className="brand"><img className="brand-logo-img" src={siteIdentity.logo} alt="HIPA Masalas official logo" /><span className="brand-text"><span className="brand-name">HIPA</span><span className="brand-sub">Masalas · Taste of Tradition</span></span></Link><p>Current product information and practical spice guides from HIPA Masalas in Chennai.</p><div className="social-row"><a href={siteIdentity.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={16} /></a><a href={siteIdentity.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={16} /></a><a href={siteIdentity.whatsappHref} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={16} /></a></div></div><div className="footer-col"><h5>Explore</h5><ul><li><Link href="/">Home</Link></li><li><Link href="/products">Products</Link></li><li><Link href="/about">About</Link></li><li><Link href="/blog">Blog</Link></li><li><Link href="/contact">Contact</Link></li></ul></div><div className="footer-col"><h5>Products</h5><ul>{footerProductOrder.map((slug) => products.find((product) => product.slug === slug)).filter((product): product is (typeof products)[number] => Boolean(product)).map((product) => <li key={product.slug}><Link href={`/products/${product.slug}`}>{product.name}</Link></li>)}</ul></div><div className="footer-col"><h5>Contact</h5><ul className="footer-contact"><li><a href={`mailto:${siteIdentity.email}`}>{siteIdentity.email}</a></li><li><a href={siteIdentity.phoneHref} onClick={() => trackEvent("phone_click", { location: "footer" })}>{siteIdentity.phone}</a></li><li>{siteIdentity.locationLabel}</li></ul></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} HIPA Masalas. All rights reserved.</span><span><Link className="footer-admin-link" href="/about">About</Link><span aria-hidden="true"> · </span><Link className="footer-admin-link" href="/privacy">Privacy</Link><span aria-hidden="true"> · </span><Link className="footer-admin-link" href="/terms-of-service">Terms of Service</Link></span></div></footer>
    <div className="floating-actions" aria-label="Quick contact"><a className="fab fab-call" href={siteIdentity.phoneHref} aria-label="Call HIPA Masalas" onClick={() => trackEvent("phone_click", { location: "floating" })}><Phone size={21} /></a><a className="fab fab-whatsapp" href={siteIdentity.whatsappHref} aria-label="Chat with HIPA Masalas on WhatsApp" target="_blank" rel="noreferrer" onClick={() => trackEvent("whatsapp_click", { location: "floating" })}><span className="fab-pulse" /><MessageCircle size={22} /></a><SiteChatWidget /></div>
    <button className={`back-to-top ${backToTopVisible ? "show" : ""}`} type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><ArrowUp size={18} /></button>
  </div>;
}
