import Link from "next/link";
import Image from "next/image";
import { PUBLIC_NAV_LINKS } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

export async function Footer() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("contact_email, contact_phone, office_address")
    .eq("singleton_key", "default")
    .single();

  const officeAddress = settings?.office_address || "Milan Interio,\nDammam, KSA";
  const contactPhone = settings?.contact_phone || "+966 55 478 3438";
  const contactEmail = settings?.contact_email || "info@milaninterio.com";
  const website = "www.milaninterio.com";

  return (
    <footer className="bg-milan-charcoal border-t border-milan-border">
      <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 items-start">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group focus:outline-none" aria-label="MILAN INTERIO Home">
              <Image
                src="/Logo/Logo.png"
                alt="MILAN INTERIO"
                width={200}
                height={113}
                className="h-14 sm:h-16 w-auto object-contain transition-all duration-300 group-hover:brightness-110 group-hover:scale-[1.02]"
              />
            </Link>
            <p className="text-xs text-milan-muted leading-relaxed max-w-xs">
              Elevating Spaces. Defining Luxury.
              <br />
              Elegant. Functional. Timeless.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-x-6 sm:gap-x-8">
            <div>
              <span className="text-eyebrow block mb-4 sm:mb-6">Explore</span>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-xs text-milan-muted hover:text-milan-ivory transition-colors tracking-wider block"
                  >
                    ABOUT
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    className="text-xs text-milan-muted hover:text-milan-ivory transition-colors tracking-wider block"
                  >
                    PROJECTS
                  </Link>
                </li>
                <li>
                  <Link
                    href="/studio"
                    className="text-xs text-milan-muted hover:text-milan-ivory transition-colors tracking-wider block"
                  >
                    STUDIO
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <span className="text-eyebrow block mb-4 sm:mb-6">Services</span>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/services"
                    className="text-xs text-milan-muted hover:text-milan-ivory transition-colors tracking-wider block"
                  >
                    SERVICES
                  </Link>
                </li>
                <li>
                  <Link
                    href="/process"
                    className="text-xs text-milan-muted hover:text-milan-ivory transition-colors tracking-wider block"
                  >
                    PROCESS
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact / Studio Details */}
          <div>
            <span className="text-eyebrow block mb-4 sm:mb-6">Studio & Contact</span>
            <div className="space-y-3 text-xs text-milan-muted">
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="text-milan-gold shrink-0 mt-0.5" />
                <span className="whitespace-pre-line leading-relaxed text-milan-ivory/90">
                  {officeAddress}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-milan-gold shrink-0" />
                <a
                  href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                  className="hover:text-milan-gold transition-colors font-light"
                >
                  {contactPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-milan-gold shrink-0" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-milan-gold transition-colors font-light"
                >
                  {contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe size={14} className="text-milan-gold shrink-0" />
                <span className="text-milan-muted font-light">
                  {website}
                </span>
              </div>
            </div>
          </div>

          {/* Brand Statement */}
          <div>
            <span className="text-eyebrow block mb-4 sm:mb-6">The Standard</span>
            <blockquote className="text-sm italic text-milan-muted font-serif leading-relaxed">
              &ldquo;Luxury is not defined by excess. It is defined by precision.&rdquo;
            </blockquote>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-milan-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-[10px] tracking-wider text-milan-muted">
          <p>
            &copy; {new Date().getFullYear()} MILAN INTERIO. ALL RIGHTS RESERVED.
          </p>
          <p className="uppercase hidden md:block">
            ELEGANT &bull; FUNCTIONAL &bull; TIMELESS
          </p>
          <p>
            Crafted with precision by{" "}
            <a
              href="https://ekodrix.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-milan-gold hover:text-milan-gold-light transition-colors font-medium tracking-widest hover:underline"
            >
              EKODRIX
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
