import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import ConsultationCTA from "@/components/public/ConsultationCTA";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.milaninterio.com";

export const metadata: Metadata = {
  title: "Interior Design Jeddah | Luxury Interior Designers in Jeddah",
  description:
    "Milan Interio delivers premium interior design and fit-out services in Jeddah, Saudi Arabia. We design luxury villas, residences, offices, and commercial spaces in Jeddah.",
  keywords: [
    "interior design Jeddah",
    "interior designers Jeddah",
    "luxury interior design Jeddah",
    "villa interior design Jeddah",
    "residential interior design Jeddah",
    "office interior design Jeddah",
    "commercial interior design Jeddah",
    "تصميم داخلي جدة",
    "مصمم داخلي جدة",
    "تصميم فلل جدة",
    "fit-out Jeddah",
  ],
  alternates: {
    canonical: `${SITE_URL}/interior-design-jeddah`,
  },
  openGraph: {
    title: "Interior Design Jeddah | Luxury Interior Designers in Jeddah",
    description:
      "Milan Interio delivers premium interior design and fit-out services in Jeddah, Saudi Arabia — villas, residences, offices, and commercial spaces.",
    url: `${SITE_URL}/interior-design-jeddah`,
  },
};

const faqs = [
  {
    q: "Does Milan Interio design projects in Jeddah?",
    a: "Yes. We take on interior design and fit-out projects across Jeddah, working with residential, villa, commercial, and office clients throughout the city.",
  },
  {
    q: "What interior design services are available in Jeddah?",
    a: "We provide villa interior design, apartment interiors, residential design, office design, commercial fit-out, custom joinery, and full project management for Jeddah clients.",
  },
  {
    q: "How do I start a project in Jeddah with Milan Interio?",
    a: "Contact us through the website or by phone. We will schedule a consultation to understand your project requirements and present a clear design and execution plan.",
  },
];

export default function JeddahPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Interior Design Jeddah",
        item: `${SITE_URL}/interior-design-jeddah`,
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
                <li className="text-milan-gold">Interior Design Jeddah</li>
              </ol>
            </nav>

            <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
              JEDDAH · SAUDI ARABIA
            </span>

            <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl text-milan-ivory leading-tight font-serif uppercase">
              Interior Design
              <br />
              <span className="text-milan-gold">Jeddah</span>
            </h1>

            <p className="text-body text-sm text-milan-muted leading-relaxed font-light max-w-lg">
              Milan Interio delivers high-end interior design and complete fit-out solutions
              for clients in Jeddah. From waterfront villas to contemporary commercial spaces,
              we bring the same commitment to quality and precision that defines our work
              throughout Saudi Arabia.
            </p>

            <p className="text-body text-sm text-milan-muted leading-relaxed font-light max-w-lg">
              نقدم خدمات التصميم الداخلي الفاخر للفلل والمنازل والمكاتب والمشاريع التجارية
              في جدة.
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
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
              alt="Luxury interior design project in Jeddah Saudi Arabia by Milan Interio"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <div className="mb-10">
          <span className="text-eyebrow block mb-3">Services in Jeddah</span>
          <h2 className="heading-display text-2xl sm:text-3xl text-milan-ivory font-serif">
            Interior Design Services in Jeddah
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              title: "Villa Interior Design — Jeddah",
              desc: "Premium villa interior design in Jeddah — bespoke layouts, curated materials, and refined finishing that reflects the unique scale and character of each property.",
            },
            {
              title: "Residential & Apartment Design — Jeddah",
              desc: "Contemporary and classic apartment interior design for Jeddah residences, developed with attention to spatial flow, light, and material harmony.",
            },
            {
              title: "Commercial Interior Design — Jeddah",
              desc: "Retail, hospitality, and commercial fit-out in Jeddah — designed to create strong brand environments and deliver lasting commercial performance.",
            },
            {
              title: "Office Design — Jeddah",
              desc: "Professional and inspiring office interiors for Jeddah businesses, designed for productivity, brand alignment, and employee wellbeing.",
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
          <span className="text-eyebrow block">Why Choose Milan Interio for Jeddah</span>
          <h2 className="heading-display text-2xl sm:text-3xl text-milan-ivory font-serif">
            Precision Interior Design Delivered to Jeddah
          </h2>
          <p className="text-sm text-milan-muted leading-relaxed font-light">
            Based in Dammam with project experience across Saudi Arabia, Milan Interio brings
            a disciplined, detail-oriented approach to every Jeddah project. Whether you are
            designing a family villa, a boutique retail space, or a corporate office, we manage
            the full process from design concept to final handover.
          </p>
          <ul className="space-y-3">
            {[
              "End-to-end interior design and fit-out management",
              "Bespoke custom joinery and furniture",
              "Experience across residential, commercial, and hospitality sectors",
              "Material selection, procurement, and installation coordination",
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
            { href: "/interior-design-riyadh", label: "Interior Design in Riyadh" },
            { href: "/services", label: "All Services" },
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
          Interior Design in Jeddah — FAQ
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
