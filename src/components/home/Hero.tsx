"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden bg-black">

      {/* Background */}

      <Image
        src="/images/hero-model.jpeg"
        alt="IRG Hero"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Overlay */}

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-black/25" />

      {/* Gold Glow */}

      <div className="absolute right-0 top-1/2 h-[750px] w-[750px] -translate-y-1/2 rounded-full bg-[#D4AF37]/10 blur-[170px]" />

      {/* Hero */}

      <div className="relative z-20 mx-auto flex h-full max-w-7xl items-center px-8">

        <div className="max-w-2xl">

          <div className="mb-8 inline-flex rounded-full border border-[#D4AF37]/30 bg-black/40 px-6 py-3 backdrop-blur-xl">

            <span className="text-[11px] uppercase tracking-[0.45em] text-[#D4AF37]">
              Luxury Streetwear • Est. 2026
            </span>

          </div>

          <h1 className="font-serif text-5xl font-semibold leading-[0.9] text-white md:text-7xl xl:text-8xl">

            Wear
            <br />
            Your Identity

          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-gray-300">

            Premium luxury streetwear crafted for creators,
            visionaries and trendsetters.

          </p>

          <div className="mt-12 flex flex-wrap items-center gap-6">

            <Link
              href="/shop"
              className="rounded-md bg-[#D4AF37] px-9 py-4 font-semibold text-black transition duration-300 hover:scale-105"
            >
              Shop Now
            </Link>

            <Link
              href="/about"
              className="rounded-md border border-white/30 bg-white/10 px-9 py-4 font-semibold text-white backdrop-blur-md transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              Explore Luxury
            </Link>

          </div>

        </div>

      </div>

      {/* Floating Cards */}

      <div className="absolute bottom-24 right-10 z-30 hidden xl:flex flex-col gap-6">

        <div className="w-64 rounded-3xl border border-[#D4AF37]/20 bg-black/45 p-6 backdrop-blur-xl">

          <p className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37]">
            New Collection
          </p>

          <h3 className="mt-3 font-serif text-3xl text-white">
            Summer 2026
          </h3>

          <p className="mt-3 text-sm leading-7 text-gray-400">
            Discover timeless luxury inspired by modern street culture.
          </p>

        </div>

        <div className="rounded-3xl border border-[#222] bg-black/45 p-6 backdrop-blur-xl">

          <div className="grid grid-cols-2 gap-8">

            <div>

              <h2 className="text-3xl font-bold text-[#D4AF37]">
                50+
              </h2>

              <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-gray-400">
                Products
              </p>

            </div>

            <div>

              <h2 className="text-3xl font-bold text-[#D4AF37]">
                20K+
              </h2>

              <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-gray-400">
                Customers
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Scroll */}

      <div className="absolute bottom-14 left-1/2 z-30 -translate-x-1/2">

        <div className="h-14 w-px bg-[#D4AF37]" />

      </div>

      {/* Bottom Fade */}

      <div className="absolute bottom-0 left-0 h-48 w-full bg-gradient-to-t from-black to-transparent" />

    </section>
  );
}