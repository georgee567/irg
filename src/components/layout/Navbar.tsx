"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useSearch } from "@/context/SearchContext";

const links = [
  { name: "Home", href: "/" },
  { name: "Collections", href: "/collections" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Lookbook", href: "/lookbook" },
  { name: "Custom", href: "/custom" },
  { name: "Journal", href: "/journal" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const { search, setSearch } = useSearch();

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setAccountOpen(false);
      }
    }

    document.addEventListener("mousedown", close);

    return () => {
      document.removeEventListener("mousedown", close);
    };
  }, []);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[#191919] bg-black/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[88px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* IRG WORD LOGO */}
        <Link
  href="/"
  aria-label="IRG Home"
  className="shrink-0 font-serif text-5xl font-medium leading-[0.85] tracking-[0.015em] text-[#D4AF37]"
>
  IRG
</Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden flex-1 items-center justify-center xl:flex">
          <div className="flex items-center gap-6 lg:gap-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[11px] uppercase tracking-[0.28em] text-white transition hover:text-[#D4AF37]"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-3 lg:flex xl:gap-5">

          {/* SEARCH */}
          <div className="relative hidden w-[220px] xl:block">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search..."
              className="w-full rounded-full border border-[#222] bg-[#090909] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition focus:border-[#D4AF37]"
            />
          </div>

          {/* WISHLIST */}
          <Link
            href="/wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#222] text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            <Heart size={18} />

            {wishlist.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-black">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* CART */}
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#222] text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            <ShoppingBag size={18} />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-black">
                {cartCount}
              </span>
            )}
          </Link>

          {/* AUTH */}
          {!user ? (
            <Link
              href="/login"
              className="rounded-full border border-[#D4AF37] px-5 py-2 text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
            >
              Join IRG
            </Link>
          ) : (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-2 rounded-full border border-[#222] px-3 py-2 text-sm text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                <User size={16} />

                <span className="max-w-[100px] truncate">
                  {user.name}
                </span>

                <ChevronDown size={14} />
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-[#222] bg-[#090909] p-3 shadow-2xl">

                  <Link
                    href="/account"
                    className="block rounded-lg px-4 py-3 hover:bg-[#111]"
                  >
                    Account
                  </Link>

                  <Link
                    href="/orders"
                    className="block rounded-lg px-4 py-3 hover:bg-[#111]"
                  >
                    Orders
                  </Link>

                  <Link
                    href="/wishlist"
                    className="block rounded-lg px-4 py-3 hover:bg-[#111]"
                  >
                    Wishlist
                  </Link>

                  <button
                    onClick={logout}
                    className="mt-3 w-full rounded-xl border border-red-500 py-3 text-red-500"
                  >
                    Logout
                  </button>

                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#222] text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37] xl:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="border-t border-[#1b1b1b] bg-black xl:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">

            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-[#151515] px-2 py-4 text-sm uppercase tracking-[0.25em]"
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-2 flex items-center gap-3 border-t border-[#151515] pt-4">

              <Link
                href="/login"
                className="text-sm uppercase tracking-[0.25em] text-[#D4AF37]"
              >
                Login
              </Link>

              <Link
                href="/wishlist"
                className="text-sm uppercase tracking-[0.25em] text-white"
              >
                Wishlist
              </Link>

              <Link
                href="/cart"
                className="text-sm uppercase tracking-[0.25em] text-white"
              >
                Cart
              </Link>

            </div>
          </div>
        </div>
      )}
    </header>
  );
}