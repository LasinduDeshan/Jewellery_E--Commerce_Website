'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Star,
  ArrowLeft,
  RefreshCw,
  Check,
  X,
  Camera,
  CheckCircle2,
  AlertCircle,
  Filter,
} from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/reviews/admin?status=${filterStatus}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setReviews(data.data);
      }
    } catch (e) {
      console.warn('Using client reviews fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filterStatus]);

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
      await fetch(`${apiUrl}/reviews/admin/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
      );
    } catch (e) {
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Header */}
      <header className="bg-stone-900 text-white border-b border-stone-800 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-serif tracking-wide text-white font-medium flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                <span>Customer Reviews & Photo Moderation (Sections 5.6 & 5.8)</span>
              </h1>
              <p className="text-[11px] text-stone-400">
                Moderate buyer testimonials and verified photo uploads before live display on product detail pages.
              </p>
            </div>
          </div>

          <button
            onClick={fetchReviews}
            className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-6">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-stone-200 shadow-xs text-xs">
          <Filter className="w-4 h-4 text-stone-400 ml-2 mr-1" />
          {['all', 'pending', 'approved', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-lg font-semibold capitalize transition-colors cursor-pointer ${
                filterStatus === st
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                      rev.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rev.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {rev.status}
                  </span>
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <span className="text-[11px] text-amber-800 font-bold block mb-1">
                  {rev.productName}
                </span>

                <h4 className="font-serif text-sm font-semibold text-stone-900 mb-2">
                  "{rev.title}"
                </h4>

                <p className="text-xs text-stone-600 leading-relaxed font-light mb-4">
                  {rev.comment}
                </p>

                {/* Uploaded Customer Photos */}
                {rev.photos && rev.photos.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5 flex items-center gap-1">
                      <Camera className="w-3 h-3 text-stone-500" />
                      <span>Customer Uploaded Imagery ({rev.photos.length})</span>
                    </span>
                    <div className="flex gap-2">
                      {rev.photos.map((url: string, pIdx: number) => (
                        <a
                          key={pIdx}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="w-16 h-16 rounded-xl overflow-hidden border border-stone-200 block"
                        >
                          <img src={url} alt="Review photo" className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span className="font-semibold text-stone-700">{rev.customerName}</span>
                  <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleUpdateStatus(rev._id, 'approved')}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(rev._id, 'rejected')}
                    className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-red-50 text-red-600 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
