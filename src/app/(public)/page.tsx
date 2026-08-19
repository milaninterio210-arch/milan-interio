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
      <section className="py-20 sm:py-28 px-6 border-t border-milan-border/60">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Brand Statement (Span 4) */}
            <div className="lg:col-span-4 space-y-6 text-left animate-fade-up">
              <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
                THE MILAN STANDARD
              </span>
              <h2 className="heading-editorial text-2xl sm:text-3xl text-milan-ivory leading-tight font-serif">
                Luxury is not
                <br />
                defined by excess.
                <br />
                It is defined by
                <br />
                precision.
              </h2>
              <p className="text-body text-xs sm:text-sm text-milan-muted leading-relaxed font-light">
                {settings?.design_philosophy_explanation || "From proportion and material harmony to lighting, craftsmanship and detailing, every element is considered to create spaces that feel effortless, refined and timeless."}
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-milan-gold hover:text-milan-ivory text-[10px] tracking-widest font-semibold uppercase transition-colors group"
                >
                  <span>DISCOVER OUR PHILOSOPHY</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Column: 4 Pillars Grid (Span 8) */}
            <div className="lg:col-span-8 animate-fade-up">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-milan-border/60">
                {Array.from({ length: 4 }).map((_, idx) => {
                  const defaultTitles = ["PROPORTION", "MATERIAL", "CRAFT", "DETAIL"];
                  const defaultDescs = [
                    "Balanced spaces crafted with purpose and intention.",
                    "The finest materials, selected with care.",
                    "Expert craftsmanship in every detail.",
                    "Finishing touches that complete the experience."
                  ];
                  const icons = [
                    <Scale key="s" size={24} strokeWidth={1.5} className="text-milan-gold/80" />,
                    <Gem key="g" size={24} strokeWidth={1.5} className="text-milan-gold/80" />,
                    <Hammer key="h" size={24} strokeWidth={1.5} className="text-milan-gold/80" />,
                    <Sparkles key="sp" size={24} strokeWidth={1.5} className="text-milan-gold/80" />
                  ];

                  const pillar = pillars?.[idx];
                  const title = pillar?.title || defaultTitles[idx];
                  const desc = pillar?.description || defaultDescs[idx];
                  const num = pillar?.pillar_number || String(idx + 1).padStart(2, "0");

                  return (
                    <div
                      key={idx}
                      className="space-y-4 pt-6 md:pt-0 md:px-6 first:pl-0 last:pr-0"
                    >
                      {/* Pillar Icon */}
                      <div className="p-2 border border-milan-gold/10 bg-milan-charcoal/10 inline-block">
                        {icons[idx]}
                      </div>

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
            {services?.map((service, idx) => {
              const hasBg = !!service.image_url;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className={`group relative border p-6 sm:p-8 flex flex-col justify-between min-h-[200px] sm:min-h-[220px] overflow-hidden transition-all duration-300 ${
                    hasBg
                      ? "border-milan-border/60 hover:border-milan-gold bg-milan-charcoal"
                      : "bg-milan-charcoal/20 border-milan-border hover:border-milan-gold/30"
                  }`}
                >
                  {/* Background Image block */}
                  {hasBg && (
                    <>
                      <img
                        src={service.image_url}
                        alt={service.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-[1.03] transition-transform duration-700 ease-in-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-milan-primary/95 via-milan-primary/60 to-transparent pointer-events-none" />
                    </>
                  )}

                  {/* Card content */}
                  <div className="flex items-start justify-between relative z-10">
                    <span className="text-xs font-mono text-milan-gold">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <ArrowRight size={14} className="text-milan-muted group-hover:text-milan-gold group-hover:translate-x-0.5 transition-all duration-200" />
                  </div>
                  
                  <div className="space-y-2 mt-auto relative z-10 text-left">
                    <h3 className="heading-display text-base sm:text-lg text-milan-ivory group-hover:text-milan-gold transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-milan-muted line-clamp-2 leading-relaxed">
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
          {/* Background image overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
              alt=""
              className="w-full h-full object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-milan-primary via-transparent to-milan-primary pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(197,160,89,0.06),transparent_60%)] pointer-events-none" />
          </div>
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
