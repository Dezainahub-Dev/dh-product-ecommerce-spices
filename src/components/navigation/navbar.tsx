'use client';

import { SearchIcon, BagIcon, UserIcon, HeartIcon } from "@/components/icons";
import { BrandLogo } from "@/components/navigation/logo";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useRef } from "react";

const navLinks = [
  { label: "Home", href: "#", isActive: true },
  { label: "Spices", href: "/shop-now" },
  { label: "Nuts & Seeds", href: "#nuts" },
  { label: "Contact Us", href: "#contact" },
];

export function Navbar() {
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const { isAuthenticated, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  return (
    <header className="border-b border-zinc-100 bg-white">
      <div className="flex h-20 w-full items-center justify-between gap-8 pl-8 pr-6">
        <div className="flex flex-1 items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="AvaNora"
          >
            <BrandLogo />
          </Link>

          <nav className="flex items-center gap-2">
            {navLinks.map((link) => (
              <NavLink key={link.label} {...link} />
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-5 text-zinc-500">
          <button
            type="button"
            className="text-zinc-500 transition-colors hover:text-emerald-700"
            aria-label="Search"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <Link
            href="/wishlist"
            className="relative text-zinc-500 transition-colors hover:text-emerald-700"
            aria-label="Wishlist"
          >
            <HeartIcon className="h-5 w-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute -right-2 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#F97316] px-1 text-xs font-semibold text-white">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className="relative text-zinc-500 transition-colors hover:text-emerald-700"
            aria-label="Shopping cart"
          >
            <BagIcon className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#4D9C2C] px-1 text-xs font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <div className="h-6 w-px bg-zinc-200" aria-hidden="true" />

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 rounded-full border border-emerald-200 px-4 py-2 text-emerald-700 transition hover:border-emerald-400 hover:text-emerald-800"
              >
                <UserIcon className="h-4 w-4" />
                <span>{user?.firstName || 'Account'}</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-border-primary bg-white shadow-lg">
                  <div className="p-3 border-b border-border-primary">
                    <p className="text-sm font-semibold text-primary-dark truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="block w-full rounded-xl px-4 py-2 text-left text-sm font-medium text-primary-dark hover:bg-bg-secondary transition"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setShowDropdown(false)}
                      className="block w-full rounded-xl px-4 py-2 text-left text-sm font-medium text-primary-dark hover:bg-bg-secondary transition"
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full rounded-xl px-4 py-2 text-left text-sm font-medium text-accent-red hover:bg-accent-red-bg transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-full border border-emerald-200 px-4 py-2 text-emerald-700 transition hover:border-emerald-400 hover:text-emerald-800"
            >
              <UserIcon className="h-4 w-4" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

type NavLinkProps = {
  label: string;
  href: string;
  isActive?: boolean;
};

function NavLink({ label, href, isActive }: NavLinkProps) {
  const baseStyles =
    "rounded-full px-4 py-2 text-sm font-medium transition-colors";

  if (isActive) {
    return (
      <Link
        href={href}
        className={`${baseStyles} bg-emerald-50 text-emerald-700`}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseStyles} text-zinc-700 hover:text-emerald-700`}
    >
      {label}
    </Link>
  );
}
