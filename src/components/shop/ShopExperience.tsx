"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCart } from "@/context/CartContext";
import { useSearch } from "@/context/SearchContext";

import SearchBar from "@/components/shop/SearchBar";
import CategoryFilter from "@/components/shop/CategoryFilter";
import SortProducts from "@/components/shop/SortProducts";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: { id: string; name: string; slug: string };
  variants: Array<{
    id: string;
    size: string;
    color: string;
    price: number;
    stock: number;
  }>;
};

type Category = { id: string; name: string; slug: string };

export default function ShopExperience({
  initialProducts,
  categories,
  initialCategory,
}: {
  initialProducts: Product[];
  categories: Category[];
  initialCategory: string;
}) {
  const { addToCart } = useCart();
  const { search } = useSearch();
  const router = useRouter();
  const [sort, setSort] = useState("default");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const result = initialProducts.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()),
    );

    if (sort === "low") result.sort((a, b) => a.price - b.price);
    if (sort === "high") result.sort((a, b) => b.price - a.price);
    if (sort === "az") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [initialProducts, search, sort]);

  function selectCategory(value: string) {
    const href = value === "All"
      ? "/shop"
      : `/shop?category=${encodeURIComponent(value)}`;
    startTransition(() => router.push(href, { scroll: false }));
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-8 py-24">
        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Luxury Collection
        </p>
        <h1 className="mt-5 font-serif text-6xl">Shop</h1>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <SearchBar />
          <SortProducts sort={sort} setSort={setSort} />
        </div>

        <CategoryFilter
          category={initialCategory}
          setCategory={selectCategory}
          categories={categories}
        />

        <div
          aria-busy={isPending}
          className="grid gap-8 md:grid-cols-2 xl:grid-cols-4"
        >
          {filtered.map((product) => (
            <div
              key={product.id}
              className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#222] bg-[#090909]"
            >
              <Link
                href={`/product/${product.id}`}
                className="flex flex-1 flex-col"
              >
                <div className="relative h-80">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#111] text-sm text-gray-500">
                      Image coming soon
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-serif text-2xl">{product.name}</h2>
                  <p className="mt-2 text-sm text-gray-400">
                    {product.category.name}
                  </p>
                  <p className="mt-4 text-[#D4AF37]">
                    KSh {product.price.toLocaleString()}
                  </p>
                </div>
              </Link>

              <button
                disabled={!product.variants.some((variant) => variant.stock > 0)}
                onClick={() => {
                  const variant = product.variants.find((item) => item.stock > 0);
                  if (variant) void addToCart(variant.id, 1);
                }}
                className="mt-auto w-full border-t border-[#222] bg-black px-6 py-4 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-[#D4AF37] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {product.variants.some((variant) => variant.stock > 0)
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-16 rounded-3xl border border-[#222] bg-[#090909] p-10 text-center">
            <p className="text-gray-400">No products match your filters.</p>
          </div>
        )}
      </div>
    </main>
  );
}
