-- HIPA Masalas Database Schema for Supabase PostgreSQL

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  image_alt TEXT,
  category TEXT DEFAULT 'powders',
  features JSONB DEFAULT '[]'::jsonb,
  pack_sizes JSONB DEFAULT '["100g", "200g", "500g", "1kg"]'::jsonb,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'unavailable', 'draft')),
  availability_message TEXT DEFAULT 'Currently unavailable. Please contact us for enquiry.',
  is_featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name_snapshot TEXT NOT NULL,
  quantity TEXT,
  message TEXT,
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'converted', 'closed', 'spam')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Products: Public can read active non-deleted products
CREATE POLICY "Public read products" ON public.products
  FOR SELECT USING (is_deleted = false AND status != 'draft');

-- Products: Admin full access
CREATE POLICY "Admin write products" ON public.products
  FOR ALL USING (auth.role() = 'authenticated');

-- Enquiries: Public can insert new enquiries
CREATE POLICY "Public insert enquiries" ON public.enquiries
  FOR INSERT WITH CHECK (true);

-- Enquiries: Admin full access
CREATE POLICY "Admin manage enquiries" ON public.enquiries
  FOR ALL USING (auth.role() = 'authenticated');

-- FAQs: Public can read active FAQs
CREATE POLICY "Public read faqs" ON public.faqs
  FOR SELECT USING (is_active = true);

-- FAQs: Admin full access
CREATE POLICY "Admin write faqs" ON public.faqs
  FOR ALL USING (auth.role() = 'authenticated');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON public.faqs(is_active);
