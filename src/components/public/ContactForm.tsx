"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const PROJECT_TYPES = [
  "Residential",
  "Commercial",
  "Hospitality",
  "Office",
  "Retail",
];

export function ContactForm() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    project_type: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const { error } = await supabase.from("inquiries").insert({
      full_name: formData.full_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      project_type: formData.project_type || null,
      message: formData.message.trim(),
    });

    if (error) {
      setStatus("error");
      setErrorMessage("We could not submit your inquiry. Please try again.");
      return;
    }

    setStatus("success");
    setFormData({ full_name: "", email: "", phone: "", project_type: "", message: "" });
  }

  if (status === "success") {
    return (
      <div className="border border-milan-gold/30 bg-milan-charcoal/30 p-12 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 mx-auto border border-milan-gold flex items-center justify-center text-milan-gold text-2xl font-serif">
          ✓
        </div>
        <h3 className="heading-display text-xl sm:text-2xl text-milan-ivory font-serif">
          INQUIRY RECEIVED
        </h3>
        <p className="text-sm text-milan-muted font-light max-w-md mx-auto">
          Thank you for reaching out. Our design team will review your inquiry and respond within 48 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-xs tracking-widest text-milan-gold hover:text-milan-ivory transition-colors uppercase font-mono"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Name & Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label htmlFor="full_name" className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
            Full Name *
          </label>
          <input
            id="full_name"
            type="text"
            required
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full bg-transparent border-b border-milan-border py-3 text-sm text-milan-ivory placeholder:text-milan-muted/50 focus:border-milan-gold focus:outline-none transition-colors"
            placeholder="Your full name"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-transparent border-b border-milan-border py-3 text-sm text-milan-ivory placeholder:text-milan-muted/50 focus:border-milan-gold focus:outline-none transition-colors"
            placeholder="your@email.com"
          />
        </div>
      </div>

      {/* Phone & Project Type row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-transparent border-b border-milan-border py-3 text-sm text-milan-ivory placeholder:text-milan-muted/50 focus:border-milan-gold focus:outline-none transition-colors"
            placeholder="Optional"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="project_type" className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
            Project Type
          </label>
          <select
            id="project_type"
            value={formData.project_type}
            onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
            className="w-full bg-transparent border-b border-milan-border py-3 text-sm text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors appearance-none cursor-pointer"
          >
            <option value="" className="bg-milan-charcoal text-milan-muted">Select type (optional)</option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type} className="bg-milan-charcoal text-milan-ivory">
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label htmlFor="message" className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
          Project Details *
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-transparent border-b border-milan-border py-3 text-sm text-milan-ivory placeholder:text-milan-muted/50 focus:border-milan-gold focus:outline-none transition-colors resize-none"
          placeholder="Describe your project requirements, preferred style, approximate budget, and timelines..."
        />
      </div>

      {/* Error message */}
      {status === "error" && (
        <p className="text-xs text-red-400 font-mono">{errorMessage}</p>
      )}

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full sm:w-auto border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold px-10 py-4 text-xs tracking-widest font-semibold uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "SUBMITTING..." : "SUBMIT INQUIRY"}
        </button>
      </div>
    </form>
  );
}
