import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about MILAN INTERIO — our vision, mission, design philosophy, and commitment to creating elegant and functional interiors.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Phase 6: Introduction, Vision, Mission, Philosophy, Quality, Promise */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-eyebrow mb-6">About Us</p>
          <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl text-milan-ivory mb-8">
            MILAN INTERIO
          </h1>
          <p className="text-body-lg max-w-2xl mx-auto">
            Elegant. Functional. Timeless.
          </p>
        </div>
      </section>
    </div>
  );
}
