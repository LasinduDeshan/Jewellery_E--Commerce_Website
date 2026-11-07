'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, ArrowRight } from 'lucide-react';

interface CustomizeVideoBannerProps {
  onOpenStudio?: () => void;
}

export const CustomizeVideoBanner: React.FC<CustomizeVideoBannerProps> = ({ onOpenStudio }) => {
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
      aria-label="Atelier Craftsmanship Video"
      className="w-full bg-neutral-950 relative overflow-hidden -mt-1"
    >
      {/* 100% Full-Width Edge-to-Edge 4K Video Container */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] min-h-[380px] sm:min-h-[500px] lg:min-h-[620px] overflow-hidden group">
        <video
          ref={videoRef}
          src="/videos/6263491-uhd_3840_2160_25fps.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          className="w-full h-full object-cover object-center scale-[1.01] transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top Edge Blend into Upper Section (Seamless fade from bg-neutral-950) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 sm:h-56 lg:h-72 bg-gradient-to-b from-neutral-950 via-neutral-950/70 to-transparent z-10" />

        {/* Gradient Overlays for Luxury Contrast & Readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/15" />
        <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-transparent to-black/35" />

        {/* Bottom Content & Controls Overlay aligned to page grid */}
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14 z-10">
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            {/* Left Text Block */}
            <div className="max-w-xl">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-cormorant text-white mb-2 tracking-tight">
                Crafted with Passion. <br></br>Defined by Elegance.
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                Discover the artistry behind every Zeyloraa creation. From the captivating beauty of Ceylon sapphires to the intricate details of fine jewellery making, experience the craftsmanship that brings timeless designs to life.
              </p>
            </div>

           
          </div>
        </div>
      </div>
    </section>
  );
};
