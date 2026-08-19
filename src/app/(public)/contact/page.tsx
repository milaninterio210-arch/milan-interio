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
    <div className="py-16 sm:py-24 lg:py-28 px-6 sm:px-12 md:px-16 lg:px-20 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch animate-fade-up">
        
        {/* Left Column (Span 4) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-12 sm:space-y-16">
          
          {/* Top text */}
          <div className="space-y-4 text-left">
            <h1 className="heading-display text-4xl sm:text-5xl lg:text-[40px] text-milan-ivory leading-[1.1] font-serif uppercase tracking-normal">
              LET'S CREATE
              <br />
              SOMETHING
              <br />
              DISTINCTIVE.
            </h1>
            <p className="text-body text-xs sm:text-sm text-milan-muted leading-relaxed font-light mt-4">
              Have a project in mind?
              <br />
              We would love to hear
              <br />
              about it.
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-6 text-left">
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

            <div>
              <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block font-semibold mb-1">
                LOCATION
              </span>
              <p className="text-xs sm:text-sm text-milan-ivory font-light whitespace-pre-line leading-relaxed">
                {settings?.office_address || "Malappuram, Kerala, India"}
              </p>
            </div>
          </div>
        </div>

        {/* Middle Column (Span 4) */}
        <div className="lg:col-span-4 border border-milan-border/60 p-6 sm:p-8 md:p-10 bg-milan-charcoal/20 relative flex flex-col justify-center">
          <ContactForm />
        </div>

        {/* Right Column (Span 4) */}
        <div className="lg:col-span-4 min-h-[350px] lg:min-h-full relative border border-milan-border/60 overflow-hidden bg-milan-charcoal">
          <img
            src="/contact_map.jpg"
            alt="Milan Interio studio location map Malappuram Kerala"
            className="absolute inset-0 w-full h-full object-cover opacity-85 transition-opacity duration-300 hover:opacity-100"
          />
        </div>

      </div>
    </div>
  );
}
