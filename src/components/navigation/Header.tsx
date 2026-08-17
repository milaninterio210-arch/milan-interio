"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { PUBLIC_NAV_LINKS } from "@/lib/types";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-milan-primary/80 backdrop-blur-md border-b border-milan-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group focus:outline-none">
          <span className="heading-display text-lg tracking-[0.25em] text-milan-ivory transition-colors group-hover:text-milan-gold">
            MILAN INTERIO
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {PUBLIC_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-widest text-milan-muted hover:text-milan-ivory transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="px-5 py-2.5 text-[10px] tracking-widest text-milan-primary bg-milan-gold hover:bg-milan-gold-light transition-colors font-medium uppercase"
          >
            START A PROJECT
          </Link>
        </nav>

        {/* Mobile Navigation Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-milan-ivory hover:text-milan-gold transition-colors focus:outline-none"
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Genuinely Mobile-First Navigation Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-20 z-40 bg-milan-charcoal flex flex-col justify-between p-8 border-t border-milan-border animate-fade-in">
          <nav className="flex flex-col space-y-6">
            {PUBLIC_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="heading-display text-2xl text-milan-ivory hover:text-milan-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-8 border-t border-milan-border">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="w-full block py-4 text-center text-xs tracking-widest text-milan-primary bg-milan-gold hover:bg-milan-gold-light transition-colors font-semibold uppercase"
            >
              START A PROJECT
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
