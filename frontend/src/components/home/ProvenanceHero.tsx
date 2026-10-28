'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Gem,
  ArrowRight,
  ArrowDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const VIDEOS = [
  {
    id: 'video-1',
    src: '/videos/1024.mp4',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=85',
    tag: 'Haute Joaillerie',
    headline: 'Imperial Ceylon Corundum',
    description: 'Ethically hand-mined from the alluvial riverbeds of Ratnapura, crafted into luminous bespoke heirlooms.',
    leftLabel: 'Gemstone Provenance',
    leftText: 'Direct from hereditary gem pits in Sri Lanka with certified origin traceability.',
    rightLabel: 'Artisanal Atelier',
    rightText: 'Handcrafted by master goldsmiths in solid 925 sterling silver and 18K gold.'
  },
  {
    id: 'video-2',
    src: '/videos/1024.mp4',
    poster: 'https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&w=2000&q=85',
    tag: 'Generational Guild',
    headline: 'Hereditary Lapidary Artistry',
    description: 'Master artisans hand-cutting each optical facet to maximize internal brilliance and fire in precious metals.',
    leftLabel: 'Optical Precision',
    leftText: 'Facets cut along the optical c-axis to unlock intense sapphire fire and depth.',
    rightLabel: 'Bespoke Commissions',
    rightText: 'Custom 3D CAD modeling and private consultations for unique heirloom rings.'
  },
  {
    id: 'video-3',
    src: '/videos/1024.mp4',
    poster: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2000&q=85',
    tag: 'Fair Luxury',
    headline: 'Certified Earth to Heirloom',
    description: 'Official NGJA government certified fine jewellery delivered directly from Sri Lankan ateliers with lifelong provenance.',
    leftLabel: 'Ethical Sourcing',
    leftText: 'Artisanal low-impact mining directly empowering local Sri Lankan gem mining families.',
    rightLabel: 'Government Certified',
    rightText: 'Official NGJA identification certificate included with every precious Ceylon piece.'
  },
];

const AUTO_PLAY_DURATION = 8000; // 8 seconds per video

export function ProvenanceHero() {
  const [activeIdx, setActiveIdx] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const currentVideo = VIDEOS[activeIdx];

  // Auto-advance video slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((curr) => (curr + 1) % VIDEOS.length);
    }, AUTO_PLAY_DURATION);

    return () => clearInterval(timer);
  }, [activeIdx]);

  // Sync video play states
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === activeIdx) {
        vid.currentTime = 0;
        vid.play().catch(() => { });
      } else {
        vid.pause();
      }
    });
  }, [activeIdx]);

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % VIDEOS.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + VIDEOS.length) % VIDEOS.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Touch Swipe for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartXRef.current = null;
  };

  const scrollToShop = () => {
    const element = document.getElementById('featured-collection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: 750, behavior: 'smooth' });
    }
  };

  return (
    <section
      aria-label="Jewellery Showcase"
      className="relative w-full h-[88vh] sm:h-screen min-h-[580px] bg-black text-white overflow-hidden flex flex-col justify-end select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Videos with Cross-fade */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {VIDEOS.map((item, idx) => {
          const isActive = idx === activeIdx;
          return (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
              <video
                ref={(el) => {
                  videoRefs.current[idx] = el;
                }}
                src={item.src}
                autoPlay={isActive}
                muted
                loop
                playsInline
                preload="auto"
                poster={item.poster}
                className="w-full h-full object-cover brightness-[0.92] contrast-[1.05]"
              />
            </div>
          );
        })}

        {/* Luxury Vignette & Left-Side Shadow for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent pointer-events-none" />
        {/* Seamless bottom fade into next section */}
        <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />
      </div>



      {/* Bottom Area: Left Description, Middle Description & Action Buttons, Right Description */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 pb-10 sm:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-end gap-6 lg:gap-8">
          
          {/* Left Small Description */}
          <div className="hidden lg:flex flex-col items-start text-left max-w-[260px] pb-1 space-y-1">
            <span className="text-[11px] font-medium text-neutral-400">
              {currentVideo.leftLabel}
            </span>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              {currentVideo.leftText}
            </p>
          </div>

          {/* Middle: Description & 3 Action Buttons */}
          <div className="flex flex-col items-center text-center max-w-xl mx-auto space-y-5">
            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-lg">
              {currentVideo.description}
            </p>

            {/* 3 Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {/* Button 1: Explore Collection */}
              <button
                onClick={scrollToShop}
                className="px-7 py-3.5 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all duration-300 shadow-2xl shadow-black/80 flex items-center gap-2 cursor-pointer group hover:scale-[1.02]"
              >
                <span>Explore Collection</span>
                <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
              </button>

              {/* Button 2: Design Bespoke Piece */}
              <Link
                href="/customize"
                className="px-7 py-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/30 hover:border-white/60 font-semibold text-xs transition-all backdrop-blur-md flex items-center gap-2 shadow-2xl hover:scale-[1.02]"
              >
                <span>Design Bespoke Piece</span>
              </Link>

             
            </div>
          </div>

          {/* Right Small Description */}
          <div className="hidden lg:flex flex-col items-end text-right max-w-[260px] ml-auto pb-1 space-y-1">
            <span className="text-[11px] font-medium text-neutral-400">
              {currentVideo.rightLabel}
            </span>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              {currentVideo.rightText}
            </p>
          </div>

        </div>

        {/* Mobile / Tablet View: Left & Right Notes in Subtle 2-Column Row Below Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10 w-full max-w-md mx-auto mt-6 lg:hidden">
          <div className="text-left space-y-0.5">
            <span className="text-[10px] font-medium text-neutral-400 block">
              {currentVideo.leftLabel}
            </span>
            <p className="text-[11px] text-neutral-300 font-light leading-snug">
              {currentVideo.leftText}
            </p>
          </div>
          <div className="text-right space-y-0.5">
            <span className="text-[10px] font-medium text-neutral-400 block">
              {currentVideo.rightLabel}
            </span>
            <p className="text-[11px] text-neutral-300 font-light leading-snug">
              {currentVideo.rightText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
