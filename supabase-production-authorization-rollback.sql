-- =========================================================================
-- MILAN INTERIO — PRODUCTION DATABASE AUTHORIZATION ROLLBACK
-- =========================================================================
-- Run this script in the Supabase SQL Editor if the migration needs to
-- be rolled back. It restores the exact legacy schema columns, check 
-- constraints, legacy helper functions, and actual policy names/conditions.
-- =========================================================================

BEGIN;

-- 1. Re-add role column to public.admin_users
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'ADMIN';

-- 2. Restore legacy check constraint on role column
ALTER TABLE public.admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;
ALTER TABLE public.admin_users ADD CONSTRAINT admin_users_role_check CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR'));

-- 3. Populate legacy roles for the verified pre-migration active administrator
-- (Safety check raises an exception if the target administrator user does not exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE user_id = '4b48d805-3f4d-473d-b0ad-055c0eed8ce6'
    ) THEN
        RAISE EXCEPTION 'Rollback Aborted: Target administrator user (4b48d805-3f4d-473d-b0ad-055c0eed8ce6) does not exist in public.admin_users.';
    END IF;

    UPDATE public.admin_users 
    SET role = 'SUPER_ADMIN' 
    WHERE user_id = '4b48d805-3f4d-473d-b0ad-055c0eed8ce6';
END $$;

-- 4. Recreate legacy authorization helper functions
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
        AND role = 'SUPER_ADMIN'
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_catalog;

CREATE OR REPLACE FUNCTION public.is_admin_or_higher()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
        AND role IN ('SUPER_ADMIN', 'ADMIN')
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_catalog;

CREATE OR REPLACE FUNCTION public.is_editor_or_higher()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
        AND role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_catalog;

-- 5. Revert table RLS policies to check the legacy helper functions
-- 5.1 admin_users
DROP POLICY IF EXISTS "Allow users to read their own admin status" ON public.admin_users;
CREATE POLICY "Allow admins view admin_users" ON public.admin_users FOR SELECT USING (public.is_admin_or_higher());
CREATE POLICY "Allow super_admin manage admin_users" ON public.admin_users FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- 5.2 site_settings
DROP POLICY IF EXISTS "Allow admin manage site_settings" ON public.site_settings;
CREATE POLICY "Allow admin manage site_settings" ON public.site_settings 
FOR ALL USING (public.is_admin_or_higher()) WITH CHECK (public.is_admin_or_higher());

-- 5.3 about_content
DROP POLICY IF EXISTS "Allow editor manage about_content" ON public.about_content;
CREATE POLICY "Allow editor manage about_content" ON public.about_content 
FOR ALL USING (public.is_editor_or_higher()) WITH CHECK (public.is_editor_or_higher());

-- 5.4 hero_content
DROP POLICY IF EXISTS "Allow editor manage hero_content" ON public.hero_content;
CREATE POLICY "Allow editor manage hero_content" ON public.hero_content 
FOR ALL USING (public.is_editor_or_higher()) WITH CHECK (public.is_editor_or_higher());

-- 5.5 pillars
DROP POLICY IF EXISTS "Allow editor manage pillars" ON public.pillars;
CREATE POLICY "Allow editor manage pillars" ON public.pillars 
FOR ALL USING (public.is_editor_or_higher()) WITH CHECK (public.is_editor_or_higher());

-- 5.6 services
DROP POLICY IF EXISTS "Allow editor manage services" ON public.services;
CREATE POLICY "Allow editor manage services" ON public.services 
FOR ALL USING (public.is_editor_or_higher()) WITH CHECK (public.is_editor_or_higher());

-- 5.7 service_items
DROP POLICY IF EXISTS "Allow editor manage service_items" ON public.service_items;
CREATE POLICY "Allow editor manage service_items" ON public.service_items 
FOR ALL USING (public.is_editor_or_higher()) WITH CHECK (public.is_editor_or_higher());

-- 5.8 process_steps
DROP POLICY IF EXISTS "Allow editor manage process_steps" ON public.process_steps;
CREATE POLICY "Allow editor manage process_steps" ON public.process_steps 
FOR ALL USING (public.is_editor_or_higher()) WITH CHECK (public.is_editor_or_higher());

-- 5.9 projects
DROP POLICY IF EXISTS "Allow editor manage projects" ON public.projects;
CREATE POLICY "Allow editor manage projects" ON public.projects 
FOR ALL USING (public.is_editor_or_higher()) WITH CHECK (public.is_editor_or_higher());

-- 5.10 project_images
DROP POLICY IF EXISTS "Allow editor manage project_images" ON public.project_images;
CREATE POLICY "Allow editor manage project_images" ON public.project_images 
FOR ALL USING (public.is_editor_or_higher()) WITH CHECK (public.is_editor_or_higher());

-- 5.11 materials
DROP POLICY IF EXISTS "Allow editor manage materials" ON public.materials;
CREATE POLICY "Allow editor manage materials" ON public.materials 
FOR ALL USING (public.is_editor_or_higher()) WITH CHECK (public.is_editor_or_higher());

-- 5.12 studio_gallery
DROP POLICY IF EXISTS "Allow editor manage studio_gallery" ON public.studio_gallery;
CREATE POLICY "Allow editor manage studio_gallery" ON public.studio_gallery 
FOR ALL USING (public.is_editor_or_higher()) WITH CHECK (public.is_editor_or_higher());

-- 5.13 inquiries
DROP POLICY IF EXISTS "Allow admin manage inquiries" ON public.inquiries;
CREATE POLICY "Allow admin manage inquiries" ON public.inquiries 
FOR ALL USING (public.is_admin_or_higher()) WITH CHECK (public.is_admin_or_higher());

-- 6. Revert storage policies for milan-assets to check is_editor_or_higher()
DROP POLICY IF EXISTS "Allow editor insert storage objects" ON storage.objects;
CREATE POLICY "Allow editor insert storage objects" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'milan-assets' AND public.is_editor_or_higher());

DROP POLICY IF EXISTS "Allow editor update storage objects" ON storage.objects;
CREATE POLICY "Allow editor update storage objects" ON storage.objects 
FOR UPDATE USING (bucket_id = 'milan-assets' AND public.is_editor_or_higher()) 
WITH CHECK (bucket_id = 'milan-assets' AND public.is_editor_or_higher());

DROP POLICY IF EXISTS "Allow editor delete storage objects" ON storage.objects;
CREATE POLICY "Allow editor delete storage objects" ON storage.objects 
FOR DELETE USING (bucket_id = 'milan-assets' AND public.is_editor_or_higher());

COMMIT;
