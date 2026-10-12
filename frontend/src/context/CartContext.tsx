'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
  id: string; // unique item key (productId + size + metal)
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number; // in AUD
  metal: string;
  gemstone: string;
  size?: string;
  chainLength?: string;
  quantity: number;
}

export interface AppliedCoupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  description?: string;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  discountAmount: number;
  appliedCoupon: AppliedCoupon | null;
  shippingFee: number;
  estimatedGst: number; // Australian 10% GST breakdown
  total: number;
  isFreeShipping: boolean;
  freeShippingThreshold: number;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCouponCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  generateWhatsAppCartLink: (customerName?: string, customerPhone?: string) => Promise<string>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 500; // AUD $500 threshold for Free Express DHL Shipping
const STANDARD_SHIPPING_FEE = 35; // AUD $35 standard international courier fee

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('aura_cart');
      const savedCoupon = localStorage.getItem('aura_coupon');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('aura_cart', JSON.stringify(cart));
      if (appliedCoupon) {
        localStorage.setItem('aura_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('aura_coupon');
      }
    }
  }, [cart, appliedCoupon, isLoaded]);

  const addToCart = useCallback((item: Omit<CartItem, 'id'>) => {
    const itemKey = `${item.productId}_${item.metal}_${item.size || ''}_${item.chainLength || ''}`;
    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === itemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += item.quantity;
        return updated;
      } else {
        return [...prev, { ...item, id: itemKey }];
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== itemId));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedCoupon(null);
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);

  const isFreeShipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD || cart.length === 0;
  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;

  // Australian GST is 10% (included in or calculated on DDP items)
  const estimatedGst = Math.round((discountedSubtotal * 0.1) * 100) / 100;
  const total = discountedSubtotal + shippingFee;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const applyCouponCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (!code.trim()) {
      return { success: false, message: 'Please enter a coupon code' };
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal: subtotal }),
      });
      const data = await res.json();

      if (data.success && data.data) {
        setAppliedCoupon(data.data);
        return { success: true, message: `Coupon ${code.toUpperCase()} applied! You saved $${data.data.discountAmount} AUD.` };
      } else {
        return { success: false, message: data.message || 'Invalid promotional code' };
      }
    } catch (err) {
      // Offline fallback verification
      const clean = code.trim().toUpperCase();
      if (clean === 'CEYLON10') {
        const discountVal = Math.round((subtotal * 10) / 100);
        const c: AppliedCoupon = {
          code: 'CEYLON10',
          discountType: 'percentage',
          discountValue: 10,
          discountAmount: discountVal,
          description: '10% Welcome gift for fine jewellery connoisseurs',
        };
        setAppliedCoupon(c);
        return { success: true, message: `Coupon CEYLON10 applied! Saved $${discountVal} AUD.` };
      }
      return { success: false, message: 'Could not validate promotional code' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // 5.3: "Prefer to order via WhatsApp?" option
  // Pre-fills cart contents into WhatsApp message & auto-logs lead in backend admin desk
  const generateWhatsAppCartLink = async (customerName?: string, customerPhone?: string): Promise<string> => {
    const lines = [
      `💎 *Aura Ceylon Jewels — Order Consultation*`,
      `Hello! I would like to confirm an order directly with your concierge:`,
      ``,
      ...cart.map(
        (it, idx) =>
          `${idx + 1}. *${it.name}* (Qty: ${it.quantity})\n   • Metal: ${it.metal}\n   • Gem: ${it.gemstone}${it.size ? `\n   • Size: ${it.size}` : ''}\n   • Price: $${it.price * it.quantity} AUD`
      ),
      ``,
      `*Subtotal:* $${subtotal} AUD`,
      appliedCoupon ? `*Discount (${appliedCoupon.code}):* -$${discountAmount} AUD` : '',
      `*Estimated Shipping:* ${shippingFee === 0 ? 'FREE Express DHL' : `$${shippingFee} AUD`}`,
      `*Estimated Total:* $${total} AUD`,
      ``,
      `Please confirm stone availability and payment options for Australia. Thank you!`,
    ].filter(Boolean);

    const fullMessage = encodeURIComponent(lines.join('\n'));
    const whatsappUrl = `https://wa.me/94771234567?text=${fullMessage}`;

    // Auto-log inquiry to backend leads database
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      await fetch(`${apiUrl}/leads/whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName || 'Australian Cart Visitor',
          phoneNumber: customerPhone || 'WhatsApp Direct Lead',
          source: 'Cart WhatsApp Checkout',
          cartItems: cart.map((c) => ({
            productId: c.productId,
            title: c.name,
            metal: c.metal,
            gemstone: c.gemstone,
            size: c.size,
            price: c.price,
            quantity: c.quantity,
            image: c.image,
          })),
          totalAmount: total,
        }),
      });
    } catch (e) {
      console.warn('WhatsApp lead logged locally');
    }

    return whatsappUrl;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        discountAmount,
        appliedCoupon,
        shippingFee,
        estimatedGst,
        total,
        isFreeShipping,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCouponCode,
        removeCoupon,
        generateWhatsAppCartLink,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
