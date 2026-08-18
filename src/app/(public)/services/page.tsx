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
    .select("id, slug, title, description, display_order")
    .order("display_order", { ascending: true });

  const { data: serviceItems } = await supabase
    .from("service_items")
    .select("service_id, title")
    .order("display_order", { ascending: true });

  return (
    <div className="py-20 sm:py-24">
      {/* Header */}
      <section className="px-6 text-center space-y-5 mb-16 sm:mb-24 animate-fade-up">
        <p className="text-eyebrow">WHAT WE DO</p>
        <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl text-milan-ivory max-w-3xl mx-auto">
          OUR SERVICES
        </h1>
        <p className="text-body max-w-xl mx-auto text-sm sm:text-base">
          Custom spatial solutions combining structural discipline, material harmony, and functional longevity.
        </p>
      </section>

      {/* Services List */}
      <section className="px-6 mb-16 sm:mb-24">
        <div className="max-w-5xl mx-auto divide-y divide-milan-border">
          {services?.map((service, index) => {
            const items = serviceItems?.filter((item) => item.service_id === service.id) || [];

            return (
              <div key={service.slug} className="py-8 sm:py-10 group">
                <Link href={`/services/${service.slug}`} className="block">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-baseline gap-4 sm:gap-6">
                      <span className="text-xs font-mono text-milan-gold shrink-0">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="heading-display text-lg sm:text-xl md:text-2xl text-milan-ivory group-hover:text-milan-gold transition-colors">
                        {service.title}
                      </h2>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-milan-muted group-hover:text-milan-gold shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                    />
                  </div>

                  <div className="pl-8 sm:pl-12 space-y-4">
                    <p className="text-sm text-milan-muted leading-relaxed font-light max-w-2xl">
                      {service.description}
                    </p>

                    {items.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {items.map((item, idx) => (
                          <span
                            key={idx}
                            className="border border-milan-border text-milan-muted text-[10px] px-2 py-0.5 tracking-wide"
                          >
                            {item.title}
                          </span>
                        ))}
                      </div>
                    )}
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
