'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/* ========================================================================= */
/* PATRON / TESTIMONIAL PORTRAIT CARDS CONFIGURATION                         */
/* Images can be replaced anytime by swapping the URLs below.                */
/* ========================================================================= */
export interface PatronCard {
  id: string;
  name: string;
  role?: string;
  imageUrl: string;
  className?: string;
  tilt?: boolean;
}

const DEFAULT_PATRONS: PatronCard[] = [
  // Left Column 1
  {
    id: 'p1',
    name: 'Eleanor Vance',
    role: 'Private Collector • Melbourne',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'p2',
    name: 'Elena Rostova',
    role: 'Bespoke Heirloom Patron',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  },

  // Left Column 2
  {
    id: 'p3',
    name: 'Marcus Sterling',
    role: 'Royal Blue Connoisseur • Brisbane',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'p4',
    name: 'Julian Bennett',
    role: 'Bespoke Engagement Client',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
  },

  // Center-Left Column 3
  {
    id: 'p5',
    name: 'Alexander Wright',
    role: 'Rare Gemstone Patron',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'p6',
    name: 'Karan Sharma',
    role: 'Fine Jewellery Collector',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
  },

  // Center Column 4
  {
    id: 'p7',
    name: 'Jonathan Hastings',
    role: 'Sapphire Connoisseur • London',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
  },

  // Center-Right Column 5
  {
    id: 'p8',
    name: 'Sophia Laurent',
    role: 'Bespoke Atelier Client • Paris',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'p9',
    name: 'Claire Bennett',
    role: 'Padparadscha Patron • Sydney',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  },

  // Right Column 6
  {
    id: 'p10',
    name: 'Harrison Vance',
    role: 'Heirloom Collector • Perth',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'p11',
    name: 'Kevin Park',
    role: 'Custom Studio Patron • Singapore',
    imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    tilt: true,
  },

  // Far Right Column 7
  {
    id: 'p12',
    name: 'Amara Diop',
    role: 'Fine Gemstone Enthusiast',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'p13',
    name: 'Peter Sterling',
    role: 'Private Client • Adelaide',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
];

export function TrustedByPatronsSection() {
  return (
    <section className="relative w-full bg-white pt-16 sm:pt-24 pb-20 sm:pb-28 overflow-hidden select-none border-t border-neutral-100">
      {/* Background Vertical Guidelines (Subtle dotted / hairline lines like screenshot) */}
      <div className="absolute inset-0 pointer-events-none flex justify-around max-w-7xl mx-auto px-6 opacity-40">
        <div className="w-px h-full border-r border-dashed border-neutral-200" />
        <div className="w-px h-full border-r border-dashed border-neutral-200" />
        <div className="w-px h-full border-r border-dashed border-neutral-200" />
        <div className="w-px h-full border-r border-dashed border-neutral-200" />
        <div className="w-px h-full border-r border-dashed border-neutral-200" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* TOP: ARCH OF FLOATING PORTRAIT CARDS                      */}
        {/* Replicating the arched cloud composition from screenshot  */}
        {/* ========================================================= */}
        <div className="relative w-full min-h-[320px] sm:min-h-[380px] lg:min-h-[420px] mb-8 sm:mb-12">
          {/* Top Ghost / Faded Outline Boxes */}
          <div className="absolute -top-10 inset-x-0 flex justify-around pointer-events-none opacity-30">
            <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-neutral-100/70 border border-neutral-200/50" />
            <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-neutral-100/70 border border-neutral-200/50" />
            <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-neutral-100/70 border border-neutral-200/50" />
            <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-neutral-100/70 border border-neutral-200/50" />
            <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-neutral-100/70 border border-neutral-200/50" />
          </div>

          {/* Responsive Desktop Grid of Arched Cards */}
          <div className="hidden lg:grid grid-cols-7 gap-4 sm:gap-5 items-start">
            {/* Col 1: Far Left (hangs lower) */}
            <div className="space-y-4 pt-8">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-neutral-100 bg-neutral-50 hover:scale-105 transition-transform duration-300">
                <img
                  src={DEFAULT_PATRONS[0].imageUrl}
                  alt={DEFAULT_PATRONS[0].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-neutral-100 bg-neutral-50 hover:scale-105 transition-transform duration-300">
                <img
                  src={DEFAULT_PATRONS[1].imageUrl}
                  alt={DEFAULT_PATRONS[1].name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Col 2: Mid Left */}
            <div className="space-y-4 pt-2">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-neutral-100 bg-neutral-50 hover:scale-105 transition-transform duration-300">
                <img
                  src={DEFAULT_PATRONS[2].imageUrl}
                  alt={DEFAULT_PATRONS[2].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-neutral-100 bg-neutral-50 hover:scale-105 transition-transform duration-300">
                <img
                  src={DEFAULT_PATRONS[3].imageUrl}
                  alt={DEFAULT_PATRONS[3].name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Col 3: Inner Left (sits higher for arch opening) */}
            <div className="space-y-4 pt-0">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-neutral-100 bg-neutral-50 hover:scale-105 transition-transform duration-300">
                <img
                  src={DEFAULT_PATRONS[4].imageUrl}
                  alt={DEFAULT_PATRONS[4].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-neutral-100 bg-neutral-50 hover:scale-105 transition-transform duration-300">
                <img
                  src={DEFAULT_PATRONS[5].imageUrl}
                  alt={DEFAULT_PATRONS[5].name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Col 4: Top Center (single high card to leave arch space) */}
            <div className="space-y-4 -mt-2">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-neutral-100 bg-neutral-50 hover:scale-105 transition-transform duration-300">
                <img
                  src={DEFAULT_PATRONS[6].imageUrl}
                  alt={DEFAULT_PATRONS[6].name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Col 5: Inner Right (sits higher for arch opening) */}
            <div className="space-y-4 pt-0">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-neutral-100 bg-neutral-50 hover:scale-105 transition-transform duration-300">
                <img
                  src={DEFAULT_PATRONS[7].imageUrl}
                  alt={DEFAULT_PATRONS[7].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-neutral-100 bg-neutral-50 hover:scale-105 transition-transform duration-300">
                <img
                  src={DEFAULT_PATRONS[8].imageUrl}
                  alt={DEFAULT_PATRONS[8].name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Col 6: Mid Right (with iconic 3D tilted card on bottom) */}
            <div className="space-y-4 pt-2">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-neutral-100 bg-neutral-50 hover:scale-105 transition-transform duration-300">
                <img
                  src={DEFAULT_PATRONS[9].imageUrl}
                  alt={DEFAULT_PATRONS[9].name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* 3D Tilted Card matching reference screenshot */}
              <div
                className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 bg-neutral-50 transition-all duration-500 hover:rotate-0 hover:scale-105"
                style={{
                  transform: 'perspective(700px) rotateY(-18deg) rotateX(4deg) scale(1.02)',
                }}
              >
                <img
                  src={DEFAULT_PATRONS[10].imageUrl}
                  alt={DEFAULT_PATRONS[10].name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Col 7: Far Right (hangs lower) */}
            <div className="space-y-4 pt-8">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-neutral-100 bg-neutral-50 hover:scale-105 transition-transform duration-300">
                <img
                  src={DEFAULT_PATRONS[11].imageUrl}
                  alt={DEFAULT_PATRONS[11].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-neutral-100 bg-neutral-50 hover:scale-105 transition-transform duration-300">
                <img
                  src={DEFAULT_PATRONS[12].imageUrl}
                  alt={DEFAULT_PATRONS[12].name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Tablet & Mobile Layout: Horizontal scrolling cloud with soft fade */}
          <div className="lg:hidden flex gap-3.5 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory px-2">
            {DEFAULT_PATRONS.slice(0, 8).map((patron, i) => (
              <div
                key={patron.id}
                className={`w-32 sm:w-40 shrink-0 aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-neutral-100 snap-center ${
                  i % 2 === 1 ? 'translate-y-4' : '-translate-y-1'
                }`}
              >
                <img
                  src={patron.imageUrl}
                  alt={patron.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* CENTER CONTENT: Fine Jewellery Topic & Sentences         */}
        {/* Perfectly tailored to Ceylon Sapphires & Bespoke Milestones */}
        {/* ========================================================= */}
        <div className="text-center max-w-2xl mx-auto space-y-5 sm:space-y-6">
         

          {/* Two-Tone Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-neutral-900 leading-tight">
            Trusted by connoisseurs <br />
            <span className="text-neutral-400 font-normal">and collectors across the globe</span>
          </h2>

          {/* Description Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-neutral-600 font-light max-w-lg mx-auto leading-relaxed">
            From bespoke engagement heirlooms to rare unheated Ceylon sapphire acquisitions, learn why discerning clients worldwide choose Zeyloraa for life&apos;s most cherished milestones.
          </p>

          {/* Dark Pill CTA Button */}
          <div className="pt-2">
            <Link
              href="/story"
              className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-black text-white hover:bg-neutral-800 text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer"
            >
              <span>Explore Patron Stories</span>
              <ArrowRight className="w-4 h-4 stroke-[2]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
