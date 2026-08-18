"use client";

import React, { useState } from "react";
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

          {/* Right Column: Image + Slider Controls (Span 8) */}
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

            {/* Next/Prev buttons at bottom-right corner */}
            {projects.length > 1 && (
              <div className="absolute bottom-0 right-0 flex border-t border-l border-milan-border bg-milan-primary z-10">
                <button
                  onClick={handlePrev}
                  className="p-4 hover:text-milan-gold text-milan-ivory/60 transition-colors border-r border-milan-border bg-transparent outline-none cursor-pointer border-0"
                  aria-label="Previous Project"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNext}
                  className="p-4 hover:text-milan-gold text-milan-ivory/60 transition-colors bg-transparent outline-none cursor-pointer border-0"
                  aria-label="Next Project"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
