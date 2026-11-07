'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Gem,
} from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin';

  const { isAuthenticated, adminUser, loginAdmin, updateAdminPassword } = useAdminAuth();

  // If already authenticated and doesn't need password change, forward to dashboard
  useEffect(() => {
    if (isAuthenticated && !adminUser?.needsPasswordChange) {
      router.replace(redirectPath);
    }
  }, [isAuthenticated, adminUser, redirectPath, router]);

  // View state: 'login' | '2fa' | 'first-password' | 'forgot'
  const [viewState, setViewState] = useState<'login' | '2fa' | 'first-password' | 'forgot'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorOtp, setTwoFactorOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'verify'>('request');

  // UI status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. Submit Primary Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both administrator email and password.');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMessage(json.message || 'Invalid administrator credentials.');
        setLoading(false);
        return;
      }

      // Check if 2FA is required
      if (json.data?.twoFactorRequired) {
        setViewState('2fa');
        setSuccessMessage('A 6-digit authentication code has been dispatched to your email.');
        setLoading(false);
        return;
      }

      // Complete login
      const { token, user, needsPasswordChange } = json.data;
      loginAdmin(token, user);

      if (needsPasswordChange) {
        setViewState('first-password');
        setSuccessMessage('First login detected: You must set a new secure password.');
      } else {
        router.push(redirectPath);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not connect to authentication gateway.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit 2FA Verification Code
  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!twoFactorOtp.trim() || twoFactorOtp.trim().length < 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          otp: twoFactorOtp.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMessage(json.message || 'Invalid or expired verification code.');
        setLoading(false);
        return;
      }

      const { token, user, needsPasswordChange } = json.data;
      loginAdmin(token, user);

      if (needsPasswordChange) {
        setViewState('first-password');
        setSuccessMessage('Verification confirmed. Please update your initial password.');
      } else {
        router.push(redirectPath);
      }
    } catch (err: any) {
      setErrorMessage(err.message || '2FA verification gateway failed.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Submit Mandatory First-Login Password Change
  const handleFirstPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!newPassword || newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    const result = await updateAdminPassword(newPassword);
    setLoading(false);

    if (result.success) {
      setSuccessMessage('Password changed successfully! Redirecting to dashboard...');
      setTimeout(() => {
        router.push(redirectPath);
      }, 1200);
    } else {
      setErrorMessage(result.message);
    }
  };

  // 4. Handle Forgot Password Flow
  const handleForgotRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!forgotEmail.trim()) {
      setErrorMessage('Please enter your administrator email.');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setForgotStep('verify');
        setSuccessMessage('Password reset verification code has been dispatched to your email.');
      } else {
        setErrorMessage(json.message || 'Could not locate administrator account.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!forgotOtp.trim() || !newPassword) {
      setErrorMessage('Please provide the 6-digit code and your new password.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          otp: forgotOtp.trim(),
          newPassword,
        }),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setSuccessMessage('Password reset successful! Please log in with your new password.');
        setTimeout(() => {
          setViewState('login');
          setForgotStep('request');
          setNewPassword('');
          setConfirmPassword('');
          setPassword('');
        }, 1500);
      } else {
        setErrorMessage(json.message || 'Failed to reset password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0D12] text-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden select-none">
      {/* Subtle luxury ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-amber-500/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* ========================================================= */}
      {/* SIDE-BY-SIDE CARD CONTAINER                               */}
      {/* ========================================================= */}
      <div className="w-full max-w-4xl bg-[#13141C] border border-white/10 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 backdrop-blur-xl relative z-10">
        
        {/* ======================================================= */}
        {/* LEFT SIDE: Haute Joaillerie Image Showcase (necklace.jpg)*/}
        {/* ======================================================= */}
        <div className="relative md:col-span-5 hidden md:block overflow-hidden bg-neutral-900 min-h-[560px]">
          <img
            src="/img/necklace.jpg"
            alt="Zeyloraa Fine Ceylon Sapphire Necklace"
            className="w-full h-full object-cover object-center scale-[1.03] filter contrast-[1.08] brightness-[0.92]"
          />
          {/* Dark luxury gradient overlays for depth and contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#13141C]/80" />

          {/* Top Left Atelier Pill */}
          <div className="absolute top-6 left-6 z-10">
            
          </div>

          
        </div>

        {/* ======================================================= */}
        {/* RIGHT SIDE: Authentication Form & Controls              */}
        {/* ======================================================= */}
        <div className="md:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          
          {/* Header Block inside the Right Card */}
          <div className="mb-6 space-y-1.5">
            
            <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-wide">
              Executive Admin Portal
            </h1>
            <p className="text-xs text-neutral-400 font-light">
              Authorized personnel only. Sessions are encrypted and subject to continuous security audit.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* VIEW 1: STANDARD ADMIN LOGIN */}
          {viewState === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@zeyloraa.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-neutral-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setViewState('forgot');
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className="text-[11px] text-amber-400/90 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-white hover:bg-neutral-100 text-black font-semibold text-xs tracking-wide transition-all shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Authenticating Credentials...</span>
                ) : (
                  <>
                    <span>Sign In to Admin Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* VIEW 2: TWO-FACTOR AUTHENTICATION (2FA OTP) */}
          {viewState === '2fa' && (
            <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
              <div className="text-center pb-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6" />
                </div>
                <h2 className="text-sm font-semibold text-white">
                  Two-Factor Security Verification
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Enter the 6-digit code sent to <strong className="text-neutral-200">{email}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5 text-center">
                  6-Digit Security Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={twoFactorOtp}
                  onChange={(e) => setTwoFactorOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.4em] py-3 bg-black/50 border border-white/20 rounded-xl text-base text-white font-mono focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <span>Verifying Code...</span> : <span>Confirm & Access Portal</span>}
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewState('login');
                  setTwoFactorOtp('');
                  setErrorMessage(null);
                }}
                className="w-full text-center text-xs text-neutral-400 hover:text-neutral-200 transition-colors pt-1 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to standard login</span>
              </button>
            </form>
          )}

          {/* VIEW 3: MANDATORY FIRST-LOGIN PASSWORD CHANGE */}
          {viewState === 'first-password' && (
            <form onSubmit={handleFirstPasswordSubmit} className="space-y-4">
              <div className="text-center pb-2">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-sm font-semibold text-white">
                  Set Your Personal Super Admin Password
                </h2>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  As part of initial provisioning, you must update your temporary seeded password before accessing the administrative desk.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  New Password (Minimum 8 Characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-3 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition-all font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-white hover:bg-neutral-100 text-black font-semibold text-xs transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <span>Updating Password...</span> : <span>Save & Continue to Portal</span>}
              </button>
            </form>
          )}

          {/* VIEW 4: FORGOT PASSWORD */}
          {viewState === 'forgot' && (
            <div>
              <div className="text-center pb-3">
                <h2 className="text-sm font-semibold text-white">
                  Admin Password Recovery
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  {forgotStep === 'request'
                    ? 'Enter your verified administrator email to receive a recovery code.'
                    : 'Enter the code and set your new password.'}
                </p>
              </div>

              {forgotStep === 'request' ? (
                <form onSubmit={handleForgotRequestOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Administrator Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="admin@zeyloraa.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-white hover:bg-neutral-100 text-black font-semibold text-xs transition-all shadow-xl disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Sending Code...' : 'Send Recovery Code'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgotResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="123456"
                      className="w-full text-center tracking-[0.3em] py-2.5 bg-black/50 border border-white/20 rounded-xl text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs transition-all shadow-xl disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Resetting Password...' : 'Reset Password & Continue'}
                  </button>
                </form>
              )}

              <button
                type="button"
                onClick={() => {
                  setViewState('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="w-full text-center text-xs text-neutral-400 hover:text-neutral-200 transition-colors pt-3 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Admin Login</span>
              </button>
            </div>
          )}

          
        </div>

      </div>

      {/* Return to Public Boutique */}
      <div className="mt-6 text-center relative z-10">
        <Link
          href="/"
          className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors inline-flex items-center gap-1.5"
        >
          <span>← Return to Zeyloraa Customer Storefront</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-neutral-400 text-xs font-mono">Loading Atelier Security...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
