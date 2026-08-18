"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, ArrowUp, ArrowDown } from "lucide-react";
import CloudinaryUploadButton from "@/components/admin/CloudinaryUploadButton";

interface HeroSlide {
  id: string;
  eyebrow: string | null;
  heading: string;
  subheading: string | null;
  background_image_url: string | null;
  primary_cta_label: string | null;
  primary_cta_url: string | null;
  secondary_cta_label: string | null;
  secondary_cta_url: string | null;
  is_active: boolean;
  display_order: number;
}

export default function AdminHeroPage() {
  const supabase = createClient();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Editor Form State
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const [formData, setFormData] = useState({
    eyebrow: "",
    heading: "",
    subheading: "",
    background_image_url: "",
    primary_cta_label: "",
    primary_cta_url: "",
    secondary_cta_label: "",
    secondary_cta_url: "",
    is_active: true,
    display_order: 0,
  });

  async function fetchSlides() {
    try {
      const { data, error } = await supabase
        .from("hero_content")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (err: any) {
      setErrorMsg("Failed to load slides: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSlides();
  }, []);

  function handleOpenEdit(slide: HeroSlide) {
    setEditingSlide(slide);
    setIsCreateMode(false);
    setFormData({
      eyebrow: slide.eyebrow || "",
      heading: slide.heading,
      subheading: slide.subheading || "",
      background_image_url: slide.background_image_url || "",
      primary_cta_label: slide.primary_cta_label || "",
      primary_cta_url: slide.primary_cta_url || "",
      secondary_cta_label: slide.secondary_cta_label || "",
      secondary_cta_url: slide.secondary_cta_url || "",
      is_active: slide.is_active,
      display_order: slide.display_order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleOpenCreate() {
    setIsCreateMode(true);
    setEditingSlide(null);
    setFormData({
      eyebrow: "",
      heading: "",
      subheading: "",
      background_image_url: "",
      primary_cta_label: "EXPLORE OUR WORK",
      primary_cta_url: "/projects",
      secondary_cta_label: "START A PROJECT",
      secondary_cta_url: "/contact",
      is_active: true,
      display_order: slides.length > 0 ? Math.max(...slides.map(s => s.display_order)) + 1 : 1,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload = {
        eyebrow: formData.eyebrow.trim() || null,
        heading: formData.heading.trim(),
        subheading: formData.subheading.trim() || null,
        background_image_url: formData.background_image_url.trim() || null,
        primary_cta_label: formData.primary_cta_label.trim() || null,
        primary_cta_url: formData.primary_cta_url.trim() || null,
        secondary_cta_label: formData.secondary_cta_label.trim() || null,
        secondary_cta_url: formData.secondary_cta_url.trim() || null,
        is_active: formData.is_active,
        display_order: Number(formData.display_order),
      };

      if (isCreateMode) {
        const { error } = await supabase
          .from("hero_content")
          .insert(payload);

        if (error) throw error;
        setSuccessMsg("Hero slide created successfully.");
      } else if (editingSlide) {
        const { error } = await supabase
          .from("hero_content")
          .update(payload)
          .eq("id", editingSlide.id);

        if (error) throw error;
        setSuccessMsg("Hero slide updated successfully.");
      }

      setIsCreateMode(false);
      setEditingSlide(null);
      fetchSlides();
    } catch (err: any) {
      setErrorMsg("Failed to save slide: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, heading: string) {
    if (!confirm(`Are you sure you want to delete the slide: "${heading}"?`)) return;

    setErrorMsg("");
    setSuccessMsg("");
    try {
      const { error } = await supabase
        .from("hero_content")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSuccessMsg("Hero slide deleted.");
      fetchSlides();
    } catch (err: any) {
      setErrorMsg("Failed to delete slide: " + err.message);
    }
  }

  async function handleToggleActive(slide: HeroSlide) {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const { error } = await supabase
        .from("hero_content")
        .update({ is_active: !slide.is_active })
        .eq("id", slide.id);

      if (error) throw error;
      fetchSlides();
    } catch (err: any) {
      setErrorMsg("Failed to update status: " + err.message);
    }
  }

  async function handleReorder(slide: HeroSlide, direction: "up" | "down") {
    const currentIndex = slides.findIndex(s => s.id === slide.id);
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === slides.length - 1) return;

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const swapSlide = slides[swapIndex];

    try {
      setLoading(true);
      // Swap display_orders
      const { error: err1 } = await supabase
        .from("hero_content")
        .update({ display_order: swapSlide.display_order })
        .eq("id", slide.id);

      const { error: err2 } = await supabase
        .from("hero_content")
        .update({ display_order: slide.display_order })
        .eq("id", swapSlide.id);

      if (err1 || err2) throw new Error("Order swap failed");
      fetchSlides();
    } catch (err: any) {
      setErrorMsg("Failed to reorder: " + err.message);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-xs text-milan-gold font-mono tracking-widest animate-pulse">
          LOADING HERO SLIDES...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <header className="pb-6 border-b border-milan-border flex items-center justify-between">
        <div>
          <h1 className="heading-display text-2xl text-milan-ivory">
            HERO BANNERS
          </h1>
          <p className="text-xs text-milan-muted mt-1 font-mono">
            Manage multi-row slider content, CTAs, and background images rendered at the top of the homepage.
          </p>
        </div>
        {!editingSlide && !isCreateMode && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center space-x-2 px-4 py-2 border border-milan-gold text-milan-gold hover:bg-milan-gold hover:text-milan-primary text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Slide</span>
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

      {/* Editor Form */}
      {(isCreateMode || editingSlide) && (
        <form onSubmit={handleSave} className="bg-milan-primary border border-milan-border p-6 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-milan-border pb-4">
            <h2 className="heading-display text-xs text-milan-gold tracking-widest">
              {isCreateMode ? "Create New Hero Slide" : `Edit Slide: ${editingSlide?.heading}`}
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsCreateMode(false);
                setEditingSlide(null);
              }}
              className="text-xs text-milan-muted hover:text-milan-ivory font-mono uppercase tracking-wider"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="eyebrow" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Eyebrow text
              </label>
              <input
                id="eyebrow"
                type="text"
                value={formData.eyebrow}
                onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors"
                placeholder="e.g. Interior Design | Fit-Out"
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

          <div className="space-y-2">
            <label htmlFor="heading" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
              Main Heading *
            </label>
            <input
              id="heading"
              type="text"
              required
              value={formData.heading}
              onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
              className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors font-serif"
              placeholder="e.g. LUXURY, DESIGNED AROUND YOU."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="subheading" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
              Subheading / Supporting Description
            </label>
            <textarea
              id="subheading"
              rows={3}
              value={formData.subheading}
              onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
              className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors resize-none leading-relaxed"
              placeholder="e.g. Elevating Spaces. Defining Luxury."
            />
          </div>

          {/* Background Image Upload */}
          <div className="bg-milan-charcoal/30 border border-milan-border p-5 space-y-4">
            <span className="text-[10px] tracking-wider text-milan-gold uppercase font-mono block">
              Background Image Configuration
            </span>
            <div className="space-y-4">
              <CloudinaryUploadButton
                folder="milan-interio/hero"
                currentImageUrl={formData.background_image_url}
                onUploadSuccess={(url) => setFormData(prev => ({ ...prev, background_image_url: url }))}
                onImageRemoved={() => setFormData(prev => ({ ...prev, background_image_url: "" }))}
                label="Upload Slide Background"
              />
              <div className="space-y-2">
                <label htmlFor="background_image_url" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                  Or External Image URL
                </label>
                <input
                  id="background_image_url"
                  type="text"
                  value={formData.background_image_url}
                  onChange={(e) => setFormData({ ...formData, background_image_url: e.target.value })}
                  className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors font-mono"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* CTA Buttons Config */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary CTA */}
            <div className="bg-milan-charcoal/20 border border-milan-border p-4 space-y-4">
              <span className="text-[10px] tracking-wider text-milan-gold uppercase font-mono block">
                Primary CTA Button
              </span>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="primary_cta_label" className="text-[9px] text-milan-muted font-mono uppercase">Label</label>
                  <input
                    id="primary_cta_label"
                    type="text"
                    value={formData.primary_cta_label}
                    onChange={(e) => setFormData({ ...formData, primary_cta_label: e.target.value })}
                    className="w-full bg-milan-charcoal/50 border border-milan-border p-2 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none"
                    placeholder="EXPLORE WORK"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="primary_cta_url" className="text-[9px] text-milan-muted font-mono uppercase">URL</label>
                  <input
                    id="primary_cta_url"
                    type="text"
                    value={formData.primary_cta_url}
                    onChange={(e) => setFormData({ ...formData, primary_cta_url: e.target.value })}
                    className="w-full bg-milan-charcoal/50 border border-milan-border p-2 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none font-mono"
                    placeholder="/projects"
                  />
                </div>
              </div>
            </div>

            {/* Secondary CTA */}
            <div className="bg-milan-charcoal/20 border border-milan-border p-4 space-y-4">
              <span className="text-[10px] tracking-wider text-milan-gold uppercase font-mono block">
                Secondary CTA Button
              </span>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="secondary_cta_label" className="text-[9px] text-milan-muted font-mono uppercase">Label</label>
                  <input
                    id="secondary_cta_label"
                    type="text"
                    value={formData.secondary_cta_label}
                    onChange={(e) => setFormData({ ...formData, secondary_cta_label: e.target.value })}
                    className="w-full bg-milan-charcoal/50 border border-milan-border p-2 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none"
                    placeholder="START A PROJECT"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="secondary_cta_url" className="text-[9px] text-milan-muted font-mono uppercase">URL</label>
                  <input
                    id="secondary_cta_url"
                    type="text"
                    value={formData.secondary_cta_url}
                    onChange={(e) => setFormData({ ...formData, secondary_cta_url: e.target.value })}
                    className="w-full bg-milan-charcoal/50 border border-milan-border p-2 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none font-mono"
                    placeholder="/contact"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              id="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 accent-milan-gold cursor-pointer"
            />
            <label htmlFor="is_active" className="text-xs text-milan-ivory font-mono cursor-pointer select-none">
              Visible on homepage (Active)
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold text-xs tracking-widest font-semibold uppercase transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              {saving ? "SAVING..." : "SAVE SLIDE"}
            </button>
          </div>
        </form>
      )}

      {/* Slides List Grid */}
      <div className="space-y-4">
        <h2 className="heading-display text-xs text-milan-gold tracking-widest">
          Active Carousel Slides
        </h2>

        {slides.length === 0 ? (
          <div className="bg-milan-primary border border-milan-border p-8 text-center">
            <p className="text-xs text-milan-muted">No hero slides found. Create one above to render content.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                className="bg-milan-primary border border-milan-border p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Details */}
                <div className="flex items-center space-x-4 min-w-0">
                  <div className="w-16 h-12 bg-milan-charcoal border border-milan-border overflow-hidden relative shrink-0">
                    {slide.background_image_url ? (
                      <img
                        src={slide.background_image_url}
                        alt=""
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-milan-muted font-mono uppercase text-center p-1 leading-none">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono text-milan-muted">
                        [{slide.display_order}]
                      </span>
                      <h3 className="text-sm font-semibold text-milan-ivory truncate">{slide.heading}</h3>
                    </div>
                    {slide.subheading && (
                      <p className="text-xs text-milan-muted truncate mt-0.5">{slide.subheading}</p>
                    )}
                  </div>
                </div>

                {/* Operations & Buttons */}
                <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleActive(slide)}
                    className="p-1 cursor-pointer focus:outline-none"
                    title={slide.is_active ? "Click to deactivate" : "Click to activate"}
                  >
                    {slide.is_active ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <XCircle size={18} className="text-milan-muted" />
                    )}
                  </button>

                  {/* Reorder Buttons */}
                  <div className="flex items-center space-x-1 border-r border-milan-border pr-4">
                    <button
                      onClick={() => handleReorder(slide, "up")}
                      disabled={idx === 0}
                      className="p-1 text-milan-muted hover:text-milan-gold disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => handleReorder(slide, "down")}
                      disabled={idx === slides.length - 1}
                      className="p-1 text-milan-muted hover:text-milan-gold disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleOpenEdit(slide)}
                      className="p-1 text-milan-muted hover:text-milan-gold cursor-pointer"
                      title="Edit Slide"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(slide.id, slide.heading)}
                      className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                      title="Delete Slide"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
