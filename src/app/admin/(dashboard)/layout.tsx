import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

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
      <AdminSidebar userEmail={user.email} />
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
