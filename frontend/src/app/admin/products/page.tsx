'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Gem,
  Plus,
  Trash2,
  Edit3,
  Search,
  Check,
  X,
  ArrowLeft,
  RefreshCw,
  Camera,
  Play,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState('rings');
  const [formGender, setFormGender] = useState<'women' | 'men' | 'unisex'>('women');
  const [formMetalType, setFormMetalType] = useState<'silver' | 'rose-gold'>('silver');
  const [formMetalPurity, setFormMetalPurity] = useState('925 Solid Sterling Silver');
  const [formGemstoneType, setFormGemstoneType] = useState('Ceylon Royal Blue Sapphire');
  const [formCarat, setFormCarat] = useState('1.85');
  const [formPrice, setFormPrice] = useState('840');
  const [formStock, setFormStock] = useState('2');
  const [formDescription, setFormDescription] = useState('');
  const [formCare, setFormCare] = useState('');
  const [formImages, setFormImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80',
  ]);
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formCertIssuer, setFormCertIssuer] = useState('National Gem & Jewellery Authority (NGJA)');
  const [formCertNumber, setFormCertNumber] = useState('NGJA-SL-2026-98104');

  const [saveLoading, setSaveLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/products?limit=100`);
      const data = await res.json();
      if (data.success && data.data && data.data.products) {
        setProducts(data.data.products);
      }
    } catch (e) {
      console.warn('Using client product list fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSku(`AUR-${Math.floor(100 + Math.random() * 900)}`);
    setFormCategory('rings');
    setFormGender('women');
    setFormMetalType('silver');
    setFormMetalPurity('925 Solid Sterling Silver (Rhodium Plated)');
    setFormGemstoneType('Ceylon Royal Blue Sapphire');
    setFormCarat('1.5');
    setFormPrice('650');
    setFormStock('2');
    setFormDescription('Ethically mined Ceylon sapphire set in handcrafted precious metal.');
    setFormCare('Clean with mild soap and soft brush. Store in velvet pouch.');
    setFormImages([
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80',
    ]);
    setFormVideoUrl('');
    setFormCertIssuer('National Gem & Jewellery Authority (NGJA)');
    setFormCertNumber(`NGJA-${Math.floor(1000 + Math.random() * 9000)}`);
    setModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormSku(p.sku);
    setFormCategory(p.category);
    setFormGender(p.gender || 'women');
    setFormMetalType(p.metal?.type || 'silver');
    setFormMetalPurity(p.metal?.purity || '925 Solid Sterling Silver');
    setFormGemstoneType(p.gemstone?.type || 'Ceylon Sapphire');
    setFormCarat(String(p.gemstone?.carat || 1.5));
    setFormPrice(String(p.price));
    setFormStock(String(p.stockQuantity));
    setFormDescription(p.description || '');
    setFormCare(p.careInstructions || '');
    setFormImages(p.images?.map((i: any) => i.url) || []);
    setFormVideoUrl(p.media?.videoUrl || '');
    setFormCertIssuer(p.certificate?.issuer || 'NGJA Sri Lanka');
    setFormCertNumber(p.certificate?.certificateNumber || '');
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setErrorMsg('');

    const cleanName = formName.trim();
    const cleanSku = formSku.trim();
    const generatedSlug =
      cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      cleanSku.toLowerCase();

    // Ensure valid images array (min 4 images for luxury multi-angle standards)
    let validImages = formImages.filter((s) => s && s.trim().length > 0).map((s) => s.trim());
    if (validImages.length === 0) {
      validImages = [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80',
      ];
    } else {
      while (validImages.length < 4) {
        validImages.push(validImages[0]);
      }
    }

    const payload = {
      name: cleanName,
      slug: editingProduct?.slug || generatedSlug,
      sku: cleanSku,
      category: formCategory,
      gender: formGender,
      metal: {
        type: formMetalType,
        purity:
          formMetalPurity ||
          (formMetalType === 'rose-gold'
            ? '18K Rose Gold Vermeil'
            : '925 Solid Sterling Silver (Rhodium Plated)'),
      },
      gemstone: {
        type: formGemstoneType || 'Ceylon Royal Blue Sapphire',
        carat: Number(formCarat) || 1.2,
      },
      price: Number(formPrice) || 0,
      currency: 'AUD' as const,
      stockQuantity: Number(formStock) || 0,
      description:
        formDescription ||
        'Handcrafted luxury jewellery featuring ethically mined Sri Lankan gemstones.',
      careInstructions:
        formCare ||
        'Clean gently with lukewarm soapy water and a soft microfibre cloth. Store in separate velvet pouch.',
      images: validImages.map((url, idx) => ({
        url,
        alt: `${cleanName} - Angle ${idx + 1}`,
        sortOrder: idx + 1,
      })),
      media: {
        videoUrl: formVideoUrl || undefined,
      },
      certificate: {
        available: true,
        issuer: formCertIssuer || 'National Gem & Jewellery Authority (NGJA)',
        certificateNumber: formCertNumber || `NGJA-${Math.floor(1000 + Math.random() * 9000)}`,
      },
      isActive: true,
    };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      if (editingProduct) {
        // Update
        const res = await fetch(`${apiUrl}/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setErrorMsg(data.message || 'Failed to update product in database.');
          return;
        }
        await fetchProducts();
      } else {
        // Create
        const res = await fetch(`${apiUrl}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setErrorMsg(data.message || 'Failed to save product to MongoDB database.');
          return;
        }
        await fetchProducts();
      }

      setStatusMsg('Product saved successfully to MongoDB database!');
      setTimeout(() => setStatusMsg(''), 4000);
      setModalOpen(false);
    } catch (e: any) {
      setErrorMsg(e.message || 'Network error connecting to backend API.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this jewellery item?')) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
      await fetch(`${apiUrl}/products/${id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
    }
  };

  const filtered = products.filter((p) => {
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(s) ||
      p.sku?.toLowerCase().includes(s) ||
      p.gemstone?.type?.toLowerCase().includes(s)
    );
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
              title="Return to Master Admin"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-serif tracking-wide text-white font-medium flex items-center gap-2">
                <Gem className="w-5 h-5 text-amber-400" />
                <span>Product Catalogue & Inventory Desk (Section 5.8)</span>
              </h1>
              <p className="text-[11px] text-stone-400">
                Add, edit, remove products, inventory counts, 360° videos, and Gender/Style tags.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCreateModal}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Jewellery</span>
            </button>
            <button
              onClick={fetchProducts}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-6">
        {statusMsg && (
          <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs flex items-center justify-between shadow-xs">
            <span className="font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              {statusMsg}
            </span>
            <button
              onClick={() => setStatusMsg('')}
              className="text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search & Stats Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, SKU, or gemstone..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Total Active Pieces: <strong className="text-stone-900">{products.length}</strong>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Style / Gender</th>
                  <th className="py-3 px-4">Precious Metal</th>
                  <th className="py-3 px-4">Price (AUD)</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            item.images[0]?.url ||
                            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80'
                          }
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                        />
                        <div>
                          <h4 className="font-semibold text-stone-900">{item.name}</h4>
                          <span className="font-mono text-[10px] text-stone-400">SKU: {item.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-stone-700">
                      {item.category?.replace(/-/g, ' ')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold uppercase text-[10px]">
                        {item.gender || 'women'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-700">
                      {item.metal?.purity || item.metal?.type}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      ${item.price} AUD
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          item.stockQuantity <= 1
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.stockQuantity} in stock
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(item._id)}
                        className="p-1.5 rounded-lg border border-stone-200 hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                        title="Deactivate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {editingProduct ? 'Edit Jewellery Piece' : 'Add New Jewellery to Catalogue'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-semibold mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="rings">Sapphire Rings</option>
                    <option value="necklaces">Pendants & Necklaces</option>
                    <option value="engagement-promise-rings">Engagement & Promise Rings</option>
                    <option value="bracelets">Tennis Bracelets</option>
                    <option value="earrings">Teardrop Earrings</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Gender / Style Tag * (Section 5.8)
                  </label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Precious Metal *</label>
                  <select
                    value={formMetalType}
                    onChange={(e) => {
                      const val = e.target.value as 'silver' | 'rose-gold';
                      setFormMetalType(val);
                      if (val === 'rose-gold') {
                        setFormMetalPurity('18K Rose Gold Vermeil');
                      } else {
                        setFormMetalPurity('925 Solid Sterling Silver (Rhodium Plated)');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="silver">925 Sterling Silver</option>
                    <option value="rose-gold">18K Rose Gold Vermeil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Metal Purity & Finish</label>
                  <input
                    type="text"
                    value={formMetalPurity}
                    onChange={(e) => setFormMetalPurity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                    placeholder="e.g. 925 Solid Sterling Silver (Rhodium Plated)"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Price (AUD) *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Gemstone Variety & Cut</label>
                  <input
                    type="text"
                    value={formGemstoneType}
                    onChange={(e) => setFormGemstoneType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Carat Weight</label>
                  <input
                    type="text"
                    value={formCarat}
                    onChange={(e) => setFormCarat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-semibold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-semibold mb-1">Care & Cleaning Instructions</label>
                  <textarea
                    rows={2}
                    value={formCare}
                    onChange={(e) => setFormCare(e.target.value)}
                    placeholder="e.g. Clean gently with lukewarm soapy water and a soft microfibre cloth."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Certificate Authority</label>
                  <input
                    type="text"
                    value={formCertIssuer}
                    onChange={(e) => setFormCertIssuer(e.target.value)}
                    placeholder="e.g. National Gem & Jewellery Authority (NGJA)"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Certificate Number</label>
                  <input
                    type="text"
                    value={formCertNumber}
                    onChange={(e) => setFormCertNumber(e.target.value)}
                    placeholder="e.g. NGJA-SL-2026-98104"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-[11px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-semibold mb-1">
                    Multi-Angle Images (Comma-separated URLs, min 4)
                  </label>
                  <textarea
                    rows={2}
                    value={formImages.join(', ')}
                    onChange={(e) => setFormImages(e.target.value.split(',').map((s) => s.trim()))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-[11px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-semibold mb-1">
                    360° View / Sparkle Video URL (Section 5.2)
                  </label>
                  <input
                    type="url"
                    value={formVideoUrl}
                    onChange={(e) => setFormVideoUrl(e.target.value)}
                    placeholder="https://assets.mixkit.co/videos/preview/..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 border border-stone-300 rounded-xl text-stone-700 font-semibold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="flex-1 py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors cursor-pointer"
                >
                  {saveLoading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
