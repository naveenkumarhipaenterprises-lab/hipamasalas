// Vercel Serverless Function: /api/faqs (Zero-dependency Supabase REST API integration)

const FALLBACK_FAQS = [
  {
    id: "1",
    question: "Are HIPA Masala powders free from artificial colours and preservatives?",
    answer: "Yes. Every HIPA Masala blend is made from pure, handpicked spices with no artificial colours, fillers or preservatives — just traditional stone-ground preparation.",
    category: "quality",
    sort_order: 1,
    is_active: true
  },
  {
    id: "2",
    question: "What pack sizes are available?",
    answer: "Most products are available in 100g, 200g, 500g and 1kg packs. Bulk and custom pack sizes are available for distributors and wholesalers on request.",
    category: "products",
    sort_order: 2,
    is_active: true
  },
  {
    id: "3",
    question: "Do you supply to distributors, wholesalers and retailers?",
    answer: "Yes. We work with distributors, wholesalers, supermarkets and restaurants across India. Fill in the enquiry form or WhatsApp us for pricing and minimum order quantities.",
    category: "business",
    sort_order: 3,
    is_active: true
  },
  {
    id: "4",
    question: "How long do the masala powders stay fresh?",
    answer: "Stored in a cool, dry place in an airtight container, our masala powders stay fresh and aromatic for up to 6-9 months from the date of packing.",
    category: "storage",
    sort_order: 4,
    is_active: true
  },
  {
    id: "5",
    question: "Do you deliver across India?",
    answer: "Yes, we ship pan-India. For bulk and distributor orders, delivery timelines and logistics are confirmed after your enquiry is reviewed by our team.",
    category: "shipping",
    sort_order: 5,
    is_active: true
  },
  {
    id: "6",
    question: "Is there a minimum order quantity for bulk orders?",
    answer: "Bulk orders typically start from a minimum quantity that varies by product. Share your requirement over WhatsApp or the enquiry form and our team will confirm the MOQ and pricing.",
    category: "business",
    sort_order: 6,
    is_active: true
  }
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/faqs?is_active=eq.true&order=sort_order.asc`;
      const response = await fetch(endpoint, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return res.status(200).json({ success: true, data });
        }
      }
    } catch (err) {
      console.warn('Supabase FAQ fetch warning:', err.message);
    }
  }

  return res.status(200).json({ success: true, data: FALLBACK_FAQS });
};
