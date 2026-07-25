"use client";

import ProductGrid from "@/components/shop/ProductGrid";

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto max-w-7xl px-8 py-20">

        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Luxury Collection
        </p>

        <h1 className="mt-4 font-serif text-6xl">
          Shop
        </h1>

        <div className="mt-16">
          <ProductGrid />
        </div>

      </div>

    </main>
  );
}