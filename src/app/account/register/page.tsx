"use client";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-xl px-8 py-24">

        <h1 className="font-serif text-5xl">
          Create Account
        </h1>

        <div className="mt-12 space-y-5">

          <input
            placeholder="Full Name"
            className="w-full rounded-xl border border-[#222] bg-[#090909] p-5"
          />

          <input
            placeholder="Email"
            className="w-full rounded-xl border border-[#222] bg-[#090909] p-5"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-[#222] bg-[#090909] p-5"
          />

          <button className="w-full rounded-xl bg-[#D4AF37] py-4 font-semibold text-black">
            Create Account
          </button>

        </div>

      </div>

    </main>
  );
}