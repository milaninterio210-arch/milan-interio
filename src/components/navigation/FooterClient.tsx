"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Globe, ChevronDown } from "lucide-react";

interface FooterClientProps {
  officeAddress: string;
  contactPhone: string;
  contactEmail: string;
  crNumber: string;
  vatNumber: string;
  website?: string;
}

export function FooterClient({
  officeAddress,
  contactPhone,
  contactEmail,
  crNumber,
  vatNumber,
  website = "www.milaninterio.com",
}: FooterClientProps) {
  // Mobile accordion open states (default: closed for short compact mobile footer)
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    explore: false,
    services: false,
    contact: false,
    legal: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <footer className="bg-milan-charcoal border-t border-milan-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 sm:py-16">
        
        {/* =========================================================================
           DESKTOP VIEW: Full 4-Column Layout (md: and up)
           ========================================================================= */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 items-start">
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
            {/* KSA Legal Credentials Badge */}
            {(crNumber || vatNumber) && (
              <div className="pt-2 space-y-1 font-mono text-[10px] text-milan-muted border-t border-milan-border/40">
                {crNumber && (
                  <div className="flex items-center gap-2">
                    <span className="text-milan-gold font-semibold">CR:</span>
                    <span className="text-milan-ivory/80 tracking-wider">{crNumber}</span>
                  </div>
                )}
                {vatNumber && (
                  <div className="flex items-center gap-2">
                    <span className="text-milan-gold font-semibold">VAT:</span>
                    <span className="text-milan-ivory/80 tracking-wider">{vatNumber}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links */}
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
                <span className="text-milan-muted font-light">{website}</span>
              </div>
            </div>
          </div>

          {/* Brand Statement */}
          <div className="space-y-4">
            <span className="text-eyebrow block mb-4 sm:mb-6">The Standard</span>
            <blockquote className="text-sm italic text-milan-muted font-serif leading-relaxed">
              &ldquo;Luxury is not defined by excess. It is defined by precision.&rdquo;
            </blockquote>
          </div>
        </div>

        {/* =========================================================================
           MOBILE VIEW: Compact Accordion Dropdowns with Arrow Toggle (< md:)
           ========================================================================= */}
        <div className="md:hidden space-y-5">
          {/* Brand Header */}
          <div className="space-y-2.5 text-center pb-3">
            <Link href="/" className="inline-block group focus:outline-none" aria-label="MILAN INTERIO Home">
              <Image
                src="/Logo/Logo.png"
                alt="MILAN INTERIO"
                width={150}
                height={85}
                className="h-11 w-auto object-contain mx-auto"
              />
            </Link>
            <p className="text-[11px] text-milan-muted leading-relaxed">
              Elevating Spaces. Defining Luxury.
            </p>
          </div>

          {/* Accordion Group */}
          <div className="divide-y divide-milan-border/40 border-y border-milan-border/40">
            
            {/* 1. Explore Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection("explore")}
                className="w-full py-3 flex items-center justify-between text-left text-[11px] tracking-widest uppercase font-mono text-milan-gold cursor-pointer"
                aria-expanded={openSections.explore}
              >
                <span>EXPLORE</span>
                <ChevronDown
                  size={14}
                  className={`text-milan-gold transition-transform duration-300 ${
                    openSections.explore ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.explore && (
                <div className="pb-3 pt-1 pl-2 space-y-2 text-xs text-milan-muted animate-fade-in">
                  <Link href="/about" className="block hover:text-milan-gold transition-colors tracking-wider">
                    ABOUT
                  </Link>
                  <Link href="/projects" className="block hover:text-milan-gold transition-colors tracking-wider">
                    PROJECTS
                  </Link>
                  <Link href="/studio" className="block hover:text-milan-gold transition-colors tracking-wider">
                    STUDIO
                  </Link>
                </div>
              )}
            </div>

            {/* 2. Services Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection("services")}
                className="w-full py-3 flex items-center justify-between text-left text-[11px] tracking-widest uppercase font-mono text-milan-gold cursor-pointer"
                aria-expanded={openSections.services}
              >
                <span>SERVICES & PROCESS</span>
                <ChevronDown
                  size={14}
                  className={`text-milan-gold transition-transform duration-300 ${
                    openSections.services ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.services && (
                <div className="pb-3 pt-1 pl-2 space-y-2 text-xs text-milan-muted animate-fade-in">
                  <Link href="/services" className="block hover:text-milan-gold transition-colors tracking-wider">
                    SERVICES
                  </Link>
                  <Link href="/process" className="block hover:text-milan-gold transition-colors tracking-wider">
                    PROCESS
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Studio & Contact Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection("contact")}
                className="w-full py-3 flex items-center justify-between text-left text-[11px] tracking-widest uppercase font-mono text-milan-gold cursor-pointer"
                aria-expanded={openSections.contact}
              >
                <span>STUDIO & CONTACT</span>
                <ChevronDown
                  size={14}
                  className={`text-milan-gold transition-transform duration-300 ${
                    openSections.contact ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSections.contact && (
                <div className="pb-3 pt-1 pl-2 space-y-2.5 text-xs text-milan-muted animate-fade-in">
                  <div className="flex items-start gap-2">
                    <MapPin size={12} className="text-milan-gold shrink-0 mt-0.5" />
                    <span className="whitespace-pre-line leading-relaxed text-milan-ivory/90 text-[11px]">
                      {officeAddress}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="text-milan-gold shrink-0" />
                    <a
                      href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                      className="hover:text-milan-gold transition-colors font-light text-milan-ivory/90 text-[11px]"
                    >
                      {contactPhone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={12} className="text-milan-gold shrink-0" />
                    <a
                      href={`mailto:${contactEmail}`}
                      className="hover:text-milan-gold transition-colors font-light text-milan-ivory/90 text-[11px]"
                    >
                      {contactEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe size={12} className="text-milan-gold shrink-0" />
                    <span className="text-milan-muted font-light text-[11px]">{website}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Saudi Legal Credentials Accordion */}
            {(crNumber || vatNumber) && (
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection("legal")}
                  className="w-full py-3 flex items-center justify-between text-left text-[11px] tracking-widest uppercase font-mono text-milan-gold cursor-pointer"
                  aria-expanded={openSections.legal}
                >
                  <span>SAUDI BUSINESS & LEGAL</span>
                  <ChevronDown
                    size={14}
                    className={`text-milan-gold transition-transform duration-300 ${
                      openSections.legal ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openSections.legal && (
                  <div className="pb-3 pt-1 pl-2 space-y-1.5 text-xs font-mono animate-fade-in">
                    {crNumber && (
                      <div className="flex items-center gap-2 text-milan-muted">
                        <span className="text-milan-gold font-semibold text-[10px]">CR:</span>
                        <span className="text-milan-ivory/90 tracking-wider text-[11px]">{crNumber}</span>
                      </div>
                    )}
                    {vatNumber && (
                      <div className="flex items-center gap-2 text-milan-muted">
                        <span className="text-milan-gold font-semibold text-[10px]">VAT:</span>
                        <span className="text-milan-ivory/90 tracking-wider text-[11px]">{vatNumber}</span>
                      </div>
                    )}
                    <div className="text-[10px] text-milan-muted/70 pt-0.5">Kingdom of Saudi Arabia (KSA)</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-milan-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-4 sm:py-6 flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4 text-[10px] tracking-wider text-milan-muted text-center md:text-left">
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
