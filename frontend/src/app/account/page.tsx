'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/layout/Navbar';
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
  Camera,
  Upload,
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

const avatarPresets = [
  {
    id: 'sapphire',
    name: 'Sapphire Muse',
    gem: 'Ceylon Royal Blue',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'emerald',
    name: 'Emerald Noble',
    gem: 'Colombian Green',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'diamond',
    name: 'Diamond Atelier',
    gem: 'D-Flawless Brilliant',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'ruby',
    name: 'Ruby Sovereign',
    gem: 'Burmese Pigeon Blood',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, token, logout, updateUser } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'addresses' | 'custom_quotes' | 'security'>('overview');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [customQuotes, setCustomQuotes] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile Edit and Avatar States
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const [personalForm, setPersonalForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    bio: '',
  });
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

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
        if (oData.success && Array.isArray(oData.data)) {
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
          // If customer, filter by their email only
          const userEmail = user?.email?.toLowerCase();
          const matched = userEmail
            ? qData.data.filter((q: any) => q.email?.toLowerCase() === userEmail)
            : [];
          setCustomQuotes(matched);
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
      const nameParts = (user.name || '').trim().split(' ');
      setPersonalForm({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phoneNumber: user.phoneNumber || '',
        bio: user.bio || '',
      });
    }
  }, [fetchAccountData, user]);

  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${personalForm.firstName.trim()} ${personalForm.lastName.trim()}`.trim();
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
            name: fullName,
            phoneNumber: personalForm.phoneNumber,
            bio: personalForm.bio,
          }),
        });
      } catch (err) {
        console.warn('Updated profile locally');
      }
    }
    updateUser({
      name: fullName,
      phoneNumber: personalForm.phoneNumber,
      bio: personalForm.bio,
    });
    setIsEditingPersonal(false);
    setProfileSuccessMsg('Personal information updated successfully!');
    setTimeout(() => setProfileSuccessMsg(''), 3000);
  };

  const handleSaveAvatar = async (avatarUrl: string) => {
    if (token) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        await fetch(`${apiUrl}/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ avatar: avatarUrl }),
        });
      } catch (err) {
        console.warn('Avatar updated locally');
      }
    }
    updateUser({ avatar: avatarUrl });
    setIsEditingAvatar(false);
    setProfileSuccessMsg(avatarUrl ? 'Avatar updated successfully!' : 'Avatar reset to monogram');
    setTimeout(() => setProfileSuccessMsg(''), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleSaveAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

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

  const savedAddressesList = user?.savedAddresses || [];

  return (
    <main className="min-h-screen flex flex-col bg-[#fbfbfb]">
      <Navbar />

      {/* Page Title matching reference */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-1">
       
      </div>

      {/* Account Workspace Grid */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-3">
          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-3 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full p-3 rounded-xl text-left text-sm font-medium flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-black text-white font-semibold shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100/80'
              }`}
            >
              <User className={`w-4 h-4 ${activeTab === 'overview' ? 'text-white' : 'text-neutral-500'}`} />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full p-3 rounded-xl text-left text-sm font-medium flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-black text-white font-semibold shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className={`w-4 h-4 ${activeTab === 'orders' ? 'text-white' : 'text-neutral-500'}`} />
                <span>Orders & Tracking</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'orders' ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-700'}`}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full p-3 rounded-xl text-left text-sm font-medium flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'bg-black text-white font-semibold shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className={`w-4 h-4 ${activeTab === 'wishlist' ? 'text-white' : 'text-neutral-500'}`} />
                <span>My Wishlist</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'wishlist' ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-700'}`}>
                {wishlist.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full p-3 rounded-xl text-left text-sm font-medium flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'addresses'
                  ? 'bg-black text-white font-semibold shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100/80'
              }`}
            >
              <MapPin className={`w-4 h-4 ${activeTab === 'addresses' ? 'text-white' : 'text-neutral-500'}`} />
              <span>Saved Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab('custom_quotes')}
              className={`w-full p-3 rounded-xl text-left text-sm font-medium flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'custom_quotes'
                  ? 'bg-black text-white font-semibold shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Gem className={`w-4 h-4 ${activeTab === 'custom_quotes' ? 'text-white' : 'text-neutral-500'}`} />
                <span>Custom Quotes</span>
              </div>
              {customQuotes.length > 0 && (
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'custom_quotes' ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-800'}`}>
                  {customQuotes.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full p-3 rounded-xl text-left text-sm font-medium flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-black text-white font-semibold shadow-xs'
                  : 'text-neutral-700 hover:bg-neutral-100/80'
              }`}
            >
              <KeyRound className={`w-4 h-4 ${activeTab === 'security' ? 'text-white' : 'text-neutral-500'}`} />
              <span>Security</span>
            </button>

            {/* Red Sign Out / Delete Account link matching reference */}
            <div className="pt-2 border-t border-neutral-100 mt-2">
              <button
                onClick={handleLogout}
                className="w-full p-3 rounded-xl text-left text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50/70 flex items-center gap-3 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Concierge Help Box */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 text-xs text-neutral-800 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 font-semibold text-neutral-900">
              <MessageCircle className="w-4 h-4 text-neutral-700" />
              <span>Dedicated Concierge</span>
            </div>
            <p className="text-neutral-600 text-[11px] leading-relaxed">
              Questions regarding Australian customs, duty estimates, or resizing? Chat directly with our Colombo atelier.
            </p>
            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:underline"
            >
              <span>WhatsApp +94 77 123 4567</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </aside>

        {/* Right Main Content Tabs */}
        <div className="lg:col-span-9">
          {/* ================= TAB 1: MY PROFILE (Matching Screenshot + Theme) ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Header Title */}
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200/70">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif text-neutral-900 font-semibold">
                    My Profile
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Manage your personal client identity, avatar, and atelier delivery coordinates.
                  </p>
                </div>
              </div>

              {/* Success Notification */}
              {profileSuccessMsg && (
                <div className="p-3 bg-black text-white rounded-xl text-xs flex items-center gap-2 shadow-sm animate-in fade-in duration-150">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              {/* ================= CARD 1: AVATAR & CLIENT IDENTITY ================= */}
              <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 sm:p-7 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-5">
                    {/* Avatar Circle with image or luxury monogram */}
                    <div
                      className="relative group cursor-pointer shrink-0"
                      onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                      title="Click to change avatar image"
                    >
                      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-black border-2 border-neutral-800 shadow-md flex items-center justify-center">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user?.name || 'Client Avatar'} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-serif text-2xl font-semibold">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        )}
                      </div>
                      {/* Hover overlay with Camera icon */}
                      <div className="absolute inset-0 rounded-full bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-4 h-4" />
                        <span className="text-[9px] font-semibold mt-0.5">Change</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-serif font-semibold text-neutral-900">
                          {user?.name || 'Client'}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200">
                          {user?.role === 'admin' ? 'Atelier Director' : 'VIP Private Client'}
                        </span>
                      </div>
                      {user?.bio && (
                        <p className="text-xs text-neutral-600 font-medium">
                          {user.bio}
                        </p>
                      )}
                      <p className="text-xs text-neutral-400">
                        {savedAddressesList[0]?.city
                          ? `${savedAddressesList[0].city}${savedAddressesList[0].country ? `, ${savedAddressesList[0].country}` : ''}`
                          : 'Location not set'}
                      </p>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                    className="px-3.5 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-900 bg-white hover:bg-neutral-50 text-neutral-700 hover:text-black text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>{isEditingAvatar ? 'Close' : 'Edit'}</span>
                  </button>
                </div>

                {/* Expandable Image Section ("create image section") */}
                {isEditingAvatar && (
                  <div className="mt-4 pt-5 border-t border-neutral-100 space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
                        <span>Curated Atelier Avatars & Custom Upload</span>
                      </h4>
                      {user?.avatar && (
                        <button
                          onClick={() => handleSaveAvatar('')}
                          className="text-[11px] text-neutral-500 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          Reset to Monogram
                        </button>
                      )}
                    </div>

                    {/* Preset Luxury Avatars */}
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-2 font-medium">Choose from Atelier Portraits:</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {avatarPresets.map((preset) => (
                          <div
                            key={preset.id}
                            onClick={() => handleSaveAvatar(preset.url)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                              user?.avatar === preset.url
                                ? 'border-black bg-neutral-50 ring-1 ring-black'
                                : 'border-neutral-200 hover:border-neutral-400 bg-white'
                            }`}
                          >
                            <img src={preset.url} alt={preset.name} className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0" />
                            <div className="min-w-0">
                              <span className="text-xs font-semibold text-neutral-900 block truncate">{preset.name}</span>
                              <span className="text-[10px] text-neutral-400 block truncate">{preset.gem}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Custom Image Upload or Direct URL */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="text-[11px] text-neutral-400 block mb-1 font-medium">Upload Image from Device:</label>
                        <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-neutral-300 hover:border-black bg-neutral-50 hover:bg-neutral-100 text-xs font-medium text-neutral-700 cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Select Local Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                        </label>
                      </div>

                      <div>
                        <label className="text-[11px] text-neutral-400 block mb-1 font-medium">Or Paste Direct Image URL:</label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="https://..."
                            value={avatarUrlInput}
                            onChange={(e) => setAvatarUrlInput(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (avatarUrlInput.trim()) {
                                handleSaveAvatar(avatarUrlInput.trim());
                                setAvatarUrlInput('');
                              }
                            }}
                            className="px-3.5 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ================= CARD 2: PERSONAL INFORMATION ================= */}
              <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 sm:p-7 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <h3 className="text-base font-serif font-semibold text-neutral-900">Personal Information</h3>
                  <button
                    onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                    className="px-3.5 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-900 bg-white hover:bg-neutral-50 text-neutral-700 hover:text-black text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>{isEditingPersonal ? 'Cancel' : 'Edit'}</span>
                  </button>
                </div>

                {isEditingPersonal ? (
                  <form onSubmit={handleSavePersonal} className="space-y-4 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-neutral-500 block mb-1">First Name</label>
                        <input
                          type="text"
                          required
                          value={personalForm.firstName}
                          onChange={(e) => setPersonalForm({ ...personalForm, firstName: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-neutral-500 block mb-1">Last Name</label>
                        <input
                          type="text"
                          value={personalForm.lastName}
                          onChange={(e) => setPersonalForm({ ...personalForm, lastName: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-neutral-500 block mb-1">Email address (Verified)</label>
                        <input
                          type="email"
                          disabled
                          value={user?.email || ''}
                          className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-500 text-xs cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-neutral-500 block mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={personalForm.phoneNumber}
                          onChange={(e) => setPersonalForm({ ...personalForm, phoneNumber: e.target.value })}
                          placeholder="Enter phone number"
                          className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-500 block mb-1">Bio / Atelier Preferences</label>
                      <textarea
                        rows={2}
                        value={personalForm.bio}
                        onChange={(e) => setPersonalForm({ ...personalForm, bio: e.target.value })}
                        placeholder="Client preferences, bespoke ring size notes, gem interests..."
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-black"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingPersonal(false)}
                        className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 text-xs">
                    <div>
                      <span className="text-[11px] font-medium text-neutral-400 block mb-1">First Name</span>
                      <span className="text-sm font-semibold text-neutral-900 block">
                        {user?.name ? user.name.split(' ')[0] : '—'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-medium text-neutral-400 block mb-1">Last Name</span>
                      <span className="text-sm font-semibold text-neutral-900 block">
                        {user?.name && user.name.split(' ').length > 1 ? user.name.split(' ').slice(1).join(' ') : '—'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-medium text-neutral-400 block mb-1">Email address</span>
                      <span className="text-sm font-semibold text-neutral-900 block">
                        {user?.email || '—'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-medium text-neutral-400 block mb-1">Phone</span>
                      <span className="text-sm font-semibold text-neutral-900 block">
                        {user?.phoneNumber || '—'}
                      </span>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-[11px] font-medium text-neutral-400 block mb-1">Bio</span>
                      <span className="text-sm font-semibold text-neutral-900 block">
                        {user?.bio || '—'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ================= CARD 3: ADDRESS ================= */}
              <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 sm:p-7 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <h3 className="text-base font-serif font-semibold text-neutral-900">Address</h3>
                  <button
                    onClick={() => {
                      const defaultAddr = savedAddressesList[0];
                      if (defaultAddr) {
                        setAddressForm({
                          label: defaultAddr.label || 'Home',
                          fullName: defaultAddr.fullName || user?.name || '',
                          street: defaultAddr.street || '',
                          apartment: defaultAddr.apartment || '',
                          city: defaultAddr.city || '',
                          state: defaultAddr.state || 'NSW',
                          postalCode: defaultAddr.postalCode || '',
                          country: defaultAddr.country || 'Australia',
                          phoneNumber: defaultAddr.phoneNumber || user?.phoneNumber || '',
                          isDefault: true,
                        });
                        setEditingAddressId(defaultAddr._id);
                      } else {
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
                          isDefault: true,
                        });
                        setEditingAddressId(null);
                      }
                      setAddressModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-full border border-neutral-200 hover:border-neutral-900 bg-white hover:bg-neutral-50 text-neutral-700 hover:text-black text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>{savedAddressesList.length > 0 ? 'Edit' : 'Add'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 text-xs">
                  <div>
                    <span className="text-[11px] font-medium text-neutral-400 block mb-1">Country</span>
                    <span className="text-sm font-semibold text-neutral-900 block">
                      {savedAddressesList[0]?.country || '—'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-medium text-neutral-400 block mb-1">City/State</span>
                    <span className="text-sm font-semibold text-neutral-900 block">
                      {savedAddressesList[0]?.city
                        ? `${savedAddressesList[0].city}${savedAddressesList[0].state ? `, ${savedAddressesList[0].state}` : ''}`
                        : '—'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-medium text-neutral-400 block mb-1">Postal Code</span>
                    <span className="text-sm font-semibold text-neutral-900 block">
                      {savedAddressesList[0]?.postalCode || '—'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-medium text-neutral-400 block mb-1">TAX ID / Client Reference</span>
                    <span className="text-sm font-semibold text-neutral-900 block font-mono">
                      {user?.id ? `CLI-${user.id.slice(-8).toUpperCase()}` : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Order Quick View (Preserving existing details) */}
              {orders.length > 0 && (
                <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 sm:p-7 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                    <div>
                      <span className="text-xs font-semibold text-neutral-500">
                        Latest Shipment Tracking
                      </span>
                      <h3 className="text-xl font-serif text-neutral-900 mt-0.5">
                        Order #{orders[0].orderNumber}
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-neutral-900 hover:text-neutral-600 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Full Timeline</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Order Card Preview */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                    <div className="flex items-center gap-4">
                      <img
                        src={orders[0].orderItems[0].image}
                        alt={orders[0].orderItems[0].title}
                        className="w-16 h-16 rounded-lg object-cover border border-neutral-300"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-900">
                          {orders[0].orderItems[0].title}
                        </h4>
                        <span className="text-xs text-neutral-500">
                          {orders[0].orderItems[0].metal} • {orders[0].orderItems[0].gemstone}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-neutral-900 font-serif">
                        ${orders[0].totalPrice} {orders[0].currency}
                      </span>
                      <div className="mt-1">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-neutral-200 text-neutral-900 border border-neutral-300">
                          {orders[0].status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Courier info pill */}
                  {orders[0].trackingNumber && (
                    <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-neutral-800">
                        <Truck className="w-4 h-4 text-neutral-700" />
                        <span>
                          <strong>{orders[0].courierPartner}:</strong> #{orders[0].trackingNumber}
                        </span>
                      </div>
                      {orders[0].trackingUrl && (
                        <a
                          href={orders[0].trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8">
                <h3 className="text-xl font-serif text-neutral-900 mb-1">
                  Orders & Sri Lanka → Australia Tracking
                </h3>
                <p className="text-xs text-neutral-500 mb-6">
                  Every Ceylon sapphire piece is independently appraised by the National Gem & Jewellery Authority (NGJA) in Sri Lanka before international courier export.
                </p>

                <div className="space-y-8">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-neutral-200 rounded-2xl p-6 bg-neutral-50/50 space-y-6">
                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200">
                        <div>
                          <span className="font-mono text-xs font-bold text-neutral-900 block">
                            Order #{order.orderNumber}
                          </span>
                          <span className="text-xs text-neutral-500">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold font-serif text-neutral-900">
                            ${order.totalPrice} {order.currency}
                          </span>
                          <span className="text-xs px-3 py-1 rounded-full font-bold bg-neutral-200 text-neutral-900 border border-neutral-300">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {order.orderItems.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-neutral-200">
                            <img src={it.image} alt={it.title} className="w-14 h-14 rounded-lg object-cover" />
                            <div className="flex-1">
                              <h5 className="text-sm font-semibold text-neutral-900">{it.title}</h5>
                              <p className="text-xs text-neutral-500">
                                {it.metal} • {it.gemstone} {it.size ? `• Size: ${it.size}` : ''}
                              </p>
                            </div>
                            <span className="text-xs font-bold text-neutral-900">
                              ${it.price} {order.currency}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* 5-Stage Visual Progress Tracker (Section 5.4) */}
                      <div className="pt-4 border-t border-neutral-200">
                        <h4 className="text-xs font-bold text-neutral-900 mb-4 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-neutral-700" />
                          <span>Fulfillment & Export Journey</span>
                        </h4>

                        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-300">
                          {order.timeline.map((step, sIdx) => (
                            <div key={sIdx} className="relative flex items-start gap-3">
                              <div
                                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                                  step.isCompleted
                                    ? 'bg-black text-white'
                                    : 'bg-neutral-200 text-neutral-400 border border-neutral-300'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <h6
                                  className={`text-xs font-bold ${
                                    step.isCompleted ? 'text-neutral-900' : 'text-neutral-400'
                                  }`}
                                >
                                  {step.title}
                                </h6>
                                <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Courier Tracking Action */}
                      {order.trackingNumber && (
                        <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-200 text-xs flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <span className="text-neutral-500 block">Courier Tracking Number</span>
                            <span className="font-mono font-bold text-neutral-900">
                              {order.courierPartner}: {order.trackingNumber}
                            </span>
                          </div>
                          {order.trackingUrl && (
                            <a
                              href={order.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-md font-semibold text-xs flex items-center gap-1.5 transition-colors"
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
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-serif text-neutral-900">
                    Saved Pieces & Wishlist
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Save your favorite sapphire creations for upcoming anniversaries or gifting milestones.
                  </p>
                </div>
                <span className="text-xs font-bold text-neutral-900 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
                  {wishlist.length} Items Saved
                </span>
              </div>

              {wishlist.length === 0 ? (
                <div className="p-12 text-center text-neutral-500 text-xs space-y-3">
                  <Heart className="w-8 h-8 text-neutral-300 mx-auto" />
                  <p className="font-medium text-neutral-700">Your wishlist is currently empty.</p>
                  <Link
                    href="/customize"
                    className="inline-block px-4 py-2 bg-black text-white rounded-md text-xs font-semibold"
                  >
                    Explore Sapphire Studio
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {wishlist.map((item) => (
                    <div
                      key={item._id}
                      className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50/50 flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-4/3 w-full overflow-hidden bg-neutral-100 relative">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeFromWishlist(item._id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-neutral-500 hover:text-red-600 shadow transition-colors"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-neutral-500">
                            {item.categoryName || 'Fine Jewellery'}
                          </span>
                          <h4 className="text-sm font-semibold text-neutral-900 mt-0.5 line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-neutral-500 mt-1">
                            {item.gemstone || 'Natural Ceylon Corundum'}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
                          <span className="text-base font-serif font-bold text-neutral-900">
                            ${item.discountPrice ?? item.price} AUD
                          </span>
                          <Link
                            href="/customize#customization-form-section"
                            className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white rounded text-xs font-semibold transition-colors"
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
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif text-neutral-900">
                    Saved Shipping Addresses
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
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
                  className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Address</span>
                </button>
              </div>

              {savedAddressesList.length === 0 ? (
                <div className="p-12 text-center text-neutral-500 text-xs space-y-3 bg-neutral-50/50 rounded-2xl border border-neutral-200">
                  <MapPin className="w-8 h-8 text-neutral-300 mx-auto" />
                  <p className="font-medium text-neutral-700">No saved shipping addresses yet.</p>
                  <p className="text-neutral-400 text-[11px]">Add an address for seamless checkout and white-glove courier dispatch.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedAddressesList.map((addr) => (
                    <div
                      key={addr._id}
                      className={`p-5 rounded-2xl border transition-all ${
                        addr.isDefault
                          ? 'border-black bg-neutral-50 ring-1 ring-neutral-400 shadow-sm'
                          : 'border-neutral-200 bg-neutral-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-neutral-900">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold">
                            Default
                          </span>
                        )}
                      </div>

                      <h5 className="text-sm font-semibold text-neutral-900">{addr.fullName}</h5>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                        {addr.street} {addr.apartment ? `, ${addr.apartment}` : ''}
                        <br />
                        {addr.city}, {addr.state} {addr.postalCode}
                        <br />
                        {addr.country}
                      </p>
                      <p className="text-xs text-neutral-500 mt-2 font-mono">{addr.phoneNumber}</p>

                      <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-end gap-3 text-xs">
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 5: CUSTOM SAPPHIRE QUOTES ================= */}
          {activeTab === 'custom_quotes' && (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif text-neutral-900">
                    My Custom Sapphire Requests
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    View your submitted bespoke quote requests, master lapidary CAD reviews, and pricing options.
                  </p>
                </div>
                <Link
                  href="/customize"
                  className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>New Custom Design</span>
                </Link>
              </div>

              {customQuotes.length === 0 ? (
                <div className="p-12 text-center text-neutral-500 text-xs space-y-3">
                  <Gem className="w-8 h-8 text-neutral-300 mx-auto" />
                  <p className="font-medium text-neutral-700">No bespoke quote requests found.</p>
                  <Link href="/customize" className="text-black underline font-semibold">
                    Launch the Customize Studio to design a ring
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {customQuotes.map((quote) => (
                    <div
                      key={quote._id || quote.ticketId}
                      className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-200">
                        <div>
                          <span className="font-mono text-xs font-bold text-neutral-900">
                            Ticket #{quote.ticketId}
                          </span>
                          <span className="text-xs text-neutral-500 ml-2">
                            Submitted on {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-800 border border-neutral-300">
                          {quote.status || 'New'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-neutral-500 block">Type & Metal</span>
                          <span className="font-semibold text-neutral-900">
                            {quote.metalPreference} {quote.jewelleryType}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block">Sapphire & Cut</span>
                          <span className="font-semibold text-neutral-900">
                            {quote.sapphireColor} ({quote.cutPreference})
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block">Size</span>
                          <span className="font-semibold text-neutral-900">{quote.size || 'To discuss'}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block">Quote Status</span>
                          <span className="font-bold text-neutral-900">
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
                          className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-xl font-serif text-neutral-900">
                  Profile & Account Settings
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Update your contact preferences and manage account security.
                </p>
              </div>

              {securityMessage && (
                <div className="p-3 bg-neutral-100 border border-neutral-300 rounded-lg text-neutral-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                  <span>{securityMessage}</span>
                </div>
              )}

              <form onSubmit={handleUpdateSecurity} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={securityForm.name}
                    onChange={(e) => setSecurityForm({ ...securityForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-neutral-900 text-xs focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Email Address (Read Only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 bg-neutral-100 text-neutral-500 text-xs cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
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
                  className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-md text-xs font-semibold transition-colors cursor-pointer"
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <h3 className="text-lg font-serif text-neutral-900 font-medium">
                {editingAddressId ? 'Edit Address' : 'Add New Delivery Address'}
              </h3>
              <button
                onClick={() => setAddressModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Address Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Home, Sydney Studio"
                    value={addressForm.label}
                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="Street name & number"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Apartment / Suite (Optional)</label>
                <input
                  type="text"
                  placeholder="Apartment, suite, unit, etc."
                  value={addressForm.apartment}
                  onChange={(e) => setAddressForm({ ...addressForm, apartment: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">City / Suburb</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sydney"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">State / Territory</label>
                  <select
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none bg-white"
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
                  <label className="block font-semibold text-neutral-700 mb-1">Postcode</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2000"
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Contact Phone</label>
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
                  className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black hover:bg-neutral-800 text-white rounded-md font-semibold cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
