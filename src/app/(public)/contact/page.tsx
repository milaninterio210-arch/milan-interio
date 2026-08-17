import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start a Project",
  description:
    "Get in touch with MILAN INTERIO to schedule a premium design consultation for your space.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Phase 9: Contact form submission area */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-eyebrow mb-6 text-center">Inquire</p>
          <h1 className="heading-display text-4xl sm:text-5xl text-milan-ivory mb-16 text-center">
            START A PROJECT
          </h1>
        </div>
      </section>
    </div>
  );
}
