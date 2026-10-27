'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ShieldAlert, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, demoStatus, user, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoFilled, setDemoFilled] = useState(false);

  // If already authenticated, redirect to home or destination
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const rawNext = searchParams.get('next');
      const safeNext = rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/';
      router.replace(safeNext);
    }
  }, [isAuthenticated, user, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your institutional email address.');
      return;
    }
    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(trimmedEmail, password);
      const rawNext = searchParams.get('next');
      const safeNext = rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/';
      router.push(safeNext);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected authentication error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutofillDemo = () => {
    if (demoStatus?.demo_email && demoStatus?.demo_password_hint) {
      setEmail(demoStatus.demo_email);
      setPassword(demoStatus.demo_password_hint);
      setError(null);
      setDemoFilled(true);
      setTimeout(() => setDemoFilled(false), 3000);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#F7F7F2] text-[#26332F] overflow-hidden">
      {/* Subtle organic decorative background blurs (sage / ivory tone, no neon/purple) */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#E8EDE9] blur-3xl pointer-events-none opacity-70"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#E2EBE6] blur-3xl pointer-events-none opacity-60"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Wordmark Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#527C70] text-white flex items-center justify-center shadow-xs mb-3">
            <span className="font-serif font-bold text-xl tracking-tight">EW</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#26332F]">
            EvalWrite <span className="text-[#527C70] font-semibold">AI</span>
          </h1>
          <p className="text-xs text-[#68756F] mt-1 font-medium">
            Descriptive Answer Evaluation & Assessment Platform
          </p>
        </div>

        {/* Translucent Frosted Glass Card */}
        <div className="bg-white/90 backdrop-blur-md border border-[#E4E7E1] rounded-2xl shadow-sm p-7 sm:p-8 transition-all">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-[#26332F]">Sign in to your account</h2>
            <p className="text-xs text-[#68756F] mt-1">
              Enter your credentials to access the evaluation workspace
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              role="alert"
              className="mb-5 p-3 rounded-xl bg-[#FBF0EF] border border-[#F2D2D0] flex items-start gap-2.5 text-xs text-[#A84B46]"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#A84B46]" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-[#26332F] mb-1.5"
              >
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#68756F]" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="evaluator@university.edu"
                  className="w-full h-10 pl-9 pr-3 text-xs bg-[#FFFFFF] border border-[#E4E7E1] rounded-xl text-[#26332F] placeholder-[#68756F]/60 focus:outline-none focus:ring-2 focus:ring-[#527C70]/20 focus:border-[#527C70] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-[#26332F]"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#68756F]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-10 pl-9 pr-10 text-xs bg-[#FFFFFF] border border-[#E4E7E1] rounded-xl text-[#26332F] placeholder-[#68756F]/60 focus:outline-none focus:ring-2 focus:ring-[#527C70]/20 focus:border-[#527C70] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#68756F] hover:text-[#26332F] focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#527C70] hover:bg-[#3F655A] active:scale-[0.99] text-white text-xs font-semibold shadow-xs disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Demo Account Helper Card (Displayed ONLY when seeded in local dev environment) */}
          {demoStatus?.is_seeded && (
            <div className="mt-6 pt-5 border-t border-[#E4E7E1]">
              <div className="p-3.5 rounded-xl bg-[#EEF3F0] border border-[#D5DFDA] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#3F655A] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#527C70]" />
                    Development Demo Account
                  </span>
                  <span className="text-[10px] font-mono text-[#68756F]">Local Dev</span>
                </div>

                <div className="text-[11px] text-[#26332F] space-y-0.5 font-mono">
                  <div>
                    <span className="text-[#68756F]">Email: </span>
                    <span className="font-semibold">{demoStatus.demo_email}</span>
                  </div>
                  <div>
                    <span className="text-[#68756F]">Password: </span>
                    <span className="font-semibold">{demoStatus.demo_password_hint}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAutofillDemo}
                  className="w-full mt-1 py-1.5 px-3 rounded-lg bg-white border border-[#D5DFDA] text-[#3F655A] hover:bg-[#E2EBE6] text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  {demoFilled ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#48735B]" />
                      <span className="text-[#48735B]">Credentials Applied</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#527C70]" />
                      <span>Autofill Demo Credentials</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Switch to Signup */}
          <div className="mt-6 text-center text-xs text-[#68756F]">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-semibold text-[#527C70] hover:text-[#3F655A] underline underline-offset-2 transition-colors"
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* Platform Footer Note */}
        <p className="mt-6 text-center text-[11px] text-[#68756F]/80">
          EvalWrite AI • Secure Session Authentication (Argon2id + HttpOnly)
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F7F7F2]">
          <div className="w-6 h-6 border-2 border-[#527C70] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
