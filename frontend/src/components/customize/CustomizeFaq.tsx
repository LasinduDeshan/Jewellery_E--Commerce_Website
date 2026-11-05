'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Minus, ArrowRight, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FaqItem {
  _id?: string;
  question: string;
  answer: string;
  category?: string;
  sortOrder?: number;
  isActive?: boolean;
}

const FALLBACK_FAQS: FaqItem[] = [
  {
    _id: 'faq-1',
    question: 'How does the bespoke jewellery design process work?',
    answer:
      'You begin by selecting your preferred gemstone variety, cut, precious metal (solid 925 sterling silver or 18K gold), and setting style in our digital studio or via personal consultation. Our goldsmiths produce detailed 3D CAD renders for your review and approval before hand-forging your piece in our Colombo atelier.',
  },
  {
    _id: 'faq-2',
    question: 'Are all Ceylon sapphires natural, unheated, and certified?',
    answer:
      'Yes, absolutely. Every sapphire is 100% natural and ethically hand-gathered from hereditary alluvial riverbeds in Ratnapura and Elahera, Sri Lanka. Each custom piece comes accompanied by an official National Gem & Jewellery Authority (NGJA) certificate of authenticity and provenance.',
  },
  {
    _id: 'faq-3',
    question: 'Can I provide my own design sketch, heirloom gem, or reference photos?',
    answer:
      'Yes! You can upload reference sketches, inspirational photos, or heirloom stone dimensions through our Custom Studio form or WhatsApp concierge. Our master jewellers evaluate the concept and deliver 3D visualizations with transparent cost estimates within 24 to 48 hours.',
  },
  {
    _id: 'faq-4',
    question: 'How long does a custom ring or pendant take to craft and deliver?',
    answer:
      'Typical bespoke commissions require between 2 to 4 weeks from final CAD approval to dispatch. This ensures adequate time for precision lapidary faceting, hand-casting, pavé micro-setting, hallmark engraving, and government export gemological clearance.',
  },
  {
    _id: 'faq-5',
    question: 'What precious metals do you forge, and are they hypoallergenic?',
    answer:
      'We cast exclusively in solid 925 Sterling Silver with anti-tarnish rhodium plating, and solid 18K Yellow, Rose, or White Gold vermeil. All alloys are 100% nickel-free, cadmium-free, and hypoallergenic for comfortable daily heirloom wear.',
  },
  {
    _id: 'faq-6',
    question: 'Do you offer personalized laser inscriptions and custom ring sizing?',
    answer:
      'Yes. We offer complimentary precision laser engraving on the inner band (dates, initials, or coordinates). We accommodate full custom sizing from US 3 to US 14, including quarter and half sizes, with complimentary resizing within 30 days of receipt.',
  },
];

interface CustomizeFaqProps {
  onOpenStudio?: () => void;
  onOpenConsultation?: () => void;
}

export const CustomizeFaq: React.FC<CustomizeFaqProps> = ({
  onOpenStudio,
  onOpenConsultation,
}) => {
  const [faqs, setFaqs] = useState<FaqItem[]>(FALLBACK_FAQS);
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  useEffect(() => {
    let isMounted = true;
    const fetchFaqs = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/faqs?category=customize`);
        if (!res.ok) return;
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data) && json.data.length > 0) {
          setFaqs(json.data);
        }
      } catch {
        // Fallback remains active
      }
    };

    fetchFaqs();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleContactAction = () => {
    if (onOpenConsultation) {
      onOpenConsultation();
    } else if (onOpenStudio) {
      onOpenStudio();
    } else {
      window.open(
        'https://wa.me/94771234567?text=Hello%20Zeyloraa!%20I%20have%20a%20question%20about%20custom%20jewellery.',
        '_blank'
      );
    }
  };

  return (
    <section
      aria-label="Frequently Asked Questions"
      className="py-16 sm:py-20 lg:py-24 bg-[#FAFAFA] border-t border-neutral-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ============================================================ */}
          {/* LEFT COLUMN: Headings, Subtext & Action Button                */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 flex flex-col justify-between self-stretch pr-0 lg:pr-6">
            <div>
              <span className="text-[10px] font-bold  text-neutral-400 block mb-3">
                We're Here to Help
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-neutral-900 tracking-tight leading-[1.12]">
                General Questions <br className="hidden sm:inline" />
                asked by customers.
              </h2>
            </div>

            {/* Bottom Subtext & Call-to-Action */}
            <div className="mt-8 lg:mt-24 pt-6 border-t border-neutral-200/60 lg:border-t-0 lg:pt-0">
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-sm mb-5 font-normal">
                Have a question about our jewellery or bespoke designs? Our team is here to guide you, offering personalized assistance to make your Zeyloraa experience effortless and memorable.
              </p>
              <button
                type="button"
                onClick={handleContactAction}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <span>Contact Our Team</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: Interactive Rounded Accordion Cards            */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq._id || index}
                  className={`rounded-2xl bg-white border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
                      : 'border-neutral-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-neutral-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={isOpen}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer group"
                  >
                    <span className="font-semibold text-sm sm:text-base text-neutral-900 group-hover:text-black transition-colors leading-snug">
                      {faq.question}
                    </span>
                    <div
                      className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                        isOpen
                          ? 'border-neutral-900 text-neutral-900 bg-neutral-50'
                          : 'border-neutral-300 text-neutral-500 group-hover:border-neutral-900 group-hover:text-neutral-900'
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5 stroke-[2.2]" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0">
                          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light border-t border-neutral-100 pt-3.5">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

