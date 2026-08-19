import type { Metadata } from "next";
import Script from "next/script";
import { Anek_Malayalam, Montserrat } from "next/font/google";
import "./globals.css";

const anek = Anek_Malayalam({
  variable: "--font-anek",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
      className={`${anek.variable} ${montserrat.variable}`}
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
