import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Process",
  description:
    "Discover the six stages of the MILAN INTERIO standard — Discover, Concept, Develop, Execute, Refine, and Handover.",
};

export default async function ProcessPage() {
  const supabase = await createClient();

  const { data: steps } = await supabase
    .from("process_steps")
    .select("step_number, title, description")
    .order("step_number", { ascending: true });

  return (
    <div className="py-20 sm:py-24">
      {/* Header */}
      <section className="px-6 text-center space-y-5 mb-16 sm:mb-24 animate-fade-up">
        <p className="text-eyebrow">METHODOLOGY</p>
        <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl text-milan-ivory max-w-3xl mx-auto">
          THE PROCESS
        </h1>
        <p className="text-body max-w-xl mx-auto text-sm sm:text-base">
          Six structured phases that guide every project from initial discovery through final handover.
        </p>
      </section>

      {/* Timeline */}
      <section className="px-6 mb-16 sm:mb-24">
        <div className="max-w-4xl mx-auto">
          {steps && steps.length > 0 ? (
            <div className="relative">
              {/* Vertical connector line — visible on sm+ */}
              <div className="hidden sm:block absolute left-[31px] top-4 bottom-4 w-px bg-milan-border" />

              <div className="space-y-6 sm:space-y-10">
                {steps.map((step) => (
                  <div key={step.step_number} className="flex gap-5 sm:gap-8">
                    {/* Step badge */}
                    <div className="relative z-10 w-16 h-16 shrink-0 flex items-center justify-center border border-milan-gold bg-milan-primary text-milan-gold font-mono text-sm">
                      {step.step_number}
                    </div>

                    {/* Content */}
                    <div className="border border-milan-border p-5 sm:p-8 flex-1 hover:border-milan-gold/20 transition-colors duration-300 space-y-3">
                      <h2 className="heading-display text-base sm:text-xl text-milan-ivory">
                        {step.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-milan-muted leading-relaxed font-light">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-milan-muted font-light">
                Process methodology details are being finalized.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6">
        <div className="max-w-4xl mx-auto border border-milan-border p-10 sm:p-16 text-center space-y-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(197,160,89,0.04),transparent_60%)] pointer-events-none" />
          <span className="text-eyebrow relative z-10">BEGIN THE JOURNEY</span>
          <h2 className="heading-editorial text-xl sm:text-2xl text-milan-ivory max-w-lg mx-auto leading-snug relative z-10">
            Start with a conversation.
          </h2>
          <p className="text-body max-w-md mx-auto text-sm relative z-10">
            Every exceptional interior begins with understanding your vision, lifestyle, and spatial requirements.
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
