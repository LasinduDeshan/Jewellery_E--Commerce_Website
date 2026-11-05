'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, CurrencyCode } from '../../context/CurrencyContext';
import { Globe, ChevronDown, Check, RefreshCw } from 'lucide-react';

interface CurrencySelectorProps {
  variant?: 'navbar' | 'footer' | 'admin' | 'mobile';
  isTransparent?: boolean;
  className?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  variant = 'navbar',
  isTransparent = false,
  className = '',
}) => {
  const {
    currency,
    setCurrency,
    currencyInfo,
    availableCurrencies,
    ratesSource,
    ratesLoading,
    refreshRates,
  } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectCurrency = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
  };

  // 1. Variant: Navbar
  if (variant === 'navbar') {
    return (
      <div className={`relative ${className}`} ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={`Currency selector, currently ${currency}`}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            isTransparent
              ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200/80'
          }`}
        >
          <span className="text-sm leading-none">{currencyInfo.flag}</span>
          <span className="font-bold tracking-tight">{currencyInfo.code}</span>
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            } ${isTransparent ? 'text-white/70' : 'text-neutral-500'}`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/95 backdrop-blur-xl border border-neutral-200 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3.5 py-1.5 border-b border-neutral-100 flex items-center justify-between text-[10px] font-bold text-neutral-400 ">
              <span>Select Currency</span>
              
            </div>

            <div className="max-h-64 overflow-y-auto py-1 divide-y divide-neutral-50 custom-scrollbar pr-1">
              {availableCurrencies.map((c) => {
                const isActive = c.code === currency;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => selectCurrency(c.code)}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-neutral-100 text-black font-bold'
                        : 'text-neutral-700 hover:bg-neutral-50 hover:text-black'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{c.flag}</span>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs leading-tight">
                          {c.code} ({c.symbol.trim()})
                        </span>
                        <span className="text-[10px] text-neutral-400 leading-tight">
                          {c.label} {c.code !== 'AUD' && `• 1 AUD ≈ ${c.rate < 1 ? c.rate.toFixed(3) : c.rate.toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 text-black shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="px-3.5 py-1.5 border-t border-neutral-100 bg-neutral-50/80 rounded-b-2xl text-[9px] text-neutral-400 flex items-center justify-between">
              <span>Rates by ExchangeRate-API</span>
              <button
                type="button"
                onClick={() => refreshRates()}
                className="hover:text-black transition-colors flex items-center gap-1 text-[9px] cursor-pointer"
                title="Refresh rates"
              >
                <RefreshCw className={`w-2.5 h-2.5 ${ratesLoading ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Variant: Footer
  if (variant === 'footer') {
    return (
      <div className={`relative ${className}`} ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={`Currency selector, currently ${currency}`}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#18181b] border border-neutral-700/80 hover:border-neutral-500 text-neutral-200 text-xs font-medium transition-all duration-300 cursor-pointer shadow-md"
        >
          <Globe className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-sm leading-none">{currencyInfo.flag}</span>
          <span className="font-semibold text-white tracking-wide">{currencyInfo.code}</span>
          <span className="text-neutral-400 font-mono text-[11px]">({currencyInfo.symbol.trim()})</span>
          <ChevronDown
            className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 sm:right-0 bottom-full mb-2 w-64 rounded-2xl bg-[#18181b]  shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3.5 py-1.5 border-b border-neutral-800 flex items-center justify-between text-[10px] font-bold text-neutral-400 ">
              <span>ExchangeRate</span>
              
            </div>

            <div className="max-h-64 overflow-y-auto py-1 divide-y divide-neutral-800/60 custom-scrollbar-dark pr-1">
              {availableCurrencies.map((c) => {
                const isActive = c.code === currency;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => selectCurrency(c.code)}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-neutral-800 text-white font-bold'
                        : 'text-neutral-300 hover:bg-neutral-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{c.flag}</span>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs leading-tight text-white">
                          {c.code} ({c.symbol.trim()})
                        </span>
                        <span className="text-[10px] text-neutral-400 leading-tight">
                          {c.label} {c.code !== 'AUD' && `• 1 AUD ≈ ${c.rate < 1 ? c.rate.toFixed(3) : c.rate.toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="px-3.5 py-1.5 border-t border-neutral-800 text-[9px] text-neutral-500 flex items-center justify-between">
              <span>ExchangeRate-API</span>
              <span>Accurate Global Rates</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Variant: Admin Panel
  if (variant === 'admin') {
    return (
      <div className={`relative ${className}`} ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={`Admin currency view, currently ${currency}`}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200/90 hover:border-black transition-all shadow-2xs cursor-pointer text-xs"
        >
          <span className="text-sm leading-none">{currencyInfo.flag}</span>
          <span className="font-bold text-neutral-900">{currencyInfo.code}</span>
          <span className="text-neutral-400 text-[11px]">({currencyInfo.symbol.trim()})</span>
          <ChevronDown
            className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-neutral-200/90 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3.5 py-1.5 border-b border-neutral-100 flex items-center justify-between text-[10px] font-bold text-neutral-400 ">
              <span>ExchangeRate</span>
              <button
                type="button"
                onClick={() => refreshRates()}
                className="hover:text-black flex items-center gap-1 text-[9px] text-neutral-500 cursor-pointer"
                title="Refresh rates"
              >
                <RefreshCw className={`w-2.5 h-2.5 ${ratesLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto py-1 divide-y divide-neutral-50 custom-scrollbar pr-1">
              {availableCurrencies.map((c) => {
                const isActive = c.code === currency;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => selectCurrency(c.code)}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-neutral-100 text-black font-bold'
                        : 'text-neutral-700 hover:bg-neutral-50 hover:text-black'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{c.flag}</span>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs leading-tight">
                          {c.code} ({c.symbol.trim()})
                        </span>
                        <span className="text-[10px] text-neutral-400 leading-tight">
                          {c.label} {c.code !== 'AUD' && `• 1 AUD ≈ ${c.rate < 1 ? c.rate.toFixed(3) : c.rate.toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 text-black shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 4. Variant: Mobile Drawer
  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-100 border border-neutral-200">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-neutral-500" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-neutral-700">Currency</span>
            <span className="text-[9px] text-neutral-400">ExchangeRate</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="bg-white border border-neutral-300 rounded-xl px-2.5 py-1 text-xs font-bold text-neutral-800 cursor-pointer focus:outline-none focus:border-black"
          >
            {availableCurrencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code} ({c.symbol.trim()})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
