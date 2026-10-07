'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => void;
}

const defaultMockWishlist: WishlistItem[] = [
  {
    _id: 'mock_w1',
    title: 'Royal Ceylon Sapphire Solitaire Ring',
    slug: 'royal-ceylon-sapphire-ring',
    price: 1850,
    discountPrice: 1650,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    categoryName: 'Rings',
    metal: '18K Rose Gold',
    gemstone: 'Royal Blue Sapphire (2.2ct)',
  },
  {
    _id: 'mock_w2',
    title: 'Padparadscha Lotus Sunrise Halo Pendant',
    slug: 'padparadscha-halo-pendant',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=600&q=80',
    categoryName: 'Necklaces',
    metal: '18K Yellow Gold',
    gemstone: 'Padparadscha Sapphire (1.8ct)',
  },
];

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage or backend
  useEffect(() => {
    const saved = localStorage.getItem('jewellery_wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        setWishlist(defaultMockWishlist);
      }
    } else {
      setWishlist(defaultMockWishlist);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('jewellery_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item._id === productId);
  };

  const toggleWishlist = async (product: WishlistItem) => {
    const exists = isInWishlist(product._id);
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
  };

  const removeFromWishlist = async (productId: string) => {
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
      } catch (e) {
        // ignore
      }
    }
  };

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
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
