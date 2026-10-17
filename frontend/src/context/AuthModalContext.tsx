'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthSplitCard } from '../components/auth/AuthSplitCard';

interface AuthModalContextType {
  isOpen: boolean;
  mode: 'login' | 'register' | 'forgot' | 'reset';
  openAuthModal: (mode?: 'login' | 'register' | 'forgot' | 'reset') => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');

  const openAuthModal = (initialMode: 'login' | 'register' | 'forgot' | 'reset' = 'login') => {
    setMode(initialMode);
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('auth')) {
        url.searchParams.delete('auth');
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
      }
    }
  };

  // Check if ?auth=login, ?auth=register, or ?auth=forgot is in the URL on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const authParam = params.get('auth');
      if (authParam === 'login' || authParam === 'register' || authParam === 'forgot' || authParam === 'reset') {
        openAuthModal(authParam as 'login' | 'register' | 'forgot' | 'reset');
      }
    }
  }, []);

  // Lock body scroll and close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAuthModal();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}

      {/* Global Auth Modal Popup with clearly visible, blurred home page background */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/40 backdrop-blur-md backdrop-saturate-150 animate-in fade-in duration-200 overflow-y-auto"
          onClick={(e) => {
            // Dismiss if clicking backdrop outside the card
            if (e.target === e.currentTarget) {
              closeAuthModal();
            }
          }}
        >
          <AuthSplitCard
            initialMode={mode}
            isModal={true}
            onClose={closeAuthModal}
          />
        </div>
      )}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};
