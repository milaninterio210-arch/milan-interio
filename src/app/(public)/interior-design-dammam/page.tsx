import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Phone, Mail, CheckCircle } from "lucide-react";
import ConsultationCTA from "@/components/public/ConsultationCTA";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.milaninterio.com";

export const metadata: Metadata = {
  title: "Interior Design Dammam | Luxury Interior Designers in Dammam",
  description:
    "Milan Interio offers premium interior design and fit-out services in Dammam, Saudi Arabia. We design luxury villas, residences, offices, and commercial spaces in Dammam with precision and elegance.",
  keywords: [
    "interior design Dammam",
    "interior designers Dammam",
    "luxury interior design Dammam",
    "villa interior design Dammam",
    "residential interior design Dammam",
    "commercial interior design Dammam",
    "office interior design Dammam",
    "تصميم داخلي الدمام",
    "مصمم داخلي الدمام",
    "تصميم فلل الدمام",
    "fit-out Dammam",
  ],
  alternates: {
    canonical: `${SITE_URL}/interior-design-dammam`,
  },
  openGraph: {
    title: "Interior Design Dammam | Luxury Interior Designers in Dammam",
    description:
      "Milan Interio offers premium interior design and fit-out services in Dammam, Saudi Arabia. We design luxury villas, residences, offices, and commercial spaces.",
    url: `${SITE_URL}/interior-design-dammam`,
  },
};

const services = [
  {
    title: "Residential Interior Design",
    arabicTitle: "تصميم داخلي سكني",
    description:
      "We transform homes and apartments in Dammam into refined, personalised living environments. From concept to handover, every detail is considered.",
  },
  {
    title: "Villa Interior Design",
    arabicTitle: "تصميم داخلي فلل",
    description:
      "Milan Interio designs premium villa interiors in Dammam and the Eastern Province, with bespoke layouts, custom joinery, and curated material selections.",
  },
  {
    title: "Commercial Interior Design",
    arabicTitle: "تصميم داخلي تجاري",
    description:
      "We deliver commercial interior design for retail, hospitality, and mixed-use spaces in Dammam that reflect brand identity and drive business performance.",
  },
  {
    title: "Office Interior Design",
    arabicTitle: "تصميم مكاتب",
    description:
      "Functional, professional, and aesthetically refined office environments designed for productivity — tailored for Dammam businesses and corporations.",
  },
  {
    title: "Fit-Out & Project Management",
    arabicTitle: "تركيب وإدارة مشاريع",
    description:
      "End-to-end interior fit-out services from procurement and coordination to installation and quality control, delivered on time in Dammam.",
  },
  {
    title: "Custom Joinery & Furniture",
    arabicTitle: "أثاث وأعمال نجارة مخصصة",
    description:
      "Bespoke furniture and joinery crafted to exacting standards — designed to complement the overall interior architecture of each project.",
  },
];

const faqs = [
  {
    q: "Does Milan Interio work on projects in Dammam?",
    a: "Yes. Dammam is our primary base of operations. We serve residential, commercial, and villa clients across Dammam and the broader Eastern Province.",
  },
  {
    q: "What types of projects do you handle in Dammam?",
    a: "We work on a full range of interior design and fit-out projects in Dammam — including villas, apartments, offices, retail spaces, and hospitality environments.",
  },
  {
    q: "How do I start an interior design project with Milan Interio in Dammam?",
    a: "Contact us through our website or call us directly. We will schedule an initial consultation to understand your project requirements, timeline, and vision.",
  },
  {
    q: "Do you handle full turnkey interior fit-out in Dammam?",
    a: "Yes. We offer a complete turnkey solution — from design concept and material selection through to installation, custom joinery, and final handover.",
  },
];

export default function DammamPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Interior Design Dammam",
        item: `${SITE_URL}/interior-design-dammam`,
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
                  <Link href="/" className="hover:text-milan-gold transition-colors">
                    Home
                  </Link>
                </li>
                <li className="text-milan-border">/</li>
                <li className="text-milan-gold">Interior Design Dammam</li>
              </ol>
            </nav>

            <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block">
              EASTERN PROVINCE · SAUDI ARABIA
            </span>

            <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl text-milan-ivory leading-tight font-serif uppercase">
              Interior Design
              <br />
              <span className="text-milan-gold">Dammam</span>
            </h1>

            <p className="text-body text-sm text-milan-muted leading-relaxed font-light max-w-lg">
              Milan Interio is a premium interior design and fit-out studio based in Dammam.
              We design luxury villas, residences, offices, and commercial spaces across the
              Eastern Province with a focus on precision, elegance, and functionality.
            </p>

            <p className="text-body text-sm text-milan-muted leading-relaxed font-light max-w-lg">
              {/* Arabic copy for Arabic-searching visitors */}
              نقدم خدمات التصميم الداخلي الفاخر للفلل والمنازل والمكاتب والمشاريع التجارية
              في الدمام والمنطقة الشرقية.
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
              src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80"
              alt="Luxury interior design project in Dammam Saudi Arabia by Milan Interio"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <div className="mb-10">
          <span className="text-eyebrow block mb-3">Our Services in Dammam</span>
          <h2 className="heading-display text-2xl sm:text-3xl text-milan-ivory font-serif">
            Interior Design Services Across Dammam
          </h2>
          <p className="text-sm text-milan-muted mt-3 max-w-2xl font-light">
            From residential villas to commercial developments, Milan Interio provides a complete
            interior design and fit-out service for clients throughout Dammam and the Eastern Province.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-milan-charcoal/40 border border-milan-border/60 hover:border-milan-gold/50 p-6 space-y-3 transition-all duration-300 group"
            >
              <h3 className="heading-display text-sm text-milan-ivory tracking-wide group-hover:text-milan-gold transition-colors">
                {service.title}
              </h3>
              <p className="text-[11px] text-milan-gold/70 font-mono">{service.arabicTitle}</p>
              <p className="text-xs text-milan-muted leading-relaxed font-light">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY MILAN INTERIO ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <span className="text-eyebrow block">Why Choose Milan Interio in Dammam</span>
            <h2 className="heading-display text-2xl sm:text-3xl text-milan-ivory font-serif leading-tight">
              Precision-Led Interior Design for the Eastern Province
            </h2>
            <p className="text-sm text-milan-muted leading-relaxed font-light">
              With our studio based in Dammam, we understand the architectural character, climate
              requirements, and lifestyle preferences of clients across the Eastern Province. Every
              project is approached with a commitment to honest craftsmanship, considered material
              selection, and design that serves both the space and the people within it.
            </p>
            <ul className="space-y-3">
              {[
                "Studio based in Dammam — local expertise, faster delivery",
                "Full design-to-handover service with single point of responsibility",
                "Custom joinery and furniture designed in-house",
                "Experience across residential, villa, commercial, and office sectors",
                "Transparent project management throughout",
              ].map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-milan-muted font-light">
                  <CheckCircle size={14} className="text-milan-gold shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="bg-milan-charcoal/40 border border-milan-border/60 p-6 space-y-2">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-milan-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] tracking-widest text-milan-gold uppercase font-mono mb-1">Studio Location</p>
                  <p className="text-sm text-milan-ivory font-light">Dammam, Eastern Province, KSA</p>
                </div>
              </div>
            </div>
            <div className="bg-milan-charcoal/40 border border-milan-border/60 p-6 space-y-2">
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-milan-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] tracking-widest text-milan-gold uppercase font-mono mb-1">Phone</p>
                  <a href="tel:+966558934342" className="text-sm text-milan-ivory hover:text-milan-gold transition-colors font-light">
                    +966 55 893 4342
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-milan-charcoal/40 border border-milan-border/60 p-6 space-y-2">
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-milan-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] tracking-widest text-milan-gold uppercase font-mono mb-1">Email</p>
                  <a href="mailto:info@milaninterio.com" className="text-sm text-milan-ivory hover:text-milan-gold transition-colors font-light">
                    info@milaninterio.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERNAL LINKS ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <span className="text-eyebrow block mb-8">Explore More</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: "/services", label: "All Interior Design Services" },
            { href: "/projects", label: "Our Project Portfolio" },
            { href: "/interior-design-khobar", label: "Interior Design in Khobar" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group border border-milan-border/60 hover:border-milan-gold/50 p-5 flex items-center justify-between transition-all duration-300"
            >
              <span className="text-xs text-milan-ivory group-hover:text-milan-gold tracking-wide transition-colors">
                {link.label}
              </span>
              <ArrowRight size={12} className="text-milan-gold group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <span className="text-eyebrow block mb-8">Frequently Asked Questions</span>
        <h2 className="heading-display text-xl sm:text-2xl text-milan-ivory mb-8 font-serif">
          Interior Design in Dammam — FAQ
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

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <ConsultationCTA />
    </div>
  );
}
