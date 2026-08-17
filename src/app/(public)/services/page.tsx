import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore MILAN INTERIO's premium interior design services — from space planning and luxury residential interiors to turnkey fit-outs and custom joinery.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Phase 6: Seven service categories with editorial grid layout */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-eyebrow mb-6 text-center">What We Do</p>
          <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl text-milan-ivory mb-16 text-center">
            OUR SERVICES
          </h1>
        </div>
      </section>
    </div>
  );
}
