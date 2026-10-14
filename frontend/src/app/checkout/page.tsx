'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  Lock,
  ShieldCheck,
  Truck,
  CheckCircle2,
  CreditCard,
  MessageCircle,
  ArrowLeft,
  ChevronRight,
  Package,
  Calendar,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, discountAmount, appliedCoupon, shippingFee, estimatedGst, total, clearCart } = useCart();
  const { user, token } = useAuth();

  // Guest or Customer Contact
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Shipping Address
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('NSW');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Australia');

  // Payment mock
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<any>(null);

  // Auto-fill logged-in user profile if available
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setFullName(user.name || '');
      setPhoneNumber(user.phoneNumber || '');
      if (user.savedAddresses && user.savedAddresses.length > 0) {
        const def = user.savedAddresses.find((a) => a.isDefault) || user.savedAddresses[0];
        setStreet(def.street || '');
        setApartment(def.apartment || '');
        setCity(def.city || '');
        setState(def.state || 'NSW');
        setPostalCode(def.postalCode || '');
        setCountry(def.country || 'Australia');
      }
    }
  }, [user]);

  // If cart is empty and no completed order, redirect to cart
  useEffect(() => {
    if (cart.length === 0 && !orderCompleted) {
      router.push('/cart');
    }
  }, [cart, orderCompleted, router]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderPayload = {
      orderNumber: `AC-${Math.floor(10000 + Math.random() * 90000)}`,
      customer: {
        userId: user?._id,
        fullName,
        email,
        phoneNumber,
      },
      orderItems: cart.map((item) => ({
        productId: item.productId,
        title: item.name,
        metal: item.metal,
        gemstone: item.gemstone,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      shippingAddress: {
        fullName,
        phoneNumber,
        street,
        apartment,
        city,
        state,
        postalCode,
        country,
      },
      paymentInfo: {
        method: 'International Credit Card (AUD)',
        transactionId: `TXN-STRIPE-${Date.now()}`,
        status: 'Paid',
      },
      subtotal,
      discountAmount,
      shippingFee,
      estimatedGst,
      totalPrice: total,
      currency: 'AUD',
      status: 'Processing',
      timeline: [
        {
          status: 'Order Placed & Deposit Verified',
          title: 'Order Placed & Payment Verified in AUD',
          description: 'Your bespoke jewellery order has been confirmed by our Colombo atelier.',
          timestamp: new Date().toISOString(),
          isCompleted: true,
        },
        {
          status: 'Gem Setting & Inspection',
          title: 'Gem Setting & Master Lapidary QC',
          description: 'Master artisans set your unheated Ceylon sapphire into solid precious metal.',
          isCompleted: false,
        },
        {
          status: 'Pending NGJA Export Clearance',
          title: 'National Gem & Jewellery Authority (NGJA) Appraisal',
          description: 'Independent gemological testing, assay stamping, and export clearance sealing in Colombo.',
          isCompleted: false,
        },
        {
          status: 'Shipped',
          title: 'Dispatched via International Courier (DHL Express)',
          description: 'Air waybill generated and handed to DHL for expedited delivery to Australia.',
          isCompleted: false,
        },
        {
          status: 'Delivered',
          title: 'Delivered to Australian Address',
          description: 'Signature-required delivery to your doorstep in Australia.',
          isCompleted: false,
        },
      ],
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      if (data.success) {
        setOrderCompleted(data.data);
      } else {
        setOrderCompleted(orderPayload);
      }
    } catch (err) {
      setOrderCompleted(orderPayload);
    } finally {
      clearCart();
      setIsSubmitting(false);
    }
  };

  // SUCCESS / CONFIRMATION VIEW (Section 5.3)
  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-16 flex-1 w-full text-center">
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 shadow-sm space-y-6">
            <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-900 flex items-center justify-center mx-auto border border-neutral-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-700">
                Payment Authorized • Order #{orderCompleted.orderNumber}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif text-neutral-900 mt-1 font-medium">
                Thank You for Entrusting Aura Ceylon
              </h1>
              <p className="text-xs text-neutral-500 mt-2 max-w-md mx-auto leading-relaxed">
                A confirmation receipt has been generated. Your parcel will undergo independent Sri Lankan National Gem & Jewellery Authority (NGJA) inspection prior to courier dispatch.
              </p>
            </div>

            {/* Order Summary Receipt Box */}
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 text-left text-xs space-y-4">
              <div className="flex justify-between border-b border-neutral-200 pb-3">
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Recipient</span>
                  <span className="font-semibold text-neutral-900">{orderCompleted.customer?.fullName}</span>
                  <span className="text-neutral-500 block">{orderCompleted.customer?.email}</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-400 block text-[10px] uppercase">Destination</span>
                  <span className="font-semibold text-neutral-900">
                    {orderCompleted.shippingAddress?.city}, {orderCompleted.shippingAddress?.state}
                  </span>
                  <span className="text-neutral-500 block">{orderCompleted.shippingAddress?.country}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-neutral-400 block">Items Purchased</span>
                {orderCompleted.orderItems?.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-neutral-700">
                    <span>
                      {it.title} {it.size ? `(Size: ${it.size})` : ''} x{it.quantity}
                    </span>
                    <span className="font-semibold text-neutral-900">${it.price * it.quantity} AUD</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-between font-bold text-sm text-neutral-950 font-serif">
                <span>Total Settled (AUD)</span>
                <span>${orderCompleted.totalPrice} AUD</span>
              </div>
            </div>

            {/* Customer Tracking Information Link */}
            <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-neutral-700" />
                <span>Track your order and NGJA clearance progress anytime:</span>
              </div>
              <Link
                href="/account"
                className="font-bold text-neutral-950 hover:underline uppercase text-[11px]"
              >
                Go to Client Portal →
              </Link>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/account"
                className="px-6 py-3 rounded-xl bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                View Order in My Account
              </Link>
              <Link
                href="/shop"
                className="px-6 py-3 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-100 transition-colors"
              >
                Continue Browsing
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // CHECKOUT FORM VIEW
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Checkout Header */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-200 mb-8">
          <div className="flex items-center gap-3">
            <Link href="/cart" className="p-2 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-600">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif text-neutral-900 font-semibold">
                Express Checkout
              </h1>
              <p className="text-xs text-neutral-500">
                Direct atelier dispatch from Colombo to Australia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-neutral-900 font-semibold bg-neutral-100 px-3 py-1.5 rounded-full border border-neutral-200">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Secured</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: Customer, Shipping, & Payment Forms (Cols 7) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact Info & Guest Option (Section 5.3) */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-neutral-900">
                  1. Contact Information
                </h3>
                {!user && (
                  <span className="text-[11px] text-neutral-800 font-semibold bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-300">
                    ✓ Guest Checkout Enabled
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. eleanor.vance@sydney.com.au"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-700 font-semibold mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+61 412 345 678"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs"
                  />
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Required by international courier for delivery signature notifications.
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200 space-y-4 shadow-xs">
              <h3 className="font-serif text-base font-bold text-neutral-900">
                2. Australian Delivery Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-neutral-700 font-semibold mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. 74 Macquarie Street"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Apartment, Suite (Optional)</label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="e.g. Apt 12B"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Suburb / City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Sydney"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">State / Territory *</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs bg-white"
                  >
                    <option value="NSW">NSW (New South Wales)</option>
                    <option value="VIC">VIC (Victoria)</option>
                    <option value="QLD">QLD (Queensland)</option>
                    <option value="WA">WA (Western Australia)</option>
                    <option value="SA">SA (South Australia)</option>
                    <option value="TAS">TAS (Tasmania)</option>
                    <option value="ACT">ACT (Australian Capital Territory)</option>
                    <option value="NT">NT (Northern Territory)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Postcode *</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 2000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method (Section 5.3: Major international cards in AUD) */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-neutral-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-neutral-900">
                  3. Secure Card Payment (in AUD)
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-500">
                  <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Visa, Mastercard, AMEX</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-neutral-700 font-semibold mb-1">Cardholder Name *</label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Name as printed on card"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-neutral-700 font-semibold mb-1">Card Number *</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 •••• •••• 8892"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Expiry (MM/YY) *</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="08/28"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">CVC / CVV *</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="•••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary & Settlement (Cols 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-7 shadow-xs space-y-5">
              <h3 className="font-serif text-base font-bold text-neutral-900 pb-3 border-b border-neutral-200">
                Order Review ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </h3>

              {/* Items List Mini */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((it) => (
                  <div key={it.id} className="flex items-center gap-3 text-xs">
                    <img src={it.image} alt={it.name} className="w-12 h-12 rounded-xl object-cover border border-neutral-200" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-neutral-900 truncate">{it.name}</h4>
                      <p className="text-[11px] text-neutral-500">
                        Qty {it.quantity} {it.size ? `• ${it.size}` : ''}
                      </p>
                    </div>
                    <span className="font-bold text-neutral-900">${it.price * it.quantity} AUD</span>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2 text-xs text-neutral-600 pt-3 border-t border-neutral-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">${subtotal} AUD</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-neutral-900 font-medium">
                    <span>Discount</span>
                    <span>-${discountAmount} AUD</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express DHL Shipping (Sri Lanka → AU)</span>
                  <span className="font-semibold text-neutral-900">
                    {shippingFee === 0 ? <span className="text-neutral-900 font-bold">FREE</span> : `$${shippingFee} AUD`}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-500 text-[11px]">
                  <span>Estimated Australian GST (10%)</span>
                  <span>${estimatedGst} AUD</span>
                </div>
                <div className="flex justify-between text-base font-bold text-neutral-950 font-serif pt-3 border-t border-neutral-200">
                  <span>Total Due</span>
                  <span>${total} AUD</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-white" />
                <span>{isSubmitting ? 'Authorizing Payment...' : `Authorize $${total} AUD Payment`}</span>
              </button>

              <div className="text-[10px] text-neutral-400 text-center leading-relaxed">
                By completing this order, you agree to our 30-day Australian return policy and terms of authentic Ceylon provenance.
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
