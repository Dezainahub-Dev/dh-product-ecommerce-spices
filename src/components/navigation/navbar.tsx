'use client';

import { SearchIcon, BagIcon, UserIcon, HeartIcon } from "@/components/icons";
import { BrandLogo } from "@/components/navigation/logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useRef } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Spices", href: "/shop-now?category=spices" },
  { label: "Nuts & Seeds", href: "/shop-now?category=nuts-seeds" },
  { label: "Contact Us", href: "#contact" },
];

export function Navbar() {
  const pathname = usePathname();
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
              <NavLink key={link.label} {...link} pathname={pathname} />
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-5 text-zinc-500">
          <button
            type="button"
            className="text-zinc-500 transition-colors hover:text-[var(--color-primary)]"
            aria-label="Search"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <Link
            href="/wishlist"
            className="relative text-zinc-500 transition-colors hover:text-[var(--color-primary)]"
            aria-label="Wishlist"
          >
            <HeartIcon className="h-5 w-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute -right-2 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--color-accent-orange)] px-1 text-xs font-semibold text-white">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className="relative text-zinc-500 transition-colors hover:text-[var(--color-primary)]"
            aria-label="Shopping cart"
          >
            <BagIcon className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-xs font-semibold text-white">
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
                className="flex items-center gap-2 rounded-full border border-[var(--color-border-light)] px-4 py-2 text-[var(--color-primary)] transition hover:border-[var(--color-primary-light)] hover:text-[var(--color-primary-dark)]"
              >
                <UserIcon className="h-4 w-4" />
                <span>{user?.firstName || 'Account'}</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-[--color-border-primary] bg-background shadow-lg">
                  <div className="p-3 border-b border-[--color-border-primary]">
                    <p className="text-sm font-semibold text-[--color-primary-dark] truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-[--color-text-muted] truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="block w-full rounded-xl px-4 py-2 text-left text-sm font-medium text-[--color-primary-dark] hover:bg-[--color-bg-secondary] transition"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setShowDropdown(false)}
                      className="block w-full rounded-xl px-4 py-2 text-left text-sm font-medium text-[--color-primary-dark] hover:bg-[--color-bg-secondary] transition"
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full rounded-xl px-4 py-2 text-left text-sm font-medium text-[--color-accent-red] hover:bg-[--color-accent-red-bg] transition"
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
              className="flex items-center gap-2 rounded-full border border-[var(--color-border-light)] px-4 py-2 text-[var(--color-primary)] transition hover:border-[var(--color-primary-light)] hover:text-[var(--color-primary-dark)]"
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
  pathname: string;
};

function NavLink({ label, href, pathname }: NavLinkProps) {
  const baseStyles =
    "rounded-full px-4 py-2 text-sm font-medium transition-colors";

  // Determine if the link is active based on the current pathname
  const isActive = pathname === href ||
                   (href.startsWith('/shop-now') && pathname.startsWith('/shop-now'));

  if (isActive) {
    return (
      <Link
        href={href}
        className={`${baseStyles} bg-[var(--color-bg-secondary)] text-[var(--color-primary)]`}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseStyles} text-zinc-700 hover:text-[var(--color-primary)]`}
    >
      {label}
    </Link>
  );
}
