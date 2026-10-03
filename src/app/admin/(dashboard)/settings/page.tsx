"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import CloudinaryUploadButton from "@/components/admin/CloudinaryUploadButton";
import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    brand_name: "",
    primary_tagline: "",
    supporting_tagline: "",
    design_philosophy: "",
    design_philosophy_explanation: "",
    services_banner_image_url: "",
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("brand_name, primary_tagline, supporting_tagline, design_philosophy, design_philosophy_explanation, services_banner_image_url")
          .eq("singleton_key", "default")
          .single();

        if (error) throw error;
        if (data) {
          setFormData({
            brand_name: data.brand_name || "",
            primary_tagline: data.primary_tagline || "",
            supporting_tagline: data.supporting_tagline || "",
            design_philosophy: data.design_philosophy || "",
            design_philosophy_explanation: data.design_philosophy_explanation || "",
            services_banner_image_url: data.services_banner_image_url || "",
          });
        }
      } catch (err: any) {
        setErrorMsg("Failed to load settings: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const { error } = await supabase
        .from("site_settings")
        .update({
          brand_name: formData.brand_name.trim(),
          primary_tagline: formData.primary_tagline.trim(),
          supporting_tagline: formData.supporting_tagline.trim(),
          design_philosophy: formData.design_philosophy.trim(),
          design_philosophy_explanation: formData.design_philosophy_explanation.trim(),
          services_banner_image_url: formData.services_banner_image_url.trim() || null,
        })
        .eq("singleton_key", "default");

      if (error) throw error;
      setSuccessMsg("Global branding & site settings updated successfully.");
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
          LOADING SETTINGS...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <header className="pb-6 border-b border-milan-border flex items-center justify-between">
        <div>
          <h1 className="heading-display text-2xl text-milan-ivory">
            GLOBAL SITE SETTINGS
          </h1>
          <p className="text-xs text-milan-muted mt-1 font-mono">
            Configuration parameters for branding, SEO taglines, design philosophy, and banner assets.
          </p>
        </div>
      </header>

      {successMsg && (
        <div className="bg-emerald-950/40 border-l-4 border-emerald-500 p-4 text-xs text-emerald-400 font-mono flex items-center gap-3 animate-fade-in shadow-lg shadow-emerald-500/5">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-950/40 border-l-4 border-red-500 p-4 text-xs text-red-400 font-mono flex items-center gap-3 animate-fade-in shadow-lg shadow-red-500/5">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-milan-primary border border-milan-border p-6 space-y-6">
          <div className="flex items-center gap-2 text-milan-gold">
            <Sparkles size={16} />
            <h2 className="heading-display text-xs tracking-widest uppercase">
              Branding & Positioning
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="brand_name" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Brand Name *
              </label>
              <input
                id="brand_name"
                type="text"
                required
                value={formData.brand_name}
                onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors font-mono"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="design_philosophy" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Design Philosophy *
              </label>
              <input
                id="design_philosophy"
                type="text"
                required
                value={formData.design_philosophy}
                onChange={(e) => setFormData({ ...formData, design_philosophy: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="primary_tagline" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
              Primary Tagline *
            </label>
            <input
              id="primary_tagline"
              type="text"
              required
              value={formData.primary_tagline}
              onChange={(e) => setFormData({ ...formData, primary_tagline: e.target.value })}
              className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="supporting_tagline" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
              Supporting Tagline *
            </label>
            <input
              id="supporting_tagline"
              type="text"
              required
              value={formData.supporting_tagline}
              onChange={(e) => setFormData({ ...formData, supporting_tagline: e.target.value })}
              className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="design_philosophy_explanation" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
              Design Philosophy Explanation *
            </label>
            <textarea
              id="design_philosophy_explanation"
              required
              rows={4}
              value={formData.design_philosophy_explanation}
              onChange={(e) => setFormData({ ...formData, design_philosophy_explanation: e.target.value })}
              className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Services Banner Image Uploader */}
          <div className="space-y-2 pt-4 border-t border-milan-border/40">
            <label className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
              Services Showcase Banner Image
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {formData.services_banner_image_url ? (
                <div className="w-32 aspect-[16/9] bg-milan-charcoal border border-milan-border overflow-hidden relative shrink-0">
                  <img
                    src={formData.services_banner_image_url}
                    alt="Services Banner"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, services_banner_image_url: "" })}
                    className="absolute top-1 right-1 p-1 bg-black/75 hover:bg-black text-[9px] text-red-400 font-mono border-0 cursor-pointer"
                  >
                    REMOVE
                  </button>
                </div>
              ) : (
                <div className="w-32 aspect-[16/9] bg-milan-charcoal border border-milan-border/60 flex items-center justify-center text-[10px] text-milan-muted font-mono tracking-wider uppercase shrink-0">
                  No Image
                </div>
              )}
              <div className="space-y-1">
                <CloudinaryUploadButton
                  onUploadSuccess={(url: string) => setFormData({ ...formData, services_banner_image_url: url })}
                  folder="milan-interio/settings"
                />
                <p className="text-[9px] text-milan-muted font-mono leading-relaxed max-w-sm">
                  Recommended: Cinematic landscape aspect ratio (e.g. 16:9 or 21:9). Direct secure upload.
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
            {saving ? "SAVING GLOBAL SETTINGS..." : "SAVE SETTINGS"}
          </button>
        </div>
      </form>
    </div>
  );
}
