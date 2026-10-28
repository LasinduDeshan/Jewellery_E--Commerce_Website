'use client';

import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import React from 'react';
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css';
import 'swiper/css/effect-cards';

import { cn } from '@/lib/utils';

export interface SapphireGalleryProps {
  selectedSapphire?: string;
  onSelectSapphire?: (sapphireName: string) => void;
  onStartCustomizing?: () => void;
  onOpenWhatsApp?: () => void;
  images?: { src: string; alt: string; title?: string; rarity?: string; description?: string }[];
}

const DEFAULT_IMAGES = [
  {
    src: '/img/colorless-white-sapphires-scaled-Photoroom.png',
    alt: 'Colorless White Ceylon Sapphire',
    title: 'Colorless White Sapphire',
    rarity: 'Pure Diamond Brilliance',
    description: 'Pure crystalline optical fire with remarkable diamond-like brilliance.',
  },
  {
    src: '/img/natural-pink-sapphires-Photoroom.png',
    alt: 'Natural Pink Ceylon Sapphire',
    title: 'Natural Pink Sapphire',
    rarity: 'Very Rare Pastel Hue',
    description: 'Soft romantic blush ethically unearthed from Ratnapura alluvial beds.',
  },
  {
    src: '/img/NSC-B4335-cushion-blue-sapphire-Small-300x300-Photoroom.png',
    alt: 'Cushion Cut Royal Blue Ceylon Sapphire',
    title: 'Royal Blue Sapphire',
    rarity: 'Signature Ceylon',
    description: 'Signature velvety deep blue globally revered for imperial saturation.',
  },
  {
    src: '/img/NSC-Y2448-radiant-cut-vivid-yellow-sapphire-Small-300x300-Photoroom.png',
    alt: 'Radiant Cut Vivid Yellow Ceylon Sapphire',
    title: 'Vivid Yellow Sapphire',
    rarity: 'Canary Luster',
    description: 'Warm golden canary fire symbolizing prosperity and solar radiance.',
  },
  {
    src: '/img/1-naturaluntreatedrubyU2639-Photoroom.png',
    alt: 'Natural Untreated Ceylon Ruby',
    title: 'Imperial Ceylon Ruby',
    rarity: 'Untreated Pigeon Blood',
    description: 'Rare untreated natural corundum with deep pigeon-blood depth.',
  },
  {
    src: '/img/1-padparadschasapphirePA2051-300x300-Photoroom.png',
    alt: 'Rare Padparadscha Ceylon Sapphire',
    title: 'Padparadscha Sapphire',
    rarity: 'Ultra Rare Lotus Bloom',
    description: 'Legendary lotus flower hue blending sunrise pink with sunset orange.',
  },
];

const Carousel_003 = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = true,
  spaceBetween = 0,
}: {
  images: { src: string; alt: string; title?: string; rarity?: string; description?: string }[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
}) => {
  const css = `
  .Carousal_003 {
    width: 100%;
    height: 420px;
    padding-bottom: 50px !important;
  }
  
  .Carousal_003 .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 290px;
    height: 360px;
  }

  .swiper-pagination-bullet {
    background-color: rgba(255, 255, 255, 0.35) !important;
    opacity: 1 !important;
    transition: all 0.3s ease;
  }

  .swiper-pagination-bullet-active {
    background-color: #ffffff !important;
    width: 22px !important;
    border-radius: 9999px !important;
  }
`;

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn('relative w-full max-w-4xl px-5', className)}
    >
      <style>{css}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Swiper
          spaceBetween={spaceBetween}
          autoplay={
            autoplay
              ? {
                  delay: 2500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          effect="coverflow"
          grabCursor={true}
          slidesPerView="auto"
          centeredSlides={true}
          loop={loop}
          coverflowEffect={{
            rotate: 40,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={
            showPagination
              ? {
                  clickable: true,
                }
              : false
          }
          navigation={
            showNavigation
              ? {
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }
              : false
          }
          className="Carousal_003"
          modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
        >
          {images.map((image, index) => (
            <SwiperSlide
              key={index}
              className="rounded-3xl overflow-hidden"
            >
              <div className="w-full h-full rounded-3xl bg-white shadow-2xl flex flex-col items-center justify-between p-6 relative select-none border border-neutral-100">
                {/* Gemstone Cutout Image Container - centered and uniform height */}
                <div className="w-full h-44 flex items-center justify-center p-2 shrink-0">
                  <img
                    className="max-h-36 max-w-[210px] w-auto h-auto object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.18)] hover:scale-110 transition-transform duration-500 ease-out"
                    src={image.src}
                    alt={image.alt}
                  />
                </div>

                {/* Bottom Title & Small Description - pinned uniformly to the bottom */}
                <div className="w-full text-center pt-3 border-t border-neutral-100 space-y-1 mt-auto shrink-0">
                  <p className="font-cormorant text-base sm:text-lg font-medium text-neutral-900 truncate">
                    {image.title || image.alt}
                  </p>
                  <p className="text-[11px] text-neutral-500 font-light line-clamp-2 leading-relaxed px-1">
                    {image.description || 'Natural Ceylon gemstone hand-selected by master lapidaries.'}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
          {showNavigation && (
            <div>
              <div className="swiper-button-next after:hidden">
                <ChevronRightIcon className="h-6 w-6 text-white" />
              </div>
              <div className="swiper-button-prev after:hidden">
                <ChevronLeftIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          )}
        </Swiper>
      </motion.div>
    </motion.div>
  );
};

export const Skiper49 = ({
  images = DEFAULT_IMAGES,
  className,
}: {
  images?: { src: string; alt: string; title?: string; rarity?: string; description?: string }[];
  className?: string;
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center overflow-hidden bg-black text-white py-16 sm:py-24 relative w-full select-none', className)}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Topic on top of the card grid */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center mb-8 sm:mb-12 space-y-2">
        <span className="text-xs font-medium text-neutral-400">
          Rare Ceylon Corundum
        </span>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-cormorant font-normal text-white">
          Bespoke Sapphire Showcase
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-lg mx-auto leading-relaxed">
          Explore our signature Ceylon sapphire cuts, hue variations, and bespoke heirloom designs.
        </p>
      </div>

      {/* Card Grid Carousel */}
      <div className="relative z-10 w-full flex justify-center">
        <Carousel_003 className="" images={images} showPagination loop autoplay />
      </div>

      {/* Small Description below the cards */}
      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 text-center mt-6 sm:mt-8">
        <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
          Each natural Ceylon sapphire is ethically unearthed from the alluvial soils of Ratnapura and hand-selected for exceptional color saturation, crystalline purity, and optical brilliance.
        </p>
      </div>
    </div>
  );
};

export const SapphireGallery: React.FC<SapphireGalleryProps> = ({
  images: propImages,
}) => {
  const images = propImages || DEFAULT_IMAGES;

  return (
    <section
      id="sapphire-varieties-section"
      className="flex flex-col items-center justify-center overflow-hidden bg-black text-white py-16 sm:py-24 relative w-full select-none"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Topic on top of the card grid */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center mb-8 sm:mb-12 space-y-2">
        <span className="text-xs font-medium text-neutral-400">
          Rare Ceylon Corundum
        </span>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-cormorant font-normal text-white">
          Bespoke Sapphire Showcase
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-lg mx-auto leading-relaxed">
          Explore our signature Ceylon sapphire cuts, hue variations, and bespoke heirloom designs.
        </p>
      </div>

      {/* Card Grid Carousel */}
      <div className="relative z-10 w-full flex justify-center">
        <Carousel_003 className="" images={images} showPagination loop autoplay />
      </div>

      {/* Small Description below the cards */}
      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 text-center mt-6 sm:mt-8">
        <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
          Each natural Ceylon sapphire is ethically unearthed from the alluvial soils of Ratnapura and hand-selected for exceptional color saturation, crystalline purity, and optical brilliance.
        </p>
      </div>
    </section>
  );
};

export { Carousel_003 };
export default SapphireGallery;
