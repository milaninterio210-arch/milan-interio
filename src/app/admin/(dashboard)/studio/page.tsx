"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, ArrowUp, ArrowDown } from "lucide-react";
import CloudinaryUploadButton from "@/components/admin/CloudinaryUploadButton";

const CATEGORIES = ["Residential", "Commercial", "Hospitality", "Office", "Retail"];

interface StudioItem {
  id: string;
  title: string;
  location: string | null;
  category: string | null;
  image_url: string;
  is_published: boolean;
  display_order: number;
}

export default function AdminStudioPage() {
  const supabase = createClient();
  const [items, setItems] = useState<StudioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form State
  const [editingItem, setEditingItem] = useState<StudioItem | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    category: "Residential",
    is_published: true,
    display_order: 1,
    image_url: "",
  });

  async function fetchItems() {
    try {
      const { data, error } = await supabase
        .from("studio_gallery")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (err: any) {
      setErrorMsg("Failed to load studio gallery: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  function handleOpenEdit(item: StudioItem) {
    setEditingItem(item);
    setIsCreateMode(false);
    setFormData({
      title: item.title,
      location: item.location || "",
      category: item.category || "Residential",
      is_published: item.is_published,
      display_order: item.display_order,
      image_url: item.image_url,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleOpenCreate() {
    setIsCreateMode(true);
    setEditingItem(null);
    setFormData({
      title: "",
      location: "",
      category: "Residential",
      is_published: true,
      display_order: items.length > 0 ? Math.max(...items.map(i => i.display_order)) + 1 : 1,
      image_url: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const finalImageUrl = formData.image_url;

      if (!finalImageUrl) {
        throw new Error("An image asset is required for studio archive items.");
      }

      const payload = {
        title: formData.title.trim(),
        location: formData.location.trim() || null,
        category: formData.category || null,
        image_url: finalImageUrl,
        is_published: formData.is_published,
        display_order: Number(formData.display_order),
      };

      if (isCreateMode) {
        const { error } = await supabase
          .from("studio_gallery")
          .insert(payload);

        if (error) throw error;
        setSuccessMsg("Studio item created successfully.");
      } else if (editingItem) {
        const { error } = await supabase
          .from("studio_gallery")
          .update(payload)
          .eq("id", editingItem.id);

        if (error) throw error;
        setSuccessMsg("Studio item updated successfully.");
      }

      setIsCreateMode(false);
      setEditingItem(null);
      fetchItems();
    } catch (err: any) {
      setErrorMsg("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, title: string, imageUrl: string) {
    if (!confirm(`Are you sure you want to delete studio item: "${title}"?`)) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { error } = await supabase
        .from("studio_gallery")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSuccessMsg("Studio item deleted.");
      fetchItems();

      // Clean up storage file (Supabase)
      const path = getStoragePathFromUrl(imageUrl);
      if (path) {
        await supabase.storage.from("milan-assets").remove([path]);
      }

      // Clean up Cloudinary
      const publicId = getPublicIdFromUrl(imageUrl);
      if (publicId) {
        await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
        });
      }
    } catch (err: any) {
      setErrorMsg("Failed to delete item: " + err.message);
    }
  }

  async function handleTogglePublished(item: StudioItem) {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const { error } = await supabase
        .from("studio_gallery")
        .update({ is_published: !item.is_published })
        .eq("id", item.id);

      if (error) throw error;
      fetchItems();
    } catch (err: any) {
      setErrorMsg("Failed to update status: " + err.message);
    }
  }

  async function handleReorder(item: StudioItem, direction: "up" | "down") {
    const currentIndex = items.findIndex(i => i.id === item.id);
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === items.length - 1) return;

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const swapItem = items[swapIndex];

    try {
      setLoading(true);
      const { error: err1 } = await supabase
        .from("studio_gallery")
        .update({ display_order: swapItem.display_order })
        .eq("id", item.id);

      const { error: err2 } = await supabase
        .from("studio_gallery")
        .update({ display_order: item.display_order })
        .eq("id", swapItem.id);

      if (err1 || err2) throw new Error("Order swap failed");
      fetchItems();
    } catch (err: any) {
      setErrorMsg("Failed to reorder: " + err.message);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-xs text-milan-gold font-mono tracking-widest animate-pulse">
          LOADING STUDIO ARCHIVE...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <header className="pb-6 border-b border-milan-border flex items-center justify-between">
        <div>
          <h1 className="heading-display text-2xl text-milan-ivory">
            MANAGE STUDIO ARCHIVE
          </h1>
          <p className="text-xs text-milan-muted mt-1 font-mono">
            Manage published visual details and architectural coordinates shown under the Studio public page.
          </p>
        </div>
        {!editingItem && !isCreateMode && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center space-x-2 px-4 py-2 border border-milan-gold text-milan-gold hover:bg-milan-gold hover:text-milan-primary text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Studio Image</span>
          </button>
        )}
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

      {/* Form Editor */}
      {(isCreateMode || editingItem) && (
        <form onSubmit={handleSave} className="bg-milan-primary border border-milan-border p-6 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-milan-border/50 pb-3">
            <h2 className="heading-display text-xs text-milan-gold tracking-widest">
              {isCreateMode ? "Add Studio Item" : `Edit Studio Item: ${editingItem?.title}`}
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsCreateMode(false);
                setEditingItem(null);
              }}
              className="text-xs text-milan-muted hover:text-milan-ivory font-mono uppercase tracking-wider"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Item Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors"
                placeholder="e.g. Marble Junction Detail"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Location (Optional)
              </label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors"
                placeholder="e.g. Palm Jumeirah"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-milan-primary border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Image upload */}
            <div className="space-y-2">
              <label className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Studio Image Photo File *
              </label>
              <CloudinaryUploadButton
                folder="milan-interio/studio"
                currentImageUrl={formData.image_url}
                onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                onImageRemoved={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                label="Upload Studio Image"
              />
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

          <div className="flex items-center space-x-2">
            <input
              id="is_published"
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-4 h-4 accent-milan-gold cursor-pointer"
            />
            <label htmlFor="is_published" className="text-xs text-milan-ivory font-mono cursor-pointer select-none">
              Publish Live on public archive
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold text-xs tracking-widest font-semibold uppercase transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              {saving ? "SAVING..." : "SAVE STUDIO ITEM"}
            </button>
          </div>
        </form>
      )}

      {/* Grid of gallery archive items */}
      {items.length === 0 ? (
        <div className="bg-milan-primary border border-milan-border p-12 text-center">
          <p className="text-sm text-milan-muted">No studio images found. Use Add Studio Image to populate the gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="bg-milan-primary border border-milan-border overflow-hidden flex flex-col justify-between"
            >
              <div className="aspect-[3/4] bg-milan-charcoal overflow-hidden relative border-b border-milan-border">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
                {/* Category Badge overlay */}
                {item.category && (
                  <span className="absolute top-3 right-3 bg-milan-primary/80 backdrop-blur-sm border border-milan-border text-milan-gold text-[9px] tracking-wider px-2 py-0.5 uppercase font-semibold font-mono">
                    {item.category}
                  </span>
                )}
              </div>

              <div className="p-4 space-y-4">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-semibold text-milan-ivory uppercase truncate" title={item.title}>
                    {item.title}
                  </h3>
                  <span className="text-[10px] text-milan-muted font-mono block">
                    {item.location || "Location Confidential"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-milan-border/50 pt-3 text-[10px] font-mono text-milan-muted">
                  <div className="flex items-center space-x-2">
                    {/* Status Toggle */}
                    <button
                      onClick={() => handleTogglePublished(item)}
                      className="cursor-pointer focus:outline-none"
                      title={item.is_published ? "Published - Click to hide" : "Draft - Click to publish"}
                    >
                      {item.is_published ? (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      ) : (
                        <XCircle size={16} className="text-milan-muted" />
                      )}
                    </button>

                    {/* Display Order */}
                    <div className="flex items-center space-x-0.5 border-l border-milan-border/50 pl-2">
                      <button
                        onClick={() => handleReorder(item, "up")}
                        disabled={idx === 0}
                        className="p-0.5 hover:text-milan-gold disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => handleReorder(item, "down")}
                        disabled={idx === items.length - 1}
                        className="p-0.5 hover:text-milan-gold disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="hover:text-milan-gold transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title, item.image_url)}
                      className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
