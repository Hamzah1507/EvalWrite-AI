'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, User, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function SignupFormContent() {
  const router = useRouter();
  const { signup, user, isAuthenticated } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to home
  React.useEffect(() => {
    if (isAuthenticated && user) {
      router.replace('/');
    }
  }, [isAuthenticated, user, router]);

  const passwordValidation = {
    hasMinLength: password.length >= 8,
    hasLetter: /[A-Za-z]/.test(password),
    hasNumber: /\d/.test(password),
    matchesConfirm: password.length > 0 && password === confirmPassword,
  };

  const isPasswordValid =
    passwordValidation.hasMinLength &&
    passwordValidation.hasLetter &&
    passwordValidation.hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      setError('Please provide your full legal or institutional name (at least 2 characters).');
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please provide a valid institutional email address.');
      return;
    }

    if (!isPasswordValid) {
      setError('Password must be at least 8 characters long and contain both letters and numbers.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter both password fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(trimmedName, trimmedEmail, password);
      router.push('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration could not be completed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#F7F7F2] text-[#26332F] overflow-hidden">
      {/* Subtle organic decorative background blurs */}
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
            <h2 className="text-lg font-semibold text-[#26332F]">Create an evaluator account</h2>
            <p className="text-xs text-[#68756F] mt-1">
              Join institutional evaluators scoring descriptive student answers
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
                htmlFor="fullName"
                className="block text-xs font-semibold text-[#26332F] mb-1.5"
              >
                Full Name & Academic Title
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#68756F]" />
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dr. Eleanor Vance"
                  className="w-full h-10 pl-9 pr-3 text-xs bg-[#FFFFFF] border border-[#E4E7E1] rounded-xl text-[#26332F] placeholder-[#68756F]/60 focus:outline-none focus:ring-2 focus:ring-[#527C70]/20 focus:border-[#527C70] transition-colors"
                />
              </div>
            </div>

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
                  placeholder="e.vance@university.edu"
                  className="w-full h-10 pl-9 pr-3 text-xs bg-[#FFFFFF] border border-[#E4E7E1] rounded-xl text-[#26332F] placeholder-[#68756F]/60 focus:outline-none focus:ring-2 focus:ring-[#527C70]/20 focus:border-[#527C70] transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-[#26332F] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#68756F]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-[#26332F] mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#68756F]" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full h-10 pl-9 pr-10 text-xs bg-[#FFFFFF] border border-[#E4E7E1] rounded-xl text-[#26332F] placeholder-[#68756F]/60 focus:outline-none focus:ring-2 focus:ring-[#527C70]/20 focus:border-[#527C70] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#68756F] hover:text-[#26332F] focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Validation checklist */}
            <div className="p-3 rounded-xl bg-[#F7F7F2] border border-[#E4E7E1] text-[11px] space-y-1 text-[#68756F]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    passwordValidation.hasMinLength ? 'text-[#48735B]' : 'text-[#68756F]/40'
                  }`}
                />
                <span>Minimum 8 characters</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    passwordValidation.hasLetter && passwordValidation.hasNumber
                      ? 'text-[#48735B]'
                      : 'text-[#68756F]/40'
                  }`}
                />
                <span>Contains letters and numbers</span>
              </div>
              {confirmPassword.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      passwordValidation.matchesConfirm ? 'text-[#48735B]' : 'text-[#A84B46]'
                    }`}
                  />
                  <span>Passwords match</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#527C70] hover:bg-[#3F655A] active:scale-[0.99] text-white text-xs font-semibold shadow-xs disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center text-xs text-[#68756F]">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-[#527C70] hover:text-[#3F655A] underline underline-offset-2 transition-colors"
            >
              Sign in here
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

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F7F7F2]">
          <div className="w-6 h-6 border-2 border-[#527C70] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignupFormContent />
    </Suspense>
  );
}
