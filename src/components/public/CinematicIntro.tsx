"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function CinematicIntro() {
  const [isClosing, setIsClosing] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);

  const handleDismiss = useCallback(() => {
    if (isClosing || isDestroyed) return;
    setIsClosing(true);

    try {
      sessionStorage.setItem("milan_intro_seen", "true");
    } catch (_) {}

    // Smooth luxury fade-out transition
    setTimeout(() => {
      document.documentElement.classList.add("milan-intro-seen");
      document.documentElement.classList.remove("milan-intro-active");
      setIsDestroyed(true);
    }, 700);
  }, [isClosing, isDestroyed]);

  useEffect(() => {
    // If already seen in this session, destroy immediately
    try {
      if (sessionStorage.getItem("milan_intro_seen")) {
        setIsDestroyed(true);
        return;
      }
    } catch (_) {}

    // Auto-advance after 2.4s
    const timer = setTimeout(() => {
      handleDismiss();
    }, 2400);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        handleDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleDismiss]);

  if (isDestroyed) return null;

  return (
    <div
      id="milan-intro-overlay"
      onClick={handleDismiss}
      className={`fixed inset-0 z-[999999] flex items-center justify-center bg-milan-primary cursor-pointer select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isClosing
          ? "opacity-0 scale-[1.03] pointer-events-none"
          : "opacity-100 scale-100"
      }`}
      aria-label="Welcome to Milan Interio"
    >
      {/* Ambient Deep Gold Radial Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(196,149,46,0.18)_0%,rgba(19,47,44,0.35)_40%,rgba(8,20,19,0.92)_70%,#081413_100%)]" />

      {/* Central Logo & Brand Stage */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-xl mx-auto">
        {/* Soft Warm Gold Bloom behind Logo */}
        <div className="absolute w-44 h-44 sm:w-60 sm:h-60 rounded-full bg-milan-gold/15 blur-3xl pointer-events-none" />

        {/* Master Logo Container with Framer Motion Entrance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center justify-center p-2 group"
        >
          <div className="relative p-2">
            <Image
              src="/Logo/Logo.png"
              alt="MILAN INTERIO"
              width={360}
              height={270}
              priority
              className="h-20 sm:h-26 md:h-30 w-auto object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.7)]"
            />
          </div>

          {/* Luxury Brand Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 sm:mt-5 text-center"
          >
            <p className="text-[9px] sm:text-[10px] tracking-[0.22em] sm:tracking-[0.35em] text-milan-gold/80 uppercase font-mono font-medium">
              ELEVATING SPACES · DEFINING LUXURY
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle Bottom Interaction Cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-6 sm:bottom-8 text-[9px] tracking-[0.28em] text-milan-muted/40 uppercase font-mono"
      >
        Click to enter
      </motion.div>
    </div>
  );
}
