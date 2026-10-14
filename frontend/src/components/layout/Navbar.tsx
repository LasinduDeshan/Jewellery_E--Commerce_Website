'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import {
  Sparkles,
  MessageCircle,
  Menu,
  X,
  Shield,
  Gem,
  User,
  Heart,
  Package,
  LogOut,
  ChevronDown,
  ShoppingBag,
  Search,
  ArrowRight,
  Truck,
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  href: string;
  image: string;
  itemCountBadge?: string;
}

const COLLECTION_CATEGORIES: CategoryItem[] = [
  {
    id: 'necklaces',
    name: 'Necklaces & Pendants',
    description: 'Solitaire cushion drops & lotus motifs',
    href: '/shop?category=necklaces',
    image:
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
    itemCountBadge: 'Pendants',
  },
  {
    id: 'rings',
    name: 'Rings',
    description: 'Regal halos, eternity & stacking bands',
    href: '/shop?category=rings',
    image:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80',
    itemCountBadge: 'Bestseller',
  },
  {
    id: 'engagement-promise-rings',
    name: 'Engagement & Promise Rings',
    description: 'Heirloom solitaires & bespoke bridal',
    href: '/shop?category=engagement-promise-rings',
    image:
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=400&q=80',
    itemCountBadge: 'Bridal',
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    description: 'Sapphire tennis bracelets & bangles',
    href: '/shop?category=bracelets',
    image:
      'https://images.unsplash.com/photo-1611591475870-b18cb5bf4d2c?auto=format&fit=crop&w=400&q=80',
    itemCountBadge: 'Tennis',
  },
  {
    id: 'earrings',
    name: 'Earrings',
    description: 'Teardrop solitaires & floral studs',
    href: '/shop?category=earrings',
    image:
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80',
    itemCountBadge: 'Solitaire',
  },
];

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();

  // Scroll state for transparent -> white navbar transition
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation states
  const [collectionsMegaOpen, setCollectionsMegaOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCollectionsAccordion, setMobileCollectionsAccordion] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Pages with a dark/video hero at the top
  const hasDarkHero = pathname === '/' || pathname === '/customize' || pathname === '/story';
  const isTransparent = hasDarkHero && !isScrolled && !collectionsMegaOpen && !mobileMenuOpen;

  // Mouse hover with grace timeout to prevent accidental closing
  const handleMouseEnter = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setCollectionsMegaOpen(true);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setCollectionsMegaOpen(false);
    }, 180);
  };

  const closeMenu = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setCollectionsMegaOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchModalOpen(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCollectionsMegaOpen(false);
        setSearchModalOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* ============================================================ */}
      {/* PERSISTENT TOP BAR (STICKY ON SCROLL ACROSS ALL PAGES)        */}
      {/* ============================================================ */}
      <header
        className={`${
          hasDarkHero ? 'fixed top-0 left-0 right-0 z-50' : 'sticky top-0 z-40'
        } transition-all duration-300 ${
          isTransparent
            ? 'bg-transparent border-b border-transparent shadow-none'
            : 'bg-white/95 backdrop-blur-md border-b border-neutral-200/90 shadow-xs'
        }`}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* -------------------------------------------------------- */}
            {/* 1. BRAND LOGO                                            */}
            {/* -------------------------------------------------------- */}
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center space-x-2.5 shrink-0 group py-2"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:scale-105 ${
                  isTransparent
                    ? 'bg-white/10 text-white border border-white/25 backdrop-blur-sm shadow-xs'
                    : 'bg-black text-white shadow-xs'
                }`}
              >
                <Gem className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-bold text-base  leading-none transition-colors ${
                    isTransparent ? 'text-white' : 'text-black'
                  }`}
                >
                  AURA
                  <span
                    className={`font-normal transition-colors ${
                      isTransparent ? 'text-neutral-300' : 'text-neutral-500'
                    }`}
                  >
                    .CEYLON
                  </span>
                </span>
                <span
                  className={`text-[9px]  font-medium mt-0.5 transition-colors ${
                    isTransparent ? 'text-neutral-300' : 'text-neutral-400'
                  }`}
                >
                  Fine Sapphire Atelier
                </span>
              </div>
            </Link>

            {/* -------------------------------------------------------- */}
            {/* 2. TOP-LEVEL MENU ITEMS (SECTION 4 STRUCTURE)            */}
            {/* -------------------------------------------------------- */}
            <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4 h-full">
              {/* (A) Collections Mega-Menu Trigger */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={handleMouseEnter}
              >
                <button
                  onClick={() => setCollectionsMegaOpen(!collectionsMegaOpen)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold  transition-all flex items-center gap-1.5 cursor-pointer ${
                    collectionsMegaOpen
                      ? 'bg-neutral-100 text-black'
                      : isTransparent
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : 'text-neutral-700 hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  <span>Collections</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      collectionsMegaOpen
                        ? 'rotate-180 text-black'
                        : isTransparent
                        ? 'text-white/70'
                        : 'text-neutral-400'
                    }`}
                  />
                </button>
              </div>

              {/* (B) Women - pre-filtered to items tagged Women/Unisex */}
              <Link
                href="/shop?gender=women"
                onClick={closeMenu}
                className={`px-3 py-2 rounded-full text-xs font-semibold  transition-all ${
                  isTransparent
                    ? 'text-white/90 hover:text-white hover:bg-white/10'
                    : 'text-neutral-700 hover:text-black hover:bg-neutral-50'
                }`}
              >
                Women
              </Link>

              {/* (C) Men - pre-filtered to items tagged Men/Unisex */}
              <Link
                href="/shop?gender=men"
                onClick={closeMenu}
                className={`px-3 py-2 rounded-full text-xs font-semibold  transition-all ${
                  isTransparent
                    ? 'text-white/90 hover:text-white hover:bg-white/10'
                    : 'text-neutral-700 hover:text-black hover:bg-neutral-50'
                }`}
              >
                Men
              </Link>

              {/* (D) Customize Your Jewellery - VISIBLY DISTINCT BUTTON TREATMENT */}
              <Link
                href="/customize"
                onClick={closeMenu}
                className={`px-4 py-2 rounded-full text-xs font-semibold  transition-all shadow-xs flex items-center gap-1.5 transform hover:scale-[1.02] active:scale-[0.98] ${
                  isTransparent
                    ? 'bg-white hover:bg-neutral-200 text-black border border-white shadow-md'
                    : 'bg-black hover:bg-neutral-800 text-white border border-black'
                }`}
              >
                
                <span>Customize Your Jewellery</span>
              </Link>

              {/* Sourcing Story link */}
              <Link
                href="/story"
                onClick={closeMenu}
                className={`px-3 py-2 rounded-full text-xs font-medium  transition-all ${
                  isTransparent
                    ? 'text-neutral-300 hover:text-white hover:bg-white/10'
                    : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
                }`}
              >
                Our Story
              </Link>
            </nav>

            {/* -------------------------------------------------------- */}
            {/* 3. PERSISTENT ICONS (SEARCH, CART, ACCOUNT, WHATSAPP)    */}
            {/* -------------------------------------------------------- */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search Icon Button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                aria-label="Search Catalogue"
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
                }`}
                title="Search Catalogue"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Persistent Wishlist Icon */}
              <Link
                href="/account"
                className={`relative p-2 rounded-full transition-colors ${
                  isTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
                }`}
                title="My Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span
                    className={`absolute top-1 right-1 text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-xs ${
                      isTransparent ? 'bg-white text-black' : 'bg-black text-white'
                    }`}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Persistent Cart Icon */}
              <Link
                href="/cart"
                className={`relative p-2 rounded-full transition-colors ${
                  isTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
                }`}
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span
                    className={`absolute top-1 right-1 text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-xs ${
                      isTransparent ? 'bg-white text-black' : 'bg-black text-white'
                    }`}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Persistent Account Login / Profile */}
              <div className="relative">
                {user ? (
                  <div>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isTransparent
                          ? 'bg-white/10 hover:bg-white/20 border border-white/30 text-white backdrop-blur-sm'
                          : 'bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-900'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isTransparent ? 'bg-white text-black' : 'bg-black text-white'
                        }`}
                      >
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="hidden sm:inline max-w-[80px] truncate">
                        {user.name.split(' ')[0]}
                      </span>
                      <ChevronDown
                        className={`w-3 h-3 ${isTransparent ? 'text-white/70' : 'text-neutral-500'}`}
                      />
                    </button>

                    {userDropdownOpen && (
                      <div
                        onClick={() => setUserDropdownOpen(false)}
                        className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-neutral-200 py-2 z-50 text-xs text-neutral-700 animate-in fade-in slide-in-from-top-2 duration-150"
                      >
                        <div className="px-4 py-2 border-b border-neutral-100">
                          <p className="font-bold text-neutral-900 truncate">{user.name}</p>
                          <p className="text-[10px] text-neutral-400 truncate">{user.email}</p>
                        </div>

                        <Link
                          href="/account"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-50 text-neutral-700 font-medium"
                        >
                          <User className="w-3.5 h-3.5 text-neutral-900" />
                          <span>Client Portal & Wishlist</span>
                        </Link>

                        <Link
                          href="/account"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-50 text-neutral-700 font-medium"
                        >
                          <Package className="w-3.5 h-3.5 text-neutral-900" />
                          <span>Orders & Live Tracking</span>
                        </Link>

                        <div className="border-t border-neutral-100 my-1"></div>

                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-100 text-neutral-900 font-medium"
                        >
                          <Shield className="w-3.5 h-3.5 text-neutral-900" />
                          <span>Admin Workspace</span>
                        </Link>

                        <button
                          onClick={logout}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-neutral-100 text-neutral-600 border-t border-neutral-100 mt-1 cursor-pointer font-medium"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className={`p-2 sm:px-4 sm:py-2 rounded-full text-xs font-semibold  transition-all flex items-center gap-1.5 ${
                      isTransparent
                        ? 'bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm'
                        : 'bg-black hover:bg-neutral-800 text-white shadow-xs'
                    }`}
                    title="Account Login"
                  >
                    <User className="w-3.5 h-3.5 sm:hidden" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                )}
              </div>

              {/* Mobile Drawer Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation drawer"
                className={`lg:hidden p-2 rounded-full transition-colors ${
                  isTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
                }`}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. COLLECTIONS MEGA-MENU DROPDOWN (DESKTOP)                  */}
        {/*    Shows each category with small representative image        */}
        {/* ============================================================ */}
        {collectionsMegaOpen && (
          <div
            className="hidden lg:block absolute left-0 right-0 top-[72px] bg-white border-b border-neutral-200 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-200"
            onMouseEnter={() => {
              if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
              <div className="grid grid-cols-12 gap-8 items-start">
                {/* 5 Representative Category Cards Grid */}
                <div className="col-span-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <span className="text-xs font-bold  text-neutral-400">
                      Browse Fine Jewellery Categories
                    </span>
                    <Link
                      href="/shop"
                      onClick={closeMenu}
                      className="text-xs font-bold  text-black hover:text-neutral-600 flex items-center gap-1 transition-colors"
                    >
                      <span>View All Pieces ({COLLECTION_CATEGORIES.length} Categories)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-5 gap-3.5">
                    {COLLECTION_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        href={cat.href}
                        onClick={closeMenu}
                        className="group flex flex-col bg-neutral-50 hover:bg-neutral-100 rounded-2xl p-2.5 border border-neutral-200 hover:border-black transition-all duration-200 shadow-2xs hover:shadow-md"
                      >
                        {/* Small Representative Category Image */}
                        <div className="aspect-square w-full rounded-xl overflow-hidden bg-neutral-100 relative mb-2.5">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {cat.itemCountBadge && (
                            <span className="absolute top-1.5 left-1.5 bg-black/85 backdrop-blur text-white text-[8px] font-bold uppercase px-1.5 py-0.2 rounded-full">
                              {cat.itemCountBadge}
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-xs text-neutral-900 group-hover:text-black transition-colors line-clamp-1">
                          {cat.name}
                        </h4>
                        <p className="text-[10px] text-neutral-500 font-light mt-0.5 line-clamp-2 leading-tight">
                          {cat.description}
                        </p>
                      </Link>
                    ))}
                  </div>

                  {/* Metal Quick Links Bar */}
                  <div className="pt-2 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-100">
                    <span className="text-[11px] font-medium text-neutral-400">Precious Metal Options:</span>
                    <div className="flex items-center gap-3">
                      <Link
                        href="/shop?metal=silver"
                        onClick={closeMenu}
                        className="hover:text-black font-medium text-neutral-800"
                      >
                        925 Solid Sterling Silver
                      </Link>
                      <span className="text-neutral-300">•</span>
                      <Link
                        href="/shop?metal=rose-gold"
                        onClick={closeMenu}
                        className="hover:text-black font-medium text-neutral-800"
                      >
                        18K Rose Gold Vermeil
                      </Link>
                      <span className="text-neutral-300">•</span>
                      <Link
                        href="/story"
                        onClick={closeMenu}
                        className="hover:text-black font-medium text-neutral-600"
                      >
                        NGJA Certified Provenance
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Spotlight Featured Card (Monochrome Luxury Spotlight) */}
                <div className="col-span-4 bg-neutral-950 text-white rounded-2xl p-5 border border-neutral-800 shadow-xl flex flex-col justify-between">
                  <div className="relative aspect-16/10 rounded-xl overflow-hidden mb-4 border border-white/10">
                    <img
                      src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"
                      alt="Signature Ceylon Sapphire Ring"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-white text-black text-[9px] font-bold  px-2 py-0.5 rounded-full">
                      SIGNATURE CEYLON HALO
                    </span>
                  </div>

                  <div>
                    <h5 className="font-bold text-sm text-white mb-1">
                      Royal Blue Ceylon Sapphire Regal Halo Ring
                    </h5>
                    <p className="text-xs text-neutral-300 leading-relaxed font-light mb-4">
                      1.85ct unheated natural blue sapphire ethically sourced from Ratnapura alluvial riverbeds.
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="font-bold text-sm text-white">$840 AUD</span>
                      <Link
                        href="/product/royal-blue-ceylon-sapphire-regal-halo-ring"
                        onClick={closeMenu}
                        className="inline-flex items-center gap-1.5 text-xs font-bold  text-white hover:text-neutral-300 transition-colors"
                      >
                        <span>View Piece</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ============================================================ */}
      {/* 5. INTERACTIVE SEARCH MODAL                                  */}
      {/* ============================================================ */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-neutral-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <span className="text-xs font-bold  text-neutral-400">
                Search Jewellery Catalogue
              </span>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rings, necklaces, bracelets, padparadscha..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-black"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
            </form>

            <div className="pt-2 text-xs text-neutral-500 space-y-2">
              <span className="text-[10px] font-bold  text-neutral-400 block">
                Popular Searches:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Necklaces',
                  'Sapphire Rings',
                  'Engagement Rings',
                  'Bracelets',
                  'Earrings',
                  'Women Collection',
                  'Men Signets',
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSearchModalOpen(false);
                      router.push(`/shop?search=${encodeURIComponent(s)}`);
                    }}
                    className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs transition-colors cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. MOBILE NAVIGATION DRAWER (ACCORDION COLLECTIONS)          */}
      {/* ============================================================ */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-sm h-full flex flex-col justify-between overflow-y-auto p-6 space-y-6">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2"
                >
                  <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
                    <Gem className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-sm  text-black">
                    AURA<span className="text-neutral-500 font-normal">.CEYLON</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search catalogue..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-100 border border-neutral-200 text-xs focus:outline-none focus:border-black"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              </form>

              {/* Mobile Top Navigation Items */}
              <div className="space-y-2">
                {/* (A) Collections Accordion */}
                <div className="border-b border-neutral-100 pb-2">
                  <button
                    onClick={() =>
                      setMobileCollectionsAccordion(!mobileCollectionsAccordion)
                    }
                    className="w-full flex items-center justify-between py-2.5 text-xs font-bold  text-black text-left"
                  >
                    <span>Collections</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform ${mobileCollectionsAccordion ? 'rotate-180 text-black' : ''
                        }`}
                    />
                  </button>

                  {mobileCollectionsAccordion && (
                    <div className="space-y-2 pt-2 pb-2 pl-2">
                      {COLLECTION_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.id}
                          href={cat.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 transition-colors"
                        >
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-10 h-10 rounded-lg object-cover border border-neutral-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-xs text-black block">
                              {cat.name}
                            </span>
                            <span className="text-[10px] text-neutral-400 block line-clamp-1">
                              {cat.description}
                            </span>
                          </div>
                        </Link>
                      ))}

                      <Link
                        href="/shop"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block pt-2 text-xs font-bold  text-black hover:text-neutral-600 pl-2"
                      >
                        Explore All Categories →
                      </Link>
                    </div>
                  )}
                </div>

                {/* (B) Women Link */}
                <Link
                  href="/shop?gender=women"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 text-xs font-semibold  text-neutral-800 border-b border-neutral-100 hover:text-black"
                >
                  Women's Collection
                </Link>

                {/* (C) Men Link */}
                <Link
                  href="/shop?gender=men"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 text-xs font-semibold  text-neutral-800 border-b border-neutral-100 hover:text-black"
                >
                  Men's Collection
                </Link>

                {/* (D) Customize Your Jewellery - Distinct Button */}
                <Link
                  href="/customize"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block my-2 py-3 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold  text-center shadow-xs border border-black"
                >
                  Customize Your Jewellery
                </Link>

                <Link
                  href="/story"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 text-xs font-medium  text-neutral-600 border-b border-neutral-100 hover:text-black"
                >
                  Our Sourcing Story
                </Link>

                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 text-xs font-medium  text-neutral-600 border-b border-neutral-100 flex items-center justify-between hover:text-black"
                >
                  <span>My Account & Orders</span>
                  {wishlistCount > 0 && (
                    <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold">
                      {wishlistCount} Saved
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Bottom Actions inside Drawer */}
            <div className="pt-4 border-t border-neutral-200 space-y-3">
              <a
                href="https://wa.me/94771234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 text-xs font-bold  flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-neutral-800" />
                <span>WhatsApp Concierge</span>
              </a>

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-xl cursor-pointer"
                >
                  Sign Out ({user.name})
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold  text-center"
                >
                  Sign In to Account
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
