'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  ArrowLeft,
  RefreshCw,
  Search,
  CheckCircle2,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  DollarSign,
  FileText,
} from 'lucide-react';

export default function AdminWhatsAppLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/leads`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setLeads(data.data);
      }
    } catch (e) {
      console.warn('Using client leads fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
      await fetch(`${apiUrl}/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l))
      );
      if (selectedLead && selectedLead._id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (e) {
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l))
      );
    }
  };

  const filtered = leads.filter((l) => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return (
        l.customerName?.toLowerCase().includes(s) ||
        l.ticketId?.toLowerCase().includes(s) ||
        l.phoneNumber?.includes(s)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Header */}
      <header className="bg-stone-900 text-white border-b border-stone-800 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-serif tracking-wide text-white font-medium flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>WhatsApp Cart Inquiry & Leads Desk (Sections 5.3 & 5.8)</span>
              </h1>
              <p className="text-[11px] text-stone-400">
                Track and convert visitors who clicked "Prefer to order via WhatsApp?" from their shopping bags.
              </p>
            </div>
          </div>

          <button
            onClick={fetchLeads}
            className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ticket, name, or phone..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 text-xs">
            {['all', 'New', 'Contacted', 'Converted', 'Lost'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Leads Table & Detail Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Ticket</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Cart Value</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filtered.map((lead) => (
                    <tr
                      key={lead._id}
                      onClick={() => setSelectedLead(lead)}
                      className={`cursor-pointer transition-colors ${
                        selectedLead?._id === lead._id ? 'bg-amber-50/60' : 'hover:bg-stone-50'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-900">
                        {lead.ticketId}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-stone-900 block">{lead.customerName}</span>
                        <span className="text-[10px] text-stone-400">{lead.phoneNumber}</span>
                      </td>
                      <td className="py-3.5 px-4 font-serif font-bold text-stone-900">
                        ${lead.totalAmount} AUD
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            lead.status === 'New'
                              ? 'bg-amber-100 text-amber-800'
                              : lead.status === 'Converted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-amber-800 font-bold hover:underline">View Details →</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lead Detail Panel */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
            {selectedLead ? (
              <div className="space-y-5 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      Inquiry Lead Dossier
                    </span>
                    <h3 className="text-base font-serif font-bold text-stone-900">
                      {selectedLead.customerName}
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-stone-500">
                    {selectedLead.ticketId}
                  </span>
                </div>

                <div className="space-y-2 text-stone-700">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>{selectedLead.phoneNumber}</span>
                  </div>
                  {selectedLead.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      <span>{selectedLead.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-stone-400 text-[11px]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Logged {new Date(selectedLead.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Pre-filled Cart Items */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                    Cart Items Included in WhatsApp Chat
                  </span>
                  <div className="space-y-2 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                    {selectedLead.cartItems?.map((it: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-stone-900 block">{it.title}</span>
                          <span className="text-[10px] text-stone-500">
                            {it.metal} {it.size ? `• ${it.size}` : ''} (Qty {it.quantity})
                          </span>
                        </div>
                        <span className="font-bold text-stone-900">${it.price * it.quantity} AUD</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900">
                      <span>Total Value:</span>
                      <span>${selectedLead.totalAmount} AUD</span>
                    </div>
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                    Update Lead Status
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedLead._id, 'Contacted')}
                      className="py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-bold hover:bg-blue-100"
                    >
                      Mark Contacted
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedLead._id, 'Converted')}
                      className="py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold hover:bg-emerald-100"
                    >
                      Mark Converted
                    </button>
                  </div>
                </div>

                {/* Direct WhatsApp Responder Button */}
                <a
                  href={`https://wa.me/${selectedLead.phoneNumber.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                    selectedLead.customerName
                  )},%20thank%20you%20for%20inquiring%20with%20Aura%20Ceylon%20about%20your%20jewellery%20order.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open Direct WhatsApp Chat</span>
                </a>
              </div>
            ) : (
              <div className="py-24 text-center text-stone-400">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Select any lead on the left to inspect customer cart details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
