export type Product = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  image: string;
  imageAlt: string;
  highlights: string[];
  packSizes?: string[];
};

export type Faq = {
  question: string;
  answer: string;
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  body: string[];
  authorName: string;
  publishedAt: string;
  modifiedAt?: string;
  image?: string;
  imageAlt?: string;
  complete: boolean;
};

export type PageHead = {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  ogImageAlt?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  notFound?: boolean;
  article?: Article;
};

export const siteIdentity = {
  name: "HIPA Masalas",
  tagline: "Taste of Tradition",
  phone: "+91 70580 53055",
  phoneHref: "tel:+917058053055",
  email: "info@hipamasalas.com",
  locationLabel: "Chennai, Tamil Nadu, India",
  logo: "/assets/logo_a24808ac.png",
  heroImage: "/assets/hero-spices_8241cadf.webp",
  facebook: "https://www.facebook.com/profile.php?id=61592093192345",
  instagram: "https://www.instagram.com/hipa_masala/",
  whatsappHref:
    "https://wa.me/917058053055?text=Hi%20HIPA%20Masalas%2C%20I%27d%20like%20to%20know%20more%20about%20your%20products.",
} as const;

export const products: Product[] = [
  {
    slug: "sambar-powder",
    name: "Sambar Powder",
    shortDescription: "A South Indian spice blend for everyday sambar.",
    description:
      "HIPA Masalas lists Sambar Powder for everyday sambar preparation. Contact HIPA for current product and pack information.",
    image: "/assets/sambar_96379996.png",
    imageAlt: "HIPA Masalas Sambar Powder pack",
    highlights: ["For everyday sambar preparation", "Current pack sizes shown below", "Product enquiry available"],
    packSizes: ["100g", "200g", "500g", "1kg"],
  },
  {
    slug: "rasam-powder",
    name: "Rasam Powder",
    shortDescription: "A HIPA Masalas blend for rasam preparation.",
    description:
      "HIPA Masalas lists Rasam Powder for rasam preparation and everyday South Indian cooking. Contact HIPA for current product and pack information.",
    image: "/assets/rasam_b3831405.png",
    imageAlt: "HIPA Masalas Rasam Powder pack",
    highlights: ["For rasam preparation", "Current pack sizes shown below", "Product enquiry available"],
    packSizes: ["100g", "200g", "500g", "1kg"],
  },
  {
    slug: "turmeric-powder",
    name: "Turmeric Powder",
    shortDescription: "A HIPA Masalas turmeric powder product.",
    description: "HIPA Masalas lists Turmeric Powder for everyday kitchen use. Contact HIPA for current product and pack information.",
    image: "/assets/turmeric_1bd08fa7.png",
    imageAlt: "HIPA Masalas Turmeric Powder pack",
    highlights: ["Everyday kitchen use", "Current pack sizes shown below", "Product enquiry available"],
    packSizes: ["100g", "200g", "500g", "1kg"],
  },
  {
    slug: "red-chilli-powder",
    name: "Red Chilli Powder",
    shortDescription: "A HIPA Masalas red chilli powder product.",
    description: "HIPA Masalas lists Red Chilli Powder for dishes that use red chilli powder. Contact HIPA for current product and pack information.",
    image: "/assets/hipa-red-chilli-powder-pack_2e2de7c8.webp",
    imageAlt: "HIPA Masalas Red Chilli Powder pack",
    highlights: ["For recipes that use red chilli powder", "Current pack sizes shown below", "Product enquiry available"],
    packSizes: ["100g", "200g", "500g", "1kg"],
  },
  {
    slug: "coriander-powder",
    name: "Coriander Powder",
    shortDescription: "A HIPA Masalas coriander powder product.",
    description: "HIPA Masalas lists Coriander Powder for everyday cooking. Contact HIPA for current product and pack information.",
    image: "/assets/coriander_6db70131.png",
    imageAlt: "HIPA Masalas Coriander Powder pack",
    highlights: ["For everyday cooking", "Current pack sizes shown below", "Product enquiry available"],
    packSizes: ["100g", "200g", "500g", "1kg"],
  },
  {
    slug: "cumin-powder",
    name: "Cumin Powder",
    shortDescription: "A HIPA Masalas cumin powder product.",
    description: "HIPA Masalas lists Cumin Powder for everyday cooking. Contact HIPA for current product and pack information.",
    image: "/assets/cumin_cd53cea5.png",
    imageAlt: "HIPA Masalas Cumin Powder pack",
    highlights: ["For everyday cooking", "Current pack sizes shown below", "Product enquiry available"],
    packSizes: ["100g", "200g", "500g"],
  },
  {
    slug: "pepper-powder",
    name: "Pepper Powder",
    shortDescription: "A HIPA Masalas pepper powder product.",
    description: "HIPA Masalas lists Pepper Powder for everyday cooking. Contact HIPA for current product and pack information.",
    image: "/assets/pepper_36d6b66d.png",
    imageAlt: "HIPA Masalas Pepper Powder pack",
    highlights: ["For everyday cooking", "Current pack sizes shown below", "Product enquiry available"],
    packSizes: ["50g", "100g", "200g", "500g"],
  },
  {
    slug: "garam-masala",
    name: "Garam Masala",
    shortDescription: "A HIPA Masalas garam masala product.",
    description: "HIPA Masalas lists Garam Masala for everyday cooking. Contact HIPA for current product and pack information.",
    image: "/assets/garam-masala_6b465bcd.png",
    imageAlt: "HIPA Masalas Garam Masala pack",
    highlights: ["For everyday cooking", "Current pack sizes shown below", "Product enquiry available"],
    packSizes: ["100g", "200g", "500g"],
  },
];

export const faqs: Faq[] = [
  { question: "What is HIPA Masalas?", answer: "HIPA Masalas is an Indian spice and masala brand based in Chennai, Tamil Nadu, India. The current website presents its spice powder and masala blend range with product information and enquiry options." },
  { question: "Where is HIPA Masalas based?", answer: "HIPA Masalas is based in Chennai, Tamil Nadu, India. You can use the Contact page for the current phone number, email address and enquiry options." },
  { question: "What products does HIPA Masalas offer?", answer: "The current HIPA Masalas range includes Sambar Powder, Rasam Powder, Turmeric Powder, Red Chilli Powder, Coriander Powder, Cumin Powder, Pepper Powder and Garam Masala. Visit the Products page for the latest listed range." },
  { question: "What is HIPA Sambar Powder used for?", answer: "HIPA Sambar Powder is listed for everyday sambar preparation. Its product page presents the current pack information and gives you a direct way to request further details from HIPA Masalas." },
  { question: "What is HIPA Rasam Powder used for?", answer: "HIPA Rasam Powder is listed for rasam preparation and everyday South Indian cooking. Visit the product page or contact HIPA Masalas for the latest product information." },
  { question: "What is the difference between Sambar Powder and Rasam Powder?", answer: "HIPA Masalas lists Sambar Powder for sambar preparation and Rasam Powder for rasam preparation. The product pages describe the current listed purpose of each product; contact HIPA for further product information." },
  { question: "How can I contact HIPA Masalas?", answer: "You can contact HIPA Masalas by phone, email, WhatsApp or the website enquiry form. The Contact page shows the current contact details and map link." },
  { question: "Can businesses enquire about HIPA products?", answer: "Yes. Businesses can use the existing product enquiry form and select the relevant business type. HIPA Masalas will share current product information; wholesale, distributor and bulk-order information is provided only when those operations are confirmed active." },
];

// Articles move to the public blog only after an approved record has a complete,
// visible body. This prevents the placeholder/noindex failure found on the live site.
export const articles: Article[] = [];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug) ?? null;
}

export function getProductFaqs(product: Product): Faq[] {
  const packs = product.packSizes?.join(", ") || "the current listed pack sizes";
  return [
    { question: `What is HIPA Masalas ${product.name} used for?`, answer: product.description },
    { question: `What pack sizes are shown for HIPA Masalas ${product.name}?`, answer: `The current listed pack sizes for HIPA Masalas ${product.name} are ${packs}. Contact HIPA Masalas for the latest product and pack information.` },
    { question: `How can I enquire about HIPA Masalas ${product.name}?`, answer: `Use the Enquire Now or WhatsApp Enquiry option on the ${product.name} page to ask HIPA Masalas for current product information.` },
  ];
}

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug && article.complete) ?? null;
}

export function getIndexablePaths() {
  return [
    "/",
    "/products",
    ...products.map((product) => `/products/${product.slug}`),
    "/faq",
    "/contact",
    "/b2b-enquiries",
    "/blog",
    ...articles.filter((article) => article.complete).map((article) => `/blog/${article.slug}`),
  ];
}

const defaultDescription =
  "Discover HIPA Masalas spice powders, masala blends and current product information from Chennai, Tamil Nadu.";

export function getPageHead(pathname: string): PageHead {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/") {
    return {
      title: "HIPA Masalas | Indian Spices & Masalas in Chennai",
      description: "HIPA Masalas is an Indian spice and masala brand based in Chennai, Tamil Nadu, India, with a current range of spice powders and masala blends.",
      canonicalPath: "/",
      ogImage: siteIdentity.heroImage,
      ogImageAlt: "HIPA Masalas spice powder collection",
    };
  }

  if (path === "/products") {
    return {
      title: "Masala Powders & Spice Blends | HIPA Masalas",
      description: "Browse the current HIPA Masalas range of spice powders and masala blends. Contact HIPA for product and pack information.",
      canonicalPath: path,
      ogImage: products[0]?.image,
      ogImageAlt: products[0]?.imageAlt,
    };
  }

  const productMatch = path.match(/^\/products\/([^/]+)$/);
  if (productMatch) {
    const product = getProduct(productMatch[1]);
    if (!product) return { title: "Page not found | HIPA Masalas", description: defaultDescription, notFound: true };
    return {
      title: `${product.name} | HIPA Masalas`,
      description: product.description,
      canonicalPath: path,
      ogImage: product.image,
      ogImageAlt: product.imageAlt,
    };
  }

  if (path === "/faq") {
    return {
      title: "Frequently Asked Questions | HIPA Masalas",
      description: "Answers about HIPA Masalas, its Chennai location, the current product range and ways to enquire about products.",
      canonicalPath: path,
    };
  }

  if (path === "/contact") {
    return {
      title: "Contact HIPA Masalas | Chennai Product Enquiries",
      description: "Contact HIPA Masalas in Chennai, Tamil Nadu for current product information, enquiries and general support.",
      canonicalPath: path,
    };
  }

  if (path === "/b2b-enquiries") {
    return {
      title: "Product Enquiries | HIPA Masalas",
      description: "Use the HIPA Masalas product enquiry page for current product information and business or consumer enquiries.",
      canonicalPath: path,
    };
  }

  if (path === "/blog") {
    return {
      title: "HIPA Masalas Blog | Spice & Cooking Guides",
      description: "Read HIPA Masalas guides about spice selection, South Indian cooking and practical product information.",
      canonicalPath: path,
    };
  }

  const articleMatch = path.match(/^\/blog\/([^/]+)$/);
  if (articleMatch) {
    const article = getArticle(articleMatch[1]);
    if (!article) return { title: "Page not found | HIPA Masalas", description: defaultDescription, notFound: true };
    return {
      title: `${article.title} | HIPA Masalas`,
      description: article.description,
      canonicalPath: path,
      ogType: "article",
      ogImage: article.image,
      ogImageAlt: article.imageAlt,
      publishedTime: article.publishedAt,
      modifiedTime: article.modifiedAt,
    };
  }

  if (path === "/privacy") {
    return { title: "Privacy Policy | HIPA Masalas", description: "Learn how HIPA Masalas uses enquiry and newsletter details submitted through this website.", canonicalPath: path, noindex: true };
  }

  if (path === "/admin" || path.startsWith("/admin/")) {
    return { title: "HIPA Masalas Admin", description: defaultDescription, noindex: true };
  }

  return { title: "Page not found | HIPA Masalas", description: defaultDescription, notFound: true };
}

function absoluteUrl(origin: string, path: string) {
  return `${origin.replace(/\/$/, "")}${path}`;
}

function breadcrumbSchema(origin: string, path: string, labels: string[]) {
  const parts = path.split("/").filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: labels.map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      ...(index < labels.length - 1
        ? { item: absoluteUrl(origin, index === 0 ? "/" : `/${parts.slice(0, index).join("/")}`) }
        : {}),
    })),
  };
}

export function getStructuredData(pathname: string, origin: string, articleOverride?: Article) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const schemas: Record<string, unknown>[] = [];
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteIdentity.name,
    url: absoluteUrl(origin, "/"),
    logo: absoluteUrl(origin, siteIdentity.logo),
    description: "HIPA Masalas is an Indian spice and masala brand based in Chennai, Tamil Nadu, India, offering a current range of spice powders and masala blends.",
    email: siteIdentity.email,
    telephone: siteIdentity.phone,
  };

  // Do not publish `sameAs` until HIPA confirms ownership of each account URL.
  // Visible social links can remain available to users without being asserted as
  // entity relationships in structured data.

  if (path === "/") {
    schemas.push(organization, {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteIdentity.name,
      url: absoluteUrl(origin, "/"),
    });
  }

  if (path === "/products") {
    schemas.push(breadcrumbSchema(origin, path, ["Home", "Products"]));
  }

  const productMatch = path.match(/^\/products\/([^/]+)$/);
  if (productMatch) {
    const product = getProduct(productMatch[1]);
    if (product) {
      schemas.push(
        breadcrumbSchema(origin, path, ["Home", "Products", product.name]),
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: [absoluteUrl(origin, product.image)],
          url: absoluteUrl(origin, path),
          brand: { "@type": "Brand", name: siteIdentity.name },
          category: "Spice powders and masala blends",
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: getProductFaqs(product).map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      );
    }
  }

  if (path === "/faq") {
    schemas.push(
      breadcrumbSchema(origin, path, ["Home", "FAQ"]),
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    );
  }

  if (path === "/contact" || path === "/b2b-enquiries" || path === "/blog") {
    schemas.push(breadcrumbSchema(origin, path, ["Home", path === "/contact" ? "Contact" : path === "/blog" ? "Journal" : "Business Enquiries"]));
  }

  const articleMatch = path.match(/^\/blog\/([^/]+)$/);
  if (articleMatch) {
    const article = articleOverride?.slug === articleMatch[1] ? articleOverride : getArticle(articleMatch[1]);
    if (article) {
      schemas.push(
        breadcrumbSchema(origin, path, ["Home", "Journal", article.title]),
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: article.title,
          description: article.description,
          author: { "@type": "Organization", name: article.authorName, url: absoluteUrl(origin, "/") },
          publisher: { "@type": "Organization", name: siteIdentity.name, logo: { "@type": "ImageObject", url: absoluteUrl(origin, siteIdentity.logo) } },
          mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(origin, path) },
          datePublished: article.publishedAt,
          ...(article.modifiedAt ? { dateModified: article.modifiedAt } : {}),
          ...(article.image ? { image: [absoluteUrl(origin, article.image)] } : {}),
        }
      );
    }
  }

  // LocalBusiness is intentionally omitted until HIPA confirms its legal/trading
  // name, complete postal address, and current opening hours for public use.
  return schemas;
}
