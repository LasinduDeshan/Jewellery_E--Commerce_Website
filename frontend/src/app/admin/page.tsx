'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  TrendingUp,
  Package,
  Truck,
  Sparkles,
  MessageCircle,
  Star,
  Tag,
  FileText,
  Gem,
  ArrowRight,
  RefreshCw,
  DollarSign,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface AnalyticsData {
  totalRevenueAUD: number;
  totalOrders: number;
  pendingNgjaClearance: number;
  activeCatalogueProducts: number;
  customQuotesTotal: number;
  whatsAppLeadsTotal: number;
  topSellingItems: Array<{
    name: string;
    category: string;
    unitsSold: number;
    revenueAUD: number;
  }>;
  recentActivity: Array<{ time: string; text: string }>;
}

export default function MasterAdminPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/analytics/overview`);
      const resJson = await res.json();
      if (resJson.success && resJson.data) {
        setData(resJson.data);
      }
    } catch (e) {
      console.warn('Using client analytics fallback');
      setData({
        totalRevenueAUD: 21450,
        totalOrders: 18,
        pendingNgjaClearance: 2,
        activeCatalogueProducts: 6,
        customQuotesTotal: 5,
        whatsAppLeadsTotal: 7,
        topSellingItems: [
          {
            name: 'Royal Blue Ceylon Sapphire Regal Halo Ring',
            category: 'rings',
            unitsSold: 9,
            revenueAUD: 7560,
          },
          {
            name: 'Padparadscha Lotus Blossom Pendant',
            category: 'necklaces',
            unitsSold: 5,
            revenueAUD: 5600,
          },
          {
            name: 'Cornflower Blue Sapphire Eternity Promise Ring',
            category: 'engagement-promise-rings',
            unitsSold: 4,
            revenueAUD: 2360,
          },
        ],
        recentActivity: [
          { time: '10m ago', text: 'New WhatsApp cart lead created: #WA-CART-8821 ($840 AUD)' },
          { time: '1h ago', text: 'Order #AC-74029 flagged: Pending NGJA Export Appraisal' },
          { time: '3h ago', text: '5-star review submitted with 2 customer photos for Royal Blue Halo Ring' },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Top Header */}
      <header className="bg-stone-900 text-white border-b border-stone-800 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-serif tracking-wide text-white font-medium">
                Aura Ceylon • Master Atelier Command
              </h1>
              <p className="text-[11px] text-stone-400">
                Section 5.8 • Business Operations, Fulfilment & Catalogue Desk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-stone-400 hover:text-white px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-700 flex items-center gap-1.5 transition-colors"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              onClick={fetchAnalytics}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Overview Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-8">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Total Settled Revenue
              </span>
              <h3 className="text-2xl font-serif font-bold text-stone-900 mt-0.5">
                ${data?.totalRevenueAUD.toLocaleString()} AUD
              </h3>
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 inline-block">
                ↑ Direct Australian settlements
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Total Orders Dispatched
              </span>
              <h3 className="text-2xl font-serif font-bold text-stone-900 mt-0.5">
                {data?.totalOrders} Orders
              </h3>
              <Link href="/admin/orders" className="text-[10px] text-amber-800 font-bold hover:underline mt-1 block">
                Manage logistics →
              </Link>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          {/* NGJA Clearance Queue */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                NGJA Clearance Queue
              </span>
              <h3 className="text-2xl font-serif font-bold text-amber-700 mt-0.5">
                {data?.pendingNgjaClearance} Pending
              </h3>
              <span className="text-[10px] text-stone-500 mt-1 inline-block">
                Awaiting assay seal in Colombo
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          {/* Custom & WhatsApp Leads */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Active Client Leads
              </span>
              <h3 className="text-2xl font-serif font-bold text-emerald-800 mt-0.5">
                {(data?.customQuotesTotal || 0) + (data?.whatsAppLeadsTotal || 0)} Leads
              </h3>
              <span className="text-[10px] text-stone-500 mt-1 inline-block">
                {data?.whatsAppLeadsTotal} WhatsApp + {data?.customQuotesTotal} Custom
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 6 Sub-Desk Navigation Cards (Section 5.8) */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">
            Management Suites & Operational Modules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Products & Inventory */}
            <Link
              href="/admin/products"
              className="bg-white p-6 rounded-2xl border border-stone-200 hover:border-amber-500 hover:shadow-lg transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Gem className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-amber-700">
                Product Catalogue & Inventory
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Add, edit, remove jewellery, manage stock counts, 360° videos, and Gender/Style tags.
              </p>
              <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1 mt-4">
                <span>Manage Catalogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* 2. Orders & NGJA Shipping */}
            <Link
              href="/admin/orders"
              className="bg-white p-6 rounded-2xl border border-stone-200 hover:border-amber-500 hover:shadow-lg transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-blue-700">
                Orders & Fulfilment Desk (5.4)
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Flag NGJA export clearance, print 4x6 courier labels, export DHL/FedEx CSVs, manual tracking.
              </p>
              <span className="text-[11px] font-bold text-blue-800 flex items-center gap-1 mt-4">
                <span>Open Fulfilment Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* 3. Custom Sapphire Quotes */}
            <Link
              href="/admin/custom-requests"
              className="bg-white p-6 rounded-2xl border border-stone-200 hover:border-amber-500 hover:shadow-lg transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-purple-700">
                Custom Sapphire Requests (Section 8)
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Manage guided bespoke quote submissions from the Customize studio, send prices and notes.
              </p>
              <span className="text-[11px] font-bold text-purple-800 flex items-center gap-1 mt-4">
                <span>View Custom Quotes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* 4. WhatsApp Cart Leads */}
            <Link
              href="/admin/leads"
              className="bg-white p-6 rounded-2xl border border-stone-200 hover:border-amber-500 hover:shadow-lg transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-emerald-700">
                WhatsApp Cart Leads (5.3 & 5.8)
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Track visitors who initiated orders via WhatsApp click-to-chat with pre-filled cart bags.
              </p>
              <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 mt-4">
                <span>Manage WhatsApp Leads</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* 5. Customer Reviews Moderation */}
            <Link
              href="/admin/reviews"
              className="bg-white p-6 rounded-2xl border border-stone-200 hover:border-amber-500 hover:shadow-lg transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Star className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-amber-700">
                Reviews & Photo Moderation (5.6)
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Moderate customer reviews and uploaded photography before making them visible on product pages.
              </p>
              <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1 mt-4">
                <span>Moderate Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* 6. CMS Story & Content Editor */}
            <Link
              href="/admin/cms"
              className="bg-white p-6 rounded-2xl border border-stone-200 hover:border-amber-500 hover:shadow-lg transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center mb-4 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-stone-900">
                Content & Story CMS (5.7)
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Edit "Our Story" headlines, Ratnapura mining ethics, quotes, and static policies without coding.
              </p>
              <span className="text-[11px] font-bold text-stone-900 flex items-center gap-1 mt-4">
                <span>Edit CMS Pages</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Sales Analytics Breakdown Table (Section 5.8) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Top Selling Jewellery */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-base font-bold text-stone-900">
                Top Performing Jewellery Pieces
              </h3>
              <span className="text-[10px] text-stone-400 font-semibold uppercase">By Revenue (AUD)</span>
            </div>

            <div className="divide-y divide-stone-100 text-xs">
              {data?.topSellingItems?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-700 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-semibold text-stone-900">{item.name}</h4>
                      <span className="text-[10px] text-stone-400 capitalize">{item.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-stone-900 block">${item.revenueAUD} AUD</span>
                    <span className="text-[10px] text-stone-500">{item.unitsSold} units crafted</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Live Activity Stream */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
              Recent Atelier Activity
            </h3>

            <div className="space-y-4 text-xs">
              {data?.recentActivity?.map((act, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-[10px] text-stone-400 whitespace-nowrap mt-0.5">{act.time}</span>
                  <p className="text-stone-700 leading-relaxed font-light">{act.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
