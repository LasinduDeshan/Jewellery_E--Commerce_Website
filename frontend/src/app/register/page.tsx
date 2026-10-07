'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { PhoneInput } from '../../components/ui/PhoneInput';
import { Gem, Lock, Mail, User, Phone, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phoneNumber }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        login(data.data.token, data.data.user);
        router.push('/account');
      } else {
        setErrorMessage(data.message || 'Registration failed');
      }
    } catch (err: any) {
      // Local fallback
      const mockUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        phoneNumber,
        role: 'customer' as const,
        preferredCurrency: 'AUD' as const,
        savedAddresses: [],
      };
      login('mock_jwt_token_demo', mockUser);
      router.push('/account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-stone-200 shadow-xl relative overflow-hidden">
          {/* Top Gold Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Gem className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold tracking-widest text-amber-700 uppercase">
              Join Our Atelier
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-serif text-stone-900 font-normal">
              Create Client Account
            </h2>
            <p className="mt-2 text-xs text-stone-500">
              Save bespoke pieces, track Sri Lankan courier dispatches, and receive personalized gem quotes.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Full Name <span className="text-amber-600">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Lady Genevieve"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Email Address <span className="text-amber-600">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Phone Number (Australia / International)
              </label>
              <PhoneInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                placeholder="400 000 000"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Password <span className="text-amber-600">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Confirm Password <span className="text-amber-600">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-stone-300 text-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center text-xs text-stone-500 pt-2">
            Already have an account?{' '}
            <Link href="/login" className="text-amber-700 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
