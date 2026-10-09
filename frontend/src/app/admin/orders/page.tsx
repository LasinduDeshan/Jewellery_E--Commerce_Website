'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Shield,
  Search,
  Filter,
  RefreshCw,
  Truck,
  Package,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Gem,
  ArrowLeft,
  ExternalLink,
  Calendar,
  DollarSign,
  FileText,
  MapPin,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

interface OrderItem {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  status:
    | 'Processing'
    | 'Gem Setting & Inspection'
    | 'Pending NGJA Export Clearance'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled';
  isNgjaCleared: boolean;
  ngjaClearanceDate?: string;
  trackingNumber?: string;
  courierPartner?: 'DHL Express' | 'FedEx International' | 'Australia Post Global' | 'Other';
  trackingUrl?: string;
  estimatedDeliveryDate?: string;
  itemsPrice: number;
  shippingPrice: number;
  dutyEstimated: number;
  totalPrice: number;
  currency: 'AUD' | 'USD';
  paymentMethod: string;
  paymentStatus: string;
  adminNotes?: string;
  shippingAddress: {
    fullName: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
  };
  orderItems: Array<{
    title: string;
    quantity: number;
    price: number;
    currency: string;
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

export default function AdminOrdersFulfilmentPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string>('');

  // Editable Tracking Fields
  const [editStatus, setEditStatus] = useState<string>('Processing');
  const [editIsNgjaCleared, setEditIsNgjaCleared] = useState<boolean>(false);
  const [editCourierPartner, setEditCourierPartner] = useState<string>('DHL Express');
  const [editTrackingNumber, setEditTrackingNumber] = useState<string>('');
  const [editTrackingUrl, setEditTrackingUrl] = useState<string>('');
  const [editEstimatedDate, setEditEstimatedDate] = useState<string>('');
  const [editAdminNotes, setEditAdminNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  // Modals
  const [labelModalOpen, setLabelModalOpen] = useState<boolean>(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const query = new URLSearchParams();
      if (statusFilter !== 'all') query.append('status', statusFilter);
      if (searchTerm) query.append('search', searchTerm);

      const res = await fetch(`${apiUrl}/orders?${query.toString()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
        if (data.data.length > 0) {
          setSelectedOrder((prev) => {
            if (!prev) return data.data[0];
            const found = data.data.find((o: OrderItem) => o._id === prev._id || o.orderNumber === prev.orderNumber);
            return found || data.data[0];
          });
        } else {
          setSelectedOrder(null);
        }
      }
    } catch (e: any) {
      console.error('Failed to fetch orders:', e);
      setFetchError('Could not reach backend API at http://localhost:5000/api. Showing local orders.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Sync edit form when selectedOrder changes
  useEffect(() => {
    if (selectedOrder) {
      setEditStatus(selectedOrder.status);
      setEditIsNgjaCleared(selectedOrder.isNgjaCleared || false);
      setEditCourierPartner(selectedOrder.courierPartner || 'DHL Express');
      setEditTrackingNumber(selectedOrder.trackingNumber || '');
      setEditTrackingUrl(selectedOrder.trackingUrl || '');
      setEditEstimatedDate(selectedOrder.estimatedDeliveryDate || '');
      setEditAdminNotes(selectedOrder.adminNotes || '');
    }
  }, [selectedOrder]);

  const handleSaveTracking = async () => {
    if (!selectedOrder) return;
    setIsSaving(true);
    setSaveSuccessMsg('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/orders/${selectedOrder._id}/tracking`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          isNgjaCleared: editIsNgjaCleared,
          courierPartner: editCourierPartner,
          trackingNumber: editTrackingNumber,
          trackingUrl: editTrackingUrl,
          estimatedDeliveryDate: editEstimatedDate,
          adminNotes: editAdminNotes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const updated = data.data;
        setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
        setSelectedOrder(updated);
        setSaveSuccessMsg('Tracking details & status saved successfully!');
      } else {
        // Local update fallback
        const updated: OrderItem = {
          ...selectedOrder,
          status: editStatus as any,
          isNgjaCleared: editIsNgjaCleared,
          courierPartner: editCourierPartner as any,
          trackingNumber: editTrackingNumber,
          trackingUrl: editTrackingUrl || (editCourierPartner === 'DHL Express' ? `https://www.dhl.com/en/express/tracking.html?AWB=${editTrackingNumber}` : ''),
          estimatedDeliveryDate: editEstimatedDate,
          adminNotes: editAdminNotes,
        };
        setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
        setSelectedOrder(updated);
        setSaveSuccessMsg('Saved locally!');
      }
    } catch (e) {
      setSaveSuccessMsg('Updated locally!');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    }
  };

  // Flag for NGJA Export Clearance Quick Toggle
  const handleToggleNgjaClearance = () => {
    const nextVal = !editIsNgjaCleared;
    setEditIsNgjaCleared(nextVal);
    if (!nextVal && editStatus === 'Shipped') {
      setEditStatus('Pending NGJA Export Clearance');
    } else if (nextVal && editStatus === 'Pending NGJA Export Clearance') {
      setEditStatus('Shipped');
    }
  };

  // Export Order Data for Courier Bulk Upload (DHL / FedEx CSV)
  const handleExportCourierCSV = (partner: 'DHL' | 'FedEx') => {
    if (!selectedOrder) return;

    let headers = '';
    let row = '';

    if (partner === 'DHL') {
      headers = 'ShipperAccount,ReceiverName,ReceiverPhone,AddressLine1,AddressLine2,City,State,PostalCode,Country,DeclaredValue,Currency,ItemDescription,WeightKg,PieceCount';
      row = `"958402941","${selectedOrder.shippingAddress.fullName}","${selectedOrder.shippingAddress.phoneNumber}","${selectedOrder.shippingAddress.street}","${selectedOrder.shippingAddress.apartment || ''}","${selectedOrder.shippingAddress.city}","${selectedOrder.shippingAddress.state}","${selectedOrder.shippingAddress.postalCode}","AU","${selectedOrder.totalPrice}","AUD","Ceylon Natural Sapphire Jewellery HS711319","0.35","1"`;
    } else {
      headers = 'SenderCompany,RecipientName,RecipientPhone,Address1,Address2,City,StateCode,PostalCode,CountryCode,CommodityDescription,CustomsValue,CustomsCurrency,TotalWeight';
      row = `"Aura Ceylon Jewels","${selectedOrder.shippingAddress.fullName}","${selectedOrder.shippingAddress.phoneNumber}","${selectedOrder.shippingAddress.street}","${selectedOrder.shippingAddress.apartment || ''}","${selectedOrder.shippingAddress.city}","${selectedOrder.shippingAddress.state}","${selectedOrder.shippingAddress.postalCode}","AU","Handcrafted Precious Metal Sapphire Jewellery HS711319","${selectedOrder.totalPrice}","AUD","0.35"`;
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, row].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${partner}_Courier_Export_${selectedOrder.orderNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'Processing':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Gem Setting & Inspection':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Pending NGJA Export Clearance':
        return 'bg-purple-100 text-purple-900 border-purple-300 font-bold';
      case 'Shipped':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      case 'Delivered':
        return 'bg-stone-100 text-stone-800 border-stone-300';
      default:
        return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-stone-900 text-white border-b border-stone-800 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
              title="Return to Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <h1 className="text-lg font-serif tracking-wide text-white font-medium">
                  Atelier Logistics Desk • Shipping & Fulfilment (Section 5.4)
                </h1>
              </div>
              <p className="text-[11px] text-stone-400">
                Manage Sri Lanka → Australia courier dispatches, NGJA export clearance, and shipping labels.
              </p>
            </div>
          </div>

          {/* Quick Switch to Custom Quotes & Refresh */}
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/custom-requests"
              className="text-xs text-stone-300 hover:text-white px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-700 flex items-center gap-1.5 transition-colors"
            >
              <Gem className="w-3.5 h-3.5 text-amber-400" />
              <span>Custom Sapphire Quotes</span>
            </Link>

            <button
              onClick={fetchOrders}
              className="p-2 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer flex items-center gap-1 text-xs"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Error Alert Banner */}
      {fetchError && (
        <div className="max-w-7xl w-full mx-auto px-6 pt-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{fetchError}</span>
            </div>
            <button onClick={fetchOrders} className="underline font-semibold hover:text-amber-950 cursor-pointer">
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Filter & Orders List */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search order #, customer, tracking #..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'Processing', label: 'Processing' },
                { id: 'Pending NGJA Export Clearance', label: 'NGJA Clearance' },
                { id: 'Shipped', label: 'Shipped' },
                { id: 'Delivered', label: 'Delivered' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors ${
                    statusFilter === st.id
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Orders */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm divide-y divide-stone-100 overflow-hidden max-h-[calc(100vh-280px)] overflow-y-auto">
            {loading ? (
              <div className="p-12 text-center text-stone-500 text-xs flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-amber-600" />
                <span>Loading orders...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-10 text-center text-stone-500 text-xs space-y-2">
                <Package className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="font-medium text-stone-700">No orders found matching filters.</p>
              </div>
            ) : (
              orders.map((ord) => {
                const isSelected = selectedOrder?._id === ord._id || selectedOrder?.orderNumber === ord.orderNumber;

                return (
                  <div
                    key={ord._id || ord.orderNumber}
                    onClick={() => setSelectedOrder(ord)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-amber-50/80 border-l-4 border-amber-600'
                        : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-amber-900">
                        {ord.orderNumber}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusBadge(ord.status)}`}>
                        {ord.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-900 font-semibold">
                      <span>{ord.customerName}</span>
                      <span className="font-serif">${ord.totalPrice} {ord.currency}</span>
                    </div>

                    <div className="text-[11px] text-stone-500 mt-0.5">
                      {ord.shippingAddress?.city}, {ord.shippingAddress?.state} {ord.shippingAddress?.country}
                    </div>

                    {/* NGJA or Tracking indicator */}
                    <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-stone-100">
                      {ord.isNgjaCleared ? (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>NGJA Cleared</span>
                        </span>
                      ) : (
                        <span className="text-purple-700 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-purple-600" />
                          <span>Needs NGJA Seal</span>
                        </span>
                      )}

                      {ord.trackingNumber ? (
                        <span className="font-mono text-stone-600 text-[10px]">
                          {ord.courierPartner?.split(' ')[0]}: {ord.trackingNumber}
                        </span>
                      ) : (
                        <span className="text-amber-700 text-[10px] font-medium">Awaiting Dispatch</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Fulfilment Panel, Shipping Label, and Tracking Control */}
        <div className="lg:col-span-7">
          {selectedOrder ? (
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Header Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-amber-900">
                      {selectedOrder.orderNumber}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border ${getStatusBadge(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()} • {selectedOrder.customerEmail}
                  </p>
                </div>

                {/* Print Shipping Label and Courier Export Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLabelModalOpen(true)}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    title="Generate printable 4x6 courier shipping label"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Print Label</span>
                  </button>

                  <div className="relative group">
                    <button
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-md text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-stone-600" />
                      <span>Export CSV</span>
                    </button>
                    <div className="absolute right-0 mt-1 w-44 bg-white border border-stone-200 rounded-lg shadow-lg py-1 z-20 hidden group-hover:block text-xs">
                      <button
                        onClick={() => handleExportCourierCSV('DHL')}
                        className="w-full text-left px-3 py-1.5 hover:bg-stone-50 text-stone-800 flex items-center gap-2 cursor-pointer"
                      >
                        <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                        <span>DHL Express CSV</span>
                      </button>
                      <button
                        onClick={() => handleExportCourierCSV('FedEx')}
                        className="w-full text-left px-3 py-1.5 hover:bg-stone-50 text-stone-800 flex items-center gap-2 cursor-pointer"
                      >
                        <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                        <span>FedEx International CSV</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. NGJA Export Clearance Flag (Section 5.4 Mandatory Step) */}
              <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-700" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                      National Gem & Jewellery Authority (NGJA) Export Appraisal
                    </h4>
                  </div>
                  <p className="text-[11px] text-purple-800 mt-1">
                    Sri Lankan law requires gemstone parcels to be inspected and sealed by NGJA gemologists prior to international export.
                  </p>
                  <div className="text-[11px] text-purple-900 font-medium mt-1">
                    Current Status:{' '}
                    {editIsNgjaCleared ? (
                      <span className="text-emerald-700 font-bold">
                        ✓ Approved & Cleared for Courier Dispatch
                      </span>
                    ) : (
                      <span className="text-amber-800 font-bold">
                        ⏳ Pending NGJA Export Clearance Seal
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleNgjaClearance}
                  className={`px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 cursor-pointer ${
                    editIsNgjaCleared
                      ? 'bg-purple-200 hover:bg-purple-300 text-purple-900'
                      : 'bg-purple-700 hover:bg-purple-800 text-white shadow-sm'
                  }`}
                >
                  {editIsNgjaCleared ? 'Revoke / Flag Pending' : 'Mark NGJA Cleared ✓'}
                </button>
              </div>

              {/* 2. Order Items and Destination Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Consignee Address */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center gap-1.5 text-stone-500 font-semibold uppercase text-[10px] tracking-wider mb-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    <span>Australian Delivery Destination</span>
                  </div>
                  <h5 className="font-bold text-stone-900 text-sm">{selectedOrder.shippingAddress.fullName}</h5>
                  <p className="text-stone-600 mt-0.5 leading-relaxed">
                    {selectedOrder.shippingAddress.street}
                    {selectedOrder.shippingAddress.apartment ? `, ${selectedOrder.shippingAddress.apartment}` : ''}
                    <br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                    <br />
                    {selectedOrder.shippingAddress.country}
                  </p>
                  <p className="font-mono text-stone-700 mt-2">{selectedOrder.shippingAddress.phoneNumber}</p>
                </div>

                {/* Jewellery Item */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-stone-500 font-semibold uppercase text-[10px] tracking-wider mb-2">
                      <Gem className="w-3.5 h-3.5 text-amber-700" />
                      <span>Declared Jewellery Commodity</span>
                    </div>
                    {selectedOrder.orderItems.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3 mb-2">
                        <img src={it.image} alt={it.title} className="w-12 h-12 rounded-lg object-cover border border-stone-300" />
                        <div>
                          <h6 className="font-semibold text-stone-900 line-clamp-1">{it.title}</h6>
                          <span className="text-stone-500 text-[11px]">
                            {it.metal} • {it.gemstone}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between font-medium">
                    <span className="text-stone-500">Declared Value:</span>
                    <span className="font-bold text-stone-900 font-serif">${selectedOrder.totalPrice} {selectedOrder.currency}</span>
                  </div>
                </div>
              </div>

              {/* 3. Manual Courier Tracking & Status Update Form (Section 5.4) */}
              <div className="pt-4 border-t border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-700" />
                    <span>Manual Courier Tracking & Status Control</span>
                  </h4>
                  <span className="text-[11px] text-stone-500">
                    Directly updates the customer&apos;s live tracking timeline
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Status Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Order Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Gem Setting & Inspection">Gem Setting & QC</option>
                      <option value="Pending NGJA Export Clearance">Pending NGJA Export Clearance</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Courier Partner */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Courier Partner
                    </label>
                    <select
                      value={editCourierPartner}
                      onChange={(e) => setEditCourierPartner(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                    >
                      <option value="DHL Express">DHL Express</option>
                      <option value="FedEx International">FedEx International</option>
                      <option value="Australia Post Global">Australia Post Global</option>
                      <option value="Other">Other Courier</option>
                    </select>
                  </div>

                  {/* Tracking Number Input */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Tracking Number (AWB)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DHL-AU-98302941"
                      value={editTrackingNumber}
                      onChange={(e) => setEditTrackingNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Optional Custom Tracking URL */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Live Courier URL (Auto-generated if blank)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.dhl.com/en/express/tracking.html?AWB=..."
                      value={editTrackingUrl}
                      onChange={(e) => setEditTrackingUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Estimated Delivery Date */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Estimated Delivery Date to Australia
                    </label>
                    <input
                      type="date"
                      value={editEstimatedDate}
                      onChange={(e) => setEditEstimatedDate(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Internal Founder Notes */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Internal Founder / Atelier Notes (Export permit #, airway bill details)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Log NGJA certificate serial number, flight details, or courier pickup receipt..."
                    value={editAdminNotes}
                    onChange={(e) => setEditAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Save Tracking Action Button */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-emerald-700 font-bold">{saveSuccessMsg}</span>
                  <button
                    type="button"
                    onClick={handleSaveTracking}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {isSaving ? 'Updating Tracking...' : 'Save Fulfilment & Tracking Updates'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500 text-xs">
              Select an order from the list to view fulfilment details and update courier tracking.
            </div>
          )}
        </div>
      </main>

      {/* ================= PRINTABLE COURIER SHIPPING LABEL MODAL ================= */}
      {labelModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-300 text-stone-900 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Controls Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Airway Bill / Shipping Label (4x6 Courier Format)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Label</span>
                </button>
                <button
                  onClick={() => setLabelModalOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Label Paper Surface */}
            <div id="printable-shipping-label" className="p-6 border-2 border-stone-900 rounded-lg bg-white font-sans text-xs space-y-4">
              {/* Courier Header Bar */}
              <div className="flex items-center justify-between border-b-2 border-stone-900 pb-3">
                <div className="font-extrabold text-2xl tracking-tighter uppercase font-mono">
                  {selectedOrder.courierPartner || 'DHL EXPRESS'}
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold block">International Priority Air</span>
                  <span className="font-mono text-sm font-bold">
                    AWB: {selectedOrder.trackingNumber || 'PENDING DISPATCH'}
                  </span>
                </div>
              </div>

              {/* Shipper & Consignee Row */}
              <div className="grid grid-cols-2 gap-4 border-b-2 border-stone-900 pb-4">
                {/* Shipper in Sri Lanka */}
                <div className="border-r border-stone-300 pr-3">
                  <span className="text-[10px] uppercase font-extrabold text-stone-500 block mb-1">
                    FROM (SHIPPER):
                  </span>
                  <div className="font-bold text-stone-900">Aura Ceylon Jewels Atelier</div>
                  <div>14 Dharmapala Mawatha, Colombo 00700</div>
                  <div>SRI LANKA</div>
                  <div className="text-[11px] mt-1 font-mono">Tel: +94 77 123 4567</div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">NGJA License: EXP/2026/842</div>
                </div>

                {/* Receiver in Australia */}
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-stone-500 block mb-1">
                    SHIP TO (CONSIGNEE):
                  </span>
                  <div className="font-bold text-stone-900 text-sm">{selectedOrder.shippingAddress.fullName}</div>
                  <div>{selectedOrder.shippingAddress.street}</div>
                  {selectedOrder.shippingAddress.apartment && <div>{selectedOrder.shippingAddress.apartment}</div>}
                  <div className="font-bold">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                  </div>
                  <div className="font-extrabold uppercase text-sm">{selectedOrder.shippingAddress.country}</div>
                  <div className="font-mono text-xs mt-1">Tel: {selectedOrder.shippingAddress.phoneNumber}</div>
                </div>
              </div>

              {/* Commodity & Customs Details */}
              <div className="grid grid-cols-3 gap-2 border-b-2 border-stone-900 pb-3 text-[11px]">
                <div>
                  <span className="text-stone-500 block text-[9px] uppercase font-bold">Harmonized HS Code:</span>
                  <span className="font-mono font-bold">7113.19.00</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[9px] uppercase font-bold">Gross Parcel Weight:</span>
                  <span className="font-mono font-bold">0.35 KG (Velvet Keepsake Box)</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[9px] uppercase font-bold">Declared Customs Value:</span>
                  <span className="font-mono font-bold">${selectedOrder.totalPrice} {selectedOrder.currency}</span>
                </div>
              </div>

              {/* Order Item Description */}
              <div className="border-b-2 border-stone-900 pb-3 text-xs">
                <span className="text-stone-500 text-[9px] uppercase font-bold block mb-1">
                  Contents & Gemological Declaration:
                </span>
                <div className="font-medium text-stone-900">
                  {selectedOrder.orderItems.map((i) => `${i.title} (${i.metal || 'Precious Metal'}, ${i.gemstone || 'Natural Ceylon Sapphire'})`).join('; ')}
                </div>
                <div className="text-[10px] text-stone-600 mt-1 italic">
                  ✓ Certified Natural Ceylon Origin • Accompanied by National Gem & Jewellery Authority (NGJA) Export Seal
                </div>
              </div>

              {/* Simulated Barcode Graphic */}
              <div className="text-center pt-2">
                <div className="inline-block p-2 bg-stone-100 rounded border border-stone-300">
                  <div className="font-mono text-xl tracking-[0.3em] font-extrabold select-none">
                    ||||| | |||| ||| ||||||| ||| |||||
                  </div>
                  <span className="font-mono text-[10px] text-stone-600 block mt-1">
                    *{selectedOrder.trackingNumber || selectedOrder.orderNumber}*
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
