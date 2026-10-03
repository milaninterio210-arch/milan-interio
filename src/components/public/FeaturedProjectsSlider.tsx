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

  // Drag & Swipe states
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartXRef = useRef<number>(0);
  const hasDraggedRef = useRef<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const total = projects?.length || 0;

  // Measure card width + gap dynamically and compute maximum translate bound
  const updateMeasurements = useCallback(() => {
    if (!trackRef.current || !containerRef.current) return;
    const track = trackRef.current;
    const container = containerRef.current;

    if (track.children.length > 1) {
      const first = track.children[0] as HTMLElement;
      const second = track.children[1] as HTMLElement;
      const step = second.offsetLeft - first.offsetLeft;
      setItemStep(step > 0 ? step : first.offsetWidth + 24);
    } else if (track.children.length === 1) {
      const first = track.children[0] as HTMLElement;
      setItemStep(first.offsetWidth + 24);
    }

    // Maximum scroll distance ensuring the last card is 100% fully visible inside container
    const max = Math.max(0, track.scrollWidth - container.clientWidth);
    setMaxTranslate(max);
  }, []);

  useEffect(() => {
    updateMeasurements();
    const timer = setTimeout(updateMeasurements, 300);
    window.addEventListener("resize", updateMeasurements);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateMeasurements);
    };
  }, [updateMeasurements, total]);

  // Temporary pause on interaction with automatic 4-second resume
  const temporarilyPause = useCallback(() => {
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 4000);
  }, []);

  // Step size per slide
  const step = itemStep > 0 ? itemStep : 320;

  // Maximum valid slide index before wrapping
  const maxIndex = maxTranslate > 0 && step > 0 ? Math.ceil(maxTranslate / step) : Math.max(0, total - 1);

  // Compute base translate position: clamp to maxTranslate so no empty void is ever shown
  const baseTranslate =
    total <= 1 || maxTranslate <= 0
      ? 0
      : current === 0
        ? 0
        : Math.min(current * step, maxTranslate);

  // Active translate incorporating live drag offset
  const activeTranslate = isDragging
    ? Math.max(-40, Math.min(baseTranslate - dragOffset, maxTranslate + 40))
    : baseTranslate;

  // Auto-play slider every 4.5s with smooth loop
  useEffect(() => {
    if (total <= 1 || isPaused || isDragging) return;

    const timer = setInterval(() => {
      setCurrent((prev) => {
        if (prev >= maxIndex) {
          return 0; // Wrap around smoothly to the start
        }
        return prev + 1;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [total, isPaused, isDragging, maxIndex]);

  if (!projects || total === 0) return null;

  const handleNext = () => {
    if (total <= 1) return;
    temporarilyPause();
    setCurrent((prev) => {
      if (prev >= maxIndex) return 0; // Loop to first slide
      return prev + 1;
    });
  };

  const handlePrev = () => {
    if (total <= 1) return;
    temporarilyPause();
    setCurrent((prev) => {
      if (prev <= 0) return maxIndex; // Loop to last slide
      return prev - 1;
    });
  };

  const handleGoTo = (index: number) => {
    temporarilyPause();
    setCurrent(Math.max(0, Math.min(index, maxIndex)));
  };

  // --- Unified Touch & Mouse Drag Handlers ---
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setIsPaused(true);
    dragStartXRef.current = clientX;
    hasDraggedRef.current = false;
    setDragOffset(0);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - dragStartXRef.current;
    if (Math.abs(diff) > 6) {
      hasDraggedRef.current = true;
    }
    setDragOffset(diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragOffset) > 45) {
      if (dragOffset < 0) {
        handleNext(); // Dragged left -> advance to next
      } else {
        handlePrev(); // Dragged right -> go to previous
      }
    }
    setDragOffset(0);
    temporarilyPause();
  };

  // Mouse drag event listeners
  const onMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const onMouseUp = () => {
    handleEnd();
  };

  const onMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
    setIsPaused(false);
  };

  // Touch swipe event listeners
  const onTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    handleEnd();
  };

  return (
    <section
      className="relative py-8 sm:py-16 overflow-hidden bg-milan-primary select-none"
      onMouseLeave={onMouseLeave}
      aria-label="Featured Projects Slider"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 sm:gap-8 lg:gap-10 w-full">
          {/* Left Column: Heading & Description Only (Left controls hidden) */}
          <div className="w-full lg:w-[280px] xl:w-[320px] shrink-0 flex flex-col justify-center space-y-3 sm:space-y-4">
            <div className="space-y-1 sm:space-y-2">
              <span className="text-xl sm:text-3xl md:text-4xl font-serif text-milan-gold font-normal tracking-wide block">
                Featured
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-milan-ivory font-medium tracking-tight uppercase block">
                Projects
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-milan-muted font-light leading-relaxed max-w-sm">
              A curated selection of our most distinguished architectural and interior endeavors, crafted with refined timelessness.
            </p>
          </div>

          {/* Right Column: Carousel Track with Floating Arrows & Indicators */}
          <div className="w-full lg:flex-1 min-w-0 relative group/slider">
            {/* Direct Slide Movement Buttons (Floating on the sides of the track) */}
            {total > 1 && (
              <>
                {/* Left Floating Arrow */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute -left-3 sm:-left-5 top-[38%] -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-milan-charcoal/95 backdrop-blur-md border border-milan-gold/60 text-milan-gold hover:text-milan-primary hover:bg-milan-gold shadow-2xl flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-90 group/btn"
                  aria-label="Move Slide Left"
                  title="Previous Slide"
                >
                  <ChevronLeft size={20} className="transition-transform duration-200 group-hover/btn:-translate-x-0.5 stroke-[2.5]" />
                </button>

                {/* Right Floating Arrow */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute -right-3 sm:-right-5 top-[38%] -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-milan-charcoal/95 backdrop-blur-md border border-milan-gold/60 text-milan-gold hover:text-milan-primary hover:bg-milan-gold shadow-2xl flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-90 group/btn"
                  aria-label="Move Slide Right"
                  title="Next Slide"
                >
                  <ChevronRight size={20} className="transition-transform duration-200 group-hover/btn:translate-x-0.5 stroke-[2.5]" />
                </button>
              </>
            )}

            {/* Slider Container with Drag Support */}
            <div
              ref={containerRef}
              className={`w-full overflow-hidden relative pb-2 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div
                ref={trackRef}
                className={`flex gap-4 sm:gap-7 ${isDragging
                    ? "transition-none"
                    : "transition-transform duration-600 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  } will-change-transform`}
                style={{
                  transform: `translateX(-${activeTranslate}px)`,
                }}
              >
                {projects.map((project, idx) => {
                  const isCurrent = idx === current;
                  return (
                    <div
                      key={project.slug || idx}
                      onClick={() => {
                        if (!hasDraggedRef.current) {
                          handleGoTo(idx);
                        }
                      }}
                      className={`w-full sm:w-[calc(50%-14px)] shrink-0 group flex flex-col transition-all duration-300 ${
                        isCurrent ? "opacity-100 scale-100" : "opacity-90 hover:opacity-100"
                      }`}
                    >
                      {/* Image Container */}
                      <Link
                        href={`/projects/${project.slug}`}
                        onClick={(e) => {
                          if (hasDraggedRef.current) {
                            e.preventDefault();
                          }
                        }}
                        className="block relative w-full aspect-[4/3] bg-milan-charcoal overflow-hidden mb-3 sm:mb-3.5 border border-milan-border/60 group-hover:border-milan-gold/60 transition-colors duration-300 pointer-events-auto"
                      >
                        {project.cover_image_url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={project.cover_image_url}
                            alt={project.title}
                            draggable={false}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
                            loading={idx <= 2 ? "eager" : "lazy"}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-milan-muted uppercase tracking-widest font-mono">
                            Image Pending
                          </div>
                        )}
                        {/* Subtle Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />

                        {/* Slide Number Badge */}
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-milan-primary/90 backdrop-blur-sm border border-milan-gold/40 text-milan-gold text-[10px] font-mono font-semibold tracking-wider">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                      </Link>

                      {/* Text Details Below Image */}
                      <div className="space-y-1.5 sm:space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <Link
                            href={`/projects/${project.slug}`}
                            onClick={(e) => {
                              if (hasDraggedRef.current) {
                                e.preventDefault();
                              }
                            }}
                          >
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
                        <div className="pt-1.5 sm:pt-2 flex items-center justify-between">
                          <Link
                            href={`/projects/${project.slug}`}
                            onClick={(e) => {
                              if (hasDraggedRef.current) {
                                e.preventDefault();
                              }
                            }}
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-milan-gold uppercase transition-all duration-300 group-hover:gap-2.5"
                          >
                            <span>VIEW PROJECT</span>
                            <ChevronRight size={13} className="stroke-[2.5]" />
                          </Link>

                          <span className="text-[10px] font-mono text-milan-muted/70">
                            {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Slide Indicator Bar */}
            {total > 1 && maxIndex > 0 && (
              <div className="mt-4 sm:mt-6 flex items-center justify-center pt-3 border-t border-milan-border/40">
                {/* Clickable Slide Indicators */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {Array.from({ length: maxIndex + 1 }).map((_, idx) => {
                    const isActive = idx === current;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleGoTo(idx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${isActive
                            ? "w-8 sm:w-10 bg-milan-gold"
                            : "w-2 sm:w-2.5 bg-milan-charcoal hover:bg-milan-gold/50 border border-milan-border"
                          }`}
                        aria-label={`Go to slide ${idx + 1}`}
                        title={`View slide ${idx + 1}`}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
