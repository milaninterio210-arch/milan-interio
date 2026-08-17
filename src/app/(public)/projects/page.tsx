import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore MILAN INTERIO's portfolio of luxury interior design projects across residential, commercial, hospitality, office, and retail spaces.",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      {/* Phase 7: Filterable project grid with category tabs */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-eyebrow mb-6 text-center">Portfolio</p>
          <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl text-milan-ivory mb-16 text-center">
            OUR PROJECTS
          </h1>
          {/* Empty state: shown when no published projects exist */}
          <div className="text-center py-16">
            <p className="text-milan-muted text-body">
              Projects coming soon.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
