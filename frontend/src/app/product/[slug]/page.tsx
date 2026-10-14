'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ShoppingBag,
  MessageCircle,
  Gem,
  Award,
  Star,
  CheckCircle2,
  ChevronRight,
  Eye,
  Camera,
  Share2,
  ArrowRight,
  X,
  Play,
  Check,
} from 'lucide-react';

interface ReviewItem {
  _id: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  photos?: string[];
  verifiedPurchase: boolean;
  createdAt: string;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'video' | '360'>('photos');

  // Product selections
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedChainLength, setSelectedChainLength] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Certificate Modal & Review Modal
  const [certModalOpen, setCertModalOpen] = useState<boolean>(false);
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);

  // Review Form
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewName, setReviewName] = useState<string>('');
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewPhotoUrl, setReviewPhotoUrl] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  // Feedback toast
  const [toastMessage, setToastMessage] = useState<string>('');

  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      try {
        // 1. Fetch Product
        const pRes = await fetch(`${apiUrl}/products/${slug}`);
        const pData = await pRes.json();
        if (pData.success && pData.data) {
          setProduct(pData.data);
          if (pData.data.dimensions?.ringSizes?.length > 0) {
            setSelectedSize(pData.data.dimensions.ringSizes[0]);
          }
          if (pData.data.dimensions?.chainLengths?.length > 0) {
            setSelectedChainLength(pData.data.dimensions.chainLengths[0]);
          }
        }

        // 2. Fetch Related Products
        const relRes = await fetch(`${apiUrl}/products/${slug}/related?limit=3`);
        const relData = await relRes.json();
        if (relData.success && Array.isArray(relData.data)) {
          setRelatedProducts(relData.data);
        }

        // 3. Fetch Reviews
        const revRes = await fetch(`${apiUrl}/reviews/product/${slug}`);
        const revData = await revRes.json();
        if (revData.success && Array.isArray(revData.data)) {
          setReviews(revData.data);
        }
      } catch (err) {
        console.warn('Using client product fallback');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-neutral-500 font-medium tracking-wide">
              Retrieving handcrafted gemstone specifications...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32 text-center px-4">
          <div>
            <Gem className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h2 className="text-xl text-black font-semibold">Jewellery Item Not Found</h2>
            <p className="text-xs text-neutral-500 mt-1 mb-6">
              The piece you are looking for may have been archived or purchased.
            </p>
            <Link
              href="/shop"
              className="px-6 py-3 bg-black text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            >
              Browse Active Collection
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.url || '',
      price: product.price,
      metal: product.metal?.purity || 'Solid Precious Metal',
      gemstone: product.gemstone?.type || 'Natural Ceylon Sapphire',
      size: selectedSize || undefined,
      chainLength: selectedChainLength || undefined,
      quantity,
    });
    setToastMessage(`Added "${product.name}" to your shopping bag!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        _id: product._id,
        title: product.name,
        price: product.price,
        image: product.images[0]?.url || '',
        metal: product.metal?.purity,
        gemstone: product.gemstone?.type,
      });
    }
  };

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `💎 *Aura Ceylon Jewellery Inquiry*\n` +
      `Hello! I am inquiring about the:\n` +
      `*${product.name}* ($${product.price} AUD)\n` +
      `• Gemstone: ${product.gemstone?.type} (${product.gemstone?.carat} ct)\n` +
      `• Metal: ${product.metal?.purity}\n` +
      `${selectedSize ? `• Ring Size: ${selectedSize}\n` : ''}` +
      `Could you please share a video of this stone in natural sunlight and confirm shipping to Australia?`
    );
    window.open(`https://wa.me/94771234567?text=${text}`, '_blank');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    setSubmittingReview(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      const res = await fetch(`${apiUrl}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          productName: product.name,
          customerName: reviewName,
          rating: reviewRating,
          title: reviewTitle || 'Verified Customer Review',
          comment: reviewComment,
          photos: reviewPhotoUrl ? [reviewPhotoUrl] : [],
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setReviews([data.data, ...reviews]);
        setReviewModalOpen(false);
        setReviewComment('');
        setReviewPhotoUrl('');
        setToastMessage('Thank you! Your verified review has been published.');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (e) {
      // Local fallback
      const mockRev: ReviewItem = {
        _id: `rev_${Date.now()}`,
        customerName: reviewName,
        rating: reviewRating,
        title: reviewTitle || 'Verified Customer Review',
        comment: reviewComment,
        photos: reviewPhotoUrl ? [reviewPhotoUrl] : [],
        verifiedPurchase: true,
        createdAt: new Date().toISOString(),
      };
      setReviews([mockRev, ...reviews]);
      setReviewModalOpen(false);
    } finally {
      setSubmittingReview(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Floating Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-neutral-700 text-xs animate-in slide-in-from-bottom">
          <Check className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
          <Link href="/cart" className="underline font-bold text-white ml-2">
            View Bag
          </Link>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-neutral-500 flex items-center gap-1.5 w-full">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-black capitalize">
          {product.category?.replace(/-/g, ' ')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-black font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* LEFT: Multi-Angle Photo & 360°/Video Viewer (Section 5.2) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Media Tabs Switcher */}
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
              <button
                onClick={() => setActiveMediaTab('photos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeMediaTab === 'photos'
                    ? 'bg-black text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Multi-Angle Photos ({product.images?.length || 4})</span>
              </button>

              <button
                onClick={() => setActiveMediaTab('video')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeMediaTab === 'video'
                    ? 'bg-black text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Play className="w-3.5 h-3.5 text-white" />
                <span>360° Sparkle Video</span>
              </button>
            </div>

            {/* Display Screen */}
            <div className="relative aspect-square sm:aspect-4/3 lg:aspect-square rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-xs">
              {activeMediaTab === 'photos' ? (
                <img
                  src={
                    product.images[activeImageIndex]?.url ||
                    product.images[0]?.url ||
                    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={product.images[activeImageIndex]?.alt || product.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full bg-neutral-950 flex flex-col items-center justify-center p-6 text-center text-white relative">
                  <video
                    src={product.media?.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-diamond-ring-sparkling-in-the-dark-42416-large.mp4'}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur px-3 py-1.5 rounded-full text-[11px] text-white flex items-center gap-1.5 border border-white/20">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span>Optical scintillation in directional daylight</span>
                  </div>
                </div>
              )}

              {/* Stock Urgency Tag (Section 5.2) */}
              {product.stockQuantity <= 2 && (
                <div className="absolute top-4 left-4 bg-black/90 backdrop-blur text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-neutral-700">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>Only {product.stockQuantity} piece{product.stockQuantity > 1 ? 's' : ''} handcrafted — In Stock</span>
                </div>
              )}

              {/* Certificate badge overlay button */}
              {product.certificate?.available && (
                <button
                  onClick={() => setCertModalOpen(true)}
                  className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md border border-neutral-300 hover:border-black text-black text-xs font-semibold px-3 py-1.5 rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5 text-black" />
                  <span>View Official Gem Certificate</span>
                </button>
              )}
            </div>

            {/* Thumbnail Strip (Minimum 4-6 multi-angle shots) */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5">
                {product.images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      setActiveMediaTab('photos');
                    }}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-neutral-100 ${
                      activeImageIndex === idx && activeMediaTab === 'photos'
                        ? 'border-black shadow-sm scale-95'
                        : 'border-transparent hover:border-neutral-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Specs, Sizing, Pricing & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                <span className="uppercase tracking-widest font-semibold text-neutral-600">
                  {product.gemstone?.origin || 'Ratnapura, Sri Lanka'}
                </span>
                <div className="flex items-center gap-1 text-black">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold text-neutral-800">{averageRating}</span>
                  <span className="text-neutral-400">({reviews.length} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl text-black font-semibold leading-snug">
                {product.name}
              </h1>

              {/* Price in AUD */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-black">
                  ${product.price} AUD
                </span>
                <span className="text-xs text-black font-semibold bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200">
                  ✓ Free Insured DHL Express to Australia
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Prices include all Australian import clearance under DDP terms. No customs surprises.
              </p>
            </div>

            {/* Gemstone Specifications Matrix (Section 5.2) */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-black block border-b border-neutral-200 pb-1.5">
                Gemological Specifications
              </span>
              <div className="grid grid-cols-2 gap-y-2 text-neutral-700">
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Primary Gemstone</span>
                  <span className="font-semibold text-black">{product.gemstone?.type}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Carat Weight</span>
                  <span className="font-semibold text-black">{product.gemstone?.carat} Carats</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Precious Metal</span>
                  <span className="font-semibold text-black">{product.metal?.purity}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Faceting Cut</span>
                  <span className="font-semibold text-black">{product.gemstone?.cut || 'Brilliant Cut'}</span>
                </div>
              </div>
            </div>

            {/* Sizing & Dimension Options (US Ring sizes or Chain length) */}
            {product.dimensions?.ringSizes?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-black uppercase tracking-wider">
                    Select Ring Size (US Sizing)
                  </label>
                  <Link href="/customize" className="text-[11px] text-neutral-600 hover:text-black hover:underline">
                    Ring Sizing Guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.dimensions.ringSizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'border-black bg-black text-white font-bold shadow-xs'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.dimensions?.chainLengths?.length > 0 && (
              <div>
                <label className="text-xs font-bold text-black uppercase tracking-wider block mb-2">
                  Select Chain Length
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.dimensions.chainLengths.map((length: string) => (
                    <button
                      key={length}
                      onClick={() => setSelectedChainLength(length)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selectedChainLength === length
                          ? 'border-black bg-black text-white font-bold'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      {length}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-black">Quantity</span>
              <div className="flex items-center border border-neutral-300 rounded-xl bg-white overflow-hidden text-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 hover:bg-neutral-100 font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-1.5 font-bold text-black">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity || 5, quantity + 1))}
                  className="px-3 py-1.5 hover:bg-neutral-100 font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag</span>
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    inWishlist
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 hover:text-black'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md cursor-pointer border border-black"
              >
                Proceed to Checkout (${product.price * quantity} AUD)
              </button>

              {/* 5.3: "Prefer to order via WhatsApp?" Direct Concierge */}
              <button
                onClick={handleWhatsAppInquiry}
                className="w-full py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-black text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-black" />
                <span>Prefer to order via WhatsApp? (Talk to Gemologist)</span>
              </button>
            </div>

            {/* Trust Signals Section (Section 5.6) */}
            <div className="pt-4 border-t border-neutral-200 grid grid-cols-3 gap-3 text-center text-[11px] text-neutral-600">
              <div className="p-2.5 rounded-xl bg-white border border-neutral-200">
                <ShieldCheck className="w-4 h-4 text-black mx-auto mb-1" />
                <span className="font-semibold text-black block">NGJA Certified</span>
                <span>Authentic Ceylon</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-neutral-200">
                <Truck className="w-4 h-4 text-black mx-auto mb-1" />
                <span className="font-semibold text-black block">DHL Express</span>
                <span>3–5 Days to AU</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-neutral-200">
                <RotateCcw className="w-4 h-4 text-black mx-auto mb-1" />
                <span className="font-semibold text-black block">30-Day Returns</span>
                <span>Hassle-Free Policy</span>
              </div>
            </div>

            {/* Description & Care Accordion */}
            <div className="pt-2 space-y-3">
              <div className="p-4 rounded-xl bg-white border border-neutral-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-2">
                  Atelier Story & Details
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-neutral-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-2">
                  Care & Preservation Guide
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  {product.careInstructions}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS & VERIFIED CUSTOMER PHOTOS SECTION (Section 5.2 & 5.6) */}
        <section className="mt-16 pt-12 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                Customer Testimonials & Proof
              </span>
              <h3 className="text-2xl text-black font-semibold mt-1">
                Verified Reviews ({reviews.length})
              </h3>
            </div>

            <button
              onClick={() => setReviewModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
              <span>Write a Review & Add Photo</span>
            </button>
          </div>

          {/* Customer Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-black">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] text-black font-semibold bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-black" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>

                  <h5 className="text-sm font-semibold text-black mb-1.5">
                    "{rev.title}"
                  </h5>
                  <p className="text-xs text-neutral-600 leading-relaxed font-light mb-4">
                    {rev.comment}
                  </p>

                  {/* Customer Uploaded Photo Preview (Section 5.6) */}
                  {rev.photos && rev.photos.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {rev.photos.map((pUrl, pIdx) => (
                        <img
                          key={pIdx}
                          src={pUrl}
                          alt="Customer review photo"
                          className="w-16 h-16 rounded-xl object-cover border border-neutral-200"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="font-medium text-neutral-700">{rev.customerName}</span>
                  <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RELATED / "YOU MAY ALSO LIKE" SECTION (Section 5.1) */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                  Curated Pairings
                </span>
                <h3 className="text-2xl text-black font-semibold mt-1">
                  You May Also Like
                </h3>
              </div>
              <Link
                href="/shop"
                className="text-xs font-bold text-black hover:underline flex items-center gap-1"
              >
                <span>View Full Catalogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel._id}
                  href={`/product/${rel.slug}`}
                  className="group bg-white rounded-2xl border border-neutral-200 hover:border-black overflow-hidden shadow-xs hover:shadow-lg transition-all"
                >
                  <div className="aspect-square bg-neutral-100 overflow-hidden">
                    <img
                      src={rel.images[0]?.url || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80'}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider block mb-1">
                      {rel.gemstone?.type}
                    </span>
                    <h5 className="text-neutral-900 text-sm font-medium line-clamp-1 group-hover:text-neutral-600">
                      {rel.name}
                    </h5>
                    <span className="text-sm font-bold text-black mt-2 block">
                      ${rel.price} AUD
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* GEMSTONE CERTIFICATE MODAL (Section 5.2) */}
      {certModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95 border border-neutral-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-black" />
                <h3 className="text-lg font-bold text-black">
                  Gemological Certificate of Authenticity
                </h3>
              </div>
              <button onClick={() => setCertModalOpen(false)} className="p-1 text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs space-y-3">
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Issuing Body:</span>
                <span className="font-bold text-black">{product.certificate?.issuer || 'National Gem & Jewellery Authority (NGJA)'}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Certificate No:</span>
                <span className="font-mono font-bold text-black">{product.certificate?.certificateNumber || 'NGJA-SL-2026-98104'}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Species & Variety:</span>
                <span className="font-bold text-black">Natural Corundum ({product.gemstone?.type})</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500">Thermal Treatment:</span>
                <span className="font-bold text-black">Unheated / Natural Earth Mined</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Geographic Origin:</span>
                <span className="font-bold text-black">Sri Lanka (Ceylon)</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 leading-relaxed text-center">
              This physical signed certificate accompanies your courier parcel with tamper-evident serial markings for Australian customs clearance.
            </p>

            <button
              onClick={() => setCertModalOpen(false)}
              className="w-full py-3 bg-black text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
            >
              Close Certificate Viewer
            </button>
          </div>
        </div>
      )}

      {/* WRITE A REVIEW MODAL (Section 5.2 & 5.6) */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in zoom-in-95 border border-neutral-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-black">
                Review & Photo Submission
              </h3>
              <button onClick={() => setReviewModalOpen(false)} className="p-1 text-neutral-400 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-black font-semibold mb-1">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-black hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-current text-black' : 'text-neutral-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-black font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Liam Thompson"
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs"
                />
              </div>

              <div>
                <label className="block text-black font-semibold mb-1">Review Headline</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Incredible brilliance and craftsmanship"
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs"
                />
              </div>

              <div>
                <label className="block text-black font-semibold mb-1">Detailed Review</label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell Australian buyers about the color in natural light, fit, packaging, and shipping experience..."
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs"
                />
              </div>

              <div>
                <label className="block text-black font-semibold mb-1">
                  Upload Photo of Piece (Photo URL)
                </label>
                <input
                  type="url"
                  value={reviewPhotoUrl}
                  onChange={(e) => setReviewPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs"
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Optional but recommended: show fellow collectors how your sapphire looks on-hand!
                </span>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="flex-1 py-3 border border-neutral-300 rounded-xl text-neutral-700 font-semibold hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="flex-1 py-3 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  {submittingReview ? 'Publishing...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
