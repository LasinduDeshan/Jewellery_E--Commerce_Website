'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Shield,
  Search,
  Filter,
  RefreshCw,
  MessageCircle,
  Eye,
  CheckCircle,
  Clock,
  Gem,
  ArrowLeft,
  ChevronRight,
  User,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface CustomRequestItem {
  _id: string;
  ticketId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  whatsappNumber?: string;
  country: string;
  preferredContactMethod: 'email' | 'whatsapp' | 'phone';
  jewelleryType: string;
  metalPreference: string;
  sapphireColor: string;
  cutPreference: string;
  size?: string;
  budgetRange?: string;
  occasion?: string;
  referenceImages?: string[];
  specialInstructions?: string;
  status: 'New' | 'Under Review' | 'Quote Sent' | 'Customer Approved' | 'In Production' | 'Completed' | 'Declined';
  adminNotes?: string;
  quotedPrice?: number;
  quotedCurrency?: string;
  createdAt: string;
}

export default function AdminCustomRequestsPage() {
  const [requests, setRequests] = useState<CustomRequestItem[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<CustomRequestItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string>('');

  // Form editing for selected request
  const [editStatus, setEditStatus] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editPrice, setEditPrice] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>('');

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const query = new URLSearchParams();
      if (statusFilter !== 'all') query.append('status', statusFilter);
      if (searchTerm) query.append('search', searchTerm);

      const res = await fetch(`${apiUrl}/custom-requests?${query.toString()}`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setRequests(data.data);
        if (data.data.length > 0) {
          // Select previous or first request
          setSelectedRequest((prev) => {
            if (!prev) return data.data[0];
            const found = data.data.find((item: CustomRequestItem) => item._id === prev._id || item.ticketId === prev.ticketId);
            return found || data.data[0];
          });
        } else {
          setSelectedRequest(null);
        }
      }
    } catch (e: any) {
      console.error('Failed to fetch custom requests:', e);
      setFetchError('Could not reach backend API at http://localhost:5000/api. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);

  // Initial fetch on component mount and filter change
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Sync edit form when selectedRequest changes
  useEffect(() => {
    if (selectedRequest) {
      setEditStatus(selectedRequest.status);
      setEditNotes(selectedRequest.adminNotes || '');
      setEditPrice(selectedRequest.quotedPrice?.toString() || '');
    }
  }, [selectedRequest]);

  const handleUpdate = async () => {
    if (!selectedRequest) return;
    setIsSaving(true);
    setSaveMessage('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/custom-requests/${selectedRequest._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          adminNotes: editNotes,
          quotedPrice: editPrice ? Number(editPrice) : undefined,
        }),
      });

      if (!res.ok) throw new Error('Update failed');

      // Update local state
      const updatedList = requests.map((r) =>
        r._id === selectedRequest._id
          ? {
              ...r,
              status: editStatus as any,
              adminNotes: editNotes,
              quotedPrice: editPrice ? Number(editPrice) : undefined,
            }
          : r
      );
      setRequests(updatedList);
      setSelectedRequest({
        ...selectedRequest,
        status: editStatus as any,
        adminNotes: editNotes,
        quotedPrice: editPrice ? Number(editPrice) : undefined,
      });

      setSaveMessage('Saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (e) {
      setSaveMessage('Error updating request.');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadgeClass = (st: string) => {
    switch (st) {
      case 'New':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Quote Sent':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Customer Approved':
      case 'In Production':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Completed':
        return 'bg-stone-100 text-stone-800 border-stone-300';
      default:
        return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Admin Top Header */}
      <header className="bg-stone-900 text-white border-b border-stone-800 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
              title="Return to Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <h1 className="text-lg font-serif tracking-wide text-white">
                Admin Atelier Desk • Custom Jewellery Quotes
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/orders"
              className="text-xs text-stone-300 hover:text-white px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-700 flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Fulfilment & Shipping Desk</span>
            </Link>
            <Link
              href="/customize"
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              <Gem className="w-3.5 h-3.5" />
              <span>Open Customer Studio</span>
            </Link>
            <button
              onClick={fetchRequests}
              className="p-2 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer flex items-center gap-1 text-xs"
              title="Refresh Requests"
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
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{fetchError}</span>
            </div>
            <button
              onClick={fetchRequests}
              className="underline font-semibold hover:text-red-900 ml-4 cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Filter & Requests List */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search ticket #, name, email, stone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              {['all', 'New', 'Under Review', 'Quote Sent', 'In Production'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors ${
                    statusFilter === st
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {st === 'all' ? 'All Requests' : st}
                </button>
              ))}
            </div>
          </div>

          {/* List of Requests */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm divide-y divide-stone-100 overflow-hidden max-h-[calc(100vh-280px)] overflow-y-auto">
            {loading ? (
              <div className="p-12 text-center text-stone-500 text-xs flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-amber-600" />
                <span>Loading requests from database...</span>
              </div>
            ) : requests.length === 0 ? (
              <div className="p-10 text-center text-stone-500 text-xs space-y-2">
                <Gem className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="font-medium text-stone-700">No custom quote requests found.</p>
                <p className="text-stone-400 text-[11px]">
                  Submit a custom request from the <Link href="/customize" className="text-amber-700 underline">Customize Studio</Link> to see it appear here.
                </p>
              </div>
            ) : (
              requests.map((item) => {
                const isSelected = selectedRequest?._id === item._id || selectedRequest?.ticketId === item.ticketId;

                return (
                  <div
                    key={item._id || item.ticketId}
                    onClick={() => setSelectedRequest(item)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-amber-50/80 border-l-4 border-amber-600'
                        : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-amber-900">
                        {item.ticketId}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getStatusBadgeClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-stone-900">
                      {item.fullName}
                    </h4>

                    <div className="text-xs text-stone-600 mt-0.5">
                      {item.metalPreference} {item.jewelleryType} • <span className="text-amber-800 font-medium">{item.sapphireColor}</span> ({item.cutPreference})
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2">
                      <span>{item.country}</span>
                      <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Request Inspector & Action Panel */}
        <div className="lg:col-span-7">
          {selectedRequest ? (
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-amber-900">
                      {selectedRequest.ticketId}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getStatusBadgeClass(
                        selectedRequest.status
                      )}`}
                    >
                      {selectedRequest.status}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 mt-1">
                    Submitted on {selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleString() : 'Just now'}
                  </div>
                </div>

                {/* Direct WhatsApp Action Button */}
                <a
                  href={`https://wa.me/${selectedRequest.whatsappNumber?.replace(/\D/g, '') || selectedRequest.phoneNumber?.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedRequest.fullName}, this is Ceylon Jewels Concierge regarding your bespoke quote request #${selectedRequest.ticketId}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Customer Info Card */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-stone-500 block">Customer Name</span>
                  <span className="font-semibold text-stone-900 text-sm">{selectedRequest.fullName}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Email Address</span>
                  <a href={`mailto:${selectedRequest.email}`} className="text-amber-700 underline font-medium">
                    {selectedRequest.email}
                  </a>
                </div>
                <div>
                  <span className="text-stone-500 block">Phone / WhatsApp</span>
                  <span className="font-mono text-stone-900">{selectedRequest.phoneNumber}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">Preferred Contact Channel</span>
                  <span className="font-semibold text-stone-900 uppercase">
                    {selectedRequest.preferredContactMethod}
                  </span>
                </div>
              </div>

              {/* Jewellery Specifications */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-3">
                  Jewellery Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-stone-500 block">Jewellery Type</span>
                    <span className="font-semibold text-stone-900 capitalize">{selectedRequest.jewelleryType}</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-stone-500 block">Precious Metal</span>
                    <span className="font-semibold text-stone-900">{selectedRequest.metalPreference}</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-stone-500 block">Sapphire Choice</span>
                    <span className="font-semibold text-stone-900">{selectedRequest.sapphireColor}</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-stone-500 block">Faceting / Cut</span>
                    <span className="font-semibold text-stone-900">{selectedRequest.cutPreference}</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-stone-500 block">Size / Length</span>
                    <span className="font-semibold text-stone-900">{selectedRequest.size || 'Not Specified'}</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-stone-500 block">Budget Range</span>
                    <span className="font-semibold text-stone-900">{selectedRequest.budgetRange || 'Flexible'}</span>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              {selectedRequest.specialInstructions && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
                    Special Instructions / Notes from Customer
                  </h3>
                  <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/60 text-xs text-stone-800 leading-relaxed">
                    {selectedRequest.specialInstructions}
                  </div>
                </div>
              )}

              {/* Reference Images */}
              {selectedRequest.referenceImages && selectedRequest.referenceImages.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-2">
                    Customer Inspiration Reference Photos
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedRequest.referenceImages.map((img, idx) => (
                      <a
                        key={idx}
                        href={img}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-24 h-24 rounded-lg overflow-hidden border border-stone-300 hover:opacity-80 transition-opacity"
                      >
                        <img src={img} alt="Inspiration" className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Quote & Status Action Panel */}
              <div className="pt-6 border-t border-stone-200 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                  Manage Quote & Status
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Update Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                    >
                      <option value="New">New</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Quote Sent">Quote Sent</option>
                      <option value="Customer Approved">Customer Approved</option>
                      <option value="In Production">In Production</option>
                      <option value="Completed">Completed</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Quoted Price (USD)</label>
                    <input
                      type="number"
                      placeholder="e.g. 2400"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Internal Founder / Lapidary Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Log rough stone weight, carat availability, CAD link, or customer call notes..."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-md text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-emerald-700 font-medium">{saveMessage}</span>
                  <button
                    onClick={handleUpdate}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? 'Saving...' : 'Save Updates'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500 text-xs">
              Select a custom quote request from the left list to view details and manage status.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
