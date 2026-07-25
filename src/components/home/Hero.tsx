"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black">

      <Image
        src="/images/hero-model.png"
        alt="IRG"
        fill
        priority
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="absolute right-0 top-1/2 h-[700px] w-[700px] -translate-y-1/2 rounded-full bg-[#D4AF37]/10 blur-[170px]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-between px-8">

        <div className="max-w-2xl">

          <p className="text-xs uppercase tracking-[0.45em] text-[#D4AF37]">
            NEW COLLECTION 2026
          </p>

          <h1 className="mt-8 font-serif text-7xl leading-[0.9] text-white md:text-8xl">
            Wear
            <br />
            Your
            <br />
            Identity
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-9 text-gray-300">
            Luxury streetwear inspired by confidence,
            individuality and timeless design.
          </p>

          <div className="mt-12 flex gap-5">

            <button className="rounded-full bg-[#D4AF37] px-10 py-4 font-semibold text-black transition hover:scale-105">
              Shop Now
            </button>

            <button className="rounded-full border border-white/30 px-10 py-4 text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]">
              Explore Luxury
            </button>

          </div>

          <div className="mt-20 flex gap-16">

            <div>
              <h2 className="font-serif text-4xl text-[#D4AF37]">
                120+
              </h2>
              <p className="mt-2 text-gray-400">
                Products
              </p>
            </div>

            <div>
              <h2 className="font-serif text-4xl text-[#D4AF37]">
                15K+
              </h2>
              <p className="mt-2 text-gray-400">
                Customers
              </p>
            </div>

            <div>
              <h2 className="font-serif text-4xl text-[#D4AF37]">
                Global
              </h2>
              <p className="mt-2 text-gray-400">
                Shipping
              </p>
            </div>

          </div>

        </div>

        <div className="hidden lg:block">

          <div className="w-[330px] rounded-[35px] border border-[#2b2b2b] bg-black/40 p-8 backdrop-blur-xl">

            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
              IRG SIGNATURE
            </p>

            <h3 className="mt-5 font-serif text-3xl text-white">
              Premium
              <br />
              Street Luxury
            </h3>

            <p className="mt-6 leading-8 text-gray-400">
              Discover timeless fashion built with premium fabrics,
              modern silhouettes and luxury craftsmanship.
            </p>

            <button className="mt-8 w-full rounded-full bg-[#D4AF37] py-4 font-semibold text-black transition hover:scale-105">
              View Collection
            </button>

          </div>

        </div>

      </div>

      <div className="absolute bottom-0 left-0 h-44 w-full bg-gradient-to-t from-black to-transparent" />

    </section>
  );
}