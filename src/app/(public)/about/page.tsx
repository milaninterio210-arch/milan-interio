import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Compass, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about MILAN INTERIO — our vision, mission, design philosophy, and commitment to creating elegant and functional interiors.",
};

export default async function AboutPage() {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("brand_name, design_philosophy_explanation")
    .eq("singleton_key", "default")
    .single();

  const { data: about } = await supabase
    .from("about_content")
    .select("introduction, vision, mission, design_philosophy, quality_commitment, our_promise, why_milan, banner_image_url")
    .eq("singleton_key", "default")
    .single();

  const introParagraphs = about?.introduction
    ? about.introduction.split("\n").filter((p: string) => p.trim() !== "")
    : [
        "MILAN INTERIO is a premium interior design and fit-out company dedicated to creating sophisticated, functional, and timeless spaces.",
        "We transform residential, commercial, hospitality, and corporate environments through creative interior design, architectural detailing, quality materials, precision craftsmanship, and professional project execution.",
        "Our approach is centred on understanding each client's lifestyle, vision, brand identity, and functional requirements, then translating them into carefully considered interior environments.",
        "From the first concept to final handover, MILAN INTERIO provides a coordinated interior solution with attention to every detail.",
      ];

  const defaultPhilosophy = [
    "We believe luxury is not simply about expensive materials",
    "True luxury comes from proportion, craftsmanship, material harmony, lighting, functionality, and attention to detail",
    "Every project is developed around a clear design concept and executed with precision"
  ];

  const philosophyPoints = settings?.design_philosophy_explanation
    ? settings.design_philosophy_explanation.split(/[.!?]+/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    : [];

  const pointsToShow = [
    philosophyPoints[0] || defaultPhilosophy[0],
    philosophyPoints[1] || defaultPhilosophy[1],
    philosophyPoints[2] || defaultPhilosophy[2],
  ];

  return (
    <div className="py-20 sm:py-28 space-y-24 sm:space-y-32">
      {/* SECTION 1: HERO (2-Column about details) */}
      <section className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-stretch justify-between gap-12 lg:gap-16">
        {/* Left Column: text description */}
        <div className="w-full lg:w-1/2 space-y-6 text-left animate-fade-up">
          <p className="text-eyebrow tracking-widest text-milan-gold">ABOUT</p>
          <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl text-milan-ivory leading-tight font-serif uppercase">
            {settings?.brand_name || "MILAN INTERIO"}
          </h1>
          <div className="space-y-4 text-body text-xs sm:text-sm text-milan-muted leading-relaxed font-light">
            {introParagraphs.map((para: string, idx: number) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </div>

        {/* Right Column: display image */}
        <div className="w-full lg:w-1/2 aspect-[4/3] bg-milan-charcoal overflow-hidden border border-milan-border/60 relative animate-fade-up">
          <img
            src={about?.banner_image_url || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"}
            alt="Milan Interio showroom lobby reception desk"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-milan-primary/10 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* SECTION 2: VISION & MISSION */}
      <section className="max-w-7xl mx-auto px-6 animate-fade-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 border-t border-b border-milan-border/60 py-16 sm:py-20">
          {/* Vision */}
          <div className="flex items-start gap-4">
            <div className="p-3 border border-milan-gold/20 bg-milan-charcoal/20 shrink-0 text-milan-gold">
              <Compass size={24} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-mono tracking-wider text-milan-gold uppercase">
                OUR VISION
              </h3>
              <p className="text-xs sm:text-sm text-milan-muted leading-relaxed font-light">
                {about?.vision || "To become a trusted premium interior design and fit-out brand recognized for distinctive design, superior craftsmanship, and exceptional client experiences."}
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="flex items-start gap-4">
            <div className="p-3 border border-milan-gold/20 bg-milan-charcoal/20 shrink-0 text-milan-gold">
              <Target size={24} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-mono tracking-wider text-milan-gold uppercase">
                OUR MISSION
              </h3>
              <p className="text-xs sm:text-sm text-milan-muted leading-relaxed font-light">
                {about?.mission || "To create elegant and functional interiors that reflect individuality, enhance everyday experiences, and deliver lasting value."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: DESIGN PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-6 text-center space-y-12 sm:space-y-16 animate-fade-up">
        <div className="space-y-3">
          <p className="text-eyebrow tracking-widest text-milan-gold">OUR DESIGN PHILOSOPHY</p>
          <h2 className="heading-editorial text-2xl sm:text-3xl md:text-4xl text-milan-ivory font-serif">
            {about?.design_philosophy || "Elegant. Functional. Timeless."}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Column 1 */}
          <div className="space-y-4 text-left">
            <div className="aspect-[16/10] bg-milan-charcoal border border-milan-border overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
                alt="Marble details"
                className="w-full h-full object-cover grayscale brightness-95"
              />
            </div>
            <p className="text-xs sm:text-sm text-milan-muted leading-relaxed font-light">
              {pointsToShow[0]}.
            </p>
          </div>

          {/* Column 2 */}
          <div className="space-y-4 text-left">
            <div className="aspect-[16/10] bg-milan-charcoal border border-milan-border overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80"
                alt="Luxury chair proportion"
                className="w-full h-full object-cover grayscale brightness-95"
              />
            </div>
            <p className="text-xs sm:text-sm text-milan-muted leading-relaxed font-light">
              {pointsToShow[1]}.
            </p>
          </div>

          {/* Column 3 */}
          <div className="space-y-4 text-left">
            <div className="aspect-[16/10] bg-milan-charcoal border border-milan-border overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80"
                alt="Precision execution close-up leaf"
                className="w-full h-full object-cover grayscale brightness-95"
              />
            </div>
            <p className="text-xs sm:text-sm text-milan-muted leading-relaxed font-light">
              {pointsToShow[2]}.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
