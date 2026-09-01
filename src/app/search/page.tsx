"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useSearch } from "@/context/SearchContext";
import { useCart } from "@/context/CartContext";

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  price: string | number;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  images: string[];
  category: {
    id: string;
    name: string;
  };
  variants: ProductVariant[];
}

export default function SearchPage() {
  const { search } = useSearch();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const response = await fetch("/api/products", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const data = await response.json();
        setProducts(data.products ?? []);
      } catch (error) {
        console.error("Load products error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Filter products based on search query
  useEffect(() => {
    if (!search.trim()) {
      setFilteredProducts([]);
      return;
    }

    const query = search.toLowerCase().trim();
    const results = products.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesDescription = product.description.toLowerCase().includes(query);
      const matchesCategory = product.category.name.toLowerCase().includes(query);

      return matchesName || matchesDescription || matchesCategory;
    });

    setFilteredProducts(results);
  }, [search, products]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-8 py-24">
        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Search
        </p>

        <h1 className="mt-5 font-serif text-6xl">
          {search.trim() ? `Results for "${search}"` : "Search Results"}
        </h1>

        {search.trim() === "" ? (
          <div className="mt-16 rounded-3xl border border-[#222] bg-[#090909] p-10">
            <p className="text-lg text-gray-400">
              Enter a search term to find products.
            </p>
          </div>
        ) : loading ? (
          <div className="mt-16 rounded-3xl border border-[#222] bg-[#090909] p-10">
            <p className="text-lg text-gray-400">Loading...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-[#222] bg-[#090909] p-10">
            <p className="text-lg text-gray-400">
              No products found matching your search.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-8 text-sm text-gray-400">
              Found {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            </p>

            <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {filteredProducts.map((product) => {
                const variant = product.variants.find(
                  (item) => item.stock > 0
                );

                return (
                  <div
                    key={product.id}
                    className="overflow-hidden rounded-3xl border border-[#222] bg-[#090909]"
                  >
                    <Link href={`/product/${product.id}`}>
                      <div className="relative h-80">
                        <Image
                          src={product.images?.[0] ?? "/images/products/jacket-01.jpg"}
                          alt={product.name}
                          fill
                          className="object-cover transition duration-700 hover:scale-110"
                        />
                      </div>
                    </Link>

                    <div className="p-6">
                      <h2 className="font-serif text-2xl">
                        {product.name}
                      </h2>

                      <p className="mt-2 text-sm text-gray-400">
                        {product.category.name}
                      </p>

                      <p className="mt-4 text-[#D4AF37]">
                        KSh {Number(product.price).toLocaleString()}
                      </p>

                      <button
                        disabled={!variant}
                        onClick={async () => {
                          if (!variant) return;

                          try {
                            await addToCart(variant.id, 1);
                          } catch (error) {
                            console.error("Add to cart error:", error);
                          }
                        }}
                        className="mt-4 w-full rounded-md border border-[#D4AF37] py-3 uppercase tracking-[0.25em] text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {variant ? "Add To Cart" : "Out Of Stock"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}