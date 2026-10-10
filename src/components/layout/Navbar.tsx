
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import BrandLogo from "@/components/layout/BrandLogo";
import type { SiteContent } from "@/lib/site-content";

const links = [
  { key: "navHome", name: "Home", href: "/" },
  { key: "navCollections", name: "Collections", href: "/collections" },
  { key: "navShop", name: "Shop", href: "/shop" },
  { key: "navAbout", name: "About", href: "/about" },
  { key: "navLookbook", name: "Lookbook", href: "/lookbook" },
  { key: "navCustom", name: "Custom", href: "/custom" },
  { key: "navJournal", name: "Journal", href: "/journal" },
  { key: "navWishlist", name: "Wishlist", href: "/wishlist" },
  { key: "navContact", name: "Contact", href: "/contact" },
];

export default function Navbar({ content }: { content: SiteContent }) {
  const router = useRouter();
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (search.trim()) {
      setMenuOpen(false);
      router.push("/search");
    }
  };

  const handleMobileNavigation = () => {
    setMenuOpen(false);
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="relative sticky top-0 z-50 border-b border-[#191919] bg-black/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[88px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <BrandLogo className="mr-2" />

        <nav className="hidden flex-1 items-center justify-center xl:flex">
          <div className="flex items-center gap-5 lg:gap-7">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[10px] uppercase tracking-[0.22em] text-white transition hover:text-[#D4AF37]"
              >
                {content[link.key] || link.name}
              </Link>
            ))}
          </div>
        </nav>

        <div className="hidden items-center gap-3 lg:flex xl:gap-4">
          <div className="relative hidden w-[220px] xl:block">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={content.searchPlaceholder}
                className="w-full rounded-full border border-[#222] bg-[#090909] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition focus:border-[#D4AF37]"
              />
            </form>
          </div>

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

          {!user ? (
            <Link
              href="/login"
              className="rounded-full border border-[#D4AF37] px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
            >
              {content.joinLabel}
            </Link>
          ) : (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-2 rounded-full border border-[#222] px-3 py-2 text-sm text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                <User size={16} />

                <span className="max-w-[100px] truncate">{user.name}</span>

                <ChevronDown size={14} />
              </button>

              {accountOpen && (
                <div className="absolute right-0 z-[60] mt-3 w-64 rounded-2xl border border-[#222] bg-[#090909] p-3 shadow-2xl">
                  <Link
                    href={user.role === "ADMIN" ? "/admin" : "/account"}
                    className="block rounded-lg px-4 py-3 hover:bg-[#111]"
                  >
                    {user.role === "ADMIN" ? content.adminDashboardLabel : content.accountLabel}
                  </Link>

                  <Link
                    href="/orders"
                    className="block rounded-lg px-4 py-3 hover:bg-[#111]"
                  >
                    {content.ordersLabel}
                  </Link>

                  <Link
                    href="/wishlist"
                    className="block rounded-lg px-4 py-3 hover:bg-[#111]"
                  >
                    {content.navWishlist}
                  </Link>

                  <button
                    onClick={logout}
                    className="mt-3 w-full rounded-xl border border-red-500 py-3 text-red-500"
                  >
                    {content.logoutLabel}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
         onClick={() => {
  console.log("HAMBURGER CLICKED");
  setMenuOpen((previous) => !previous);
}}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#222] text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37] xl:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-navigation"
          className="relative z-[55] border-t border-[#1b1b1b] bg-black shadow-2xl xl:hidden"
        >
          <div className="mx-auto flex max-h-[calc(100vh-88px)] max-w-7xl flex-col overflow-y-auto px-4 py-4 sm:px-6 lg:px-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={handleMobileNavigation}
                className="border-b border-[#151515] px-2 py-4 text-sm uppercase tracking-[0.25em] text-white transition hover:text-[#D4AF37]"
              >
                {content[link.key] || link.name}
              </Link>
            ))}

            <div className="mt-2 flex items-center gap-3 border-t border-[#151515] pt-4">
              {!user && (
                <Link
                  href="/login"
                  onClick={handleMobileNavigation}
                  className="text-sm uppercase tracking-[0.25em] text-[#D4AF37]"
                >
                  {content.loginLabel}
                </Link>
              )}

              <Link
                href="/wishlist"
                onClick={handleMobileNavigation}
                className="text-sm uppercase tracking-[0.25em] text-white transition hover:text-[#D4AF37]"
              >
                {content.navWishlist}
              </Link>

              <Link
                href="/cart"
                onClick={handleMobileNavigation}
                className="text-sm uppercase tracking-[0.25em] text-white transition hover:text-[#D4AF37]"
              >
                {content.cartLabel}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}