'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Package,
  Truck,
  MessageCircle,
  Gem,
  Sparkles,
  PenTool,
  Star,
  FileText,
  ArrowRight,
  RefreshCw,
  Shield,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopProduct {
  name: string;
  category: string;
  unitsSold: number;
  revenueAUD: number;
  image: string;
}

interface ActivityItem {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  type: 'whatsapp' | 'order' | 'review' | 'shipping' | 'quote';
}

interface AnalyticsData {
  totalRevenueAUD: number;
  totalOrders: number;
  pendingNgjaClearance: number;
  activeClientLeads: number;
  whatsappLeads: number;
  customQuotes: number;
  topSellingItems: TopProduct[];
  recentActivity: ActivityItem[];
}

export default function MasterAdminDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/analytics/overview`);
      const resJson = await res.json();
      if (resJson.success && resJson.data) {
        setData({
          totalRevenueAUD: Number(resJson.data.totalRevenueAUD) || 0,
          totalOrders: Number(resJson.data.totalOrders) || 0,
          pendingNgjaClearance: Number(resJson.data.pendingNgjaClearance) || 0,
          activeClientLeads:
            (Number(resJson.data.customQuotesTotal) || 0) + (Number(resJson.data.whatsAppLeadsTotal) || 0),
          whatsappLeads: Number(resJson.data.whatsAppLeadsTotal) || 0,
          customQuotes: Number(resJson.data.customQuotesTotal) || 0,
          topSellingItems: Array.isArray(resJson.data.topSellingItems) ? resJson.data.topSellingItems : [],
          recentActivity: Array.isArray(resJson.data.recentActivity) ? resJson.data.recentActivity : [],
        });
      }
    } catch (e) {
      // Clear zero state on network error
      setData({
        totalRevenueAUD: 0,
        totalOrders: 0,
        pendingNgjaClearance: 0,
        activeClientLeads: 0,
        whatsappLeads: 0,
        customQuotes: 0,
        topSellingItems: [],
        recentActivity: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl w-full">
          {/* ========================================================== */}
          {/* 3. TOP 4 KPI CARDS ROW                                      */}
          {/* ========================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Card 1: Total Settled Revenue */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200/80 text-black flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5 text-neutral-800" />
                </div>
                <div>
                  <span className="text-xs text-neutral-400 font-medium block">
                    Total Settled Revenue
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-black mt-0.5 leading-none">
                    ${data?.totalRevenueAUD.toLocaleString()} AUD
                  </h3>
                  <span className="text-[10px] text-neutral-400 font-light mt-1 inline-block">
                    Direct Australian settlements (AUD)
                  </span>
                </div>
              </div>

              {/* Mini Sparkline Chart Mock */}
              <div className="flex items-end gap-1 h-7 shrink-0 pl-2">
                <span className="w-1 bg-neutral-200 rounded-xs h-[35%]" />
                <span className="w-1 bg-neutral-200 rounded-xs h-[60%]" />
                <span className="w-1 bg-neutral-200 rounded-xs h-[50%]" />
                <span className="w-1 bg-neutral-300 rounded-xs h-[80%]" />
                <span className="w-1 bg-neutral-900 rounded-xs h-[100%]" />
              </div>
            </div>

            {/* Card 2: Total Orders Dispatched */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200/80 text-black flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-neutral-800" />
                </div>
                <div>
                  <span className="text-xs text-neutral-400 font-medium block">
                    Total Orders Dispatched
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-black mt-0.5 leading-none">
                    {data?.totalOrders} Orders
                  </h3>
                  <Link
                    href="/admin/orders"
                    className="text-[10px] text-black font-semibold hover:underline mt-1 inline-flex items-center gap-1"
                  >
                    <span>Manage logistics</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Mini Sparkline Chart Mock */}
              <div className="flex items-end gap-1 h-7 shrink-0 pl-2">
                <span className="w-1 bg-neutral-200 rounded-xs h-[40%]" />
                <span className="w-1 bg-neutral-200 rounded-xs h-[45%]" />
                <span className="w-1 bg-neutral-300 rounded-xs h-[75%]" />
                <span className="w-1 bg-neutral-200 rounded-xs h-[60%]" />
                <span className="w-1 bg-neutral-900 rounded-xs h-[90%]" />
              </div>
            </div>

            {/* Card 3: NGJA Clearance Queue */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200/80 text-black flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-neutral-800" />
                </div>
                <div>
                  <span className="text-xs text-neutral-400 font-medium block">
                    NGJA Clearance Queue
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-black mt-0.5 leading-none">
                    {data?.pendingNgjaClearance} Pending
                  </h3>
                  <span className="text-[10px] text-neutral-400 font-light mt-1 inline-block">
                    Awaiting assay seal in Colombo
                  </span>
                </div>
              </div>

              {/* Mini Sparkline Chart Mock */}
              <div className="flex items-end gap-1 h-7 shrink-0 pl-2">
                <span className="w-1 bg-neutral-200 rounded-xs h-[60%]" />
                <span className="w-1 bg-neutral-200 rounded-xs h-[50%]" />
                <span className="w-1 bg-neutral-200 rounded-xs h-[70%]" />
                <span className="w-1 bg-neutral-300 rounded-xs h-[45%]" />
                <span className="w-1 bg-neutral-900 rounded-xs h-[75%]" />
              </div>
            </div>

            {/* Card 4: Active Client Leads */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200/80 text-black flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-neutral-800" />
                </div>
                <div>
                  <span className="text-xs text-neutral-400 font-medium block">
                    Active Client Leads
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-black mt-0.5 leading-none">
                    {data?.activeClientLeads} Leads
                  </h3>
                  <span className="text-[10px] text-neutral-400 font-light mt-1 inline-block">
                    {data?.whatsappLeads} WhatsApp + {data?.customQuotes} Custom
                  </span>
                </div>
              </div>

              {/* Mini Sparkline Chart Mock */}
              <div className="flex items-end gap-1 h-7 shrink-0 pl-2">
                <span className="w-1 bg-neutral-200 rounded-xs h-[30%]" />
                <span className="w-1 bg-neutral-200 rounded-xs h-[55%]" />
                <span className="w-1 bg-neutral-300 rounded-xs h-[70%]" />
                <span className="w-1 bg-neutral-200 rounded-xs h-[65%]" />
                <span className="w-1 bg-neutral-900 rounded-xs h-[95%]" />
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* 4. MANAGEMENT SUITES & OPERATIONAL MODULES (6 CARDS)       */}
          {/* ========================================================== */}
          <div>
            <h2 className="text-xs font-semibold text-neutral-400 mb-4">
              Management Suites & Operational Modules
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* 1. Products Catalogue */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200/90 hover:border-black hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 text-black flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                    <Gem className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-black">
                    Product Catalogue
                  </h3>
                  <p className="text-xs text-neutral-500 font-light mt-1.5 leading-relaxed">
                    Add, edit, remove jewellery, manage stock counts, 360° videos, and Gender/Style tags.
                  </p>
                </div>
                <Link
                  href="/admin/products"
                  className="text-xs font-bold text-black hover:text-neutral-600 flex items-center gap-1.5 mt-5 transition-colors"
                >
                  <span>Manage Catalogue</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* 2. Orders & Fulfilment */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200/90 hover:border-black hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 text-black flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-black">
                    Orders & Fulfilment Desk
                  </h3>
                  <p className="text-xs text-neutral-500 font-light mt-1.5 leading-relaxed">
                    Flag NGJA export clearance, print 4×6 courier labels, export DHL/FedEx CSVs, manual tracking.
                  </p>
                </div>
                <Link
                  href="/admin/orders"
                  className="text-xs font-bold text-black hover:text-neutral-600 flex items-center gap-1.5 mt-5 transition-colors"
                >
                  <span>Open Fulfilment Desk</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* 3. Custom Sapphire Requests */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200/90 hover:border-black hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 text-black flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                    <PenTool className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-black">
                    Custom Sapphire Requests
                  </h3>
                  <p className="text-xs text-neutral-500 font-light mt-1.5 leading-relaxed">
                    Manage guided bespoke quote submissions from the Customize studio, send prices and notes.
                  </p>
                </div>
                <Link
                  href="/admin/custom-requests"
                  className="text-xs font-bold text-black hover:text-neutral-600 flex items-center gap-1.5 mt-5 transition-colors"
                >
                  <span>View Custom Quotes</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* 4. WhatsApp Cart Leads */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200/90 hover:border-black hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 text-black flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-black">
                    WhatsApp Cart Leads 
                  </h3>
                  <p className="text-xs text-neutral-500 font-light mt-1.5 leading-relaxed">
                    Track visitors who initiated orders via WhatsApp click-to-chat with pre-filled cart bags.
                  </p>
                </div>
                <Link
                  href="/admin/leads"
                  className="text-xs font-bold text-black hover:text-neutral-600 flex items-center gap-1.5 mt-5 transition-colors"
                >
                  <span>Manage WhatsApp Leads</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* 5. Reviews & Photo Moderation */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200/90 hover:border-black hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 text-black flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                    <Star className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-black">
                    Reviews & Photo Moderation 
                  </h3>
                  <p className="text-xs text-neutral-500 font-light mt-1.5 leading-relaxed">
                    Moderate customer reviews and uploaded photography before making them visible on product pages.
                  </p>
                </div>
                <Link
                  href="/admin/reviews"
                  className="text-xs font-bold text-black hover:text-neutral-600 flex items-center gap-1.5 mt-5 transition-colors"
                >
                  <span>Moderate Reviews</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* 6. Content & Story CMS */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-200/90 hover:border-black hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 text-black flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-black">
                    Content & Story CMS 
                  </h3>
                  <p className="text-xs text-neutral-500 font-light mt-1.5 leading-relaxed">
                    Edit &quot;Our Story&quot; headlines, Ratnapura mining ethics, quotes, and static policies without coding.
                  </p>
                </div>
                <Link
                  href="/admin/cms"
                  className="text-xs font-bold text-black hover:text-neutral-600 flex items-center gap-1.5 mt-5 transition-colors"
                >
                  <span>Edit CMS Pages</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* 5. BOTTOM ROW: TOP PIECES & RECENT ATELIER ACTIVITY        */}
          {/* ========================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Columns: Top Performing Jewellery Pieces */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="font-bold text-sm text-black">
                  Top Performing Jewellery Pieces
                </h3>
                <Link
                  href="/admin/products"
                  className="text-xs font-semibold text-neutral-600 hover:text-black flex items-center gap-1 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-100 text-xs text-neutral-400 font-medium">
                      <th className="pb-3 w-8">#</th>
                      <th className="pb-3">Product</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3 text-right">Revenue (AUD)</th>
                      <th className="pb-3 text-right">Units Sold</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {data?.topSellingItems && data.topSellingItems.length > 0 ? (
                      data.topSellingItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50/60 transition-colors">
                          <td className="py-3 font-semibold text-neutral-400">
                            <span className="w-5 h-5 rounded-md bg-neutral-100 text-neutral-700 font-bold flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-3 pr-3">
                            <div className="flex items-center gap-2.5">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-9 h-9 rounded-lg object-cover border border-neutral-200 shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
                                  <Gem className="w-4 h-4 text-neutral-400" />
                                </div>
                              )}
                              <span className="font-medium text-black line-clamp-1 max-w-[220px]">
                                {item.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 text-neutral-500 font-light">
                            {item.category}
                          </td>
                          <td className="py-3 text-right font-bold text-black text-sm">
                            ${item.revenueAUD.toLocaleString()}
                          </td>
                          <td className="py-3 text-right text-neutral-600 font-mono">
                            {item.unitsSold}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-xs text-neutral-400">
                          <Gem className="w-6 h-6 mx-auto mb-2 text-neutral-300 stroke-1" />
                          <p className="font-medium text-neutral-700">No product sales recorded yet</p>
                          <p className="text-[11px] text-neutral-400 mt-0.5">As customer purchases are placed, bestsellers will rank here automatically.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 5 Columns: Recent Atelier Activity */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="font-bold text-sm text-black">
                  Recent Atelier Activity
                </h3>
                <Link
                  href="/admin/orders"
                  className="text-xs font-semibold text-neutral-600 hover:text-black flex items-center gap-1 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-4 pt-1">
                {data?.recentActivity && data.recentActivity.length > 0 ? (
                  data.recentActivity.map((act) => {
                    return (
                      <div key={act.id} className="flex items-start gap-3 text-xs">
                        {/* Status indicator dot */}
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />

                        {/* Timestamp */}
                        <span className="text-[11px] font-mono text-neutral-400 shrink-0 w-14 mt-0.5">
                          {act.time}
                        </span>

                        {/* Icon */}
                        <div className="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800 flex items-center justify-center shrink-0">
                          {act.type === 'whatsapp' && <MessageCircle className="w-3.5 h-3.5" />}
                          {act.type === 'order' && <FileText className="w-3.5 h-3.5" />}
                          {act.type === 'review' && <Star className="w-3.5 h-3.5" />}
                          {act.type === 'shipping' && <Truck className="w-3.5 h-3.5" />}
                          {act.type === 'quote' && <Sparkles className="w-3.5 h-3.5" />}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-black truncate leading-snug">
                            {act.title}
                          </p>
                          <p className="text-[11px] text-neutral-400 font-light truncate mt-0.5">
                            {act.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-xs text-neutral-400 space-y-1">
                    <FileText className="w-6 h-6 mx-auto mb-2 text-neutral-300 stroke-1" />
                    <p className="font-medium text-neutral-700">No recent activity logged</p>
                    <p className="text-[11px] text-neutral-400">Incoming orders, WhatsApp inquiries, and bespoke quotes will stream here live.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
  );
}
