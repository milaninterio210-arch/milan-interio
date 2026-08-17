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
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: service.title,
    description: service.description || `Learn about MILAN INTERIO's ${service.title} service — premium interior design and fit-out solutions.`,
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch specific service
  const { data: service, error } = await supabase
    .from("services")
    .select("id, slug, title, description")
    .eq("slug", slug)
    .single();

  if (error || !service) {
    notFound();
  }

  // Fetch detailed service items
  const { data: items } = await supabase
    .from("service_items")
    .select("id, title, description, display_order")
    .eq("service_id", service.id)
    .order("display_order", { ascending: true });

  return (
    <div className="space-y-24 py-24 pb-32 px-6">
      {/* Back button and Header */}
      <section className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/services"
          className="inline-flex items-center space-x-2 text-xs tracking-wider text-milan-gold hover:text-milan-ivory transition-colors uppercase font-mono"
        >
          <ArrowLeft size={14} />
          <span>BACK TO SERVICES</span>
        </Link>

        <div className="space-y-4 pt-4">
          <p className="text-eyebrow">SERVICE EXPERTISE</p>
          <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl text-milan-ivory font-serif tracking-wide font-light">
            {service.title}
          </h1>
          <p className="text-body-lg max-w-2xl font-light">
            {service.description || "Custom interior capabilities configured for premium properties."}
          </p>
        </div>
      </section>

      {/* Scope Items Grid */}
      <section className="max-w-4xl mx-auto">
        <div className="border-t border-milan-border/50 pt-12 space-y-8">
          <h2 className="heading-display text-xs tracking-widest text-milan-gold uppercase font-serif mb-8">
            Scope & Capabilities
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-milan-primary/30 border border-milan-border p-6 hover:border-milan-gold/25 transition-colors duration-300 flex items-start space-x-4"
                >
                  <span className="text-[10px] font-mono text-milan-gold pt-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="space-y-1">
                    <h3 className="heading-display text-xs text-milan-ivory font-serif tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-xs text-milan-muted leading-relaxed font-light">
                      {item.description || "Fully customized design delivery step."}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-milan-muted italic">Scope details are currently being finalized.</p>
            )}
          </div>
        </div>
      </section>

      {/* Consult Box */}
      <section className="max-w-4xl mx-auto">
        <div className="border border-milan-border p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-milan-primary">
          <div className="space-y-2">
            <h3 className="heading-display text-sm tracking-widest text-milan-gold font-serif">
              Interested in {service.title}?
            </h3>
            <p className="text-xs text-milan-muted max-w-md">
              Let us know your project size, style preferences, and timelines to coordinate an initial consultation.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold px-6 py-3.5 text-xs tracking-widest font-semibold uppercase transition-all duration-300 text-center"
          >
            <span>Consultation</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
