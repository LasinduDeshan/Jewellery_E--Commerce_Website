'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Check,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Eye,
  ArrowUpDown,
  Sparkles,
  Minus,
  X,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export interface AdminFaq {
  _id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminFaqsPage() {
  const { token } = useAuth();
  const [faqs, setFaqs] = useState<AdminFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<AdminFaq | null>(null);
  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formCategory, setFormCategory] = useState('customize');
  const [formSortOrder, setFormSortOrder] = useState(1);
  const [formIsActive, setFormIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preview State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewAccordionIdx, setPreviewAccordionIdx] = useState<number | null>(0);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const getAuthHeaders = useCallback(() => {
    const activeToken =
      token ||
      (typeof window !== 'undefined'
        ? localStorage.getItem('jewellery_token')
        : null);
    return {
      'Content-Type': 'application/json',
      ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
    };
  }, [token]);

  // Fetch all FAQs
  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/faqs?all=true`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setFaqs(data.data);
      }
    } catch {
      showToast('Could not connect to FAQ server, displaying cached list', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  // Open Modal for Create or Edit
  const openCreateModal = () => {
    setEditingFaq(null);
    setFormQuestion('');
    setFormAnswer('');
    setFormCategory('customize');
    setFormSortOrder(faqs.length + 1);
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (faq: AdminFaq) => {
    setEditingFaq(faq);
    setFormQuestion(faq.question);
    setFormAnswer(faq.answer);
    setFormCategory(faq.category || 'customize');
    setFormSortOrder(faq.sortOrder ?? 1);
    setFormIsActive(Boolean(faq.isActive));
    setIsModalOpen(true);
  };

  // Submit Create or Update
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim() || !formAnswer.trim()) {
      showToast('Please provide both a question and an answer', 'error');
      return;
    }

    setIsSubmitting(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      if (editingFaq) {
        // Update existing FAQ
        const res = await fetch(`${apiUrl}/faqs/${editingFaq._id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            question: formQuestion.trim(),
            answer: formAnswer.trim(),
            category: formCategory,
            sortOrder: Number(formSortOrder) || 1,
            isActive: formIsActive,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showToast('FAQ updated successfully');
          setIsModalOpen(false);
          fetchFaqs();
        } else {
          showToast(data.message || 'Failed to update FAQ', 'error');
        }
      } else {
        // Create new FAQ
        const res = await fetch(`${apiUrl}/faqs`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            question: formQuestion.trim(),
            answer: formAnswer.trim(),
            category: formCategory,
            sortOrder: Number(formSortOrder) || faqs.length + 1,
            isActive: formIsActive,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showToast('New FAQ published successfully');
          setIsModalOpen(false);
          fetchFaqs();
        } else {
          showToast(data.message || 'Failed to create FAQ', 'error');
        }
      }
    } catch {
      showToast('Server communication error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Active Status
  const handleToggleActive = async (faq: AdminFaq) => {
    const updatedStatus = !faq.isActive;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    // Optimistic UI update
    setFaqs((prev) =>
      prev.map((item) =>
        item._id === faq._id ? { ...item, isActive: updatedStatus } : item
      )
    );

    try {
      const res = await fetch(`${apiUrl}/faqs/${faq._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(updatedStatus ? 'FAQ published to live store' : 'FAQ hidden from live store');
      } else {
        fetchFaqs(); // Revert
        showToast('Status update failed', 'error');
      }
    } catch {
      fetchFaqs();
      showToast('Error syncing status with server', 'error');
    }
  };

  // Delete FAQ
  const handleDeleteFaq = async (id: string, question: string) => {
    if (!window.confirm(`Are you sure you want to delete this FAQ?\n\n"${question}"`)) {
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    // Optimistic delete
    setFaqs((prev) => prev.filter((item) => item._id !== id));

    try {
      const res = await fetch(`${apiUrl}/faqs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        showToast('FAQ deleted successfully');
      } else {
        fetchFaqs();
        showToast('Delete operation failed', 'error');
      }
    } catch {
      fetchFaqs();
      showToast('Error communicating with server', 'error');
    }
  };

  // Filtered FAQs
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl border text-sm font-medium flex items-center gap-2.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
            notification.type === 'success'
              ? 'bg-neutral-900 text-white border-neutral-700'
              : 'bg-red-600 text-white border-red-500'
          }`}
        >
          {notification.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Action Bar & Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Questions</span>
            <HelpCircle className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">{faqs.length}</div>
          <div className="text-[11px] text-neutral-400 mt-1">Across all store categories</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Customize Page</span>
            <Sparkles className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-bold text-neutral-900">
            {faqs.filter((f) => f.category === 'customize').length}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Bespoke jewellery FAQs</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Live & Published</span>
            <Check className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {faqs.filter((f) => f.isActive).length}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Active on customer frontend</div>
        </div>
      </div>

      {/* Control & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/80 shadow-2xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-1 items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions or keywords..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-black transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 focus:outline-none focus:border-black cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="customize">Customize Page</option>
            <option value="general">General</option>
            <option value="shipping">Shipping</option>
            <option value="ordering">Ordering</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(!previewOpen)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              previewOpen
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{previewOpen ? 'Hide Preview' : 'Live Preview'}</span>
          </button>

          <button
            type="button"
            onClick={fetchFaqs}
            disabled={loading}
            className="p-2 rounded-xl border border-neutral-200 bg-white text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors cursor-pointer"
            title="Refresh FAQs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout: FAQ List + Optional Live Preview */}
      <div className={`grid grid-cols-1 ${previewOpen ? 'lg:grid-cols-12 gap-6' : ''}`}>
        {/* FAQ Cards Table/List */}
        <div className={previewOpen ? 'lg:col-span-7' : 'w-full'}>
          <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <span>Frequently Asked Questions</span>
                <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-semibold">
                  {filteredFaqs.length}
                </span>
              </h3>
              <span className="text-[11px] text-neutral-400 font-normal">
                Click status pill to toggle live visibility
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-neutral-400 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-500" />
                Loading FAQ records...
              </div>
            ) : filteredFaqs.length === 0 ? (
              <div className="p-12 text-center">
                <HelpCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-neutral-700">No questions found</p>
                <p className="text-xs text-neutral-400 mt-1">Try resetting your filter or search query</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {filteredFaqs.map((faq, idx) => (
                  <div
                    key={faq._id}
                    className="p-4 sm:p-5 hover:bg-neutral-50/70 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 group"
                  >
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md">
                          #{faq.sortOrder ?? idx + 1}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md">
                          {faq.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(faq)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                            faq.isActive
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                              : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                          }`}
                          title="Click to toggle active status"
                        >
                          {faq.isActive ? '● Live' : '○ Hidden'}
                        </button>
                      </div>

                      <h4 className="font-semibold text-sm text-neutral-900 group-hover:text-black">
                        {faq.question}
                      </h4>
                      <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed font-light">
                        {faq.answer}
                      </p>
                    </div>

                    {/* Quick Row Actions */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => openEditModal(faq)}
                        className="p-2 rounded-xl text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                        title="Edit Question & Answer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFaq(faq._id, faq.question)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Panel */}
        {previewOpen && (
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-neutral-100/90 rounded-2xl p-5 border border-neutral-200 shadow-sm sticky top-6">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Customize Page Preview</span>
                </span>
                <span className="text-[10px] bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full font-semibold">
                  Live View
                </span>
              </div>

              {/* Mini accordion preview identical to frontend */}
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {filteredFaqs
                  .filter((f) => f.isActive)
                  .map((faq, index) => {
                    const isOpen = previewAccordionIdx === index;
                    return (
                      <div
                        key={faq._id || index}
                        className="rounded-xl bg-white border border-neutral-200 p-4 shadow-2xs overflow-hidden transition-all"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewAccordionIdx(isOpen ? null : index)
                          }
                          className="w-full text-left flex items-start justify-between gap-3 cursor-pointer"
                        >
                          <span className="font-semibold text-xs text-neutral-900 leading-snug">
                            {faq.question}
                          </span>
                          <div className="shrink-0 w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-500">
                            {isOpen ? (
                              <Minus className="w-3 h-3 stroke-[2.5]" />
                            ) : (
                              <Plus className="w-3 h-3 stroke-[2.5]" />
                            )}
                          </div>
                        </button>
                        {isOpen && (
                          <p className="text-[11px] text-neutral-600 leading-relaxed font-light border-t border-neutral-100 pt-2.5 mt-2.5">
                            {faq.answer}
                          </p>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* ADD / EDIT FAQ MODAL                                         */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  {editingFaq ? 'Edit Frequently Asked Question' : 'Add New Frequently Asked Question'}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Changes will update live across the customer-facing Customize Jewellery page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              {/* Question */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="e.g. How does the bespoke jewellery design process work?"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-black transition-colors"
                />
              </div>

              {/* Answer */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                  Answer *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  placeholder="Provide a clear, detailed, and authentic answer for your patrons..."
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm leading-relaxed font-normal focus:outline-none focus:border-black transition-colors"
                />
              </div>

              {/* Category & Sort Order Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:border-black cursor-pointer"
                  >
                    <option value="customize">Customize Page</option>
                    <option value="general">General Store</option>
                    <option value="shipping">Shipping & Delivery</option>
                    <option value="ordering">Orders & Sizing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formSortOrder}
                    onChange={(e) => setFormSortOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">Publish to Store</span>
                  <span className="text-[11px] text-neutral-500">
                    When active, patrons will see this question immediately.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormIsActive(!formIsActive)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                    formIsActive ? 'bg-black justify-end' : 'bg-neutral-300 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-xs block" />
                </button>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 active:scale-95 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Saving...'
                    : editingFaq
                    ? 'Save Changes'
                    : 'Publish FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

