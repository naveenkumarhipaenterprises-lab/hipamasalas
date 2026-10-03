// Copy for the commercial landing page that owns the "masala manufacturer in Chennai" query.
// Kept as data so the SSR head, structured data and the page component read one source.
export const MANUFACTURER_PAGE_PATH = "/masala-manufacturer-in-chennai";

export type ManufacturerPageSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  closing?: string[];
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
  metaDescription: "HIPA Masala manufactures spice powders and masala blends in Pallavaram, Chennai. FSSAI-licensed, 50g to 1kg packs, wholesale and B2B supply on enquiry.",
  h1: "Masala Manufacturer in Chennai",
  answerCapsule: "HIPA Masala, the brand of HIPA Enterprises, is a masala manufacturer in Chennai that mills single spice powders and slow-roasted masala blends in Zamin Pallavaram, Tamil Nadu. It makes eight products in 50g to 1kg packs for home cooks, supermarkets, restaurants, caterers, distributors and export buyers, under FSSAI licence 22426423000366.",
  sections: [
    {
      id: "what-we-make",
      heading: "Five single spice powders and three masala blends",
      paragraphs: [
        "HIPA Masala manufactures eight products: three traditional blends and five single-ingredient spice powders, all milled and packed in Zamin Pallavaram with a shelf life of 12 months from manufacture. Ingredients, pack sizes and specifications for each item are on the [HIPA product range](/products) page.",
      ],
      bullets: [
        "Sambar Powder and Rasam Powder: blends of coriander, red chilli, cumin, black pepper, toor dal, turmeric and asafoetida; sambar adds fenugreek and chana dal.",
        "Garam Masala: coriander, cumin, black pepper, cinnamon, cloves, cardamom, bay leaf, star anise, nutmeg and mace, used as a finishing spice.",
        "Turmeric, Red Chilli, Coriander and Cumin powders: single-ingredient, ground from cleaned whole rhizomes, chillies and seeds with no added fillers.",
        "Pepper Powder: medium-fine ground black pepper from sun-dried whole peppercorns.",
      ],
    },
    {
      id: "how-it-is-made",
      heading: "How HIPA masalas are made: low-temperature milling and slow-roasted blends",
      paragraphs: [
        "Whole spices are selected and cleaned before milling, and grinding is done at controlled low temperature so the volatile oils that carry aroma are not driven off by heat. For the blends, the whole spices, and in Sambar Powder and Rasam Powder the lentils too, are slow-roasted before grinding.",
        "No artificial colours, chemical preservatives or synthetic flavour enhancers go into any HIPA product. These are HIPA's stated practices, described further on the [About HIPA Masala](/about) page; buyers can raise sampling or evaluation in their enquiry.",
      ],
    },
    {
      id: "quality-and-licence",
      heading: "FSSAI licence, GST registration and stated process controls",
      paragraphs: [
        "HIPA Enterprises, the legal entity behind HIPA Masala, holds **FSSAI licence number 22426423000366** and is registered for GST under **GSTIN 33BVIPR5839J1Z1**. Both numbers are published here so trade buyers can check them against the public FSSAI and GST registers during vendor onboarding.",
        "As a spice manufacturer in Chennai, HIPA states that whole spices are selected, cleaned and milled at controlled low temperature, that blends are slow-roasted before grinding, and that no artificial colours, chemical preservatives or synthetic flavour enhancers are used. HIPA lists no certification beyond its FSSAI licence and GST registration; ask for any other documents you need in the enquiry.",
      ],
    },
    {
      id: "formats-and-moq",
      heading: "Pack sizes by product, and what is confirmed on enquiry",
      paragraphs: [
        "Retail pouches run from 50g to 1kg; 500g and 1kg are the bulk formats for commercial kitchens and trade. Retail pouches carry clear labelling and barcodes, and retailers and distributors can take them in master cartons. Not every product is made in every size, so quote product and size together:",
      ],
      bullets: [
        "100g, 200g, 500g and 1kg: Sambar Powder, Rasam Powder, Turmeric Powder, Red Chilli Powder and Coriander Powder.",
        "100g, 200g and 500g: Cumin Powder and Garam Masala.",
        "50g, 100g, 200g and 500g: Pepper Powder.",
      ],
      closing: [
        "Minimum order quantities, wholesale pricing and dispatch schedules are not published here. They depend on the products, sizes, volume and location in your enquiry and are **confirmed on enquiry**.",
      ],
    },
    {
      id: "delivery-area",
      heading: "Supply area: Chennai, Tamil Nadu, India and export enquiries",
      paragraphs: [
        "HIPA is based in Zamin Pallavaram in Chennai, between Pammal, Chromepet and Alandur, a short drive from Tambaram, Guindy and Velachery. Supply across Chennai, Tamil Nadu and the rest of India is arranged by enquiry, with logistics agreed order by order, and export enquiries are welcome. Delivery terms for any location are confirmed on enquiry, not promised on this page.",
      ],
      bullets: [
        "Chennai and Tamil Nadu: by enquiry.",
        "Rest of India: by enquiry, with logistics agreed per order.",
        "Export: enquiries welcome; state the destination market and any documentation you need.",
      ],
    },
    {
      id: "who-we-supply",
      heading: "Who HIPA supplies, and how to scope your requirement first",
      paragraphs: [
        "HIPA supplies home cooks through retail packs and food businesses through retail and bulk formats. Before contacting any masala supplier in Chennai, write a short requirement sheet: products by name, separating single spices from blends; who will use them (kitchen, shelf or route); pack size per product; and decision criteria such as flavour fit, labelling and replenishment.",
        "The label alone does not tell you who makes a product; the [manufacturer vs supplier vs distributor guide](/blog/masala-manufacturer-vs-supplier-vs-distributor) explains the three roles.",
      ],
      bullets: [
        "Supermarkets and grocers: labelled, barcoded retail pouches; review the range as a portfolio. See the [supermarket buyer guide](/blog/masala-supplier-for-supermarkets-in-chennai).",
        "Restaurants and cloud kitchens: start with the most-used blend, add single spices; 500g and 1kg packs keep recipes standardised.",
        "Caterers and commercial kitchens: 500g and 1kg packs for volume cooking; test flavour against planned menus before regular buying.",
        "Distributors and wholesalers: the full eight-product range in master cartons; confirm which formats each account type needs.",
        "Exporters: enquiries welcome; state destination market, pack sizes and any documentation you need in the first message.",
      ],
    },
    {
      id: "why-hipa",
      heading: "What buying direct from a Chennai manufacturer changes",
      paragraphs: [
        "For a business sourcing wholesale masala in Chennai, buying from HIPA means dealing with the company that mills, blends and packs the product, not an intermediary. Weigh the points below against your own samples and commercial checks.",
      ],
      bullets: [
        "Manufacturer, not trader: HIPA Enterprises makes every product sold under the HIPA Masala label.",
        "One range for the core South Indian kitchen: sambar and rasam blends, five everyday single spices and garam masala.",
        "Stated process: low-temperature milling, slow-roasted blends, no artificial colours, preservatives or flavour enhancers.",
        "Published licence details: FSSAI number and GSTIN on this page for vendor verification.",
        "Local address in Zamin Pallavaram, reachable Monday to Saturday, 9:00 am to 5:30 pm.",
      ],
    },
    {
      id: "how-to-enquire",
      heading: "How to send a trade enquiry and what to include",
      paragraphs: [
        "Send trade enquiries through the [B2B enquiry form](/b2b-enquiries), by phone or WhatsApp on +91 70580 53055, or by email to info@hipamasalas.com, Monday to Saturday, 9:00 am to 5:30 pm. General and retail questions can go through the [contact page](/contact).",
        "A complete first message saves a round of questions. Include:",
      ],
      bullets: [
        "Your business type: supermarket, grocer, restaurant, cloud kitchen, caterer, distributor, wholesaler or exporter.",
        "Products by name, with the pack size wanted for each.",
        "Estimated monthly volume per product, even if approximate.",
        "Delivery location, or the region you distribute to.",
        "Whether you want to evaluate product first, and any onboarding documents you need.",
      ],
      closing: [
        "Minimum order quantities, pricing and dispatch arrangements are confirmed in HIPA's reply.",
      ],
    },
  ],
  faqs: [
    { question: "Is HIPA Masala a manufacturer or a trader?", answer: "HIPA Masala is a manufacturer. The brand belongs to HIPA Enterprises, which selects, cleans, mills and packs its spice powders and blends in Zamin Pallavaram, Chennai. Products under the HIPA label are its own manufacture, so ingredient and process questions are answered by the business that makes them." },
    { question: "Which masala and spice products does HIPA manufacture?", answer: "Eight products: Sambar Powder, Rasam Powder and Garam Masala as blends, and Turmeric Powder, Red Chilli Powder, Coriander Powder, Cumin Powder and Pepper Powder as single spice powders. All are made without artificial colours, chemical preservatives or synthetic flavour enhancers." },
    { question: "What pack sizes and bulk formats are available?", answer: "Sambar, Rasam, Turmeric, Red Chilli and Coriander powders come in 100g, 200g, 500g and 1kg; Cumin Powder and Garam Masala in 100g, 200g and 500g; Pepper Powder in 50g, 100g, 200g and 500g. 500g and 1kg are the bulk formats. Minimum quantities are confirmed on enquiry." },
    { question: "Where does HIPA deliver?", answer: "HIPA is based in Zamin Pallavaram, Chennai. Supply to the rest of Chennai, Tamil Nadu and other Indian states is arranged by enquiry, with logistics agreed order by order, and export enquiries are welcome. Delivery terms for any location are confirmed on enquiry rather than promised on this page." },
    { question: "How do I get a quotation, and what should I include?", answer: "Use the B2B enquiry form, call or WhatsApp +91 70580 53055, or email info@hipamasalas.com, Monday to Saturday, 9:00 am to 5:30 pm. Include your business type, products and pack sizes, estimated monthly volume and delivery location. Pricing and minimum order quantities are confirmed in the reply." },
    { question: "What are HIPA's FSSAI and GST details?", answer: "HIPA Enterprises holds FSSAI licence number 22426423000366 and GSTIN 33BVIPR5839J1Z1. The business address is Plot No. 10, (Highway Colony), 5th Main Road, Zamin Pallavaram, Highway Nagar, Perumal Nagar, Old Pallavaram, Chennai – 600117, Tamil Nadu, India. Quote either number if your onboarding needs to verify the supplier." },
  ],
};
