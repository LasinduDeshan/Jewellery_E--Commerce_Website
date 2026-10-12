'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import {
  Sparkles,
  Gem,
  ShieldCheck,
  Compass,
  ArrowRight,
  MapPin,
  Award,
  Layers,
} from 'lucide-react';

export default function OurStoryPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoryContent = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/content/our-story`);
        const data = await res.json();
        if (data.success && data.data) {
          setContent(data.data);
        }
      } catch (err) {
        console.warn('Using client story fallback');
      } finally {
        setLoading(false);
      }
    };

    fetchStoryContent();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-stone-950 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-stone-800 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#0f2862]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#d4af37]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 border border-amber-500/30 text-amber-300 text-xs tracking-widest uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Section 5.7 • CMS Storytelling</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-stone-100 font-medium leading-tight">
            {content?.heroHeadline || 'From Ratnapura Riverbeds to Australian Elegance'}
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            {content?.heroSubheadline ||
              'A multi-generational lineage of Sri Lankan master lapidaries bringing unheated, ethically mined Ceylon Sapphires directly to discerning Australian collectors.'}
          </p>

          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Ratnapura & Elahera, Sri Lanka ➔ Australia</span>
          </div>
        </div>
      </section>

      {/* Story Sections Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full space-y-20">
        {content?.sections?.map((sec: any, idx: number) => (
          <div
            key={idx}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Text side */}
            <div className={`lg:col-span-6 space-y-4 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800 block">
                {sec.subtitle}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 font-medium">
                {sec.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                {sec.body}
              </p>

              {sec.quote && (
                <blockquote className="p-4 rounded-2xl bg-amber-50/70 border-l-4 border-amber-600 text-stone-800 text-xs italic font-serif leading-relaxed">
                  {sec.quote}
                  {sec.author && (
                    <footer className="not-italic text-[10px] font-sans text-stone-500 mt-1 font-bold">
                      — {sec.author}
                    </footer>
                  )}
                </blockquote>
              )}
            </div>

            {/* Image side */}
            <div className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div className="rounded-3xl overflow-hidden shadow-xl border border-stone-200 aspect-4/3 relative bg-stone-100">
                <img
                  src={
                    sec.imageUrl ||
                    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={sec.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Heritage Trust Badges */}
        <section className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block mb-1">
              Guaranteed Provenance
            </span>
            <h3 className="text-2xl font-serif text-stone-900">
              The Four Pillars of Ceylon Integrity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center text-xs">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <Gem className="w-6 h-6 text-amber-700 mx-auto" />
              <h4 className="font-bold text-stone-900">100% Natural Earth Mined</h4>
              <p className="text-stone-500 text-[11px] leading-relaxed">
                No glass-filled or lab-synthetics. Every sapphire is certified natural corundum.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <ShieldCheck className="w-6 h-6 text-amber-700 mx-auto" />
              <h4 className="font-bold text-stone-900">NGJA Government Assay</h4>
              <p className="text-stone-500 text-[11px] leading-relaxed">
                Appraised and sealed under National Gem & Jewellery Authority export protocols.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <Award className="w-6 h-6 text-amber-700 mx-auto" />
              <h4 className="font-bold text-stone-900">Hereditary Faceting</h4>
              <p className="text-stone-500 text-[11px] leading-relaxed">
                Cut by 4th generation Ratnapura lapidaries to unlock true color saturation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <Compass className="w-6 h-6 text-amber-700 mx-auto" />
              <h4 className="font-bold text-stone-900">Direct Australia DDP</h4>
              <p className="text-stone-500 text-[11px] leading-relaxed">
                Dispatched directly to Australian doorsteps with all customs pre-paid.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <h3 className="text-2xl font-serif text-stone-900 mb-3">
            Ready to find your signature Ceylon piece?
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mb-6">
            Browse our limited collection or commission a bespoke ring with your chosen rough gem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="px-6 py-3.5 bg-stone-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-amber-600 transition-colors shadow-md"
            >
              Browse Ready-to-Wear Collection
            </Link>
            <Link
              href="/customize"
              className="px-6 py-3.5 border border-stone-300 text-stone-800 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-stone-100 transition-colors"
            >
              Custom Sapphire Studio
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
