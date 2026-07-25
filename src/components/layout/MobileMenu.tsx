"use client";

import Link from "next/link";
import { X } from "lucide-react";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const links = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Men", href: "/shop?category=Men" },
  { name: "Women", href: "/shop?category=Women" },
  { name: "Accessories", href: "/shop?category=Accessories" },
  { name: "Wishlist", href: "/wishlist" },
  { name: "Cart", href: "/cart" },
  { name: "Account", href: "/account" },
];

export default function MobileMenu({
  open,
  onClose,
}: MobileMenuProps) {
  return (
    <div
      className={`fixed inset-0 z-[999] transition-all duration-300 ${
        open
          ? "pointer-events-auto bg-black/70 backdrop-blur-md"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className={`absolute right-0 top-0 h-full w-[320px] bg-[#050505] border-l border-[#222] transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#222] p-6">

          <h2 className="font-serif text-3xl text-[#D4AF37]">
            IRG
          </h2>

          <button onClick={onClose}>
            <X className="text-white" size={28} />
          </button>

        </div>

        <div className="flex flex-col p-6">

          {links.map((link) => (

            <Link
              key={link.name}
              href={link.href}
              onClick={onClose}
              className="border-b border-[#161616] py-5 text-lg transition hover:text-[#D4AF37]"
            >
              {link.name}
            </Link>

          ))}

        </div>
      </div>
    </div>
  );
}