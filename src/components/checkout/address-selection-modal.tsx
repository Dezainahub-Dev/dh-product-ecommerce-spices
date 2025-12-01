'use client';

import { useState } from 'react';
import type { Address } from '@/components/profile/address-form-modal';
import { AddressFormModal } from '@/components/profile/address-form-modal';

interface AddressSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: Address[];
  selectedAddressId: string | null;
  onSelectAddress: (address: Address) => void;
  onAddNewAddress: (address: Address) => void;
}

export function AddressSelectionModal({
  isOpen,
  onClose,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddNewAddress,
}: AddressSelectionModalProps) {
  const [showAddressForm, setShowAddressForm] = useState(false);

  if (!isOpen) return null;

  const handleAddNew = () => {
    setShowAddressForm(true);
  };

  const handleSaveNewAddress = (address: Address) => {
    onAddNewAddress(address);
    setShowAddressForm(false);
  };

  const handleSelectAndClose = (address: Address) => {
    onSelectAddress(address);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-semibold text-[var(--color-primary-dark)]">
              Select Delivery Address
            </h2>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[var(--color-bg-secondary)]"
            >
              <svg
                className="h-5 w-5 text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {addresses.length === 0 ? (
              <div className="rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] p-8 text-center">
                <p className="text-sm text-zinc-600">No saved addresses yet.</p>
                <button
                  onClick={handleAddNew}
                  className="mt-4 rounded-full bg-[var(--color-primary)] px-6 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(77,156,44,0.25)] transition hover:bg-[var(--color-primary-darker)]"
                >
                  Add New Address
                </button>
              </div>
            ) : (
              <>
                {addresses.map((address) => (
                  <button
                    key={address.id}
                    onClick={() => handleSelectAndClose(address)}
                    className={`w-full rounded-2xl border-2 p-4 text-left transition ${
                      selectedAddressId === address.id
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                        : 'border-[var(--color-border-primary)] hover:border-[var(--color-primary)]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-semibold text-[var(--color-primary-dark)]">
                            {address.name}
                          </p>
                          <span className="text-zinc-400">|</span>
                          <span className="text-sm text-zinc-600">{address.phone}</span>
                          <span className="text-zinc-400">|</span>
                          <span className="rounded-full bg-[var(--color-bg-secondary)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                            {address.addressType}
                          </span>
                          {address.isDefault && (
                            <>
                              <span className="text-zinc-400">|</span>
                              <span className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                                Default
                              </span>
                            </>
                          )}
                        </div>
                        <div className="mt-3 space-y-1 text-sm text-zinc-600">
                          <p className="font-medium text-[var(--color-primary-dark)]">
                            {address.line1}
                          </p>
                          {address.line2 && <p>{address.line2}</p>}
                          {address.landmark && (
                            <p className="text-zinc-500">Landmark: {address.landmark}</p>
                          )}
                          <p>
                            {address.city}, {address.state} {address.pincode}
                          </p>
                        </div>
                      </div>
                      {selectedAddressId === address.id && (
                        <div className="ml-4 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)]">
                          <svg
                            className="h-4 w-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}

                <button
                  onClick={handleAddNew}
                  className="w-full rounded-2xl border-2 border-dashed border-[var(--color-border-primary)] p-4 text-center text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)]"
                >
                  + Add New Address
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      <AddressFormModal
        isOpen={showAddressForm}
        onClose={() => setShowAddressForm(false)}
        onSave={handleSaveNewAddress}
        editingAddress={null}
      />
    </>
  );
}
