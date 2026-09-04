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

  const { data: settings } = await supabase
    .from("site_settings")
    .select("contact_email, contact_phone, office_address")
    .eq("singleton_key", "default")
    .single();

  const hasContactInfo =
    settings?.contact_email || settings?.contact_phone || settings?.office_address;

  return (
    <div className="py-10 sm:py-20 lg:py-14 px-4 sm:px-12 md:px-16 lg:px-20 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start animate-fade-up">
        
        {/* Left Column: Heading, Info & Map Preview (Span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8 lg:space-y-10">
          
          {/* Top text */}
          <div className="space-y-4 text-left">
            <span className="text-eyebrow">GET IN TOUCH</span>
            <h1 className="heading-display text-3xl sm:text-4xl lg:text-5xl text-milan-ivory leading-[1.15] font-serif uppercase tracking-normal">
              LET'S CREATE SOMETHING DISTINCTIVE.
            </h1>
            <p className="text-body text-xs sm:text-sm text-milan-muted leading-relaxed font-light">
              Have a project in mind? We would love to hear about it.
            </p>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left pt-2">
            <div>
              <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block font-semibold mb-1">
                PHONE
              </span>
              <a
                href={`tel:${settings?.contact_phone || "+91 00000 00000"}`}
                className="text-xs sm:text-sm text-milan-ivory hover:text-milan-gold transition-colors font-light"
              >
                {settings?.contact_phone || "+91 00000 00000"}
              </a>
            </div>

            <div>
              <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block font-semibold mb-1">
                EMAIL
              </span>
              <a
                href={`mailto:${settings?.contact_email || "hello@milaninterio.com"}`}
                className="text-xs sm:text-sm text-milan-ivory hover:text-milan-gold transition-colors font-light"
              >
                {settings?.contact_email || "hello@milaninterio.com"}
              </a>
            </div>

            <div className="sm:col-span-2">
              <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block font-semibold mb-1">
                LOCATION
              </span>
              <p className="text-xs sm:text-sm text-milan-ivory font-light whitespace-pre-line leading-relaxed">
                {settings?.office_address || "Malappuram, Kerala, India"}
              </p>
            </div>
          </div>

          {/* Map Preview */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-milan-charcoal">
            <img
              src="/contact_map.jpg"
              alt="Milan Interio studio location map Malappuram Kerala"
              className="absolute inset-0 w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-milan-primary/50 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Right Column: Spacious Form (Span 7) */}
        <div className="lg:col-span-7 sm:p-8 sm:p-12 md:p-14 relative flex flex-col justify-center">
          <ContactForm />
        </div>

      </div>
    </div>
  );
}
