'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth, UserProfile } from './AuthContext';

export interface WishlistItem {
  _id: string;
  title: string;
  slug?: string;
  price: number;
  discountPrice?: number;
  image: string;
  categoryName?: string;
  metal?: string;
  gemstone?: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: WishlistItem) => Promise<void>;
  addToWishlist: (product: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function getWishlistStorageKey(user: UserProfile | null): string {
  if (!user) return 'guest';
  const rawId = user._id || user.id || user.email || 'guest';
  return String(rawId).toLowerCase().replace(/[^a-z0-9_@.-]/g, '_');
}

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const activeUserKeyRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);

  // Sync wishlist whenever user changes or logs in/out
  useEffect(() => {
    if (isAuthLoading && !isInitializedRef.current) {
      if (typeof window !== 'undefined') {
        const cachedUserStr = localStorage.getItem('jewellery_user');
        if (cachedUserStr) {
          try {
            const cachedUser = JSON.parse(cachedUserStr);
            const cachedKey = getWishlistStorageKey(cachedUser);
            activeUserKeyRef.current = cachedKey;
            const saved = localStorage.getItem(`jewellery_wishlist_${cachedKey}`);
            if (saved) {
              setWishlist(JSON.parse(saved));
            }
            setIsLoaded(true);
            isInitializedRef.current = true;
            return;
          } catch {}
        }
      }
      return;
    }

    const nextUserKey = getWishlistStorageKey(user);

    if (activeUserKeyRef.current !== nextUserKey || !isInitializedRef.current) {
      // Flush previous user wishlist to storage
      if (activeUserKeyRef.current && isLoaded) {
        try {
          localStorage.setItem(`jewellery_wishlist_${activeUserKeyRef.current}`, JSON.stringify(wishlist));
        } catch (e) {}
      }

      activeUserKeyRef.current = nextUserKey;

      // Load new user's wishlist
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem(`jewellery_wishlist_${nextUserKey}`);
          setWishlist(saved ? JSON.parse(saved) : []);
        } catch {
          setWishlist([]);
        }
      }

      setIsLoaded(true);
      isInitializedRef.current = true;

      // If user is authenticated, sync from backend
      if (token) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        fetch(`${apiUrl}/user/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && Array.isArray(data.data)) {
              const formatted: WishlistItem[] = data.data.map((p: any) => ({
                _id: p._id,
                title: p.name || p.title,
                slug: p.slug,
                price: p.price,
                discountPrice: p.discountPrice,
                image: p.images?.[0]?.url || p.image || '/img/placeholder.jpg',
                categoryName: p.category,
                metal: p.metal?.type,
                gemstone: p.gemstone?.type,
              }));
              setWishlist(formatted);
              localStorage.setItem(`jewellery_wishlist_${nextUserKey}`, JSON.stringify(formatted));
            }
          })
          .catch(() => {});
      }
    }
  }, [user, token, isAuthLoading]);

  // Save to user-scoped storage key whenever wishlist state changes
  useEffect(() => {
    if (!isLoaded || !activeUserKeyRef.current) return;
    try {
      localStorage.setItem(`jewellery_wishlist_${activeUserKeyRef.current}`, JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist, isLoaded]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some((item) => item._id === productId);
  }, [wishlist]);

  const toggleWishlist = useCallback(async (product: WishlistItem) => {
    const exists = wishlist.some((item) => item._id === product._id);
    let updated: WishlistItem[];

    if (exists) {
      updated = wishlist.filter((item) => item._id !== product._id);
    } else {
      updated = [product, ...wishlist];
    }

    setWishlist(updated);

    // Sync to backend if authenticated
    if (token) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        await fetch(`${apiUrl}/user/wishlist/toggle`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product._id }),
        });
      } catch (e) {
        console.warn('Backend wishlist sync fallback to local');
      }
    }
  }, [wishlist, token]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    const updated = wishlist.filter((item) => item._id !== productId);
    setWishlist(updated);

    if (token) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        await fetch(`${apiUrl}/user/wishlist/toggle`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        });
      } catch (e) {}
    }
  }, [wishlist, token]);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    if (activeUserKeyRef.current) {
      try {
        localStorage.setItem(`jewellery_wishlist_${activeUserKeyRef.current}`, '[]');
      } catch (e) {}
    }
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        addToWishlist: toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
