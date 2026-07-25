"use client";

import ProfileForm from "@/components/account/ProfileForm";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-5xl px-8 py-20">

        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Account
        </p>

        <h1 className="mt-4 font-serif text-6xl">
          Welcome, {user.name}
        </h1>

        <div className="mt-16">
          <ProfileForm />
        </div>

      </div>

    </main>
  );
}