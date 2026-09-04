import type { Metadata } from "next";
import Script from "next/script";
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

export const metadata: Metadata = {
  title: {
    default: "MILAN INTERIO — Luxury, Designed Around You",
    template: "%s | MILAN INTERIO",
  },
  description:
    "Premium interior design and fit-out studio. Elevating Spaces. Defining Luxury. Elegant. Functional. Timeless.",
  keywords: [
    "interior design",
    "luxury interiors",
    "fit-out",
    "custom joinery",
    "furniture design",
    "Milan Interio",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MILAN INTERIO",
    title: "MILAN INTERIO — Luxury, Designed Around You",
    description:
      "Premium interior design and fit-out studio. Elevating Spaces. Defining Luxury.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${alga.variable} ${aspekta.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <Script
          id="milan-intro-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (sessionStorage.getItem('milan_intro_seen')) {
                  document.documentElement.classList.add('milan-intro-seen');
                } else {
                  document.documentElement.classList.add('milan-intro-active');
                }
              } catch(e) {}
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
