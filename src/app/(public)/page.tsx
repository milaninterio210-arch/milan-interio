import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight, ChevronRight, Scale, Gem, Hammer, Sparkles } from "lucide-react";
import HeroCarousel from "@/components/public/HeroCarousel";
import FeaturedProjectsSlider from "@/components/public/FeaturedProjectsSlider";

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
    .select("slug, title, description, image_url, display_order")
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
      {/* ================================================================
          SECTION 2: BRAND STATEMENT & OUR PILLARS (Merged Grid Layout)
          ================================================================ */}
<section className="pt-20 pb-8 sm:pt-28 sm:pb-14 px-4">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

      {/* Left Column: Brand Statement (Span 4) */}
      <div className="lg:col-span-5 space-y-6 text-left animate-fade-up">
        <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
          THE MILAN STANDARD
        </span>

        <h2 className="heading-editorial text-2xl sm:text-3xl text-milan-ivory leading-tight font-serif">
          Luxury is not
    
          defined by excess.
          <br />
          It is defined by
   
          precision.
        </h2>

        <p className="text-body text-xs sm:text-sm text-milan-muted leading-relaxed font-light">
          {settings?.design_philosophy_explanation ||
            "From proportion and material harmony to lighting, craftsmanship and detailing, every element is considered to create spaces that feel effortless, refined and timeless."}
        </p>

        <div className="pt-2">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-milan-gold hover:text-milan-ivory text-[10px] tracking-widest font-semibold uppercase transition-colors group"
          >
            <span>DISCOVER OUR PHILOSOPHY</span>
            <ArrowRight
              size={12}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>

      {/* Right Column: 4 Pillars Grid (Span 8) */}
      <div className="lg:col-span-7 animate-fade-up">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-milan-border/60">
          {Array.from({ length: 4 }).map((_, idx) => {
            const defaultTitles = [
              "PROPORTION",
              "MATERIAL",
              "CRAFT",
              "DETAIL"
            ];

            const defaultDescs = [
              "Balanced spaces crafted with purpose and intention.",
              "The finest materials, selected with care.",
              "Expert craftsmanship in every detail.",
              "Finishing touches that complete the experience."
            ];

            const icons = [
              <Scale
                key="s"
                size={24}
                strokeWidth={1.5}
                className="text-milan-gold/80"
              />,
              <Gem
                key="g"
                size={24}
                strokeWidth={1.5}
                className="text-milan-gold/80"
              />,
              <Hammer
                key="h"
                size={24}
                strokeWidth={1.5}
                className="text-milan-gold/80"
              />,
              <Sparkles
                key="sp"
                size={24}
                strokeWidth={1.5}
                className="text-milan-gold/80"
              />
            ];

            const pillar = pillars?.[idx];
            const title = pillar?.title || defaultTitles[idx];
            const desc = pillar?.description || defaultDescs[idx];
            const num =
              pillar?.pillar_number || String(idx + 1).padStart(2, "0");

            return (
              <div
                key={idx}
                className="space-y-4 pt-6 md:pt-0 md:px-6 first:pl-0 last:pr-0"
              >
                {/* Pillar Icon */}
                {/* <div className="p-2 bg-milan-charcoal/10 inline-block">
                  {icons[idx]}
                </div> */}

                <div className="space-y-2">
                  <span className="text-base sm:text-lg font-mono text-milan-gold block leading-none">
                    {num}
                  </span>

                  <h3 className="heading-display text-[11px] sm:text-xs text-milan-ivory tracking-widest uppercase">
                    {title}
                  </h3>

                  <p className="text-body text-[11px] text-milan-muted leading-relaxed font-light">
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  </div>
</section>
      {/* ================================================================
          SECTION 4: SELECTED PROJECTS (Slider Layout)
          ================================================================ */}
      <FeaturedProjectsSlider projects={featuredProjects || []} />

      {/* ================================================================
          SECTION 5: SERVICES OVERVIEW
          ================================================================ */}
      <section className="py-7 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="pb-4 mb-10 sm:mb-12 flex items-end justify-between">
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
            {services?.map((service, idx) => {
              const hasBg = !!service.image_url;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className={`group relative p-3 sm:p-8 flex flex-col justify-between min-h-[220px] sm:min-h-[250px] overflow-hidden transition-all duration-500 ${
                    hasBg
                      ? "bg-milan-charcoal"
                      : "bg-milan-charcoal/40"
                  }`}
                >
                  {/* Background Image block: Fully visible and crisp */}
                  {hasBg && (
                    <>
                      <img
                        src={service.image_url}
                        alt={service.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                      />
                      {/* Focused gradient shielding only the text area at the bottom */}
                      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none" />
                      {/* Subtle top shade for badges */}
                      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
                    </>
                  )}

                  {/* Card header */}
           
                  
                  {/* Card content with high contrast text */}
                  <div className="space-y-2 mt-auto relative z-10 text-left pt-6">
                    <h3 className="heading-display text-base sm:text-lg text-white group-hover:text-milan-gold transition-colors duration-300 tracking-wider font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                      {service.title}
                    </h3>
                    <p className="text-xs text-white/90 group-hover:text-white line-clamp-2 leading-relaxed transition-colors duration-300 font-light drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                      {service.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          SECTION 6: PROCESS PREVIEW
          ================================================================ */}
      {processSteps && processSteps.length > 0 && (
        <section className="py-7 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="pb-4 mb-10 sm:mb-12 flex items-end justify-between border-b border-milan-border/40">
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
                <div
                  key={step.step_number}
                  className="group relative hover:border-milan-gold p-3 sm:p-8 bg-milan-charcoal/30 hover:bg-milan-charcoal/60 transition-all duration-300 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-milan-gold px-2.5 py-1 tracking-wider">
                      {step.step_number}
                    </span>
                    <h3 className="heading-display text-xs sm:text-sm text-milan-ivory tracking-widest uppercase font-semibold group-hover:text-milan-gold transition-colors">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-milan-muted leading-relaxed font-light group-hover:text-milan-ivory/80 transition-colors">
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
      <section className="py-8 sm:pb-24 sm:pt-14 px-4">
        <div className="max-w-7xl mx-auto px-6 py-14 sm:p-16 text-center space-y-4 sm:space-y-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[360px] sm:min-h-0">
          {/* Background image overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
              alt=""
              className="w-full h-full object-cover opacity-60 sm:opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-milan-primary/95 via-milan-primary/75 to-milan-primary/90 sm:from-milan-primary/80 sm:via-transparent sm:to-milan-primary/85 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(196,149,46,0.06),transparent_60%)] pointer-events-none" />
          </div>
          <span className="text-eyebrow relative z-10 tracking-[0.2em]">Start Your Journey</span>
          <h2 className="heading-editorial text-2xl sm:text-2xl md:text-3xl text-milan-ivory max-w-sm sm:max-w-lg mx-auto leading-tight sm:leading-snug relative z-10 font-serif">
            Ready to design your space?
          </h2>
          <p className="text-xs sm:text-sm text-milan-muted/90 max-w-xs sm:max-w-md mx-auto leading-relaxed relative z-10 font-light">
            Partner with MILAN INTERIO to create refined, functional, and timeless interiors.
          </p>
          <div className="pt-2 relative z-10 w-full sm:w-auto">
            <Link
              href="/contact"
              className="inline-block w-full max-w-[260px] sm:w-auto border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold px-8 py-3.5 text-[11px] tracking-widest font-semibold uppercase transition-all duration-300 text-center"
            >
              Request Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
