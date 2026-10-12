import React from 'react';
import Link from 'next/link';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Sparkles, Gem, ShieldCheck, ArrowRight, Award, Compass, MessageCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#101010] text-white pt-24 pb-28 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#0f2862]/35 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#d4af37]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-800/80 border border-amber-500/30 text-amber-300 text-xs tracking-widest uppercase mb-8 backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ethically Mined Ceylon Sapphires</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif tracking-tight text-stone-100 max-w-4xl mx-auto leading-tight">
            Rare Ceylon Gems, <br />
            <span className="gold-gradient-text">Bespoke Fine Art</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            Discover the celestial beauty of Ceylon Sapphires — from royal blues to ethereal padparadschas. Handcrafted with hereditary mastery in Sri Lanka.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 rounded-md bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold tracking-wider uppercase text-xs sm:text-sm transition-all duration-300 shadow-xl shadow-amber-950/40 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Gem className="w-4 h-4" />
              <span>Shop Ready-to-Wear Collection</span>
            </Link>

            <Link
              href="/customize"
              className="w-full sm:w-auto px-7 py-4 rounded-md bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 font-medium tracking-wider uppercase text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Customize Your Jewellery</span>
            </Link>

            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 rounded-md bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 font-medium tracking-wider uppercase text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <Gem className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-medium text-stone-900 mb-2">
              Unheated Ceylon Sapphires
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Direct provenance from the historic mines of Ratnapura and Elahera. Naturally vibrant corundum in royal blue, padparadscha, pink, and yellow.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-medium text-stone-900 mb-2">
              Bespoke Guided Quotes
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              No catalogue markup. Work 1-on-1 with master lapidaries to customize your gem, faceting cut, and 18K solid gold or platinum setting.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-medium text-stone-900 mb-2">
              Certified & Insured Worldwide
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Independent gemological authentication accompanying every custom piece. Secure full-value white-glove global shipping.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Jewellery Collection Section (Section 5.1) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Ready-to-Wear Ateliers
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1">
              Featured Ceylon Sapphires
            </h2>
          </div>

          <Link
            href="/shop"
            className="text-xs font-bold text-amber-900 hover:text-amber-700 uppercase tracking-wider flex items-center gap-1.5"
          >
            <span>Explore Entire Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Royal Blue Ceylon Sapphire Regal Halo Ring',
              slug: 'royal-blue-ceylon-sapphire-regal-halo-ring',
              metal: '925 Solid Sterling Silver',
              gem: '1.85ct Natural Royal Blue Sapphire',
              price: 840,
              image:
                'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=700&q=80',
            },
            {
              title: 'Padparadscha Lotus Blossom Pendant',
              slug: 'padparadscha-lotus-blossom-pendant',
              metal: '18K Rose Gold Vermeil',
              gem: '1.42ct Cushion Cut Padparadscha',
              price: 1120,
              image:
                'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80',
            },
            {
              title: 'Cornflower Blue Sapphire Eternity Promise Ring',
              slug: 'cornflower-blue-sapphire-eternity-promise-ring',
              metal: '925 Rhodium Finished Silver',
              gem: '1.20ct Vivid Cornflower Sapphires',
              price: 590,
              image:
                'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=700&q=80',
            },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={`/product/${item.slug}`}
              className="group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="aspect-square bg-stone-100 overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  NGJA Certified
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-amber-800 font-bold block mb-1">
                    {item.gem}
                  </span>
                  <h3 className="font-serif text-base font-semibold text-stone-900 group-hover:text-amber-700 transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-xs text-stone-500 mt-1 block">{item.metal}</span>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-base font-bold font-serif text-stone-900">
                    ${item.price} AUD
                  </span>
                  <span className="text-xs font-bold text-amber-800 group-hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Customization Banner Callout */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white rounded-3xl p-8 sm:p-14 border border-amber-500/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase block mb-2">
              Experience Bespoke Luxury
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white font-normal leading-tight">
              Design Your Engagement Ring or Heirloom Pendant
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Explore our interactive sapphire palette, optical cuts guide, birthstone styling chart, and receive a transparent quote within 24–48 hours.
            </p>
          </div>

          <Link
            href="/customize"
            className="shrink-0 px-8 py-4 rounded-md bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-semibold tracking-widest uppercase transition-all shadow-lg flex items-center gap-2"
          >
            <span>Launch Design Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
