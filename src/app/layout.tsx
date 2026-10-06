import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const alga = localFont({
  src: [
    { path: "../../public/fonts/alga/Alga-Light.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/alga/Alga-LightItalic.otf", weight: "300", style: "italic" },
    { path: "../../public/fonts/alga/Alga-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/alga/Alga-RegularItalic.otf", weight: "400", style: "italic" },
    { path: "../../public/fonts/alga/Alga-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/alga/Alga-MediumItalic.otf", weight: "500", style: "italic" },
    { path: "../../public/fonts/alga/Alga-Semibold.otf", weight: "600", style: "normal" },
    { path: "../../public/fonts/alga/Alga-SemiboldItalic.otf", weight: "600", style: "italic" },
    { path: "../../public/fonts/alga/Alga-Bold.otf", weight: "700", style: "normal" },
    { path: "../../public/fonts/alga/Alga-BoldItalic.otf", weight: "700", style: "italic" },
  ],
  variable: "--font-alga",
  display: "swap",
});

const aspekta = localFont({
  src: [
    { path: "../../public/fonts/aspekta/Aspekta-300.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/aspekta/Aspekta-400.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/aspekta/Aspekta-500.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/aspekta/Aspekta-600.otf", weight: "600", style: "normal" },
    { path: "../../public/fonts/aspekta/Aspekta-700.otf", weight: "700", style: "normal" },
    { path: "../../public/fonts/aspekta/Aspekta-800.otf", weight: "800", style: "normal" },
  ],
  variable: "--font-aspekta",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.milaninterio.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MILAN INTERIO | Luxury Interior Design in Saudi Arabia",
    template: "%s | MILAN INTERIO",
  },
  description:
    "Milan Interio delivers premium interior design and fit-out solutions for villas, residences, offices, and commercial spaces across Saudi Arabia — Dammam, Riyadh, Jeddah, and beyond.",
  keywords: [
    "interior design Saudi Arabia",
    "interior designers Saudi Arabia",
    "luxury interior design",
    "villa interior design",
    "residential interior design",
    "commercial interior design",
    "office interior design",
    "interior design Dammam",
    "interior design Riyadh",
    "interior design Jeddah",
    "interior design Khobar",
    "تصميم داخلي السعودية",
    "تصميم داخلي الدمام",
    "تصميم داخلي الرياض",
    "تصميم داخلي جدة",
    "Milan Interio",
    "fit-out Saudi Arabia",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MILAN INTERIO",
    url: SITE_URL,
    title: "MILAN INTERIO | Luxury Interior Design in Saudi Arabia",
    description:
      "Premium interior design and fit-out solutions for villas, residences, offices and commercial spaces across Saudi Arabia.",
    images: [
      {
        url: "/Logo/Logo.png",
        width: 200,
        height: 113,
        alt: "MILAN INTERIO — Luxury Interior Design Saudi Arabia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MILAN INTERIO | Luxury Interior Design in Saudi Arabia",
    description:
      "Premium interior design and fit-out solutions for villas, residences, offices and commercial spaces across Saudi Arabia.",
    images: ["/Logo/Logo.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "InteriorDesigner",
    "@id": `${SITE_URL}/#organization`,
    name: "Milan Interio",
    alternateName: "MILAN INTERIO",
    url: SITE_URL,
    logo: `${SITE_URL}/Logo/Logo.png`,
    image: `${SITE_URL}/Logo/Logo.png`,
    description:
      "Milan Interio is a premium interior design and fit-out studio delivering elegant, functional, and timeless spaces across Saudi Arabia.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dammam",
      addressCountry: "SA",
    },
    telephone: "+966558934342",
    email: "info@milaninterio.com",
    areaServed: [
      { "@type": "City", name: "Dammam" },
      { "@type": "City", name: "Khobar" },
      { "@type": "City", name: "Dhahran" },
      { "@type": "City", name: "Riyadh" },
      { "@type": "City", name: "Jeddah" },
    ],
    sameAs: [],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "MILAN INTERIO",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };

  return (
    <html
      lang="en"
      className={`${alga.variable} ${aspekta.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
