import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("title, description")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description: project.description || `Case study of ${project.title} by MILAN INTERIO.`,
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("id, slug, title, category, location, description, cover_image_url")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !project) {
    notFound();
  }

  const { data: images } = await supabase
    .from("project_images")
    .select("id, image_url, caption, display_order")
    .eq("project_id", project.id)
    .order("display_order", { ascending: true });

  return (
    <div className="py-20 sm:py-24">
      {/* Header */}
      <section className="px-6 mb-8 sm:mb-10">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[10px] tracking-widest text-milan-muted hover:text-milan-gold transition-colors uppercase font-mono"
          >
            <ArrowLeft size={12} />
            <span>Portfolio</span>
          </Link>
        </div>
      </section>

      {/* Cover Image — consistent aspect ratio container regardless of source dimensions */}
      <section className="px-6 mb-10 sm:mb-14">
        <div className="max-w-5xl mx-auto">
          <div className="aspect-[16/9] sm:aspect-[2/1] bg-milan-charcoal border border-milan-border overflow-hidden">
            {project.cover_image_url ? (
              <img
                src={project.cover_image_url}
                alt={project.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-milan-muted uppercase tracking-wider">
                Cover Image Pending
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Project Info */}
      <section className="px-6 mb-12 sm:mb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            <span className="text-eyebrow">{project.category}</span>
            <h1 className="heading-display text-2xl sm:text-3xl md:text-4xl text-milan-ivory">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-sm sm:text-base text-milan-muted leading-relaxed font-light whitespace-pre-line">
                {project.description}
              </p>
            )}
          </div>

          {/* Sidebar metadata */}
          <div className="lg:border-l border-t lg:border-t-0 border-milan-border pt-6 lg:pt-0 lg:pl-8 space-y-5">
            <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
              Project Details
            </span>
            <div className="space-y-4 text-xs">
              {project.location && (
                <div>
                  <span className="text-milan-muted block uppercase text-[10px] tracking-wider mb-0.5">Location</span>
                  <span className="text-milan-ivory">{project.location}</span>
                </div>
              )}
              <div>
                <span className="text-milan-muted block uppercase text-[10px] tracking-wider mb-0.5">Sector</span>
                <span className="text-milan-ivory">{project.category}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {images && images.length > 0 && (
        <section className="px-6 mb-12 sm:mb-16">
          <div className="max-w-5xl mx-auto border-t border-milan-border pt-10 sm:pt-14">
            <span className="text-eyebrow block mb-8">Gallery</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {images.map((img) => (
                <div key={img.id} className="space-y-2 group">
                  <div className="aspect-[4/3] bg-milan-charcoal border border-milan-border overflow-hidden">
                    <img
                      src={img.image_url}
                      alt={img.caption || project.title}
                      className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                  {img.caption && (
                    <p className="text-[10px] text-milan-muted italic">
                      {img.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-6">
        <div className="max-w-5xl mx-auto border border-milan-border p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-eyebrow block">Similar Concepts</span>
            <p className="text-xs sm:text-sm text-milan-muted max-w-md">
              Explore customization options, material samples, and conceptual detailing for your space.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold px-6 py-3 text-[11px] tracking-widest font-semibold uppercase transition-all duration-300 shrink-0"
          >
            <span>Consultation</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </section>
    </div>
  );
}
