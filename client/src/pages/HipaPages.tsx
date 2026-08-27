import { ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, Download, Heart, Leaf, Mail, MapPin, Package, Phone, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useEffect, useState } from "react";
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
  "how-to-choose-sambar-powder": [
    { href: "/products/sambar-powder", label: "Explore Sambar Powder", detail: "View the current HIPA Sambar Powder product information." },
    { href: "/products", label: "Browse all HIPA products", detail: "Compare the available HIPA Masala range for everyday cooking." },
    { href: "/contact#enquire", label: "Contact HIPA for product details", detail: "Ask for further pack or product information." },
  ],
  "how-to-read-a-spice-powder-label": [
    { href: "/products", label: "Browse HIPA Masala products", detail: "Explore the current HIPA product range." },
    { href: "/faq", label: "Read product questions and answers", detail: "Review the current HIPA product-information FAQ." },
    { href: "/contact#enquire", label: "Contact HIPA for product details", detail: "Ask for further pack or product information." },
  ],
  "garam-masala-vs-other-indian-masalas": [
    { href: "/products/garam-masala", label: "Explore Garam Masala", detail: "View the current HIPA Garam Masala product information." },
    { href: "/products/sambar-powder", label: "Explore Sambar Powder", detail: "Compare a product intended for sambar-style dishes." },
    { href: "/products/rasam-powder", label: "Explore Rasam Powder", detail: "Compare a product intended for rasam-style dishes." },
  ],
  "how-spice-quality-affects-food-taste": [
    { href: "/products", label: "Browse HIPA Masala products", detail: "Explore the current HIPA product range." },
    { href: "/faq", label: "Read product questions and answers", detail: "Review the current HIPA product-information FAQ." },
    { href: "/contact#enquire", label: "Contact HIPA for product details", detail: "Ask for further pack or product information." },
  ],
  "south-indian-lunch-box-recipes": [
    { href: "/products/sambar-powder", label: "Explore Sambar Powder", detail: "View the current HIPA Sambar Powder product information." },
    { href: "/products/rasam-powder", label: "Explore Rasam Powder", detail: "View the current HIPA Rasam Powder product information." },
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

const productGuidesBySlug: Record<string, ArticleResource> = {
  "sambar-powder": { href: "/blog/how-to-choose-sambar-powder", label: "Read the Sambar Powder buying guide", detail: "Practical checks for choosing a sambar powder for everyday cooking." },
  "rasam-powder": { href: "/blog/south-indian-lunch-box-recipes", label: "Read South Indian lunch box ideas", detail: "Explore everyday South Indian meal ideas that include simple sambar and rasam pairings." },
  "turmeric-powder": { href: "/blog/how-to-read-a-spice-powder-label", label: "Read the spice-label guide", detail: "Use practical label checks when comparing spice powder products." },
  "red-chilli-powder": { href: "/blog/how-to-read-a-spice-powder-label", label: "Read the spice-label guide", detail: "Use practical label checks when comparing spice powder products." },
  "coriander-powder": { href: "/blog/what-makes-a-good-spice-powder", label: "Read the spice-powder buying guide", detail: "Learn general checks for choosing spice powders." },
  "cumin-powder": { href: "/blog/what-makes-a-good-spice-powder", label: "Read the spice-powder buying guide", detail: "Learn general checks for choosing spice powders." },
  "pepper-powder": { href: "/blog/what-makes-a-good-spice-powder", label: "Read the spice-powder buying guide", detail: "Learn general checks for choosing spice powders." },
  "garam-masala": { href: "/blog/garam-masala-vs-other-indian-masalas", label: "Read the Garam Masala guide", detail: "Understand general culinary differences between garam masala and other Indian masalas." },
};

function getArticleBlocks(body: string) {
  return body.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean).map((block) => block.startsWith("### ")
    ? { type: "subheading" as const, content: block.slice(4).trim() }
    : block.startsWith("## ")
      ? { type: "heading" as const, content: block.slice(3).trim() }
      : { type: "paragraph" as const, content: block });
}

function renderArticleInlineLinks(content: string, resources: ArticleResource[]) {
  const allowedHrefs = new Set(resources.map((resource) => resource.href));
  const linkPattern = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(content)) !== null) {
    if (match.index > lastIndex) nodes.push(content.slice(lastIndex, match.index));
    const label = match[1]?.trim() || "";
    const href = match[2]?.trim() || "";
    nodes.push(allowedHrefs.has(href) && label ? <Link href={href} key={`${href}-${match.index}`}>{label}</Link> : match[0]);
    lastIndex = linkPattern.lastIndex;
  }

  if (lastIndex < content.length) nodes.push(content.slice(lastIndex));
  return nodes.length ? nodes : content;
}

function Breadcrumbs({ current }: { current: string }) {
  return <nav className="replica-breadcrumb" aria-label="Breadcrumb"><div className="container"><Link href="/">Home</Link><span>/</span><strong>{current}</strong></div></nav>;
}

function ProductAvailabilityLabel({ slug }: { slug: string }) {
  const availability = trpc.productAvailability.publicList.useQuery(undefined, { staleTime: 30_000, refetchOnWindowFocus: false });
  if (availability.isError) return <p className="product-availability checking">Contact HIPA for availability</p>;
  if (availability.isLoading && !availability.data) return <p className="product-availability checking">Checking availability</p>;
  const status = availability.data?.find((record) => record.productSlug === slug)?.status || "available";
  return <p className={`product-availability ${status}`}>{status === "available" ? "Available" : "Currently unavailable"}</p>;
}

function ProductCard({ product, compact = false }: { product: (typeof products)[number]; compact?: boolean }) {
  const sourceCollectionAssets: Record<string, string> = {
    "sambar-powder": "/assets/sambar-collection_1befbb00.webp",
    "rasam-powder": "/assets/rasam-collection_9ee665cf.webp",
    "garam-masala": "/assets/garam-collection_bf93a09b.webp",
    "coriander-powder": "/assets/coriander-collection_65f09b3e.webp",
    "pepper-powder": "/assets/pepper-collection_62ecec6f.webp",
  };
  return <article className={`product-card ${compact ? "product-card-compact" : ""}`}><Link href={`/products/${product.slug}`} className="product-media"><img src={sourceCollectionAssets[product.slug] || product.image} alt={product.imageAlt} loading="lazy" decoding="async" /></Link><h3 className="product-name">{product.name}</h3>{!compact && <><ProductAvailabilityLabel slug={product.slug} /><Link href={`/products/${product.slug}`} className="btn btn-outline btn-sm">View Details <span className="arrow">→</span></Link></>}</article>;
}

function CatalogueProductCard({ product }: { product: (typeof products)[number] }) {
  return <article className="catalogue-product-card"><Link href={`/products/${product.slug}`} className="catalogue-product-media"><img src={product.image} alt={product.imageAlt} loading="lazy" decoding="async" /></Link><div className="catalogue-product-copy"><h2>{product.name}</h2><p className="catalogue-product-description">{product.shortDescription}</p><ul className="catalogue-product-highlights">{product.highlights.map((item) => <li key={item}>{item}</li>)}</ul>{product.packSizes && <div className="catalogue-product-packs" aria-label={`${product.name} pack details`}>{product.packSizes.map((size) => <span key={size}>{size}</span>)}</div>}<ProductAvailabilityLabel slug={product.slug} /><div className="catalogue-product-actions"><Link href={`/products/${product.slug}`} className="btn btn-primary btn-sm">View Details <span className="arrow">→</span></Link><a href={`/products/${product.slug}#product-enquiry`} className="btn btn-outline btn-sm" onClick={() => trackEvent("product_enquiry_cta", { product: product.name, location: "catalogue" })}>Enquire Now</a><a href={siteIdentity.whatsappHref} target="_blank" rel="noreferrer" className="catalogue-whatsapp-link" onClick={() => trackEvent("whatsapp_click", { product: product.name, location: "catalogue" })}>WhatsApp Enquiry</a></div></div></article>;
}

function Feature({ icon: Icon, title, copy }: { icon: typeof Leaf; title: string; copy: string }) {
  return <div className="feature"><div className="feature-icon"><Icon /></div><h3>{title}</h3><p>{copy}</p></div>;
}

export function HomePage() {
  const [start, setStart] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [animateCarousel, setAnimateCarousel] = useState(true);
  const [pauseCarousel, setPauseCarousel] = useState(false);
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
  const homeCollectionProducts = ["sambar-powder", "rasam-powder", "garam-masala", "coriander-powder", "pepper-powder"].map((slug) => products.find((product) => product.slug === slug)).filter((product): product is (typeof products)[number] => Boolean(product));
  const carouselProducts = [...heroProducts, ...heroProducts.slice(0, 3)];

  useEffect(() => {
    const updateItemsPerPage = () => setItemsPerPage(window.innerWidth <= 560 ? 1 : window.innerWidth <= 900 ? 2 : 3);
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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const moveNext = () => {
    setStart((current) => current < heroProducts.length ? current + 1 : current);
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
  const steps = [
    ["01", "Available Products", "Explore HIPA Masalas products for everyday Indian cooking."],
    ["02", "Product Information", "Contact HIPA Masalas for further ingredient and recipe details."],
    ["03", "Traditional Inspiration", "The HIPA range is inspired by Indian kitchen recipes."],
    ["04", "Pack Details", "Contact HIPA Masalas for further pack and product details."],
    ["05", "Further Details", "Contact HIPA Masalas for the latest available product information."],
  ];
  return <div className="home-page">
    <section className="hero" id="home"><img className="hero-bg-img" src={siteIdentity.heroImage} alt="" aria-hidden="true" fetchPriority="high" decoding="async" /><div className="container hero-inner"><div className="hero-copy hero-copy-enter"><p className="eyebrow">Indian Spice Powders &amp; Masala Blends</p><h1>HIPA Masalas<br /><span>Indian Spice Powders for<br />Every Kitchen</span></h1><p className="hero-desc">HIPA Masalas is a Chennai, Tamil Nadu spice and masala manufacturer serving everyday consumers and enquiries from distributors, dealers, wholesalers, retailers, supermarkets, restaurants and exporters. Explore the current range or contact HIPA for product, pack and supply information.</p><div className="hero-btns"><Link href="/products" className="btn btn-primary">Explore Products <span className="arrow">→</span></Link><a href="/assets/hipa-masalas-brochure.pdf" download="HIPA-Masalas-Brochure.pdf" className="btn btn-brochure-download"><Download size={16} aria-hidden="true" />Download Brochure</a><a href="#story" className="btn btn-outline">Our Story <span className="arrow">→</span></a></div></div><div className="hero-art hero-art-enter" onMouseEnter={() => setPauseCarousel(true)} onMouseLeave={() => setPauseCarousel(false)}><div className="hero-art-glow" /><div className="hero-badge"><span>HIPA</span><small>Masalas</small></div><div className="hero-carousel-container"><div className="hero-carousel-track-wrapper"><div className="hero-carousel-track" style={{ transform: `translateX(-${start * (100 / itemsPerPage)}%)`, transition: animateCarousel ? "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)" : "none" }}>{carouselProducts.map((product, index) => <div className="hero-carousel-item" key={`${product.slug}-${index}`}><Link href={`/products/${product.slug}`} className="hero-carousel-card"><img className="hero-carousel-img" src={product.heroImage} alt={product.imageAlt} loading={index < 3 ? "eager" : "lazy"} fetchPriority={index < 3 ? "high" : "low"} decoding="async" /><span className="hero-carousel-title">{product.name}</span></Link></div>)}</div></div></div><button className="hero-slider-nav prev" type="button" aria-label="Previous product" onClick={movePrevious}><ChevronLeft /></button><button className="hero-slider-nav next" type="button" aria-label="Next product" onClick={moveNext}><ChevronRight /></button><div className="hero-slider-dots">{heroProducts.map((product, index) => <button key={product.slug} type="button" className={`hero-dot ${index === start % heroProducts.length ? "is-active" : ""}`} aria-label={`Show ${product.name}`} onClick={() => selectSlide(index)} />)}</div></div></div></section>
    <section className="features reveal"><div className="container features-grid"><Feature icon={Leaf} title="Traditional Spice Powders" copy="Explore the available HIPA Masala product range." /><Feature icon={Sparkles} title="Product Information" copy="Contact HIPA for further ingredient and recipe details." /><Feature icon={ShieldCheck} title="Pack Details" copy="Contact HIPA for current pack details." /><Feature icon={Heart} title="Everyday Cooking" copy="Discover masala powders for Indian kitchen use." /><Feature icon={Package} title="Available Products" copy="Contact HIPA for further product details." /><Feature icon={Heart} title="Contact HIPA" copy="Ask the team for further information." /></div></section>
    <section className="collection reveal" id="products"><div className="container"><div className="collection-head"><p className="eyebrow">Discover Our</p><h2>Traditional Collection</h2><p className="section-desc">Explore available HIPA Masala spice powders. Contact HIPA for further product and pack details.</p><Link href="/products" className="btn btn-outline">View All Products <span className="arrow">→</span></Link></div><div className="product-grid">{homeCollectionProducts.map((product) => <ProductCard key={product.slug} product={product} />)}</div></div></section>
    <section className="story reveal" id="story"><div className="container story-inner"><div className="story-copy"><p className="eyebrow eyebrow-light">Our Story</p><h2>Every Spoonful Carries<br />a Family Tradition</h2><p>Indian kitchens have long celebrated the aroma and flavour of traditional spice recipes. HIPA Masala products draw inspiration from this culinary tradition.</p><p>Explore the available HIPA product range for everyday cooking, then contact HIPA for further details.</p><ul className="story-points"><li><span className="point-icon"><Leaf /></span>Traditional Inspiration</li><li><span className="point-icon"><Heart /></span>Product Information</li><li><span className="point-icon"><Sparkles /></span>Further Details</li></ul></div><div className="story-art"><img src="/assets/story-spice-mortar_d4ded661.jpg" alt="Hands grinding whole spices in a stone mortar and pestle" /><div className="story-quote">Taste of Tradition</div></div></div></section>
    <section className="process reveal"><div className="container process-inner"><div className="process-head"><p className="eyebrow">HIPA Masala</p><h2>Available Products</h2><p>Contact HIPA for further details about the current range.</p></div><ol className="process-steps">{steps.map(([number, title, copy], index) => <li key={number}><span className="step-num">{number}</span><span className="step-icon">{index === 0 ? <Leaf /> : index === 4 ? <Truck /> : <Check />}</span><h4>{title}</h4><p>{copy}</p></li>)}</ol></div></section>
    <section className="cta-band reveal"><div className="container cta-inner"><div><h2>Bring Tradition to Your Kitchen</h2><p>Get recipes, offers and new blends straight to your inbox.</p></div><NewsletterForm /></div></section>
  </div>;
}

export function ProductsPage() { return <><Breadcrumbs current="Products" /><section className="catalogue-page"><div className="container"><div className="collection-head catalogue-head"><p className="eyebrow">HIPA Masala</p><h1>Traditional Collection</h1><p className="section-desc">Discover available HIPA traditional spice powders. Contact HIPA for further product details.</p><div className="catalogue-filter-label" aria-label="Product category">Masala Powders</div></div><div className="catalogue-product-grid">{products.map((product) => <CatalogueProductCard product={product} key={product.slug} />)}</div></div></section><section className="catalogue-enquiry-section" id="distributor-enquiry"><div className="container catalogue-enquiry-grid"><div className="catalogue-enquiry-copy"><p className="eyebrow">Product Enquiries</p><h2>Request Product Details</h2><p>Use the form to ask about an available HIPA Masala product. Choose <strong>Distributor</strong> under Business Type if that best describes your enquiry.</p><p className="catalogue-enquiry-note">Distributor, wholesale and bulk-order information will be shared only when HIPA confirms that those operations are active.</p></div><div className="contact-form-card catalogue-enquiry-form"><h3>Distributor / Product Enquiry</h3><p>Fields marked * are required.</p><EnquiryForm formId="catalogue-enquiry" variant="distributor" /></div></div></section><section className="catalogue-faq-section"><div className="container"><div className="collection-head"><p className="eyebrow">Common Questions</p><h2>Product Information</h2><p className="section-desc">Clear answers about current HIPA Masala product information and enquiries.</p></div><div className="catalogue-faq-list">{faqs.slice(0, 4).map((faq, index) => <details key={faq.question} className="catalogue-faq-item" open={index === 0}><summary>{faq.question}<ChevronDown size={16} /></summary><p>{faq.answer}</p></details>)}</div></div></section></>; }

export function ProductDetailPage() {
  const [, params] = useRoute("/products/:slug");
  const product = getProduct(params?.slug || "");
  if (!product) return <NotFoundPage />;
  const guide = productGuidesBySlug[product.slug];
  const productFaqs = getProductFaqs(product);
  return <><Breadcrumbs current={product.name} /><section className="product-replica"><div className="container product-replica-grid"><div className="product-replica-image product-detail-enter"><img src={product.image} alt={product.imageAlt} fetchPriority="high" decoding="async" /></div><div className="product-replica-copy product-detail-enter"><p className="eyebrow">HIPA MASALAS · TASTE OF TRADITION</p><h1>{product.name}</h1><p>{product.description}</p><ProductAvailabilityLabel slug={product.slug} /><ul className="product-highlights">{product.highlights.map((item) => <li key={item}>{item}</li>)}</ul>{product.packSizes && <div className="replica-packs" aria-label={`${product.name} pack sizes`}>{product.packSizes.map((size) => <span key={size}>{size}</span>)}</div>}{guide && <p className="product-guide-link"><Link href={guide.href}>{guide.label}</Link><span>{guide.detail}</span></p>}<div className="replica-product-actions"><Link href="/contact#enquire" className="btn btn-outline" onClick={() => trackEvent("product_enquiry_cta", { product: product.name })}>Enquire Now</Link><a href={siteIdentity.whatsappHref} target="_blank" rel="noreferrer" className="btn btn-whatsapp-live" onClick={() => trackEvent("whatsapp_click", { product: product.name })}>WhatsApp Enquiry</a></div></div></div></section><section className="product-faq-section"><div className="container"><div className="product-faq-heading"><p className="eyebrow">Product Questions</p><h2>{product.name} Questions and Answers</h2><p>Concise information based on the current product page and enquiry options.</p></div><div className="product-faq-list">{productFaqs.map((faq, index) => <details key={faq.question} className="product-faq-item" open={index === 0}><summary>{faq.question}<ChevronDown size={16} /></summary><p>{faq.answer}</p></details>)}</div></div></section><section className="related-products"><div className="container"><h2>Explore More Products</h2><div className="product-grid product-grid-compact">{products.filter((item) => item.slug !== product.slug).map((item) => <ProductCard key={item.slug} product={item} compact />)}</div></div></section></>;
}

export function FaqPage() { return <><Breadcrumbs current="FAQ" /><section className="faq-hero"><div className="container"><h1>Frequently Asked Questions</h1><p>Clear information about HIPA Masalas, the current product range and ways to contact the Chennai team.</p></div></section><section className="faq-shell"><div className="faq-container">{faqs.map((faq, index) => <details className="faq-live-item" key={faq.question} open={index === 0}><summary>{faq.question}<span><ChevronDown size={15} /></span></summary><p>{faq.answer}</p></details>)}<div className="faq-support"><h2>Have More Questions?</h2><p>Contact HIPA Masalas for current product information.</p><div className="hero-btns"><Link href="/contact#enquire" className="btn btn-outline">Send an Enquiry</Link><a href={siteIdentity.whatsappHref} target="_blank" rel="noreferrer" className="btn btn-outline" onClick={() => trackEvent("whatsapp_click", { location: "faq" })}>WhatsApp Support</a></div></div></div></section></>; }

function InfoCard({ icon: Icon, title, children }: { icon: typeof MapPin; title: string; children: React.ReactNode }) { return <div className="info-card"><div className="info-card-icon"><Icon /></div><h3>{title}</h3><p>{children}</p></div>; }

export function ContactPage() {
  const cityMapUrl = "https://www.google.com/maps?q=Chennai,+Tamil+Nadu,+India";
  const cityMapEmbedUrl = "https://www.google.com/maps?q=Chennai,+Tamil+Nadu,+India&output=embed";
  return <><section className="contact-hero"><div className="container contact-hero-inner"><p className="eyebrow">Get in Touch</p><h1>Contact HIPA Masalas</h1><p>HIPA Masalas is based in Chennai, Tamil Nadu, India. Contact the team for current product information or general support.</p></div></section><section className="info-cards-section"><div className="container info-cards-row"><InfoCard icon={MapPin} title="Location">{siteIdentity.locationLabel}</InfoCard><InfoCard icon={Phone} title="Phone Number"><a href={siteIdentity.phoneHref} onClick={() => trackEvent("phone_click", { location: "contact" })}>{siteIdentity.phone}</a></InfoCard><InfoCard icon={Mail} title="Email Address"><a href={`mailto:${siteIdentity.email}`}>{siteIdentity.email}</a></InfoCard></div></section><section className="contact-main" id="enquire"><div className="container contact-grid"><div className="contact-form-card"><h2>Send Us an Enquiry</h2><p>Fill in the form below for further product details. Fields marked * are required.</p><EnquiryForm /></div><aside className="contact-side"><div className="map-card"><iframe className="contact-map-frame" src={cityMapEmbedUrl} title="HIPA Masalas Chennai map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><div className="map-card-info"><h3>Find Us Here</h3><p>{siteIdentity.locationLabel}</p><a className="map-open-link" href={cityMapUrl} target="_blank" rel="noreferrer">Open in Google Maps</a></div></div><div className="whatsapp-cta"><h3>Prefer a Quick Chat?</h3><p>For further product details, message HIPA Masalas directly on WhatsApp or give the team a call.</p><a id="whatsappCtaBtn" href={siteIdentity.whatsappHref} target="_blank" rel="noreferrer" className="btn btn-primary" onClick={() => trackEvent("whatsapp_click", { location: "contact" })}>Chat on WhatsApp</a></div></aside></div></section></>;
}

export function B2BEnquiriesPage() { return <><Breadcrumbs current="Product Enquiry" /><section className="contact-hero"><div className="container contact-hero-inner"><p className="eyebrow">Business Product Enquiries</p><h1>Masala Manufacturer for Distributor, Dealer & Export Enquiries</h1><p>HIPA Masalas supplies spice powders and masala blends for consumer, wholesale, distributor, dealer, retail, food-service and export enquiries. Use this page to tell us what products and supply information you need.</p></div></section><section className="b2b-enquiry-section"><div className="container b2b-enquiry-grid"><div className="b2b-enquiry-copy"><p className="eyebrow">Before You Submit</p><h2>Help HIPA Masalas understand your enquiry</h2><p>Share the product you are interested in, your business type and your city or region. You can also include an expected monthly volume if it is known.</p><ul><li>Choose the current product you want to ask about.</li><li>Select the business type that best describes your enquiry.</li><li>Add your city or region for context.</li><li>Use the message field for any further product questions.</li></ul><p className="b2b-enquiry-note">HIPA Masalas will respond with current product information relevant to the enquiry. Commercial availability, pricing, minimum order quantities, delivery, private-label and export details are confirmed directly for each enquiry.</p></div><div className="contact-form-card b2b-enquiry-form"><h2>Send an Enquiry</h2><p>Fields marked * are required.</p><EnquiryForm formId="b2b-enquiry" variant="distributor" /></div></div></section></>; }

export function PrivacyPage() { return <><Breadcrumbs current="Privacy" /><section className="journal-replica"><div className="container" style={{ maxWidth: 840 }}><p className="eyebrow">Privacy</p><h1>Privacy Policy</h1><p className="section-desc">HIPA Masalas uses the details submitted through this website to respond to enquiries. When no database is configured, newsletter signup requests are saved only in the visitor’s browser on that device.</p><div className="article-body"><h2>Information submitted through this website</h2><p className="section-desc">Enquiry forms may collect a name, mobile number, email address, business type, product interest, message and, where provided, city or region and expected monthly volume. Newsletter subscriptions collect an email address and consent.</p><h2>How HIPA Masalas uses this information</h2><p className="section-desc">HIPA Masalas uses submitted enquiry details to respond to the relevant request and manage product enquiries. Without a database, newsletter signup details remain in the visitor’s browser only and are not centrally collected. You can contact HIPA Masalas through the Contact page to ask about information you have submitted.</p><h2>Consent</h2><p className="section-desc">The enquiry and newsletter forms require consent before submission. Do not submit information you do not wish HIPA Masalas to use for the stated purpose.</p></div></div></section></>; }

export function AboutPage() {
  return <>
    <Breadcrumbs current="About" />
    <section className="contact-hero"><div className="container contact-hero-inner"><p className="eyebrow">About HIPA Masalas</p><h1>A Taste of Tradition from Chennai</h1><p>HIPA Masalas is an Indian spice and masala brand based in Chennai, Tamil Nadu, India. The website presents the current range of spice powders and masala blends for everyday cooking.</p></div></section>
    <section className="journal-replica about-page"><div className="container" style={{ maxWidth: 840 }}><p className="eyebrow">Our Story</p><h2>Indian spice inspiration for everyday kitchens</h2><p className="section-desc">Indian kitchens have long celebrated the aroma and flavour of traditional spice recipes. HIPA Masalas draws inspiration from this culinary tradition and shares product information for people exploring familiar Indian cooking ingredients.</p><p className="section-desc">Explore the current HIPA Masalas range, read practical spice guides, or contact the team for further product and pack information.</p><div className="hero-btns"><Link href="/products" className="btn btn-primary">Explore Products <span className="arrow">→</span></Link><Link href="/contact#enquire" className="btn btn-outline">Contact HIPA <span className="arrow">→</span></Link></div></div></section>
  </>;
}

export function TermsOfServicePage() {
  return <>
    <Breadcrumbs current="Terms of Service" />
    <section className="journal-replica terms-page"><div className="container" style={{ maxWidth: 840 }}><p className="eyebrow">Website Terms</p><h1>Terms of Service</h1><p className="section-desc">These terms describe the general use of the HIPA Masalas website and its product-information, blog and enquiry features.</p><div className="article-body"><h2>Using this website</h2><p className="section-desc">You may use this website to read information about HIPA Masalas, review the current listed product range, read published guides and contact the team. Please use the website lawfully and do not attempt to disrupt, misuse or gain unauthorised access to any part of it.</p><h2>Product and enquiry information</h2><p className="section-desc">Product names, descriptions, pack details and availability shown on the website are current informational listings and may change. Pricing, commercial terms, minimum quantities, delivery, private-label and export details are confirmed directly by HIPA Masalas for each enquiry.</p><h2>Enquiry details</h2><p className="section-desc">When you submit an enquiry, provide information that is accurate enough for HIPA Masalas to respond. The website privacy page explains how submitted enquiry and newsletter details are handled.</p><h2>External links</h2><p className="section-desc">The website may link to external services such as WhatsApp, Google Maps and social-media pages. Those services have their own terms and privacy practices.</p><h2>Changes to these terms</h2><p className="section-desc">HIPA Masalas may update these website terms when the website features or information change. The current version will remain available on this page.</p><h2>Contact</h2><p className="section-desc">For questions about these terms or the information on this website, contact HIPA Masalas through the <Link href="/contact">Contact page</Link>.</p></div></div></section>
  </>;
}

export function BlogPage() {
  const [query, setQuery] = useState("");
  const publishedPosts = trpc.blog.publishedList.useQuery();
  const normalizedQuery = query.trim().toLowerCase();
  const visibleArticles = (publishedPosts.data || []).filter((article) => !normalizedQuery || `${article.title} ${article.description}`.toLowerCase().includes(normalizedQuery));

  return <>
    <Breadcrumbs current="Blog" />
    <section className="blog-live-hero"><div className="container"><p className="eyebrow">Recipes &amp; Spice Knowledge</p><h1>HIPA Masalas Blog</h1><p>Explore practical spice guides, South Indian cooking ideas and current product information from HIPA Masalas.</p></div></section>
    <section className="blog-live-toolbar"><div className="container blog-live-toolbar-inner"><div className="blog-category-tabs" role="tablist" aria-label="Filter blog articles"><button className="is-active" type="button" role="tab" aria-selected="true">All</button></div><label className="blog-search-field"><span className="sr-only">Search blog articles</span><input value={query} type="search" name="blog-query" placeholder="Search blog articles..." onChange={(event) => setQuery(event.target.value)} /><span aria-hidden="true">⌕</span></label></div></section>
    <section className="blog-live-collection"><div className="container">{publishedPosts.isLoading ? <div className="blog-live-empty"><span aria-hidden="true">▤</span><h2>Loading articles</h2><p>Please wait while the latest published articles load.</p></div> : publishedPosts.isError ? <div className="blog-live-empty"><span aria-hidden="true">▤</span><h2>Articles are temporarily unavailable</h2><p>Please try again shortly.</p></div> : visibleArticles.length ? <div className="blog-live-grid">{visibleArticles.map((article) => <article className="blog-live-card" key={article.slug}>{article.coverImageUrl ? <img className="blog-live-card-cover" src={article.coverImageUrl} alt={article.coverImageAlt || ""} loading="lazy" decoding="async" /> : null}<div className="blog-live-card-copy"><p className="eyebrow">HIPA Journal</p><h2>{article.title}</h2><p>{article.description}</p><Link href={`/blog/${article.slug}`} className="btn btn-outline btn-sm">Read Article <span className="arrow">→</span></Link></div></article>)}</div> : <div className="blog-live-empty"><span aria-hidden="true">▤</span><h2>{normalizedQuery ? "No articles found" : "Coming Soon"}</h2><p>{normalizedQuery ? "Try a different search term." : "Our latest blogs will appear here."}</p></div>}</div></section>
    <section className="blog-live-newsletter"><div className="container blog-live-newsletter-inner"><div><h2>Stay Updated with HIPA Masalas</h2><p>Subscribe to receive practical spice guides, cooking tips and product updates.</p></div><NewsletterForm /></div></section>
  </>;
}

export function ArticlePage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";
  const postQuery = trpc.blog.publishedBySlug.useQuery({ slug }, { enabled: Boolean(slug) });
  const article = postQuery.data;

  useEffect(() => {
    if (article) document.title = `${article.title} | HIPA Masalas`;
  }, [article]);

  if (!article) {
    return postQuery.isLoading
      ? <section className="journal-replica"><div className="container"><p className="section-desc">Loading article…</p></div></section>
      : <NotFoundPage />;
  }

  const publishedDate = (article.publishedAt || article.createdAt).toISOString().slice(0, 10);
  const blocks = getArticleBlocks(article.body);
  const relatedResources = articleResourcesBySlug[article.slug] || [];
  const inlineResources = [...relatedResources, ...(articleInlineLinksBySlug[article.slug] || [])];

  return <>
    <Breadcrumbs current={article.title} />
    <article className="journal-replica">
      <div className="container" style={{ maxWidth: 840 }}>
        <p className="eyebrow">HIPA Journal</p>
        <h1>{article.title}</h1>
        <p className="section-desc">By {article.authorName} · {publishedDate}</p>
        {article.coverImageUrl && <img src={article.coverImageUrl} alt={article.coverImageAlt || ""} loading="eager" fetchPriority="high" decoding="async" style={{ borderRadius: 18, marginBottom: 28 }} />}
        <div className="article-body">
          {blocks.map((block, index) => block.type === "heading"
            ? <h2 key={`${block.content}-${index}`}>{block.content}</h2>
            : block.type === "subheading"
              ? <h3 key={`${block.content}-${index}`}>{block.content}</h3>
              : <p key={`${block.content}-${index}`} className="section-desc">{renderArticleInlineLinks(block.content, inlineResources)}</p>)}
        </div>
        {relatedResources.length > 0 && <aside className="article-related-links" aria-labelledby="related-hipa-pages">
          <p className="eyebrow">Continue exploring</p>
          <h2 id="related-hipa-pages">Related HIPA pages</h2>
          <p>Use these links to explore relevant product information or ask HIPA for further details.</p>
          <ul>
            {relatedResources.map((resource) => <li key={resource.href}>
              <Link href={resource.href}>{resource.label}</Link>
              <span>{resource.detail}</span>
            </li>)}
          </ul>
        </aside>}
      </div>
    </article>
  </>;
}

export function NotFoundPage() { return <section className="journal-replica"><div className="container"><div className="empty-state"><p className="eyebrow">404</p><h1>That page is not available.</h1><p>The page may have moved to a clean HIPA URL or may not be ready for publication.</p><Link href="/" className="btn btn-primary">Return Home</Link></div></div></section>; }
