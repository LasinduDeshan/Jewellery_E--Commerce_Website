'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Gem, Award } from 'lucide-react';

export function HighJewellerySpotlight() {
  return (
    <section className="relative w-full h-screen min-h-[700px] max-h-[1200px] bg-black text-white overflow-hidden flex flex-col justify-between">
      {/* ============================================================ */}
      {/* 1. FULL SCREEN CINEMATIC BACKGROUND IMAGE                     */}
      {/* ============================================================ */}
      <div className="absolute inset-0 w-full h-full select-none overflow-hidden">
        <img
          src="/img/d.png"
          alt="Zeyloraa Midnight High Jewellery Suite"
          className="w-full h-full object-cover object-center scale-[1.01] transition-transform duration-1000 ease-out"
        />

        {/* Ambient Vignette & Gradient Overlays for Readability & Cinematic Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/70 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/10 to-black/80 pointer-events-none" />
      </div>

      {/* ============================================================ */}
      {/* 2. TOP FLOATING BRAND & ATELIER TAG                          */}
      {/* ============================================================ */}
      <div className="relative z-20 pt-8 sm:pt-12 px-6 sm:px-12 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-black/40 backdrop-blur-xl text-xs font-medium text-neutral-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Haute Joaillerie Atelier • The Midnight Suite</span>
        </div>

        <div className="hidden sm:flex items-center gap-6 text-xs text-neutral-400 font-light">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            Conflict-Free Provenance
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-neutral-400" />
            NGJA Certified
          </span>
          <span className="flex items-center gap-1.5">
            <Gem className="w-3.5 h-3.5 text-neutral-400" />
            18K Solid Gold
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. BOTTOM CINEMATIC EDITORIAL CAPTION & ACTIONS              */}
      {/* ============================================================ */}
      <div className="relative z-20 pb-8 sm:pb-12 px-6 sm:px-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          
          {/* Left Title & Description */}
          <div className="max-w-2xl space-y-2">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-cormorant font-normal text-white">
              Sculpted in Darkness, Born in Light
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300/90 font-light leading-relaxed max-w-xl">
              An intimate study of form, symmetry, and nocturnal radiance. Handcrafted 18K solid gold and natural diamonds, forged by our hereditary guild in Ratnapura.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/customize"
              className="px-7 py-3.5 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xl hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Design Bespoke Piece</span>
            </Link>

            <Link
              href="/shop"
              className="px-7 py-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/30 hover:border-white text-xs font-semibold transition-all backdrop-blur-xl flex items-center gap-2 group cursor-pointer shadow-xl hover:scale-[1.02]"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HighJewellerySpotlight;
