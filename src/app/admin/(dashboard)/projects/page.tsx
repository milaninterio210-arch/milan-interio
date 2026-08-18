"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Star, ArrowUp, ArrowDown } from "lucide-react";

interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
}

export default function AdminProjectsPage() {
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      setErrorMsg("Failed to load projects: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleDelete(id: string, title: string, coverImageUrl: string | null) {
    if (!confirm(`Are you sure you want to delete project: "${title}"?\nThis will permanently delete the project and all its gallery images.`)) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      // 1. Delete associated project images from database (cascade handles this but let's retrieve paths first for storage cleanup)
      const { data: galleryImages } = await supabase
        .from("project_images")
        .select("image_url")
        .eq("project_id", id);

      // 2. Delete the project
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // 3. Clean up storage assets if possible
      const storagePathsToClean: string[] = [];
      
      const coverPath = getStoragePathFromUrl(coverImageUrl);
      if (coverPath) storagePathsToClean.push(coverPath);

      if (galleryImages) {
        galleryImages.forEach((img) => {
          const imgPath = getStoragePathFromUrl(img.image_url);
          if (imgPath) storagePathsToClean.push(imgPath);
        });
      }

      if (storagePathsToClean.length > 0) {
        await supabase.storage.from("milan-assets").remove(storagePathsToClean);
      }

      setSuccessMsg(`Project "${title}" deleted successfully.`);
      fetchProjects();
    } catch (err: any) {
      setErrorMsg("Failed to delete project: " + err.message);
    }
  }

  // Extract storage path from public url
  function getStoragePathFromUrl(url: string | null) {
    if (!url) return null;
    const bucketName = "milan-assets";
    const marker = `/${bucketName}/`;
    const index = url.indexOf(marker);
    if (index !== -1) {
      return url.substring(index + marker.length);
    }
    return null;
  }

  async function handleTogglePublished(project: Project) {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const { error } = await supabase
        .from("projects")
        .update({ is_published: !project.is_published })
        .eq("id", project.id);

      if (error) throw error;
      fetchProjects();
    } catch (err: any) {
      setErrorMsg("Failed to toggle status: " + err.message);
    }
  }

  async function handleToggleFeatured(project: Project) {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const { error } = await supabase
        .from("projects")
        .update({ is_featured: !project.is_featured })
        .eq("id", project.id);

      if (error) throw error;
      fetchProjects();
    } catch (err: any) {
      setErrorMsg("Failed to toggle status: " + err.message);
    }
  }

  async function handleReorder(project: Project, direction: "up" | "down") {
    const currentIndex = projects.findIndex(p => p.id === project.id);
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === projects.length - 1) return;

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const swapProject = projects[swapIndex];

    try {
      setLoading(true);
      const { error: err1 } = await supabase
        .from("projects")
        .update({ display_order: swapProject.display_order })
        .eq("id", project.id);

      const { error: err2 } = await supabase
        .from("projects")
        .update({ display_order: project.display_order })
        .eq("id", swapProject.id);

      if (err1 || err2) throw new Error("Order swap failed");
      fetchProjects();
    } catch (err: any) {
      setErrorMsg("Failed to reorder projects: " + err.message);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-xs text-milan-gold font-mono tracking-widest animate-pulse">
          LOADING PORTFOLIO...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="pb-6 border-b border-milan-border flex items-center justify-between">
        <div>
          <h1 className="heading-display text-2xl text-milan-ivory">
            MANAGE PROJECTS
          </h1>
          <p className="text-xs text-milan-muted mt-1 font-mono">
            Manage luxury interior portfolio projects, categories, descriptions, cover images, and galleries.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center space-x-2 px-4 py-2 border border-milan-gold text-milan-gold hover:bg-milan-gold hover:text-milan-primary text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
        >
          <Plus size={14} />
          <span>New Project</span>
        </Link>
      </header>

      {successMsg && (
        <div className="bg-emerald-950/20 border border-emerald-500/35 p-4 text-xs text-emerald-400 font-mono">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-950/20 border border-red-500/35 p-4 text-xs text-red-400 font-mono">
          {errorMsg}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bg-milan-primary border border-milan-border p-12 text-center space-y-4">
          <p className="text-sm text-milan-muted">No projects found in the database.</p>
          <Link
            href="/admin/projects/new"
            className="inline-block px-6 py-3 border border-milan-gold text-milan-gold hover:bg-milan-gold hover:text-milan-primary text-xs font-semibold uppercase tracking-wider"
          >
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="bg-milan-primary border border-milan-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-milan-border bg-milan-charcoal/50 text-milan-gold uppercase tracking-wider">
                  <th className="p-4 font-mono font-semibold">Cover</th>
                  <th className="p-4 font-mono font-semibold">Title</th>
                  <th className="p-4 font-mono font-semibold">Category</th>
                  <th className="p-4 font-mono font-semibold">Location</th>
                  <th className="p-4 font-mono font-semibold text-center">Featured</th>
                  <th className="p-4 font-mono font-semibold text-center">Status</th>
                  <th className="p-4 font-mono font-semibold text-center">Order</th>
                  <th className="p-4 font-mono font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-milan-border">
                {projects.map((project, idx) => (
                  <tr key={project.id} className="hover:bg-milan-charcoal/20 transition-colors">
                    {/* Cover Preview */}
                    <td className="p-4">
                      <div className="w-16 h-12 bg-milan-charcoal border border-milan-border overflow-hidden relative">
                        {project.cover_image_url ? (
                          <img
                            src={project.cover_image_url}
                            alt=""
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-milan-muted font-mono uppercase text-center p-1 leading-none">
                            No Cover
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title & Slug */}
                    <td className="p-4 font-semibold text-milan-ivory">
                      <div className="max-w-[200px] truncate">{project.title}</div>
                      <span className="text-[10px] text-milan-muted font-mono block mt-0.5 truncate max-w-[200px]">
                        {project.slug}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="p-4 text-milan-muted uppercase font-mono">{project.category}</td>

                    {/* Location */}
                    <td className="p-4 text-milan-muted">{project.location || "—"}</td>

                    {/* Featured Toggle */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        className="p-1 focus:outline-none cursor-pointer"
                        title={project.is_featured ? "Featured - Click to remove" : "Click to feature"}
                      >
                        <Star
                          size={16}
                          className={project.is_featured ? "fill-milan-gold text-milan-gold" : "text-milan-muted hover:text-milan-gold"}
                        />
                      </button>
                    </td>

                    {/* Publication Status */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleTogglePublished(project)}
                        className="inline-flex items-center space-x-1.5 focus:outline-none cursor-pointer"
                        title={project.is_published ? "Published - Click to hide" : "Draft - Click to publish"}
                      >
                        {project.is_published ? (
                          <span className="inline-flex items-center text-emerald-400 bg-emerald-950/20 px-2 py-0.5 border border-emerald-500/20 rounded-full font-mono text-[9px] uppercase font-semibold">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-milan-muted bg-milan-charcoal/50 px-2 py-0.5 border border-milan-border rounded-full font-mono text-[9px] uppercase font-semibold">
                            Draft
                          </span>
                        )}
                      </button>
                    </td>

                    {/* Display Order */}
                    <td className="p-4 text-center font-mono">
                      <div className="flex items-center justify-center space-x-1">
                        <span className="w-6 text-center">{project.display_order}</span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleReorder(project, "up")}
                            disabled={idx === 0}
                            className="p-0.5 hover:text-milan-gold disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp size={10} />
                          </button>
                          <button
                            onClick={() => handleReorder(project, "down")}
                            disabled={idx === projects.length - 1}
                            className="p-0.5 hover:text-milan-gold disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown size={10} />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="p-1 text-milan-muted hover:text-milan-gold transition-colors"
                          title="Edit Project & Gallery"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id, project.title, project.cover_image_url)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
