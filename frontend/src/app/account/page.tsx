'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuth, SavedAddress } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { PhoneInput } from '../../components/ui/PhoneInput';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Sparkles,
  Shield,
  LogOut,
  Package,
  Truck,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Gem,
  ArrowRight,
  MessageCircle,
  KeyRound,
  AlertCircle,
  X,
} from 'lucide-react';

interface OrderItem {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  isNgjaCleared: boolean;
  trackingNumber?: string;
  courierPartner?: string;
  trackingUrl?: string;
  totalPrice: number;
  currency: string;
  orderItems: Array<{
    title: string;
    quantity: number;
    price: number;
    image: string;
    metal?: string;
    gemstone?: string;
    size?: string;
  }>;
  timeline: Array<{
    status: string;
    title: string;
    description: string;
    isCompleted: boolean;
    timestamp: string;
  }>;
}

const mockOrdersData: OrderItem[] = [
  {
    _id: 'ord_1',
    orderNumber: 'AJ-2026-8492',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    status: 'Shipped',
    isNgjaCleared: true,
    trackingNumber: 'DHL-AU-98302941',
    courierPartner: 'DHL Express',
    trackingUrl: 'https://www.dhl.com/en/express/tracking.html?AWB=DHL-AU-98302941',
    totalPrice: 2450,
    currency: 'AUD',
    orderItems: [
      {
        title: 'Ceylon Cornflower Blue Sapphire Ring in 18K Rose Gold',
        quantity: 1,
        price: 2450,
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80',
        metal: '18K Rose Gold',
        gemstone: 'Natural Ceylon Sapphire (2.05ct)',
        size: 'US 6.5 (AU M)',
      },
    ],
    timeline: [
      {
        status: 'Processing',
        title: 'Order Placed & Confirmed',
        description: 'Payment verified in AUD and atelier dispatch ticket created.',
        isCompleted: true,
        timestamp: '2026-10-04T10:00:00Z',
      },
      {
        status: 'Gem Setting & Inspection',
        title: 'Artisanal Setting & QC',
        description: 'Microscopic claw setting and high-polish bench finish completed in Colombo.',
        isCompleted: true,
        timestamp: '2026-10-05T14:30:00Z',
      },
      {
        status: 'Pending NGJA Export Clearance',
        title: 'Sri Lanka NGJA Appraisal Clearance',
        description: 'National Gem & Jewellery Authority export appraisal & seal verified.',
        isCompleted: true,
        timestamp: '2026-10-06T11:15:00Z',
      },
      {
        status: 'Shipped',
        title: 'Dispatched via DHL Express Worldwide',
        description: 'Flight en route from Colombo (CMB) to Sydney International (SYD).',
        isCompleted: true,
        timestamp: '2026-10-07T08:00:00Z',
      },
      {
        status: 'Delivered',
        title: 'Delivered to Sydney Address',
        description: 'Estimated delivery: October 10, 2026 (Signature required).',
        isCompleted: false,
        timestamp: '',
      },
    ],
  },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, token, logout, updateUser } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'addresses' | 'custom_quotes' | 'security'>('overview');
  const [orders, setOrders] = useState<OrderItem[]>(mockOrdersData);
  const [customQuotes, setCustomQuotes] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Address Modal State
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    fullName: '',
    street: '',
    apartment: '',
    city: '',
    state: 'NSW',
    postalCode: '',
    country: 'Australia',
    phoneNumber: '',
    isDefault: true,
  });

  // Security Form
  const [securityForm, setSecurityForm] = useState({
    name: '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: '',
  });
  const [securityMessage, setSecurityMessage] = useState('');

  // Fetch Orders and Custom Quotes from Backend
  const fetchAccountData = useCallback(async () => {
    if (!token) return;
    setLoadingOrders(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      // 1. Orders
      const orderRes = await fetch(`${apiUrl}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (orderRes.ok) {
        const oData = await orderRes.json();
        if (oData.success && oData.data.length > 0) {
          setOrders(oData.data);
        }
      }

      // 2. Custom Sapphire Quotes (matching user email)
      const quoteRes = await fetch(`${apiUrl}/custom-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (quoteRes.ok) {
        const qData = await quoteRes.json();
        if (qData.success && Array.isArray(qData.data)) {
          // If customer, filter by their email or show recent
          const userEmail = user?.email?.toLowerCase();
          const matched = userEmail
            ? qData.data.filter((q: any) => q.email?.toLowerCase() === userEmail)
            : qData.data;
          setCustomQuotes(matched.length > 0 ? matched : qData.data);
        }
      }
    } catch (e) {
      console.warn('Using local account data fallback');
    } finally {
      setLoadingOrders(false);
    }
  }, [token, user?.email]);

  useEffect(() => {
    fetchAccountData();
    if (user) {
      setSecurityForm((prev) => ({
        ...prev,
        name: user.name || '',
        phoneNumber: user.phoneNumber || '',
      }));
    }
  }, [fetchAccountData, user]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Address Handlers
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      if (editingAddressId) {
        // Update
        if (token) {
          const res = await fetch(`${apiUrl}/user/addresses/${editingAddressId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(addressForm),
          });
          const data = await res.json();
          if (data.success) {
            updateUser({ savedAddresses: data.data });
          }
        }
      } else {
        // Add new
        if (token) {
          const res = await fetch(`${apiUrl}/user/addresses`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(addressForm),
          });
          const data = await res.json();
          if (data.success) {
            updateUser({ savedAddresses: data.data });
          }
        } else {
          // Local fallback
          const newAddr: SavedAddress = {
            _id: `addr_${Date.now()}`,
            ...addressForm,
          };
          const current = user?.savedAddresses || [];
          updateUser({ savedAddresses: [...current, newAddr] });
        }
      }
    } catch (err) {
      console.warn('Address updated locally');
    }

    setAddressModalOpen(false);
    setEditingAddressId(null);
  };

  const handleDeleteAddress = async (addrId: string) => {
    if (token) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/user/addresses/${addrId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          updateUser({ savedAddresses: data.data });
        }
      } catch (e) {
        // local delete
      }
    }
    const filtered = (user?.savedAddresses || []).filter((a) => a._id !== addrId);
    updateUser({ savedAddresses: filtered });
  };

  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMessage('');

    if (token) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        await fetch(`${apiUrl}/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: securityForm.name,
            phoneNumber: securityForm.phoneNumber,
          }),
        });
      } catch (e) {
        // ignore
      }
    }

    updateUser({
      name: securityForm.name,
      phoneNumber: securityForm.phoneNumber,
    });

    setSecurityMessage('Profile updated successfully!');
    setTimeout(() => setSecurityMessage(''), 3000);
  };

  const savedAddressesList = user?.savedAddresses && user.savedAddresses.length > 0
    ? user.savedAddresses
    : [
        {
          _id: 'addr_default_syd',
          label: 'Sydney Residence',
          fullName: user?.name || 'Lady Genevieve',
          street: '42 Collins Avenue',
          apartment: 'Level 12, Suite 4',
          city: 'Sydney',
          state: 'NSW',
          postalCode: '2000',
          country: 'Australia',
          phoneNumber: user?.phoneNumber || '+61 412 345 678',
          isDefault: true,
        },
      ];

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      {/* Account Hero Bar */}
      <section className="bg-stone-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-stone-800 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 font-serif text-2xl font-bold flex items-center justify-center shadow-lg border-2 border-amber-300/40">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif text-white font-medium">
                  Welcome back, {user?.name || 'Lady Genevieve'}
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-semibold tracking-wider uppercase">
                  Atelier Client
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                {user?.email || 'genevieve@ceylonjewels.com'} • Preferred Currency: AUD ($)
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors border border-stone-700 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </section>

      {/* Account Workspace Grid */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-2">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-3 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full p-3 rounded-xl text-left text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-amber-50 text-amber-900 border-l-4 border-amber-600 font-bold'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <User className="w-4 h-4 text-amber-700" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full p-3 rounded-xl text-left text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-amber-50 text-amber-900 border-l-4 border-amber-600 font-bold'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-amber-700" />
                <span>Orders & Tracking</span>
              </div>
              <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-bold">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full p-3 rounded-xl text-left text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'bg-amber-50 text-amber-900 border-l-4 border-amber-600 font-bold'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-amber-700" />
                <span>My Wishlist</span>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                {wishlist.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full p-3 rounded-xl text-left text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === 'addresses'
                  ? 'bg-amber-50 text-amber-900 border-l-4 border-amber-600 font-bold'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <MapPin className="w-4 h-4 text-amber-700" />
              <span>Saved Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab('custom_quotes')}
              className={`w-full p-3 rounded-xl text-left text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'custom_quotes'
                  ? 'bg-amber-50 text-amber-900 border-l-4 border-amber-600 font-bold'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Custom Quotes</span>
              </div>
              {customQuotes.length > 0 && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  {customQuotes.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full p-3 rounded-xl text-left text-xs font-semibold uppercase tracking-wider flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-amber-50 text-amber-900 border-l-4 border-amber-600 font-bold'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <KeyRound className="w-4 h-4 text-amber-700" />
              <span>Profile & Security</span>
            </button>
          </div>

          {/* Concierge Help Box */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 text-xs text-stone-800 space-y-3">
            <div className="flex items-center gap-2 font-semibold text-amber-900">
              <MessageCircle className="w-4 h-4 text-amber-700" />
              <span>Dedicated Concierge</span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Questions regarding Australian customs, duty estimates, or resizing? Chat directly with our Colombo atelier.
            </p>
            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
            >
              <span>WhatsApp +94 77 123 4567</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </aside>

        {/* Right Main Content Tabs */}
        <div className="lg:col-span-9">
          {/* ================= TAB 1: OVERVIEW ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                      Active Orders
                    </span>
                    <h3 className="text-2xl font-serif text-stone-900 font-bold mt-1">
                      {orders.length}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Package className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                      Saved in Wishlist
                    </span>
                    <h3 className="text-2xl font-serif text-stone-900 font-bold mt-1">
                      {wishlist.length}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-700 flex items-center justify-center">
                    <Heart className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                      Custom Quotes
                    </span>
                    <h3 className="text-2xl font-serif text-stone-900 font-bold mt-1">
                      {customQuotes.length}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Recent Order Quick View */}
              {orders.length > 0 && (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                    <div>
                      <span className="text-xs font-semibold tracking-wider uppercase text-amber-700">
                        Latest Shipment Tracking
                      </span>
                      <h3 className="text-xl font-serif text-stone-900 mt-0.5">
                        Order #{orders[0].orderNumber}
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-stone-900 hover:text-amber-700 flex items-center gap-1"
                    >
                      <span>Full Timeline</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Order Card Preview */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="flex items-center gap-4">
                      <img
                        src={orders[0].orderItems[0].image}
                        alt={orders[0].orderItems[0].title}
                        className="w-16 h-16 rounded-lg object-cover border border-stone-300"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-stone-900">
                          {orders[0].orderItems[0].title}
                        </h4>
                        <span className="text-xs text-stone-500">
                          {orders[0].orderItems[0].metal} • {orders[0].orderItems[0].gemstone}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-stone-900 font-serif">
                        ${orders[0].totalPrice} {orders[0].currency}
                      </span>
                      <div className="mt-1">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {orders[0].status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Courier info pill */}
                  {orders[0].trackingNumber && (
                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-stone-800">
                        <Truck className="w-4 h-4 text-amber-700" />
                        <span>
                          <strong>{orders[0].courierPartner}:</strong> #{orders[0].trackingNumber}
                        </span>
                      </div>
                      {orders[0].trackingUrl && (
                        <a
                          href={orders[0].trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                        >
                          <span>Live Courier Tracking</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: ORDERS & TRACKING (Section 5.4) ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8">
                <h3 className="text-xl font-serif text-stone-900 mb-1">
                  Orders & Sri Lanka → Australia Tracking
                </h3>
                <p className="text-xs text-stone-500 mb-6">
                  Every Ceylon sapphire piece is independently appraised by the National Gem & Jewellery Authority (NGJA) in Sri Lanka before international courier export.
                </p>

                <div className="space-y-8">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-stone-200 rounded-2xl p-6 bg-stone-50/50 space-y-6">
                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
                        <div>
                          <span className="font-mono text-xs font-bold text-amber-900 block">
                            Order #{order.orderNumber}
                          </span>
                          <span className="text-xs text-stone-500">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold font-serif text-stone-900">
                            ${order.totalPrice} {order.currency}
                          </span>
                          <span className="text-xs px-3 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {order.orderItems.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-stone-200">
                            <img src={it.image} alt={it.title} className="w-14 h-14 rounded-lg object-cover" />
                            <div className="flex-1">
                              <h5 className="text-sm font-semibold text-stone-900">{it.title}</h5>
                              <p className="text-xs text-stone-500">
                                {it.metal} • {it.gemstone} {it.size ? `• Size: ${it.size}` : ''}
                              </p>
                            </div>
                            <span className="text-xs font-bold text-stone-900">
                              ${it.price} {order.currency}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* 5-Stage Visual Progress Tracker (Section 5.4) */}
                      <div className="pt-4 border-t border-stone-200">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-4 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-700" />
                          <span>Fulfillment & Export Journey</span>
                        </h4>

                        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-300">
                          {order.timeline.map((step, sIdx) => (
                            <div key={sIdx} className="relative flex items-start gap-3">
                              <div
                                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                                  step.isCompleted
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-stone-200 text-stone-400 border border-stone-300'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <h6
                                  className={`text-xs font-bold ${
                                    step.isCompleted ? 'text-stone-900' : 'text-stone-400'
                                  }`}
                                >
                                  {step.title}
                                </h6>
                                <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Courier Tracking Action */}
                      {order.trackingNumber && (
                        <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <span className="text-stone-500 block">Courier Tracking Number</span>
                            <span className="font-mono font-bold text-stone-900">
                              {order.courierPartner}: {order.trackingNumber}
                            </span>
                          </div>
                          {order.trackingUrl && (
                            <a
                              href={order.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-semibold uppercase tracking-wider text-xs flex items-center gap-1.5 transition-colors"
                            >
                              <span>Track on {order.courierPartner}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: WISHLIST (Section 5.5) ================= */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-serif text-stone-900">
                    Saved Pieces & Wishlist
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Save your favorite sapphire creations for upcoming anniversaries or gifting milestones.
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  {wishlist.length} Items Saved
                </span>
              </div>

              {wishlist.length === 0 ? (
                <div className="p-12 text-center text-stone-500 text-xs space-y-3">
                  <Heart className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="font-medium text-stone-700">Your wishlist is currently empty.</p>
                  <Link
                    href="/customize"
                    className="inline-block px-4 py-2 bg-stone-900 text-white rounded-md text-xs font-semibold uppercase tracking-wider"
                  >
                    Explore Sapphire Studio
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {wishlist.map((item) => (
                    <div
                      key={item._id}
                      className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50/50 flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-4/3 w-full overflow-hidden bg-stone-100 relative">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeFromWishlist(item._id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-stone-500 hover:text-red-600 shadow transition-colors"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700">
                            {item.categoryName || 'Fine Jewellery'}
                          </span>
                          <h4 className="text-sm font-semibold text-stone-900 mt-0.5 line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-stone-500 mt-1">
                            {item.gemstone || 'Natural Ceylon Corundum'}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                          <span className="text-base font-serif font-bold text-stone-900">
                            ${item.discountPrice ?? item.price} AUD
                          </span>
                          <Link
                            href="/customize#customization-form-section"
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors"
                          >
                            Request Quote
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 4: SAVED ADDRESSES (Section 5.5) ================= */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif text-stone-900">
                    Saved Shipping Addresses
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Pre-save your Australian or international shipping destinations for fast white-glove checkout.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingAddressId(null);
                    setAddressForm({
                      label: 'Home',
                      fullName: user?.name || '',
                      street: '',
                      apartment: '',
                      city: '',
                      state: 'NSW',
                      postalCode: '',
                      country: 'Australia',
                      phoneNumber: user?.phoneNumber || '',
                      isDefault: false,
                    });
                    setAddressModalOpen(true);
                  }}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedAddressesList.map((addr) => (
                  <div
                    key={addr._id}
                    className={`p-5 rounded-2xl border transition-all ${
                      addr.isDefault
                        ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-500/30 shadow-sm'
                        : 'border-stone-200 bg-stone-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full font-bold">
                          Default
                        </span>
                      )}
                    </div>

                    <h5 className="text-sm font-semibold text-stone-900">{addr.fullName}</h5>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {addr.street} {addr.apartment ? `, ${addr.apartment}` : ''}
                      <br />
                      {addr.city}, {addr.state} {addr.postalCode}
                      <br />
                      {addr.country}
                    </p>
                    <p className="text-xs text-stone-500 mt-2 font-mono">{addr.phoneNumber}</p>

                    <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-end gap-3 text-xs">
                      <button
                        onClick={() => handleDeleteAddress(addr._id)}
                        className="text-stone-400 hover:text-red-600 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 5: CUSTOM SAPPHIRE QUOTES ================= */}
          {activeTab === 'custom_quotes' && (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif text-stone-900">
                    My Custom Sapphire Requests
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    View your submitted bespoke quote requests, master lapidary CAD reviews, and pricing options.
                  </p>
                </div>
                <Link
                  href="/customize"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>New Custom Design</span>
                </Link>
              </div>

              {customQuotes.length === 0 ? (
                <div className="p-12 text-center text-stone-500 text-xs space-y-3">
                  <Gem className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="font-medium text-stone-700">No bespoke quote requests found.</p>
                  <Link href="/customize" className="text-amber-700 underline font-semibold">
                    Launch the Customize Studio to design a ring
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {customQuotes.map((quote) => (
                    <div
                      key={quote._id || quote.ticketId}
                      className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-200">
                        <div>
                          <span className="font-mono text-xs font-bold text-amber-900">
                            Ticket #{quote.ticketId}
                          </span>
                          <span className="text-xs text-stone-500 ml-2">
                            Submitted on {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                          {quote.status || 'New'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-stone-500 block">Type & Metal</span>
                          <span className="font-semibold text-stone-900">
                            {quote.metalPreference} {quote.jewelleryType}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-500 block">Sapphire & Cut</span>
                          <span className="font-semibold text-stone-900">
                            {quote.sapphireColor} ({quote.cutPreference})
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-500 block">Size</span>
                          <span className="font-semibold text-stone-900">{quote.size || 'To discuss'}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block">Quote Status</span>
                          <span className="font-bold text-emerald-700">
                            {quote.quotedPrice ? `$${quote.quotedPrice} ${quote.quotedCurrency || 'USD'}` : 'Under Review (24-48h)'}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-end">
                        <a
                          href={`https://wa.me/94771234567?text=${encodeURIComponent(
                            `Hello Ceylon Jewels, I am following up on custom quote #${quote.ticketId}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Discuss on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 6: SECURITY & SETTINGS ================= */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-xl font-serif text-stone-900">
                  Profile & Account Settings
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Update your contact preferences and manage account security.
                </p>
              </div>

              {securityMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{securityMessage}</span>
                </div>
              )}

              <form onSubmit={handleUpdateSecurity} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={securityForm.name}
                    onChange={(e) => setSecurityForm({ ...securityForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Email Address (Read Only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || 'genevieve@ceylonjewels.com'}
                    className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-stone-500 text-xs cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <PhoneInput
                    value={securityForm.phoneNumber}
                    onChange={(val) => setSecurityForm({ ...securityForm, phoneNumber: val })}
                    placeholder="400 000 000"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Address Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <h3 className="text-lg font-serif text-stone-900 font-medium">
                {editingAddressId ? 'Edit Address' : 'Add New Delivery Address'}
              </h3>
              <button
                onClick={() => setAddressModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">Address Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Home, Sydney Studio"
                    value={addressForm.label}
                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-stone-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="Street name & number"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-stone-700 mb-1">Apartment / Suite (Optional)</label>
                <input
                  type="text"
                  placeholder="Apartment, suite, unit, etc."
                  value={addressForm.apartment}
                  onChange={(e) => setAddressForm({ ...addressForm, apartment: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">City / Suburb</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sydney"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">State / Territory</label>
                  <select
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="NSW">NSW (New South Wales)</option>
                    <option value="VIC">VIC (Victoria)</option>
                    <option value="QLD">QLD (Queensland)</option>
                    <option value="WA">WA (Western Australia)</option>
                    <option value="SA">SA (South Australia)</option>
                    <option value="TAS">TAS (Tasmania)</option>
                    <option value="ACT">ACT (Australian Capital Territory)</option>
                    <option value="NT">NT (Northern Territory)</option>
                    <option value="Other">Other / International</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">Postcode</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2000"
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">Contact Phone</label>
                  <PhoneInput
                    value={addressForm.phoneNumber}
                    onChange={(val) => setAddressForm({ ...addressForm, phoneNumber: val })}
                    placeholder="400 000 000"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-md text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-md font-semibold uppercase tracking-wider"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
