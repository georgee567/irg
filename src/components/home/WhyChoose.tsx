"use client";

import { ShieldCheck, Truck, Sparkles, Award } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Premium Quality",
    text: "Luxury fabrics with premium finishing.",
  },
  {
    icon: Truck,
    title: "Worldwide Shipping",
    text: "Fast global delivery.",
  },
  {
    icon: Sparkles,
    title: "Exclusive Designs",
    text: "Limited edition collections.",
  },
  {
    icon: Award,
    title: "Luxury Standard",
    text: "Designed for timeless elegance.",
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-black py-28">

      <div className="mx-auto max-w-7xl px-8">

        <div className="mb-16 text-center">

          <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
            Why IRG
          </p>

          <h2 className="mt-4 font-serif text-5xl text-white">
            Crafted For Excellence
          </h2>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-[#222] bg-[#090909] p-10"
            >

              <item.icon
                size={42}
                className="text-[#D4AF37]"
              />

              <h3 className="mt-8 font-serif text-2xl text-white">
                {item.title}
              </h3>

              <p className="mt-4 leading-7 text-gray-400">
                {item.text}
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}