import { Building2, ChevronDown, ChevronLeft, ChevronRight, Download, Leaf, MapPin, Package, ShieldCheck, Sparkles, Store, Utensils } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ProductCard } from "@/components/ProductCard";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { trackEvent } from "@/lib/analytics";
import { resolveImage } from "@/lib/imageManifest";
import { faqs, products, siteIdentity } from "@shared/hipaContent";

// The homepage ships in the main bundle (most visits land here); every other page lives in the
// lazily loaded HipaPages chunk (see client/src/routes.ts).

function Feature({ icon: Icon, title, copy }: { icon: typeof Leaf; title: string; copy: string }) {
  return (
    <div className="feature">
      <div className="feature-icon">
        <Icon />
      </div>
      {/* A short tile label, not a document section → not a heading (keeps H1 → H2 order intact). */}
      <p className="feature-title">{title}</p>
      <p>{copy}</p>
    </div>
  );
}

/** Slides visible at once; mirrors the carousel CSS breakpoints. */
const getItemsPerPage = () => (window.matchMedia("(max-width: 640px)").matches ? 1 : window.matchMedia("(max-width: 1024px)").matches ? 2 : 3);

/** 1×1 transparent GIF used as a <source> to hold back a carousel slide's download until it is needed. */
const DEFERRED_IMAGE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const heroPhoto = resolveImage(siteIdentity.heroImage);

export function HomePage() {
  const [start, setStart] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  // Slides with index < loadLimit may download. 0 = server/first render: CSS media
  // queries decide (1 slide ≤640px, 2 ≤1024px, else 3) so hydration matches SSR.
  const [loadLimit, setLoadLimit] = useState(0);
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
    // matchMedia listeners fire only when a breakpoint is crossed (no per-resize layout reads).
    const small = window.matchMedia("(max-width: 640px)");
    const medium = window.matchMedia("(max-width: 1024px)");
    const updateItemsPerPage = () => setItemsPerPage(getItemsPerPage());
    updateItemsPerPage();
    small.addEventListener("change", updateItemsPerPage);
    medium.addEventListener("change", updateItemsPerPage);
    return () => {
      small.removeEventListener("change", updateItemsPerPage);
      medium.removeEventListener("change", updateItemsPerPage);
    };
  }, []);

  useEffect(() => {
    // Visible slides may load now. The next slide is fetched once the page is idle after load,
    // so it is ready before the carousel advances (every 3.5s) without competing with the
    // initial render. Never shrinks, so loaded slides stay loaded.
    // Read the breakpoint directly: on the first pass `itemsPerPage` still holds the SSR default.
    const visible = getItemsPerPage();
    setLoadLimit((limit) => Math.max(limit, start + visible));
    let cancelIdle: (() => void) | undefined;
    const primeNext = () => {
      const loadNext = () => setLoadLimit((limit) => Math.max(limit, start + visible + 1));
      if (typeof window.requestIdleCallback === "function") {
        const handle = window.requestIdleCallback(loadNext, { timeout: 1500 });
        cancelIdle = () => window.cancelIdleCallback(handle);
      } else {
        // Safari < 18 has no requestIdleCallback
        const handle = setTimeout(loadNext, 200);
        cancelIdle = () => clearTimeout(handle);
      }
    };
    if (document.readyState === "complete") primeNext();
    else window.addEventListener("load", primeNext, { once: true });
    return () => {
      window.removeEventListener("load", primeNext);
      cancelIdle?.();
    };
  }, [start, itemsPerPage]);

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
        {/* LCP image. ≤900px the hero is a tall column that only shows the photo's centre strip,
            so phones get a native-resolution centre crop (visually identical, far fewer bytes). */}
        <picture>
          {heroPhoto?.mobile?.avifSrc && <source media="(max-width: 900px)" type="image/avif" srcSet={heroPhoto.mobile.avifSrc} width={heroPhoto.mobile.width} height={heroPhoto.mobile.height} />}
          {heroPhoto?.mobile && <source media="(max-width: 900px)" type="image/webp" srcSet={heroPhoto.mobile.src} width={heroPhoto.mobile.width} height={heroPhoto.mobile.height} />}
          {heroPhoto?.avifSrcSet && <source type="image/avif" srcSet={heroPhoto.avifSrcSet} sizes="100vw" />}
          <img
            className="hero-bg-img"
            src={heroPhoto?.src ?? siteIdentity.heroImage}
            srcSet={heroPhoto?.srcSet}
            sizes={heroPhoto ? "100vw" : undefined}
            width={heroPhoto?.width}
            height={heroPhoto?.height}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
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
                  {carouselProducts.map((product, index) => {
                    const image = resolveImage(product.heroImage);
                    // First render: slide 0 always loads; slide 1 only above 640px; slide 2 only above 1024px.
                    const deferMedia = loadLimit === 0 ? (index === 0 ? null : index === 1 ? "(max-width: 640px)" : index === 2 ? "(max-width: 1024px)" : "all") : index < loadLimit ? null : "all";
                    const isClone = index >= heroProducts.length;
                    return (
                      <div
                        className="hero-carousel-item"
                        key={`${product.slug}-${index}`}
                        aria-hidden={isClone ? true : undefined}
                        style={{ flex: `0 0 ${100 / itemsPerPage}%`, width: `${100 / itemsPerPage}%`, maxWidth: `${100 / itemsPerPage}%` }}
                      >
                        <Link href={`/products/${product.slug}`} className="hero-carousel-card" tabIndex={isClone ? -1 : undefined}>
                          <picture>
                            {deferMedia && <source media={deferMedia} srcSet={DEFERRED_IMAGE} />}
                            <img
                              className="hero-carousel-img"
                              src={image?.src ?? product.heroImage}
                              srcSet={image?.srcSet}
                              sizes={image ? "(max-width: 640px) 190px, 240px" : undefined}
                              width={image?.width}
                              height={image?.height}
                              alt={product.imageAlt}
                              // below the fold on phones; on desktop the browser still fetches in-view slides right after layout
                              loading="lazy"
                              decoding="async"
                            />
                          </picture>
                          <span className="hero-carousel-title">{product.name}</span>
                        </Link>
                      </div>
                    );
                  })}
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
                  aria-current={index === start % heroProducts.length ? "true" : undefined}
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
              <ResponsiveImage
                src="/assets/story-spice-mortar_d4ded661.jpg"
                alt="Traditional stone mortar and pestle grinding whole spices"
                sizes="(max-width: 900px) calc(100vw - 42px), (max-width: 1100px) 36vw, 465px"
              />
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
