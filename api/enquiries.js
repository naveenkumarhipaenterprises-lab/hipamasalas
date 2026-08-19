// Vercel Serverless Function: /api/enquiries

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { name, company_name, email, phone, location, product_name_snapshot, quantity, message } = req.body || {};

  // Server-side validation
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Full name is required (min 2 chars).' });
  }
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, error: 'A valid email address is required.' });
  }
  if (!phone || phone.trim().length < 7) {
    return res.status(400).json({ success: false, error: 'A valid phone number is required.' });
  }
  if (!product_name_snapshot) {
    return res.status(400).json({ success: false, error: 'Product name is required.' });
  }

  const record = {
    name: name.trim(),
    company_name: (company_name || '').trim(),
    email: email.trim(),
    phone: phone.trim(),
    location: (location || '').trim(),
    product_name_snapshot: product_name_snapshot.trim(),
    quantity: (quantity || '').trim(),
    message: (message || '').trim(),
    status: 'new',
    created_at: new Date().toISOString()
  };

  let savedId = null;

  // Insert to Supabase if configured
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      const { data, error } = await supabase.from('enquiries').insert([record]).select('id').single();
      if (!error && data) {
        savedId = data.id;
      }
    } catch (err) {
      console.error('Failed saving enquiry to Supabase:', err.message);
    }
  }

  // Optional: Send email via Resend if RESEND_API_KEY is configured
  if (process.env.RESEND_API_KEY) {
    try {
      const fetch = require('node-fetch');
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'HIPA Masalas Enquiry <enquiries@hipamasalas.com>',
          to: [process.env.ADMIN_EMAIL || 'info@hipamasalas.com'],
          subject: `New B2B Enquiry: ${record.product_name_snapshot} from ${record.name}`,
          html: `
            <h2>New Business Enquiry Received</h2>
            <p><strong>Product:</strong> ${record.product_name_snapshot}</p>
            <p><strong>Name:</strong> ${record.name}</p>
            <p><strong>Company:</strong> ${record.company_name || 'N/A'}</p>
            <p><strong>Phone:</strong> ${record.phone}</p>
            <p><strong>Email:</strong> ${record.email}</p>
            <p><strong>Location:</strong> ${record.location || 'N/A'}</p>
            <p><strong>Quantity:</strong> ${record.quantity || 'N/A'}</p>
            <p><strong>Message:</strong> ${record.message || 'N/A'}</p>
          `
        })
      });
    } catch (emailErr) {
      console.warn('Email dispatch warning:', emailErr.message);
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Enquiry submitted successfully. Our team will contact you shortly.',
    enquiry_id: savedId
  });
};
