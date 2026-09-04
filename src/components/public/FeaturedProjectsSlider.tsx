"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [isPaused, setIsPaused] = useState(false);
  const [itemStep, setItemStep] = useState(0);
  const [maxTranslate, setMaxTranslate] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const total = projects?.length || 0;

  // Measure card width + gap dynamically and compute maximum translate bound
  const updateMeasurements = useCallback(() => {
    if (!trackRef.current || !containerRef.current) return;
    const track = trackRef.current;
    const container = containerRef.current;

    if (track.children.length > 1) {
      const first = track.children[0] as HTMLElement;
      const second = track.children[1] as HTMLElement;
      setItemStep(second.offsetLeft - first.offsetLeft);
    } else if (track.children.length === 1) {
      const first = track.children[0] as HTMLElement;
      setItemStep(first.offsetWidth + 24);
    }

    // Maximum scroll distance so the last card aligns with the container's right edge
    const max = Math.max(0, track.scrollWidth - container.clientWidth);
    setMaxTranslate(max);
  }, []);

  useEffect(() => {
    updateMeasurements();
    window.addEventListener("resize", updateMeasurements);
    return () => window.removeEventListener("resize", updateMeasurements);
  }, [updateMeasurements, total]);

  // Current translation capped at maxTranslate so the last image never slides past the right edge
  const currentTranslate = Math.min(current * (itemStep || 0), maxTranslate);
  const isAtEnd = maxTranslate <= 0 || currentTranslate >= maxTranslate - 5;
  const isAtStart = current === 0 || currentTranslate <= 5;

  // Auto-play slider every 6s unless hovered or reached the end
  useEffect(() => {
    if (total <= 1 || isPaused || isAtEnd) return;

    const timer = setInterval(() => {
      setCurrent((prev) => {
        if ((prev + 1) * itemStep >= maxTranslate - 5) {
          return prev;
        }
        return prev + 1;
      });
    }, 6000);

    return () => clearInterval(timer);
  }, [total, isPaused, isAtEnd, itemStep, maxTranslate]);

  if (!projects || total === 0) return null;

  const handleNext = () => {
    if (isAtEnd) return;
    setCurrent((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (isAtStart) return;
    setCurrent((prev) => Math.max(0, prev - 1));
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0 && !isAtEnd) {
        handleNext();
      } else if (diff < 0 && !isAtStart) {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative py-7 sm:py-14 overflow-hidden bg-milan-primary"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 sm:gap-8 lg:gap-10 w-full">
          {/* Left Column: Heading, Info & Controls */}
          <div className="w-full lg:w-[280px] xl:w-[320px] shrink-0 flex flex-col justify-center space-y-3 sm:space-y-6">
            {/* Title & Description */}
            <div className="space-y-2 sm:space-y-4">
              <div className="flex items-end justify-between">
                <div className="space-y-0.5 sm:space-y-1">
                  <span className="text-xl sm:text-3xl md:text-4xl font-serif text-milan-gold font-normal tracking-wide block">
                    Featured
                  </span>
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-milan-ivory font-medium tracking-tight uppercase block">
                    Projects
                  </h2>
                </div>

                {/* Mobile Navigation Arrows */}
                {total > 1 && (
                  <div className="flex sm:hidden items-center gap-2">
                    <button
                      onClick={handlePrev}
                      disabled={isAtStart}
                      className={`w-9 h-9 border flex items-center justify-center transition-all duration-300 ${
                        isAtStart
                          ? "bg-milan-charcoal/40 text-milan-ivory/20 border-milan-border/20 cursor-not-allowed opacity-40"
                          : "bg-milan-charcoal/80 text-milan-ivory border-milan-border active:scale-95"
                      }`}
                      aria-label="Previous Project"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={isAtEnd}
                      className={`w-9 h-9 border flex items-center justify-center transition-all duration-300 ${
                        isAtEnd
                          ? "bg-milan-charcoal/40 text-milan-ivory/20 border-milan-border/20 cursor-not-allowed opacity-40"
                          : "bg-milan-emerald/60 text-milan-ivory border-milan-border active:scale-95"
                      }`}
                      aria-label="Next Project"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-xs sm:text-sm text-milan-muted font-light leading-relaxed max-w-sm line-clamp-2 sm:line-clamp-none">
                A curated selection of our most distinguished architectural and interior endeavors, crafted with refined timelessness.
              </p>
            </div>

            {/* Desktop Navigation Arrows */}
            {total > 1 && (
              <div className="hidden sm:flex items-center gap-2 pt-1">
                <button
                  onClick={handlePrev}
                  disabled={isAtStart}
                  className={`w-12 h-12 border flex items-center justify-center transition-all duration-300 ${
                    isAtStart
                      ? "bg-milan-charcoal/40 text-milan-ivory/20 border-milan-border/20 cursor-not-allowed opacity-40"
                      : "bg-milan-charcoal/80 hover:bg-milan-gold text-milan-ivory hover:text-milan-primary border-milan-border hover:border-milan-gold cursor-pointer active:scale-95 group"
                  }`}
                  aria-label="Previous Project"
                >
                  <ChevronLeft
                    size={18}
                    className={`transition-transform duration-200 ${!isAtStart ? "group-hover:-translate-x-0.5" : ""}`}
                  />
                </button>
                <button
                  onClick={handleNext}
                  disabled={isAtEnd}
                  className={`w-12 h-12 border flex items-center justify-center transition-all duration-300 ${
                    isAtEnd
                      ? "bg-milan-charcoal/40 text-milan-ivory/20 border-milan-border/20 cursor-not-allowed opacity-40"
                      : "bg-milan-emerald/60 hover:bg-milan-gold text-milan-ivory hover:text-milan-primary border-milan-border hover:border-milan-gold cursor-pointer active:scale-95 group"
                  }`}
                  aria-label="Next Project"
                >
                  <ChevronRight
                    size={18}
                    className={`transition-transform duration-200 ${!isAtEnd ? "group-hover:translate-x-0.5" : ""}`}
                  />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Carousel Track */}
          <div
            ref={containerRef}
            className="w-full lg:flex-1 min-w-0 overflow-hidden relative"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              ref={trackRef}
              className="flex gap-4 sm:gap-7 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
              style={{
                transform: `translateX(-${currentTranslate}px)`,
              }}
            >
              {projects.map((project, idx) => (
                <div
                  key={project.slug || idx}
                  className="w-[85vw] sm:w-[250px] md:w-[270px] lg:w-[290px] xl:w-[310px] shrink-0 group flex flex-col"
                >
                  {/* Image Container (Wide 4:3 on mobile for full visibility, square on desktop) */}
                  <Link
                    href={`/projects/${project.slug}`}
                    className="block relative aspect-[4/3] sm:aspect-square bg-milan-charcoal overflow-hidden mb-3 sm:mb-3.5 transition-colors duration-300"
                  >
                    {project.cover_image_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={project.cover_image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading={idx <= 2 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-milan-muted uppercase tracking-widest font-mono">
                        Image Pending
                      </div>
                    )}
                    {/* Subtle Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />
                  </Link>

                  {/* Text Details Below Image */}
                  <div className="space-y-1.5 sm:space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/projects/${project.slug}`}>
                        <h3 className="text-base sm:text-xl font-serif text-milan-ivory font-medium tracking-wide group-hover:text-milan-gold transition-colors duration-200 line-clamp-1">
                          {project.title}
                        </h3>
                      </Link>

                      <p className="mt-0.5 sm:mt-1 text-xs text-milan-muted font-light line-clamp-1 sm:line-clamp-2 leading-relaxed">
                        {project.location ? `${project.location} · ` : ""}
                        {project.category}
                      </p>
                    </div>

                    {/* Action Link at Bottom */}
                    <div className="pt-1.5 sm:pt-2">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-milan-gold uppercase transition-all duration-300 group-hover:gap-2.5"
                      >
                        <span>VIEW PROJECT</span>
                        <ChevronRight size={13} className="stroke-[2.5]" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
