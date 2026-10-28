'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useCart } from '../../context/CartContext';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  MessageCircle,
  Tag,
  Check,
  AlertCircle,
  CreditCard,
  Lock,
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    cartCount,
    subtotal,
    discountAmount,
    appliedCoupon,
    shippingFee,
    estimatedGst,
    total,
    isFreeShipping,
    freeShippingThreshold,
    updateQuantity,
    removeFromCart,
    applyCouponCode,
    removeCoupon,
    generateWhatsAppCartLink,
  } = useCart();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [whatsAppLoading, setWhatsAppLoading] = useState(false);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;

    setApplyingPromo(true);
    setPromoMessage(null);
    const result = await applyCouponCode(promoCodeInput);
    setPromoMessage({ text: result.message, error: !result.success });
    if (result.success) {
      setPromoCodeInput('');
    }
    setApplyingPromo(false);
  };

  const handleOrderViaWhatsApp = async () => {
    setWhatsAppLoading(true);
    try {
      const link = await generateWhatsAppCartLink();
      window.open(link, '_blank');
    } finally {
      setWhatsAppLoading(false);
    }
  };

  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-black text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-semibold text-neutral-400 block mb-1">
            Section 5.3 • Persistent Bag
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif text-white">
            Your Fine Jewellery Bag ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-neutral-400 mt-2">
            Transparent AUD pricing with Australian customs (DDP) clearance included.
          </p>
        </div>
      </section>

      {/* Main Cart Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {cart.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-neutral-200 p-8 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-800 flex items-center justify-center mx-auto mb-4 border border-neutral-300">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-xl font-medium text-neutral-900">Your shopping bag is empty</h2>
            <p className="text-xs text-neutral-500 mt-2 mb-6 leading-relaxed">
              Explore our handcrafted Ceylon blue sapphires, rare padparadschas, and solitaire rings.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold transition-colors shadow-md"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left: Cart Items List */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Shipping Progress Indicator (Section 5.3) */}
              <div className="p-4 rounded-2xl bg-neutral-100/80 border border-neutral-200 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-neutral-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-neutral-700" />
                    <span>
                      {isFreeShipping
                        ? '🎉 You have unlocked Free Insured Express DHL Shipping to Australia!'
                        : `Add $${amountToFreeShipping} AUD more for Free Insured Express DHL Shipping`}
                    </span>
                  </span>
                  <span className="font-bold text-neutral-900">
                    {Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-3xl border border-neutral-200 divide-y divide-neutral-100 shadow-xs overflow-hidden">
                {cart.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    {/* Thumbnail */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-neutral-200 shrink-0"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.slug}`}>
                        <h3 className="font-serif text-base font-semibold text-neutral-900 hover:text-neutral-600 transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-neutral-500 mt-1">
                        {item.metal} • {item.gemstone}
                        {item.size ? ` • Size: ${item.size}` : ''}
                        {item.chainLength ? ` • Length: ${item.chainLength}` : ''}
                      </p>
                      <span className="text-xs text-neutral-800 font-semibold block mt-1">
                        ✓ Sri Lanka NGJA Appraisal Accompanied
                      </span>
                    </div>

                    {/* Quantity & Controls */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center border border-neutral-300 rounded-xl bg-white overflow-hidden text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1.5 hover:bg-neutral-100 font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 py-1.5 font-bold text-neutral-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1.5 hover:bg-neutral-100 font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right min-w-[90px]">
                        <span className="text-base font-serif font-bold text-neutral-900 block">
                          ${item.price * item.quantity} AUD
                        </span>
                        <span className="text-[10px] text-neutral-400">(${item.price} each)</span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 5.3: "Prefer to order via WhatsApp?" Callout Section */}
              <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-200 text-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
                  <MessageCircle className="w-5 h-5 text-neutral-700" />
                  <span>Prefer to confirm your order via WhatsApp?</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  If you prefer personal confirmation before paying online, click below. Your cart contents will be pre-filled into a WhatsApp message directly to our master gemologist in Colombo, and trackable as a concierge lead.
                </p>
                <button
                  onClick={handleOrderViaWhatsApp}
                  disabled={whatsAppLoading}
                  className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{whatsAppLoading ? 'Preparing Cart...' : 'Chat on WhatsApp with Bag Contents'}</span>
                </button>
              </div>
            </div>

            {/* Right: Order Summary & DDP Breakdown */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-7 shadow-xs space-y-5">
                <h3 className="font-serif text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-200">
                  Order Summary
                </h3>

                {/* Promo Code Input */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1.5">
                    Promotional Code
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs">
                      <div>
                        <span className="font-bold text-neutral-900">{appliedCoupon.code}</span>
                        <span className="text-[10px] text-neutral-600 block">
                          -${appliedCoupon.discountAmount} AUD applied
                        </span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        placeholder="Try 'CEYLON10'"
                        className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-black"
                      />
                      <button
                        type="submit"
                        disabled={applyingPromo}
                        className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {promoMessage && (
                    <p
                      className={`text-[11px] mt-1.5 ${
                        promoMessage.error ? 'text-red-600' : 'text-neutral-900 font-medium'
                      }`}
                    >
                      {promoMessage.text}
                    </p>
                  )}
                </div>

                {/* Subtotals & Taxes breakdown */}
                <div className="space-y-2.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-neutral-900">${subtotal} AUD</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-neutral-900 font-medium">
                      <span>Promotional Discount</span>
                      <span>-${discountAmount} AUD</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping (Sri Lanka → Australia)</span>
                    <span className="font-semibold text-neutral-900">
                      {shippingFee === 0 ? (
                        <span className="text-neutral-900 font-bold">FREE Express DHL</span>
                      ) : (
                        `$${shippingFee} AUD`
                      )}
                    </span>
                  </div>

                  {/* 5.3: Australian GST DDP transparency */}
                  <div className="flex justify-between text-neutral-500 text-[11px] pt-1 border-t border-neutral-100">
                    <span className="flex items-center gap-1">
                      <span>Estimated Australian GST (10%)</span>
                      <span className="text-[10px] text-neutral-700 font-semibold">(DDP Paid)</span>
                    </span>
                    <span>${estimatedGst} AUD</span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-neutral-950 font-serif pt-3 border-t border-neutral-200">
                    <span>Estimated Total</span>
                    <span>${total} AUD</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full py-4 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-colors shadow-lg shadow-black/10 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-white" />
                  <span>Proceed to Secure Checkout</span>
                </button>

                {/* Accepted Payment Method Icons/Logos (Section 5.3) */}
                <div className="pt-4 border-t border-neutral-200 text-center space-y-2">
                  <span className="text-[10px] text-neutral-400 block font-semibold">
                    Accepted International Payment Methods
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    {['Visa', 'Mastercard', 'AMEX', 'Apple Pay', 'Google Pay', 'PayPal'].map((brand) => (
                      <span
                        key={brand}
                        className="px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-[10px] font-bold text-neutral-700"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-500 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
                    <span>256-Bit Encrypted Australian Settlement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
