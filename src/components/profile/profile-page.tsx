'use client';

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { Footer } from "@/components/footer";
import { useWishlistStore } from "@/store/wishlist-store";

const profileMenu = [
  { label: "Profile Details", value: "profile" },
  { label: "Orders", value: "orders" },
  { label: "Address", value: "address" },
  { label: "Wishlist", value: "wishlist" },
] as const;

type ProfileSection = (typeof profileMenu)[number]["value"];

const addresses = [
  {
    id: 1,
    name: "Jessica Laura",
    phone: "+12 345 678 910",
    label: "Home",
    lines: [
      "South Merdeka Street, Kiuddalem, Klojen, South Merdeka Street,",
      "South Merdeka Street, Kiuddalem, Klojen District,",
      "Malang City, East Java 65119",
    ],
  },
  {
    id: 2,
    name: "Jessica Laura",
    phone: "+12 345 678 910",
    label: "Home",
    lines: [
      "South Merdeka Street, Kiuddalem, Klojen District, Malang City, East Java 65119",
    ],
  },
  {
    id: 3,
    name: "Jessica Laura",
    phone: "+12 345 678 910",
    label: "Home",
    lines: [
      "South Merdeka Street, Kiuddalem, Klojen District, Malang City, East Java 65119",
    ],
  },
  {
    id: 4,
    name: "Jessica Laura",
    phone: "+12 345 678 910",
    label: "Home",
    lines: [
      "South Merdeka Street, Kiuddalem, Klojen District, Malang City, East Java 65119",
    ],
  },
];

const orders = [
  {
    id: "INV-20921",
    date: "January 02, 2025",
    total: "₹3,499",
    status: "Shipped",
    summary: "Cardamom, Nutmeg & Cashew Pack",
    items: [
      { name: "Premium Cardamom", quantity: 2, price: "₹899" },
      { name: "Organic Nutmeg", quantity: 1, price: "₹699" },
      { name: "Roasted Cashews", quantity: 3, price: "₹1,001" },
    ],
    shippingAddress: {
      name: "Jessica Laura",
      phone: "+12 345 678 910",
      address: "South Merdeka Street, Kiuddalem, Klojen District, Malang City, East Java 65119",
    },
    paymentMethod: "Credit Card ending in 4242",
    trackingNumber: "TRK-2025-001234",
  },
  {
    id: "INV-20487",
    date: "December 22, 2024",
    total: "₹2,199",
    status: "Delivered",
    summary: "Premium Spice Bundle",
    items: [
      { name: "Cumin Seeds", quantity: 2, price: "₹599" },
      { name: "Black Pepper", quantity: 1, price: "₹799" },
      { name: "Turmeric Powder", quantity: 2, price: "₹801" },
    ],
    shippingAddress: {
      name: "Jessica Laura",
      phone: "+12 345 678 910",
      address: "South Merdeka Street, Kiuddalem, Klojen District, Malang City, East Java 65119",
    },
    paymentMethod: "Credit Card ending in 4242",
    trackingNumber: "TRK-2024-009876",
  },
];

const initialProfile = {
  firstName: "Jessica",
  lastName: "Laura",
  email: "jessica.laura@email.com",
  phone: "+12 345 678 910",
  gender: "female",
  dob: "1994-05-12",
};

export function ProfileAddressPage() {
  const [activeTab, setActiveTab] = useState<ProfileSection>("profile");
  const wishlistProducts = useWishlistStore((state) => state.products);
  const [profileForm, setProfileForm] = useState(initialProfile);
  const [profileDraft, setProfileDraft] = useState(initialProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const firstNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingProfile) {
      firstNameInputRef.current?.focus();
    }
  }, [isEditingProfile]);

  const startEditingProfile = () => {
    setProfileDraft({ ...profileForm });
    setIsEditingProfile(true);
  };

  const cancelEditingProfile = () => {
    setProfileDraft({ ...profileForm });
    setIsEditingProfile(false);
  };

  const handleProfileChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setProfileDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileForm(profileDraft);
    setIsEditingProfile(false);
  };

  const handleTabChange = (section: ProfileSection) => {
    setActiveTab(section);
    if (section !== "profile") {
      setIsEditingProfile(false);
      setProfileDraft({ ...profileForm });
    }
  };

  const handleViewOrderDetails = (order: typeof orders[0]) => {
    setSelectedOrder(order);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-5 text-sm text-primary-dark">
            <form
              onSubmit={handleProfileSubmit}
              className="space-y-5"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <ProfileInput
                  ref={firstNameInputRef}
                  label="First Name"
                  name="firstName"
                  value={profileDraft.firstName}
                  onChange={handleProfileChange}
                  disabled={!isEditingProfile}
                />
                <ProfileInput
                  label="Last Name"
                  name="lastName"
                  value={profileDraft.lastName}
                  onChange={handleProfileChange}
                  disabled={!isEditingProfile}
                />
              </div>
              <ProfileInput
                label="Email"
                name="email"
                type="email"
                value={profileDraft.email}
                onChange={handleProfileChange}
                disabled={!isEditingProfile}
              />
              <ProfileInput
                label="Phone Number"
                name="phone"
                value={profileDraft.phone}
                onChange={handleProfileChange}
                disabled={!isEditingProfile}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary-lighter">
                    Gender
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {["female", "male", "other"].map((option) => (
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
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
                <ProfileInput
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={profileDraft.dob}
                  onChange={handleProfileChange}
                  disabled={!isEditingProfile}
                />
              </div>
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
        return (
          <div className="space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="flex flex-col rounded-2xl border border-border-primary bg-bg-card p-4 text-sm text-primary-dark md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-base font-semibold">{order.summary}</p>
                  <p className="mt-1 text-zinc-500">
                    {order.date} • Order {order.id}
                  </p>
                  <p className="mt-2 font-semibold text-primary">{order.total}</p>
                </div>
                <div className="mt-4 flex items-center gap-3 md:mt-0">
                  <span className="rounded-full bg-bg-secondary px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                    {order.status}
                  </span>
                  <button
                    onClick={() => handleViewOrderDetails(order)}
                    className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-primary-dark hover:bg-bg-secondary transition"
                  >
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        );
      case "wishlist":
        if (wishlistProducts.length === 0) {
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
            {wishlistProducts.map((product) => (
              <article
                key={product.slug}
                className="rounded-2xl border border-border-primary bg-bg-card p-4 text-sm text-primary-dark"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-primary/70">
                  {product.category}
                </p>
                <p className="mt-1 text-lg font-semibold">{product.name}</p>
                <p className="mt-2 text-primary">₹{product.price}</p>
                <button className="mt-4 w-full rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white">
                  Add to Cart
                </button>
              </article>
            ))}
          </div>
        );
      case "address":
      default:
        return (
          <div className="space-y-4">
            {addresses.map((entry) => (
              <article
                key={entry.id}
                className="flex flex-col gap-4 rounded-2xl border border-border-primary bg-bg-card p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <p className="text-base font-semibold text-primary-dark">
                    {entry.name} <span className="text-zinc-400">|</span>{" "}
                    <span className="text-primary-dark">{entry.phone}</span>{" "}
                    <span className="text-zinc-400">|</span>{" "}
                    <span className="font-normal text-primary">{entry.label}</span>
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-zinc-500">
                    {entry.lines.map((line, index) => (
                      <p key={`${entry.id}-${index}`}>{line}</p>
                    ))}
                  </div>
                </div>
                <button className="h-10 rounded-full border border-border-light px-6 text-sm font-semibold text-primary-dark transition hover:bg-bg-secondary">
                  Edit
                </button>
              </article>
            ))}
          </div>
        );
    }
  };

  return (
    <main className="bg-white text-primary-dark">
      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-primary-dark">
                  Order Details
                </h2>
                <p className="mt-1 text-sm text-zinc-500">Order {selectedOrder.id}</p>
              </div>
              <button
                onClick={handleCloseOrderDetails}
                className="rounded-full p-2 text-zinc-500 hover:bg-bg-secondary transition"
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

            <div className="mt-6 space-y-6">
              {/* Order Summary */}
              <div className="rounded-2xl border border-border-primary bg-bg-card p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-lighter">
                  Order Summary
                </h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Order Date:</span>
                    <span className="font-semibold text-primary-dark">
                      {selectedOrder.date}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Status:</span>
                    <span className="rounded-full bg-bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Tracking Number:</span>
                    <span className="font-semibold text-primary">
                      {selectedOrder.trackingNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="rounded-2xl border border-border-primary bg-bg-card p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-lighter">
                  Items
                </h3>
                <div className="mt-3 space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-border-primary pb-3 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="font-semibold text-primary-dark">{item.name}</p>
                        <p className="text-sm text-zinc-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-primary">{item.price}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border-primary pt-3">
                  <span className="text-base font-semibold text-primary-dark">
                    Total
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {selectedOrder.total}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="rounded-2xl border border-border-primary bg-bg-card p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-lighter">
                  Shipping Address
                </h3>
                <div className="mt-3 text-sm">
                  <p className="font-semibold text-primary-dark">
                    {selectedOrder.shippingAddress.name}
                  </p>
                  <p className="mt-1 text-zinc-500">
                    {selectedOrder.shippingAddress.phone}
                  </p>
                  <p className="mt-2 text-zinc-600">
                    {selectedOrder.shippingAddress.address}
                  </p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-2xl border border-border-primary bg-bg-card p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-lighter">
                  Payment Method
                </h3>
                <p className="mt-3 text-sm font-semibold text-primary-dark">
                  {selectedOrder.paymentMethod}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCloseOrderDetails}
                className="rounded-full border border-border-light px-6 py-2 text-sm font-semibold text-primary-dark hover:bg-bg-secondary transition"
              >
                Close
              </button>
              <button className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(77,156,44,0.25)] hover:bg-primary/90 transition">
                Track Order
              </button>
            </div>
          </div>
        </div>
      )}

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
                    : activeTab === "wishlist"
                    ? "Wishlist"
                    : "Address"}
                </h1>
              </div>
              {activeTab === "address" && (
                <button className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-primary transition hover:bg-bg-secondary">
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
