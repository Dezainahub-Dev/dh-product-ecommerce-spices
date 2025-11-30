'use client';

import type { Address } from './address-form-modal';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  address: Address | null;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  address,
}: DeleteConfirmationModalProps) {
  if (!isOpen || !address) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex flex-col items-center text-center">
          {/* Warning Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent-red-bg)]">
            <svg
              className="h-8 w-8 text-[var(--color-accent-red)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h2 className="mt-4 text-xl font-semibold text-[var(--color-primary-dark)]">
            Delete Address?
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Are you sure you want to delete this address?
          </p>

          {/* Address Preview */}
          <div className="mt-4 w-full rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] p-4 text-left">
            <p className="text-sm font-semibold text-[var(--color-primary-dark)]">
              {address.name}
            </p>
            <p className="mt-1 text-sm text-zinc-500">{address.phone}</p>
            <p className="mt-2 text-sm font-medium text-zinc-700">
              {address.line1}
            </p>
            {address.line2 && (
              <p className="mt-1 text-sm text-zinc-600">{address.line2}</p>
            )}
            <p className="mt-1 text-sm text-zinc-600">
              {address.city}, {address.state} {address.pincode}
            </p>
          </div>

          <p className="mt-4 text-sm text-zinc-500">
            This action cannot be undone.
          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex w-full gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-[var(--color-border-light)] px-6 py-2.5 text-sm font-semibold text-[var(--color-primary-dark)] transition hover:bg-[var(--color-bg-secondary)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 rounded-full bg-[var(--color-accent-red)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(220,38,38,0.25)] transition hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
