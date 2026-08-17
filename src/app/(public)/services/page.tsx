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

  // 1. Fetch services
  const { data: services } = await supabase
    .from("services")
    .select("id, slug, title, description, display_order")
    .order("display_order", { ascending: true });

  // 2. Fetch service items
  const { data: serviceItems } = await supabase
    .from("service_items")
    .select("service_id, title")
    .order("display_order", { ascending: true });

  return (
    <div className="space-y-32 py-24 pb-32 px-6">
      {/* Header */}
      <section className="max-w-4xl mx-auto text-center space-y-6 animate-fade-up">
        <p className="text-eyebrow">WHAT WE DO</p>
        <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl text-milan-ivory font-serif tracking-wide font-light">
          OUR SERVICES
        </h1>
        <p className="text-body-lg max-w-2xl mx-auto font-light">
          Custom spatial solutions combining structural discipline, material harmony, and functional longevity.
        </p>
      </section>

      {/* Services Grid Layout */}
      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {services?.map((service, index) => {
            // Filter service items matching this service
            const items = serviceItems?.filter((item) => item.service_id === service.id) || [];

            return (
              <div
                key={service.slug}
                className="bg-milan-primary/40 border border-milan-border p-8 md:p-12 flex flex-col justify-between space-y-12 hover:border-milan-gold/30 transition-all duration-300 relative group"
              >
                {/* Background glow hover effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-milan-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="space-y-6 relative z-10">
                  {/* Number & Link */}
                  <div className="flex items-center justify-between border-b border-milan-border/50 pb-4">
                    <span className="text-sm font-mono text-milan-gold font-semibold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-milan-muted hover:text-milan-gold transition-colors flex items-center space-x-1 text-xs tracking-widest uppercase font-semibold"
                    >
                      <span>DETAILS</span>
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                    </Link>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-4">
                    <h2 className="heading-display text-xl sm:text-2xl text-milan-ivory font-serif">
                      {service.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-milan-muted leading-relaxed font-light">
                      {service.description || "Custom interior design and fit-out capabilities configured for upscale residences and commercial spaces."}
                    </p>
                  </div>
                </div>

                {/* Service items tags */}
                {items.length > 0 && (
                  <div className="space-y-3 relative z-10 pt-4 border-t border-milan-border/50">
                    <span className="text-[9px] tracking-widest text-milan-gold uppercase font-mono block">
                      Scope of Services:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-milan-charcoal/50 border border-milan-border text-milan-muted text-[10px] px-2.5 py-1 tracking-wide font-light"
                        >
                          {item.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-5xl mx-auto">
        <div className="border border-milan-border p-12 md:p-16 text-center space-y-6 bg-milan-primary relative overflow-hidden">
          <span className="text-eyebrow">CONSULTATION</span>
          <h2 className="heading-display text-2xl sm:text-3xl text-milan-ivory max-w-xl mx-auto font-serif">
            Require custom joinery or custom layouts?
          </h2>
          <p className="text-body max-w-md mx-auto text-xs sm:text-sm">
            Discuss your design and project parameters with our interior design team.
          </p>
          <div className="pt-4">
            <Link
              href="/contact"
              className="inline-block border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold px-8 py-4 text-xs tracking-widest font-semibold uppercase transition-all duration-300"
            >
              Start A Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
