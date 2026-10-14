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
    src: '/videos/gemini_generated_video_4935ac88.mp4',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=85',
    tag: 'Haute Joaillerie',
    headline: 'Imperial Ceylon Corundum',
    description: 'Ethically hand-mined from the alluvial riverbeds of Ratnapura, crafted into luminous bespoke heirlooms.'
  },
  {
    id: 'video-2',
    src: '/videos/gemini_generated_video_608aefbd.mp4',
    poster: 'https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&w=2000&q=85',
    tag: 'Generational Guild',
    headline: 'Hereditary Lapidary Artistry',
    description: 'Master artisans hand-cutting each optical facet to maximize internal brilliance and fire in precious metals.'
  },
  {
    id: 'video-3',
    src: '/videos/gemini_generated_video_9db144c2.mp4',
    poster: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2000&q=85',
    tag: 'Fair Luxury',
    headline: 'Certified Earth to Heirloom',
    description: 'Official NGJA government certified fine jewellery delivered directly from Sri Lankan ateliers with lifelong provenance.'
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
        vid.play().catch(() => {});
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
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
                className="w-full h-full object-cover object-center brightness-[0.92] contrast-[1.05]"
              />
            </div>
          );
        })}

        {/* Luxury Vignette & Left-Side Shadow for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent pointer-events-none" />
      </div>

   

      {/* Left-Aligned Small Description & 3 Action Buttons */}
      <div className="relative z-20 max-w-6xl mx-auto w-full px-4 sm:px-8 pb-12 sm:pb-16 flex flex-col items-start text-left">
        {/* Small Elegant Description on Left Side */}
        <div className="max-w-xl mb-6 space-y-2">
          
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-normal font-cormorant tracking-normal text-white leading-[1.08]">
            {currentVideo.headline}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-lg">
            {currentVideo.description}
          </p>
        </div>

        {/* 3 Buttons */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Button 1: Explore Collection */}
          <button
            onClick={scrollToShop}
            className="px-7 py-3.5 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs tracking-widest uppercase transition-all duration-300 shadow-2xl shadow-black/80 flex items-center gap-2 cursor-pointer group hover:scale-[1.02]"
          >
            <Gem className="w-4 h-4 text-black" />
            <span>Explore Collection</span>
            <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* Button 2: Design Bespoke Piece */}
          <Link
            href="/customize"
            className="px-7 py-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/30 hover:border-white/60 font-semibold text-xs tracking-widest uppercase transition-all backdrop-blur-md flex items-center gap-2 shadow-2xl hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Design Bespoke Piece</span>
          </Link>

          {/* Button 3: Our Sourcing Story */}
          <Link
            href="/story"
            className="px-6 py-3.5 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/20 hover:border-white/40 text-xs font-semibold tracking-widest uppercase transition-all backdrop-blur-md flex items-center gap-2 group shadow-2xl hover:scale-[1.02]"
          >
            <span>Our Sourcing Story</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Minimal Video Indicators */}
        <div className="flex items-center gap-2 mt-6">
          {VIDEOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              aria-label={`Switch to video ${i + 1}`}
              className={`h-1 transition-all rounded-full cursor-pointer ${
                i === activeIdx ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
