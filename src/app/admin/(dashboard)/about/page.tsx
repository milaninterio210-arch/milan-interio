"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import CloudinaryUploadButton from "@/components/admin/CloudinaryUploadButton";

export default function AdminAboutPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    introduction: "",
    vision: "",
    mission: "",
    design_philosophy: "",
    why_milan: "",
    quality_commitment: "",
    our_promise: "",
    banner_image_url: "",
  });

  useEffect(() => {
    async function fetchAbout() {
      try {
        const { data, error } = await supabase
          .from("about_content")
          .select("*")
          .eq("singleton_key", "default")
          .single();

        if (error) throw error;
        if (data) {
          setFormData({
            introduction: data.introduction || "",
            vision: data.vision || "",
            mission: data.mission || "",
            design_philosophy: data.design_philosophy || "",
            why_milan: data.why_milan || "",
            quality_commitment: data.quality_commitment || "",
            our_promise: data.our_promise || "",
            banner_image_url: data.banner_image_url || "",
          });
        }
      } catch (err: any) {
        setErrorMsg("Failed to load about content: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const { error } = await supabase
        .from("about_content")
        .update({
          introduction: formData.introduction.trim() || null,
          vision: formData.vision.trim(),
          mission: formData.mission.trim(),
          design_philosophy: formData.design_philosophy.trim(),
          why_milan: formData.why_milan.trim() || null,
          quality_commitment: formData.quality_commitment.trim(),
          our_promise: formData.our_promise.trim(),
          banner_image_url: formData.banner_image_url.trim() || null,
        })
        .eq("singleton_key", "default");

      if (error) throw error;
      setSuccessMsg("About content updated successfully.");
    } catch (err: any) {
      setErrorMsg("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-xs text-milan-gold font-mono tracking-widest animate-pulse">
          LOADING ABOUT CONTENT...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <header className="pb-6 border-b border-milan-border">
        <h1 className="heading-display text-2xl text-milan-ivory">
          MANAGE ABOUT CONTENT
        </h1>
        <p className="text-xs text-milan-muted mt-1 font-mono">
          Update vision, mission statement, promises, and brand reasons for the about page section.
        </p>
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

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-milan-primary border border-milan-border p-6 space-y-6">
          <h2 className="heading-display text-xs text-milan-gold tracking-widest">
            Core Statements
          </h2>

          <div className="space-y-2">
            <label htmlFor="introduction" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
              Introduction Text
            </label>
            <textarea
              id="introduction"
              rows={4}
              value={formData.introduction}
              onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
              className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors resize-none leading-relaxed"
              placeholder="e.g. MILAN INTERIO is a premium interior design and fit-out company..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="design_philosophy" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
              Design Philosophy Title *
            </label>
            <input
              id="design_philosophy"
              type="text"
              required
              value={formData.design_philosophy}
              onChange={(e) => setFormData({ ...formData, design_philosophy: e.target.value })}
              className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors"
              placeholder="e.g. Elegant. Functional. Timeless."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="vision" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
              Vision Statement *
            </label>
            <textarea
              id="vision"
              required
              rows={3}
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="mission" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
              Mission Statement *
            </label>
            <textarea
              id="mission"
              required
              rows={3}
              value={formData.mission}
              onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors resize-none leading-relaxed"
            />
          </div>
        </div>

        <div className="bg-milan-primary border border-milan-border p-6 space-y-6">
          <h2 className="heading-display text-xs text-milan-gold tracking-widest">
            Commitment & Why Milan
          </h2>

          <div className="space-y-2">
            <label htmlFor="why_milan" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
              Why Milan Interio Points (One point per line)
            </label>
            <textarea
              id="why_milan"
              rows={6}
              value={formData.why_milan}
              onChange={(e) => setFormData({ ...formData, why_milan: e.target.value })}
              className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors font-mono leading-relaxed"
              placeholder="Design Excellence&#10;Attention to Detail&#10;Quality Craftsmanship..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="quality_commitment" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Quality Commitment *
              </label>
              <textarea
                id="quality_commitment"
                required
                rows={4}
                value={formData.quality_commitment}
                onChange={(e) => setFormData({ ...formData, quality_commitment: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="our_promise" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Our Promise *
              </label>
              <textarea
                id="our_promise"
                required
                rows={4}
                value={formData.our_promise}
                onChange={(e) => setFormData({ ...formData, our_promise: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Banner Image Uploader */}
          <div className="space-y-2 pt-4 border-t border-milan-border/40">
            <label className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
              About Showcase Banner Image
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {formData.banner_image_url ? (
                <div className="w-32 aspect-[4/3] bg-milan-charcoal border border-milan-border overflow-hidden relative shrink-0">
                  <img
                    src={formData.banner_image_url}
                    alt="About Showcase Banner"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, banner_image_url: "" })}
                    className="absolute top-1 right-1 p-1 bg-black/75 hover:bg-black text-[9px] text-red-400 font-mono border-0 cursor-pointer"
                  >
                    REMOVE
                  </button>
                </div>
              ) : (
                <div className="w-32 aspect-[4/3] bg-milan-charcoal border border-milan-border/60 flex items-center justify-center text-[10px] text-milan-muted font-mono tracking-wider uppercase shrink-0">
                  No Image
                </div>
              )}
              <div className="space-y-1">
                <CloudinaryUploadButton
                  onUploadSuccess={(url: string) => setFormData({ ...formData, banner_image_url: url })}
                  folder="about"
                />
                <p className="text-[9px] text-milan-muted font-mono leading-relaxed max-w-sm">
                  Recommended: Widescreen ratio (e.g. 4:3 or 16:10). Direct browser upload to Cloudinary.
                </p>
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
            {saving ? "SAVING ABOUT CONTENT..." : "SAVE ABOUT CONTENT"}
          </button>
        </div>
      </form>
    </div>
  );
}
