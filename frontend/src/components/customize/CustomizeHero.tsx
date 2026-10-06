'use client';

import React from 'react';
import { Sparkles, MessageCircle, ShieldCheck, Clock } from 'lucide-react';

interface CustomizeHeroProps {
  onStartCustomizing: () => void;
  onOpenWhatsApp: () => void;
}

export const CustomizeHero: React.FC<CustomizeHeroProps> = ({
  onStartCustomizing,
  onOpenWhatsApp,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#121212] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0f2862]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-800/80 border border-amber-500/30 text-amber-300 text-xs tracking-widest uppercase mb-6 backdrop-blur">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Bespoke Ceylon Sapphire Studio</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-stone-100 max-w-4xl mx-auto leading-tight sm:leading-tight">
          Craft Your One-of-a-Kind <br />
          <span className="gold-gradient-text font-normal">Ceylon Sapphire</span> Masterpiece
        </h1>

        <p className="mt-6 text-base sm:text-lg text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
          Because no two Ceylon sapphires are identical, each bespoke creation begins with a collaborative consultation. Choose your stone, cut, and precious metal — our master gemologists will curate a custom quote tailored to your exact vision.
        </p>

        {/* Feature Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Detailed Quote within 24–48h</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>100% Certified Ethical Ceylon Origin</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-amber-400" />
            <span>1-on-1 WhatsApp Concierge</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartCustomizing}
            className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium tracking-wider uppercase text-sm transition-all duration-300 shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 cursor-pointer font-semibold"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Your Design</span>
          </button>

          <button
            onClick={onOpenWhatsApp}
            className="w-full sm:w-auto px-7 py-3.5 rounded-md bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 font-medium tracking-wider uppercase text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Chat Directly on WhatsApp</span>
          </button>
        </div>
      </div>
    </section>
  );
};
