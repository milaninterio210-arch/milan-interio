"use client";

import { useState, useRef, useEffect } from "react";
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      <div className="space-y-1.5 text-left relative" ref={dropdownRef}>
        <label className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block font-semibold">
          PROJECT TYPE
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-milan-primary/30 border border-milan-border/60 hover:border-milan-gold/40 focus:border-milan-gold focus:outline-none px-4 py-3 text-sm text-milan-ivory transition-all duration-300 cursor-pointer flex items-center justify-between text-left font-sans"
          >
            <span>
              {formData.project_type || "Select project type"}
            </span>
            <ChevronDown
              size={15}
              className={`text-milan-gold transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 right-0 mt-1.5 bg-milan-charcoal border border-milan-border/80 z-50 animate-fade-in shadow-2xl divide-y divide-milan-border/20">
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, project_type: "" });
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-3.5 text-left text-xs text-milan-muted hover:text-milan-gold hover:bg-milan-emerald/20 transition-colors font-sans cursor-pointer"
              >
                Select project type
              </button>
              {PROJECT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, project_type: type });
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors font-sans cursor-pointer ${
                    formData.project_type === type
                      ? "text-milan-gold bg-milan-emerald/30 font-semibold"
                      : "text-milan-ivory hover:text-milan-gold hover:bg-milan-emerald/20"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
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
