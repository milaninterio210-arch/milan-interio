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

-- Admin Users authorization table (Simplified active-admin model)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
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

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
        AND is_active = true
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

-- 4. Administrative Policies (Unified active-admin check)
CREATE POLICY "Allow admin manage site_settings" ON public.site_settings FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow admin manage inquiries" ON public.inquiries FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow admin manage about_content" ON public.about_content FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow admin manage hero_content" ON public.hero_content FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow admin manage pillars" ON public.pillars FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow admin manage services" ON public.services FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow admin manage service_items" ON public.service_items FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow admin manage process_steps" ON public.process_steps FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow admin manage projects" ON public.projects FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow admin manage project_images" ON public.project_images FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow admin manage materials" ON public.materials FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Allow admin manage studio_gallery" ON public.studio_gallery FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- -------------------------------------------------------------------------
-- STORAGE SYSTEM BUCKET CONFIGURATION
-- -------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('milan-assets', 'milan-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies (separate INSERT/UPDATE/DELETE with explicit WITH CHECK)
CREATE POLICY "Allow public read access to storage objects" ON storage.objects FOR SELECT USING (bucket_id = 'milan-assets');
CREATE POLICY "Allow admin insert storage objects" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'milan-assets' AND public.is_admin());
CREATE POLICY "Allow admin update storage objects" ON storage.objects FOR UPDATE USING (bucket_id = 'milan-assets' AND public.is_admin()) WITH CHECK (bucket_id = 'milan-assets' AND public.is_admin());
CREATE POLICY "Allow admin delete storage objects" ON storage.objects FOR DELETE USING (bucket_id = 'milan-assets' AND public.is_admin());

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
    'info@milaninterio.com', '+966 55 478 3438', 'Milan Interio, Dammam, KSA',
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

-- 5. Services (Official Client Services: Interior, Exterior, Landscape)
INSERT INTO public.services (slug, title, description, display_order, image_url) VALUES
('interior-design-space-planning', 'Interior Design & Space Planning', 'Milan Interio provides comprehensive interior design and space planning services focused on creating elegant, functional, and well-balanced environments. Our approach combines creative design, practical space utilization, premium materials, and attention to detail to develop interiors that reflect the client''s vision, lifestyle, and functional requirements.', 1, 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'),
('residential-interiors', 'Residential Interiors', 'Milan Interio delivers bespoke residential interior solutions designed to create sophisticated, comfortable, and highly functional living spaces. We transform villas, apartments, and homes through a carefully coordinated approach that combines contemporary design, premium materials, personalized detailing, and practical space utilization.', 2, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'),
('commercial-office-interiors', 'Commercial & Office Interiors', 'Milan Interio provides innovative and professional interior design solutions for commercial and corporate environments, creating spaces that combine functionality, efficiency, brand identity, and contemporary aesthetics.', 3, 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'),
('interior-fit-out', 'Interior Fit-Out', 'Milan Interio provides complete interior fit-out solutions, transforming design concepts into fully finished, functional, and visually refined spaces. Our turnkey approach integrates quality workmanship, premium materials, technical coordination, and detailed execution.', 4, 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80'),
('custom-furniture-joinery', 'Custom Furniture & Joinery', 'Milan Interio specializes in bespoke furniture and joinery solutions designed to complement the architectural character and interior aesthetics of each space. We combine refined design, quality materials, skilled craftsmanship, and functional detailing.', 5, 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80'),
('renovation-remodelling', 'Renovation & Remodelling', 'Milan Interio provides comprehensive renovation and remodelling solutions to transform existing spaces into modern, functional, and aesthetically refined environments. We carefully assess existing conditions and develop practical design solutions.', 6, 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=80'),
('project-management', 'Project Management', 'Milan Interio provides professional project management services to ensure the smooth, coordinated, and successful delivery of interior design and fit-out projects with strong focus on quality, schedule, and cost control.', 7, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80'),
('exterior-design-development', 'Exterior Design & Development', 'Milan Interio provides comprehensive exterior design solutions that enhance the architectural character, functionality, and overall visual appeal of residential and commercial properties through thoughtful design and premium finishes.', 8, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'),
('landscape-design-development', 'Landscape Design & Development', 'Milan Interio transforms outdoor areas into carefully planned and visually engaging environments, integrating architecture, greenery, hardscape elements, outdoor furniture, lighting, and functional circulation.', 9, 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=1200&q=80');

-- 6. Service Detailed Items
WITH service_ids AS (SELECT id, slug FROM public.services)
INSERT INTO public.service_items (service_id, title, display_order) VALUES
-- 1. Interior Design & Space Planning
((SELECT id FROM service_ids WHERE slug = 'interior-design-space-planning'), 'Concept Design & Mood Boards', 1),
((SELECT id FROM service_ids WHERE slug = 'interior-design-space-planning'), 'Space Planning & Layouts', 2),
((SELECT id FROM service_ids WHERE slug = 'interior-design-space-planning'), '3D Visualization & Photorealistic Rendering', 3),
((SELECT id FROM service_ids WHERE slug = 'interior-design-space-planning'), 'Material & Finish Selection', 4),
((SELECT id FROM service_ids WHERE slug = 'interior-design-space-planning'), 'Lighting & Furniture Planning', 5),

-- 2. Residential Interiors
((SELECT id FROM service_ids WHERE slug = 'residential-interiors'), 'Luxury Villas', 1),
((SELECT id FROM service_ids WHERE slug = 'residential-interiors'), 'Apartments & Penthouse Interiors', 2),
((SELECT id FROM service_ids WHERE slug = 'residential-interiors'), 'Living & Dining Areas', 3),
((SELECT id FROM service_ids WHERE slug = 'residential-interiors'), 'Bedrooms & Dressing Rooms', 4),
((SELECT id FROM service_ids WHERE slug = 'residential-interiors'), 'Kitchens & Bathrooms', 5),

-- 3. Commercial & Office Interiors
((SELECT id FROM service_ids WHERE slug = 'commercial-office-interiors'), 'Corporate Offices', 1),
((SELECT id FROM service_ids WHERE slug = 'commercial-office-interiors'), 'Retail & Showrooms', 2),
((SELECT id FROM service_ids WHERE slug = 'commercial-office-interiors'), 'Restaurants & Cafés', 3),
((SELECT id FROM service_ids WHERE slug = 'commercial-office-interiors'), 'Hospitality & Reception Areas', 4),
((SELECT id FROM service_ids WHERE slug = 'commercial-office-interiors'), 'Meeting & Conference Rooms', 5),

-- 4. Interior Fit-Out
((SELECT id FROM service_ids WHERE slug = 'interior-fit-out'), 'Complete Turnkey Fit-Out', 1),
((SELECT id FROM service_ids WHERE slug = 'interior-fit-out'), 'Gypsum & False Ceilings', 2),
((SELECT id FROM service_ids WHERE slug = 'interior-fit-out'), 'Flooring & Wall Finishes', 3),
((SELECT id FROM service_ids WHERE slug = 'interior-fit-out'), 'Painting & Decorative Finishes', 4),
((SELECT id FROM service_ids WHERE slug = 'interior-fit-out'), 'Glass & Aluminium Works', 5),
((SELECT id FROM service_ids WHERE slug = 'interior-fit-out'), 'Joinery & Carpentry', 6),
((SELECT id FROM service_ids WHERE slug = 'interior-fit-out'), 'Electrical & MEP Works', 7),

-- 5. Custom Furniture & Joinery
((SELECT id FROM service_ids WHERE slug = 'custom-furniture-joinery'), 'Bespoke Furniture', 1),
((SELECT id FROM service_ids WHERE slug = 'custom-furniture-joinery'), 'Modular Kitchens', 2),
((SELECT id FROM service_ids WHERE slug = 'custom-furniture-joinery'), 'Wardrobes & Walk-in Closets', 3),
((SELECT id FROM service_ids WHERE slug = 'custom-furniture-joinery'), 'TV Units & Feature Walls', 4),
((SELECT id FROM service_ids WHERE slug = 'custom-furniture-joinery'), 'Reception & Office Furniture', 5),

-- 6. Renovation & Remodelling
((SELECT id FROM service_ids WHERE slug = 'renovation-remodelling'), 'Villa Renovation', 1),
((SELECT id FROM service_ids WHERE slug = 'renovation-remodelling'), 'Office Renovation', 2),
((SELECT id FROM service_ids WHERE slug = 'renovation-remodelling'), 'Kitchen & Bathroom Remodelling', 3),
((SELECT id FROM service_ids WHERE slug = 'renovation-remodelling'), 'Space Upgrades', 4),
((SELECT id FROM service_ids WHERE slug = 'renovation-remodelling'), 'Existing Interior Modification', 5),

-- 7. Project Management
((SELECT id FROM service_ids WHERE slug = 'project-management'), 'Design Coordination', 1),
((SELECT id FROM service_ids WHERE slug = 'project-management'), 'Material Procurement', 2),
((SELECT id FROM service_ids WHERE slug = 'project-management'), 'Site Supervision', 3),
((SELECT id FROM service_ids WHERE slug = 'project-management'), 'Contractor Coordination', 4),
((SELECT id FROM service_ids WHERE slug = 'project-management'), 'Quality Control', 5),
((SELECT id FROM service_ids WHERE slug = 'project-management'), 'Handover & Final Inspection', 6),

-- 8. Exterior Design & Development
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Architectural Elevation Concepts', 1),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Façade Design & Development', 2),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Entrance & Main Gate Design', 3),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Boundary Wall & Gate Design', 4),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Outdoor Living Areas', 5),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Terrace & Balcony Design', 6),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Pergolas & Canopies', 7),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Outdoor Kitchens & Seating Areas', 8),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Swimming Pool Surroundings', 9),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Paving & External Flooring', 10),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Driveways & Parking Areas', 11),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Outdoor Lighting Concepts', 12),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Decorative Architectural Features', 13),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'External Cladding & Finishes', 14),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Material & Colour Coordination', 15),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), 'Exterior Renovation & Upgrading', 16),
((SELECT id FROM service_ids WHERE slug = 'exterior-design-development'), '3D Exterior Visualization', 17),

-- 9. Landscape Design & Development
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Landscape Concept Design', 1),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Garden & Green Area Planning', 2),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Softscape & Planting Design', 3),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Hardscape Design', 4),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Pathways & Walkways', 5),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Outdoor Seating Areas', 6),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Garden Features', 7),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Water Features & Fountains', 8),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Swimming Pool Landscape', 9),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Pergolas & Shaded Areas', 10),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Outdoor Kitchens & Entertainment Areas', 11),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Decorative Paving', 12),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Planters & Green Walls', 13),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Outdoor Lighting', 14),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Irrigation Coordination', 15),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Residential Villa Landscaping', 16),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Commercial & Hospitality Landscaping', 17),
((SELECT id FROM service_ids WHERE slug = 'landscape-design-development'), 'Landscape Renovation & Upgrading', 18);

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
--    INSERT INTO public.admin_users (user_id)
--    VALUES ('<YOUR_REAL_AUTH_USER_UUID>');
--
-- Do NOT commit this with a hardcoded UUID. Do NOT create fake users.
-- =========================================================================
