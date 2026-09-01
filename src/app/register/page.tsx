"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading, register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/account");
    }
  }, [loading, router, user]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!name || !email || !password) {
      setError(
        "Please fill in your name, email, and password."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    try {
      setSubmitting(true);

      await register(name, email, password);

      router.replace("/account");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create account."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const handleSocialSignIn = (provider: string) => {
    console.info(
      `${provider} social sign-in is ready for configuration once OAuth credentials are added.`
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-8 py-24">
      <div className="w-full max-w-md rounded-[32px] border border-[#222] bg-[#090909] p-10">
        <p className="text-center text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Join IRG
        </p>

        <h1 className="mt-5 text-center font-serif text-5xl text-white">
          Create Account
        </h1>

        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[#222]" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-[#222]" />
          </div>

          <button
            type="button"
            onClick={() => handleSocialSignIn("Google")}
            className="w-full rounded-xl border border-[#333] bg-[#111] px-5 py-3 text-sm font-medium text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignIn("Facebook")}
            className="w-full rounded-xl border border-[#333] bg-[#111] px-5 py-3 text-sm font-medium text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            Continue with Facebook
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >
          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Full Name"
            autoComplete="name"
            disabled={submitting}
            className="w-full rounded-xl border border-[#222] bg-black px-5 py-4 text-white outline-none focus:border-[#D4AF37] disabled:opacity-50"
          />

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Email"
            autoComplete="email"
            disabled={submitting}
            className="w-full rounded-xl border border-[#222] bg-black px-5 py-4 text-white outline-none focus:border-[#D4AF37] disabled:opacity-50"
          />

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Password"
            autoComplete="new-password"
            disabled={submitting}
            className="w-full rounded-xl border border-[#222] bg-black px-5 py-4 text-white outline-none focus:border-[#D4AF37] disabled:opacity-50"
          />

          {error ? (
            <p className="text-sm text-red-400">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#D4AF37] py-4 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Social sign-in is ready for OAuth credentials once configured.
        </p>

        <p className="mt-8 text-center text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#D4AF37]"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}