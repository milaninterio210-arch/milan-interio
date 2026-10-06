import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import ConsultationCTA from "@/components/public/ConsultationCTA";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.milaninterio.com";

export const metadata: Metadata = {
  title: "Interior Design Riyadh | Luxury Interior Designers in Riyadh",
  description:
    "Milan Interio provides premium interior design services in Riyadh, Saudi Arabia. We design luxury villas, residences, offices, and commercial spaces in Riyadh with elegance and precision.",
  keywords: [
    "interior design Riyadh",
    "interior designers Riyadh",
    "luxury interior design Riyadh",
    "villa interior design Riyadh",
    "residential interior design Riyadh",
    "office interior design Riyadh",
    "commercial interior design Riyadh",
    "تصميم داخلي الرياض",
    "مصمم داخلي الرياض",
    "مصمم ديكور الرياض",
    "تصميم فلل الرياض",
    "fit-out Riyadh",
  ],
  alternates: {
    canonical: `${SITE_URL}/interior-design-riyadh`,
  },
  openGraph: {
    title: "Interior Design Riyadh | Luxury Interior Designers in Riyadh",
    description:
      "Milan Interio provides premium interior design services in Riyadh, Saudi Arabia. We design luxury villas, residences, offices, and commercial spaces.",
    url: `${SITE_URL}/interior-design-riyadh`,
  },
};

const faqs = [
  {
    q: "Does Milan Interio take on projects in Riyadh?",
    a: "Yes. We accept interior design and fit-out projects across Riyadh. Our design team coordinates project delivery with precision regardless of location within Saudi Arabia.",
  },
  {
    q: "What interior design services do you provide in Riyadh?",
    a: "We provide residential interior design, villa interior design, apartment interiors, office design, commercial fit-out, custom joinery, and full project management in Riyadh.",
  },
  {
    q: "How do I get started on a project in Riyadh?",
    a: "Contact us via the consultation form or call us directly. We will arrange a brief, understand your project scope, and provide a clear design proposal.",
  },
];

export default function RiyadhPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Interior Design Riyadh",
        item: `${SITE_URL}/interior-design-riyadh`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <div className="py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
                <li className="text-milan-gold">Interior Design Riyadh</li>
              </ol>
            </nav>

            <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
              RIYADH · SAUDI ARABIA
            </span>

            <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl text-milan-ivory leading-tight font-serif uppercase">
              Interior Design
              <br />
              <span className="text-milan-gold">Riyadh</span>
            </h1>

            <p className="text-body text-sm text-milan-muted leading-relaxed font-light max-w-lg">
              Milan Interio delivers premium interior design and fit-out services for clients in
              Riyadh. We create elegant villas, refined residences, productive offices, and
              distinctive commercial spaces across the Saudi capital.
            </p>

            <p className="text-body text-sm text-milan-muted leading-relaxed font-light max-w-lg">
              نقدم خدمات التصميم الداخلي الفاخر للفلل والمنازل والمكاتب والمشاريع التجارية
              في الرياض.
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
              src="https://images.unsplash.com/photo-1618219740975-d40978bb7378?auto=format&fit=crop&w=800&q=80"
              alt="Luxury interior design project in Riyadh Saudi Arabia by Milan Interio"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <div className="mb-10">
          <span className="text-eyebrow block mb-3">Interior Design in Riyadh</span>
          <h2 className="heading-display text-2xl sm:text-3xl text-milan-ivory font-serif">
            Services We Provide in Riyadh
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:divide-y-0">
          {[
            {
              title: "Villa Interior Design — Riyadh",
              desc: "Bespoke villa interior design tailored to the scale, architecture, and lifestyle of Riyadh properties. We work closely with clients to create timeless, personalised spaces.",
            },
            {
              title: "Residential Interior Design — Riyadh",
              desc: "Elegant apartment and home interiors in Riyadh, designed with careful attention to layout, material quality, lighting, and finishing.",
            },
            {
              title: "Office Interior Design — Riyadh",
              desc: "Professional workspace design for Riyadh offices — functional, brand-aligned, and built for long-term performance.",
            },
            {
              title: "Commercial Interior Design — Riyadh",
              desc: "Retail, hospitality, and commercial space design that creates powerful first impressions and drives engagement in Riyadh.",
            },
          ].map((s, idx) => (
            <div key={idx} className="bg-milan-charcoal/40 border border-milan-border/60 hover:border-milan-gold/50 p-6 space-y-3 transition-all duration-300 group">
              <h3 className="heading-display text-sm text-milan-ivory group-hover:text-milan-gold transition-colors">{s.title}</h3>
              <p className="text-xs text-milan-muted leading-relaxed font-light">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY MILAN INTERIO ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <div className="max-w-3xl space-y-6">
          <span className="text-eyebrow block">Why Milan Interio for Riyadh Projects</span>
          <h2 className="heading-display text-2xl sm:text-3xl text-milan-ivory font-serif">
            Luxury Interior Design Delivered to Riyadh
          </h2>
          <p className="text-sm text-milan-muted leading-relaxed font-light">
            Our studio in Dammam coordinates interior design projects across Saudi Arabia,
            including Riyadh. We bring the same commitment to design excellence, material
            quality, and precise execution to every Riyadh project.
          </p>
          <ul className="space-y-3">
            {[
              "Experience across Saudi Arabia's residential and commercial sectors",
              "Cohesive design process — single point of contact from concept to handover",
              "Custom furniture and joinery designed to match each project's aesthetic",
              "Transparent communication and structured project management",
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
            { href: "/interior-design-jeddah", label: "Interior Design in Jeddah" },
            { href: "/services", label: "All Interior Design Services" },
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

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <span className="text-eyebrow block mb-8">FAQ</span>
        <h2 className="heading-display text-xl sm:text-2xl text-milan-ivory mb-8 font-serif">
          Interior Design in Riyadh — FAQ
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-milan-border/40 pb-6">
              <h3 className="text-sm text-milan-ivory mb-2 font-light">{faq.q}</h3>
              <p className="text-xs text-milan-muted leading-relaxed font-light">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <ConsultationCTA />
    </div>
  );
}
