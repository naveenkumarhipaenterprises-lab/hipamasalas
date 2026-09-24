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
  heroImage: "/assets/hero-spices_8241cadf.webp",
  facebook: "https://www.facebook.com/profile.php?id=61592093192345",
  instagram: "https://www.instagram.com/hipa_masala/",
  whatsappHref:
    "https://wa.me/917058053055?text=Hi%20HIPA%20Masala%2C%20I%27d%20like%20to%20know%20more%20about%20your%20products.",
} as const;

export const products: Product[] = [
  {
    slug: "sambar-powder",
    name: "Sambar Powder",
    seoTitle: "Sambar Powder | South Indian Sambar Masala | HIPA Masala Chennai",
    metaDescription: "HIPA Masala Sambar Powder is a traditional South Indian spice blend crafted for authentic sambar. Available for homes, retailers and B2B in Chennai.",
    shortDescription: "A South Indian spice blend crafted for everyday authentic sambar.",
    description:
      "HIPA Masala Sambar Powder is formulated with selected coriander seeds, dried red chillies, cumin, fenugreek, lentils and aromatic spices for a balanced, traditional South Indian flavour.",
    image: "/assets/sambar_96379996.png",
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
    image: "/assets/rasam_b3831405.png",
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
    image: "/assets/turmeric_1bd08fa7.png",
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
    image: "/assets/hipa-red-chilli-powder-pack_2e2de7c8.webp",
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
    image: "/assets/coriander_6db70131.png",
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
    image: "/assets/cumin_cd53cea5.png",
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
    image: "/assets/pepper_36d6b66d.png",
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
    image: "/assets/garam-masala_6b465bcd.png",
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
    "slug": "best-masala-manufacturer-in-chennai",
    "title": "Best Masala Manufacturer in Chennai? What Buyers Should Actually Check",
    "description": "Looking for the best masala manufacturer in Chennai? Use this practical checklist to assess blends, packs, consistency, B2B fit and supplier communication.",
    "body": [
      "Finding the **best masala manufacturer in Chennai** is not only about comparing a price list. Restaurants, retailers, distributors, caterers and hotels need a supplier whose products fit their menu, pack requirements and expectations for repeatable flavour. The right decision comes from checking practical evidence before regular buying.",
      "## Answer first: what makes the best masala manufacturer in Chennai?",
      "The best masala manufacturer in Chennai is the one that can demonstrate a suitable product range, a clear ingredient and processing approach, useful pack formats, dependable communication and a workable fit for your business. A manufacturer may be a good choice for one buyer and a poor fit for another: a restaurant may prioritise blend performance in high-volume cooking, while a retailer may care more about consumer-ready packs and range breadth."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-09-24T09:00:00.000Z",
    "modifiedAt": "2026-09-24T09:00:00.000Z",
    "image": "/assets/best-masala-manufacturer-in-chennai.webp",
    "imageAlt": "B2B buyer guide cover showing supplier comparison documents in a Chennai food-industry setting",
    "complete": true
  },
  {
    "slug": "how-to-choose-a-masala-manufacturer-in-chennai-for-your-business",
    "title": "How to Choose a Masala Manufacturer in Chennai for Your Business",
    "description": "Learn how Chennai food businesses can compare masala manufacturers by product fit, processing, pack sizes, consistency and B2B communication.",
    "body": [
      "Choosing a **masala manufacturer in Chennai** is a commercial decision, not just a search for a spice powder supplier. Restaurants, retailers, distributors, caterers, hotels and other food businesses need a partner whose products, pack formats and communication fit the way they buy and operate.",
      "**Answer first:** compare manufacturers on five practical points: the masala range you actually need, the stated approach to ingredient selection and processing, pack sizes for your sales or kitchen use, how the supplier addresses consistency, and how clearly the business handles B2B enquiries. Then ask for product and commercial details before making a purchase decision. This process helps a Chennai buyer assess suitability without relying on broad promises.",
      "## Why the right masala manufacturer in Chennai matters"
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-09-24T09:00:00.000Z",
    "modifiedAt": "2026-09-24T09:00:00.000Z",
    "image": "/assets/how-to-choose-masala-manufacturer-in-chennai.webp",
    "imageAlt": "B2B guide cover showing a supplier selection and procurement workspace in a food manufacturing environment",
    "complete": true
  },
  {
    "slug": "what-makes-a-good-masala-manufacturer-8-things-buyers-should-check",
    "title": "What Makes a Good Masala Manufacturer? 8 Things Buyers Should Check",
    "description": "Learn what restaurants, retailers and distributors should check before choosing a masala manufacturer or spice manufacturer in Chennai and Tamil Nadu.",
    "body": [
      "Choosing a masala manufacturer is a business decision, not only a taste test. Restaurants, retailers, distributors, caterers, hotels and other food businesses need a spice manufacturer whose products, pack formats and communication fit the way they buy and sell. This guide gives buyers a practical framework for comparing suppliers without relying on vague promises.",
      "## What should you look for in a masala manufacturer?",
      "A good masala manufacturer should make its product range and intended use clear, explain how it approaches ingredient selection and processing, offer formats that suit the buyer’s operation, and communicate consistently about batches and support. Buyers should check eight areas: product fit, ingredient approach, processing, blend method, consistency, packaging and pack size, B2B suitability, and accessible business communication. The right choice is the supplier that can answer these questions clearly and match the answer to your day-to-day requirements."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-09-24T09:00:00.000Z",
    "modifiedAt": "2026-09-24T09:00:00.000Z",
    "image": "/assets/what-makes-a-good-masala-manufacturer.webp",
    "imageAlt": "B2B quality guide cover showing quality-control and process documents in a food manufacturing environment",
    "complete": true
  },
  {
    "slug": "masala-manufacturer-vs-supplier-vs-distributor",
    "title": "Masala Manufacturer Chennai vs Supplier vs Distributor: What’s the Difference?",
    "description": "Learn the difference between a masala manufacturer, supplier and distributor in Chennai, and choose the right spice partner for your business.",
    "body": [
      "When a restaurant, retailer, hotel, caterer or food business searches for a **masala manufacturer Chennai** partner or a **masala supplier Chennai** contact, the terms can sound interchangeable. They are not. A manufacturer makes or processes the masala, a supplier arranges products for business buyers, and a distributor moves products through a wider channel. Understanding the difference helps you ask better questions, compare the right options and choose a relationship that fits your purchasing needs.",
      "## Quick answer: manufacturer, supplier and distributor are different roles",
      "A **masala manufacturer** produces, processes, blends or packs spice products under its own operation or brand. A **masala supplier** is a business-facing source that provides products to a buyer; it may supply its own manufactured range or arrange products from another producer. A **distributor** purchases or handles products for resale to retailers, food-service buyers or other trade customers, usually with a focus on territory, stock movement and delivery. One company can perform more than one role, so the label alone is not enough. Ask who makes the product, who owns the customer relationship and who is responsible for fulfilment."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-09-24T09:00:00.000Z",
    "modifiedAt": "2026-09-24T09:00:00.000Z",
    "image": "/assets/masala-manufacturer-vs-supplier-vs-distributor.webp",
    "imageAlt": "B2B supply chain guide cover showing manufacturer, supplier and distributor stages in a food-industry facility",
    "complete": true
  },
  {
    "slug": "masala-manufacturer-for-restaurants-retailers-chennai",
    "title": "How to Evaluate a Masala Manufacturer for Restaurants / Retailers Chennai",
    "description": "A practical Chennai buyer guide for evaluating masala manufacturers on consistency, formats, sourcing, support and fit for food businesses.",
    "body": [
      "Choosing a **masala manufacturer for restaurants / retailers Chennai** is not simply a packet-price comparison. Restaurants need dependable flavour in repeated cooking. Retailers need a sensible range and pack formats. Distributors need clear communication across business types. Start with operational fit, product transparency and the supplier’s ability to discuss your requirements.",
      "## Answer first: what should a Chennai buyer evaluate?",
      "Restaurants, retailers, distributors, caterers, hotels and other food businesses should assess five areas: range, stated production approach, institutional pack suitability, support conversations, and location or communication convenience. Ask for exact products and formats, understand stated ingredient and processing information, and compare how clearly the supplier answers practical questions. Treat claims such as low-temperature milling, slow-roasting, no artificial dyes or batch consistency as the manufacturer’s stated approach unless independently verified."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-09-24T09:00:00.000Z",
    "modifiedAt": "2026-09-24T09:00:00.000Z",
    "image": "/assets/how-to-evaluate-masala-manufacturer-in-chennai.webp",
    "imageAlt": "B2B buyer guide cover showing supplier evaluation documents in a commercial food-industry setting",
    "complete": true
  },
  {
    "slug": "masala-supplier-for-supermarkets-in-chennai",
    "title": "Masala Supplier for Supermarkets in Chennai: What Retail Buyers Should Check",
    "description": "A practical guide for supermarket and retail buyers evaluating masala suppliers in Chennai. Learn what to check for shelf suitability, pack sizes, and supplier communication.",
    "body": [
      "Supermarket buyers need more than a masala product list. They need a supplier with a relevant product range, clear pack information, dependable communication, and products that fit the needs of local shoppers. When evaluating a **masala supplier for supermarkets in Chennai**, retailers should consider product demand, shelf suitability, available pack sizes, labelling, supply communication, and future enquiry support.",
      "**HIPA Masala is a Chennai-based Indian spice and masala brand serving everyday consumers and enquiries from distributors, dealers, wholesalers, retailers, supermarkets, restaurants, and exporters.** The current range includes spice powders and masala blends for everyday Indian cooking.",
      "This guide explains what supermarket buyers should check before selecting a masala supplier in Chennai, how to evaluate a product range, what information to include in a retailer enquiry, and how the current HIPA Masala range may fit a supermarket shelf."
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-09-10T11:16:00.000Z",
    "modifiedAt": "2026-09-10T11:16:00.000Z",
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
      "## Match the powder to the recipe"
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
      "## Start by defining the requirement"
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
      "## 1. Lemon rice"
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
      "## Start with the right type of powder"
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
      "## What is garam masala used for?"
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
      "## 1. Start with the product name"
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
      "## Read the product name carefully"
    ],
    "authorName": "HIPA Masala",
    "publishedAt": "2026-08-25T07:39:38.000Z",
    "modifiedAt": "2026-08-25T09:34:13.000Z",
    "image": "/assets/hipa-original-sambar-blog-cover-web_727590c6.webp",
    "imageAlt": "Original HIPA guide cover showing sambar powder, a bowl of sambar and whole spices",
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

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteIdentity.name,
    legalName: siteIdentity.legalName,
    url: absoluteUrl(origin, "/"),
    logo: absoluteUrl(origin, siteIdentity.logo),
    description: "HIPA Masala is an Indian spice and masala brand owned by HIPA Enterprises, based in Pallavaram, Chennai, Tamil Nadu, India.",
    email: siteIdentity.email,
    telephone: siteIdentity.phone,
    address: postalAddress,
    areaServed: ["Chennai", "Tamil Nadu", "India", "International export enquiries"],
    knowsAbout: ["Indian spice powders", "masala blends", "distributor supply", "dealer enquiries", "wholesale enquiries", "export enquiries"],
    contactPoint: { "@type": "ContactPoint", telephone: siteIdentity.phone, email: siteIdentity.email, contactType: "sales", areaServed: "IN" },
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteIdentity.name,
    legalName: siteIdentity.legalName,
    image: absoluteUrl(origin, siteIdentity.logo),
    url: absoluteUrl(origin, "/"),
    telephone: siteIdentity.phone,
    email: siteIdentity.email,
    address: postalAddress,
    priceRange: "₹₹",
  };

  if (path === "/") {
    schemas.push(organization, localBusiness, {
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
        }
      );
    }
  }

  if (path === "/faq") {
    schemas.push(breadcrumbSchema(origin, path, ["Home", "FAQ"]));
  }

  if (path === "/contact" || path === "/about" || path === "/b2b-enquiries" || path === "/blog") {
    schemas.push(breadcrumbSchema(origin, path, ["Home", path === "/contact" ? "Contact" : path === "/about" ? "About" : path === "/blog" ? "Journal" : "B2B Enquiries"]));
    if (path === "/contact") {
      schemas.push(localBusiness);
    }
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

  return schemas;
}
