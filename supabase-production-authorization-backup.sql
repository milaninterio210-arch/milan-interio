-- =========================================================================
-- MILAN INTERIO — READ-ONLY PRODUCTION DATABASE BACKUP & INTROSPECTION
-- =========================================================================
-- Run these read-only queries in the Supabase SQL Editor BEFORE migrating.
-- Save the complete results to verify the exact state for rollback/validation.
-- =========================================================================

-- A. ADMIN_USERS COLUMNS
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'admin_users'
ORDER BY ordinal_position;

-- B. ADMIN_USERS CONSTRAINTS
SELECT conname AS constraint_name, 
       contype AS constraint_type, 
       pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
WHERE n.nspname = 'public' AND c.conrelid = 'public.admin_users'::regclass;

-- C. ADMIN_USERS INDEXES
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'admin_users';

-- D. ADMIN_USERS ROW DATA (For restoring roles if needed. Excludes passwords/secrets)
SELECT user_id, role, is_active, created_at, updated_at
FROM public.admin_users;

-- E. EXACT LEGACY & ACTIVE AUTHORIZATION HELPER FUNCTIONS
SELECT p.proname AS function_name,
       pg_get_function_arguments(p.oid) AS argument_signature,
       pg_get_function_result(p.oid) AS return_type,
       pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' 
  AND p.proname IN ('is_admin', 'is_super_admin', 'is_admin_or_higher', 'is_editor_or_higher');

-- F. ALL TABLE RLS STATUS AND POLICY DEFINITIONS
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd AS command, 
    qual, 
    with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename IN (
    'admin_users', 'site_settings', 'about_content', 'hero_content', 'pillars', 
    'services', 'service_items', 'process_steps', 'projects', 'project_images', 
    'materials', 'studio_gallery', 'inquiries'
)
ORDER BY tablename, policyname;

-- G. ALL STORAGE POLICY DEFINITIONS
SELECT policyname, permissive, roles, cmd AS command, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects';
