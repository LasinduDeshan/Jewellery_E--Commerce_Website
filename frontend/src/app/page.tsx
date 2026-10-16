'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ProvenanceHero } from '../components/home/ProvenanceHero';
import { EditorialGrid } from '../components/home/EditorialGrid';
import { ProductCard } from '../components/ui/ProductCard';
import {
  Sparkles,
  Gem,
  ShieldCheck,
  ArrowRight,
  Award,
  Compass,
  MessageCircle,
  Eye,
  Check,
  MapPin,
  Heart,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  gender: string;
  price: number;
  currency: string;
  stockQuantity: number;
  metal: { type: string; purity: string };
  gemstone: { type: string; carat: number };
  images: { url: string; alt?: string }[];
  description?: string;
}

const FALLBACK_PRODUCTS: ProductItem[] = [
  {
    _id: 'seed-1',
    name: 'Royal Blue Ceylon Sapphire Regal Halo Ring',
    slug: 'royal-blue-ceylon-sapphire-regal-halo-ring',
    sku: 'AUR-HALO-01',
    category: 'rings',
    gender: 'women',
    metal: { type: 'silver', purity: '925 Solid Sterling Silver (Rhodium Finish)' },
    gemstone: { type: 'Natural Ceylon Royal Blue Sapphire', carat: 1.85 },
    price: 840,
    currency: 'AUD',
    stockQuantity: 2,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
        alt: 'Royal Blue Ceylon Sapphire Regal Halo Ring',
      },
    ],
  },
  {
    _id: 'seed-2',
    name: 'Padparadscha Lotus Blossom Pendant',
    slug: 'padparadscha-lotus-blossom-pendant',
    sku: 'AUR-PAD-02',
    category: 'necklaces',
    gender: 'women',
    metal: { type: 'rose-gold', purity: '18K Rose Gold Vermeil' },
    gemstone: { type: 'Natural Ceylon Padparadscha Sapphire', carat: 1.42 },
    price: 1120,
    currency: 'AUD',
    stockQuantity: 1,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
        alt: 'Padparadscha Lotus Blossom Pendant',
      },
    ],
  },
  {
    _id: 'seed-3',
    name: 'Cornflower Blue Sapphire Eternity Ring',
    slug: 'cornflower-blue-sapphire-eternity-ring',
    sku: 'AUR-ETERN-03',
    category: 'rings',
    gender: 'women',
    metal: { type: 'silver', purity: '925 Rhodium Plated Silver' },
    gemstone: { type: 'Ceylon Cornflower Blue Sapphire', carat: 1.2 },
    price: 590,
    currency: 'AUD',
    stockQuantity: 3,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80',
        alt: 'Cornflower Blue Sapphire Eternity Ring',
      },
    ],
  },
  {
    _id: 'seed-4',
    name: 'Ceylon Sapphire Rose Gold Pendant',
    slug: 'ceylon-sapphire-rose-gold-pendant',
    sku: 'CS-RG-PEND-001',
    category: 'necklaces',
    gender: 'women',
    metal: { type: 'rose-gold', purity: '18K Rose Gold Plated' },
    gemstone: { type: 'Natural Ceylon Blue Sapphire', carat: 1.25 },
    price: 299,
    currency: 'AUD',
    stockQuantity: 8,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
        alt: 'Ceylon Sapphire Rose Gold Pendant',
      },
    ],
  },
  {
    _id: 'seed-5',
    name: 'Royal Ceylon Sapphire Ring',
    slug: 'royal-ceylon-sapphire-ring-aur-830',
    sku: 'AUR-830',
    category: 'rings',
    gender: 'women',
    metal: { type: 'silver', purity: '925 Solid Sterling Silver' },
    gemstone: { type: 'Ceylon Blue Sapphire', carat: 1.85 },
    price: 795,
    currency: 'AUD',
    stockQuantity: 5,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80',
        alt: 'Royal Ceylon Sapphire Ring',
      },
    ],
  },
  {
    _id: 'seed-6',
    name: 'Teardrop Ceylon Sapphire Solitaire Earrings',
    slug: 'teardrop-ceylon-sapphire-solitaire-earrings',
    sku: 'AUR-EAR-06',
    category: 'earrings',
    gender: 'women',
    metal: { type: 'rose-gold', purity: '18K Rose Gold Vermeil' },
    gemstone: { type: 'Ceylon Vivid Blue Sapphire', carat: 2.1 },
    price: 890,
    currency: 'AUD',
    stockQuantity: 2,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
        alt: 'Teardrop Ceylon Sapphire Solitaire Earrings',
      },
    ],
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<ProductItem[]>(FALLBACK_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Fetch live catalogue from backend MongoDB Atlas
  useEffect(() => {
    const fetchLiveProducts = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/products?limit=12`);
        const json = await res.json();
        if (json.success && json.data && json.data.products && json.data.products.length > 0) {
          // Merge with fallback seed items to guarantee rich visual showcase
          const dbItems: ProductItem[] = json.data.products;
          const merged = [...dbItems];
          FALLBACK_PRODUCTS.forEach((fb) => {
            if (!merged.some((m) => m.sku === fb.sku || m.slug === fb.slug)) {
              merged.push(fb);
            }
          });
          setProducts(merged);
        }
      } catch (err) {
        console.warn('Backend offline, utilizing curated provenance dataset');
      } finally {
        setLoading(false);
      }
    };
    fetchLiveProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'rose-gold') return p.metal?.type === 'rose-gold';
    if (activeCategory === 'silver') return p.metal?.type === 'silver';
    return p.category === activeCategory;
  });

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ============================================================ */}
      {/* 1. SECTION 7: INTERACTIVE PROVENANCE SOURCING INTRO          */}
      {/* ============================================================ */}
      <ProvenanceHero />

      {/* ============================================================ */}
      {/* 2. THE 4 PROVENANCE TRUST PILLARS                            */}
      {/* ============================================================ */}
      <section className="bg-white border-y border-neutral-200/90 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="flex flex-col items-center text-center p-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 text-black flex items-center justify-center mb-3 border border-neutral-200">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-black">
              Direct Alluvial Mines
            </h4>
            <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
              Ratnapura riverbeds. Ethically unearthed with zero strip mining.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 text-black flex items-center justify-center mb-3 border border-neutral-200">
              <Gem className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-black">
              Unheated Corundum
            </h4>
            <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
              Rare royal blues, cornflower, and sunset padparadscha sapphires.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 text-black flex items-center justify-center mb-3 border border-neutral-200">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-black">
              NGJA SL Certified
            </h4>
            <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
              Official government gemological certificate accompanying every piece.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 text-black flex items-center justify-center mb-3 border border-neutral-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-black">
              Australian Direct Fair Luxury
            </h4>
            <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
              Insured courier delivery. Zero European middleman markups.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. FEATURED READY-TO-WEAR COLLECTION WITH INTERACTIVE TABS  */}
      {/* ============================================================ */}
      <section
        id="featured-collection"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 ">
          <div>
            <h2 className="text-4xl sm:text-5xl font-cormorant text-black font-normal tracking-tight leading-tight">
              Featured Ceylon Sapphires
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-light mt-1 max-w-xl">
              Hand-faceted Ceylon sapphires set in 925 sterling silver and 18K rose gold vermeil. Meticulously inspected by master lapidaries.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Pieces' },
              { id: 'rings', label: 'Rings' },
              { id: 'necklaces', label: 'Pendants' },
              { id: 'earrings', label: 'Earrings' },
              { id: 'rose-gold', label: 'Rose Gold' },
              { id: 'silver', label: '925 Silver' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === tab.id
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 justify-center max-w-6xl mx-auto">
          {filteredProducts.slice(0, 8).map((item) => (
            <ProductCard key={item._id} product={item} compact={true} />
          ))}
        </div>

        {/* View Entire Collection Link */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-neutral-300 hover:border-black text-black hover:text-black font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
          >
            <span>Explore All {products.length} Jewellery Pieces</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. HIGH-FASHION EDITORIAL IMAGE GRID (MAGAZINE ASYMMETRIC)   */}
      {/* ============================================================ */}
      <EditorialGrid />

      {/* ============================================================ */}
      {/* 5. BESPOKE CUSTOMIZER STUDIO CALLOUT (SECTION 5.5 / 5.2)     */}
      {/* Full-Width Borderless Triptych & Customization Studio Layout */}
      {/* ============================================================ */}
      <section className="w-full bg-white py-16 sm:py-24 border-t border-neutral-200/80 overflow-hidden">
        {/* Section Heading matching site theme */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 sm:mb-14">
          
          <h2 className="text-2xl sm:text-6xl font-cormorant text-black font-normal tracking-tight">
            Customize Your Jewellery
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto font-light leading-relaxed">
            Collaborate 1-on-1 with our master Ratnapura lapidaries and goldsmiths to sculpt a bespoke Ceylon sapphire heirloom that belongs solely to you.
          </p>
        </div>

        {/* Top Half: Full-Width 3-Photo Triptych (Center Dominant + Left/Right Peek Frames) */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 w-full overflow-hidden">
          {/* Left Peek Image */}
          <div className="w-24 sm:w-44 md:w-64 lg:w-80 aspect-[3/4] sm:aspect-[4/5] overflow-hidden shrink-0 bg-neutral-100 rounded-2xl border border-neutral-200/80 shadow-2xs">
            <img
              src="/img/a4dbfd433c3bd35c67c18b4894f6321a.jpg"
              alt="Atelier jewellery study"
              className="w-full h-full object-cover object-center grayscale contrast-[1.05] hover:grayscale-0 hover:scale-105 transition-all duration-700 ease-out cursor-pointer"
            />
          </div>

          {/* Center Dominant Image */}
          <div className="w-64 sm:w-96 md:w-[480px] lg:w-[560px] aspect-square sm:aspect-[4/5] overflow-hidden shrink-0 bg-neutral-100 rounded-3xl border border-neutral-200 shadow-md">
            <img
              src="/img/58b04d6c32e22fba64656208a9442068.jpg"
              alt="Precious Ceylon heirloom detail"
              className="w-full h-full object-cover object-center grayscale contrast-[1.05] hover:grayscale-0 hover:scale-105 transition-all duration-700 ease-out cursor-pointer"
            />
          </div>

          {/* Right Peek Image */}
          <div className="w-24 sm:w-44 md:w-64 lg:w-80 aspect-[3/4] sm:aspect-[4/5] overflow-hidden shrink-0 bg-neutral-100 rounded-2xl border border-neutral-200/80 shadow-2xs">
            <img
              src="/img/49218f1fb573490eea4bc7f2e7d02113.jpg"
              alt="Handcrafted bespoke Ceylon jewellery"
              className="w-full h-full object-cover object-center grayscale contrast-[1.05] hover:grayscale-0 hover:scale-105 transition-all duration-700 ease-out cursor-pointer"
            />
          </div>
        </div>

        {/* 3 Step Interactive Atelier Cards */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-black transition-all text-left group">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 block mb-2">Step 01</span>
              <h3 className="font-cormorant text-xl font-medium text-black mb-1">Select Raw Sapphire</h3>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Choose unheated Royal Blue, rare Padparadscha, Peacock Teal, or Golden Yellow rough from our Ratnapura vaults.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-black transition-all text-left group">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 block mb-2">Step 02</span>
              <h3 className="font-cormorant text-xl font-medium text-black mb-1">Choose Cut & Precious Metal</h3>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Opt for cushion, oval, emerald, or pear faceting set in solid 925 sterling silver or 18K solid gold / rose vermeil.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-black transition-all text-left group">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 block mb-2">Step 03</span>
              <h3 className="font-cormorant text-xl font-medium text-black mb-1">Receive 3D CAD & Quote</h3>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Get a photorealistic 3D rendering and transparent quote within 24–48 hours, with zero purchase obligation.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Half: Centered Quote Mark, Poetic Atelier Statement & CTAs */}
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 mt-12 flex flex-col items-center">
          {/* 3-Line Italicized Quotation (Matching Reference Style) */}
          <p className="text-lg sm:text-xl md:text-2xl font-cormorant italic text-neutral-900 leading-relaxed max-w-xl">
            “In a world of mass production, true bespoke art remains rare.<br className="hidden sm:inline" />
            However pure and understated you are,<br className="hidden sm:inline" />
            your one-of-a-kind Ceylon heirloom is irreplaceable.”
          </p>

          {/* Description Subtext */}
          <p className="text-xs text-neutral-500 font-light mt-4 max-w-md leading-relaxed">
            Can't find your dream piece? Select your rare Ceylon sapphire (Royal Blue, Padparadscha, Teal, or Canary), choose 925 Sterling Silver or 18K Rose Gold, and collaborate 1-on-1 with our master lapidaries.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8 w-full sm:w-auto">
            <Link
              href="/customize"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Launch Custom Studio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 hover:border-black font-bold text-xs uppercase tracking-widest transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-neutral-800" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. SOURCING TRANSPARENCY & HERITAGE NARRATIVE PREVIEW        */}
      {/* ============================================================ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-4/3 border border-neutral-200 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&w=1200&q=80"
              alt="Hereditary Sri Lankan Gem Cutter"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-white text-xs font-mono tracking-widest uppercase block mb-1">
                Galle Fort Atelier • Sri Lanka
              </span>
              <p className="text-lg sm:text-xl font-light italic leading-snug">
                "We do not cut gems merely for weight. We cut to unlock the sapphire's soul and let natural light dance inside."
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              The Ethical Chain of Custody
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cormorant text-black font-normal leading-tight">
              Why Sri Lankan Sapphires Are Revered Worldwide
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              From Marco Polo’s ancient chronicles to the modern royal crowns of Europe, Sri Lanka (formerly Ceylon) has produced the clearest, most naturally vibrant corundum in geological history.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-neutral-100 text-black flex items-center justify-center shrink-0 mt-0.5 border border-neutral-200">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-black">Zero Strip Mining</h4>
                  <p className="text-[11px] text-neutral-500">
                    Artisanal gravel pitting preserves local ecosystems, paddy fields, and waterways.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-neutral-100 text-black flex items-center justify-center shrink-0 mt-0.5 border border-neutral-200">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-black">Living Wages for Craftsmen</h4>
                  <p className="text-[11px] text-neutral-500">
                    Direct commissions ensure hereditary lapidaries and goldsmiths prosper fairly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-neutral-100 text-black flex items-center justify-center shrink-0 mt-0.5 border border-neutral-200">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-black">Official NGJA SL Export Seals</h4>
                  <p className="text-[11px] text-neutral-500">
                    Government gemologists test every stone prior to white-glove export transit to Australia.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/story"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black hover:text-neutral-600 transition-colors"
              >
                <span>Read Full Provenance Documentation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
