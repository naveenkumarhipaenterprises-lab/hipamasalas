// Copy for the commercial landing page that owns the "masala manufacturer in Chennai" query.
// Kept as data so the SSR head, structured data and the page component read one source.
export const MANUFACTURER_PAGE_PATH = "/masala-manufacturer-in-chennai";

export type ManufacturerPageSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ManufacturerPageContent = {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  answerCapsule: string;
  sections: ManufacturerPageSection[];
  faqs: Array<{ question: string; answer: string }>;
};

export const manufacturerPage: ManufacturerPageContent = {
  metaTitle: "Masala Manufacturer in Chennai | Wholesale Supply | HIPA Masala",
  metaDescription: "HIPA Masala manufactures sambar, rasam and single-spice powders in Zamin Pallavaram, Chennai. FSSAI-licensed supply for supermarkets, restaurants and distributors.",
  h1: "Masala Manufacturer in Chennai",
  answerCapsule: "PLACEHOLDER",
  sections: [],
  faqs: [],
};
