'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Heart, Gem } from 'lucide-react';

export const CustomizeWeddingRingSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-12 max-w-[1440px] mx-auto w-full bg-white overflow-hidden select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cormorant font-normal text-neutral-900 tracking-tight leading-tight">
            Customize Your Wedding Ring
          </h2>

          <p className="mt-3 text-sm sm:text-base text-neutral-600 font-light max-w-2xl mx-auto leading-relaxed">
            A sacred symbol of lifelong commitment, sculpted with generational Ceylon mastery and tailored to fit your love story flawlessly.
          </p>
        </div>

        {/* 3-Column Display: Left Description | Center Large Ring Image | Right Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 items-center">
          
          {/* Left Description Column (3 cols) */}
          <div className="lg:col-span-3 space-y-6 lg:text-right flex flex-col lg:items-end">
            <div>
              
             
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              Whether you desire a classic high-polish band, a contour band crafted to nest flush against your engagement ring, or intricate hand-carved pavé settings, our goldsmiths calibrate every contour to your personal aesthetic.
            </p>

          </div>

          {/* Center Showcase Large Image Column (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative py-6 px-2">
            {/* Subtle Pedestal Glow Effect */}
            <div className="absolute inset-0 bg-radial from-neutral-200/60 via-neutral-100/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="relative group cursor-pointer w-full flex items-center justify-center overflow-hidden">
              {/* Left Edge White Blend / Drop */}
              <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10" />

              {/* Right Edge White Blend / Drop */}
              <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10" />

              <img
                src="/img/wedding-ring-bespoke.png"
                alt="Bespoke Handcrafted Wedding Ring"
                className="w-full max-w-[500px] sm:max-w-[560px] lg:max-w-[620px] h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.14)] group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Description Column (3 cols) */}
          <div className="lg:col-span-3 space-y-6 text-left flex flex-col items-start">
            

            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              Enrich your wedding ring with natural unheated Ceylon sapphires or brilliant diamonds. Each stone is individually inspected for optical purity and hand-set with artisanal precision for lasting daily wear.
            </p>

          
          </div>

        </div>

        {/* Bottom CTA Block: Button + Small Description redirecting to Customize page */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-neutral-100 text-center flex flex-col items-center justify-center space-y-4">
          <Link
            href="/customize"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-black text-white hover:bg-neutral-800 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 group cursor-pointer"
          >
            <span>Customize Your Wedding Ring</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="text-xs text-neutral-500 font-light max-w-md mx-auto leading-relaxed">
            Launch our interactive 8-step bespoke studio to configure your band silhouette, choose metals, select Ceylon gemstones, and preview your heirloom piece.
          </p>
        </div>

      </div>
    </section>
  );
};

export default CustomizeWeddingRingSection;

