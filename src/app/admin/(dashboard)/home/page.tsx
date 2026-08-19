import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Sliders,
  Compass,
  Briefcase,
  Wrench,
  Milestone,
  Megaphone,
  ArrowRight,
  Star,
  CheckCircle2,
  Image,
} from "lucide-react";

export default async function AdminHomePage() {
  const supabase = await createClient();

  // 1. Fetch active hero slides
  const { data: heroSlides, error: heroError } = await supabase
    .from("hero_content")
    .select("id, heading, background_image_url, is_active")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  // 2. Fetch site settings (design philosophy)
  const { data: settings, error: settingsError } = await supabase
    .from("site_settings")
    .select("design_philosophy, design_philosophy_explanation")
    .eq("singleton_key", "default")
    .single();

  // 3. Fetch pillars
  const { data: pillars, error: pillarsError } = await supabase
    .from("pillars")
    .select("pillar_number, title")
    .order("pillar_number", { ascending: true });

  // 4. Fetch featured + published projects (matches frontend: is_featured=true, is_published=true, limit 3)
  const { data: featuredProjects, error: featuredError } = await supabase
    .from("projects")
    .select("id, slug, title, category, cover_image_url, is_featured, is_published")
    .eq("is_featured", true)
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .limit(3);

  // 5. Fetch all services (to show total count + first 4 for home preview)
  const { count: totalServicesCount } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true });

  const { data: homeServices, error: servicesError } = await supabase
    .from("services")
    .select("title, display_order")
    .order("display_order", { ascending: true })
    .limit(4);

  // 6. Fetch all process steps (to show total count + first 3 for home preview)
  const { count: totalProcessCount } = await supabase
    .from("process_steps")
    .select("*", { count: "exact", head: true });

  const { data: homeProcessSteps, error: processError } = await supabase
    .from("process_steps")
    .select("step_number, title")
    .order("step_number", { ascending: true })
    .limit(3);

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <header className="pb-6 border-b border-milan-border">
        <h1 className="heading-display text-3xl text-milan-ivory font-serif tracking-wide">
          HOME PAGE
        </h1>
        <p className="text-xs text-milan-muted mt-1 font-mono">
          Manage the content and sections displayed on the Milan Interio homepage. Each section is managed from its source-of-truth admin page.
        </p>
      </header>

      {/* Content Map Grid */}
      <div className="space-y-6">

        {/* ─── 01 HERO ─── */}
        <section className="bg-milan-primary border border-milan-border p-6 hover:border-milan-gold/20 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-milan-gold border border-milan-gold/20 px-2 py-0.5 bg-milan-emerald/30">
                  01
                </span>
                <Sliders size={16} className="text-milan-gold/80" />
                <h2 className="heading-display text-sm text-milan-ivory tracking-widest uppercase">
                  HERO
                </h2>
              </div>

              {heroError ? (
                <p className="text-xs text-red-400 font-mono">Failed to load hero data.</p>
              ) : !heroSlides || heroSlides.length === 0 ? (
                <div className="space-y-1">
                  <p className="text-xs text-milan-muted">No active hero slides configured.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-milan-muted font-mono">
                    <span className="text-milan-ivory font-semibold">{heroSlides.length}</span> active slide{heroSlides.length !== 1 ? "s" : ""}
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {heroSlides.map((slide, idx) => (
                      <div key={slide.id} className="flex items-center gap-2">
                        <div className="w-16 h-10 bg-milan-charcoal border border-milan-border overflow-hidden shrink-0">
                          {slide.background_image_url ? (
                            <img
                              src={slide.background_image_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[7px] text-milan-muted font-mono">
                              No IMG
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-milan-ivory truncate max-w-[160px]" title={slide.heading}>
                            {slide.heading}
                          </p>
                          <span className="text-[9px] text-milan-muted font-mono">Slide {idx + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[10px] text-milan-muted/70 italic">
                Managed from Hero Banner
              </p>
            </div>

            <Link
              href="/admin/hero"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 border border-milan-border text-milan-gold hover:border-milan-gold hover:bg-milan-gold/5 text-[10px] tracking-widest font-semibold uppercase transition-all duration-200"
            >
              <span>Manage Hero</span>
              <ArrowRight size={10} />
            </Link>
          </div>
        </section>

        {/* ─── 02 MILAN STANDARD / PHILOSOPHY ─── */}
        <section className="bg-milan-primary border border-milan-border p-6 hover:border-milan-gold/20 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-milan-gold border border-milan-gold/20 px-2 py-0.5 bg-milan-emerald/30">
                  02
                </span>
                <Compass size={16} className="text-milan-gold/80" />
                <h2 className="heading-display text-sm text-milan-ivory tracking-widest uppercase">
                  MILAN STANDARD
                </h2>
              </div>

              {settingsError && pillarsError ? (
                <p className="text-xs text-red-400 font-mono">Failed to load philosophy data.</p>
              ) : (
                <div className="space-y-3">
                  {/* Design Philosophy */}
                  <div className="space-y-1">
                    <span className="text-[9px] tracking-wider text-milan-muted uppercase font-mono">
                      Design Philosophy
                    </span>
                    <p className="text-xs text-milan-ivory italic font-serif">
                      &ldquo;{settings?.design_philosophy || "Elegant. Functional. Timeless."}&rdquo;
                    </p>
                  </div>

                  {/* Pillars */}
                  <div className="space-y-1">
                    <span className="text-[9px] tracking-wider text-milan-muted uppercase font-mono">
                      Brand Pillars — {pillars?.length ?? 0} configured
                    </span>
                    {pillars && pillars.length > 0 && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {pillars.map((pillar) => (
                          <span key={pillar.pillar_number} className="text-[10px] text-milan-muted">
                            <span className="text-milan-gold font-mono">{pillar.pillar_number}</span>{" "}
                            {pillar.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <p className="text-[10px] text-milan-muted/70 italic">
                Managed from Site Settings + Brand Pillars
              </p>
            </div>

            <div className="shrink-0 flex flex-col gap-2">
              <Link
                href="/admin/settings"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-milan-border text-milan-gold hover:border-milan-gold hover:bg-milan-gold/5 text-[10px] tracking-widest font-semibold uppercase transition-all duration-200"
              >
                <span>Edit Settings</span>
                <ArrowRight size={10} />
              </Link>
              <Link
                href="/admin/pillars"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-milan-border text-milan-gold hover:border-milan-gold hover:bg-milan-gold/5 text-[10px] tracking-widest font-semibold uppercase transition-all duration-200"
              >
                <span>Manage Pillars</span>
                <ArrowRight size={10} />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── 03 FEATURED PROJECTS ─── */}
        <section className="bg-milan-primary border border-milan-border p-6 hover:border-milan-gold/20 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-milan-gold border border-milan-gold/20 px-2 py-0.5 bg-milan-emerald/30">
                  03
                </span>
                <Briefcase size={16} className="text-milan-gold/80" />
                <h2 className="heading-display text-sm text-milan-ivory tracking-widest uppercase">
                  FEATURED PROJECTS
                </h2>
              </div>

              {featuredError ? (
                <p className="text-xs text-red-400 font-mono">Failed to load featured projects.</p>
              ) : !featuredProjects || featuredProjects.length === 0 ? (
                <div className="space-y-1">
                  <p className="text-xs text-milan-muted">
                    No published project is currently marked as Featured.
                  </p>
                  <p className="text-[10px] text-milan-muted/70">
                    Mark a project as Featured and Published in the Projects editor to display it on the homepage.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-milan-muted font-mono">
                    <span className="text-milan-ivory font-semibold">{featuredProjects.length}</span> featured project{featuredProjects.length !== 1 ? "s" : ""} on Home
                  </p>
                  <div className="space-y-2">
                    {featuredProjects.map((project) => (
                      <div key={project.id} className="flex items-center gap-3">
                        {/* Thumbnail */}
                        <div className="w-14 h-10 bg-milan-charcoal border border-milan-border overflow-hidden shrink-0">
                          {project.cover_image_url ? (
                            <img
                              src={project.cover_image_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image size={12} className="text-milan-muted/50" />
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-milan-ivory font-semibold truncate">
                            {project.title}
                          </p>
                          <p className="text-[10px] text-milan-muted font-mono">
                            {project.category}
                          </p>
                        </div>
                        {/* Status badges */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="inline-flex items-center gap-1 text-emerald-400 text-[9px] font-mono uppercase">
                            <CheckCircle2 size={10} />
                            Published
                          </span>
                          <span className="inline-flex items-center gap-1 text-milan-gold text-[9px] font-mono uppercase">
                            <Star size={10} className="fill-milan-gold" />
                            Featured
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[10px] text-milan-muted/70 italic">
                Managed from Projects
              </p>
            </div>

            <Link
              href="/admin/projects"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 border border-milan-border text-milan-gold hover:border-milan-gold hover:bg-milan-gold/5 text-[10px] tracking-widest font-semibold uppercase transition-all duration-200"
            >
              <span>Manage Projects</span>
              <ArrowRight size={10} />
            </Link>
          </div>
        </section>

        {/* ─── 04 SERVICES SHOWCASE ─── */}
        <section className="bg-milan-primary border border-milan-border p-6 hover:border-milan-gold/20 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-milan-gold border border-milan-gold/20 px-2 py-0.5 bg-milan-emerald/30">
                  04
                </span>
                <Wrench size={16} className="text-milan-gold/80" />
                <h2 className="heading-display text-sm text-milan-ivory tracking-widest uppercase">
                  OUR EXPERTISE
                </h2>
              </div>

              {servicesError ? (
                <p className="text-xs text-red-400 font-mono">Failed to load services data.</p>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-milan-muted font-mono">
                    <span className="text-milan-ivory font-semibold">{totalServicesCount ?? 0}</span> service{(totalServicesCount ?? 0) !== 1 ? "s" : ""} available
                    {(totalServicesCount ?? 0) > 4 && (
                      <span className="text-milan-muted"> · First 4 shown on Home</span>
                    )}
                  </p>
                  {homeServices && homeServices.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {homeServices.map((service, idx) => (
                        <span
                          key={idx}
                          className="bg-milan-emerald/50 border border-milan-border px-2.5 py-1 text-[10px] text-milan-ivory font-mono"
                        >
                          {String(idx + 1).padStart(2, "0")} {service.title}
                        </span>
                      ))}
                    </div>
                  )}
                  {(!homeServices || homeServices.length === 0) && (
                    <p className="text-xs text-milan-muted">No services configured.</p>
                  )}
                </div>
              )}

              <p className="text-[10px] text-milan-muted/70 italic">
                Managed from Services · Home displays first 4 by display order
              </p>
            </div>

            <Link
              href="/admin/services"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 border border-milan-border text-milan-gold hover:border-milan-gold hover:bg-milan-gold/5 text-[10px] tracking-widest font-semibold uppercase transition-all duration-200"
            >
              <span>Manage Services</span>
              <ArrowRight size={10} />
            </Link>
          </div>
        </section>

        {/* ─── 05 DESIGN JOURNEY ─── */}
        <section className="bg-milan-primary border border-milan-border p-6 hover:border-milan-gold/20 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-milan-gold border border-milan-gold/20 px-2 py-0.5 bg-milan-emerald/30">
                  05
                </span>
                <Milestone size={16} className="text-milan-gold/80" />
                <h2 className="heading-display text-sm text-milan-ivory tracking-widest uppercase">
                  DESIGN JOURNEY
                </h2>
              </div>

              {processError ? (
                <p className="text-xs text-red-400 font-mono">Failed to load process steps.</p>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-milan-muted font-mono">
                    <span className="text-milan-ivory font-semibold">{totalProcessCount ?? 0}</span> process step{(totalProcessCount ?? 0) !== 1 ? "s" : ""} defined
                    {(totalProcessCount ?? 0) > 3 && (
                      <span className="text-milan-muted"> · First 3 shown on Home</span>
                    )}
                  </p>
                  {homeProcessSteps && homeProcessSteps.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {homeProcessSteps.map((step) => (
                        <span
                          key={step.step_number}
                          className="bg-milan-emerald/50 border border-milan-border px-2.5 py-1 text-[10px] text-milan-ivory font-mono"
                        >
                          {step.step_number} {step.title}
                        </span>
                      ))}
                    </div>
                  )}
                  {(!homeProcessSteps || homeProcessSteps.length === 0) && (
                    <p className="text-xs text-milan-muted">No process steps configured.</p>
                  )}
                </div>
              )}

              <p className="text-[10px] text-milan-muted/70 italic">
                Managed from Process Steps · Home displays first 3 by step number
              </p>
            </div>

            <Link
              href="/admin/process"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 border border-milan-border text-milan-gold hover:border-milan-gold hover:bg-milan-gold/5 text-[10px] tracking-widest font-semibold uppercase transition-all duration-200"
            >
              <span>Manage Process</span>
              <ArrowRight size={10} />
            </Link>
          </div>
        </section>

        {/* ─── 06 CONSULTATION CTA ─── */}
        <section className="bg-milan-primary border border-milan-border p-6 hover:border-milan-gold/20 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-milan-gold border border-milan-gold/20 px-2 py-0.5 bg-milan-emerald/30">
                  06
                </span>
                <Megaphone size={16} className="text-milan-gold/80" />
                <h2 className="heading-display text-sm text-milan-ivory tracking-widest uppercase">
                  CONSULTATION CTA
                </h2>
              </div>

              <div className="space-y-2">
                <div className="space-y-1">
                  <span className="text-[9px] tracking-wider text-milan-muted uppercase font-mono">
                    Eyebrow
                  </span>
                  <p className="text-xs text-milan-ivory">Start Your Journey</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] tracking-wider text-milan-muted uppercase font-mono">
                    Heading
                  </span>
                  <p className="text-xs text-milan-ivory">Ready to design your space?</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] tracking-wider text-milan-muted uppercase font-mono">
                    CTA Button
                  </span>
                  <p className="text-xs text-milan-ivory">Request Consultation → /contact</p>
                </div>
              </div>

              <div className="bg-milan-charcoal/40 border border-milan-border/50 px-3 py-2">
                <p className="text-[10px] text-milan-muted/80 italic font-mono">
                  This section is currently hardcoded in the frontend. To make it editable, a future update can introduce CTA fields in Site Settings or a dedicated table.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
