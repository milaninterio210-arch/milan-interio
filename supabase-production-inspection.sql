-- =========================================================================
-- MILAN INTERIO — READ-ONLY PRODUCTION DATABASE INSPECTION
-- =========================================================================
-- This script contains only read-only metadata queries.
-- It does NOT modify schemas, policies, data, or settings.
-- Run this in the Supabase SQL Editor and copy/paste the outputs.
-- =========================================================================

-- 1. ADMIN_USERS COLUMNS
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'admin_users'
ORDER BY ordinal_position;

-- 2. ADMIN_USERS CONSTRAINTS
SELECT conname AS constraint_name, 
       contype AS constraint_type, 
       pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
WHERE n.nspname = 'public' AND c.conrelid = 'public.admin_users'::regclass;

-- 3. ADMIN_USERS INDEXES
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'admin_users';

-- 4. RLS STATUS
SELECT
    n.nspname AS schemaname,
    c.relname AS tablename,
    c.relrowsecurity AS rowsecurity,
    c.relforcerowsecurity AS forcesecurity
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE
    (
        n.nspname = 'public'
        AND c.relname IN (
            'admin_users',
            'site_settings',
            'about_content',
            'hero_content',
            'pillars',
            'services',
            'service_items',
            'process_steps',
            'projects',
            'project_images',
            'materials',
            'studio_gallery',
            'inquiries'
        )
    )
    OR (
        n.nspname = 'storage'
        AND c.relname = 'objects'
    )
ORDER BY n.nspname, c.relname;



-- 5. RLS POLICIES
SELECT schemaname, tablename, policyname, permissive, roles, cmd AS command, 
       qual, with_check
FROM pg_policies
WHERE (schemaname = 'public' AND tablename IN (
    'admin_users', 'site_settings', 'about_content', 'hero_content', 'pillars', 
    'services', 'service_items', 'process_steps', 'projects', 'project_images', 
    'materials', 'studio_gallery', 'inquiries'
)) OR (schemaname = 'storage' AND tablename = 'objects');

-- 6. ADMIN FUNCTIONS
SELECT p.proname AS function_name,
       pg_get_function_arguments(p.oid) AS argument_signature,
       pg_get_function_result(p.oid) AS return_type,
       pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' 
  AND (p.proname ILIKE '%admin%' 
    OR p.proname ILIKE '%editor%' 
    OR p.proname ILIKE '%super_admin%' 
    OR p.proname ILIKE '%higher%');

-- 7. ROLE DEPENDENCY SEARCH
-- Search Functions
SELECT p.proname AS function_name, n.nspname AS schema_name
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE p.prosrc ILIKE '%role%'
   OR p.prosrc ILIKE '%SUPER_ADMIN%'
   OR p.prosrc ILIKE '%ADMIN%'
   OR p.prosrc ILIKE '%EDITOR%'
   OR p.prosrc ILIKE '%is_super_admin%'
   OR p.prosrc ILIKE '%is_admin_or_higher%'
   OR p.prosrc ILIKE '%is_editor_or_higher%';

-- Search Policies
SELECT schemaname, tablename, policyname, qual, with_check
FROM pg_policies
WHERE qual ILIKE '%role%'
   OR qual ILIKE '%SUPER_ADMIN%'
   OR qual ILIKE '%ADMIN%'
   OR qual ILIKE '%EDITOR%'
   OR qual ILIKE '%is_super_admin%'
   OR qual ILIKE '%is_admin_or_higher%'
   OR qual ILIKE '%is_editor_or_higher%'
   OR with_check ILIKE '%role%'
   OR with_check ILIKE '%SUPER_ADMIN%'
   OR with_check ILIKE '%ADMIN%'
   OR with_check ILIKE '%EDITOR%'
   OR with_check ILIKE '%is_super_admin%'
   OR with_check ILIKE '%is_admin_or_higher%'
   OR with_check ILIKE '%is_editor_or_higher%';

-- Search Triggers
SELECT tgname AS trigger_name, relname AS table_name
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
JOIN pg_proc p ON p.oid = t.tgfoid
WHERE p.prosrc ILIKE '%role%'
   OR p.prosrc ILIKE '%SUPER_ADMIN%'
   OR p.prosrc ILIKE '%ADMIN%'
   OR p.prosrc ILIKE '%EDITOR%'
   OR p.prosrc ILIKE '%is_super_admin%'
   OR p.prosrc ILIKE '%is_admin_or_higher%'
   OR p.prosrc ILIKE '%is_editor_or_higher%';

-- Search Constraints
SELECT conname AS constraint_name, 
       conrelid::regclass AS table_name,
       pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
WHERE pg_get_constraintdef(c.oid) ILIKE '%role%'
   OR pg_get_constraintdef(c.oid) ILIKE '%SUPER_ADMIN%'
   OR pg_get_constraintdef(c.oid) ILIKE '%ADMIN%'
   OR pg_get_constraintdef(c.oid) ILIKE '%EDITOR%'
   OR pg_get_constraintdef(c.oid) ILIKE '%is_super_admin%'
   OR pg_get_constraintdef(c.oid) ILIKE '%is_admin_or_higher%'
   OR pg_get_constraintdef(c.oid) ILIKE '%is_editor_or_higher%';

-- Search Views
SELECT viewname, definition
FROM pg_views
WHERE definition ILIKE '%role%'
   OR definition ILIKE '%SUPER_ADMIN%'
   OR definition ILIKE '%ADMIN%'
   OR definition ILIKE '%EDITOR%'
   OR definition ILIKE '%is_super_admin%'
   OR definition ILIKE '%is_admin_or_higher%'
   OR definition ILIKE '%is_editor_or_higher%';

-- 8. STORAGE POLICIES
SELECT policyname, permissive, roles, cmd AS command, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects';
