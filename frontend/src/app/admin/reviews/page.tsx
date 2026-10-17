'use client';

import React, { useState, useEffect } from 'react';
import {
  Star,
  RefreshCw,
  Check,
  X,
  Camera,
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
    <div className="space-y-6 max-w-7xl w-full">
      {/* Top Filter and Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-neutral-200/90 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <div className="flex items-center gap-1.5 pl-2 pr-3 text-neutral-400 border-r border-neutral-100 mr-1 text-xs">
            <Filter className="w-3.5 h-3.5" />
            <span className="text-xs text-neutral-400 font-medium">Filter</span>
          </div>
          {['all', 'pending', 'approved', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs text-neutral-400 font-light">
            Showing <strong className="text-black font-semibold">{reviews.length}</strong> reviews
          </span>
          <button
            onClick={fetchReviews}
            className="p-2 rounded-full border border-neutral-200/90 hover:border-black text-neutral-500 hover:text-black transition-colors shadow-2xs cursor-pointer"
            title="Refresh Reviews"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-neutral-200/90 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
            <Star className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-black">No reviews found</h3>
          <p className="text-xs text-neutral-400 font-light max-w-sm mx-auto">
            There are currently no reviews matching the status &quot;{filterStatus}&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-2xs flex flex-col justify-between space-y-5 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-medium text-xs capitalize ${
                      rev.status === 'approved'
                        ? 'bg-neutral-900 text-white'
                        : rev.status === 'rejected'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                    }`}
                  >
                    {rev.status}
                  </span>
                  <div className="flex gap-0.5 text-neutral-800">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-black text-black" />
                    ))}
                  </div>
                </div>

                <span className="text-xs text-neutral-400 font-normal block mb-1">
                  {rev.productName || 'Royal Blue Ceylon Sapphire'}
                </span>

                <h4 className="text-sm font-semibold text-black mb-2">
                  &ldquo;{rev.title || 'Exquisite Ceylon Craftsmanship'}&rdquo;
                </h4>

                <p className="text-xs text-neutral-600 leading-relaxed font-light mb-4">
                  {rev.comment}
                </p>

                {/* Uploaded Customer Photos */}
                {rev.photos && rev.photos.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-neutral-500 block mb-2 flex items-center gap-1.5">
                      <Camera className="w-3 h-3 text-neutral-500" />
                      <span>Customer Uploaded Imagery ({rev.photos.length})</span>
                    </span>
                    <div className="flex gap-2">
                      {rev.photos.map((url: string, pIdx: number) => (
                        <a
                          key={pIdx}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="w-16 h-16 rounded-xl overflow-hidden border border-neutral-200/90 block hover:border-black transition-colors"
                        >
                          <img src={url} alt="Review photo" className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3.5 border-t border-neutral-100 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="font-medium text-black">{rev.customerName || 'Verified Buyer'}</span>
                  <span>{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}</span>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleUpdateStatus(rev._id, 'approved')}
                    className="flex-1 py-2 rounded-full bg-black hover:bg-neutral-800 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(rev._id, 'rejected')}
                    className="flex-1 py-2 rounded-full bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-600 font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-neutral-200/60"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
