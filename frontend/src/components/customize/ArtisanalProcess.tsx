'use client';

import React from 'react';
import { ARTISANAL_PROCESS_STEPS } from '../../data/customizationData';
import { Pickaxe, Sparkles, Compass, Hammer, Award, ShieldCheck, MapPin } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Pickaxe: <Pickaxe className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Hammer: <Hammer className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
};

export const ArtisanalProcess: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-900 text-stone-100 border-t border-stone-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">
            Ceylon Heritage & Craftsmanship
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-white mt-2 font-normal">
            How Your Bespoke Jewellery is Born
          </h2>
          <p className="mt-4 text-stone-400 text-sm sm:text-base leading-relaxed">
            From the historic gem-rich gravels of Ratnapura to our master setting bench, every piece follows an unbroken lineage of Sri Lankan artisanal perfection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ARTISANAL_PROCESS_STEPS.map((step) => {
            return (
              <div
                key={step.stepNumber}
                className="relative rounded-xl bg-stone-800/60 border border-stone-700/80 p-6 flex flex-col justify-between hover:border-amber-500/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-3xl font-bold text-amber-500/40">
                      {step.stepNumber}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                      {iconMap[step.iconName] || <Sparkles className="w-5 h-5" />}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-medium mb-1">
                    <MapPin className="w-3 h-3" />
                    <span>{step.location}</span>
                  </div>

                  <h3 className="text-lg font-serif text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-stone-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
