import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch site settings (seeded singleton)
  const { data: settings } = await supabase
    .from("site_settings")
    .select("brand_name, primary_tagline, design_philosophy")
    .eq("singleton_key", "default")
    .single();

  // Fetch count of services
  const { count: servicesCount } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true });

  // Fetch count of process steps
  const { count: processCount } = await supabase
    .from("process_steps")
    .select("*", { count: "exact", head: true });

  // Fetch count of inquiries
  const { count: inquiriesCount } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true });

  return (
    <div className="space-y-6">
      <header className="pb-6 border-b border-milan-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="heading-display text-2xl text-milan-ivory font-serif">
            DASHBOARD OVERVIEW
          </h1>
          <p className="text-xs text-milan-muted mt-1 font-mono">
            Connected to: {settings?.brand_name || "MILAN INTERIO"} Settings Singleton
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-milan-primary border border-milan-border p-6">
          <h2 className="heading-display text-xs text-milan-gold mb-2 font-serif tracking-widest">
            SITE TAGLINE
          </h2>
          <p className="text-xs text-milan-ivory line-clamp-2">
            {settings?.primary_tagline || "No tagline configured"}
          </p>
        </div>
        <div className="bg-milan-primary border border-milan-border p-6">
          <h2 className="heading-display text-xs text-milan-gold mb-2 font-serif tracking-widest">
            SEEDED SERVICES
          </h2>
          <p className="text-3xl font-light text-milan-ivory font-mono">
            {servicesCount ?? 0}
          </p>
        </div>
        <div className="bg-milan-primary border border-milan-border p-6">
          <h2 className="heading-display text-xs text-milan-gold mb-2 font-serif tracking-widest">
            PROCESS STEPS
          </h2>
          <p className="text-3xl font-light text-milan-ivory font-mono">
            {processCount ?? 0}
          </p>
        </div>
        <div className="bg-milan-primary border border-milan-border p-6">
          <h2 className="heading-display text-xs text-milan-gold mb-2 font-serif tracking-widest">
            CLIENT INQUIRIES
          </h2>
          <p className="text-3xl font-light text-milan-ivory font-mono">
            {inquiriesCount ?? 0}
          </p>
        </div>
      </div>

      <div className="bg-milan-primary border border-milan-border p-6">
        <h2 className="heading-display text-xs text-milan-gold mb-4 font-serif tracking-widest">
          SYSTEM ENVIRONMENT & CONTROLS
        </h2>
        <div className="space-y-2 text-xs font-mono text-milan-muted">
          <p>
            <span className="text-milan-ivory">Design Philosophy:</span>{" "}
            {settings?.design_philosophy || "Elegant. Functional. Timeless."}
          </p>
          <p>
            <span className="text-milan-ivory">Supabase Client:</span> OK (Active Session)
          </p>
        </div>
      </div>
    </div>
  );
}

