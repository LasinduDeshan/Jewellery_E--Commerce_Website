'use client';

import React from 'react';
import { ARTISANAL_PROCESS_STEPS } from '../../data/customizationData';
import { Pickaxe, Sparkles, Compass, Hammer, Award, ShieldCheck, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap: Record<string, React.ReactNode> = {
  Pickaxe: <Pickaxe className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Hammer: <Hammer className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
};

export const ArtisanalProcess: React.FC = () => {
  return (
    <section
      id="artisanal-process-section"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cormorant text-white mt-2 font-normal">
            The Art of Creating Your Perfect Piece
          </h2>
          <p className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed font-light">
            Every extraordinary piece begins with a vision. From selecting exquisite Ceylon sapphires to refining every intricate detail, discover how thoughtful design and exceptional craftsmanship bring your dream jewellery to life.
          </p>
        </motion.div>

        {/* Staggered Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ARTISANAL_PROCESS_STEPS.map((step, idx) => {
            return (
              <motion.div
                key={step.stepNumber}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative rounded-2xl bg-neutral-900  p-6 flex flex-col justify-between hover:border-neutral-500 transition-colors group cursor-default"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-cormorant text-4xl font-bold text-white/20 group-hover:text-white/40 transition-colors">
                      {step.stepNumber}
                    </span>
                    
                  </div>

                  

                  <h3 className="text-l  font-medium text-white/70 mb-2 group-hover:text-neutral-100 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-neutral-400 leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ArtisanalProcess;
