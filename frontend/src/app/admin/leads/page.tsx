'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  RefreshCw,
  Search,
  CheckCircle2,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  DollarSign,
  FileText,
  Filter,
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
    <div className="space-y-6 max-w-7xl w-full">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-neutral-200/90 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ticket, name, or phone..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 hover:bg-neutral-100 focus:bg-white border border-neutral-200/90 rounded-full text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-black transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'New', 'Contacted', 'Converted', 'Lost'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200'
              }`}
            >
              {st}
            </button>
          ))}
          <button
            onClick={fetchLeads}
            className="p-2 rounded-full border border-neutral-200/90 hover:border-black text-neutral-500 hover:text-black transition-colors shadow-2xs cursor-pointer ml-1"
            title="Refresh Leads"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Leads Table & Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-200/80 text-neutral-500 text-xs font-medium">
                <tr>
                  <th className="py-3 px-4 font-semibold">Ticket</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Cart Value</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-neutral-400 font-light">
                      No WhatsApp inquiry leads recorded.
                    </td>
                  </tr>
                ) : (
                  filtered.map((lead) => (
                    <tr
                      key={lead._id}
                      onClick={() => setSelectedLead(lead)}
                      className={`cursor-pointer transition-colors ${
                        selectedLead?._id === lead._id ? 'bg-neutral-100/70' : 'hover:bg-neutral-50/60'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-black">
                        {lead.ticketId}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-black block">{lead.customerName}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">{lead.phoneNumber}</span>
                      </td>
                      <td className="py-3.5 px-4 text-sm font-semibold text-black">
                        ${lead.totalAmount} AUD
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-medium text-xs capitalize ${
                            lead.status === 'New'
                              ? 'bg-neutral-900 text-white'
                              : lead.status === 'Converted'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-xs text-neutral-500 hover:text-black font-medium">Inspect →</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Detail Panel */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-2xs">
          {selectedLead ? (
            <div className="space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <span className="text-xs font-medium text-neutral-400">
                    Inquiry Dossier
                  </span>
                  <h3 className="text-lg font-semibold text-black mt-0.5">
                    {selectedLead.customerName}
                  </h3>
                </div>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                  {selectedLead.ticketId}
                </span>
              </div>

              <div className="space-y-2 text-neutral-700">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="font-mono text-xs">{selectedLead.phoneNumber}</span>
                </div>
                {selectedLead.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{selectedLead.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Logged {new Date(selectedLead.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Pre-filled Cart Items */}
              <div className="pt-2">
                <span className="text-xs font-medium text-neutral-500 block mb-2">
                  Cart Items in WhatsApp Bag
                </span>
                <div className="space-y-2 bg-neutral-50/60 p-3.5 rounded-2xl border border-neutral-200/70">
                  {selectedLead.cartItems?.map((it: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-medium text-black block">{it.title}</span>
                        <span className="text-[10px] text-neutral-400">
                          {it.metal} {it.size ? `• ${it.size}` : ''} (Qty {it.quantity})
                        </span>
                      </div>
                      <span className="font-semibold text-black">${it.price * it.quantity} AUD</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-neutral-200/70 flex justify-between font-medium text-black">
                    <span>Total Value:</span>
                    <span className="text-sm font-semibold text-black">${selectedLead.totalAmount} AUD</span>
                  </div>
                </div>
              </div>

              {/* Status Toggle Buttons */}
              <div className="pt-2">
                <span className="text-xs font-medium text-neutral-500 block mb-2">
                  Update Lead Status
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedLead._id, 'Contacted')}
                    className="py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium transition-colors cursor-pointer text-xs"
                  >
                    Mark Contacted
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedLead._id, 'Converted')}
                    className="py-2 rounded-xl bg-black hover:bg-neutral-800 text-white font-medium transition-colors cursor-pointer text-xs"
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
                className="w-full py-3 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open Direct WhatsApp Chat</span>
              </a>
            </div>
          ) : (
            <div className="py-24 text-center text-neutral-400 space-y-2">
              <MessageCircle className="w-8 h-8 mx-auto stroke-1 opacity-50" />
              <p className="text-xs font-light">Select any lead on the left to inspect customer cart details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
