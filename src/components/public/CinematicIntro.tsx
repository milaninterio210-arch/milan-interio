"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export function CinematicIntro() {
  const [isClosing, setIsClosing] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);

  const handleDismiss = useCallback(() => {
    if (isClosing || isDestroyed) return;
    setIsClosing(true);

    try {
      sessionStorage.setItem("milan_intro_seen", "true");
    } catch (_) {}

    // Smooth luxury fade out transition
    setTimeout(() => {
      document.documentElement.classList.add("milan-intro-seen");
      document.documentElement.classList.remove("milan-intro-active");
      setIsDestroyed(true);
    }, 700);
  }, [isClosing, isDestroyed]);

  useEffect(() => {
    // If already seen, destroy immediately
    try {
      if (sessionStorage.getItem("milan_intro_seen")) {
        setIsDestroyed(true);
        return;
      }
    } catch (_) {}

    // Auto-advance after 2.0s
    const timer = setTimeout(() => {
      handleDismiss();
    }, 2100);

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
      className={`fixed inset-0 z-[999999] flex items-center justify-center bg-[#07110D] cursor-pointer select-none ${
        isClosing
          ? "opacity-0 scale-[1.02] pointer-events-none"
          : "opacity-100 scale-100"
      }`}
      aria-label="Welcome to Milan Interio"
    >
      {/* Ambient Gold Radial Glow (Hardware-accelerated, Zero Lag) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(197,160,89,0.14)_0%,rgba(7,17,13,0.85)_50%,#07110D_100%)]" />

      {/* Luxury Corner Focus Marks */}
      <div className="absolute inset-6 sm:inset-10 md:inset-14 pointer-events-none">
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-milan-gold/30" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-milan-gold/30" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-milan-gold/30" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-milan-gold/30" />
      </div>

      {/* Central Logo Stage */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-lg mx-auto">
        {/* Soft Gold Glow behind Logo */}
        <div className="absolute w-44 h-44 sm:w-64 sm:h-64 rounded-full bg-milan-gold/15 blur-2xl pointer-events-none" />

        {/* Master Logo Container with Metallic Shimmer */}
        <div className="relative overflow-hidden p-2 group">
          <Image
            src="/Logo/Logo-no-bg.png"
            alt="MILAN INTERIO"
            width={380}
            height={214}
            priority
            className="h-20 sm:h-28 md:h-36 w-auto object-contain transition-transform duration-700 ease-out drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
          />

          {/* Light Glint Sweep (Fast, Smooth, Pure CSS GPU) */}
          <div
            className="absolute inset-0 pointer-events-none animate-[cinema-sweep_1.5s_cubic-bezier(0.2,1,0.3,1)_forwards]"
            style={{
              background:
                "linear-gradient(110deg, transparent 25%, rgba(255,245,210,0.35) 48%, rgba(255,255,255,0.7) 50%, rgba(255,245,210,0.35) 52%, transparent 75%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
