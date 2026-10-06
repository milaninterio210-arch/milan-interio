import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import ConsultationCTA from "@/components/public/ConsultationCTA";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.milaninterio.com";

export const metadata: Metadata = {
  title: "Interior Design Khobar | Luxury Interior Designers in Al Khobar",
  description:
    "Milan Interio provides luxury interior design and fit-out services in Al Khobar, Saudi Arabia. We design villas, residences, offices, and commercial spaces in the Eastern Province.",
  keywords: [
    "interior design Khobar",
    "interior designers Khobar",
    "interior design Al Khobar",
    "luxury interior design Khobar",
    "villa interior design Khobar",
    "تصميم داخلي الخبر",
    "مصمم داخلي الخبر",
    "fit-out Khobar",
  ],
  alternates: {
    canonical: `${SITE_URL}/interior-design-khobar`,
  },
  openGraph: {
    title: "Interior Design Khobar | Luxury Interior Designers in Al Khobar",
    description:
      "Milan Interio provides luxury interior design and fit-out services in Al Khobar, Saudi Arabia — villas, residences, offices, and commercial spaces.",
    url: `${SITE_URL}/interior-design-khobar`,
  },
};

export default function KhobarPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Interior Design Khobar",
        item: `${SITE_URL}/interior-design-khobar`,
      },
    ],
  };

  return (
    <div className="py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24 animate-fade-up">
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          <div className="w-full lg:w-1/2 space-y-6">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-milan-muted uppercase">
                <li>
                  <Link href="/" className="hover:text-milan-gold transition-colors">Home</Link>
                </li>
                <li className="text-milan-border">/</li>
                <li className="text-milan-gold">Interior Design Khobar</li>
              </ol>
            </nav>

            <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
              AL KHOBAR · EASTERN PROVINCE · SAUDI ARABIA
            </span>

            <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl text-milan-ivory leading-tight font-serif uppercase">
              Interior Design
              <br />
              <span className="text-milan-gold">Al Khobar</span>
            </h1>

            <p className="text-body text-sm text-milan-muted leading-relaxed font-light max-w-lg">
              Milan Interio provides premium interior design and fit-out services for residential
              and commercial clients in Al Khobar. Located in the Eastern Province, we bring
              our Dammam studio's expertise directly to Khobar projects.
            </p>

            <p className="text-body text-sm text-milan-muted leading-relaxed font-light max-w-lg">
              نقدم خدمات التصميم الداخلي الفاخر للفلل والمنازل والمكاتب في الخبر.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold px-6 py-3 text-[11px] tracking-widest font-semibold uppercase transition-all duration-300"
              >
                <span>Request Consultation</span>
                <ArrowRight size={12} />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 border border-milan-border text-milan-ivory hover:border-milan-gold hover:text-milan-gold px-6 py-3 text-[11px] tracking-widest font-semibold uppercase transition-all duration-300"
              >
                View Portfolio
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-1/2 aspect-[4/3] bg-milan-charcoal overflow-hidden border border-milan-border/60">
            <img
              src="https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80"
              alt="Luxury interior design project in Al Khobar Saudi Arabia by Milan Interio"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <div className="mb-10">
          <span className="text-eyebrow block mb-3">Services in Al Khobar</span>
          <h2 className="heading-display text-2xl sm:text-3xl text-milan-ivory font-serif">
            Interior Design Services We Provide in Khobar
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              title: "Villa Interior Design — Al Khobar",
              desc: "Luxury villa interior design in Al Khobar, crafted with bespoke materials, considered proportions, and complete fit-out management.",
            },
            {
              title: "Residential Interior Design — Al Khobar",
              desc: "Refined apartment and home interiors for Khobar residents — functional, elegant, and built to last.",
            },
            {
              title: "Commercial Interior Design — Al Khobar",
              desc: "Distinctive commercial spaces for Khobar businesses — retail, hospitality, and corporate environments designed to perform.",
            },
            {
              title: "Office Interior Design — Al Khobar",
              desc: "Productive, professional office interiors for companies operating across Al Khobar and the Eastern Province.",
            },
          ].map((s, idx) => (
            <div key={idx} className="bg-milan-charcoal/40 border border-milan-border/60 hover:border-milan-gold/50 p-6 space-y-3 transition-all duration-300 group">
              <h3 className="heading-display text-sm text-milan-ivory group-hover:text-milan-gold transition-colors">{s.title}</h3>
              <p className="text-xs text-milan-muted leading-relaxed font-light">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <div className="max-w-3xl space-y-6">
          <span className="text-eyebrow block">Eastern Province Expertise</span>
          <h2 className="heading-display text-2xl sm:text-3xl text-milan-ivory font-serif">
            A Local Studio for Khobar & Dammam Projects
          </h2>
          <p className="text-sm text-milan-muted leading-relaxed font-light">
            Our studio is located in Dammam, making Al Khobar one of our most accessible
            project locations. We understand the architecture, scale, and lifestyle preferences
            of Eastern Province clients — and deliver designs that reflect this understanding.
          </p>
          <ul className="space-y-3">
            {[
              "Studio based in Dammam — adjacent to Al Khobar",
              "Full-scope residential and commercial design",
              "Custom joinery, furniture, and fit-out",
              "Single point of contact from brief to handover",
            ].map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-milan-muted font-light">
                <CheckCircle size={14} className="text-milan-gold shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── INTERNAL LINKS ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <span className="text-eyebrow block mb-8">Explore More</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: "/interior-design-dammam", label: "Interior Design in Dammam" },
            { href: "/interior-design-dhahran", label: "Interior Design in Dhahran" },
            { href: "/projects", label: "Our Portfolio" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group border border-milan-border/60 hover:border-milan-gold/50 p-5 flex items-center justify-between transition-all duration-300"
            >
              <span className="text-xs text-milan-ivory group-hover:text-milan-gold tracking-wide transition-colors">{link.label}</span>
              <ArrowRight size={12} className="text-milan-gold group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </section>

      <ConsultationCTA />
    </div>
  );
}
