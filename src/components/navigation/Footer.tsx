import Link from "next/link";
import Image from "next/image";
import { PUBLIC_NAV_LINKS } from "@/lib/types";

export function Footer() {
  return (
    <footer className="bg-milan-charcoal">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 items-start">
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

          {/* Brand Statement */}
          <div className="sm:col-span-2 lg:col-span-1">
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
