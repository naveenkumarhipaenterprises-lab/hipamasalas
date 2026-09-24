import { ArrowRight, Building2, Check, ChevronDown, ChevronLeft, ChevronRight, Clock, Download, FileText, Heart, HelpCircle, Info, Leaf, Mail, MapPin, Package, Phone, ShieldCheck, Sparkles, Store, Truck, Utensils, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useRoute } from "wouter";
import { EnquiryForm } from "@/components/EnquiryForm";
import { NewsletterForm } from "@/components/NewsletterForm";
import { faqs, getProduct, getProductFaqs, products, siteIdentity } from "@shared/hipaContent";
import { trackEvent } from "@/lib/analytics";
import { trpc } from "@/lib/trpc";

type ArticleResource = {
  href: string;
  label: string;
  detail: string;
};

const articleResourcesBySlug: Record<string, ArticleResource[]> = {
  "best-masala-manufacturer-in-chennai": [
    { href: "/products", label: "Browse HIPA Masala Product Range", detail: "Explore all pure spice powders and traditional South Indian blends." },
    { href: "/b2b-enquiries", label: "Submit B2B Enquiry", detail: "Connect with our team for bulk, restaurant, and distribution terms." },
    { href: "/contact", label: "Contact HIPA Masala", detail: "Reach out to our Chennai office via phone, email, or WhatsApp." },
  ],
  "how-to-choose-a-masala-manufacturer-in-chennai-for-your-business": [
    { href: "/products", label: "Browse HIPA Masala Product Range", detail: "Explore all pure spice powders and traditional South Indian blends." },
    { href: "/b2b-enquiries", label: "Submit B2B Enquiry", detail: "Connect with our team for retail, food-service, and institutional packs." },
    { href: "/about", label: "About HIPA Masala", detail: "Learn more about our spice processing approach and heritage." },
  ],
  "what-makes-a-good-masala-manufacturer-8-things-buyers-should-check": [
    { href: "/products", label: "Explore HIPA Masala Products", detail: "View complete specifications for single spices and South Indian blends." },
    { href: "/b2b-enquiries", label: "B2B & Distribution Enquiries", detail: "Discuss custom order volumes and sample kits for your business." },
    { href: "/faq", label: "Read HIPA Masala FAQs", detail: "Answers regarding batch consistency, shelf life, and packaging formats." },
  ],
  "masala-manufacturer-vs-supplier-vs-distributor": [
    { href: "/products", label: "Browse HIPA Masala Range", detail: "Review our single spice powders and authentic blends." },
    { href: "/b2b-enquiries", label: "B2B Trade & Dealership Enquiries", detail: "Enquire for direct manufacturer supply, wholesale, and distribution." },
    { href: "/contact", label: "Contact HIPA Masala Chennai", detail: "Reach our Pallavaram, Chennai office directly." },
  ],
  "masala-manufacturer-for-restaurants-retailers-chennai": [
    { href: "/products", label: "Explore Products for Food Businesses", detail: "Review household, 500g, and 1kg institutional packs." },
    { href: "/b2b-enquiries", label: "Restaurant & Retailer Enquiries", detail: "Get in touch for commercial samples and wholesale rates." },
    { href: "/about", label: "About HIPA Masala", detail: "Read about our authentic South Indian spice processing approach." },
  ],
  "how-to-choose-sambar-powder": [
    { href: "/products/sambar-powder", label: "Explore Sambar Powder", detail: "View the complete HIPA Sambar Powder specifications and culinary uses." },
    { href: "/products", label: "Browse all HIPA products", detail: "Compare the available HIPA Masala range for everyday cooking." },
    { href: "/contact#enquire", label: "Contact HIPA for product details", detail: "Ask for further pack or product information." },
  ],
  "how-to-read-a-spice-powder-label": [
    { href: "/products", label: "Browse HIPA Masala products", detail: "Explore the current HIPA product range." },
    { href: "/faq", label: "Read product questions and answers", detail: "Review the current HIPA product-information FAQ." },
    { href: "/contact#enquire", label: "Contact HIPA for product details", detail: "Ask for further pack or product information." },
  ],
  "garam-masala-vs-other-indian-masalas": [
    { href: "/products/garam-masala", label: "Explore Garam Masala", detail: "View the complete HIPA Garam Masala specifications and culinary uses." },
    { href: "/products/sambar-powder", label: "Explore Sambar Powder", detail: "Compare a product intended for sambar-style dishes." },
    { href: "/products/rasam-powder", label: "Explore Rasam Powder", detail: "Compare a product intended for rasam-style dishes." },
  ],
  "how-spice-quality-affects-food-taste": [
    { href: "/products", label: "Browse HIPA Masala products", detail: "Explore the current HIPA product range." },
    { href: "/faq", label: "Read product questions and answers", detail: "Review the current HIPA product-information FAQ." },
    { href: "/contact#enquire", label: "Contact HIPA for product details", detail: "Ask for further pack or product information." },
  ],
  "south-indian-lunch-box-recipes": [
    { href: "/products/sambar-powder", label: "Explore Sambar Powder", detail: "View the complete HIPA Sambar Powder specifications." },
    { href: "/products/rasam-powder", label: "Explore Rasam Powder", detail: "View the complete HIPA Rasam Powder specifications." },
    { href: "/products", label: "Browse all HIPA products", detail: "Explore the available HIPA Masala range." },
  ],
  "true-cost-of-your-spice-supplier": [
    { href: "/products", label: "Browse HIPA Masala products", detail: "Explore the current HIPA product range." },
    { href: "/faq", label: "Read product questions and answers", detail: "Review the current HIPA product-information FAQ." },
    { href: "/contact#enquire", label: "Contact HIPA for product details", detail: "Ask for further product or pack information." },
  ],
  "what-makes-a-good-spice-powder": [
    { href: "/products", label: "Browse HIPA Masala products", detail: "Explore the current HIPA product range." },
    { href: "/faq", label: "Read product questions and answers", detail: "Review the current HIPA product-information FAQ." },
    { href: "/contact#enquire", label: "Contact HIPA for product details", detail: "Ask for further pack or product information." },
  ],
  "masala-supplier-for-supermarkets-in-chennai": [
    { href: "/products", label: "Browse HIPA Masala products", detail: "Explore the current HIPA retail and bulk product range." },
    { href: "/b2b-enquiries", label: "Contact HIPA for wholesale & retail inquiries", detail: "Connect with our team for supermarket sample kits and distributor terms." },
    { href: "/faq", label: "Read HIPA FAQs", detail: "Review answers regarding shelf-life, batch consistency, and certification." },
  ],
};

const articleInlineLinksBySlug: Record<string, ArticleResource[]> = {
  "how-to-choose-sambar-powder": [
    { href: "/blog/how-spice-quality-affects-food-taste", label: "how spice quality affects food taste and consistency", detail: "Learn how quality-related factors can change flavour results." },
    { href: "/blog/how-to-read-a-spice-powder-label", label: "how to read a spice powder label", detail: "Use practical label checks when comparing packs." },
    { href: "/blog/what-makes-a-good-spice-powder", label: "what makes a good spice powder", detail: "Review broader everyday buying checks." },
  ],
  "how-to-read-a-spice-powder-label": [
    { href: "/blog/what-makes-a-good-spice-powder", label: "what makes a good spice powder", detail: "Review broader everyday buying checks." },
    { href: "/blog/how-spice-quality-affects-food-taste", label: "how spice quality affects food taste and consistency", detail: "Understand why practical comparisons matter." },
    { href: "/blog/how-to-choose-sambar-powder", label: "how to choose sambar powder for everyday cooking", detail: "Apply the checks to a familiar masala blend." },
  ],
  "garam-masala-vs-other-indian-masalas": [
    { href: "/blog/how-to-read-a-spice-powder-label", label: "how to read a spice powder label", detail: "Check the product information before choosing a powder." },
    { href: "/blog/what-makes-a-good-spice-powder", label: "what makes a good spice powder", detail: "Review general selection factors." },
    { href: "/blog/how-spice-quality-affects-food-taste", label: "how spice quality affects food taste and consistency", detail: "Learn how practical quality factors affect cooking." },
  ],
  "how-spice-quality-affects-food-taste": [
    { href: "/blog/what-makes-a-good-spice-powder", label: "what makes a good spice powder", detail: "Review everyday buying checks." },
    { href: "/blog/how-to-read-a-spice-powder-label", label: "how to read a spice powder label", detail: "Use the visible pack information when comparing options." },
    { href: "/blog/true-cost-of-your-spice-supplier", label: "how to compare spice-supplier information", detail: "Read practical questions for supplier comparisons." },
  ],
  "south-indian-lunch-box-recipes": [
    { href: "/blog/how-to-choose-sambar-powder", label: "how to choose sambar powder for everyday cooking", detail: "Choose a blend that suits the dish you plan to cook." },
    { href: "/blog/how-to-read-a-spice-powder-label", label: "how to read a spice powder label", detail: "Use label details when selecting a pack." },
    { href: "/blog/how-spice-quality-affects-food-taste", label: "how spice quality affects food taste and consistency", detail: "Understand the role of flavour and consistency." },
  ],
  "true-cost-of-your-spice-supplier": [
    { href: "/blog/how-spice-quality-affects-food-taste", label: "how spice quality affects food taste and consistency", detail: "Consider the cooking implications of quality comparisons." },
    { href: "/blog/what-makes-a-good-spice-powder", label: "what makes a good spice powder", detail: "Use practical evaluation factors when comparing options." },
    { href: "/blog/how-to-read-a-spice-powder-label", label: "how to read a spice powder label", detail: "Review the product information available on the pack." },
  ],
  "what-makes-a-good-spice-powder": [
    { href: "/blog/how-to-read-a-spice-powder-label", label: "how to read a spice powder label", detail: "Use the label as one source of product information." },
    { href: "/blog/how-spice-quality-affects-food-taste", label: "how spice quality affects food taste and consistency", detail: "See how everyday quality factors affect cooking." },
    { href: "/blog/true-cost-of-your-spice-supplier", label: "questions to compare spice-supplier information", detail: "Read broader supplier-comparison guidance." },
  ],
};

type ArticleBlock =
  | { type: "heading"; content: string }
  | { type: "subheading"; content: string }
  | { type: "blockquote"; content: string }
  | { type: "list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "paragraph"; content: string };

function getArticleBlocks(body: string): ArticleBlock[] {
  return body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (block.startsWith("### ")) {
        return { type: "subheading" as const, content: block.slice(4).trim() };
      }
      if (block.startsWith("## ")) {
        return { type: "heading" as const, content: block.slice(3).trim() };
      }
      if (block.startsWith(">")) {
        return { type: "blockquote" as const, content: block.replace(/^>\s*/gm, "").trim() };
      }
      if (block.startsWith("|") && block.includes("\n|")) {
        const lines = block.split("\n").map((l) => l.trim()).filter((l) => l.startsWith("|"));
        if (lines.length >= 2) {
          const headers = lines[0].split("|").slice(1, -1).map((c) => c.trim());
          const rows = lines.slice(2).map((l) => l.split("|").slice(1, -1).map((c) => c.trim()));
          return { type: "table" as const, headers, rows };
        }
      }
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length > 0 && lines.every((l) => l.startsWith("- ") || l.startsWith("* "))) {
        return { type: "list" as const, items: lines.map((l) => l.replace(/^[-*]\s+/, "")) };
      }
      if (lines.length > 0 && lines.every((l) => /^\d+\.\s+/.test(l))) {
        return { type: "ordered-list" as const, items: lines.map((l) => l.replace(/^\d+\.\s+/, "")) };
      }
      return { type: "paragraph" as const, content: block };
    });
}

function renderArticleInlineLinks(content: string, resources: ArticleResource[]) {
  const linkPattern = /(?:\[\[([^\]|]+)\|([^\]]+)\]\]|\[([^\]]+)\]\(([^)]+)\))/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const renderTextWithBold = (text: string, keyPrefix: string): React.ReactNode => {
    if (!text.includes("**")) return text;
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={`${keyPrefix}-b-${i}`}>{part.slice(2, -2)}</strong>
      ) : (
        part
      )
    );
  };

  while ((match = linkPattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(renderTextWithBold(content.slice(lastIndex, match.index), `txt-${lastIndex}`));
    }
    const label = match[1]?.trim() || match[3]?.trim() || "";
    let rawHref = match[2]?.trim() || match[4]?.trim() || "";
    let href = rawHref.replace(/^https?:\/\/(www\.)?hipamasalas\.com/, "");
    if (!href.startsWith("/") && !href.startsWith("http")) href = `/${href}`;

    nodes.push(
      label ? (
        href.startsWith("/") ? (
          <Link href={href} key={`${href}-${match.index}`}>
            {renderTextWithBold(label, `lnk-${match.index}`)}
          </Link>
        ) : (
          <a href={href} target="_blank" rel="noreferrer" key={`${href}-${match.index}`}>
            {renderTextWithBold(label, `lnk-${match.index}`)}
          </a>
        )
      ) : (
        match[0]
      )
    );
    lastIndex = linkPattern.lastIndex;
  }

  if (lastIndex < content.length) {
    nodes.push(renderTextWithBold(content.slice(lastIndex), `txt-${lastIndex}`));
  }
  return nodes.length ? nodes : renderTextWithBold(content, "root");
}

function Breadcrumbs({ current, parent }: { current: string; parent?: { label: string; href: string } }) {
  return (
    <nav className="replica-breadcrumb" aria-label="Breadcrumb">
      <div className="container">
        <Link href="/">Home</Link>
        <span>/</span>
        {parent && (
          <>
            <Link href={parent.href}>{parent.label}</Link>
            <span>/</span>
          </>
        )}
        <strong>{current}</strong>
      </div>
    </nav>
  );
}

function ProductAvailabilityLabel({ slug }: { slug: string }) {
  const availability = trpc.productAvailability.publicList.useQuery(undefined, { staleTime: 30_000, refetchOnWindowFocus: false });
  if (availability.isError) return <p className="product-availability checking">Available for Enquiry</p>;
  if (availability.isLoading && !availability.data) return <p className="product-availability checking">In Production</p>;
  const status = availability.data?.find((record) => record.productSlug === slug)?.status || "available";
  return <p className={`product-availability ${status}`}>{status === "available" ? "Active Product" : "Available on Request"}</p>;
}

function ProductCard({ product, compact = false }: { product: (typeof products)[number]; compact?: boolean }) {
  const sourceCollectionAssets: Record<string, string> = {
    "sambar-powder": "/assets/sambar-collection_1befbb00.webp",
    "rasam-powder": "/assets/rasam-collection_9ee665cf.webp",
    "garam-masala": "/assets/garam-collection_bf93a09b.webp",
    "coriander-powder": "/assets/coriander-collection_65f09b3e.webp",
    "pepper-powder": "/assets/pepper-collection_62ecec6f.webp",
  };
  return (
    <article className={`product-card ${compact ? "product-card-compact" : ""}`}>
      <Link href={`/products/${product.slug}`} className="product-media">
        <img src={sourceCollectionAssets[product.slug] || product.image} alt={product.imageAlt} loading="lazy" decoding="async" />
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

function CatalogueProductCard({ product }: { product: (typeof products)[number] }) {
  return (
    <article className="catalogue-product-card">
      <Link href={`/products/${product.slug}`} className="catalogue-product-media">
        <img src={product.image} alt={product.imageAlt} loading="lazy" decoding="async" />
      </Link>
      <div className="catalogue-product-copy">
        <h2>{product.name}</h2>
        <p className="catalogue-product-description">{product.description}</p>
        <ul className="catalogue-product-highlights">
          {product.highlights.slice(0, 3).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {product.packSizes && (
          <div className="catalogue-product-packs" aria-label={`${product.name} pack sizes`}>
            {product.packSizes.map((size) => (
              <span key={size}>{size}</span>
            ))}
          </div>
        )}
        <ProductAvailabilityLabel slug={product.slug} />
        <div className="catalogue-product-actions">
          <Link href={`/products/${product.slug}`} className="btn btn-primary btn-sm">
            Product Details <span className="arrow">→</span>
          </Link>
          <a
            href={`/products/${product.slug}#product-enquiry`}
            className="btn btn-outline btn-sm"
            onClick={() => trackEvent("product_enquiry_cta", { product: product.name, location: "catalogue" })}
          >
            Enquire Now
          </a>
          <a
            href={siteIdentity.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="catalogue-whatsapp-link"
            onClick={() => trackEvent("whatsapp_click", { product: product.name, location: "catalogue" })}
          >
            WhatsApp Enquiry
          </a>
        </div>
      </div>
    </article>
  );
}

function Feature({ icon: Icon, title, copy }: { icon: typeof Leaf; title: string; copy: string }) {
  return (
    <div className="feature">
      <div className="feature-icon">
        <Icon />
      </div>
      <h3>{title}</h3>
      <p>{copy}</p>
    </div>
  );
}

export function HomePage() {
  const [start, setStart] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [animateCarousel, setAnimateCarousel] = useState(true);
  const [pauseCarousel, setPauseCarousel] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const heroPackAssets: Record<string, string> = {
    "sambar-powder": "/assets/sambar-hero_ccdf8343.webp",
    "rasam-powder": "/assets/rasam-hero_f1b93552.webp",
    "turmeric-powder": "/assets/turmeric-hero_7640284b.webp",
    "coriander-powder": "/assets/coriander-hero_80ecbf35.webp",
    "cumin-powder": "/assets/cumin-hero_ca84a878.webp",
    "pepper-powder": "/assets/pepper-hero_820e1b4a.webp",
    "garam-masala": "/assets/garam-hero_d8754d54.webp",
  };
  const heroProducts = products.filter((product) => product.slug !== "red-chilli-powder").map((product) => ({ ...product, heroImage: heroPackAssets[product.slug] || product.image }));
  const carouselProducts = [...heroProducts, ...heroProducts.slice(0, 3)];

  useEffect(() => {
    const updateItemsPerPage = () => setItemsPerPage(window.innerWidth <= 640 ? 1 : window.innerWidth <= 1024 ? 2 : 3);
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || pauseCarousel) return;
    const interval = window.setInterval(() => setStart((current) => (current < heroProducts.length ? current + 1 : current)), 3500);
    return () => window.clearInterval(interval);
  }, [heroProducts.length, pauseCarousel]);

  useEffect(() => {
    if (start !== heroProducts.length) return;
    const reset = window.setTimeout(() => {
      setAnimateCarousel(false);
      setStart(0);
      window.requestAnimationFrame(() => setAnimateCarousel(true));
    }, 700);
    return () => window.clearTimeout(reset);
  }, [start, heroProducts.length]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".home-page .reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const moveNext = () => {
    setStart((current) => (current < heroProducts.length ? current + 1 : current));
    trackEvent("hero_carousel_next");
  };
  const movePrevious = () => {
    if (start === 0) {
      setAnimateCarousel(false);
      setStart(heroProducts.length);
      window.requestAnimationFrame(() => {
        setAnimateCarousel(true);
        setStart(heroProducts.length - 1);
      });
    } else {
      setStart((current) => current - 1);
    }
    trackEvent("hero_carousel_previous");
  };
  const selectSlide = (index: number) => {
    setAnimateCarousel(true);
    setStart(index);
    trackEvent("hero_carousel_select", { product: heroProducts[index]?.name });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    setPauseCarousel(true);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    setPauseCarousel(false);
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 45) {
        moveNext();
      } else if (diff < -45) {
        movePrevious();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="home-page">
      {/* SECTION 1: HERO & INTRODUCTION */}
      <section className="hero" id="home">
        <img className="hero-bg-img" src={siteIdentity.heroImage} alt="" aria-hidden="true" fetchPriority="high" decoding="async" />
        <div className="container hero-inner">
          <div className="hero-copy hero-copy-enter">
            <p className="eyebrow">Pallavaram, Chennai · Pure Spices &amp; Traditional Masalas</p>
            <h1>
              HIPA Masala — Indian Spice Powders and Masala Blends in Chennai
            </h1>
            <p className="hero-desc">
              HIPA Masala is an Indian spice brand by HIPA Enterprises, based in Pallavaram, Chennai. We craft authentic single-origin spice powders and traditional South Indian masala blends for home kitchens, retail stores, catering services, and food businesses across Tamil Nadu and India.
            </p>
            <div className="hero-btns">
              <Link href="/products" className="btn btn-primary">
                Explore Product Range <span className="arrow">→</span>
              </Link>
              <Link href="/b2b-enquiries" className="btn btn-outline">
                B2B &amp; Wholesale <span className="arrow">→</span>
              </Link>
              <a href="/assets/hipa-masalas-brochure.pdf" download="HIPA-Masala-Brochure.pdf" className="btn btn-brochure-download">
                <Download size={16} aria-hidden="true" />
                Download Brochure
              </a>
            </div>
          </div>
          <div className="hero-art hero-art-enter" onMouseEnter={() => setPauseCarousel(true)} onMouseLeave={() => setPauseCarousel(false)}>
            <div className="hero-art-glow" />
            <div className="hero-badge">
              <span>HIPA</span>
              <small>Masala</small>
            </div>
            <div className="hero-carousel-container">
              <div className="hero-carousel-track-wrapper" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                <div
                  className="hero-carousel-track"
                  style={{
                    transform: `translateX(-${start * (100 / itemsPerPage)}%)`,
                    transition: animateCarousel ? "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)" : "none",
                  }}
                >
                  {carouselProducts.map((product, index) => (
                    <div
                      className="hero-carousel-item"
                      key={`${product.slug}-${index}`}
                      style={{ flex: `0 0 ${100 / itemsPerPage}%`, width: `${100 / itemsPerPage}%`, maxWidth: `${100 / itemsPerPage}%` }}
                    >
                      <Link href={`/products/${product.slug}`} className="hero-carousel-card">
                        <img
                          className="hero-carousel-img"
                          src={product.heroImage}
                          alt={product.imageAlt}
                          loading={index < 3 ? "eager" : "lazy"}
                          fetchPriority={index < 3 ? "high" : "low"}
                          decoding="async"
                        />
                        <span className="hero-carousel-title">{product.name}</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button className="hero-slider-nav prev" type="button" aria-label="Previous product" onClick={movePrevious}>
              <ChevronLeft />
            </button>
            <button className="hero-slider-nav next" type="button" aria-label="Next product" onClick={moveNext}>
              <ChevronRight />
            </button>
            <div className="hero-slider-dots">
              {heroProducts.map((product, index) => (
                <button
                  key={product.slug}
                  type="button"
                  className={`hero-dot ${index === start % heroProducts.length ? "is-active" : ""}`}
                  aria-label={`Show ${product.name}`}
                  onClick={() => selectSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALUE HIGHLIGHTS */}
      <section className="features reveal">
        <div className="container features-grid">
          <Feature icon={Leaf} title="Pure Spice Sourcing" copy="Whole spices selected for authentic aroma and natural essential oil retention." />
          <Feature icon={Sparkles} title="Traditional Blending" copy="Time-honoured South Indian culinary recipes for balanced daily cooking." />
          <Feature icon={ShieldCheck} title="Zero Adulteration" copy="No artificial food dyes, added MSG, synthetic preservatives, or starch fillers." />
          <Feature icon={Package} title="Diverse Pack Sizes" copy="Available in 50g, 100g, 200g, 500g, and 1kg packs for homes and commercial kitchens." />
          <Feature icon={Building2} title="B2B & Wholesale Supply" copy="Institutional packaging and dependable batch supply for retailers, caterers, and hotels." />
          <Feature icon={MapPin} title="Based in Chennai" copy="Operating from Pallavaram, Chennai, serving Tamil Nadu and all of India." />
        </div>
      </section>

      {/* SECTION 2: INDIAN SPICE POWDERS AND MASALA BLENDS */}
      <section className="section-content-block reveal">
        <div className="container">
          <div className="content-editorial-grid">
            <div className="editorial-copy">
              <p className="eyebrow">Culinary Foundations</p>
              <h2>Indian Spice Powders and Masala Blends</h2>
              <p>
                Indian cooking is celebrated worldwide for its masterful orchestration of spices. Every regional cuisine — from Tamil Nadu's comforting sambar and rasam to fragrant royal biryanis — relies on two fundamental categories of ground spices: <strong>single-ingredient pure spice powders</strong> and <strong>carefully proportioned blended masalas</strong>.
              </p>
              <p>
                Pure spices like Turmeric (Haldi), Red Chilli, Coriander (Dhania), Cumin (Jeera), and Black Pepper serve as the core building blocks. They govern colour, base heat, sauce consistency, and digestive warmth. Blended masalas like Sambar Powder, Rasam Powder, and Garam Masala combine whole spices and roasted lentils in precise culinary ratios to deliver complex, signature aromas in everyday dishes.
              </p>
              <p>
                At HIPA Masala, we maintain the integrity of both single spices and traditional blends by focusing on pure milling, balanced roasting, and airtight barrier packaging.
              </p>
            </div>
            <div className="editorial-cards">
              <div className="editorial-card-item">
                <div className="card-icon"><Leaf size={24} /></div>
                <h3>Pure Single Spices</h3>
                <p>Turmeric, Chilli, Coriander, Cumin, and Pepper milled purely from cleaned whole spices with zero adulterants.</p>
              </div>
              <div className="editorial-card-item">
                <div className="card-icon"><Sparkles size={24} /></div>
                <h3>Traditional Blended Masalas</h3>
                <p>Sambar Powder, Rasam Powder, and Garam Masala slow-roasted and blended following authentic South Indian proportions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: EXPLORE THE PRODUCT RANGE */}
      <section className="collection reveal" id="products">
        <div className="container">
          <div className="collection-head">
            <p className="eyebrow">Our Products</p>
            <h2>Explore the HIPA Masala Product Range</h2>
            <p className="section-desc">
              Discover our complete collection of 8 pure spice powders and authentic South Indian masala blends, crafted for home kitchens and food businesses.
            </p>
          </div>
          <div className="product-grid product-grid-4cols">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <div className="collection-footer-cta">
            <Link href="/products" className="btn btn-primary">
              View Detailed Product Catalogue <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: WHY PRODUCT INFORMATION MATTERS */}
      <section className="section-content-block bg-warm reveal">
        <div className="container">
          <div className="content-editorial-grid reversed">
            <div className="editorial-art">
              <img src="/assets/story-spice-mortar_d4ded661.jpg" alt="Traditional stone mortar and pestle grinding whole spices" />
            </div>
            <div className="editorial-copy">
              <p className="eyebrow">Quality &amp; Transparency</p>
              <h2>Why Product Information Matters for Spice Powders</h2>
              <p>
                In an era where processed foods frequently hide behind vague marketing buzzwords, transparent product information is essential for both conscious homemakers and professional chefs. The quality of a spice powder directly influences food aroma, nutritional retention, and consistency in every meal.
              </p>
              <ul className="editorial-bullet-list">
                <li>
                  <strong>Authentic Sourcing &amp; Processing:</strong> Understanding where spices originate and ensuring they are ground without extreme friction heat protects their natural volatile essential oils.
                </li>
                <li>
                  <strong>Zero Additives &amp; Extenders:</strong> Commercial spice adulteration (such as starch in coriander or dyes in chilli) dilutes taste and compromises food safety. We believe in 100% purity.
                </li>
                <li>
                  <strong>Proper Storage Guidance:</strong> Ground spices require protection from moisture, UV light, and heat to prevent oxidation and flavour loss over their 12-month shelf life.
                </li>
                <li>
                  <strong>Accurate Culinary Specifications:</strong> Clear ingredient breakdowns and particle sizes help cooks achieve reproducible taste across both domestic and commercial batch cooking.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: HIPA MASALA IN CHENNAI */}
      <section className="section-content-block reveal">
        <div className="container">
          <div className="location-feature-card">
            <div className="location-copy">
              <p className="eyebrow">Local Roots · Regional Reach</p>
              <h2>HIPA Masala in Chennai — Sourcing and Availability</h2>
              <p>
                HIPA Enterprises operates from Pallavaram in South Chennai, Tamil Nadu. Chennai has historically been a thriving epicentre for South Indian spice trading and culinary excellence.
              </p>
              <p>
                From our facility in Zamin Pallavaram, we distribute our complete spice range to domestic households, neighbourhood retail grocers, supermarket chains, and food service partners across Chennai, Kanchipuram, Chengalpattu, and throughout Tamil Nadu.
              </p>
              <div className="location-details-strip">
                <div>
                  <strong>Official Address:</strong>
                  <p>{siteIdentity.locationLabel}</p>
                </div>
                <div>
                  <strong>Direct Inquiries:</strong>
                  <p>Phone: {siteIdentity.phone} · Email: {siteIdentity.email}</p>
                </div>
              </div>
              <div className="location-actions">
                <Link href="/contact" className="btn btn-primary">
                  Visit Contact Page <span className="arrow">→</span>
                </Link>
                <a href={siteIdentity.whatsappHref} target="_blank" rel="noreferrer" className="btn btn-whatsapp-live">
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: FOR HOMES, RETAILERS AND FOOD BUSINESSES */}
      <section className="section-content-block bg-warm reveal">
        <div className="container">
          <div className="collection-head">
            <p className="eyebrow">Serving Diverse Needs</p>
            <h2>For Homes, Retailers and Food Businesses</h2>
            <p className="section-desc">
              Whether you are seasoning a daily family meal or sourcing spices for a restaurant chain or supermarket shelf, HIPA Masala provides tailored packaging and reliable supply.
            </p>
          </div>
          <div className="segments-grid">
            <div className="segment-card">
              <div className="segment-icon"><Utensils size={28} /></div>
              <h3>Home Kitchens</h3>
              <p>
                Available in convenient 50g, 100g, 200g, and 500g zipper/pouch packs. Enjoy traditional flavours with zero guesswork and clean ingredients for your loved ones.
              </p>
              <Link href="/products" className="btn btn-outline btn-sm">Browse Retail Packs</Link>
            </div>
            <div className="segment-card">
              <div className="segment-icon"><Store size={28} /></div>
              <h3>Retailers &amp; Supermarkets</h3>
              <p>
                Attractive shelf-ready retail packaging with clear barcodes, tamper-evident seals, competitive retailer margins, and steady local replenishment.
              </p>
              <Link href="/b2b-enquiries" className="btn btn-outline btn-sm">Retailer Enquiries</Link>
            </div>
            <div className="segment-card">
              <div className="segment-icon"><Building2 size={28} /></div>
              <h3>Caterers, Hotels &amp; Cloud Kitchens</h3>
              <p>
                500g and 1kg institutional bags designed for commercial kitchens. Guaranteed batch consistency to protect your recipe reputation and customer loyalty.
              </p>
              <Link href="/b2b-enquiries" className="btn btn-outline btn-sm">Commercial Orders</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FREQUENTLY ASKED QUESTIONS */}
      <section className="catalogue-faq-section reveal">
        <div className="container">
          <div className="collection-head">
            <p className="eyebrow">Common Queries</p>
            <h2>Frequently Asked Questions About HIPA Masala</h2>
            <p className="section-desc">
              Clear, factual answers about our brand, spice processing, product availability, and business enquiries in Chennai.
            </p>
          </div>
          <div className="catalogue-faq-list">
            {faqs.slice(0, 4).map((faq, index) => (
              <details key={faq.question} className="catalogue-faq-item" open={index === 0}>
                <summary>
                  {faq.question}
                  <ChevronDown size={16} />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
          <div className="faq-more-link">
            <Link href="/faq" className="btn btn-outline">
              View All Frequently Asked Questions <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section className="cta-band reveal">
        <div className="container cta-inner">
          <div>
            <h2>Stay Connected with HIPA Masala</h2>
            <p>Get spice guides, cooking tips, and product announcements straight to your inbox.</p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}

export function ProductsPage() {
  return (
    <>
      <Breadcrumbs current="Products" />
      <section className="catalogue-page">
        <div className="container">
          <div className="collection-head catalogue-head">
            <p className="eyebrow">HIPA Masala · Chennai</p>
            <h1>Traditional Spice Powders &amp; Masala Blends</h1>
            <p className="section-desc">
              Explore our complete range of 8 pure spice powders and authentic South Indian masala blends. Click on any product to view comprehensive ingredients, culinary applications, storage tips, and technical specifications.
            </p>
            <div className="catalogue-filter-label" aria-label="Product category">
              Pure Spices &amp; Traditional Blends
            </div>
          </div>
          <div className="catalogue-product-grid">
            {products.map((product) => (
              <CatalogueProductCard product={product} key={product.slug} />
            ))}
          </div>
        </div>
      </section>

      {/* B2B / DISTRIBUTOR CALLOUT */}
      <section className="catalogue-enquiry-section" id="distributor-enquiry">
        <div className="container catalogue-enquiry-grid">
          <div className="catalogue-enquiry-copy">
            <p className="eyebrow">Trade &amp; Business Orders</p>
            <h2>Wholesale &amp; Retail Supply Enquiries</h2>
            <p>
              Are you a grocery store owner, supermarket purchaser, catering company, or restaurant chef looking for dependable spice supply in Chennai and Tamil Nadu?
            </p>
            <p>
              HIPA Enterprises offers institutional packaging (500g, 1kg, bulk master cartons) with reliable batch consistency and direct commercial terms.
            </p>
            <div className="catalogue-enquiry-note">
              <p>
                <strong>Direct Assistance:</strong> You can also call us directly at{" "}
                <a href={siteIdentity.phoneHref}>{siteIdentity.phone}</a> or send an instant WhatsApp message.
              </p>
            </div>
          </div>
          <div className="contact-form-card catalogue-enquiry-form">
            <h3>Trade &amp; Product Enquiry</h3>
            <p>Fill out your details below to request product information or bulk terms.</p>
            <EnquiryForm formId="catalogue-enquiry" variant="distributor" />
          </div>
        </div>
      </section>

      {/* PRODUCT FAQs */}
      <section className="catalogue-faq-section">
        <div className="container">
          <div className="collection-head">
            <p className="eyebrow">Common Questions</p>
            <h2>Product Range Questions</h2>
            <p className="section-desc">Answers to common questions about HIPA Masala spice products.</p>
          </div>
          <div className="catalogue-faq-list">
            {faqs.slice(4, 8).map((faq, index) => (
              <details key={faq.question} className="catalogue-faq-item" open={index === 0}>
                <summary>
                  {faq.question}
                  <ChevronDown size={16} />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function ProductDetailPage() {
  const [, params] = useRoute("/products/:slug");
  const product = getProduct(params?.slug || "");
  if (!product) return <NotFoundPage />;

  const relatedProducts = (product.relatedProductSlugs || [])
    .map((slug) => getProduct(slug))
    .filter((p): p is (typeof products)[number] => Boolean(p));

  const guide = articleResourcesBySlug[product.slug];
  const productFaqs = getProductFaqs(product);

  return (
    <>
      <Breadcrumbs current={product.name} parent={{ label: "Products", href: "/products" }} />

      {/* 1. HERO SECTION */}
      <section className="product-replica">
        <div className="container product-replica-grid">
          <div className="product-replica-image product-detail-enter">
            <img src={product.image} alt={product.imageAlt} fetchPriority="high" decoding="async" />
          </div>
          <div className="product-replica-copy product-detail-enter">
            <p className="eyebrow">HIPA MASALA · PALLAVARAM, CHENNAI</p>
            <h1>{product.name}</h1>
            <p className="product-hero-summary">{product.description}</p>
            <ProductAvailabilityLabel slug={product.slug} />

            <div className="product-quick-specs">
              <ul className="product-highlights">
                {product.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {product.packSizes && (
              <div className="replica-packs-wrap">
                <span className="packs-title">Available Pack Sizes:</span>
                <div className="replica-packs" aria-label={`${product.name} pack sizes`}>
                  {product.packSizes.map((size) => (
                    <span key={size}>{size}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="replica-product-actions">
              <a href="#product-enquiry" className="btn btn-primary" onClick={() => trackEvent("product_enquiry_cta", { product: product.name })}>
                Enquire About This Product <span className="arrow">↓</span>
              </a>
              <a href={siteIdentity.whatsappHref} target="_blank" rel="noreferrer" className="btn btn-whatsapp-live" onClick={() => trackEvent("whatsapp_click", { product: product.name })}>
                WhatsApp Enquiry
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEEP SEARCH INTENT SECTIONS (700-1000 words per product) */}
      <section className="product-deep-content">
        <div className="container product-content-container">

          {/* WHAT IS THIS PRODUCT */}
          <article className="content-card">
            <h2>What is HIPA Masala {product.name}?</h2>
            {product.whatIs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </article>

          {/* INGREDIENTS & AROMA */}
          <article className="content-card">
            <h2>Ingredients, Flavour &amp; Aroma Profile</h2>
            {product.ingredientsAndAroma.map((item, idx) => (
              <p key={idx}>{item}</p>
            ))}
          </article>

          {/* CULINARY USES */}
          <article className="content-card">
            <h2>Common Culinary Uses &amp; Everyday Dishes</h2>
            <ul className="culinary-uses-list">
              {product.commonUses.map((use, idx) => (
                <li key={idx}>
                  <Check size={18} className="check-icon" />
                  <span>{use}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* SELECTION FACTORS */}
          <article className="content-card">
            <h2>Quality, Purity &amp; Selection Factors</h2>
            <ul className="factors-list">
              {product.selectionFactors.map((factor, idx) => (
                <li key={idx}>
                  <ShieldCheck size={18} className="shield-icon" />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* STORAGE GUIDANCE */}
          <article className="content-card">
            <h2>Packaging &amp; Storage Guidance</h2>
            <ul className="storage-list">
              {product.storageGuidance.map((tip, idx) => (
                <li key={idx}>
                  <Clock size={18} className="clock-icon" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* COMMERCIAL APPLICATIONS */}
          <article className="content-card">
            <h2>For Commercial Kitchens, Caterers &amp; Retailers</h2>
            <ul className="commercial-list">
              {product.commercialApplications.map((app, idx) => (
                <li key={idx}>
                  <Building2 size={18} className="building-icon" />
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* SPECIFICATIONS TABLE */}
          {product.specs && (
            <article className="content-card specs-card">
              <h2>Product Specifications</h2>
              <div className="table-responsive">
                <table className="specs-table">
                  <tbody>
                    {product.specs.map((spec) => (
                      <tr key={spec.label}>
                        <th scope="row">{spec.label}</th>
                        <td>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          )}

        </div>
      </section>

      {/* 3. PRODUCT FAQS */}
      <section className="product-faq-section">
        <div className="container">
          <div className="product-faq-heading">
            <p className="eyebrow">Product Questions</p>
            <h2>Frequently Asked Questions About {product.name}</h2>
            <p>Factual information about ingredients, usage, pack sizes, and culinary techniques.</p>
          </div>
          <div className="product-faq-list">
            {productFaqs.map((faq, index) => (
              <details key={faq.question} className="product-faq-item" open={index === 0}>
                <summary>
                  {faq.question}
                  <ChevronDown size={16} />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 4. RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="related-products">
          <div className="container">
            <h2>Related Spice Powders &amp; Masalas</h2>
            <div className="product-grid product-grid-3cols">
              {relatedProducts.map((item) => (
                <ProductCard key={item.slug} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. INLINE PRODUCT ENQUIRY FORM */}
      <section className="product-enquiry-section" id="product-enquiry">
        <div className="container product-enquiry-grid">
          <div className="product-enquiry-copy">
            <p className="eyebrow">Direct Enquiry</p>
            <h2>Enquire About {product.name}</h2>
            <p>
              Interested in retail supply, restaurant supply, or bulk distribution of <strong>{product.name}</strong> in Chennai or beyond? Fill out the form and our team will get back to you promptly with product details.
            </p>
            <div className="product-enquiry-note">
              <p>
                <strong>Need Immediate Assistance?</strong> Message us on WhatsApp or call our Chennai office at{" "}
                <a href={siteIdentity.phoneHref}>{siteIdentity.phone}</a>.
              </p>
            </div>
          </div>
          <div className="contact-form-card product-enquiry-form-card">
            <h3>Send an Enquiry</h3>
            <p>Fields marked * are required.</p>
            <EnquiryForm formId={`enquiry-${product.slug}`} />
          </div>
        </div>
      </section>
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <Breadcrumbs current="About" />
      <section className="contact-hero">
        <div className="container contact-hero-inner">
          <p className="eyebrow">About HIPA Enterprises · Chennai</p>
          <h1>About HIPA Masala — Our Story, Vision and Approach to Indian Spices</h1>
          <p>
            HIPA Masala is an Indian spice and masala brand owned and operated by HIPA Enterprises in Pallavaram, Chennai, Tamil Nadu. We are dedicated to providing pure, unadulterated spice powders and traditionally formulated masala blends for everyday cooking.
          </p>
        </div>
      </section>

      <section className="journal-replica about-page">
        <div className="container" style={{ maxWidth: 880 }}>

          {/* SECTION 1: THE STORY */}
          <div className="about-content-section">
            <p className="eyebrow">Heritage &amp; Beginnings</p>
            <h2>The Story Behind HIPA Masala</h2>
            <p className="section-desc">
              Food in an Indian home is far more than sustenance — it is a daily celebration of culture, family connection, and wellness. At the core of every memorable meal is the aroma of freshly ground spices simmering in warm ghee or oil.
            </p>
            <p className="section-desc">
              HIPA Masala was founded by HIPA Enterprises with a clear mission: to bring the authentic taste and aroma of traditional South Indian kitchen masalas to modern homes and food businesses. Inspired by ancestral recipes passed down through generations, we set out to create spice products that honour authentic regional flavours without relying on shortcuts, synthetic additives, or artificial colours.
            </p>
          </div>

          {/* SECTION 2: APPROACH TO SPICE BLENDING */}
          <div className="about-content-section">
            <p className="eyebrow">Craft &amp; Consistency</p>
            <h2>Our Approach to Spice Blending</h2>
            <p className="section-desc">
              Exceptional masala starts with raw ingredient selection. We source premium-grade whole spices — plump coriander seeds, pungent Guntur red chillies, high-curcumin turmeric rhizomes, Tellicherry black peppercorns, and aromatic whole spices.
            </p>
            <p className="section-desc">
              Each ingredient is carefully cleaned and milled under controlled low temperatures. This critical step preserves the delicate, volatile essential oils that give each spice its signature aroma and therapeutic properties. In our blended masalas, whole spices and lentils are slow-roasted before grinding to replicate the authentic texture and aroma of stone-ground home podis.
            </p>
          </div>

          {/* SECTION 3: SERVING HOMES AND BUSINESSES */}
          <div className="about-content-section">
            <p className="eyebrow">Community &amp; Commerce</p>
            <h2>Serving Homes and Food Businesses</h2>
            <p className="section-desc">
              We take pride in serving two vibrant culinary communities:
            </p>
            <ul className="about-points-list">
              <li>
                <strong>Everyday Home Cooks:</strong> Offering convenient retail pouch packaging (50g to 1kg) that keeps spices fresh and makes authentic daily cooking effortless.
              </li>
              <li>
                <strong>Food Businesses &amp; Retailers:</strong> Supplying caterers, restaurants, mess establishments, and supermarket chains with consistent, high-volume batch supplies in 500g and 1kg institutional packaging.
              </li>
            </ul>
          </div>

          {/* SECTION 4: LOCATED IN PALLAVARAM, CHENNAI */}
          <div className="about-content-section">
            <p className="eyebrow">Entity &amp; Location</p>
            <h2>Located in Pallavaram, Chennai</h2>
            <p className="section-desc">
              Our business operations are anchored in Pallavaram, Chennai — a vibrant suburban commercial hub with deep ties to South Indian trade routes.
            </p>
            <div className="about-entity-box">
              <p><strong>Business Legal Entity:</strong> HIPA Enterprises</p>
              <p><strong>Brand:</strong> HIPA Masala</p>
              <p><strong>Official Address:</strong> {siteIdentity.locationLabel}</p>
              <p><strong>Phone:</strong> {siteIdentity.phone} | <strong>Email:</strong> {siteIdentity.email}</p>
            </div>
          </div>

          {/* SECTION 5: OUR CORE VALUES */}
          <div className="about-content-section">
            <p className="eyebrow">Principles</p>
            <h2>Our Core Values</h2>
            <div className="about-values-grid">
              <div className="about-value-card">
                <h3>Purity First</h3>
                <p>Zero artificial dyes, chemical preservatives, or synthetic flavour enhancers.</p>
              </div>
              <div className="about-value-card">
                <h3>Authentic Taste</h3>
                <p>Recipes crafted to deliver true traditional South Indian taste and aroma.</p>
              </div>
              <div className="about-value-card">
                <h3>Consistency</h3>
                <p>Uniform milling and calibrated roasting for dependable results in every pack.</p>
              </div>
              <div className="about-value-card">
                <h3>People-First Service</h3>
                <p>Direct, responsive communication for domestic and commercial partners alike.</p>
              </div>
            </div>
          </div>

          <div className="about-cta-bar">
            <Link href="/products" className="btn btn-primary">
              Explore Our Products <span className="arrow">→</span>
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Contact Us <span className="arrow">→</span>
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}

export function FaqPage() {
  const cluster1 = faqs.slice(0, 4);
  const cluster2 = faqs.slice(4, 8);
  const cluster3 = faqs.slice(8, 12);

  return (
    <>
      <Breadcrumbs current="FAQ" />
      <section className="faq-hero">
        <div className="container">
          <p className="eyebrow">Questions &amp; Answers</p>
          <h1>Frequently Asked Questions About HIPA Masala</h1>
          <p>
            Find comprehensive, clear answers about our spice sourcing, product formulations, pack sizes, Chennai location, and B2B ordering options.
          </p>
        </div>
      </section>

      <section className="faq-shell">
        <div className="faq-container">

          {/* CLUSTER 1 */}
          <div className="faq-cluster">
            <h2 className="faq-cluster-title">1. About HIPA Masala &amp; Sourcing</h2>
            {cluster1.map((faq, index) => (
              <details className="faq-live-item" key={faq.question} open={index === 0}>
                <summary>
                  {faq.question}
                  <span><ChevronDown size={15} /></span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>

          {/* CLUSTER 2 */}
          <div className="faq-cluster">
            <h2 className="faq-cluster-title">2. Product Range &amp; Culinary Usage</h2>
            {cluster2.map((faq, index) => (
              <details className="faq-live-item" key={faq.question} open={index === 0}>
                <summary>
                  {faq.question}
                  <span><ChevronDown size={15} /></span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>

          {/* CLUSTER 3 */}
          <div className="faq-cluster">
            <h2 className="faq-cluster-title">3. B2B Enquiries, Wholesale &amp; Contact</h2>
            {cluster3.map((faq, index) => (
              <details className="faq-live-item" key={faq.question} open={index === 0}>
                <summary>
                  {faq.question}
                  <span><ChevronDown size={15} /></span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>

          <div className="faq-support">
            <h2>Have More Questions?</h2>
            <p>Our team in Chennai is here to assist with product details, bulk orders, and retailer terms.</p>
            <div className="hero-btns">
              <Link href="/contact#enquire" className="btn btn-outline">Send an Enquiry</Link>
              <a href={siteIdentity.whatsappHref} target="_blank" rel="noreferrer" className="btn btn-outline" onClick={() => trackEvent("whatsapp_click", { location: "faq" })}>
                WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoCard({ icon: Icon, title, children }: { icon: typeof MapPin; title: string; children: React.ReactNode }) {
  return (
    <div className="info-card">
      <div className="info-card-icon">
        <Icon />
      </div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

export function ContactPage() {
  const cityMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(siteIdentity.locationLabel)}`;
  const cityMapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(siteIdentity.locationLabel)}&output=embed`;

  return (
    <>
      <Breadcrumbs current="Contact" />
      <section className="contact-hero">
        <div className="container contact-hero-inner">
          <p className="eyebrow">Get in Touch · Pallavaram, Chennai</p>
          <h1>Contact HIPA Masala</h1>
          <p>
            Reach out to HIPA Enterprises for product details, retailer inquiries, catering supply, and business partnerships in Chennai and across India.
          </p>
        </div>
      </section>

      <section className="info-cards-section">
        <div className="container info-cards-row">
          <InfoCard icon={MapPin} title="Official Address">
            {siteIdentity.locationLabel}
          </InfoCard>
          <InfoCard icon={Phone} title="Phone Number">
            <a href={siteIdentity.phoneHref} onClick={() => trackEvent("phone_click", { location: "contact" })}>
              {siteIdentity.phone}
            </a>
          </InfoCard>
          <InfoCard icon={Mail} title="Email Address">
            <a href={`mailto:${siteIdentity.email}`}>{siteIdentity.email}</a>
          </InfoCard>
        </div>
      </section>

      <section className="contact-main" id="enquire">
        <div className="container contact-grid">
          <div className="contact-form-card">
            <h2>Send Us an Enquiry</h2>
            <p>Fill in the form below for product information, trade queries, or general assistance. Fields marked * are required.</p>
            <EnquiryForm />
          </div>
          <aside className="contact-side">
            <div className="map-card">
              <iframe className="contact-map-frame" src={cityMapEmbedUrl} title="HIPA Masala Chennai map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              <div className="map-card-info">
                <h3>Find Us in Chennai</h3>
                <p>{siteIdentity.locationLabel}</p>
                <a className="map-open-link" href={cityMapUrl} target="_blank" rel="noreferrer">Open in Google Maps</a>
              </div>
            </div>
            <div className="whatsapp-cta">
              <h3>Prefer an Instant Chat?</h3>
              <p>For immediate product questions or bulk price inquiries, message us directly on WhatsApp.</p>
              <a id="whatsappCtaBtn" href={siteIdentity.whatsappHref} target="_blank" rel="noreferrer" className="btn btn-primary" onClick={() => trackEvent("whatsapp_click", { location: "contact" })}>
                Chat on WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

export function B2BEnquiriesPage() {
  return (
    <>
      <Breadcrumbs current="B2B Enquiries" />
      <section className="contact-hero">
        <div className="container contact-hero-inner">
          <p className="eyebrow">Wholesale, Retail &amp; Food Service Supply</p>
          <h1>B2B Enquiries — Wholesale, Distribution and Food Business Requirements</h1>
          <p>
            HIPA Enterprises supplies high-quality pure spice powders and authentic masala blends for retail distributors, supermarket chains, hotels, restaurants, caterers, and food businesses.
          </p>
        </div>
      </section>

      <section className="b2b-enquiry-section">
        <div className="container b2b-enquiry-grid">
          <div className="b2b-enquiry-copy">
            <p className="eyebrow">Partnership Opportunities</p>
            <h2>How We Support Your Food Business</h2>
            <p>
              Whether you manage an independent supermarket, a chain of South Indian restaurants, or an institutional catering enterprise, HIPA Masala provides dependable product consistency and flexible packaging options.
            </p>
            <div className="b2b-benefits-block">
              <div className="b2b-benefit-item">
                <Store size={20} />
                <div>
                  <strong>Retail Supermarkets &amp; Grocers:</strong>
                  <span>High-shelf-appeal pouch packs (50g, 100g, 200g, 500g, 1kg) with clear labelling, barcodes, and fast replenishment in Chennai.</span>
                </div>
              </div>
              <div className="b2b-benefit-item">
                <Utensils size={20} />
                <div>
                  <strong>Caterers &amp; Commercial Kitchens:</strong>
                  <span>500g and 1kg institutional bags formulated for high-volume cooking consistency.</span>
                </div>
              </div>
              <div className="b2b-benefit-item">
                <Truck size={20} />
                <div>
                  <strong>Wholesale &amp; Regional Distributors:</strong>
                  <span>Attractive trade margins, reliable batch delivery, and direct manufacturer support from Chennai.</span>
                </div>
              </div>
            </div>

            <div className="b2b-enquiry-note">
              <p>
                <strong>Direct Business Hotline:</strong> Call <a href={siteIdentity.phoneHref}>{siteIdentity.phone}</a> or email <a href={`mailto:${siteIdentity.email}`}>{siteIdentity.email}</a> for immediate bulk quotations.
              </p>
            </div>
          </div>

          <div className="contact-form-card b2b-enquiry-form">
            <h2>Submit a Business Enquiry</h2>
            <p>Tell us about your business type, required products, and estimated monthly volumes. Fields marked * are required.</p>
            <EnquiryForm formId="b2b-enquiry" variant="distributor" />
          </div>
        </div>
      </section>
    </>
  );
}

export function PrivacyPage() {
  return (
    <>
      <Breadcrumbs current="Privacy" />
      <section className="journal-replica">
        <div className="container" style={{ maxWidth: 840 }}>
          <p className="eyebrow">Privacy</p>
          <h1>Privacy Policy</h1>
          <p className="section-desc">
            HIPA Enterprises is committed to protecting your privacy. This policy outlines how information submitted through the HIPA Masala website is managed.
          </p>
          <div className="article-body">
            <h2>Information Collected Through Enquiry Forms</h2>
            <p className="section-desc">
              When you submit a contact or B2B enquiry, we may collect your name, email address, mobile number, business type, city or region, and message content solely to respond to your specific request.
            </p>
            <h2>How We Use Your Information</h2>
            <p className="section-desc">
              Your contact details are used exclusively by HIPA Enterprises to answer product inquiries, provide quotations, and facilitate customer support. We do not sell, rent, or distribute your personal data to third parties.
            </p>
            <h2>Newsletter Subscriptions</h2>
            <p className="section-desc">
              Newsletter signups are stored securely in compliance with consent guidelines and used solely to deliver occasional spice guides and product announcements.
            </p>
            <h2>Contact Regarding Privacy</h2>
            <p className="section-desc">
              If you have any questions regarding your submitted details, please reach out to us at <a href={`mailto:${siteIdentity.email}`}>{siteIdentity.email}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export function TermsOfServicePage() {
  return (
    <>
      <Breadcrumbs current="Terms of Service" />
      <section className="journal-replica terms-page">
        <div className="container" style={{ maxWidth: 840 }}>
          <p className="eyebrow">Website Terms</p>
          <h1>Terms of Service</h1>
          <p className="section-desc">
            These terms govern the informational use of the HIPA Masala website.
          </p>
          <div className="article-body">
            <h2>Informational &amp; Enquiry Website</h2>
            <p className="section-desc">
              This website is published by HIPA Enterprises for informational, product discovery, and business enquiry purposes. It is not an e-commerce platform and does not conduct online financial transactions or automated order checkouts.
            </p>
            <h2>Product Information &amp; Availability</h2>
            <p className="section-desc">
              While we strive to keep all product specifications, pack sizes, and descriptions accurate and up to date, listings are subject to ongoing refinement. Commercial terms, minimum order quantities, and wholesale pricing are provided directly upon inquiry.
            </p>
            <h2>Intellectual Property</h2>
            <p className="section-desc">
              All branding, text, photographs, graphics, and layout on this website are the intellectual property of HIPA Enterprises and may not be copied or reproduced without prior written permission.
            </p>
            <h2>Contact</h2>
            <p className="section-desc">
              For any questions concerning these terms, contact us through our <Link href="/contact">Contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export function BlogPage() {
  const [query, setQuery] = useState("");
  const publishedPosts = trpc.blog.publishedList.useQuery();
  const normalizedQuery = query.trim().toLowerCase();
  const visibleArticles = (publishedPosts.data || []).filter((article) => !normalizedQuery || `${article.title} ${article.description}`.toLowerCase().includes(normalizedQuery));

  return (
    <>
      <Breadcrumbs current="Blog" />
      <section className="blog-live-hero">
        <div className="container">
          <p className="eyebrow">Recipes &amp; Spice Knowledge</p>
          <h1>HIPA Masala Blog</h1>
          <p>Explore practical spice guides, South Indian cooking ideas and current product information from HIPA Masala.</p>
        </div>
      </section>
      <section className="blog-live-toolbar">
        <div className="container blog-live-toolbar-inner">
          <div className="blog-category-tabs" role="tablist" aria-label="Filter blog articles">
            <button className="is-active" type="button" role="tab" aria-selected="true">All</button>
          </div>
          <label className="blog-search-field">
            <span className="sr-only">Search blog articles</span>
            <input value={query} type="search" name="blog-query" placeholder="Search blog articles..." onChange={(event) => setQuery(event.target.value)} />
            <span aria-hidden="true">⌕</span>
          </label>
        </div>
      </section>
      <section className="blog-live-collection">
        <div className="container">
          {publishedPosts.isLoading ? (
            <div className="blog-live-empty">
              <span aria-hidden="true">▤</span>
              <h2>Loading articles</h2>
              <p>Please wait while the latest published articles load.</p>
            </div>
          ) : publishedPosts.isError ? (
            <div className="blog-live-empty">
              <span aria-hidden="true">▤</span>
              <h2>Articles are temporarily unavailable</h2>
              <p>Please try again shortly.</p>
            </div>
          ) : visibleArticles.length ? (
            <div className="blog-live-grid">
              {visibleArticles.map((article) => (
                <article className="blog-live-card" key={article.slug}>
                  {article.coverImageUrl ? (
                    <img className="blog-live-card-cover" src={article.coverImageUrl} alt={article.coverImageAlt || ""} loading="lazy" decoding="async" />
                  ) : null}
                  <div className="blog-live-card-copy">
                    <p className="eyebrow">HIPA Journal</p>
                    <h2>{article.title}</h2>
                    <p>{article.description}</p>
                    <Link href={`/blog/${article.slug}`} className="btn btn-outline btn-sm">
                      Read Article <span className="arrow">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="blog-live-empty">
              <span aria-hidden="true">▤</span>
              <h2>{normalizedQuery ? "No articles found" : "Coming Soon"}</h2>
              <p>{normalizedQuery ? "Try a different search term." : "Our latest blogs will appear here."}</p>
            </div>
          )}
        </div>
      </section>
      <section className="blog-live-newsletter">
        <div className="container blog-live-newsletter-inner">
          <div>
            <h2>Stay Updated with HIPA Masala</h2>
            <p>Subscribe to receive practical spice guides, cooking tips and product updates.</p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}

export function ArticlePage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";
  const postQuery = trpc.blog.publishedBySlug.useQuery({ slug }, { enabled: Boolean(slug) });
  const article = postQuery.data;

  useEffect(() => {
    if (article) document.title = `${article.title} | HIPA Masala`;
  }, [article]);

  if (!article) {
    return postQuery.isLoading ? (
      <section className="journal-replica">
        <div className="container">
          <p className="section-desc">Loading article…</p>
        </div>
      </section>
    ) : (
      <NotFoundPage />
    );
  }

  const publishedDate = (article.publishedAt || article.createdAt).toISOString().slice(0, 10);
  const blocks = getArticleBlocks(article.body);
  const relatedResources = articleResourcesBySlug[article.slug] || [];
  const inlineResources = [...relatedResources, ...(articleInlineLinksBySlug[article.slug] || [])];

  return (
    <>
      <Breadcrumbs current={article.title} parent={{ label: "Blog", href: "/blog" }} />
      <article className="journal-replica">
        <div className="container" style={{ maxWidth: 840 }}>
          <p className="eyebrow">HIPA Journal</p>
          <h1>{article.title}</h1>
          <p className="section-desc">By {article.authorName} · {publishedDate}</p>
          {article.coverImageUrl && (
            <img
              src={article.coverImageUrl}
              alt={article.coverImageAlt || ""}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              style={{ borderRadius: 18, marginBottom: 28 }}
            />
          )}
          <div className="article-body">
            {blocks.map((block, index) => {
              switch (block.type) {
                case "heading":
                  return <h2 key={`h2-${index}`}>{renderArticleInlineLinks(block.content, inlineResources)}</h2>;
                case "subheading":
                  return <h3 key={`h3-${index}`}>{renderArticleInlineLinks(block.content, inlineResources)}</h3>;
                case "blockquote":
                  return (
                    <blockquote key={`bq-${index}`} className="article-blockquote">
                      <p>{renderArticleInlineLinks(block.content, inlineResources)}</p>
                    </blockquote>
                  );
                case "list":
                  return (
                    <ul key={`ul-${index}`} className="article-list">
                      {block.items.map((item, i) => (
                        <li key={`li-${i}`}>{renderArticleInlineLinks(item, inlineResources)}</li>
                      ))}
                    </ul>
                  );
                case "ordered-list":
                  return (
                    <ol key={`ol-${index}`} className="article-ordered-list">
                      {block.items.map((item, i) => (
                        <li key={`oli-${i}`}>{renderArticleInlineLinks(item, inlineResources)}</li>
                      ))}
                    </ol>
                  );
                case "table":
                  return (
                    <div key={`tbl-${index}`} className="article-table-wrap">
                      <table className="article-table">
                        <thead>
                          <tr>
                            {block.headers.map((h, i) => (
                              <th key={`th-${i}`}>{renderArticleInlineLinks(h, inlineResources)}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {block.rows.map((row, ri) => (
                            <tr key={`tr-${ri}`}>
                              {row.map((cell, ci) => (
                                <td key={`td-${ci}`}>{renderArticleInlineLinks(cell, inlineResources)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                case "paragraph":
                default:
                  return <p key={`p-${index}`} className="section-desc">{renderArticleInlineLinks(block.content, inlineResources)}</p>;
              }
            })}
          </div>
          {relatedResources.length > 0 && (
            <aside className="article-related-links" aria-labelledby="related-hipa-pages">
              <p className="eyebrow">Continue exploring</p>
              <h2 id="related-hipa-pages">Related HIPA pages</h2>
              <p>Use these links to explore relevant product information or ask HIPA for further details.</p>
              <ul>
                {relatedResources.map((resource) => (
                  <li key={resource.href}>
                    <Link href={resource.href}>{resource.label}</Link>
                    <span>{resource.detail}</span>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </article>
    </>
  );
}

export function NotFoundPage() {
  return (
    <section className="journal-replica">
      <div className="container">
        <div className="empty-state">
          <p className="eyebrow">404</p>
          <h1>That page is not available.</h1>
          <p>The page may have moved to a clean HIPA URL or may not be ready for publication.</p>
          <Link href="/" className="btn btn-primary">Return Home</Link>
        </div>
      </div>
    </section>
  );
}
