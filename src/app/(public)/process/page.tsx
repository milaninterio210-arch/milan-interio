import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ConsultationCTA from "@/components/public/ConsultationCTA";

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
    <div className="py-10 sm:py-14">
      {/* Header */}
      <section className="px-4 text-center space-y-5 mb-16 sm:mb-24 animate-fade-up">
        <p className="text-eyebrow">METHODOLOGY</p>
        <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl text-milan-ivory max-w-3xl mx-auto">
          THE PROCESS
        </h1>
        <p className="text-body max-w-xl mx-auto text-sm sm:text-base">
          Six structured phases that guide every project from initial discovery through final handover.
        </p>
      </section>

      {/* Methodology Phases Grid — Borderless Luxury Design */}
      <section className="px-4 mb-16 sm:mb-10">
        <div className="max-w-7xl mx-auto">
          {steps && steps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {steps.map((step) => (
                <div
                  key={step.step_number}
                  className="group p-4 sm:p-10 bg-milan-charcoal/25 hover:bg-milan-charcoal/50 transition-all duration-300 space-y-4"
                >
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-2xl sm:text-3xl font-mono text-milan-gold font-light">
                      {step.step_number}
                    </span>
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-milan-gold/60">
                      PHASE
                    </span>
                  </div>
                  <h2 className="heading-display text-lg sm:text-xl text-milan-ivory uppercase tracking-wider group-hover:text-milan-gold transition-colors font-semibold">
                    {step.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-milan-muted leading-relaxed font-light group-hover:text-milan-ivory/80 transition-colors">
                    {step.description}
                  </p>
                </div>
              ))}
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
      <ConsultationCTA />
    </div>
  );
}
