import { createClient } from "@/lib/supabase/server";
import { FooterClient } from "./FooterClient";

export async function Footer() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("contact_email, contact_phone, office_address, cr_number, vat_number")
    .eq("singleton_key", "default")
    .single();

  const officeAddress = settings?.office_address || "Milan Interio,\nDammam, KSA";
  const contactPhone = settings?.contact_phone || "+966 55 893 4342";
  const contactEmail = settings?.contact_email || "info@milaninterio.com";
  const crNumber = settings?.cr_number || "";
  const vatNumber = settings?.vat_number || "";
  const website = "www.milaninterio.com";

  return (
    <FooterClient
      officeAddress={officeAddress}
      contactPhone={contactPhone}
      contactEmail={contactEmail}
      crNumber={crNumber}
      vatNumber={vatNumber}
      website={website}
    />
  );
}
