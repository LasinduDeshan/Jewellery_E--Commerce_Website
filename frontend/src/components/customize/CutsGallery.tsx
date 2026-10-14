'use client';

import React from 'react';
import { SAPPHIRE_CUTS } from '../../data/customizationData';
import { Check, Sparkles, Gem } from 'lucide-react';

interface CutsGalleryProps {
  selectedCut: string;
  onSelectCut: (cutName: string) => void;
}

export const CutsGallery: React.FC<CutsGalleryProps> = ({ selectedCut, onSelectCut }) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-100/70 border-y border-stone-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-neutral-500 text-xs font-semibold tracking-widest uppercase">
            Artisanal Precision Faceting
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-neutral-900 mt-2 font-normal">
            Sapphire Cuts & Optical Profiles
          </h2>
          <p className="mt-4 text-neutral-600 text-sm sm:text-base leading-relaxed">
            The faceting style transforms raw crystalline corundum into a captivating play of light. Learn how different cuts impact finger coverage, optical brilliance, and color depth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAPPHIRE_CUTS.map((cut) => {
            const isSelected = selectedCut === cut.name;

            return (
              <div
                key={cut.id}
                className={`group rounded-xl p-6 transition-all duration-300 bg-white border flex flex-col justify-between ${
                  isSelected
                    ? 'border-black ring-2 ring-black/20 shadow-lg'
                    : 'border-neutral-200 hover:border-neutral-400 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-900">
                      <Gem className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
                      {cut.ratio}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif font-medium text-neutral-900">
                    {cut.name}
                  </h3>

                  <div className="mt-1 mb-3 inline-block text-xs font-medium text-neutral-800 bg-neutral-100 px-2.5 py-0.5 rounded">
                    ✨ {cut.sparkleProfile}
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {cut.description}
                  </p>

                  <div className="mt-4 text-[11px] text-neutral-500">
                    <span className="font-semibold text-neutral-800">Best Suited For: </span>
                    {cut.bestSuitedFor}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100">
                  <button
                    onClick={() => onSelectCut(cut.name)}
                    className={`w-full py-2 px-3 rounded-md text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-black text-white shadow-sm'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Cut Selected</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-neutral-600" />
                        <span>Choose {cut.name}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
