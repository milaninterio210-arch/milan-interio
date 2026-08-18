import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

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
    .select("introduction, vision, mission, quality_commitment, our_promise, why_milan")
    .eq("singleton_key", "default")
    .single();

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
    <div className="py-20 sm:py-24">
      {/* Header */}
      <section className="px-6 text-center space-y-5 mb-16 sm:mb-24 animate-fade-up">
        <p className="text-eyebrow">ABOUT US</p>
        <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl text-milan-ivory max-w-3xl mx-auto">
          {settings?.brand_name || "MILAN INTERIO"}
        </h1>
        {about?.introduction && (
          <p className="text-body-lg max-w-xl mx-auto italic font-serif text-milan-gold text-base sm:text-lg">
            &ldquo;{about.introduction}&rdquo;
          </p>
        )}
      </section>

      {/* Vision & Mission */}
      <section className="px-6 mb-16 sm:mb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 border-t border-b border-milan-border py-12 sm:py-16">
          <div className="space-y-4">
            <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
              OUR VISION
            </span>
            <p className="text-sm sm:text-base text-milan-muted leading-relaxed font-light">
              {about?.vision || "To become a trusted premium interior design and fit-out brand recognized for distinctive design, superior craftsmanship, and exceptional client experiences."}
            </p>
          </div>
          <div className="space-y-4">
            <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
              OUR MISSION
            </span>
            <p className="text-sm sm:text-base text-milan-muted leading-relaxed font-light">
              {about?.mission || "To create elegant and functional interiors that reflect individuality, enhance everyday experiences, and deliver lasting value."}
            </p>
          </div>
        </div>
      </section>

      {/* Why Milan Interio */}
      <section className="px-6 mb-16 sm:mb-24">
        <div className="max-w-5xl mx-auto">
          <div className="border-b border-milan-border pb-4 mb-10">
            <span className="text-eyebrow">Why Milan Interio</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {whyMilanPoints.map((point: string, index: number) => {
              const title = point.replace(/^-\s*/, "").trim();
              return (
                <div key={index} className="space-y-2 border-l border-milan-border pl-5 hover:border-milan-gold transition-colors duration-300">
                  <span className="text-[10px] font-mono text-milan-gold block">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="heading-display text-[11px] sm:text-xs text-milan-ivory tracking-widest uppercase">
                    {title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quality Commitment & Our Promise */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto border border-milan-border p-8 sm:p-12 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.03),transparent_70%)] pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-4">
              <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
                QUALITY COMMITMENT
              </span>
              <p className="text-sm text-milan-muted leading-relaxed font-light">
                {about?.quality_commitment || "Quality throughout the project lifecycle, including design, material selection, workmanship, installation, finishing and final inspection."}
              </p>
            </div>
            <div className="space-y-4 flex flex-col justify-center">
              <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
                OUR PROMISE
              </span>
              <blockquote className="heading-editorial text-lg sm:text-xl text-milan-ivory leading-snug">
                &ldquo;{about?.our_promise || "Your vision. Our design. Exceptional execution."}&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
