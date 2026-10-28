'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, MessageCircle, Gem } from 'lucide-react';

export function CustomizeJewellerySection() {
  const openDirectWhatsApp = () => {
    const msg = encodeURIComponent(
      'Hello Zeyloraa! I am interested in designing a bespoke Ceylon sapphire jewellery piece. Can we discuss ideas and custom quote details?'
    );
    window.open(`https://wa.me/94771234567?text=${msg}`, '_blank');
  };

  return (
    <section className="w-full bg-gradient-to-b from-black via-[#0d0d10] to-[#111113] text-white pt-8 sm:pt-14 pb-20 sm:pb-28 border-b border-neutral-800/80 overflow-hidden relative">
      {/* Seamless blend overlay into Hero */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-0" />

      {/* Subtle Ambient Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Section Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 sm:mb-16 relative z-10 space-y-3">
       

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-cormorant text-white font-normal">
          Customize Your Jewellery
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto font-light leading-relaxed">
          Collaborate 1-on-1 with our master Ratnapura lapidaries and goldsmiths to sculpt a bespoke Ceylon sapphire heirloom that belongs solely to you.
        </p>
      </div>

      {/* Top Half: Full-Width 3-Photo Triptych */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 w-full overflow-hidden relative z-10 px-4">
        {/* Left Peek Image */}
        <div className="w-24 sm:w-44 md:w-64 lg:w-80 aspect-[3/4] sm:aspect-[4/5] overflow-hidden shrink-0 bg-neutral-900 rounded-2xl  shadow-2xl">
          <img
            src="/img/a4dbfd433c3bd35c67c18b4894f6321a.jpg"
            alt="Atelier jewellery study"
            className="w-full h-full object-cover object-center grayscale contrast-[1.05] hover:grayscale-0 hover:scale-105 transition-all duration-700 ease-out cursor-pointer"
          />
        </div>

        {/* Center Dominant Image */}
        <div className="w-64 sm:w-96 md:w-[480px] lg:w-[560px] aspect-square sm:aspect-[4/5] overflow-hidden shrink-0 bg-neutral-900 rounded-3xl  shadow-2xl">
          <img
            src="/img/58b04d6c32e22fba64656208a9442068.jpg"
            alt="Precious Ceylon heirloom detail"
            className="w-full h-full object-cover object-center grayscale contrast-[1.05] hover:grayscale-0 hover:scale-105 transition-all duration-700 ease-out cursor-pointer"
          />
        </div>

        {/* Right Peek Image */}
        <div className="w-24 sm:w-44 md:w-64 lg:w-80 aspect-[3/4] sm:aspect-[4/5] overflow-hidden shrink-0 bg-neutral-900 rounded-2xl  shadow-2xl">
          <img
            src="/img/49218f1fb573490eea4bc7f2e7d02113.jpg"
            alt="Handcrafted bespoke Ceylon jewellery"
            className="w-full h-full object-cover object-center grayscale contrast-[1.05] hover:grayscale-0 hover:scale-105 transition-all duration-700 ease-out cursor-pointer"
          />
        </div>
      </div>

     

      {/* Bottom Half: Centered Quote Mark, Poetic Atelier Statement & CTAs */}
      <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 mt-14 flex flex-col items-center relative z-10 space-y-5">
        {/* 3-Line Italicized Quotation */}
        <p className="text-lg sm:text-xl md:text-2xl font-cormorant italic text-neutral-200 leading-relaxed max-w-xl">
          &ldquo;In a world of mass production, true bespoke art remains rare.<br className="hidden sm:inline" />
          However pure and understated you are,<br className="hidden sm:inline" />
          your one-of-a-kind Ceylon heirloom is irreplaceable.&rdquo;
        </p>

        {/* Description Subtext */}
        <p className="text-xs text-neutral-400 font-light max-w-md leading-relaxed">
          Can&apos;t find your dream piece? Select your rare Ceylon sapphire (Royal Blue, Padparadscha, Teal, or Canary), choose 925 Sterling Silver or 18K Rose Gold, and collaborate 1-on-1 with our master lapidaries.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/customize"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all shadow-xl hover:scale-[1.02] cursor-pointer"
          >
            
            <span>Design Bespoke Piece</span>
          </Link>

          <button
            onClick={openDirectWhatsApp}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-white border border-neutral-700/80 hover:border-neutral-500 text-xs font-semibold transition-all backdrop-blur-md shadow-xl hover:scale-[1.02] cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-neutral-300" />
            <span>WhatsApp Master Lapidary</span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default CustomizeJewellerySection;
