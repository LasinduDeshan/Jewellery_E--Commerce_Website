import React from 'react';
import Link from 'next/link';
import { Gem, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center">
              <Gem className="w-4 h-4" />
            </div>
            <span className="font-serif text-lg font-bold tracking-widest text-white uppercase">
              AURA<span className="text-amber-500 font-light">.CEYLON</span>
            </span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed mb-4">
            Bespoke natural Ceylon sapphire jewellery, ethically mined from Ratnapura and Elahera, Sri Lanka. Handcrafted by master hereditary lapidaries.
          </p>
          <div className="flex items-center gap-2 text-xs text-amber-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>Colombo & Ratnapura, Sri Lanka</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-widest text-amber-500 uppercase mb-4">
            Customization Studio
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            <li>
              <Link href="/customize" className="hover:text-white transition-colors">
                Bespoke Sapphire Rings
              </Link>
            </li>
            <li>
              <Link href="/customize" className="hover:text-white transition-colors">
                Padparadscha Pendants
              </Link>
            </li>
            <li>
              <Link href="/customize" className="hover:text-white transition-colors">
                Sapphire Birthstone Guide
              </Link>
            </li>
            <li>
              <Link href="/customize" className="hover:text-white transition-colors">
                Ceylon Cuts & Faceting
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-widest text-amber-500 uppercase mb-4">
            Concierge & Trust
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            <li className="flex items-center gap-1.5 text-stone-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Certified Ceylon Provenance</span>
            </li>
            <li>
              <a
                href="https://wa.me/94771234567"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Direct WhatsApp Hotline
              </a>
            </li>
            <li>
              <Link href="/customize" className="hover:text-white transition-colors">
                Ring & Chain Sizing Guide
              </Link>
            </li>
            <li>
              <Link href="/admin/custom-requests" className="hover:text-white transition-colors">
                Admin Custom Desk
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold tracking-widest text-amber-500 uppercase mb-4">
            Private Consultation
          </h4>
          <p className="text-xs text-stone-400 mb-4">
            Have a custom stone request or heirloom redesign in mind? Speak directly with our master gemologist.
          </p>
          <a
            href="https://wa.me/94771234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold tracking-wider uppercase transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chat via WhatsApp</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-stone-800 text-center text-xs text-stone-500">
        &copy; {new Date().getFullYear()} Aura Ceylon Jewels. Ethically Sourced Ceylon Sapphires. All rights reserved.
      </div>
    </footer>
  );
};
