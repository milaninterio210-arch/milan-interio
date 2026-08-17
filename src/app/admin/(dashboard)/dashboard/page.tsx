import { createClient } from "@/lib/supabase/server";
import {
  Briefcase,
  Image,
  Wrench,
  Mail,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 1. Fetch site settings (seeded singleton)
  const { data: settings } = await supabase
    .from("site_settings")
    .select("brand_name, primary_tagline, design_philosophy")
    .eq("singleton_key", "default")
    .single();

  // 2. Fetch projects counts
  const { count: totalProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  const { count: publishedProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  // 3. Fetch studio gallery count
  const { count: studioCount } = await supabase
    .from("studio_gallery")
    .select("*", { count: "exact", head: true });

  // 4. Fetch services count
  const { count: servicesCount } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true });

  // 5. Fetch process steps count
  const { count: processCount } = await supabase
    .from("process_steps")
    .select("*", { count: "exact", head: true });

  // 6. Fetch inquiries count & recent inquiries
  const { count: totalInquiries } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true });

  const { data: recentInquiries } = await supabase
    .from("inquiries")
    .select("id, full_name, email, project_type, message, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <header className="pb-6 border-b border-milan-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="heading-display text-3xl text-milan-ivory font-serif tracking-wide">
            DASHBOARD OVERVIEW
          </h1>
          <p className="text-xs text-milan-muted mt-1 font-mono">
            Admin console connected to {settings?.brand_name || "MILAN INTERIO"} live project database.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-milan-primary px-4 py-2 border border-milan-border text-xs font-mono text-milan-gold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>DATABASE ONLINE</span>
        </div>
      </header>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric: Inquiries */}
        <div className="bg-milan-primary border border-milan-border p-6 flex flex-col justify-between h-36 hover:border-milan-gold/30 transition-colors duration-300">
          <div className="flex items-center justify-between text-milan-muted">
            <span className="text-[10px] tracking-widest uppercase font-semibold">Total Inquiries</span>
            <Mail size={16} className="text-milan-gold" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-4xl font-light text-milan-ivory font-mono">
              {totalInquiries ?? 0}
            </span>
            <Link
              href="/admin/inquiries"
              className="text-[10px] tracking-wider text-milan-gold hover:text-milan-ivory font-semibold flex items-center space-x-1 uppercase"
            >
              <span>View</span>
              <ArrowRight size={10} />
            </Link>
          </div>
        </div>

        {/* Metric: Projects */}
        <div className="bg-milan-primary border border-milan-border p-6 flex flex-col justify-between h-36 hover:border-milan-gold/30 transition-colors duration-300">
          <div className="flex items-center justify-between text-milan-muted">
            <span className="text-[10px] tracking-widest uppercase font-semibold">Portfolio Projects</span>
            <Briefcase size={16} className="text-milan-gold" />
          </div>
          <div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-4xl font-light text-milan-ivory font-mono">
                {totalProjects ?? 0}
              </span>
              <span className="text-[10px] text-milan-muted uppercase font-mono">
                {publishedProjects ?? 0} Published
              </span>
            </div>
          </div>
        </div>

        {/* Metric: Studio Gallery */}
        <div className="bg-milan-primary border border-milan-border p-6 flex flex-col justify-between h-36 hover:border-milan-gold/30 transition-colors duration-300">
          <div className="flex items-center justify-between text-milan-muted">
            <span className="text-[10px] tracking-widest uppercase font-semibold">Studio Assets</span>
            <Image size={16} className="text-milan-gold" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-4xl font-light text-milan-ivory font-mono">
              {studioCount ?? 0}
            </span>
            <Link
              href="/admin/studio"
              className="text-[10px] tracking-wider text-milan-gold hover:text-milan-ivory font-semibold flex items-center space-x-1 uppercase"
            >
              <span>Manage</span>
              <ArrowRight size={10} />
            </Link>
          </div>
        </div>

        {/* Metric: Seeded Services */}
        <div className="bg-milan-primary border border-milan-border p-6 flex flex-col justify-between h-36 hover:border-milan-gold/30 transition-colors duration-300">
          <div className="flex items-center justify-between text-milan-muted">
            <span className="text-[10px] tracking-widest uppercase font-semibold">Core Services</span>
            <Wrench size={16} className="text-milan-gold" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-4xl font-light text-milan-ivory font-mono">
              {servicesCount ?? 0}
            </span>
            <span className="text-[10px] text-milan-muted uppercase font-mono">
              {processCount ?? 0} Process Steps
            </span>
          </div>
        </div>
      </div>

      {/* Two-Column Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Inquiries (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="heading-display text-sm tracking-widest text-milan-gold uppercase font-serif">
              Recent Consultations
            </h2>
            {totalInquiries && totalInquiries > 0 ? (
              <Link
                href="/admin/inquiries"
                className="text-[10px] tracking-wider text-milan-muted hover:text-milan-gold uppercase font-semibold flex items-center space-x-1"
              >
                <span>All inquiries</span>
                <ArrowRight size={10} />
              </Link>
            ) : null}
          </div>

          <div className="bg-milan-primary border border-milan-border">
            {!recentInquiries || recentInquiries.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <p className="text-sm text-milan-muted">No consultations submitted yet.</p>
                <p className="text-xs text-milan-muted italic">
                  Inquiries submitted via the public contact form will appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-milan-border">
                {recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="p-6 hover:bg-milan-charcoal/30 transition-colors duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-milan-ivory">{inquiry.full_name}</h3>
                        <span className="text-[10px] font-mono text-milan-muted block mt-0.5">
                          {inquiry.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {inquiry.project_type && (
                          <span className="bg-milan-emerald border border-milan-gold/20 text-milan-gold px-2.5 py-0.5 text-[9px] tracking-wider uppercase font-semibold">
                            {inquiry.project_type}
                          </span>
                        )}
                        <span className="text-[9px] font-mono text-milan-muted">
                          {new Date(inquiry.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-milan-muted line-clamp-2 italic font-serif">
                      &ldquo;{inquiry.message}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Site Info & Operations */}
        <div className="space-y-4">
          <h2 className="heading-display text-sm tracking-widest text-milan-gold uppercase font-serif">
            Milan Standard Config
          </h2>
          <div className="bg-milan-primary border border-milan-border p-6 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Primary Brand Tagline
              </span>
              <p className="text-xs text-milan-ivory italic font-serif">
                &ldquo;{settings?.primary_tagline || "LUXURY, DESIGNED AROUND YOU."}&rdquo;
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Design Philosophy
              </span>
              <p className="text-xs text-milan-ivory">
                {settings?.design_philosophy || "Elegant. Functional. Timeless."}
              </p>
            </div>

            <div className="pt-4 border-t border-milan-border space-y-3">
              <span className="text-[10px] tracking-wider text-milan-muted uppercase font-mono block">
                Quick Actions
              </span>
              <div className="flex flex-col space-y-2 text-xs">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-milan-gold hover:text-milan-ivory py-1 transition-colors"
                >
                  <span>View Public Website</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
