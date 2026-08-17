import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Access the MILAN INTERIO administrator console.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-milan-primary text-milan-ivory flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-milan-charcoal border border-milan-border p-8 md:p-10 animate-fade-up">
        <div className="text-center mb-8">
          <span className="heading-display text-sm tracking-[0.25em] text-milan-gold block mb-2">
            MILAN INTERIO
          </span>
          <h1 className="heading-display text-xl text-milan-ivory">
            ADMIN CONSOLE
          </h1>
        </div>
        {/* Placeholder form — full interactive implementation in Phase 10 */}
        <div className="space-y-6">
          <p className="text-xs text-milan-muted text-center italic">
            Secure authentication forms will integrate with Supabase Auth in Phase 10.
          </p>
        </div>
      </div>
    </div>
  );
}
