import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ConsultationCTA from "@/components/public/ConsultationCTA";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore MILAN INTERIO's premium interior design services — from space planning and luxury residential interiors to turnkey fit-outs and custom joinery.",
};

export default async function ServicesPage() {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("id, slug, title, description, image_url, display_order")
    .order("display_order", { ascending: true });

  const { data: serviceItems } = await supabase
    .from("service_items")
    .select("service_id, title")
    .order("display_order", { ascending: true });

  const { data: settings } = await supabase
    .from("site_settings")
    .select("services_banner_image_url")
    .eq("singleton_key", "default")
    .single();

  return (
    <div className="py-10 sm:py-14">
      {/* Header section (Overlaid banner layout like Hero) */}
      <section className="max-w-7xl mx-auto px-4 mb-16 sm:mb-24 animate-fade-up">
        <div className="w-full h-[340px] sm:h-[400px] md:h-[450px] bg-milan-charcoal overflow-hidden relative flex items-end justify-center sm:items-center sm:justify-start px-4 pb-6 pt-10 sm:px-12 sm:py-0 md:px-16">
          {/* Background Image */}
          <img
            src={settings?.services_banner_image_url || "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1600&q=80"}
            alt="Milan Interio interior services showcase banner"
            className="absolute inset-0 w-full h-full object-cover opacity-95 sm:opacity-100"
          />
          {/* Mobile Bottom Focused Gradient (keeps upper image bright & perfect while shielding bottom text) */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none sm:hidden" />
          {/* Desktop Left-to-Right Gradient */}
          <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent pointer-events-none" />

          {/* Text Overlay Content: Bottom Center on mobile, Left on desktop */}
          <div className="relative z-10 space-y-1.5 sm:space-y-4 max-w-xl text-center sm:text-left">
            <p className="text-eyebrow tracking-widest text-milan-gold text-[10px] sm:text-xs">
              INTERIOR &bull; EXTERIOR &bull; LANDSCAPE
            </p>
            <h1 className="heading-display text-2xl sm:text-5xl md:text-6xl text-milan-ivory leading-tight font-serif uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
              OUR SERVICES
            </h1>
            <p className="text-body text-xs sm:text-sm text-milan-ivory/90 leading-relaxed font-light max-w-md mx-auto sm:mx-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              Comprehensive interior, exterior, and landscape design solutions tailored to the architecture, lifestyle, and distinctive requirements of each project.
            </p>
          </div>
        </div>
      </section>

      {/* Services list section */}
      <section className="max-w-7xl mx-auto sm:px-4 sm:px-6 mb-16 sm:mb-24">
        <div className="sm:border border-milan-border p-4 sm:p-10 sm:divide-y divide-milan-border/60">
          {services?.map((service, index) => {
            const items = serviceItems?.filter((item) => item.service_id === service.id) || [];
            
            // Split items into 2 lists for two columns
            const mid = Math.ceil(items.length / 2);
            const col1 = items.slice(0, mid);
            const col2 = items.slice(mid);

            return (
              <div key={service.slug} className="py-6 sm:py-12 group first:pt-0 last:pb-0">
                <Link href={`/services/${service.slug}`} className="block">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-12">
                    {/* Row Left: Number + Title + Sub-specialties list */}
                    <div className="flex-1 flex flex-col md:flex-row md:items-start gap-4 sm:gap-6 md:gap-10">
                      {/* Top Header Row for Mobile: Number on left + Plus button on top right */}
                      <div className="flex items-center justify-between sm:block">
                        <span className="heading-display text-4xl sm:text-5xl text-milan-gold font-mono tracking-widest leading-none">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        {/* Gold Plus Icon for Mobile (top right side) */}
                        <span className="lg:hidden text-milan-gold text-2xl font-light font-mono leading-none group-hover:scale-115 transition-transform duration-300">
                          +
                        </span>
                      </div>

                      {/* Content block: Title + Columns */}
                      <div className="space-y-4 flex-1">
                        <h2 className="heading-display text-lg sm:text-xl md:text-2xl text-milan-ivory group-hover:text-milan-gold transition-colors font-mono tracking-wide uppercase">
                          {service.title}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                          <ul className="space-y-1.5">
                            {col1.map((item, idx) => (
                              <li key={idx} className="text-xs text-milan-muted flex items-center gap-2 font-mono">
                                <span className="w-1.5 h-1.5 bg-milan-gold/60 rounded-full shrink-0" />
                                {item.title}
                              </li>
                            ))}
                          </ul>
                          <ul className="space-y-1.5">
                            {col2.map((item, idx) => (
                              <li key={idx} className="text-xs text-milan-muted flex items-center gap-2 font-mono">
                                <span className="w-1.5 h-1.5 bg-milan-gold/60 rounded-full shrink-0" />
                                {item.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Row Right: Service Category Image (Full Width on Mobile) + Desktop Plus sign */}
                    <div className="w-full lg:w-auto flex items-center gap-6 sm:gap-8 shrink-0 justify-between sm:justify-end">
                      {service.image_url ? (
                        <div className="w-full lg:w-48 xl:w-56 aspect-[16/10] bg-milan-charcoal overflow-hidden border border-milan-border group-hover:border-milan-gold/40 transition-colors duration-300">
                          <img
                            src={service.image_url}
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="w-full lg:w-48 xl:w-56 aspect-[16/10] bg-milan-charcoal border border-milan-border flex items-center justify-center text-[10px] text-milan-muted font-mono tracking-widest uppercase">
                          No Image
                        </div>
                      )}
                      
                      {/* Gold Plus Icon for Desktop (Hidden on Mobile) */}
                      <span className="hidden lg:inline-block text-milan-gold text-2xl font-light font-mono leading-none group-hover:scale-115 transition-transform duration-300">
                        +
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <ConsultationCTA />
    </div>
  );
}
