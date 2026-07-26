"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-8">

      <div className="w-full max-w-md rounded-[32px] border border-[#222] bg-[#090909] p-10">

        <p className="text-center text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Join IRG
        </p>

        <h1 className="mt-5 text-center font-serif text-5xl text-white">
          Create Account
        </h1>

        <div className="mt-10 space-y-6">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-xl border border-[#222] bg-black px-5 py-4 text-white outline-none focus:border-[#D4AF37]"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-[#222] bg-black px-5 py-4 text-white outline-none focus:border-[#D4AF37]"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-[#222] bg-black px-5 py-4 text-white outline-none focus:border-[#D4AF37]"
          />

          <button className="w-full rounded-xl bg-[#D4AF37] py-4 font-semibold text-black transition hover:opacity-90">
            Create Account
          </button>

        </div>

        <p className="mt-8 text-center text-gray-400">

          Already have an account?{" "}

          <Link
            href="/account/login"
            className="text-[#D4AF37]"
          >
            Login
          </Link>

        </p>

      </div>

    </main>
  );
}