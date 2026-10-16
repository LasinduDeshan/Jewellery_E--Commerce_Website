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
    <section className="relative overflow-hidden bg-black text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs tracking-widest uppercase mb-6 backdrop-blur">
          <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
          <span>Bespoke Ceylon Sapphire Studio</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-cormorant tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight font-normal">
          Craft Your One-of-a-Kind <br />
          <span className="font-light italic text-neutral-300">Ceylon Sapphire</span> Masterpiece
        </h1>

        <p className="mt-6 text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
          Because no two Ceylon sapphires are identical, each bespoke creation begins with a collaborative consultation. Choose your stone, cut, and precious metal — our master gemologists will curate a custom quote tailored to your exact vision.
        </p>

        {/* Feature Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white" />
            <span>Detailed Quote within 24–48h</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>100% Certified Ethical Ceylon Origin</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-white" />
            <span>1-on-1 WhatsApp Concierge</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartCustomizing}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-neutral-200 text-black font-bold tracking-widest uppercase text-xs transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Start Your Design</span>
          </button>

          <button
            onClick={onOpenWhatsApp}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 font-bold tracking-widest uppercase text-xs transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-neutral-300" />
            <span>Chat Directly on WhatsApp</span>
          </button>
        </div>
      </div>
    </section>
  );
};
