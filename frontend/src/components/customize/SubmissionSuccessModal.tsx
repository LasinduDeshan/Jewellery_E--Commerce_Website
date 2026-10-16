'use client';

import React from 'react';
import { CheckCircle2, MessageCircle, Copy, Check, ArrowRight } from 'lucide-react';

interface SubmissionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  customerName: string;
  email: string;
  jewellerySummary: {
    type: string;
    metal: string;
    sapphire: string;
    cut: string;
  };
}

export const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({
  isOpen,
  onClose,
  ticketId,
  customerName,
  email,
  jewellerySummary,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Ceylon Jewels Concierge, I just submitted custom request #${ticketId} for a ${jewellerySummary.metal} ${jewellerySummary.type} featuring a ${jewellerySummary.sapphire} (${jewellerySummary.cut}). Looking forward to discussing the quote!`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-neutral-200 text-center relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-black" />

        <div className="w-16 h-16 bg-neutral-100 text-neutral-900 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner border border-neutral-200">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-xs font-semibold tracking-widest uppercase text-neutral-500">
          Request Confirmed
        </span>
        <h3 className="text-3xl font-cormorant text-neutral-900 mt-1 font-normal">
          Thank You, {customerName}!
        </h3>

        <p className="mt-3 text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
          Your custom sapphire request has been logged in our bespoke atelier system. A confirmation receipt has been sent to <strong className="text-neutral-900">{email}</strong>.
        </p>

        {/* Ticket ID Box */}
        <div className="my-6 p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[11px] text-neutral-500 uppercase tracking-wider block">
              Your Reference Ticket ID
            </span>
            <span className="text-base font-mono font-bold text-neutral-900">
              {ticketId}
            </span>
          </div>
          <button
            onClick={handleCopyTicket}
            className="px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 rounded-md text-xs font-medium text-neutral-700 flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-neutral-900" />
                <span className="text-neutral-900 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-500" />
                <span>Copy ID</span>
              </>
            )}
          </button>
        </div>

        {/* Next Steps List */}
        <div className="text-left text-xs text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-6 space-y-2">
          <div className="font-semibold text-neutral-900 text-sm mb-1">What Happens Next?</div>
          <p>1. <strong>Gem Sourcing:</strong> Our master gemologist reviews our Ceylon rough vault for matching stones.</p>
          <p>2. <strong>Quote & Renders:</strong> We will prepare a transparent price quote and 3D preview within <strong>24–48 business hours</strong>.</p>
          <p>3. <strong>Approval:</strong> No payment is required until you are 100% in love with the gemstone and CAD design.</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href={`https://wa.me/94771234567?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-md bg-neutral-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat Directly on WhatsApp with Reference #{ticketId}</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Close & Return to Studio
          </button>
        </div>
      </div>
    </div>
  );
};
