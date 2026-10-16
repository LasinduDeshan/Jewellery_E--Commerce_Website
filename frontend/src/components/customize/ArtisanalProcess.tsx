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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-950 text-white border-t border-neutral-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-neutral-400 text-xs font-semibold tracking-widest uppercase">
            Ceylon Heritage & Craftsmanship
          </span>
          <h2 className="text-3xl sm:text-4xl font-cormorant text-white mt-2 font-normal">
            How Your Bespoke Jewellery is Born
          </h2>
          <p className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed font-light">
            From the historic gem-rich gravels of Ratnapura to our master setting bench, every piece follows an unbroken lineage of Sri Lankan artisanal perfection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ARTISANAL_PROCESS_STEPS.map((step) => {
            return (
              <div
                key={step.stepNumber}
                className="relative rounded-2xl bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between hover:border-neutral-500 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-cormorant text-4xl font-bold text-white/20">
                      {step.stepNumber}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center">
                      {iconMap[step.iconName] || <Sparkles className="w-5 h-5" />}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-medium mb-1">
                    <MapPin className="w-3 h-3 text-neutral-500" />
                    <span>{step.location}</span>
                  </div>

                  <h3 className="text-xl font-cormorant font-medium text-white mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-neutral-400 leading-relaxed font-light">
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
