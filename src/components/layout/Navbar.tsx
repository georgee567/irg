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

    return () =>
      document.removeEventListener("mousedown", close);
  }, []);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[#1b1b1b] bg-black/95 backdrop-blur-2xl">

      <div className="mx-auto flex h-20 max-w-[1700px] items-center justify-between px-8">

        {/* Logo */}

        <Link
          href="/"
          className="font-serif text-4xl tracking-[0.22em] text-[#D4AF37]"
        >
          IRG
        </Link>

        {/* Desktop Navigation */}

        <nav className="hidden xl:flex items-center gap-8">

          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[12px] uppercase tracking-[0.20em] text-white transition duration-300 hover:text-[#D4AF37]"
            >
              {link.name}
            </Link>
          ))}

        </nav>

        {/* Right Side */}

        <div className="hidden lg:flex items-center gap-5">

          {/* Search */}

          <div className="relative w-[250px]">

            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-full border border-[#222] bg-[#090909] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition focus:border-[#D4AF37]"
            />

          </div>

          {/* Wishlist */}

          <Link
            href="/wishlist"
            className="relative transition hover:text-[#D4AF37]"
          >
            <Heart size={20} />

            {wishlist.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-black">
                {wishlist.length}
              </span>
            )}

          </Link>

          {/* Cart */}

          <Link
            href="/cart"
            className="relative transition hover:text-[#D4AF37]"
          >
            <ShoppingBag size={20} />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-black">
                {cartCount}
              </span>
            )}

          </Link>

          {/* Account */}

          {!user ? (
            <Link
              href="/login"
              className="rounded-full border border-[#D4AF37] px-6 py-2.5 text-[12px] uppercase tracking-[0.2em] text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
            >
              Join IRG
            </Link>
          ) : (
            <div
              ref={dropdownRef}
              className="relative"
            >
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-2"
              >
                <User size={18} />

                <span className="text-sm">
                  {user.name}
                </span>

                <ChevronDown size={15} />
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-5 w-64 rounded-3xl border border-[#222] bg-[#090909] p-3 shadow-2xl">

                  <Link
                    href="/account"
                    className="block rounded-xl px-4 py-3 hover:bg-[#111]"
                  >
                    My Account
                  </Link>

                  <Link
                    href="/orders"
                    className="block rounded-xl px-4 py-3 hover:bg-[#111]"
                  >
                    Orders
                  </Link>

                  <Link
                    href="/wishlist"
                    className="block rounded-xl px-4 py-3 hover:bg-[#111]"
                  >
                    Wishlist
                  </Link>

                  <button
                    onClick={logout}
                    className="mt-3 w-full rounded-xl border border-red-500 py-3 text-red-500 transition hover:bg-red-500 hover:text-white"
                  >
                    Logout
                  </button>

                </div>
              )}

            </div>
          )}

        </div>

        {/* Mobile */}

        <button
          className="xl:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>

      </div>

      {menuOpen && (

        <div className="border-t border-[#1d1d1d] bg-black xl:hidden">

          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block border-b border-[#151515] px-8 py-5 uppercase tracking-[0.2em] hover:bg-[#111]"
            >
              {link.name}
            </Link>
          ))}

        </div>

      )}

    </header>
  );
}