import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio Archive",
  description:
    "Explore the MILAN INTERIO studio archive — a curated photography collection of luxury, architectural interior design elements.",
};

export default function StudioPage() {
  return (
    <div className="min-h-screen">
      {/* Phase 8: Masonry photography archive with fullscreen lightbox */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-eyebrow mb-6 text-center">Archive</p>
          <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl text-milan-ivory mb-16 text-center">
            THE STUDIO
          </h1>
          {/* Empty state: shown when no published images exist */}
          <div className="text-center py-16">
            <p className="text-milan-muted text-body">
              Studio archive collections are currently being curated.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
