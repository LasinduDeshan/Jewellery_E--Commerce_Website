'use client';

import React from 'react';
import { X, Ruler, HelpCircle } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  jewelleryType: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  jewelleryType,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center gap-2.5">
            <Ruler className="w-5 h-5 text-neutral-900" />
            <h3 className="text-2xl font-cormorant text-neutral-900 font-normal">
              Jewellery Sizing Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Ring Sizing Chart */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-900 mb-3">
              Standard Ring Size Chart (US / UK / Diameter)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-neutral-200 rounded-lg overflow-hidden">
                <thead className="bg-neutral-100 text-neutral-800">
                  <tr>
                    <th className="p-2.5 font-semibold">US Size</th>
                    <th className="p-2.5 font-semibold">UK / AU Size</th>
                    <th className="p-2.5 font-semibold">EU Size</th>
                    <th className="p-2.5 font-semibold">Inside Diameter (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-neutral-600">
                  <tr><td className="p-2.5 font-medium text-neutral-900">US 4</td><td className="p-2.5">H 1/2</td><td className="p-2.5">47</td><td className="p-2.5">14.9 mm</td></tr>
                  <tr><td className="p-2.5 font-medium text-neutral-900">US 5</td><td className="p-2.5">J 1/2</td><td className="p-2.5">49</td><td className="p-2.5">15.7 mm</td></tr>
                  <tr><td className="p-2.5 font-medium text-neutral-900">US 6</td><td className="p-2.5">L 1/2</td><td className="p-2.5">52</td><td className="p-2.5">16.5 mm</td></tr>
                  <tr><td className="p-2.5 font-medium text-neutral-900">US 7 (Standard)</td><td className="p-2.5">N 1/2</td><td className="p-2.5">54</td><td className="p-2.5">17.3 mm</td></tr>
                  <tr><td className="p-2.5 font-medium text-neutral-900">US 8</td><td className="p-2.5">P 1/2</td><td className="p-2.5">57</td><td className="p-2.5">18.1 mm</td></tr>
                  <tr><td className="p-2.5 font-medium text-neutral-900">US 9</td><td className="p-2.5">R 1/2</td><td className="p-2.5">59</td><td className="p-2.5">19.0 mm</td></tr>
                  <tr><td className="p-2.5 font-medium text-neutral-900">US 10</td><td className="p-2.5">T 1/2</td><td className="p-2.5">62</td><td className="p-2.5">19.8 mm</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Necklace Length Guide */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-900 mb-3">
              Necklace & Chain Length Reference
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-600">
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="font-bold text-neutral-900">16 inches (40 cm):</span> Collar/Choker length, rests right above the collarbone.
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="font-bold text-neutral-900">18 inches (45 cm):</span> Princess length (most popular), sits elegantly on the collarbone.
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="font-bold text-neutral-900">20 inches (50 cm):</span> Matinee length, drops a few inches below collarbone.
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <span className="font-bold text-neutral-900">24 inches (60 cm):</span> Opera length, ideal for prominent statement pendants.
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex items-start gap-3 text-xs text-neutral-800">
            <HelpCircle className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
            <p>
              <strong>Not sure about the exact size?</strong> No problem! You can leave the size field blank or request a complimentary physical ring sizer during your design consultation.
            </p>
          </div>
        </div>

        <div className="p-4 bg-neutral-50 border-t border-neutral-200 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-[11px] font-semibold transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
