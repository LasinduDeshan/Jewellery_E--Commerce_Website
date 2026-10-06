'use client';

import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';

interface WhatsAppConciergeCTAProps {
  selectedJewelleryType: string;
  selectedMetal: string;
  selectedSapphire: string;
  selectedCut: string;
}

export const WhatsAppConciergeCTA: React.FC<WhatsAppConciergeCTAProps> = ({
  selectedJewelleryType,
  selectedMetal,
  selectedSapphire,
  selectedCut,
}) => {
  const message = encodeURIComponent(
    `Hello Ceylon Jewels! I am exploring a custom piece:\n- Type: ${selectedJewelleryType}\n- Metal: ${selectedMetal}\n- Gemstone: ${selectedSapphire}\n- Cut: ${selectedCut}\nI would love to discuss ideas, stones, and pricing directly.`
  );

  return (
    <>
      {/* Floating Action Button */}
      <a
        href={`https://wa.me/94771234567?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full p-3.5 shadow-2xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 border border-emerald-400/40 group"
        title="Direct WhatsApp Concierge"
      >
        <MessageCircle className="w-6 h-6 animate-pulse" />
        <span className="hidden sm:inline-block text-xs font-semibold tracking-wider uppercase pr-1">
          WhatsApp Concierge
        </span>
      </a>
    </>
  );
};
