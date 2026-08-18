"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CloudinaryUploadButton from "@/components/admin/CloudinaryUploadButton";

const CATEGORIES = ["Residential", "Commercial", "Hospitality", "Office", "Retail"];

export default function AdminNewProjectPage() {
  const supabase = createClient();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Residential",
    location: "",
    description: "",
    is_featured: false,
    is_published: false,
    display_order: 1,
    cover_image_url: "",
  });

  useEffect(() => {
    async function determineOrder() {
      try {
        const { data } = await supabase
          .from("projects")
          .select("display_order");
        if (data) {
          const maxOrder = data.length > 0 ? Math.max(...data.map(p => p.display_order)) : 0;
          setFormData(prev => ({ ...prev, display_order: maxOrder + 1 }));
        }
      } catch (err) {
        // Fallback to order 1
      }
    }
    determineOrder();
  }, []);

  function handleTitleChange(val: string) {
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // remove non-alphanumeric/spaces/hyphens
      .replace(/[\s_]+/g, "-")   // replace spaces/underscores with hyphens
      .replace(/^-+|-+$/g, "");   // trim leading/trailing hyphens

    setFormData(prev => ({
      ...prev,
      title: val,
      slug: generatedSlug,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const slugToSave = formData.slug.trim();

    try {
      // Validate Slug Uniqueness in DB
      const { data: existing } = await supabase
        .from("projects")
        .select("id")
        .eq("slug", slugToSave)
        .maybeSingle();

      if (existing) {
        throw new Error(`The URL slug "${slugToSave}" is already used by another project. Slugs must be unique.`);
      }

      // Insert record
      const { data: newProject, error } = await supabase
        .from("projects")
        .insert({
          title: formData.title.trim(),
          slug: slugToSave,
          category: formData.category,
          location: formData.location.trim() || null,
          description: formData.description.trim(),
          is_featured: formData.is_featured,
          is_published: formData.is_published,
          display_order: Number(formData.display_order),
          cover_image_url: formData.cover_image_url || null,
        })
        .select()
        .single();

      if (error) throw error;

      setSuccessMsg("Project created successfully. Redirecting to gallery manager...");
      setTimeout(() => {
        router.push(`/admin/projects/${newProject.id}`);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create project.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <header className="pb-6 border-b border-milan-border space-y-4 animate-fade-up">
        <Link
          href="/admin/projects"
          className="inline-flex items-center space-x-2 text-xs tracking-wider text-milan-muted hover:text-milan-gold transition-colors uppercase font-mono"
        >
          <ArrowLeft size={12} />
          <span>Back to Projects</span>
        </Link>
        <h1 className="heading-display text-2xl text-milan-ivory">
          NEW PORTFOLIO PROJECT
        </h1>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-milan-primary border border-milan-border p-6 space-y-6">
          <h2 className="heading-display text-xs text-milan-gold tracking-widest">
            Project Information
          </h2>

          <div className="space-y-2">
            <label htmlFor="project_title" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
              Project Title *
            </label>
            <input
              id="project_title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors"
              placeholder="e.g. Palm Jumeirah Mansion"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="project_slug" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                URL Slug * (Unique)
              </label>
              <input
                id="project_slug"
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors font-mono"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="project_category" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Category *
              </label>
              <select
                id="project_category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-milan-primary border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-milan-charcoal">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="display_order" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Display Order *
              </label>
              <input
                id="display_order"
                type="number"
                required
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="project_location" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Location (Optional)
              </label>
              <input
                id="project_location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors"
                placeholder="e.g. Dubai, UAE"
              />
            </div>

            {/* Cover image upload */}
            <div className="space-y-2">
              <label className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Cover Image
              </label>
              <CloudinaryUploadButton
                folder="milan-interio/projects"
                currentImageUrl={formData.cover_image_url}
                onUploadSuccess={(url) => setFormData(prev => ({ ...prev, cover_image_url: url }))}
                onImageRemoved={() => setFormData(prev => ({ ...prev, cover_image_url: "" }))}
                label="Upload Cover Image"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="project_description" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
              Description / Case Study Text *
            </label>
            <textarea
              id="project_description"
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors resize-none leading-relaxed"
              placeholder="Detailed description of project requirements, spatial concept, and execution..."
            />
          </div>

          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center space-x-3">
              <input
                id="is_featured"
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 accent-milan-gold cursor-pointer"
              />
              <label htmlFor="is_featured" className="text-xs text-milan-ivory font-mono cursor-pointer select-none">
                Mark as Featured
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                id="is_published"
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4 accent-milan-gold cursor-pointer"
              />
              <label htmlFor="is_published" className="text-xs text-milan-ivory font-mono cursor-pointer select-none">
                Publish on Live Website
              </label>
            </div>
          </div>
        </div>

        <div className="pt-2 flex space-x-4">
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-8 py-3.5 border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold text-xs tracking-widest font-semibold uppercase transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {saving ? "CREATING PROJECT..." : uploading ? "UPLOADING IMAGE..." : "CREATE & CONTINUE"}
          </button>
          <Link
            href="/admin/projects"
            className="px-8 py-3.5 border border-milan-border text-milan-ivory hover:border-milan-gold hover:text-milan-gold text-xs tracking-widest font-semibold uppercase transition-all duration-300 text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
