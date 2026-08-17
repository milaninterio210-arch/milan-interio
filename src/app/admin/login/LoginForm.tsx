"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      // Check if the user exists in public.admin_users
      const { data: adminUser, error: adminError } = await supabase
        .from("admin_users")
        .select("is_active")
        .eq("user_id", data.user?.id)
        .single();

      if (adminError || !adminUser) {
        // Sign out if not an admin
        await supabase.auth.signOut();
        setErrorMsg("Access denied. Not an authorized administrator.");
        setLoading(false);
        return;
      }

      if (!adminUser.is_active) {
        await supabase.auth.signOut();
        setErrorMsg("Your administrator account is inactive.");
        setLoading(false);
        return;
      }

      // Force full page reload to refresh middleware session
      window.location.href = "/admin/dashboard";
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {errorMsg && (
        <div className="bg-red-950/50 border border-red-800 text-red-200 text-xs p-3 font-mono">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-[10px] tracking-widest text-milan-muted uppercase font-semibold mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-milan-primary border border-milan-border px-4 py-3 text-sm text-milan-ivory focus:outline-none focus:border-milan-gold transition-colors font-mono"
          placeholder="admin@milaninterio.com"
        />
      </div>

      <div>
        <label className="block text-[10px] tracking-widest text-milan-muted uppercase font-semibold mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-milan-primary border border-milan-border px-4 py-3 text-sm text-milan-ivory focus:outline-none focus:border-milan-gold transition-colors font-mono"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full border border-milan-gold bg-transparent text-milan-gold hover:bg-milan-gold hover:text-milan-charcoal text-xs tracking-widest uppercase font-semibold py-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? "AUTHENTICATING..." : "ACCESS CONSOLE"}
      </button>
    </form>
  );
}
