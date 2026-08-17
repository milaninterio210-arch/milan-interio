import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight, ChevronRight, ExternalLink } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();

  // 1. Fetch site settings
  const { data: settings } = await supabase
    .from("site_settings")
    .select("brand_name, primary_tagline, supporting_tagline, design_philosophy, design_philosophy_explanation")
    .eq("singleton_key", "default")
    .single();

  // 2. Fetch active hero content
  const { data: hero } = await supabase
    .from("hero_content")
    .select("eyebrow, heading, subheading, background_image_url, primary_cta_label, primary_cta_url, secondary_cta_label, secondary_cta_url")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(1)
    .single();

  // 3. Fetch pillars
  const { data: pillars } = await supabase
    .from("pillars")
    .select("pillar_number, title, description")
    .order("pillar_number", { ascending: true });

  // 4. Fetch services
  const { data: services } = await supabase
    .from("services")
    .select("slug, title, description, display_order")
    .order("display_order", { ascending: true })
    .limit(4);

  // 5. Fetch featured published projects
  const { data: featuredProjects } = await supabase
    .from("projects")
    .select("slug, title, category, location, cover_image_url")
    .eq("is_featured", true)
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .limit(3);

  // 6. Fetch process steps
  const { data: processSteps } = await supabase
    .from("process_steps")
    .select("step_number, title, description")
    .order("step_number", { ascending: true })
    .limit(3);

  return (
    <div className="space-y-32 pb-32">
      {/* SECTION 1: HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-milan-charcoal overflow-hidden px-6">
        {/* Subtle background texture fallback */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,35,28,0.3),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 animate-fade-up">
          <p className="text-eyebrow tracking-[0.25em]">
            {hero?.eyebrow || "Interior Design | Fit-Out | Custom Joinery | Furniture"}
          </p>

          <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-milan-ivory max-w-4xl mx-auto leading-[1.1] font-serif font-light">
            {hero?.heading || "LUXURY, DESIGNED AROUND YOU."}
          </h1>

          <p className="text-body-lg max-w-2xl mx-auto font-light text-milan-muted">
            {hero?.subheading || "Elevating Spaces. Defining Luxury."}
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={hero?.primary_cta_url || "/projects"}
              className="w-full sm:w-auto px-8 py-4 border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold text-xs tracking-widest uppercase font-semibold transition-all duration-300 text-center"
            >
              {hero?.primary_cta_label || "EXPLORE OUR WORK"}
            </Link>
            <Link
              href={hero?.secondary_cta_url || "/contact"}
              className="w-full sm:w-auto px-8 py-4 border border-milan-border text-milan-ivory hover:border-milan-gold hover:text-milan-gold text-xs tracking-widest uppercase font-semibold transition-all duration-300 text-center"
            >
              {hero?.secondary_cta_label || "START A PROJECT"}
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: BRAND STATEMENT / POSITIONING */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-6">
        <span className="text-eyebrow">The Milan Standard</span>
        <h2 className="heading-display text-2xl sm:text-3xl text-milan-ivory font-serif">
          Luxury is not defined by excess. It is defined by precision.
        </h2>
        <p className="text-body max-w-2xl mx-auto italic font-serif text-milan-muted text-base sm:text-lg">
          &ldquo;{settings?.design_philosophy_explanation || "We believe luxury is not simply about expensive materials. True luxury comes from proportion, craftsmanship, material harmony, lighting, functionality, and attention to detail."}&rdquo;
        </p>
      </section>

      {/* SECTION 3: THE PILLARS OF EXCELLENCE */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="border-b border-milan-border pb-6">
          <h3 className="heading-display text-sm tracking-widest text-milan-gold font-serif">
            OUR BRAND PILLARS
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars && pillars.length > 0 ? (
            pillars.map((pillar) => (
              <div
                key={pillar.pillar_number}
                className="space-y-4 border-l border-milan-border pl-6 hover:border-milan-gold transition-colors duration-300"
              >
                <span className="text-sm font-mono text-milan-gold block">
                  {pillar.pillar_number}
                </span>
                <h4 className="heading-display text-base text-milan-ivory font-serif tracking-wider">
                  {pillar.title}
                </h4>
                <p className="text-xs text-milan-muted leading-relaxed">
                  {pillar.description || "Verified company quality standard detail."}
                </p>
              </div>
            ))
          ) : (
            // Pillar fallback
            [
              { num: "01", title: "PROPORTION" },
              { num: "02", title: "MATERIAL" },
              { num: "03", title: "CRAFT" },
              { num: "04", title: "DETAIL" },
            ].map((p) => (
              <div key={p.num} className="space-y-4 border-l border-milan-border pl-6">
                <span className="text-sm font-mono text-milan-gold block">{p.num}</span>
                <h4 className="heading-display text-base text-milan-ivory font-serif tracking-wider">{p.title}</h4>
                <p className="text-xs text-milan-muted leading-relaxed">Verifying detail...</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* SECTION 4: SELECTED PROJECTS */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="border-b border-milan-border pb-6 flex items-end justify-between">
          <h3 className="heading-display text-sm tracking-widest text-milan-gold font-serif">
            SELECTED PORTFOLIO
          </h3>
          <Link
            href="/projects"
            className="text-[10px] tracking-widest text-milan-muted hover:text-milan-gold uppercase font-semibold flex items-center space-x-1"
          >
            <span>All projects</span>
            <ChevronRight size={12} />
          </Link>
        </div>

        {featuredProjects && featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group flex flex-col space-y-4"
              >
                <div className="aspect-[4/3] bg-milan-charcoal border border-milan-border overflow-hidden relative">
                  {project.cover_image_url ? (
                    <img
                      src={project.cover_image_url}
                      alt={project.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-milan-muted uppercase font-mono">
                      Image Pending
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] tracking-wider text-milan-gold uppercase font-mono">
                    {project.category} {project.location ? `• ${project.location}` : ""}
                  </span>
                  <h4 className="heading-display text-base text-milan-ivory group-hover:text-milan-gold transition-colors font-serif">
                    {project.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Editorial Empty State */
          <div className="border border-milan-border bg-milan-charcoal/30 p-12 text-center max-w-2xl mx-auto space-y-4 animate-fade-in">
            <p className="text-sm text-milan-muted font-light">
              Our complete interior design portfolio is currently undergoing curation.
            </p>
            <p className="text-xs text-milan-muted italic">
              Projects uploaded via the administrator console will be listed here.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-block border border-milan-gold px-6 py-3 text-[10px] tracking-widest text-milan-gold hover:bg-milan-gold hover:text-milan-primary font-semibold uppercase transition-colors"
              >
                Start Your Project
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 5: SERVICES OVERVIEW */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="border-b border-milan-border pb-6 flex items-end justify-between">
          <h3 className="heading-display text-sm tracking-widest text-milan-gold font-serif">
            OUR EXPERTISE
          </h3>
          <Link
            href="/services"
            className="text-[10px] tracking-widest text-milan-muted hover:text-milan-gold uppercase font-semibold flex items-center space-x-1"
          >
            <span>All services</span>
            <ChevronRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services && services.length > 0
            ? services.map((service, idx) => (
                <div
                  key={service.slug}
                  className="bg-milan-primary border border-milan-border p-8 flex flex-col justify-between h-64 hover:border-milan-gold/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-mono text-milan-gold">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-milan-muted hover:text-milan-gold transition-colors"
                    >
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                  <div className="space-y-3">
                    <h4 className="heading-display text-lg text-milan-ivory font-serif">
                      {service.title}
                    </h4>
                    <p className="text-xs text-milan-muted line-clamp-2 leading-relaxed">
                      {service.description || "Bespoke spatial capabilities tailored for premium interiors."}
                    </p>
                  </div>
                </div>
              ))
            : null}
        </div>
      </section>

      {/* SECTION 6: PROCESS OVERVIEW */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="border-b border-milan-border pb-6 flex items-end justify-between">
          <h3 className="heading-display text-sm tracking-widest text-milan-gold font-serif">
            DESIGN JOURNEY
          </h3>
          <Link
            href="/process"
            className="text-[10px] tracking-widest text-milan-muted hover:text-milan-gold uppercase font-semibold flex items-center space-x-1"
          >
            <span>Our Full Process</span>
            <ChevronRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {processSteps && processSteps.length > 0
            ? processSteps.map((step) => (
                <div key={step.step_number} className="space-y-4 p-6 bg-milan-charcoal/20 border border-milan-border">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono text-milan-gold bg-milan-emerald border border-milan-gold/20 px-2 py-0.5">
                      {step.step_number}
                    </span>
                    <h4 className="heading-display text-xs text-milan-ivory font-serif tracking-widest">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-xs text-milan-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))
            : null}
        </div>
      </section>

      {/* SECTION 7: CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="border border-milan-border p-12 md:p-16 text-center space-y-8 bg-milan-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(197,160,89,0.05),transparent_60%)] pointer-events-none" />
          <span className="text-eyebrow">Start Your Journey</span>
          <h2 className="heading-display text-3xl sm:text-4xl text-milan-ivory max-w-xl mx-auto font-serif">
            Ready to design your space?
          </h2>
          <p className="text-body max-w-md mx-auto text-xs sm:text-sm">
            Partner with MILAN INTERIO to create refined, functional, and timeless interiors customized specifically for your lifestyle.
          </p>
          <div className="pt-4">
            <Link
              href="/contact"
              className="inline-block border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold px-8 py-4 text-xs tracking-widest font-semibold uppercase transition-all duration-300"
            >
              Request Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
