"use client";

import { useEffect, useState, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Edit2, ArrowUp, ArrowDown, UploadCloud } from "lucide-react";
import CloudinaryUploadButton from "@/components/admin/CloudinaryUploadButton";

const CATEGORIES = ["Residential", "Commercial", "Hospitality", "Office", "Retail"];

interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string | null;
  description: string;
  cover_image_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
}

interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  display_order: number;
  caption: string | null;
}

interface AdminEditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminEditProjectPage({ params }: AdminEditProjectPageProps) {
  const { id } = use(params);
  const supabase = createClient();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [galleryImages, setGalleryImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Project Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Residential",
    location: "",
    description: "",
    is_featured: false,
    is_published: false,
    display_order: 0,
    cover_image_url: "",
  });

  // Gallery Caption Temp State
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editCaptionText, setEditCaptionText] = useState("");

  async function fetchProjectData() {
    try {
      // 1. Fetch project info
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);
      
      setFormData({
        title: projectData.title,
        slug: projectData.slug,
        category: projectData.category,
        location: projectData.location || "",
        description: projectData.description,
        is_featured: projectData.is_featured,
        is_published: projectData.is_published,
        display_order: projectData.display_order,
        cover_image_url: projectData.cover_image_url || "",
      });

      // 2. Fetch project gallery images
      const { data: imagesData, error: imagesError } = await supabase
        .from("project_images")
        .select("*")
        .eq("project_id", id)
        .order("display_order", { ascending: true });

      if (imagesError) throw imagesError;
      setGalleryImages(imagesData || []);
    } catch (err: any) {
      setErrorMsg("Failed to load project details: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjectData();
  }, [id]);

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

  const getPublicIdFromUrl = (url: string | null) => {
    if (!url || !url.includes("res.cloudinary.com")) return null;
    try {
      const parts = url.split("/upload/");
      if (parts.length < 2) return null;
      const pathWithVersion = parts[1];
      const pathParts = pathWithVersion.split("/");
      const hasVersion = pathParts[0].startsWith("v");
      const pathArray = hasVersion ? pathParts.slice(1) : pathParts;
      const fullPath = pathArray.join("/");
      const lastDotIndex = fullPath.lastIndexOf(".");
      return lastDotIndex !== -1 ? fullPath.substring(0, lastDotIndex) : fullPath;
    } catch (e) {
      return null;
    }
  };

  // Cover Image update file handler
  async function handleCoverImageUploadSuccess(url: string) {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const oldCoverUrl = formData.cover_image_url;

      const { error: updateError } = await supabase
        .from("projects")
        .update({ cover_image_url: url })
        .eq("id", id);

      if (updateError) throw updateError;

      setFormData(prev => ({ ...prev, cover_image_url: url }));
      setSuccessMsg("Cover image updated.");

      // Safely delete old storage file
      const oldPath = getStoragePathFromUrl(oldCoverUrl);
      if (oldPath) {
        await supabase.storage.from("milan-assets").remove([oldPath]);
      }

      const publicId = getPublicIdFromUrl(oldCoverUrl);
      if (publicId) {
        await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
        });
      }
    } catch (err: any) {
      setErrorMsg("Cover image upload failed: " + err.message);
    }
  }

  async function handleRemoveCoverImage() {
    setErrorMsg("");
    setSuccessMsg("");

    const oldCoverUrl = formData.cover_image_url;

    try {
      const { error } = await supabase
        .from("projects")
        .update({ cover_image_url: null })
        .eq("id", id);

      if (error) throw error;

      setFormData(prev => ({ ...prev, cover_image_url: "" }));
      setSuccessMsg("Cover image removed.");

      const oldPath = getStoragePathFromUrl(oldCoverUrl);
      if (oldPath) {
        await supabase.storage.from("milan-assets").remove([oldPath]);
      }

      const publicId = getPublicIdFromUrl(oldCoverUrl);
      if (publicId) {
        await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
        });
      }
    } catch (err: any) {
      setErrorMsg("Failed to remove cover: " + err.message);
    }
  }

  // Save project details form submission
  async function handleSaveProject(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const slugToSave = formData.slug.trim();

    try {
      // Validate Slug unique locally
      const { data: existing } = await supabase
        .from("projects")
        .select("id")
        .eq("slug", slugToSave)
        .neq("id", id)
        .maybeSingle();

      if (existing) {
        throw new Error(`The URL slug "${slugToSave}" is already used by another project. Slugs must be unique.`);
      }

      const { error } = await supabase
        .from("projects")
        .update({
          title: formData.title.trim(),
          slug: slugToSave,
          category: formData.category,
          location: formData.location.trim() || null,
          description: formData.description.trim(),
          is_featured: formData.is_featured,
          is_published: formData.is_published,
          display_order: Number(formData.display_order),
        })
        .eq("id", id);

      if (error) throw error;
      setSuccessMsg("Project details updated successfully.");
      fetchProjectData();
    } catch (err: any) {
      setErrorMsg("Failed to update project: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  // --- GALLERY IMAGES UPLOAD ---

  async function handleGalleryUploadSuccess(url: string) {
    setErrorMsg("");
    setSuccessMsg("");
    let nextDisplayOrder = galleryImages.length > 0 ? Math.max(...galleryImages.map(img => img.display_order)) + 1 : 1;

    try {
      const { error: dbError } = await supabase
        .from("project_images")
        .insert({
          project_id: id,
          image_url: url,
          display_order: nextDisplayOrder,
          caption: null,
        });

      if (dbError) throw dbError;
      setSuccessMsg("Gallery image uploaded successfully.");
      fetchProjectData();
    } catch (err: any) {
      setErrorMsg("Failed to add gallery image: " + err.message);
    }
  }

  async function handleDeleteGalleryImage(imageId: string, imageUrl: string) {
    if (!confirm("Are you sure you want to delete this gallery image?")) return;
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // 1. Delete DB Row
      const { error } = await supabase
        .from("project_images")
        .delete()
        .eq("id", imageId);

      if (error) throw error;

      setSuccessMsg("Gallery image removed.");
      fetchProjectData();

      // 2. Clean up storage file (Supabase)
      const path = getStoragePathFromUrl(imageUrl);
      if (path) {
        await supabase.storage.from("milan-assets").remove([path]);
      }

      // 3. Clean up Cloudinary
      const publicId = getPublicIdFromUrl(imageUrl);
      if (publicId) {
        await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
        });
      }
    } catch (err: any) {
      setErrorMsg("Failed to delete gallery image: " + err.message);
    }
  }

  // Reorder Gallery Images
  async function handleReorderImage(item: ProjectImage, direction: "up" | "down") {
    const currentIndex = galleryImages.findIndex(img => img.id === item.id);
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === galleryImages.length - 1) return;

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const swapItem = galleryImages[swapIndex];

    try {
      const { error: err1 } = await supabase
        .from("project_images")
        .update({ display_order: swapItem.display_order })
        .eq("id", item.id);

      const { error: err2 } = await supabase
        .from("project_images")
        .update({ display_order: item.display_order })
        .eq("id", swapItem.id);

      if (err1 || err2) throw new Error("Image reorder failed");
      fetchProjectData();
    } catch (err: any) {
      setErrorMsg("Failed to reorder images: " + err.message);
    }
  }

  // Open caption save input
  function handleOpenCaptionEdit(img: ProjectImage) {
    setEditingImageId(img.id);
    setEditCaptionText(img.caption || "");
  }

  async function handleSaveCaption(imageId: string) {
    try {
      const { error } = await supabase
        .from("project_images")
        .update({ caption: editCaptionText.trim() || null })
        .eq("id", imageId);

      if (error) throw error;
      setEditingImageId(null);
      fetchProjectData();
    } catch (err: any) {
      setErrorMsg("Failed to save caption: " + err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-xs text-milan-gold font-mono tracking-widest animate-pulse">
          LOADING PROJECT RECORD...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center text-milan-muted text-xs">
        Project reference not found. Back to{" "}
        <Link href="/admin/projects" className="underline hover:text-milan-gold">Projects list</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <header className="pb-6 border-b border-milan-border space-y-4 animate-fade-up">
        <Link
          href="/admin/projects"
          className="inline-flex items-center space-x-2 text-xs tracking-wider text-milan-muted hover:text-milan-gold transition-colors uppercase font-mono"
        >
          <ArrowLeft size={12} />
          <span>Back to Projects</span>
        </Link>
        <h1 className="heading-display text-2xl text-milan-ivory uppercase">
          Edit Project: {project.title}
        </h1>
      </header>

      {successMsg && (
        <div className="bg-emerald-950/40 border-l-4 border-emerald-500 p-4 text-xs text-emerald-400 font-mono flex items-center gap-3 animate-fade-in shadow-lg shadow-emerald-500/5">
          <svg className="w-4 h-4 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-950/40 border-l-4 border-red-500 p-4 text-xs text-red-400 font-mono flex items-center gap-3 animate-fade-in shadow-lg shadow-red-500/5">
          <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Metadata Editor & Cover image (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveProject} className="bg-milan-primary border border-milan-border p-6 space-y-6">
            <h2 className="heading-display text-xs text-milan-gold tracking-widest border-b border-milan-border/50 pb-2">
              Project Details
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
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none font-mono"
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
                  className="w-full bg-milan-primary border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
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
                  className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="project_location" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Location (Optional)
              </label>
              <input
                id="project_location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="project_description" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Description / Case Study Text *
              </label>
              <textarea
                id="project_description"
                required
                rows={8}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="border-t border-milan-border/50 pt-4 space-y-4">
              <h3 className="text-[10px] tracking-wider text-milan-gold uppercase font-mono">
                Publication &amp; Home Placement
              </h3>

              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <input
                    id="is_published"
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 accent-milan-gold cursor-pointer mt-0.5"
                  />
                  <div>
                    <label htmlFor="is_published" className="text-xs text-milan-ivory font-mono cursor-pointer select-none block">
                      Published Live
                    </label>
                    <span className="text-[10px] text-milan-muted/70 block mt-0.5">
                      Make this project visible on the public website.
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    id="is_featured"
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 accent-milan-gold cursor-pointer mt-0.5"
                  />
                  <div>
                    <label htmlFor="is_featured" className="text-xs text-milan-ivory font-mono cursor-pointer select-none block">
                      Featured
                    </label>
                    <span className="text-[10px] text-milan-muted/70 block mt-0.5">
                      Show this project in the Home page Featured Projects slider. Up to 3 featured + published projects are displayed.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-8 py-3.5 border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold text-xs tracking-widest font-semibold uppercase transition-all duration-300 disabled:opacity-50 cursor-pointer"
              >
                {saving ? "SAVING DETAILS..." : "SAVE DETAILS"}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Cover image & Project Gallery (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Cover image editor */}
          <div className="bg-milan-primary border border-milan-border p-6 space-y-4">
            <h2 className="heading-display text-xs text-milan-gold tracking-widest border-b border-milan-border/50 pb-2">
              Project Cover Image
            </h2>
            <CloudinaryUploadButton
              folder="milan-interio/projects"
              currentImageUrl={formData.cover_image_url}
              onUploadSuccess={handleCoverImageUploadSuccess}
              onImageRemoved={handleRemoveCoverImage}
              label="Upload Cover Image"
            />
          </div>

          {/* Gallery management */}
          <div className="bg-milan-primary border border-milan-border p-6 space-y-4">
            <h2 className="heading-display text-xs text-milan-gold tracking-widest border-b border-milan-border/50 pb-2 flex items-center justify-between">
              <span>PROJECT GALLERY ({galleryImages.length})</span>
            </h2>
            <CloudinaryUploadButton
              folder="milan-interio/project-images"
              onUploadSuccess={handleGalleryUploadSuccess}
              label="Add Gallery Images"
              multiple={true}
            />

            {galleryImages.length === 0 ? (
              <div className="py-6 text-center text-xs text-milan-muted italic font-light">
                Gallery is currently empty. Upload photos above.
              </div>
            ) : (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                {galleryImages.map((img, idx) => (
                  <div key={img.id} className="border border-milan-border p-3 bg-milan-charcoal/30 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-12 bg-milan-charcoal border border-milan-border overflow-hidden relative shrink-0">
                        <img
                          src={img.image_url}
                          alt=""
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        {editingImageId === img.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editCaptionText}
                              onChange={(e) => setEditCaptionText(e.target.value)}
                              className="w-full bg-milan-charcoal border border-milan-border p-1 text-[10px] text-milan-ivory focus:outline-none"
                              placeholder="Caption"
                            />
                            <button
                              onClick={() => handleSaveCaption(img.id)}
                              className="text-[9px] text-milan-gold font-mono uppercase hover:underline cursor-pointer"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="text-[10px] text-milan-muted italic truncate">
                              {img.caption || "No caption"}
                            </p>
                            <button
                              onClick={() => handleOpenCaptionEdit(img)}
                              className="text-[8px] text-milan-gold uppercase font-mono hover:underline shrink-0"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                        <span className="text-[8px] font-mono text-milan-muted block mt-1">
                          ORDER: {img.display_order}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-milan-border/30 pt-2 text-[10px] font-mono text-milan-muted">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleReorderImage(img, "up")}
                          disabled={idx === 0}
                          className="p-1 hover:text-milan-gold disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          onClick={() => handleReorderImage(img, "down")}
                          disabled={idx === galleryImages.length - 1}
                          className="p-1 hover:text-milan-gold disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleDeleteGalleryImage(img.id, img.image_url)}
                        className="text-red-400 hover:text-red-300 uppercase cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
