'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Star,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export interface ReviewItem {
  _id: string;
  rating: number;
  comment: string;
  title?: string;
  photos?: string[];
  createdAt?: string;
  customerName: string;
  avatarUrl?: string;
  location?: string;
  timeAgo?: string;
  productName: string;
  productSlug?: string;
  productImage?: string;
  verifiedPurchase?: boolean;
}

interface ApiReviewResponse {
  _id: string;
  rating?: number;
  comment: string;
  title?: string;
  customerName?: string;
  avatarUrl?: string;
  productName?: string;
  productSlug?: string;
  productImage?: string;
  createdAt?: string;
}

const FALLBACK_REVIEWS: ReviewItem[] = [
  {
    _id: 'seed-rev-1',
    customerName: 'Karan Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    location: 'London, United Kingdom',
    timeAgo: '1 week ago',
    rating: 5,
    title: 'Mesmerizing cornflower blue hue',
    comment:
      'My buying experience is so nice, and received me very politely. The sapphire quality is truly exceptional with vivid optical clarity. I never experienced such royal brilliance and bespoke service.',
    productName: 'Royal Blue Ceylon Sapphire Regal Halo Ring',
    productSlug: 'royal-blue-ceylon-sapphire-regal-halo-ring',
    productImage:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80',
    verifiedPurchase: true,
    createdAt: '2026-10-24T10:00:00.000Z',
  },
  {
    _id: 'seed-rev-2',
    customerName: 'Catherine Miller',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    location: 'New York, United States',
    timeAgo: '10 days ago',
    rating: 5,
    title: 'Bespoke Padparadscha perfection',
    comment:
      'I love my Ceylon jewellery and the customer service is excellent. They respond in a timely manner with loads of gemstone certification and direct mine provenance information. Outstanding craftsmanship.',
    productName: 'Padparadscha Lotus Blossom Pendant',
    productSlug: 'padparadscha-lotus-blossom-pendant',
    productImage:
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
    verifiedPurchase: true,
    createdAt: '2026-10-21T14:30:00.000Z',
  },
  {
    _id: 'seed-rev-3',
    customerName: 'Peter Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    location: 'Geneva, Switzerland',
    timeAgo: '2 weeks ago',
    rating: 5,
    title: 'Exquisite rose gold atelier finish',
    comment:
      'Visited the atelier collection. Products and custom settings looked sturdy and pristine. We took time discussing customization and went over all the Ceylon sapphire options. Extremely satisfied with our heirloom.',
    productName: 'Ceylon Sapphire Rose Gold Pendant',
    productSlug: 'ceylon-sapphire-rose-gold-pendant',
    productImage:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=80',
    verifiedPurchase: true,
    createdAt: '2026-10-17T08:15:00.000Z',
  },
  {
    _id: 'seed-rev-4',
    customerName: 'Aurelia Thornton',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    location: 'Dubai, UAE',
    timeAgo: '3 weeks ago',
    rating: 5,
    title: 'Unrivaled Sri Lankan craftsmanship',
    comment:
      'Having inspected gemstones globally, holding this unheated Ceylon sapphire felt truly magical. Master lapidary cut that unlocks breathtaking natural light. Exceeded every expectation.',
    productName: 'Cornflower Blue Sapphire Eternity Ring',
    productSlug: 'cornflower-blue-sapphire-eternity-ring',
    productImage:
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=400&q=80',
    verifiedPurchase: true,
    createdAt: '2026-10-10T16:45:00.000Z',
  },
];

export function LatestReviewsSection() {
  const [reviews, setReviews] = useState<ReviewItem[]>(FALLBACK_REVIEWS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const fetchLatestApprovedReviews = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/reviews/latest?limit=8`);
        const json = await res.json();

        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const liveReviews: ReviewItem[] = (json.data as ApiReviewResponse[]).map(
            (r, idx: number) => ({
              _id: r._id,
              rating: r.rating || 5,
              comment: r.comment,
              title: r.title,
              customerName: r.customerName || 'Verified Patron',
              avatarUrl:
                r.avatarUrl ||
                FALLBACK_REVIEWS[idx % FALLBACK_REVIEWS.length]?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              timeAgo: r.createdAt ? formatTimeAgo(r.createdAt) : 'Recently',
              productName: r.productName || 'Royal Ceylon Sapphire',
              productSlug: r.productSlug || '',
              productImage: r.productImage || '',
              verifiedPurchase: true,
              createdAt: r.createdAt,
            })
          );

          const combined = [...liveReviews];
          FALLBACK_REVIEWS.forEach((fb) => {
            if (!combined.some((c) => c._id === fb._id || c.comment === fb.comment)) {
              combined.push(fb);
            }
          });
          setReviews(combined);
        }
      } catch {
        // Fallback reviews stay in place
      }
    };

    fetchLatestApprovedReviews();
  }, []);

  const totalReviews = reviews.length;
  const maxIndex = Math.max(0, totalReviews - 1);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const progressPercent = totalReviews > 1 ? (currentIndex / (totalReviews - 1)) * 100 : 0;

  return (
    <section className="py-20 sm:py-24 bg-white text-neutral-900 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* TOP HEADER: Centered title & Trustpilot rating badge      */}
        {/* ========================================================= */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight text-neutral-900 leading-tight">
            Read reviews, <br />
            Made to Make You Shine.
          </h2>

          {/* Rating Summary Line */}
          <div className="inline-flex items-center justify-center gap-2.5 text-xs sm:text-sm text-neutral-600 font-medium">
            <span className="font-semibold text-neutral-900 text-sm sm:text-base">4.9/5</span>

            {/* 5 Golden Yellow Amber Stars */}
            <div className="inline-flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>

           
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN SECTION: Left Quote & Controls + Right Cards Slider  */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Quotation mark, Heading & Slider Navigation */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col justify-between self-stretch pr-0 lg:pr-4">
            <div className="space-y-4">
              {/* Giant Soft Grey Quotation Mark (Exact as screenshot) */}
              <svg
                className="w-16 h-16 sm:w-20 sm:h-20 text-neutral-300 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>

              {/* Bold 3-line heading */}
              <h3 className="text-2xl sm:text-3xl font-sans font-bold text-neutral-900 leading-snug">
                What our <br />
                customers are <br />
                saying
              </h3>
            </div>

            {/* Slider Navigation Bar: [ ← ] ──[■]── [ → ] */}
            <div className="flex items-center gap-4 pt-10 lg:pt-16">
              {/* Prev Button */}
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-1 text-neutral-900 hover:text-neutral-600 disabled:opacity-25 disabled:cursor-not-allowed transition-opacity cursor-pointer"
                aria-label="Previous review"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
              </button>

              {/* Slider Track Line with Interactive Indicator */}
              <div className="w-24 sm:w-28 h-[3px] bg-neutral-200 rounded-full relative overflow-hidden">
                <div
                  className="h-full bg-neutral-900 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${Math.max(25, 100 / totalReviews)}%`,
                    transform: `translateX(${(progressPercent * (100 - Math.max(25, 100 / totalReviews))) / 100}%)`,
                  }}
                />
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="p-1 text-neutral-900 hover:text-neutral-600 disabled:opacity-25 disabled:cursor-not-allowed transition-opacity cursor-pointer"
                aria-label="Next review"
              >
                <ArrowRight className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Speech-Bubble Review Cards Slider */}
          <div className="lg:col-span-8 xl:col-span-9 overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * 340}px)`,
              }}
            >
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="w-[300px] sm:w-[330px] md:w-[340px] shrink-0 flex flex-col"
                >
                  {/* SPEECH BUBBLE CARD */}
                  <div className="relative bg-white rounded-2xl p-6 sm:p-7 border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] min-h-[220px] sm:min-h-[230px] flex flex-col justify-between">
                    {/* Review Comment Text */}
                    <p className="text-xs sm:text-[13px] text-neutral-700 leading-relaxed font-normal">
                      {rev.comment}
                    </p>

                    {/* Green Star Ratings (Exactly like Trustpilot in the screenshot) */}
                    <div className="pt-4 flex items-center gap-1">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>

                    {/* Downward Pointer / Speech Bubble Tail */}
                    <div
                      className="absolute -bottom-2 left-8 w-4 h-4 bg-white border-r border-b border-neutral-100 rotate-45"
                      aria-hidden="true"
                    />
                  </div>

                  {/* CUSTOMER META: Avatar + Name + Time Ago */}
                  <div className="mt-5 pl-2 flex items-center gap-3">
                    <img
                      src={rev.avatarUrl}
                      alt={rev.customerName}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight truncate">
                        {rev.customerName}
                      </h4>
                      <p className="text-[11px] text-neutral-400 font-light truncate">
                        {rev.timeAgo || rev.location || 'Verified Buyer'}
                      </p>
                    </div>
                  </div>

                  {/* PRESERVED DETAILS: Acquired Jewellery Piece Pill */}
                  {rev.productName && (
                    <div className="mt-3 pl-2">
                      <Link
                        href={rev.productSlug ? `/product/${rev.productSlug}` : '/shop'}
                        className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/70 transition-colors text-neutral-700 max-w-full"
                        title={rev.productName}
                      >
                        {rev.productImage ? (
                          <img
                            src={rev.productImage}
                            alt={rev.productName}
                            className="w-5 h-5 rounded-md object-cover shrink-0"
                          />
                        ) : null}
                        <span className="text-[11px] font-medium truncate max-w-[200px]">
                          {rev.productName}
                        </span>
                        <ExternalLink className="w-3 h-3 text-neutral-400 shrink-0" />
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatTimeAgo(dateString: string): string {
  try {
    const diff = Date.now() - new Date(dateString).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 14) return '1 week ago';
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  } catch {
    return 'Recently';
  }
}
