// Vercel Serverless Function: /api/products

const FALLBACK_PRODUCTS = [
  {
    id: "1",
    name: "Sambar Powder",
    slug: "sambar-powder",
    short_description: "A perfectly balanced blend of roasted lentils and spices for that authentic South Indian sambar aroma.",
    description: "Handcrafted using traditional stone-ground techniques. Roasted lentils and whole aromatic spices combine to create an authentic, flavorful sambar experience.",
    image_url: "/images/products/Sambar-masala.png",
    image_alt: "Hipa Sambar Powder pack",
    category: "powders",
    features: ["Stone-ground freshness", "No artificial colour", "Balanced heat & aroma"],
    pack_sizes: ["100g", "200g", "500g", "1kg"],
    status: "available",
    availability_message: "Currently unavailable. Please contact us for enquiry.",
    is_featured: true,
    sort_order: 1,
    seo_title: "Sambar Powder | HIPA Masala — Taste of Tradition",
    seo_description: "Buy Sambar Powder from HIPA Masala — stone-ground, no artificial colours or preservatives."
  },
  {
    id: "2",
    name: "Rasam Powder",
    slug: "rasam-powder",
    short_description: "Tangy, aromatic rasam powder crafted the traditional way for a comforting South Indian classic.",
    description: "Made with roasted coriander, cumin, pepper, and regional herbs for a warming, digestive rasam.",
    image_url: "/images/products/Rasam-masala-h.png",
    image_alt: "Hipa Rasam Powder pack",
    category: "powders",
    features: ["Traditional roasted spice mix", "Rich, tangy aroma", "Perfect everyday flavour"],
    pack_sizes: ["100g", "200g", "500g", "1kg"],
    status: "available",
    availability_message: "Currently unavailable. Please contact us for enquiry.",
    is_featured: true,
    sort_order: 2,
    seo_title: "Rasam Powder | HIPA Masala — Taste of Tradition",
    seo_description: "Buy Rasam Powder from HIPA Masala — stone-ground, traditional roasted spice blend."
  },
  {
    id: "3",
    name: "Turmeric Powder",
    slug: "turmeric-powder",
    short_description: "Pure, high-curcumin turmeric powder with rich golden colour and earthy aroma.",
    description: "Sourced from prime turmeric roots, sun-dried and ground to preserve natural curcumin potency and vibrant color.",
    image_url: "/images/products/Turmeric-Powder-h.png",
    image_alt: "Hipa Turmeric Powder pack",
    category: "powders",
    features: ["High curcumin content", "No polishing agents", "Naturally earthy aroma"],
    pack_sizes: ["100g", "200g", "500g", "1kg"],
    status: "available",
    availability_message: "Currently unavailable. Please contact us for enquiry.",
    is_featured: true,
    sort_order: 3,
    seo_title: "Turmeric Powder | HIPA Masala — Taste of Tradition",
    seo_description: "Pure high-curcumin Turmeric Powder by HIPA Masala. 100% natural, no additives."
  },
  {
    id: "4",
    name: "Red Chilli Powder",
    slug: "red-chilli-powder",
    short_description: "Vibrant, deep-red chilli powder ground from handpicked chillies for natural colour and controlled heat.",
    description: "Finely ground from selected red chillies without artificial dyes or oils. Delivers rich color and authentic heat.",
    image_url: "/images/products/Redchilli-powder.png",
    image_alt: "Hipa Red Chilli Powder pack",
    category: "powders",
    features: ["Natural colour, no dye", "Balanced spice level", "Stone-ground texture"],
    pack_sizes: ["100g", "200g", "500g", "1kg"],
    status: "available",
    availability_message: "Currently unavailable. Please contact us for enquiry.",
    is_featured: false,
    sort_order: 4,
    seo_title: "Red Chilli Powder | HIPA Masala — Taste of Tradition",
    seo_description: "Vibrant Red Chilli Powder ground from handpicked chillies by HIPA Masala."
  },
  {
    id: "5",
    name: "Coriander Powder",
    slug: "coriander-powder",
    short_description: "Freshly ground coriander seeds with a naturally sweet, earthy aroma for everyday cooking.",
    description: "Slow-milled from premium coriander seeds to retain natural essential oils and fresh citrusy-earthy aroma.",
    image_url: "/images/products/Corainder-powder-h.png",
    image_alt: "Hipa Coriander Powder pack",
    category: "powders",
    features: ["100% pure coriander", "No fillers or additives", "Locks in natural oils"],
    pack_sizes: ["100g", "200g", "500g", "1kg"],
    status: "available",
    availability_message: "Currently unavailable. Please contact us for enquiry.",
    is_featured: false,
    sort_order: 5,
    seo_title: "Coriander Powder | HIPA Masala — Taste of Tradition",
    seo_description: "Freshly ground Coriander Powder by HIPA Masala with natural sweet and earthy aroma."
  },
  {
    id: "6",
    name: "Cumin Powder",
    slug: "cumin-powder",
    short_description: "Roasted cumin seeds ground fresh for a warm, nutty flavour in every dish.",
    description: "Cleaned cumin seeds gently roasted before grinding to unlock maximum warm essential oils.",
    image_url: "/images/products/Cumin-powder-h.png",
    image_alt: "Hipa Cumin Powder pack",
    category: "powders",
    features: ["Slow-roasted for aroma", "No preservatives", "Fine, even texture"],
    pack_sizes: ["100g", "200g", "500g"],
    status: "available",
    availability_message: "Currently unavailable. Please contact us for enquiry.",
    is_featured: false,
    sort_order: 6,
    seo_title: "Cumin Powder | HIPA Masala — Taste of Tradition",
    seo_description: "Roasted Cumin Powder ground fresh for a warm, nutty flavor by HIPA Masala."
  },
  {
    id: "7",
    name: "Pepper Powder",
    slug: "pepper-powder",
    short_description: "Sun-dried black pepper, freshly ground to retain its sharp aroma and natural pungency.",
    description: "Single-origin black peppercorns coarse-ground for bold heat and aromatic spice.",
    image_url: "/images/products/pepper-powderr-h.png",
    image_alt: "Hipa Pepper Powder pack",
    category: "powders",
    features: ["Single-origin pepper", "Freshly milled", "Strong natural aroma"],
    pack_sizes: ["50g", "100g", "200g", "500g"],
    status: "available",
    availability_message: "Currently unavailable. Please contact us for enquiry.",
    is_featured: false,
    sort_order: 7,
    seo_title: "Pepper Powder | HIPA Masala — Taste of Tradition",
    seo_description: "Sun-dried black Pepper Powder freshly ground by HIPA Masala."
  },
  {
    id: "8",
    name: "Garam Masala",
    slug: "garam-masala",
    short_description: "A festive blend of whole spices, roasted and ground in small batches for a rich, warming aroma.",
    description: "A master blend of cardamom, cinnamon, cloves, star anise, and whole spices for rich gravies and curries.",
    image_url: "/images/products/Garam-Masala-h.png",
    image_alt: "Hipa Garam Masala pack",
    category: "powders",
    features: ["12+ whole spices", "Small-batch roasted", "No artificial flavouring"],
    pack_sizes: ["100g", "200g", "500g"],
    status: "available",
    availability_message: "Currently unavailable. Please contact us for enquiry.",
    is_featured: true,
    sort_order: 8,
    seo_title: "Garam Masala | HIPA Masala — Taste of Tradition",
    seo_description: "Festive small-batch Garam Masala crafted from 12+ whole roasted spices by HIPA Masala."
  }
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { slug } = req.query;

  // Use Supabase if configured
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    try {
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

      let query = supabase.from('products').select('*').eq('is_deleted', false).order('sort_order', { ascending: true });
      if (slug) {
        query = query.eq('slug', slug).single();
      }

      const { data, error } = await query;
      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        return res.status(200).json({ success: true, data });
      }
    } catch (err) {
      console.warn('Supabase fetch failed, fallback to local dataset:', err.message);
    }
  }

  // Fallback to in-memory product list
  if (slug) {
    const p = FALLBACK_PRODUCTS.find(item => item.slug === slug);
    if (!p) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    return res.status(200).json({ success: true, data: p });
  }

  return res.status(200).json({ success: true, data: FALLBACK_PRODUCTS });
};
