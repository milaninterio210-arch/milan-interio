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
    return {
      title: "Project Not Found",
    };
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

  // Fetch the project details
  const { data: project, error } = await supabase
    .from("projects")
    .select("id, slug, title, category, location, description, cover_image_url")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !project) {
    notFound();
  }

  // Fetch project gallery images
  const { data: images } = await supabase
    .from("project_images")
    .select("id, image_url, caption, display_order")
    .eq("project_id", project.id)
    .order("display_order", { ascending: true });

  return (
    <div className="space-y-24 py-24 pb-32 px-6">
      {/* Back button and Header */}
      <section className="max-w-5xl mx-auto space-y-8 animate-fade-up">
        <Link
          href="/projects"
          className="inline-flex items-center space-x-2 text-xs tracking-wider text-milan-gold hover:text-milan-ivory transition-colors uppercase font-mono"
        >
          <ArrowLeft size={14} />
          <span>BACK TO PORTFOLIO</span>
        </Link>

        {/* Hero image placeholder or real cover */}
        <div className="w-full aspect-video md:aspect-[21/9] bg-milan-charcoal border border-milan-border relative overflow-hidden">
          {project.cover_image_url ? (
            <img
              src={project.cover_image_url}
              alt={project.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-milan-muted uppercase font-mono">
              Cover Image Pending Curation
            </div>
          )}
        </div>

        {/* Project info & description */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-6">
          <div className="lg:col-span-2 space-y-6">
            <span className="text-eyebrow">{project.category}</span>
            <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl text-milan-ivory font-serif tracking-wide font-light">
              {project.title}
            </h1>
            <p className="text-body leading-relaxed text-sm sm:text-base font-light whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Sidebar Meta */}
          <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-milan-border pt-8 lg:pt-0 lg:pl-10 space-y-6 h-fit">
            <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
              PROJECT METADATA
            </span>
            <div className="space-y-4 text-xs font-mono">
              <div>
                <span className="text-milan-muted block uppercase text-[10px]">Location:</span>
                <span className="text-milan-ivory block mt-0.5">{project.location || "Confidential"}</span>
              </div>
              <div>
                <span className="text-milan-muted block uppercase text-[10px]">Sector:</span>
                <span className="text-milan-ivory block mt-0.5">{project.category}</span>
              </div>
              <div>
                <span className="text-milan-muted block uppercase text-[10px]">Status:</span>
                <span className="text-milan-gold block mt-0.5">COMPLETED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {images && images.length > 0 && (
        <section className="max-w-5xl mx-auto border-t border-milan-border/50 pt-16 space-y-12">
          <h2 className="heading-display text-xs tracking-widest text-milan-gold uppercase font-serif">
            Project Gallery
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {images.map((img) => (
              <div key={img.id} className="space-y-3 group">
                <div className="aspect-[4/3] bg-milan-charcoal border border-milan-border overflow-hidden relative">
                  <img
                    src={img.image_url}
                    alt={img.caption || project.title}
                    className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
                {img.caption && (
                  <p className="text-[10px] text-milan-muted italic font-serif">
                    {img.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Bottom */}
      <section className="max-w-5xl mx-auto">
        <div className="border border-milan-border p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-milan-primary">
          <div className="space-y-2">
            <h3 className="heading-display text-sm tracking-widest text-milan-gold font-serif">
              Interested in similar spatial concepts?
            </h3>
            <p className="text-xs text-milan-muted max-w-md">
              Coordinate with us to explore customization options, material samples, and conceptual detailing.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold px-6 py-3.5 text-xs tracking-widest font-semibold uppercase transition-all duration-300 text-center"
          >
            <span>Consultation</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
