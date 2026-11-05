'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Pause, Volume2, VolumeX, ArrowRight, Sparkles, Gem } from 'lucide-react';
import { motion } from 'framer-motion';

export const HomeVideoShowcase: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      video.muted = true;
      setIsMuted(true);
      video.play().catch(() => {});
    });
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section
      aria-label="Atelier Craftsmanship Video Showcase"
      className="w-full bg-black relative overflow-hidden"
    >
      {/* Edge-to-Edge 4K UHD Video Container */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] min-h-[420px] sm:min-h-[520px] lg:min-h-[640px] overflow-hidden group">
        <video
          ref={videoRef}
          src="/videos/6263749-uhd_3840_2160_25fps.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          className="w-full h-full object-cover object-center scale-[1.01] transition-transform duration-1000 group-hover:scale-105"
        />

        {/* Ambient Luxury Dark Overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/40" />
        <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-black/20 to-black/60" />

        {/* Top & Bottom Soft Blend into Surrounding White Sections */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 sm:h-36 bg-gradient-to-b from-black via-black/60 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 sm:h-44 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />

        

        {/* Bottom Headline & Call to Action */}
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14 pb-8 sm:pb-12 lg:pb-14 z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div className="max-w-2xl">
              <h3 className="text-2xl sm:text-3xl lg:text-5xl font-normal text-white tracking-tight leading-tight font-cormorant">
                Where Artistry Meets Timeless Elegance.
              </h3>
              <p className="mt-3 text-xs sm:text-sm lg:text-base text-neutral-300 font-light leading-relaxed max-w-xl">
                Discover the art of fine jewellery, where the natural beauty of Ceylon sapphires meets exceptional craftsmanship. Every creation is thoughtfully designed with precision, passion, and attention to detail, bringing timeless elegance to life.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/customize"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-black hover:bg-neutral-100 font-semibold text-xs sm:text-sm transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Create Your Own Jewellery</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/30 text-white font-medium text-xs sm:text-sm transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Explore Our Collections</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
