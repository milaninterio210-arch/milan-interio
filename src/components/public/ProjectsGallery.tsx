"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  SquareDashedKanban,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  slug: string;
  title: string;
  category: string;
  location: string | null;
  cover_image_url: string | null;
}

interface ProjectsGalleryProps {
  initialProjects: Project[];
}

export default function ProjectsGallery({ initialProjects }: ProjectsGalleryProps) {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");

  // Slider states
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
  const filterRef = useRef<HTMLDivElement>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filters = ["ALL", "RESIDENTIAL", "COMMERCIAL", "HOSPITALITY", "OFFICE", "RETAIL"];

  const filterMap = (f: string) => {
    if (f === "OFFICE") return "OFFIC";
    if (f === "RETAIL") return "RETAI";
    return f;
  };

  const getFilteredProjects = () => {
    if (activeFilter === "ALL") return initialProjects;
    return initialProjects.filter((p) => {
      const cat = (p.category || "").toUpperCase();
      if (activeFilter === "RESIDENTIAL") {
        return cat.includes("RESIDEN");
      }
      return cat.includes(filterMap(activeFilter));
    });
  };

  const filteredProjects = getFilteredProjects();
  const total = filteredProjects.length;

  // Reset slide index when filter changes
  useEffect(() => {
    setCurrent(0);
    setDragOffset(0);
  }, [activeFilter]);

  // Measure card width + gap dynamically and compute maximum translate bound
  const updateMeasurements = useCallback(() => {
    if (!trackRef.current || !containerRef.current) return;
    const track = trackRef.current;
    const container = containerRef.current;

    if (track.children.length > 1) {
      const first = track.children[0] as HTMLElement;
      const second = track.children[1] as HTMLElement;
      const step = second.offsetLeft - first.offsetLeft;
      setItemStep(step > 0 ? step : first.offsetWidth + 28);
    } else if (track.children.length === 1) {
      const first = track.children[0] as HTMLElement;
      setItemStep(first.offsetWidth + 28);
    }

    // Maximum scroll distance ensuring the last card is 100% fully visible inside container
    const max = Math.max(0, track.scrollWidth - container.clientWidth);
    setMaxTranslate(max);
  }, []);

  useEffect(() => {
    if (viewMode === "slider") {
      updateMeasurements();
      const timer = setTimeout(updateMeasurements, 300);
      window.addEventListener("resize", updateMeasurements);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", updateMeasurements);
      };
    }
  }, [updateMeasurements, total, viewMode]);

  // Temporary pause on interaction with automatic 4-second resume
  const temporarilyPause = useCallback(() => {
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 4000);
  }, []);

  // Auto-play slider every 4.5s with smooth loop
  useEffect(() => {
    if (viewMode !== "slider" || total <= 1 || isPaused || isDragging) return;

    const timer = setInterval(() => {
      setCurrent((prev) => {
        if (prev >= total - 1) {
          return 0; // Wrap around smoothly to the start
        }
        return prev + 1;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [total, isPaused, isDragging, viewMode]);

  const handleNext = () => {
    if (total <= 1) return;
    temporarilyPause();
    setCurrent((prev) => {
      if (prev >= total - 1) return 0; // Loop to first slide
      return prev + 1;
    });
  };

  const handlePrev = () => {
    if (total <= 1) return;
    temporarilyPause();
    setCurrent((prev) => {
      if (prev <= 0) return total - 1; // Loop to last slide
      return prev - 1;
    });
  };

  const handleGoTo = (index: number) => {
    temporarilyPause();
    setCurrent(Math.max(0, Math.min(index, total - 1)));
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
        handleNext(); // Dragged left -> advance
      } else {
        handlePrev(); // Dragged right -> previous
      }
    }
    setDragOffset(0);
    temporarilyPause();
  };

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
    <div className="space-y-8 sm:space-y-12 select-none">
      {/* Header section with Filter controls, View Mode Toggle & Navigation Arrows */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-milan-border/40">
        {/* Title row */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-widest text-milan-gold uppercase block">
              Portfolio Gallery
            </span>
            <h1 className="heading-display text-2xl sm:text-4xl text-milan-ivory uppercase tracking-wider font-serif">
              OUR PROJECTS
            </h1>
          </div>

          {/* Mobile Filter Button */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="relative" ref={filterRef}>
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-milan-charcoal text-milan-gold text-[10px] tracking-widest uppercase font-mono border border-milan-gold/30 active:scale-95 cursor-pointer"
                aria-label="Filter Projects"
              >
                <SlidersHorizontal size={12} />
                <span>{activeFilter === "ALL" ? "FILTER" : activeFilter}</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Mobile Dropdown Panel */}
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: -6 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-2 w-48 bg-milan-charcoal shadow-2xl z-40 py-1 origin-top-right border border-milan-border"
                  >
                    {filters.map((filter) => {
                      const isActive = activeFilter === filter;
                      return (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => {
                            setActiveFilter(filter);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-[11px] font-mono tracking-wider uppercase transition-colors flex items-center justify-between cursor-pointer ${isActive
                              ? "text-milan-gold bg-milan-emerald/30 font-semibold"
                              : "text-milan-ivory hover:text-milan-gold hover:bg-milan-emerald/20"
                            }`}
                        >
                          <span>{filter}</span>
                          {isActive && <span className="text-milan-gold text-xs">✓</span>}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Header Controls: Categories & View Switcher */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-4">
          {/* Desktop Filter Pills */}
          <div className="hidden md:flex flex-wrap items-center gap-1.5 sm:gap-2">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3.5 py-1.5 text-[10px] tracking-widest font-mono uppercase font-semibold transition-all duration-300 cursor-pointer border ${isActive
                      ? "bg-milan-gold text-milan-primary border-milan-gold shadow-md"
                      : "text-milan-muted hover:text-milan-gold border-milan-border/50 hover:border-milan-gold/40 bg-milan-charcoal/40"
                    }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle (Slider vs Grid) */}
          <div className="flex items-center gap-1 bg-milan-charcoal p-1 border border-milan-border">
            <button
              type="button"
              onClick={() => setViewMode("slider")}
              className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer ${viewMode === "slider"
                  ? "bg-milan-gold text-milan-primary font-bold shadow-sm"
                  : "text-milan-muted hover:text-milan-ivory"
                }`}
              title="Slider View"
            >
              <SquareDashedKanban size={13} />
              <span>SLIDER</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer ${viewMode === "grid"
                  ? "bg-milan-gold text-milan-primary font-bold shadow-sm"
                  : "text-milan-muted hover:text-milan-ivory"
                }`}
              title="Grid View"
            >
              <LayoutGrid size={13} />
              <span>GRID</span>
            </button>
          </div>

          {/* Header Slide Counter & Arrows for Slider Mode */}
          {viewMode === "slider" && total > 1 && (
            <div className="flex items-center gap-2 pl-2">
              <div className="font-mono text-xs text-milan-muted pr-1 flex items-center gap-1 py-1 px-2.5 bg-milan-charcoal border border-milan-border">
                <span className="text-milan-gold font-bold">{String(current + 1).padStart(2, "0")}</span>
                <span className="opacity-40">/</span>
                <span>{String(total).padStart(2, "0")}</span>
              </div>

              <button
                type="button"
                onClick={handlePrev}
                className="w-8 h-8 sm:w-9 sm:h-9 border border-milan-gold/40 bg-milan-charcoal hover:bg-milan-gold hover:text-milan-primary text-milan-ivory flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shadow-md"
                aria-label="Previous Slide"
                title="Previous Slide"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-8 h-8 sm:w-9 sm:h-9 border border-milan-gold/40 bg-milan-emerald/90 hover:bg-milan-gold hover:text-milan-primary text-milan-ivory flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shadow-md"
                aria-label="Next Slide"
                title="Next Slide"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      {filteredProjects.length > 0 ? (
        viewMode === "slider" ? (
          /* =========================================================================
             SLIDER VIEW: Interactive Fluid Slide Track with Full Width & Drag
             ========================================================================= */
          <div
            className="max-w-4xl mx-auto w-full relative group/slider select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={onMouseLeave}
          >
            {/* Floating Left & Right Movement Arrows */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 sm:-left-5 top-[38%] -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-milan-primary/90 backdrop-blur-md border border-milan-gold/60 text-milan-gold hover:text-milan-primary hover:bg-milan-gold shadow-2xl flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-90 group/btn"
                  aria-label="Move Slide Left"
                  title="Previous Slide"
                >
                  <ChevronLeft size={22} className="transition-transform duration-200 group-hover/btn:-translate-x-0.5 stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 sm:-right-5 top-[38%] -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-milan-primary/90 backdrop-blur-md border border-milan-gold/60 text-milan-gold hover:text-milan-primary hover:bg-milan-gold shadow-2xl flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-90 group/btn"
                  aria-label="Move Slide Right"
                  title="Next Slide"
                >
                  <ChevronRight size={22} className="transition-transform duration-200 group-hover/btn:translate-x-0.5 stroke-[2.5]" />
                </button>
              </>
            )}

            {/* Slider Viewport Container */}
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
                className={`flex w-full will-change-transform ${isDragging
                    ? "transition-none"
                    : "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  }`}
                style={{
                  transform: `translateX(calc(-${current * 100}% + ${isDragging ? dragOffset : 0}px))`,
                }}
              >
                {filteredProjects.map((project, index) => {
                  const isCurrent = index === current;
                  return (
                    <div
                      key={project.slug || index}
                      onClick={() => {
                        if (!hasDraggedRef.current) {
                          handleGoTo(index);
                        }
                      }}
                      className="w-full min-w-full shrink-0 group flex flex-col px-0.5"
                    >
                      {/* Image Container */}
                      <Link
                        href={`/projects/${project.slug}`}
                        onClick={(e) => {
                          if (hasDraggedRef.current) {
                            e.preventDefault();
                          }
                        }}
                        className="block relative w-full aspect-[16/10] sm:aspect-[16/9] bg-milan-charcoal overflow-hidden mb-3.5 border border-milan-border/60 group-hover:border-milan-gold/60 transition-colors duration-300 pointer-events-auto"
                      >
                        {project.cover_image_url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={project.cover_image_url}
                            alt={project.title}
                            draggable={false}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
                            loading={index <= 2 ? "eager" : "lazy"}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-milan-muted uppercase tracking-widest font-mono">
                            Image Pending
                          </div>
                        )}
                        {/* Subtle Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />

                        {/* Slide Number Badge */}
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-milan-primary/90 backdrop-blur-sm border border-milan-gold/40 text-milan-gold text-[10px] font-mono font-semibold tracking-wider">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                      </Link>

                      {/* Detail Box Below Image */}
                      <div className="p-4 bg-milan-charcoal/40 border border-milan-border/50 group-hover:border-milan-gold/40 transition-colors duration-300 space-y-2.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <Link
                              href={`/projects/${project.slug}`}
                              onClick={(e) => {
                                if (hasDraggedRef.current) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              <h3 className="heading-display text-sm sm:text-base text-milan-ivory uppercase tracking-wider font-semibold group-hover:text-milan-gold transition-colors duration-300 line-clamp-1">
                                {project.title}
                              </h3>
                            </Link>

                            <div className="font-mono text-[10px] text-milan-muted space-x-1.5">
                              {project.location && <span>{project.location}</span>}
                              {project.location && <span>·</span>}
                              <span>{project.category}</span>
                            </div>
                          </div>

                          <Link
                            href={`/projects/${project.slug}`}
                            onClick={(e) => {
                              if (hasDraggedRef.current) {
                                e.preventDefault();
                              }
                            }}
                            className="p-1.5 text-milan-muted group-hover:text-milan-gold transition-colors"
                          >
                            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Slide Indicator Bar */}
            {total > 1 && (
              <div className="mt-4 flex items-center justify-center pt-4 border-t border-milan-border/40">
                {/* Clickable Slide Indicators */}
                <div className="flex items-center gap-2">
                  {filteredProjects.map((_, idx) => {
                    const isActive = idx === current;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleGoTo(idx)}
                        className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${isActive
                            ? "w-8 sm:w-12 bg-milan-gold"
                            : "w-2.5 bg-milan-charcoal hover:bg-milan-gold/50 border border-milan-border"
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
        ) : (
          /* =========================================================================
             GRID VIEW: Standard Multi-Column Gallery Grid
             ========================================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {filteredProjects.map((project, index) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group flex flex-col hover:border-milan-gold transition-colors duration-300 bg-milan-primary overflow-hidden border border-milan-border/60"
              >
                {/* Upper image block */}
                <div className="w-full relative aspect-[16/10] bg-milan-charcoal overflow-hidden border-b border-milan-border/60 group-hover:border-milan-gold/40 transition-colors">
                  {project.cover_image_url ? (
                    <img
                      src={project.cover_image_url}
                      alt={project.title}
                      className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-700 ease-in-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-milan-muted uppercase tracking-widest font-mono">
                      Image Pending
                    </div>
                  )}

                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-milan-primary/90 border border-milan-gold/40 text-milan-gold text-[10px] font-mono">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                </div>

                {/* Lower detail box */}
                <div className="p-5 sm:p-6 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="text-xl sm:text-2xl text-milan-gold font-mono leading-none">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="space-y-1 leading-none text-left">
                      <h3 className="heading-display text-xs sm:text-sm text-milan-ivory uppercase tracking-wider font-semibold group-hover:text-milan-gold transition-colors duration-300">
                        {project.title}
                      </h3>
                      <div className="font-mono text-[10px] text-milan-muted space-x-1.5">
                        {project.location && <span>{project.location}</span>}
                        {project.location && <span>·</span>}
                        <span>{project.category}</span>
                      </div>
                    </div>
                  </div>

                  <ArrowRight
                    size={14}
                    className="text-milan-muted group-hover:text-milan-gold group-hover:translate-x-1.5 transition-all duration-300"
                  />
                </div>
              </Link>
            ))}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="max-w-lg mx-auto text-center py-16 sm:py-24 border border-milan-border/60 space-y-5">
          <p className="text-sm text-milan-muted font-light leading-relaxed">
            No projects match the selected category filter.
          </p>
          <button
            onClick={() => setActiveFilter("ALL")}
            className="inline-block border border-milan-gold text-milan-gold hover:bg-milan-gold hover:text-milan-primary px-6 py-3 text-[10px] tracking-widest font-semibold uppercase font-mono transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
