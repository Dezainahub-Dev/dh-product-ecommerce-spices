'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import { validators } from '@/lib/validators';
import { MailIcon, AlertCircleIcon } from '@/components/icons';
import { Footer } from '@/components/footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBlur = () => {
    setTouched(true);
    const validationError = validators.email(email);
    setError(validationError || '');
  };

  const handleChange = (value: string) => {
    setEmail(value);
    if (touched) {
      const validationError = validators.email(value);
      setError(validationError || '');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationError = validators.email(email);
    if (validationError) {
      setError(validationError);
      setTouched(true);
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-white">
        <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[600px] items-center px-6 py-16">
          <div className="w-full rounded-3xl border border-border-primary bg-white p-8 text-center shadow-[0_10px_40px_rgba(77,156,44,0.08)]">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-bg-secondary">
              <MailIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-primary-dark">Check Your Email</h1>
            <p className="mt-4 text-zinc-500">
              If an account exists with <strong>{email}</strong>, a password reset link has been
              sent.
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/login"
                className="rounded-xl bg-primary px-8 py-3 text-base font-semibold text-white shadow-[0_10px_25px_rgba(77,156,44,0.25)] transition hover:bg-primary-dark"
              >
                Back to Login
              </Link>
              <button
                onClick={() => setSuccess(false)}
                className="text-sm font-semibold text-primary hover:underline"
              >
                Try a different email
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-[1240px] items-center gap-16 px-6 py-16 lg:grid-cols-2">
        <div className="max-w-md">
          <div className="mb-2 inline-block rounded-full bg-bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Password Recovery
          </div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-zinc-900 sm:text-5xl">
            Forgot Your{' '}
            <span className="text-primary">Password?</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-zinc-500">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>

          <ul className="mt-8 space-y-3 text-sm font-medium text-zinc-600">
            {[
              'Quick and secure password reset',
              'Link valid for 1 hour',
              'No password change without your email',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full max-w-md justify-self-center lg:justify-self-end">
          <div className="rounded-3xl border border-border-primary bg-white p-8 shadow-[0_10px_40px_rgba(77,156,44,0.08)]">
            <h2 className="text-2xl font-semibold text-primary-dark">Reset Password</h2>
            <p className="mt-2 text-sm text-zinc-500">
              We'll send you a reset link to your email
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-lighter">
                    <MailIcon className="h-4 w-4" />
                    <span>Email Address</span>
                  </div>
                  <div className="mt-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleChange(e.target.value)}
                      onBlur={handleBlur}
                      className={`w-full rounded-xl border bg-white px-4 py-3 text-base font-medium text-primary-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                        touched && error ? 'border-accent-red' : 'border-border-primary'
                      }`}
                      placeholder="your.email@example.com"
                      autoComplete="email"
                    />
                  </div>
                </label>
                {touched && error && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-accent-red">
                    <AlertCircleIcon className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-primary px-8 py-3.5 text-base font-semibold uppercase tracking-wide text-white shadow-[0_18px_45px_rgba(77,156,44,0.35)] transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link href="/login" className="text-sm font-semibold text-primary hover:underline">
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
