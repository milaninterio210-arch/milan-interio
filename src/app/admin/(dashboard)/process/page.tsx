"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface ProcessStep {
  id: string;
  step_number: string;
  title: string;
  description: string | null;
}

export default function AdminProcessPage() {
  const supabase = createClient();
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [editingStep, setEditingStep] = useState<ProcessStep | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const [formData, setFormData] = useState({
    step_number: "",
    title: "",
    description: "",
  });

  async function fetchSteps() {
    try {
      const { data, error } = await supabase
        .from("process_steps")
        .select("*")
        .order("step_number", { ascending: true });

      if (error) throw error;
      setSteps(data || []);
    } catch (err: any) {
      setErrorMsg("Failed to load process steps: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSteps();
  }, []);

  function handleOpenEdit(step: ProcessStep) {
    setEditingStep(step);
    setIsCreateMode(false);
    setFormData({
      step_number: step.step_number,
      title: step.title,
      description: step.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleOpenCreate() {
    setIsCreateMode(true);
    setEditingStep(null);
    setFormData({
      step_number: String(steps.length + 1).padStart(2, "0"),
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
        step_number: formData.step_number.trim(),
        title: formData.title.trim(),
        description: formData.description.trim() || null,
      };

      if (isCreateMode) {
        const { error } = await supabase
          .from("process_steps")
          .insert(payload);

        if (error) throw error;
        setSuccessMsg("Process step created successfully.");
      } else if (editingStep) {
        const { error } = await supabase
          .from("process_steps")
          .update(payload)
          .eq("id", editingStep.id);

        if (error) throw error;
        setSuccessMsg("Process step updated successfully.");
      }

      setIsCreateMode(false);
      setEditingStep(null);
      fetchSteps();
    } catch (err: any) {
      setErrorMsg("Failed to save process step: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete the process step: "${title}"?`)) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { error } = await supabase
        .from("process_steps")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSuccessMsg("Process step deleted successfully.");
      fetchSteps();
    } catch (err: any) {
      setErrorMsg("Failed to delete process step: " + err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-xs text-milan-gold font-mono tracking-widest animate-pulse">
          LOADING PROCESS STEPS...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <header className="pb-6 border-b border-milan-border flex items-center justify-between">
        <div>
          <h1 className="heading-display text-2xl text-milan-ivory">
            PROCESS STEPS
          </h1>
          <p className="text-xs text-milan-muted mt-1 font-mono">
            Configure chronological stages of the Milan Standard design methodology.
          </p>
        </div>
        {!editingStep && !isCreateMode && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center space-x-2 px-4 py-2 border border-milan-gold text-milan-gold hover:bg-milan-gold hover:text-milan-primary text-xs font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Step</span>
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

      {/* Editor Form */}
      {(isCreateMode || editingStep) && (
        <form onSubmit={handleSave} className="bg-milan-primary border border-milan-border p-6 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-milan-border pb-4">
            <h2 className="heading-display text-xs text-milan-gold tracking-widest">
              {isCreateMode ? "Create Process Step" : `Edit Step: ${editingStep?.title}`}
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsCreateMode(false);
                setEditingStep(null);
              }}
              className="text-xs text-milan-muted hover:text-milan-ivory font-mono uppercase tracking-wider"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="step_number" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Step Number * (Unique text)
              </label>
              <input
                id="step_number"
                type="text"
                required
                value={formData.step_number}
                onChange={(e) => setFormData({ ...formData, step_number: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors font-mono"
                placeholder="e.g. 01"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Step Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors"
                placeholder="e.g. DISCOVER"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
              Step Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors resize-none leading-relaxed"
              placeholder="e.g. We understand client requirements..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold text-xs tracking-widest font-semibold uppercase transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              {saving ? "SAVING STEP..." : "SAVE STEP"}
            </button>
          </div>
        </form>
      )}

      {/* Steps List Timeline */}
      <div className="space-y-4">
        {steps.length === 0 ? (
          <div className="bg-milan-primary border border-milan-border p-8 text-center">
            <p className="text-xs text-milan-muted">No process steps configured yet. Create one above to render content.</p>
          </div>
        ) : (
          steps.map((step) => (
            <div
              key={step.id}
              className="bg-milan-primary border border-milan-border p-5 flex items-start justify-between gap-6 hover:border-milan-gold/20 transition-all duration-300"
            >
              <div className="flex items-start space-x-4 min-w-0">
                <span className="text-xs font-mono text-milan-gold border border-milan-gold/20 px-2 py-0.5 bg-milan-charcoal/50 shrink-0">
                  {step.step_number}
                </span>
                <div className="min-w-0">
                  <h3 className="heading-display text-sm text-milan-ivory font-serif tracking-wider">
                    {step.title}
                  </h3>
                  <p className="text-xs text-milan-muted leading-relaxed font-light mt-1">
                    {step.description || "No description provided."}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={() => handleOpenEdit(step)}
                  className="text-milan-muted hover:text-milan-gold p-1 cursor-pointer"
                  title="Edit Step"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(step.id, step.title)}
                  className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                  title="Delete Step"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
