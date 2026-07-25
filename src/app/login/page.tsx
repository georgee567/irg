"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    login({
      name,
      email,
    });

    router.push("/account");
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-[#222] bg-[#090909] p-10">

        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Welcome Back
        </p>

        <h1 className="mt-4 font-serif text-5xl">
          Login
        </h1>

        <form
          onSubmit={handleLogin}
          className="mt-10 space-y-6"
        >
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-[#222] bg-black p-4 outline-none focus:border-[#D4AF37]"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[#222] bg-black p-4 outline-none focus:border-[#D4AF37]"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-[#D4AF37] py-4 font-semibold text-black hover:opacity-90"
          >
            Login
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-[#D4AF37]"
          >
            Register
          </Link>
        </p>

      </div>
    </main>
  );
}