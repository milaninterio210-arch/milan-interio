import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore MILAN INTERIO's portfolio of luxury interior design projects across residential, commercial, hospitality, office, and retail spaces.",
};

export default async function ProjectsPage() {
  const supabase = await createClient();

  // Fetch only published projects ordered by display_order
  const { data: projects } = await supabase
    .from("projects")
    .select("slug, title, category, location, cover_image_url")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  return (
    <div className="space-y-32 py-24 pb-32 px-6">
      {/* Header */}
      <section className="max-w-4xl mx-auto text-center space-y-6 animate-fade-up">
        <p className="text-eyebrow">PORTFOLIO</p>
        <h1 className="heading-display text-4xl sm:text-5xl md:text-6xl text-milan-ivory font-serif tracking-wide font-light">
          SELECTED WORKS
        </h1>
        <p className="text-body-lg max-w-2xl mx-auto font-light">
          A showcase of our premium spatial designs, turnkey interior fit-outs, and custom architectural joinery.
        </p>
      </section>

      {/* Projects Grid Section */}
      <section className="max-w-7xl mx-auto">
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group flex flex-col space-y-4"
              >
                <div className="aspect-[4/3] bg-milan-charcoal border border-milan-border overflow-hidden relative">
                  {project.cover_image_url ? (
                    <img
                      src={project.cover_image_url}
                      alt={project.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-milan-muted uppercase font-mono">
                      Image Pending
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] tracking-wider text-milan-gold uppercase font-mono">
                    {project.category} {project.location ? `• ${project.location}` : ""}
                  </span>
                  <h2 className="heading-display text-base text-milan-ivory group-hover:text-milan-gold transition-colors font-serif">
                    {project.title}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Premium Empty State */
          <div className="border border-milan-border bg-milan-charcoal/30 p-16 text-center max-w-2xl mx-auto space-y-6 animate-fade-in">
            <p className="text-sm text-milan-muted font-light leading-relaxed">
              Our complete interior design portfolio is currently undergoing curation.
            </p>
            <p className="text-xs text-milan-muted italic leading-relaxed">
              New residential and commercial projects are uploaded periodically. In the meantime, you can discuss your project scope with our design team.
            </p>
            <div className="pt-4">
              <Link
                href="/contact"
                className="inline-block border border-milan-gold bg-transparent text-milan-gold hover:bg-milan-gold hover:text-milan-primary px-8 py-4 text-xs tracking-widest font-semibold uppercase transition-all duration-300"
              >
                Request A Consultation
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
