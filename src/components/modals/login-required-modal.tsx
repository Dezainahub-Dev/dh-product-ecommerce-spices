'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type LoginRequiredModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
};

export function LoginRequiredModal({ isOpen, onClose, message = "Please login to add items to your cart" }: LoginRequiredModalProps) {
  const router = useRouter();

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginClick = () => {
    onClose();
    router.push('/login');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative mx-4 w-full max-w-md rounded-3xl border border-[var(--color-border-primary)] bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-zinc-400 transition hover:text-zinc-600"
          aria-label="Close"
        >
          ×
        </button>

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-secondary)]">
            <svg
              className="h-8 w-8 text-[var(--color-primary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--color-text-dark)]">
            Login Required
          </h2>
          <p className="mt-3 text-base text-zinc-600">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={handleLoginClick}
            className="w-full rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_15px_35px_rgba(103,39,27,0.25)] transition hover:bg-[var(--color-primary-darker)]"
          >
            Login Now
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-full border border-[var(--color-border-primary)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-text-dark)] transition hover:bg-[var(--color-bg-secondary)]"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
