import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
    <div className="py-20 sm:py-24">
      {/* Header section (Overlaid banner layout like Hero) */}
      <section className="max-w-7xl mx-auto px-6 mb-16 sm:mb-24 animate-fade-up">
        <div className="w-full h-[300px] sm:h-[400px] md:h-[450px] bg-milan-charcoal overflow-hidden border border-milan-border/60 relative flex items-center justify-start px-6 sm:px-12 md:px-16">
          {/* Background Image */}
          <img
            src={settings?.services_banner_image_url || "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1600&q=80"}
            alt="Milan Interio interior services showcase banner"
            className="absolute inset-0 w-full h-full object-cover opacity-90 sm:opacity-100"
          />
          {/* Gradient Overlay for Left Side Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent pointer-events-none" />

          {/* Text Overlay Content */}
          <div className="relative z-10 space-y-4 max-w-2xl text-left">
            <p className="text-eyebrow tracking-widest text-milan-gold">OUR SERVICES</p>
            <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl text-milan-ivory leading-tight font-serif uppercase">
              OUR SERVICES
            </h1>
            <p className="text-body text-xs sm:text-sm text-milan-muted leading-relaxed font-light max-w-lg">
              Complete interior solutions tailored to the architecture, lifestyle, and requirements of each project.
            </p>
          </div>
        </div>
      </section>

      {/* Services list section */}
      <section className="max-w-7xl mx-auto px-6 mb-16 sm:mb-24">
        <div className="border border-milan-border p-6 sm:p-10 divide-y divide-milan-border/60">
          {services?.map((service, index) => {
            const items = serviceItems?.filter((item) => item.service_id === service.id) || [];
            
            // Split items into 2 lists for two columns
            const mid = Math.ceil(items.length / 2);
            const col1 = items.slice(0, mid);
            const col2 = items.slice(mid);

            return (
              <div key={service.slug} className="py-8 sm:py-12 group first:pt-0 last:pb-0">
                <Link href={`/services/${service.slug}`} className="block">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
                    {/* Row Left: Number + Title + Sub-specialties list */}
                    <div className="flex-1 flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                      {/* Gold Number */}
                      <span className="heading-display text-4xl sm:text-5xl text-milan-gold font-mono tracking-widest leading-none">
                        {String(index + 1).padStart(2, "0")}
                      </span>

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

                    {/* Row Right: Service Category Image + Plus sign */}
                    <div className="flex items-center gap-6 sm:gap-8 shrink-0 justify-between sm:justify-end">
                      {service.image_url ? (
                        <div className="w-48 sm:w-56 aspect-[16/10] bg-milan-charcoal overflow-hidden border border-milan-border group-hover:border-milan-gold/40 transition-colors duration-300">
                          <img
                            src={service.image_url}
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="w-48 sm:w-56 aspect-[16/10] bg-milan-charcoal border border-milan-border flex items-center justify-center text-[10px] text-milan-muted font-mono tracking-widest uppercase">
                          No Image
                        </div>
                      )}
                      
                      {/* Gold Plus Icon */}
                      <span className="text-milan-gold text-2xl font-light font-mono leading-none group-hover:scale-115 transition-transform duration-300">
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
      <section className="px-6">
        <div className="max-w-4xl mx-auto border border-milan-border p-10 sm:p-16 text-center space-y-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(197,160,89,0.04),transparent_60%)] pointer-events-none" />
          <span className="text-eyebrow relative z-10">CONSULTATION</span>
          <h2 className="heading-editorial text-xl sm:text-2xl text-milan-ivory max-w-md mx-auto leading-snug relative z-10">
            Require custom joinery or custom layouts?
          </h2>
          <p className="text-body max-w-md mx-auto text-sm relative z-10">
            Discuss your design and project parameters with our interior design team.
          </p>
          <div className="pt-2 relative z-10">
            <Link
              href="/contact"
              className="inline-block border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold px-8 py-3.5 text-[11px] tracking-widest font-semibold uppercase transition-all duration-300"
            >
              Start A Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
