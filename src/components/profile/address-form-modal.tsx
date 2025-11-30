'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { AlertCircleIcon } from '@/components/icons';

export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  addressType: 'HOME' | 'OFFICE' | 'OTHER';
  isDefault: boolean;
}

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Address) => void;
  editingAddress: Address | null;
}

export function AddressFormModal({
  isOpen,
  onClose,
  onSave,
  editingAddress,
}: AddressFormModalProps) {
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    name: '',
    phone: '',
    line1: '',
    line2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'HOME',
    isDefault: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      if (editingAddress) {
        setFormData({
          name: editingAddress.name,
          phone: editingAddress.phone,
          line1: editingAddress.line1,
          line2: editingAddress.line2,
          landmark: editingAddress.landmark,
          city: editingAddress.city,
          state: editingAddress.state,
          pincode: editingAddress.pincode,
          addressType: editingAddress.addressType,
          isDefault: editingAddress.isDefault,
        });
      } else {
        setFormData({
          name: '',
          phone: '',
          line1: '',
          line2: '',
          landmark: '',
          city: '',
          state: '',
          pincode: '',
          addressType: 'HOME',
          isDefault: false,
        });
      }
      setErrors({});
      setTouched({});
    }
  }, [isOpen, editingAddress]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof typeof formData] as string);
  };

  const validateField = (field: string, value: string) => {
    let error = '';

    switch (field) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.trim().length < 2)
          error = 'Name must be at least 2 characters';
        break;
      case 'phone':
        if (!value.trim()) error = 'Phone number is required';
        else if (!/^[6-9]\d{9}$/.test(value))
          error = 'Enter a valid 10-digit mobile number';
        break;
      case 'line1':
        if (!value.trim()) error = 'Address Line 1 is required';
        else if (value.trim().length < 3)
          error = 'Address must be at least 3 characters';
        break;
      case 'city':
        if (!value.trim()) error = 'City is required';
        break;
      case 'state':
        if (!value.trim()) error = 'State is required';
        break;
      case 'pincode':
        if (!value.trim()) error = 'Pincode is required';
        else if (!/^\d{6}$/.test(value)) error = 'Pincode must be 6 digits';
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameError = validateField('name', formData.name);
    const phoneError = validateField('phone', formData.phone);
    const line1Error = validateField('line1', formData.line1);
    const cityError = validateField('city', formData.city);
    const stateError = validateField('state', formData.state);
    const pincodeError = validateField('pincode', formData.pincode);

    if (nameError) newErrors.name = nameError;
    if (phoneError) newErrors.phone = phoneError;
    if (line1Error) newErrors.line1 = line1Error;
    if (cityError) newErrors.city = cityError;
    if (stateError) newErrors.state = stateError;
    if (pincodeError) newErrors.pincode = pincodeError;

    setErrors(newErrors);
    setTouched({
      name: true,
      phone: true,
      line1: true,
      city: true,
      state: true,
      pincode: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const addressToSave: Address = {
      id: editingAddress?.id || Date.now().toString(),
      ...formData,
    };

    onSave(addressToSave);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      phone: '',
      line1: '',
      line2: '',
      landmark: '',
      city: '',
      state: '',
      pincode: '',
      addressType: 'HOME',
      isDefault: false,
    });
    setErrors({});
    setTouched({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-primary-dark)]">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {editingAddress
                ? 'Update your delivery address'
                : 'Add a new delivery address'}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="rounded-full p-2 text-zinc-500 transition hover:bg-[var(--color-bg-secondary)]"
          >
            <svg
              className="h-6 w-6"
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

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block rounded-2xl border border-[var(--color-border-primary)] px-5 py-4">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary-lighter)]">
                Full Name *
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                placeholder="Enter full name"
                className="mt-2 w-full border-none bg-transparent text-base font-semibold text-[var(--color-primary-dark)] outline-none placeholder:text-zinc-400 placeholder:font-normal"
              />
            </label>
            {touched.name && errors.name && (
              <div className="mt-2 flex items-center gap-2 text-sm text-[var(--color-accent-red)]">
                <AlertCircleIcon className="h-4 w-4 shrink-0" />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block rounded-2xl border border-[var(--color-border-primary)] px-5 py-4">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary-lighter)]">
                Phone Number *
              </span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
                placeholder="10-digit mobile number"
                maxLength={10}
                className="mt-2 w-full border-none bg-transparent text-base font-semibold text-[var(--color-primary-dark)] outline-none placeholder:text-zinc-400 placeholder:font-normal"
              />
            </label>
            {touched.phone && errors.phone && (
              <div className="mt-2 flex items-center gap-2 text-sm text-[var(--color-accent-red)]">
                <AlertCircleIcon className="h-4 w-4 shrink-0" />
                <span>{errors.phone}</span>
              </div>
            )}
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block rounded-2xl border border-[var(--color-border-primary)] px-5 py-4">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary-lighter)]">
                Address Line 1 *
              </span>
              <input
                type="text"
                name="line1"
                value={formData.line1}
                onChange={handleChange}
                onBlur={() => handleBlur('line1')}
                placeholder="House No., Building Name"
                className="mt-2 w-full border-none bg-transparent text-base font-semibold text-[var(--color-primary-dark)] outline-none placeholder:text-zinc-400 placeholder:font-normal"
              />
            </label>
            {touched.line1 && errors.line1 && (
              <div className="mt-2 flex items-center gap-2 text-sm text-[var(--color-accent-red)]">
                <AlertCircleIcon className="h-4 w-4 shrink-0" />
                <span>{errors.line1}</span>
              </div>
            )}
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block rounded-2xl border border-[var(--color-border-primary)] px-5 py-4">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary-lighter)]">
                Address Line 2
              </span>
              <input
                type="text"
                name="line2"
                value={formData.line2}
                onChange={handleChange}
                placeholder="Street, Area"
                className="mt-2 w-full border-none bg-transparent text-base font-semibold text-[var(--color-primary-dark)] outline-none placeholder:text-zinc-400 placeholder:font-normal"
              />
            </label>
          </div>

          {/* Landmark */}
          <div>
            <label className="block rounded-2xl border border-[var(--color-border-primary)] px-5 py-4">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary-lighter)]">
                Landmark
              </span>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="Near XYZ Mall"
                className="mt-2 w-full border-none bg-transparent text-base font-semibold text-[var(--color-primary-dark)] outline-none placeholder:text-zinc-400 placeholder:font-normal"
              />
            </label>
          </div>

          {/* City and State */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block rounded-2xl border border-[var(--color-border-primary)] px-5 py-4">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary-lighter)]">
                  City *
                </span>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={() => handleBlur('city')}
                  placeholder="Enter city"
                  className="mt-2 w-full border-none bg-transparent text-base font-semibold text-[var(--color-primary-dark)] outline-none placeholder:text-zinc-400 placeholder:font-normal"
                />
              </label>
              {touched.city && errors.city && (
                <div className="mt-2 flex items-center gap-2 text-sm text-[var(--color-accent-red)]">
                  <AlertCircleIcon className="h-4 w-4 shrink-0" />
                  <span>{errors.city}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block rounded-2xl border border-[var(--color-border-primary)] px-5 py-4">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary-lighter)]">
                  State *
                </span>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  onBlur={() => handleBlur('state')}
                  placeholder="Enter state"
                  className="mt-2 w-full border-none bg-transparent text-base font-semibold text-[var(--color-primary-dark)] outline-none placeholder:text-zinc-400 placeholder:font-normal"
                />
              </label>
              {touched.state && errors.state && (
                <div className="mt-2 flex items-center gap-2 text-sm text-[var(--color-accent-red)]">
                  <AlertCircleIcon className="h-4 w-4 shrink-0" />
                  <span>{errors.state}</span>
                </div>
              )}
            </div>
          </div>

          {/* Pincode */}
          <div>
            <label className="block rounded-2xl border border-[var(--color-border-primary)] px-5 py-4">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary-lighter)]">
                Pincode *
              </span>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                onBlur={() => handleBlur('pincode')}
                placeholder="6-digit pincode"
                maxLength={6}
                className="mt-2 w-full border-none bg-transparent text-base font-semibold text-[var(--color-primary-dark)] outline-none placeholder:text-zinc-400 placeholder:font-normal"
              />
            </label>
            {touched.pincode && errors.pincode && (
              <div className="mt-2 flex items-center gap-2 text-sm text-[var(--color-accent-red)]">
                <AlertCircleIcon className="h-4 w-4 shrink-0" />
                <span>{errors.pincode}</span>
              </div>
            )}
          </div>

          {/* Address Type */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary-lighter)]">
              Address Type *
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {['HOME', 'OFFICE', 'OTHER'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      addressType: type as 'HOME' | 'OFFICE' | 'OTHER',
                    }))
                  }
                  className={`rounded-full border-2 px-6 py-2 text-sm font-semibold capitalize transition ${
                    formData.addressType === type
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                      : 'border-[var(--color-border-primary)] text-[var(--color-primary-dark)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  {type.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Make as Default (only for editing) */}
          {editingAddress && (
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isDefault: e.target.checked,
                  }))
                }
                className="h-5 w-5 rounded border-[var(--color-border-primary)] text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
              <span className="text-sm font-semibold text-[var(--color-primary-dark)]">
                Make this my default address
              </span>
            </label>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-full border border-[var(--color-border-light)] px-6 py-2.5 text-sm font-semibold text-[var(--color-primary-dark)] transition hover:bg-[var(--color-bg-secondary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(103,39,27,0.25)] transition hover:bg-[var(--color-primary-dark)]"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
