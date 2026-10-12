'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  Heart,
  ShoppingBag,
  Gem,
  ShieldCheck,
  Check,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  gender: 'women' | 'men' | 'unisex';
  metal: {
    type: 'silver' | 'rose-gold';
    purity: string;
  };
  gemstone: {
    type: string;
    carat: number;
    cut?: string;
    origin?: string;
  };
  price: number;
  currency: 'AUD';
  stockQuantity: number;
  images: Array<{ url: string; alt?: string; sortOrder: number }>;
  description: string;
  certificate?: {
    available: boolean;
    issuer: string;
    certificateNumber: string;
  };
}

export default function ShopCataloguePage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [selectedGemstone, setSelectedGemstone] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>('');

  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Fetch products from backend with fallback
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/products?limit=50`);
        const data = await res.json();
        if (data.success && data.data && data.data.products) {
          setProducts(data.data.products);
        }
      } catch (err) {
        console.warn('Using client catalogue fallback');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(term);
        const matchesDesc = p.description?.toLowerCase().includes(term);
        const matchesGem = p.gemstone?.type.toLowerCase().includes(term);
        if (!matchesName && !matchesDesc && !matchesGem) return false;
      }

      // Category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Metal
      if (selectedMetal !== 'all' && p.metal?.type !== selectedMetal) {
        return false;
      }

      // Gemstone
      if (selectedGemstone !== 'all') {
        const gemLower = p.gemstone?.type.toLowerCase() || '';
        if (!gemLower.includes(selectedGemstone.toLowerCase())) {
          return false;
        }
      }

      // Gender
      if (selectedGender !== 'all') {
        if (selectedGender === 'women' && p.gender !== 'women' && p.gender !== 'unisex') return false;
        if (selectedGender === 'men' && p.gender !== 'men' && p.gender !== 'unisex') return false;
        if (selectedGender === 'unisex' && p.gender !== 'unisex') return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low-high') return a.price - b.price;
      if (sortBy === 'price-high-low') return b.price - a.price;
      if (sortBy === 'name-a-z') return a.name.localeCompare(b.name);
      return 0; // Default newest
    });
  }, [products, searchTerm, selectedCategory, selectedMetal, selectedGemstone, selectedGender, sortBy]);

  const handleQuickAdd = (product: ProductItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.url || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
      price: product.price,
      metal: product.metal.purity,
      gemstone: product.gemstone.type,
      quantity: 1,
    });
    setNotification(`Added "${product.name}" to shopping bag!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleToggleWishlist = (product: ProductItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        _id: product._id,
        title: product.name,
        price: product.price,
        image: product.images[0]?.url || '',
        metal: product.metal.purity,
        gemstone: product.gemstone.type,
      });
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedMetal('all');
    setSelectedGemstone('all');
    setSelectedGender('all');
    setSortBy('newest');
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedMetal !== 'all' ? 1 : 0) +
    (selectedGemstone !== 'all' ? 1 : 0) +
    (selectedGender !== 'all' ? 1 : 0) +
    (searchTerm ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      <Navbar />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-amber-500/30 text-xs animate-in slide-in-from-bottom">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
          <Link href="/cart" className="underline font-bold text-amber-400 ml-2">
            View Bag
          </Link>
        </div>
      )}

      {/* Hero Header */}
      <section className="bg-stone-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase block mb-2">
            Section 5.1 • Certified Fine Jewellery
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-stone-100">
            Natural Ceylon Sapphire Collection
          </h1>
          <p className="mt-3 text-sm text-stone-400 max-w-2xl mx-auto font-light leading-relaxed">
            Ethically gathered from Sri Lankan riverbeds, set in solid 925 sterling silver and 18K rose gold vermeil. Priced in AUD with insured express Australian delivery.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by gemstone, ring, pendant, metal..."
                className="w-full bg-stone-900 border border-stone-700 rounded-full py-3 pl-12 pr-10 text-sm text-white placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-3.5 text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Filter Collection
                </h3>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] text-amber-700 hover:underline cursor-pointer font-medium"
                >
                  Reset ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-xs font-semibold text-stone-800 uppercase tracking-wider block mb-2.5">
                Category
              </label>
              <div className="space-y-1 text-xs">
                {[
                  { id: 'all', label: 'All Jewellery' },
                  { id: 'rings', label: 'Sapphire Rings' },
                  { id: 'necklaces', label: 'Pendants & Necklaces' },
                  { id: 'engagement-promise-rings', label: 'Promise & Eternity Rings' },
                  { id: 'bracelets', label: 'Tennis Bracelets' },
                  { id: 'earrings', label: 'Teardrop Earrings' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? 'bg-amber-100/70 text-amber-900 font-semibold'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.id && <Check className="w-3.5 h-3.5 text-amber-800" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Metal Filter */}
            <div>
              <label className="text-xs font-semibold text-stone-800 uppercase tracking-wider block mb-2.5">
                Precious Metal
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setSelectedMetal(selectedMetal === 'silver' ? 'all' : 'silver')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedMetal === 'silver'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-slate-300 border border-slate-400 mx-auto mb-1" />
                  <span>925 Silver</span>
                </button>
                <button
                  onClick={() => setSelectedMetal(selectedMetal === 'rose-gold' ? 'all' : 'rose-gold')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedMetal === 'rose-gold'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-rose-300 border border-rose-400 mx-auto mb-1" />
                  <span>18K Rose Gold</span>
                </button>
              </div>
            </div>

            {/* Gemstone Variety */}
            <div>
              <label className="text-xs font-semibold text-stone-800 uppercase tracking-wider block mb-2.5">
                Gemstone Variety
              </label>
              <div className="space-y-1 text-xs">
                {[
                  { id: 'all', label: 'All Varieties' },
                  { id: 'Royal Blue', label: 'Royal Blue Sapphire' },
                  { id: 'Padparadscha', label: 'Rare Padparadscha' },
                  { id: 'Cornflower', label: 'Cornflower Blue' },
                  { id: 'Pink', label: 'Petal Pink Sapphire' },
                  { id: 'Yellow', label: 'Golden Yellow Sapphire' },
                  { id: 'Star', label: 'Asterism Star Sapphire' },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGemstone(g.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                      selectedGemstone === g.id
                        ? 'bg-amber-100/70 text-amber-900 font-semibold'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>{g.label}</span>
                    {selectedGemstone === g.id && <Check className="w-3.5 h-3.5 text-amber-800" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender / Style Tag (Section 5.1 & 5.8) */}
            <div>
              <label className="text-xs font-semibold text-stone-800 uppercase tracking-wider block mb-2.5">
                Style / Gender
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                {['all', 'women', 'men'].map((gen) => (
                  <button
                    key={gen}
                    onClick={() => setSelectedGender(gen)}
                    className={`py-1.5 px-2 rounded-lg border text-center capitalize cursor-pointer ${
                      selectedGender === gen
                        ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {gen === 'all' ? 'Any' : gen}
                  </button>
                ))}
              </div>
            </div>

            {/* Bespoke Customization CTA card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-stone-100 border border-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Need a Custom Piece?</span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Choose your exact unheated sapphire from our Ratnapura vaults and design your dream ring.
              </p>
              <Link
                href="/customize"
                className="inline-block text-[11px] font-bold text-amber-800 hover:underline pt-1"
              >
                Launch Studio & Request Quote →
              </Link>
            </div>
          </aside>

          {/* Products Grid & Toolbar */}
          <div className="flex-1">
            {/* Toolbar Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-medium">
                  Showing <strong>{filteredProducts.length}</strong> heirloom pieces
                </span>
                {activeFilterCount > 0 && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                    {activeFilterCount} active filters
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-medium text-stone-700 flex items-center gap-1.5"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5 text-xs text-stone-600">
                  <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                  <span className="hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="newest">Featured & Newest</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="name-a-z">Name: A to Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="py-24 text-center">
                <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-stone-500">Loading fine Ceylon jewellery catalogue...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 p-8">
                <Gem className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <h3 className="font-serif text-lg text-stone-800">No matching jewellery pieces found</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your metal, gemstone variety, or category filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const inWish = isInWishlist(product._id);
                  const mainImage =
                    product.images[0]?.url ||
                    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80';
                  const hoverImage =
                    product.images[1]?.url || mainImage;

                  return (
                    <div
                      key={product._id}
                      className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      {/* Image Frame with Wishlist Button */}
                      <Link
                        href={`/product/${product.slug}`}
                        className="relative block aspect-square overflow-hidden bg-stone-100"
                      >
                        <img
                          src={mainImage}
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        />

                        {/* Stock Urgency Tag (Section 5.2) */}
                        {product.stockQuantity <= 2 && (
                          <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                            Only {product.stockQuantity} Left
                          </div>
                        )}

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => handleToggleWishlist(product, e)}
                          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm cursor-pointer ${
                            inWish
                              ? 'bg-pink-50 text-pink-600'
                              : 'bg-white/80 hover:bg-white text-stone-600 hover:text-pink-600'
                          }`}
                          title="Save to Wishlist"
                        >
                          <Heart className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
                        </button>
                      </Link>

                      {/* Product Content Details */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Metal & Gemstone Pill */}
                          <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-semibold mb-1">
                            <span>{product.metal?.type === 'rose-gold' ? '18K Rose Gold' : '925 Silver'}</span>
                            <span>•</span>
                            <span className="truncate">{product.gemstone?.type}</span>
                          </div>

                          {/* Title */}
                          <Link href={`/product/${product.slug}`}>
                            <h4 className="font-serif text-stone-900 font-medium text-base line-clamp-1 hover:text-amber-700 transition-colors">
                              {product.name}
                            </h4>
                          </Link>

                          {/* Certification Trust Pill */}
                          <div className="flex items-center gap-1 text-[10px] text-stone-500 mt-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>NGJA / GIC Certified Gemstone</span>
                          </div>
                        </div>

                        {/* Price & Quick Add */}
                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-stone-400 block uppercase">Price (AUD)</span>
                            <span className="text-base font-serif font-bold text-stone-950">
                              ${product.price} AUD
                            </span>
                          </div>

                          <button
                            onClick={(e) => handleQuickAdd(product, e)}
                            className="px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-amber-600 text-white text-xs font-semibold tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                            title="Add to Shopping Bag"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs lg:hidden">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-base font-semibold">Filter Jewellery</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-stone-500 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Category */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block mb-2">Category</span>
              <div className="space-y-1 text-xs">
                {['all', 'rings', 'necklaces', 'engagement-promise-rings', 'bracelets', 'earrings'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setMobileFilterOpen(false);
                    }}
                    className={`block w-full text-left py-1.5 px-2 rounded capitalize ${
                      selectedCategory === cat ? 'bg-amber-100 font-bold text-amber-900' : 'text-stone-700'
                    }`}
                  >
                    {cat.replace(/-/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Metal */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block mb-2">Precious Metal</span>
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => setSelectedMetal('silver')}
                  className={`flex-1 py-2 border rounded text-center ${
                    selectedMetal === 'silver' ? 'border-amber-600 bg-amber-50 font-bold' : ''
                  }`}
                >
                  925 Silver
                </button>
                <button
                  onClick={() => setSelectedMetal('rose-gold')}
                  className={`flex-1 py-2 border rounded text-center ${
                    selectedMetal === 'rose-gold' ? 'border-amber-600 bg-amber-50 font-bold' : ''
                  }`}
                >
                  Rose Gold
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                clearAllFilters();
                setMobileFilterOpen(false);
              }}
              className="w-full py-2.5 rounded-lg border border-stone-300 text-xs font-bold text-stone-700"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
