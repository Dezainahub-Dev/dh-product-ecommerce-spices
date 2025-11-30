'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { validators } from '@/lib/validators';
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, AlertCircleIcon, UserIcon } from '@/components/icons';
import { Footer } from '@/components/footer';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    let error: string | null = null;
    if (field === 'email') {
      error = validators.email(formData.email);
    } else if (field === 'password') {
      error = validators.password(formData.password);
    } else if (field === 'firstName') {
      error = validators.firstName(formData.firstName);
    } else if (field === 'lastName') {
      error = validators.lastName(formData.lastName);
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error || '',
    }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      let error: string | null = null;
      if (field === 'email') {
        error = validators.email(value);
      } else if (field === 'password') {
        error = validators.password(value);
      } else if (field === 'firstName') {
        error = validators.firstName(value);
      } else if (field === 'lastName') {
        error = validators.lastName(value);
      }

      setErrors((prev) => ({
        ...prev,
        [field]: error || '',
      }));
    }
  };

  const validateAllFields = (): boolean => {
    const newErrors: Record<string, string> = {};
    const firstNameError = validators.firstName(formData.firstName);
    const lastNameError = validators.lastName(formData.lastName);
    const emailError = validators.email(formData.email);
    const passwordError = validators.password(formData.password);

    if (firstNameError) newErrors.firstName = firstNameError;
    if (lastNameError) newErrors.lastName = lastNameError;
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    setTouched({ firstName: true, lastName: true, email: true, password: true });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateAllFields()) {
      setSubmitError('Please fix all errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      await register(formData.email, formData.password, formData.firstName, formData.lastName);
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    } catch (error: any) {
      setSubmitError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-[1240px] items-center gap-16 px-6 py-16 lg:grid-cols-2">
        <div className="max-w-md">
          <div className="mb-2 inline-block rounded-full bg-[--color-bg-secondary] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[--color-primary]">
            Join Us Today
          </div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Create Your{' '}
            <span className="text-[--color-primary]">Account</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[--color-text-muted]">
            Start your journey with us and unlock exclusive benefits. Already have an account?{' '}
            <Link href="/login" className="font-semibold text-[--color-primary] hover:underline">
              Sign in here
            </Link>
          </p>

          <ul className="mt-8 space-y-3 text-sm font-medium text-[--color-text-muted]">
            {[
              'Free shipping on orders over ₹999',
              'Early access to new products',
              '10% off your first purchase',
              'Birthday month special offers',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[--color-primary]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full max-w-md justify-self-center lg:justify-self-end">
          <div className="rounded-3xl border border-[--color-border-primary] bg-background p-8 shadow-[0_10px_40px_rgba(77,156,44,0.08)]">
            <h2 className="text-2xl font-semibold text-[--color-primary-dark]">Sign Up</h2>
            <p className="mt-2 text-sm text-[--color-text-muted]">
              Create your account to get started
            </p>

            {submitError && (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-[--color-accent-red] bg-[--color-accent-red-bg] p-4 text-sm text-[--color-accent-red]">
                <AlertCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
                <p>{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[--color-primary-lighter]">
                      <UserIcon className="h-4 w-4" />
                      <span>First Name</span>
                    </div>
                    <div className="mt-3">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        onBlur={() => handleBlur('firstName')}
                        className={`w-full rounded-xl border bg-background px-4 py-3 text-base font-medium text-[--color-primary-dark] outline-none transition focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/20 ${
                          touched.firstName && errors.firstName
                            ? 'border-[--color-accent-red]'
                            : 'border-[--color-border-primary]'
                        }`}
                        placeholder="John"
                        autoComplete="given-name"
                      />
                    </div>
                  </label>
                  {touched.firstName && errors.firstName && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-[--color-accent-red]">
                      <AlertCircleIcon className="h-4 w-4 shrink-0" />
                      <span>{errors.firstName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[--color-primary-lighter]">
                      <UserIcon className="h-4 w-4" />
                      <span>Last Name</span>
                    </div>
                    <div className="mt-3">
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        onBlur={() => handleBlur('lastName')}
                        className={`w-full rounded-xl border bg-background px-4 py-3 text-base font-medium text-[--color-primary-dark] outline-none transition focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/20 ${
                          touched.lastName && errors.lastName
                            ? 'border-[--color-accent-red]'
                            : 'border-[--color-border-primary]'
                        }`}
                        placeholder="Doe"
                        autoComplete="family-name"
                      />
                    </div>
                  </label>
                  {touched.lastName && errors.lastName && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-[--color-accent-red]">
                      <AlertCircleIcon className="h-4 w-4 shrink-0" />
                      <span>{errors.lastName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[--color-primary-lighter]">
                    <MailIcon className="h-4 w-4" />
                    <span>Email Address</span>
                  </div>
                  <div className="mt-3">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      className={`w-full rounded-xl border bg-background px-4 py-3 text-base font-medium text-[--color-primary-dark] outline-none transition focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/20 ${
                        touched.email && errors.email
                          ? 'border-[--color-accent-red]'
                          : 'border-[--color-border-primary]'
                      }`}
                      placeholder="your.email@example.com"
                      autoComplete="email"
                    />
                  </div>
                </label>
                {touched.email && errors.email && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-[--color-accent-red]">
                    <AlertCircleIcon className="h-4 w-4 shrink-0" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[--color-primary-lighter]">
                    <LockIcon className="h-4 w-4" />
                    <span>Password</span>
                  </div>
                  <div className="relative mt-3">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      onBlur={() => handleBlur('password')}
                      className={`w-full rounded-xl border bg-background px-4 py-3 pr-12 text-base font-medium text-[--color-primary-dark] outline-none transition focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/20 ${
                        touched.password && errors.password
                          ? 'border-[--color-accent-red]'
                          : 'border-[--color-border-primary]'
                      }`}
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[--color-text-muted] transition hover:text-[--color-primary-dark]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </label>
                {touched.password && errors.password && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-[--color-accent-red]">
                    <AlertCircleIcon className="h-4 w-4 shrink-0" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[--color-primary] px-8 py-3.5 text-base font-semibold uppercase tracking-wide text-white shadow-[0_18px_45px_rgba(77,156,44,0.35)] transition hover:bg-[--color-primary-dark] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>

              <p className="text-center text-xs text-[--color-text-muted]">
                By signing up, you agree to our{' '}
                <Link href="/terms" className="text-[--color-primary] hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-[--color-primary] hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </form>

            <div className="mt-8 text-center text-sm text-[--color-text-muted]">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-[--color-primary] hover:underline">
                Sign in
              </Link>
            </div>

            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[--color-border-primary]"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-[--color-text-muted] tracking-[0.2em]">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { name: 'Google', href: '/api/customer/auth/google' },
                { name: 'Microsoft', href: '/api/customer/auth/microsoft' },
                { name: 'Facebook', href: '/api/customer/auth/facebook' },
              ].map((provider) => (
                <a
                  key={provider.name}
                  href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${provider.href}`}
                  className="flex items-center justify-center rounded-xl border border-[--color-border-primary] bg-background px-4 py-3 text-sm font-semibold text-[--color-primary-dark] transition hover:border-[--color-primary] hover:bg-[--color-bg-secondary]"
                >
                  {provider.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <main className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </main>
    }>
      <SignupForm />
    </Suspense>
  );
}
