/**
 * Local answer engine for the HIPA Masala website chat.
 *
 * Runs whenever the hosted model is unavailable (no API key, quota, timeout). It reads the
 * same product data the website renders (shared/hipaContent.ts) so every answer stays in
 * step with the pages, and it understands plain English, Tanglish and a little Tamil.
 *
 * Shape of an answer: detect the products named, detect what is being asked (one or more
 * intents), use the previous turns to fill in whichever of the two is missing, then compose
 * the relevant facts. Nothing here invents prices or stock.
 */
import { faqs, getShopHref, products, siteIdentity, type Product } from "../shared/hipaContent";

export type ChatTurn = { role: string; content: string };

const SITE = "https://www.hipamasalas.com";
const PHONE = siteIdentity.phone;
const EMAIL = siteIdentity.email;
const WHATSAPP = "https://wa.me/917058053055";
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${siteIdentity.name}, ${siteIdentity.locationLabel}`)}`;

type Intent =
  | "greeting"
  | "how_are_you"
  | "thanks"
  | "bye"
  | "bot_identity"
  | "human"
  | "products"
  | "price"
  | "buy"
  | "delivery"
  | "packs"
  | "ingredients"
  | "usage"
  | "storage"
  | "bulk"
  | "contact"
  | "location"
  | "hours"
  | "quality"
  | "about"
  | "jobs"
  | "complaint"
  | "not_in_range"
  | "blog"
  | "payment"
  | "compare"
  | "taste"
  | "yes"
  | "no";

/** Product aliases in English, Tamil (romanised) and Hindi, longest first when matching. */
const PRODUCT_ALIASES: Record<string, string[]> = {
  "sambar-powder": ["sambar powder", "sambhar", "saambar", "sambar", "sambar podi", "sambar masala", "சாம்பார்", "சாம்பார் பொடி"],
  "rasam-powder": ["rasam powder", "rasam", "rasam podi", "rasam masala", "saaru podi", "charu podi", "ரசம்", "ரசப்பொடி"],
  "turmeric-powder": ["turmeric powder", "turmeric", "manjal thool", "manjal podi", "manjal", "haldi", "curcumin", "pasupu", "மஞ்சள்", "மஞ்சள் தூள்"],
  "red-chilli-powder": ["red chilli powder", "red chili powder", "chilli powder", "chili powder", "red chilli", "red chili", "chilli", "chili", "chillie", "milagai thool", "milagai podi", "milagai", "mirchi", "lal mirch", "kaaram", "karam podi", "மிளகாய்", "முளகாய்", "மிளகாய் தூள்"],
  "coriander-powder": ["coriander powder", "coriander", "thaniya", "dhaniya", "dhania", "kothamalli thool", "kothamalli", "malli thool", "malli podi", "malli", "கொத்தமல்லி", "தனியா", "மல்லி"],
  "cumin-powder": ["cumin powder", "cumin", "seeragam", "jeeragam", "jeera", "jeerakam", "zeera", "சீரகம்", "சீரகத் தூள்"],
  "pepper-powder": ["pepper powder", "black pepper", "pepper", "milagu thool", "milagu podi", "milagu", "kali mirch", "kurumilagu", "மிளகு", "மிளகு தூள்"],
  "garam-masala": ["garam masala", "garam", "biryani masala", "kurma masala", "briyani masala", "கரம் மசாலா", "கரம்"],
};

/**
 * Things people ask for that HIPA does not make, with the closest product to suggest. Only
 * phrases that name a product someone might shop for: single everyday words such as salt,
 * oil or rice appear in ordinary cooking and ingredient questions and must not match.
 */
const NOT_IN_RANGE: Array<{ terms: string[]; label: string; plural: boolean; closest: string[] }> = [
  { terms: ["garlic podi", "poondu podi"], label: "Garlic podi", plural: false, closest: ["red-chilli-powder", "pepper-powder"] },
  { terms: ["paruppu podi", "parupu podi", "dal podi"], label: "Paruppu podi", plural: false, closest: ["sambar-powder", "rasam-powder"] },
  { terms: ["idli podi", "idly podi", "gun powder", "gunpowder", "idli milagai podi"], label: "Idli podi", plural: false, closest: ["red-chilli-powder", "pepper-powder"] },
  { terms: ["pickle", "pickles", "oorugai", "achar"], label: "Pickles", plural: true, closest: ["red-chilli-powder", "turmeric-powder"] },
  { terms: ["ginger garlic paste", "curry paste", "masala paste", "ready paste", "ready pastes"], label: "Pastes", plural: true, closest: ["garam-masala"] },
  { terms: ["whole spices", "whole spice", "whole cardamom", "whole cinnamon", "whole cloves", "whole pepper", "whole chilli", "whole chillies", "star anise", "bay leaf", "bay leaves", "fenugreek seeds", "mustard seeds", "cumin seeds", "coriander seeds"], label: "Whole spices", plural: true, closest: ["garam-masala", "pepper-powder"] },
  { terms: ["chicken masala", "mutton masala", "fish masala", "fish fry masala", "egg masala", "meat masala", "chicken 65 masala", "chicken 65"], label: "Meat-specific masalas", plural: true, closest: ["garam-masala", "red-chilli-powder"] },
  { terms: ["chaat masala", "pav bhaji masala", "pav bhaji", "kitchen king", "chole masala", "pani puri masala", "tea masala", "chai masala", "sabji masala", "kashmiri chilli", "kashmiri mirch"], label: "North Indian specialty masalas", plural: true, closest: ["garam-masala"] },
  { terms: ["tea powder", "coffee powder", "filter coffee", "cooking oil", "gingelly oil", "rice flour", "wheat flour", "atta", "maida", "papad", "papads", "appalam", "vadagam"], label: "Papads and other groceries", plural: true, closest: ["sambar-powder", "turmeric-powder"] },
];

/** Keyword and phrase cues for each intent (matched against the normalised message). */
const INTENT_CUES: Record<Exclude<Intent, "greeting" | "yes" | "no">, string[]> = {
  how_are_you: ["how are you", "how r u", "how are u", "hru", "epdi iruka", "epdi irukinga", "eppadi irukeenga", "epdi irukeenga", "epdi irukka", "eppadi irukka", "whats up", "what s up", "sugama", "nalla irukingala"],
  thanks: ["thank", "thanks", "thx", "ty", "nandri", "romba nandri", "thankyou", "appreciate", "நன்றி"],
  bye: ["bye", "goodbye", "see you", "good night", "poitu varen", "varen", "tata", "cya"],
  bot_identity: ["are you a bot", "are you bot", "are you human", "are you real", "who are you", "what are you", "robot", "are you ai", "is this ai", "chatbot", "machine"],
  human: ["talk to human", "talk to a person", "speak to someone", "speak to a person", "real person", "customer care", "customer support", "call me", "call back", "callback", "connect me", "manager", "sales team", "agent"],
  products: ["product", "products", "product list", "list", "what do you have", "what do you sell", "what you sell", "what all", "range", "catalogue", "catalog", "items", "varieties", "variety", "enna irukku", "enna iruku", "enna enna", "menu", "collection", "all masala", "masalas", "spices", "powders", "types", "பொருட்கள்", "என்ன இருக்கு", "என்னென்ன"],
  price: ["price", "prices", "pricing", "priced", "cost", "costs", "rate", "rates", "mrp", "how much", "evlo", "evvalavu", "yevlo", "vilai", "velai", "rupees", "rs", "₹", "cheap", "cheapest", "expensive", "discount", "offer", "offers", "deal", "budget", "quote", "quotation", "விலை", "எவ்வளவு", "ரேட்"],
  buy: ["buy", "buying", "order", "ordering", "purchase", "shop", "shopping", "online", "amazon", "flipkart", "swiggy", "zepto", "blinkit", "bigbasket", "where can i get", "where to get", "where do i get", "where can i buy", "available", "availability", "near me", "nearby", "store", "stores", "supermarket", "kadai", "vanga", "vangalam", "vanganum", "vaanga", "get it", "stock", "in stock", "sell", "வாங்க", "வாங்கலாம்", "கிடைக்கும்", "கிடைக்குமா", "ஆர்டர்"],
  delivery: ["delivery", "deliver", "delivered", "shipping", "ship", "courier", "cash on delivery", "cod", "how many days", "dispatch", "all india", "pan india", "outside tamil nadu", "international", "abroad", "overseas", "usa", "dubai", "singapore", "malaysia", "uk", "pin code", "pincode"],
  packs: ["pack", "packs", "packet", "packets", "pack size", "pack sizes", "size", "sizes", "gram", "grams", "gms", "gm", "100g", "200g", "500g", "1kg", "1 kg", "50g", "weight", "pouch", "sachet", "how big", "quantities"],
  ingredients: ["ingredient", "ingredients", "contain", "contains", "containing", "made of", "made from", "what is in", "whats in", "what s in", "composition", "added salt", "salt", "msg", "preservative", "preservatives", "colour", "color", "colours", "colors", "artificial", "additive", "additives", "pure", "purity", "adulteration", "adulterated", "100 pure", "100 natural", "100 percent", "hundred percent", "natural", "organic", "gluten", "allergen", "allergy", "vegan", "vegetarian", "veg", "halal", "sugar", "chemical", "chemicals", "healthy", "health", "side effects", "safe", "சேர்க்கை", "கலப்படம்"],
  usage: ["recipe", "recipes", "how to use", "how to make", "how do i make", "how to cook", "how to prepare", "use panradhu", "use pannuvanga", "use panna", "epdi use", "eppadi use", "epdi panradhu", "eppadi seiyanum", "epdi seiyanum", "seiyarathu", "cook", "cooking", "prepare", "how much to add", "how much to use", "quantity per", "spoon", "spoons", "tablespoon", "teaspoon", "tsp", "tbsp", "dish", "dishes", "biryani", "kurma", "curry", "gravy", "idli", "dosa", "poriyal", "kootu", "chicken", "mutton", "fish", "egg", "paneer", "tiffin", "sambar epdi", "rasam epdi", "serving", "servings", "tips", "best for", "used for", "uses", "use", "good for", "எப்படி", "செய்முறை", "சமையல்"],
  storage: ["store", "storage", "storing", "shelf life", "shelf", "expiry", "expire", "expires", "expiration", "best before", "fridge", "refrigerate", "refrigerator", "how long", "last", "lasts", "keep", "fresh", "freshness", "moisture", "clump", "clumping", "airtight", "container"],
  bulk: ["bulk", "wholesale", "whole sale", "hotel", "hotels", "restaurant", "restaurants", "catering", "caterer", "caterers", "canteen", "mess", "cloud kitchen", "commercial", "supply", "supplier", "distributor", "distributors", "distributorship", "dealer", "dealers", "dealership", "franchise", "retailer", "retailers", "reseller", "private label", "white label", "own brand", "oem", "contract manufacturing", "kgs", "kilo", "kilos", "tonne", "ton", "tons", "monthly", "institutional", "b2b", "margin", "margins", "trade price", "export", "exporter", "exports", "import", "importer", "minimum order", "moq", "sample", "samples", "business", "shop owner", "my shop", "my store", "my hotel", "my restaurant", "tender", "corporate", "gst invoice", "invoice", "bill", "மொத்த", "மொத்தமாக", "ஹோட்டல்"],
  contact: ["contact", "contact number", "phone", "phone number", "number", "mobile", "call", "whatsapp", "whats app", "email", "mail", "reach you", "reach out", "get in touch", "support", "helpline", "customer care", "தொடர்பு", "போன்", "எண்"],
  location: ["where are you", "where is", "where r u", "located", "location", "address", "place", "map", "maps", "directions", "direction", "visit", "factory", "unit", "office", "shop address", "pallavaram", "chennai", "chrompet", "tambaram", "enga irukinga", "enga iruku", "enga irukku", "yenga", "which city", "which area", "come there", "head office", "warehouse", "godown", "எங்கே", "எங்க", "முகவரி", "இடம்"],
  hours: ["timing", "timings", "open", "opening", "opens", "close", "closed", "closing", "closes", "working hours", "working time", "hours", "sunday", "saturday", "holiday", "holidays", "what time", "when are you open", "open today", "open now", "time", "நேரம்", "ஞாயிறு"],
  quality: ["fssai", "licence", "license", "licensed", "certified", "certificate", "certification", "iso", "quality", "hygiene", "hygienic", "lab", "tested", "testing", "gst", "gstin", "standard", "standards", "authentic", "genuine", "original", "fake", "trust", "trusted", "process", "processed", "how do you make", "how is it made", "manufacturing", "manufacture", "manufacturer", "manufactured", "roasted", "milled", "grind", "ground", "grinding", "machine made", "homemade", "home made", "fresh ground"],
  about: ["about", "about you", "about hipa", "company", "brand", "who owns", "owner", "founder", "founded", "started", "history", "hipa means", "hipa enterprises", "established", "since", "tell me about", "what is hipa", "who is hipa", "introduce", "background", "story"],
  jobs: ["job", "jobs", "career", "careers", "vacancy", "vacancies", "hiring", "recruit", "recruitment", "work with you", "employment", "internship", "salary", "opening for"],
  complaint: ["complaint", "complain", "problem", "issue", "damaged", "damage", "spoiled", "spoilt", "refund", "return", "replace", "replacement", "not good", "worst", "expired", "fungus", "insects", "worms", "smell", "stale", "leak", "leaking", "wrong product", "missing", "not received", "not delivered", "cheated", "disappointed", "my order", "order status", "track", "tracking", "havent received", "have not received", "not yet received", "still not received", "where is my order", "not arrived", "hasnt arrived", "didnt receive", "didnt get", "never came", "never arrived"],
  not_in_range: [],
  blog: ["blog", "article", "articles", "guide", "guides", "read"],
  payment: ["payment", "payments", "pay", "paying", "upi", "gpay", "google pay", "phonepe", "paytm", "card", "credit card", "debit card", "net banking", "bank transfer", "neft", "emi", "advance"],
  compare: ["difference", "different", "differ", "vs", "versus", "compare", "comparison", "better", "which one", "which is", "or", "same"],
  taste: ["spicy", "spice level", "heat", "hot", "mild", "pungent", "taste", "tastes", "flavour", "flavor", "aroma", "smell", "smells", "strong", "kaaram", "karam", "காரம்", "சுவை"],
};

const GREETINGS = ["hi", "hii", "hiii", "hello", "helo", "hallo", "hey", "heyy", "hai", "hoi", "yo", "vanakkam", "vanakam", "namaste", "namaskar", "namaskaram", "good morning", "good afternoon", "good evening", "morning", "evening", "hi there", "hello there", "greetings", "hola", "வணக்கம்"];
const YES_WORDS = ["yes", "yeah", "yep", "yup", "ya", "sure", "ok", "okay", "k", "aama", "aamaa", "ama", "amaa", "seri", "sari", "correct", "right", "s", "haan", "ha", "fine", "go ahead", "please", "pls", "plz", "tell me", "sollunga", "sollu"];
const NO_WORDS = ["no", "nope", "nah", "illa", "illai", "ille", "venam", "vendam", "not now", "later", "nahi"];

/** Tokens that signal Tanglish (Tamil written in English letters) so the tone can match. */
const TANGLISH_MARKERS = ["epdi", "eppadi", "enna", "yenna", "venum", "venam", "irukka", "iruka", "iruku", "irukku", "irukinga", "podunga", "sollunga", "sollu", "pannunga", "panradhu", "panna", "pannalam", "panni", "vaanga", "vanga", "vangalam", "kudunga", "evlo", "evvalavu", "enga", "yenga", "illa", "illai", "aama", "seri", "vanakkam", "nandri", "mudiyuma", "kidaikuma", "kedaikuma", "kidaikum", "irukkum", "saptiya", "saapadu", "nalla", "romba", "konjam", "ungaluku", "ungalukku", "enaku", "enakku", "ellam", "ethana", "yethana", "neenga", "naan", "la", "ku", "nga", "da", "bro", "anna", "akka", "sir", "madam"];

const STOPWORDS = new Set(["the", "a", "an", "is", "are", "am", "i", "you", "we", "it", "to", "of", "in", "on", "for", "and", "or", "do", "does", "did", "can", "could", "would", "should", "will", "me", "my", "your", "this", "that", "there", "here", "what", "which", "who", "how", "why", "when", "where", "with", "about", "please", "pls", "plz", "hipa", "masala", "powder", "powders", "any", "some", "have", "has", "get", "want", "need", "know", "tell", "give", "u", "r", "ur", "na", "la", "ku", "nga"]);

/* ----------------------------------------------------------------------------------------- */

const slugMap = new Map(products.map((product) => [product.slug, product]));
const productBySlug = (slug: string): Product => slugMap.get(slug) as Product;
const productLink = (product: Product) => `${SITE}/products/${product.slug}`;
const packList = (product: Product) => joinList(product.packSizes);
const spec = (product: Product, label: string) => product.specs.find((row) => row.label.toLowerCase().includes(label.toLowerCase()))?.value;
const firstSentence = (text: string) => text.split(/(?<=[.!?])\s+/)[0];

function joinList(items: readonly string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function normalise(text: string) {
  return text
    .toLowerCase()
    .replace(/[‘’']/g, "")
    // Keep Latin letters and digits plus Tamil and Devanagari script; everything else is a separator.
    .replace(/[^a-z0-9\u0B80-\u0BFF\u0900-\u097F₹]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasPhrase(haystack: string, phrase: string) {
  const padded = ` ${haystack} `;
  return padded.includes(` ${phrase} `);
}

export function detectTanglish(message: string) {
  if (/[஀-௿]/.test(message)) return true; // Tamil script
  const words = normalise(message).split(" ");
  return words.some((word) => TANGLISH_MARKERS.includes(word) && !["sir", "madam", "bro", "da", "la", "ku"].includes(word)) || words.filter((word) => TANGLISH_MARKERS.includes(word)).length >= 2;
}

export function detectProducts(text: string): Product[] {
  const found: Product[] = [];
  for (const [slug, aliases] of Object.entries(PRODUCT_ALIASES)) {
    if (aliases.some((alias) => hasPhrase(text, alias))) found.push(productBySlug(slug));
  }
  // "chilli chicken" style mentions name a dish, not the powder, when a recipe word follows the alias.
  return found;
}

function detectNotInRange(text: string) {
  return NOT_IN_RANGE.filter((entry) => entry.terms.some((term) => hasPhrase(text, term)));
}

export function detectIntents(text: string): Set<Intent> {
  const intents = new Set<Intent>();
  const words = text.split(" ").filter(Boolean);
  if (words.length <= 4 && GREETINGS.some((greeting) => text === greeting || text.startsWith(`${greeting} `))) intents.add("greeting");
  if (words.length <= 3 && YES_WORDS.includes(text)) intents.add("yes");
  if (words.length <= 3 && NO_WORDS.includes(text)) intents.add("no");
  for (const [intent, cues] of Object.entries(INTENT_CUES) as Array<[Intent, string[]]>) {
    if (cues.some((cue) => hasPhrase(text, cue))) intents.add(intent);
  }
  if (detectNotInRange(text).length) intents.add("not_in_range");

  // Disambiguation between cues that overlap in everyday phrasing.
  if (intents.has("buy") && (hasPhrase(text, "where are you") || hasPhrase(text, "address"))) intents.delete("buy");
  if (intents.has("location") && intents.has("buy") && !hasPhrase(text, "address") && !hasPhrase(text, "visit") && !hasPhrase(text, "factory") && !hasPhrase(text, "office")) intents.delete("location");
  if (intents.has("hours") && hasPhrase(text, "time") && !/\b(what time|open|close|timing|hours|sunday|saturday|holiday)\b/.test(text)) intents.delete("hours");
  if (intents.has("contact") && hasPhrase(text, "number") && (hasPhrase(text, "fssai") || hasPhrase(text, "licence") || hasPhrase(text, "license") || hasPhrase(text, "gst"))) intents.delete("contact");
  // "Where is my order?" is a complaint about an existing order, not a request to place one.
  if (intents.has("complaint") && /\b(my order|order status|track|tracking|received|arrived|didnt (?:receive|get)|never came)\b/.test(text)) {
    intents.delete("buy");
    intents.delete("delivery");
  }
  if (intents.has("compare") && hasPhrase(text, "or") && !/\b(difference|different|vs|versus|compare|better|which)\b/.test(text)) intents.delete("compare");
  if (intents.has("usage") && (hasPhrase(text, "use") || hasPhrase(text, "uses")) && intents.has("buy") && !/\b(recipe|cook|how to use|how to make)\b/.test(text)) intents.delete("usage");
  if (intents.has("storage") && hasPhrase(text, "store") && (intents.has("buy") || hasPhrase(text, "near me") || hasPhrase(text, "which store"))) intents.delete("storage");
  if (intents.has("bulk") && (hasPhrase(text, "business") || hasPhrase(text, "bill")) && intents.has("about") && !/\b(bulk|wholesale|hotel|distributor|dealer)\b/.test(text)) intents.delete("bulk");
  if (intents.has("quality") && hasPhrase(text, "process") && intents.has("payment")) intents.delete("quality");
  return intents;
}

/* ----------------------------------------------------------------------------------------- */

type Voice = { tanglish: boolean };

const pick = <T,>(options: T[], seed: number) => options[Math.abs(seed) % options.length];
const seedOf = (text: string) => text.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

function t(voice: Voice, english: string, tanglish: string) {
  return voice.tanglish ? tanglish : english;
}

function contactLine(voice: Voice) {
  return t(voice, `Call or WhatsApp ${PHONE}, or email ${EMAIL}.`, `${PHONE}-ku call or WhatsApp pannunga, illa ${EMAIL}-ku mail pannunga.`);
}

function productOverview(product: Product, voice: Voice) {
  const bestFor = spec(product, "Best Used For");
  const lines = [
    `${product.name}: ${product.shortDescription}`,
    `Pack sizes: ${packList(product)}${bestFor ? `\nBest for: ${bestFor}` : ""}`,
    t(voice, `Details: ${productLink(product)}\nAsk me about its price, ingredients, how to use it or how to store it.`, `Details: ${productLink(product)}\nPrice, ingredients, epdi use panradhu, storage: edhu venum-naalum kelunga 😊`),
  ];
  return lines.join("\n\n");
}

function answerPrice(selected: Product[], voice: Voice, bulk: boolean) {
  const what = selected.length ? joinList(selected.map((product) => product.name)) : t(voice, "any product", "edha venum-naalum");
  const packs = selected.length === 1 ? ` (${packList(selected[0])})` : "";
  const intro = bulk
    ? t(voice, `Bulk and trade prices depend on the product and monthly quantity, so the team quotes them directly.`, `Bulk and trade rate product and monthly quantity-ai poruthu irukkum, so team direct-a quote pannuvanga.`)
    : t(voice, `We don't list prices on the website yet, so I can't quote a figure here.`, `Website-la price innum list pannala, so naan oru number sollamudiyadhu.`);
  const ask = t(voice, `For the current price of ${what}${packs}, message ${PHONE} on WhatsApp or email ${EMAIL} and the team replies with the rate${bulk ? " and the order terms" : ""}.`, `${what}${packs} current price-ku ${PHONE}-la WhatsApp pannunga illa ${EMAIL}-ku mail pannunga, team rate${bulk ? " and order terms" : ""} sollitu varanga.`);
  const extra = bulk ? "" : t(voice, `\n\nIf you're buying for a shop, hotel or caterer, tell me the quantity and I'll point you to bulk pricing.`, `\n\nShop, hotel illa catering-ku vaangureengala? Quantity sollunga, bulk price-ku guide panren.`);
  return `${intro} ${ask}${extra}`;
}

function answerBuy(selected: Product[], voice: Voice) {
  const name = selected.length === 1 ? selected[0].name : t(voice, "HIPA Masala products", "HIPA Masala products");
  const shop = getShopHref();
  if (shop.startsWith("http")) {
    return `${t(voice, `You can order ${name} online here: ${shop}`, `${name} online-la inga order pannalam: ${shop}`)}\n\n${t(voice, `Prefer to order directly? ${contactLine(voice)}`, `Direct-a order panna: ${contactLine(voice)}`)}`;
  }
  return [
    t(voice, `Right now orders are taken directly by the HIPA team: WhatsApp ${PHONE} with the product and quantity, or email ${EMAIL}.`, `Ippo order direct-a HIPA team edukkuranga: product and quantity ${PHONE}-ku WhatsApp pannunga, illa ${EMAIL}-ku mail pannunga.`),
    t(voice, `Tell the team your area when you message${selected.length === 1 ? ` about ${name}` : ""} and they'll confirm the quickest way to get it to you.`, `Message panna podhu ungal area-vum sollunga${selected.length === 1 ? ` (${name})` : ""}, seekiram epdi kidaikum-nu team confirm pannuvanga.`),
    t(voice, `An online store link is on its way to the Shop Now button; until then the team takes every order directly.`, `Shop Now button-ku online store link seekiram varudhu; adhu varaikkum team direct-a order edukkuranga.`),
  ].join("\n\n");
}

function answerDelivery(voice: Voice) {
  return [
    t(voice, `Yes, we dispatch across Tamil Nadu and the rest of India by courier.`, `Aama, Tamil Nadu full-a and India across courier-la anuppurom.`),
    t(voice, `Delivery time and charges depend on your pin code and order size, so share your pin code and the quantity on WhatsApp ${PHONE} and the team confirms both before you pay.`, `Delivery time and charge ungal pin code and order size-ai poruthu irukkum. Pin code and quantity ${PHONE}-ku WhatsApp pannunga, team confirm pannuvanga.`),
    t(voice, `For orders outside India, email ${EMAIL}; we work with merchant exporters for international shipments.`, `India-ku veliya order-ku ${EMAIL}-ku mail pannunga; international shipment exporters moolama pannurom.`),
  ].join("\n\n");
}

function answerPacks(selected: Product[], voice: Voice) {
  if (selected.length) {
    return selected.map((product) => `${product.name}: ${packList(product)}`).join("\n") + `\n\n${t(voice, "Businesses can also get 500g and 1kg institutional packs and bulk bags.", "Business-ku 500g, 1kg institutional packs and bulk bags-um irukku.")}`;
  }
  const lines = products.map((product) => `• ${product.name}: ${packList(product)}`).join("\n");
  return `${t(voice, "Current retail pack sizes:", "Ippo irukkura retail pack sizes:")}\n${lines}\n\n${t(voice, "Hotels, caterers and retailers can also get institutional packs and bulk bags.", "Hotels, caterers and retailers-ku institutional packs and bulk bags-um kidaikum.")}`;
}

function answerIngredients(selected: Product[], voice: Voice) {
  const purity = t(voice, `Every HIPA product is pure spice: no artificial colours, no added MSG, no synthetic preservatives and no fillers. FSSAI licence ${siteIdentity.fssaiLicence}.`, `Ella HIPA products-um pure spice: artificial colour illa, MSG illa, preservative illa, filler illa. FSSAI licence ${siteIdentity.fssaiLicence}.`);
  if (!selected.length) return `${purity}\n\n${t(voice, "Name a product and I'll list its exact ingredients.", "Edha product-nu sollunga, exact ingredients sollren.")}`;
  const parts = selected.map((product) => {
    const ingredients = spec(product, "Ingredients");
    const aroma = product.ingredientsAndAroma.find((line) => line.startsWith("Aroma"));
    return `${product.name}\nIngredients: ${ingredients ?? firstSentence(product.description)}${aroma ? `\n${aroma}` : ""}`;
  });
  return `${parts.join("\n\n")}\n\n${purity}`;
}

function answerUsage(selected: Product[], voice: Voice, text: string) {
  if (!selected.length) {
    return [
      t(voice, `Happy to help you cook. Tell me the dish or the powder (sambar, rasam, garam masala, turmeric, red chilli, coriander, cumin or pepper) and I'll share how much to use and when to add it.`, `Cooking help panren 😄 Edha dish illa edha powder-nu sollunga (sambar, rasam, garam masala, turmeric, red chilli, coriander, cumin, pepper), evlo use pannanum and eppo add pannanum sollren.`),
      t(voice, `Quick starters: 1.5 to 2 tablespoons of Sambar Powder for a family-size sambar, 1 tablespoon of Rasam Powder for a pot of tomato-tamarind rasam, and half a teaspoon of Garam Masala to finish a gravy. Sambar and Rasam powders come in 100g to 1kg packs.`, `Quick tips: family-size sambar-ku 1.5 to 2 tablespoon Sambar Powder, oru pot rasam-ku 1 tablespoon Rasam Powder, gravy finish panna half teaspoon Garam Masala. Sambar and Rasam powders 100g to 1kg packs-la kidaikum.`),
    ].join("\n\n");
  }
  return selected
    .map((product) => {
      const dishMatch = product.commonUses.find((use) => normalise(use).split(" ").some((word) => word.length > 3 && hasPhrase(text, word) && !STOPWORDS.has(word)));
      const use = dishMatch ?? product.commonUses[0];
      const serving = product.faqs.find((faq) => /how much|per serving|quantity/i.test(faq.question));
      return `${product.name}\n${use}${serving ? `\n${serving.answer}` : ""}\n${t(voice, "More uses:", "Innum uses:")} ${productLink(product)}`;
    })
    .join("\n\n");
}

function answerStorage(selected: Product[], voice: Voice) {
  const product = selected[0] ?? productBySlug("sambar-powder");
  const tips = product.storageGuidance.slice(0, 2).join(" ");
  const shelf = spec(product, "Shelf Life") ?? "12 Months from manufacture";
  return `${selected.length ? `${product.name}: ` : ""}${t(voice, `Shelf life is ${shelf.toLowerCase()} when unopened.`, `Shelf life ${shelf.toLowerCase()} (unopened).`)} ${tips}\n\n${t(voice, "Once opened, keep it in an airtight container away from heat and steam, use a dry spoon every time, and use it well within the best-before date on the pack.", "Open panna apram airtight container-la, heat and steam-ku thalli vechukkonga, dry spoon mattum use pannunga, pack-la irukkura best-before date-kulla use pannidunga.")}`;
}

function answerBulk(selected: Product[], voice: Voice, text: string) {
  const qty = text.match(/(\d+(?:\.\d+)?)\s*(kg|kgs|kilo|kilos|ton|tons|tonne)/);
  const product = selected.length ? joinList(selected.map((item) => item.name)) : "";
  const opening = t(voice, `Yes, HIPA supplies hotels, restaurants, caterers, cloud kitchens, retailers and distributors directly from our unit in Pallavaram, Chennai.`, `Super! HIPA hotels, restaurants, caterers, cloud kitchens, retailers and distributors-ku direct-a Pallavaram, Chennai unit-la irundhu supply pannurom 🏨📦`);
  const formats = t(voice, `Formats: 500g and 1kg institutional packs plus bulk bags, GST invoice (GSTIN ${siteIdentity.gstin}), consistent batch quality and delivery across Tamil Nadu and India.`, `Formats: 500g and 1kg institutional packs plus bulk bags, GST invoice (GSTIN ${siteIdentity.gstin}), batch-to-batch same quality, Tamil Nadu and India across delivery.`);
  const known = [product && `product: ${product}`, qty && `quantity: ${qty[0]}`].filter(Boolean).join(", ");
  const ask = known
    ? t(voice, `Noted (${known}). Share your business name, city and the remaining details on WhatsApp ${PHONE} or email ${EMAIL} for a quote.`, `Noted (${known}). Business name, city and baaki details ${PHONE}-ku WhatsApp illa ${EMAIL}-ku mail pannunga, quote tharanga.`)
    : t(voice, `To get a quote quickly, send the product, approximate monthly quantity in kg and your city to WhatsApp ${PHONE} or ${EMAIL}.`, `Quote seekiram venum-na, product, approx monthly quantity (kg) and city ${PHONE}-ku WhatsApp illa ${EMAIL}-ku anuppunga.`);
  const extras: string[] = [];
  if (/\b(private label|white label|own brand|oem|contract manufacturing)\b/.test(text)) extras.push(t(voice, "Private-label and contract-manufacturing requests are reviewed case by case by the team; mention it in your message.", "Private label / contract manufacturing team case-by-case paarpanga; message-la mention pannunga."));
  if (/\b(sample|samples)\b/.test(text)) extras.push(t(voice, "Ask the team about samples in the same message, with the product and the volume you have in mind.", "Samples pathi adhe message-la kelunga, product and expected volume-um sollunga."));
  if (/\b(export|exporter|exports|import|importer|international|abroad|overseas)\b/.test(text)) extras.push(t(voice, "Export enquiries are welcome; we work with merchant exporters and regional distributors outside Tamil Nadu.", "Export enquiries welcome; merchant exporters and other-state distributors koodavum work pannurom."));
  if (/\b(minimum order|moq)\b/.test(text)) extras.push(t(voice, "Minimum quantities depend on the product and pack format, so ask the team when you share your volume.", "Minimum quantity product and pack format-ai poruthu irukkum; volume sollum podhu team-a kelunga."));
  return [opening, formats, ask, ...extras].join("\n\n");
}

function answerContact(voice: Voice) {
  return [
    t(voice, "You can reach the HIPA Masala team directly:", "HIPA Masala team-a direct-a contact pannalam:"),
    `📞 ${PHONE} (call or WhatsApp)\n💬 ${WHATSAPP}\n✉️ ${EMAIL}\n🕘 ${siteIdentity.openingHours.label}`,
    t(voice, `Or use the enquiry form: ${SITE}/contact`, `Illa enquiry form: ${SITE}/contact`),
  ].join("\n\n");
}

function answerLocation(voice: Voice) {
  return [
    t(voice, "HIPA Masala (HIPA Enterprises) is in Old Pallavaram, Chennai:", "HIPA Masala (HIPA Enterprises) Old Pallavaram, Chennai-la irukku:"),
    `📍 ${siteIdentity.locationLabel}\n🗺️ ${MAP_LINK}`,
    t(voice, `Visiting hours: ${siteIdentity.openingHours.label}. Please call ${PHONE} before you come so someone is ready to receive you.`, `Visiting hours: ${siteIdentity.openingHours.label}. Varadhuku munnadi ${PHONE}-ku oru call pannunga.`),
  ].join("\n\n");
}

function answerHours(voice: Voice) {
  return t(voice, `We're open ${siteIdentity.openingHours.label}, and closed on Sundays. Messages sent outside these hours are picked up when the team is back.`, `Open ${siteIdentity.openingHours.label}; Sunday leave. Hours-ku veliya message panninaa team thirumba vandhadhum reply pannuvanga.`);
}

function answerQuality(voice: Voice) {
  return [
    t(voice, `HIPA Masala is FSSAI-licensed (Lic. No. ${siteIdentity.fssaiLicence}) and GST-registered (GSTIN ${siteIdentity.gstin}), operated by HIPA Enterprises in Pallavaram, Chennai.`, `HIPA Masala FSSAI-licensed (Lic. No. ${siteIdentity.fssaiLicence}) and GST-registered (GSTIN ${siteIdentity.gstin}); HIPA Enterprises, Pallavaram, Chennai run pannudhu.`),
    t(voice, "How we make it: whole spices are selected and cleaned before milling, milled at controlled low temperature so the essential oils stay in, blends like Sambar and Rasam are slow-roasted, and everything is packed under hygienic conditions with no artificial colours or unnecessary additives.", "Epdi pannurom: whole spices select panni clean pannitu, low temperature-la mill pannurom (essential oils pogama irukka), Sambar/Rasam maadhiri blends slow-roast pannurom, hygienic-a pack pannurom. Artificial colour illa, unnecessary additives illa."),
  ].join("\n\n");
}

function answerAbout(voice: Voice) {
  return [
    t(voice, `HIPA Masala ("Taste of Tradition") is the spice brand of HIPA Enterprises, based in Zamin Pallavaram, Chennai. We make eight pure spice powders and traditional South Indian blends for home kitchens, retailers and food businesses across Tamil Nadu and India.`, `HIPA Masala ("Taste of Tradition") HIPA Enterprises-oda spice brand, Zamin Pallavaram, Chennai-la irukku. Home kitchens, retailers and food businesses-ku 8 pure spice powders and traditional South Indian blends pannurom.`),
    t(voice, `More about us: ${SITE}/about`, `Innum therinjikka: ${SITE}/about`),
  ].join("\n\n");
}

function answerProducts(voice: Voice) {
  const blends = products.filter((product) => ["sambar-powder", "rasam-powder", "garam-masala"].includes(product.slug));
  const singles = products.filter((product) => !blends.includes(product));
  return [
    t(voice, "HIPA Masala makes eight products:", "HIPA Masala-la 8 products irukku:"),
    `Blends: ${joinList(blends.map((product) => product.name))}\nPure spices: ${joinList(singles.map((product) => product.name))}`,
    t(voice, `Full catalogue: ${SITE}/products\nName one and I'll share its pack sizes, ingredients and uses.`, `Full catalogue: ${SITE}/products\nEdha venum-nu sollunga, pack sizes, ingredients and uses sollren.`),
  ].join("\n\n");
}

function answerNotInRange(text: string, voice: Voice) {
  const entries = detectNotInRange(text);
  const label = entries[0]?.label ?? "That";
  const plural = entries[0]?.plural ?? false;
  const closest = Array.from(new Set(entries.flatMap((entry) => entry.closest))).slice(0, 2).map((slug) => productBySlug(slug).name);
  return t(
    voice,
    `${label} ${plural ? "aren't" : "isn't"} in the HIPA range today. We make eight products: Sambar Powder, Rasam Powder, Garam Masala, Turmeric, Red Chilli, Coriander, Cumin and Pepper powders. The closest match would be ${joinList(closest)}.`,
    `${label} ippo HIPA range-la illa. Naanga 8 products pannurom: Sambar Powder, Rasam Powder, Garam Masala, Turmeric, Red Chilli, Coriander, Cumin and Pepper powders. Closest match: ${joinList(closest)}.`,
  );
}

function answerCompare(selected: Product[], voice: Voice) {
  const slugs = selected.map((product) => product.slug);
  if (slugs.includes("sambar-powder") && slugs.includes("rasam-powder")) {
    const faq = faqs.find((item) => /difference between HIPA Sambar Powder and Rasam Powder/i.test(item.question));
    if (faq) return faq.answer;
  }
  if (selected.length >= 2) {
    return selected.map((product) => `${product.name}: ${product.shortDescription} Best for: ${spec(product, "Best Used For") ?? firstSentence(product.commonUses[0])}`).join("\n\n");
  }
  return t(voice, "Tell me which two products you're weighing up and I'll compare them.", "Edha rendu products compare pannanum-nu sollunga.");
}

function answerTaste(selected: Product[], voice: Voice) {
  if (selected.length) {
    return selected
      .map((product) => {
        const aroma = product.ingredientsAndAroma.find((line) => /^Aroma/i.test(line)) ?? product.shortDescription;
        return `${product.name}: ${aroma.replace(/^Aroma & Flavour Profile:\s*/i, "")}`;
      })
      .join("\n\n");
  }
  return t(
    voice,
    "Heat comes mainly from the Red Chilli Powder (bold, balanced heat) and Pepper Powder (sharp, warming). Sambar Powder is mild-to-medium, Rasam Powder is peppery and tangy, Garam Masala is warm and aromatic rather than hot, and Turmeric, Coriander and Cumin are mild. Name a product and I'll describe its taste in detail.",
    "Kaaram mainly Red Chilli Powder (bold, balanced heat) and Pepper Powder (sharp) la irukkum. Sambar Powder mild-to-medium, Rasam Powder peppery and tangy, Garam Masala warm aroma (adhigam kaaram illa), Turmeric, Coriander, Cumin mild. Edha product-nu sollunga, taste detail-a sollren.",
  );
}

function answerComplaint(voice: Voice) {
  return t(
    voice,
    `I'm sorry about that, and thank you for telling us. Please WhatsApp ${PHONE} or email ${EMAIL} with the product name, pack size, batch or best-before date from the pack and a photo if possible, and the team will sort it out quickly.`,
    `Romba sorry, sollinadhuku nandri. Product name, pack size, pack-la irukkura batch / best-before date, mudinja oru photo ${PHONE}-ku WhatsApp illa ${EMAIL}-ku mail pannunga, team seekiram solve pannuvanga.`,
  );
}

function answerJobs(voice: Voice) {
  return t(voice, `Thanks for your interest in working with HIPA. Email your details and the kind of role you're looking for to ${EMAIL} and the team will get back to you if there is an opening.`, `HIPA-la work panna interest-ku nandri. Ungal details and edhu maadhiri role-nu ${EMAIL}-ku mail pannunga; opening irundha team reply pannuvanga.`);
}

function answerPayment(voice: Voice) {
  return t(voice, `The team confirms the payment method when you place the order on WhatsApp ${PHONE} or by email at ${EMAIL}, along with the delivery charge for your pin code.`, `Payment method order place pannum podhu team confirm pannuvanga: ${PHONE}-la WhatsApp illa ${EMAIL}-ku mail pannunga, delivery charge-um sollitu varanga.`);
}

function answerBlog(voice: Voice) {
  return t(voice, `Our spice guides (storage tips, how to choose sambar powder, reading a spice label and more) are at ${SITE}/blog`, `Spice guides (storage tips, sambar powder epdi select panradhu, label epdi padikkanum) inga irukku: ${SITE}/blog`);
}

function answerHuman(voice: Voice) {
  return t(voice, `Of course. The HIPA team is on ${PHONE} (call or WhatsApp) ${siteIdentity.openingHours.label}, or email ${EMAIL} any time and they'll reply when they're back.`, `Kandippa. HIPA team ${PHONE}-la (call or WhatsApp) ${siteIdentity.openingHours.label} irupanga; illa ${EMAIL}-ku eppo venaalum mail pannunga, thirumba vandhadhum reply pannuvanga.`);
}

function answerBotIdentity(voice: Voice) {
  return t(voice, `I'm the HIPA Masala website assistant. I can answer questions about our eight products, pack sizes, ingredients, how to use and store them, bulk supply, and how to reach the team. For anything I can't answer, ${PHONE} reaches a real person.`, `Naan HIPA Masala website assistant 😊 Products, pack sizes, ingredients, usage, storage, bulk supply, contact: ellam kekkalam. Naan solla mudiyadhadhuku ${PHONE}-la real person irupanga.`);
}

/* ----------------------------------------------------------------------------------------- */

/** Finds the most relevant site or product FAQ for a message by keyword overlap. */
export function findFaq(text: string, selected: Product[]): { question: string; answer: string } | null {
  const tokens = text.split(" ").filter((word) => word.length > 2 && !STOPWORDS.has(word));
  if (!tokens.length) return null;
  const pool = [
    ...faqs.map((faq) => ({ ...faq, weight: 1 })),
    ...(selected.length ? selected : products).flatMap((product) => product.faqs.map((faq) => ({ ...faq, weight: selected.length ? 1.2 : 1 }))),
  ];
  let best: { question: string; answer: string; score: number } | null = null;
  for (const faq of pool) {
    const haystack = normalise(`${faq.question} ${faq.answer}`);
    const questionText = normalise(faq.question);
    let score = 0;
    for (const token of tokens) {
      if (hasPhrase(questionText, token)) score += 2;
      else if (hasPhrase(haystack, token)) score += 1;
    }
    score *= faq.weight;
    if (score > (best?.score ?? 0)) best = { question: faq.question, answer: faq.answer, score };
  }
  return best && best.score >= 3 ? best : null;
}

function lastTurn(history: ChatTurn[], role: "user" | "assistant") {
  const turns = history.filter((turn) => (role === "user" ? turn.role === "user" : turn.role === "assistant" || turn.role === "model"));
  return turns[turns.length - 1]?.content ?? "";
}

/**
 * Accepts whatever the client sent as history and returns the clean earlier turns. The website
 * sends the conversation including the message being answered, so that trailing copy is dropped;
 * anything that is not a {role, content} pair is ignored rather than allowed to throw.
 */
export function previousTurns(history: unknown, message: string): ChatTurn[] {
  const turns = (Array.isArray(history) ? history : []).filter(
    (turn): turn is ChatTurn => Boolean(turn) && typeof turn === "object" && typeof (turn as ChatTurn).role === "string" && typeof (turn as ChatTurn).content === "string",
  );
  const last = turns[turns.length - 1];
  if (last && last.role === "user" && last.content.trim() === message.trim()) turns.pop();
  return turns;
}

const PRIORITY: Intent[] = ["complaint", "not_in_range", "bulk", "price", "buy", "delivery", "payment", "packs", "ingredients", "usage", "storage", "compare", "taste", "products", "quality", "about", "location", "hours", "contact", "human", "blog", "jobs", "bot_identity"];

/**
 * Answers a visitor message from local knowledge. `history` is the conversation so far
 * (oldest first, without the welcome message) and is used only to resolve short follow-ups.
 */
export function answerLocally(message: string, history: ChatTurn[] | unknown = []): string {
  const raw = (typeof message === "string" ? message : "").trim();
  const turns = previousTurns(history, raw);
  const voice: Voice = { tanglish: detectTanglish(raw) };
  if (!raw) return t(voice, "Ask me anything about HIPA Masala products, bulk supply or how to reach the team.", "HIPA Masala products, bulk supply, contact: edhu venum-naalum kelunga 😊");

  const text = normalise(raw);
  const seed = seedOf(text);
  let selected = detectProducts(text);
  const intents = detectIntents(text);
  const previousUser = normalise(lastTurn(turns, "user"));
  const previousAssistant = normalise(lastTurn(turns, "assistant"));

  // "Garam masala-la enna irukku?" asks what is inside a named product, not for the product list.
  if (selected.length && intents.has("products") && ["enna irukku", "enna iruku", "enna enna", "என்ன இருக்கு", "என்னென்ன"].some((cue) => hasPhrase(text, cue))) {
    intents.delete("products");
    intents.add("ingredients");
  }
  // A real product, an ingredient question or a cooking question wins over a look-alike we do not
  // make ("does sambar powder contain dal", "how much oil should I add").
  if (intents.has("not_in_range") && (selected.length || intents.has("ingredients") || intents.has("usage"))) intents.delete("not_in_range");

  // Pure small talk first, so "hi" never turns into a product pitch.
  const onlySmallTalk = (intent: Intent) => intents.has(intent) && !selected.length && Array.from(intents).every((item) => ["greeting", "how_are_you", "thanks", "bye", "bot_identity", "yes", "no", "human"].includes(item));
  if (onlySmallTalk("thanks")) return pick([t(voice, "Most welcome! Happy cooking with HIPA Masala 😊 Anything else, just ask.", "Most welcome! 😊 Happy cooking with HIPA Masala! Vera edhavadhu venum-na sollunga."), t(voice, "You're welcome! If anything else comes up, I'm right here.", "Paravaalla! 😊 Vera edhavadhu doubt-na kelunga.")], seed);
  if (onlySmallTalk("bye")) return t(voice, "Bye for now, and happy cooking! The team is on WhatsApp at " + PHONE + " whenever you need us.", "Seri, poitu vaanga! 😊 Happy cooking! WhatsApp " + PHONE + "-la eppo venaalum contact pannunga.");
  if (onlySmallTalk("how_are_you")) return t(voice, "Doing well, thank you for asking! How can I help you today: products, bulk supply, or how to reach the team?", "Nalla iruken 😄 Neenga epdi irukinga? Products, bulk supply, contact: enna help venum sollunga.");
  if (onlySmallTalk("bot_identity")) return answerBotIdentity(voice);
  if (onlySmallTalk("human")) return answerHuman(voice);
  if (onlySmallTalk("greeting")) {
    return pick(
      [
        t(voice, "Hello! Welcome to HIPA Masala 👋 Ask me about our spice powders, pack sizes, prices, bulk supply or how to reach the team.", "Vanakkam! HIPA Masala-ku welcome 👋 Products, pack sizes, price, bulk supply, contact: edhu venum-naalum kelunga."),
        t(voice, "Hi there 👋 I'm the HIPA Masala assistant. What would you like to know: products, ingredients, bulk orders or where to buy?", "Hi 👋 Naan HIPA Masala assistant. Products, ingredients, bulk orders, enga vaanganum: enna therinjikkanum?"),
      ],
      seed,
    );
  }
  if (/^(saptiya|saptingala|sapteengala|saapadu aacha|sapitiya)$/.test(text)) return "Naan website assistant 😄 sapda mudiyadhu! Neenga saptingala? HIPA Masala pathi edhavadhu kekkanuma?";

  // Short follow-ups: "yes", "sambar", "200g", "50kg" rely on the previous turn.
  if (!selected.length && (intents.has("yes") || intents.has("no")) && intents.size === 1) {
    if (intents.has("no")) return t(voice, "No problem. If anything else comes up, products, bulk supply or contact details, just ask.", "Seri, paravaalla 😊 Vera edhavadhu venum-na kelunga.");
    if (/quantity|kg|monthly|business|hotel|bulk/.test(previousAssistant)) return answerBulk([], voice, text);
    if (/which product|name a product|edha product|name one/.test(previousAssistant)) return answerProducts(voice);
    return t(voice, "Great. Tell me the product or the question and I'll take it from there.", "Super. Product illa question sollunga, continue pannalam.");
  }
  if (!selected.length && previousUser) {
    const previousProducts = detectProducts(previousUser);
    const assistantProducts = detectProducts(previousAssistant);
    // Only an answer that was about one product (it opens with the name) carries that product forward;
    // an answer that merely mentions a product as an example does not.
    const assistantLed = assistantProducts.length === 1 && previousAssistant.startsWith(normalise(assistantProducts[0].name));
    const contextProducts = previousProducts.length ? previousProducts : assistantLed ? assistantProducts : [];
    if (contextProducts.length && intents.size && !Array.from(intents).some((intent) => ["products", "about", "location", "contact", "hours", "greeting"].includes(intent))) selected = contextProducts;
  }
  if (selected.length && !intents.size && previousUser) {
    const previousIntents = detectIntents(previousUser);
    for (const intent of PRIORITY) if (previousIntents.has(intent) && !["complaint", "not_in_range", "products", "about", "contact", "location", "hours"].includes(intent)) intents.add(intent);
  }
  const quantity = text.match(/^(\d+(?:\.\d+)?)\s*(kg|kgs|kilo|kilos|ton|tons|tonne)$/);
  if (quantity && /quantity|kg|bulk|hotel|business|monthly/.test(previousAssistant)) return answerBulk(detectProducts(previousUser), voice, text);

  // A product with no particular question: a short overview.
  if (selected.length && !intents.size) {
    if (selected.length === 1) return productOverview(selected[0], voice);
    return selected.map((product) => `${product.name}: ${product.shortDescription} Packs: ${packList(product)}.`).join("\n\n") + `\n\n${t(voice, "Ask me about price, ingredients or usage for any of them.", "Price, ingredients, usage: edha pathi venum-naalum kelunga.")}`;
  }

  // Something we do not make, and no real product alongside it: say so and stop there.
  if (intents.has("not_in_range") && !selected.length) {
    return `${answerNotInRange(text, voice)}\n\n${t(voice, `For anything in the range, ask me or reach the team on ${PHONE}.`, `Range-la irukkura edhukkum ennai kelunga, illa ${PHONE}-la team-a contact pannunga.`)}`;
  }

  // Compose the answer from the intents that matter most (at most three sections).
  const ordered = PRIORITY.filter((intent) => intents.has(intent));
  const sections: string[] = [];
  const bulk = intents.has("bulk");
  for (const intent of ordered) {
    if (sections.length >= 3) break;
    switch (intent) {
      case "complaint":
        sections.push(answerComplaint(voice));
        break;
      case "not_in_range":
        sections.push(answerNotInRange(text, voice));
        break;
      case "bulk":
        sections.push(answerBulk(selected, voice, text));
        break;
      case "price":
        sections.push(answerPrice(selected, voice, bulk));
        break;
      case "buy":
        if (!bulk) sections.push(answerBuy(selected, voice));
        break;
      case "delivery":
        sections.push(answerDelivery(voice));
        break;
      case "payment":
        sections.push(answerPayment(voice));
        break;
      case "packs":
        if (!intents.has("price") || selected.length) sections.push(answerPacks(selected, voice));
        break;
      case "ingredients":
        sections.push(answerIngredients(selected, voice));
        break;
      case "usage":
        sections.push(answerUsage(selected, voice, text));
        break;
      case "storage":
        sections.push(answerStorage(selected, voice));
        break;
      case "compare":
        sections.push(answerCompare(selected, voice));
        break;
      case "taste":
        if (!intents.has("ingredients")) sections.push(answerTaste(selected, voice));
        break;
      case "products":
        if (!selected.length) sections.push(answerProducts(voice));
        else if (!sections.length) sections.push(selected.length === 1 ? productOverview(selected[0], voice) : answerPacks(selected, voice));
        break;
      case "quality":
        sections.push(answerQuality(voice));
        break;
      case "about":
        sections.push(answerAbout(voice));
        break;
      case "location":
        sections.push(answerLocation(voice));
        break;
      case "hours":
        sections.push(answerHours(voice));
        break;
      case "contact":
        if (!sections.some((section) => section.includes(WHATSAPP))) sections.push(answerContact(voice));
        break;
      case "human":
        sections.push(answerHuman(voice));
        break;
      case "blog":
        sections.push(answerBlog(voice));
        break;
      case "jobs":
        sections.push(answerJobs(voice));
        break;
      case "bot_identity":
        sections.push(answerBotIdentity(voice));
        break;
      default:
        break;
    }
  }
  if (sections.length) return Array.from(new Set(sections)).join("\n\n");

  // Nothing matched a known intent: try the FAQ library, then ask a focused question back.
  const faq = findFaq(text, selected);
  if (faq) return `${faq.answer}\n\n${t(voice, "Was that what you were after? Ask me anything else about HIPA Masala.", "Idhu dhaana kettinga? Vera edhavadhu venum-na kelunga.")}`;

  const topic = raw.length > 80 ? `${raw.slice(0, 77).trim()}…` : raw;
  return pick(
    [
      t(voice, `I want to get this right. You asked: "${topic}". I can help with our eight products (pack sizes, ingredients, usage, storage), prices and ordering, bulk supply for businesses, and the team's contact details. Which of those is closest, or rephrase in a few words?`, `Sariya purinjikkanum: neenga kettadhu "${topic}". Naan help panna mudiyum: 8 products (pack sizes, ingredients, usage, storage), price and ordering, business bulk supply, contact details. Idhula edhu? Illa konjam vera maadhiri kelunga.`),
      t(voice, `I'm not sure I followed "${topic}". Try something like "sambar powder price", "pack sizes", "bulk supply for my hotel" or "where are you located". A real person is also on WhatsApp at ${PHONE}.`, `"${topic}" sariya purila 😅 Ipdi try pannunga: "sambar powder price", "pack sizes", "hotel-ku bulk supply", "enga irukinga". Illa WhatsApp ${PHONE}-la team irukkanga.`),
    ],
    seed,
  );
}
