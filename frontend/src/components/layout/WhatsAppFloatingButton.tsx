'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);

  // Show a gentle reassuring tooltip after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Hide on admin portal routes
  if (pathname?.startsWith('/admin')) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 select-none">
      {/* Reassurance Trust Tooltip */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2.5 bg-white text-neutral-800 text-xs px-4 py-2.5 rounded-2xl shadow-2xl border border-neutral-200/90 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          <p className="font-medium text-[11px] leading-tight text-neutral-800">
            Questions about Ceylon sapphire cuts or bespoke pieces? Chat with our team.
          </p>
          <button
            onClick={() => setShowTooltip(false)}
            aria-label="Dismiss chat tooltip"
            className="text-neutral-400 hover:text-neutral-700 p-0.5 ml-1 cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button with /img/social.png */}
      <a
        href="https://wa.me/94771234567?text=Hello%20Zeyloraa!%20I%20would%20like%20to%20inquire%20about%20your%20Ceylon%20sapphire%20jewellery."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Ceylon Lapidary Concierge on WhatsApp"
        className="relative flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-full"
        title="Chat on WhatsApp"
      >
        <img
          src="/img/social.png"
          alt="WhatsApp Concierge"
          className="w-11 h-11 sm:w-12 sm:h-12 object-contain drop-shadow-[0_4px_12px_rgba(37,211,102,0.35)] hover:drop-shadow-[0_6px_16px_rgba(37,211,102,0.5)] transition-all duration-300"
        />
      </a>
    </div>
  );
};
