"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/context/CartContext";
import { useSearch } from "@/context/SearchContext";

import SearchBar from "@/components/shop/SearchBar";
import CategoryFilter from "@/components/shop/CategoryFilter";
import SortProducts from "@/components/shop/SortProducts";

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  price: number;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: {
    id: string;
    name: string;
  };
  variants: ProductVariant[];
}

export default function ShopPage() {
  const { addToCart } = useCart();
  const { search } = useSearch();

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/products", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const data = await response.json();
        setProducts(data.products ?? []);
      } catch (err) {
        console.error("Load products error:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filtered = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category.name === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "low") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (sort === "az") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-7xl px-8 py-24">
          <div className="rounded-3xl border border-red-500 bg-red-500/10 p-10">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-7xl px-8 py-24">
          <p>Loading products...</p>
        </div>
      </main>
    );
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

          <SortProducts
            sort={sort}
            setSort={setSort}
          />
        </div>

        <CategoryFilter
          category={category}
          setCategory={setCategory}
        />

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#222] bg-[#090909]"
            >
              <Link href={`/product/${product.id}`} className="flex flex-1 flex-col">
                <div className="relative h-80">
                  <Image
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-300 hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-2xl">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    {product.category.name}
                  </p>
                  <p className="mt-4 text-[#D4AF37]">
                    KSh {product.price.toLocaleString()}
                  </p>
                </div>
              </Link>

              <button
                onClick={() => {
                  if (product.variants.length > 0) {
                    addToCart(
                      product.variants[0].id,
                      1
                    );
                  }
                }}
                className="mt-auto w-full border-t border-[#222] bg-black px-6 py-4 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-[#D4AF37] hover:text-black"
              >
                Add to Cart
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