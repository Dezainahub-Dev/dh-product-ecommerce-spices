'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { Footer } from "@/components/footer";
import { useWishlist } from "@/hooks/useWishlist";
import { authService, ProfileResponse } from "@/lib/auth";
import { validators } from "@/lib/validators";
import { AlertCircleIcon } from "@/components/icons";
import { AddressFormModal, Address } from "@/components/profile/address-form-modal";
import { DeleteConfirmationModal } from "@/components/profile/delete-confirmation-modal";
import { addressService } from "@/lib/address";
import { useToastStore } from "@/components/toast-notification";
import { orderService, type OrderListItem, type Review, type ReturnRequest, formatOrderPrice, formatOrderStatus, getOrderStatusColor } from "@/lib/orders";
import { OrderDetailsModal } from "@/components/orders/order-details-modal";
import { productService } from "@/lib/products";

const profileMenu = [
  { label: "Profile Details", value: "profile" },
  { label: "Orders", value: "orders" },
  { label: "Returns", value: "returns" },
  { label: "Reviews", value: "reviews" },
  { label: "Recently Viewed", value: "recently-viewed" },
  { label: "Address", value: "address" },
  { label: "Wishlist", value: "wishlist" },
] as const;

type ProfileSection = (typeof profileMenu)[number]["value"];

export function ProfileAddressPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileSection>("profile");
  const { items: wishlistItems } = useWishlist();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [profileDraft, setProfileDraft] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    marketingOptIn: false,
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const firstNameInputRef = useRef<HTMLInputElement>(null);

  // Address management state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAddress, setDeletingAddress] = useState<Address | null>(null);
  const { addToast } = useToastStore();

  // Orders management state
  const [orders_data, setOrdersData] = useState<OrderListItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersStatusFilter, setOrdersStatusFilter] = useState<OrderListItem['status'] | 'all'>('all');
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrderUid, setSelectedOrderUid] = useState<string | null>(null);

  // Returns and Reviews state
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [returnsLoading, setReturnsLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Recently Viewed state
  const [recentlyViewed, setRecentlyViewed] = useState<Array<{productUid: string; productTitle: string; productSlug?: string; viewedAt: string}>>([]);
  const [recentlyViewedLoading, setRecentlyViewedLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authService.isAuthenticated()) {
        router.push('/login?redirect=/profile');
        return;
      }

      try {
        setLoading(true);
        const data = await authService.getProfile();
        setProfile(data);
        setProfileDraft({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          gender: data.gender || '',
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
          marketingOptIn: data.marketingOptIn || false,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
        if (err.message?.includes('Session expired') || err.message?.includes('401')) {
          router.push('/login?redirect=/profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    if (isEditingProfile) {
      firstNameInputRef.current?.focus();
    }
  }, [isEditingProfile]);

  // Fetch addresses when address tab is active
  useEffect(() => {
    const fetchAddresses = async () => {
      if (activeTab === 'address' && authService.isAuthenticated()) {
        try {
          setAddressesLoading(true);
          const fetchedAddresses = await addressService.getAddresses();
          setAddresses(fetchedAddresses);
        } catch (err: any) {
          console.error('Error fetching addresses:', err);
          addToast(err.message || 'Failed to load addresses', 'error');
        } finally {
          setAddressesLoading(false);
        }
      }
    };

    fetchAddresses();
  }, [activeTab, addToast]);

  // Fetch orders when orders tab is active
  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab === 'orders' && authService.isAuthenticated()) {
        try {
          setOrdersLoading(true);
          const response = await orderService.getOrders({
            page: ordersPage,
            limit: 10,
            status: ordersStatusFilter === 'all' ? undefined : ordersStatusFilter,
          });
          setOrdersData(response.orders);
          setOrdersTotalPages(response.totalPages);
          setOrdersTotal(response.total);
        } catch (err: any) {
          console.error('Error fetching orders:', err);
          addToast(err.message || 'Failed to load orders', 'error');
        } finally {
          setOrdersLoading(false);
        }
      }
    };

    fetchOrders();
  }, [activeTab, ordersPage, ordersStatusFilter, addToast]);

  // Fetch returns when returns tab is active
  useEffect(() => {
    const fetchReturns = async () => {
      if (activeTab === 'returns' && authService.isAuthenticated()) {
        try {
          setReturnsLoading(true);
          const response = await orderService.getReturnRequests();
          setReturns(response.returnRequests);
        } catch (err: any) {
          console.error('Error fetching returns:', err);
          addToast(err.message || 'Failed to load returns', 'error');
        } finally {
          setReturnsLoading(false);
        }
      }
    };

    fetchReturns();
  }, [activeTab, addToast]);

  // Fetch reviews when reviews tab is active
  useEffect(() => {
    const fetchReviews = async () => {
      if (activeTab === 'reviews' && authService.isAuthenticated()) {
        try {
          setReviewsLoading(true);
          const data = await orderService.getMyReviews();
          setReviews(data);
        } catch (err: any) {
          console.error('Error fetching reviews:', err);
          addToast(err.message || 'Failed to load reviews', 'error');
        } finally {
          setReviewsLoading(false);
        }
      }
    };

    fetchReviews();
  }, [activeTab, addToast]);

  // Fetch recently viewed when recently-viewed tab is active
  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      if (activeTab === 'recently-viewed' && authService.isAuthenticated()) {
        try {
          setRecentlyViewedLoading(true);
          const data = await orderService.getRecentlyViewed(20);

          // Enrich with product details to get slug
          const enrichedData = await Promise.all(
            data.map(async (item) => {
              try {
                const productDetail = await productService.getProductDetail(item.productUid);
                return {
                  ...item,
                  productSlug: productDetail.slug,
                };
              } catch (error) {
                // If we can't fetch the product details, return the item without slug
                console.error(`Failed to fetch product details for ${item.productUid}:`, error);
                return item;
              }
            })
          );

          setRecentlyViewed(enrichedData);
        } catch (err: any) {
          console.error('Error fetching recently viewed:', err);
          addToast(err.message || 'Failed to load recently viewed products', 'error');
        } finally {
          setRecentlyViewedLoading(false);
        }
      }
    };

    fetchRecentlyViewed();
  }, [activeTab, addToast]);

  const startEditingProfile = () => {
    if (profile) {
      setProfileDraft({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        gender: profile.gender || '',
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
        marketingOptIn: profile.marketingOptIn || false,
      });
    }
    setIsEditingProfile(true);
    setUpdateError('');
    setUpdateSuccess(false);
    setValidationErrors({});
  };

  const cancelEditingProfile = () => {
    if (profile) {
      setProfileDraft({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        gender: profile.gender || '',
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
        marketingOptIn: profile.marketingOptIn || false,
      });
    }
    setIsEditingProfile(false);
    setUpdateError('');
    setUpdateSuccess(false);
    setValidationErrors({});
  };

  const handleProfileChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    const newValue = type === 'checkbox' ? (event.target as HTMLInputElement).checked : value;
    setProfileDraft((prev) => ({ ...prev, [name]: newValue }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateProfileForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (profileDraft.firstName) {
      const firstNameError = validators.firstName(profileDraft.firstName);
      if (firstNameError) errors.firstName = firstNameError;
    }

    if (profileDraft.lastName) {
      const lastNameError = validators.lastName(profileDraft.lastName);
      if (lastNameError) errors.lastName = lastNameError;
    }

    if (profileDraft.phone) {
      const phoneError = validators.phone(profileDraft.phone);
      if (phoneError) errors.phone = phoneError;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUpdateError('');
    setUpdateSuccess(false);

    if (!validateProfileForm()) {
      setUpdateError('Please fix all validation errors');
      return;
    }

    try {
      const updates: any = {
        firstName: profileDraft.firstName || null,
        lastName: profileDraft.lastName || null,
        phone: profileDraft.phone || null,
        marketingOptIn: profileDraft.marketingOptIn,
      };

      if (profileDraft.gender) {
        updates.gender = profileDraft.gender.toUpperCase();
      }

      if (profileDraft.dateOfBirth) {
        updates.dateOfBirth = profileDraft.dateOfBirth;
      }

      const updatedProfile = await authService.updateProfile(updates);
      setProfile(updatedProfile);
      setIsEditingProfile(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err: any) {
      setUpdateError(err.message || 'Failed to update profile');
    }
  };

  const handleTabChange = (section: ProfileSection) => {
    setActiveTab(section);
    if (section !== "profile") {
      setIsEditingProfile(false);
      if (profile) {
        setProfileDraft({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          phone: profile.phone || '',
          gender: profile.gender || '',
          dateOfBirth: profile.dateOfBirth || '',
          marketingOptIn: profile.marketingOptIn || false,
        });
      }
    }
  };

  const handleViewOrderDetails = (orderUid: string) => {
    setSelectedOrderUid(orderUid);
    setShowOrderDetailsModal(true);
  };

  const handleCloseOrderDetails = () => {
    setShowOrderDetailsModal(false);
    setSelectedOrderUid(null);
  };

  const handleOrderCancelled = () => {
    // Refresh orders list after cancellation
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        try {
          setOrdersLoading(true);
          const response = await orderService.getOrders({
            page: ordersPage,
            limit: 10,
            status: ordersStatusFilter === 'all' ? undefined : ordersStatusFilter,
          });
          setOrdersData(response.orders);
          setOrdersTotalPages(response.totalPages);
          setOrdersTotal(response.total);
        } catch (err: any) {
          console.error('Error fetching orders:', err);
          addToast(err.message || 'Failed to load orders', 'error');
        } finally {
          setOrdersLoading(false);
        }
      };
      fetchOrders();
    }
  };

  // Address handlers
  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (address: Address) => {
    try {
      setAddressesLoading(true);

      if (editingAddress) {
        // Update existing address
        const updatedAddress = await addressService.updateAddress(editingAddress.id, address);
        setAddresses((prev) =>
          prev.map((addr) => (addr.id === updatedAddress.id ? updatedAddress : addr))
        );
        addToast('Address updated successfully', 'success');
      } else {
        // Create new address
        const newAddress = await addressService.createAddress(address);
        setAddresses((prev) => [...prev, newAddress]);
        addToast('Address added successfully', 'success');
      }

      setShowAddressModal(false);
      setEditingAddress(null);
    } catch (err: any) {
      console.error('Error saving address:', err);
      addToast(err.message || 'Failed to save address', 'error');
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleDeleteClick = (address: Address) => {
    setDeletingAddress(address);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAddress) return;

    try {
      setAddressesLoading(true);
      await addressService.deleteAddress(deletingAddress.id);

      setAddresses((prev) => prev.filter((addr) => addr.id !== deletingAddress.id));
      addToast('Address deleted successfully', 'success');

      setShowDeleteModal(false);
      setDeletingAddress(null);
    } catch (err: any) {
      console.error('Error deleting address:', err);
      addToast(err.message || 'Failed to delete address', 'error');
      setShowDeleteModal(false);
      setDeletingAddress(null);
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleMakeDefault = async (addressId: string) => {
    try {
      setAddressesLoading(true);
      await addressService.setDefaultAddress(addressId);

      // Update local state
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === addressId,
        }))
      );
      addToast('Default address updated', 'success');
    } catch (err: any) {
      console.error('Error setting default address:', err);
      addToast(err.message || 'Failed to set default address', 'error');
    } finally {
      setAddressesLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-sm text-zinc-500">Loading profile...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center gap-3 rounded-xl border border-accent-red bg-accent-red-bg p-4 text-sm text-accent-red">
          <AlertCircleIcon className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      );
    }

    if (!profile) {
      return null;
    }

    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-5 text-sm text-primary-dark">
            {updateSuccess && (
              <div className="rounded-xl border border-primary bg-bg-secondary p-4 text-sm text-primary">
                Profile updated successfully!
              </div>
            )}
            {updateError && (
              <div className="flex items-start gap-3 rounded-xl border border-accent-red bg-accent-red-bg p-4 text-sm text-accent-red">
                <AlertCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
                <p>{updateError}</p>
              </div>
            )}

            {/* Profile Analytics */}
            {profile && (profile.ordersCount !== undefined || profile.addressesCount !== undefined) && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {profile.ordersCount !== undefined && (
                  <div className="rounded-2xl border border-border-primary bg-bg-card p-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-lighter">Orders</p>
                    <p className="mt-2 text-2xl font-bold text-primary">{profile.ordersCount}</p>
                  </div>
                )}
                {profile.addressesCount !== undefined && (
                  <div className="rounded-2xl border border-border-primary bg-bg-card p-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-lighter">Addresses</p>
                    <p className="mt-2 text-2xl font-bold text-primary">{profile.addressesCount}</p>
                  </div>
                )}
                {profile.isVerified !== undefined && (
                  <div className="rounded-2xl border border-border-primary bg-bg-card p-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-lighter">Verified</p>
                    <p className="mt-2 text-2xl font-bold text-primary">{profile.isVerified ? 'Yes' : 'No'}</p>
                  </div>
                )}
                {profile.lastLoginAt && (
                  <div className="rounded-2xl border border-border-primary bg-bg-card p-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-lighter">Last Login</p>
                    <p className="mt-2 text-xs font-semibold text-primary-dark">
                      {new Date(profile.lastLoginAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>
            )}

            <form
              onSubmit={handleProfileSubmit}
              className="space-y-5"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <ProfileInput
                    ref={firstNameInputRef}
                    label="First Name"
                    name="firstName"
                    value={profileDraft.firstName}
                    onChange={handleProfileChange}
                    disabled={!isEditingProfile}
                  />
                  {validationErrors.firstName && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-accent-red">
                      <AlertCircleIcon className="h-4 w-4 shrink-0" />
                      <span>{validationErrors.firstName}</span>
                    </div>
                  )}
                </div>
                <div>
                  <ProfileInput
                    label="Last Name"
                    name="lastName"
                    value={profileDraft.lastName}
                    onChange={handleProfileChange}
                    disabled={!isEditingProfile}
                  />
                  {validationErrors.lastName && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-accent-red">
                      <AlertCircleIcon className="h-4 w-4 shrink-0" />
                      <span>{validationErrors.lastName}</span>
                    </div>
                  )}
                </div>
              </div>
              <ProfileInput
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={() => {}}
                disabled={true}
              />
              <div>
                <ProfileInput
                  label="Phone Number"
                  name="phone"
                  value={profileDraft.phone}
                  onChange={handleProfileChange}
                  disabled={!isEditingProfile}
                />
                {validationErrors.phone && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-accent-red">
                    <AlertCircleIcon className="h-4 w-4 shrink-0" />
                    <span>{validationErrors.phone}</span>
                  </div>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary-lighter">
                    Gender
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"].map((option) => (
                      <label
                        key={option}
                        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold capitalize transition ${
                          profileDraft.gender === option
                            ? "border-primary text-primary-dark"
                            : "border-border-primary text-zinc-500"
                        } ${!isEditingProfile ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={option}
                          checked={profileDraft.gender === option}
                          onChange={handleProfileChange}
                          disabled={!isEditingProfile}
                          className="text-primary"
                        />
                        {option === "PREFER_NOT_TO_SAY" ? "Prefer not to say" : option.toLowerCase()}
                      </label>
                    ))}
                  </div>
                </div>
                <ProfileInput
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={profileDraft.dateOfBirth}
                  onChange={handleProfileChange}
                  disabled={!isEditingProfile}
                />
              </div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="marketingOptIn"
                  checked={profileDraft.marketingOptIn}
                  onChange={handleProfileChange}
                  disabled={!isEditingProfile}
                  className="h-5 w-5 rounded border-border-primary text-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <span className="text-sm text-primary-dark">
                  I want to receive marketing emails and promotional offers
                </span>
              </label>
            </form>
            <div className="flex justify-end gap-3">
              {isEditingProfile && (
                <button
                  type="button"
                  onClick={cancelEditingProfile}
                  className="rounded-full border border-border-light px-6 py-2 text-sm font-semibold text-primary-dark"
                >
                  Cancel
                </button>
              )}
              {isEditingProfile ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleProfileSubmit(e as any);
                  }}
                  className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(77,156,44,0.25)]"
                >
                  Save Profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startEditingProfile}
                  className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(77,156,44,0.25)] cursor-pointer"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        );
      case "orders":
        if (ordersLoading) {
          return (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-sm text-zinc-500">Loading orders...</p>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-medium text-zinc-600">Filter by status:</p>
              {(['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setOrdersStatusFilter(status);
                    setOrdersPage(1);
                  }}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                    ordersStatusFilter === status
                      ? 'bg-primary text-white'
                      : 'bg-bg-secondary text-zinc-600 hover:bg-border-light'
                  }`}
                >
                  {status === 'all' ? 'All' : formatOrderStatus(status)}
                </button>
              ))}
            </div>

            {/* Orders List */}
            {orders_data.length === 0 ? (
              <div className="rounded-2xl border border-border-primary bg-bg-card p-12 text-center">
                <p className="text-sm text-zinc-500">No orders found.</p>
                <Link href="/shop-now" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {orders_data.map((order) => (
                    <article
                      key={order.uid}
                      className="flex flex-col gap-4 rounded-2xl border border-border-primary bg-bg-card p-4 text-sm md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-base font-semibold text-primary-dark">
                            Order #{order.uid.slice(-8)}
                          </p>
                          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getOrderStatusColor(order.status)}`}>
                            {formatOrderStatus(order.status)}
                          </span>
                        </div>
                        <p className="mt-2 text-zinc-500">
                          {new Date(order.placedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="mt-1 text-zinc-500">{order.itemsCount} item(s)</p>
                        <p className="mt-2 text-lg font-bold text-primary">
                          {formatOrderPrice(order.totalCents, order.currency)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewOrderDetails(order.uid)}
                        className="rounded-full border border-border-light px-6 py-2 text-sm font-semibold text-primary-dark transition hover:bg-bg-secondary"
                      >
                        View Details
                      </button>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {ordersTotalPages > 1 && (
                  <div className="flex items-center justify-between rounded-2xl border border-border-primary bg-bg-card p-4">
                    <p className="text-sm text-zinc-600">
                      Showing page {ordersPage} of {ordersTotalPages} ({ordersTotal} total)
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                        disabled={ordersPage === 1}
                        className="rounded-full border border-border-light px-4 py-2 text-sm font-semibold text-primary-dark transition hover:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setOrdersPage((p) => Math.min(ordersTotalPages, p + 1))}
                        disabled={ordersPage === ordersTotalPages}
                        className="rounded-full border border-border-light px-4 py-2 text-sm font-semibold text-primary-dark transition hover:bg-bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );
      case "returns":
        if (returnsLoading) {
          return (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-sm text-zinc-500">Loading return requests...</p>
              </div>
            </div>
          );
        }

        if (returns.length === 0) {
          return (
            <div className="rounded-2xl border border-border-primary bg-bg-card p-12 text-center">
              <p className="text-sm text-zinc-500">No return requests found.</p>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {returns.map((returnRequest) => (
              <article
                key={returnRequest.uid}
                className="rounded-2xl border border-border-primary bg-bg-card p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-base font-semibold text-primary-dark">
                        Return Request #{returnRequest.uid.slice(-8)}
                      </p>
                      <span className="rounded-full bg-bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        {returnRequest.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-600">
                      <span className="font-medium">Order:</span> #{returnRequest.orderUid.slice(-8)}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600">
                      <span className="font-medium">Reason:</span> {returnRequest.reason}
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">
                      Requested on {new Date(returnRequest.requestedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewOrderDetails(returnRequest.orderUid)}
                    className="rounded-full border border-border-light px-6 py-2 text-sm font-semibold text-primary-dark transition hover:bg-bg-secondary"
                  >
                    View Order
                  </button>
                </div>
              </article>
            ))}
          </div>
        );
      case "reviews":
        if (reviewsLoading) {
          return (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-sm text-zinc-500">Loading reviews...</p>
              </div>
            </div>
          );
        }

        if (reviews.length === 0) {
          return (
            <div className="rounded-2xl border border-border-primary bg-bg-card p-12 text-center">
              <p className="text-sm text-zinc-500">No reviews yet.</p>
              <Link href="/shop-now" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
                Shop and leave your first review
              </Link>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {reviews.map((review) => (
              <article
                key={review.uid}
                className="rounded-2xl border border-border-primary bg-bg-card p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <Link
                      href={`/shop-now/${review.productUid}`}
                      className="text-base font-semibold text-primary-dark hover:text-primary"
                    >
                      {review.productTitle}
                    </Link>
                    <div className="mt-2 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < review.rating ? 'text-[var(--color-accent-yellow)]' : 'text-zinc-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="ml-2 text-sm text-zinc-600">{review.rating}/5</span>
                    </div>
                    {review.comment && (
                      <p className="mt-3 text-sm text-zinc-600">{review.comment}</p>
                    )}
                    <p className="mt-3 text-xs text-zinc-500">
                      Reviewed on {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        );
      case "recently-viewed":
        if (recentlyViewedLoading) {
          return (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-sm text-zinc-500">Loading recently viewed products...</p>
              </div>
            </div>
          );
        }

        if (recentlyViewed.length === 0) {
          return (
            <div className="rounded-2xl border border-border-primary bg-bg-card p-12 text-center">
              <p className="text-sm text-zinc-500">No recently viewed products.</p>
              <Link href="/shop-now" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
                Start browsing products
              </Link>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {recentlyViewed.map((item) => {
              const productUrl = item.productSlug ? `/shop-now/${item.productSlug}` : `/shop-now/${item.productUid}`;
              return (
                <article
                  key={item.productUid}
                  className="rounded-2xl border border-border-primary bg-bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Link
                        href={productUrl}
                        className="text-base font-semibold text-primary-dark hover:text-primary"
                      >
                        {item.productTitle}
                      </Link>
                      <p className="mt-2 text-xs text-zinc-500">
                        Viewed on {new Date(item.viewedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <Link
                      href={productUrl}
                      className="rounded-full border border-border-light px-6 py-2 text-sm font-semibold text-primary-dark transition hover:bg-bg-secondary"
                    >
                      View Product
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        );
      case "wishlist":
        if (wishlistItems.length === 0) {
          return (
            <div className="rounded-2xl border border-border-primary bg-bg-card p-6 text-center text-sm text-zinc-500">
              No wishlist items yet.{" "}
              <Link href="/shop-now" className="text-primary underline">
                Browse products
              </Link>
              .
            </div>
          );
        }
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {wishlistItems.map((item) => (
              <article
                key={item.uid}
                className="rounded-2xl border border-border-primary bg-bg-card p-4 text-sm text-primary-dark"
              >
                <div className="flex h-32 w-full items-center justify-center overflow-hidden rounded-xl bg-[var(--color-bg-image)] mb-3">
                  {item.product.images && item.product.images.length > 0 ? (
                    <img
                      src={item.product.images.find(img => img.isPrimary)?.url || item.product.images[0].url}
                      alt={item.product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-zinc-400">No image</span>
                  )}
                </div>
                <p className="mt-1 text-lg font-semibold">{item.product.title}</p>
                <p className="mt-2 text-primary">₹{(item.sku.priceCents / 100).toFixed(2)}</p>
                <Link
                  href={`/shop-now/${item.product.slug}`}
                  className="mt-4 block w-full rounded-full border border-primary px-4 py-2 text-center text-sm font-semibold text-primary hover:bg-primary hover:text-white"
                >
                  View Product
                </Link>
              </article>
            ))}
          </div>
        );
      case "address":
      default:
        if (addressesLoading) {
          return (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-sm text-zinc-500">Loading addresses...</p>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {addresses.length === 0 ? (
              <div className="rounded-2xl border border-border-primary bg-bg-card p-6 text-center text-sm text-zinc-500">
                No address saved yet.{' '}
                <button
                  onClick={handleAddNewAddress}
                  className="text-primary underline hover:text-primary-dark"
                >
                  Add your first address
                </button>
              </div>
            ) : (
              addresses.map((address) => (
                <article
                  key={address.id}
                  className="flex flex-col gap-4 rounded-2xl border border-border-primary bg-bg-card p-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-primary-dark">
                        {address.name}
                      </p>
                      <span className="text-zinc-400">|</span>
                      <span className="text-sm text-zinc-600">{address.phone}</span>
                      <span className="text-zinc-400">|</span>
                      <span className="rounded-full bg-bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        {address.addressType}
                      </span>
                      {address.isDefault && (
                        <>
                          <span className="text-zinc-400">|</span>
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                            Default Address
                          </span>
                        </>
                      )}
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-zinc-600">
                      <p className="font-medium text-primary-dark">{address.line1}</p>
                      {address.line2 && <p>{address.line2}</p>}
                      {address.landmark && (
                        <p className="text-zinc-500">Landmark: {address.landmark}</p>
                      )}
                      <p>
                        {address.city}, {address.state} {address.pincode}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:flex-col sm:items-end">
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-primary-dark transition hover:bg-bg-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(address)}
                      className="rounded-full border border-accent-red/30 bg-accent-red-bg px-5 py-2 text-sm font-semibold text-accent-red transition hover:border-accent-red hover:bg-accent-red hover:text-white"
                    >
                      Delete
                    </button>
                    {!address.isDefault && (
                      <button
                        onClick={() => handleMakeDefault(address.id)}
                        className="rounded-full border border-primary/30 bg-primary/5 px-5 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary hover:text-white"
                      >
                        Make Default
                      </button>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        );
    }
  };

  return (
    <main className="bg-white text-primary-dark">
      {/* Address Form Modal */}
      <AddressFormModal
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        editingAddress={editingAddress}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingAddress(null);
        }}
        onConfirm={handleConfirmDelete}
        address={deletingAddress}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={showOrderDetailsModal}
        onClose={handleCloseOrderDetails}
        orderUid={selectedOrderUid}
        onOrderCancelled={handleOrderCancelled}
      />

      <section className="mx-auto max-w-[1300px] px-6 py-10">
        <nav className="text-sm text-zinc-500">
          <Link href="/" className="text-primary hover:underline">
            Home
          </Link>{" "}
          <span className="mx-2 text-zinc-400">/</span>
          <span className="font-medium text-zinc-700">Profile</span>
        </nav>

        <div className="mt-8 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-border-primary bg-white p-6 shadow-[0_6px_20px_rgba(77,156,44,0.06)]">
            <div>
              <p className="text-lg font-semibold text-primary-dark">My Profile</p>
              <p className="mt-1 text-sm text-zinc-500">Manage your account setting</p>
            </div>
            <ul className="mt-6 space-y-3 text-sm font-semibold text-primary-dark">
              {profileMenu.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => handleTabChange(item.value)}
                    className={`flex w-full items-center justify-between rounded-2xl border border-transparent px-4 py-3 text-left transition ${
                      activeTab === item.value
                        ? "border-border-lightest bg-bg-secondary text-text-medium"
                        : "text-text-muted hover:border-border-lightest hover:bg-bg-tertiary"
                    }`}
                  >
                    <span>{item.label}</span>
                    {activeTab === item.value && (
                      <span className="text-xs font-bold text-primary-light">●</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="rounded-3xl border border-border-primary bg-white p-6 shadow-[0_6px_20px_rgba(77,156,44,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.5em] text-primary-lighter">
                  {activeTab}
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-primary-dark">
                  {activeTab === "profile"
                    ? "Profile Details"
                    : activeTab === "orders"
                    ? "Orders"
                    : activeTab === "returns"
                    ? "Return Requests"
                    : activeTab === "reviews"
                    ? "My Reviews"
                    : activeTab === "recently-viewed"
                    ? "Recently Viewed"
                    : activeTab === "wishlist"
                    ? "Wishlist"
                    : "Address"}
                </h1>
              </div>
              {activeTab === "address" && (
                <button
                  onClick={handleAddNewAddress}
                  className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-primary transition hover:bg-bg-secondary"
                >
                  + Add New
                </button>
              )}
            </div>

            <div className="mt-6">{renderContent()}</div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

type ProfileInputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  disabled: boolean;
  type?: string;
};

const ProfileInput = forwardRef<HTMLInputElement, ProfileInputProps>(
  ({ label, name, value, onChange, disabled, type = "text" }, ref) => {
    return (
      <label className="block rounded-2xl border border-border-primary px-5 py-4">
        <span className="text-xs uppercase tracking-[0.3em] text-primary-lighter">{label}</span>
        <input
          ref={ref}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="mt-2 w-full border-none bg-transparent text-base font-semibold text-primary-dark outline-none disabled:text-zinc-500"
        />
      </label>
    );
  }
);

ProfileInput.displayName = "ProfileInput";
