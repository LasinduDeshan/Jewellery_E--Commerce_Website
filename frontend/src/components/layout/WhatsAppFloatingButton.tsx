'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Show a gentle reassuring tooltip after 4 seconds to build trust
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end gap-3 select-none">
      {/* Reassurance Trust Tooltip */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-stone-800 text-xs px-3.5 py-2.5 rounded-2xl shadow-xl border border-stone-200/90 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <p className="font-medium text-[11px] leading-tight">
            Questions about sapphire cuts or custom orders? Chat with our lapidary team.
          </p>
          <button
            onClick={() => setShowTooltip(false)}
            aria-label="Dismiss chat tooltip"
            className="text-stone-400 hover:text-stone-700 p-0.5 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href="https://wa.me/94771234567"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Ceylon Lapidary Concierge on WhatsApp"
        className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 group relative border-2 border-white"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current text-white" />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-300 rounded-full border-2 border-white" />
      </a>
    </div>
  );
};
