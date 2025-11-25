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
  },
  {
    id: "INV-20487",
    date: "December 22, 2024",
    total: "₹2,199",
    status: "Delivered",
    summary: "Premium Spice Bundle",
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

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <form
            onSubmit={handleProfileSubmit}
            className="space-y-5 text-sm text-[#355B20]"
          >
            <fieldset
              disabled={!isEditingProfile}
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
                  <p className="text-xs uppercase tracking-[0.3em] text-[#A1B293]">
                    Gender
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {["female", "male", "other"].map((option) => (
                      <label
                        key={option}
                        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold capitalize transition ${
                          profileDraft.gender === option
                            ? "border-[#4D9C2C] text-[#355B20]"
                            : "border-[#E6EEDF] text-zinc-500"
                        } ${!isEditingProfile ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={option}
                          checked={profileDraft.gender === option}
                          onChange={handleProfileChange}
                          disabled={!isEditingProfile}
                          className="text-[#4D9C2C]"
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
            </fieldset>
            <div className="flex justify-end gap-3">
              {isEditingProfile && (
                <button
                  type="button"
                  onClick={cancelEditingProfile}
                  className="rounded-full border border-[#D6E9C6] px-6 py-2 text-sm font-semibold text-[#355B20]"
                >
                  Cancel
                </button>
              )}
              {isEditingProfile ? (
                <button
                  type="submit"
                  className="rounded-full bg-[#4D9C2C] px-6 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(77,156,44,0.25)]"
                >
                  Save Profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startEditingProfile}
                  className="rounded-full bg-[#4D9C2C] px-6 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(77,156,44,0.25)]"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        );
      case "orders":
        return (
          <div className="space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="flex flex-col rounded-2xl border border-[#E6EEDF] bg-[#FDFEFE] p-4 text-sm text-[#355B20] md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-base font-semibold">{order.summary}</p>
                  <p className="mt-1 text-zinc-500">
                    {order.date} • Order {order.id}
                  </p>
                  <p className="mt-2 font-semibold text-[#4D9C2C]">{order.total}</p>
                </div>
                <div className="mt-4 flex items-center gap-3 md:mt-0">
                  <span className="rounded-full bg-[#F6FCEA] px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#4D9C2C]">
                    {order.status}
                  </span>
                  <button className="rounded-full border border-[#D6E9C6] px-5 py-2 text-sm font-semibold text-[#355B20]">
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
            <div className="rounded-2xl border border-[#E6EEDF] bg-[#FDFEFE] p-6 text-center text-sm text-zinc-500">
              No wishlist items yet.{" "}
              <Link href="/shop-now" className="text-[#4D9C2C] underline">
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
                className="rounded-2xl border border-[#E6EEDF] bg-[#FDFEFE] p-4 text-sm text-[#355B20]"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-[#4D9C2C]/70">
                  {product.category}
                </p>
                <p className="mt-1 text-lg font-semibold">{product.name}</p>
                <p className="mt-2 text-[#4D9C2C]">₹{product.price}</p>
                <button className="mt-4 w-full rounded-full border border-[#4D9C2C] px-4 py-2 text-sm font-semibold text-[#4D9C2C] hover:bg-[#4D9C2C] hover:text-white">
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
                className="flex flex-col gap-4 rounded-2xl border border-[#E6EEDF] bg-[#FDFEFE] p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <p className="text-base font-semibold text-[#355B20]">
                    {entry.name} <span className="text-zinc-400">|</span>{" "}
                    <span className="text-[#355B20]">{entry.phone}</span>{" "}
                    <span className="text-zinc-400">|</span>{" "}
                    <span className="font-normal text-[#4D9C2C]">{entry.label}</span>
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-zinc-500">
                    {entry.lines.map((line, index) => (
                      <p key={`${entry.id}-${index}`}>{line}</p>
                    ))}
                  </div>
                </div>
                <button className="h-10 rounded-full border border-[#D6E9C6] px-6 text-sm font-semibold text-[#355B20] transition hover:bg-[#F6FCEA]">
                  Edit
                </button>
              </article>
            ))}
          </div>
        );
    }
  };

  return (
    <main className="bg-white text-[#355B20]">
      <section className="mx-auto max-w-[1300px] px-6 py-10">
        <nav className="text-sm text-zinc-500">
          <Link href="/" className="text-[#4D9C2C] hover:underline">
            Home
          </Link>{" "}
          <span className="mx-2 text-zinc-400">/</span>
          <span className="font-medium text-zinc-700">Profile</span>
        </nav>

        <div className="mt-8 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-[#E6EEDF] bg-white p-6 shadow-[0_6px_20px_rgba(77,156,44,0.06)]">
            <div>
              <p className="text-lg font-semibold text-[#355B20]">My Profile</p>
              <p className="mt-1 text-sm text-zinc-500">Manage your account setting</p>
            </div>
            <ul className="mt-6 space-y-3 text-sm font-semibold text-[#355B20]">
              {profileMenu.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => handleTabChange(item.value)}
                    className={`flex w-full items-center justify-between rounded-2xl border border-transparent px-4 py-3 text-left transition ${
                      activeTab === item.value
                        ? "border-[#E4F5D7] bg-[#F6FCEA] text-[#3A5D22]"
                        : "text-[#6C7D5A] hover:border-[#E4F5D7] hover:bg-[#FBFEF7]"
                    }`}
                  >
                    <span>{item.label}</span>
                    {activeTab === item.value && (
                      <span className="text-xs font-bold text-[#A4C769]">●</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="rounded-3xl border border-[#E6EEDF] bg-white p-6 shadow-[0_6px_20px_rgba(77,156,44,0.06)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#A1B293]">
                  {activeTab}
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-[#355B20]">
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
                <button className="rounded-full border border-[#D6E9C6] px-5 py-2 text-sm font-semibold text-[#4D9C2C] transition hover:bg-[#F6FCEA]">
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
      <label className="block rounded-2xl border border-[#E6EEDF] px-5 py-4">
        <span className="text-xs uppercase tracking-[0.3em] text-[#A1B293]">{label}</span>
        <input
          ref={ref}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="mt-2 w-full border-none bg-transparent text-base font-semibold text-[#355B20] outline-none disabled:text-zinc-500"
        />
      </label>
    );
  }
);

ProfileInput.displayName = "ProfileInput";
