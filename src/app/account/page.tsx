"use client";

import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import ProfileForm from "@/components/account/ProfileForm";

export default function AccountPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <main className="min-h-screen bg-black px-8 py-24 text-white">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-[#222] bg-[#090909] p-10 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">My Account</p>
          <h1 className="mt-5 font-serif text-5xl">Please sign in</h1>
          <p className="mt-6 text-gray-400">Access your orders, wishlist, and profile from one place.</p>
          <Link href="/login" className="mt-8 inline-block rounded-xl bg-[#D4AF37] px-8 py-4 font-semibold text-black">
            Continue to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-8 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">My Account</p>
        <h1 className="mt-5 font-serif text-6xl">Dashboard</h1>

        <div className="mt-10 rounded-[32px] border border-[#222] bg-[#090909] p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-gray-500">Welcome back</p>
              <h2 className="mt-2 font-serif text-3xl">{user.name}</h2>
              <p className="mt-2 text-gray-400">{user.email}</p>
            </div>
            <button onClick={logout} className="rounded-xl border border-red-500 px-6 py-3 text-red-400 transition hover:bg-red-500/10">
              Logout
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <Link href="/orders" className="rounded-3xl border border-[#222] bg-[#090909] p-8 transition hover:border-[#D4AF37]">
            <h2 className="text-2xl">Orders</h2>
            <p className="mt-4 text-gray-400">Review past purchases and current delivery status.</p>
          </Link>

          <Link href="/wishlist" className="rounded-3xl border border-[#222] bg-[#090909] p-8 transition hover:border-[#D4AF37]">
            <h2 className="text-2xl">Wishlist</h2>
            <p className="mt-4 text-gray-400">Save your favourite pieces for later.</p>
          </Link>

          <div className="rounded-3xl border border-[#222] bg-[#090909] p-8">
            <h2 className="text-2xl">Profile</h2>
            <p className="mt-4 text-gray-400">Account details are managed locally for the current demo experience.</p>
          </div>
        </div>

        <div className="mt-12">
          <ProfileForm />
        </div>
      </div>
    </main>
  );
}