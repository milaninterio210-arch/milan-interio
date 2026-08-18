"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { PUBLIC_NAV_LINKS } from "@/lib/types";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-milan-primary/90 backdrop-blur-md border-b border-milan-border">
      <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="group focus:outline-none" aria-label="MILAN INTERIO Home">
          <span className="heading-display text-base sm:text-lg tracking-[0.2em] sm:tracking-[0.25em] text-milan-ivory group-hover:text-milan-gold transition-colors">
            MILAN INTERIO
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Main navigation">
          {PUBLIC_NAV_LINKS.filter(link => link.href !== "/").map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[11px] tracking-widest transition-colors ${
                isActive(link.href)
                  ? "text-milan-gold"
                  : "text-milan-muted hover:text-milan-ivory"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="px-5 py-2 text-[10px] tracking-widest text-milan-primary bg-milan-gold hover:bg-milan-gold-light transition-colors font-semibold uppercase"
          >
            START A PROJECT
          </Link>
        </nav>

        {/* Mobile trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 -mr-2 text-milan-ivory hover:text-milan-gold transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 top-16 sm:top-20 z-40 bg-milan-primary flex flex-col justify-between animate-fade-in"
          role="dialog"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col p-8 gap-5" aria-label="Mobile navigation links">
            {PUBLIC_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`heading-display text-xl tracking-wider transition-colors py-1 ${
                  isActive(link.href)
                    ? "text-milan-gold"
                    : "text-milan-ivory hover:text-milan-gold"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="p-8 border-t border-milan-border">
            <Link
              href="/contact"
              className="block w-full py-4 text-center text-[11px] tracking-widest text-milan-primary bg-milan-gold hover:bg-milan-gold-light transition-colors font-semibold uppercase"
            >
              START A PROJECT
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
