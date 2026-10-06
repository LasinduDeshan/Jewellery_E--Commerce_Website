'use client';

import React, { useState } from 'react';
import { BIRTHSTONE_GUIDE } from '../../data/customizationData';
import { Calendar, Info, Sparkles, Check } from 'lucide-react';

interface BirthstoneGuideProps {
  onSelectBirthstoneSapphire: (sapphireType: string) => void;
}

export const BirthstoneGuide: React.FC<BirthstoneGuideProps> = ({
  onSelectBirthstoneSapphire,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('September');

  const activeMonthData =
    BIRTHSTONE_GUIDE.find((b) => b.month === selectedMonth) || BIRTHSTONE_GUIDE[8];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-amber-700 text-xs font-semibold tracking-widest uppercase">
          Curated Gifting & Meaning
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 mt-2 font-normal">
          Sapphire Birthstone Styling Guide
        </h2>
        <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
          While September is the world’s traditional official sapphire month, the extraordinary natural rainbow of Ceylon corundum allows us to curate stunning bespoke sapphire recommendations for every month of the year.
        </p>

        {/* Framing Disclaimer Banner */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs text-left">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Note:</strong> Blue Sapphire is the traditional September birthstone. Other months represent our master jewellers&apos; exclusive sapphire styling suggestions for milestone gifting.
          </span>
        </div>
      </div>

      {/* Month Selector Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2 mb-10 max-w-4xl mx-auto">
        {BIRTHSTONE_GUIDE.map((item) => {
          const isActive = item.month === selectedMonth;
          const isSept = item.month === 'September';

          return (
            <button
              key={item.month}
              onClick={() => setSelectedMonth(item.month)}
              className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.stoneColor }}
              />
              <span>{item.month}</span>
              {isSept && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500 text-stone-950 font-bold">
                  ★
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Featured Month Detail Card */}
      <div className="max-w-4xl mx-auto bg-stone-900 text-white rounded-2xl p-8 sm:p-10 border border-stone-800 shadow-2xl relative overflow-hidden">
        <div
          className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: activeMonthData.stoneColor }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs tracking-widest uppercase font-semibold">
              <Calendar className="w-4 h-4" />
              <span>{activeMonthData.month} Edition</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif text-stone-100 mt-2">
              {activeMonthData.recommendedSapphire}
            </h3>

            <div className="mt-4 space-y-3 text-sm text-stone-300">
              <p>
                <strong className="text-amber-300 font-normal">Symbolic Meaning: </strong>
                {activeMonthData.symbolism}
              </p>
              <p className="text-stone-400 text-xs italic">
                {activeMonthData.stylingNote}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-stone-800/80 border border-stone-700 text-center">
            <div
              className="w-16 h-16 rounded-full shadow-lg border-2 border-white/20 mb-4 flex items-center justify-center"
              style={{ backgroundColor: activeMonthData.stoneColor }}
            >
              <Sparkles className="w-6 h-6 text-white/90" />
            </div>

            <button
              onClick={() => onSelectBirthstoneSapphire(activeMonthData.recommendedSapphire)}
              className="w-full py-2.5 px-4 rounded-md bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply to My Design</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
