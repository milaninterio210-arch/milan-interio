import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: service } = await supabase
    .from("services")
    .select("title, description")
    .eq("slug", slug)
    .single();

  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: service.title,
    description: service.description || `Learn about MILAN INTERIO's ${service.title} service.`,
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: service, error } = await supabase
    .from("services")
    .select("id, slug, title, description")
    .eq("slug", slug)
    .single();

  if (error || !service) {
    notFound();
  }

  const { data: items } = await supabase
    .from("service_items")
    .select("id, title, description, display_order")
    .eq("service_id", service.id)
    .order("display_order", { ascending: true });

  return (
    <div className="py-10 sm:py-14">
      {/* Header */}
      <section className="px-4 mb-12 sm:mb-16">
        <div className="max-w-5xl mx-auto space-y-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-[10px] tracking-widest text-milan-muted hover:text-milan-gold transition-colors uppercase font-mono"
          >
            <ArrowLeft size={12} />
            <span>All Services</span>
          </Link>

          <div className="space-y-4 pt-2">
            <p className="text-eyebrow">SERVICE</p>
            <h1 className="heading-display text-2xl sm:text-3xl md:text-4xl text-milan-ivory">
              {service.title}
            </h1>
            <p className="text-sm sm:text-base text-milan-muted leading-relaxed font-light max-w-2xl">
              {service.description}
            </p>
          </div>
        </div>
      </section>

      {/* Scope Items */}
      {items && items.length > 0 && (
        <section className="px-4 mb-12 sm:mb-16">
          <div className="max-w-4xl mx-auto pt-6">
            <span className="text-eyebrow block mb-8">Scope &amp; Capabilities</span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-milan-charcoal p-5 sm:p-6 transition-colors duration-300 flex items-start gap-4"
                >
                  <span className="text-[10px] font-mono text-milan-gold pt-0.5 shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="space-y-1">
                    <h3 className="heading-display text-xs text-milan-ivory tracking-wide">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-milan-muted leading-relaxed font-light">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="sm:px-6 px-4">
        <div className="max-w-4xl mx-auto bg-milan-charcoal p-4 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-eyebrow block">Interested?</span>
            <p className="text-xs sm:text-sm text-milan-muted max-w-md">
              Share your project scope and timelines to coordinate an initial consultation.
            </p>
          </div>
          <Link
            href="/contact"
            className="w-full sm:w-auto flex sm:inline-flex items-center justify-center gap-2 border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold px-6 py-3 text-[11px] tracking-widest font-semibold uppercase transition-all duration-300 shrink-0"
          >
            <span>Consultation</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </section>
    </div>
  );
}
