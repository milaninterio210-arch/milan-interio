import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about MILAN INTERIO — our vision, mission, design philosophy, and commitment to creating elegant and functional interiors.",
};

export default async function AboutPage() {
  const supabase = await createClient();

  // 1. Fetch site settings
  const { data: settings } = await supabase
    .from("site_settings")
    .select("brand_name, design_philosophy_explanation")
    .eq("singleton_key", "default")
    .single();

  // 2. Fetch about content singleton
  const { data: about } = await supabase
    .from("about_content")
    .select("introduction, vision, mission, quality_commitment, our_promise, why_milan")
    .eq("singleton_key", "default")
    .single();

  // Split why_milan points by newline if present
  const whyMilanPoints = about?.why_milan
    ? about.why_milan.split("\n").filter((p: string) => p.trim() !== "")
    : [
        "Design Excellence",
        "Attention to Detail",
        "Quality Craftsmanship",
        "Personalized Solutions",
        "Integrated Execution",
        "Premium Experience",
      ];

  return (
    <div className="space-y-32 py-24 pb-32 px-6">
      {/* Header Introduction */}
      <section className="max-w-4xl mx-auto text-center space-y-6 animate-fade-up">
        <p className="text-eyebrow">ABOUT US</p>
        <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl text-milan-ivory font-serif tracking-wide font-light">
          {settings?.brand_name || "MILAN INTERIO"}
        </h1>
        <p className="text-body-lg max-w-2xl mx-auto italic font-serif text-milan-gold">
          &ldquo;{about?.introduction || "Premium interior design and fit-out."}&rdquo;
        </p>
      </section>

      {/* Vision & Mission */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-b border-milan-border py-16">
        {/* Vision */}
        <div className="space-y-4">
          <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
            OUR VISION
          </span>
          <h2 className="heading-display text-xl sm:text-2xl text-milan-ivory font-serif">
            Distinctive design, superior craftsmanship.
          </h2>
          <p className="text-xs text-milan-muted leading-relaxed font-light">
            {about?.vision || "To become a trusted premium interior design and fit-out brand recognized for distinctive design, superior craftsmanship, and exceptional client experiences."}
          </p>
        </div>

        {/* Mission */}
        <div className="space-y-4">
          <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
            OUR MISSION
          </span>
          <h2 className="heading-display text-xl sm:text-2xl text-milan-ivory font-serif">
            Reflecting individuality, enhancing experience.
          </h2>
          <p className="text-xs text-milan-muted leading-relaxed font-light">
            {about?.mission || "To create elegant and functional interiors that reflect individuality, enhance everyday experiences, and deliver lasting value."}
          </p>
        </div>
      </section>

      {/* Why Milan Interio */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-4">
          <span className="text-eyebrow">THE STANDARD</span>
          <h2 className="heading-display text-2xl sm:text-3xl text-milan-ivory font-serif">
            Why Partner With Us?
          </h2>
          <p className="text-xs text-milan-muted leading-relaxed">
            Our approach blends architectural discipline with sensory balance. We focus on details that shape the feeling of a home.
          </p>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {whyMilanPoints.map((point: string, index: number) => {
            // Check if point has title and description split by " — "
            const parts = point.split(" — ");
            const title = parts[0]?.replace("- ", "") || point;
            const description = parts[1] || null;

            return (
              <div key={index} className="space-y-2 border-l border-milan-border pl-6 hover:border-milan-gold transition-colors duration-300">
                <span className="text-[10px] font-mono text-milan-gold block">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="heading-display text-xs text-milan-ivory font-serif tracking-widest uppercase">
                  {title}
                </h3>
                {description && (
                  <p className="text-xs text-milan-muted leading-relaxed font-light">
                    {description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Quality Commitment & Our Promise */}
      <section className="max-w-5xl mx-auto bg-milan-charcoal/20 border border-milan-border p-12 space-y-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.03),transparent_70%)] pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          {/* Quality commitment */}
          <div className="space-y-4">
            <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
              QUALITY COMMITMENT
            </span>
            <p className="text-xs text-milan-muted leading-relaxed italic font-serif">
              &ldquo;{about?.quality_commitment || "Quality throughout the project lifecycle, including design, material selection, workmanship, installation, finishing and final inspection."}&rdquo;
            </p>
          </div>

          {/* Promise */}
          <div className="space-y-4 flex flex-col justify-center">
            <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
              OUR PROMISE
            </span>
            <blockquote className="heading-display text-xl sm:text-2xl text-milan-ivory font-serif leading-snug">
              &ldquo;{about?.our_promise || "Your vision. Our design. Exceptional execution."}&rdquo;
            </blockquote>
          </div>
        </div>
      </section>
    </div>
  );
}
