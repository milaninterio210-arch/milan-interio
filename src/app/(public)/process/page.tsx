import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Process",
  description:
    "Discover the six stages of the MILAN INTERIO standard — Discover, Concept, Develop, Execute, Refine, and Handover.",
};

export default function ProcessPage() {
  return (
    <div className="min-h-screen">
      {/* Phase 6: Timeline timeline display (horizontal on desktop, vertical on mobile) */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-eyebrow mb-6 text-center">Methodology</p>
          <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl text-milan-ivory mb-16 text-center">
            THE PROCESS
          </h1>
        </div>
      </section>
    </div>
  );
}
