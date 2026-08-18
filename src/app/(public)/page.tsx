import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import HeroCarousel from "@/components/public/HeroCarousel";

export default async function HomePage() {
  const supabase = await createClient();

  // 1. Fetch site settings
  const { data: settings } = await supabase
    .from("site_settings")
    .select("brand_name, primary_tagline, supporting_tagline, design_philosophy, design_philosophy_explanation")
    .eq("singleton_key", "default")
    .single();

  // 2. Fetch active hero content
  const { data: heroSlides } = await supabase
    .from("hero_content")
    .select("eyebrow, heading, subheading, background_image_url, primary_cta_label, primary_cta_url, secondary_cta_label, secondary_cta_url")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  // 3. Fetch pillars
  const { data: pillars } = await supabase
    .from("pillars")
    .select("pillar_number, title, description")
    .order("pillar_number", { ascending: true });

  // 4. Fetch services (first 4 for homepage preview)
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

  // 6. Fetch process steps (first 3 for homepage preview)
  const { data: processSteps } = await supabase
    .from("process_steps")
    .select("step_number, title, description")
    .order("step_number", { ascending: true })
    .limit(3);

  return (
    <div>
      {/* ================================================================
          SECTION 1: HERO
          ================================================================ */}
      <HeroCarousel slides={heroSlides || []} />

      {/* ================================================================
          SECTION 2: BRAND STATEMENT
          ================================================================ */}
      <section className="py-20 sm:py-28 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <span className="text-eyebrow">The Milan Standard</span>
          <h2 className="heading-editorial text-xl sm:text-2xl md:text-3xl text-milan-ivory leading-snug">
            Luxury is not defined by excess.
            <br className="hidden sm:inline" />
            {" "}It is defined by precision.
          </h2>
          <p className="text-body max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {settings?.design_philosophy_explanation || "We believe luxury is not simply about expensive materials. True luxury comes from proportion, craftsmanship, material harmony, lighting, functionality, and attention to detail."}
          </p>
        </div>
      </section>

      {/* ================================================================
          SECTION 3: BRAND PILLARS
          ================================================================ */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="border-b border-milan-border pb-4 mb-10 sm:mb-12">
            <span className="text-eyebrow">Our Pillars</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
            {pillars && pillars.length > 0 ? (
              pillars.map((pillar) => (
                <div
                  key={pillar.pillar_number}
                  className="space-y-3 border-l border-milan-border pl-5 sm:pl-6 hover:border-milan-gold transition-colors duration-300"
                >
                  <span className="text-xs font-mono text-milan-gold block">
                    {pillar.pillar_number}
                  </span>
                  <h3 className="heading-display text-sm sm:text-base text-milan-ivory tracking-wider">
                    {pillar.title}
                  </h3>
                  {pillar.description && (
                    <p className="text-xs text-milan-muted leading-relaxed hidden sm:block">
                      {pillar.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              ["PROPORTION", "MATERIAL", "CRAFT", "DETAIL"].map((title, i) => (
                <div key={title} className="space-y-3 border-l border-milan-border pl-5 sm:pl-6">
                  <span className="text-xs font-mono text-milan-gold block">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="heading-display text-sm sm:text-base text-milan-ivory tracking-wider">{title}</h3>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 4: SELECTED PROJECTS
          ================================================================ */}
      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="border-b border-milan-border pb-4 mb-10 sm:mb-12 flex items-end justify-between">
            <span className="text-eyebrow">Selected Work</span>
            <Link
              href="/projects"
              className="text-[10px] tracking-widest text-milan-muted hover:text-milan-gold uppercase flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ChevronRight size={12} />
            </Link>
          </div>

          {featuredProjects && featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {featuredProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group block space-y-4"
                >
                  <div className="aspect-[4/3] bg-milan-charcoal border border-milan-border overflow-hidden">
                    {project.cover_image_url ? (
                      <img
                        src={project.cover_image_url}
                        alt={project.title}
                        className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-milan-muted uppercase tracking-wider">
                        Image Pending
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] tracking-wider text-milan-gold uppercase font-mono">
                      {project.category}{project.location ? ` · ${project.location}` : ""}
                    </span>
                    <h3 className="heading-display text-sm sm:text-base text-milan-ivory group-hover:text-milan-gold transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-milan-border p-10 sm:p-14 text-center max-w-lg mx-auto space-y-4">
              <p className="text-sm text-milan-muted font-light leading-relaxed">
                Our portfolio is currently being curated.
              </p>
              <Link
                href="/contact"
                className="inline-block border border-milan-gold px-6 py-3 text-[10px] tracking-widest text-milan-gold hover:bg-milan-gold hover:text-milan-primary font-semibold uppercase transition-colors"
              >
                Discuss Your Project
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================
          SECTION 5: SERVICES OVERVIEW
          ================================================================ */}
      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="border-b border-milan-border pb-4 mb-10 sm:mb-12 flex items-end justify-between">
            <span className="text-eyebrow">Our Expertise</span>
            <Link
              href="/services"
              className="text-[10px] tracking-widest text-milan-muted hover:text-milan-gold uppercase flex items-center gap-1 transition-colors"
            >
              <span>All Services</span>
              <ChevronRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {services?.map((service, idx) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group bg-milan-charcoal/20 border border-milan-border p-6 sm:p-8 flex flex-col justify-between min-h-[200px] sm:min-h-[220px] hover:border-milan-gold/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono text-milan-gold">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <ArrowRight size={14} className="text-milan-muted group-hover:text-milan-gold group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
                <div className="space-y-2 mt-auto">
                  <h3 className="heading-display text-base sm:text-lg text-milan-ivory group-hover:text-milan-gold transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-milan-muted line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 6: PROCESS PREVIEW
          ================================================================ */}
      {processSteps && processSteps.length > 0 && (
        <section className="py-16 sm:py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="border-b border-milan-border pb-4 mb-10 sm:mb-12 flex items-end justify-between">
              <span className="text-eyebrow">Design Journey</span>
              <Link
                href="/process"
                className="text-[10px] tracking-widest text-milan-muted hover:text-milan-gold uppercase flex items-center gap-1 transition-colors"
              >
                <span>Full Process</span>
                <ChevronRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {processSteps.map((step) => (
                <div key={step.step_number} className="space-y-3 p-6 border border-milan-border hover:border-milan-gold/20 transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-milan-gold border border-milan-gold/20 px-2 py-0.5 bg-milan-emerald/30">
                      {step.step_number}
                    </span>
                    <h3 className="heading-display text-xs text-milan-ivory tracking-widest">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-milan-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================
          SECTION 7: CONSULTATION CTA
          ================================================================ */}
      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-4xl mx-auto border border-milan-border p-10 sm:p-16 text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(197,160,89,0.04),transparent_60%)] pointer-events-none" />
          <span className="text-eyebrow relative z-10">Start Your Journey</span>
          <h2 className="heading-editorial text-xl sm:text-2xl md:text-3xl text-milan-ivory max-w-lg mx-auto leading-snug relative z-10">
            Ready to design your space?
          </h2>
          <p className="text-body max-w-md mx-auto text-sm relative z-10">
            Partner with MILAN INTERIO to create refined, functional, and timeless interiors.
          </p>
          <div className="pt-2 relative z-10">
            <Link
              href="/contact"
              className="inline-block border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold px-8 py-3.5 text-[11px] tracking-widest font-semibold uppercase transition-all duration-300"
            >
              Request Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
