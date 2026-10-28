'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowUpRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    currency?: string;
    stockQuantity?: number;
    description?: string;
    metal?: { type?: string; purity?: string };
    gemstone?: { type?: string; carat?: number };
    images?: { url: string; alt?: string }[];
  };
  compact?: boolean;
  onQuickAdd?: (product: any, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false, onQuickAdd }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const inWish = isInWishlist(product._id);

  // Available images with fallback
  const images =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.url)
      : ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'];

  const displayImage = images[activeImageIdx % images.length] || images[0];

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWish) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        _id: product._id,
        title: product.name,
        slug: product.slug,
        price: product.price,
        image: displayImage,
        gemstone: product.gemstone?.type || 'Ceylon Sapphire',
        metal: product.metal?.type || 'silver',
      });
    }
  };

  // Subtitle builder
  const metalLabel = product.metal?.purity || (product.metal?.type === 'rose-gold' ? '18K Rose Gold' : '925 Solid Silver');
  const gemLabel = product.gemstone?.type || 'Ceylon Sapphire';
  const subtitle = `${gemLabel} • ${metalLabel}`;

  // Description fallback
  const description =
    product.description ||
    'Hand-cut optical facets crafted by hereditary Sri Lankan lapidaries for radiant light dispersion.';

  return (
    <div
      className={`group bg-white ${
        compact
          ? 'max-w-[280px] w-full mx-auto rounded-[24px] p-3 sm:p-3.5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)]'
          : 'rounded-[32px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)]'
      } border border-neutral-100 transition-all duration-300 flex flex-col justify-between select-none`}
    >
      {/* 1. Top Image Frame */}
      <div>
        <div
          className={`relative ${
            compact ? 'aspect-[4/3] max-h-48 rounded-[18px]' : 'aspect-square rounded-[24px]'
          } bg-[#f8f8f9] overflow-hidden w-full`}
        >
          <Link href={`/product/${product.slug}`} className="block w-full h-full overflow-hidden">
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
            {product.stockQuantity !== undefined && product.stockQuantity <= 2 && (
              <span className="bg-black/90 text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                Only {product.stockQuantity} Left
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            aria-label="Toggle Wishlist"
            className={`absolute top-2 right-2 ${
              compact ? 'w-7 h-7' : 'w-8 h-8'
            } rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-xs flex items-center justify-center transition-transform active:scale-90 cursor-pointer`}
          >
            <Heart
              className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${
                inWish ? 'fill-black text-black' : 'text-neutral-700'
              }`}
            />
          </button>
        </div>

        {/* 2. Carousel Dots (Matching Reference Design) */}
        <div
          className={`flex items-center justify-center gap-1.5 ${
            compact ? 'pt-2 pb-1.5' : 'pt-3 pb-3'
          }`}
        >
          {[0, 1, 2, 3].map((dotIdx) => {
            const isActive = (activeImageIdx % 4) === dotIdx;
            return (
              <button
                key={dotIdx}
                onClick={() => setActiveImageIdx(dotIdx)}
                onMouseEnter={() => {
                  if (dotIdx < images.length) setActiveImageIdx(dotIdx);
                }}
                aria-label={`View photo angle ${dotIdx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  compact
                    ? isActive
                      ? 'w-1.5 h-1.5 bg-black'
                      : 'w-1.5 h-1.5 bg-neutral-300 hover:bg-neutral-400'
                    : isActive
                    ? 'w-2 h-2 bg-black'
                    : 'w-2 h-2 bg-neutral-300 hover:bg-neutral-400'
                }`}
              />
            );
          })}
        </div>

        {/* 3. Product Info */}
        <div className="px-1">
          {/* Title */}
          <Link href={`/product/${product.slug}`}>
            <h3
              className={`font-bold ${
                compact ? 'text-sm' : 'text-base sm:text-lg'
              } text-neutral-900 group-hover:text-black transition-colors line-clamp-1 `}
            >
              {product.name}
            </h3>
          </Link>

          {/* Subtitle */}
          <p
            className={`${
              compact ? 'text-[10px]' : 'text-xs'
            } text-neutral-400 font-normal mt-0.5 line-clamp-1`}
          >
            {subtitle}
          </p>

          {/* Short Description */}
          <p
            className={`${
              compact ? 'text-[11px] mt-1' : 'text-xs mt-2'
            } text-neutral-500 font-light line-clamp-2 leading-relaxed`}
          >
            {description}
          </p>
        </div>
      </div>

      {/* 4. Bottom Row: Price & Buy Now Button */}
      <div
        className={`${
          compact ? 'mt-3 pt-2' : 'mt-5 pt-3'
        } border-t border-neutral-100 flex items-center justify-between px-0.5`}
      >
        <div>
          <span
            className={`${
              compact ? 'text-sm' : 'text-base sm:text-lg'
            } font-bold text-neutral-900 `}
          >
            ${product.price}{' '}
            <span className="text-[10px] font-normal text-neutral-400">AUD</span>
          </span>
        </div>

        {/* Buy Now Button with Circular Arrow */}
        <Link
          href={`/product/${product.slug}`}
          className={`inline-flex items-center ${
            compact ? 'gap-1.5 pl-3 pr-1 py-1 text-[11px]' : 'gap-2 pl-4 pr-1.5 py-1.5 text-xs'
          } bg-black hover:bg-neutral-800 text-white rounded-full transition-all group/btn shadow-xs hover:scale-[1.02] cursor-pointer`}
        >
          <span className="font-semibold">Buy Now</span>
          <div
            className={`${
              compact ? 'w-5 h-5' : 'w-6 h-6'
            } rounded-full bg-white text-black flex items-center justify-center transition-transform group-hover/btn:rotate-45`}
          >
            <ArrowUpRight className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
          </div>
        </Link>
      </div>
    </div>
  );
};
