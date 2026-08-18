"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
            <input
              id="introduction"
              type="text"
              value={formData.introduction}
              onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
              className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors"
              placeholder="e.g. Premium interior design and fit-out."
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
