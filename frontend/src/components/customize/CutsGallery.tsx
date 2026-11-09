'use client';

import React, { useRef } from 'react';
import { SAPPHIRE_CUTS } from '../../data/customizationData';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { motion } from 'framer-motion';
import 'swiper/css';

interface CutsGalleryProps {
  selectedCut: string;
  onSelectCut: (cutName: string) => void;
}

export const CutsGallery: React.FC<CutsGalleryProps> = ({ selectedCut, onSelectCut }) => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section
      id="sapphire-cuts-section"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12 max-w-[1440px] mx-auto w-full bg-white border-t border-neutral-200 overflow-hidden select-none"
    >
      <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-14">
        
        {/* ========================================================== */}
        {/* LEFT COLUMN: Animated Topic Title + Description + Arrows  */}
        {/* ========================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col justify-between self-stretch space-y-6"
        >
          <div className="space-y-3.5">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs font-semibold  text-neutral-500 block"
            >
              The Art of Gemstone Cutting
            </motion.span>

            {/* Topic changed to our bespoke sapphire cuts */}
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-cormorant font-bold tracking-tight text-neutral-900 leading-[1.08] font-sans"
            >
              Sapphire Cuts
            </motion.h2>

            {/* Description under topic */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed pt-1"
            >
              Every sapphire cut reveals a unique expression of beauty and brilliance. Explore the elegance of different shapes, each thoughtfully designed to enhance the gemstone's natural colour, sparkle, and timeless appeal.
            </motion.p>
          </div>

          {/* Navigation Controls: Manual Arrows */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous sapphire cut"
              className="w-11 h-11 rounded-full border border-neutral-300 hover:border-black bg-white hover:bg-black text-neutral-800 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-xs active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next sapphire cut"
              className="w-11 h-11 rounded-full border border-neutral-300 hover:border-black bg-white hover:bg-black text-neutral-800 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-xs active:scale-95"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* ========================================================== */}
        {/* RIGHT COLUMN: Infinite Seamless Loop Carousel              */}
        {/* ========================================================== */}
        <div className="flex-1 min-w-0 overflow-hidden w-full">
          <Swiper
            modules={[Autoplay]}
            loop={true}
            speed={750}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              320: { slidesPerView: 1.15, spaceBetween: 16 },
              640: { slidesPerView: 1.8, spaceBetween: 20 },
              1024: { slidesPerView: 2.2, spaceBetween: 20 },
              1280: { slidesPerView: 2.7, spaceBetween: 24 },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="w-full !overflow-visible"
          >
            {SAPPHIRE_CUTS.map((cut) => {
              const isSelected = selectedCut === cut.name;

              return (
                <SwiperSlide key={cut.id} className="h-auto">
                  <div
                    className="h-full flex flex-col justify-between group cursor-pointer p-2 sm:p-2.5 transition-all duration-300"
                    onClick={() => onSelectCut(cut.name)}
                  >
                    <div>
                      {/* Compact Image Container with reduced height */}
                      <div className="relative w-full aspect-[4/3] bg-[#f4f4f6] overflow-hidden rounded-lg">
                        <img
                          src={cut.image}
                          alt={cut.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />

                        {/* Optical Ratio badge pill */}
                        <span className="absolute top-2.5 right-2.5 text-[10px] font-mono font-medium text-neutral-800 bg-white/95 backdrop-blur-sm border border-neutral-200/80 px-2 py-0.5 rounded-full shadow-xs">
                          {cut.ratio}
                        </span>
                      </div>

                      {/* Cut Name */}
                      <h3 className="text-lg font-bold text-neutral-900 mt-3 leading-snug font-sans group-hover:text-neutral-700 transition-colors">
                        {cut.name}
                      </h3>

                      {/* Sparkle Profile Tag (No emoji) */}
                      <div className="mt-1 mb-1.5 inline-block text-[11px] font-medium text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                        {cut.sparkleProfile}
                      </div>

                      {/* Description Paragraph */}
                      <p className="text-xs text-neutral-500 leading-relaxed font-light mt-0.5 line-clamp-2">
                        {cut.description}
                      </p>

                      {/* Best Suited For */}
                      <div className="mt-2.5 text-[11px] text-neutral-500 line-clamp-1">
                        <span className="font-semibold text-neutral-800">Best Suited: </span>
                        {cut.bestSuitedFor}
                      </div>
                    </div>

                    {/* Bottom Action: Select Cut -> */}
                    <div className="mt-3.5 pt-2.5 border-t border-neutral-200/60 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCut(cut.name);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer group/link"
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-black" />
                            <span>Cut Selected</span>
                          </>
                        ) : (
                          <>
                            <span>Select Cut</span>
                            <span className="transition-transform duration-300 group-hover/link:translate-x-1.5">
                              →
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

      </div>
    </section>
  );
};

export default CutsGallery;
