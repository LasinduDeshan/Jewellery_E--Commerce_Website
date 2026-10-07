'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { Gem, Lock, Mail, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        login(data.data.token, data.data.user);
        router.push('/account');
      } else {
        setErrorMessage(data.message || 'Invalid email or password');
      }
    } catch (err: any) {
      // Local demo fallback if backend is offline
      const mockUser = {
        id: 'demo_user_1',
        name: 'Lady Genevieve',
        email: email || 'genevieve@ceylonjewels.com',
        role: 'customer' as const,
        phoneNumber: '+61 412 345 678',
        preferredCurrency: 'AUD' as const,
        savedAddresses: [
          {
            _id: 'addr_1',
            label: 'Sydney Residence',
            fullName: 'Lady Genevieve',
            street: '42 Collins Avenue',
            apartment: 'Penthouse 4B',
            city: 'Sydney',
            state: 'NSW',
            postalCode: '2000',
            country: 'Australia',
            phoneNumber: '+61 412 345 678',
            isDefault: true,
          },
        ],
      };
      login('mock_jwt_token_demo', mockUser);
      router.push('/account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoCustomerLogin = () => {
    setEmail('genevieve@ceylonjewels.com');
    setPassword('jewels2026');
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-stone-200 shadow-xl relative overflow-hidden">
          {/* Subtle Top Gold Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Gem className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold tracking-widest text-amber-700 uppercase">
              Bespoke Client Portal
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-serif text-stone-900 font-normal">
              Sign In to Your Account
            </h2>
            <p className="mt-2 text-xs text-stone-500">
              Track your Ceylon sapphire orders, manage your wishlist, and review custom quotes.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google Sign In Preview */}
          <button
            type="button"
            onClick={handleDemoCustomerLogin}
            className="w-full py-2.5 px-4 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-stone-400">
              Or with email
            </span>
            <div className="border-t border-stone-200 w-full" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Password
                </label>
                <a href="#forgot" className="text-[11px] text-amber-700 hover:text-amber-800">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center text-xs text-stone-500 pt-2">
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="text-amber-700 font-semibold hover:underline">
              Create Client Account
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
