"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
  eyebrow: string | null;
  heading: string;
  subheading: string | null;
  background_image_url: string | null;
  primary_cta_label: string | null;
  primary_cta_url: string | null;
  secondary_cta_label: string | null;
  secondary_cta_url: string | null;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides || slides.length === 0) {
    return (
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center bg-milan-charcoal">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,35,28,0.4),transparent_70%)]" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-24 space-y-6 sm:space-y-8 animate-fade-up">
          <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-milan-ivory leading-[1.15]">
            LUXURY, DESIGNED AROUND YOU.
          </h1>
          <p className="text-body-lg max-w-xl mx-auto">
            Elevating Spaces. Defining Luxury.
          </p>
        </div>
      </section>
    );
  }

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? "opacity-100 z-0" : "opacity-0 -z-10"
          }`}
        >
          {slide.background_image_url ? (
            <>
              <img
                src={slide.background_image_url}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover animate-fade-in"
              />
              <div className="absolute inset-0 bg-black/30" />
            </>
          ) : (
            <div className="absolute inset-0 bg-milan-charcoal">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,35,28,0.4),transparent_70%)]" />
            </div>
          )}
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-6xl mx-auto text-left px-6 sm:px-12 md:px-16 py-24">
        {slides.map((slide, idx) => {
          if (idx !== current) return null;
          return (
            <div
              key={idx}
              className="space-y-6 sm:space-y-8 animate-fade-up duration-700 max-w-3xl"
            >
              <p className="text-eyebrow tracking-[0.2em] sm:tracking-[0.25em]">
                {slide.eyebrow || "Interior Design | Fit-Out | Custom Joinery | Furniture"}
              </p>

              <h1 className="heading-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-milan-ivory leading-[1.15] font-serif">
                {slide.heading}
              </h1>

              <p className="text-body-lg max-w-xl">
                {slide.subheading}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-3 sm:gap-4">
                {slide.primary_cta_label && (
                  <Link
                    href={slide.primary_cta_url || "/projects"}
                    className="w-full sm:w-auto px-8 py-3.5 border border-milan-gold bg-milan-gold text-milan-primary hover:bg-transparent hover:text-milan-gold text-[11px] tracking-widest uppercase font-semibold transition-all duration-300 text-center"
                  >
                    {slide.primary_cta_label}
                  </Link>
                )}
                {slide.secondary_cta_label && (
                  <Link
                    href={slide.secondary_cta_url || "/contact"}
                    className="w-full sm:w-auto px-8 py-3.5 border border-milan-border text-milan-ivory hover:border-milan-gold hover:text-milan-gold text-[11px] tracking-widest uppercase font-semibold transition-all duration-300 text-center"
                  >
                    {slide.secondary_cta_label}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 text-milan-ivory/60 hover:text-milan-gold hover:scale-115 transition-all cursor-pointer hidden md:block bg-transparent border-0"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 text-milan-ivory/60 hover:text-milan-gold hover:scale-115 transition-all cursor-pointer hidden md:block bg-transparent border-0"
            aria-label="Next Slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicators / Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 bg-transparent border-0 cursor-pointer p-0 ${
                  idx === current ? "bg-milan-gold! w-4!" : "bg-milan-ivory/30"
                }`}
                style={{
                  backgroundColor: idx === current ? "var(--color-milan-gold)" : "rgba(247, 245, 240, 0.3)",
                  width: idx === current ? "1rem" : "0.375rem"
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
