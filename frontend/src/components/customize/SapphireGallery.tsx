'use client';

import React, { useState } from 'react';
import { SAPPHIRE_VARIETIES, SapphireVariety } from '../../data/customizationData';
import { Check, Sparkles, MapPin, Eye } from 'lucide-react';

interface SapphireGalleryProps {
  selectedSapphire: string;
  onSelectSapphire: (sapphireName: string) => void;
}

export const SapphireGallery: React.FC<SapphireGalleryProps> = ({
  selectedSapphire,
  onSelectSapphire,
}) => {
  const [activeModalGem, setActiveModalGem] = useState<SapphireVariety | null>(null);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-amber-700 text-xs font-semibold tracking-widest uppercase">
          Natural Ceylon Palette
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-2 font-normal">
          Available Sapphire Varieties
        </h2>
        <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
          Sri Lanka is world-renowned as the "Gem Island", producing unheated and naturally brilliant corundum in a breathtaking spectrum. Select your preferred color tone to incorporate it into your custom piece.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SAPPHIRE_VARIETIES.map((variety) => {
          const isSelected = selectedSapphire === variety.name;

          return (
            <div
              key={variety.id}
              className={`group relative rounded-xl overflow-hidden border transition-all duration-300 bg-white flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-600 ring-2 ring-amber-500/30 shadow-xl'
                  : 'border-stone-200 hover:border-amber-400 hover:shadow-lg'
              }`}
            >
              {/* Image Container */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                <img
                  src={variety.image}
                  alt={variety.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Rarity Tag */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur text-[10px] tracking-wider uppercase font-medium text-amber-300">
                  {variety.badge}
                </div>

                {/* Color preview pill */}
                <div
                  className="absolute bottom-3 right-3 w-4 h-4 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: variety.accentColor }}
                  title={variety.colorName}
                />
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      {variety.origin}
                    </span>
                    <span className="text-amber-700 font-semibold">{variety.rarity}</span>
                  </div>

                  <h3 className="text-base font-medium text-stone-900 mt-1 font-serif">
                    {variety.name}
                  </h3>
                  <p className="text-xs text-stone-500 font-light mt-0.5 mb-2.5">
                    {variety.colorName}
                  </p>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {variety.description}
                  </p>
                </div>

                {/* Action button */}
                <div className="mt-5 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => onSelectSapphire(variety.name)}
                    className={`w-full py-2.5 px-3 rounded-md text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Selected for Design</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Select This Sapphire</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
