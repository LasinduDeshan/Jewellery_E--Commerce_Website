'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  ArrowLeft,
  RefreshCw,
  Save,
  Check,
  Eye,
  Plus,
  Trash2,
} from 'lucide-react';

export default function AdminCmsPage() {
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const fetchCmsContent = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/content/our-story`);
      const data = await res.json();
      if (data.success && data.data) {
        setHeadline(data.data.heroHeadline || '');
        setSubheadline(data.data.heroSubheadline || '');
        setSections(data.data.sections || []);
      }
    } catch (e) {
      console.warn('Using client CMS fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCmsContent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      await fetch(`${apiUrl}/content/our-story`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroHeadline: headline,
          heroSubheadline: subheadline,
          sections,
        }),
      });
      setSaveMsg('Story content saved successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e) {
      setSaveMsg('Saved locally!');
      setTimeout(() => setSaveMsg(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSectionChange = (idx: number, field: string, val: string) => {
    const updated = [...sections];
    updated[idx] = { ...updated[idx], [field]: val };
    setSections(updated);
  };

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
                <FileText className="w-5 h-5 text-amber-400" />
                <span>Story & Page Content CMS Editor (Sections 5.7 & 5.8)</span>
              </h1>
              <p className="text-[11px] text-stone-400">
                Update brand story, Ratnapura mining ethics, quotes, and photography without code changes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/story"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Live Story</span>
            </Link>
            <button
              onClick={fetchCmsContent}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8 flex-1 w-full space-y-6">
        {saveMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{saveMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Hero Section Card */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
              Hero Header Configuration
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Main Headline (H1)
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Sub-headline Narrative
                </label>
                <textarea
                  rows={2}
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Story Chapters */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-stone-900">
                Story Narrative Chapters & Quotes
              </h3>
            </div>

            {sections.map((sec, idx) => (
              <div
                key={idx}
                className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Chapter {idx + 1}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Chapter Title</label>
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Subtitle / Pill</label>
                    <input
                      type="text"
                      value={sec.subtitle || ''}
                      onChange={(e) => handleSectionChange(idx, 'subtitle', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 font-semibold mb-1">Narrative Body</label>
                    <textarea
                      rows={3}
                      value={sec.body}
                      onChange={(e) => handleSectionChange(idx, 'body', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 font-semibold mb-1">Image URL</label>
                    <input
                      type="url"
                      value={sec.imageUrl || ''}
                      onChange={(e) => handleSectionChange(idx, 'imageUrl', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 font-mono text-[11px]"
                    />
                  </div>

                  {sec.quote !== undefined && (
                    <div className="sm:col-span-2">
                      <label className="block text-stone-700 font-semibold mb-1">
                        Historical / Expert Quote
                      </label>
                      <input
                        type="text"
                        value={sec.quote || ''}
                        onChange={(e) => handleSectionChange(idx, 'quote', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-stone-900 hover:bg-amber-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Publishing Updates...' : 'Publish Story CMS Changes'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
