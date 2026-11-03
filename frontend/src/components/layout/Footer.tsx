'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Gem,
  ArrowUpRight,
  MessageCircle,
  Mail,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { LegalModal, LegalModalType } from './LegalModal';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3500);
    }
  };

  return (
    <footer className="w-full bg-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      {/* Floating Island Card with balanced, elegant width */}
      <div className="w-full max-w-7xl mx-auto bg-[#111113] text-neutral-300 rounded-[28px] sm:rounded-[36px] p-8 sm:p-10 lg:p-12 xl:p-14 border border-neutral-800/80 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ========================================================= */}
          {/* 1. Brand Identity, Site Description & Gazette Subscription*/}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-5">
            {/* Brand Logo & Atelier Label */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-xs">
                <Gem className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base text-white leading-none tracking-tight">
                  Zeyloraa
                </span>
                <span className="text-[10px] text-neutral-400 font-medium tracking-wider uppercase mt-1">
                  Fine Sapphire Atelier
                </span>
              </div>
            </div>

            {/* Site Description */}
            <p className="text-xs sm:text-[13px] text-neutral-400 font-light leading-relaxed max-w-sm">
              Zeyloraa is a fine jewellery atelier dedicated to ethically unearthed Ceylon sapphires and bespoke modern heirlooms. Handcrafted by master Sri Lankan lapidaries and certified by the National Gem and Jewellery Authority.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-1 max-w-sm space-y-2">
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
                  className="w-full bg-[#18181b] text-white placeholder-neutral-500 text-xs rounded-full pl-5 pr-12 py-3 border border-neutral-800 focus:outline-none focus:border-neutral-600 transition-colors"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#27272a] hover:bg-white hover:text-black text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                >
                  {subscribed ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5" />
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

          {/* ========================================================= */}
          {/* 2. Column: Jewellery & Stories                            */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-3.5">
            <span className="text-xs font-semibold text-white uppercase tracking-wider block">
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

          {/* ========================================================= */}
          {/* 3. Column: Concierge & Trust                              */}
          {/* ========================================================= */}
          <div className="lg:col-span-3 space-y-3.5">
            <span className="text-xs font-semibold text-white uppercase tracking-wider block">
              Concierge & Trust
            </span>
            <ul className="space-y-3 text-xs text-neutral-400">
              <li>
                <div className="flex items-center gap-1.5 text-neutral-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />
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

        {/* ========================================================= */}
        {/* Bottom Sub-Bar: Copyright, Horizontal Socials, Legal Links */}
        {/* ========================================================= */}
        <div className="border-t border-neutral-800/80 mt-10 sm:mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 gap-5">
          {/* Copyright */}
          <p className="order-2 md:order-1 text-center md:text-left text-[11px]">
            &copy; {new Date().getFullYear()} Zeyloraa. Ethically Sourced Ceylon Sapphires. All rights reserved.
          </p>

          {/* Horizontal Social Media Icons */}
          <div className="order-1 md:order-2 flex items-center gap-5 text-neutral-400">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-white transition-colors"
              title="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-white transition-colors"
              title="Instagram"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hover:text-white transition-colors"
              title="WhatsApp Concierge"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* Email */}
            <a
              href="mailto:concierge@zeyloraa.com"
              aria-label="Email"
              className="hover:text-white transition-colors"
              title="Email Concierge"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          {/* Legal Popups Trigger (Terms & Conditions / Privacy Policy) */}
          <div className="order-3 flex items-center gap-3 text-neutral-400 text-[11px]">
            <button
              type="button"
              onClick={() => setLegalModalType('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
            <span className="text-neutral-600">•</span>
            <button
              type="button"
              onClick={() => setLegalModalType('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>

      {/* Terms & Privacy Popup Modal Card */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </footer>
  );
};
