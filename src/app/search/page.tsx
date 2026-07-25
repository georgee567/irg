"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { products } from "@/data/products";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return products;

    return products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-7xl px-8 py-20">

        <h1 className="font-serif text-6xl">
          Search
        </h1>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="mt-10 w-full rounded-xl border border-[#222] bg-[#090909] p-5 outline-none focus:border-[#D4AF37]"
        />

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {filtered.map((product) => (

            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="overflow-hidden rounded-3xl border border-[#222]"
            >

              <div className="relative h-[320px]">

                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />

              </div>

              <div className="p-5">

                <h2 className="font-serif text-2xl">
                  {product.name}
                </h2>

                <p className="mt-3 text-[#D4AF37]">
                  KSh {product.price.toLocaleString()}
                </p>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </main>
  );
}