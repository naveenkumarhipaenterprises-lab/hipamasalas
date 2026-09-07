// HIPA Masalas — Knowledge Base Data
// This structured knowledge object is injected into the Gemini API prompt.

export const HIPA_KNOWLEDGE_BASE = {
  brand: {
    name: "HIPA Masalas",
    tagline: "Taste of Tradition",
    location: "Chennai, Tamil Nadu, India",
    phone: "+91 70580 53055",
    whatsapp: "+91 70580 53055",
    email: "info@hipamasalas.com",
    website: "https://www.hipamasalas.com/",
    description: "Authentic South Indian spice powders and masalas prepared with premium traditional recipes in Chennai, Tamil Nadu."
  },
  products: [
    {
      id: "sambar-powder",
      name: "HIPA Sambar Powder",
      tamilName: "சாம்பார் பொடி",
      description: "Authentic South Indian sambar blend made with handpicked coriander, chilli, cumin, fenugreek, and traditional spices.",
      bestFor: "Everyday South Indian Sambar for rice, tiffin (idli/dosa), and vada."
    },
    {
      id: "rasam-powder",
      name: "HIPA Rasam Powder",
      tamilName: "ரசம் பொடி",
      description: "Aromatic and soothing Rasam spice mix rich in pepper, cumin, coriander, and asafoetida.",
      bestFor: "Traditional Poondu Rasam, Tomato Rasam, Pepper Rasam, and Tamarind Rasam."
    },
    {
      id: "garam-masala",
      name: "HIPA Garam Masala",
      tamilName: "கரம் மசாலா",
      description: "Rich, warm aromatic spice blend crafted with cinnamon, cardamom, cloves, star anise, and mace.",
      bestFor: "Biryani, kurma, gravies, non-veg curries, paneer dishes, and veg salna."
    },
    {
      id: "turmeric-powder",
      name: "HIPA Turmeric Powder",
      tamilName: "மஞ்சள் தூள்",
      description: "Pure, vibrant yellow turmeric powder rich in natural curcumin and aroma.",
      bestFor: "Daily cooking, tempering, marination, health drinks, and lentils."
    },
    {
      id: "red-chilli-powder",
      name: "HIPA Red Chilli Powder",
      tamilName: "மிளகாய் தூள்",
      description: "Bold, spicy red chilli powder providing natural rich red color and balanced heat.",
      bestFor: "Gravies, curries, spicy tiffins, marination, and chutneys."
    },
    {
      id: "thaniya-powder",
      name: "HIPA Thaniya (Coriander) Powder",
      tamilName: "கொத்தமல்லி / தனியா தூள்",
      description: "Fragrant coriander powder roasted and ground for rich body and gravy thickness.",
      bestFor: "Thick South Indian curries, veg gravies, dal, and kootu."
    },
    {
      id: "seeragam-powder",
      name: "HIPA Seeragam (Cumin) Powder",
      tamilName: "சீரகத் தூள்",
      description: "Earthy, aromatic cumin powder aiding digestion and rich flavor.",
      bestFor: "Rasam, buttermilk, stir-fries, poriyal, soups, and gravies."
    },
    {
      id: "pepper-powder",
      name: "HIPA Pepper Powder",
      tamilName: "மிளகு தூள்",
      description: "Freshly ground black pepper powder with intense warmth and medicinal goodness.",
      bestFor: "Pepper rasam, pepper chicken, omelettes, soups, and vada."
    },
    {
      id: "garlic-podi",
      name: "HIPA Garlic Podi",
      tamilName: "பூண்டு பொடி",
      description: "Flavorful roasted garlic spice powder blended with roasted lentils and spices.",
      bestFor: "Hot rice with ghee/sesame oil, idli, dosa, and tiffin seasoning."
    },
    {
      id: "paruppu-podi",
      name: "HIPA Paruppu Podi",
      tamilName: "பருப்பு பொடி",
      description: "Traditional roasted lentil spice powder packed with protein and comforting taste.",
      bestFor: "Hot steaming rice with a dollop of ghee."
    }
  ],
  b2b: {
    targetCustomers: ["Hotels", "Restaurants", "Caterers", "Commercial Kitchens", "Wholesalers", "Distributors", "Exporters"],
    services: "Custom bulk packaging, wholesale pricing, consistent batch quality, and direct delivery across Tamil Nadu and India.",
    contactProcess: "Share business name, location, required product, and approximate monthly quantity (e.g. 50 kg) to get a direct quote from the HIPA team."
  },
  ordering: {
    online: "Direct order via official website (https://www.hipamasalas.com/).",
    direct: "Call or WhatsApp +91 70580 53055 or email info@hipamasalas.com."
  }
};
