-- =========================================================================
-- MILAN INTERIO — PRODUCTION DATABASE AUTHORIZATION VERIFICATION
-- =========================================================================
-- Run these read-only queries AFTER executing the migration script.
-- Verified state: Clean, single active-admin model.
-- =========================================================================

-- 1. Verify role column is absent from admin_users
SELECT 
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    'public.admin_users.role column is absent' AS verification_check
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'admin_users' AND column_name = 'role';

-- 2. Verify is_active column still exists in admin_users
SELECT 
    CASE WHEN COUNT(*) = 1 THEN 'PASS' ELSE 'FAIL' END AS status,
    'public.admin_users.is_active column exists' AS verification_check
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'admin_users' AND column_name = 'is_active';

-- 3. Verify admin_users_role_check constraint does NOT exist
SELECT 
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    'admin_users_role_check constraint does not exist' AS verification_check
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace 
  AND conrelid = 'public.admin_users'::regclass 
  AND conname = 'admin_users_role_check';

-- 4. Verify public.is_admin() exists and has the expected definition
SELECT 
    CASE WHEN COUNT(*) = 1 THEN 'PASS' ELSE 'FAIL' END AS status,
    'public.is_admin() function exists' AS verification_check
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace AND proname = 'is_admin';

-- Display complete definition of public.is_admin()
SELECT proname, pg_get_function_arguments(oid) AS args, pg_get_function_result(oid) AS returns, pg_get_functiondef(oid) AS definition
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace AND proname = 'is_admin';

-- 5. Verify legacy helper functions DO NOT exist
SELECT 
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    'legacy functions (is_super_admin, is_admin_or_higher, is_editor_or_higher) are absent' AS verification_check
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace 
  AND proname IN ('is_super_admin', 'is_admin_or_higher', 'is_editor_or_higher');

-- 6. Verify NO public RLS policies reference legacy helpers
SELECT 
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    'no public RLS policies reference legacy helpers' AS verification_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename IN (
    'admin_users', 'site_settings', 'about_content', 'hero_content', 'pillars', 
    'services', 'service_items', 'process_steps', 'projects', 'project_images', 
    'materials', 'studio_gallery', 'inquiries'
) AND (
    qual ILIKE '%is_super_admin%' OR qual ILIKE '%is_admin_or_higher%' OR qual ILIKE '%is_editor_or_higher%'
    OR with_check ILIKE '%is_super_admin%' OR with_check ILIKE '%is_admin_or_higher%' OR with_check ILIKE '%is_editor_or_higher%'
);

-- 7. Verify NO storage policies reference legacy helpers
SELECT 
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    'no storage policies reference legacy helpers' AS verification_check
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects' AND (
    qual ILIKE '%is_super_admin%' OR qual ILIKE '%is_admin_or_higher%' OR qual ILIKE '%is_editor_or_higher%'
    OR with_check ILIKE '%is_super_admin%' OR with_check ILIKE '%is_admin_or_higher%' OR with_check ILIKE '%is_editor_or_higher%'
);

-- 8. Verify admin_users table has ONLY the intended self-read policy
SELECT 
    CASE 
        WHEN COUNT(*) = 1 
             AND MAX(policyname) = 'Allow users to read their own admin status'
             AND MAX(cmd) = 'SELECT'
             AND MAX(qual) LIKE '%auth.uid() = user_id%'
             THEN 'PASS'
        ELSE 'FAIL'
    END AS status,
    'admin_users has only self-read SELECT policy' AS verification_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'admin_users';

-- 9. Verify that ALL 12 management policies exist and use public.is_admin()
SELECT 
    CASE 
        WHEN COUNT(*) = 12 
             AND COUNT(CASE WHEN (qual ILIKE '%public.is_admin()%' OR with_check ILIKE '%public.is_admin()%') THEN 1 END) = 12
             AND COUNT(CASE WHEN (qual ILIKE '%is_super_admin%' OR qual ILIKE '%is_admin_or_higher%' OR qual ILIKE '%is_editor_or_higher%'
                               OR with_check ILIKE '%is_super_admin%' OR with_check ILIKE '%is_admin_or_higher%' OR with_check ILIKE '%is_editor_or_higher%') THEN 1 END) = 0
             THEN 'PASS'
        ELSE 'FAIL'
    END AS status,
    'exactly 12 expected administrative content-management policies exist and use public.is_admin()' AS verification_check
FROM pg_policies
WHERE schemaname = 'public' 
  AND policyname IN (
      'Allow admin manage site_settings',
      'Allow editor manage about_content',
      'Allow editor manage hero_content',
      'Allow editor manage pillars',
      'Allow editor manage services',
      'Allow editor manage service_items',
      'Allow editor manage process_steps',
      'Allow editor manage projects',
      'Allow editor manage project_images',
      'Allow editor manage materials',
      'Allow editor manage studio_gallery',
      'Allow admin manage inquiries'
  );

-- 10. Verify storage mutation policies for milan-assets use public.is_admin() and match bucket_id
SELECT 
    CASE 
        WHEN COUNT(*) = 3 
             -- INSERT check
             AND COUNT(CASE WHEN policyname = 'Allow editor insert storage objects' AND cmd = 'INSERT' AND with_check ILIKE '%bucket_id%milan-assets%' AND with_check ILIKE '%public.is_admin()%' THEN 1 END) = 1
             -- UPDATE check
             AND COUNT(CASE WHEN policyname = 'Allow editor update storage objects' AND cmd = 'UPDATE' AND qual ILIKE '%bucket_id%milan-assets%' AND qual ILIKE '%public.is_admin()%' AND with_check ILIKE '%bucket_id%milan-assets%' AND with_check ILIKE '%public.is_admin()%' THEN 1 END) = 1
             -- DELETE check
             AND COUNT(CASE WHEN policyname = 'Allow editor delete storage objects' AND cmd = 'DELETE' AND qual ILIKE '%bucket_id%milan-assets%' AND qual ILIKE '%public.is_admin()%' THEN 1 END) = 1
             THEN 'PASS'
        ELSE 'FAIL'
    END AS status,
    'storage mutation policies insert, update, delete match milan-assets and public.is_admin()' AS verification_check
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects' 
  AND policyname IN ('Allow editor insert storage objects', 'Allow editor update storage objects', 'Allow editor delete storage objects');

-- 11. Verify public storage-read policy still exists
SELECT 
    CASE 
        WHEN COUNT(*) = 1 
             AND MAX(cmd) = 'SELECT'
             AND MAX(qual) = '(bucket_id = ''milan-assets''::text)'
             THEN 'PASS'
        ELSE 'FAIL'
    END AS status,
    'public storage-read policy remains intact' AS verification_check
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Allow public read access to storage objects';

-- 12. Verify expected public content-read policies still exist
SELECT 
    CASE WHEN COUNT(*) = 8 THEN 'PASS' ELSE 'FAIL' END AS status,
    'all 8 public read-only content policies are intact' AS verification_check
FROM pg_policies
WHERE schemaname = 'public' AND policyname LIKE 'Allow public read access to %'
  AND tablename IN ('site_settings', 'about_content', 'hero_content', 'pillars', 'services', 'service_items', 'process_steps', 'materials');

-- 13. Verify public inquiry INSERT policy still exists with original details
SELECT 
    CASE 
        WHEN COUNT(*) = 1 
             AND MAX(cmd) = 'INSERT'
             AND MAX(with_check) = 'true'
             THEN 'PASS'
        ELSE 'FAIL'
    END AS status,
    'public inquiry INSERT policy exists and is unchanged' AS verification_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'inquiries' AND policyname = 'Allow public write access to inquiries';

-- 14. Verify published-content public SELECT policies still exist
SELECT 
    CASE WHEN COUNT(*) = 3 THEN 'PASS' ELSE 'FAIL' END AS status,
    'published-content public policies remain intact' AS verification_check
FROM pg_policies
WHERE schemaname = 'public' 
  AND policyname IN (
      'Allow public read access to published projects',
      'Allow public read access to published project_images',
      'Allow public read access to published studio_gallery'
  );

-- 15. Verify RLS remains enabled on all 13 application tables
SELECT 
    CASE 
        WHEN COUNT(*) = 13 
             AND COUNT(CASE WHEN c.relrowsecurity = true THEN 1 END) = 13
             THEN 'PASS' 
        ELSE 'FAIL' 
    END AS status,
    'RLS is enabled on all 13 application tables' AS verification_check
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname IN (
    'admin_users', 'site_settings', 'about_content', 'hero_content', 'pillars', 
    'services', 'service_items', 'process_steps', 'projects', 'project_images', 
    'materials', 'studio_gallery', 'inquiries'
);

-- 16. Verify that RLS policy expressions exactly match original expressions
-- NOTE: This requires matching against the pre-migration backup output.
SELECT 
    'NOT VERIFIED — requires backup output' AS status,
    'Verify that RLS policies exactly match pre-migration database backup values' AS verification_check;

-- 17. Verify that role constraint definition matches original definition
-- NOTE: This requires matching against the pre-migration backup output.
SELECT 
    'NOT VERIFIED — requires backup output' AS status,
    'Verify role check constraint matches pre-migration database constraint values' AS verification_check;

-- 18. Show complete final policy definitions clearly for manual inspection
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE (schemaname = 'public' AND tablename IN (
    'admin_users', 'site_settings', 'about_content', 'hero_content', 'pillars', 
    'services', 'service_items', 'process_steps', 'projects', 'project_images', 
    'materials', 'studio_gallery', 'inquiries'
)) OR (schemaname = 'storage' AND tablename = 'objects')
ORDER BY schemaname, tablename, policyname;
