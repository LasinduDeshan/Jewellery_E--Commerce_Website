'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

/* ========================================================================= */
/* EDITORIAL IMAGE CONFIGURATION                                             */
/* Using your photos from frontend/src/assets/img                            */
/* ========================================================================= */
export interface EditorialGridImages {
  card1: {
    imageUrl: string;
    tag: string;
    title: string;
    alt: string;
    link?: string;
  };
  card2: {
    imageUrl: string;
    tag: string;
    title: string;
    alt: string;
    link?: string;
  };
  card3: {
    imageUrl: string;
    tag: string;
    title: string;
    alt: string;
    link?: string;
  };
  card4: {
    imageUrl: string;
    tag: string;
    title: string;
    alt: string;
    link?: string;
  };
}

const DEFAULT_IMAGES: EditorialGridImages = {
  // 1. Left Horizontal Card: High-fashion portrait with emerald statement cocktail ring
  card1: {
    imageUrl: '/img/091ce2cd7cf5cd013154c34765e13d6a.jpg',
    tag: '01/10',
    title: 'Emerald & Diamond Cocktail Ring Silhouette',
    alt: 'High fashion editorial with emerald cocktail ring',
    link: '/shop?category=rings',
  },
  // 2. Large Top Right Portrait: Model wearing oval solitaire ring
  card2: {
    imageUrl: '/img/b221341820a97e869b43a89b4d8d1fb3.jpg',
    tag: '02/10',
    title: 'Oval Solitaire Atelier Ring',
    alt: 'Oval diamond solitaire ring on hand',
    link: '/shop',
  },
  // 3. Tall Bottom Center Portrait: Gold halo ring on daisy flower stem
  card3: {
    imageUrl: '/img/33ce808ba9ab3cb5c6b23d6f225e8bd2.jpg',
    tag: '03/10',
    title: 'Botanical Daisy Diamond Halo Ring',
    alt: 'Diamond halo ring on white daisy stem',
    link: '/customize',
  },
  // 4. Bottom Right Offset Card: Lotus gemstone stud mirror reflection
  card4: {
    imageUrl: '/img/795fa7da96494fb22b218334f37b83d8.jpg',
    tag: '04/10',
    title: 'Lotus Petal Gemstone Stud Earring',
    alt: 'Lotus flower gemstone earring mirror reflection',
    link: '/shop?category=earrings',
  },
};

interface EditorialGridProps {
  title?: string;
  galleryLinkText?: string;
  galleryHref?: string;
  captionLines?: string[];
  images?: Partial<EditorialGridImages>;
}

export const EditorialGrid: React.FC<EditorialGridProps> = ({
  title = 'Fashion',
  galleryLinkText = 'View Gallery',
  galleryHref = '/shop',
  captionLines = [
    'Zeyloraa Fine Jewellery Editorial',
    'Rare, unheated sapphires from the historic valleys of Ceylon.',
    'Handcrafted in solid gold and 925 sterling silver.',
    'Timeless heirlooms sculpted for modern grace.',
  ],
  images = {},
}) => {
  const mergedImages: EditorialGridImages = {
    card1: { ...DEFAULT_IMAGES.card1, ...(images.card1 || {}) },
    card2: { ...DEFAULT_IMAGES.card2, ...(images.card2 || {}) },
    card3: { ...DEFAULT_IMAGES.card3, ...(images.card3 || {}) },
    card4: { ...DEFAULT_IMAGES.card4, ...(images.card4 || {}) },
  };

  return (
    <section className="bg-white py-20 sm:py-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full overflow-hidden select-none">
      {/* 2-Column Asymmetrical Editorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* ========================================================== */}
        {/* LEFT COLUMN: Heading + Horizontal Card + Micro-caption     */}
        {/* ========================================================== */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-12 lg:space-y-20">
          
          {/* Top Left Title Block */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold ] text-black">
              {title}
            </h2>
            <div className="w-20 h-[2px] bg-black" />
            <Link
              href={galleryHref}
              className="inline-flex items-center gap-1.5 text-[10px] font-mono ] text-neutral-500 hover:text-black transition-colors pt-1 group"
            >
              <span>{galleryLinkText}</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Left Middle: Horizontal Card 1 */}
          <div className="relative group overflow-hidden bg-neutral-100 shadow-sm border border-neutral-200/80">
            <Link href={mergedImages.card1.link || '/shop'} className="block overflow-hidden">
              <img
                src={mergedImages.card1.imageUrl}
                alt={mergedImages.card1.alt}
                className="w-full aspect-[4/3] sm:aspect-[16/11] object-cover group-hover:scale-105 transition-all duration-700"
              />
            </Link>

            {/* Subtle Vertical Rotated Tag */}
            <div className="absolute top-4 right-3 pointer-events-none select-none">
              <span className="text-[9px] font-mono ] text-white/90 drop-shadow [writing-mode:vertical-rl] rotate-180">
                {mergedImages.card1.tag}
              </span>
            </div>
          </div>

          {/* Bottom Left: Editorial Micro-Copy Paragraph */}
          <div className="pt-4 lg:pt-14 max-w-sm space-y-1.5">
            {captionLines.map((line, idx) => (
              <p
                key={idx}
                className={
                  idx === 0
                    ? 'text-xs font-semibold text-neutral-900  font-sans'
                    : 'text-xs text-neutral-600 leading-relaxed font-light font-sans '
                }
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* ========================================================== */}
        {/* RIGHT COLUMN: Large Top Portrait + 2 Bottom Images         */}
        {/* ========================================================== */}
        <div className="lg:col-span-7 flex flex-col space-y-8 lg:space-y-12">
          
          {/* Top Right: Large Portrait Card 2 */}
          <div className="relative group overflow-hidden bg-neutral-100 shadow-sm border border-neutral-200/80">
            <Link href={mergedImages.card2.link || '/shop'} className="block overflow-hidden">
              <img
                src={mergedImages.card2.imageUrl}
                alt={mergedImages.card2.alt}
                className="w-full aspect-[4/3] sm:aspect-[16/12] object-cover object-center group-hover:scale-105 transition-all duration-700"
              />
            </Link>

            {/* Subtle Vertical Rotated Tag */}
            <div className="absolute top-4 right-3 pointer-events-none select-none">
              <span className="text-[9px] font-mono ] text-neutral-800 drop-shadow-sm [writing-mode:vertical-rl] rotate-180">
                {mergedImages.card2.tag}
              </span>
            </div>
          </div>

          {/* Bottom Right Row: 2 Images (Tall Center Portrait + Offset Card) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Bottom Center: Tall Portrait Card 3 */}
            <div className="sm:col-span-7 relative group overflow-hidden bg-neutral-100 shadow-sm border border-neutral-200/80">
              <Link href={mergedImages.card3.link || '/customize'} className="block overflow-hidden">
                <img
                  src={mergedImages.card3.imageUrl}
                  alt={mergedImages.card3.alt}
                  className="w-full aspect-[3/4] sm:aspect-[2/3] object-cover group-hover:scale-105 transition-all duration-700"
                />
              </Link>

              {/* Vertical Rotated Tag */}
              <div className="absolute top-4 right-3 pointer-events-none select-none">
                <span className="text-[9px] font-mono ] text-neutral-700 drop-shadow-sm [writing-mode:vertical-rl] rotate-180">
                  {mergedImages.card3.tag}
                </span>
              </div>
            </div>

            {/* Bottom Right: Offset Card 4 with Geometric Curved Accent */}
            <div className="sm:col-span-5 relative group overflow-hidden bg-neutral-100 shadow-sm border border-neutral-200/80 self-start">
              <Link href={mergedImages.card4.link || '/shop'} className="block overflow-hidden relative">
                <img
                  src={mergedImages.card4.imageUrl}
                  alt={mergedImages.card4.alt}
                  className="w-full aspect-[4/4] sm:aspect-[4/5] object-cover group-hover:scale-105 transition-all duration-700"
                />

                {/* Decorative Geometric Curved Overlay on the Right (matching reference screenshot) */}
                <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-16 h-32 bg-white/20 backdrop-blur-xs rounded-l-full pointer-events-none border-l border-white/40" />
              </Link>

              {/* Vertical Rotated Tag */}
              <div className="absolute top-4 right-3 pointer-events-none select-none z-10">
                <span className="text-[9px] font-mono ] text-white/90 drop-shadow [writing-mode:vertical-rl] rotate-180">
                  {mergedImages.card4.tag}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
