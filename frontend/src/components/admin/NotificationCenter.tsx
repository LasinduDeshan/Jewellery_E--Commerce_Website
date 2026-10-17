'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCheck,
  Trash2,
  Truck,
  PenTool,
  MessageCircle,
  Star,
  Gem,
  AlertTriangle,
  X,
  ExternalLink,
} from 'lucide-react';

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  timestamp: number;
  type: 'order' | 'custom-request' | 'lead' | 'review' | 'inventory';
  link: string;
  read: boolean;
}

const DEFAULT_NOTIFICATIONS: AdminNotification[] = [];

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load persisted notifications and fetch live updates from API
  useEffect(() => {
    const fetchLiveAlerts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/analytics/overview`);
        if (res.ok) {
          const resJson = await res.json();
          // Use genuinely pending notifications from backend
          const backendNotifs: any[] = Array.isArray(resJson.data?.notifications)
            ? resJson.data.notifications
            : [];

          let readIds: string[] = [];
          let dismissedIds: string[] = [];
          let clearedAt = 0;

          try {
            const storedReads = localStorage.getItem('aura_admin_read_notifs');
            readIds = storedReads ? JSON.parse(storedReads) : [];

            const storedDismissed = localStorage.getItem('aura_admin_dismissed_notifs');
            dismissedIds = storedDismissed ? JSON.parse(storedDismissed) : [];

            clearedAt = Number(localStorage.getItem('aura_admin_cleared_at') || 0);
          } catch {
            // Ignore localStorage read errors
          }

          const liveItems: AdminNotification[] = backendNotifs
            .filter((item: any) => {
              if (dismissedIds.includes(item.id)) return false;
              if (item.timestamp && item.timestamp <= clearedAt) return false;
              return true;
            })
            .map((item: any) => ({
              id: item.id,
              title: item.title,
              message: item.message,
              time: item.time || 'Pending',
              timestamp: item.timestamp || Date.now(),
              type: item.type,
              link: item.link,
              read: readIds.includes(item.id),
            }));

          setNotifications(liveItems);
        }
      } catch {
        setNotifications([]);
      }
    };

    fetchLiveAlerts();
  }, []);

  // Sync reads to localStorage
  const persistReads = (updated: AdminNotification[]) => {
    try {
      const readIds = updated.filter((n) => n.read).map((n) => n.id);
      localStorage.setItem('aura_admin_read_notifs', JSON.stringify(readIds));
    } catch {
      // Ignore storage errors
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    persistReads(updated);
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    persistReads(updated);
  };

  const dismissNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    try {
      const storedDismissed = localStorage.getItem('aura_admin_dismissed_notifs');
      const dismissedIds: string[] = storedDismissed ? JSON.parse(storedDismissed) : [];
      if (!dismissedIds.includes(id)) {
        dismissedIds.push(id);
        localStorage.setItem('aura_admin_dismissed_notifs', JSON.stringify(dismissedIds));
      }
    } catch {
      // Ignore storage errors
    }
  };

  const clearAllNotifications = () => {
    const allIds = notifications.map((n) => n.id);
    setNotifications([]);
    try {
      localStorage.setItem('aura_admin_cleared_at', Date.now().toString());
      const storedDismissed = localStorage.getItem('aura_admin_dismissed_notifs');
      const dismissedIds: string[] = storedDismissed ? JSON.parse(storedDismissed) : [];
      localStorage.setItem(
        'aura_admin_dismissed_notifs',
        JSON.stringify(Array.from(new Set([...dismissedIds, ...allIds])))
      );
    } catch {
      // Ignore storage errors
    }
  };

  const handleNotificationClick = (item: AdminNotification) => {
    markAsRead(item.id);
    setIsOpen(false);
    router.push(item.link);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getNotificationIcon = (type: AdminNotification['type']) => {
    switch (type) {
      case 'order':
        return <Truck className="w-3.5 h-3.5 text-neutral-900" />;
      case 'custom-request':
        return <PenTool className="w-3.5 h-3.5 text-neutral-900" />;
      case 'lead':
        return <MessageCircle className="w-3.5 h-3.5 text-neutral-900" />;
      case 'review':
        return <Star className="w-3.5 h-3.5 text-neutral-900" />;
      case 'inventory':
        return <AlertTriangle className="w-3.5 h-3.5 text-neutral-900" />;
      default:
        return <Gem className="w-3.5 h-3.5 text-neutral-900" />;
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Notification Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-white border border-neutral-200/90 text-neutral-700 hover:text-black hover:border-black transition-all shadow-2xs relative cursor-pointer"
        title="Notifications"
        aria-label="View admin notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white rounded-2xl border border-neutral-200/90 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden text-neutral-900">
          {/* Header */}
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-black">Notifications</h3>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-medium border border-neutral-200/80">
                  {unreadCount} unread
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 text-[10px] font-medium">
                  All caught up
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[11px] text-neutral-600 hover:text-black font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Mark read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="p-1 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer rounded"
                  title="Clear all notifications"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-4 py-2 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                  filter === 'all'
                    ? 'bg-black text-white font-medium'
                    : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                  filter === 'unread'
                    ? 'bg-black text-white font-medium'
                    : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>
            <span className="text-[10px] text-neutral-400 font-medium">Atelier Live Feed</span>
          </div>

          {/* Notification List Body */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-neutral-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500 space-y-1">
                <Bell className="w-6 h-6 text-neutral-300 mx-auto mb-2" />
                <p className="font-medium text-neutral-800">No notifications found</p>
                <p className="text-[11px] text-neutral-400">
                  {filter === 'unread'
                    ? 'You have read all pending operational alerts.'
                    : 'Your notification inbox is completely clear.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 relative group ${
                    item.read ? 'hover:bg-neutral-50/80 bg-white' : 'bg-neutral-50/60 hover:bg-neutral-100/70'
                  }`}
                >
                  {/* Category Icon Badge */}
                  <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                    {getNotificationIcon(item.type)}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h4 className={`text-xs truncate ${item.read ? 'font-medium text-neutral-800' : 'font-semibold text-black'}`}>
                        {item.title}
                      </h4>
                      {!item.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-neutral-400">
                      <span>{item.time}</span>
                      <span>•</span>
                      <span className="capitalize">{item.type.replace('-', ' ')}</span>
                    </div>
                  </div>

                  {/* Dismiss Single Button on Hover */}
                  <button
                    onClick={(e) => dismissNotification(e, item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-black transition-opacity absolute right-2.5 top-3 cursor-pointer"
                    title="Dismiss notification"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Quick Links */}
          <div className="p-2.5 bg-neutral-50/70 border-t border-neutral-100 flex items-center justify-between text-[11px]">
            <Link
              href="/admin/orders"
              onClick={() => setIsOpen(false)}
              className="text-neutral-600 hover:text-black transition-colors px-2 py-1 rounded hover:bg-neutral-100 flex items-center gap-1"
            >
              <span>Orders</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </Link>
            <Link
              href="/admin/custom-requests"
              onClick={() => setIsOpen(false)}
              className="text-neutral-600 hover:text-black transition-colors px-2 py-1 rounded hover:bg-neutral-100 flex items-center gap-1"
            >
              <span>Custom Studio</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </Link>
            <Link
              href="/admin/leads"
              onClick={() => setIsOpen(false)}
              className="text-neutral-600 hover:text-black transition-colors px-2 py-1 rounded hover:bg-neutral-100 flex items-center gap-1"
            >
              <span>WhatsApp Leads</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
