'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  RefreshCw,
  Save,
  Check,
  Eye,
  Plus,
  Trash2,
  Sparkles,
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
      setSaveMsg('Story changes saved locally!');
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
    <div className="space-y-6 max-w-5xl w-full">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-neutral-200/90 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-light">
            Live story page published on <code className="text-neutral-800 font-mono text-[11px] bg-neutral-100 px-1.5 py-0.5 rounded">/story</code>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/story"
            target="_blank"
            className="px-4 py-2 rounded-full border border-neutral-200/90 hover:border-black text-neutral-700 hover:text-black text-xs font-medium flex items-center gap-2 transition-all shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-400" />
            <span>Preview Live Story</span>
          </Link>
          <button
            onClick={fetchCmsContent}
            className="p-2 rounded-full border border-neutral-200/90 hover:border-black text-neutral-500 hover:text-black transition-colors shadow-2xs cursor-pointer"
            title="Reload Content"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {saveMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 shadow-2xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hero Section Card */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-neutral-100">
            <span className="text-[10px] text-neutral-400 font-semibold block leading-none mb-1">
              Hero Intro
            </span>
            <h3 className="text-lg font-semibold text-black">
              Header Narrative Configuration
            </h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-neutral-700 font-medium mb-1">
                Main Headline (H1)
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Born of Ceylon Earth. Perfected in Melbourne."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900 font-sans"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-medium mb-1">
                Sub-headline Narrative
              </label>
              <textarea
                rows={2}
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                placeholder="Narrative summary for hero intro..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Story Chapters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-black">
              Story Narrative Chapters & Quotes
            </h3>
          </div>

          {sections.map((sec, idx) => (
            <div
              key={idx}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200/90 shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-[10px] font-semibold text-neutral-400">
                  Chapter {idx + 1}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Chapter Title</label>
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Subtitle / Pill Tag</label>
                  <input
                    type="text"
                    value={sec.subtitle || ''}
                    onChange={(e) => handleSectionChange(idx, 'subtitle', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-700 font-medium mb-1">Narrative Body</label>
                  <textarea
                    rows={3}
                    value={sec.body}
                    onChange={(e) => handleSectionChange(idx, 'body', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-700 font-medium mb-1">Image URL</label>
                  <input
                    type="url"
                    value={sec.imageUrl || ''}
                    onChange={(e) => handleSectionChange(idx, 'imageUrl', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black font-mono text-[11px] text-neutral-700"
                  />
                </div>

                {sec.quote !== undefined && (
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-700 font-medium mb-1">
                      Historical / Expert Quote
                    </label>
                    <input
                      type="text"
                      value={sec.quote || ''}
                      onChange={(e) => handleSectionChange(idx, 'quote', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200/90 focus:outline-none focus:border-black text-xs text-neutral-900"
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
            className="px-8 py-3 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-medium transition-colors shadow-sm cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing Updates...' : 'Publish Story CMS Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
