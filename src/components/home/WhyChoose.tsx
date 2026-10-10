"use client";

import type { SiteContent } from "@/lib/site-content";
import { ShieldCheck, Truck, Sparkles, Award } from "lucide-react";

const icons = [ShieldCheck, Truck, Sparkles, Award];

export default function WhyChoose({ content }: { content: SiteContent }) {
  const items = icons.map((icon, index) => ({
    icon,
    title: content[`benefit${["One", "Two", "Three", "Four"][index]}Title`],
    text: content[`benefit${["One", "Two", "Three", "Four"][index]}Text`],
  }));
  return (
    <section className="bg-black py-28">

      <div className="mx-auto max-w-7xl px-8">

        <div className="mb-16 text-center">

          <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
            {content.benefitsEyebrow}
          </p>

          <h2 className="mt-4 font-serif text-5xl text-white">
            {content.benefitsTitle}
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