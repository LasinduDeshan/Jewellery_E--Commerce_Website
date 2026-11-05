'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Check,
  Shield,
  Truck,
  MessageCircle,
  Gem,
  Bell,
  Building2,
  RefreshCw,
  Globe,
  Sliders,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Crown,
} from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';

interface AdminSettingsState {
  // Store Profile
  storeName: string;
  atelierAddress: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  australiaContact: string;

  // NGJA Compliance
  ngjaLicenseNumber: string;
  gemstoneAssayer: string;
  exportSealPrefix: string;
  mandatoryNgjaThresholdAUD: number;
  autoAttachNgjaPdf: boolean;

  // Courier & Logistics
  defaultCourier: string;
  dhlAccountNumber: string;
  fedexAccountNumber: string;
  estimatedTransitDays: string;
  freeShippingThresholdAUD: number;

  // WhatsApp Concierge
  whatsappConciergeNumber: string;
  whatsappDefaultMessage: string;
  enableCartWhatsappChat: boolean;
  enableFloatingWhatsapp: boolean;

  // Inventory & Alerts
  lowStockThreshold: number;
  orderNotificationEmail: boolean;
  autoApproveVerifiedReviews: boolean;
}

const DEFAULT_SETTINGS: AdminSettingsState = {
  storeName: 'Zeyloraa',
  atelierAddress: '14 Dharmapala Mawatha, Colombo 00700, Sri Lanka',
  supportEmail: 'concierge@auraceylon.com',
  supportPhone: '+94 77 123 4567',
  currency: 'AUD ($)',
  australiaContact: 'Melbourne Concierge Office (Collins Street)',

  ngjaLicenseNumber: 'EXP/2026/842',
  gemstoneAssayer: 'Colombo Central Gemological Laboratory',
  exportSealPrefix: 'NGJA-EXP-2026-',
  mandatoryNgjaThresholdAUD: 1000,
  autoAttachNgjaPdf: true,

  defaultCourier: 'DHL Express Worldwide',
  dhlAccountNumber: 'AU-98302941',
  fedexAccountNumber: 'FX-88129031',
  estimatedTransitDays: '3-5 Business Days (Air Express)',
  freeShippingThresholdAUD: 500,

  whatsappConciergeNumber: '+94 77 123 4567',
  whatsappDefaultMessage: 'Hello Zeyloraa, I would like to inquire about bespoke sapphire jewellery.',
  enableCartWhatsappChat: true,
  enableFloatingWhatsapp: true,

  lowStockThreshold: 2,
  orderNotificationEmail: true,
  autoApproveVerifiedReviews: false,
};

export default function AdminSettingsPage() {
  const { adminUser, isSuperAdmin, updateAdminPassword, toggleTwoFactor } = useAdminAuth();
  const [settings, setSettings] = useState<AdminSettingsState>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<'profile' | 'ngja' | 'courier' | 'whatsapp' | 'inventory' | 'security'>('profile');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Security & Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);

  // 2FA Toggle State
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorMsg, setTwoFactorMsg] = useState<string | null>(null);

  // Load saved settings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('aura_admin_settings');
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch {
      // Fallback to default
    }
  }, []);

  const handleChange = <K extends keyof AdminSettingsState>(key: K, value: AdminSettingsState[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      try {
        localStorage.setItem('aura_admin_settings', JSON.stringify(settings));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch {
        // storage error handling
      } finally {
        setSaving(false);
      }
    }, 400);
  };

  const handleReset = () => {
    if (window.confirm('Reset all operational settings to default store configurations?')) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.removeItem('aura_admin_settings');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(null);

    if (!currentPassword) {
      setPwdError('Please enter your current administrator password.');
      return;
    }
    if (newPassword.length < 8) {
      setPwdError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match. Please verify and try again.');
      return;
    }

    setPwdLoading(true);
    const result = await updateAdminPassword(newPassword, currentPassword);
    setPwdLoading(false);

    if (result.success) {
      setPwdSuccess('Administrator password updated successfully. Your new password is now active.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwdSuccess(null), 6000);
    } else {
      setPwdError(result.message || 'Failed to update password.');
    }
  };

  const handleToggle2FA = async () => {
    setTwoFactorLoading(true);
    setTwoFactorMsg(null);
    const targetState = !adminUser?.twoFactorEnabled;
    const res = await toggleTwoFactor(targetState);
    setTwoFactorLoading(false);
    setTwoFactorMsg(res.message);
    setTimeout(() => setTwoFactorMsg(null), 5000);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Top Banner and Quick Actions */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-black">Store Operational Settings</h2>
          <p className="text-xs text-neutral-500 font-light mt-0.5">
            Configure boutique identity, Colombo NGJA export permits, Australia air courier rules, and WhatsApp concierge channels.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-full border border-neutral-200/90 hover:border-black text-xs font-medium text-neutral-600 hover:text-black transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
            title="Reset to factory defaults"
          >
            <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-medium transition-colors shadow-2xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Saved Successfully</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { id: 'profile', label: 'Store Profile', icon: Building2 },
          { id: 'ngja', label: 'NGJA Export & Customs', icon: Shield },
          { id: 'courier', label: 'Shipping & Couriers', icon: Truck },
          { id: 'whatsapp', label: 'WhatsApp Concierge', icon: MessageCircle },
          { id: 'inventory', label: 'Inventory & Alerts', icon: Sliders },
          { id: 'security', label: 'Security & Password', icon: KeyRound },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-black text-white font-medium shadow-2xs'
                  : 'bg-white border border-neutral-200/90 text-neutral-600 hover:text-black hover:bg-neutral-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Form Container */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: Store Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-5 animate-in fade-in duration-150">
            <div className="pb-3 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-black">Store & Brand Identity</h3>
                <p className="text-xs text-neutral-500 font-light mt-0.5">
                  General boutique contact details printed on buyer invoices, packing slips, and email receipts.
                </p>
              </div>
              <Building2 className="w-5 h-5 text-neutral-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Boutique Brand Name</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => handleChange('storeName', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900 font-sans"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Primary Storefront Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900 bg-white font-sans"
                >
                  <option value="AUD ($)">AUD ($) - Australian Dollar (Default)</option>
                  <option value="USD ($)">USD ($) - United States Dollar</option>
                  <option value="LKR (Rs)">LKR (Rs) - Sri Lankan Rupee</option>
                  <option value="GBP (£)">GBP (£) - British Pound</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-700 font-medium mb-1">Colombo Store Address</label>
                <input
                  type="text"
                  value={settings.atelierAddress}
                  onChange={(e) => handleChange('atelierAddress', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900 font-sans"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  This address will appear as the official shipper on international airway bills and customs declarations.
                </span>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Client Concierge Email</label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900 font-sans"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Store Phone Contact</label>
                <input
                  type="text"
                  value={settings.supportPhone}
                  onChange={(e) => handleChange('supportPhone', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900 font-sans"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-700 font-medium mb-1">Australia Client Liaison Office</label>
                <input
                  type="text"
                  value={settings.australiaContact}
                  onChange={(e) => handleChange('australiaContact', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900 font-sans"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NGJA Export & Customs */}
        {activeTab === 'ngja' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-5 animate-in fade-in duration-150">
            <div className="pb-3 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-black">NGJA Export & Customs Regulations</h3>
                <p className="text-xs text-neutral-500 font-light mt-0.5">
                  Sri Lankan National Gem & Jewellery Authority compliance credentials for legal international courier dispatches.
                </p>
              </div>
              <Shield className="w-5 h-5 text-neutral-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">NGJA Commercial Dealer License #</label>
                <input
                  type="text"
                  value={settings.ngjaLicenseNumber}
                  onChange={(e) => handleChange('ngjaLicenseNumber', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs font-mono text-neutral-900"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Printed automatically onto commercial manifests and DHL courier documentation.
                </span>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Registered Gemological Assayer</label>
                <input
                  type="text"
                  value={settings.gemstoneAssayer}
                  onChange={(e) => handleChange('gemstoneAssayer', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Clearance Certificate Serial Prefix</label>
                <input
                  type="text"
                  value={settings.exportSealPrefix}
                  onChange={(e) => handleChange('exportSealPrefix', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs font-mono text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">
                  Mandatory NGJA Appraisal Value Threshold ($ AUD)
                </label>
                <input
                  type="number"
                  value={settings.mandatoryNgjaThresholdAUD}
                  onChange={(e) => handleChange('mandatoryNgjaThresholdAUD', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Orders exceeding this value automatically trigger the &apos;Pending NGJA Seal&apos; workflow.
                </span>
              </div>

              <div className="sm:col-span-2 pt-2">
                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/90 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoAttachNgjaPdf}
                    onChange={(e) => handleChange('autoAttachNgjaPdf', e.target.checked)}
                    className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-neutral-900">
                      Include Digital NGJA Certificate in Order Confirmation Emails
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Automatically delivers the official Sri Lankan gemological certificate PDF to Australian buyers upon courier dispatch.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Courier & Logistics */}
        {activeTab === 'courier' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-5 animate-in fade-in duration-150">
            <div className="pb-3 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-black">Express Courier & Logistics Integration</h3>
                <p className="text-xs text-neutral-500 font-light mt-0.5">
                  Manage DHL Express Worldwide and FedEx International priority shipping presets.
                </p>
              </div>
              <Truck className="w-5 h-5 text-neutral-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Default Priority Courier</label>
                <select
                  value={settings.defaultCourier}
                  onChange={(e) => handleChange('defaultCourier', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900 bg-white"
                >
                  <option value="DHL Express Worldwide">DHL Express Worldwide (Air Priority)</option>
                  <option value="FedEx International Priority">FedEx International Priority</option>
                  <option value="Australia Post Global Express">Australia Post Global Express</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Estimated Transit Timeline</label>
                <input
                  type="text"
                  value={settings.estimatedTransitDays}
                  onChange={(e) => handleChange('estimatedTransitDays', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">DHL Express Corporate Account #</label>
                <input
                  type="text"
                  value={settings.dhlAccountNumber}
                  onChange={(e) => handleChange('dhlAccountNumber', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs font-mono text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">FedEx Account #</label>
                <input
                  type="text"
                  value={settings.fedexAccountNumber}
                  onChange={(e) => handleChange('fedexAccountNumber', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs font-mono text-neutral-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-700 font-medium mb-1">
                  Complimentary Express Shipping Minimum Order ($ AUD)
                </label>
                <input
                  type="number"
                  value={settings.freeShippingThresholdAUD}
                  onChange={(e) => handleChange('freeShippingThresholdAUD', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Orders over this amount receive complimentary insured door-to-door air courier delivery across Australia.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WhatsApp Concierge */}
        {activeTab === 'whatsapp' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-5 animate-in fade-in duration-150">
            <div className="pb-3 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-black">WhatsApp Client Concierge Settings</h3>
                <p className="text-xs text-neutral-500 font-light mt-0.5">
                  Configure direct WhatsApp click-to-chat inquiry buttons, bag leads, and greeting prompts.
                </p>
              </div>
              <MessageCircle className="w-5 h-5 text-neutral-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-neutral-700 font-medium mb-1">
                  Concierge Official WhatsApp Number (with country code)
                </label>
                <input
                  type="text"
                  value={settings.whatsappConciergeNumber}
                  onChange={(e) => handleChange('whatsappConciergeNumber', e.target.value)}
                  placeholder="e.g. +94771234567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs font-mono text-neutral-900"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  All customer WhatsApp clicks from product pages and cart bags are redirected to this number.
                </span>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-700 font-medium mb-1">Default Inbound Message Greeting</label>
                <textarea
                  rows={2}
                  value={settings.whatsappDefaultMessage}
                  onChange={(e) => handleChange('whatsappDefaultMessage', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900"
                />
              </div>

              <div className="sm:col-span-2 space-y-3 pt-2">
                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/90 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableCartWhatsappChat}
                    onChange={(e) => handleChange('enableCartWhatsappChat', e.target.checked)}
                    className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-neutral-900">
                      Enable Direct WhatsApp Checkout Bag Forwarding
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Allows buyers in Australia to initiate a personalized WhatsApp concierge session directly with items in their bag.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/90 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableFloatingWhatsapp}
                    onChange={(e) => handleChange('enableFloatingWhatsapp', e.target.checked)}
                    className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-neutral-900">
                      Display Floating Concierge Widget on Storefront
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Shows the discrete luxury concierge chat badge on the bottom-right of the boutique website.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Inventory & Alerts */}
        {activeTab === 'inventory' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-5 animate-in fade-in duration-150">
            <div className="pb-3 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-black">Inventory Alerts & Automated Triggers</h3>
                <p className="text-xs text-neutral-500 font-light mt-0.5">
                  Stock thresholds, notification parameters, and customer review moderation rules.
                </p>
              </div>
              <Sliders className="w-5 h-5 text-neutral-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">
                  Low Stock Alert Threshold (Units)
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={settings.lowStockThreshold}
                  onChange={(e) => handleChange('lowStockThreshold', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Triggers an in-app operational notification whenever any ring or necklace stock reaches this level.
                </span>
              </div>

              <div className="space-y-3 sm:col-span-2 pt-2">
                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/90 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.orderNotificationEmail}
                    onChange={(e) => handleChange('orderNotificationEmail', e.target.checked)}
                    className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-neutral-900">
                      Send Instant Email Dispatch Alerts to Store Admin
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Delivers an immediate email notification when high-value sapphire orders are placed by Australian clients.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/90 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoApproveVerifiedReviews}
                    onChange={(e) => handleChange('autoApproveVerifiedReviews', e.target.checked)}
                    className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-neutral-900">
                      Auto-Approve Verified Buyer Reviews (Rating &ge; 4 Stars)
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Automatically publishes verified purchaser reviews without holding them in the moderation queue.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Security & Password Management */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Account Overview Header */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-black">{adminUser?.name || 'Super Administrator'}</h3>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        <Crown className="w-3 h-3 text-amber-600" />
                        {isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 font-mono mt-0.5">{adminUser?.email || 'admin@zeyloraa.com'}</p>
                  </div>
                </div>
                <div className="text-xs text-neutral-500 bg-neutral-50 px-3.5 py-2 rounded-xl border border-neutral-200/70">
                  <span className="font-medium text-neutral-800">Session Status:</span> Encrypted &amp; Authenticated
                </div>
              </div>

              {/* Password Change Sub-Card */}
              <div className="pt-2">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-black flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-neutral-600" />
                    Change Administrator Password
                  </h4>
                  <p className="text-xs text-neutral-500 font-light mt-0.5">
                    Update your executive password directly. Once saved, the new password is encrypted with bcrypt and applied immediately without restarting the server.
                  </p>
                </div>

                {pwdError && (
                  <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{pwdError}</span>
                  </div>
                )}

                {pwdSuccess && (
                  <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{pwdSuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">New Password (Min 8 Chars)</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-medium mb-1">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between pt-2 border-t border-neutral-100">
                  <span className="text-[11px] text-neutral-400">
                    Strong passwords combine uppercase, lowercase, numbers, and symbols.
                  </span>
                  <button
                    type="button"
                    onClick={handlePasswordSubmit}
                    disabled={pwdLoading}
                    className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-semibold transition-colors shadow-2xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {pwdLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Two-Factor Authentication (2FA) Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-sm font-semibold text-black">Two-Factor Authentication (2FA)</h4>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        adminUser?.twoFactorEnabled
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                      }`}
                    >
                      {adminUser?.twoFactorEnabled ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-light mt-1">
                    Require a temporary 6-digit one-time passcode (OTP) on every admin login attempt for enhanced store security.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggle2FA}
                  disabled={twoFactorLoading}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                    adminUser?.twoFactorEnabled
                      ? 'bg-neutral-100 text-neutral-800 hover:bg-red-50 hover:text-red-700 border border-neutral-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
                  }`}
                >
                  {twoFactorLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : adminUser?.twoFactorEnabled ? (
                    'Disable 2FA'
                  ) : (
                    'Enable 2FA'
                  )}
                </button>
              </div>

              {twoFactorMsg && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800">
                  {twoFactorMsg}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Save Bar (Only for operational settings tabs) */}
        {activeTab !== 'security' && (
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-emerald-700 font-semibold">
              {saveSuccess ? 'All configuration preferences saved successfully to store records.' : ''}
            </span>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-medium transition-colors shadow-2xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Preferences...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Saved ✓</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
