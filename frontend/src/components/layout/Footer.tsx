'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Gem,
  ArrowUpRight,
  Globe,
  MessageCircle,
  Mail,
  ShieldCheck,
  Check
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3500);
    }
  };

  return (
    <footer className="bg-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      {/* Floating Island Card Container */}
      <div className="max-w-7xl mx-auto bg-[#0d0d0e] text-neutral-300 rounded-[28px] sm:rounded-[36px] p-8 sm:p-12 lg:p-14 border border-neutral-800/80 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* 1. Left Section: Brand Logo, Tagline & Newsletter */}
          <div className="lg:col-span-5 space-y-6">
            {/* Brand Logo */}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-xs">
                <Gem className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-widest uppercase text-white leading-none">
                  AURA<span className="text-neutral-500 font-normal">.CEYLON</span>
                </span>
                <span className="text-[9px] tracking-widest text-neutral-400 uppercase font-medium mt-0.5">
                  Fine Sapphire Atelier
                </span>
              </div>
            </div>

            {/* Tagline */}
            <h3 className="font-cormorant text-2xl sm:text-3xl text-white font-normal leading-snug max-w-sm">
              Ethically mined Ceylon sapphires for timeless modern heirlooms.
            </h3>

            {/* Newsletter Subscription */}
            <div className="pt-2 max-w-sm space-y-2.5">
              <span className="text-xs text-neutral-400 block font-normal">
                Subscribe to our newsletter
              </span>
              <form onSubmit={handleNewsletterSubmit} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full bg-[#18181b] text-white placeholder-neutral-500 text-xs rounded-full pl-5 pr-12 py-3.5 border border-neutral-800 focus:outline-none focus:border-neutral-600 transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#27272a] hover:bg-white hover:text-black text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                >
                  {subscribed ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </button>
              </form>
              {subscribed && (
                <span className="text-[11px] text-emerald-400 block">
                  Thank you for subscribing to our atelier gazette.
                </span>
              )}
            </div>
          </div>

          {/* 2. Middle Section: Two Link Columns with Left Divider */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:border-l lg:border-neutral-800/80 lg:pl-10">
            {/* Column 1: Jewellery & Atelier */}
            <div className="space-y-4">
              <span className="text-xs font-semibold tracking-wider text-white uppercase block">
                Jewellery & Stories
              </span>
              <ul className="space-y-3 text-xs text-neutral-400">
                <li>
                  <Link href="/shop" className="hover:text-white transition-colors">
                    Ready-to-Wear Collection
                  </Link>
                </li>
                <li>
                  <Link href="/customize" className="hover:text-white transition-colors">
                    Bespoke Design Studio
                  </Link>
                </li>
                <li>
                  <Link href="/story" className="hover:text-white transition-colors">
                    Our Story & Sourcing
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-white transition-colors">
                    Shopping Bag & Checkout
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Concierge & Trust */}
            <div className="space-y-4">
              <span className="text-xs font-semibold tracking-wider text-white uppercase block">
                Concierge & Trust
              </span>
              <ul className="space-y-3 text-xs text-neutral-400">
                <li>
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    <span>Certified Ceylon (NGJA)</span>
                  </div>
                </li>
                <li>
                  <a
                    href="https://wa.me/94771234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Direct WhatsApp Concierge
                  </a>
                </li>
                <li>
                  <Link href="/account" className="hover:text-white transition-colors">
                    Client Portal & Orders
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-white transition-colors text-neutral-300 font-medium">
                    Master Admin Hub
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* 3. Right Section: Vertical Stack of Circular Social/Contact Icons */}
          <div className="lg:col-span-2 flex lg:flex-col items-center justify-start lg:justify-center lg:border-l lg:border-neutral-800/80 lg:pl-8 gap-3 sm:gap-4">
            <a
              href="https://auraceylon.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
              className="w-10 h-10 rounded-full bg-[#18181b] border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Global Atelier"
            >
              <Globe className="w-4 h-4" />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-[#18181b] border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Instagram"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>

            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-10 h-10 rounded-full bg-[#18181b] border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="WhatsApp Concierge"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <a
              href="mailto:concierge@auraceylon.com"
              aria-label="Email"
              className="w-10 h-10 rounded-full bg-[#18181b] border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Email Concierge"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Bottom Sub-Bar */}
        <div className="border-t border-neutral-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Aura Ceylon Jewels. Ethically Sourced Ceylon Sapphires. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Ratnapura & Colombo, SL</span>
            <span>•</span>
            <span>Worldwide Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
