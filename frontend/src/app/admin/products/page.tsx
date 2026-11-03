'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  Gem,
  Plus,
  Trash2,
  Edit3,
  Search,
  Check,
  X,
  RefreshCw,
  Camera,
  ShieldCheck,
  Upload,
  Film,
  Image as ImageIcon,
  Loader2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface ProductImage {
  url: string;
  alt?: string;
  sortOrder?: number;
}

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  gender?: 'women' | 'men' | 'unisex';
  metal?: {
    type?: 'silver' | 'rose-gold';
    purity?: string;
  };
  gemstone?: {
    type?: string;
    carat?: number;
  };
  price: number;
  stockQuantity: number;
  description?: string;
  careInstructions?: string;
  images?: ProductImage[];
  media?: {
    videoUrl?: string;
  };
  certificate?: {
    available?: boolean;
    issuer?: string;
    certificateNumber?: string;
  };
}

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

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

  // Modal Step/Tab State ('info' | 'media' | 'details')
  const [activeModalTab, setActiveModalTab] = useState<'info' | 'media' | 'details'>('info');

  // Form State
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState('rings');
  const [formGender, setFormGender] = useState<'women' | 'men' | 'unisex'>('women');
  const [formMetalType, setFormMetalType] = useState<'silver' | 'rose-gold'>('silver');
  const [formMetalPurity, setFormMetalPurity] = useState('925 Solid Sterling Silver (Rhodium Plated)');
  const [formGemstoneType, setFormGemstoneType] = useState('Ceylon Royal Blue Sapphire');
  const [formCarat, setFormCarat] = useState('1.5');
  const [formPrice, setFormPrice] = useState('650');
  const [formStock, setFormStock] = useState('2');
  const [formDescription, setFormDescription] = useState('');
  const [formCare, setFormCare] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formCertIssuer, setFormCertIssuer] = useState('National Gem & Jewellery Authority (NGJA)');
  const [formCertNumber, setFormCertNumber] = useState('');

  // Uploading state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [showManualUrlInputs, setShowManualUrlInputs] = useState(false);

  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  const [saveLoading, setSaveLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/products?limit=100`);
      const data = await res.json();
      if (data.success && data.data && data.data.products) {
        setProducts(data.data.products);
      }
    } catch {
      console.warn('Using client product list fallback');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const loadInitial = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/products?limit=100`);
        const data = await res.json();
        if (!ignore && data.success && data.data && data.data.products) {
          setProducts(data.data.products);
        }
      } catch {
        console.warn('Using client product list fallback');
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    loadInitial();
    return () => {
      ignore = true;
    };
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setActiveModalTab('info');
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
    setFormCare('Clean gently with mild soap and soft brush. Store in velvet pouch.');
    setFormImages([]);
    setFormVideoUrl('');
    setFormCertIssuer('National Gem & Jewellery Authority (NGJA)');
    setFormCertNumber(`NGJA-${Math.floor(1000 + Math.random() * 9000)}`);
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (p: ProductItem) => {
    setEditingProduct(p);
    setActiveModalTab('info');
    setFormName(p.name || '');
    setFormSku(p.sku || '');
    setFormCategory(p.category || 'rings');
    setFormGender(p.gender || 'women');
    setFormMetalType(p.metal?.type || 'silver');
    setFormMetalPurity(p.metal?.purity || '925 Solid Sterling Silver');
    setFormGemstoneType(p.gemstone?.type || 'Ceylon Sapphire');
    setFormCarat(String(p.gemstone?.carat || 1.5));
    setFormPrice(String(p.price || 0));
    setFormStock(String(p.stockQuantity || 0));
    setFormDescription(p.description || '');
    setFormCare(p.careInstructions || '');
    setFormImages(p.images?.map((i) => i.url) || []);
    setFormVideoUrl(p.media?.videoUrl || '');
    setFormCertIssuer(p.certificate?.issuer || 'NGJA Sri Lanka');
    setFormCertNumber(p.certificate?.certificateNumber || '');
    setErrorMsg('');
    setModalOpen(true);
  };

  // Helper to read File as Base64 Data URL
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Image File Upload Handler
  const handleImageFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setErrorMsg('');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadStatusText(`Uploading image ${i + 1} of ${files.length} (${file.name})...`);

        const base64 = await readFileAsBase64(file);
        const res = await fetch(`${apiUrl}/upload`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            filename: file.name,
            file: base64,
          }),
        });

        const data = await res.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        } else {
          throw new Error(data.message || `Failed to upload ${file.name}`);
        }
      }

      setFormImages((prev) => [...prev, ...uploadedUrls]);
      setStatusMsg(`Successfully uploaded ${uploadedUrls.length} image(s)!`);
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Image upload failed. Please try again.';
      setErrorMsg(msg);
    } finally {
      setUploadingImage(false);
      setUploadStatusText('');
      if (imageFileInputRef.current) {
        imageFileInputRef.current.value = '';
      }
    }
  };

  // Video File Upload Handler
  const handleVideoFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg('Video file is too large (maximum size is 50MB). Please select a compressed file.');
      return;
    }

    setUploadingVideo(true);
    setErrorMsg('');
    setUploadStatusText(`Uploading video: ${file.name}...`);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      const base64 = await readFileAsBase64(file);
      const res = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          filename: file.name,
          file: base64,
        }),
      });

      const data = await res.json();
      if (data.success && data.url) {
        setFormVideoUrl(data.url);
        setStatusMsg('Video uploaded successfully!');
        setTimeout(() => setStatusMsg(''), 4000);
      } else {
        throw new Error(data.message || 'Failed to upload video.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Video upload failed.';
      setErrorMsg(msg);
    } finally {
      setUploadingVideo(false);
      setUploadStatusText('');
      if (videoFileInputRef.current) {
        videoFileInputRef.current.value = '';
      }
    }
  };

  const removeImageAt = (indexToRemove: number) => {
    setFormImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const loadSampleImages = () => {
    setFormImages([
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80',
    ]);
  };

  const loadSampleVideo = () => {
    setFormVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-diamond-ring-sparkling-in-the-dark-42416-large.mp4');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setErrorMsg('');

    const cleanName = formName.trim();
    const cleanSku = formSku.trim();
    if (!cleanName || !cleanSku) {
      setErrorMsg('Product name and SKU are required.');
      setActiveModalTab('info');
      setSaveLoading(false);
      return;
    }

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
        const res = await fetch(`${apiUrl}/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setErrorMsg(data.message || 'Failed to update product in database.');
          return;
        }
        await fetchProducts();
      } else {
        const res = await fetch(`${apiUrl}/products`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setErrorMsg(data.message || 'Failed to save product to MongoDB database.');
          return;
        }
        await fetchProducts();
      }

      setStatusMsg('Product saved successfully to catalogue!');
      setTimeout(() => setStatusMsg(''), 4000);
      setModalOpen(false);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Network error connecting to backend API.';
      setErrorMsg(msg);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this jewellery item?')) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    try {
      await fetch(`${apiUrl}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
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
    <div className="space-y-6 max-w-7xl w-full">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-neutral-200/90 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, SKU, or gemstone..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 hover:bg-neutral-100 focus:bg-white border border-neutral-200/90 rounded-full text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-black transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs text-neutral-500 font-light">
            Total Active Pieces: <strong className="text-black font-semibold">{products.length}</strong>
          </span>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Jewellery</span>
          </button>

          <button
            onClick={fetchProducts}
            className="p-2 rounded-full border border-neutral-200/90 hover:border-black text-neutral-500 hover:text-black transition-colors shadow-2xs cursor-pointer shrink-0"
            title="Refresh Products"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3.5 bg-neutral-100 text-neutral-900 border border-neutral-300 rounded-2xl text-xs flex items-center justify-between shadow-2xs">
          <span className="font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            {statusMsg}
          </span>
          <button
            onClick={() => setStatusMsg('')}
            className="text-neutral-400 hover:text-black p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50/80 border-b border-neutral-200/90 text-neutral-500 text-xs font-medium">
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
            <tbody className="divide-y divide-neutral-100 font-light">
              {loading && products.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400 font-light">
                    Loading jewellery inventory...
                  </td>
                </tr>
              )}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400 font-light">
                    No jewellery pieces found matching &quot;{searchTerm}&quot;.
                  </td>
                </tr>
              )}

              {filtered.map((product) => (
                <tr key={product._id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 relative group">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            <Gem className="w-5 h-5" />
                          </div>
                        )}
                        {product.media?.videoUrl && (
                          <div className="absolute bottom-1 right-1 bg-black/80 rounded-full p-0.5 text-white" title="360° Video Available">
                            <Film className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-900 block text-xs">
                          {product.name}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          SKU: {product.sku}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 capitalize text-neutral-600">{product.category}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[10px] capitalize font-medium">
                      {product.gender || 'women'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-600 text-[11px]">
                    {product.metal?.purity || '925 Solid Sterling Silver'}
                  </td>
                  <td className="py-3 px-4 font-semibold text-neutral-900">
                    ${product.price} AUD
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        product.stockQuantity > 0
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Sold out'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-black transition-colors cursor-pointer"
                      title="Edit Item"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-neutral-500 hover:text-red-600 transition-colors cursor-pointer"
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

      {/* COMPACT, REDUCED-HEIGHT TABBED MODAL WITH FILE UPLOADS */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden border border-neutral-200">
            {/* 1. Modal Fixed Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  {editingProduct ? 'Edit Jewellery Piece' : 'Add New Jewellery to Catalogue'}
                </h3>
                <p className="text-[11px] text-neutral-500 font-light">
                  Complete product specifications, upload atelier images & 360° video.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Modal Step Navigation Tabs (Reduces vertical height dramatically) */}
            <div className="flex border-b border-neutral-100 bg-neutral-50/70 px-6 shrink-0 gap-2 pt-2.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveModalTab('info')}
                className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeModalTab === 'info'
                    ? 'border-black text-black'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Gem className="w-3.5 h-3.5" />
                <span>1. Specifications & Pricing</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab('media')}
                className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeModalTab === 'media'
                    ? 'border-black text-black'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>2. Media & Uploads</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                  formImages.length > 0 ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-600'
                }`}>
                  {formImages.length}
                </span>
                {formVideoUrl && (
                  <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                    Video ✓
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab('details')}
                className={`pb-2.5 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeModalTab === 'details'
                    ? 'border-black text-black'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>3. Story & Certificate</span>
              </button>
            </div>

            {/* 3. Modal Scrollable Content Container */}
            <form onSubmit={handleSaveProduct} className="flex flex-col flex-1 overflow-hidden text-xs">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold flex items-center justify-between">
                    <span>{errorMsg}</span>
                    <button type="button" onClick={() => setErrorMsg('')} className="text-red-500 hover:text-red-700">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* TAB 1: BASIC SPECIFICATIONS & PRICING */}
                {activeModalTab === 'info' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="block text-neutral-700 font-semibold mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Royal Ceylon Blue Sapphire Pavé Ring"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">
                        SKU Identifier *
                      </label>
                      <input
                        type="text"
                        required
                        value={formSku}
                        onChange={(e) => setFormSku(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-mono text-xs focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">
                        Category *
                      </label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-black"
                      >
                        <option value="rings">Sapphire Rings</option>
                        <option value="necklaces">Pendants & Necklaces</option>
                        <option value="engagement-promise-rings">Engagement & Promise Rings</option>
                        <option value="bracelets">Tennis Bracelets</option>
                        <option value="earrings">Teardrop Earrings</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">
                        Style / Gender Tag *
                      </label>
                      <select
                        value={formGender}
                        onChange={(e) => setFormGender(e.target.value as 'women' | 'men' | 'unisex')}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-black"
                      >
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                        <option value="unisex">Unisex</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">
                        Precious Metal *
                      </label>
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
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs focus:outline-none focus:border-black"
                      >
                        <option value="silver">925 Sterling Silver</option>
                        <option value="rose-gold">18K Rose Gold Vermeil</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-neutral-700 font-semibold mb-1">
                        Metal Purity & Finish Description
                      </label>
                      <input
                        type="text"
                        value={formMetalPurity}
                        onChange={(e) => setFormMetalPurity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-black"
                        placeholder="e.g. 925 Solid Sterling Silver (Rhodium Plated)"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">
                        Gemstone Variety & Cut
                      </label>
                      <input
                        type="text"
                        value={formGemstoneType}
                        onChange={(e) => setFormGemstoneType(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">
                        Carat Weight
                      </label>
                      <input
                        type="text"
                        value={formCarat}
                        onChange={(e) => setFormCarat(e.target.value)}
                        placeholder="e.g. 1.85"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">
                        Price (AUD) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-neutral-400 font-bold">$</span>
                        <input
                          type="number"
                          required
                          value={formPrice}
                          onChange={(e) => setFormPrice(e.target.value)}
                          className="w-full pl-7 pr-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        required
                        value={formStock}
                        onChange={(e) => setFormStock(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: MEDIA & UPLOADS (IMAGES & 360° VIDEO) */}
                {activeModalTab === 'media' && (
                  <div className="space-y-6">
                    {/* SECTION A: IMAGES UPLOAD */}
                    <div className="bg-neutral-50/80 rounded-2xl p-4 border border-neutral-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-neutral-700" />
                            <span>Multi-Angle Jewellery Images</span>
                          </h4>
                          <p className="text-[11px] text-neutral-500 font-light">
                            Upload photos showing front, side, on-model, and facet closeups (min 4 recommended).
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={loadSampleImages}
                          className="text-[11px] font-medium text-neutral-600 hover:text-black underline cursor-pointer"
                        >
                          Use Sample Photos
                        </button>
                      </div>

                      {/* Image Upload Dropzone */}
                      <input
                        type="file"
                        ref={imageFileInputRef}
                        onChange={handleImageFilesSelected}
                        multiple
                        accept="image/*"
                        className="hidden"
                      />

                      <div
                        onClick={() => imageFileInputRef.current?.click()}
                        className="border-2 border-dashed border-neutral-300 hover:border-black hover:bg-white rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                      >
                        <div className="w-10 h-10 rounded-full bg-neutral-200/70 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-colors">
                          {uploadingImage ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Upload className="w-5 h-5 text-neutral-600 group-hover:text-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-800">
                            {uploadingImage ? uploadStatusText : 'Click to Upload Images or Drag & Drop'}
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            Supports PNG, JPG, JPEG, WEBP. You can select multiple files at once.
                          </p>
                        </div>
                      </div>

                      {/* Uploaded Images Gallery Grid */}
                      {formImages.length > 0 && (
                        <div className="mt-4">
                          <label className="block text-[11px] font-bold text-neutral-700 mb-2">
                            Active Images ({formImages.length})
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                            {formImages.map((imgUrl, idx) => (
                              <div
                                key={idx}
                                className="relative group rounded-xl overflow-hidden border border-neutral-200 bg-white shadow-2xs aspect-square"
                              >
                                <img
                                  src={imgUrl}
                                  alt={`Product angle ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute top-1 left-1 bg-black/75 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                  {idx === 0 ? 'Cover' : `Angle ${idx + 1}`}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeImageAt(idx)}
                                  className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                                  title="Remove image"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SECTION B: 360° VIDEO UPLOAD */}
                    <div className="bg-neutral-50/80 rounded-2xl p-4 border border-neutral-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-neutral-900 text-xs flex items-center gap-1.5">
                            <Film className="w-4 h-4 text-neutral-700" />
                            <span>360° View & Sparkle Atelier Video</span>
                          </h4>
                          <p className="text-[11px] text-neutral-500 font-light">
                            Add a rotating 360° video showcasing facet fire and pavilion sparkle.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={loadSampleVideo}
                          className="text-[11px] font-medium text-neutral-600 hover:text-black underline cursor-pointer"
                        >
                          Use Sample Video
                        </button>
                      </div>

                      {/* Video Upload Dropzone */}
                      <input
                        type="file"
                        ref={videoFileInputRef}
                        onChange={handleVideoFileSelected}
                        accept="video/mp4,video/webm,video/quicktime"
                        className="hidden"
                      />

                      {!formVideoUrl ? (
                        <div
                          onClick={() => videoFileInputRef.current?.click()}
                          className="border-2 border-dashed border-neutral-300 hover:border-black hover:bg-white rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                        >
                          <div className="w-10 h-10 rounded-full bg-neutral-200/70 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-colors">
                            {uploadingVideo ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Film className="w-5 h-5 text-neutral-600 group-hover:text-white" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-neutral-800">
                              {uploadingVideo ? uploadStatusText : 'Click to Upload 360° Video'}
                            </p>
                            <p className="text-[10px] text-neutral-400">
                              Supports MP4, WEBM, MOV (Max size: 50MB)
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white rounded-2xl border border-neutral-200 p-3 flex flex-col sm:flex-row items-center gap-4">
                          <div className="w-full sm:w-48 aspect-video rounded-xl overflow-hidden bg-black shrink-0 relative">
                            <video
                              src={formVideoUrl}
                              controls
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 w-full space-y-2">
                            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs">
                              <Check className="w-4 h-4 text-emerald-600" />
                              <span>Atelier Video Linked & Ready</span>
                            </div>
                            <p className="text-[10px] text-neutral-400 font-mono truncate max-w-md">
                              {formVideoUrl}
                            </p>
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => videoFileInputRef.current?.click()}
                                className="px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-black text-[11px] font-medium transition-colors cursor-pointer"
                              >
                                Replace Video
                              </button>
                              <button
                                type="button"
                                onClick={() => setFormVideoUrl('')}
                                className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-medium transition-colors cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Collapsible Manual URL Fallback */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setShowManualUrlInputs(!showManualUrlInputs)}
                        className="text-[11px] text-neutral-500 hover:text-black font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <span>{showManualUrlInputs ? '− Hide' : '+ Show'} Advanced Manual URL Inputs</span>
                      </button>

                      {showManualUrlInputs && (
                        <div className="mt-3 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                              Image URLs (comma-separated):
                            </label>
                            <textarea
                              rows={2}
                              value={formImages.join(', ')}
                              onChange={(e) =>
                                setFormImages(
                                  e.target.value
                                    .split(',')
                                    .map((s) => s.trim())
                                    .filter(Boolean)
                                )
                              }
                              placeholder="https://example.com/ring1.jpg, https://example.com/ring2.jpg"
                              className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-mono text-[11px] bg-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                              Video Direct Stream URL:
                            </label>
                            <input
                              type="url"
                              value={formVideoUrl}
                              onChange={(e) => setFormVideoUrl(e.target.value)}
                              placeholder="https://assets.mixkit.co/videos/preview/..."
                              className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-mono text-[11px] bg-white focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: STORY, CARE & CERTIFICATE */}
                {activeModalTab === 'details' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">
                        Atelier Description & Sourcing Story
                      </label>
                      <textarea
                        rows={3}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Ethically mined Ceylon sapphire set in handcrafted precious metal..."
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">
                        Care & Cleaning Instructions
                      </label>
                      <textarea
                        rows={2}
                        value={formCare}
                        onChange={(e) => setFormCare(e.target.value)}
                        placeholder="Clean gently with lukewarm soapy water and a soft microfibre cloth. Store in separate velvet pouch."
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-black"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">
                          Certificate Authority
                        </label>
                        <input
                          type="text"
                          value={formCertIssuer}
                          onChange={(e) => setFormCertIssuer(e.target.value)}
                          placeholder="e.g. National Gem & Jewellery Authority (NGJA)"
                          className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">
                          Certificate Reference Number
                        </label>
                        <input
                          type="text"
                          value={formCertNumber}
                          onChange={(e) => setFormCertNumber(e.target.value)}
                          placeholder="e.g. NGJA-SL-2026-98104"
                          className="w-full px-3 py-2 rounded-xl border border-neutral-300 font-mono text-xs focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Modal Fixed Bottom Action Bar */}
              <div className="px-6 py-3.5 border-t border-neutral-100 bg-neutral-50/70 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-neutral-200 rounded-full text-neutral-700 font-medium hover:bg-white text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  {activeModalTab !== 'info' && (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveModalTab(activeModalTab === 'details' ? 'media' : 'info')
                      }
                      className="px-4 py-2 border border-neutral-200 rounded-full text-neutral-700 font-medium hover:bg-white text-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                  )}

                  {activeModalTab !== 'details' ? (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveModalTab(activeModalTab === 'info' ? 'media' : 'details')
                      }
                      className="px-4 py-2 bg-neutral-900 text-white rounded-full font-medium hover:bg-black text-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : null}

                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="px-5 py-2 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-colors text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    {saveLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{editingProduct ? 'Save Changes' : 'Save to Catalogue'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
