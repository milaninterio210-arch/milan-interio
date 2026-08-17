import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Query database to ensure they are an active admin
  const { data: adminUser, error } = await supabase
    .from("admin_users")
    .select("is_active")
    .eq("user_id", user.id)
    .single();

  if (error || !adminUser || !adminUser.is_active) {
    // Sign out to clean up session
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  return (
    <div className="min-h-screen bg-milan-charcoal text-milan-ivory flex flex-col md:flex-row">
      <aside className="w-full md:w-64 border-r border-milan-border bg-milan-primary p-6 flex flex-col">
        <div className="pb-6 border-b border-milan-border mb-6">
          <span className="heading-display text-sm tracking-widest text-milan-gold block">
            MILAN ADMIN
          </span>
        </div>
        <nav className="flex flex-col space-y-4">
          <span className="text-[10px] tracking-widest text-milan-muted uppercase font-semibold">
            Console
          </span>
          <p className="text-xs text-milan-muted italic">
            Console routes will link to dashboard operations after DB migration.
          </p>
        </nav>
      </aside>
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
