-- =========================================================================
-- MILAN INTERIO — FIRST-INSTALL DATABASE INITIALIZATION
-- =========================================================================
-- This is a first-install script intended for a fresh Supabase project.
-- It creates the complete database foundation in a single execution.
-- Do NOT assume this script is safely repeatable on an existing database.
-- Do NOT add destructive DROP TABLE ... CASCADE statements.
--
-- STORAGE NOTE:
-- The milan-assets bucket is public. Database RLS hides draft content from
-- public queries, but storage objects themselves are publicly accessible if
-- their URL is known. This is acceptable for portfolio imagery.
-- Do NOT introduce signed URL complexity unless technically necessary.
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- TABLE CREATION
-- -------------------------------------------------------------------------

-- Admin Users authorization table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'ADMIN' CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Site Settings (Singleton — enforced by UNIQUE singleton_key)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    singleton_key TEXT NOT NULL DEFAULT 'default' UNIQUE,
    brand_name TEXT NOT NULL DEFAULT 'MILAN INTERIO',
    primary_tagline TEXT NOT NULL DEFAULT 'LUXURY, DESIGNED AROUND YOU.',
    supporting_tagline TEXT NOT NULL DEFAULT 'Elevating Spaces. Defining Luxury.',
    design_philosophy TEXT NOT NULL DEFAULT 'Elegant. Functional. Timeless.',
    design_philosophy_explanation TEXT NOT NULL DEFAULT 'We believe luxury is not simply about expensive materials. True luxury comes from proportion, craftsmanship, material harmony, lighting, functionality, and attention to detail.',
    contact_email TEXT,
    contact_phone TEXT,
    office_address TEXT,
    instagram_url TEXT,
    linkedin_url TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- About Content (Singleton — enforced by UNIQUE singleton_key)
CREATE TABLE IF NOT EXISTS public.about_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    singleton_key TEXT NOT NULL DEFAULT 'default' UNIQUE,
    introduction TEXT,
    vision TEXT NOT NULL DEFAULT 'To become a trusted premium interior design and fit-out brand recognized for distinctive design, superior craftsmanship, and exceptional client experiences.',
    mission TEXT NOT NULL DEFAULT 'To create elegant and functional interiors that reflect individuality, enhance everyday experiences, and deliver lasting value.',
    design_philosophy TEXT NOT NULL DEFAULT 'Elegant. Functional. Timeless.',
    why_milan TEXT,
    quality_commitment TEXT NOT NULL DEFAULT 'Quality throughout the project lifecycle, including design, material selection, workmanship, installation, finishing and final inspection.',
    our_promise TEXT NOT NULL DEFAULT 'Your vision. Our design. Exceptional execution.',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Hero Content (Multi-row — supports multiple hero slides via is_active + display_order)
CREATE TABLE IF NOT EXISTS public.hero_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    eyebrow TEXT,
    heading TEXT NOT NULL DEFAULT 'LUXURY, DESIGNED AROUND YOU.',
    subheading TEXT DEFAULT 'Elevating Spaces. Defining Luxury.',
    background_image_url TEXT,
    primary_cta_label TEXT DEFAULT 'EXPLORE OUR WORK',
    primary_cta_url TEXT DEFAULT '/projects',
    secondary_cta_label TEXT DEFAULT 'START A PROJECT',
    secondary_cta_url TEXT DEFAULT '/contact',
    is_active BOOLEAN DEFAULT true NOT NULL,
    display_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Pillars of Milan Standard
CREATE TABLE IF NOT EXISTS public.pillars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pillar_number TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Services
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    display_order INT NOT NULL DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Service Detailed Items
CREATE TABLE IF NOT EXISTS public.service_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Process Steps
CREATE TABLE IF NOT EXISTS public.process_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    step_number TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Residential', 'Commercial', 'Hospitality', 'Office', 'Retail')),
    location TEXT,
    description TEXT NOT NULL,
    cover_image_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Project Images (Gallery)
CREATE TABLE IF NOT EXISTS public.project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Curated Material Library
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL CHECK (category IN ('Marble', 'Wood', 'Brass', 'Stone', 'Textiles', 'Glass')),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Studio Gallery (Visual Archive)
CREATE TABLE IF NOT EXISTS public.studio_gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    location TEXT,
    category TEXT CHECK (category IN ('Residential', 'Commercial', 'Hospitality', 'Office', 'Retail')),
    image_url TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Contact Inquiries
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    project_type TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- -------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- -------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_service_items_service_id ON public.service_items(service_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(is_published);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_studio_gallery_display ON public.studio_gallery(display_order);
CREATE INDEX IF NOT EXISTS idx_studio_gallery_published ON public.studio_gallery(is_published);

-- -------------------------------------------------------------------------
-- TRIGGER FOR UPDATED_AT COLUMNS
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_about_content_updated_at BEFORE UPDATE ON public.about_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_hero_content_updated_at BEFORE UPDATE ON public.hero_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -------------------------------------------------------------------------
-- ADMIN ACCESS CONTROL HELPERS (HARDENED SECURITY DEFINER)
-- -------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
        AND is_active = true
        AND role = 'SUPER_ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_catalog;

CREATE OR REPLACE FUNCTION public.is_admin_or_higher()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('SUPER_ADMIN', 'ADMIN')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_catalog;

CREATE OR REPLACE FUNCTION public.is_editor_or_higher()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_catalog;

-- -------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- -------------------------------------------------------------------------
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 1. Public Read-Only Policies (For site contents)
CREATE POLICY "Allow public read access to site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access to about_content" ON public.about_content FOR SELECT USING (true);
CREATE POLICY "Allow public read access to hero_content" ON public.hero_content FOR SELECT USING (true);
CREATE POLICY "Allow public read access to pillars" ON public.pillars FOR SELECT USING (true);
CREATE POLICY "Allow public read access to services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow public read access to service_items" ON public.service_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access to process_steps" ON public.process_steps FOR SELECT USING (true);
CREATE POLICY "Allow public read access to materials" ON public.materials FOR SELECT USING (true);

-- 2. Published-Only Public Read Policies (For projects and studio gallery)
CREATE POLICY "Allow public read access to published projects" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read access to published project_images" ON public.project_images FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.projects
        WHERE projects.id = project_images.project_id
        AND projects.is_published = true
    )
);
CREATE POLICY "Allow public read access to published studio_gallery" ON public.studio_gallery FOR SELECT USING (is_published = true);

-- 3. Inquiry submission policies (Insert-only for public, reading/updating is strictly blocked)
CREATE POLICY "Allow public write access to inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Deny public read access to inquiries" ON public.inquiries FOR SELECT TO public USING (false);

-- 4. Administrative Policies (Scoped by Role Hierarchy)
CREATE POLICY "Allow super_admin manage admin_users" ON public.admin_users FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "Allow admins view admin_users" ON public.admin_users FOR SELECT USING (public.is_admin_or_higher());

CREATE POLICY "Allow admin manage site_settings" ON public.site_settings FOR ALL USING (public.is_admin_or_higher()) WITH CHECK (public.is_admin_or_higher());
CREATE POLICY "Allow admin manage inquiries" ON public.inquiries FOR ALL USING (public.is_admin_or_higher()) WITH CHECK (public.is_admin_or_higher());

CREATE POLICY "Allow editor manage about_content" ON public.about_content FOR ALL USING (public.is_editor_or_higher()) WITH CHECK (public.is_editor_or_higher());
CREATE POLICY "Allow editor manage hero_content" ON public.hero_content FOR ALL USING (public.is_editor_or_higher()) WITH CHECK (public.is_editor_or_higher());
CREATE POLICY "Allow editor manage pillars" ON public.pillars FOR ALL USING (public.is_editor_or_higher()) WITH CHECK (public.is_editor_or_higher());
CREATE POLICY "Allow editor manage services" ON public.services FOR ALL USING (public.is_editor_or_higher()) WITH CHECK (public.is_editor_or_higher());
CREATE POLICY "Allow editor manage service_items" ON public.service_items FOR ALL USING (public.is_editor_or_higher()) WITH CHECK (public.is_editor_or_higher());
CREATE POLICY "Allow editor manage process_steps" ON public.process_steps FOR ALL USING (public.is_editor_or_higher()) WITH CHECK (public.is_editor_or_higher());
CREATE POLICY "Allow editor manage projects" ON public.projects FOR ALL USING (public.is_editor_or_higher()) WITH CHECK (public.is_editor_or_higher());
CREATE POLICY "Allow editor manage project_images" ON public.project_images FOR ALL USING (public.is_editor_or_higher()) WITH CHECK (public.is_editor_or_higher());
CREATE POLICY "Allow editor manage materials" ON public.materials FOR ALL USING (public.is_editor_or_higher()) WITH CHECK (public.is_editor_or_higher());
CREATE POLICY "Allow editor manage studio_gallery" ON public.studio_gallery FOR ALL USING (public.is_editor_or_higher()) WITH CHECK (public.is_editor_or_higher());

-- -------------------------------------------------------------------------
-- STORAGE SYSTEM BUCKET CONFIGURATION
-- -------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('milan-assets', 'milan-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies (separate INSERT/UPDATE/DELETE with explicit WITH CHECK)
CREATE POLICY "Allow public read access to storage objects" ON storage.objects FOR SELECT USING (bucket_id = 'milan-assets');
CREATE POLICY "Allow editor insert storage objects" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'milan-assets' AND public.is_editor_or_higher());
CREATE POLICY "Allow editor update storage objects" ON storage.objects FOR UPDATE USING (bucket_id = 'milan-assets' AND public.is_editor_or_higher()) WITH CHECK (bucket_id = 'milan-assets' AND public.is_editor_or_higher());
CREATE POLICY "Allow editor delete storage objects" ON storage.objects FOR DELETE USING (bucket_id = 'milan-assets' AND public.is_editor_or_higher());

-- -------------------------------------------------------------------------
-- SEED DATA (AUTHORITATIVE COMPANY CONTENT ONLY — NO INVENTED DATA)
-- -------------------------------------------------------------------------

-- 1. Site Settings
INSERT INTO public.site_settings (
    singleton_key,
    brand_name,
    primary_tagline,
    supporting_tagline,
    design_philosophy,
    design_philosophy_explanation,
    contact_email, contact_phone, office_address,
    instagram_url, linkedin_url, logo_url
) VALUES (
    'default',
    'MILAN INTERIO',
    'LUXURY, DESIGNED AROUND YOU.',
    'Elevating Spaces. Defining Luxury.',
    'Elegant. Functional. Timeless.',
    'We believe luxury is not simply about expensive materials. True luxury comes from proportion, craftsmanship, material harmony, lighting, functionality, and attention to detail.',
    NULL, NULL, NULL,
    NULL, NULL, NULL
);

-- 2. About Content
INSERT INTO public.about_content (
    singleton_key,
    introduction,
    vision,
    mission,
    design_philosophy,
    why_milan,
    quality_commitment,
    our_promise
) VALUES (
    'default',
    'Premium interior design and fit-out.',
    'To become a trusted premium interior design and fit-out brand recognized for distinctive design, superior craftsmanship, and exceptional client experiences.',
    'To create elegant and functional interiors that reflect individuality, enhance everyday experiences, and deliver lasting value.',
    'Elegant. Functional. Timeless.',
    'Design Excellence' || chr(10) ||
    'Attention to Detail' || chr(10) ||
    'Quality Craftsmanship' || chr(10) ||
    'Personalized Solutions' || chr(10) ||
    'Integrated Execution' || chr(10) ||
    'Premium Experience',
    'Quality throughout the project lifecycle, including design, material selection, workmanship, installation, finishing and final inspection.',
    'Your vision. Our design. Exceptional execution.'
);

-- 3. Hero Content
INSERT INTO public.hero_content (
    eyebrow, heading, subheading, background_image_url,
    primary_cta_label, primary_cta_url,
    secondary_cta_label, secondary_cta_url,
    is_active, display_order
) VALUES (
    'Interior Design | Fit-Out | Custom Joinery | Furniture',
    'LUXURY, DESIGNED AROUND YOU.',
    'Elevating Spaces. Defining Luxury.',
    NULL,
    'EXPLORE OUR WORK', '/projects',
    'START A PROJECT', '/contact',
    true, 1
);

-- 4. Pillars of Milan Standard
INSERT INTO public.pillars (pillar_number, title, description) VALUES
('01', 'PROPORTION', NULL),
('02', 'MATERIAL', NULL),
('03', 'CRAFT', NULL),
('04', 'DETAIL', NULL);

-- 5. Services (with exact supplied descriptions)
INSERT INTO public.services (slug, title, description, display_order, image_url) VALUES
('interior-design-space-planning', 'Interior Design & Space Planning', 'Complete interior design solutions tailored to the architecture, lifestyle, and requirements of each project.', 1, NULL),
('luxury-residential-interiors', 'Luxury Residential Interiors', 'We create refined residential environments designed around the client''s lifestyle.', 2, NULL),
('commercial-office-interiors', 'Commercial & Office Interiors', 'Professional environments that combine functionality, corporate identity, comfort, and contemporary design.', 3, NULL),
('turnkey-interior-fit-out', 'Turnkey Interior Fit-Out', 'Complete execution from approved design through final handover.', 4, NULL),
('custom-furniture-joinery', 'Custom Furniture & Joinery', 'Bespoke furniture and architectural joinery designed specifically for each space.', 5, NULL),
('kitchen-wardrobe-design', 'Kitchen & Wardrobe Design', 'Functional storage solutions combining aesthetics, ergonomics, and premium materials.', 6, NULL),
('3d-visualization', '3D Visualization', 'High-quality 3D visualization enables clients to understand the proposed space before execution.', 7, NULL);

-- 6. Service Detailed Items
WITH service_ids AS (SELECT id, slug FROM public.services)
INSERT INTO public.service_items (service_id, title, display_order) VALUES
-- 01 Interior Design & Space Planning
((SELECT id FROM service_ids WHERE slug = 'interior-design-space-planning'), 'Concept development', 1),
((SELECT id FROM service_ids WHERE slug = 'interior-design-space-planning'), 'Space planning', 2),
((SELECT id FROM service_ids WHERE slug = 'interior-design-space-planning'), 'Furniture layouts', 3),
((SELECT id FROM service_ids WHERE slug = 'interior-design-space-planning'), 'Material selection', 4),
((SELECT id FROM service_ids WHERE slug = 'interior-design-space-planning'), 'Colour schemes', 5),
((SELECT id FROM service_ids WHERE slug = 'interior-design-space-planning'), 'Lighting concepts', 6),
((SELECT id FROM service_ids WHERE slug = 'interior-design-space-planning'), 'Interior detailing', 7),
((SELECT id FROM service_ids WHERE slug = 'interior-design-space-planning'), '3D visualization', 8),
((SELECT id FROM service_ids WHERE slug = 'interior-design-space-planning'), 'Design development', 9),
-- 02 Luxury Residential Interiors
((SELECT id FROM service_ids WHERE slug = 'luxury-residential-interiors'), 'Luxury villas', 1),
((SELECT id FROM service_ids WHERE slug = 'luxury-residential-interiors'), 'Apartments', 2),
((SELECT id FROM service_ids WHERE slug = 'luxury-residential-interiors'), 'Living rooms', 3),
((SELECT id FROM service_ids WHERE slug = 'luxury-residential-interiors'), 'Bedrooms', 4),
((SELECT id FROM service_ids WHERE slug = 'luxury-residential-interiors'), 'Dining areas', 5),
((SELECT id FROM service_ids WHERE slug = 'luxury-residential-interiors'), 'Majlis', 6),
((SELECT id FROM service_ids WHERE slug = 'luxury-residential-interiors'), 'Kitchens', 7),
((SELECT id FROM service_ids WHERE slug = 'luxury-residential-interiors'), 'Walk-in wardrobes', 8),
((SELECT id FROM service_ids WHERE slug = 'luxury-residential-interiors'), 'Home offices', 9),
((SELECT id FROM service_ids WHERE slug = 'luxury-residential-interiors'), 'Entertainment spaces', 10),
-- 03 Commercial & Office Interiors
((SELECT id FROM service_ids WHERE slug = 'commercial-office-interiors'), 'Corporate offices', 1),
((SELECT id FROM service_ids WHERE slug = 'commercial-office-interiors'), 'Executive offices', 2),
((SELECT id FROM service_ids WHERE slug = 'commercial-office-interiors'), 'Reception areas', 3),
((SELECT id FROM service_ids WHERE slug = 'commercial-office-interiors'), 'Meeting rooms', 4),
((SELECT id FROM service_ids WHERE slug = 'commercial-office-interiors'), 'Boardrooms', 5),
((SELECT id FROM service_ids WHERE slug = 'commercial-office-interiors'), 'Showrooms', 6),
((SELECT id FROM service_ids WHERE slug = 'commercial-office-interiors'), 'Retail spaces', 7),
((SELECT id FROM service_ids WHERE slug = 'commercial-office-interiors'), 'Clinics', 8),
((SELECT id FROM service_ids WHERE slug = 'commercial-office-interiors'), 'Restaurants', 9),
((SELECT id FROM service_ids WHERE slug = 'commercial-office-interiors'), 'Commercial facilities', 10),
-- 04 Turnkey Interior Fit-Out
((SELECT id FROM service_ids WHERE slug = 'turnkey-interior-fit-out'), 'Civil works', 1),
((SELECT id FROM service_ids WHERE slug = 'turnkey-interior-fit-out'), 'Partition works', 2),
((SELECT id FROM service_ids WHERE slug = 'turnkey-interior-fit-out'), 'Gypsum ceilings', 3),
((SELECT id FROM service_ids WHERE slug = 'turnkey-interior-fit-out'), 'Flooring', 4),
((SELECT id FROM service_ids WHERE slug = 'turnkey-interior-fit-out'), 'Wall finishes', 5),
((SELECT id FROM service_ids WHERE slug = 'turnkey-interior-fit-out'), 'Painting', 6),
((SELECT id FROM service_ids WHERE slug = 'turnkey-interior-fit-out'), 'Decorative finishes', 7),
((SELECT id FROM service_ids WHERE slug = 'turnkey-interior-fit-out'), 'Electrical works', 8),
((SELECT id FROM service_ids WHERE slug = 'turnkey-interior-fit-out'), 'Lighting', 9),
((SELECT id FROM service_ids WHERE slug = 'turnkey-interior-fit-out'), 'Plumbing modifications', 10),
((SELECT id FROM service_ids WHERE slug = 'turnkey-interior-fit-out'), 'Joinery', 11),
((SELECT id FROM service_ids WHERE slug = 'turnkey-interior-fit-out'), 'Furniture installation', 12),
((SELECT id FROM service_ids WHERE slug = 'turnkey-interior-fit-out'), 'Final finishing', 13),
-- 05 Custom Furniture & Joinery
((SELECT id FROM service_ids WHERE slug = 'custom-furniture-joinery'), 'Custom wardrobes', 1),
((SELECT id FROM service_ids WHERE slug = 'custom-furniture-joinery'), 'Kitchens', 2),
((SELECT id FROM service_ids WHERE slug = 'custom-furniture-joinery'), 'TV units', 3),
((SELECT id FROM service_ids WHERE slug = 'custom-furniture-joinery'), 'Wall panels', 4),
((SELECT id FROM service_ids WHERE slug = 'custom-furniture-joinery'), 'Reception counters', 5),
((SELECT id FROM service_ids WHERE slug = 'custom-furniture-joinery'), 'Office furniture', 6),
((SELECT id FROM service_ids WHERE slug = 'custom-furniture-joinery'), 'Vanity units', 7),
((SELECT id FROM service_ids WHERE slug = 'custom-furniture-joinery'), 'Feature walls', 8),
((SELECT id FROM service_ids WHERE slug = 'custom-furniture-joinery'), 'Decorative joinery', 9),
((SELECT id FROM service_ids WHERE slug = 'custom-furniture-joinery'), 'Bespoke storage solutions', 10),
-- 07 3D Visualization
((SELECT id FROM service_ids WHERE slug = '3d-visualization'), 'Photorealistic interiors', 1),
((SELECT id FROM service_ids WHERE slug = '3d-visualization'), '3D walkthrough concepts', 2),
((SELECT id FROM service_ids WHERE slug = '3d-visualization'), 'Material visualization', 3),
((SELECT id FROM service_ids WHERE slug = '3d-visualization'), 'Furniture visualization', 4),
((SELECT id FROM service_ids WHERE slug = '3d-visualization'), 'Lighting concepts', 5);

-- 7. Process Steps
INSERT INTO public.process_steps (step_number, title, description) VALUES
('01', 'DISCOVER', 'We understand the client''s requirements, lifestyle, preferences, budget, and project objectives.'),
('02', 'CONCEPT', 'Our designers develop the creative direction, spatial concept, mood boards, materials, and design language.'),
('03', 'DEVELOP', 'The approved concept is developed into detailed layouts, elevations, material selections, furniture designs, and 3D visualizations.'),
('04', 'EXECUTE', 'Our project team coordinates the required trades, materials, workmanship, and installation.'),
('05', 'REFINE', 'Every detail is inspected and refined before final completion.'),
('06', 'HANDOVER', 'The completed space is professionally reviewed and handed over to the client.');

-- =========================================================================
-- ONE-TIME FIRST-ADMIN BOOTSTRAP (DO NOT COMMIT WITH A REAL UUID)
-- =========================================================================
-- 1. Create your first admin user via Supabase Auth (Dashboard > Authentication > Users > Add User).
-- 2. Copy that user's UUID from the auth.users table.
-- 3. Run this ONE TIME in the SQL Editor (replace the placeholder):
--
--    INSERT INTO public.admin_users (user_id, role)
--    VALUES ('<YOUR_REAL_AUTH_USER_UUID>', 'SUPER_ADMIN');
--
-- Do NOT commit this with a hardcoded UUID. Do NOT create fake users.
-- =========================================================================
