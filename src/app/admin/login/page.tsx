import type { Metadata } from "next";
import Image from "next/image";
import LoginForm from "./LoginForm";

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
        <div className="text-center mb-8 flex flex-col items-center">
          <Image
            src="/Logo/Logo-no-bg.png"
            alt="MILAN INTERIO"
            width={200}
            height={113}
            priority
            className="h-14 w-auto object-contain mb-4"
          />
          <h1 className="heading-display text-lg text-milan-ivory font-serif">
            ADMIN CONSOLE
          </h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

