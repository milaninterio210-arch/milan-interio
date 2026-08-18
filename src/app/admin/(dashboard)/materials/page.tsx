"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import CloudinaryUploadButton from "@/components/admin/CloudinaryUploadButton";

const CATEGORIES = ["Marble", "Wood", "Brass", "Stone", "Textiles", "Glass"];

interface Material {
  id: string;
  category: string;
  name: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
}

export default function AdminMaterialsPage() {
  const supabase = createClient();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Editor Form State
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "Marble",
    description: "",
    display_order: 1,
    image_url: "",
  });

  async function fetchMaterials() {
    try {
      const { data, error } = await supabase
        .from("materials")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setMaterials(data || []);
    } catch (err: any) {
      setErrorMsg("Failed to load materials: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMaterials();
  }, []);

  function handleOpenEdit(material: Material) {
    setEditingMaterial(material);
    setIsCreateMode(false);
    setFormData({
      name: material.name,
      category: material.category,
      description: material.description || "",
      display_order: material.display_order,
      image_url: material.image_url || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleOpenCreate() {
    setIsCreateMode(true);
    setEditingMaterial(null);
    setFormData({
      name: "",
      category: "Marble",
      description: "",
      display_order: materials.length > 0 ? Math.max(...materials.map(m => m.display_order)) + 1 : 1,
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

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim() || null,
        image_url: finalImageUrl || null,
        display_order: Number(formData.display_order),
      };

      if (isCreateMode) {
        const { error } = await supabase
          .from("materials")
          .insert(payload);

        if (error) throw error;
        setSuccessMsg("Material item created successfully.");
      } else if (editingMaterial) {
        const { error } = await supabase
          .from("materials")
          .update(payload)
          .eq("id", editingMaterial.id);

        if (error) throw error;
        setSuccessMsg("Material item updated successfully.");
      }

      setIsCreateMode(false);
      setEditingMaterial(null);
      fetchMaterials();
    } catch (err: any) {
      setErrorMsg("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string, imageUrl: string | null) {
    if (!confirm(`Are you sure you want to delete material: "${name}"?`)) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { error } = await supabase
        .from("materials")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSuccessMsg("Material deleted.");
      fetchMaterials();

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
      setErrorMsg("Failed to delete material: " + err.message);
    }
  }

  async function handleReorder(material: Material, direction: "up" | "down") {
    const currentIndex = materials.findIndex(m => m.id === material.id);
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === materials.length - 1) return;

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const swapMaterial = materials[swapIndex];

    try {
      setLoading(true);
      const { error: err1 } = await supabase
        .from("materials")
        .update({ display_order: swapMaterial.display_order })
        .eq("id", material.id);

      const { error: err2 } = await supabase
        .from("materials")
        .update({ display_order: material.display_order })
        .eq("id", swapMaterial.id);

      if (err1 || err2) throw new Error("Order swap failed");
      fetchMaterials();
    } catch (err: any) {
      setErrorMsg("Failed to reorder: " + err.message);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-xs text-milan-gold font-mono tracking-widest animate-pulse">
          LOADING MATERIALS LIBRARY...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <header className="pb-6 border-b border-milan-border flex items-center justify-between">
        <div>
          <h1 className="heading-display text-2xl text-milan-ivory">
            CURATE MATERIAL LIBRARY
          </h1>
          <p className="text-xs text-milan-muted mt-1 font-mono">
            Manage custom architectural materials, categories, descriptions, and catalog photos.
          </p>
        </div>
        {!editingMaterial && !isCreateMode && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center space-x-2 px-4 py-2 border border-milan-gold text-milan-gold hover:bg-milan-gold hover:text-milan-primary text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Material</span>
          </button>
        )}
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

      {/* Form Editor */}
      {(isCreateMode || editingMaterial) && (
        <form onSubmit={handleSave} className="bg-milan-primary border border-milan-border p-6 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-milan-border/50 pb-3">
            <h2 className="heading-display text-xs text-milan-gold tracking-widest">
              {isCreateMode ? "Add Material Item" : `Edit Material: ${editingMaterial?.name}`}
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsCreateMode(false);
                setEditingMaterial(null);
              }}
              className="text-xs text-milan-muted hover:text-milan-ivory font-mono uppercase tracking-wider"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="material_name" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Material Name *
              </label>
              <input
                id="material_name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors"
                placeholder="e.g. Statuario Marble"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="material_category" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Category *
              </label>
              <select
                id="material_category"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Image upload */}
            <div className="space-y-2">
              <label className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Material Texture Image File
              </label>
              <CloudinaryUploadButton
                folder="milan-interio/materials"
                currentImageUrl={formData.image_url}
                onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                onImageRemoved={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                label="Upload Material Image"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
              Material Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors resize-none leading-relaxed"
              placeholder="e.g. Fine-grained white marble sourced from Carrara..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold text-xs tracking-widest font-semibold uppercase transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              {saving ? "SAVING..." : "SAVE MATERIAL"}
            </button>
          </div>
        </form>
      )}

      {/* Grid of Materials */}
      {materials.length === 0 ? (
        <div className="bg-milan-primary border border-milan-border p-12 text-center">
          <p className="text-sm text-milan-muted">No materials uploaded yet. Use Add Material to populate the library.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material, idx) => (
            <div
              key={material.id}
              className="bg-milan-primary border border-milan-border overflow-hidden flex flex-col justify-between"
            >
              <div className="aspect-square bg-milan-charcoal overflow-hidden relative border-b border-milan-border">
                {material.image_url ? (
                  <img
                    src={material.image_url}
                    alt={material.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-milan-muted uppercase font-mono tracking-wider">
                    Texture Pending
                  </div>
                )}
                {/* Category Badge overlay */}
                <span className="absolute top-3 right-3 bg-milan-primary/80 backdrop-blur-sm border border-milan-border text-milan-gold text-[9px] tracking-wider px-2 py-0.5 uppercase font-semibold font-mono">
                  {material.category}
                </span>
              </div>

              <div className="p-4 space-y-4">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-semibold text-milan-ivory uppercase truncate" title={material.name}>
                    {material.name}
                  </h3>
                  {material.description ? (
                    <p className="text-xs text-milan-muted line-clamp-2 leading-relaxed mt-1">
                      {material.description}
                    </p>
                  ) : (
                    <span className="text-[10px] text-milan-muted font-mono block italic">
                      No description
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-milan-border/50 pt-3 text-[10px] font-mono text-milan-muted">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[9px] text-milan-gold tracking-wide">ORDER: {material.display_order}</span>
                    <div className="flex items-center space-x-0.5 border-l border-milan-border/50 pl-2">
                      <button
                        onClick={() => handleReorder(material, "up")}
                        disabled={idx === 0}
                        className="p-0.5 hover:text-milan-gold disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => handleReorder(material, "down")}
                        disabled={idx === materials.length - 1}
                        className="p-0.5 hover:text-milan-gold disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 font-mono">
                    <button
                      onClick={() => handleOpenEdit(material)}
                      className="hover:text-milan-gold transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(material.id, material.name, material.image_url)}
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
