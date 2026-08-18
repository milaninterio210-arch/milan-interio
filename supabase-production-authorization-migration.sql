-- =========================================================================
-- MILAN INTERIO — PRODUCTION DATABASE AUTHORIZATION MIGRATION
-- =========================================================================
-- This script migrates the live database from the legacy RBAC hierarchy
-- to the single active-admin model (public.is_admin() + is_active).
-- 
-- DO NOT USE CASCADE. Each drop is explicit and dependency-safe.
-- =========================================================================

BEGIN;

-- -------------------------------------------------------------------------
-- STEP 1: Verify / create the canonical public.is_admin() model
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
-- STEP 2: Recreate administrative policies to use public.is_admin()
-- -------------------------------------------------------------------------

-- 2.1 admin_users (Drop verified legacy policies, create self-select status check)
DROP POLICY IF EXISTS "Allow admins view admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow super_admin manage admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow users to read their own admin status" ON public.admin_users;

CREATE POLICY "Allow users to read their own admin status" ON public.admin_users
FOR SELECT USING (auth.uid() = user_id);

-- 2.2 site_settings (Drop/recreate verified "Allow admin manage site_settings")
DROP POLICY IF EXISTS "Allow admin manage site_settings" ON public.site_settings;
CREATE POLICY "Allow admin manage site_settings" ON public.site_settings 
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 2.3 about_content (Allow editor manage about_content)
DROP POLICY IF EXISTS "Allow editor manage about_content" ON public.about_content;
CREATE POLICY "Allow editor manage about_content" ON public.about_content 
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 2.4 hero_content (Allow editor manage hero_content)
DROP POLICY IF EXISTS "Allow editor manage hero_content" ON public.hero_content;
CREATE POLICY "Allow editor manage hero_content" ON public.hero_content 
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 2.5 pillars (Allow editor manage pillars)
DROP POLICY IF EXISTS "Allow editor manage pillars" ON public.pillars;
CREATE POLICY "Allow editor manage pillars" ON public.pillars 
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 2.6 services (Allow editor manage services)
DROP POLICY IF EXISTS "Allow editor manage services" ON public.services;
CREATE POLICY "Allow editor manage services" ON public.services 
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 2.7 service_items (Allow editor manage service_items)
DROP POLICY IF EXISTS "Allow editor manage service_items" ON public.service_items;
CREATE POLICY "Allow editor manage service_items" ON public.service_items 
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 2.8 process_steps (Allow editor manage process_steps)
DROP POLICY IF EXISTS "Allow editor manage process_steps" ON public.process_steps;
CREATE POLICY "Allow editor manage process_steps" ON public.process_steps 
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 2.9 projects (Allow editor manage projects)
DROP POLICY IF EXISTS "Allow editor manage projects" ON public.projects;
CREATE POLICY "Allow editor manage projects" ON public.projects 
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 2.10 project_images (Allow editor manage project_images)
DROP POLICY IF EXISTS "Allow editor manage project_images" ON public.project_images;
CREATE POLICY "Allow editor manage project_images" ON public.project_images 
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 2.11 materials (Allow editor manage materials)
DROP POLICY IF EXISTS "Allow editor manage materials" ON public.materials;
CREATE POLICY "Allow editor manage materials" ON public.materials 
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 2.12 studio_gallery (Allow editor manage studio_gallery)
DROP POLICY IF EXISTS "Allow editor manage studio_gallery" ON public.studio_gallery;
CREATE POLICY "Allow editor manage studio_gallery" ON public.studio_gallery 
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 2.13 inquiries (Drop/recreate verified "Allow admin manage inquiries")
DROP POLICY IF EXISTS "Allow admin manage inquiries" ON public.inquiries;
CREATE POLICY "Allow admin manage inquiries" ON public.inquiries 
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- -------------------------------------------------------------------------
-- STEP 3: Recreate storage policies for milan-assets to use public.is_admin()
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow editor insert storage objects" ON storage.objects;
CREATE POLICY "Allow editor insert storage objects" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'milan-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Allow editor update storage objects" ON storage.objects;
CREATE POLICY "Allow editor update storage objects" ON storage.objects 
FOR UPDATE USING (bucket_id = 'milan-assets' AND public.is_admin()) 
WITH CHECK (bucket_id = 'milan-assets' AND public.is_admin());

DROP POLICY IF EXISTS "Allow editor delete storage objects" ON storage.objects;
CREATE POLICY "Allow editor delete storage objects" ON storage.objects 
FOR DELETE USING (bucket_id = 'milan-assets' AND public.is_admin());

-- -------------------------------------------------------------------------
-- STEP 4: BEFORE dropping legacy functions, verify no dependencies remain
-- -------------------------------------------------------------------------
DO $$
DECLARE
    policy_refs INT;
    view_refs INT;
    trigger_refs INT;
    constraint_refs INT;
BEGIN
    -- Count policy references to legacy helpers
    SELECT COUNT(*) INTO policy_refs
    FROM pg_policies
    WHERE qual ILIKE '%is_super_admin%' OR qual ILIKE '%is_admin_or_higher%' OR qual ILIKE '%is_editor_or_higher%'
       OR with_check ILIKE '%is_super_admin%' OR with_check ILIKE '%is_admin_or_higher%' OR with_check ILIKE '%is_editor_or_higher%';

    IF policy_refs > 0 THEN
        RAISE EXCEPTION 'Dependency Check Failed: % RLS policies still reference legacy functions.', policy_refs;
    END IF;

    -- Count view references to legacy helpers
    SELECT COUNT(*) INTO view_refs
    FROM pg_views
    WHERE definition ILIKE '%is_super_admin%' OR definition ILIKE '%is_admin_or_higher%' OR definition ILIKE '%is_editor_or_higher%';

    IF view_refs > 0 THEN
        RAISE EXCEPTION 'Dependency Check Failed: % database views still reference legacy functions.', view_refs;
    END IF;

    -- Count trigger references to legacy helpers
    SELECT COUNT(*) INTO trigger_refs
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_proc p ON p.oid = t.tgfoid
    WHERE p.prosrc ILIKE '%is_super_admin%' OR p.prosrc ILIKE '%is_admin_or_higher%' OR p.prosrc ILIKE '%is_editor_or_higher%';

    IF trigger_refs > 0 THEN
        RAISE EXCEPTION 'Dependency Check Failed: % database triggers still reference legacy functions.', trigger_refs;
    END IF;

    -- Count constraint references to legacy helpers
    SELECT COUNT(*) INTO constraint_refs
    FROM pg_constraint c
    WHERE pg_get_constraintdef(c.oid) ILIKE '%is_super_admin%' 
       OR pg_get_constraintdef(c.oid) ILIKE '%is_admin_or_higher%' 
       OR pg_get_constraintdef(c.oid) ILIKE '%is_editor_or_higher%';

    IF constraint_refs > 0 THEN
        RAISE EXCEPTION 'Dependency Check Failed: % table constraints still reference legacy functions.', constraint_refs;
    END IF;
END $$;

-- -------------------------------------------------------------------------
-- STEP 5: Drop legacy helper functions explicitly (No CASCADE)
-- -------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.is_super_admin();
DROP FUNCTION IF EXISTS public.is_admin_or_higher();
DROP FUNCTION IF EXISTS public.is_editor_or_higher();

-- -------------------------------------------------------------------------
-- STEP 6: Drop legacy constraint and column on public.admin_users
-- -------------------------------------------------------------------------
ALTER TABLE public.admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;
ALTER TABLE public.admin_users DROP COLUMN IF EXISTS role;

COMMIT;
