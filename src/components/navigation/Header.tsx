"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        isOpen ? "bg-milan-charcoal" : "bg-milan-charcoal/90 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="group flex items-center focus:outline-none py-1" aria-label="MILAN INTERIO Home">
          <Image
            src="/Logo/Logo.png"
            alt="MILAN INTERIO"
            width={180}
            height={101}
            priority
            className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-all duration-300 group-hover:brightness-110 group-hover:scale-[1.02]"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Main navigation">
          {PUBLIC_NAV_LINKS.map((link) => (
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
            className="px-5 py-2.5 text-[10px] tracking-widest text-milan-primary bg-milan-gold hover:bg-milan-gold-light transition-colors font-semibold uppercase"
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden fixed inset-x-0 bottom-0 top-16 sm:top-20 z-40 bg-milan-charcoal flex flex-col justify-between"
            role="dialog"
            aria-label="Mobile navigation"
          >
            <nav className="flex-1 flex flex-col items-center justify-center p-6 gap-6 sm:gap-7 text-center" aria-label="Mobile navigation links">
              {PUBLIC_NAV_LINKS.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: idx * 0.07 + 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={link.href}
                    className={`heading-display text-2xl tracking-widest transition-colors py-1 ${
                      isActive(link.href)
                        ? "text-milan-gold"
                        : "text-milan-ivory hover:text-milan-gold"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: PUBLIC_NAV_LINKS.length * 0.07 + 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="p-6 border-t border-milan-border/40 flex justify-center"
            >
              <Link
                href="/contact"
                className="block w-full max-w-xs py-3.5 text-center text-[11px] tracking-widest text-milan-primary bg-milan-gold hover:bg-milan-gold-light transition-colors font-semibold uppercase"
              >
                START A PROJECT
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
