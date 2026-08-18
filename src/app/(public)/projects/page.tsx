import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ProjectsGallery from "@/components/public/ProjectsGallery";

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
    <div className="py-20 sm:py-28">
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <ProjectsGallery initialProjects={projects || []} />
        </div>
      </section>
    </div>
  );
}
