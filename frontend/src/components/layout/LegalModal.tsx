'use client';

import React, { useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';

export type LegalModalType = 'terms' | 'privacy' | null;

interface LegalModalProps {
  type: LegalModalType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (type) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [type, onClose]);

  if (!type) return null;

  const isTerms = type === 'terms';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn font-sans"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        className="relative w-full max-w-3xl bg-[#141417] text-neutral-300 rounded-3xl border border-neutral-800 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-scaleUp font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Normal Sans Font, Icon Removed) */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-neutral-800/80 bg-[#18181b]/70">
          <div>
            <h3 className="font-sans text-xl sm:text-2xl text-white font-semibold tracking-tight leading-tight">
              {isTerms ? 'Terms & Conditions' : 'Privacy Policy'}
            </h3>
            <p className="text-xs text-neutral-400 font-normal mt-1">
              Zeyloraa Fine Sapphire Atelier • Effective October 2026
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content with Dark Theme Scrollbar */}
        <div
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#3f3f46 transparent',
          }}
          className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-[13px] text-neutral-300 font-normal leading-relaxed [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-700/70 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
          {isTerms ? (
            <>
              {/* Introduction */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">1. Scope & Atelier Standards</h4>
                <p>
                  Welcome to Zeyloraa. By accessing or procuring fine jewellery through our online boutique, bespoke studio, or concierge channels, you agree to comply with and be bound by the following Terms & Conditions. All pieces created by Zeyloraa adhere to strict ethical sourcing standards and are governed by Sri Lankan and Australian consumer guidelines.
                </p>
              </div>

              {/* Provenance & Certification */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">2. Provenance & Gemological Certification</h4>
                <p>
                  Every natural Ceylon sapphire incorporated into our creations is ethically extracted from alluvial deposits in Ratnapura and Elahera, Sri Lanka. Each gemstone exceeding 0.50 carats is officially tested and sealed under the purview of the National Gem and Jewellery Authority of Sri Lanka (NGJA) and accompanied by an authentic Certificate of Origin.
                </p>
              </div>

              {/* Bespoke Commissions */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">3. Bespoke Commissions & Custom Studio</h4>
                <p>
                  Custom orders initiated via our Bespoke Studio require mutual sign-off on 3D CAD renders and gemstone specifications. A 50% non-refundable deposit is required prior to lapidary cutting and metal casting. Because bespoke commissions are customized to individual client requirements, finished bespoke pieces are non-refundable once production commences.
                </p>
              </div>

              {/* Pricing & Currency */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">4. Pricing, Taxes & Payment</h4>
                <p>
                  All catalog prices are quoted in Australian Dollars (AUD) or converted in real-time according to prevailing exchange rates. We reserve the right to amend pricing in the event of major precious metal or gemstone market shifts prior to order confirmation. Payments are securely tokenized through Stripe and major credit networks.
                </p>
              </div>

              {/* Insured Transit */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">5. Insured White-Glove Delivery</h4>
                <p>
                  All shipments are fully insured during transit against theft, loss, or damage until delivered. An adult signature and government identification are mandatory upon delivery. International consignments are cleared through customs with official export seals.
                </p>
              </div>

              {/* Returns & Warranty */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">6. 30-Day Inspection & Lifetime Craftsmanship Warranty</h4>
                <p>
                  Ready-to-wear collection pieces may be returned within 30 days of delivery in pristine, unworn condition with original security tags and gemological certificates intact. We offer a lifetime warranty against manufacturing defects in setting and metal integrity.
                </p>
              </div>

              {/* Contact */}
              <div className="pt-2 border-t border-neutral-800 text-neutral-400 text-xs">
                Questions regarding our atelier terms? Reach our concierge directly at{' '}
                <a href="mailto:concierge@zeyloraa.com" className="text-white hover:underline font-medium">
                  concierge@zeyloraa.com
                </a>
                .
              </div>
            </>
          ) : (
            <>
              {/* Privacy Intro */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">1. Commitment to Client Privacy</h4>
                <p>
                  At Zeyloraa, your privacy is paramount. This Privacy Policy details how we collect, safeguard, and handle your personal data when navigating our digital atelier, requesting bespoke quotations, or acquiring fine jewellery.
                </p>
              </div>

              {/* Information Collected */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">2. Information We Collect</h4>
                <ul className="list-disc pl-5 space-y-1.5 mt-1 text-neutral-300">
                  <li><strong>Account & Contact:</strong> Full name, verified email, telephone number, and secure delivery addresses.</li>
                  <li><strong>Bespoke Inquiries:</strong> Gemstone preferences, ring sizes, design sketches, and personal milestone dates.</li>
                  <li><strong>Transaction Details:</strong> Payment tokens, purchase histories, and customs declaration documentation.</li>
                  <li><strong>Technical Usage:</strong> Device identifiers, IP addresses, and cookie preferences to ensure smooth browsing.</li>
                </ul>
              </div>

              {/* Use of Information */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">3. How Your Data Is Utilized</h4>
                <p>
                  We utilize your data exclusively to process bespoke quotes, prepare official NGJA export certificates, coordinate secure transit with our insured courier partners, and communicate atelier news if opted into our newsletter gazette. We never sell, lease, or monetize client personal data to third-party marketers.
                </p>
              </div>

              {/* Payment Security */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">4. Payment Security & Encryption</h4>
                <p>
                  All digital transactions are encrypted via industry-standard TLS 1.3 cryptographic protocols. Payment card numbers are processed directly by PCI-DSS Level 1 certified gateway providers (Stripe/PayPal) and are never stored on our web servers.
                </p>
              </div>

              {/* Cookies */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">5. Cookies & Local Storage</h4>
                <p>
                  We utilize essential cookies solely to maintain your shopping cart, preserve your selected currency preferences, and retain your active session. You can manage or block cookies in your browser settings without affecting core browsing.
                </p>
              </div>

              {/* Your Rights */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-2">6. Your Rights & Data Requests</h4>
                <p>
                  You have the right to request a complete export of your personal data or request deletion of your client profile at any time. Simply submit your request to our data protection officer at{' '}
                  <a href="mailto:privacy@zeyloraa.com" className="text-white hover:underline font-medium">
                    privacy@zeyloraa.com
                  </a>
                  .
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Action */}
        <div className="px-6 sm:px-8 py-4 border-t border-neutral-800 bg-[#18181b]/70 flex items-center justify-between font-sans">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Zeyloraa Atelier Document</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
