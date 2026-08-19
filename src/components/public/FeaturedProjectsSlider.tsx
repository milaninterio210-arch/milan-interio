"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface Project {
  slug: string;
  title: string;
  category: string;
  location: string | null;
  cover_image_url: string | null;
}

interface FeaturedProjectsSliderProps {
  projects: Project[];
}

export default function FeaturedProjectsSlider({ projects }: FeaturedProjectsSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!projects || projects.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % projects.length);
    }, 6000); // Auto slide every 6 seconds

    return () => clearInterval(timer);
  }, [current, projects.length]);

  if (!projects || projects.length === 0) return null;

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const activeProject = projects[current];

  return (
    <section className="py-16 sm:py-24 px-6 border-t border-milan-border/60">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Details (Span 4) */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <span className="text-[10px] tracking-widest text-milan-gold uppercase font-mono block animate-fade-up">
              FEATURED PROJECT
            </span>
            
            <div className="space-y-4 animate-fade-up">
              <div className="flex items-baseline gap-2.5">
                <span className="text-xl sm:text-2xl text-milan-gold font-mono leading-none">
                  {String(current + 1).padStart(2, "0")}
                </span>
                <span className="text-milan-muted text-sm font-mono leading-none">/</span>
                <h3 className="heading-display text-lg sm:text-xl md:text-2xl text-milan-ivory uppercase tracking-wider font-semibold leading-none">
                  {activeProject.title}
                </h3>
              </div>
              <div className="space-y-1 pl-8 font-mono text-[11px] text-milan-muted">
                {activeProject.location && <p>{activeProject.location}</p>}
                <p>{activeProject.category}</p>
              </div>
            </div>

            {/* Slider Navigation Row */}
            {projects.length > 1 && (
              <div className="pl-8 pt-2 flex items-center gap-6 animate-fade-up">
                {/* Page Indicator */}
                <div className="flex items-center gap-3 text-[10px] font-mono text-milan-muted">
                  <span className="text-milan-gold font-semibold">{String(current + 1).padStart(2, "0")}</span>
                  <div className="w-10 h-[1px] bg-milan-gold/30" />
                  <span>{String(projects.length).padStart(2, "0")}</span>
                </div>

                {/* Circular actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="w-9 h-9 rounded-full border border-milan-border hover:border-milan-gold text-milan-ivory/60 hover:text-milan-gold flex items-center justify-center transition-all duration-300 bg-transparent outline-none cursor-pointer"
                    aria-label="Previous Project"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-9 h-9 rounded-full border border-milan-border hover:border-milan-gold text-milan-ivory/60 hover:text-milan-gold flex items-center justify-center transition-all duration-300 bg-transparent outline-none cursor-pointer"
                    aria-label="Next Project"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            <div className="pl-8 pt-2 animate-fade-up">
              <Link
                href={`/projects/${activeProject.slug}`}
                className="inline-flex items-center gap-2 border border-milan-border hover:border-milan-gold text-milan-ivory hover:text-milan-gold px-6 py-3.5 text-[10px] tracking-widest font-semibold uppercase transition-all duration-300"
              >
                <span>VIEW PROJECT</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Right Column: Image (Span 8) */}
          <div className="lg:col-span-8 relative aspect-[16/9] bg-milan-charcoal overflow-hidden border border-milan-border/60 animate-fade-up">
            {activeProject.cover_image_url ? (
              <img
                src={activeProject.cover_image_url}
                alt={activeProject.title}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-milan-muted uppercase tracking-widest font-mono">
                Image Pending
              </div>
            )}
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
