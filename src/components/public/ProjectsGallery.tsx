"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

  const filters = ["ALL", "RESIDENTIAL", "COMMERCIAL", "HOSPITALITY", "OFFICE", "RETAIL"];

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

  // Helper map to allow partial matching for database categories
  const filterMap = (f: string) => {
    if (f === "OFFICE") return "OFFIC";
    if (f === "RETAIL") return "RETAI";
    return f;
  };

  const filteredProjects = getFilteredProjects();

  const getGridSpan = (index: number) => {
    const rem = index % 5;
    if (rem === 0 || rem === 1) {
      return "lg:col-span-4 md:col-span-6 col-span-12";
    }
    if (rem === 2) {
      return "lg:col-span-4 md:col-span-12 col-span-12";
    }
    return "lg:col-span-6 md:col-span-6 col-span-12";
  };

  const getImageAspect = (index: number) => {
    const rem = index % 5;
    if (rem === 0 || rem === 1) {
      return "aspect-[16/10]";
    }
    if (rem === 2) {
      return "aspect-[4/5]";
    }
    return "aspect-[16/9]";
  };

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Header section with Filter controls */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-milan-border/60">
        <h1 className="heading-display text-2xl sm:text-3xl text-milan-ivory uppercase tracking-wider font-serif">
          OUR PROJECTS
        </h1>

        {/* Filters Grid */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-[10px] tracking-widest font-mono uppercase font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "border border-milan-gold bg-transparent text-milan-gold"
                    : "border border-transparent text-milan-muted hover:text-milan-gold"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </section>

      {/* Projects Grid or Empty State */}
      <section>
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
            {filteredProjects.map((project, index) => {
              const span = getGridSpan(index);
              const aspect = getImageAspect(index);
              const showOverlay = index % 5 !== 2; // In mockup, index 2 (Card 3) does not have info overlay box

              return (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className={`${span} group flex flex-col border border-milan-border/60 hover:border-milan-gold transition-colors duration-300 bg-milan-primary overflow-hidden`}
                >
                  {/* Upper image block */}
                  <div className={`w-full relative ${aspect} bg-milan-charcoal overflow-hidden border-b border-milan-border/60 group-hover:border-milan-gold/40 transition-colors`}>
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
                    
                    {/* Dark gradient shadow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                  </div>

                  {/* Lower detail box */}
                  {showOverlay ? (
                    <div className="p-5 sm:p-6 flex items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Number */}
                        <span className="text-xl sm:text-2xl text-milan-gold font-mono leading-none">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        
                        {/* Text copy */}
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

                      {/* Right Arrow */}
                      <ArrowRight
                        size={14}
                        className="text-milan-muted group-hover:text-milan-gold group-hover:translate-x-1.5 transition-all duration-300"
                      />
                    </div>
                  ) : null}
                </Link>
              );
            })}
          </div>
        ) : (
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
      </section>
    </div>
  );
}
