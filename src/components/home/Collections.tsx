"use client";

import type { SiteContent } from "@/lib/site-content";
import Image from "next/image";
import Link from "next/link";

export default function Collections({ content }: { content: SiteContent }) {
  const collections = [
    { title: content.menTitle, image: content.menImage, href: "/shop?category=men" },
    { title: content.womenTitle, image: content.womenImage, href: "/shop?category=women" },
    { title: content.accessoriesTitle, image: content.accessoriesImage, href: "/shop?category=accessories" },
  ];
  return (
    <section className="bg-black py-28">

      <div className="mx-auto max-w-7xl px-8">

        <div className="mb-16 flex items-end justify-between">

          <div>

            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
              {content.collectionsEyebrow}
            </p>

            <h2 className="mt-4 font-serif text-5xl text-white">
              {content.collectionsTitle}
            </h2>

          </div>

          <Link
            href="/shop"
            className="hidden md:block border border-[#D4AF37] px-6 py-3 uppercase tracking-[0.25em] text-xs text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
          >
            {content.collectionsButton}
          </Link>

        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {collections.map((item) => (

            <Link
              key={item.title}
              href={item.href}
              className="group relative h-[560px] overflow-hidden rounded-3xl"
            >

              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              <div className="absolute bottom-10 left-10">

                <h3 className="font-serif text-4xl text-white">
                  {item.title}
                </h3>

                <span className="mt-4 inline-block border border-[#D4AF37] px-5 py-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37] transition group-hover:bg-[#D4AF37] group-hover:text-black">
                  {content.collectionsShopButton}
                </span>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </section>
  );
}