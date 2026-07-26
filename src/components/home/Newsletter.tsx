"use client";

export default function Newsletter() {
  return (
    <section className="bg-black py-28">

      <div className="mx-auto max-w-5xl rounded-[40px] border border-[#222] bg-[#090909] px-10 py-20 text-center">

        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Join IRG
        </p>

        <h2 className="mt-5 font-serif text-5xl text-white">
          Become Part Of The Movement
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
          Receive exclusive drops, limited editions, early access and premium offers.
        </p>

        <div className="mx-auto mt-12 flex max-w-2xl gap-4">

          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-full border border-[#222] bg-black px-7 py-4 text-white outline-none focus:border-[#D4AF37]"
          />

          <button className="rounded-full bg-[#D4AF37] px-8 font-semibold text-black transition hover:scale-105">
            Subscribe
          </button>

        </div>

      </div>

    </section>
  );
}