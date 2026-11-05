'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ProvenanceHero } from '../components/home/ProvenanceHero';
import { CustomizeJewellerySection } from '../components/home/CustomizeJewellerySection';
import { EditorialGrid } from '../components/home/EditorialGrid';
import { CustomizeWeddingRingSection } from '../components/home/CustomizeWeddingRingSection';
import { HomeVideoShowcase } from '../components/home/HomeVideoShowcase';
import { LatestReviewsSection } from '../components/home/LatestReviewsSection';

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

export default function HomePage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Apply luxury dark scrollbar on Home Page
  useEffect(() => {
    document.documentElement.classList.add('dark-scrollbar');
    return () => {
      document.documentElement.classList.remove('dark-scrollbar');
    };
  }, []);

  // Fetch live catalogue from backend MongoDB Atlas
  useEffect(() => {
    let isMounted = true;
    const fetchLiveProducts = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/products?limit=12`);
        const json = await res.json();
        if (isMounted && json.success && json.data && json.data.products) {
          setProducts(json.data.products);
        }
      } catch (err) {
        console.error('Failed to fetch live products:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchLiveProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = products.filter((p) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'rose-gold') return p.metal?.type === 'rose-gold';
    if (activeCategory === 'silver') return p.metal?.type === 'silver';
    return p.category === activeCategory;
  });

  return (
    <main className="min-h-screen flex flex-col bg-white dark-scroll-theme">
      <Navbar />

      {/* ============================================================ */}
      {/* 1. SECTION 7: INTERACTIVE PROVENANCE SOURCING INTRO          */}
      {/* ============================================================ */}
      <ProvenanceHero />

      {/* ============================================================ */}
      {/* 2. BESPOKE CUSTOMIZER STUDIO CALLOUT                         */}
      {/* ============================================================ */}
      <CustomizeJewellerySection />

     

      {/* ============================================================ */}
      {/* 3. FEATURED READY-TO-WEAR COLLECTION WITH INTERACTIVE TABS  */}
      {/* ============================================================ */}
      <section
        id="featured-collection"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6"
        >
          <div>
           
            <h2 className="text-4xl sm:text-5xl font-cormorant text-black font-normal leading-tight">
              Discover Our Signature Collection
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 font-light mt-1 max-w-xl">
              Explore our selection of elegant jewellery featuring beautiful
              Ceylon sapphires. From timeless rings to delicate pendants
              and earrings, discover pieces designed to complement
              every style and occasion.
            </p>

          </div>

          {/* Category Filter Tabs with Sliding Active Pill */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Pieces' },
              { id: 'rings', label: 'Rings' },
              { id: 'necklaces', label: 'Pendants' },
              { id: 'earrings', label: 'Earrings' },
              { id: 'rose-gold', label: 'Rose Gold' },
              { id: 'silver', label: '925 Silver' },
            ].map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`relative px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    isActive ? 'text-white' : 'text-neutral-700 hover:text-black bg-neutral-100 hover:bg-neutral-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      className="absolute inset-0 bg-black rounded-full -z-10 shadow-xs"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 justify-center max-w-6xl mx-auto">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 animate-pulse aspect-3/4 flex flex-col justify-end"
              >
                <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-neutral-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 justify-center max-w-6xl mx-auto"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProductCard product={item} compact={true} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-16 text-neutral-500 text-sm max-w-md mx-auto">
            <p className="font-medium text-neutral-800 mb-1">No pieces found in this category</p>
            <p className="text-xs text-neutral-500">
              Select &quot;All Pieces&quot; or explore our full boutique collection.
            </p>
          </div>
        )}

        {/* View Entire Collection Link */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-neutral-300 hover:border-black text-black hover:text-black font-bold text-xs transition-all cursor-pointer"
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
      {/* 5. VERIFIED PATRON REVIEWS & TESTIMONIALS (LIVE BACKEND)     */}
      {/* ============================================================ */}
      {/* ============================================================ */}
      {/* 5. CUSTOMIZE WEDDING RING SECTION                           */}
      {/* ============================================================ */}
      <CustomizeWeddingRingSection />

      {/* ============================================================ */}
      {/* 5.5 CINEMATIC ATELIER CRAFTSMANSHIP VIDEO SHOWCASE           */}
      {/* ============================================================ */}
      <HomeVideoShowcase />

      {/* ============================================================ */}
      {/* 6. VERIFIED PATRON REVIEWS & TESTIMONIALS (LIVE BACKEND)     */}
      {/* ============================================================ */}
      <LatestReviewsSection />

     

      {/* ============================================================ */}

      {/* ============================================================ */}


      <Footer />
    </main>
  );
}
