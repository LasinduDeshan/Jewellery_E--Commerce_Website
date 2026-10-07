'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SavedAddress {
  _id: string;
  label: string;
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  isDefault: boolean;
}

export interface UserProfile {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  phoneNumber?: string;
  preferredCurrency?: 'AUD' | 'USD';
  savedAddresses?: SavedAddress[];
  wishlist?: any[];
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, userData: UserProfile) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<UserProfile>) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('jewellery_token') : null;
    if (!savedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setUser(data.data);
          setToken(savedToken);
        }
      } else {
        // Invalid token
        localStorage.removeItem('jewellery_token');
        setUser(null);
        setToken(null);
      }
    } catch (e) {
      console.warn('Backend unavailable, checking cached user profile');
      const cached = localStorage.getItem('jewellery_user');
      if (cached) {
        try {
          setUser(JSON.parse(cached));
          setToken(savedToken);
        } catch (err) {
          // ignore
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = (newToken: string, userData: UserProfile) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('jewellery_token', newToken);
    localStorage.setItem('jewellery_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jewellery_token');
    localStorage.removeItem('jewellery_user');
  };

  const updateUser = (updatedData: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedData };
      localStorage.setItem('jewellery_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        updateUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
