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
  onStartDesigning?: () => void;
  onOpenWhatsApp?: () => void;
  images?: { src: string; alt: string; title?: string; rarity?: string; description?: string }[];
}

const DEFAULT_IMAGES = [
  {
    src: '/img/5f92b67dc1f6b488af607abad57aa888.jpg',
    alt: 'Royal Ceylon Sapphire Regal Ring',
    title: 'Royal Ceylon Sapphire Ring',
    rarity: 'Imperial Saturation',
    description: 'Signature velvety deep blue globally revered for imperial brilliance, set in solid precious metal.',
  },
  {
    src: '/img/09ca115b394466e8238f69fcb9896f64.jpg',
    alt: 'Padparadscha Blossom Bespoke Creation',
    title: 'Padparadscha Blossom Heirloom',
    rarity: 'Ultra-Rare Lotus Hue',
    description: 'A poetic fusion of sunrise-pink and sunset-orange ethically unearthed from Ratnapura alluvial beds.',
  },
  {
    src: '/img/bdfbc1f341ee9a45dd7b18df1d628465.jpg',
    alt: 'Cornflower Blue Sapphire Solitaire',
    title: 'Cornflower Blue Solitaire',
    rarity: 'Vivid Cornflower Hue',
    description: 'Crisp open azure depth cut along the optical c-axis for vivid internal refraction and fire.',
  },
  {
    src: '/img/66eb990fb3b88ca8d1edabec3e9bbd1a.jpg',
    alt: 'Midnight Ceylon Sapphire Pendant',
    title: 'Midnight Ceylon Sapphire Pendant',
    rarity: 'Midnight Blue Luster',
    description: 'Dramatic celestial sapphire depths framed by artisanal lapidary precision and precious metals.',
  },
  {
    src: '/img/203eda56cc198bbd78668d9f76616317.jpg',
    alt: 'Golden Canary Sapphire Masterpiece',
    title: 'Golden Canary Sapphire Band',
    rarity: 'Solar Radiance',
    description: 'Warm sunlit brilliance symbolizing prosperity and radiant energy with breathtaking luster.',
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
    height: 375px;
    padding-bottom: 0 !important;
  }
  
  .Carousal_003 .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 290px;
    height: 360px;
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
          speed={900}
          autoplay={
            autoplay
              ? {
                  delay: 4500,
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
              <div className="w-full h-full rounded-3xl bg-neutral-950 shadow-2xl relative select-none transition-all duration-300 group overflow-hidden">
                {/* Full Cover Image */}
                <img
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  src={image.src}
                  alt={image.alt}
                />

                {/* Top Subtle Vignette */}
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

                {/* Bottom Black Color Drop Gradient & Text */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent pt-20 pb-5 px-5 text-center flex flex-col justify-end space-y-1 z-10">
                  {image.rarity && (
                    <span className="text-[10px] tracking-widest uppercase font-semibold text-neutral-400 block">
                      {image.rarity}
                    </span>
                  )}
                  <p className="font-cormorant text-base sm:text-lg font-medium text-white truncate group-hover:text-amber-100 transition-colors duration-300 drop-shadow-sm">
                    {image.title || image.alt}
                  </p>
                  <p className="text-[11px] text-neutral-300 font-light line-clamp-2 leading-relaxed px-1 drop-shadow-xs">
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
  onStartDesigning,
}: {
  images?: { src: string; alt: string; title?: string; rarity?: string; description?: string }[];
  className?: string;
  onStartDesigning?: () => void;
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
        <Carousel_003 className="" images={images} loop autoplay />
      </div>

      {/* Small Description below the cards */}
      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 text-center mt-6 sm:mt-8">
        <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
          Each natural Ceylon sapphire is ethically unearthed from the alluvial soils of Ratnapura and hand-selected for exceptional color saturation, crystalline purity, and optical brilliance.
        </p>
      </div>

      {/* Hero CTA Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        
        {onStartDesigning && (
          <button
            onClick={onStartDesigning}
            className="px-8 py-3.5 bg-white text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 cursor-pointer"
          >
            Start Designing →
          </button>
        )}
      </div>
    </div>
  );
};

export const SapphireGallery: React.FC<SapphireGalleryProps> = ({
  images: propImages,
  onStartCustomizing,
  onStartDesigning,
}) => {
  const images = propImages || DEFAULT_IMAGES;
  const handleStart = onStartDesigning || onStartCustomizing;

  return (
    <section
      id="sapphire-varieties-section"
      className="flex flex-col items-center justify-center overflow-hidden bg-black text-white py-16 sm:py-24 relative w-full select-none"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Topic on top of the card grid */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center mb-8 sm:mb-12 space-y-2.5"
      >
        <span className="text-xs font-semibold  text-neutral-400 block">
          Rare Ceylon Corundum
        </span>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-cormorant font-normal text-white">
          Bespoke Sapphire Showcase
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-lg mx-auto leading-relaxed">
          Explore our signature Ceylon sapphire cuts, hue variations, and bespoke heirloom designs.
        </p>
      </motion.div>

      {/* Card Grid Carousel */}
      <div className="relative z-10 w-full flex justify-center">
        <Carousel_003 className="" images={images} loop autoplay />
      </div>

      {/* Small Description below the cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 text-center mt-6 sm:mt-8"
      >
        <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
          Each natural Ceylon sapphire is ethically unearthed from the alluvial soils of Ratnapura and hand-selected for exceptional color saturation, crystalline purity, and optical brilliance.
        </p>
      </motion.div>

      {/* Hero CTA Content */}
      {handleStart && (
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto mt-8">
          <button
            onClick={handleStart}
            className="px-8 py-3.5 bg-white text-gray-900 rounded-full text-sm font-semibold hover:bg-neutral-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 cursor-pointer"
          >
            Start Designing →
          </button>
        </div>
      )}
    </section>
  );
};

export { Carousel_003 };
export default SapphireGallery;
