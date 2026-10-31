import { MANUFACTURER_PAGE_PATH, manufacturerPage } from "./manufacturerPage";

export type ProductSpec = {
  label: string;
  value: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export type Product = {
  slug: string;
  name: string;
  seoTitle: string;
  metaDescription: string;
  shortDescription: string;
  description: string;
  image: string;
  imageAlt: string;
  highlights: string[];
  packSizes: string[];
  whatIs: string[];
  ingredientsAndAroma: string[];
  commonUses: string[];
  selectionFactors: string[];
  storageGuidance: string[];
  commercialApplications: string[];
  specs: ProductSpec[];
  faqs: Faq[];
  relatedProductSlugs: string[];
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
  name: "HIPA Masala",
  legalName: "HIPA Enterprises",
  tagline: "Taste of Tradition",
  phone: "+91 70580 53055",
  phoneHref: "tel:+917058053055",
  email: "info@hipamasalas.com",
  locationLabel: "Plot No. 10, (Highway Colony), 5th Main Road, Zamin Pallavaram, Highway Nagar, Perumal Nagar, Old Pallavaram, Chennai – 600117, Tamil Nadu, India",
  address: {
    streetAddress: "Plot No. 10, (Highway Colony), 5th Main Road, Zamin Pallavaram, Highway Nagar, Perumal Nagar, Old Pallavaram",
    addressLocality: "Chennai",
    postalCode: "600117",
    addressRegion: "Tamil Nadu",
    addressCountry: "India",
  },
  logo: "/assets/logo_a24808ac.png",
  // Still of the home-page background video's first frame: the hero's LCP image, the video's
  // placeholder while it loads, and the social preview image.
  heroImage: "/assets/hero-video-poster_e92afce6.webp",
  // Background video for the home-page hero (owner's footage, 5 Oct 2026), muted and looping.
  // Phones get a centre crop that matches the hero's mobile poster crop. MP4 (H.264) plays everywhere
  // with hardware decoding; the WebM copies cover browsers built without H.264.
  heroVideo: {
    desktop: "/assets/video/hero-spices-loop_248e3a02.mp4",
    mobile: "/assets/video/hero-spices-loop-mobile_fbded111.mp4",
    desktopWebm: "/assets/video/hero-spices-loop_f5522ae3.webm",
    mobileWebm: "/assets/video/hero-spices-loop-mobile_9f105300.webm",
  },
  facebook: "https://www.facebook.com/profile.php?id=61592093192345",
  instagram: "https://www.instagram.com/hipa_masala/",
  // Google lists this channel for the brand search; LinkedIn is left out until the company page URL is confirmed.
  youtube: "https://www.youtube.com/@HIPAMasala",
  // Google Business Profile share link supplied by the owner on 2026-10-05.
  googleBusinessProfile: "https://share.google/beobv5nq74J9DHZwm",
  whatsappHref:
    "https://wa.me/917058053055?text=Hi%20HIPA%20Masala%2C%20I%27d%20like%20to%20know%20more%20about%20your%20products.",
  // Online store for the "Shop Now" buttons. Empty until the owner shares the e-commerce link;
  // getShopHref() sends visitors to the product catalogue in the meantime.
  shopUrl: "",
  fssaiLicence: "22426423000366",
  gstin: "33BVIPR5839J1Z1",
  openingHours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "17:30",
    label: "Monday to Saturday, 9:00 am to 5:30 pm",
  },
} as const;

/** Where "Shop Now" goes: the online store once configured, otherwise the product catalogue. */
export function getShopHref(): string {
  return siteIdentity.shopUrl || "/products";
}

/** True when "Shop Now" leaves the site (so links open in a new tab). */
export function isExternalShop(): boolean {
  return /^https?:\/\//.test(siteIdentity.shopUrl);
}

export const products: Product[] = [
  {
    slug: "sambar-powder",
    name: "Sambar Powder",
    seoTitle: "Sambar Powder | South Indian Sambar Masala | HIPA Masala Chennai",
    metaDescription: "HIPA Masala Sambar Powder is a traditional South Indian spice blend crafted for authentic sambar. Available for homes, retailers and B2B in Chennai.",
    shortDescription: "A South Indian spice blend crafted for everyday authentic sambar.",
    description:
      "HIPA Masala Sambar Powder is formulated with selected coriander seeds, dried red chillies, cumin, fenugreek, lentils and aromatic spices for a balanced, traditional South Indian flavour.",
    image: "/assets/pack-sambar-powder-v2.webp",
    imageAlt: "HIPA Masala Sambar Powder retail pack — South Indian sambar spice blend",
    highlights: [
      "Traditional South Indian recipe formulation",
      "Aromatic coriander, cumin, fenugreek & roasted dal base",
      "Available in 100g, 200g, 500g and 1kg retail & bulk packs",
      "Suitable for home kitchens, catering & institutional food service",
    ],
    packSizes: ["100g", "200g", "500g", "1kg"],
    whatIs: [
      "Sambar Powder is the cornerstone spice blend of South Indian cuisine. A classic sambar requires a harmonious balance of roasted lentils, whole spices, and sun-dried chillies to achieve its signature rich aroma and hearty texture.",
      "HIPA Masala Sambar Powder is prepared according to traditional culinary proportions. Each batch combines slow-roasted toor and chana lentils with fragrant coriander seeds, cumin, fenugreek, and select red chillies. The result is an authentic, full-bodied masala that dissolves smoothly into tamarind-vegetable broths without grittiness or artificial flavouring.",
      "Whether you are preparing a quick morning tiffin sambar for idlis and dosas or a slow-simmered feast sambar with drumsticks, shallots, and yellow pumpkin, this blend provides a dependable, consistent foundation that tastes just like home-ground masala.",
    ],
    ingredientsAndAroma: [
      "Ingredients: Coriander Seeds, Dried Red Chillies, Cumin Seeds, Fenugreek Seeds, Black Peppercorns, Toor Dal, Chana Dal, Turmeric, Asafoetida (Compounded Hing).",
      "Aroma & Flavour Profile: Earthy, warm, and distinctly fragrant with a mild-to-medium heat. The slow-roasted lentils contribute a nutty undertone that naturally thickens gravies, while fenugreek and asafoetida lend the unmistakable South Indian tiffin aroma.",
    ],
    commonUses: [
      "Everyday South Indian Lunch Sambar: Add 1.5 to 2 tablespoons of HIPA Sambar Powder to boiled toor dal, tamarind extract, and seasonal vegetables like shallots, drumsticks, brinjal, or carrots.",
      "Tiffin Sambar for Idli & Dosa: Combine with moong dal or light toor dal for a smoother, pourable breakfast sambar pairing perfectly with hot idlis, crispy dosas, and medu vadas.",
      "Vegetable Poriyal & Kootu Enhancement: Sprinkle half a teaspoon into dry vegetable stir-fries or coconut-based lentil stews for an instant burst of aroma and colour.",
      "Pulao and South Indian Curries: Use as a versatile regional seasoning in tomato curries, brinjal masala, and mixed vegetable gravies.",
    ],
    selectionFactors: [
      "Lentil Roast & Particle Fineness: Superior sambar powder requires properly roasted lentils that impart body without causing clumping when mixed into warm boiling broth.",
      "Freshness of Coriander & Fenugreek: Coriander must retain its essential oils for floral fragrance, while fenugreek must be carefully toasted to eliminate raw bitterness while retaining pleasant pungency.",
      "Clean Sourcing & Consistent Quality: HIPA Masala prioritises whole spices sourced and ground under hygienic conditions in Chennai, ensuring zero artificial colours, synthetic aromas, or chemical fillers.",
    ],
    storageGuidance: [
      "Store in a cool, dry, and dark pantry space away from direct sunlight and stovetop steam.",
      "Once opened, transfer the contents into an airtight stainless steel or glass container to retain volatile aromatic oils.",
      "Always use a dry spoon when taking out powder to prevent moisture ingress and preserve freshness throughout its 12-month shelf life.",
    ],
    commercialApplications: [
      "Restaurants, Darshinis & Messes: Consistent batch-to-batch taste for high-volume tiffin and meals service.",
      "Catering Companies & Event Cooks: Available in 500g and 1kg institutional packaging for weddings, corporate dining, and functions.",
      "Retail Stores & Supermarkets: Clean retail pouches with clear labelling, barcodes, and attractive shelf presence.",
    ],
    specs: [
      { label: "Product Form", value: "Fine ground spice blend" },
      { label: "Ingredients", value: "Coriander, Red Chilli, Cumin, Fenugreek, Black Pepper, Toor Dal, Chana Dal, Turmeric, Asafoetida" },
      { label: "Available Pack Sizes", value: "100g, 200g, 500g, 1kg & institutional bulk" },
      { label: "Shelf Life", value: "12 Months from manufacture" },
      { label: "Origin / Location", value: "Pallavaram, Chennai, Tamil Nadu, India" },
      { label: "Best Used For", value: "South Indian Sambar, tiffin sambar, vegetable stews, poriyal" },
    ],
    faqs: [
      {
        question: "How much HIPA Sambar Powder should I use per serving?",
        answer: "For a family of 4 (approx. 400ml sambar), use 1.5 to 2 tablespoons (15-20g) of HIPA Sambar Powder mixed into the boiled dal and tamarind vegetable broth.",
      },
      {
        question: "Does HIPA Sambar Powder contain added salt or artificial preservatives?",
        answer: "No. HIPA Sambar Powder contains 100% pure spices, lentils, and asafoetida. It has no added salt, artificial colours, MSG, or chemical preservatives.",
      },
      {
        question: "Can HIPA Sambar Powder be used for hotel-style tiffin sambar?",
        answer: "Yes. For tiffin sambar, blend HIPA Sambar Powder with cooked moong dal, tomato puree, and small onions for a velvety, flavourful restaurant-style tiffin sambar.",
      },
      {
        question: "What pack sizes are available for homes and commercial buyers in Chennai?",
        answer: "HIPA Sambar Powder is available in 100g, 200g, 500g, and 1kg retail packs, as well as institutional bulk packaging for caterers, restaurants, and distributors.",
      },
    ],
    relatedProductSlugs: ["rasam-powder", "turmeric-powder", "coriander-powder"],
  },
  {
    slug: "rasam-powder",
    name: "Rasam Powder",
    seoTitle: "Rasam Powder | South Indian Rasam Masala | HIPA Masala Chennai",
    metaDescription: "HIPA Masala Rasam Powder delivers classic South Indian aroma with black pepper, cumin and coriander. Available for homes and food businesses in Chennai.",
    shortDescription: "A fragrant South Indian spice blend crafted for light, aromatic everyday rasam.",
    description:
      "HIPA Masala Rasam Powder combines roasted cumin, whole black peppercorns, coriander seeds, lentils and red chillies for an authentic, soothing rasam experience.",
    image: "/assets/pack-rasam-powder-v2.webp",
    imageAlt: "HIPA Masala Rasam Powder retail pack — South Indian rasam spice blend",
    highlights: [
      "Pepper and cumin-forward aromatic balance",
      "Ideal for quick tomato, tamarind, and pepper rasam preparations",
      "Available in 100g, 200g, 500g and 1kg packs",
      "Consistent grind for rapid infusion and flavour release",
    ],
    packSizes: ["100g", "200g", "500g", "1kg"],
    whatIs: [
      "Rasam is the soul of South Indian comfort food — a light, tangy, and aromatic broth celebrated both as a daily meal staple and as a traditional digestive soup.",
      "HIPA Masala Rasam Powder captures the vibrant essence of traditional home-pounded rasam podi. Formulated with a dominant base of tellicherry black pepper and aromatic cumin seeds, balanced by whole coriander and toasted lentils, it releases an invigorating aroma the moment it hits hot tamarind water.",
      "The coarse-to-medium grind is carefully calibrated so the essential oils infuse quickly during a gentle simmer, giving you the classic froth and peppery bite that South Indian rasam lovers expect.",
    ],
    ingredientsAndAroma: [
      "Ingredients: Coriander Seeds, Cumin Seeds, Black Peppercorns, Dried Red Chillies, Toor Dal, Turmeric, Asafoetida.",
      "Aroma & Flavour Profile: Sharp, peppery, and intensely warming with earthy undertones of roasted cumin and citrusy coriander. Delivers a clean, invigorating palate finish without overwhelming bitterness.",
    ],
    commonUses: [
      "Classic Tomato & Tamarind Rasam: Simmer chopped tomatoes, crushed garlic, and tamarind water with 1 tablespoon of HIPA Rasam Powder until frothy; finish with a mustard-curry leaf tadka.",
      "Pepper-Jeera Immunity Soup: Boil with crushed ginger, garlic, and fresh coriander stems for a soothing, clear herbal broth during seasonal changes.",
      "Kollu & Lemon Rasam Base: Perfect as the aromatic seasoning for horsegram (kollu) rasam, garlic rasam, and Mysore rasam.",
      "Post-Meal Digestive Drink: Enjoy hot as a standalone soup or poured generously over steaming hot rice and melted ghee.",
    ],
    selectionFactors: [
      "Balanced Pepper-to-Cumin Ratio: Quality rasam powder avoids excessive chilli heat, letting natural piperine from black pepper and volatile oils from cumin lead the flavour.",
      "Texture & Particle Size: A balanced particle size allows rapid infusion without turning the clear rasam muddy or cloudy.",
      "Purity of Hing and Spices: Authentic compounding with quality asafoetida ensures a fragrant kitchen aroma when tempering.",
    ],
    storageGuidance: [
      "Keep in an airtight container immediately after opening the pouch.",
      "Store in a dry cupboard away from moisture, heat, and direct sunlight.",
      "Ensure airtight closure to protect the volatile pepper and cumin aroma.",
    ],
    commercialApplications: [
      "Traditional South Indian Messes & Thali Restaurants: Reliable consistency for daily thali meal service.",
      "Catering Contractors: Ideal for wedding meals, sadhyas, and private functions.",
      "Grocery Retailers & Supermarket Chains: Popular high-velocity household spice blend with eye-catching packaging.",
    ],
    specs: [
      { label: "Product Form", value: "Coarse-to-fine ground spice blend" },
      { label: "Ingredients", value: "Coriander seeds, Cumin seeds, Black Pepper, Red Chilli, Toor Dal, Turmeric, Asafoetida" },
      { label: "Available Pack Sizes", value: "100g, 200g, 500g, 1kg & institutional packs" },
      { label: "Shelf Life", value: "12 Months from manufacture" },
      { label: "Origin / Location", value: "Pallavaram, Chennai, Tamil Nadu, India" },
      { label: "Best Used For", value: "Tomato Rasam, Pepper Rasam, Mysore Rasam, digestive soups" },
    ],
    faqs: [
      {
        question: "What is the difference between Sambar Powder and Rasam Powder?",
        answer: "Sambar Powder contains a higher proportion of roasted lentils and coriander to create a thicker, hearty vegetable stew. Rasam Powder is dominated by black pepper, cumin, and coriander to create a light, tangy, and invigorating broth.",
      },
      {
        question: "Should Rasam Powder be boiled for a long time?",
        answer: "No. For maximum aroma, add HIPA Rasam Powder to the simmering tamarind-tomato broth and remove from heat just as it begins to foam and froth at the edges.",
      },
      {
        question: "Can HIPA Rasam Powder be used without adding cooked dal water?",
        answer: "Yes. While dal water creates a softer texture, HIPA Rasam Powder can be used directly with tamarind, fresh tomatoes, and garlic for a quick everyday rasam.",
      },
      {
        question: "Are bulk quantities available for restaurants and caterers?",
        answer: "Yes, HIPA Masala supplies 500g, 1kg, and custom bulk bags for hotels, canteens, and catering contractors in Chennai and surrounding areas.",
      },
    ],
    relatedProductSlugs: ["sambar-powder", "pepper-powder", "cumin-powder"],
  },
  {
    slug: "turmeric-powder",
    name: "Turmeric Powder",
    seoTitle: "Turmeric Powder | Haldi Powder for Indian Cooking | HIPA Masala",
    metaDescription: "HIPA Masala Turmeric Powder is finely ground from selected turmeric rhizomes for rich golden colour and warm earthy flavour. Chennai, Tamil Nadu.",
    shortDescription: "Pure ground turmeric powder with natural golden colour and earthy aroma.",
    description:
      "HIPA Masala Turmeric Powder is processed from carefully chosen whole turmeric rhizomes, delivering a rich natural golden colour, warm earthy aroma, and pure culinary quality.",
    image: "/assets/pack-turmeric-powder-v2.webp",
    imageAlt: "HIPA Masala Turmeric Powder retail pack — ground turmeric for Indian cooking",
    highlights: [
      "Vibrant natural golden yellow colour",
      "Finely milled for uniform blending in gravies and marinades",
      "Available in 100g, 200g, 500g and 1kg packs",
      "Essential daily spice for everyday Indian culinary preparations",
    ],
    packSizes: ["100g", "200g", "500g", "1kg"],
    whatIs: [
      "Turmeric (Haldi / Manjal) is the sacred golden foundation of Indian cooking, revered for millennia for its vibrant pigmentation, warm earthy fragrance, and natural health-supporting properties.",
      "HIPA Masala Turmeric Powder is produced from high-quality dried turmeric fingers (Curcuma longa). The rhizomes are thoroughly cleaned, gently polished, and low-temperature ground to preserve their natural essential oils and active curcumin content.",
      "Our turmeric powder delivers an authentic bright yellow colour that enlivens dals, vegetable stir-fries, and gravies without leaving any chalky residue, bitter aftertaste, or artificial colouring agents.",
    ],
    ingredientsAndAroma: [
      "Ingredients: 100% Selected dried whole turmeric rhizomes (Curcuma longa).",
      "Aroma & Flavour Profile: Mildly peppery, warm, earthy, and subtly woodsy aroma with a pleasant, delicately bitter undertone.",
    ],
    commonUses: [
      "Everyday Indian Cooking: A mandatory pinch in dals, rice preparations, sambar, kootu, and dry sabzis.",
      "Meat, Poultry & Fish Marinades: Essential for cleansing, tenderising, and seasoning raw meats and seafood before cooking.",
      "Golden Turmeric Milk (Haldi Doodh): Whisk half a teaspoon into warm milk with black pepper and honey for a nourishing evening beverage.",
      "Pickles & Ferments: Provides natural preservation support and vibrant golden colour in mango, lemon, and mixed vegetable pickles.",
    ],
    selectionFactors: [
      "Natural Curcumin & Hue: Real turmeric has a warm golden-orange hue, not an artificially fluorescent yellow.",
      "Purity & Zero Additives: Free from lead chromate, chalk, starch, or artificial yellow dyes.",
      "Particle Fineness: Finely micro-pulverised to disperse seamlessly in water, oil, and ghee bases.",
    ],
    storageGuidance: [
      "Store in an opaque, airtight container, as curcumin is sensitive to prolonged direct sunlight exposure.",
      "Keep in a cool, dry place free from moisture and condensation.",
      "Always scoop with a clean, dry spoon.",
    ],
    commercialApplications: [
      "Commercial Food Processing & Snacks: Natural colour and flavour base for extruded snacks, namkeens, and ready meals.",
      "Central Kitchens & Hotel Chains: Bulk packaging for reliable colour consistency across high-volume daily cooking.",
      "Retail Distribution: Steady household demand across modern trade and neighbourhood kirana stores.",
    ],
    specs: [
      { label: "Product Form", value: "Fine single-origin spice powder" },
      { label: "Ingredients", value: "100% Selected dried turmeric rhizomes" },
      { label: "Available Pack Sizes", value: "100g, 200g, 500g, 1kg & institutional bulk" },
      { label: "Shelf Life", value: "12 Months from manufacture" },
      { label: "Origin / Location", value: "Pallavaram, Chennai, Tamil Nadu, India" },
      { label: "Best Used For", value: "Curries, dals, vegetable stir-fries, marinades, golden milk" },
    ],
    faqs: [
      {
        question: "Is HIPA Turmeric Powder free from artificial colouring and chemical adulterants?",
        answer: "Yes. HIPA Turmeric Powder is 100% pure ground turmeric with zero artificial colour additives, lead chromate, starch, or chemical fillers.",
      },
      {
        question: "What gives HIPA Turmeric Powder its deep golden colour?",
        answer: "The natural golden colour comes entirely from quality whole turmeric rhizomes with natural curcumin content, processed without synthetic enhancers.",
      },
      {
        question: "Can this turmeric powder be used for making golden turmeric milk?",
        answer: "Yes, HIPA Turmeric Powder is pure and food-grade, making it suitable for golden milk (haldi doodh) as well as culinary curries and marinades.",
      },
      {
        question: "What bulk sizes are available for food businesses?",
        answer: "Food businesses can purchase 500g, 1kg packs, or order commercial bulk bags by submitting an enquiry on our website.",
      },
    ],
    relatedProductSlugs: ["red-chilli-powder", "coriander-powder", "sambar-powder"],
  },
  {
    slug: "red-chilli-powder",
    name: "Red Chilli Powder",
    seoTitle: "Red Chilli Powder | Indian Chilli Powder | HIPA Masala Chennai",
    metaDescription: "HIPA Masala Red Chilli Powder offers balanced heat and vibrant colour for Indian cooking. Ground from quality dried red chillies in Chennai.",
    shortDescription: "Pure ground red chilli powder delivering balanced heat and rich culinary colour.",
    description:
      "HIPA Masala Red Chilli Powder is milled from selected sun-dried red chillies, offering an optimal balance of sharp pungency, deep natural red colour, and clean flavour.",
    image: "/assets/pack-red-chilli-powder-v2.webp",
    imageAlt: "HIPA Masala Red Chilli Powder retail pack — ground red chilli for Indian cooking",
    highlights: [
      "Balanced pungency and vibrant natural red tone",
      "Uniform fine grind for smooth sauces, gravies and tandoori bases",
      "Available in 100g, 200g, 500g and 1kg packs",
      "Consistent heat level designed for versatile Indian kitchen use",
    ],
    packSizes: ["100g", "200g", "500g", "1kg"],
    whatIs: [
      "Red Chilli Powder (Lal Mirch Powder / Milagai Thool) is the primary driver of fiery warmth, depth, and vibrant colour in Indian cuisine.",
      "HIPA Masala Red Chilli Powder is processed from mature, sun-dried red chillies with stems removed. We select chillies that offer the perfect intersection of appetising natural red pigmentation and a calibrated, pleasant heat level that enlivens curries without overpowering delicate secondary spices.",
      "Milled to a uniform fine consistency, it dissolves evenly in hot oil and ghee during tadka, creating a rich red gravy sheen (rogan) that enhances both the taste and presentation of everyday meals.",
    ],
    ingredientsAndAroma: [
      "Ingredients: 100% Selected dried whole red chillies (Capsicum annuum).",
      "Aroma & Flavour Profile: Sharp, pungent, slightly smoky aroma with immediate balanced heat and a clean, lingering savoury warmth.",
    ],
    commonUses: [
      "Curries & Gravies: Adds fiery heat and natural reddish hue to paneer butter masala, chicken curry, mutton gravy, and fish kuzhambu.",
      "Tadka & Seasoning: Bloom in hot oil with mustard and curry leaves for South Indian vegetable dishes and dals.",
      "Dry Masala Rubs & Marinades: Key component of spicy fried fish, chicken 65, pakoda batters, and tandoori marinades.",
      "Chutneys & Podis: Blended with garlic, roasted gram, or sesame seeds for spicy dry podis and spicy wet chutneys.",
    ],
    selectionFactors: [
      "Natural Colour vs Chemical Dye: Natural chilli powder exhibits a rich brick-red to deep red hue that blooms in warm oil, free of Sudan dyes or artificial red pigments.",
      "Heat Consistency: Maintained through careful raw material selection and batch blending to ensure predictable spiciness for home and professional cooks.",
      "Pure Milling: Free of foreign fillers, seed-husk excess, or added sawdust.",
    ],
    storageGuidance: [
      "Keep tightly sealed in a cool, dark cabinet away from direct light to prevent natural colour fading.",
      "Protect from humid kitchen air to avoid lumping or mould development.",
      "Always use a dry spoon for scooping.",
    ],
    commercialApplications: [
      "Hotels, Cloud Kitchens & QSRs: Predictable heat levels essential for standardised recipe preparation.",
      "Snack Manufacturers & Fryums: For seasoning mixture, potato chips, and extruded namkeens.",
      "Wholesale & Retail Outlets: Available in fast-moving standard retail pouches with tamper-evident sealing.",
    ],
    specs: [
      { label: "Product Form", value: "Fine ground red chilli powder" },
      { label: "Ingredients", value: "100% Selected dried red chillies" },
      { label: "Available Pack Sizes", value: "100g, 200g, 500g, 1kg & bulk bags" },
      { label: "Shelf Life", value: "12 Months from manufacture" },
      { label: "Origin / Location", value: "Pallavaram, Chennai, Tamil Nadu, India" },
      { label: "Best Used For", value: "Curries, gravies, marinades, chutneys, spice rubs" },
    ],
    faqs: [
      {
        question: "How spicy is HIPA Red Chilli Powder?",
        answer: "HIPA Red Chilli Powder offers a balanced medium heat level paired with rich natural red colour, making it versatile for both South Indian and North Indian cooking.",
      },
      {
        question: "Does HIPA Red Chilli Powder contain any artificial food colours or Sudan dyes?",
        answer: "No. HIPA Red Chilli Powder is 100% pure ground red chilli with zero artificial colourants, chemical additives, or added oils.",
      },
      {
        question: "Can I use this chilli powder for tandoori and fry marinades?",
        answer: "Yes. The fine texture blends easily with ginger-garlic paste, curd, and lemon juice to create smooth marinades for paneer, chicken, and seafood.",
      },
      {
        question: "What pack sizes can retailers order?",
        answer: "Retailers can order standard carton master packs of 100g, 200g, 500g, and 1kg pouches through our B2B enquiry form.",
      },
    ],
    relatedProductSlugs: ["turmeric-powder", "coriander-powder", "garam-masala"],
  },
  {
    slug: "coriander-powder",
    name: "Coriander Powder",
    seoTitle: "Coriander Powder | Ground Dhania for Indian Cooking | HIPA Masala",
    metaDescription: "HIPA Masala Coriander Powder brings fresh, mild citrusy aroma and body to curries, gravies and marinades. Available in Chennai and across India.",
    shortDescription: "Aromatic ground coriander powder providing mild citrusy notes and rich gravy body.",
    description:
      "HIPA Masala Coriander Powder is ground from cleaned whole coriander seeds (dhania), imparting a refreshing mild citrusy aroma and essential gravy consistency to everyday curries.",
    image: "/assets/pack-coriander-powder-v2.webp",
    imageAlt: "HIPA Masala Coriander Powder retail pack — ground coriander for Indian cooking",
    highlights: [
      "Mild, cooling and subtly citrusy flavour profile",
      "Adds rich body and thickness to traditional Indian gravies and curries",
      "Available in 100g, 200g, 500g and 1kg packs",
      "Essential base building-block spice for daily Indian cuisine",
    ],
    packSizes: ["100g", "200g", "500g", "1kg"],
    whatIs: [
      "Coriander Powder (Dhania Powder / Kothamalli Thool) is the unsung hero of the Indian spice rack. While chillies provide heat and turmeric gives colour, coriander powder provides the foundational substance, body, and gentle sweetness in Indian curries and sauces.",
      "HIPA Masala Coriander Powder is produced from select whole green-to-golden coriander seeds that have been sun-dried and precision-milled. This retains their delicate linalool essential oils, delivering a pleasant floral-citrus fragrance when cooked.",
      "Its naturally fibrous structure acts as a gentle thickening agent, turning watery tomato-onion gravies into luscious, cohesive curry sauces without requiring artificial starches or flours.",
    ],
    ingredientsAndAroma: [
      "Ingredients: 100% Selected whole coriander seeds (Coriandrum sativum).",
      "Aroma & Flavour Profile: Sweet, woody, and pleasantly citrusy with mild herbaceous notes. Provides cooling balance against sharp chillies and pungent spices.",
    ],
    commonUses: [
      "Base for Gravies & Kormas: Form the core spice base for onion-tomato gravies, vegetable kurmas, and mutton salna.",
      "Sambar & Rasam Formulations: Boost thickness and herbal aroma in homemade sambar and rasam powders.",
      "Dry Vegetable Sabzis: Coat aloo gobi, bhindi masala, and roasted potatoes with coriander powder for flavourful crusts.",
      "Stuffed Parathas & Kofta Fillings: Adds gentle earthy fragrance to potato, paneer, and dal fillings.",
    ],
    selectionFactors: [
      "Essential Oil Content: Quality dhania powder smells distinctly fresh and citrusy, never flat, stale, or dusty.",
      "Texture & Particle Uniformity: Milled fine enough to blend seamlessly without floating as coarse grain in delicate gravies.",
      "Absence of Fillers: Pure coriander powder without added husk dilution, starch, or flour adulterants.",
    ],
    storageGuidance: [
      "Store in an airtight container in a cool, moisture-free location.",
      "Avoid exposure to high heat to maintain the delicate citrusy volatile oils.",
      "Close container immediately after each use.",
    ],
    commercialApplications: [
      "Commercial Catering & Curry Houses: The highest volume foundational spice used across all non-vegetarian and vegetarian menus.",
      "Food Manufacturers & Ready-to-Eat Brands: Standardised spice ingredient for canned and retort curry pouches.",
      "Supermarket Retail: High repeat purchase velocity across domestic kitchens.",
    ],
    specs: [
      { label: "Product Form", value: "Fine ground coriander (dhania) powder" },
      { label: "Ingredients", value: "100% Selected whole coriander seeds" },
      { label: "Available Pack Sizes", value: "100g, 200g, 500g, 1kg & commercial pack options" },
      { label: "Shelf Life", value: "12 Months from manufacture" },
      { label: "Origin / Location", value: "Pallavaram, Chennai, Tamil Nadu, India" },
      { label: "Best Used For", value: "Curry bases, kormas, sambar & rasam enhancement, dry sabzis" },
    ],
    faqs: [
      {
        question: "Why does coriander powder help thicken curries?",
        answer: "Coriander powder contains natural plant fibres that absorb liquids and fats during cooking, creating a thick, cohesive gravy base with balanced flavour.",
      },
      {
        question: "When should coriander powder be added during cooking?",
        answer: "Coriander powder is best added along with turmeric and red chilli powder right after sauteing onions, ginger, and garlic, allowing it to cook gently in the oil without burning.",
      },
      {
        question: "Is HIPA Coriander Powder made from pure whole coriander seeds?",
        answer: "Yes, HIPA Coriander Powder is milled from 100% whole, cleaned coriander seeds with zero added starch, flour, or husk fillers.",
      },
      {
        question: "What pack sizes are available for B2B ordering?",
        answer: "We offer 100g, 200g, 500g, and 1kg retail packs, alongside institutional master cartons for distributors and bulk food establishments.",
      },
    ],
    relatedProductSlugs: ["cumin-powder", "turmeric-powder", "sambar-powder"],
  },
  {
    slug: "cumin-powder",
    name: "Cumin Powder",
    seoTitle: "Cumin Powder | Jeera Powder for Indian Cooking | HIPA Masala",
    metaDescription: "HIPA Masala Cumin Powder is ground from aromatic cumin seeds, delivering warm, earthy depth to dals, stir-fries and buttermilk. Chennai, Tamil Nadu.",
    shortDescription: "Aromatic ground cumin powder with intense earthy warmth and roasted notes.",
    description:
      "HIPA Masala Cumin Powder is milled from aromatic cumin seeds (jeera), offering an intense warm, nutty aroma and digestive benefits for both cooked dishes and finishing seasonings.",
    image: "/assets/pack-cumin-powder-v2.webp",
    imageAlt: "HIPA Masala Cumin Powder retail pack — ground cumin for Indian cooking",
    highlights: [
      "Deeply roasted aroma and warm earthy notes",
      "Versatile for cooking, tadka bases, chaats, and cooling beverages",
      "Available in 100g, 200g, and 500g packs",
      "Fine uniform grind for instant flavour dispersion",
    ],
    packSizes: ["100g", "200g", "500g"],
    whatIs: [
      "Cumin Powder (Jeera Powder / Seeraga Thool) is one of the most distinctive and widely utilised spices in world gastronomy, occupying a place of honour in Indian, Middle Eastern, and Latin culinary traditions.",
      "HIPA Masala Cumin Powder is prepared from selected whole cumin seeds known for their high cuminaldehyde oil content. The seeds undergo gentle cleaning and controlled milling to produce a fine, fragrant powder that immediately releases its warm, nutty, and slightly smoky aroma upon contact with heat.",
      "Whether bloomed in ghee for a classic dal tadka, stirred into cooling spiced buttermilk (mor / chaas), or dusted over fresh cucumber raita, this cumin powder delivers robust flavour and natural digestive comfort in every pinch.",
    ],
    ingredientsAndAroma: [
      "Ingredients: 100% Selected whole cumin seeds (Cuminum cyminum).",
      "Aroma & Flavour Profile: Robust, earthy, warm, and distinctly aromatic with subtle nutty, peppery, and bittersweet undertones.",
    ],
    commonUses: [
      "Tadka & Dal Preparations: Essential in yellow dal tadka, dal fry, chana masala, and rajma gravies.",
      "Raitas, Salads & Chaats: Sprinkle directly over boondi raita, dahi vada, pani puri potato stuffing, and fresh salads for finishing aroma.",
      "Beverages & Refreshers: Stir into South Indian spiced buttermilk (neer mor), jaljeera, or cumin herbal tea for cooling digestive relief.",
      "Biryanis & Pulao Rice: Adds rich warm depth to jeera rice, vegetable pulao, and meat marinades.",
    ],
    selectionFactors: [
      "Fragrance Intensity: Authentic cumin powder possesses an unmistakably potent, warm aroma that is recognisable immediately upon opening the pack.",
      "Purity of Grind: Free from dust, sand, excessive foreign seeds, or synthetic aroma enhancers.",
      "Natural Oil Retention: Low-temperature milling prevents heat dissipation of volatile aromatics during grinding.",
    ],
    storageGuidance: [
      "Keep in a cool, airtight glass or food-grade tin container.",
      "Keep away from direct steam over cooking pots to avoid clumping.",
      "Store in a dark pantry cupboard to maintain aroma potency.",
    ],
    commercialApplications: [
      "Beverage & Chaat Manufacturers: Instant dissolving aroma for buttermilk, snack seasonings, and beverage syrups.",
      "Restaurants & Dhabas: High-frequency seasoning for dals, curries, and side dishes.",
      "Retail Stores: Consistent demand in premium packaging for discerning household cooks.",
    ],
    specs: [
      { label: "Product Form", value: "Fine ground cumin (jeera) powder" },
      { label: "Ingredients", value: "100% Selected whole cumin seeds" },
      { label: "Available Pack Sizes", value: "100g, 200g, 500g & bulk trade packs" },
      { label: "Shelf Life", value: "12 Months from manufacture" },
      { label: "Origin / Location", value: "Pallavaram, Chennai, Tamil Nadu, India" },
      { label: "Best Used For", value: "Dals, raitas, chaats, jeera aloo, rasam, marinades" },
    ],
    faqs: [
      {
        question: "Can HIPA Cumin Powder be consumed directly without cooking?",
        answer: "Yes. HIPA Cumin Powder is clean and finely ground, making it suitable for sprinkling directly over raitas, curd rice, buttermilk, and chaats.",
      },
      {
        question: "What is the shelf life of HIPA Cumin Powder?",
        answer: "It has a shelf life of 12 months when stored in an airtight container in a cool, dry place away from direct sunlight.",
      },
      {
        question: "How does cumin powder benefit digestion?",
        answer: "Cumin naturally contains thymol and essential aromatic oils that stimulate digestive enzymes, making it a popular daily spice in Indian households.",
      },
      {
        question: "Are trade quantities available for distributors?",
        answer: "Yes, HIPA Masala provides commercial master cartons for retailers, supermarket suppliers, and regional distributors.",
      },
    ],
    relatedProductSlugs: ["coriander-powder", "pepper-powder", "rasam-powder"],
  },
  {
    slug: "pepper-powder",
    name: "Pepper Powder",
    seoTitle: "Black Pepper Powder | Ground Pepper for Indian Cooking | HIPA Masala",
    metaDescription: "HIPA Masala Black Pepper Powder delivers sharp, pungent heat and robust aroma from selected black peppercorns. Ground in Chennai, Tamil Nadu.",
    shortDescription: "Pure ground black pepper powder with robust piperine heat and sharp woody aroma.",
    description:
      "HIPA Masala Black Pepper Powder is milled from premium sun-dried black peppercorns (Piper nigrum), providing a sharp, pungent bite and warm aroma for traditional South Indian and global recipes.",
    image: "/assets/pack-pepper-powder-v2.webp",
    imageAlt: "HIPA Masala Pepper Powder retail pack — ground black pepper for cooking",
    highlights: [
      "Bold piperine heat and fresh peppery fragrance",
      "Consistent grind suitable for direct seasoning and simmering",
      "Available in 50g, 100g, 200g, and 500g packs",
      "Essential for South Indian pongal, rasams, soups, and marinades",
    ],
    packSizes: ["50g", "100g", "200g", "500g"],
    whatIs: [
      "Black Pepper, historically crowned as the 'King of Spices', is indigenous to the lush Western Ghats of Southern India and has been traded across the globe for thousands of years.",
      "HIPA Masala Pepper Powder is milled from high-density, fully mature sun-dried black peppercorns. Selected for their rich piperine content and robust essential oil concentration, these peppercorns are gently crushed to achieve a medium-fine grind that releases explosive aroma upon contact with food.",
      "Unlike pre-ground commercial powders that lose their punch, HIPA Pepper Powder delivers a sharp, clean peppery heat followed by complex piney and citrusy undertones that elevate morning eggs, comforting Ven Pongal, and fiery Chettinad gravies alike.",
    ],
    ingredientsAndAroma: [
      "Ingredients: 100% Selected dried whole black peppercorns (Piper nigrum).",
      "Aroma & Flavour Profile: Sharp, pungent, penetrating, and woody with subtle citrus notes and a lingering spicy warmth on the palate.",
    ],
    commonUses: [
      "Traditional South Indian Tiffin: The definitive spice in Ven Pongal, pepper vadai, and milagu rasam.",
      "Chettinad & Regional Meat Curries: Essential in Chettinad pepper chicken, mutton sukka, and seafood roasts.",
      "Soups, Broths & Immunity Tonics: Add to tomato soup, chicken bone broth, and herbal kashayams during rainy or cold weather.",
      "Everyday Table Seasoning: Dust over fried eggs, omelettes, salads, roasted nuts, and pasta dishes for instant seasoning.",
    ],
    selectionFactors: [
      "Piperine Potency: Quality pepper powder delivers immediate, authentic peppery warmth rather than flat, dusty pungency.",
      "Pure Peppercorn Sourcing: Zero papaya seed adulteration, spent-pepper residue, or mineral oil polishing.",
      "Calibrated Granulation: Medium-fine grind allows versatile use in slow-cooked stews and fast tabletop sprinkling.",
    ],
    storageGuidance: [
      "Store in an airtight glass shaker or stainless container.",
      "Keep tightly sealed to prevent evaporation of volatile terpene oils.",
      "Store in a dry location away from stovetop steam.",
    ],
    commercialApplications: [
      "Hotels, Cafes & Continental Kitchens: Universal tabletop condiment and kitchen staple across breakfast, lunch, and dinner services.",
      "Meat Processing & Charcuterie: High-grade seasoning for sausages, marinades, and cured preparations.",
      "Pharma & Nutraceutical Formulations: Used as a natural bioavailability enhancer with turmeric.",
    ],
    specs: [
      { label: "Product Form", value: "Medium-fine ground black pepper powder" },
      { label: "Ingredients", value: "100% Selected dried black peppercorns (Piper nigrum)" },
      { label: "Available Pack Sizes", value: "50g, 100g, 200g, 500g & catering packs" },
      { label: "Shelf Life", value: "12 Months from manufacture" },
      { label: "Origin / Location", value: "Pallavaram, Chennai, Tamil Nadu, India" },
      { label: "Best Used For", value: "Ven Pongal, pepper chicken, rasams, soups, egg dishes" },
    ],
    faqs: [
      {
        question: "Is HIPA Pepper Powder made from pure black peppercorns?",
        answer: "Yes. HIPA Pepper Powder is made exclusively from 100% pure, selected black peppercorns with zero spent pepper or foreign additives.",
      },
      {
        question: "Can this pepper powder be used as a tabletop seasoning?",
        answer: "Yes, its medium-fine grind makes it suitable for direct table seasoning on eggs, salads, soups, and fruits as well as cooked dishes.",
      },
      {
        question: "Why is black pepper often combined with turmeric?",
        answer: "Black pepper contains piperine, an active compound that helps enhance the natural absorption and bioavailability of curcumin found in turmeric.",
      },
      {
        question: "What packaging sizes are available for food service?",
        answer: "We supply 50g, 100g, 200g, and 500g pouches as well as bulk institutional supply upon request.",
      },
    ],
    relatedProductSlugs: ["rasam-powder", "cumin-powder", "garam-masala"],
  },
  {
    slug: "garam-masala",
    name: "Garam Masala",
    seoTitle: "Garam Masala | Aromatic Indian Spice Blend | HIPA Masala Chennai",
    metaDescription: "HIPA Masala Garam Masala is an aromatic blend of whole spices providing warm, finishing depth to biryanis, curries and gravies. Chennai, Tamil Nadu.",
    shortDescription: "An exquisite blend of aromatic whole spices for finishing curries, gravies and biryanis.",
    description:
      "HIPA Masala Garam Masala brings together cinnamon, cloves, cardamom, cumin, black pepper, and fragrant whole spices for a rich, regal aroma in royal Indian dishes.",
    image: "/assets/pack-garam-masala-v2.webp",
    imageAlt: "HIPA Masala Garam Masala retail pack — aromatic Indian spice blend",
    highlights: [
      "Exquisite warm aromatic profile with cinnamon, clove & cardamom",
      "Ideal finishing spice to sprinkle towards the end of cooking",
      "Available in 100g, 200g, and 500g packs",
      "Enhances biryanis, paneer gravies, meat curries, and vegetable pulao",
    ],
    packSizes: ["100g", "200g", "500g"],
    whatIs: [
      "Garam Masala (literally 'warm spice blend') represents the pinnacle of Indian spice blending artistry, bringing together the most prized whole sweet and savoury aromatics into a harmonious finish.",
      "HIPA Masala Garam Masala is formulated following classic culinary traditions. We balance warm whole spices — including Ceylon cinnamon quills, aromatic green cardamom, pungent cloves, black cardamom, star anise, nutmeg, and mace — with toasted cumin and black pepper.",
      "Unlike harsh, chilli-heavy commercial mixtures, our blend focuses purely on fragrance and depth. When sprinkled over a simmering dish in its final minutes of cooking, the residual heat releases an unforgettable regal aroma that transforms everyday gravies into restaurant-quality delicacies.",
    ],
    ingredientsAndAroma: [
      "Ingredients: Coriander Seeds, Cumin Seeds, Black Peppercorns, Cinnamon, Cloves, Cardamom, Bay Leaf (Tejpatta), Star Anise, Nutmeg, Mace.",
      "Aroma & Flavour Profile: Intensely sweet-spicy, floral, warm, and sophisticated. Highly aromatic with balanced notes of clove, cinnamon bark, and fragrant cardamom.",
    ],
    commonUses: [
      "Biryanis & Pulaos: Sprinkle over layered Dum Biryani, chicken pulao, or vegetable tahiri before sealing the pot.",
      "Paneer & Creamy Gravies: Enhance Paneer Butter Masala, Shahi Paneer, Dal Makhani, and Butter Chicken.",
      "Rich Meat & Poultry Curries: Elevate mutton rogan josh, chicken korma, and lamb pepper roast with a warm finishing touch.",
      "Samosa & Snack Stuffings: Mix into spiced potato samosa fillings, kachori fillings, and kebab marinades.",
    ],
    selectionFactors: [
      "True Whole Spice Balance: A premium garam masala relies on expensive sweet spices (cardamom, clove, cinnamon, mace) rather than being padded with cheap coriander filler.",
      "Finishing Fragrance: Formulated to release aroma upon gentle heating without requiring prolonged boiling.",
      "Zero Artificial Aromas: 100% natural spices without synthetic spice oils or flavour boosters.",
    ],
    storageGuidance: [
      "Store in an airtight glass jar away from kitchen heat and direct light.",
      "Always close the lid tightly after each pinch to lock in the volatile essential oils.",
      "Best consumed within 12 months for peak aromatic fragrance.",
    ],
    commercialApplications: [
      "Fine-Dining Indian Restaurants & Biryani Houses: Distinctive signature aroma for high-value curries and rice dishes.",
      "Caterers & Wedding Specialists: Essential for luxury banquet menus and festive feasts.",
      "Retail Supermarkets: High-margin premium spice blend in attractive pouch packaging.",
    ],
    specs: [
      { label: "Product Form", value: "Fine aromatic ground spice blend" },
      { label: "Ingredients", value: "Coriander, Cumin, Black Pepper, Cinnamon, Cloves, Cardamom, Bay Leaf, Star Anise, Nutmeg, Mace" },
      { label: "Available Pack Sizes", value: "100g, 200g, 500g & restaurant bulk" },
      { label: "Shelf Life", value: "12 Months from manufacture" },
      { label: "Origin / Location", value: "Pallavaram, Chennai, Tamil Nadu, India" },
      { label: "Best Used For", value: "Biryanis, North & South Indian curries, paneer butter masala, rich gravies" },
    ],
    faqs: [
      {
        question: "When should Garam Masala be added while cooking?",
        answer: "Garam Masala is an aromatic finishing spice. It is best added in the last 2-3 minutes of cooking, allowing the residual heat to release its floral aroma without boiling away the delicate essential oils.",
      },
      {
        question: "Is HIPA Garam Masala spicy or purely aromatic?",
        answer: "HIPA Garam Masala focuses on warmth and rich aroma from cardamom, cinnamon, cloves, and mace rather than harsh chilli heat.",
      },
      {
        question: "Can HIPA Garam Masala be used in South Indian dishes?",
        answer: "Yes, it is excellent for South Indian biryanis, chicken salna, kurma, mutton sukka, and mushroom gravy.",
      },
      {
        question: "What pack sizes are available for purchase?",
        answer: "HIPA Garam Masala is available in 100g, 200g, and 500g pouches, with commercial master cartons available for restaurants and distributors.",
      },
    ],
    relatedProductSlugs: ["red-chilli-powder", "coriander-powder", "sambar-powder"],
  },
];

export const faqs: Faq[] = [
  // Cluster 1: About HIPA Masala & Sourcing
  {
    question: "What is HIPA Masala and who owns the brand?",
    answer: "HIPA Masala is a premier Indian spice and masala brand owned and operated by HIPA Enterprises, based in Pallavaram, Chennai, Tamil Nadu, India. The brand provides authentic, high-quality pure spice powders and traditional masala blends for home kitchens, catering businesses, and retail partners.",
  },
  {
    question: "Where is HIPA Masala located in Chennai?",
    answer: "HIPA Masala is located at Plot No. 10, (Highway Colony), 5th Main Road, Zamin Pallavaram, Highway Nagar, Perumal Nagar, Old Pallavaram, Chennai – 600117, Tamil Nadu, India.",
  },
  {
    question: "How are HIPA spice powders processed and packaged?",
    answer: "Our spices are carefully sourced from reputed cultivation regions across India, cleaned, gently processed to preserve essential oils, and packed under strict hygienic standards in tamper-evident food-grade pouches.",
  },
  {
    question: "Do HIPA Masala products contain artificial colours, MSG, or chemical preservatives?",
    answer: "No. All HIPA Masala products are 100% free from artificial food colourings, added MSG, synthetic preservatives, and foreign fillers. What you get is pure, authentic spice goodness.",
  },

  // Cluster 2: Product Range & Culinary Usage
  {
    question: "What products are currently available in the HIPA Masala range?",
    answer: "Our current product range includes 8 signature spices and blends: Sambar Powder, Rasam Powder, Turmeric Powder, Red Chilli Powder, Coriander Powder, Cumin Powder, Black Pepper Powder, and Garam Masala.",
  },
  {
    question: "What is the difference between HIPA Sambar Powder and Rasam Powder?",
    answer: "Sambar Powder is formulated with roasted lentils, coriander, cumin, fenugreek, and chillies to create a hearty, thick vegetable stew. Rasam Powder features a higher concentration of black pepper and roasted cumin to produce a light, tangy, and invigorating digestive broth.",
  },
  {
    question: "What pack sizes are available for household use?",
    answer: "Our pure spice powders and masala blends are conveniently available in 50g, 100g, 200g, 500g, and 1kg retail pouch packaging to suit various household needs.",
  },
  {
    question: "What is the shelf life of HIPA spice powders?",
    answer: "HIPA Masala products have a shelf life of 12 months from the date of manufacture when stored in a cool, dry place away from direct moisture and sunlight.",
  },

  // Cluster 3: B2B Enquiries, Wholesale & Contact
  {
    question: "Can businesses, supermarkets, and restaurants order in bulk?",
    answer: "Yes! HIPA Enterprises supplies wholesale quantities, institutional packs (500g, 1kg, and bulk bags), and custom order volumes for supermarket chains, kirana stores, caterers, hotels, and cloud kitchens.",
  },
  {
    question: "How can I submit a B2B or dealership enquiry?",
    answer: "You can submit a direct business enquiry through our B2B Enquiries page, email us at info@hipamasalas.com, call us at +91 70580 53055, or reach out directly on WhatsApp.",
  },
  {
    question: "Does HIPA Masala support export and out-of-state distribution enquiries?",
    answer: "Yes, we welcome inquiries from domestic regional distributors outside Tamil Nadu as well as international merchant exporters seeking authentic South Indian spice products.",
  },
  {
    question: "How can I contact HIPA Masala for customer support?",
    answer: "You can call us at +91 70580 53055, send an email to info@hipamasalas.com, or use the instant WhatsApp chat button on our website for prompt assistance.",
  },
];

export const articles: Article[] = [
  {
    "slug": "how-to-make-sambar-hipa-sambar-powder",
    "title": "How to Make Better Sambar with HIPA Sambar Powder: Salt, Dal, Vegetables, and More",
    "description": "Learn how to season sambar, choose the right amount of dal, add vegetables, balance sweetness, and use HIPA Sambar Powder in your cooking.",
    "body": [
      "Sambar is a comforting South Indian dish made in many different ways. Its flavor can change with the choice of dal, vegetables, tamarind, seasoning, and sambar powder. If you're making it at home, HIPA Sambar Powder is a convenient seasoning option made with coriander, dried red chillies, cumin, fenugreek, black pepper, toor dal, chana dal, turmeric, and asafoetida. Check the [HIPA Sambar Powder product page](/products/sambar-powder) for the full ingredient list and current usage guidance.",
      "This guide answers common questions about making sambar, from how much salt and dal to use to why sambar is often yellow and whether a little sugar belongs in it.",
      "## How much salt should you add to sambar?",
      "There is no single salt measurement that works for every sambar recipe. The right amount depends on the quantity of water, dal, vegetables, and tamarind. HIPA Sambar Powder contains no added salt, according to its official product information, but always check the packaging of any blend you use.",
      "Start with a small amount of salt while the sambar is cooking. Taste it after the ingredients have simmered together, then adjust gradually.",
      "> **Tip:** Tamarind contributes sourness, and vegetables can affect the final flavor. Taste the cooked sambar before making your final seasoning adjustment.",
      "## How much dal should you add to sambar?",
      "The amount of dal depends on how thick you like your sambar and how much you're preparing. A higher proportion of cooked dal generally makes the dish thicker, while more water makes it thinner.",
      "For a first attempt, follow a tested recipe's dal-to-water proportions, then adjust the consistency to your preference. Cook the dal until soft and mash it before combining it with the vegetables and seasonings. If the sambar becomes too thick, add hot water a little at a time and simmer briefly.",
      "For product-specific seasoning guidance, see the [HIPA Sambar Powder page](/products/sambar-powder), which lists a suggested quantity for a family-sized preparation.",
      "## What is the best masala brand for sambar?",
      "The \"best\" sambar masala depends on the flavor you enjoy, the ingredients you prefer, and how convenient the product is for your cooking. Compare product labels, check for allergens, and follow each brand's preparation instructions.",
      "If you're considering HIPA, explore the details for [HIPA Sambar Powder](/products/sambar-powder), including its ingredient list, flavor profile, pack sizes, and suggested uses. Start with the quantity stated on the label—or a smaller amount if you're unsure—and adjust after tasting.",
      "## Can you put sugar in sambar?",
      "Some cooks add a small amount of sugar or jaggery to balance a particularly tangy sambar, while others prefer not to sweeten it. It is optional, not essential.",
      "First taste the sambar after adding tamarind and sambar powder. If the sourness feels too strong, adjust the balance gradually. You can also review the quantities of tamarind and water in your recipe before adding a sweetener.",
      "## When does sambar become more yellow?",
      "Sambar's color comes from its ingredients and proportions. Turmeric and the spices in the sambar powder can influence the final shade. Different powders and recipes can produce different colors, so sambar is not always the same shade of yellow.",
      "HIPA Sambar Powder includes turmeric in its listed ingredients. For the full blend details, see the product ingredients and information. Don't add extra turmeric just to make the dish more yellow; too much can affect the flavor.",
      "## Is sambar good for health?",
      "Sambar's nutritional content depends on the ingredients and how it is prepared. Dal contributes nutrients, while vegetables add variety to the dish. The amount of salt, oil, and other ingredients also affects the overall meal.",
      "The National Institute of Nutrition's Indian Food Composition Tables provides nutrient data for individual foods, but it does not determine the nutrition of every sambar recipe. For specific dietary needs, consider the full recipe and consult a qualified health professional.",
      "## Is sambar dal good for health?",
      "Dal is a common ingredient in sambar and contributes nutrients to the dish. The final nutritional value depends on the quantity used, the rest of the ingredients, and the portion served. Sambar can be part of a varied meal, but it should not be described as a treatment or guaranteed health solution.",
      "## Why does sambar have so many vegetables?",
      "Vegetables add different textures and flavors to sambar and make it easy to adapt to what is available. Common choices vary by household and region. You can use one or several vegetables, cut them into similar-sized pieces, and cook them until tender without losing their shape.",
      "When adding vegetables, consider how quickly each one cooks. Add firm vegetables earlier and quicker-cooking vegetables later so they finish at about the same time.",
      "## Why is sambar so famous in South India?",
      "Sambar is widely enjoyed across South India and appears in many home and restaurant meals. It is served in different ways, including with rice, idli, and dosa. Recipes vary between regions and households, so there isn't just one version of sambar.",
      "Food history can be complex. One account describes a connection to the Maratha royal kitchen in Thanjavur, with lively debate among food historians and culinary enthusiasts. It's accurate to say that sambar has a rich and debated history across Tamil Nadu and South India.",
      "## Make your next pot of sambar your own",
      "A good sambar comes down to balance: tender dal, vegetables cooked to your liking, seasoning adjusted to taste, and a consistency you enjoy. [HIPA Sambar Powder](/products/sambar-powder) is made for authentic South Indian sambar and can also be explored through its official product details. Browse all [HIPA Masala products](/products) to see the wider spice range.",
      "Have a question about the product or bulk supply? Visit the [HIPA Masala contact page](/contact) or [B2B enquiries page](/b2b-enquiries) to get in touch."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-10-26T10:00:00.000Z",
    "modifiedAt": "2026-10-26T10:00:00.000Z",
    "image": "/assets/how-to-make-better-sambar-hipa-sambar-powder.webp",
    "imageAlt": "A bowl of authentic South Indian sambar prepared with HIPA Sambar Powder and fresh garden vegetables",
    "complete": true
  },
  {
    "slug": "secret-to-restaurant-style-south-indian-rasam",
    "title": "The Secret to Restaurant-Style South Indian Rasam: Pepper, Cumin & Tamarind Balance",
    "description": "Master the delicate balance of crushed black pepper, roasted cumin, and ripe tamarind for authentic, digestive South Indian rasam at home.",
    "body": [
      "A great South Indian rasam is invigorating, aromatic, and deeply satisfying. Unlike thick curries or hearty sambar, rasam is a clear, digestive broth that relies on volatile essential oils from freshly crushed spices.",
      "When done right, each spoonful delivers a sharp peppery warmth, an earthy roasted cumin fragrance, and a gentle tamarind tang that cleanses the palate. Here is the culinary science behind achieving authentic restaurant-style rasam at home.",
      "## The Holy Trinity of Rasam: Pepper, Cumin, and Tamarind",
      "Every traditional Tamil or South Indian rasam is built upon three foundational flavour pillars:",
      "1. **Black Peppercorns (Milagu):** Delivers clean piperine heat that warms the throat without scorching the palate like chillies do.\n2. **Cumin Seeds (Jeera):** Provides digestive cuminaldehyde warmth and a nutty, roasted foundation.\n3. **Ripe Tamarind (Puli):** Contributes balanced malic and tartaric acidity that extracts essential oils from the spices.",
      "In [HIPA Rasam Powder](/products/rasam-powder), these ingredients are proportioned in authentic South Indian culinary ratios, slow-roasted, and milled to preserve their natural volatile oils.",
      "## Why Boiling Rasam Too Long Destroys the Flavour",
      "The single biggest mistake home cooks make with rasam is treating it like sambar and boiling it vigorously for 10–15 minutes.",
      "- **The Golden Rule:** Rasam must only be brought to a single gentle simmer until a thick, frothy golden foam (*nurram*) rises to the surface.\n- The moment the foam forms, immediately turn off the flame. Boiling rasam too long causes the delicate piperine and essential oils of coriander and cumin to vaporise into the air, leaving behind a flat or unpleasantly bitter liquid.",
      "## The Secret Tadka (Tempering) in Pure Ghee",
      "A restaurant-quality rasam finishes with a sizzling aromatic tempering (*thalippu*):",
      "- Heat one teaspoon of pure cow ghee or cold-pressed sesame oil.\n- Splutter black mustard seeds and a pinch of fenugreek seeds.\n- Add freshly torn curry leaves, dried red chilli, and a generous pinch of asafoetida (compounded hing).\n- Pour the hot tempering immediately into the pot and cover with a lid for 3 minutes to trap the aromatic vapours.",
      "## Troubleshooting Common Rasam Pitfalls",
      "| Problem | Cause | Quick Chef Fix |\n| --- | --- | --- |\n| Rasam tastes unpleasantly sour | Too much tamarind or under-extracted water | Add 2 tablespoons of cooked toor dal water or a marble-sized piece of jaggery |\n| Rasam tastes bitter | Fenugreek or cumin was over-roasted or boiled too long | Dilute with fresh warm water and add chopped ripe tomatoes |\n| Flavour feels weak or watery | Spices were stale or added too late | Use freshly ground [HIPA Rasam Powder](/products/rasam-powder) and temper with hot ghee |",
      "Explore [HIPA Masala's pure spice blends](/products) to elevate your everyday home cooking."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-10-25T10:00:00.000Z",
    "modifiedAt": "2026-10-25T10:00:00.000Z",
    "image": "/assets/secret-to-restaurant-style-south-indian-rasam.webp",
    "imageAlt": "Steaming hot South Indian rasam in a traditional bowl with fresh curry leaves, cumin and black pepper",
    "complete": true
  },
  {
    "slug": "pure-turmeric-powder-vs-adulterated-home-test",
    "title": "Pure Turmeric Powder vs Adulterated Turmeric: 4 Simple Home Tests",
    "description": "Simple home water tests to detect chalk, starch, and synthetic yellow dyes in turmeric powder. Learn how HIPA delivers 100% pure curcumin-rich turmeric.",
    "body": [
      "Turmeric is revered across India not only as an essential culinary colourant but as a daily health staple. Its characteristic golden hue and wellness properties are driven by **curcumin**, a natural polyphenol found in mature turmeric rhizomes.",
      "However, commercial turmeric powders are frequently adulterated with cheap extenders like chalk, corn starch, saw dust, and dangerous non-permitted chemical dyes such as **metanil yellow** and lead chromate.",
      "Here are four simple, verified home tests you can run in your kitchen to verify your turmeric powder's authenticity.",
      "## Test 1: The Glass of Warm Water Test",
      "This is the easiest and most reliable test for everyday kitchen detection:",
      "1. Fill a clear glass with warm water.\n2. Drop 1 teaspoon of turmeric powder onto the water surface without stirring.\n3. Observe the settling behavior for 15–20 minutes:\n   - **Pure Turmeric:** Slowly and naturally settles down to the bottom of the glass. The water above remains clear or pale, light yellow.\n   - **Adulterated Turmeric:** Stays cloudy, milky, or turns a harsh neon yellow, indicating water-soluble synthetic dyes or chalk suspensions.",
      "## Test 2: The Hydrochloric Acid / Lemon Juice Chemical Test",
      "Metanil yellow is a carcinogenic synthetic dye banned in food processing under FSSAI regulations.",
      "- Put a small pinch of turmeric in a shallow white dish.\n- Add a few drops of concentrated acid (or fresh lime juice / clear vinegar).\n- If the mixture instantly turns a vivid magenta or violet that remains intense even after adding water, synthetic chemical dyes are present. Pure turmeric will remain yellow or turn a natural deep amber.",
      "## Test 3: The Palm Rubbing & Staining Texture Test",
      "- Take a small pinch of turmeric on the palm of your left hand.\n- Rub it firmly with your right thumb for 20 seconds.\n- Pure ground turmeric will feel fine, silky, and leave a deep golden-yellow stain on the skin that does not easily wash away with plain water. If it leaves a dusty, powdery residue that rinses off instantly like flour, starch or talc has been blended in.",
      "## Test 4: The Blotting Paper Water Drop Test",
      "- Place a teaspoon of turmeric on an absorbent paper towel or blotting paper.\n- Place 2–3 drops of water on the powder.\n- Pure turmeric allows water to seep evenly, producing a soft ring. Adulterated turmeric will cause artificial dyes to bleed out into sharp, fluorescent yellow or orange fringes.",
      "## How HIPA Masala Guarantees Purity",
      "At HIPA Enterprises in Pallavaram, Chennai, our [Turmeric Powder](/products/turmeric-powder) is manufactured under rigorous FSSAI standards:",
      "- **100% Whole Rhizome Sourcing:** We source only mature, naturally sun-cured whole turmeric fingers.\n- **Zero Synthetic Colours or Fillers:** No metanil yellow, no chalk, no foreign starches.\n- **Low-Temperature Milling:** Ensures natural essential oils (turmerone and curcuminoids) remain intact.",
      "Learn more about our [food safety and manufacturing standards](/masala-manufacturer-in-chennai) or explore our [pure spice range](/products)."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-10-24T10:00:00.000Z",
    "modifiedAt": "2026-10-24T10:00:00.000Z",
    "image": "/assets/pure-turmeric-powder-vs-adulterated-home-test.webp",
    "imageAlt": "Pure golden turmeric powder in wooden bowls alongside fresh whole turmeric roots",
    "complete": true
  },
  {
    "slug": "cold-grinding-vs-high-speed-milling-spices",
    "title": "Cold Grinding vs High-Speed Milling: Why Temperature Matters in Spices",
    "description": "Discover why traditional low-temperature milling protects heat-sensitive essential oils in coriander, chilli, and cumin powders for longer freshness.",
    "body": [
      "When whole spices are ground into fine powders, mechanical friction inevitably generates heat. In mass-scale industrial pulverizers running at 3,000 to 5,000 RPM, temperatures inside the milling chamber regularly exceed 85°C to 100°C.",
      "To the consumer, the resulting spice powder looks normal. But under a laboratory microscope, the difference is night and day: excessive heat scorches delicate essential oils, vaporising the aromatic volatile compounds before the spice ever reaches a kitchen.",
      "## The Chemistry of Spice Aromas",
      "The fragrance and medicinal value of Indian spices reside entirely in microscopic volatile oils:",
      "- **Coriander Powder:** Linalool and geranyl acetate (boiling point: 60°C).\n- **Cumin Powder:** Cuminaldehyde and terpene hydrocarbons (heat-sensitive).\n- **Black Pepper:** Piperine and caryophyllene.\n- **Turmeric Powder:** Curcuminoids and turmerone.",
      "When spices are ground at high temperatures, these volatile oils evaporate into the mill exhaust air. What ends up in the pouch is partially exhausted fibre with dull colour and reduced aroma.",
      "## What is Low-Temperature Cold Milling?",
      "Low-temperature grinding (often referred to as cool milling or slow grinding) regulates the internal chamber temperature below 45°C throughout the entire pulverisation process:",
      "1. **Slow-Speed Multi-Stage Milling:** Spices are reduced gradually in stages rather than blasted in a single high-impact pass.\n2. **Cold Air Circulation:** Continuous chilled air passes through the milling cyclonic separators, carrying heat away instantly.\n3. **Moisture Equilibrium:** Ambient relative humidity is controlled so powders do not absorb moisture or cake together.",
      "## Cold Grinding vs High-Speed Commercial Milling",
      "| Factor | High-Speed Pulverizing (80°C - 100°C) | HIPA Controlled Low-Temp Milling (<45°C) |\n| --- | --- | --- |\n| Essential Oil Retention | 40% – 60% lost to friction heat | >92% volatile natural oils retained |\n| Flavour Potency in Cooking | Requires larger quantities for flavour | Strong aroma with smaller kitchen pinches |\n| Shelf Life & Stability | Dulls and turns stale in 3–4 months | Stays fresh and fragrant for 12 months |\n| Colour & Pigment | Darkened or toasted from heat stress | Vibrant natural crop colour preserved |",
      "## Why Chefs and Caterers Prefer Cold-Milled Spices",
      "Professional South Indian caterers and cloud kitchens in Chennai rely on spice consistency. When a spice powder retains its natural oil density:",
      "- Gravies achieve a natural gloss without needing excessive added cooking oil.\n- Less powder is required per dish, reducing cost per plate.\n- The aroma blooms instantly when tempered into hot oil or ghee.",
      "Discover HIPA Masala's [range of low-temperature milled spices](/products) or explore [B2B bulk orders for food businesses](/b2b-enquiries)."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-10-23T10:00:00.000Z",
    "modifiedAt": "2026-10-23T10:00:00.000Z",
    "image": "/assets/cold-grinding-vs-high-speed-milling-spices.webp",
    "imageAlt": "Traditional spice grinding stones and modern clean low-temperature spice milling equipment",
    "complete": true
  },
  {
    "slug": "essential-south-indian-spice-box-guide",
    "title": "The Essential South Indian Spice Box: 8 Cornerstone Spices Every Kitchen Needs",
    "description": "From sun-dried coriander and golden turmeric to fiery Guntur red chilli and roasted cumin, discover the 8 essential spices in traditional Tamil cuisine.",
    "body": [
      "In any traditional South Indian home, the round stainless steel or bronze spice box (*anjarai petti* or *masala dabba*) is the beating heart of the kitchen. While North Indian spice boxes often feature whole garam masala seeds, a South Indian spice array is precision-engineered for tempering, digestive balance, and vibrant everyday gravies.",
      "Here are the 8 cornerstone spices and masalas that define the soul of South Indian cooking.",
      "## 1. Turmeric Powder (Manjal Thool)",
      "The golden foundation of every sambar, kootu, poriyal, and rasam. Pure turmeric provides an earthy warmth, natural golden colour, and antiseptic properties. Always choose 100% pure [HIPA Turmeric Powder](/products/turmeric-powder) free from artificial yellow dyes.",
      "## 2. Red Chilli Powder (Milagai Thool)",
      "South Indian cooking requires a careful balance between fiery heat and deep natural red colour. Milled from sun-dried chillies, [HIPA Red Chilli Powder](/products/red-chilli-powder) delivers clean pungency without synthetic red colour additives.",
      "## 3. Coriander Powder (Malli Thool)",
      "Coriander is the unsung hero of South Indian curries. Ground from dried coriander seeds, it provides body, thickness, and a cooling, citrus-scented aroma that balances fiery chillies. Explore [HIPA Coriander Powder](/products/coriander-powder) for authentic gravies.",
      "## 4. Cumin Powder (Jeera Thool)",
      "Essential for digestion, rasams, and everyday tempering. Cumin releases warm cuminaldehyde aromas that ground tamarind-based dishes. [HIPA Cumin Powder](/products/cumin-powder) is slow-roasted before grinding to maximise nutty depth.",
      "## 5. Black Pepper Powder (Milagu Thool)",
      "Before chillies arrived from the Americas, black pepper from the Western Ghats was South India's indigenous source of heat. In rasam, pongal, and chicken sukka, [HIPA Black Pepper Powder](/products/pepper-powder) delivers invigorating piperine sharpness.",
      "## 6. Traditional Sambar Powder",
      "The cornerstone blend of South Indian lunch menus. A harmonious combination of slow-roasted toor dal, chana dal, coriander seeds, cumin, fenugreek, and select chillies. [HIPA Sambar Powder](/products/sambar-powder) dissolves smoothly into stews without grittiness.",
      "## 7. Aromatic Rasam Powder",
      "Featuring a higher proportion of black pepper and roasted cumin to produce a light, restorative herbal broth. Learn how to prepare restaurant-style rasam with [HIPA Rasam Powder](/products/rasam-powder).",
      "## 8. Royal Garam Masala",
      "The finishing touch for festive weekend cooking: biryanis, kurmas, salnas, and mutton roasts. A regal blend of cinnamon, cloves, cardamom, nutmeg, and whole aromatics. Check [HIPA Garam Masala](/products/garam-masala) for authentic aroma.",
      "## How to Keep Your Masala Box at Peak Freshness",
      "- Refill your working spice box with only 2–3 weeks of spices at a time.\n- Keep the bulk reserves in airtight containers in a cool, dark kitchen cupboard.\n- Always use a dry spoon to avoid moisture contamination.",
      "Browse the complete [HIPA Masala catalogue](/products) to assemble your essential kitchen spice collection."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-10-22T10:00:00.000Z",
    "modifiedAt": "2026-10-22T10:00:00.000Z",
    "image": "/assets/essential-south-indian-spice-box-guide.webp",
    "imageAlt": "A traditional South Indian spice box filled with colourful whole spices and ground masalas",
    "complete": true
  },
  {
    "slug": "chettinad-masala-vs-garam-masala-differences",
    "title": "Chettinad Masala vs Garam Masala: Flavor Profiles, Heat & Key Differences",
    "description": "Compare the spicy, fennel-and-kalpasi-rich blends of Chettinad cooking with the warm, sweet, cinnamon-heavy notes of North Indian garam masala.",
    "body": [
      "Indian culinary traditions boast dozens of specialised spice blends, but two of the most famous are **Garam Masala** and **Chettinad Masala**. While both feature aromatic whole spices, their culinary purposes, roasting styles, and regional ingredient footprints could not be more distinct.",
      "Understanding these differences will transform how you season gravies, biryanis, and roasts.",
      "## The Origins: Imperial North vs Merchant Royalty of Tamil Nadu",
      "- **Garam Masala:** Developed in North India and royal Mughal kitchens as a warming, non-pungent finishing blend. The Hindi word *Garam* translates to \"warm\", referencing Ayurvedic principles of warming the metabolic fire.\n- **Chettinad Masala:** Born in the arid Chettinad region of Tamil Nadu, crafted by the Nattukottai Chettiars who traded exotic spices across Burma, Sri Lanka, and Southeast Asia. It is known for complex, assertive heat, toasted coconut, and rare forest spices.",
      "## Ingredient Comparison",
      "| Spice Component | Royal Garam Masala | Chettinad Masala |\n| --- | --- | --- |\n| Primary Base | Cinnamon, Clove, Green Cardamom | Coriander Seeds, Dry Red Chillies, Fennel |\n| Signature Aromatics | Nutmeg, Mace, Black Cardamom | Kalpasi (Black Stone Flower), Marathi Moggu |\n| Star Anise & Fennel | Used sparingly | Prominent foundational flavour |\n| Whole Chillies & Pepper | Mild pepper, almost no whole chilli | High ratio of Guntur chillies & black pepper |\n| Culinary Role | Finishing spice added in the final 5 minutes | Simmering gravy base cooked with the meat/vegetables |",
      "## When to Use Garam Masala",
      "Because [HIPA Garam Masala](/products/garam-masala) is a pure spice blend without filler powders, its sweet, warming notes bloom best when sprinkled toward the end of cooking:",
      "- Stirred into South Indian chicken salna or vegetable kurma.\n- Layered between rice and meat during the dum phase of biryani.\n- Dusted over paneer butter masala, chole, or rich tomato gravies.",
      "## When to Use Chettinad Masala",
      "Chettinad masala is a robust, full-bodied masala that requires cooking down in oil or ghee along with onions and ginger-garlic paste:",
      "- Authentic Chettinad Chicken Sukka or Pepper Chicken.\n- Spicy mushroom or baby potato roast.\n- Ennai Kathirikai (stuffed brinjal curry).",
      "Discover how [HIPA Masala's pure spice blends](/products) bring authentic South Indian heritage into your everyday meals."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-10-21T10:00:00.000Z",
    "modifiedAt": "2026-10-21T10:00:00.000Z",
    "image": "/assets/chettinad-masala-vs-garam-masala-differences.webp",
    "imageAlt": "Aromatic whole spices including stone flower, cinnamon, star anise and cardamom on rustic burlap",
    "complete": true
  },
  {
    "slug": "how-to-layer-spices-south-indian-biryani-salna",
    "title": "How to Layer Spices for Authentic South Indian Biryani and Salna",
    "description": "Learn the professional chef technique of whole spice blooming, powder simmering, and garam masala finishing for Dindigul and Ambur biryani.",
    "body": [
      "A truly memorable South Indian biryani—whether Dindigul seeraga samba style or Ambur dum style—does not get its depth by dumping all spices into the pot at once. Professional South Indian chefs use a precise, three-stage **spice layering technique** that extracts aroma, colour, and heat in harmony.",
      "Here is the step-by-step masterclass on how to layer spices for home biryanis and authentic street-style parotta salna.",
      "## Stage 1: Blooming Whole Spices in Hot Fat",
      "Whole spices contain insoluble flavour precursors that dissolve only in hot fat (ghee or oil):",
      "- Heat equal parts pure ghee and cold-pressed oil in a heavy-bottomed handi.\n- When shimmering hot, add whole cinnamon bark, green cardamom pods, cloves, and star anise.\n- Sizzle for 20–30 seconds until the cardamom pods puff up and the cloves release a sweet aroma. This infuses the cooking oil with fragrant base notes that coat every grain of rice later.",
      "## Stage 2: Sautéing Onions and Simmering Ground Powders",
      "Once onions are golden and ginger-garlic paste has lost its raw edge, it is time for the colour and body builders:",
      "- Add [HIPA Turmeric Powder](/products/turmeric-powder) for an antiseptic golden foundation.\n- Add [HIPA Red Chilli Powder](/products/red-chilli-powder) directly into the oil to extract natural fat-soluble red carotenoid pigments.\n- Add [HIPA Coriander Powder](/products/coriander-powder) mixed with thick curd to create the rich masala gravy (*yakhni*).\n- Simmer on medium-low heat until oil droplets separate on the surface (*roghen*).",
      "## Stage 3: The Dum Finishing Touch with Garam Masala",
      "The fatal mistake of amateur cooking is boiling garam masala during Stage 2. High heat destroys delicate top-note aromas of nutmeg, mace, and cardamom.",
      "- Just before sealing the biryani handi with dough or foil for dum cooking, sprinkle 1/2 teaspoon of [HIPA Garam Masala](/products/garam-masala) over the top rice layer along with fresh chopped mint leaves, coriander, and fried shallots.\n- As the handi steams, the rising vapor carries the garam masala fragrance through every layer of rice without scorching the spices.",
      "## Making Street-Style Parotta Salna",
      "No Chennai meal is complete without parotta paired with aromatic roadside salna:",
      "1. Grind roasted coconut, fennel seeds, and roasted gram dal into a smooth paste.\n2. In a kadai, sauté onions, green chillies, curry leaves, and tomatoes.\n3. Add 1.5 teaspoons of [HIPA Sambar Powder](/products/sambar-powder) and 1/2 teaspoon of [HIPA Red Chilli Powder](/products/red-chilli-powder).\n4. Pour in thin coconut milk or vegetable broth and simmer for 8 minutes.\n5. Finish with a pinch of [HIPA Garam Masala](/products/garam-masala) for that unmistakable hotel aroma.",
      "Explore HIPA Masala's [range of traditional spices and masala blends](/products) to cook like a master chef."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-10-20T10:00:00.000Z",
    "modifiedAt": "2026-10-20T10:00:00.000Z",
    "image": "/assets/how-to-layer-spices-south-indian-biryani-salna.webp",
    "imageAlt": "Fragrant South Indian dum biryani garnished with mint, fried onions and whole spices in a copper handi",
    "complete": true
  },
  {
    "slug": "digestive-benefits-traditional-south-indian-spices",
    "title": "7 Digestive Benefits of Traditional South Indian Spices Backed by Science",
    "description": "Explore the digestive and gut-health science behind cumin, black pepper, asafoetida (hing), fenugreek, and turmeric in South Indian everyday meals.",
    "body": [
      "Traditional South Indian cuisine is inherently functional. From morning idli sambar to soothing rasam சாதம் (rice) at lunch, every spice in Tamil culinary heritage was chosen not merely for taste, but for physiological digestive benefits documented across millennia of Siddha and Ayurvedic knowledge.",
      "Modern biomedical research now confirms the bio-active compounds responsible for these traditional health claims.",
      "## 1. Cumin (Jeera): Stimulating Digestive Enzymes",
      "Cumin seeds contain cuminaldehyde and thymol, which stimulate salivary glands and activate pancreatic digestive enzymes. Consuming cumin-infused rasam or jeera water accelerates carbohydrate and fat breakdown in the gastrointestinal tract.",
      "## 2. Black Pepper (Milagu): Piperine and Nutrient Bioavailability",
      "Black pepper's signature active alkaloid is **piperine**. Research published in international nutrition journals reveals that piperine increases stomach hydrochloric acid secretion, preventing sluggish digestion and bloating. Crucially, piperine enhances the bioavailability of curcumin from turmeric by up to 2,000%.",
      "## 3. Asafoetida (Perungayam / Hing): The Natural Anti-Flatulent",
      "Rich in ferulic acid and organic sulphur compounds, asafoetida has powerful anti-spasmodic properties. Adding hing to lentil-heavy sambar or kootu relaxes digestive muscles and eliminates gas production during legume digestion.",
      "## 4. Fenugreek (Vendhayam): Soluble Fibre and Gut Mucosa",
      "Fenugreek seeds contain mucilage, a slippery soluble fibre that coats the stomach lining, shielding it from excess acid. It also slows carbohydrate absorption, supporting balanced post-meal blood sugar levels.",
      "## 5. Turmeric (Manjal): Curcumin and Gut Microbiome",
      "Curcumin is a potent natural anti-inflammatory agent. Daily dietary intake of pure [Turmeric Powder](/products/turmeric-powder) supports gut barrier integrity, reduces intestinal inflammation, and promotes beneficial gut bacteria (*Bifidobacteria*).",
      "## 6. Coriander (Kothamalli / Dhania): Cooling and Spasm Relief",
      "While chillies generate metabolic heat, coriander seeds provide linalool, an aromatic compound with cooling and carminative actions that calms intestinal spasms and balances acidic foods.",
      "## 7. Dried Red Chilli (Milagai): Metabolism and Gastric Blood Flow",
      "Capasaicin in natural dried chillies stimulates local blood circulation across the gastric mucosa and increases core metabolic rate without damaging healthy stomach tissue when consumed in balanced culinary amounts.",
      "## The Quality Rule: Only Pure Spices Deliver Health Benefits",
      "When commercial spices are adulterated with synthetic dyes or starches, their natural therapeutic value is lost. At HIPA Masala in Pallavaram, Chennai, our manufacturing philosophy is strictly centred on 100% natural, unadulterated whole spice milling.",
      "Discover our [pure spice powders and traditional blends](/products) or learn about our [ethical manufacturing processes](/about)."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-10-19T10:00:00.000Z",
    "modifiedAt": "2026-10-19T10:00:00.000Z",
    "image": "/assets/digestive-benefits-traditional-south-indian-spices.webp",
    "imageAlt": "Assortment of medicinal South Indian spices including cumin, black pepper, turmeric, and fenugreek seeds",
    "complete": true
  },
  {
    "slug": "how-to-store-indian-spice-powders",
    "title": "How to Store Indian Spice Powders to Preserve Freshness, Aroma and Essential Oils",
    "description": "Practical ways to store Indian spice powders and masala blends: protect the volatile oils, prevent clumping and keep authentic flavour in your kitchen.",
    "body": [
      "Indian cooking relies heavily on the vibrant fragrance and potency of ground spice powders and traditional masala blends. However, ground spices are delicate: their flavour and aroma come from volatile essential oils (such as curcumin in turmeric, piperine in black pepper, linalool in coriander, and cuminaldehyde in cumin) that degrade quickly when exposed to environmental elements.",
      "## The Four Enemies of Spice Freshness",
      "To preserve the peak potency and colour of your spice powders, you must protect them from four primary environmental factors:",
      "1. **Light:** Direct sunlight and bright kitchen light break down pigments and speed up the oxidisation of volatile essential oils.\n2. **Heat:** Storing spices directly above a cooking range or near ovens causes temperature fluctuations, drying out natural oils and dulling aroma.\n3. **Moisture:** Steam from simmering pots or damp measuring spoons introduces water droplets, leading to clumping, mould growth, and bacterial spoilage.\n4. **Air (Oxygen):** Prolonged contact with oxygen oxidises aromatic compounds, turning bright powders dull and reducing their culinary punch.",
      "## Best Practices for Storing Indian Spices at Home",
      "### 1. Choose Airtight, Non-Reactive Containers\nAlways store freshly ground spice powders in airtight glass, high-grade stainless steel, or ceramic jars with silicone seals. Avoid porous plastics, which absorb spice oils and let microscopic air circulate over time.",
      "### 2. Keep Jars in a Cool, Dark Pantry or Drawer\nStore daily cooking spices in a dedicated kitchen drawer or closed spice cupboard away from the stove and direct sunlight. Keep the bulk reserve in an airtight pantry container and only refill smaller counter jars as needed for 2–3 weeks of cooking.",
      "### 3. Never Spoon Spices Directly Over Steaming Pots\nThe common habit of holding a spice jar over a boiling pot of sambar, rasam, or curry allows hot steam to enter the container. This causes the powder to clump and encourages microbial activity. Instead, measure spices onto a clean, completely dry spoon or small prep bowl away from the stove.",
      "### 4. Understand the Shelf Life of Ground Spices vs Whole Spices\nWhile whole spices can retain their freshness for 2 to 3 years when kept dry, finely ground powders have a larger surface area exposed to air. For optimum flavour and aroma, aim to use pure spice powders and roasted masala blends within **6 to 12 months** of manufacturing.",
      "## Spice Storage Quick Reference Guide",
      "| Spice Type | Best Container | Storage Location | Expected Peak Freshness |\n| --- | --- | --- | --- |\n| Pure Spice Powders ([Turmeric](/products/turmeric-powder), [Chilli](/products/red-chilli-powder), [Coriander](/products/coriander-powder), [Cumin](/products/cumin-powder), [Pepper](/products/pepper-powder)) | Airtight glass or stainless steel container | Dark, cool cupboard / pantry drawer | 6 – 12 months |\n| Roasted Masala Blends ([Sambar Powder](/products/sambar-powder), [Rasam Powder](/products/rasam-powder)) | Airtight jar with tight silicone gasket | Cool cabinet away from heat sources | 6 – 9 months |\n| Whole Spices (Mustard, Fenugreek, Cinnamon, Cloves, Cardamom) | Sealed glass jar or traditional masala dabba | Kitchen drawer or spice rack | 1 – 2 years |\n| Finishing Blends ([Garam Masala](/products/garam-masala)) | Small airtight glass jar | Dark drawer, sealed promptly after each pinch | 6 months |",
      "## How HIPA Masala Protects Freshness at the Source",
      "At HIPA Masala in Pallavaram, Chennai, our manufacturing approach is engineered specifically to preserve natural aromatic oils from raw spice selection to final packaging:",
      "- **Controlled Low-Temperature Milling:** We mill whole spices at carefully controlled low temperatures, ensuring friction heat does not vaporise delicate volatile oils.\n- **Traditional Slow-Roasting for Blends:** Whole spices and lentils for our [Sambar Powder](/products/sambar-powder) and [Rasam Powder](/products/rasam-powder) are gently roasted before grinding to lock in traditional aroma.\n- **Zero Additives or Artificial Colours:** We use 100% natural, pure spices without anti-caking chemicals, artificial dyes, or preservatives.\n- **Multi-Layer Barrier Packaging:** Our retail and institutional packs use food-grade barrier pouches that block ambient moisture, light, and air until opened.",
      "Explore the complete [HIPA Masala product range](/products) to learn more about our traditional pure spices and blends.",
      "## Frequently Asked Questions",
      "### Should I store spice powders in the refrigerator?\nFor everyday spices like turmeric, chilli, cumin, and sambar powder, refrigeration is generally not necessary and can introduce condensation when taken in and out of the fridge. However, if you live in an extremely humid tropical climate and buy bulk quantities (1kg or more), sealing the unopened bulk pack in an airtight bag and keeping it in the refrigerator or freezer until transfer can prolong freshness.",
      "### How do I know if my spice powder has expired?\nSpice powders rarely \"spoil\" in a dangerous way unless exposed to moisture, but they lose flavour potency. Rub a small pinch between your fingers: if the colour has noticeably faded and the aroma is faint or dusty rather than sharp and fragrant, it is time to replace the powder.",
      "### What is the best way to handle bulk spice orders for commercial kitchens?\nFor restaurants, caterers, and food businesses ordering 500g, 1kg, or institutional packs, store bulk bags in a dedicated temperature-controlled dry storage room. Transfer daily working quantities into clearly labelled food-service containers with tight-fitting lids. For business inquiries and wholesale terms, visit our [B2B enquiries page](/b2b-enquiries) or [contact HIPA Masala](/contact)."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-09-30T10:00:00.000Z",
    "modifiedAt": "2026-09-30T10:00:00.000Z",
    "image": "/assets/how-to-store-indian-spice-powders.jpg",
    "imageAlt": "Airtight glass jars with freshly ground Indian spices and whole spice ingredients on a kitchen counter",
    "complete": true
  },
  {
    "slug": "best-masala-manufacturer-in-chennai",
    "title": "Best Masala Manufacturer in Chennai? What Buyers Should Check",
    "description": "Best masala manufacturer in Chennai? Eight buyer checks: range, ingredients, process, blend method, consistency, pack sizes, B2B fit and traceability.",
    "body": [
      "Searching for the **best masala manufacturer in Chennai** usually starts with a price list and ends with a pack that does not behave the way the sample did. Restaurants, caterers, supermarkets and distributors need something more durable than a low quote: a manufacturer whose range, process, pack formats and communication fit the way the business actually buys.",
      "> **Quick answer:** The best masala manufacturer in Chennai for your business is the one that can show you eight things clearly: the products you really use, a specific ingredient approach, a described processing method, blends handled as blends, batches you can test for repeatability, pack formats that match your workflow, a B2B process that answers real questions, and verifiable business details such as an FSSAI licence and GSTIN. Compare suppliers on those eight points in the same recipe or shelf context, and confirm commercial terms on enquiry before approving regular supply.",
      "## Why the lowest quote is the wrong first filter",
      "A masala does more than season a dish. It sets how a recipe is prepared, how a menu tastes from one week to the next, how stock is planned and how a retail shelf looks. Price and catalogue size say nothing about any of that, or about whether the offer matches your operating model.",
      "The checks below are ordered so the quick eliminations come first and the commercial conversation comes last, when you already know which products and formats you are asking about. If you are still deciding whether you need a manufacturer, a supplier or a distributor, read [manufacturer vs supplier vs distributor](/blog/masala-manufacturer-vs-supplier-vs-distributor) first.",
      "## Eight checks for a masala manufacturer in Chennai, in order",
      "### 1. Product fit: start from your purchase list, not the catalogue",
      "Write down the powders and blends you use today, the ones you plan to add, and whether you need single spices, traditional blends or both. A South Indian restaurant typically needs sambar and rasam powders plus turmeric, chilli, coriander, cumin and pepper. A general grocer needs a broader everyday mix that includes garam masala. A distributor needs a range that is easy to explain to several customer types. Map the supplier's list against yours and note the gaps before any conversation.",
      "HIPA's range is compact: eight products, five pure single spice powders (turmeric, red chilli, coriander, cumin and pepper) and three blends (sambar and rasam, the South Indian staples, plus garam masala). Review the [full product range](/products) against your list.",
      "### 2. Ingredient approach: what goes in, and what stays out",
      "Ingredient language should be specific enough that you know what the product is meant to contain. For a single spice, that means one named ingredient; HIPA's [Turmeric Powder](/products/turmeric-powder), for example, is listed as 100% selected dried turmeric rhizomes. For a blend, it means a declared ingredient list you can check against your recipe and your customers' expectations.",
      "Ask just as clearly what the manufacturer leaves out. HIPA's position is no artificial colours, chemical preservatives or synthetic flavour enhancers across the range. Whichever supplier you assess, get the \"what we avoid\" answer in writing alongside the ingredient list.",
      "### 3. Processing: is the method described in plain language?",
      "You need a plain description that shows the method is deliberate and repeatable. Ask how whole spices are selected and cleaned, how they are milled, and what controls the temperature during grinding. Heat generated in grinding drives off the volatile oils that carry aroma, which is why the temperature question matters. HIPA selects and cleans whole spices and mills them at controlled low temperature. Record each supplier's answer next to the product name and proposed use so the comparison is made on the same basis.",
      "### 4. Blend method: are blends handled as blends?",
      "A blend raises a different question from a single spice. The balance of ingredients and how they are prepared before grinding decide how a sambar or garam masala behaves in the pot. HIPA's blends are slow-roasted before grinding; its [Sambar Powder](/products/sambar-powder) combines coriander, red chilli, cumin, fenugreek, black pepper, toor dal, chana dal, turmeric and asafoetida, and roasting the dals is what gives the blend body instead of a raw, floury note. Ask any supplier which products are blends, how they are prepared, and whether your team can taste them in the dishes where they will actually be used.",
      "### 5. Consistency: build your own acceptance test",
      "Set up a check you control rather than relying on the supplier's assurance. Test an initial sample in the real recipe at a realistic serving volume, and write down the dosage, cooking method, colour, heat level and how much adjustment the kitchen needed. When the next supply arrives, run the same preparation and compare notes rather than memory. For retailers and distributors, extend the check to pack presentation, labelling and whether the same items can be reordered without substitutions.",
      "Shelf life belongs here too. HIPA lists 12 months from manufacture; compare any supplier's figure against your actual rotation so you are not opening more product than you can use while it is at its best.",
      "### 6. Pack formats: match the pack to the buying job",
      "Pack size drives handling, storage, replenishment and waste. Retail pouches from 50g to 200g suit supermarket shelves and small kitchens; 500g and 1kg are the bulk formats for restaurants, caterers and commercial kitchens. HIPA offers pouch packs from 50g to 1kg, but not every product is listed in every size: the 1kg pack is listed for the sambar, rasam, turmeric, red chilli and coriander powders, while cumin, pepper and garam masala are listed up to 500g. Confirm the format, labelling and your rotation plan for each product before you order.",
      "- **Retail:** are the pack sizes and labels easy to merchandise, and does the range fill a coherent shelf? See [masala supplier for supermarkets in Chennai](/blog/masala-supplier-for-supermarkets-in-chennai) for the shelf-planning side.\n- **Food service:** do 500g or 1kg packs fit your consumption rate and dry-store conditions?\n- **Distribution:** can each product and format be explained clearly to downstream accounts?",
      "### 7. B2B suitability: does the manufacturer understand business buyers?",
      "A supplier that serves businesses should make it easy to start a relevant conversation: a dedicated enquiry route, a named point of contact and a reply that addresses your questions rather than a generic catalogue. Give the manufacturer enough to work with: your business type, the products under consideration, preferred pack formats, approximate usage or resale context, and where the products will be sold or used. Then judge the reply on whether it answers what you asked and names the next step. Minimum order quantities, lead times and pricing are legitimately confirmed on enquiry, because they depend on the products and volumes involved.",
      "### 8. Traceability: can you verify who you are buying from?",
      "A recurring purchase deserves a supplier you can identify and reach. Check for a registered legal entity, a physical address you could visit, an FSSAI licence number and a GSTIN, and confirm each against the official registers. HIPA Masala is the brand of HIPA Enterprises, FSSAI licence 22426423000366 and GSTIN 33BVIPR5839J1Z1, at Plot No. 10, (Highway Colony), 5th Main Road, Zamin Pallavaram, Highway Nagar, Perumal Nagar, Old Pallavaram, Chennai – 600117, Tamil Nadu. The team is reachable Monday to Saturday, 9:00 am to 5:30 pm, on +91 70580 53055 (phone and WhatsApp) and info@hipamasalas.com. Proximity makes visits and sample exchanges easier for Chennai-area buyers; it does not replace the seven checks above.",
      "## Where HIPA Masala fits",
      "HIPA Masala is the brand of HIPA Enterprises, a masala and spice powder manufacturer in Zamin Pallavaram, Chennai. It makes eight products, five single spice powders and three blends, in retail pouches for home cooks, supermarkets and grocers, and in 500g and 1kg bulk packs for restaurants, caterers and commercial kitchens, distributors and wholesalers; export enquiries are welcome. The range, process and pack formats are set out in one place on the [masala manufacturer in Chennai](/masala-manufacturer-in-chennai) page.",
      "## The comparison checklist",
      "Print this once per shortlisted supplier and mark each row clear, needs confirmation or not a fit.",
      "| Check | Ask the supplier | Record for your file |\n| --- | --- | --- |\n| Range | Which of the powders and blends on our purchase list do you make? | Matches, gaps, single spices vs blends |\n| Ingredients | What is in each product, and what do you deliberately leave out? | Declared ingredient lists, additive position |\n| Processing | How are whole spices selected, cleaned and milled? | Method described, temperature control |\n| Blend method | Which products are blends, and how are they prepared before grinding? | Roasting practice, tasting result in our dish |\n| Consistency | What is the stated shelf life, and how do we raise a batch query? | Our acceptance test, first-batch notes |\n| Pack formats | Which sizes exist for each product we need? | Sizes per product, labelling, rotation plan |\n| B2B process | Who is our contact, and what do you need from us to quote? | Contact route; MOQ, lead time and price confirmed on enquiry |\n| Traceability | What are your legal entity, address, FSSAI licence and GSTIN? | Details checked against official registers |",
      "## Six questions to send with your first enquiry",
      "Adjust these to your products and paste them into your first enquiry.",
      "1. Which items in your current range match the powders and blends on our list, and is anything we need not made?\n2. Which pack sizes are available for each of those products, and how are the packs labelled?\n3. How do you select, clean and mill whole spices, and how are your blends prepared before grinding?\n4. What do you avoid in your products, and what is the shelf life from manufacture?\n5. What details do you need from us (business type, volumes, location) to confirm minimum order, lead time and pricing?\n6. Who handles follow-up questions from our kitchen, store or procurement team, and during which hours?",
      "## FAQ",
      "### What is the single most important check?",
      "Product fit. If the supplier does not make the specific powders and blends your menu or shelf depends on, nothing else in the comparison matters. Start there, then work through ingredients, processing, blend method, consistency, pack formats, B2B process and traceability in that order.",
      "### How do I compare two manufacturers fairly?",
      "Test the same product in the same recipe or selling context, at the same dosage and cooking method, and record the result the same way for both. Keep product-specific answers together so a broad claim from one supplier is not weighed against a detailed answer from another.",
      "### Is a bigger pack always better for a restaurant or caterer?",
      "No. The right format depends on how quickly you use the product, how you store it and how you rotate stock. A 1kg pack left open for weeks in a humid kitchen can lose more aroma than a 500g pack finished within the week. Match the pack to your consumption rate.",
      "### Why are MOQ, lead time and price not on the website?",
      "Because they depend on which products, pack sizes and volumes you are asking about and where the goods are going. A responsible manufacturer confirms them on enquiry rather than publishing a figure that may not apply to your order. Treat a clear, prompt answer as part of the B2B suitability check.",
      "### Does HIPA supply both single spices and blends?",
      "Yes. The range covers five pure single spice powders (turmeric, red chilli, coriander, cumin and pepper) and three blends (sambar powder, rasam powder and garam masala) in pouch packs from 50g to 1kg, depending on the product. The 500g and 1kg packs are the bulk formats for food businesses.",
      "## Next step: run the checklist on HIPA",
      "If HIPA's range matches your purchase list, send a [B2B enquiry](/b2b-enquiries) with your business type, products, pack sizes and usage context, and ask the six questions above. To fill in the checklist first, start with the [masala manufacturer in Chennai](/masala-manufacturer-in-chennai) page, which sets out the range, process and pack formats in one place.\n"
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-09-24T09:00:00.000Z",
    "modifiedAt": "2026-10-03T05:40:00.000Z",
    "image": "/assets/best-masala-manufacturer-in-chennai.webp",
    "imageAlt": "B2B buyer guide cover showing supplier comparison documents in a Chennai food-industry setting",
    "complete": true
  },
  {
    "slug": "masala-manufacturer-vs-supplier-vs-distributor",
    "title": "Masala Manufacturer vs Supplier vs Distributor: Which to Buy From",
    "description": "Buy from a masala manufacturer for consistent blends and bulk packs, a supplier for convenience, a distributor for multi-outlet reach. A Chennai guide.",
    "body": [
      "When a restaurant, retailer, hotel, caterer or food business in Chennai starts sourcing masala, the words manufacturer, supplier and distributor can sound interchangeable. They are not. A manufacturer makes or processes the masala, a supplier arranges products for business buyers, and a distributor moves products through a wider channel. Knowing the difference helps you ask better questions, compare the right options and decide which of the three your business should actually buy from.",
      "## Quick answer: which should a Chennai food business buy from?",
      "**Answer first:** buy from a **manufacturer** when you want the masala made to a consistent recipe, need 500g and 1kg bulk packs, or have questions about ingredients and processing that only the maker can answer; this suits most restaurants, caterers, commercial kitchens and supermarkets building their own shelf range. Buy from a **supplier** when you want one convenient business contact for a range you already trust and do not need production-level detail. Buy from a **distributor** when you run several outlets or need regular replenishment across a territory and would rather one trade partner coordinate stock and delivery than deal with each brand directly. It is also common for a food business to do two of these at once: source its core South Indian blends directly from the manufacturer and fill out the rest of the shelf or store room through a supplier or distributor.",
      "The roles differ in responsibility. A **masala manufacturer** produces, processes, blends or packs spice products under its own operation or brand. A **masala supplier** is a business-facing source that provides products to a buyer; it may supply its own manufactured range or arrange products from another producer. A **distributor** purchases or handles products for resale to retailers, food-service buyers or other trade customers, usually with a focus on territory, stock movement and delivery. One company can perform more than one role, so the label alone is not enough. Ask who makes the product, who owns the customer relationship and who is responsible for fulfilment.",
      "## What a masala manufacturer actually does",
      "A manufacturer is closest to the production stage. Its responsibilities can include selecting ingredients, cleaning or preparing whole spices, milling powders, developing blends, packing finished goods and maintaining an internal process for repeat batches. For a buyer, this role can make it easier to understand how a product is made and to discuss a range at the source rather than through several intermediaries.",
      "HIPA Masala is an Indian spice brand owned and operated by HIPA Enterprises in Zamin Pallavaram, Chennai. As a [masala manufacturer in Zamin Pallavaram, Chennai](/masala-manufacturer-in-chennai), HIPA falls squarely into the first of the three roles: it makes the products it sells, so business buyers can discuss ingredients, processing and pack formats with the producer directly. Its product presentation includes pure single spice powders and traditional South Indian blends. HIPA states that its approach includes selected whole spices, controlled low-temperature milling, slow-roasting whole spices and lentils for blends, zero artificial dyes, chemical preservatives and synthetic flavour enhancers, and attention to batch consistency. These are HIPA’s stated practices; buyers should discuss the product and documentation requirements relevant to their own business. HIPA describes formats from household packs through 500g and 1kg bulk packs, with B2B support for supermarkets and grocers, restaurants, caterers and commercial kitchens, and distributors and wholesalers.",
      "## What a masala supplier provides",
      "A supplier is the commercial link between a product range and the business that needs it. The supplier may be the manufacturer, a stockist, a trading business or another authorised channel. Its value is often convenience: one point of contact, a defined product list, business communication and an arrangement for supplying the quantities and formats the buyer needs.",
      "When comparing suppliers, do not stop at “wholesale supplier.” Clarify whether the supplier is the producer, where goods are sourced, which products are available and how the order will be handled. Ask for exact product names, pack sizes, applicable product information and the process for raising a repeat order. A supplier may be the best fit when you want direct access to a brand’s range without building a separate procurement network.",
      "For example, a food-service buyer can review HIPA Masala’s [full masala and spice powder range](/products) before discussing a business requirement. The listed range includes Sambar Powder, Rasam Powder, Turmeric Powder, Red Chilli Powder, Coriander Powder, Cumin Powder, Pepper Powder and Garam Masala. A retailer may be interested in household packs, while a restaurant or caterer may need bulk pack formats. Those are different buying conversations, even when the brand is the same.",
      "## How a distributor differs from a manufacturer or supplier",
      "A distributor is primarily concerned with channel coverage. It may buy products from a manufacturer or supplier and resell them to retailers, restaurants, supermarkets, hotels, caterers or other trade accounts. Its strengths can include local market knowledge, a network of outlets, delivery coordination and the ability to combine products from different brands or categories.",
      "Distribution can be useful when your business serves multiple locations or when you need a trade partner to manage regular movement. However, the distributor may not be the right person to answer detailed production questions. If ingredient selection, milling approach or blend method matters to your evaluation, ask to speak with the brand or manufacturer as well. If your priority is route coverage, stock availability and coordinated delivery, evaluate the distributor’s operating fit instead.",
      "## Comparison table for Chennai business buyers",
      "| Role | Main responsibility | Best question to ask | Often useful for |\n| --- | --- | --- | --- |\n| Manufacturer | Makes, processes, blends or packs the product. | Who produces the masala, and what product and pack options are available? | Buyers who want source-level product understanding and a direct brand conversation. |\n| Supplier | Provides products to a business buyer through a commercial supply arrangement. | Are you the producer or a sourcing channel, and how will repeat orders be handled? | Retailers, food businesses and institutions seeking a convenient business source. |\n| Distributor | Moves products through a territory or resale network. | Which outlets or areas do you serve, and how is replenishment coordinated? | Businesses needing channel reach, multi-location movement or trade coverage. |",
      "## Choosing between the three for your Chennai food business",
      "Once you know which role fits the job, work through the checklist below before you send an enquiry; it applies whether you are talking to the maker, a business supplier or a trade distributor.",
      "### Buyer checklist before placing an enquiry",
      "- **Identify the role:** Ask whether you are speaking to the manufacturer, a direct supplier or a distributor.\n- **Confirm the range:** Match the products to your menu, shelf plan or customer demand. HIPA provides dedicated information for [Sambar Powder](/products/sambar-powder) and [Rasam Powder](/products/rasam-powder), two traditional South Indian blend categories.\n- **Review pack suitability:** Compare household packs with the stated 500g and 1kg bulk formats where relevant to your operation.\n- **Ask about process:** If production approach matters, ask the brand to explain its stated handling of whole spices, milling, roasting and blend preparation.\n- **Plan replenishment:** Establish who receives repeat orders and how you will communicate changes in quantity, location or product mix.\n- **Keep the evaluation proportionate:** Request only the product, commercial and business information needed for your decision; do not assume a channel role proves performance on its own.",
      "## Understanding the HIPA Masala range for business use",
      "HIPA Masala presents a focused range that can suit different parts of a commercial kitchen or retail assortment. Single spice powders include [Turmeric Powder](/products/turmeric-powder), [Red Chilli Powder](/products/red-chilli-powder), [Coriander Powder](/products/coriander-powder), [Cumin Powder](/products/cumin-powder) and [Pepper Powder](/products/pepper-powder). The blend range also includes [Garam Masala](/products/garam-masala). For a buyer, separating everyday single spices from recipe-oriented blends can make it easier to map products to kitchen use, shelf placement or a distributor’s assortment.",
      "## Common mistakes when comparing these three channels",
      "1. **Comparing different roles as if they were identical:** A manufacturer’s production discussion, a supplier’s ordering discussion and a distributor’s route discussion answer different questions.\n2. **Assuming “direct” explains everything:** Direct contact is useful, but you still need clarity on products, packs, ordering and the person responsible for follow-up.\n3. **Choosing only by the lowest quoted figure:** A commercial comparison should also consider the fit between pack size, replenishment process, communication and intended use.\n4. **Skipping the business brief:** A clear description of your outlet type, location and requirement helps the other party respond more usefully.",
      "## FAQ: masala manufacturer and supplier questions",
      "### Is every masala supplier also a manufacturer?",
      "No. Some suppliers manufacture their own range; others source and provide products made by another business. Ask directly who produces the product and who will manage your account.",
      "### Should a restaurant buy from a manufacturer or distributor?",
      "Either can work. A manufacturer suits a restaurant that wants a direct brand conversation, consistent blends and bulk packs, while a distributor suits a business that values route coverage or consolidated trade supply across several outlets. Compare the actual operating fit.",
      "### Can one company be both a manufacturer and supplier?",
      "Yes. A brand can make products and supply them directly to business buyers, while also working with distributors for broader market access. Confirm which channel you are using for your enquiry.",
      "### How do I start a HIPA Masala business enquiry?",
      "Use the [HIPA Masala B2B enquiry page](/b2b-enquiries) and explain your business type, product interest, pack requirement and location. Pack availability, minimum order quantities and lead times are confirmed on enquiry. HIPA Enterprises lists its address in Zamin Pallavaram, Chennai, and provides a [contact page](/contact) for further communication.",
      "## Make the right distinction before you buy",
      "The difference between a manufacturer, supplier and distributor is fundamentally about responsibility: who makes the masala, who supplies it to your business and who moves it through a resale or delivery network. For Chennai and Tamil Nadu buyers, defining that responsibility early can make sourcing clearer and reduce avoidable back-and-forth. If buying direct from the maker is the right fit for your business, learn about [HIPA Masala and HIPA Enterprises](/about), review the range, and then share your requirement through the [HIPA Masala website](/). A specific business brief is the best next step toward a practical conversation.\n"
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-09-24T09:00:00.000Z",
    "modifiedAt": "2026-09-30T10:47:29.000Z",
    "image": "/assets/masala-manufacturer-vs-supplier-vs-distributor.webp",
    "imageAlt": "B2B supply chain guide cover showing manufacturer, supplier and distributor stages in a food-industry facility",
    "complete": true
  },
  {
    "slug": "masala-supplier-for-supermarkets-in-chennai",
    "title": "Supermarket Masala Supplier in Chennai: Retail Buyer's Checklist",
    "description": "A retail buyer's checklist for choosing a supermarket masala supplier in Chennai: product range, pack sizes, labelling, availability and how to enquire.",
    "body": [
      "Supermarket buyers need more than a masala product list. They need a supplier with a relevant product range, clear pack information, dependable communication, and products that fit the needs of local shoppers. This retail buyer’s checklist sets out what to check when choosing a **supermarket masala supplier in Chennai**: product demand, shelf suitability, available pack sizes, labelling, supply communication, and enquiry support.",
      "**HIPA Masala is a Chennai-based Indian spice and masala brand serving home cooks and enquiries from supermarkets and grocers, retailers, distributors, wholesalers, restaurants, caterers, and exporters.** HIPA is a [masala manufacturer based in Zamin Pallavaram, Chennai](/masala-manufacturer-in-chennai), so supermarkets that stock the range buy direct from the maker. The current range includes spice powders and masala blends for everyday Indian cooking.",
      "This checklist covers what supermarket buyers should confirm before selecting a masala supplier in Chennai, how to evaluate a product range, what information to include in a retailer enquiry, and how the current HIPA Masala range may fit a supermarket shelf.",
      "> **Quick answer:** A supermarket masala supplier in Chennai should offer a relevant product range, clear product information, suitable pack sizes, enquiry support, and a practical process for confirming availability. Work through the checklist below, then review the [current HIPA Masala product range](/products) and contact the team about supermarket, retail, or distribution requirements.",
      "## About HIPA Masala",
      "HIPA Masala is presented on its official website as a Chennai-based Indian spice and masala brand. The website provides product information, individual product pages, product enquiry options, and business categories that include retailers, supermarkets, distributors, wholesalers, restaurants, and exporters.",
      "The current website information is useful for initial product evaluation, but supermarket buyers should confirm product availability, pack details, ingredients, commercial terms, delivery arrangements, and any certification or regulatory information against the latest packaging or directly with HIPA Masala.",
      "This article is written for retail buyers and is intended to support supplier evaluation. It does not replace a retailer’s own product, packaging, regulatory, commercial, or customer-demand checks.",
      "## What Should Supermarkets Look for in a Masala Supplier?",
      "A supermarket supplier should be evaluated from both the customer’s perspective and the retailer’s operational perspective. Shoppers want familiar products, clear information, and convenient pack sizes. Retailers need products that can be listed, stocked, replenished, and explained to customers.",
      "| Retail buyer requirement | What to check |\n| --- | --- |\n| Product range | Confirm that the supplier offers the spice powders and masala blends relevant to your shoppers. |\n| Pack sizes | Check whether the listed pack formats fit your shelf plan and customer price points. |\n| Product information | Review product descriptions, ingredients, net quantity, dates, storage information, and packaging details. |\n| Availability | Confirm which products are currently available before listing them in the store. |\n| Enquiry process | Check how to submit a retail, supermarket, distributor, or wholesale enquiry. |\n| Supply terms | Discuss order quantities, delivery or collection options, and repeat-order communication directly with the supplier. |\n| Product fit | Evaluate whether the product is suitable for the recipes and customer preferences in your market. |",
      "A supermarket should not select a masala supplier based only on a low unit price. Product fit, pack clarity, availability, customer demand, and supplier communication can have a greater impact on long-term shelf performance.",
      "## HIPA Masala Product Range for Supermarket Shelves",
      "The current HIPA Masala range includes everyday spice powders and masala blends. Retailers can review each individual product page before contacting the team.",
      "### Masala Blends",
      "| Product | Retail relevance | Current listed pack information |\n| --- | --- | --- |\n| [**Sambar Powder**](/products/sambar-powder) | A South Indian spice blend for everyday sambar preparation. | 100g, 200g, 500g, 1kg |\n| [**Rasam Powder**](/products/rasam-powder) | A masala blend for rasam preparation and everyday South Indian cooking. | 100g, 200g, 500g, 1kg |\n| [**Garam Masala**](/products/garam-masala) | A familiar Indian masala blend for everyday cooking. | 100g, 200g, 500g |",
      "### Essential Spice Powders",
      "| Product | Retail relevance | Current listed pack information |\n| --- | --- | --- |\n| [**Turmeric Powder**](/products/turmeric-powder) | An everyday kitchen spice powder. | 100g, 200g, 500g, 1kg |\n| [**Red Chilli Powder**](/products/red-chilli-powder) | A common product for recipes that use red chilli powder. | 100g, 200g, 500g, 1kg |\n| [**Coriander Powder**](/products/coriander-powder) | A regular cooking ingredient for Indian recipes. | 100g, 200g, 500g, 1kg |\n| [**Cumin Powder**](/products/cumin-powder) | A spice powder used in everyday cooking and seasoning. | 100g, 200g, 500g |\n| [**Pepper Powder**](/products/pepper-powder) | A familiar kitchen product for seasoning and recipes that use pepper. | 50g, 100g, 200g, 500g |",
      "Pack sizes and availability can change. Retailers should use the [complete HIPA Masala Products page](/products) as a starting point and confirm the latest details before placing a listing or purchase order.",
      "## Retail Buyer’s Checklist for a Supermarket Masala Supplier in Chennai",
      "### 1. Start with the supermarket’s customer profile",
      "A neighbourhood supermarket in Chennai may serve a different customer mix from a premium grocery store, wholesale outlet, or multi-location retail chain. Before contacting a supplier, identify whether your customers primarily need everyday South Indian products, general Indian spice powders, larger family packs, smaller trial packs, or a combination of these.",
      "### 2. Match the product range to shelf demand",
      "Start with products that are relevant to the recipes and buying habits of your customers. Sambar Powder, Rasam Powder, Turmeric Powder, Red Chilli Powder, Coriander Powder, Cumin Powder, Pepper Powder, and Garam Masala provide a practical range for evaluating everyday demand.",
      "Do not list a product only because it is available. Consider whether the product fits your existing spice section, customer expectations, price architecture, and replenishment process.",
      "### 3. Review packaging and product information",
      "Before stocking a product, check the packaging carefully. Retail buyers should review the product name, ingredient declaration, net quantity, batch information, manufacturing or packing details, dates, storage guidance, applicable regulatory information, and contact information shown on the pack.",
      "The latest product packaging should be treated as the final source for product-specific details. If a retailer needs additional information, the question should be sent directly to HIPA Masala before listing the product.",
      "### 4. Confirm the current pack sizes",
      "Pack sizes influence shelf planning, customer choice, pricing, and stock movement. The HIPA website currently lists product-specific pack information, but retailers should confirm the latest details because pack formats and availability may change.",
      "Ask the supplier which pack sizes are currently available, which products are suitable for retail listing, and whether the expected order volume matches the retailer’s requirements.",
      "### 5. Ask about availability and repeat ordering",
      "A supermarket should understand how availability is communicated and how repeat enquiries are handled. Ask which products are currently active, how to submit a reorder request, and whom to contact when stock needs to be replenished.",
      "Order quantities, minimum volumes, and lead times are not published on the website; they are confirmed on enquiry. Retailers can raise these questions through the [HIPA Masala B2B enquiries page](/b2b-enquiries) before planning a listing.",
      "### 6. Clarify delivery or collection arrangements",
      "Retailers in Chennai should provide their store location or service area when submitting an enquiry. Ask whether the current requirement can be supported through delivery or collection and whether the arrangement depends on product, order size, or location.",
      "The [HIPA Masala Contact page](/contact) provides the current contact and enquiry options.",
      "## What Information Should a Supermarket Include in Its Enquiry?",
      "A detailed enquiry helps a supplier understand the retailer’s requirement. Include the following information:",
      "- Supermarket or business name\n- Store location and city or service area\n- Business type, such as retailer, supermarket, distributor, or wholesaler\n- Products of interest\n- Preferred pack sizes\n- Expected monthly or periodic volume\n- Whether the requirement is for one store or multiple locations\n- Delivery or collection questions\n- Any request for product information or samples",
      "For example, a retailer could write: “We operate a supermarket in Chennai and are interested in stocking Sambar Powder, Rasam Powder, Turmeric Powder, Red Chilli Powder, Coriander Powder, Cumin Powder, Pepper Powder, and Garam Masala. Please share the current retail pack sizes, product details, availability, and enquiry process.”",
      "Retailers can use the [HIPA Masala Contact page](/contact) to submit a current enquiry.",
      "## Common Mistakes Retail Buyers Should Avoid",
      "### Choosing only by price",
      "The lowest unit price does not automatically produce the best retail outcome. Consider the product’s fit, packaging clarity, customer demand, order practicality, and expected repeat purchase potential.",
      "### Listing products without checking availability",
      "A retailer should confirm that a product is currently available before creating a shelf listing, catalogue entry, or promotional message.",
      "### Ignoring pack-size suitability",
      "A supermarket serving daily household shoppers may need different pack formats from a wholesale store or institutional buyer. Discuss pack sizes before finalising the range.",
      "### Making unsupported product claims",
      "Retailers should not advertise a product as “pure,” “chemical-free,” “preservative-free,” “FSSAI-certified,” or “best” unless the claim is supported by current packaging, regulatory documentation, or written confirmation from the supplier.",
      "### Sending an incomplete enquiry",
      "A message that only says “send wholesale price” does not explain the business requirement. Include the store location, product list, preferred pack sizes, and expected volume so the supplier can respond more effectively.",
      "## Frequently Asked Questions",
      "### What makes a good supermarket masala supplier in Chennai?",
      "A good supplier should offer a relevant product range, clear packaging information, suitable pack sizes, current availability, and a practical process for retail or supermarket enquiries. HIPA Masala is a Chennai-based masala manufacturer with a current range for everyday cooking and business enquiries. Retailers should review the [HIPA Masala Products page](/products) and confirm current commercial details directly.",
      "### Does HIPA Masala supply supermarkets in Chennai?",
      "The HIPA Masala website includes supermarkets and retailers among its business enquiry categories. A supermarket should submit its store location, product requirements, pack preferences, and expected volume so HIPA can confirm the current product and supply information.",
      "### What products can a supermarket enquire about?",
      "A supermarket can enquire about [Sambar Powder](/products/sambar-powder), [Rasam Powder](/products/rasam-powder), [Turmeric Powder](/products/turmeric-powder), [Red Chilli Powder](/products/red-chilli-powder), [Coriander Powder](/products/coriander-powder), [Cumin Powder](/products/cumin-powder), [Pepper Powder](/products/pepper-powder), and [Garam Masala](/products/garam-masala), subject to current availability.",
      "### What pack sizes are available?",
      "The current Products page lists product-specific pack sizes. Sambar Powder, Rasam Powder, Turmeric Powder, and Red Chilli Powder are currently listed in 100g, 200g, 500g, and 1kg formats. Coriander Powder is also listed in these formats. Cumin Powder and Garam Masala are listed in 100g, 200g, and 500g formats, while Pepper Powder is listed in 50g, 100g, 200g, and 500g formats. Confirm the latest details before ordering.",
      "### What should a retailer ask before placing an order?",
      "Ask about current availability, pack sizes, product information, expected order quantity, delivery or collection arrangements, repeat-order communication, and any product or sample information required for evaluation.",
      "### Where is HIPA Masala based?",
      "HIPA Masala is based in Zamin Pallavaram, Chennai, Tamil Nadu, India. Retailers can use the [Contact page](/contact) for the current phone number, email address, enquiry form, and location information.",
      "### Does HIPA Masala accept distributor and wholesale enquiries?",
      "Yes. HIPA Masala serves distributors and wholesalers alongside supermarkets and grocers, restaurants, caterers, and export enquiries. Order quantities, pricing, and lead times are confirmed on enquiry, so submit the requirement through the [B2B enquiries page](/b2b-enquiries) and confirm the current position directly with HIPA.",
      "## Contact HIPA Masala About Supermarket Supply",
      "If you are looking for a **supermarket masala supplier in Chennai**, use this checklist to begin with a clear product and retail requirement. Review the current product range, select the products relevant to your shoppers, and prepare your store location, preferred pack sizes, and expected volume.",
      "1. Browse the [HIPA Masala product range](/products).\n2. Review the individual product pages relevant to your supermarket.\n3. Prepare your business type, store location, products required, preferred pack sizes, and expected volume.\n4. Submit the requirement through the [HIPA Masala Contact page](/contact).\n5. Confirm current product, availability, pack, delivery, and commercial information directly with the HIPA team.",
      "This guide was prepared by the HIPA Masala team using the product, pack, and contact information published on the HIPA Masala website.\n"
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-09-10T11:16:00.000Z",
    "modifiedAt": "2026-09-30T10:47:29.000Z",
    "image": "/assets/masala-supplier-supermarkets-chennai-cover.jpg",
    "imageAlt": "Masala Supplier for Supermarkets in Chennai - HIPA Masala",
    "complete": true
  },
  {
    "slug": "what-makes-a-good-spice-powder",
    "title": "What Makes a Good Spice Powder? A Simple Buying Guide",
    "description": "Learn practical, general checks for choosing spice powders, including label clarity, storage information, pack condition and recipe suitability.",
    "body": [
      "## What makes a good spice powder?",
      "A good spice powder should be easy to identify, easy to store and suitable for the recipe you plan to cook. Choosing a powder does not require complicated rules. Begin with the label, the condition of the pack and the role that the powder will play in your kitchen.",
      "## Match the powder to the recipe",
      "Read the product name first. A single-spice powder is different from a masala blend, and each one is used differently. Select a powder that matches the dish you are preparing rather than choosing only by colour or packaging.",
      "## Check that the pack is clear and intact",
      "Look for a pack that is sealed, clean and easy to read. The label should help you identify the product and review information that matters to your household. Avoid relying on information that is not shown on the pack, and ask the brand if you need clarification.",
      "## Review the storage guidance",
      "Storage matters after opening. Keep the pack closed and follow the storage guidance provided on the label. Keeping opened packs away from direct heat and moisture can make it easier to keep your kitchen organised and identify the product when you need it.",
      "## Choose a quantity that suits your routine",
      "Think about how often you cook with that type of powder. Select a quantity that you can use and store carefully as part of your normal routine. This is especially useful when you are trying a new blend for the first time.",
      "## Add seasoning gradually",
      "Use the right quantity for the recipe. Add spice powders gradually, taste as you cook and adjust to suit your household preference. This gives you more control when you are using a product or blend for the first time.",
      "## Find current product information",
      "You can [[browse the HIPA Masala product range|/products]] and read the [[current product-information FAQ|/faq]] for general guidance. For further product or pack details, [[contact HIPA|/contact#enquire]].",
      "## Keep the selection process simple",
      "A short checklist is often more useful than a complicated buying rule. Confirm that the product type suits the recipe, read the available pack information and think about how the powder will fit into your usual cooking routine. This approach keeps the choice connected to the dish you are actually preparing.",
      "## Use the label as a practical reference",
      "The label can help you identify the product and follow the storage guidance supplied with the pack. If a question matters to your household, check the current product information or ask the brand directly instead of relying on a broad assumption about every spice powder.",
      "## Frequently asked questions",
      "### What should I check before buying a spice powder?",
      "Check the product name, whether the pack is clear and intact, the information available on the label and whether the product suits your recipe.",
      "### Should I add a new spice powder all at once?",
      "Start with a small amount, follow the recipe and adjust gradually to suit your household preference.",
      "### Where can I find more product guidance?",
      "You can [[browse HIPA Masala products|/products]] and read the [[current product-information FAQ|/faq]] for general guidance.",
      "## How Do You Test Masala Powder Samples?",
      "Masala powder samples can be evaluated by comparing appearance and colour, aroma, texture and particle size, taste and flavour, moisture, cleanliness and consistency. These practical checks help a buyer judge whether a sample suits the intended use. Where appropriate, independent laboratory or quality testing can provide further information.",
      "### Practical checks to compare",
      "Look for a clean sample with no visible foreign matter, assess whether the aroma and texture suit the intended dish, and compare the flavour in a small, familiar recipe. Record the same observations for each sample rather than relying on a single factor. Follow product-specific handling guidance and seek appropriate independent testing when more formal verification is required.",
      "## Related reading",
      "To explore each check further, read [[how to read a spice powder label|/blog/how-to-read-a-spice-powder-label]], [[how spice quality affects food taste and consistency|/blog/how-spice-quality-affects-food-taste]] and [[questions to compare spice-supplier information|/blog/true-cost-of-your-spice-supplier]]."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-08-25T09:02:59.000Z",
    "modifiedAt": "2026-08-25T09:34:13.000Z",
    "image": "/assets/hipa-original-good-spice-cover-web_caaa742d.webp",
    "imageAlt": "Original HIPA guide cover for choosing a good spice powder",
    "complete": true
  },
  {
    "slug": "true-cost-of-your-spice-supplier",
    "title": "Understanding the Total Cost of a Spice Supplier",
    "description": "Learn general factors to consider beyond unit price when evaluating spice suppliers, including clarity, suitability and product-information needs.",
    "body": [
      "## Understanding the total cost of a spice supplier",
      "Price is an important part of a purchasing decision, but it is not the only point to consider when evaluating a spice supplier. The total cost of a product can also be affected by how clearly information is presented, whether the item suits the intended use and how easily questions can be answered before a decision is made.",
      "## Start by defining the requirement",
      "Write down what you actually need before comparing options. A household purchase, a restaurant requirement and a retail enquiry can involve different questions. Product name, pack information, label clarity and the intended recipe or use are practical starting points.",
      "## Compare like with like",
      "Two products may have different pack quantities, intended uses or label information. Comparing the details carefully helps prevent a decision based only on a headline price. Keep the product name and the pack information alongside any notes you make so that comparisons remain clear.",
      "## Review product information carefully",
      "Read the available product information before assuming that two options are equivalent. Confirm which type of spice powder or blend suits the recipe or intended use. When a detail is unclear, ask a direct question rather than relying on an assumption.",
      "## Keep questions specific",
      "A clear enquiry is easier to compare later. Note the product name, the information you need and the intended use. This can help you ask relevant questions and keep each option organised without over-relying on a single factor.",
      "## A practical comparison checklist",
      "Before making a decision, check that you understand the product name, intended use, pack information and the details relevant to your own requirements. Use the same checklist for each option so that your comparison is consistent.",
      "## Find current HIPA information",
      "For general information, [[browse the HIPA Masala product range|/products]] and review the [[current product-information FAQ|/faq]]. For a specific product or pack question, [[contact HIPA|/contact#enquire]]. Details about any future commercial, wholesale or distributor arrangements will be shared only when HIPA confirms that those operations are active.",
      "## Separate facts from assumptions",
      "A useful comparison starts with information you can see or confirm. Keep product details, pack information and questions in separate notes. This makes it easier to distinguish confirmed information from an assumption made during the comparison.",
      "## Review the decision after the first purchase",
      "After a purchase, review whether the product suited the intended use and whether the information you needed was available. This turns a one-time decision into a clearer checklist for future comparisons without relying on a single headline or one factor alone.",
      "## Frequently asked questions",
      "### Is the lowest unit price always the full cost?",
      "Not necessarily. Compare the product name, intended use, pack information and the clarity of available details before making a decision.",
      "### What should I ask before choosing a spice product?",
      "Ask questions that relate to your own requirement, such as the product type, available pack information and the intended use.",
      "### How can I ask HIPA about a specific product?",
      "You can [[browse current HIPA products|/products]] and [[contact HIPA|/contact#enquire]] with the product or pack detail you need.",
      "## Related reading",
      "For useful comparison context, read [[how spice quality affects food taste and consistency|/blog/how-spice-quality-affects-food-taste]], [[what makes a good spice powder|/blog/what-makes-a-good-spice-powder]] and [[how to read a spice powder label|/blog/how-to-read-a-spice-powder-label]]."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-08-25T09:02:59.000Z",
    "modifiedAt": "2026-08-25T09:34:13.000Z",
    "image": "/assets/hipa-original-supplier-cost-cover-web_493aea4d.webp",
    "imageAlt": "Original HIPA guide cover about evaluating the total cost of a spice supplier",
    "complete": true
  },
  {
    "slug": "south-indian-lunch-box-recipes",
    "title": "10 South Indian Lunch Box Recipes for Busy Mornings",
    "description": "Explore ten practical South Indian lunch box ideas for busy mornings, from rice dishes to simple sambar and rasam pairings.",
    "body": [
      "## South Indian lunch box recipes for busy mornings",
      "Busy mornings are easier when lunch box ideas are simple, familiar and easy to prepare in advance. South Indian cooking offers many practical options built around rice, vegetables, lentils, curd and straightforward spice blends. A short weekly plan can reduce last-minute decisions and make it easier to rotate meals.",
      "## 1. Lemon rice",
      "Lemon rice is a familiar option when you have cooked rice ready. Pack it with a simple vegetable side, curd or fruit depending on your usual lunch routine.",
      "## 2. Tomato rice",
      "Tomato rice can be prepared with cooked rice and a simple tomato-based seasoning. It is a useful option when you want a different flavour profile without preparing several separate dishes.",
      "## 3. Curd rice",
      "Curd rice is a simple packed-meal idea for households that enjoy it. Keep the side dish separate when that makes packing easier for your routine.",
      "## 4. Vegetable pulao",
      "Vegetable pulao can help you use a small selection of vegetables with rice in one dish. Prepare and pack it according to your usual cooking method.",
      "## 5. Coconut rice",
      "Coconut rice is another practical rice-based choice. A simple vegetable accompaniment can make the lunch box more varied without adding a complicated morning step.",
      "## 6. Sambar rice",
      "Sambar rice can be useful when you already have lentils and vegetables planned. Prepare the dish using your familiar recipe and pack it in a suitable container.",
      "## 7. Rasam rice",
      "Rasam can be packed separately with rice when you prefer a lighter meal. Planning the cooked rice and vegetable preparation the night before can make the morning routine smoother.",
      "## 8. Vegetable kurma with chapati",
      "A mild vegetable kurma with chapati is a practical non-rice option. Pack the curry and chapati separately if that works better for travel and serving.",
      "## 9. Idli with chutney",
      "Idli with chutney is a familiar option that can be prepared or arranged in advance. Use a container that keeps the items easy to carry.",
      "## 10. Vegetable upma",
      "Vegetable upma is a straightforward choice when you want a simple morning meal to pack. Rotate it with the other ideas so that lunch boxes do not become repetitive.",
      "## Explore spice-powder information for your recipes",
      "For sambar-style dishes, review the current [[Sambar Powder|/products/sambar-powder]] information. For rasam-style dishes, review [[Rasam Powder|/products/rasam-powder]]. You can also [[browse all HIPA products|/products]] for the available range.",
      "## A simple weekly lunch box plan",
      "Choose two or three rice-based ideas, one chapati-based option and one breakfast-style option for the week. This keeps the routine varied while making shopping and preparation easier to plan. You can decide the night before which vegetables, rice or accompaniments will be needed in the morning.",
      "## Pack foods in a practical order",
      "Use containers that suit the food you have prepared and keep items separate when that is helpful for your routine. Pack the meal according to your usual food-safety and storage practices, then make a short note of the dishes that worked well for future mornings.",
      "## Frequently asked questions",
      "### Which lunch box recipes can be prepared ahead?",
      "Many of the ideas in this guide can be planned the night before, such as cooked rice, chopped vegetables and a simple accompaniment. Follow your usual preparation method.",
      "### How can I avoid repeating the same lunch box?",
      "Rotate rice dishes, a chapati meal, idli or dosa options and a simple breakfast-style dish through the week.",
      "### Where can I find product information for sambar or rasam recipes?",
      "Review the current [[Sambar Powder|/products/sambar-powder]] and [[Rasam Powder|/products/rasam-powder]] information for those recipe types.",
      "## Related reading",
      "When planning a meal, [[how to choose sambar powder for everyday cooking|/blog/how-to-choose-sambar-powder]], [[how to read a spice powder label|/blog/how-to-read-a-spice-powder-label]] and [[how spice quality affects food taste and consistency|/blog/how-spice-quality-affects-food-taste]] can help with related kitchen decisions."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-08-25T09:02:59.000Z",
    "modifiedAt": "2026-08-25T09:34:13.000Z",
    "image": "/assets/hipa-original-lunch-box-cover-web_d0df26a5.webp",
    "imageAlt": "Original HIPA guide cover for South Indian lunch box recipes",
    "complete": true
  },
  {
    "slug": "how-spice-quality-affects-food-taste",
    "title": "How Spice Quality Affects Food Taste and Consistency",
    "description": "Learn how freshness, storage, label clarity and gradual seasoning can affect taste and consistency in everyday cooking.",
    "body": [
      "## How spice quality can affect food taste and consistency",
      "Spice powders influence the aroma, colour and overall character of everyday dishes. When a familiar recipe tastes different from one attempt to the next, the cause is not always the recipe itself. The type of powder selected, the condition of the pack, storage habits and the quantity used can all affect how a spice powder is handled in the kitchen.",
      "## Start with the right type of powder",
      "A blended masala and a single-spice powder have different cooking roles. Choosing a product that matches the dish you plan to make is a useful first step toward a more consistent result. Read the product name carefully and use the powder according to the recipe rather than treating every spice powder in the same way.",
      "## Check the label before cooking",
      "The label can help you identify the product, review information that matters to your household and find storage guidance. When comparing packs, read the product name and any relevant information instead of relying only on the front design. If a detail is unclear, ask the brand for clarification rather than assuming an unlisted claim is true.",
      "## Store opened packs carefully",
      "After opening a pack, keep it closed, dry and away from direct heat and moisture. This simple routine helps you keep the kitchen organised and makes it easier to use the same product in the same way on another occasion. Follow the storage information on the pack you have selected.",
      "## Add seasoning gradually",
      "Quantity has a direct effect on the final dish. Add a small amount first, allow the dish to cook briefly and then adjust gradually. This gives you more control over the heat and aroma of the recipe than adding a large amount at once.",
      "## Keep a familiar recipe constant when comparing",
      "When trying a new powder, use it in a recipe you already know and avoid changing several ingredients at the same time. Keeping the cooking method, vegetables and serving style familiar can make it easier to judge whether you would use more or less seasoning next time.",
      "## Find current product information",
      "You can [[browse the HIPA Masala product range|/products]] for available options and read the [[current product-information FAQ|/faq]] when you need general guidance. For further product or pack details, [[contact HIPA|/contact#enquire]].",
      "## Use a simple kitchen routine",
      "A simple routine can make everyday cooking easier to repeat. Keep the recipe, the amount of seasoning and the product type consistent when you want to understand how a dish turns out. If you change several ingredients at once, it becomes harder to know which change affected the final result.",
      "## Plan before opening a new pack",
      "Before opening a new pack, consider the dishes you expect to cook and where the pack will be stored. Reading the label and setting aside a dry, tidy place for the product can help you keep track of what you are using in the kitchen.",
      "## Frequently asked questions",
      "### Does the amount of spice powder affect the final dish?",
      "Yes. Add a small amount first, let the dish cook briefly and adjust gradually according to the recipe and your household preference.",
      "### How can I compare spice powders more fairly?",
      "Use a familiar recipe and compare the product name, intended use and label guidance before changing several parts of the dish.",
      "### Where can I find current HIPA product information?",
      "You can [[browse HIPA Masala products|/products]] and read the [[current product-information FAQ|/faq]] for general guidance.",
      "## Related reading",
      "To make quality checks more practical, use [[what makes a good spice powder|/blog/what-makes-a-good-spice-powder]], [[how to read a spice powder label|/blog/how-to-read-a-spice-powder-label]] and [[how to compare spice-supplier information|/blog/true-cost-of-your-spice-supplier]]."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-08-25T09:02:59.000Z",
    "modifiedAt": "2026-08-25T09:34:13.000Z",
    "image": "/assets/hipa-original-spice-quality-cover-web_966bae04.webp",
    "imageAlt": "Original HIPA guide cover about spice quality, food taste and consistency",
    "complete": true
  },
  {
    "slug": "garam-masala-vs-other-indian-masalas",
    "title": "Garam Masala vs Other Indian Masalas: What’s the Difference?",
    "description": "Understand the general culinary differences between garam masala, sambar powder, rasam powder, curry-style blends and single-spice powders.",
    "body": [
      "## Garam masala vs other Indian masalas: the short answer",
      "Garam masala, sambar powder, rasam powder and single-spice powders are used for different cooking purposes. The simplest way to choose between them is to start with the dish you are making, then select the powder or blend that the recipe calls for. Using the right type of powder can make it easier to follow a familiar recipe and adjust the seasoning gradually.",
      "## What is garam masala used for?",
      "Garam masala is generally used as a warming finishing blend for many curries, gravies and vegetable dishes. It is often added in a small quantity so that it supports the overall flavour of the dish. The best point at which to add it depends on the recipe, so follow the recipe guidance and adjust gradually.",
      "## How does sambar powder differ?",
      "Sambar powder is intended for sambar-style dishes. It is used when preparing a lentil-and-vegetable dish with the familiar spiced character of sambar. It is not simply a substitute for a finishing blend, because the recipe and cooking method are different.",
      "## How does rasam powder differ?",
      "Rasam powder is intended for rasam-style dishes. Rasam is generally a lighter, aromatic broth-style preparation, so its seasoning is used differently from sambar powder or garam masala. Follow the recipe you are cooking rather than treating every masala blend as interchangeable.",
      "## When are single-spice powders useful?",
      "Single-spice powders such as turmeric, coriander, cumin and pepper have more focused roles in a recipe. They may be used on their own or alongside a blend depending on the dish. A recipe can use several spices for different purposes, so it is useful to check the recipe before choosing a powder.",
      "## How to choose the right masala for a recipe",
      "If you are making sambar, begin with a sambar powder. If you are preparing rasam, choose a rasam powder. For a curry or gravy, garam masala may be useful when the recipe calls for it. Start with a small amount, allow the dish to cook briefly and adjust to suit your household preference.",
      "## Explore related HIPA product information",
      "To compare the current product information, review [[Garam Masala|/products/garam-masala]], [[Sambar Powder|/products/sambar-powder]] and [[Rasam Powder|/products/rasam-powder]]. For other available options, you can also [[browse all HIPA products|/products]].",
      "## Think about the cooking method",
      "The cooking method also helps you decide which spice powder to use. A powder chosen for a lentil-based sambar is used in a different way from a finishing blend in a curry or a single spice added earlier in cooking. Read the recipe from beginning to end before deciding what to add.",
      "## Build flavour gradually",
      "When you are unfamiliar with a blend, add a small amount first and allow the dish to cook before changing the seasoning. This is a practical way to learn how a powder fits into your usual cooking style without changing too many things at once.",
      "## Frequently asked questions",
      "### Can garam masala replace sambar powder?",
      "They have different culinary roles. Use a sambar powder for a sambar-style recipe and follow the recipe when it calls for garam masala.",
      "### Is rasam powder used in the same way as sambar powder?",
      "No. Rasam and sambar are different preparations, so use the powder that matches the dish you are preparing.",
      "### Where can I compare HIPA product information?",
      "Review the current [[Garam Masala|/products/garam-masala]], [[Sambar Powder|/products/sambar-powder]] and [[Rasam Powder|/products/rasam-powder]] information before choosing a product.",
      "## Related reading",
      "After comparing culinary roles, review [[how to read a spice powder label|/blog/how-to-read-a-spice-powder-label]], [[what makes a good spice powder|/blog/what-makes-a-good-spice-powder]] and [[how spice quality affects food taste and consistency|/blog/how-spice-quality-affects-food-taste]]."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-08-25T09:02:59.000Z",
    "modifiedAt": "2026-08-25T09:34:13.000Z",
    "image": "/assets/hipa-original-garam-masala-cover-web_977e210e.webp",
    "imageAlt": "Original HIPA guide cover comparing garam masala with other Indian masalas",
    "complete": true
  },
  {
    "slug": "how-to-read-a-spice-powder-label",
    "title": "What to Look for When Buying Spices: 8 Spice Label Checks",
    "description": "Learn eight practical label checks to use when choosing spice powders, including product name, ingredients, dates, storage details and pack condition.",
    "body": [
      "## Why the label matters",
      "Reading a spice powder label can make everyday shopping easier. A clear label helps you identify what the product is, how it is intended to be used and what information to check before you take it home. Instead of relying only on the front design of a pack, use the label as a practical reference when comparing spice powders for your kitchen.",
      "## 1. Start with the product name",
      "Read the product name carefully. A single-spice powder and a blended masala are used differently, so the name should match the recipe you plan to cook. Sambar powder, rasam powder, garam masala and a single-spice powder each have different culinary roles. This first check helps you avoid taking home a powder that does not match your intended dish.",
      "## 2. Read the ingredient and allergy information",
      "Check the ingredient list and any allergy information that is relevant to your household. Read the label itself rather than relying only on the front of the pack. If an ingredient or statement is unclear, select a product whose information you can understand, or ask the brand for more details before using it.",
      "## 3. Look for date and storage guidance",
      "Readable date and storage information can help you handle the product carefully after purchase. Once opened, close the pack properly and keep it away from moisture and direct heat. Follow the information provided on the product label for the pack you have selected.",
      "## 4. Inspect the condition of the pack",
      "Before buying, check that the pack is clean, sealed and easy to read. Avoid packs that are torn, leaking, damp or damaged. A clear, intact pack makes it easier to identify the right powder in your kitchen and to refer back to its information while cooking.",
      "## 5. Compare the net quantity with your routine",
      "Consider how often you cook with that type of powder. A smaller pack can be useful when trying a new blend, while another quantity may suit a household that regularly uses the same product. Choose based on your normal cooking routine and how you plan to store the pack after opening.",
      "## 6. Use the information when planning a recipe",
      "When you are using a new spice blend, begin with a small amount and adjust gradually to suit your preferred heat and aroma. The product name and label can help you make sure that you are using the intended kind of powder for the recipe. Keeping your recipe steps familiar when trying a new blend can also make the comparison easier.",
      "## 7. Keep the label available after opening",
      "Do not discard useful product information too soon. Keeping the label or pack available after opening can help you check storage advice, product information and contact details later. It is also helpful when more than one family member cooks in the same kitchen.",
      "## 8. Use verified information when you have questions",
      "If a product detail is not clear, avoid assuming an unlisted claim is true. Review the information provided by the brand or ask for clarification. You can start by reviewing [[the current HIPA product range|/products]], then read [[common product questions|/faq]] for general product information. For further pack or product details, [[contact HIPA|/contact#enquire]].",
      "## A simple label-reading routine",
      "Before adding a spice powder to your basket, check the product name, relevant ingredient or allergy information, dates and storage guidance, the condition of the pack and the net quantity. These eight checks take only a few moments and can make everyday spice shopping more organised and confident.",
      "## How to compare two spice powder labels",
      "When comparing two packs, look at the same details on each label. Begin with the product name and intended use, then note the quantity, relevant dates and storage guidance. This keeps the comparison practical and reduces the chance of treating two different products as if they were the same.",
      "## Keep a simple label-check habit",
      "A quick label check becomes easier when you repeat the same order each time: product name, ingredients where provided, quantity, dates and storage instructions. Use the information that is printed on the pack, and keep any specific questions for the brand rather than making an assumption.",
      "## Frequently asked questions",
      "### Which spice powder label detail should I read first?",
      "Start with the product name. It helps you confirm whether the pack is a single-spice powder or a blend intended for a particular recipe.",
      "### Should I compare only the front of the pack?",
      "No. Review the label information available on the pack so that you can compare product details, quantity and storage guidance in the same way.",
      "### What should I do if a label detail is unclear?",
      "Use the current product information and [[contact HIPA for product details|/contact#enquire]] if you need clarification about a specific pack.",
      "## Related reading",
      "To connect label checks with practical cooking choices, read [[what makes a good spice powder|/blog/what-makes-a-good-spice-powder]], [[how spice quality affects food taste and consistency|/blog/how-spice-quality-affects-food-taste]] and [[how to choose sambar powder for everyday cooking|/blog/how-to-choose-sambar-powder]]."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-08-25T07:40:22.000Z",
    "modifiedAt": "2026-08-25T09:34:13.000Z",
    "image": "/assets/hipa-original-spice-label-cover-web_458a4d2d.webp",
    "imageAlt": "Original HIPA guide cover showing a person checking a spice powder label",
    "complete": true
  },
  {
    "slug": "how-to-choose-sambar-powder",
    "title": "How to Choose Sambar Powder for Everyday Cooking",
    "description": "Learn practical ways to choose a sambar powder for everyday cooking, including recipe fit, label checks, storage and gradual seasoning.",
    "body": [
      "## Start with the dish you are cooking",
      "Choosing sambar powder for everyday cooking starts with the dish you plan to make and the flavour profile your household enjoys. Sambar is often prepared with lentils, vegetables and tamarind, but every household has its own preferred balance of aroma, heat and seasoning. Begin with a clearly named sambar powder and a familiar recipe so you can notice how the blend works in your usual cooking.",
      "## Read the product name carefully",
      "A blended sambar powder has a different kitchen role from a single-spice powder or another masala blend. Read the product name first, then make sure it suits the recipe you are planning. This simple check reduces confusion when several spice powders are stored in the same kitchen.",
      "## Check the pack before buying",
      "Look for a clean, sealed pack with a readable product name and product information. Take a moment to review the label, including any storage guidance and the information that matters to your household. If the pack is damaged, difficult to read or unsuitable for your needs, choose a clearer option instead.",
      "## Choose a pack size that fits your routine",
      "Think about how often your household cooks sambar. A pack that fits your normal routine can be easier to store and use. It is usually more practical to choose a quantity you can handle carefully after opening than to buy more than you need at one time.",
      "## Begin with a small quantity while cooking",
      "When using a sambar powder for the first time, add a small quantity and adjust gradually as the dish cooks. This gives you more control over the final result and lets you match the seasoning to the vegetables, lentils and accompaniments in your recipe. Write down the quantity that works for your household so the next meal is easier to prepare.",
      "## Compare it with your usual recipe",
      "A useful way to judge a new powder is to use it in a familiar dish instead of changing many recipe steps at once. Keep the vegetables, lentils and cooking method close to your normal routine. Then you can decide whether you prefer a little more or less seasoning on the next occasion.",
      "## Store opened packs carefully",
      "After opening a pack, keep it closed and away from heat and moisture. Use the label again when you need to check product or storage information. A simple storage routine can make everyday cooking easier and helps you find the right powder when you are preparing several dishes.",
      "## Use product information as a practical reference",
      "Before deciding, you can review the [[HIPA Sambar Powder product page|/products/sambar-powder]] for the current HIPA product information. If you are comparing more than one kind of powder for your kitchen, [[browse all HIPA products|/products]] to see the available range. For further pack or product information, [[contact HIPA|/contact#enquire]].",
      "## A simple everyday checklist",
      "In short, choose a clearly named sambar powder, inspect the pack, read the information that matters to your household, select a suitable quantity, start with a small amount in a familiar recipe and store the opened pack carefully. These practical steps make it easier to choose a powder that fits your everyday cooking routine.",
      "## Think about the recipe before choosing a pack",
      "The recipe is a useful starting point when choosing sambar powder. Consider the vegetables, lentils and accompaniments you plan to use, then season gradually as the dish cooks. Keeping your recipe familiar is helpful when you want to understand how much seasoning suits your household.",
      "## Keep notes for everyday cooking",
      "A small cooking note can be useful when you make sambar regularly. Record the quantity that worked for your usual pot size, the vegetables you used and whether you would adjust the seasoning next time. This creates a practical reference based on your own cooking routine.",
      "## Frequently asked questions",
      "### How much sambar powder should I use?",
      "Follow the recipe you are using, begin with a small amount and adjust gradually as the dish cooks.",
      "### Can I use sambar powder for every lentil dish?",
      "Choose the powder that matches the recipe. A sambar-style dish and another lentil preparation may use seasoning differently.",
      "### Where can I review HIPA Sambar Powder information?",
      "Review the current [[HIPA Sambar Powder product page|/products/sambar-powder]] or [[contact HIPA for product details|/contact#enquire]] if you need further product or pack information.",
      "## Related reading",
      "To compare practical selection factors, read [[how spice quality affects food taste and consistency|/blog/how-spice-quality-affects-food-taste]], [[how to read a spice powder label|/blog/how-to-read-a-spice-powder-label]] and [[what makes a good spice powder|/blog/what-makes-a-good-spice-powder]]."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-08-25T07:39:38.000Z",
    "modifiedAt": "2026-08-25T09:34:13.000Z",
    "image": "/assets/hipa-original-sambar-blog-cover-web_727590c6.webp",
    "imageAlt": "Original HIPA guide cover showing sambar powder, a bowl of sambar and whole spices",
    "complete": true
  },
  {
    "slug": "garam-masala-ingredients-aroma-uses",
    "title": "Garam Masala: Ingredients, Aroma, Uses, and How to Choose a Blend",
    "description": "Learn what garam masala is, which spices it contains, why it smells aromatic, how to use it, and where to find HIPA Garam Masala in Chennai.",
    "body": [
      "Garam masala is a fragrant spice blend used in many Indian dishes. Its ingredients and proportions vary between recipes and brands, but the blend is often added to curries, rice dishes, and gravies for a warm, aromatic finish.",
      "If you're exploring garam masala for your kitchen, this guide explains what it is, what spices it may contain, why its aroma stands out, and what to consider when choosing a blend such as [[HIPA Garam Masala|/products/garam-masala]]. HIPA Masala is an Indian spice brand based in Pallavaram, Chennai; learn more about [[the HIPA Masala brand|/about]].",
      "## Is garam masala a spice blend?",
      "Yes. Garam masala is a blend of ground spices. There is no single recipe used everywhere, so ingredients and proportions can vary by region, household, and brand. Some blends are designed to add depth during cooking, while others are used near the end to bring out their aroma.",
      "## Is garam masala only from North India?",
      "Garam masala is often associated with North Indian cooking, but it is used in dishes across India, including South Indian biryanis, kurmas, and curries. Different regions and cooks have their own approaches to spice blends, so it's more accurate to think of garam masala as a widely used Indian blend rather than a spice mix exclusive to one region.",
      "## What spices are in garam masala?",
      "The ingredients vary. Common spices may include coriander, cumin, black pepper, cinnamon, cloves, cardamom, and bay leaf. Some versions also contain star anise, nutmeg, or mace.",
      "According to its product page, [[HIPA Garam Masala|/products/garam-masala]] includes coriander seeds, cumin seeds, black peppercorns, cinnamon, cloves, cardamom, bay leaf, star anise, nutmeg, and mace. See the [[full HIPA Garam Masala ingredients and product details|/products/garam-masala]] for current information.",
      "## Why is garam masala so aromatic?",
      "Its aroma comes from the blend of fragrant spices. Cinnamon, cloves, cardamom, and other spices each contribute their own scent and flavor. Heating can release their aroma, which is why many recipes add garam masala toward the end of cooking rather than simmering it for a long time.",
      "For HIPA Garam Masala, the product guidance recommends adding it in the final minutes of cooking. Follow the package or [[product-page directions|/products/garam-masala]] for your dish.",
      "## Why is garam masala brown?",
      "Garam masala's color depends on its ingredients, their proportions, and how the spices are processed and ground. Blends can range from lighter brown to deeper brown, so color alone does not establish quality. Check the ingredient list and choose a product from a source that clearly shares its product information.",
      "## Is garam masala good for health?",
      "Garam masala is used primarily to season food. Its nutritional contribution depends on the ingredients and the small amount used in a dish. Avoid treating it as a medicine or assuming that it delivers specific health benefits. For health or dietary questions, consider your overall diet and consult a qualified health professional.",
      "## Why can garam masala cost more?",
      "Prices can differ because of the spices used, ingredient quality, sourcing, processing, packaging, and pack size. Blends containing aromatic spices such as cardamom, cloves, cinnamon, nutmeg, or mace may have different costs from blends made with other proportions. Compare the ingredient list, pack weight, and product information when choosing.",
      "## How to choose garam masala in Chennai",
      "If you're searching online for **\"best garam masala in Chennai\"** or **\"garam masala near me,\"** compare ingredient transparency, pack sizes, intended uses, and the seller's location or delivery options. HIPA Masala is based in Pallavaram, Chennai. Its [[Garam Masala product page|/products/garam-masala]] lists 100 g, 200 g, and 500 g packs and describes uses for biryanis, pulaos, paneer gravies, and curries.",
      "For availability or enquiries, contact HIPA through the [[official contact page|/contact]]. You can also browse the [[complete HIPA Masala product range|/products]] or read more on the [[HIPA Masala blog|/blog]].",
      "## Try garam masala in your cooking",
      "Garam masala is a versatile blend, but every product has its own ingredient profile and suggested use. Read the label, start with the recommended amount, and adjust to the dish you're making. To learn more about HIPA's ingredients, pack sizes, and cooking suggestions, visit the [[HIPA Garam Masala page|/products/garam-masala]]. For more information about common product questions, visit the [[HIPA Masala FAQ|/faq]]."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-10-27T08:00:00.000Z",
    "modifiedAt": "2026-10-27T08:00:00.000Z",
    "image": "/assets/garam-masala-ingredients-aroma-uses.webp",
    "imageAlt": "Freshly ground garam masala spice blend with whole spices including cinnamon, cardamom, cloves and peppercorns",
    "complete": true
  },
  {
    "slug": "scaling-indian-restaurant-authentic-flavour",
    "title": "The Secret to Scaling an Indian Restaurant Without Losing Authentic Flavour",
    "description": "Learn how Indian restaurants scale without losing authentic flavour through standardised recipes, consistent spice quality and kitchen controls.",
    "body": [
      "Growing an Indian restaurant business takes more than opening new branches or serving more customers. The real challenge is delivering the same flavour, aroma and dining experience every time a guest walks through the door.",
      "A sambar that customers love at one location should feel familiar at another. A rasam that earns praise today should be just as satisfying next week. As a restaurant expands, repeatable kitchen systems become essential to protecting the food and reputation that made the business successful.",
      "So how can restaurant owners scale without compromising the taste customers expect?",
      "## 1. Standardise recipes while preserving tradition",
      "Every successful restaurant has signature dishes customers remember. But when a recipe lives only in a chef's memory or depends on personal judgement, consistency becomes harder to maintain across teams and locations.",
      "Document the recipes that define your menu. Record ingredient quantities, spice measurements, preparation order, cooking times and the sensory cues that matter, such as aroma, texture and appearance. Where a traditional technique is central to the dish, document that too.",
      "The goal is not to make every cook work mechanically. It is to give the team a dependable starting point and preserve the details that make the food yours.",
      "**Business takeaway:** Standardisation should protect your signature taste, not remove the character from your food.",
      "## 2. Set clear specifications for spices and masalas",
      "Spices shape a dish's aroma, colour and flavour. Differences in freshness, grind, storage or blend proportions can change the result, especially when a kitchen prepares food at scale.",
      "Set clear specifications for your core ingredients. When assessing spice powders and masala blends, consider the flavour and aroma profile, ingredient and product information, consistency between batches, packaging integrity, storage guidance and the supplier's ability to meet your expected volumes.",
      "Good ingredient controls support the recipe your kitchen intends to make. For more on choosing and handling spices, see [[HIPA's guide to how spice quality affects food taste and consistency|/blog/how-spice-quality-affects-food-taste]].",
      "## 3. Build a supplier network that can grow with you",
      "A supplier who can serve one kitchen may not be ready to support several branches or larger, scheduled orders. Before expanding a supply relationship, discuss product specifications, expected volumes, pack sizes, delivery schedules and the documentation your business needs.",
      "Keep written purchasing specifications for core ingredients. Where practical, maintain an approved supplier list and check incoming stock against agreed requirements. A dependable procurement process makes planning easier and helps avoid last-minute substitutions that can affect a signature dish.",
      "Restaurants, hotels, caterers and cloud kitchens can review [[HIPA's B2B and wholesale information|/contact]] or learn more about its [[spice manufacturing and business supply|/about]]. For broader evaluation criteria, read [[what to consider in the total cost of a spice supplier|/blog/true-cost-of-your-spice-supplier]].",
      "## 4. Train every kitchen team to follow the same process",
      "Even a well-documented recipe can produce different results when preparation methods vary. Create practical kitchen procedures that cover measurements, preparation sequence, cooking temperatures, batch sizes and final checks.",
      "Train new and existing staff with the same recipes. Then review finished dishes against the standards your team has agreed on. For multi-location businesses, regular communication between kitchen managers can help identify differences before they become a customer concern.",
      "## 5. Use batch preparation thoughtfully",
      "Batch preparation can help a busy service run smoothly, but it needs clear limits. Set suitable batch sizes, define holding conditions and follow applicable food-safety procedures. Avoid preparing more than the team can use while the food remains at its intended quality.",
      "The aim is to make service more efficient without letting convenience compromise freshness, texture or flavour.",
      "## 6. Review customer feedback by dish and location",
      "Customer feedback can reveal differences that internal checks miss. Track comments about flavour, spice intensity, aroma, portion size and overall satisfaction. Review the patterns by branch and dish rather than treating every comment in isolation.",
      "If guests repeatedly say that a signature dish tastes different at one location, investigate the recipe, incoming ingredients, preparation method and storage practices. Use the findings to improve the process instead of relying on assumptions.",
      "## 7. Choose a spice partner that understands food-service needs",
      "As a restaurant grows, its purchasing needs may shift from small, frequent orders to planned bulk procurement. A suitable supplier should understand your product specifications, expected volumes, packaging requirements and delivery schedule.",
      "[[HIPA Masala's listed range|/products]] includes [[Sambar Powder|/products/sambar-powder]], [[Rasam Powder|/products/rasam-powder]], [[Turmeric Powder|/products/turmeric-powder]], [[Red Chilli Powder|/products/red-chilli-powder]], [[Coriander Powder|/products/coriander-powder]], [[Cumin Powder|/products/cumin-powder]], [[Pepper Powder|/products/pepper-powder]] and [[Garam Masala|/products/garam-masala]]. Food businesses can [[contact HIPA|/contact]] about their requirements to discuss product and supply needs.",
      "## Scale your business. Keep your signature flavour.",
      "Restaurant growth should strengthen your brand, not make its food less recognisable. Documented recipes, clear ingredient specifications, trained teams, reliable procurement and regular quality checks give an expanding business a stronger foundation for consistency.",
      "When these systems work together, restaurant businesses are better positioned to grow while preserving the flavours customers return for.",
      "Looking for spice solutions for a restaurant, hotel, catering business or cloud kitchen? [[Explore HIPA Masala's product range|/products]], review [[B2B enquiries|/contact]] or [[contact the team|/contact]].",
      "## Frequently asked questions",
      "**How can a restaurant maintain consistent taste across multiple branches?**\nUse standardised recipes, measured ingredients, documented cooking procedures, staff training and regular quality checks at every location. Review customer feedback and investigate recurring differences by dish and branch.",
      "**Why are consistent spice blends important for restaurants?**\nSpices influence a dish's aroma, colour and flavour. Clear product specifications, suitable storage and checks between deliveries can help kitchen teams reproduce their intended recipes more reliably.",
      "**What should restaurants consider when buying spices in bulk?**\nEvaluate product specifications, ingredient information, packaging integrity, storage requirements, batch consistency, supplier capacity and delivery reliability. Agree on expected volumes and pack sizes before placing recurring orders.",
      "**How can cloud kitchens maintain authentic Indian flavours while scaling?**\nCloud kitchens can document recipes, plan ingredient procurement, train kitchen teams, control batch sizes, follow food-safety procedures and monitor customer feedback as order volumes change.",
      "**Which spice powders are useful for Indian restaurants?**\nIt depends on the menu. Common choices include sambar powder, rasam powder, turmeric powder, red chilli powder, coriander powder, cumin powder, pepper powder and garam masala. See [[HIPA's current product range|/products]] for listed products."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-10-30T08:00:00.000Z",
    "modifiedAt": "2026-10-30T08:00:00.000Z",
    "image": "/assets/scaling-indian-restaurant-authentic-flavour.webp",
    "imageAlt": "Restaurant chef preparing traditional Indian dishes with spices in a professional kitchen.",
    "complete": true
  },
  {
    "slug": "rasam-powder-guide-chennai",
    "title": "Rasam: Ingredients, Taste, Health Questions, and HIPA Rasam Powder",
    "description": "Discover what goes into rasam powder, why rasam tastes different, how to choose a blend, and where to find HIPA Rasam Powder in Chennai.",
    "body": [
      "Rasam is a familiar South Indian dish with many variations. Some versions are peppery, some are tangy, and others highlight tomato, garlic, or tamarind. The ingredients and cooking method make a difference--and so does the rasam powder.",
      "This guide answers common questions about rasam and introduces [[HIPA Rasam Powder|/products/rasam-powder]], a South Indian spice blend made with coriander, cumin, black pepper, dried red chillies, toor dal, turmeric, and asafoetida.",
      "## Is rasam a \"medicine food\"?",
      "Rasam is a traditional dish enjoyed as part of everyday meals. Some people find a warm bowl comforting, but it should not be described as medicine or as a treatment for illness. Its nutritional value depends on the recipe and ingredients. For health concerns or dietary advice, consult a qualified health professional.",
      "## Why does rasam taste different from one recipe to another?",
      "Rasam recipes vary by household and region. The balance of tamarind, tomato, pepper, cumin, chilli, garlic, herbs, and rasam powder can change the flavor. Cooking time and the amount of water or dal used also affect the final taste.",
      "For example, a pepper-forward rasam may taste different from a tomato-based or tamarind-heavy version. HIPA describes its rasam powder as pepper- and cumin-forward; you can review its [[ingredients and product information|/products/rasam-powder]].",
      "## What ingredients are in HIPA Rasam Powder?",
      "According to HIPA's product page, the blend contains coriander seeds, cumin seeds, black peppercorns, dried red chillies, toor dal, turmeric, and asafoetida. Check the product packaging or official page for the current ingredient list and any relevant allergen information.",
      "The blend is listed for tomato rasam, tamarind rasam, pepper rasam, Mysore rasam, and other dishes. Visit the [[HIPA Rasam Powder page|/products/rasam-powder]] for product-specific details and available pack sizes.",
      "## Is rasam bitter?",
      "Rasam is not meant to taste strongly bitter, although certain ingredients or cooking choices can create a bitter edge. Too much of a strongly flavored spice, overcooking, or an imbalance in the sour and spicy elements may affect the final taste.",
      "Follow your recipe's quantities, add seasoning gradually, and avoid boiling rasam for longer than needed. HIPA's product guidance recommends adding the powder to simmering broth and removing it from the heat as it begins to foam.",
      "## Is rasam good for health?",
      "Rasam's nutritional content depends on how it is prepared, including the ingredients, amount of salt, and portion size. It can be served as part of a varied meal, but avoid treating rasam as a guaranteed health remedy or making medical claims about it.",
      "## Is rasam powder a South Indian blend?",
      "Rasam is closely associated with South Indian cooking, and rasam powder is commonly used to season it. Blends differ by recipe and brand. [[HIPA Rasam Powder|/products/rasam-powder]] is described on the company's website as a South Indian rasam spice blend made with spices and lentils.",
      "## Is HIPA Rasam Powder \"home-made style\"?",
      "The HIPA product page describes its blend as inspired by traditional home-pounded rasam podi. \"Home-made style\" can mean different things to different cooks, so check the listed ingredients and product details to decide whether its flavor profile suits your preference.",
      "## How to choose the best rasam powder near you in Chennai",
      "If you're searching for \"best rasam powder near me\" or \"best rasam powder in Chennai,\" compare the ingredient list, pack sizes, product guidance, and seller location. \"Best\" depends on the flavor you like and how you plan to use the blend.",
      "HIPA Masala is based in Pallavaram, Chennai. Its Rasam Powder is listed in 100 g, 200 g, 500 g, and 1 kg pack sizes. For availability or product enquiries, visit the [[HIPA Rasam Powder page|/products/rasam-powder]] or the [[official contact page|/contact]].",
      "## Is HIPA Rasam Powder cost-efficient?",
      "Cost efficiency depends on the pack price, pack weight, how much you use per preparation, and how often you cook rasam. Compare the price per gram and follow the product's usage guidance to estimate how many servings a pack may provide. Check [[HIPA's product page|/products/rasam-powder]] or [[contact the company|/contact]] for current price and availability information.",
      "## Enjoy rasam your way",
      "Rasam can be adapted to suit different tastes, from tangy tomato styles to peppery versions. Start with the preparation guidance on the product label, adjust the seasoning to your preference, and choose ingredients that work for your meal.",
      "Learn more about [[HIPA Rasam Powder|/products/rasam-powder]], or browse the full [[HIPA Masala product range|/products]]."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-10-31T07:00:00.000Z",
    "modifiedAt": "2026-10-31T07:00:00.000Z",
    "image": "/assets/rasam-powder-guide-chennai.webp",
    "imageAlt": "Traditional South Indian rasam prepared with HIPA Rasam Powder and garnished with coriander",
    "complete": true
  },
  {
    "slug": "cumin-powder-uses-chennai",
    "title": "Cumin Powder: Taste, Uses, Ingredients, and How to Choose the Best Cumin in Chennai",
    "description": "Learn what cumin powder is made of, why its flavor varies, how to use it in South Indian dishes, and where to find HIPA Cumin Powder in Chennai.",
    "body": [
      "Cumin powder--also known as jeera powder--is used in dishes across India and around the world. Its warm, earthy aroma can add depth to dals, curries, rice, raita, chaats, and beverages.",
      "If you're choosing cumin powder for your kitchen, it helps to know what it contains, why its taste can vary, and how it differs from whole cumin seeds. This guide also introduces [[HIPA Cumin Powder|/products/cumin-powder]], made from selected whole cumin seeds.",
      "## Is cumin powder mainly used in North Indian cooking?",
      "Cumin is not limited to North Indian cuisine. It is used in many regional Indian dishes, including South Indian preparations such as rasam, seasoned buttermilk, curries, and rice dishes. How it is used varies by recipe: cumin may be toasted whole, added to a tempering, or used as a ground seasoning.",
      "HIPA Cumin Powder's product information lists uses including dals, raitas, chaats, rasam, marinades, and jeera rice. Explore the [[HIPA Cumin Powder product page|/products/cumin-powder]] for its full usage details.",
      "## Why does cumin taste different in different dishes?",
      "Cumin has a distinctive warm, earthy flavor, but its taste can seem different depending on how it is prepared. Whole cumin seeds, toasted cumin, and ground cumin release flavor differently. The other ingredients in a dish--such as oil, lemon, tamarind, chilli, or dairy--also affect how cumin comes through.",
      "For example, cumin in a hot tempering can taste more pronounced than cumin stirred into a cool raita. The freshness and storage of the spice can also influence its aroma.",
      "## Is cumin sweet?",
      "Cumin is not usually described as a sweet spice. Its flavor is commonly described as warm, earthy, and slightly nutty, with a peppery or mildly bitter edge. Toasting can make its aroma more pronounced, but cumin is generally used to add savory depth rather than sweetness.",
      "## Is cumin powder a blended masala?",
      "Not necessarily. Cumin powder can be made from ground cumin alone, while a masala blend contains multiple spices. Check the ingredients on the package to know exactly what you are buying.",
      "HIPA's product page lists its Cumin Powder as 100% selected whole cumin seeds. It is a single-spice powder, not a blend of different masala ingredients. See the ingredient details for [[HIPA Cumin Powder|/products/cumin-powder]].",
      "## Why is cumin powder brown?",
      "Cumin powder's color can vary with the seeds, processing, and grinding. It may appear tan, brown, or somewhat darker. Color alone does not tell you whether a powder is pure or high quality; check the ingredients, packaging, and product information as well.",
      "HIPA describes its cumin powder as finely ground cumin with a warm, earthy aroma. For current product information and pack sizes, visit the [[official product page|/products/cumin-powder]].",
      "## Can you use cumin in South Indian dishes?",
      "Yes. Cumin can be used in South Indian cooking, including rasam, vegetable dishes, curries, rice preparations, and spiced buttermilk. You can add it in different forms depending on the recipe: whole seeds in a tempering, or ground cumin stirred into a dish or sprinkled on top.",
      "For more South Indian spice blends, browse HIPA's [[Sambar Powder|/products/sambar-powder]] and [[Rasam Powder|/products/rasam-powder]].",
      "## Which is better: cumin seeds or cumin powder?",
      "Neither is always better; the best choice depends on the dish and the texture or aroma you want.",
      "Whole cumin seeds are often used in tempering, where they are briefly heated in oil or ghee. Cumin powder is convenient when you want the flavor distributed throughout a dish or added as a finishing seasoning. Many kitchens keep both on hand for different uses.",
      "## What is HIPA Cumin Powder made from?",
      "According to the product information, HIPA Cumin Powder is made from 100% selected whole cumin seeds. The page lists 100 g, 200 g, and 500 g packs, as well as bulk trade packs. For up-to-date ingredients, availability, and storage guidance, check the [[HIPA Cumin Powder page|/products/cumin-powder]].",
      "## How to find cumin powder near you in Chennai",
      "If you're searching for \"best cumin powder near me\" or \"best cumin powder in Chennai,\" compare the ingredient list, pack size, storage information, and seller's location. HIPA Masala is based in Pallavaram, Chennai. You can review [[HIPA Cumin Powder details|/products/cumin-powder]], browse the [[full HIPA Masala product range|/products]], or contact the team through the [[official contact page|/contact]] to ask about availability.",
      "## Choose cumin powder that fits your cooking",
      "Cumin powder is a single-spice seasoning when the ingredient list contains only cumin. Its warm, earthy flavor works in dishes from different regions, including South Indian cooking. Check product details, choose the form that suits your recipe, and store it according to the label.",
      "Learn more about [[HIPA Cumin Powder|/products/cumin-powder]] and explore more cooking ideas on the [[HIPA Masala blog|/blog]]."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-10-31T07:30:00.000Z",
    "modifiedAt": "2026-10-31T07:30:00.000Z",
    "image": "/assets/cumin-powder-uses-chennai.webp",
    "imageAlt": "Freshly ground cumin powder with whole cumin seeds on display",
    "complete": true
  }
];

export function getProduct(slug: string): Product | null {
  return products.find((product) => product.slug === slug) ?? null;
}

export function getProductFaqs(product: Product): Faq[] {
  if (product.faqs && product.faqs.length > 0) {
    return product.faqs;
  }
  const packs = product.packSizes?.join(", ") || "the current listed pack sizes";
  return [
    { question: `What is HIPA Masala ${product.name} used for?`, answer: product.description },
    { question: `What pack sizes are shown for HIPA Masala ${product.name}?`, answer: `The current listed pack sizes for HIPA Masala ${product.name} are ${packs}. Contact HIPA Masala for the latest product and pack information.` },
    { question: `How can I enquire about HIPA Masala ${product.name}?`, answer: `Use the Enquire Now or WhatsApp Enquiry option on the ${product.name} page to ask HIPA Masala for current product information.` },
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
    "/about",
    "/b2b-enquiries",
    MANUFACTURER_PAGE_PATH,
    "/blog",
    ...articles.filter((article) => article.complete).map((article) => `/blog/${article.slug}`),
  ];
}

const defaultDescription =
  "Discover HIPA Masala spice powders, masala blends and current product information from Chennai, Tamil Nadu.";

export function getPageHead(pathname: string): PageHead {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/") {
    return {
      title: "HIPA Masala | Indian Spice Powders & Masala Blends, Chennai",
      description: "HIPA Masala is an Indian spice and masala brand in Pallavaram, Chennai, offering Sambar, Rasam, Turmeric, Chilli, Coriander, Cumin, Pepper and Garam Masala.",
      canonicalPath: "/",
      ogImage: siteIdentity.heroImage,
      ogImageAlt: "HIPA Masala spice powder collection",
    };
  }

  if (path === "/products") {
    return {
      title: "Masala Powders & Spice Blends | HIPA Masala",
      description: "Browse the current HIPA Masala range of spice powders and masala blends. Contact HIPA for product and pack information.",
      canonicalPath: path,
      ogImage: products[0]?.image,
      ogImageAlt: products[0]?.imageAlt,
    };
  }

  const productMatch = path.match(/^\/products\/([^/]+)$/);
  if (productMatch) {
    const product = getProduct(productMatch[1]);
    if (!product) return { title: "Page not found | HIPA Masala", description: defaultDescription, notFound: true };
    return {
      title: product.seoTitle || `${product.name} | HIPA Masala`,
      description: product.metaDescription || product.description,
      canonicalPath: path,
      ogImage: product.image,
      ogImageAlt: product.imageAlt,
    };
  }

  if (path === "/faq") {
    return {
      title: "Frequently Asked Questions | HIPA Masala Chennai",
      description: "Find answers about HIPA Masala products, ingredients, pack sizes, Chennai location, and B2B enquiry options.",
      canonicalPath: path,
    };
  }

  if (path === "/contact") {
    return {
      title: "Contact HIPA Masala | Chennai | Phone, Email & WhatsApp",
      description: "Get in touch with HIPA Masala in Pallavaram, Chennai. Phone +91 70580 53055, email info@hipamasalas.com, or message us directly on WhatsApp.",
      canonicalPath: path,
    };
  }

  if (path === "/about") {
    return {
      title: "About HIPA Masala | Indian Spice Brand in Chennai",
      description: "Learn about HIPA Masala, an Indian spice and masala brand based in Pallavaram, Chennai, offering traditional spice blends for homes and businesses.",
      canonicalPath: path,
    };
  }

  if (path === "/b2b-enquiries") {
    return {
      title: "B2B Enquiries | Wholesale & Distribution | HIPA Masala Chennai",
      description: "Contact HIPA Masala for wholesale spice supply, retail distribution, supermarket supply, and bulk catering enquiries in Chennai and beyond.",
      canonicalPath: path,
    };
  }

  if (path === MANUFACTURER_PAGE_PATH) {
    return {
      title: manufacturerPage.metaTitle,
      description: manufacturerPage.metaDescription,
      canonicalPath: path,
      ogImage: siteIdentity.heroImage,
      ogImageAlt: "HIPA Masala spice powders manufactured in Chennai",
    };
  }

  if (path === "/blog") {
    return {
      title: "HIPA Masala Blog | Spice & Cooking Guides",
      description: "Read HIPA Masala guides about spice selection, South Indian cooking and practical product information.",
      canonicalPath: path,
    };
  }

  const articleMatch = path.match(/^\/blog\/([^/]+)$/);
  if (articleMatch) {
    const article = getArticle(articleMatch[1]);
    if (!article) return { title: "Page not found | HIPA Masala", description: defaultDescription, notFound: true };
    return {
      title: `${article.title} | HIPA Masala`,
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
    return { title: "Privacy Policy | HIPA Masala", description: "Learn how HIPA Masala uses enquiry and newsletter details submitted through this website.", canonicalPath: path, noindex: true };
  }

  if (path === "/terms-of-service") {
    return { title: "Terms of Service | HIPA Masala", description: "Review the general terms for using the HIPA Masala website and its product-information and enquiry features.", canonicalPath: path, noindex: true };
  }

  if (path === "/admin" || path.startsWith("/admin/")) {
    return { title: "HIPA Masala Admin", description: defaultDescription, noindex: true };
  }

  return { title: "Page not found | HIPA Masala", description: defaultDescription, notFound: true };
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
  const postalAddress = {
    "@type": "PostalAddress",
    streetAddress: siteIdentity.address.streetAddress,
    addressLocality: siteIdentity.address.addressLocality,
    postalCode: siteIdentity.address.postalCode,
    addressRegion: siteIdentity.address.addressRegion,
    addressCountry: "IN",
  };

  // Stable @ids let Google merge the Organization, LocalBusiness and WebSite nodes into one entity
  // and let Product and BlogPosting point back at it instead of repeating the details.
  const organizationId = absoluteUrl(origin, "/#organization");
  const localBusinessId = absoluteUrl(origin, "/#localbusiness");
  const websiteId = absoluteUrl(origin, "/#website");
  const sameAs = [siteIdentity.facebook, siteIdentity.instagram, siteIdentity.youtube, siteIdentity.googleBusinessProfile];
  // hasMap stays a real Google Maps URL; the share link identifies the listing in sameAs instead.
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${siteIdentity.name}, ${siteIdentity.locationLabel}`)}`;
  // Registration numbers and hours are shown on the About and Contact pages, so the schema repeats visible facts.
  const businessIdentifiers = [
    { "@type": "PropertyValue", propertyID: "FSSAI licence number", value: siteIdentity.fssaiLicence },
    { "@type": "PropertyValue", propertyID: "GSTIN", value: siteIdentity.gstin },
  ];
  const openingHoursSpecification = {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [...siteIdentity.openingHours.days],
    opens: siteIdentity.openingHours.opens,
    closes: siteIdentity.openingHours.closes,
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: siteIdentity.name,
    alternateName: "HIPA Masalas",
    legalName: siteIdentity.legalName,
    taxID: siteIdentity.gstin,
    identifier: businessIdentifiers,
    url: absoluteUrl(origin, "/"),
    logo: { "@type": "ImageObject", url: absoluteUrl(origin, siteIdentity.logo), width: 389, height: 453 },
    description: "HIPA Masala is an Indian spice and masala brand owned by HIPA Enterprises, based in Pallavaram, Chennai, Tamil Nadu, India.",
    email: siteIdentity.email,
    telephone: siteIdentity.phone,
    address: postalAddress,
    sameAs,
    areaServed: ["Chennai", "Tamil Nadu", "India", "International export enquiries"],
    knowsAbout: ["Indian spice powders", "masala blends", "distributor supply", "dealer enquiries", "wholesale enquiries", "export enquiries"],
    contactPoint: { "@type": "ContactPoint", telephone: siteIdentity.phone, email: siteIdentity.email, contactType: "sales", areaServed: "IN", availableLanguage: ["en", "ta"] },
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": localBusinessId,
    name: siteIdentity.name,
    alternateName: "HIPA Masalas",
    legalName: siteIdentity.legalName,
    image: absoluteUrl(origin, siteIdentity.logo),
    url: absoluteUrl(origin, "/"),
    telephone: siteIdentity.phone,
    email: siteIdentity.email,
    address: postalAddress,
    hasMap: mapUrl,
    sameAs,
    areaServed: ["Chennai", "Tamil Nadu", "India"],
    parentOrganization: { "@id": organizationId },
    taxID: siteIdentity.gstin,
    identifier: businessIdentifiers,
    openingHoursSpecification: [openingHoursSpecification],
    currenciesAccepted: "INR",
    priceRange: "₹₹",
  };

  if (path === "/") {
    schemas.push(organization, localBusiness, {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      name: siteIdentity.name,
      alternateName: "HIPA Masalas",
      url: absoluteUrl(origin, "/"),
      inLanguage: "en-IN",
      publisher: { "@id": organizationId },
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
          manufacturer: { "@id": organizationId },
          countryOfOrigin: { "@type": "Country", name: "India" },
          category: "Spice powders and masala blends",
          additionalProperty: product.packSizes.map((size) => ({ "@type": "PropertyValue", name: "Pack size", value: size })),
        }
      );
    }
  }

  if (path === "/faq") {
    schemas.push(breadcrumbSchema(origin, path, ["Home", "FAQ"]));
  }

  if (path === MANUFACTURER_PAGE_PATH) {
    schemas.push(breadcrumbSchema(origin, path, ["Home", manufacturerPage.h1]), localBusiness);
  }

  if (path === "/contact" || path === "/about" || path === "/b2b-enquiries" || path === "/blog") {
    schemas.push(breadcrumbSchema(origin, path, ["Home", path === "/contact" ? "Contact" : path === "/about" ? "About" : path === "/blog" ? "Blog" : "B2B Enquiries"]));
    if (path === "/contact") {
      schemas.push(localBusiness);
    }
  }

  const articleMatch = path.match(/^\/blog\/([^/]+)$/);
  if (articleMatch) {
    const article = articleOverride?.slug === articleMatch[1] ? articleOverride : getArticle(articleMatch[1]);
    if (article) {
      schemas.push(
        breadcrumbSchema(origin, path, ["Home", "Blog", article.title]),
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: article.title,
          description: article.description,
          author: { "@type": "Organization", "@id": organizationId, name: article.authorName, url: absoluteUrl(origin, "/") },
          publisher: { "@type": "Organization", "@id": organizationId, name: siteIdentity.name, logo: { "@type": "ImageObject", url: absoluteUrl(origin, siteIdentity.logo) } },
          mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(origin, path) },
          isPartOf: { "@id": websiteId },
          inLanguage: "en-IN",
          datePublished: article.publishedAt,
          ...(article.modifiedAt ? { dateModified: article.modifiedAt } : {}),
          ...(article.image ? { image: [absoluteUrl(origin, article.image)] } : {}),
        }
      );
    }
  }

  return schemas;
}

export const productPackImages: Record<string, Record<string, string>> = {
  "sambar-powder": {
    "100g": "/assets/products/sambar-powder-100g.png",
    "200g": "/assets/products/sambar-powder-200g.png",
    "500g": "/assets/products/sambar-powder-500g.png",
    "1kg": "/assets/products/sambar-powder-1kg.png",
  },
  "rasam-powder": {
    "100g": "/assets/products/rasam-powder-100g.png",
    "200g": "/assets/products/rasam-powder-200g.png",
    "500g": "/assets/products/rasam-powder-500g.png",
    "1kg": "/assets/products/rasam-powder-1kg.png",
  },
  "turmeric-powder": {
    "100g": "/assets/products/turmeric-powder-100g.png",
    "200g": "/assets/products/turmeric-powder-200g.png",
    "500g": "/assets/products/turmeric-powder-500g.png",
    "1kg": "/assets/products/turmeric-powder-1kg.png",
  },
  "red-chilli-powder": {
    "100g": "/assets/products/red-chilli-powder-100g.png",
    "200g": "/assets/products/red-chilli-powder-200g.png",
    "500g": "/assets/products/red-chilli-powder-500g.png",
    "1kg": "/assets/products/red-chilli-powder-1kg.png",
  },
  "coriander-powder": {
    "100g": "/assets/products/coriander-powder-100g.png",
    "200g": "/assets/products/coriander-powder-200g.png",
    "500g": "/assets/products/coriander-powder-500g.png",
    "1kg": "/assets/products/coriander-powder-1kg.png",
  },
  "cumin-powder": {
    "100g": "/assets/products/cumin-powder-100g.png",
    "200g": "/assets/products/cumin-powder-200g.png",
    "500g": "/assets/products/cumin-powder-500g.png",
    "1kg": "/assets/products/cumin-powder-1kg.png",
  },
  "pepper-powder": {
    "50g": "/assets/products/pepper-powder-100g.png",
    "100g": "/assets/products/pepper-powder-100g.png",
    "200g": "/assets/products/pepper-powder-200g.png",
    "500g": "/assets/products/pepper-powder-500g.png",
    "1kg": "/assets/products/pepper-powder-1kg.png",
  },
  "garam-masala": {
    "100g": "/assets/products/garam-masala-100g.png",
    "200g": "/assets/products/garam-masala-200g.png",
    "500g": "/assets/products/garam-masala-500g.png",
    "1kg": "/assets/products/garam-masala-1kg.png",
  },
};
