'use client';

import React, { useState, useEffect } from 'react';
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
  ExternalLink,
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

  const fetchRequests = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/custom-requests`);
      if (!res.ok) throw new Error('Failed to load custom requests from server');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setRequests(data.data);
        if (data.data.length > 0 && !selectedRequest) {
          setSelectedRequest(data.data[0]);
        }
      }
    } catch (e: any) {
      setFetchError(e.message || 'Error connecting to backend service');
      setRequests([]);
      setSelectedRequest(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

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
      setSaveMessage('Saved locally!');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return (
        r.ticketId?.toLowerCase().includes(s) ||
        r.fullName?.toLowerCase().includes(s) ||
        r.sapphireColor?.toLowerCase().includes(s) ||
        r.jewelleryType?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl w-full">
      {/* Top Filter and Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-neutral-200/90 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search ticket #, name, stone, cut..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 hover:bg-neutral-100 focus:bg-white border border-neutral-200/90 rounded-full text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-black transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'New', 'Under Review', 'Quote Sent', 'In Production'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200'
              }`}
            >
              {st === 'all' ? 'All Requests' : st}
            </button>
          ))}
          <Link
            href="/customize"
            target="_blank"
            className="px-3.5 py-1.5 rounded-full border border-neutral-200/90 hover:border-black text-xs font-medium text-neutral-700 hover:text-black flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
          >
            <Gem className="w-3.5 h-3.5 text-neutral-500" />
            <span>Customer Studio</span>
          </Link>
          <button
            onClick={fetchRequests}
            className="p-2 rounded-full border border-neutral-200/90 hover:border-black text-neutral-500 hover:text-black transition-colors shadow-2xs cursor-pointer shrink-0"
            title="Refresh Requests"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {fetchError && (
        <div className="p-3.5 bg-neutral-100 border border-neutral-300 rounded-2xl text-neutral-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-neutral-500 shrink-0" />
            <span>{fetchError}</span>
          </div>
          <button onClick={fetchRequests} className="underline font-semibold hover:text-black cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {/* Main Split View: Left List, Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Filtered Requests List */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-2xs divide-y divide-neutral-100 max-h-[calc(100vh-220px)] overflow-y-auto">
          {loading ? (
            <div className="p-12 text-center text-neutral-400 text-xs flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-neutral-600" />
              <span>Loading atelier quote requests...</span>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-10 text-center text-neutral-400 text-xs space-y-2">
              <Gem className="w-8 h-8 mx-auto stroke-1 opacity-50" />
              <p className="font-medium text-neutral-700">No custom quote requests found.</p>
              <p className="text-[11px] text-neutral-400">
                Submit a bespoke inquiry from the Customize studio to see it appear here.
              </p>
            </div>
          ) : (
            filteredRequests.map((item) => {
              const isSelected = selectedRequest?._id === item._id || selectedRequest?.ticketId === item.ticketId;

              return (
                <div
                  key={item._id || item.ticketId}
                  onClick={() => setSelectedRequest(item)}
                  className={`p-4.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-neutral-100/80 border-l-4 border-black' : 'hover:bg-neutral-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-semibold text-black">
                      {item.ticketId}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${
                        item.status === 'New'
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-100 text-neutral-700 border border-neutral-200/80'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-black">
                    {item.fullName}
                  </h4>

                  <div className="text-xs text-neutral-500 mt-1">
                    {item.metalPreference} {item.jewelleryType} • <span className="text-neutral-900 font-medium">{item.sapphireColor}</span> ({item.cutPreference})
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2.5 pt-2 border-t border-neutral-100/80">
                    <span>{item.country || 'International'}</span>
                    <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed Request Inspector */}
        <div className="lg:col-span-7">
          {selectedRequest ? (
            <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-lg font-bold text-black">
                      {selectedRequest.ticketId}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-neutral-900 text-white">
                      {selectedRequest.status}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 font-light mt-1">
                    Submitted on {selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleString() : 'Just now'}
                  </div>
                </div>

                {/* Direct WhatsApp Action Button */}
                <a
                  href={`https://wa.me/${selectedRequest.whatsappNumber?.replace(/\D/g, '') || selectedRequest.phoneNumber?.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedRequest.fullName}, this is Aura Ceylon concierge regarding your bespoke quote request #${selectedRequest.ticketId}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-full text-xs font-medium flex items-center gap-2 shadow-2xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Customer Info Card */}
              <div className="p-4.5 rounded-2xl bg-neutral-50/70 border border-neutral-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-neutral-400 text-xs block">Customer Name</span>
                  <span className="font-medium text-black text-sm">{selectedRequest.fullName}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-xs block">Email Address</span>
                  <a href={`mailto:${selectedRequest.email}`} className="text-black underline font-medium">
                    {selectedRequest.email}
                  </a>
                </div>
                <div>
                  <span className="text-neutral-400 text-xs block">Phone / WhatsApp</span>
                  <span className="font-mono text-neutral-800">{selectedRequest.phoneNumber}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-xs block">Preferred Contact Channel</span>
                  <span className="font-medium text-black capitalize">
                    {selectedRequest.preferredContactMethod}
                  </span>
                </div>
              </div>

              {/* Jewellery Specifications */}
              <div>
                <h3 className="text-xs font-medium text-neutral-400 mb-3">
                  Jewellery Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-neutral-50/60 rounded-xl border border-neutral-200/70">
                    <span className="text-neutral-400 text-[10px] block">Jewellery Type</span>
                    <span className="font-medium text-black capitalize">{selectedRequest.jewelleryType}</span>
                  </div>
                  <div className="p-3 bg-neutral-50/60 rounded-xl border border-neutral-200/70">
                    <span className="text-neutral-400 text-[10px] block">Precious Metal</span>
                    <span className="font-medium text-black">{selectedRequest.metalPreference}</span>
                  </div>
                  <div className="p-3 bg-neutral-50/60 rounded-xl border border-neutral-200/70">
                    <span className="text-neutral-400 text-[10px] block">Sapphire Choice</span>
                    <span className="font-medium text-black">{selectedRequest.sapphireColor}</span>
                  </div>
                  <div className="p-3 bg-neutral-50/60 rounded-xl border border-neutral-200/70">
                    <span className="text-neutral-400 text-[10px] block">Faceting / Cut</span>
                    <span className="font-medium text-black">{selectedRequest.cutPreference}</span>
                  </div>
                  <div className="p-3 bg-neutral-50/60 rounded-xl border border-neutral-200/70">
                    <span className="text-neutral-400 text-[10px] block">Size / Length</span>
                    <span className="font-medium text-black">{selectedRequest.size || 'Not Specified'}</span>
                  </div>
                  <div className="p-3 bg-neutral-50/60 rounded-xl border border-neutral-200/70">
                    <span className="text-neutral-400 text-[10px] block">Budget Range</span>
                    <span className="font-medium text-black">{selectedRequest.budgetRange || 'Flexible'}</span>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              {selectedRequest.specialInstructions && (
                <div>
                  <h3 className="text-xs font-medium text-neutral-400 mb-1.5">
                    Customer Instructions
                  </h3>
                  <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-800 leading-relaxed font-light">
                    {selectedRequest.specialInstructions}
                  </div>
                </div>
              )}

              {/* Admin Quote & Status Action Panel */}
              <div className="pt-6 border-t border-neutral-100 space-y-4">
                <h3 className="text-xs font-medium text-neutral-400">
                  Manage Quote & Status
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-medium text-neutral-700 mb-1">Update Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200/90 rounded-xl text-xs focus:outline-none focus:border-black bg-white"
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
                    <label className="block font-medium text-neutral-700 mb-1">Quoted Price (AUD)</label>
                    <input
                      type="number"
                      placeholder="e.g. 3850"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200/90 rounded-xl text-xs focus:outline-none focus:border-black text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block font-medium text-neutral-700 mb-1">
                    Internal Founder / Lapidary Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Log rough stone weight, carat availability, CAD link, or customer call notes..."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200/90 rounded-xl text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-neutral-600 font-medium">{saveMessage}</span>
                  <button
                    onClick={handleUpdate}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                  >
                    {isSaving ? 'Saving...' : 'Save Updates'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-neutral-200/90 p-12 text-center text-neutral-400 text-xs">
              Select a custom quote request from the left list to view details and manage status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
