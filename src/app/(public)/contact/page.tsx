import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ContactForm } from "@/components/public/ContactForm";

export const metadata: Metadata = {
  title: "Start a Project",
  description:
    "Get in touch with MILAN INTERIO to schedule a premium design consultation for your space.",
};

export default async function ContactPage() {
  const supabase = await createClient();

  // Fetch site settings for any available contact details
  const { data: settings } = await supabase
    .from("site_settings")
    .select("contact_email, contact_phone, office_address")
    .eq("singleton_key", "default")
    .single();

  const hasContactInfo =
    settings?.contact_email || settings?.contact_phone || settings?.office_address;

  return (
    <div className="space-y-32 py-24 pb-32 px-6">
      {/* Header */}
      <section className="max-w-4xl mx-auto text-center space-y-6 animate-fade-up">
        <p className="text-eyebrow">INQUIRE</p>
        <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl text-milan-ivory font-serif tracking-wide font-light">
          START A PROJECT
        </h1>
        <p className="text-body-lg max-w-2xl mx-auto font-light">
          Share your vision, spatial requirements, and project timeline. Our design team will coordinate a consultation.
        </p>
      </section>

      {/* Form + Contact Details */}
      <section className="max-w-5xl mx-auto">
        <div className={`grid grid-cols-1 ${hasContactInfo ? "lg:grid-cols-3" : ""} gap-16`}>
          {/* Form Column */}
          <div className={hasContactInfo ? "lg:col-span-2" : ""}>
            <ContactForm />
          </div>

          {/* Contact Details Sidebar — only if available */}
          {hasContactInfo && (
            <div className="border-t lg:border-t-0 lg:border-l border-milan-border pt-8 lg:pt-0 lg:pl-10 space-y-8">
              <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
                DIRECT CONTACT
              </span>

              {settings?.contact_email && (
                <div className="space-y-1">
                  <span className="text-[9px] tracking-widest text-milan-muted uppercase font-mono block">
                    EMAIL
                  </span>
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="text-sm text-milan-ivory hover:text-milan-gold transition-colors font-light"
                  >
                    {settings.contact_email}
                  </a>
                </div>
              )}

              {settings?.contact_phone && (
                <div className="space-y-1">
                  <span className="text-[9px] tracking-widest text-milan-muted uppercase font-mono block">
                    PHONE
                  </span>
                  <a
                    href={`tel:${settings.contact_phone}`}
                    className="text-sm text-milan-ivory hover:text-milan-gold transition-colors font-light"
                  >
                    {settings.contact_phone}
                  </a>
                </div>
              )}

              {settings?.office_address && (
                <div className="space-y-1">
                  <span className="text-[9px] tracking-widest text-milan-muted uppercase font-mono block">
                    STUDIO
                  </span>
                  <p className="text-sm text-milan-ivory font-light whitespace-pre-line">
                    {settings.office_address}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
