'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
  phoneNumber?: string;
  needsPasswordChange?: boolean;
  twoFactorEnabled?: boolean;
  lastLoginAt?: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  adminToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  loginAdmin: (token: string, user: AdminUser) => void;
  logoutAdmin: () => void;
  updateAdminPassword: (newPassword: string, currentPassword?: string) => Promise<{ success: boolean; message: string }>;
  toggleTwoFactor: (enabled: boolean) => Promise<{ success: boolean; message: string }>;
  refreshAdminProfile: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// 8 hours in milliseconds for automatic admin session expiration
const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const logoutAdmin = useCallback(() => {
    setAdminToken(null);
    setAdminUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aura_admin_token');
      localStorage.removeItem('aura_admin_user');
      localStorage.removeItem('aura_admin_login_time');
    }
    if (pathname && pathname.startsWith('/admin') && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  const checkSessionExpiration = useCallback(() => {
    if (typeof window === 'undefined') return;
    const loginTime = localStorage.getItem('aura_admin_login_time');
    if (loginTime) {
      const elapsed = Date.now() - parseInt(loginTime, 10);
      if (elapsed > SESSION_MAX_AGE_MS) {
        console.warn('[Admin Portal] Session expired due to max lifetime.');
        logoutAdmin();
      }
    }
  }, [logoutAdmin]);

  const refreshAdminProfile = useCallback(async () => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const savedToken = localStorage.getItem('aura_admin_token');
    const savedUserStr = localStorage.getItem('aura_admin_user');

    if (!savedToken) {
      setAdminToken(null);
      setAdminUser(null);
      setIsLoading(false);
      return;
    }

    // Check lifetime
    checkSessionExpiration();

    // Fast-restore from localStorage
    if (savedUserStr) {
      try {
        const parsed = JSON.parse(savedUserStr);
        if (parsed.role === 'admin' || parsed.role === 'super_admin') {
          setAdminUser(parsed);
          setAdminToken(savedToken);
        }
      } catch (e) {}
    }

    // Verify token with backend
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const u = json.data;
          if (u.role === 'admin' || u.role === 'super_admin') {
            const formatted: AdminUser = {
              id: u._id || u.id,
              name: u.name,
              email: u.email,
              role: u.role,
              phoneNumber: u.phoneNumber,
              needsPasswordChange: Boolean(u.needsPasswordChange),
              twoFactorEnabled: Boolean(u.twoFactorEnabled),
              lastLoginAt: u.lastLoginAt,
            };
            setAdminUser(formatted);
            setAdminToken(savedToken);
            localStorage.setItem('aura_admin_user', JSON.stringify(formatted));
          } else {
            // Not an admin role
            logoutAdmin();
          }
        }
      } else {
        logoutAdmin();
      }
    } catch {
      // Backend temporarily offline, keep cached admin state if valid
    } finally {
      setIsLoading(false);
    }
  }, [checkSessionExpiration, logoutAdmin]);

  useEffect(() => {
    refreshAdminProfile();
  }, [refreshAdminProfile]);

  // Periodic session expiration checker
  useEffect(() => {
    const interval = setInterval(() => {
      checkSessionExpiration();
    }, 60 * 1000); // check every 1 minute
    return () => clearInterval(interval);
  }, [checkSessionExpiration]);

  const loginAdmin = (newToken: string, userData: AdminUser) => {
    setAdminToken(newToken);
    setAdminUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aura_admin_token', newToken);
      localStorage.setItem('aura_admin_user', JSON.stringify(userData));
      localStorage.setItem('aura_admin_login_time', Date.now().toString());
    }
  };

  const updateAdminPassword = async (
    newPassword: string,
    currentPassword?: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!adminToken) {
      return { success: false, message: 'You must be logged in to update password.' };
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ newPassword, currentPassword }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        if (adminUser) {
          const updated = { ...adminUser, needsPasswordChange: false };
          setAdminUser(updated);
          localStorage.setItem('aura_admin_user', JSON.stringify(updated));
        }
        return { success: true, message: json.message || 'Password changed successfully.' };
      } else {
        return { success: false, message: json.message || 'Failed to update password.' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error updating password.' };
    }
  };

  const toggleTwoFactor = async (enabled: boolean): Promise<{ success: boolean; message: string }> => {
    if (!adminToken) {
      return { success: false, message: 'Authentication required' };
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/admin/toggle-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ enabled }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        if (adminUser) {
          const updated = { ...adminUser, twoFactorEnabled: enabled };
          setAdminUser(updated);
          localStorage.setItem('aura_admin_user', JSON.stringify(updated));
        }
        return { success: true, message: json.message || '2FA setting updated.' };
      } else {
        return { success: false, message: json.message || 'Failed to update 2FA.' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error updating 2FA.' };
    }
  };

  const isAuthenticated = Boolean(
    adminToken && adminUser && (adminUser.role === 'admin' || adminUser.role === 'super_admin')
  );
  const isSuperAdmin = Boolean(adminUser?.role === 'super_admin');

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        adminToken,
        isLoading,
        isAuthenticated,
        isSuperAdmin,
        loginAdmin,
        logoutAdmin,
        updateAdminPassword,
        toggleTwoFactor,
        refreshAdminProfile,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

