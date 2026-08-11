"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.replace("/account");
    }
  }, [router, user]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name || !email || !password) {
      setError("Please fill in your name, email, and password.");
      return;
    }

    login({
      name,
      email,
      phone: "",
      county: "",
      city: "",
      address: "",
    });

    router.push("/account");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-8 py-24">
      <div className="w-full max-w-md rounded-[32px] border border-[#222] bg-[#090909] p-10">
        <p className="text-center text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Join IRG
        </p>
        <h1 className="mt-5 text-center font-serif text-5xl text-white">Create Account</h1>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Full Name"
            className="w-full rounded-xl border border-[#222] bg-black px-5 py-4 text-white outline-none focus:border-[#D4AF37]"
          />

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-[#222] bg-black px-5 py-4 text-white outline-none focus:border-[#D4AF37]"
          />

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-[#222] bg-black px-5 py-4 text-white outline-none focus:border-[#D4AF37]"
          />

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-[#D4AF37] py-4 font-semibold text-black transition hover:opacity-90"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-[#D4AF37]">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
