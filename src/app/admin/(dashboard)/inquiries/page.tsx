"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, Calendar, User, Phone, Trash2, Eye, X } from "lucide-react";

interface Inquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  project_type: string | null;
  message: string;
  created_at: string;
}

export default function AdminInquiriesPage() {
  const supabase = createClient();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  async function fetchInquiries() {
    try {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (err: any) {
      setErrorMsg("Failed to load inquiries: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete inquiry from "${name}"?`)) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { error } = await supabase
        .from("inquiries")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSuccessMsg("Inquiry deleted successfully.");
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
      fetchInquiries();
    } catch (err: any) {
      setErrorMsg("Failed to delete inquiry: " + err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-xs text-milan-gold font-mono tracking-widest animate-pulse">
          LOADING INBOX...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <header className="pb-6 border-b border-milan-border">
        <h1 className="heading-display text-2xl text-milan-ivory">
          CLIENT INQUIRIES
        </h1>
        <p className="text-xs text-milan-muted mt-1 font-mono">
          Private customer inquiries submitted via the public contact consultation page.
        </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inbox List (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
            Inbox ({inquiries.length})
          </span>

          {inquiries.length === 0 ? (
            <div className="bg-milan-primary border border-milan-border p-12 text-center text-xs text-milan-muted">
              No inquiries received yet.
            </div>
          ) : (
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  onClick={() => setSelectedInquiry(inquiry)}
                  className={`border p-5 flex flex-col space-y-3 cursor-pointer transition-colors duration-200 ${
                    selectedInquiry?.id === inquiry.id
                      ? "bg-milan-emerald border-milan-gold/30"
                      : "bg-milan-primary border-milan-border hover:border-milan-gold/25"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-milan-ivory">{inquiry.full_name}</h3>
                      <span className="text-[10px] font-mono text-milan-muted block mt-0.5">
                        {inquiry.email}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {inquiry.project_type && (
                        <span className="bg-milan-charcoal/80 border border-milan-border text-milan-gold text-[9px] tracking-wider px-2 py-0.5 uppercase font-semibold font-mono">
                          {inquiry.project_type}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(inquiry.id, inquiry.full_name);
                        }}
                        className="text-milan-muted hover:text-red-400 p-1 cursor-pointer transition-colors"
                        title="Delete Inquiry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-milan-muted line-clamp-2 italic font-serif">
                    &ldquo;{inquiry.message}&rdquo;
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-milan-muted font-mono pt-2 border-t border-milan-border/30">
                    <span className="flex items-center space-x-1">
                      <Calendar size={10} />
                      <span>
                        {new Date(inquiry.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </span>
                    <span className="flex items-center space-x-1 text-milan-gold hover:underline">
                      <Eye size={10} />
                      <span>View Message</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Details Panel (Span 5) */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
            Message Details
          </span>

          {selectedInquiry ? (
            <div className="bg-milan-primary border border-milan-border p-6 space-y-6 relative animate-fade-in">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="absolute top-4 right-4 text-milan-muted hover:text-milan-ivory cursor-pointer"
                title="Close Panel"
              >
                <X size={16} />
              </button>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-milan-gold">
                  <User size={16} />
                  <span className="text-xs font-mono uppercase tracking-wider">Client Identity</span>
                </div>
                <div className="space-y-1 pl-7">
                  <h2 className="text-base font-semibold text-milan-ivory">{selectedInquiry.full_name}</h2>
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-xs text-milan-muted hover:text-milan-gold font-mono block break-all"
                  >
                    {selectedInquiry.email}
                  </a>
                  {selectedInquiry.phone && (
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="text-xs text-milan-muted hover:text-milan-gold font-mono block mt-1"
                    >
                      {selectedInquiry.phone}
                    </a>
                  )}
                </div>
              </div>

              {selectedInquiry.project_type && (
                <div className="space-y-2 border-t border-milan-border/50 pt-4">
                  <span className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                    Project Type
                  </span>
                  <span className="inline-block bg-milan-charcoal/80 border border-milan-border text-milan-gold text-[10px] tracking-widest px-2.5 py-1 uppercase font-semibold font-mono">
                    {selectedInquiry.project_type}
                  </span>
                </div>
              )}

              <div className="space-y-3 border-t border-milan-border/50 pt-4">
                <div className="flex items-center space-x-3 text-milan-gold">
                  <Mail size={16} />
                  <span className="text-xs font-mono uppercase tracking-wider">Project details</span>
                </div>
                <div className="pl-7">
                  <p className="text-xs text-milan-ivory leading-relaxed font-light whitespace-pre-line bg-milan-charcoal/30 border border-milan-border p-4">
                    {selectedInquiry.message}
                  </p>
                </div>
              </div>

              <div className="text-[10px] text-milan-muted font-mono pt-4 border-t border-milan-border/50 flex justify-between">
                <span>SUBMITTED TIME:</span>
                <span>
                  {new Date(selectedInquiry.created_at).toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-milan-primary border border-milan-border p-12 text-center text-xs text-milan-muted italic font-light">
              Select an inquiry message from the list to display details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
