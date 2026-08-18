"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface Pillar {
  id: string;
  pillar_number: string;
  title: string;
  description: string | null;
}

export default function AdminPillarsPage() {
  const supabase = createClient();
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [editingPillar, setEditingPillar] = useState<Pillar | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const [formData, setFormData] = useState({
    pillar_number: "",
    title: "",
    description: "",
  });

  async function fetchPillars() {
    try {
      const { data, error } = await supabase
        .from("pillars")
        .select("*")
        .order("pillar_number", { ascending: true });

      if (error) throw error;
      setPillars(data || []);
    } catch (err: any) {
      setErrorMsg("Failed to load pillars: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPillars();
  }, []);

  function handleOpenEdit(pillar: Pillar) {
    setEditingPillar(pillar);
    setIsCreateMode(false);
    setFormData({
      pillar_number: pillar.pillar_number,
      title: pillar.title,
      description: pillar.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleOpenCreate() {
    setIsCreateMode(true);
    setEditingPillar(null);
    setFormData({
      pillar_number: String(pillars.length + 1).padStart(2, "0"),
      title: "",
      description: "",
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
        pillar_number: formData.pillar_number.trim(),
        title: formData.title.trim(),
        description: formData.description.trim() || null,
      };

      if (isCreateMode) {
        const { error } = await supabase
          .from("pillars")
          .insert(payload);

        if (error) throw error;
        setSuccessMsg("Pillar created successfully.");
      } else if (editingPillar) {
        const { error } = await supabase
          .from("pillars")
          .update(payload)
          .eq("id", editingPillar.id);

        if (error) throw error;
        setSuccessMsg("Pillar updated successfully.");
      }

      setIsCreateMode(false);
      setEditingPillar(null);
      fetchPillars();
    } catch (err: any) {
      setErrorMsg("Failed to save pillar: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete the pillar: "${title}"?`)) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { error } = await supabase
        .from("pillars")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSuccessMsg("Pillar deleted successfully.");
      fetchPillars();
    } catch (err: any) {
      setErrorMsg("Failed to delete pillar: " + err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-xs text-milan-gold font-mono tracking-widest animate-pulse">
          LOADING PILLARS...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <header className="pb-6 border-b border-milan-border flex items-center justify-between">
        <div>
          <h1 className="heading-display text-2xl text-milan-ivory">
            BRAND PILLARS
          </h1>
          <p className="text-xs text-milan-muted mt-1 font-mono">
            Configure pillars of the Milan Standard rendered under the philosophy section.
          </p>
        </div>
        {!editingPillar && !isCreateMode && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center space-x-2 px-4 py-2 border border-milan-gold text-milan-gold hover:bg-milan-gold hover:text-milan-primary text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Pillar</span>
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
      {(isCreateMode || editingPillar) && (
        <form onSubmit={handleSave} className="bg-milan-primary border border-milan-border p-6 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-milan-border pb-4">
            <h2 className="heading-display text-xs text-milan-gold tracking-widest">
              {isCreateMode ? "Create Brand Pillar" : `Edit Pillar: ${editingPillar?.title}`}
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsCreateMode(false);
                setEditingPillar(null);
              }}
              className="text-xs text-milan-muted hover:text-milan-ivory font-mono uppercase tracking-wider"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="pillar_number" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Pillar Number * (Unique text)
              </label>
              <input
                id="pillar_number"
                type="text"
                required
                value={formData.pillar_number}
                onChange={(e) => setFormData({ ...formData, pillar_number: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors font-mono"
                placeholder="e.g. 01"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Pillar Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors"
                placeholder="e.g. PROPORTION"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
              Pillar Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors resize-none leading-relaxed"
              placeholder="e.g. Elegant spatial distribution standard..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold text-xs tracking-widest font-semibold uppercase transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              {saving ? "SAVING PILLAR..." : "SAVE PILLAR"}
            </button>
          </div>
        </form>
      )}

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pillars.length === 0 ? (
          <div className="bg-milan-primary border border-milan-border p-8 text-center md:col-span-2">
            <p className="text-xs text-milan-muted">No pillars configured yet. Create one above to render content.</p>
          </div>
        ) : (
          pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="bg-milan-primary border border-milan-border p-6 flex flex-col justify-between hover:border-milan-gold/20 transition-all duration-300 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-milan-border/50 pb-2">
                  <span className="text-xs font-mono text-milan-gold font-semibold">
                    {pillar.pillar_number}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(pillar)}
                      className="text-milan-muted hover:text-milan-gold p-1 cursor-pointer"
                      title="Edit Pillar"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(pillar.id, pillar.title)}
                      className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                      title="Delete Pillar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="heading-display text-sm text-milan-ivory font-serif tracking-wider">
                  {pillar.title}
                </h3>
                <p className="text-xs text-milan-muted leading-relaxed font-light">
                  {pillar.description || "No description provided."}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
