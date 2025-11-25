'use client';

import { SearchIcon, BagIcon, UserIcon, HeartIcon } from "@/components/icons";
import { BrandLogo } from "@/components/navigation/logo";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

const navLinks = [
  { label: "Home", href: "#", isActive: true },
  { label: "Spices", href: "/shop-now" },
  { label: "Nuts & Seeds", href: "#nuts" },
  { label: "Contact Us", href: "#contact" },
];

export function Navbar() {
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

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
            <span className="absolute -right-2 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#F97316] px-1 text-xs font-semibold text-white">
              {wishlistItems.length}
            </span>
          </Link>
          <Link
            href="/cart"
            className="relative text-zinc-500 transition-colors hover:text-emerald-700"
            aria-label="Shopping cart"
          >
            <BagIcon className="h-5 w-5" />
            <span className="absolute -right-2 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#4D9C2C] px-1 text-xs font-semibold text-white">
              {cartCount}
            </span>
          </Link>
          <div className="h-6 w-px bg-zinc-200" aria-hidden="true" />
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-emerald-200 px-4 py-2 text-emerald-700 transition hover:border-emerald-400 hover:text-emerald-800"
          >
            <UserIcon className="h-4 w-4" />
            <span>Account</span>
          </button>
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
