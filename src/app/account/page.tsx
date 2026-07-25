"use client";

import Link from "next/link";

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-6xl px-8 py-20">

        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          My Account
        </p>

        <h1 className="mt-4 font-serif text-6xl">
          Welcome to IRG
        </h1>

        <div className="mt-16 grid gap-8 md:grid-cols-2">

          <Link
            href="/account/login"
            className="rounded-3xl border border-[#222] bg-[#090909] p-10 transition hover:border-[#D4AF37]"
          >
            <h2 className="font-serif text-3xl">
              Login
            </h2>

            <p className="mt-4 text-gray-400">
              Access your orders, wishlist and account.
            </p>
          </Link>

          <Link
            href="/account/register"
            className="rounded-3xl border border-[#222] bg-[#090909] p-10 transition hover:border-[#D4AF37]"
          >
            <h2 className="font-serif text-3xl">
              Create Account
            </h2>

            <p className="mt-4 text-gray-400">
              Join IRG and enjoy premium shopping.
            </p>
          </Link>

        </div>

      </div>

    </main>
  );
}