import Link from "next/link";
import { PUBLIC_NAV_LINKS } from "@/lib/types";

export function Footer() {
  return (
    <footer className="bg-milan-charcoal border-t border-milan-border py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand Details */}
        <div>
          <span className="heading-display text-lg tracking-[0.25em] text-milan-ivory">
            MILAN INTERIO
          </span>
          <p className="text-body mt-4 max-w-sm text-sm">
            Elevating Spaces. Defining Luxury. Elegant. Functional. Timeless.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-eyebrow mb-6">Explore</h4>
          <ul className="grid grid-cols-2 gap-4">
            {PUBLIC_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs text-milan-muted hover:text-milan-ivory transition-colors uppercase tracking-wider"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Brand Statement */}
        <div>
          <h4 className="text-eyebrow mb-6">The Standard</h4>
          <blockquote className="text-sm italic text-milan-muted">
            "Luxury is not defined by excess. It is defined by precision."
          </blockquote>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-milan-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[10px] tracking-wider text-milan-muted">
          &copy; {new Date().getFullYear()} MILAN INTERIO. ALL RIGHTS RESERVED.
        </p>
        <p className="text-[10px] tracking-wider text-milan-muted uppercase">
          ELEGANT &bull; FUNCTIONAL &bull; TIMELESS
        </p>
      </div>
    </footer>
  );
}
