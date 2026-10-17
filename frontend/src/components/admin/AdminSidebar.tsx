'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Gem,
  LayoutDashboard,
  Truck,
  PenTool,
  MessageCircle,
  Star,
  FileText,
  Settings,
  ExternalLink,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminSidebarProps {
  currentActive?: string;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentActive,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const NAV_ITEMS = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      isActive: currentActive === 'dashboard' || pathname === '/admin',
    },
    {
      id: 'products',
      label: 'Product Catalogue',
      href: '/admin/products',
      icon: Gem,
      isActive: currentActive === 'products' || pathname.startsWith('/admin/products'),
    },
    {
      id: 'orders',
      label: 'Orders & Fulfilment',
      href: '/admin/orders',
      icon: Truck,
      isActive: currentActive === 'orders' || pathname.startsWith('/admin/orders'),
    },
    {
      id: 'custom-requests',
      label: 'Custom Requests',
      href: '/admin/custom-requests',
      icon: PenTool,
      isActive: currentActive === 'custom-requests' || pathname.startsWith('/admin/custom-requests'),
    },
    {
      id: 'leads',
      label: 'WhatsApp Leads',
      href: '/admin/leads',
      icon: MessageCircle,
      isActive: currentActive === 'leads' || pathname.startsWith('/admin/leads'),
    },
    {
      id: 'reviews',
      label: 'Reviews & Moderation',
      href: '/admin/reviews',
      icon: Star,
      isActive: currentActive === 'reviews' || pathname.startsWith('/admin/reviews'),
    },
    {
      id: 'cms',
      label: 'Content Management',
      href: '/admin/cms',
      icon: FileText,
      isActive: currentActive === 'cms' || pathname.startsWith('/admin/cms'),
    },
  ];

  const sidebarContent = (
    <div className="w-64 h-full bg-black border-r border-neutral-800 flex flex-col justify-between p-5 select-none text-white">
      <div>
        {/* Brand Logo Header */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Gem className="w-4 h-4 text-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-white leading-none">
                Aura<span className="font-normal text-neutral-400">.Ceylon</span>
              </span>
              <span className="text-xs text-neutral-400 font-medium mt-0.5">
                Admin Panel
              </span>
            </div>
          </Link>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-neutral-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items List */}
        <nav className="mt-5 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-neutral-900 text-white font-semibold shadow-2xs border border-neutral-800'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    active ? 'text-white' : 'text-neutral-400'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="pt-4 border-t border-neutral-800 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-900/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4 text-neutral-400" />
            <span>Storefront View</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono bg-neutral-900 px-2 py-0.5 rounded-full border border-neutral-800">Live</span>
        </Link>

        <Link
          href="/admin/settings"
          onClick={onCloseMobile}
          className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
            pathname.startsWith('/admin/settings')
              ? 'bg-neutral-900 text-white font-semibold border border-neutral-800'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
          }`}
        >
          <Settings
            className={`w-4 h-4 transition-colors ${
              pathname.startsWith('/admin/settings') ? 'text-white' : 'text-neutral-400'
            }`}
          />
          <span>Settings</span>
        </Link>

        {/* Quick Admin Profile Card */}
        <div className="pt-3 mt-2 border-t border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-white text-black text-[11px] font-bold flex items-center justify-center shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-white truncate">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-neutral-400 truncate">
                {user?.email || 'admin@auraceylon.com'}
              </span>
            </div>
          </div>

          <button
            onClick={() => logout()}
            title="Sign Out"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-900 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-0 h-screen z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="h-full animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={onCloseMobile} />
        </div>
      )}
    </>
  );
};
