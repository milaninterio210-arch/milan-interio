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

  const { data: projects } = await supabase
    .from("projects")
    .select("slug, title, category, location, cover_image_url")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  return (
    <div className="py-20 sm:py-24">
      {/* Header */}
      <section className="px-6 text-center space-y-5 mb-16 sm:mb-24 animate-fade-up">
        <p className="text-eyebrow">PORTFOLIO</p>
        <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl text-milan-ivory max-w-3xl mx-auto">
          SELECTED WORKS
        </h1>
        <p className="text-body max-w-xl mx-auto text-sm sm:text-base">
          A showcase of premium spatial designs, turnkey interior fit-outs, and custom architectural joinery.
        </p>
      </section>

      {/* Projects Grid or Empty State */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group block space-y-4"
                >
                  <div className="aspect-[4/3] bg-milan-charcoal border border-milan-border overflow-hidden">
                    {project.cover_image_url ? (
                      <img
                        src={project.cover_image_url}
                        alt={project.title}
                        className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-milan-muted uppercase tracking-wider">
                        Image Pending
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] tracking-wider text-milan-gold uppercase font-mono">
                      {project.category}{project.location ? ` · ${project.location}` : ""}
                    </span>
                    <h2 className="heading-display text-sm sm:text-base text-milan-ivory group-hover:text-milan-gold transition-colors">
                      {project.title}
                    </h2>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="max-w-lg mx-auto text-center py-12 sm:py-16 space-y-5">
              <p className="text-sm text-milan-muted font-light leading-relaxed">
                Our interior design portfolio is currently being curated.
              </p>
              <p className="text-xs text-milan-muted leading-relaxed">
                New residential and commercial projects will be published periodically.
              </p>
              <Link
                href="/contact"
                className="inline-block border border-milan-gold text-milan-gold hover:bg-milan-gold hover:text-milan-primary px-6 py-3 text-[10px] tracking-widest font-semibold uppercase transition-colors"
              >
                Discuss Your Project
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
