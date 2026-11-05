'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Gem } from 'lucide-react';

interface CustomizeScrollerProps {
  onOpenStudio: () => void;
}

export const CustomizeScroller: React.FC<CustomizeScrollerProps> = ({ onOpenStudio }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* 1. Top Luxury Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-neutral-900 via-neutral-500 to-black origin-left z-50 pointer-events-none"
        style={{ scaleX }}
      />

      {/* 2. Floating Quick Studio Launcher Pill */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : 30,
          scale: isVisible ? 1 : 0.95,
          pointerEvents: isVisible ? 'auto' : 'none',
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none"
      >
        <button
          onClick={onOpenStudio}
          className="flex items-center p-1 sm:p-1.5 rounded-full bg-black/95 text-white shadow-[0_12px_32px_rgba(0,0,0,0.35)] border border-white/20 backdrop-blur-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
          aria-label="Start Designing - Open Studio"
        >
          {/* Left Side: Black BG Text */}
          <span className="px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium tracking-wide text-white whitespace-nowrap">
            Start Designing
          </span>

          {/* Right Side: White Pill with Gem Icon and 'Open Studio' */}
          <div className="px-3.5 sm:px-4 py-1.5 rounded-full bg-white text-black font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm group-hover:bg-neutral-100 transition-colors whitespace-nowrap">
            <Gem className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black group-hover:scale-110 transition-transform" />
            <span>Open Studio</span>
          </div>
        </button>
      </motion.div>
    </>
  );
};

export default CustomizeScroller;
