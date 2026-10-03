-- =========================================================================
-- MILAN INTERIO — Saudi Business Information Migration
-- Adds CR Number & VAT Number to site_settings and updates default phone
-- =========================================================================

-- 1. Add columns to site_settings if they don't exist
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS cr_number TEXT,
ADD COLUMN IF NOT EXISTS vat_number TEXT,
ADD COLUMN IF NOT EXISTS services_banner_image_url TEXT;

-- 2. Update default phone number and ensure initial record is updated
UPDATE public.site_settings
SET contact_phone = '+966 55 893 4342'
WHERE singleton_key = 'default' AND (contact_phone IS NULL OR contact_phone = '+966 55 478 3438');
