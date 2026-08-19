"use client";

import { useState, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowRight, ChevronDown } from "lucide-react";

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
  const submittingRef = useRef(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Prevent duplicate submissions
    if (submittingRef.current) return;
    submittingRef.current = true;

    setStatus("submitting");
    setErrorMessage("");

    const { error } = await supabase.from("inquiries").insert({
      full_name: formData.full_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      project_type: formData.project_type || null,
      message: formData.message.trim(),
    });

    submittingRef.current = false;

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
      <div className="border border-milan-gold/30 p-10 sm:p-12 text-center space-y-5 animate-fade-in">
        <div className="w-14 h-14 mx-auto border border-milan-gold flex items-center justify-center text-milan-gold text-xl font-serif">
          ✓
        </div>
        <h3 className="heading-display text-lg sm:text-xl text-milan-ivory">
          INQUIRY RECEIVED
        </h3>
        <p className="text-sm text-milan-muted font-light max-w-sm mx-auto">
          Thank you for reaching out. Our design team will review your inquiry and respond within 48 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-[10px] tracking-widest text-milan-gold hover:text-milan-ivory transition-colors uppercase font-mono"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
      {/* Name */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="full_name" className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block font-semibold">
          YOUR NAME
        </label>
        <input
          id="full_name"
          type="text"
          required
          aria-required="true"
          autoComplete="name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          className="w-full bg-milan-primary/30 border border-milan-border/60 hover:border-milan-gold/40 focus:border-milan-gold focus:outline-none px-4 py-3 text-sm text-milan-ivory placeholder:text-milan-muted/30 transition-all duration-300 font-sans"
          placeholder="Enter your name"
        />
      </div>

      {/* Email Address */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="email" className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block font-semibold">
          EMAIL ADDRESS
        </label>
        <input
          id="email"
          type="email"
          required
          aria-required="true"
          autoComplete="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-milan-primary/30 border border-milan-border/60 hover:border-milan-gold/40 focus:border-milan-gold focus:outline-none px-4 py-3 text-sm text-milan-ivory placeholder:text-milan-muted/30 transition-all duration-300 font-sans"
          placeholder="Enter your email"
        />
      </div>

      {/* Phone Number */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="phone" className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block font-semibold">
          PHONE NUMBER
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full bg-milan-primary/30 border border-milan-border/60 hover:border-milan-gold/40 focus:border-milan-gold focus:outline-none px-4 py-3 text-sm text-milan-ivory placeholder:text-milan-muted/30 transition-all duration-300 font-sans"
          placeholder="Enter your phone number"
        />
      </div>

      {/* Project Type */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="project_type" className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block font-semibold">
          PROJECT TYPE
        </label>
        <div className="relative">
          <select
            id="project_type"
            value={formData.project_type}
            onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
            className="w-full bg-milan-primary/30 border border-milan-border/60 hover:border-milan-gold/40 focus:border-milan-gold focus:outline-none px-4 py-3 text-sm text-milan-ivory transition-all duration-300 cursor-pointer appearance-none font-sans"
          >
            <option value="">Select project type</option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type} className="bg-milan-charcoal text-milan-ivory">
                {type}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-milan-gold">
            <ChevronDown size={15} />
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="message" className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block font-semibold">
          YOUR MESSAGE
        </label>
        <textarea
          id="message"
          required
          aria-required="true"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-milan-primary/30 border border-milan-border/60 hover:border-milan-gold/40 focus:border-milan-gold focus:outline-none px-4 py-3 text-sm text-milan-ivory placeholder:text-milan-muted/30 transition-all duration-300 resize-none font-sans"
          placeholder="Tell us about your project..."
        />
      </div>

      {/* Error */}
      {status === "error" && (
        <p className="text-xs text-red-400 text-left mt-2" role="alert">{errorMessage}</p>
      )}

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold border border-milan-gold px-6 py-3.5 text-[11px] tracking-widest font-semibold uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer font-sans"
        >
          {status === "submitting" ? "SENDING..." : "SEND MESSAGE"}
          <ArrowRight size={14} />
        </button>
      </div>
    </form>
  );
}
