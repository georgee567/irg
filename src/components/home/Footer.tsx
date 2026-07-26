"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#1b1b1b] bg-black">

      <div className="mx-auto grid max-w-7xl gap-12 px-8 py-20 md:grid-cols-4">

        <div>

          <h2 className="font-serif text-5xl tracking-[0.25em] text-[#D4AF37]">
            IRG
          </h2>

          <p className="mt-6 leading-8 text-gray-400">
            Premium luxury streetwear inspired by confidence,
            identity and timeless fashion.
          </p>

        </div>

        <div>

          <h3 className="mb-6 font-semibold uppercase tracking-[0.25em] text-white">
            Shop
          </h3>

          <div className="space-y-3 text-gray-400">

            <Link href="/shop" className="block hover:text-[#D4AF37]">Men</Link>
            <Link href="/shop" className="block hover:text-[#D4AF37]">Women</Link>
            <Link href="/shop" className="block hover:text-[#D4AF37]">Accessories</Link>

          </div>

        </div>

        <div>

          <h3 className="mb-6 font-semibold uppercase tracking-[0.25em] text-white">
            Company
          </h3>

          <div className="space-y-3 text-gray-400">

            <Link href="/about" className="block hover:text-[#D4AF37]">About</Link>
            <Link href="/journal" className="block hover:text-[#D4AF37]">Journal</Link>
            <Link href="/contact" className="block hover:text-[#D4AF37]">Contact</Link>

          </div>

        </div>

        <div>

          <h3 className="mb-6 font-semibold uppercase tracking-[0.25em] text-white">
            Contact
          </h3>

          <div className="space-y-3 text-gray-400">

            <p>Kenya</p>
            <p>info@irg.com</p>
            <p>+254 XXX XXX XXX</p>

          </div>

        </div>

      </div>

      <div className="border-t border-[#191919] py-6 text-center text-sm text-gray-500">
        © 2026 IRG. All Rights Reserved.
      </div>

    </footer>
  );
}