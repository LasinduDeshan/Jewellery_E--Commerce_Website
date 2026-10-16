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
        <span className="text-neutral-500 text-xs font-semibold tracking-widest uppercase">
          Natural Ceylon Palette
        </span>
        <h2 className="text-3xl sm:text-4xl font-cormorant text-neutral-900 mt-2 font-normal">
          Available Sapphire Varieties
        </h2>
        <p className="mt-4 text-neutral-600 text-sm sm:text-base leading-relaxed font-light">
          Sri Lanka is world-renowned as the "Gem Island", producing unheated and naturally brilliant corundum in a breathtaking spectrum. Select your preferred color tone to incorporate it into your custom piece.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SAPPHIRE_VARIETIES.map((variety) => {
          const isSelected = selectedSapphire === variety.name;

          return (
            <div
              key={variety.id}
              className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 bg-white flex flex-col justify-between ${
                isSelected
                  ? 'border-black ring-2 ring-black/20 shadow-xl'
                  : 'border-neutral-200 hover:border-black hover:shadow-lg'
              }`}
            >
              {/* Image Container */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100">
                <img
                  src={variety.image}
                  alt={variety.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Rarity Tag */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur text-[10px] tracking-wider uppercase font-bold text-white">
                  {variety.badge}
                </div>

                {/* Color preview pill */}
                <div
                  className="absolute bottom-3 right-3 w-4 h-4 rounded-full border-2 border-white shadow-xs"
                  style={{ backgroundColor: variety.accentColor }}
                  title={variety.colorName}
                />
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-neutral-600" />
                      {variety.origin}
                    </span>
                    <span className="text-neutral-900 font-semibold">{variety.rarity}</span>
                  </div>

                  <h3 className="text-lg font-cormorant font-medium text-neutral-900 mt-1">
                    {variety.name}
                  </h3>
                  <p className="text-xs text-neutral-500 font-light mt-0.5 mb-2.5">
                    {variety.colorName}
                  </p>

                  <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed font-light">
                    {variety.description}
                  </p>
                </div>

                {/* Action button */}
                <div className="mt-5 pt-3 border-t border-neutral-100">
                  <button
                    onClick={() => onSelectSapphire(variety.name)}
                    className={`w-full py-2.5 px-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Selected for Design</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-neutral-600" />
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
