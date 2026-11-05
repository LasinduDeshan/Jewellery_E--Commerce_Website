'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import customizeHeroImage from '../../assets/img/hero.png';
import { Sparkles, ArrowDown } from 'lucide-react';

interface CustomizeHeroProps {
  onStartDesigning?: () => void;
}

export const CustomizeHero: React.FC<CustomizeHeroProps> = ({ onStartDesigning }) => {
  return (
    <section
      aria-label="Custom jewellery showcase"
      className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[420px] overflow-hidden bg-black flex items-center justify-center"
    >
      <Image
        src={customizeHeroImage}
        alt="Ceylon Sapphire Custom Atelier"
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover object-center scale-105 duration-[8000ms]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-black" />

      {/* Hero Text Content with smooth professional motion */}
      

      {/* Gentle Scroll Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-[11px] font-mono flex flex-col items-center gap-1 pointer-events-none"
      >
        <span className=" text-[9px]">Scroll to explore</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </motion.div>
    </section>
  );
};

export default CustomizeHero;
