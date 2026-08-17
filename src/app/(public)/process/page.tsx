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

  // Fetch process steps ordered chronologically
  const { data: steps } = await supabase
    .from("process_steps")
    .select("step_number, title, description")
    .order("step_number", { ascending: true });

  return (
    <div className="space-y-32 py-24 pb-32 px-6">
      {/* Header */}
      <section className="max-w-4xl mx-auto text-center space-y-6 animate-fade-up">
        <p className="text-eyebrow">METHODOLOGY</p>
        <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl text-milan-ivory font-serif tracking-wide font-light">
          THE PROCESS
        </h1>
        <p className="text-body-lg max-w-2xl mx-auto font-light">
          Six structured phases that guide every project from initial discovery through final handover.
        </p>
      </section>

      {/* Timeline */}
      <section className="max-w-5xl mx-auto">
        {steps && steps.length > 0 ? (
          <div className="relative">
            {/* Vertical connector line — visible on md+ */}
            <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-milan-border" />

            <div className="space-y-16">
              {steps.map((step, idx) => (
                <div key={step.step_number} className="relative grid grid-cols-1 md:grid-cols-[64px_1fr] gap-6 md:gap-12">
                  {/* Step number badge */}
                  <div className="flex md:flex-col items-center md:items-center">
                    <div className="relative z-10 w-16 h-16 flex items-center justify-center border border-milan-gold bg-milan-primary text-milan-gold font-mono text-sm font-semibold">
                      {String(step.step_number).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Content card */}
                  <div className="bg-milan-primary/40 border border-milan-border p-8 md:p-10 space-y-4 hover:border-milan-gold/25 transition-colors duration-300">
                    <h2 className="heading-display text-xl sm:text-2xl text-milan-ivory font-serif">
                      {step.title}
                    </h2>
                    <p className="text-sm text-milan-muted leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-sm text-milan-muted font-light">
              Process methodology details are being finalized.
            </p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto">
        <div className="border border-milan-border p-12 md:p-16 text-center space-y-6 bg-milan-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(197,160,89,0.05),transparent_60%)] pointer-events-none" />
          <span className="text-eyebrow">BEGIN THE JOURNEY</span>
          <h2 className="heading-display text-2xl sm:text-3xl text-milan-ivory max-w-xl mx-auto font-serif">
            Start with a conversation.
          </h2>
          <p className="text-body max-w-md mx-auto text-xs sm:text-sm">
            Every exceptional interior begins with understanding your vision, lifestyle, and spatial requirements.
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
