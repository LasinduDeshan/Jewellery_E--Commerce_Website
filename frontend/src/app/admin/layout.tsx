'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { NotificationCenter } from '../../components/admin/NotificationCenter';
import {
  Search,
  ChevronDown,
  Menu,
  ExternalLink,
  LogOut,
  RefreshCw,
  Sparkles,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Dynamic header titles based on active route
  const getHeaderMeta = () => {
    if (pathname === '/admin') {
      return {
        title: 'Welcome back!',
        subtitle: "Here's what's happening with Zeyloraa today.",
      };
    }
    if (pathname.startsWith('/admin/products')) {
      return {
        title: 'Jewellery Master Catalogue',
        subtitle: 'Manage gemstones, settings, stock counts, and 360° atelier media.',
      };
    }
    if (pathname.startsWith('/admin/orders')) {
      return {
        title: 'Orders & Fulfilment Desk',
        subtitle: 'Manage Sri Lanka → Australia dispatches, NGJA export clearance & courier labels.',
      };
    }
    if (pathname.startsWith('/admin/custom-requests')) {
      return {
        title: 'Custom Sapphire Requests',
        subtitle: 'Review bespoke jewellery quote submissions from the studio, set pricing and send notes.',
      };
    }
    if (pathname.startsWith('/admin/leads')) {
      return {
        title: 'WhatsApp Cart Leads',
        subtitle: 'Track visitors who initiated orders via WhatsApp click-to-chat with pre-filled cart bags.',
      };
    }
    if (pathname.startsWith('/admin/reviews')) {
      return {
        title: 'Reviews & Photo Moderation',
        subtitle: 'Moderate buyer testimonials and verified photo uploads before live display on product detail pages.',
      };
    }
    if (pathname.startsWith('/admin/cms')) {
      return {
        title: 'Editorial & Story CMS',
        subtitle: 'Update Our Story headlines, Ratnapura mining ethics, quotes, and static policies without coding.',
      };
    }
    if (pathname.startsWith('/admin/settings')) {
      return {
        title: 'Atelier Settings & Preferences',
        subtitle: 'Configure store profile, NGJA compliance, courier logistics, and concierge channels.',
      };
    }
    return {
      title: 'Management Suite',
      subtitle: 'Zeyloraa Atelier Operations',
    };
  };

  const meta = getHeaderMeta();

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/admin/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="admin-scope min-h-screen bg-[#F8F9FA] flex text-neutral-900 font-sans antialiased selection:bg-neutral-200 selection:text-neutral-900">
      {/* 1. Left Sidebar Navigation (Always present on desktop, drawer on mobile) */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Viewport on the Right */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-neutral-200/90 sticky top-0 z-20 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Mobile Toggle & Page Greeting */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-2xl font-semibold text-black leading-tight">
                  {meta.title}
                </h1>
                <p className="text-xs text-neutral-500 font-normal hidden sm:block mt-0.5">
                  {meta.subtitle}
                </p>
              </div>
            </div>

            {/* Right: Search, Notifications & Profile Avatar */}
            <div className="flex items-center gap-3">
              {/* Search Bar matching Reference Image */}
              <form onSubmit={handleGlobalSearch} className="relative hidden md:block w-64 lg:w-80">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, orders, customers..."
                  className="w-full pl-9 pr-4 py-2 bg-neutral-50 hover:bg-neutral-100 focus:bg-white border border-neutral-200/90 rounded-full text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-black transition-all shadow-2xs"
                />
              </form>

              {/* Fully-functional Interactive Notification Center */}
              <NotificationCenter />

              {/* Admin Avatar Pill Button */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-white border border-neutral-200/90 hover:border-black transition-all shadow-2xs cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <span className="text-xs font-semibold text-neutral-900 hidden sm:inline">
                    Admin
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-neutral-200/90 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="text-xs font-semibold text-black truncate">
                        {user?.name || 'Administrator'}
                      </p>
                      <p className="text-[10px] text-neutral-400 truncate">
                        {user?.email || 'admin@auraceylon.com'}
                      </p>
                    </div>

                    <Link
                      href="/"
                      target="_blank"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Live Storefront View</span>
                    </Link>

                    <Link
                      href="/admin/settings"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Atelier Settings</span>
                    </Link>

                    <div className="border-t border-neutral-100 my-1" />

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Section Content Viewport (Children) */}
        <main className="flex-1 min-w-0 p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
