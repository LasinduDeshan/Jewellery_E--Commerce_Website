'use client';

import React, { useState } from 'react';
import { BIRTHSTONE_GUIDE, BirthstoneMonth } from '../../data/customizationData';
import { Info, Sparkles, ArrowRight, Calendar, Gem, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BirthstoneGuideProps {
  onSelectBirthstoneSapphire: (sapphireType: string) => void;
}

export const BirthstoneGuide: React.FC<BirthstoneGuideProps> = ({
  onSelectBirthstoneSapphire,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('September');

  const activeMonthData: BirthstoneMonth =
    BIRTHSTONE_GUIDE.find((b) => b.month === selectedMonth) || BIRTHSTONE_GUIDE[8];

  // Distribute 12 months into 3 vertical columns (4 per column)
  const col1 = [BIRTHSTONE_GUIDE[0], BIRTHSTONE_GUIDE[3], BIRTHSTONE_GUIDE[6], BIRTHSTONE_GUIDE[9]];
  const col2 = [BIRTHSTONE_GUIDE[1], BIRTHSTONE_GUIDE[4], BIRTHSTONE_GUIDE[7], BIRTHSTONE_GUIDE[10]];
  const col3 = [BIRTHSTONE_GUIDE[2], BIRTHSTONE_GUIDE[5], BIRTHSTONE_GUIDE[8], BIRTHSTONE_GUIDE[11]];

  // Double items for seamless infinite vertical marquee animation
  const col1Infinite = [...col1, ...col1];
  const col2Infinite = [...col2, ...col2];
  const col3Infinite = [...col3, ...col3];

  const renderCard = (item: BirthstoneMonth, keyPrefix: string) => {
    const isSelected = selectedMonth === item.month;
    const isSept = item.month === 'September';

    return (
      <div
        key={`${keyPrefix}-${item.month}`}
        onClick={() => setSelectedMonth(item.month)}
        className={`group relative w-full aspect-[4/5]  overflow-hidden cursor-pointer transition-all duration-300  select-none `}
      >
        {/* Sapphire Image */}
        <img
          src={item.image}
          alt={item.recommendedSapphire}
          loading="lazy"
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

        {/* Top Month Tag */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md  text-[11px] font-medium text-white shadow-sm">
          
          <span>{item.month}</span>
          
        </div>

       

        {/* Bottom Small Description */}
        <div className="absolute bottom-3 left-3 right-3 text-left">
          <p className="text-xs sm:text-sm font-cormorant text-white font-medium leading-tight truncate">
            {item.recommendedSapphire}
          </p>
          <p className="text-[11px] text-neutral-300 font-light truncate mt-0.5">
            {item.symbolism}
          </p>
        </div>
      </div>
    );
  };

  return (
    <section
      id="birthstone-guide-section"
      className="w-full bg-black text-white py-16 sm:py-24 relative overflow-hidden rounded-t-[40px] sm:rounded-t-[56px] lg:rounded-t-[72px] shadow-[0_-20px_50px_rgba(0,0,0,0.15)]"
    >
     

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[640px] lg:h-[720px]">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Editorial Brand Title, Story, and Active Birthstone Detail  */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full py-2">
            <div>
            

              {/* High-Fashion Editorial Typography (like reference image) */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-cormorant text-white font-normal tracking-tight leading-[1.05]">
                A Year of Sapphire Elegance
              </h2>

              <p className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed font-light">
                Every gemstone tells a story, and every colour holds a special meaning. Explore our collection of sapphire inspirations, thoughtfully curated to celebrate life's precious moments and the beauty of personal expression.
              </p>

             
            </div>

            {/* Active Selected Month Spotlight Box */}
            <motion.div
              key={activeMonthData.month}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-8 p-5 sm:p-6 rounded-2xl bg-neutral-900/90  backdrop-blur-md relative overflow-hidden"
            >
              <div className="flex gap-4 items-center mb-3">
               
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    
                    <span className="text-xs  text-neutral-400 ">
                      {activeMonthData.month} Edition
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl text-white font-medium truncate">
                    {activeMonthData.recommendedSapphire}
                  </h3>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-300 font-light">
                <p>
                  <strong className="text-white font-medium">Symbolic Meaning: </strong>
                  <span>{activeMonthData.symbolism}</span>
                </p>
                <p className="text-neutral-400 text-xs italic">
                  {activeMonthData.stylingNote}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-neutral-400">Natural Ceylon Corundum</span>

                <button
                  onClick={() => onSelectBirthstoneSapphire(activeMonthData.recommendedSapphire)}
                  className="py-2 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 shrink-0"
                >
                  <span>Apply to My Design</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
              </div>
            </motion.div>

          
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: 3 Columns with Auto Animation Bottom to Top (Marquee Wall)  */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 h-[580px] sm:h-[660px] lg:h-full relative overflow-hidden rounded-3xl bg-neutral-950/80  p-3 sm:p-5">
            {/* Top Fade Gradient */}
            <div className="absolute inset-x-0 top-0 h-20 sm:h-28 bg-gradient-to-b from-black via-black/80 to-transparent z-20 pointer-events-none" />

            {/* Bottom Fade Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />

            {/* 3 Vertical Columns Track */}
            <div className="grid grid-cols-3 gap-3 sm:gap-5 h-full overflow-hidden">
              
              {/* Column 1 (Scrolls bottom to top: 32s) */}
              <div className="marquee-col-1 flex flex-col gap-3 sm:gap-5 hover:[animation-play-state:paused]">
                {col1Infinite.map((item, idx) => renderCard(item, `col1-${idx}`))}
              </div>

              {/* Column 2 (Scrolls bottom to top slightly offset: 38s) */}
              <div className="marquee-col-2 flex flex-col gap-3 sm:gap-5 hover:[animation-play-state:paused]">
                {col2Infinite.map((item, idx) => renderCard(item, `col2-${idx}`))}
              </div>

              {/* Column 3 (Scrolls bottom to top: 34s) */}
              <div className="marquee-col-3 flex flex-col gap-3 sm:gap-5 hover:[animation-play-state:paused]">
                {col3Infinite.map((item, idx) => renderCard(item, `col3-${idx}`))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Embedded CSS for smooth infinite 60fps vertical marquee animations */}
      <style jsx>{`
        @keyframes scrollUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        .marquee-col-1 {
          animation: scrollUp 32s linear infinite;
          will-change: transform;
        }

        .marquee-col-2 {
          animation: scrollUp 40s linear infinite;
          will-change: transform;
        }

        .marquee-col-3 {
          animation: scrollUp 35s linear infinite;
          will-change: transform;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default BirthstoneGuide;
