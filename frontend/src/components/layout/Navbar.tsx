'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, MessageCircle, Menu, X, Shield, Gem } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Link href="/admin/custom-requests" className="hover:text-amber-600 transition-colors flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-stone-400" />
              <span>Admin Desk</span>
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-4">
            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            <Link
              href="/customize#customization-form-section"
              className="px-5 py-2.5 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm"
            >
              Request Quote
            </Link>
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
              href="/admin/custom-requests"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded"
            >
              🛡️ Admin Custom Requests
            </Link>
            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded"
            >
              💬 WhatsApp Concierge
            </a>
          </div>
        )}
      </div>
    </header>
  );
};
