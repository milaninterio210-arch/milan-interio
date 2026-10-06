import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ProjectsGallery from "@/components/public/ProjectsGallery";
import ConsultationCTA from "@/components/public/ConsultationCTA";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.milaninterio.com";

export const metadata: Metadata = {
  title: "Interior Design Portfolio | MILAN INTERIO Projects in Saudi Arabia",
  description:
    "View Milan Interio's portfolio of luxury interior design projects across Saudi Arabia — residential villas, commercial spaces, offices, hospitality, and retail environments.",
  alternates: {
    canonical: `${SITE_URL}/projects`,
  },
  openGraph: {
    title: "Interior Design Portfolio | MILAN INTERIO Projects in Saudi Arabia",
    description:
      "View Milan Interio's portfolio of luxury interior design projects across Saudi Arabia — residential villas, commercial spaces, offices, hospitality, and retail environments.",
    url: `${SITE_URL}/projects`,
  },
};

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("slug, title, category, location, cover_image_url")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  return (
    <div className="py-10 sm:py-14 space-y-16 sm:space-y-24">
      <section className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <ProjectsGallery initialProjects={projects || []} />
        </div>
      </section>

      {/* CTA */}
      <ConsultationCTA />
    </div>
  );
}
