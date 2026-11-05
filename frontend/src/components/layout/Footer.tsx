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
import { CurrencySelector } from '../common/CurrencySelector';

interface FooterProps {
  onOpenStudio?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenStudio }) => {
  const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);

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
                <span className="text-[10px] text-neutral-400 font-medium  mt-1">
                  Fine Sapphire Atelier
                </span>
              </div>
            </div>

            {/* Site Description */}
            <p className="text-xs sm:text-[13px] text-neutral-400 font-light leading-relaxed max-w-sm">
              Zeyloraa is a fine jewellery atelier celebrating the timeless beauty of Ceylon sapphires and exceptional craftsmanship. Inspired by Sri Lanka's rich gemstone heritage, we create elegant, thoughtfully designed jewellery that reflects individuality, sophistication, and lasting beauty.
            </p>

            {/* Open Studio Action Button with 'Start Designing' */}
            <div className="pt-2">
              {onOpenStudio ? (
                <button
                  type="button"
                  onClick={onOpenStudio}
                  className="inline-flex items-center p-1 sm:p-1.5 rounded-full bg-[#18181b]  hover:border-neutral-500 shadow-md transition-all duration-300 cursor-pointer group active:scale-95"
                  aria-label="Start Designing - Open Studio"
                >
                  <span className="px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium tracking-wide text-white whitespace-nowrap">
                    Start Designing
                  </span>
                  <div className="px-3.5 sm:px-4 py-1.5 rounded-full bg-white text-black font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm group-hover:bg-neutral-100 transition-colors whitespace-nowrap">
                    <Gem className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black group-hover:scale-110 transition-transform" />
                    <span>Open Studio</span>
                  </div>
                </button>
              ) : (
                <Link
                  href="/customize"
                  className="inline-flex items-center p-1 sm:p-1.5 rounded-full bg-[#18181b] border border-neutral-700/80 hover:border-neutral-500 shadow-md transition-all duration-300 group active:scale-95"
                  aria-label="Start Designing - Open Studio"
                >
                  <span className="px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium tracking-wide text-white whitespace-nowrap">
                    Start Designing
                  </span>
                  <div className="px-3.5 sm:px-4 py-1.5 rounded-full bg-white text-black font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm group-hover:bg-neutral-100 transition-colors whitespace-nowrap">
                    <Gem className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black group-hover:scale-110 transition-transform" />
                    <span>Open Studio</span>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. Column: Jewellery & Stories                            */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-3.5">
            <span className="text-xs font-semibold text-white  block">
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
            <span className="text-xs font-semibold text-white  block">
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
                  Profile & Orders
                </Link>
              </li>
              
            </ul>
          </div>

        </div>

        {/* ========================================================= */}
        {/* Bottom Sub-Bar: Copyright, Currency Selector, Socials & Legal */}
        {/* ========================================================= */}
        <div className="border-t border-neutral-800/80 mt-10 sm:mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 gap-5">
          {/* Copyright & Currency Selector */}
          <div className="order-2 md:order-1 flex flex-col sm:flex-row items-center gap-4 text-center md:text-left">
            <p className="text-[11px]">
              &copy; {new Date().getFullYear()} Zeyloraa. Ethically Sourced Ceylon Sapphires. All rights reserved.
            </p>
            <div className="hidden sm:block text-neutral-700">•</div>
            <CurrencySelector variant="footer" />
          </div>

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
