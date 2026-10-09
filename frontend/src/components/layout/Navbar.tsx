'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
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
  Truck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center shadow-sm">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-widest uppercase text-stone-950 block leading-none">
                AURA<span className="text-amber-600 font-light">.CEYLON</span>
              </span>
              <span className="text-[9px] tracking-widest text-stone-400 uppercase">
                Fine Sapphire Atelier
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-wider uppercase text-stone-700">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <Link
              href="/customize"
              className="text-amber-700 font-bold flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-amber-50 border border-amber-200/80 hover:bg-amber-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Customize Jewellery</span>
            </Link>
            <Link
              href="/admin/custom-requests"
              className="hover:text-amber-600 transition-colors flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-stone-400" />
              <span>Admin Desk</span>
            </Link>
          </nav>

          {/* Right Action Icons & Account Area */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* Wishlist Link with Badge */}
            <Link
              href="/account"
              className="relative p-2 rounded-full hover:bg-stone-100 text-stone-700 hover:text-amber-700 transition-colors"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* WhatsApp Direct Link */}
            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* User Account Dropdown / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-stone-500" />
                </button>

                {userDropdownOpen && (
                  <div
                    onClick={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 text-xs text-stone-700"
                  >
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="font-semibold text-stone-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-stone-400 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/account"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50 text-stone-700"
                    >
                      <User className="w-3.5 h-3.5 text-amber-700" />
                      <span>My Client Portal</span>
                    </Link>

                    <Link
                      href="/account"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50 text-stone-700"
                    >
                      <Package className="w-3.5 h-3.5 text-amber-700" />
                      <span>Orders & Tracking</span>
                    </Link>

                    <Link
                      href="/account"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50 text-stone-700"
                    >
                      <Heart className="w-3.5 h-3.5 text-pink-600" />
                      <span>Wishlist ({wishlistCount})</span>
                    </Link>

                    {/* Admin Access Links */}
                    <div className="border-t border-stone-100 my-1"></div>
                    <Link
                      href="/admin/orders"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-amber-50 text-amber-900 font-medium"
                    >
                      <Truck className="w-3.5 h-3.5 text-amber-600" />
                      <span>Fulfilment & Shipping (5.4)</span>
                    </Link>
                    <Link
                      href="/admin/custom-requests"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-amber-50 text-amber-900 font-medium"
                    >
                      <Shield className="w-3.5 h-3.5 text-amber-600" />
                      <span>Custom Sapphire Desk</span>
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 border-t border-stone-100 mt-1 cursor-pointer"
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
                className="px-4 py-2 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-stone-700 hover:text-stone-950"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded"
            >
              Home
            </Link>
            <Link
              href="/customize"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-amber-700 bg-amber-50 rounded"
            >
              ✨ Customize Jewellery Studio
            </Link>
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded flex items-center justify-between"
            >
              <span>👤 My Account & Orders</span>
              {wishlistCount > 0 && (
                <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded-full font-bold">
                  {wishlistCount} Wishlist
                </span>
              )}
            </Link>
            <Link
              href="/admin/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-amber-600" />
              <span>📦 Orders & Shipping (5.4)</span>
            </Link>
            <Link
              href="/admin/custom-requests"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-amber-600" />
              <span>💎 Admin Custom Desk</span>
            </Link>
            {!user ? (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-white bg-stone-900 rounded text-center"
              >
                Sign In to Account
              </Link>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded"
              >
                Sign Out ({user.name})
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
