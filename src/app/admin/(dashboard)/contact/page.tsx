"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Phone, Mail, MapPin, Building2, Globe, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminContactPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    contact_phone: "",
    contact_email: "",
    office_address: "",
    cr_number: "",
    vat_number: "",
    instagram_url: "",
    linkedin_url: "",
  });

  useEffect(() => {
    async function fetchContactSettings() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("contact_phone, contact_email, office_address, cr_number, vat_number, instagram_url, linkedin_url")
          .eq("singleton_key", "default")
          .single();

        if (error) throw error;
        if (data) {
          setFormData({
            contact_phone: data.contact_phone || "",
            contact_email: data.contact_email || "",
            office_address: data.office_address || "",
            cr_number: data.cr_number || "",
            vat_number: data.vat_number || "",
            instagram_url: data.instagram_url || "",
            linkedin_url: data.linkedin_url || "",
          });
        }
      } catch (err: any) {
        setErrorMsg("Failed to load contact info: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchContactSettings();
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
          contact_phone: formData.contact_phone.trim() || null,
          contact_email: formData.contact_email.trim() || null,
          office_address: formData.office_address.trim() || null,
          cr_number: formData.cr_number.trim() || null,
          vat_number: formData.vat_number.trim() || null,
          instagram_url: formData.instagram_url.trim() || null,
          linkedin_url: formData.linkedin_url.trim() || null,
        })
        .eq("singleton_key", "default");

      if (error) throw error;
      setSuccessMsg("Contact details, Saudi credentials, and public info saved successfully.");
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
          LOADING CONTACT & INFO...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <header className="pb-6 border-b border-milan-border flex items-center justify-between">
        <div>
          <h1 className="heading-display text-2xl text-milan-ivory">
            CONTACT & INFO
          </h1>
          <p className="text-xs text-milan-muted mt-1 font-mono">
            Manage public studio contact numbers, official Saudi legal credentials (CR & VAT), office address, and social links.
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
        {/* Contact Phone & Email */}
        <div className="bg-milan-primary border border-milan-border p-6 space-y-6">
          <div className="flex items-center gap-2 text-milan-gold">
            <Phone size={16} />
            <h2 className="heading-display text-xs tracking-widest uppercase">
              Direct Communication
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="contact_phone" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Saudi Contact Phone
              </label>
              <input
                id="contact_phone"
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors font-mono"
                placeholder="+966 55 893 4342"
              />
              <p className="text-[9px] text-milan-muted font-mono">
                Shown in Navbar, Footer, and Contact Page.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="contact_email" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Official Email Address
              </label>
              <input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors font-mono"
                placeholder="info@milaninterio.com"
              />
              <p className="text-[9px] text-milan-muted font-mono">
                Primary inquiry and correspondence email.
              </p>
            </div>
          </div>
        </div>

        {/* Saudi Business Credentials */}
        <div className="bg-milan-primary border border-milan-border p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-milan-gold">
              <ShieldCheck size={16} />
              <h2 className="heading-display text-xs tracking-widest uppercase">
                Saudi Business & Legal Credentials
              </h2>
            </div>
            <span className="text-[9px] font-mono text-milan-gold border border-milan-gold/30 px-2 py-0.5 bg-milan-emerald/40">
              KSA COMPLIANCE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="cr_number" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Commercial Registration (CR Number)
              </label>
              <input
                id="cr_number"
                type="text"
                value={formData.cr_number}
                onChange={(e) => setFormData({ ...formData, cr_number: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors font-mono"
                placeholder="e.g. 2050123456"
              />
              <p className="text-[9px] text-milan-muted font-mono">
                Displayed in the Footer & Contact Info.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="vat_number" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                VAT / Tax Identification Number
              </label>
              <input
                id="vat_number"
                type="text"
                value={formData.vat_number}
                onChange={(e) => setFormData({ ...formData, vat_number: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors font-mono"
                placeholder="e.g. 310123456700003"
              />
              <p className="text-[9px] text-milan-muted font-mono">
                Displayed alongside CR in the Footer & Contact Info.
              </p>
            </div>
          </div>
        </div>

        {/* Physical Office Address */}
        <div className="bg-milan-primary border border-milan-border p-6 space-y-6">
          <div className="flex items-center gap-2 text-milan-gold">
            <MapPin size={16} />
            <h2 className="heading-display text-xs tracking-widest uppercase">
              Office Location
            </h2>
          </div>

          <div className="space-y-2">
            <label htmlFor="office_address" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
              Studio & Office Address
            </label>
            <textarea
              id="office_address"
              rows={3}
              value={formData.office_address}
              onChange={(e) => setFormData({ ...formData, office_address: e.target.value })}
              className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors resize-none leading-relaxed font-mono"
              placeholder="Milan Interio, Prince Faisal Bin Fahd Road, Dammam, Kingdom of Saudi Arabia"
            />
          </div>
        </div>

        {/* Social Media Channels */}
        <div className="bg-milan-primary border border-milan-border p-6 space-y-6">
          <div className="flex items-center gap-2 text-milan-gold">
            <Globe size={16} />
            <h2 className="heading-display text-xs tracking-widest uppercase">
              Social Channels & Portals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="instagram_url" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Instagram URL
              </label>
              <input
                id="instagram_url"
                type="url"
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors font-mono"
                placeholder="https://instagram.com/milaninterio"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="linkedin_url" className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                LinkedIn URL
              </label>
              <input
                id="linkedin_url"
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                className="w-full bg-milan-charcoal/50 border border-milan-border p-3 text-xs text-milan-ivory focus:border-milan-gold focus:outline-none transition-colors font-mono"
                placeholder="https://linkedin.com/company/milaninterio"
              />
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold text-xs tracking-widest font-semibold uppercase transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {saving ? "SAVING CONTACT & INFO..." : "SAVE CONTACT & INFO"}
          </button>
        </div>
      </form>
    </div>
  );
}
