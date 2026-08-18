import Link from "next/link";
import { PUBLIC_NAV_LINKS } from "@/lib/types";

export function Footer() {
  return (
    <footer className="bg-milan-charcoal border-t border-milan-border">
      <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" aria-label="MILAN INTERIO Home">
              <span className="heading-display text-base sm:text-lg tracking-[0.25em] text-milan-ivory">
                MILAN INTERIO
              </span>
            </Link>
            <p className="text-xs text-milan-muted leading-relaxed max-w-xs">
              Elevating Spaces. Defining Luxury.
              <br />
              Elegant. Functional. Timeless.
            </p>
          </div>

          {/* Links */}
          <div>
            <span className="text-eyebrow block mb-4 sm:mb-6">Explore</span>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
              {PUBLIC_NAV_LINKS.filter(link => link.href !== "/").map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-milan-muted hover:text-milan-ivory transition-colors tracking-wider"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
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
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] tracking-wider text-milan-muted">
            &copy; {new Date().getFullYear()} MILAN INTERIO. ALL RIGHTS RESERVED.
          </p>
          <p className="text-[10px] tracking-wider text-milan-muted uppercase">
            ELEGANT &bull; FUNCTIONAL &bull; TIMELESS
          </p>
        </div>
      </div>
    </footer>
  );
}
