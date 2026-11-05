'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth, UserProfile } from './AuthContext';

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

/**
 * Returns a stable, sanitized storage key identifier for the current user.
 * Guests / unregistered users share 'guest'.
 * Logged-in accounts are strictly isolated by their unique ID or email.
 */
function getUserStorageKey(user: UserProfile | null): string {
  if (!user) return 'guest';
  const rawId = user._id || user.id || user.email || 'guest';
  return String(rawId).toLowerCase().replace(/[^a-z0-9_@.-]/g, '_');
}

/**
 * Checks whether a legacy, un-scoped cart ('aura_cart') exists from previous versions.
 * If found, migrates it specifically to Deshan's account (as stated by user),
 * clears the global key, and ensures unregistered users/other accounts start with clean bags.
 */
function handleLegacyCartMigration(currentUser: UserProfile | null): { cart: CartItem[]; coupon: AppliedCoupon | null } | null {
  if (typeof window === 'undefined') return null;

  try {
    const legacyCartStr = localStorage.getItem('aura_cart');
    const legacyCouponStr = localStorage.getItem('aura_coupon');

    if (!legacyCartStr) return null;

    let parsedLegacyCart: CartItem[] = [];
    try {
      parsedLegacyCart = JSON.parse(legacyCartStr);
    } catch {
      parsedLegacyCart = [];
    }

    let parsedLegacyCoupon: AppliedCoupon | null = null;
    if (legacyCouponStr) {
      try {
        parsedLegacyCoupon = JSON.parse(legacyCouponStr);
      } catch {
        parsedLegacyCoupon = null;
      }
    }

    // Always preserve Deshan's cart into a dedicated backup key
    if (Array.isArray(parsedLegacyCart) && parsedLegacyCart.length > 0) {
      localStorage.setItem('aura_cart_deshan_backup', JSON.stringify(parsedLegacyCart));
      if (parsedLegacyCoupon) {
        localStorage.setItem('aura_coupon_deshan_backup', JSON.stringify(parsedLegacyCoupon));
      }
    }

    // Delete the shared un-scoped keys so no cross-user pollution happens
    localStorage.removeItem('aura_cart');
    localStorage.removeItem('aura_coupon');

    // If the active user right now is Deshan, save into his user-scoped key immediately
    const isDeshan =
      currentUser &&
      (currentUser.name?.toLowerCase().includes('deshan') ||
       currentUser.email?.toLowerCase().includes('deshan'));

    if (isDeshan) {
      const userKey = getUserStorageKey(currentUser);
      localStorage.setItem(`aura_cart_${userKey}`, JSON.stringify(parsedLegacyCart));
      if (parsedLegacyCoupon) {
        localStorage.setItem(`aura_coupon_${userKey}`, JSON.stringify(parsedLegacyCoupon));
      }
      return { cart: parsedLegacyCart, coupon: parsedLegacyCoupon };
    }

    return null;
  } catch (err) {
    console.error('Error in handleLegacyCartMigration:', err);
    return null;
  }
}

/**
 * Loads the scoped cart and applied coupon for the given user profile.
 */
function loadScopedCart(user: UserProfile | null): { cart: CartItem[]; coupon: AppliedCoupon | null } {
  if (typeof window === 'undefined') {
    return { cart: [], coupon: null };
  }

  // Check one-time migration first
  const migrated = handleLegacyCartMigration(user);
  if (migrated) return migrated;

  const userKey = getUserStorageKey(user);
  const cartKey = `aura_cart_${userKey}`;
  const couponKey = `aura_coupon_${userKey}`;

  // If this user is Deshan, check if we need to restore from his preserved backup
  const isDeshan =
    user &&
    (user.name?.toLowerCase().includes('deshan') ||
     user.email?.toLowerCase().includes('deshan'));

  if (isDeshan) {
    const existingCart = localStorage.getItem(cartKey);
    if (!existingCart || existingCart === '[]') {
      const backupCartStr = localStorage.getItem('aura_cart_deshan_backup');
      if (backupCartStr) {
        try {
          const backupCart = JSON.parse(backupCartStr);
          if (Array.isArray(backupCart) && backupCart.length > 0) {
            localStorage.setItem(cartKey, backupCartStr);
            const backupCouponStr = localStorage.getItem('aura_coupon_deshan_backup');
            let backupCoupon = null;
            if (backupCouponStr) {
              localStorage.setItem(couponKey, backupCouponStr);
              backupCoupon = JSON.parse(backupCouponStr);
            }
            return { cart: backupCart, coupon: backupCoupon };
          }
        } catch (e) {
          console.error('Failed to restore Deshan cart backup', e);
        }
      }
    }
  }

  try {
    const savedCart = localStorage.getItem(cartKey);
    const savedCoupon = localStorage.getItem(couponKey);

    return {
      cart: savedCart ? JSON.parse(savedCart) : [],
      coupon: savedCoupon ? JSON.parse(savedCoupon) : null,
    };
  } catch (e) {
    console.error(`Failed to load cart for key [${userKey}]`, e);
    return { cart: [], coupon: null };
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Tracks the user key whose cart is currently loaded in memory
  const activeUserKeyRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);

  // Synchronize cart state whenever the active user changes (Login / Logout / Switch account)
  useEffect(() => {
    // If auth is in initial load, check if cached user is already in localStorage to avoid brief flash
    if (isAuthLoading && !isInitializedRef.current) {
      if (typeof window !== 'undefined') {
        const cachedUserStr = localStorage.getItem('jewellery_user');
        if (cachedUserStr) {
          try {
            const cachedUser = JSON.parse(cachedUserStr);
            const cachedKey = getUserStorageKey(cachedUser);
            activeUserKeyRef.current = cachedKey;
            const data = loadScopedCart(cachedUser);
            setCart(data.cart);
            setAppliedCoupon(data.coupon);
            setIsLoaded(true);
            isInitializedRef.current = true;
            return;
          } catch {
            // fallback to guest below
          }
        }
      }
      return;
    }

    const nextUserKey = getUserStorageKey(user);

    // Only re-hydrate cart if the user account actually switched
    if (activeUserKeyRef.current !== nextUserKey || !isInitializedRef.current) {
      // 1. If switching from an existing active user, flush their cart to storage first
      if (activeUserKeyRef.current && isLoaded) {
        try {
          const prevCartKey = `aura_cart_${activeUserKeyRef.current}`;
          const prevCouponKey = `aura_coupon_${activeUserKeyRef.current}`;
          localStorage.setItem(prevCartKey, JSON.stringify(cart));
          if (appliedCoupon) {
            localStorage.setItem(prevCouponKey, JSON.stringify(appliedCoupon));
          } else {
            localStorage.removeItem(prevCouponKey);
          }
        } catch (e) {
          console.error('Failed to flush previous user cart', e);
        }
      }

      // 2. Set new active user key
      activeUserKeyRef.current = nextUserKey;

      // 3. Load the new user's isolated cart
      const data = loadScopedCart(user);
      setCart(data.cart);
      setAppliedCoupon(data.coupon);
      setIsLoaded(true);
      isInitializedRef.current = true;
    }
  }, [user, isAuthLoading]);

  // Save active user's cart to their scoped storage key whenever cart or coupon state changes
  useEffect(() => {
    if (!isLoaded || !activeUserKeyRef.current) return;

    try {
      const cartKey = `aura_cart_${activeUserKeyRef.current}`;
      const couponKey = `aura_coupon_${activeUserKeyRef.current}`;

      localStorage.setItem(cartKey, JSON.stringify(cart));
      if (appliedCoupon) {
        localStorage.setItem(couponKey, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(couponKey);
      }
    } catch (e) {
      console.error('Failed to save scoped cart', e);
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
    if (activeUserKeyRef.current) {
      try {
        localStorage.setItem(`aura_cart_${activeUserKeyRef.current}`, '[]');
        localStorage.removeItem(`aura_coupon_${activeUserKeyRef.current}`);
      } catch (e) {
        console.error('Failed to clear cart storage', e);
      }
    }
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
    if (activeUserKeyRef.current) {
      try {
        localStorage.removeItem(`aura_coupon_${activeUserKeyRef.current}`);
      } catch (e) {}
    }
  };

  // Pre-fills cart contents into WhatsApp message & auto-logs lead in backend admin desk
  const generateWhatsAppCartLink = async (customerName?: string, customerPhone?: string): Promise<string> => {
    const lines = [
      `💎 *Zeyloraa — Order Consultation*`,
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
      `Please confirm stone availability and worldwide payment options. Thank you!`,
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
          customerName: customerName || (user?.name ? user.name : 'Worldwide Client'),
          phoneNumber: customerPhone || user?.phoneNumber || 'WhatsApp Direct Lead',
          email: user?.email,
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
